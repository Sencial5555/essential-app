---
type: concept
name: "Build Phases"
tags: [workflow, development, planning, phases]
sources: ["The Order of Operations", "Beginner Step-by-Step", "Direct Step-by-Step", "Basic Phrases", "Claude Limit Hit"]
---

## Definition
The incremental, phase-by-phase approach to building Essential. Each phase has one focus, one tool, and one weekend. Never mix phases in a single session.

## The Three Phases

| Phase | Focus | Tool | When |
|-------|-------|------|------|
| 1 | Visual shell (HTML + Tailwind CSS) | Cursor Composer | First Saturday |
| 2 | Backend engine (Node.js + Sightengine API) | Claude Code `/goal` | Second weekend |
| 3 | Database (Supabase/SQLite — user profiles + quotas) | Claude Code `/goal` | Third weekend |

## Why It Matters
Beginners who try to handle Node.js, databases, and design in the same afternoon break things and hit Claude context limits fast. Phases enforce focus and keep each session cheap and productive.

## Weekend Timeline (with Claude limits strategy)
- Friday night (~30min): landing page
- Saturday morning (~1hr): backend + API connection (fresh chat)
- Saturday afternoon (~1hr): Stripe/Lemon Squeezy integration (fresh chat)
- Sunday (~1–2hr): test on phone + deploy to Vercel

## Related
- [[Claude Token Limits]]
- [[Fresh Chat Rule]]
- [[Cursor]]
- [[Claude Code]]
- [[MVP]]
