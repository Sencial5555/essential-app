---
type: concept
name: "Mock API Testing"
tags: [testing, development, api, simulation, cost-saving]
sources: ["Useful Skills — Custom Claude Code Slash Commands"]
---

## Definition
A development practice where a fake backend simulates Sightengine/Hive API responses (returning random AI probability scores) without making real API calls. Enables unlimited frontend testing at zero cost.

## Why It Matters
Every real API call costs money and consumes free-tier quota. During Phase 1 (frontend design), there is no reason to hit the real API — the goal is just getting the UI right. The mock-api skill prevents wasting credits during development.

## How to Activate
Run `/mock-api` in the [[Claude Code]] terminal. Claude writes a temporary backend simulation. Switch to the real API only when the app looks polished and ready for integration testing.

## Related
- [[Custom Slash Commands]]
- [[Claude Code]]
- [[Sightengine]]
- [[API Cost Trap]]
- [[Build Phases]]
