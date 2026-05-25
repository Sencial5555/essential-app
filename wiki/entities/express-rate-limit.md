---
type: entity
name: "express-rate-limit"
entity_type: product
tags: [nodejs, security, middleware]
sources: ["The Essential Project"]
---

## Overview
`express-rate-limit` is a Node.js middleware library for rate-limiting HTTP endpoints. In Essential it is applied to the image upload endpoint to prevent bots from spamming the detection API and draining API credit balance.

## Key Facts
- Applied to: image upload endpoint (the highest-cost operation)
- Purpose: prevent automated abuse, protect Sightengine/Hive API credit

## Related
- [[Essential]]
- [[Sightengine]]
- [[Hive Moderation]]
