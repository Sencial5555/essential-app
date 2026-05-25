---
type: entity
name: "Claude Code"
entity_type: product
tags: [cli, anthropic, terminal, autonomous, tools]
sources: ["The Order of Operations", "Direct Step-by-Step", "How to Use Claude", "Cheat Code for Claude", "Useful Skills", "Claude Limit Hit"]
---

## Overview
Claude Code is Anthropic's official command-line tool that runs locally inside a terminal. It is the autonomous developer for the Essential project — given high-level goals, it reads files, writes backend scripts, catches its own bugs, and commits to Git without manual file management.

## Key Facts
- Runs inside [[Cursor]]'s terminal panel or any terminal
- Key command: `/goal "..."` — Claude autonomously completes multi-step tasks
- Can spawn background sub-agent teams: lead agent coordinates while sub-agents work in parallel
- Reads CLAUDE.md and wiki index files to maintain context without re-reading entire codebase
- Handles git commit + push automatically when instructed
- Requires Node.js installed locally to run

## Custom Skills
Four recommended skills for Essential (stored in `.claude/commands/`):
- `/design` — enforces Calm Design + Tailwind rules
- `/mock-api` — fake Sightengine responses for frontend testing
- `/review` — session-resume briefing from git history + CLAUDE.md
- `/security-check` — scans for hardcoded keys and rate-limit gaps

## Related
- [[Cursor]]
- [[Obsidian]]
- [[Custom Slash Commands]]
- [[Karpathy LLM Wiki]]
- [[Claude Token Limits]]
- [[Essential]]
