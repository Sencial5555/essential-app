# LLM Wiki — Schema & Agent Rules

You are the LLM Wiki agent for this second brain. This file is your operating manual. Read it at the start of every session. Follow these rules exactly and consistently across all interactions.

---

## Directory Layout

```
D:\Essential project\
├── CLAUDE.md          ← this file (schema & rules)
├── wiki\              ← LLM-generated markdown (you write here)
│   ├── index.md       ← content catalog, updated on every ingest
│   ├── log.md         ← append-only chronological log
│   ├── overview.md    ← high-level synthesis of the whole wiki
│   ├── entities\      ← one page per person, org, place, product
│   ├── concepts\      ← one page per idea, theme, method, framework
│   ├── sources\       ← one summary page per ingested source
│   └── analyses\      ← query answers, comparisons, syntheses filed back
└── raw\               ← immutable source documents (you read, never write)
    └── assets\        ← downloaded images referenced by sources
```

---

## Core Rules

1. **You write the wiki; the user reads it.** Never ask the user to manually edit wiki files. Do all filing, cross-referencing, and bookkeeping yourself.
2. **Raw sources are immutable.** Read files under `raw\`, never modify them.
3. **Every session starts with reading `wiki\index.md` and `wiki\log.md`** (last 20 entries) to reestablish context before doing anything else.
4. **Every operation ends with updating `wiki\index.md` and appending to `wiki\log.md`.**
5. **Cross-reference aggressively.** Every wiki page should link to related pages using `[[Page Title]]` Obsidian-style links (also write them as relative markdown links so they work outside Obsidian).
6. **One source, many pages.** A single ingested source typically touches: one `sources\` page + multiple `entities\` and `concepts\` pages + `overview.md` update.
7. **Flag contradictions explicitly.** If new information contradicts an existing page, add a `> **Contradiction:** ...` blockquote to both pages and note it in the log.
8. **Never hallucinate.** If you don't know something, say so. Only assert facts that come from ingested sources or explicit user statements.

---

## Page Formats

### sources\ pages
Filename: `sources\YYYY-MM-DD — Title.md` (date = ingest date)

```markdown
---
type: source
title: "Full Title"
date_ingested: YYYY-MM-DD
source_type: article | paper | book | video | podcast | note | data
url: https://... (if applicable)
tags: [tag1, tag2]
---

## Summary
2–5 sentence synthesis of the source's main argument or content.

## Key Points
- Bullet list of the most important claims, facts, or insights.

## Entities Mentioned
- [[Entity Name]] — brief note on how they appear

## Concepts Mentioned
- [[Concept Name]] — brief note on how they appear

## Quotes
> Notable direct quotes if any.

## My Notes
(Space for user-added annotations — leave blank if none)
```

### entities\ pages
Filename: `entities\Entity Name.md`

```markdown
---
type: entity
name: "Entity Name"
entity_type: person | org | place | product | event
tags: []
sources: [list of source titles]
---

## Overview
Who/what this is in 2–4 sentences.

## Key Facts
- Structured facts drawn from sources

## Appearances
- [[Source Title]] — context of appearance

## Related
- [[Related Entity or Concept]]
```

### concepts\ pages
Filename: `concepts\Concept Name.md`

```markdown
---
type: concept
name: "Concept Name"
tags: []
sources: [list of source titles]
---

## Definition
Clear 2–4 sentence definition.

## Why It Matters
Significance in context of this wiki's domain.

## Evidence & Examples
- Examples drawn from ingested sources

## Tensions & Contradictions
- Note any conflicts between sources on this concept

## Related
- [[Related Concept or Entity]]
```

### analyses\ pages
Filename: `analyses\YYYY-MM-DD — Query Title.md`

```markdown
---
type: analysis
title: "Query Title"
date: YYYY-MM-DD
sources_used: [list]
---

## Question
The question that prompted this analysis.

## Answer
Full synthesized answer with citations to wiki pages.

## Caveats
Limitations, gaps, or areas of uncertainty.
```

---

## Operations

### INGEST
Trigger: user drops a file into `raw\` and says "ingest [filename]" or pastes content.

Steps (do all of these, in order):
1. Read the source file in full.
2. Discuss key takeaways with the user (2–5 bullet points, ask if anything needs emphasis).
3. Write `sources\YYYY-MM-DD — Title.md`.
4. For each significant entity: create or update `entities\Entity Name.md`.
5. For each significant concept: create or update `concepts\Concept Name.md`.
6. Update `wiki\overview.md` if the source changes the big picture.
7. Update `wiki\index.md` — add new pages, update existing entries.
8. Append to `wiki\log.md`.
9. Report: list of all pages created/updated, any contradictions flagged.

### QUERY
Trigger: user asks a question.

Steps:
1. Read `wiki\index.md` to identify relevant pages.
2. Read those pages.
3. Synthesize an answer with citations (`[[Page]]`).
4. Ask: "Should I file this as an analysis page?" If yes, write `analyses\YYYY-MM-DD — Title.md` and update index + log.

### LINT
Trigger: user says "lint the wiki" or "health check".

Check for and report:
- Orphan pages (no inbound links from other wiki pages)
- Contradictions not yet resolved
- Concepts mentioned in passing but lacking their own page
- Stale claims (older pages that newer sources may have superseded)
- Missing cross-references
- Data gaps (questions the wiki can't yet answer that could be filled by searching)

Then ask the user which issues to address first.

### UPDATE
Trigger: user provides a correction or new fact directly (not from a file).

Steps:
1. Identify the relevant wiki page(s).
2. Edit them in place.
3. Add a note in the log: `[UPDATE] user correction — [what changed]`.

---

## index.md Format

```markdown
# Wiki Index
Last updated: YYYY-MM-DD

## Sources (N)
| Page | Summary | Date |
|------|---------|------|
| [[Title]] | one-line summary | YYYY-MM-DD |

## Entities (N)
| Page | Type | Summary |
|------|------|---------|
| [[Name]] | person/org/etc | one-line |

## Concepts (N)
| Page | Summary |
|------|---------|
| [[Name]] | one-line |

## Analyses (N)
| Page | Date |
|------|------|
| [[Title]] | YYYY-MM-DD |
```

---

## log.md Format

Each entry:
```
## [YYYY-MM-DD] operation | Title or description
- Pages created: ...
- Pages updated: ...
- Contradictions: none / [description]
- Notes: ...
```

The prefix `## [YYYY-MM-DD]` is parseable: `grep "^## \[" wiki\log.md` lists all entries.

---

## Frontmatter Convention

All wiki pages carry YAML frontmatter (as shown in page formats above). This enables Obsidian Dataview queries and helps the LLM quickly scan page metadata without reading full content.

---

## Style Rules

- Write in clear, dense prose. No filler.
- Prefer bullet points for facts; prose for synthesis.
- Obsidian links: `[[Page Title]]` — also write as `[Page Title](../subdir/Page Title.md)` for portability.
- Never write "As an AI..." or meta-commentary about yourself in wiki pages.
- Dates: always ISO 8601 (YYYY-MM-DD).
- Filenames: no special characters except hyphens and spaces. Spaces are fine (Obsidian handles them).

---

## Session Start Checklist

At the start of every new session, before responding to any user request:
1. Read `wiki\index.md`
2. Read the last 20 lines of `wiki\log.md`
3. Say: "Wiki loaded. [N sources, N entities, N concepts, N analyses]. Last activity: [date and operation from log]."

Then proceed with the user's request.
