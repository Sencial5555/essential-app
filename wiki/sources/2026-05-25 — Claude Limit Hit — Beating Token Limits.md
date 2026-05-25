---
type: source
title: "Claude Limit Hit — Beating Token Limits"
date_ingested: 2026-05-25
source_type: note
url:
tags: [claude, token-limits, workflow, strategy]
---

## Summary
Explains why Claude hits limits fast (context trap: every message re-reads all history) and four strategies to work around it. Includes a realistic 4-session weekend timeline for building Essential.

## Key Points
- Context trap: Message #30 in a thread forces Claude to re-read ~25,000 words, burning the 5-hour limit in 2–3 prompts.
- Strategy 1 — Claude Projects: pin CLAUDE.md and files; Anthropic's prompt caching freezes them in memory at fraction of normal cost.
- Strategy 2 — Fresh Chat Rule: once code works, start a new chat; paste working code + "now let's add the next feature."
- Strategy 3 — Bulk debugging: batch all errors into one detailed prompt instead of one message per error.
- Strategy 4 — Usage Credits: load $10–$20 onto account to seamlessly continue past subscription limit.
- Weekend timeline: Friday night (30min, landing page) → Saturday morning (1hr, backend) → Saturday afternoon (1hr, Stripe) → Sunday (1–2hr, test + deploy).

## Entities Mentioned
- [[Claude Code]] — terminal tool, separate from browser chat

## Concepts Mentioned
- [[Claude Token Limits]] — the core problem
- [[Prompt Caching]] — mechanism behind Projects feature
- [[Fresh Chat Rule]] — key workflow habit
- [[Build Phases]] — weekend timeline

## My Notes
