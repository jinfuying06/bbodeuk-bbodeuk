---
name: 뽀득뽀득
description: A mobile cleaning record where tapping an item paints its space in pastel, and the color fades gently instead of scoring you.
colors:
  sky-brand: "#56d9d2"
  sky-deep: "#146b63"
  sky-tint: "#e5f8f5"
  sky-sky: "#8de3db"
  onbrand: "#123c36"
  sky-ink: "#23282b"
  sky-muted: "#60676b"
  sky-line: "#e3e6e8"
  sky-bg: "#f6f7f8"
  sky-white: "#ffffff"
  art-line: "#64807a"
  scrim: "rgba(20, 26, 24, 0.7)"
  sky-bath: "#dceefe"
  space-bath-icon: "#41758e"
  sky-kitchen: "#fbe8d4"
  space-kitchen-icon: "#95613c"
  sky-living: "#e9e1fa"
  space-living-icon: "#766095"
  sky-bed: "#e2efda"
  space-bed-icon: "#5e7d4f"
typography:
  bb-display:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, Malgun Gothic, Apple SD Gothic Neo, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: "42px"
    letterSpacing: "0"
  bb-heading:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: "36px"
    letterSpacing: "0"
  bb-title:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: "28px"
    letterSpacing: "0"
  bb-label:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "22px"
    letterSpacing: "0"
  bb-body:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "22px"
    letterSpacing: "0"
  bb-label-sm:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: "19px"
    letterSpacing: "0"
  bb-caption:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "18px"
    letterSpacing: "0"
  bb-small:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: "16px"
    letterSpacing: "0"
rounded:
  DEFAULT: "4px"
  lg: "8px"
  xl: "12px"
  tile: "14px"
  row-sm: "16px"
  row: "18px"
  2xl: "20px"
  3xl: "24px"
  full: "9999px"
spacing:
  space-xxs: "4px"
  space-xs: "8px"
  space-sm: "12px"
  space-md: "16px"
  space-lg: "20px"
  space-xl: "24px"
  space-2xl: "32px"
  margin-screen: "24px"
  header: "54px"
components:
  button-primary:
    backgroundColor: "{colors.sky-brand}"
    textColor: "{colors.onbrand}"
    typography: "{typography.bb-label}"
    rounded: "{rounded.2xl}"
    height: "56px"
  button-secondary:
    backgroundColor: "{colors.sky-tint}"
    textColor: "{colors.sky-deep}"
    typography: "{typography.bb-label}"
    rounded: "{rounded.2xl}"
    height: "52px"
  button-disabled:
    backgroundColor: "{colors.sky-line}"
    textColor: "{colors.sky-muted}"
  text-link:
    textColor: "{colors.sky-deep}"
    typography: "{typography.bb-label}"
    height: "44px"
  chip:
    backgroundColor: "{colors.sky-white}"
    textColor: "{colors.sky-muted}"
    typography: "{typography.bb-label}"
    rounded: "{rounded.full}"
    height: "44px"
    padding: "0 16px"
  chip-selected:
    backgroundColor: "{colors.sky-brand}"
    textColor: "{colors.onbrand}"
  item-row:
    backgroundColor: "{colors.sky-white}"
    rounded: "{rounded.row}"
    height: "64px"
    padding: "0 0 0 12px"
  switch-row:
    backgroundColor: "{colors.sky-white}"
    rounded: "{rounded.row-sm}"
    height: "62px"
    padding: "0 16px"
  check-row:
    backgroundColor: "{colors.sky-white}"
    rounded: "{rounded.2xl}"
    height: "48px"
    padding: "0 16px 0 12px"
  space-tile:
    rounded: "{rounded.tile}"
    size: "40px"
  info-card:
    backgroundColor: "{colors.sky-tint}"
    rounded: "{rounded.3xl}"
    padding: "16px 20px"
  dialog:
    backgroundColor: "{colors.sky-white}"
    rounded: "{rounded.2xl}"
    width: "342px"
    padding: "22px 20px 20px"
  text-field:
    backgroundColor: "{colors.sky-white}"
    textColor: "{colors.sky-ink}"
    typography: "{typography.bb-body}"
    rounded: "{rounded.xl}"
    height: "52px"
    padding: "0 16px"
  header:
    backgroundColor: "{colors.sky-bg}"
    height: "54px"
  bottom-nav:
    backgroundColor: "{colors.sky-white}"
    typography: "{typography.bb-small}"
    height: "72px"
  toast-ink:
    backgroundColor: "{colors.sky-ink}"
    textColor: "{colors.sky-white}"
    typography: "{typography.bb-label-sm}"
    rounded: "{rounded.row}"
    height: "52px"
  toast-pill:
    backgroundColor: "{colors.sky-deep}"
    textColor: "{colors.sky-white}"
    typography: "{typography.bb-label-sm}"
    rounded: "{rounded.3xl}"
    height: "48px"
    width: "310px"
