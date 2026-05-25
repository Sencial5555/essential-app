---
type: concept
name: "Monetization Models"
tags: [monetization, pricing, revenue, saas, credits, subscription]
sources: ["Monetization", "Interface of the Website", "Huge Dream", "Direct Step-by-Step"]
---

## Definition
The two possible payment structures for Essential, plus the cost model they must cover.

## The API Cost Trap
Every scan costs ~$0.003 in API fees. Unlimited free use is impossible. This constraint shapes every monetization decision. See [[API Cost Trap]].

## Model 1: Token / Credit System (Recommended)
- 3 free scans on signup
- Credit packs: $4.99 for 100 scans
- Directly matches costs — if they don't pay, they can't burn the API budget
- Profit per pack: $4.99 revenue − $0.55 payment fee − $0.20 API cost = **$4.24 net**

## Model 2: Subscription
- Weekly: ~$2.99/week for 500 scans/month
- Monthly: ~$9.99/month for 500 scans/month
- Mobile users respond well to weekly micro-subscriptions
- Provides predictable recurring revenue

## Sightengine Pricing Reference
| Plan | Monthly Cost | Included Scans | Overage |
|------|-------------|----------------|---------|
| Free | $0 | 2,000 | None (stops) |
| Starter | $29 | 10,000 | $0.0020/scan |
| Growth | $99 | 40,000 | $0.0020/scan |

## Payment Platforms
- [[Stripe]]: industry standard; webhooks trigger database credit updates
- [[Lemon Squeezy]]: alternative; merchant-of-record model (handles global VAT)

## Tensions & Contradictions
- Source "Interface of Website" uses subscription framing (500 scans/month); source "Monetization" recommends credit system as primary. Both may coexist as pricing tiers.

## Related
- [[API Cost Trap]]
- [[Scale Economics]]
- [[Hook First Lock Second]]
- [[Stripe]]
- [[Lemon Squeezy]]
- [[Essential]]
