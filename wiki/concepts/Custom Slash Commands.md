---
type: concept
name: "Custom Slash Commands"
tags: [claude-code, automation, skills, workflow, productivity]
sources: ["Useful Skills", "How to Use Claude"]
---

## Definition
Reusable shortcut commands for [[Claude Code]], stored as markdown files in `.claude/commands/`. Typed as `/commandname` in the terminal, they load pre-written rulesets that Claude executes instantly.

## Setup
1. Create `.claude/commands/` directory in project root
2. Create a markdown file per skill (e.g., `design.md`, `security-check.md`)
3. Type `/design` (or whichever name) in Claude Code terminal to activate

## Four Skills for Essential

### /design — Calm Design Guardrail
Locks Claude into mobile-responsive layouts, dark-themed Tailwind utility classes, rounded buttons (`rounded-2xl`), and smooth light/dark transitions. Prevents layout drift.

### /mock-api — Sandbox Simulator
Writes a fake Sightengine backend that returns random AI probability scores without real API calls. Use during Phase 1 frontend development — zero cost, unlimited testing.

### /review — Session Resume
Scans directory + CLAUDE.md + git commits → prints a developer briefing in the terminal. Run every Saturday morning: "Welcome back. Last weekend we finished X. Here's where we are."

### /security-check — Budget & Key Protector
Scans backend files for hardcoded secrets, validates `.env` files are safe, confirms rate-limiters are active. Run before every GitHub push.

## Related
- [[Claude Code]]
- [[Calm Design]]
- [[API Cost Trap]]
- [[Claude Token Limits]]
- [[Mock API Testing]]