---

# Design System: 뽀득뽀득

## Overview

**Creative North Star: "The Room That Stays Painted"**

뽀득뽀득 records cleaning as color, not as a checklist. Tapping an item fills its card with the space's pastel; over the item's recommended cycle that fill thins in four soft stages but never disappears. Everything else stays quiet: a cool off-white page, white rounded surfaces, one mint-teal accent, and deep teal for anything that navigates. The atmosphere is ambient and non-punitive: nothing scores, warns, or scolds.

Density is a single calm column on a phone: 24px gutters, 12px between blocks, rows of 62-72px, generous touch targets. Depth comes from white-on-off-white tonal layering, not shadows. Motion is small and tactile: cards press to 0.97, the primary button throws one glass-like specular sweep per tap, and fades interpolate rather than step.

Sources of truth, in order: Figma page `02 · 전체 앱 — Light` (primary visual reference) and `01 · 디자인 시스템`, then this file, then shipped code. Figma also defines a full dark palette; it is deliberately not implemented. This system is light mode only until that decision changes.

**Key Characteristics:**
- Color means "cared for recently"; its absence never means failure.
- One accent (mint `sky-brand`) for primary action and selection; deep teal (`sky-deep`) for links, active nav, header titles, focus.
- Four space pastels, each paired with a darker icon ink that never fades.
- Flat tonal layering; shadow only on transient toasts.
- Pretendard Variable throughout, Korean-first, zero letter-spacing.

## Colors

A cool neutral field with a single mint-teal accent family and four room pastels that carry the record itself.

### Primary
- **Mint Glass** (`sky-brand`): fill of the primary Glass Button, selected chips, switch-on track, check-on circle, text-field focus border.
- **Deep Teal** (`sky-deep`): tab-root header title, back chevron, active nav tab, text links, trailing row chevrons, balance numbers, focus ring, pill toast fill. The "this goes somewhere" color.
- **Mint Mist** (`sky-tint`): secondary button fill, info/tip cards, locked switch track, hint strips.
- **On-Brand Ink** (`onbrand`): text and icons on Mint Glass (AA 7.1:1).
- **Sea Glass** (`sky-sky`): text selection highlight and small illustration accents.

### Secondary: Space pastels (the record)
Each space has a fill and an icon ink. Fill paints tiles and recorded cards; icon ink stays at 100% on every fade stage.
- **Bath Sky** (`sky-bath`) with **Bath Slate** (`space-bath-icon`) for 욕실.
- **Kitchen Apricot** (`sky-kitchen`) with **Kitchen Umber** (`space-kitchen-icon`) for 주방.
- **Living Lilac** (`sky-living`) with **Living Plum** (`space-living-icon`) for 거실.
- **Bedroom Sage** (`sky-bed`) with **Bedroom Moss** (`space-bed-icon`) for 방. (Expansion space 베란다 reuses the sage fill with `sky-deep` as its icon ink.)

### Neutral
- **Charcoal Ink** (`sky-ink`): headings, row titles, ink toast fill.
- **Slate Muted** (`sky-muted`): body copy, subtitles, meta, inactive nav, unselected chip text (AA ≥4.8:1 on white and on every space fill).
- **Hairline** (`sky-line`): borders, switch-off track, check-off circle, disabled button fill, and the desktop backdrop outside the phone column.
- **Porcelain Page** (`sky-bg`): app/page and header background.
- **White** (`sky-white`): every card, row, nav bar, dialog and field surface.
- **Art Line** (`art-line`): strokes in exported illustrations only.
- **Scrim** (`scrim`): full-screen dialog backdrop over header and nav.

