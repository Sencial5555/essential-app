---
type: source
title: "Cheat Code for Claude — Karpathy Wiki Setup"
date_ingested: 2026-05-25
source_type: note
url: https://www.youtube.com/watch?v=sboNwYmH3AY
tags: [karpathy, wiki, obsidian, token-limits, setup]
---

## Summary
Explains why the Karpathy LLM Wiki architecture solves two critical problems: context loss for non-coders and Claude token limits. References a YouTube video demonstrating a developer who cut token usage 95% with this method. Includes step-by-step setup plan for this project.

## Key Points
- Karpathy method: every code file gets a corresponding wiki note explaining why it was written, what it connects to, how it works — visible in Obsidian Graph View.
- Token reduction: developer compressed 383 files into wiki style and dropped Claude token usage by 95%.
- Claude Code reads index files and follows links directly to the file needing change — doesn't re-read entire codebase.
- Obsidian Web Clipper: use to clip Sightengine/Hive API docs into raw/ folder, then tell Claude to ingest them.
- Setup sequence: download Obsidian → open terminal in folder → run Karpathy wiki prompt → feed context.

## Entities Mentioned
- [[Obsidian]] — vault holder, Graph View for visual structure
- [[Claude Code]] — terminal tool that reads wiki indexes

## Concepts Mentioned
- [[Karpathy LLM Wiki]] — the architecture being set up
- [[Prompt Caching]] — why re-reading is avoided
- [[Claude Token Limits]] — the problem being solved

## My Notes
