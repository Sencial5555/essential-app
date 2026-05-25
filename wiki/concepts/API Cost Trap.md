---
type: concept
name: "API Cost Trap"
tags: [finance, risk, api, cost-control, security]
sources: ["Monetization", "Motivation", "Huge Dream"]
---

## Definition
The financial risk where a single user (or bot) can make unlimited API calls, draining the API credit balance without paying. Every scan costs real money; unlimited free use is not viable.

## The Risk
- [[Sightengine]] charges ~$0.003 per scan
- One user uploading 1,000 images = $3.00 in costs
- Bot spamming the endpoint = rapid credit drain and unexpected bills

## Mitigations Built Into Essential
1. **[[express-rate-limit]]**: blocks more than 5 API requests/day per unauthenticated user ID at the backend — request never reaches Sightengine
2. **Authentication gate**: after 3 free scans, login required — reduces anonymous abuse surface
3. **Subscription/credit check**: backend validates user has credits before making API call
4. **Sightengine dashboard**: real-time spend tracking in developer dashboard

## Cost Control Backend Prompt
"Add a hard limit to the backend code. No single user ID is allowed to make more than 5 API requests per day unless their database profile shows they have purchased premium credits. If they hit the limit, stop the API call entirely and send back a 'Limit Reached' message."

## Related
- [[Monetization Models]]
- [[Scale Economics]]
- [[express-rate-limit]]
- [[Hook First Lock Second]]
