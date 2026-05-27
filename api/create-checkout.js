export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const { plan, userId, userEmail } = await req.json();
  if (!plan || !userId) return json({ error: 'Missing params' }, 400);
  if (!['credits', 'monthly'].includes(plan)) return json({ error: 'Invalid plan' }, 400);

  const priceId = plan === 'credits'
    ? process.env.STRIPE_CREDITS_PRICE_ID
    : process.env.STRIPE_MONTHLY_PRICE_ID;

  const origin = 'https://essentialai-app.vercel.app';
  const mode   = plan === 'credits' ? 'payment' : 'subscription';

  const params = new URLSearchParams({
    mode,
    'line_items[0][price]':    priceId,
    'line_items[0][quantity]': '1',
    'success_url': `${origin}/?payment=success&plan=${plan}`,
    'cancel_url':  `${origin}/?payment=cancelled`,
    'metadata[user_id]': userId,
    'metadata[plan]':    plan,
  });

  if (userEmail) params.set('customer_email', userEmail);

  if (mode === 'subscription') {
    params.set('subscription_data[metadata][user_id]', userId);
    params.set('subscription_data[metadata][plan]', 'monthly');
  }

  const sgRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization':  `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type':   'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const session = await sgRes.json();
  if (!sgRes.ok) return json({ error: session.error?.message || 'Stripe error' }, 502);

  return json({ url: session.url });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
