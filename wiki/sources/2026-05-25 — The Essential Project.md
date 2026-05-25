---
type: source
title: "The Essential Project"
date_ingested: 2026-05-25
source_type: note
url:
tags: [essential, project-blueprint, ai-detection, web-app]
---

## Summary
Foundational blueprint for "Essential," a premium mobile-first web app that detects AI-generated images using third-party vision APIs. The document defines the full technology stack, UI/UX standards, authentication and paywall logic, and security requirements. It is intended as a behavioral contract for AI coding assistants (Claude Code / Cursor).

## Key Points
- Core mission: help users distinguish real images from AI-generated media, positioned as a calm, minimalist consumer product.
- Stack: HTML5 + Tailwind CSS + vanilla JS (frontend), Node.js/Express (backend), Sightengine or Hive Moderation API (detection), Stripe (subscriptions), Vercel + GitHub (deployment).
- Auth flow: one free anonymous scan → blurred results + social login gate (Google/Apple One-Tap only, no passwords) → Stripe subscription for further scans.
- UI signature elements: centered dashed drop-zone, neon laser scanning animation, traffic-light result colors (green / amber / crimson), quota progress bar.
- Security: `express-rate-limit` on upload endpoint; all secrets from environment variables only.
- Architecture note: explicitly references Karpathy LLM Knowledge Wiki style — `raw/` for sources, `wiki/` for processed structures.

## Entities Mentioned
- [[Essential]] — the product being built
- [[Sightengine]] — primary candidate AI detection API
- [[Hive Moderation]] — alternative candidate AI detection API
- [[Stripe]] — subscription and payment engine
- [[Vercel]] — deployment platform
- [[GitHub]] — version control and CI/CD integration
- [[express-rate-limit]] — Node.js rate-limiting middleware

## Concepts Mentioned
- [[Calm Design]] — core UI philosophy: minimalism, speed, zero clutter
- [[Hook First Lock Second]] — auth/paywall strategy
- [[AI Image Detection]] — the core technical capability
- [[Traffic-Light Results]] — UX pattern for scoring output
- [[Karpathy LLM Wiki]] — architectural inspiration for this project

## Quotes
> "Essential. For everyday use."
> "Calm Design — absolute minimalism, extreme speed, zero clutter, and high transparency."
> "Hook First, Lock Second"

## My Notes
