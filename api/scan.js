export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const authToken = (req.headers.get('Authorization') || '').replace('Bearer ', '').trim();
  const userId    = (req.headers.get('X-User-Id') || '').trim();

  let quotaData = null;
  if (authToken && userId) {
    const check = await checkQuota(authToken, userId);
    if (!check.allowed) return json({ error: 'quota_exceeded' }, 402);
    quotaData = check.quotaData;
  }

  const incomingForm = await req.formData();
  const media  = incomingForm.get('media');
  const imgUrl = incomingForm.get('url');

  if (!media && !imgUrl) {
    return json({ error: 'No image provided' }, 400);
  }

  let mediaBuffer = null;
  let mediaType   = 'image/jpeg';
  if (media) {
    mediaBuffer = await media.arrayBuffer();
    mediaType   = media.type || 'image/jpeg';
  }

  // Run Sightengine and Claude in parallel — each with a 9s timeout
  const [sgData, claudeResult] = await Promise.all([
    runSightengine(mediaBuffer, mediaType, imgUrl),
    getClaudeAnalysis(mediaBuffer, mediaType, imgUrl).catch(() => null),
  ]);

  const sgOk    = sgData.status !== 'failure';
  const sgScore = sgOk ? (sgData.type?.ai_generated ?? 0) : null;

  let visual    = null;
  let technical = null;
  let generator = null;

  // If Sightengine failed (e.g. binary upload not supported), Claude is the sole signal
  let finalScore;
  if (sgOk) {
    technical  = Math.round(sgScore * 100);
    finalScore = sgScore;
    if (claudeResult) {
      visual    = claudeResult.visual_style;
      generator = claudeResult.generator;
      if (sgScore <= 0.10) {
        if (claudeResult.ai_probability >= 70) {
          finalScore = claudeResult.ai_probability / 100 * 0.9;
        } else {
          finalScore = (sgScore + claudeResult.ai_probability / 100) / 2;
        }
      }
    }
  } else if (claudeResult) {
    technical  = claudeResult.technical_fingerprint;
    visual     = claudeResult.visual_style;
    generator  = claudeResult.generator;
    finalScore = (technical + visual) / 200;
  } else {
    return json({ error: 'Analysis failed' }, 502);
  }

  let type;
  if      (finalScore >= 0.70) type = 'ai';
  else if (finalScore >= 0.35) type = 'suspicious';
  else                         type = 'human';

  const displayScore = type === 'human'
    ? Math.round((1 - finalScore) * 100)
    : Math.round(finalScore * 100);

  // Deduct quota only after a successful result — no stolen points on timeout
  if (authToken && userId) {
    await deductQuotaRow(authToken, userId, quotaData);
  }

  return json({
    type,
    score:        displayScore,
    ai_generated: finalScore,
    technical,
    visual,
    generator,
  });
}

async function runSightengine(mediaBuffer, mediaType, imgUrl) {
  const sgForm = new FormData();
  sgForm.append('models', 'genai');
  sgForm.append('api_user',   process.env.SIGHTENGINE_USER);
  sgForm.append('api_secret', process.env.SIGHTENGINE_SECRET);

  if (mediaBuffer) sgForm.append('media', new Blob([mediaBuffer], { type: mediaType }), 'image');
  else             sgForm.append('url', imgUrl);

  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 9000);
  try {
    const res  = await fetch('https://api.sightengine.com/1.0/check.json', { method: 'POST', body: sgForm, signal: ctrl.signal });
    const data = await res.json();
    clearTimeout(timer);
    return data;
  } catch (_) {
    clearTimeout(timer);
    return { status: 'failure', error: { message: 'Sightengine timeout' } };
  }
}

