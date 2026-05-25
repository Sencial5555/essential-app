---
type: concept
name: "Karpathy LLM Wiki"
tags: [architecture, knowledge-management, llm]
sources: ["The Essential Project"]
---

## Definition
An architectural pattern attributed to Andrej Karpathy for organizing LLM-assisted projects: immutable source material lives in `raw/`, and LLM-processed structures (summaries, indexes, cross-references) live in `wiki/`. This project (the second brain itself) is an implementation of this pattern.

## Why It Matters
Keeps source truth separate from derived knowledge. The LLM can reprocess sources without touching originals; the wiki reflects the current state of understanding.

## Evidence & Examples
- Explicitly referenced in the Essential project blueprint as the chosen project architecture
- This entire wiki (`D:\Essential project\`) is itself built on this pattern

## Related
- [[Essential]]
