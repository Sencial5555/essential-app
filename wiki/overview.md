---
type: overview
last_updated: 2026-05-25
source_count: 20
---

# Overview

This wiki documents the **Essential** project — a premium, minimalist web app for detecting AI-generated images, built by a non-coder using Claude as the AI engineering team. The wiki covers the full project: product vision, tech stack, build workflow, marketing, monetization, and financial model.

## Core Thesis
Essential bets that as AI-generated imagery becomes indistinguishable to the human eye, a fast, calm, frictionless detection tool has clear consumer demand. The product differentiates on design quality ([[Calm Design]]) and UX friction reduction ([[Hook First Lock Second]]), not on proprietary AI. Credibility is borrowed from enterprise API providers ([[Sightengine]] / [[Hive Moderation]]); the founder's value is the bridge and the experience.

## The Product: [[Essential]]
Single-page mobile-first web app. Upload an image → get a traffic-light AI probability result. Dark theme by default, centered drop-zone, neon scanner animation, Google/Apple One-Tap login, Stripe subscription gating. Built with HTML + Tailwind CSS + Node.js, deployed on Vercel.

## The Build Workflow
Three phases across three weekends using the [[Dual-Screen Workspace]] (Obsidian left, Cursor right, Claude Code in terminal):
- Phase 1: Visual shell in Cursor Composer
- Phase 2: Node.js backend + API connection via Claude Code
- Phase 3: Database (Supabase) + subscription logic

Token limits managed via [[Prompt Caching]], [[Fresh Chat Rule]], and [[Claude Token Limits]] workarounds. Custom slash commands (/design, /mock-api, /review, /security-check) automate recurring tasks.

## The Business Model
[[Monetization Models]]: token/credit packs ($4.99 for 100 scans) or subscription ($9.99/month for 500 scans). Net margin ~85% per credit pack. [[Scale Economics]] show ~$43,400 net profit at 1M scans/month.

## The Marketing Plan
Four-platform playbook: TikTok (Zero-Skills Underdog), Reddit (Feedback & Roast Me), X (Build in Public threads), LinkedIn (Future of Work case study). Timing aligns with peak deepfake/misinformation concern. See [[Marketing Strategy]].

## Key Threads
- **Product:** [[Essential]], [[Calm Design]], [[Traffic-Light Results]], [[Hook First Lock Second]]
- **Detection:** [[AI Image Detection]], [[Sightengine]] vs [[Hive Moderation]] (unresolved)
- **Build:** [[Build Phases]], [[Dual-Screen Workspace]], [[Claude Code]], [[Cursor]], [[Obsidian]]
- **Finance:** [[Monetization Models]], [[API Cost Trap]], [[Scale Economics]]
- **Marketing:** [[Marketing Strategy]], [[Brand Identity]], [[Trust & Credibility Strategy]]
- **Claude workflow:** [[Claude Token Limits]], [[Prompt Caching]], [[Custom Slash Commands]]

## Open Questions
- Which detection API to use — [[Sightengine]] vs [[Hive Moderation]]? Accuracy and pricing comparison not yet ingested.
- Which monetization model to lead with — credit packs or subscription? Sources give conflicting recommendations.
- What probability score thresholds map to each [[Traffic-Light Results]] color state?
- Final motto choice: "Trust what you see" vs "Your lens for a synthetic world"?
- Domain selection: essential.ai vs essentialapp.co vs getessential.io?

## Contradictions to Resolve
- **Monetization primary model**: "Interface of the Website" frames it as a subscription (500 scans/month), while "Monetization" recommends credit packs as primary. May coexist as two tiers, but decision needed.
