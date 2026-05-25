---
type: entity
name: "Lemon Squeezy"
entity_type: product
tags: [payments, subscriptions, saas, alternative]
sources: ["Monetization", "Direct Step-by-Step", "Using Obsidian for the Project"]
---

## Overview
Lemon Squeezy is a managed payment platform for software creators, positioned as an alternative to [[Stripe]] for Essential's monetization. It handles credit card security, fraud detection, Apple Pay/Google Pay, and global sales tax compliance.

## Key Facts
- Role in Essential: payment alternative to Stripe; used for credit pack purchases or subscriptions
- Payment flow: user clicks "Buy Credits" → Lemon Squeezy overlay opens → pays → sends webhook "Payment successful, give User X their credits" → Claude Code unlocks credits in database
- Fees: roughly 5% + $0.30 per transaction (similar to Stripe)
- No need to build card processing yourself — Lemon Squeezy handles all security

## Comparison to Stripe
- Both handle the same payment use case; Lemon Squeezy is sometimes preferred by solo creators for its merchant-of-record model (handles VAT/sales tax globally)
- Choice between them not yet finalized in ingested sources

## Related
- [[Stripe]]
- [[Essential]]
- [[Monetization Models]]
