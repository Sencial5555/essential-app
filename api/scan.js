export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
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
  try {
    const claudeResult = await getClaudeAnalysis(mediaBuffer, mediaType, imgUrl);
    visual = claudeResult.ai_probability;
    if (sgScore <= 0.10) {
      finalScore = (sgScore + claudeResult.ai_probability / 100) / 2;
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
      max_tokens: 64,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: imageSource },
          { type: 'text', text: 'Is this image AI-generated or a real photograph? Reply ONLY with valid JSON, nothing else: {"ai_probability":<integer 0-100>} where 0 = definitely real photo, 100 = definitely AI-generated.' }
        ]
      }]
    })
  });

  const data = await res.json();
  const text = data.content?.[0]?.text ?? '';
  const match = text.match(/"ai_probability"\s*:\s*(\d+)/);
  const ai_probability = match ? Math.min(100, Math.max(0, parseInt(match[1]))) : 50;
  return { ai_probability };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
