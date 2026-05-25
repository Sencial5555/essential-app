---
type: entity
name: "Stripe"
entity_type: product
tags: [payments, subscriptions, saas]
sources: ["The Essential Project"]
---

## Overview
Stripe is the payment and subscription platform for Essential. It handles checkout flows, monthly quota enforcement, and webhook-based subscription validation.

## Key Facts
- Integration: Stripe Checkout subscription engine
- Backend validates subscription state via Stripe webhooks
- Quota enforcement: if user exhausts monthly scan limit, Stripe paywall is triggered
- Secrets (webhook secret, API key) must come from `process.env` only — never hardcoded

## Related
- [[Essential]]
- [[Hook First Lock Second]]
