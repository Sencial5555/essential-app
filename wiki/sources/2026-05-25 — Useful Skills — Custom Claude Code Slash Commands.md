---
type: source
title: "Useful Skills — Custom Claude Code Slash Commands"
date_ingested: 2026-05-25
source_type: note
url:
tags: [claude-code, slash-commands, skills, automation, workflow]
---

## Summary
Four custom Claude Code slash commands recommended for the Essential project, stored as markdown files in `.claude/commands/`. Each skill solves a specific recurring problem.

## Key Points
- `/design`: locks Claude into mobile-responsive, dark-themed Tailwind rules — Calm Design guardrail. Prevents layout drift on first try.
- `/mock-api`: simulates Sightengine response (returns random AI% score) without real API calls. Use during frontend dev to save API credits.
- `/review`: scans directory, reads CLAUDE.md, checks git commits, prints session-resume briefing. Run every Saturday morning to instantly pick up where you left off.
- `/security-check`: scans backend for hardcoded keys, validates .env safety, confirms rate-limiters are active. Run before every GitHub push.
- Setup: create `.claude/commands/` directory, drop markdown files (e.g., `design.md`) inside, then type `/design` in terminal.

## Entities Mentioned
- [[Claude Code]] — the tool these skills run inside

## Concepts Mentioned
- [[Custom Slash Commands]] — the skill system
- [[Calm Design]] — what /design enforces
- [[Claude Token Limits]] — what /review helps manage
- [[Mock API Testing]] — what /mock-api enables

## My Notes
