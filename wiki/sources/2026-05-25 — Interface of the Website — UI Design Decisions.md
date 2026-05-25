---
type: source
title: "Interface of the Website — UI Design Decisions"
date_ingested: 2026-05-25
source_type: note
url:
tags: [ui, ux, design, interface, subscription, progress-bar]
---

## Summary
Detailed UI design rationale for Essential: layout, the Hook First Lock Second conversion strategy (with the 70% drop-off data point), subscription progress bar design per tier, and three premium UI enhancement ideas.

## Key Points
- Requiring login before first scan causes up to 70% of visitors to immediately leave.
- Hook First Lock Second: anonymous scan → blur result → login modal → Stripe gate. Gives value before asking for commitment.
- Progress bar tiers: Free = soft blue bar, "3 of 3 free monthly scans remaining"; Premium = glowing neon bar, "84 of 500 premium scans used."
- Three UI enhancements: (1) Social login only — Google & Apple One-Tap, no passwords; (2) Scanner line animation while API processes; (3) Traffic-light color result cards.
- Centered drop-zone: user opens site → taps box → camera roll opens → picks image. Minimal clicks.

## Entities Mentioned
- [[Essential]] — the product
- [[Stripe]] — subscription gate

## Concepts Mentioned
- [[Hook First Lock Second]] — the strategy with 70% drop-off data
- [[Calm Design]] — centered drop-zone rationale
- [[Traffic-Light Results]] — color-coded result cards
- [[Subscription Progress Bar]] — the two-tier visual system

## My Notes
