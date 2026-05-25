---
type: source
title: "Monetization — Models, Pricing & Cost Control"
date_ingested: 2026-05-25
source_type: note
url:
tags: [monetization, pricing, stripe, lemon-squeezy, api-costs, cost-control]
---

## Summary
Two monetization model options (token/credit vs subscription), Lemon Squeezy vs Stripe comparison, Sightengine pricing table, per-transaction profit math, and a cost-control backend prompt.

## Key Points
- API cost trap: every scan costs ~$0.003; unlimited free use is not viable.
- Model 1 (recommended): Token/Credit system — 3 free scans, then $4.99 for 100 credits. Directly matches costs.
- Model 2: Subscription — $2.99/week or $9.99/month for 500 scans. Mobile users love weekly micro-subscriptions.
- Payment platforms: Lemon Squeezy or Stripe. Both handle card security, Apple/Google Pay, global sales tax.
- Sightengine pricing: Free ($0, 2,000 scans), Starter ($29/mo, 10,000 scans, $0.0020 overage), Growth ($99/mo, 40,000 scans, $0.0020 overage).
- Profit per $4.99 credit pack: revenue $4.99 − payment fee $0.55 − API cost $0.20 = $4.24 net.
- Cost control: backend hard limit — no single user makes more than 5 API calls/day unless they have purchased credits.

## Entities Mentioned
- [[Stripe]] — payment platform option
- [[Lemon Squeezy]] — payment platform option
- [[Sightengine]] — API with detailed pricing table

## Concepts Mentioned
- [[Monetization Models]] — both model options
- [[API Cost Trap]] — why gating is required
- [[Scale Economics]] — profit math

## My Notes
