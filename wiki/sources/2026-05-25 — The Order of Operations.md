---
type: source
title: "The Order of Operations — Build Phases"
date_ingested: 2026-05-25
source_type: note
url:
tags: [build-plan, phases, workflow, essential]
---

## Summary
Three-phase incremental build plan for Essential. Emphasizes doing one phase per weekend session, not mixing concerns, and using the right tool for each phase (Cursor for design, Claude Code for backend/database).

## Key Points
- Phase 1 (first Saturday): Visual shell only — HTML + Tailwind CSS in Cursor Composer. No Node.js yet.
- Phase 2 (second weekend): Node.js backend, connecting upload button to Sightengine API via Claude Code `/goal`.
- Phase 3 (third weekend): Database (Supabase or SQLite) for user profiles and scan quotas.
- Key warning: biggest beginner mistake is trying to handle all three phases in one session.
- Claude Code's `/goal` command handles autonomous multi-step backend tasks.

## Entities Mentioned
- [[Cursor]] — Phase 1 tool
- [[Claude Code]] — Phase 2 and 3 tool
- [[Sightengine]] — API connected in Phase 2
- [[Supabase]] — database option for Phase 3

## Concepts Mentioned
- [[Build Phases]] — the three-phase structure
- [[Karpathy LLM Wiki]] — CLAUDE.md as rulebook

## My Notes
