---
type: entity
name: "Essential"
entity_type: product
tags: [web-app, ai-detection, saas, mobile-first]
sources: ["The Essential Project"]
---

## Overview
Essential is a premium, mobile-first web application designed to help users detect AI-generated images. Its design philosophy ("Calm Design") emphasizes absolute minimalism, extreme speed, and zero clutter. Tagline: "Essential. For everyday use."

## Key Facts
- Single-page app: HTML5 + Tailwind CSS + vanilla JavaScript, dark mode by default with global light mode toggle
- Backend: Node.js (Express) acting as a secure API bridge to third-party detection APIs
- Deployed on [[Vercel]], versioned via [[GitHub]]
- Detection powered by [[Sightengine]] or [[Hive Moderation]] (endpoints: Image/Frame detection)
- Monetization via [[Stripe]] Checkout subscription engine with backend webhook validation
- First scan is free and anonymous; subsequent scans require login + subscription

## UI Signature Elements
- Centered dashed drop-zone (`border-dashed`, `rounded-2xl`) for uploads or camera roll access
- Neon laser scanning animation while awaiting API response
- [[Traffic-Light Results]]: Soft Green (human/safe), Amber (suspicious), Deep Crimson (AI-generated)
- Transparent quota progress bar (e.g. "3 of 3 free scans remaining")

## Auth & Paywall
- See [[Hook First Lock Second]] for full strategy
- Social login only: Google or Apple One-Tap biometrics; passwords strictly prohibited

## Security
- `[[express-rate-limit]]` on image upload endpoint to prevent bot abuse
- All API keys and secrets read from `process.env` — never hardcoded

## Related
- [[Calm Design]]
- [[Hook First Lock Second]]
- [[AI Image Detection]]
- [[Sightengine]]
- [[Hive Moderation]]
- [[Stripe]]
- [[Vercel]]
