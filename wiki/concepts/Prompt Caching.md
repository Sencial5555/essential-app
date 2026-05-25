---
type: concept
name: "Prompt Caching"
tags: [claude, tokens, efficiency, caching, anthropic]
sources: ["Claude Limit Hit", "Cheat Code for Claude", "The Need for the Project"]
---

## Definition
An Anthropic feature that "freezes" frequently-used content (like CLAUDE.md and project files pinned in a Project) so Claude doesn't re-read and charge full token cost for them on every message. Reduces token usage by up to 70%.

## How It Works
- Pin files to a Claude Project
- Anthropic caches those files in memory
- Subsequent questions about those files cost a fraction of the normal limit
- Only the new question is charged at full rate

## Impact
- One developer cut token usage by 95% using wiki-style indexed files with Karpathy architecture
- Claude Pro subscription lasts dramatically longer per session
- Enables long build sessions without hitting limits mid-task

## When It Applies
- Claude web Projects with pinned files
- [[Obsidian]] vault when accessed by [[Claude Code]] locally (reads files directly, doesn't re-paste into chat)
- [[Karpathy LLM Wiki]] index files that Claude follows rather than scanning entire codebase

## Related
- [[Claude Token Limits]]
- [[Karpathy LLM Wiki]]
- [[Obsidian]]
- [[Claude Code]]
