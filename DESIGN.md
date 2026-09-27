---
name: Raifu
description: Mindful Indonesian nutrition tracking, dressed in the calm of a Japanese ryokan.
colors:
  sage: "#426449"
  sage-dark: "#35523b"
  sage-mid: "#4a6c51"
  sage-soft: "#e8efe7"
  sage-tint: "#f2f6f1"
  ink: "#1c1b1b"
  body: "#5f5d5d"
  muted: "#8a8787"
  cream: "#fcf9f8"
  mist: "#f6f3f2"
  stone: "#f0eded"
  line: "#eae7e7"
typography:
  display:
    fontFamily: "Shippori Mincho, Georgia, serif"
    fontWeight: 600
    lineHeight: 1.15
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 500
    letterSpacing: "0.18em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.sage}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.sage-dark}"
  button-secondary:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-ghost:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  card:
    backgroundColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "24px"
  pill-solid:
    backgroundColor: "{colors.sage}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  pill-sage:
    backgroundColor: "{colors.sage-soft}"
    textColor: "{colors.sage}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
---

# Design System: Raifu

## Overview

**Creative North Star: "The Quiet Ryokan"**

Raifu reads like the entrance to a calm Japanese inn: soft sage and warm cream tones, generous whitespace, a serif display face for moments that matter, and quiet borders instead of shadows doing the organizing. Nothing shouts. Numbers (calorie targets, macros, streak counts) get the display serif treatment so they feel like considered facts, not alarms — the opposite of a fitness app's urgency dashboard.

The system explicitly rejects loud fitness-app energy: no countdown timers, no red/orange danger-zone bars, no gamified urgency cues. Progress (rings, bars) always renders in the single sage accent, never a traffic-light palette. This mirrors the product's "no guilt tracking" principle from PRODUCT.md — the visual system must never make a number look like a failure.

**Key Characteristics:**
- Sage-and-cream palette with a single accent color used sparingly (never a full-saturation "brand wash")
- Serif display type (Shippori Mincho) for headlines and hero numbers; Inter for everything functional
- Flat-by-default surfaces bordered in a near-invisible hairline, not shadowed
- Occasional Japanese script (楽, 腹八分目) as philosophy marks, not a translation layer
- Rounded, soft-edged geometry throughout — no sharp corners, no aggressive shapes

## Colors

A restrained single-accent palette: one muted green carries all meaning (brand, success, selection, progress), surrounded by warm near-white neutrals and one near-black ink for text.