### Named Rules
**The Fade, Never Vanish Rule.** A recorded item's fill = space color at 100 / 72 / 48 / 28% as elapsed ÷ recommended cycle crosses 0 / 0.6 / 0.85 / ≥1.1, linearly interpolated between stops. It floors at 28%. A never-recorded item is white (0), not 28%. A space's fill is the average of its items' fades. Icons and text never fade. Implemented in `fadeForStaleness` / `itemFade` / `spaceFade` in `src/data/cleaning.ts`; do not reimplement.

**The Neutral Field Rule.** Page, header and surfaces stay neutral; pastels appear only on space tiles, recorded/selected cards and the home canvas.

**The Tokens Only Rule.** No raw hex in TSX or CSS; space colors come from `getSpace(key)` / `spaceColor(key, alpha)`. Exception: exported illustration fills and sweep gradients.

## Typography

**Body Font:** Pretendard Variable (fallbacks: Pretendard, -apple-system, BlinkMacSystemFont, Malgun Gothic, Apple SD Gothic Neo, system-ui, sans-serif), loaded from the jsDelivr Pretendard v1.3.9 variable stylesheet.

**Character:** One neutral Korean grotesque for everything; hierarchy is size and weight (400/500/700), never letter-spacing or case. Figma's `Noto Sans KR` text styles are intentionally replaced by Pretendard (user decision).

### Hierarchy
- **Display** (`bb-display`): point balance numbers only, in Deep Teal.
- **Heading** (`bb-heading`): page intro h1 (`PageIntro`), Charcoal Ink.
- **Title** (`bb-title`): section h2, info-card and dialog titles; tab-root header title in Deep Teal.
- **Label** (`bb-label`): row/card titles, field labels, chips, button labels, text links, sub-page header title.
- **Body** (`bb-body`): intro sub-copy, card and dialog body, field text; usually Slate Muted.
- **Label Small** (`bb-label-sm`): toasts, small text links, empty-card copy.
- **Caption** (`bb-caption`): row subtitles, meta, section links ("공간 관리 ›").
- **Small** (`bb-small`): bottom-nav labels.

The older non-`bb` tokens in `tailwind.config.js` (`headline-*`, `title-*`, `body-*`, `label-*`, `caption`) remain for legacy screens; new work uses `bb-*`. The `fontSize` token values themselves are frozen (AGENTS.md §6); per-screen heading size choices (e.g. Welcome 28/26) are allowed.

### Named Rules
**The Weight Not Tracking Rule.** Letter-spacing is 0 everywhere; emphasis is weight 700 or Deep Teal color.

## Layout

- **Frame:** designed at 390×844. The phone column is `max-width: 430px`, centered, on Porcelain Page; outside it on desktop the body shows Hairline.
- **Gutter:** 24px (`margin-screen`) on every screen. Main column gap 12px is dominant.
- **Chrome:** fixed header 54px + top safe area; content starts flush beneath it (`pt-header`). No-nav flow pages (login, sign-up, point check, delete-done) add a 20px top gap (`pt-header-flow`).
- **Bottom nav:** fixed, 12px top pad + 48px tab row + max(12px, bottom safe area). Screens with nav end with 24px of clearance (`pb-nav`); the one fixed CTA bar (76px, 주말 대청소) stacks above it (`pb-nav-cta`).
- **Touch:** every interactive target is at least 44×44 (icon buttons, text links, chips, chevron slots); whole rows are the target for switches and checks.
- **Stacking:** fixed CTA bar 40 · header/nav 50 · dialog 60 · toast 70 (feedback stays visible over dialogs).
- **Home canvas:** 2-column grid of 110px space cards; an odd last card spans both columns.

## Elevation & Depth

