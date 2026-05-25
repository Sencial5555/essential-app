---
type: concept
name: "Hook First Lock Second"
tags: [growth, monetization, ux, auth, paywall]
sources: ["The Essential Project"]
---

## Definition
A product strategy where users experience the core value proposition before being asked to authenticate or pay. In [[Essential]]: one free anonymous scan → blurred results with social login overlay → subscription gate for further use.

## Why It Matters
Reduces top-of-funnel friction. Users who have already seen a result (even blurred) are more motivated to complete signup than users who hit a wall before experiencing anything. The blur mechanic specifically creates curiosity/desire before the ask.

## Evidence & Examples
- Step 1: Anonymous visitor uploads image, scan runs normally against the detection API
- Step 2: Results are rendered but blurred; a modal prompts Google or Apple One-Tap login (no passwords)
- Step 3: After login, if monthly quota is exhausted, [[Stripe]] paywall is triggered

## Tensions & Contradictions
- Running the detection API call before the user is authenticated means one free API call is spent per anonymous visitor, even if they never convert. This is an intentional cost accepted for the UX benefit.

## Related
- [[Essential]]
- [[Stripe]]
- [[Calm Design]]