async function getClaudeAnalysis(mediaBuffer, mediaType, imgUrl) {
  let imageSource;
  if (mediaBuffer) {
    const bytes = new Uint8Array(mediaBuffer);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    imageSource = { type: 'base64', media_type: mediaType, data: btoa(binary) };
  } else {
    imageSource = { type: 'url', url: imgUrl };
  }

  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 9000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key':         process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type':      'application/json',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 150,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: imageSource },
            { type: 'text', text: 'Is this image AI-generated or a real photograph? Reply ONLY with valid JSON, nothing else: {"ai_probability":<integer 0-100>,"technical_fingerprint":<integer 0-100>,"visual_style":<integer 0-100>,"generator":"<midjourney|dalle|stable_diffusion|flux|firefly|ideogram|gpt4o|null>"} where ai_probability=overall 0=real 100=AI, technical_fingerprint=pixel artifacts/unnatural frequency patterns/geometric perfection 0-100, visual_style=aesthetic AI patterns/lighting/texture/smoothness 0-100, generator=most likely AI source or null.' }
          ]
        }]
      }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);

    const data = await res.json();
    const text = data.content?.[0]?.text ?? '';
    const parsed              = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? '{}');
    const clamp               = (v, fb) => Math.min(100, Math.max(0, parseInt(v) || fb));
    const ai_probability      = clamp(parsed.ai_probability, 50);
    const technical_fingerprint = clamp(parsed.technical_fingerprint, ai_probability);
    const visual_style        = clamp(parsed.visual_style, ai_probability);
    const allowed             = ['midjourney','dalle','stable_diffusion','flux','firefly','ideogram','gpt4o'];
    const generator           = allowed.includes(parsed.generator) ? parsed.generator : null;
    return { ai_probability, technical_fingerprint, visual_style, generator };
  } catch (_) {
    clearTimeout(timer);
    return { ai_probability: 50, generator: null };
  }
}

async function checkQuota(token, userId) {
  const base = 'https://tjzjwyjggmrcmwawrtpm.supabase.co/rest/v1';
  const h = {
    'apikey':        'sb_publishable_E0cyz5LQVlBvKsg9lzDkrg_XtTVdfEH',
    'Authorization': `Bearer ${token}`,
    'Content-Type':  'application/json',
  };
  try {
    const rows = await (await fetch(
      `${base}/scan_quota?user_id=eq.${userId}&select=scans_remaining,credits_remaining,subscription_status,monthly_scans_used,reset_at`,
      { headers: h }
    )).json();
    if (!Array.isArray(rows) || !rows.length) return { allowed: false, quotaData: null };
    const d         = rows[0];
    const now       = new Date();
    const expired   = d.reset_at && new Date(d.reset_at) < now;
    const subStatus = (d.subscription_status || '').trim().toLowerCase();

    if (subStatus === 'active' || subStatus === 'trialing' || subStatus === 'canceling') {
      if ((d.monthly_scans_used || 0) >= 5000) return { allowed: false, quotaData: null };
      return { allowed: true, quotaData: { ...d, _mode: 'subscription' } };
    } else if ((d.credits_remaining || 0) > 0) {
      return { allowed: true, quotaData: { ...d, _mode: 'credits' } };
    } else if (expired) {
      return { allowed: true, quotaData: { ...d, _mode: 'reset', _now: now.toISOString() } };
    } else if ((d.scans_remaining || 0) > 0) {
      return { allowed: true, quotaData: { ...d, _mode: 'free' } };
    } else {
      return { allowed: false, quotaData: null };
    }
  } catch (_) {
    return { allowed: true, quotaData: null }; // fail open on DB/network errors
  }
}

async function deductQuotaRow(token, userId, quotaData) {
  if (!quotaData) return;
  const base = 'https://tjzjwyjggmrcmwawrtpm.supabase.co/rest/v1';
  const h = {
    'apikey':        'sb_publishable_E0cyz5LQVlBvKsg9lzDkrg_XtTVdfEH',
    'Authorization': `Bearer ${token}`,
    'Content-Type':  'application/json',
    'Prefer':        'return=minimal',
  };
  const { _mode, _now, ...d } = quotaData;
  let patch;
  if (_mode === 'subscription') {
    patch = { monthly_scans_used: (d.monthly_scans_used || 0) + 1 };
  } else if (_mode === 'credits') {
    patch = { credits_remaining: d.credits_remaining - 1 };
  } else if (_mode === 'reset') {
    const now = _now ? new Date(_now) : new Date();
    const nextReset = new Date(now);
    nextReset.setUTCDate(nextReset.getUTCDate() + 1);
    nextReset.setUTCHours(0, 0, 0, 0);
    patch = { scans_remaining: 9, reset_at: nextReset.toISOString() };
  } else if (_mode === 'free') {
    patch = { scans_remaining: d.scans_remaining - 1 };
  }
  if (!patch) return;
  try {
    await fetch(`${base}/scan_quota?user_id=eq.${userId}`,
      { method: 'PATCH', headers: h, body: JSON.stringify(patch) });
  } catch (_) {}
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id',
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}
