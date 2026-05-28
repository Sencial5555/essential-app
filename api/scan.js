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
  if (authToken && userId) {
    const allowed = await enforceQuota(authToken, userId);
    if (!allowed) return json({ error: 'quota_exceeded' }, 402);
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

  const sgForm = new FormData();
  sgForm.append('models', 'genai');
  sgForm.append('api_user',   process.env.SIGHTENGINE_USER);
  sgForm.append('api_secret', process.env.SIGHTENGINE_SECRET);

  if (mediaBuffer) sgForm.append('media', new Blob([mediaBuffer], { type: mediaType }), 'image');
  else             sgForm.append('url', imgUrl);

  const sgRes  = await fetch('https://api.sightengine.com/1.0/check.json', { method: 'POST', body: sgForm });
  const sgData = await sgRes.json();

  if (sgData.status === 'failure') {
    return json({ error: sgData.error?.message || 'Sightengine error' }, 502);
  }

  const sgScore = sgData.type?.ai_generated ?? 0;

  // Always call Claude for visual assessment.
  // Blend its score into the final only for borderline-human cases (Sightengine ≤10% AI).
  let finalScore = sgScore;
  let visual     = null;
  let generator  = null;
  let location   = null;
  try {
    const claudeResult = await getClaudeAnalysis(mediaBuffer, mediaType, imgUrl);
    visual    = claudeResult.ai_probability;
    generator = claudeResult.generator;
    location  = claudeResult.location;
    if (sgScore <= 0.10) {
      if (claudeResult.ai_probability >= 70) {
        // Claude strongly disagrees with Sightengine — trust it (slight discount for single-source)
        finalScore = claudeResult.ai_probability / 100 * 0.9;
      } else {
        finalScore = (sgScore + claudeResult.ai_probability / 100) / 2;
      }
    }
  } catch (_) {}

  let type;
  if      (finalScore >= 0.70) type = 'ai';
  else if (finalScore >= 0.35) type = 'suspicious';
  else                         type = 'human';

  const displayScore = type === 'human'
    ? Math.round((1 - finalScore) * 100)
    : Math.round(finalScore * 100);

  return json({
    type,
    score:       displayScore,
    ai_generated: finalScore,
    technical:   Math.round(sgScore * 100),
    visual,
    generator,
    location:    type !== 'ai' ? location : null,
  });
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

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':         process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type':      'application/json',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 120,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: imageSource },
          { type: 'text', text: 'Is this image AI-generated or a real photograph? Reply ONLY with valid JSON, nothing else: {"ai_probability":<integer 0-100>,"generator":"<midjourney|dalle|stable_diffusion|flux|firefly|ideogram|gpt4o|null>","location":"<city and country if real photo and location is clearly identifiable from visual content, otherwise null>"} where ai_probability 0=real photo 100=AI-generated, generator=most likely AI source or null if real/uncertain, location=null if AI-generated or location cannot be confidently determined.' }
        ]
      }]
    })
  });

  const data = await res.json();
  const text = data.content?.[0]?.text ?? '';
  try {
    const parsed      = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? '{}');
    const ai_probability = Math.min(100, Math.max(0, parseInt(parsed.ai_probability) || 50));
    const allowed     = ['midjourney','dalle','stable_diffusion','flux','firefly','ideogram','gpt4o'];
    const generator   = allowed.includes(parsed.generator) ? parsed.generator : null;
    const location    = (typeof parsed.location === 'string' && parsed.location.trim() && parsed.location !== 'null')
                          ? parsed.location.trim() : null;
    return { ai_probability, generator, location };
  } catch (_) {
    return { ai_probability: 50, generator: null };
  }
}

async function enforceQuota(token, userId) {
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
    if (!Array.isArray(rows) || !rows.length) return false;
    const d      = rows[0];
    const now    = new Date();
    const expired = d.reset_at && new Date(d.reset_at) < now;
    const subStatus = (d.subscription_status || '').trim().toLowerCase();

    let patch;
    if (subStatus === 'active' || subStatus === 'trialing') {
      if ((d.monthly_scans_used || 0) >= 5000) return false;
      patch = { monthly_scans_used: (d.monthly_scans_used || 0) + 1 };
    } else if ((d.credits_remaining || 0) > 0) {
      patch = { credits_remaining: d.credits_remaining - 1 };
    } else if (expired) {
      const nextReset = new Date(now);
      nextReset.setUTCDate(nextReset.getUTCDate() + 1);
      nextReset.setUTCHours(0, 0, 0, 0);
      patch = { scans_remaining: 9, reset_at: nextReset.toISOString() };
    } else if ((d.scans_remaining || 0) > 0) {
      patch = { scans_remaining: d.scans_remaining - 1 };
    } else {
      return false;
    }

    await fetch(`${base}/scan_quota?user_id=eq.${userId}`,
      { method: 'PATCH', headers: { ...h, 'Prefer': 'return=minimal' }, body: JSON.stringify(patch) });
    return true;
  } catch (_) {
    return true; // fail open on DB/network errors
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
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
