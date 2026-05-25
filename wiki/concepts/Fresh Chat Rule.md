---
type: concept
name: "Fresh Chat Rule"
tags: [claude, workflow, token-limits, productivity]
sources: ["Claude Limit Hit — Beating Token Limits"]
---

## Definition
A Claude usage discipline: once a piece of code works correctly, start a brand new chat. Paste the working code and say "this works perfectly, now let's add the next feature." Never ask new questions in old, long threads.

## Why It Works
Long threads force Claude to re-read everything on every message. A thread at message #30 processes ~25,000 words per prompt — burning the daily limit in 2–3 prompts. A fresh chat starts at zero.

## How to Apply
1. Finish Phase 1 (landing page works, looks great)
2. Copy the working HTML file
3. Start a new Claude chat
4. Paste: "This code works perfectly. Now let's write the backend."
5. Repeat at each phase boundary

## When NOT to Use
Inside [[Claude Code]] with the [[Karpathy LLM Wiki]] architecture, Claude doesn't re-read entire codebase — it reads wiki indexes. In that setup, the Fresh Chat Rule is less critical, but still useful for major phase transitions.

## Related
- [[Claude Token Limits]]
- [[Build Phases]]
- [[Prompt Caching]]
