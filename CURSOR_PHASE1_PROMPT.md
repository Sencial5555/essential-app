# Phase 1 — Cursor Composer Prompt
# Paste everything below this line into Cursor's Composer (Ctrl+I)

---

You are an expert frontend developer, UX designer, and conversion psychologist. Build the complete Phase 1 visual shell for a mobile-first web app called **ESSENTIAL** — a single-page HTML file using Tailwind CSS via CDN. No build tools, no Node.js, no backend. One self-contained `index.html` file only.

---

## What This App Does

ESSENTIAL is an AI image detection tool. A user uploads any image and the app tells them how likely it is to be AI-generated. The result is shown as a color-coded confidence score (traffic-light system: green = real, amber = suspicious, crimson = AI-generated). The business model is: 3 free scans → login gate → subscription/credits to continue.

---

## Brand & Tone

- **App name:** ESSENTIAL (always all-caps, wide letter-spacing — commands authority like a premium brand)
- **Tagline:** "Trust what you see."
- **Design philosophy:** Calm Design — absolute minimalism, extreme speed, zero clutter. Every element earns its place or gets cut.
- **Feel:** Premium intelligence tool. Think of the aesthetic of Linear, Vercel, or Arc browser — dark, clean, fast, intentional.

---

## Technical Requirements

- Tailwind CSS via CDN link (no build step)
- Single `index.html` file — all CSS, HTML, and JS inside one file
- Dark mode by default. Light mode toggle that truly switches the entire palette
- Mobile-first. Design for a 390px wide screen (iPhone 14). Must look flawless at mobile width. Desktop can scale gracefully.
- Use CSS custom properties for the color palette so light/dark toggle works cleanly
- Smooth transitions (300ms ease) on all interactive state changes

---

## Color Palette

```css
/* Dark mode (default) */
--bg-primary: #07070f;        /* deep near-black with blue undertone */
--bg-surface: #0f0f1a;        /* card surfaces */
--bg-elevated: #16162a;       /* elevated elements */
--border-subtle: rgba(255,255,255,0.08);
--border-active: rgba(255,255,255,0.18);
--text-primary: #f0f0f5;
--text-secondary: #8585a0;
--text-muted: #4a4a65;
--accent-blue: #4f7fff;        /* free tier progress bar */
--accent-violet: #7c5cfc;      /* premium tier / interactive accents */
--result-green: #22c55e;       /* human / real */
--result-amber: #f59e0b;       /* suspicious */
--result-crimson: #e53935;     /* AI-generated */
--laser-color: #7c5cfc;        /* scanning animation */

/* Light mode */
--bg-primary: #f4f4f8;
--bg-surface: #ffffff;
--bg-elevated: #ebebf2;
--border-subtle: rgba(0,0,0,0.07);
--border-active: rgba(0,0,0,0.15);
--text-primary: #0d0d1a;
--text-secondary: #5a5a7a;
--text-muted: #9999b5;
```

---

## Layout Structure (Mobile)

Build this exact vertical layout, top to bottom:

```
┌─────────────────────────────────┐
│  [◑ toggle]          ESSENTIAL  │  ← top bar: toggle left, name right (or centered name, toggle top-right)
├─────────────────────────────────┤
│                                 │
│        T R U S T                │  ← app name, large, all-caps, letter-spaced
│    what you see.                │  ← tagline, lightweight, muted
│                                 │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │    ↑  Drop image here     │  │  ← UPLOAD ZONE (see specs below)
│  │    or tap to choose       │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  [▬▬▬▬▬▬▬▬▬▬▬          ]      │  ← PROGRESS BAR (see specs below)
│   3 of 3 free scans remaining   │
│                                 │
├─────────────────────────────────┤
│   [RESULT CARD - hidden first]  │  ← Appears after scan
├─────────────────────────────────┤
│   🔒  SSL encrypted             │  ← TRUST SECTION (bottom)
│   🚫  Images never stored       │
│   ⚡  Enterprise AI engine      │
└─────────────────────────────────┘
```

---

## Upload Zone — Exact Specifications

This is the hero element. It must be large, inviting, and impossible to miss.

- **Size:** Full width minus 24px padding each side. Minimum height: 220px on mobile.
- **Shape:** `border-radius: 24px` — very rounded, soft corners
- **Border:** 1.5px dashed, color `var(--border-active)`. The dashed pattern signals "drop something here" — this is a deeply embedded UX convention.
- **Background:** Slightly lighter than page bg (`var(--bg-surface)`) — gives it a subtle lift without harsh contrast
- **Content when empty:**
  - An upload icon (arrow-up into a cloud or tray) — clean outline style, ~32px, `var(--accent-violet)` color
  - Primary text: "Drop image here" — 16px, medium weight, `var(--text-primary)`
  - Secondary text: "or tap to browse" — 13px, `var(--text-secondary)`