### Primary
- **Deep Forest Sage** (#426449): the only accent color in the system. Used for primary buttons, active/selected states, progress fills, links on hover, and small brand marks (leaf icon, streak badge). Also appears as **Sage Dark** (#35523b) for hover/active states and **Sage Mid** (#4a6c51) for secondary emphasis (e.g. italic accent text in headlines).
- **Sage Soft** (#e8efe7): the tint used for selected-option backgrounds, active pill backgrounds, and soft highlight panels (e.g. streak-protection callouts).
- **Sage Tint** (#f2f6f1): a lighter wash, reserved for the faintest background separations.

### Neutral
- **Ink** (#1c1b1b): headings and high-emphasis text.
- **Body** (#5f5d5d): default paragraph and secondary text color (also the page's base text color).
- **Muted** (#8a8787): eyebrow labels, captions, timestamps, placeholder text.
- **Cream** (#fcf9f8): page background — the "tatami floor" the whole system sits on.
- **Mist** (#f6f3f2): card-interior panels, input containers, chat bubble backgrounds.
- **Stone** (#f0eded): image placeholders, secondary button backgrounds, inactive step indicators.
- **Line** (#eae7e7): the universal hairline border color — every card, input, and divider uses this exact value.

### Named Rules
**The One Accent Rule.** Sage is the only color that carries meaning (selected, active, progress, success). No second accent color exists; do not introduce blue links, red errors, or orange warnings without a documented reason — reroute through sage-toned language ("perlu perhatian" in ink/body text) instead of alarm colors.

**The No Alarm Rule.** Never use red, orange, or amber to represent calorie overage, missed streaks, or incomplete goals. A missed day or exceeded target renders in the same neutral/sage vocabulary as everything else — consistent with the product's no-guilt tracking principle.

## Typography

**Display Font:** Shippori Mincho (self-hosted, latin subset; weights 400/600), with Georgia/serif fallback
**Body Font:** Inter (Google, latin subset), with ui-sans-serif/system-ui fallback
**Label/Mono Font:** none distinct — labels use Inter at smaller size with wide letter-spacing instead of a separate face

**Character:** A quiet mincho serif for moments of arrival (headlines, hero stat numbers, section titles) paired with a plain, highly legible sans for everything operational — the pairing reads as "considered statement, then clear instruction."

### Hierarchy
- **Display** (600 weight, `text-3xl`–`text-5xl`/clamp up to `3.4rem`, `leading-tight`/1.15): page H1s, hero headlines, and hero stat numbers (e.g. calorie targets, kcal totals). Always `font-serif` + `text-ink`.
- **Headline** (400–600 weight, `text-2xl`–`text-3xl`, `leading-snug`): section headers within a page (card group titles).
- **Title** (500 weight, `text-lg`–`text-xl`, serif): card/component titles nested under a headline.
- **Body** (400 weight, `text-sm`–`text-base`, `leading-relaxed`, color `text-body`): paragraph copy, descriptions; comfortable measure, not fixed to a ch value in code.
- **Label** (500 weight, `text-xs`, `tracking-[0.18em]`, uppercase, color `text-muted`): eyebrows, stat captions, section tags — the system's signature "quiet all-caps label" treatment.

### Named Rules
**The Serif-For-Facts Rule.** Any number the user should feel proud of or oriented by (kcal target, streak count, BMI, macro grams) renders in the serif display font with `tabular-nums`, never in the body sans — it's how the system marks "this number matters, sit with it."

## Layout

Content sits in a `max-w-7xl` (marketing/landing) or `max-w-[1400px]` (in-app) centered container with responsive horizontal padding (`px-4` → `sm:px-6` → `lg:px-10`/`lg:px-8`). Sections stack vertically with generous vertical rhythm (`py-16` to `py-24` on landing sections; `py-8` page padding in-app). In-app pages favor a two-column grid on large screens — a wider primary column (`1.4fr`–`1.7fr`) plus a narrower sticky sidebar (`1fr`) for live stats/summary cards (`lg:sticky lg:top-24`). Card grids use `gap-5`–`gap-6` and collapse from 3–4 columns down to 1–2 at `sm`/`lg` breakpoints. Density is calm, not compact: cards keep `p-5`–`p-8` internal padding rather than tight data-table spacing.

## Elevation & Depth

Flat-by-default. Nearly every surface (cards, inputs, panels) is separated by a 1px hairline border (`border-line`, #eae7e7) or a tonal background shift (white on mist, mist on cream) — never a drop shadow. The one confirmed exception is the landing-page hero scan card, which floats above the page with a soft, wide, low-opacity shadow to signal it as the singular "hero artifact" of the page.

### Shadow Vocabulary
- **Hero float** (`box-shadow: 0 24px 60px -30px rgba(28,27,27,0.35)`): reserved for the single most important visual artifact on a page (currently the landing-page AI-scan preview card). Do not apply to ordinary cards.

### Named Rules
**The Flat-Except-One Rule.** A page gets at most one shadowed "hero" element. Every other surface stays flat and relies on border/tone for separation.

## Shapes

Soft, rounded geometry throughout, scaled by component importance: buttons and inputs use `rounded-md` (~8px), cards and larger panels use `rounded-xl`/`rounded-2xl` (~12–16px), pills/badges/avatars/step-indicators/toggles use fully round (`rounded-full`). Borders are always the single hairline `border-line` color at 1px; no double borders, no dashed borders except explicit empty-state placeholders. Corners are never sharp (no `rounded-none`) outside of full-bleed images.

## Components

### Buttons
- **Shape:** `rounded-md` (~8px), `px-4 py-2.5`, `text-sm font-medium`
- **Primary:** solid sage background (#426449), white text; hover darkens to Sage Dark (#35523b)
- **Secondary:** white background, hairline border, ink text; hover border/text shift to sage
- **Ghost:** mist background, ink text; hover to stone
- **Focus:** 2px sage outline with offset (`focus-visible:outline-sage`)
- **Feel:** restrained and tactile — quiet at rest, a single clear color shift on hover/focus, never a scale/bounce animation.

### Chips / Pills
- **Solid:** sage background, white text — used for "active"/confirmed states (e.g. "Aktif", selected macro tag)
- **Sage (soft):** sage-soft background, sage text — the default informational pill (eyebrow tags, chat suggestion chips)
- **Outline:** white background, hairline border, body text — used for secondary/inline tags inside chat messages
- **Neutral:** mist background, body text — least-emphasis pill

### Cards / Containers
- **Corner Style:** `rounded-xl` (~12px) as the default; larger feature panels (calculator, CTA band) use `rounded-2xl` (~16px)
- **Background:** white on cream/mist page backgrounds; mist for nested panels inside a card
- **Shadow Strategy:** none — see Elevation & Depth; separation comes from the `border-line` hairline
- **Border:** 1px solid `border-line`
- **Internal Padding:** `p-5`–`p-8` depending on card density

### Inputs / Fields
- **Style:** white background, `border-line` hairline, `rounded-md`, `px-3.5 py-2.5`
- **Focus:** border shifts to sage plus a soft `ring-2 ring-sage/20` glow — no harsh outline
- **Placeholder:** muted gray text
- **Range sliders:** accent color set to sage (`accent-[var(--color-sage)]`) so native slider thumbs stay on-brand

### Navigation
- Sticky top bar, white/90 background with backdrop blur, transparent border until scrolled (then hairline appears). Nav links are body-colored text that turns sage on hover; the primary CTA is a solid sage button. Mobile collapses into a bordered icon-button-triggered panel with the same link list stacked and divided by hairlines.

### Progress Ring / Bar (signature component)
A conic-gradient ring (sage fill over sage-soft track) and a matching linear bar are the system's signature data visualization — used for calorie/macro completion everywhere. Both use only the single sage accent at any completion level; there is no color-coded threshold (e.g. turning red past 100%). This is the clearest expression of the No Alarm Rule.

## Do's and Don'ts

### Do:
- **Do** use the serif display face with `tabular-nums` for any number the user should feel oriented or proud of (targets, totals, streak counts, BMI).
- **Do** separate surfaces with the `border-line` hairline or a tonal background shift before reaching for a shadow.
- **Do** keep all progress indicators (rings, bars) in the single sage accent regardless of value.
- **Do** use the uppercase, wide-tracked `Eyebrow` label style for section tags and stat captions.

### Don't:
- **Don't** introduce a second accent color (blue, purple, teal) for links, selection, or emphasis — sage is the only accent.
- **Don't** use red/orange/amber to signal exceeded calories, missed streaks, or incomplete goals — this breaks the no-guilt product principle.
- **Don't** add drop shadows to ordinary cards or panels; reserve the single soft shadow for one hero artifact per page at most.
- **Don't** introduce sharp corners, dense data-table spacing, or countdown-timer urgency patterns — they read as generic fitness-app energy, which this system explicitly rejects.
