export const config = { runtime: 'edge' };

const SB_URL = 'https://tjzjwyjggmrcmwawrtpm.supabase.co/rest/v1';

async function verifySignature(rawBody, sigHeader, secret) {
  const parts = {};
  for (const p of sigHeader.split(',')) {
    const i = p.indexOf('=');
    parts[p.slice(0, i)] = p.slice(i + 1);
  }
  const { t, v1 } = parts;
  if (!t || !v1) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;

  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const mac = await crypto.subtle.sign(
    'HMAC', key, new TextEncoder().encode(`${t}.${rawBody}`)
  );
  const hex = Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hex === v1;
}

function sbHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return {
    'apikey':         key,
    'Authorization':  `Bearer ${key}`,
    'Content-Type':   'application/json',
    'Prefer':         'return=minimal',
  };
}

async function patchQuota(userId, updates) {
  await fetch(`${SB_URL}/scan_quota?user_id=eq.${userId}`, {
    method:  'PATCH',
    headers: sbHeaders(),
    body:    JSON.stringify(updates),
  });
}

async function getCredits(userId) {
  const r = await fetch(
    `${SB_URL}/scan_quota?user_id=eq.${userId}&select=credits_remaining`,
    { headers: sbHeaders() }
  );
  const rows = await r.json();
  return rows[0]?.credits_remaining ?? 0;
}

export default async function handler(req) {
  if (req.method !== 'POST') return ok();

  const rawBody  = await req.text();
  const sigHeader = req.headers.get('stripe-signature') || '';

  const valid = await verifySignature(rawBody, sigHeader, process.env.STRIPE_WEBHOOK_SECRET);
  if (!valid) return new Response('Invalid signature', { status: 400 });

  const event = JSON.parse(rawBody);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId  = session.metadata?.user_id;
    const plan    = session.metadata?.plan;
    if (!userId) return ok();

    if (plan === 'credits') {
      const existing = await getCredits(userId);
      await patchQuota(userId, {
        credits_remaining:  existing + 500,
        stripe_customer_id: session.customer,
      });
    } else if (plan === 'monthly') {
      const monthlyResetAt = new Date();
      monthlyResetAt.setMonth(monthlyResetAt.getMonth() + 1);
      await patchQuota(userId, {
        subscription_id:     session.subscription,
        subscription_status: 'active',
        stripe_customer_id:  session.customer,
        monthly_scans_used:  0,
        monthly_reset_at:    monthlyResetAt.toISOString(),
      });
    }
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object;
    const subId   = invoice.subscription;
    if (subId) {
      // Find the user by subscription_id and mark as past_due
      const h = sbHeaders();
      const r = await fetch(`${SB_URL}/scan_quota?subscription_id=eq.${subId}&select=user_id`, { headers: h });
      const rows = await r.json();
      const userId = rows[0]?.user_id;
      if (userId) await patchQuota(userId, { subscription_status: 'past_due' });
    }
  }

  if (event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted') {
    const sub    = event.data.object;
    const userId = sub.metadata?.user_id;
    if (!userId) return ok();

    let newStatus, extra = {};
    if (sub.status === 'active' && sub.cancel_at_period_end) {
      newStatus = 'canceling';
    } else if (sub.status === 'active') {
      newStatus = 'active';
    } else if (sub.status === 'past_due' || sub.status === 'unpaid') {
      newStatus = 'past_due'; // keep subscription_id — payment may recover on retry
    } else {
      newStatus = 'canceled';
      extra = { subscription_id: null };
    }
    await patchQuota(userId, { subscription_status: newStatus, ...extra });
  }

  return ok();
}

function ok() { return new Response('ok', { status: 200 }); }
