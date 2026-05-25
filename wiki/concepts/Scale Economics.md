---
type: concept
name: "Scale Economics"
tags: [finance, scale, enterprise, vision, api-costs]
sources: ["Huge Dream — Scale Economics and Vision", "Monetization"]
---

## Definition
The financial model for [[Essential]] at scale: how API costs, user payments, and profit margins evolve from launch through enterprise volume.

## Key Insight
User payments scale in lockstep with API costs. Every credit pack purchase arrives before the API bill, so cash flow is always positive as long as pricing covers costs with margin.

## Profit Math at 1M Scans / Month
| Item | Amount |
|------|--------|
| Revenue (10,000 users × $4.99) | +$49,900 |
| Payment processing fees | −$5,500 |
| Enterprise API cost (1M × $0.001) | −$1,000 |
| **Net profit** | **~$43,400** |

## Scaling Tiers
1. **Free tier**: Sightengine free plan (2,000 scans) — build and test
2. **Starter**: $29/mo (10,000 scans) — first paying users
3. **Growth**: $99/mo (40,000 scans) — scaling
4. **Enterprise**: Custom contract negotiated with API provider; 50%+ volume discounts at millions of scans
5. **Infrastructure**: Migrate to [[AWS Rekognition]] or [[Google Cloud AI]] at household-name scale

## API Overage Behavior
Paid plans don't hard-cap. When limit is hit, API continues at overage rate ($0.0015–$0.0020/scan) — no user disruption.

## Related
- [[Monetization Models]]
- [[API Cost Trap]]
- [[Sightengine]]
- [[AWS Rekognition]]
- [[Google Cloud AI]]
