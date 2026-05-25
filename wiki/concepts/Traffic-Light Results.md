---
type: concept
name: "Traffic-Light Results"
tags: [ux, ui, results, color-system]
sources: ["The Essential Project"]
---

## Definition
A three-state color system for communicating [[AI Image Detection]] scores to users without exposing raw probability numbers. Designed to be instantly legible.

## Why It Matters
Aligns with [[Calm Design]] — communicates certainty level at a glance, no cognitive load required. Avoids the confusion of presenting a raw percentage (e.g. "73.2% AI probability").

## Evidence & Examples
| Color | Meaning | Hex/Name |
|-------|---------|----------|
| Soft Green | Verified safe / likely human-captured | Green |
| Amber | Suspicious / uncertain | Amber |
| Deep Crimson / Ruby | High-probability AI-generated | Crimson |

## Tensions & Contradictions
- Exact threshold values (what score maps to each color) not defined in source — needs to be decided during implementation.

## Related
- [[Essential]]
- [[Calm Design]]
- [[AI Image Detection]]