Flat by default. Depth is tonal: white surfaces on the Porcelain page, scrim for modals. Shadows exist only on transient feedback and in press states.

### Shadow Vocabulary
- **Ink toast lift** (`box-shadow: 0 8px 24px rgba(0,0,0,0.16)`): top ink toast.
- **Pill toast lift** (`box-shadow: 0 4px 12px rgba(0,0,0,0.16)`): bottom pill toast.
- **Glass press** (`box-shadow: inset 0 2px 4px rgba(0,77,102,0.12)`): Glass Button while pressed.

### Named Rules
**The Flat Surface Rule.** Cards, rows, tiles and dialogs carry no drop shadow; separation is white-on-off-white plus radius.

## Shapes

Soft, consistently rounded rectangles, scaled to the element: 40px space tile 14px (`tile`), switch/nav row 16px (`row-sm`), item row and ink toast 18px (`row`), cards, record cards, check rows, dialogs and the Glass Button 20px (`2xl`), info cards and pill toast 24px (`3xl`), text fields 12px (`xl`), chips and switches fully round. Borders are rare: 1px Hairline on fields, 1px white on the Glass Button, and on QuickRecord item cards a 1px border in the space's icon ink.

Icons are a single SVG registry (`src/components/icons`): UI glyphs on a 24px grid at 2.4 stroke (chevron, check, plus, more, account, sparkle), plus nav-, space- and object- sets. Space icons render in their icon ink.

## Components

### Buttons (Glass Button)
Tactile and bright: a mint slab that catches light when tapped.
- **Shape:** 20px radius, 1px white border, full width, `overflow: hidden`, 56px tall for main CTAs, 52px for secondary/in-list/flow buttons.
- **Primary:** Mint Glass fill, On-Brand Ink label (`bb-label`). **Secondary:** Mint Mist fill, Deep Teal label.
- **Press:** inset Glass press shadow (120ms ease-out) plus one specular sweep per tap: a 90×130 white band (0→0.65→0 alpha) rotated 18° travels left→right in 480ms `cubic-bezier(0.2,0.7,0.2,1)`, remounted on each press.
- **Disabled:** Hairline fill, Slate Muted label, no sweep.
- **Focus:** 2px Deep Teal ring drawn inset (-4px) because the button clips.
- **Text link:** Deep Teal `bb-label` (or `bb-label-sm`) in a 44px-tall box; used for 취소, secondary navigation and "기록 취소".

### Chips (Pill)
- **Style:** fully round, `bb-label`. Unselected White / Slate Muted; selected Mint Glass / On-Brand Ink; 150ms color transition.
- **Sizes:** 44px segmented chip, 38px space/filter pill (optional 16px space icon in its icon ink), 72px point package.

### Cards / Containers
- **Item row:** White, 18px radius, 64 or 72px tall, 12px left pad, 12px gap: 40px space tile, title `bb-label` Ink over subtitle `bb-caption` Muted, chevron in a 44px trailing slot (Deep Teal, or Muted for recent-record rows). Presses to 0.97.
- **Space tile:** 40px, 14px radius, space fill with icon ink (24px icon); on an already-filled row it becomes 70% white.
- **Home space card:** White 20px card, 110px tall, with the space color laid in at its current fade; label/icon stay full strength.
- **Record card (QuickRecord):** White 20px card bordered in space icon ink; tapping fills it with the space color (300ms), tapping again the same day clears it.
- **Info card:** 24px radius, 16px/20px padding, 8px gap; Mint Mist for tips/points, White for FAQ.

### Inputs / Fields
- **Style:** 52px, 12px radius, White, 1px Hairline, `bb-body` Ink, Muted placeholder, 16px side padding.
- **Focus:** border shifts to Mint Glass; no outline ring (fields are the one exception to the global focus ring).

### Switch & Check rows
- **Switch row:** whole 62px White row (16px radius) is the `role="switch"`. Track 52×32: Mint Glass on, Hairline off, Mint Mist when locked; 24px white thumb slides 20px in 200ms ease-out.
- **Check row:** 48px White row (20px radius), 24px circle: Hairline off, Mint Glass with On-Brand check on, Mint Mist with Deep Teal check when locked. May fill with the space color when on (대청소).