- **Hover state:** The border transitions from dashed to solid and glows — use `box-shadow: 0 0 0 3px rgba(124, 92, 252, 0.18)` and border color brightens to `var(--accent-violet)`. Scale: `transform: scale(1.01)`. The zone should feel alive on hover.
- **Drag-over state:** Background shifts to `rgba(124, 92, 252, 0.07)`. The icon animates (pulse or bounce). Border becomes solid violet.
- **File input:** Hidden `<input type="file" accept="image/*">` triggered by clicking the zone.

**Psychology note:** Large upload target = Fitts's Law. The bigger and more central the target, the faster and more satisfying the tap. This is not decorative — size IS the conversion mechanic.

---

## Progress Bar — Exact Specifications

Directly below the upload zone, 12px gap.

- **Container:** Full width, `border-radius: 100px` (pill shape), height 6px, background `var(--bg-elevated)`
- **Fill bar:** `border-radius: 100px`, height 6px, smooth animated width transition
  - Free tier fill: `var(--accent-blue)`, width 100% (3/3 scans remaining — bar starts FULL, counts down as scans are used)
- **Label below bar:** "3 of 3 free scans remaining" — 12px, `var(--text-secondary)`, centered
- **Premium state variation (show as comment in code):** Fill color changes to `var(--accent-violet)` with a subtle animated shimmer. Label: "84 of 500 premium scans used"

**Psychology note:** The bar starts FULL, not empty. Loss aversion — users feel they *have* something to use. As it depletes, urgency builds naturally. A count-up bar starting at zero feels like accumulation; a countdown bar starting full feels like spending. The latter drives action.

---

## UI State System

Build a JavaScript state machine with these states. Add demo buttons (small, at the very bottom of the page during development) to toggle between states so you can preview each one:

### State 1: IDLE
Default state. Empty upload zone, full progress bar, no result card.

### State 2: IMAGE_LOADED
User has selected an image. The upload zone transforms:
- Thumbnail of the selected image fills the zone (object-fit: cover, same border-radius)
- A small "×" remove button appears top-right of the zone
- Below the image: a primary button "Scan this image" — full width, `border-radius: 14px`, `background: var(--accent-violet)`, white text, 16px font, 52px height. On hover: slightly lighter, scale(1.02).

### State 3: SCANNING
Image is being analyzed. The scan animation overlays the thumbnail:
- A thin horizontal line (2px height, full width of the zone) with color `var(--laser-color)` and a strong horizontal glow effect (`box-shadow: 0 0 12px 4px rgba(124,92,252,0.7)`)
- This line animates from top to bottom of the image, then repeats, using CSS `@keyframes scanline` — duration 1.4s, ease-in-out, infinite
- Subtle pulsing text below the zone: "Analyzing..." — 13px, `var(--text-secondary)`, opacity pulses between 0.5 and 1.0

**Psychology note:** The 1-2 second API wait is a feature, not a bug. The laser line signals that something powerful is happening. Without it, users think the app is broken. With it, they feel premium AI intelligence at work.

### State 4a: RESULT_HUMAN
Result card slides up from below the upload zone (translateY animation, 300ms ease-out):
- **Card background:** Soft green tint: `rgba(34, 197, 94, 0.08)`, border: `1px solid rgba(34, 197, 94, 0.25)`, `border-radius: 20px`, padding: 20px
- **Top of card:** Large score — "94%" — 48px, font-black, `var(--result-green)`
- **Label:** "Likely Human-Generated" — 14px, medium, green
- **Sub-label:** "Low probability of AI generation detected." — 13px, `var(--text-secondary)`
- **Small icon:** A checkmark or shield in green, 20px

### State 4b: RESULT_SUSPICIOUS
Same card structure, amber palette:
- Background: `rgba(245, 158, 11, 0.08)`, border amber
- Score: "61%" in amber
- Label: "Suspicious Elements Detected"
- Sub-label: "Some patterns suggest possible AI manipulation."

### State 4c: RESULT_AI
Same card structure, crimson palette:
- Background: `rgba(229, 57, 53, 0.08)`, border crimson
- Score: "97%" in crimson  
- Label: "AI-Generated Content"
- Sub-label: "High confidence — AI generation signatures detected."

