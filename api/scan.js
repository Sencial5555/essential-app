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
  sgForm.append('models', 'type');
  sgForm.append('api_user',   process.env.SIGHTENGINE_USER);
  sgForm.append('api_secret', process.env.SIGHTENGINE_SECRET);

  if (media)  sgForm.append('media', media);
  else        sgForm.append('url', imgUrl);

  const sgRes  = await fetch('https://api.sightengine.com/1.0/check.json', { method: 'POST', body: sgForm });
  const sgData = await sgRes.json();

  if (sgData.status === 'failure') {
    return json({ error: sgData.error?.message || 'Sightengine error' }, 502);
  }

  const aiScore = sgData.type?.ai_generated ?? 0;

  let type;
  if      (aiScore >= 0.70) type = 'ai';
  else if (aiScore >= 0.35) type = 'suspicious';
  else                      type = 'human';

  const displayScore = type === 'human'
    ? Math.round((1 - aiScore) * 100)
    : Math.round(aiScore * 100);

  return json({ type, score: displayScore, ai_generated: aiScore });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
