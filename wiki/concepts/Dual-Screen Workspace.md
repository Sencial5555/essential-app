---
type: concept
name: "Dual-Screen Workspace"
tags: [workflow, setup, obsidian, cursor, productivity]
sources: ["Rearranging Windows", "Using Obsidian for the Project"]
---

## Definition
The recommended screen layout for building Essential: [[Obsidian]] occupies the left half, [[Cursor]] occupies the right half, with [[Claude Code]] running inside Cursor's bottom terminal panel.

## Layout

```
┌─────────────────────┬─────────────────────┐
│                     │                     │
│     OBSIDIAN        │      CURSOR         │
│  (blueprint/wiki)   │  (files + preview)  │
│                     │                     │
│                     ├─────────────────────┤
│                     │   CLAUDE CODE       │
│                     │   (terminal)        │
└─────────────────────┴─────────────────────┘
```

## Phase-Specific Setup

**Phase 1 (Design):** Obsidian left (CLAUDE.md open), Cursor right with Composer panel (Ctrl+I), Chrome tab hidden in background to preview index.html.

**Phase 2–3 (Backend/Database):** Obsidian left (API docs open), Cursor right with terminal at bottom running Claude Code. Top half of Cursor shows files being autonomously written by the AI.

## Emergency Fallback
Keep browser Claude tab open separately. When Cursor/Claude Code are stuck in a bug loop, paste the broken code there: "Look at this with fresh eyes." Get the fix, type it back into Cursor.

## Related
- [[Obsidian]]
- [[Cursor]]
- [[Claude Code]]
- [[Build Phases]]