**Psychology note:** Color communicates before text does. Green/amber/red bypass cognitive load entirely. Users understand the result before they read a single word. This is the entire UX point of the traffic-light system.

### State 5: LOGIN_GATE
After the first free scan, before showing results:
- The result card renders but is blurred (`filter: blur(8px)`, `user-select: none`, `pointer-events: none`)
- A modal overlay appears on top:
  - Semi-transparent dark backdrop: `rgba(7, 7, 15, 0.85)`
  - Modal card: `var(--bg-surface)`, `border-radius: 24px`, padding 28px, centered
  - Headline: "Your result is ready." — 20px, font-semibold
  - Sub-text: "Create a free account to unlock this scan and get 3 free monthly scans." — 14px, muted
  - Google One-Tap button: White background, Google logo, text "Continue with Google" — full width, `border-radius: 12px`, 50px height, border 1px solid rgba(0,0,0,0.12)
  - Apple button: Black background, Apple logo, text "Continue with Apple" — same size, `border-radius: 12px`
  - Fine print: "No password. No spam. Cancel anytime." — 11px, muted, centered
- Modal appears with a subtle scale-in animation (from 0.95 to 1.0, 250ms ease-out)

**Psychology note:** The blur is critical. Hiding the result completely removes desire. The blur reveals that a result *exists* but withholds it. Desire + low-friction resolution (one-tap, no password) = maximum conversion.

### State 6: PAYWALL
When free scans run out:
- Full-screen overlay (same dark backdrop)
- Modal headline: "Upgrade to keep scanning." — 22px
- Two option cards side by side:
  - **Credits:** "$4.99 · 100 scans" — one-time
  - **Monthly:** "$9.99/mo · 500 scans" — highlight this one with violet border as recommended
- Each card: `border-radius: 16px`, `var(--bg-elevated)`, 20px padding, centered text
- Below: "Powered by Stripe · Secure checkout" — 11px, muted
- Tiny "Maybe later" text link at the very bottom

---

## Trust Section

At the bottom of the page, below the result area. Simple, clean — no heavy design. Just quiet confidence.

Three small items in a row (or stacked on very small screens):
- 🔒 "SSL Encrypted"
- 🚫 "Images never stored"  
- ⚡ "Enterprise detection engine"

Each item: 12px, `var(--text-muted)`, icon + text. Center-aligned. Subtle separator dots between them on larger widths.

Below that, a single line: "Powered by enterprise-grade AI infrastructure trusted by leading platforms globally." — 11px, `var(--text-muted)`, centered, max-width 280px, centered margin.

---

## Light/Dark Mode Toggle

- Position: top-right of the header bar
- Shape: pill toggle (like iOS switch), 44px × 24px
- Dark mode: dark bg, moon icon on the right
- Light mode: light bg, sun icon on the left
- Smooth transition on toggle — the entire page palette shifts via CSS custom properties applied to `:root`
- The toggle should feel premium — not a checkbox, a real styled component

---

## Animation & Interaction Details

- All state transitions: 300ms ease, no jarring cuts
- Upload zone hover: transition border + box-shadow + transform over 200ms
- Result card entrance: `translateY(16px) opacity(0)` → `translateY(0) opacity(1)` over 350ms ease-out
- Modal entrance: `scale(0.95) opacity(0)` → `scale(1) opacity(1)` over 250ms ease-out
- Progress bar fill: animated width transition over 600ms ease when depleting
- Scanline: CSS keyframes only — no JS animation loop needed
- Button active states: `scale(0.97)`, 120ms — makes every tap feel physical

---

## What NOT to Include in Phase 1

Do not write any of the following — these are Phase 2 and Phase 3:
- No actual API calls to Sightengine or any AI service
- No Node.js or Express server code
- No Stripe or payment processing logic
- No authentication (Google/Apple buttons are visual-only in this phase)
- No database or localStorage logic

All state changes are triggered by the demo buttons at the bottom of the page (small, labeled "Demo: [state name]" — these are dev tools, they can look minimal).

---

## Final Output

Deliver a single, complete `index.html` file. It must:
- Open in any browser by double-clicking (no server required)
- Look flawless on mobile (390px width) — test by resizing your browser
- Allow toggling through all 6 states using the demo buttons
- Run with zero errors in the browser console
- Have dark mode active by default, working light mode toggle

The goal: when someone opens this file, they should feel like they are looking at a real, funded startup product — not a mockup or a side project.
