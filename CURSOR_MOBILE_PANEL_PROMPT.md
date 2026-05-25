# Mobile Layout — Add Analysis Preview, Auth & Pricing Sections

## What we're doing

The `#desktop-panel` aside (which contains the analysis preview, Google/Apple auth buttons, and pricing cards) is currently hidden on mobile and only shown on desktop as a right column. We need to make all three of those sections visible on mobile too, stacked vertically below the existing upload zone and progress bar, centered, full-width — matching the clean single-column phone layout already established.

No JavaScript changes. No desktop layout changes. Mobile-only CSS additions.

---

## Current structure (what exists in the HTML)

The DOM order inside `#page-wrapper` is:
1. `<header>` — ESSENTIAL wordmark + theme toggle
2. `<div id="left-col-inner">` — contains `#hero-section` (TRUST + tagline + descriptor) and `<main id="main-content">` (upload zone, scan button, progress bar, result card)
3. `<aside id="desktop-panel">` — contains all three sections: analysis preview card, auth card (Google/Apple + pricing). Currently has NO default CSS — it's only styled inside `@media (min-width: 768px)` where it becomes a right-column grid item.
4. `<footer id="site-footer">` — SSL / Never stored / Enterprise engine trust badges

The `#desktop-panel` aside is an `<aside>` element with no inline `display` style. Without the desktop media query it renders as a block but unstyled. We need to explicitly style it for mobile.

---

## What to change — mobile only

### 1. Add default (mobile) styles for `#desktop-panel`

Outside any media query (i.e., as base styles applying to all screen sizes, which the desktop media query will then override), add:

```css
#desktop-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 20px 0;
}
```

The desktop `@media (min-width: 768px)` block already sets `display: flex !important`, `grid-column: 2`, `border-left`, and different padding — those must remain untouched. The base styles above just ensure the panel shows and flows correctly on mobile.

### 2. Hide the descriptor line on mobile

The hero section has a third paragraph: "Detect AI-generated images instantly. Powered by enterprise-grade models." — this was added for desktop to balance the left column. It doesn't belong on mobile where the layout is already tight.

Add a class `desktop-only` to that paragraph in the HTML:
```html
<p class="desktop-only" style="font-size:13px; color:var(--text-muted); ...">
  Detect AI-generated images instantly. Powered by enterprise-grade models.
</p>
```

Then add to base CSS (outside media query):
```css
.desktop-only { display: none; }
```

And inside the desktop media query:
```css
.desktop-only { display: block; }
```

### 3. Increase mobile bottom padding

The `#page-wrapper` currently has `padding: 0 0 100px 0` inline — this was sized for the demo toolbar only. With the new panel sections added below the upload zone, this padding is still needed to clear the fixed demo toolbar but confirm it's sufficient (100px should be fine since the panel content flows above the footer, not below it).

### 4. Mobile panel card widths

The two cards inside `#desktop-panel` (analysis preview card and the auth+pricing card) currently have no explicit width. On mobile they should naturally stretch to full width within the 20px side padding. Confirm both cards have no `max-width` or `width` constraint that would prevent them from filling the column. If any exists, remove it for mobile (the desktop media query can re-add constraints if needed).

### 5. Auth button height on mobile

The desktop media query has `.auth-btn` overridden to `height: 42px` for the compact panel. On mobile the full `height: 50px` from the base `.auth-btn` class is correct and should remain — do not apply the 42px override globally, only inside the desktop media query (which it already is).

---

## What NOT to change

- The desktop `@media (min-width: 768px)` block — do not touch any existing desktop rules.
- Any JavaScript.
- The overlay modals (`#overlay-login`, `#overlay-paywall`) — these are separate from the panel and stay as-is.
- The `#demo-bar` fixed toolbar.
- The footer (`#site-footer`).
- The phone layout of the upload zone, progress bar, result card, or hero title.

---

## Expected result on mobile

Scrolling down from the top on a phone viewport:

1. ESSENTIAL header
2. TRUST / what you see. (no descriptor line)
3. Upload dropzone (large, full width)
4. Progress bar + "3 of 3 free scans remaining"
5. [Result card when active]
6. **Analysis Preview card** — full width, the mock confidence bar, signal rows (Texture consistency / Color distribution / Metadata signals), and history rows (photo_001.jpg / screenshot_2024.png) — same content as desktop, just stacked below instead of to the right
7. **Auth + Pricing card** — "Save your results" label, Google button, Apple button, "No password. No spam." micro-copy, divider, "Choose a plan" label, two pricing mini-cards side by side ($4.99 Credits / $9.99/mo Monthly), "Powered by Stripe" micro-copy
8. Footer trust badges
9. Demo toolbar (fixed)

Everything centered, full-width within 20px side padding, no horizontal scroll.