### Navigation
- **Header:** Porcelain Page, 54px. Tab-root variant: Deep Teal `bb-title` left, account icon (Muted, 44px) right to 내 정보. Sub-page variant: Deep Teal back chevron (44px, falls back to /home on direct entry), centered Ink `bb-label` title, decorative "more" or an empty 44px spacer on the right.
- **Bottom nav:** White, five tabs 홈 / 공간 / 기록 / 히스토리 / 가이드, each 64×48 with a 22px icon over a `bb-small` label, 3px gap. Active Deep Teal, inactive Slate Muted; sub-pages light their parent tab.

### Dialog
Scrim over everything; White 342px card, 20px radius, 16px gap: `bb-title` Ink title, `bb-body` Muted body, primary Glass Button 56, 취소 text link. Focus moves to 취소; Escape and scrim tap close; body scroll locks.

### Toasts
- **Ink toast (top):** record events. Charcoal Ink, 52px, 18px radius, check icon + `bb-label-sm` white, 62px below the top edge.
- **Pill toast (bottom):** settings/item saved and "준비 중" notices (no icon). Deep Teal, 310×48, 24px radius, 26px above the bottom.
- **Motion:** fade + 8px slide in 200ms ease-out; auto-hide after 2s. Route hand-offs carry the message in router state and clear it so refresh does not replay.

### Motion summary
- **Press:** `scale(0.97)` for 120ms ease-out on tappable cards/rows.
- **Glass sweep:** as above, 480ms.
- **Fill:** record fill and tile color transition 300ms; fades interpolate continuously between the four stages.
- **Soft bob:** 6px float, 1.8s loop, for onboarding illustration only.
- **Reduced motion:** press scale, sweep and bob are removed; color changes remain.

### Content & voice
Korean, soft 해요체, short. Color and copy describe care, never judgment.
- **Canonical phrases:** save toast `청소 기록을 저장했어요`; undo toast `청소 기록을 취소했어요`; undo action `기록 취소`; just-now (<10 min) `방금 돌봤어요`; recency `오늘 기록 · 어제 기록 · N일 전 기록 · 아직 기록 없음` (short form `오늘 · 어제 · N일 전 · 기록 없음`); coming-soon `준비 중이에요`.
- **Fade stage labels (from `FADE_STAGES`, one wording app-wide):** 100% `최근 관리했어요`, 72% `잘 유지되고 있어요`, 48% `슬슬 다시 볼 때예요`, 28% `한번 관리해볼까요?`.
- **Banned words:** 미완료, 실패, 지연, overdue, 위험, 더러움. No cleanliness scores or completion percentages shown to users.
- **Price:** the one expansion price comes from `SPACE_PRICE` (300P); never hard-code it in copy.

## Do's and Don'ts

### Do:
- **Do** use `GlassButton` for every filled CTA (56 primary / 52 secondary), and the 44px Deep Teal text link for everything lighter.
- **Do** derive every space fill from `getSpace` / `spaceColor` and every fade from `spaceFade` / `itemFade`, keeping icons and text at 100%.
- **Do** keep 24px gutters, 12px block gaps, 44px minimum targets, and `pb-nav` on every screen with the bottom nav.
- **Do** reuse `ItemRow`, `SpaceTile`, `SwitchRow`, `CheckRow`, `PageIntro`, `Pill`, `Dialog`, `Toast`/`useRouteToast` before writing a new row, card or modal.
- **Do** take icons from the SVG registry and fade-stage wording from `FADE_STAGES`.

### Don't:
- **Don't** let a fill drop below 28% or render "stale" as a warning color; there is no red/amber state in this system.
- **Don't** use the banned words or show a cleanliness score.
- **Don't** add drop shadows to cards, rows, tiles or dialogs.
- **Don't** use typographic glyphs (‹ › ⋯ ✓ ＋ ✦) or Material Symbols for UI icons.
- **Don't** ship dark mode or the old MD3 blue palette; dark tokens live in Figma only for now.
- **Don't** change `fontSize` token values in `tailwind.config.js`.
