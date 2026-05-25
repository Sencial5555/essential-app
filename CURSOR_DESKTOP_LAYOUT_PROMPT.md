# Desktop Layout Redesign — ESSENTIAL AI Image Detector

## What we're building

Redesign the desktop layout of `index.html` (≥ 768px viewports) into a two-column split screen. The mobile layout (< 768px) must remain completely untouched. No JavaScript logic changes — only HTML structure and CSS/Tailwind visual changes.

---

## Current state (what exists)

- Single `index.html`, Tailwind CDN + custom CSS variables in `:root`.
- The `#page-wrapper` div has `max-width: 430px; margin: 0 auto` — this is the phone constraint. On desktop it just centers a thin column, leaving most of the viewport empty.
- Existing CSS states: IDLE, IMAGE_LOADED, SCANNING, RESULT_HUMAN, RESULT_SUSPICIOUS, RESULT_AI, LOGIN_GATE, PAYWALL.
- There are already overlay modals (`#overlay-login`, `#overlay-paywall`) for auth and subscription — these should stay as-is for mobile, but on desktop the right column will surface their content inline (persistent, not modal).
- Color tokens already defined: `--bg-primary`, `--bg-surface`, `--bg-elevated`, `--border-subtle`, `--border-active`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent-blue`, `--accent-violet`.

---

## Desktop target layout

```
┌─────────────────────────────────────────────────────────────┐
│  ESSENTIAL                                     [theme toggle]│
├──────────────────────────┬──────────────────────────────────┤
│                          │                                   │
│   T R U S T              │   ┌─────────────────────────┐    │
│   what you see.          │   │  Upload an image to see  │    │
│                          │   │  your analysis here      │    │
│  ┌────────────────────┐  │   │                          │    │
│  │                    │  │   │  [mock confidence meter] │    │
│  │   Drop image here  │  │   │  [mock data rows x3]     │    │
│  │   or tap to browse │  │   │  [mock history log x2]   │    │
│  │                    │  │   └─────────────────────────┘    │
│  └────────────────────┘  │                                   │
│                          │   ── Sign in to save results ──   │
│  [progress bar]          │   [Continue with Google]          │
│  [result card area]      │   [Continue with Apple]           │
│                          │                                   │
│                          │   ── Or upgrade your plan ──      │
│                          │   [Credits card] [Monthly card]   │
│                          │                                   │
├──────────────────────────┴──────────────────────────────────┤
│  SSL Encrypted · Never stored · Enterprise engine            │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation instructions

### 1. Desktop wrapper restructure

On desktop (`@media (min-width: 768px)`), override `#page-wrapper` so it:
- Spans the full viewport width (remove the 430px cap)
- Uses CSS Grid: `grid-template-columns: 1fr 1fr` with a max total width of `1100px`, centered
- Keeps the header and footer spanning both columns (`grid-column: 1 / -1`)
- The left column contains the existing hero + upload zone + progress + result card
- The right column is a new element (`#desktop-panel`) that only appears on desktop

### 2. Left column (existing content, minor tweaks)

- Hero title, upload zone, progress bar, result card stay in their current DOM positions
- On desktop: left column gets `padding: 0 40px 0 20px` and is vertically centered
- The upload zone max-width should be `460px` on desktop so it doesn't stretch too wide

### 3. Right column — `#desktop-panel`

Add a new `<aside id="desktop-panel">` element inside `#page-wrapper`, placed after `</main>` and before the `<footer>`. It's `display: none` on mobile, visible on desktop.

The right panel has three stacked sections separated by subtle dividers:

#### Section A — Empty-state analysis preview

A card (`background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 20px; padding: 24px`) containing:

