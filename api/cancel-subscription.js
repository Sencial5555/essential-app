export const config = { runtime: 'edge' };

const SB_URL = 'https://tjzjwyjggmrcmwawrtpm.supabase.co/rest/v1';

export default async function handler(req) {
  if (req.method === 'OPTIONS') return cors(null, 204);
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const authToken = (req.headers.get('Authorization') || '').replace('Bearer ', '').trim();
  const userId    = (req.headers.get('X-User-Id') || '').trim();
  if (!authToken || !userId) return json({ error: 'Unauthorized' }, 401);

  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const sbHeaders = {
    'apikey':        svcKey,
    'Authorization': `Bearer ${svcKey}`,
    'Content-Type':  'application/json',
    'Prefer':        'return=minimal',
  };

  // Look up subscription_id using the user's own token so RLS restricts
  // the row to the authenticated user — prevents canceling another user's sub
  const sbRes = await fetch(
    `${SB_URL}/scan_quota?user_id=eq.${userId}&select=subscription_id,subscription_status`,
    { headers: {
        'apikey':        'sb_publishable_E0cyz5LQVlBvKsg9lzDkrg_XtTVdfEH',
        'Authorization': `Bearer ${authToken}`,
        'Content-Type':  'application/json',
    }}
  );
  const rows = await sbRes.json();
  const row  = Array.isArray(rows) ? rows[0] : null;

  if (!row?.subscription_id) return json({ error: 'No active subscription found' }, 404);
  if (row.subscription_status !== 'active') return json({ error: 'Subscription is not active' }, 400);

  // Cancel at period end — user keeps access until billing period ends
  const stripeRes = await fetch(`https://api.stripe.com/v1/subscriptions/${row.subscription_id}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type':  'application/x-www-form-urlencoded',
    },
    body: 'cancel_at_period_end=true',
  });

  if (!stripeRes.ok) {
    const err = await stripeRes.json();
    return json({ error: err.error?.message || 'Stripe error' }, 502);
  }

  // Immediately reflect the pending cancellation in Supabase
  await fetch(`${SB_URL}/scan_quota?user_id=eq.${userId}`, {
    method:  'PATCH',
    headers: sbHeaders,
    body:    JSON.stringify({ subscription_status: 'canceling' }),
  });

  return json({ ok: true });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type':                'application/json',
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id',
    },
  });
}

function cors(data, status = 204) {
  return new Response(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id',
    },
  });
}
