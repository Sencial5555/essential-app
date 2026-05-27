# Browser Extension — Phase 4 Idea

## The Problem It Solves
The URL fetch bar on the website fails silently for Twitter/X, Instagram, TikTok, and any platform protected by Cloudflare or Akamai. Their bot detection blocks requests from Vercel data center IPs with a 403 or CAPTCHA wall. No amount of header spoofing reliably fixes this.

## The Idea
Build a browser extension with a right-click context menu: **"Scan with Essential AI."**

When a user sees a suspicious image on X, Instagram, Reddit, or any site, they right-click it and select the option. The extension grabs the image data directly from the rendered browser tab — no scraping, no server-side fetch, no CORS issues. The image is already loaded locally because the user is already logged into those platforms on their own browser.

## Why It Works Technically
- Content script captures the `src` of the right-clicked image or draws it to a canvas
- Background service worker sends the image blob to the existing `/api/scan` Edge Function
- Result shown in extension popup or injected inline on the page
- The user's own authenticated session handles access — the extension never needs to authenticate with X or Instagram

## Why It's a Good Business Move
- Sticky product: an installed extension is used daily, a website gets forgotten
- Works universally: X, Instagram, Reddit, TikTok, news sites, anywhere
- Drives account signups passively: gate results behind login, push users to the website
- Competitive moat: harder to copy than a website

## Why It's a Phase 4 Thing (Not Now)
- It's a second product, not a feature — separate codebase, Chrome Web Store submission, update cycle
- Store approval takes days to weeks; Google can reject for vague policy reasons
- Requires a dedicated privacy policy for the extension
- Eventually needs Firefox, Edge, and Safari variants
- User install friction: conversion from "visit site" to "install extension" is typically 2–5%
- Better to build after Phase 3 (Stripe) is live and there are paying users to justify the investment

## Rough Technical Spec (for when the time comes)
- Manifest V3 (current Chrome standard)
- `chrome.contextMenus.create` for the right-click menu
- Content script: grab `img.src` or canvas pixel dump on click
- Background service worker: POST to `/api/scan` with image blob
- Auth: share session via `chrome.storage` or redirect to main site with token
- Result: popup overlay or redirect to `essentialai-app.vercel.app` with result pre-loaded