- **Header row:** small label "Analysis Preview" in `var(--text-muted)`, 11px, uppercase with letter-spacing
- **Empty state message** (shown when no result is active): a centered block with a faint icon (something like a chart/waveform SVG) and text "Upload an image to see your analysis" in `var(--text-secondary)`
- **Mock UI elements** (always visible, faint/greyed to suggest what's coming):
  - A "Confidence" label with a faux progress bar at ~72% filled, using `var(--bg-elevated)` track and a gradient fill (`var(--accent-violet)` → `var(--accent-blue)`), opacity: 0.4
  - Three mock "signal rows" — each row has a small colored dot (green/amber/red), a fake label like "Texture consistency", "Color distribution", "Metadata signals", and a faint score badge. Use `opacity: 0.35` so they look like a preview/watermark
  - Two mock "recent scans" rows in a "History" sub-section: show a small thumbnail placeholder rectangle, a filename like "photo_001.jpg", a timestamp "2 min ago", and a colored result badge. `opacity: 0.3` to signal they're locked/preview

#### Section B — Authentication

Below the analysis card, a clean inline auth block:

- Section label: "Save your results" — 13px, `var(--text-muted)`, with a subtle horizontal rule on each side (use CSS or a border trick)
- Google button: same `.google-btn` styles already defined in CSS (white bg, Google G SVG, "Continue with Google")
- Apple button: same `.apple-btn` styles (black bg, Apple SVG, "Continue with Apple")  
- Micro-copy below: "No password. No spam. Cancel anytime." — 11px, `var(--text-muted)`, centered
- These buttons are visually identical to the overlay versions but inline, not modal

#### Section C — Subscription plans

Below auth, another section:

- Section label: "Choose a plan" with same divider style as Section B
- Two plan cards side-by-side (same `.pay-card` / `.pay-card.featured` classes already defined):
  - **Credits card:** "$4.99 · 100 scans · One-time · Buy"
  - **Monthly card (featured, violet border):** "✦ RECOMMENDED · $9.99/mo · 500 scans · Cancel anytime · Subscribe"
- Micro-copy: "Powered by Stripe · Secure checkout" — 11px, `var(--text-muted)`, centered

### 4. Desktop ambient glow

On desktop, update `body::before` so the radial gradient is off-center: origin at `~30% 40%` (left-center) to complement the left-column content, not dead center.

### 5. Header on desktop

On desktop, the header should span full width and use `max-width: 1100px; margin: 0 auto` to align with the grid. The ESSENTIAL wordmark stays centered relative to the full header, and the theme toggle stays right-aligned.

### 6. Footer on desktop

Footer spans both columns, `max-width: 1100px; margin: 0 auto`, text centered.

---

## CSS approach

- Use the existing `@media (min-width: 768px)` block at the bottom of `<style>` — add all desktop rules there.
- Avoid Tailwind responsive prefixes for this restructure since the layout is driven by CSS Grid on `#page-wrapper` — use raw CSS in the media query.
- The right panel internal layout can use Flexbox column with `gap: 24px`.
- Reuse existing CSS classes: `.auth-btn`, `.google-btn`, `.apple-btn`, `.pay-card`, `.pay-card.featured` — do not duplicate their definitions, just apply them to the new inline elements.

---

## What NOT to change

- Any JavaScript in the `<script>` block — zero JS changes.
- The overlay modals (`#overlay-login`, `#overlay-paywall`) — keep them exactly as-is for mobile.
- The demo toolbar (`#demo-bar`) — leave untouched.
- Mobile styles (anything outside `@media (min-width: 768px)`).
- The color token definitions in `:root`.

---

## Expected result

On a 1280px desktop viewport: a balanced two-column layout where the left feels like the active workspace and the right feels like a persistent dashboard/onboarding panel. The right column's mock UI elements should create a clear visual of what the app does, tempting the user to scan. The inline auth and subscription panels reduce friction — users don't need to trigger a modal to sign up or upgrade.

---

## Critical fixes based on current visual state

These are bugs visible right now that must be corrected, not just the new layout added on top:

1. **Close the left column void.** There is currently a ~300px dead black gap between the "TRUST / what you see." hero text and the dropzone. The title, dropzone, progress bar, and result card must be grouped and vertically centered together as a unit within the left column. They should not be scattered top-to-bottom with dead air between them.

2. **Right panel must fit in one viewport — no scroll.** The entire right panel (all three sections: analysis preview, auth buttons, pricing) must fit within `100dvh` with no overflow or scrolling required. Condense vertical padding aggressively. The analysis preview section should be compact — reduce internal padding and shrink the waveform icon + empty state message. The auth section needs minimal gap between buttons. The pricing cards should be mini — just price, scan count, and button, no excess spacing.

3. **Contain the auth buttons inside the right panel.** Right now the Google and Apple buttons are floating outside any card or container below the analysis preview card. They must live inside a single unified right panel element with a visible border or background, not dangling in open space.

4. **Pricing section must be visible without scrolling.** The pricing cards are currently below the fold — the user has to scroll to find them. Bring them into the viewport. If needed, reduce the analysis preview card height further to make room.

5. **Overall balance check.** When done, both columns should start and end at roughly the same vertical position. The left column should not feel like it has leftover empty space at the bottom while the right column is still full of content.
