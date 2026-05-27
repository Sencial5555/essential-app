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

  const sgForm = new FormData();
  sgForm.append('models', 'genai');
  sgForm.append('api_user',   process.env.SIGHTENGINE_USER);
  sgForm.append('api_secret', process.env.SIGHTENGINE_SECRET);

  if (media)  sgForm.append('media', media);
  else        sgForm.append('url', imgUrl);

  const sgRes  = await fetch('https://api.sightengine.com/1.0/check.json', { method: 'POST', body: sgForm });
  const sgData = await sgRes.json();

  if (sgData.status === 'failure') {
    return json({ error: sgData.error?.message || 'Sightengine error' }, 502);
  }

  const sgScore = sgData.type?.ai_generated ?? 0;

  // Call Claude as second opinion when Sightengine is very confident (most likely to be wrong)
  let finalScore = sgScore;
  if (sgScore <= 0.20 || sgScore >= 0.80) {
    try {
      const claudeScore = await getClaudeAIScore(media, imgUrl);
      finalScore = (sgScore + claudeScore) / 2;
    } catch (_) {
      // Fall back to Sightengine only if Claude fails
    }
  }

  let type;
  if      (finalScore >= 0.70) type = 'ai';
  else if (finalScore >= 0.35) type = 'suspicious';
  else                         type = 'human';

  const displayScore = type === 'human'
    ? Math.round((1 - finalScore) * 100)
    : Math.round(finalScore * 100);

  let generator = null;
  if (type !== 'human' && sgData.type?.ai_generators) {
    const generators = Object.entries(sgData.type.ai_generators)
      .filter(([, v]) => typeof v === 'number' && v > 0.1)
      .sort(([, a], [, b]) => b - a);
    if (generators.length > 0) generator = generators[0][0];
  }

  return json({ type, score: displayScore, ai_generated: finalScore, generator });
}

async function getClaudeAIScore(media, imgUrl) {
  let imageSource;

  if (media) {
    const buffer = await media.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    imageSource = { type: 'base64', media_type: media.type || 'image/jpeg', data: btoa(binary) };
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
          { type: 'text', text: 'Is this image AI-generated or a real photograph? Reply ONLY with valid JSON, nothing else: {"ai_probability": <integer 0-100>} where 0 = definitely real photo, 100 = definitely AI generated.' }
        ]
      }]
    })
  });

  const data = await res.json();
  const text = data.content?.[0]?.text ?? '';
  const match = text.match(/"ai_probability"\s*:\s*(\d+)/);
  return match ? Math.min(100, Math.max(0, parseInt(match[1]))) / 100 : 0.5;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
