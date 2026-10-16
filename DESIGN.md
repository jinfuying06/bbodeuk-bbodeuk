---
name: 뽀득뽀득
description: A mobile cleaning record where tapping an item paints its space in pastel, and the color fades gently instead of scoring you.
colors:
  sky-brand: "#38aeee"
  sky-deep: "#3e5463"
  sky-tint: "#e8eef2"
  sky-tint-ink: "#3e5463"
  sky-sky: "#8fd8ff"
  onbrand: "#0a3149"
  sky-ink: "#23282b"
  sky-muted: "#60676b"
  sky-line: "#e3e6e8"
  sky-bg: "#ffffff"
  sky-surface: "#f2f5f7"
  sky-white: "#ffffff"
  art-line: "#5b7a8c"
  art-tint: "#e3f5ff"
  scrim: "rgba(20, 26, 24, 0.7)"
  sky-bath: "#c4f2ff"
  space-bath-icon: "#00718c"
  sky-kitchen: "#fff8c4"
  space-kitchen-icon: "#996100"
  sky-living: "#ffd0c4"
  space-living-icon: "#9f4325"
  sky-bed: "#c7ffc4"
  space-bed-icon: "#27762f"
  sky-space1: "#e9c4ff"
  space-space1-icon: "#724695"
  sky-space2: "#ffe8c4"
  space-space2-icon: "#7e5f30"
  sky-space3: "#ffc4f7"
  space-space3-icon: "#7e3073"
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
    backgroundColor: "{colors.sky-slate}"
    textColor: "{colors.sky-white}"
    typography: "{typography.bb-label}"
    rounded: "{rounded.2xl}"
    height: "56px"
  button-secondary:
    backgroundColor: "{colors.sky-surface}"
    textColor: "{colors.sky-slate}"
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
    backgroundColor: "{colors.sky-surface}"
    textColor: "{colors.sky-muted}"
    typography: "{typography.bb-label}"
    rounded: "{rounded.full}"
    height: "44px"
    padding: "0 16px"
  chip-selected:
    backgroundColor: "{colors.sky-deep}"
    textColor: "{colors.sky-white}"
  item-row:
    backgroundColor: "{colors.sky-surface}"
    rounded: "{rounded.row}"
    height: "64px"
    padding: "0 0 0 12px"
  switch-row:
    backgroundColor: "{colors.sky-surface}"
    rounded: "{rounded.row-sm}"
    height: "62px"
    padding: "0 16px"
  check-row:
    backgroundColor: "{colors.sky-surface}"
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
    backgroundColor: "{colors.sky-bg}"
    rounded: "{rounded.2xl}"
    width: "342px"
    padding: "22px 20px 20px"
  text-field:
    backgroundColor: "{colors.sky-bg}"
    textColor: "{colors.sky-ink}"
    typography: "{typography.bb-body}"
    rounded: "{rounded.xl}"
    height: "52px"
    padding: "0 16px"
  header:
    backgroundColor: "{colors.sky-bg}"
    height: "54px"
  bottom-nav:
    backgroundColor: "{colors.sky-bg}"
    borderTop: "1px solid {colors.sky-line}"
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

뽀득뽀득 records cleaning as color, not as a checklist. Tapping an item fills its card with the space's pastel like rising water; over the item's recommended cycle the water level drops in four soft stages but never drains. Everything else stays quiet: a white page, soft blue-gray rounded surfaces, deep ocean blue for anything you press or that navigates, and sky blue only as a small brand accent. The atmosphere is ambient and non-punitive: nothing scores, warns, or scolds.

Density is a single calm column on a phone: 24px gutters, 12px between blocks, rows of 62-72px, generous touch targets. Depth comes from Surface-on-white tonal layering, not shadows. Motion is small and tactile: cards press to 0.97, the primary button throws one glass-like specular sweep per tap, and water levels interpolate rather than step.

Sources of truth, in order:
1. **Colors:** this file and `tailwind.config.js` are the color source of truth. Values are the original Figma `Page 5` (`Palette & Components / Light`) hex values, as chosen by the user 2026-10-15; the OKLCH-normalized palette experiment was reverted. Brand is `#38aeee`; since 2026-10-15 the interactive (primary) color is Slate `#3e5463` with white labels and Surface is `#f2f5f7` (see Color roles). Pages `01 · 디자인 시스템`, `02 · 전체 앱 — Light`, `03`, `04` and the `BB / Sky Blue` variables still carry the older mint palette; where they disagree, this file wins.
2. **Everything else:** Figma page `02 · 전체 앱 — Light` (primary visual reference) and `01 · 디자인 시스템`, then this file, then shipped code.

Figma Page 5 also defines a full dark palette; it is deliberately not implemented. This system is light mode only until that decision changes.

**Key Characteristics:**
- Color means "cared for recently"; its absence never means failure.
- Slate (`sky-deep`, white labels) for the one filled button per screen and for every selection, switch, check, link, active nav, header title and focus; sky blue (`sky-brand`) is a small brand accent only.
- Four core space pastels plus three expansion pastels, each paired with a darker icon ink that never fades.
- Flat tonal layering; shadow only on transient toasts.
- Pretendard Variable throughout, Korean-first, zero letter-spacing.

## Colors

A white neutral field with a navy interactive color, a small sky-blue brand accent, and seven room pastels that carry the record itself.

### Color roles (2026-10-15, user-approved)
Every color does exactly one job:
1. **Identity — space color.** 100% space fill + icon ink on space tiles, the guide hero block, AX onboarding tints. Never faded. Since 2026-10-16 color also appears *before* Home wherever a space appears: 공간 설정 / 공간 관리 rows (full while on, 22% while off), the Welcome demo card and 3/3 tiles, empty photo slots (50%; 12% once a photo is in so the photo leads), the Care featured card (50%), the expansion card (offered space at 50%). Rule of thumb: color goes where content is, never on controls (chips, segmented, selection).
2. **State — water level only.** Recency is a water level of the space color (`<WaterFill>`) on Home cards, Spaces item rows and the SpaceInfo band. Never recorded = plain Surface, no tint. Recorded at least once = 18% base tint (`WATER_BASE_TINT`) under a water level of 100 / 72 / 48 / 28%.
3. **Interactive — Slate** (`sky-deep` = `#3e5463` since 2026-10-15; the old Deep Ocean navy `#16587f` and the interim Water Blue `#0b74b0` are retired so the app has one accent) with white labels: buttons, switches, checks, every selection chip including space chips (2026-10-16), field focus, links, active nav.
3a. **Buttons — one filled per screen** (2026-10-15, user-approved): only the screen's key action is a filled Slate button with a white label (7.9:1); every other button is tonal — Slate Mist (`sky-tint`, `#e8eef2`) fill with a Slate label (`sky-tint-ink`, 6.8:1). Ink #23282b read too heavy and Water Blue #0b74b0 fought the pastel space colors; Slate used sparingly keeps the pastels in front.
4. **Brand sky** (`sky-brand`): small accents only — logo/favicon, illustrations, sparkles, the AI-setup card outline. Never a button, chip, switch or check fill.

### Primary
- **Slate** (`sky-deep`, `#3e5463`): the interactive color. Selected non-space chips, switch-on track, check-on circle, text-field focus border, PhotoSetup progress (active) — all with white labels/glyphs (7.9:1). Also tab-root header title, back chevron, active nav tab, text links, trailing row chevrons, focus ring, pill toast fill (AA 7.9:1 on white, 7.2:1 on Surface, 6.8:1 on Slate Mist).
- **Sky Glass** (`sky-brand`, `#38aeee`): brand accent only (Color roles §4). 2.48:1 on white, so never used for text or as the only state cue.
- **Slate Mist** (`sky-tint`): info/tip cards, locked switch track, hint strips.
- **On-Brand Ink** (`onbrand`, `#0a3149`): navy for text on Sky Glass (5.5:1). Now only used by the dev-only SamplePaint screen.
- **Cloud Blue** (`sky-sky`): text selection highlight and small illustration accents.

### Secondary: Space pastels (the record)
Each space has a fill (Figma Page 5 originals) and an icon ink (2026-10-15: a clear, deep shade of the same hue, replacing the earlier olive/brick earth tones). Fill paints tiles, selected space chips and the water in recorded cards; icon ink stays at 100% on every water level.

Core spaces:
- **Bath Sky** (`sky-bath`) with **Bath Teal** (`space-bath-icon`) for 욕실.
- **Kitchen Lemon** (`sky-kitchen`) with **Kitchen Amber** (`space-kitchen-icon`) for 주방.
- **Living Coral** (`sky-living`) with **Living Terracotta** (`space-living-icon`) for 거실.
- **Bedroom Leaf** (`sky-bed`) with **Bedroom Green** (`space-bed-icon`) for 방.

Expansion spaces (user-added; display names are user-defined, tokens are positional):
- **공간1 Lavender** (`sky-space1`) with **Violet** (`space-space1-icon`).
- **공간2 Apricot** (`sky-space2`) with **Bronze** (`space-space2-icon`).
- **공간3 Pink** (`sky-space3`) with **Berry** (`space-space3-icon`).

Expansion spaces have no dedicated glyph yet; until one exists, their tiles show color only (no icon) rather than borrowing a core space's icon.

| Space | Fill | Icon ink | Icon on fill |
|---|---|---|---|
| 욕실 | `#c4f2ff` | `#00718c` | 4.68:1 |
| 주방 | `#fff8c4` | `#996100` | 4.79:1 |
| 거실 | `#ffd0c4` | `#9f4325` | 4.56:1 |
| 방 | `#c7ffc4` | `#27762f` | 4.98:1 |
| 공간1 | `#e9c4ff` | `#724695` | 4.56:1 |
| 공간2 | `#ffe8c4` | `#7e5f30` | 4.93:1 |
| 공간3 | `#ffc4f7` | `#7e3073` | 5.67:1 |

Icon inks are graphics (≥3:1 non-text rule) and all clear 4.5:1 on their fill; still, set text in Ink, not in an icon ink.

### Neutral
- **Charcoal Ink** (`sky-ink`): headings, row titles, selected space-chip labels, ink toast fill (≥9.7:1 on every space fill, 13.6:1 on Surface).
- **Slate Muted** (`sky-muted`): body copy, subtitles, meta, inactive nav, unselected chip text. AA on white (5.8:1) and Surface (5.2:1). On a space fill it passes on 욕실 (4.79), 주방 (5.34), 방 (5.08) and 공간2 (4.82) but fails on 거실 (4.13), 공간1 (3.78) and 공간3 (3.97): small meta text on a (near-)100% fill of those spaces uses Charcoal Ink instead, via `metaTextOnFill(key)` in `src/data/cleaning.ts`.
- **Hairline** (`sky-line`): borders, bottom-nav top border, switch-off track, check-off circle, disabled button fill, and the desktop backdrop outside the phone column.
- **White Page** (`sky-bg`): app/page, header, bottom nav, dialog and text-field background.
- **Surface** (`sky-surface`, `#f2f5f7`): every card, row, chip and tile surface that sits on the page; a faintly slate-tinted gray to sit with the Slate accent. Also the "never recorded" state (no tint).
- **White** (`sky-white`): literal white only — text on filled toasts, Glass Button border, switch thumb, specular sweep. Not a surface token.
- **Art Line** (`art-line`) and **Art Tint** (`art-tint`): strokes and tinted fills in exported illustrations only.
- **Scrim** (`scrim`): full-screen dialog backdrop over header and nav.

### Dark (reference only, not shipped)
Figma Page 5 defines the dark counterpart: brand `#4ec4ff` with `#0b3550` label, bg `#131617`, card `#202527`, ink `#f1f3f5`, muted `#a9b1b6`, line `#383f44`, secondary button `#173447` / `#8fd8ff`. Dark space fills/icon inks: 욕실 `#274249`/`#b0dce8`, 주방 `#494527`/`#e8e1b0`, 거실 `#492e27`/`#e8bbb0`, 방 `#294927`/`#b3e8b0`, 공간1 `#3c2749`/`#d3b0e8`, 공간2 `#493c27`/`#e8d2b0`, 공간3 `#492744`/`#e8b0e0`. Do not add these to code until dark mode is approved.

### Named Rules
**The Fade, Never Vanish Rule.** A recorded item's water level = 100 / 72 / 48 / 28% of the card/row as elapsed ÷ recommended cycle crosses 0 / 0.6 / 0.85 / ≥1.1, linearly interpolated between stops, over an 18% base tint of the space color. It floors at 28%. A never-recorded item shows the plain Surface (level 0, no base tint), not 28%. A space's level is the average of its items' fades. Icons and text never fade. The card/row background comes from `waterBase(key, fade)`. Implemented in `fadeForStaleness` / `itemFade` / `spaceFade` in `src/data/cleaning.ts`; do not reimplement.

**The Neutral Field Rule.** Page, header and surfaces stay neutral; pastels appear only as identity (space tiles, space chips, CareAction header) and as recorded-state water.

**The Tokens Only Rule.** No raw hex in TSX or CSS; space colors come from `getSpace(key)` / `spaceColor(key, alpha)`. Exception: exported illustration fills and sweep gradients.

## Typography

**Body Font:** Pretendard Variable (fallbacks: Pretendard, -apple-system, BlinkMacSystemFont, Malgun Gothic, Apple SD Gothic Neo, system-ui, sans-serif), loaded from the jsDelivr Pretendard v1.3.9 variable stylesheet.

**Character:** One neutral Korean grotesque for everything; hierarchy is size and weight (400/500/700), never letter-spacing or case. Figma's `Noto Sans KR` text styles are intentionally replaced by Pretendard (user decision).

### Hierarchy
- **Display** (`bb-display`): reserved; not currently used.
- **Heading** (`bb-heading`, 26px): every screen's big h1 — `PageIntro`, Home headline, Welcome steps, photo setup flow — Charcoal Ink. **One-line rule (2026-10-16):** the h1 fits one line on a 390px phone; if it doesn't, shorten it and move the rest into the Muted body line. Only exception: the login brand block (tagline + `뽀득뽀득`, centered).
- **Title** (`bb-title`): section h2, info-card and dialog titles; tab-root header title in Ink (Home adds the round brand logo before it).
- **Label** (`bb-label`): row/card titles, field labels, chips, button labels, text links, sub-page header title.
- **Body** (`bb-body`): intro sub-copy, card and dialog body, field text; usually Slate Muted.
- **Label Small** (`bb-label-sm`): toasts, small text links, empty-card copy.
- **Caption** (`bb-caption`): row subtitles, meta, section links ("공간 관리 ›").
- **Small** (`bb-small`): bottom-nav labels.

The older non-`bb` tokens in `tailwind.config.js` (`headline-*`, `title-*`, `body-*`, `label-*`, `caption`) remain for legacy screens; new work uses `bb-*`. The `fontSize` token values themselves are frozen (AGENTS.md §6); per-screen heading sizes are retired: Welcome (28) and the photo flow (25) now use `bb-heading` too.

### Named Rules
**The Weight Not Tracking Rule.** Letter-spacing is 0 everywhere; emphasis is weight 700 or Slate color.

## Layout

- **Frame:** designed at 390×844. The phone column is `max-width: 430px`, centered, on White Page; outside it on desktop the body shows Hairline.
- **Gutter:** 24px (`margin-screen`) on every screen. Main column gap 12px is dominant.
- **Chrome:** fixed header 54px + top safe area; content starts flush beneath it (`pt-header`). No-nav flow pages (login, sign-up, delete-done) add a 20px top gap (`pt-header-flow`).
- **Bottom nav:** fixed, 1px Hairline top border, 12px top pad + 48px tab row + max(12px, bottom safe area). Screens with nav end with 24px of clearance (`pb-nav`); the one fixed CTA bar (76px, 주말 대청소) stacks above it (`pb-nav-cta`).
- **Touch:** every interactive target is at least 44×44 (icon buttons, text links, chips, chevron slots); whole rows are the target for switches and checks.
- **Stacking:** fixed CTA bar 40 · header/nav 50 · dialog 60 · toast 70 (feedback stays visible over dialogs).
- **Home canvas:** 2-column grid of 110px space cards; an odd last card spans both columns.

## Elevation & Depth

Flat by default. Depth is tonal: blue-gray Surface on the White Page, scrim for modals. Shadows exist only on transient feedback and in press states.

### Shadow Vocabulary
- **Ink toast lift** (`box-shadow: 0 8px 24px rgba(0,0,0,0.16)`): top ink toast.
- **Pill toast lift** (`box-shadow: 0 4px 12px rgba(0,0,0,0.16)`): bottom pill toast.
- **Glass press** (`box-shadow: inset 0 2px 4px rgba(0,40,64,0.28)`): Glass Button while pressed (deepened 2026-10-15 so it reads on the navy fill).

### Named Rules
**The Flat Surface Rule.** Cards, rows, tiles and dialogs carry no drop shadow; separation is Surface-on-white plus radius.

## Shapes

Soft, consistently rounded rectangles, scaled to the element: 40px space tile 14px (`tile`), switch/nav row 16px (`row-sm`), item row and ink toast 18px (`row`), cards, record cards, check rows, dialogs and the Glass Button 20px (`2xl`), info cards and pill toast 24px (`3xl`), text fields 12px (`xl`), chips and switches fully round. Borders are rare: 1px Hairline on fields and on the bottom nav's top edge, 1px white on the Glass Button.

Icons are a single SVG registry (`src/components/icons`): UI glyphs on a 24px grid at 2.4 stroke (chevron, check, plus, more, account, sparkle), plus nav-, space- and object- sets. Space icons render in their icon ink. The space set covers the four core spaces; expansion spaces (공간1~3) have no glyph yet. Object art covers every 욕실·주방·거실·방 item (주방 has 6 since 2026-10-16: 싱크대 · 조리대 · 후드 필터 · 식기건조대 · 냉장고 · 음식물 쓰레기통) in one language: 2.3px rounded strokes, white + tint fills, one accent; floors share one drawing. Colors are CSS variables (`--obj-stroke/--obj-tint/--obj-accent`, defaults = the original `art-line` / `art-tint` / Cloud Blue); containers set them with `objectArtVars(space, "idle" | "filled")` — idle = grey line drawing on Surface, filled = space ink lines + white body + deepened space accent on a space-colored surface. 베란다 items still fall back to the space icon.

## Components

### Buttons (Glass Button)
Tactile and calm: a deep-ocean slab with a white label that catches light when tapped.
- **Shape:** 20px radius, 1px white border, full width, `overflow: hidden`, 56px tall for main CTAs, 52px for secondary/in-list/flow buttons.
- **Primary:** Slate (`#3e5463`) fill, white label (7.9:1) (`bb-label`). **Secondary (tonal):** Slate Mist fill, Slate label (6.8:1). One Primary per screen.
- **Press:** inset Glass press shadow (120ms ease-out) plus one specular sweep per tap: a 90×130 white band (0→0.65→0 alpha) rotated 18° travels left→right in 480ms `cubic-bezier(0.2,0.7,0.2,1)`, remounted on each press.
- **Disabled:** Hairline fill, Slate Muted label, no sweep.
- **Focus:** 2px Slate ring drawn inset (-4px) because the button clips.
- **Text link:** Slate `bb-label` (or `bb-label-sm`) in a 44px-tall box; used for 취소, secondary navigation and "기록 취소".

### Chips (Pill)
Two kinds only (2026-10-16 chip policy):
- **View switch → `Segmented`:** mutually exclusive views of one screen (히스토리 날짜별/공간별, 기록 최근 기록/자주/공간별 보기). One Surface track with 4px inset; the selected segment lifts to white with a bold Slate label and a 1px soft shadow.
- **Filter / category → `Pill size={38}`:** 가이드 필터, 기록·항목 추가 공간 칩. Equal widths (`flex-1`), 8px gap, text only (no icons). Unselected Surface / Slate Muted; selected Slate / white — space chips included (the tiles below already carry the space color, and non-space filters like 전체 / 생활 팁 must read the same).

### Cards / Containers
- **Item row (list style, default for lists since 2026-10-15):** no fill, rows stacked in `RowList` with Hairline dividers. Unified 2026-10-16 across 최근 돌본 흔적 · 이런 곳은 어때요? · 히스토리 (both views) · 가이드 list: 64px; leading tile = the *item* art on its space color (`icon` prop), not the space icon; line 1 item name (no 숨은 관리 badge — that flag only orders 대청소 picks); line 2 always the space name (이런 곳은 adds ` · tip`); right side = time only (`방금 / N일 전`, or clock time on 히스토리 날짜별); chevron only when the row navigates. **Item row (card style, remaining standalone uses):** Surface, 18px radius, 64 or 72px tall, 12px left pad, 12px gap: 40px space tile, title `bb-label` Ink over subtitle `bb-caption` Muted, chevron in a 44px trailing slot (Slate, or Muted for recent-record rows). Presses to 0.97.
- **Space tile:** 40px, 14px radius, space fill with icon ink (24px icon; expansion spaces show color only); on an already-filled row it becomes 70% white.
- **Home space card:** 20px card, 110px tall, water rising from the bottom to the space's level (Surface when never recorded, 18% base tint otherwise); label/icon stay full strength.
- **Home intro (status-driven, 2026-10-16):** no record CTA on Home (the 기록 tab covers it); a one-line headline and the line under it follow state — 첫 기록 전 `첫 기록을 남겨볼까요?`, nothing today `한 곳부터 가볍게` (something overdue) or `오늘도 내 공간을 맑게`, some today `오늘도 산뜻해요` + `오늘 N곳을 돌봤어요`, every space today `집 전체가 반짝여요` + `모든 공간을 돌봤어요`. No fixed intro height. Until something is recorded today the second line is `공간을 눌러 청소한 곳을 기록해요` (each space card opens 기록 for that space). Below the cards: tonal `기록 모아보기`, then 최근 돌본 흔적 (read-only rows) and 이런 곳은 어때요? (rows that open 기록).
- **Space accordion (공간 tab, 주말 대청소):** list style — no card; each space is a 72px header row (space tile, name, count, chevron) over a Hairline; the open panel indents its rows by the tile width. 공간 rows are water-level item rows (never recorded = faint Surface); 대청소 rows are list-style check rows that paint in the space color when checked. No per-space record button.
- **Record tile (QuickRecord, 공간별 보기):** square tiles in a 3-column grid, 8px gap, 16px radius, Surface; object art (40px) over the item name (`bb-label` Ink) and recency (`bb-caption` Muted), all centered, so a whole space fits on one screen. Tapping fills the tile with the space color at 100% (300ms), tapping again the same day clears it. The object art follows the tile: idle = soft grey line drawing, filled = lines in the space ink (`objectArtVars`). No border. Fill shows today's record only, not recency. 최근 기록 / 자주 views stay one-line rows.
- **Info card:** 24px radius, 16px/20px padding, 8px gap; Slate Mist for tips/notices, Surface for FAQ. Avoid grey boxes for one-line notes: since 2026-10-16 setup / sign-up-done / photo notes are plain text (or an icon + text row).
- **Guide detail (2026-10-16, every guide the same):** header `청소 가이드`; h1 = guide name; body `공간 · 약 N분 · 가벼운 청소`; 132px hero = the item art on the space color at 50% (the only color on the page); `준비물` as small Surface chips; `이렇게 해요` numbered steps (28px Slate Mist number circle, bold step title, Muted one-liner) split by Hairlines; record button, then `다른 청소법 보기`.
- **Draft review (사진 맞춤 설정 → 추천 항목 확인):** list accordion like 공간 / 대청소 (space tile header + Hairline). Selection is quiet: no row fill; only the check circle fills, in the space ink (`CheckRow checkColor`); unchecked items read Muted.

### Inputs / Fields
- **Style:** 52px, 12px radius, White Page fill, 1px Hairline, `bb-body` Ink, Muted placeholder, 16px side padding.
- **Focus:** border shifts to Slate; no outline ring (fields are the one exception to the global focus ring).

### Switch & Check rows
- **Switch row:** whole 62px Surface row (16px radius) is the `role="switch"`. Track 52×32: Slate on, Hairline off, Slate Mist when locked; 24px white thumb slides 20px in 200ms ease-out. **Space variant** (`space` prop, 공간 관리): 64px row in the space color (full on / 22% off) with the space tile; track in the space ink; required spaces show a `필수` chip instead of a switch and explain themselves in a toast.
- **Check row:** 48px Surface row (20px radius), 24px circle: Hairline off, Slate with white check on, Slate Mist with Slate check when locked. May fill with the space color when on (대청소). List style (`list`): no fill while off, so checking paints the row in the space color. `checkColor`: on-circle in the space ink with no row fill (추천 항목 확인). 공간 설정 rows use the space-colored row pattern with a `필수` chip for 욕실·주방.

### Navigation
- **Header:** White Page, 54px. Tab-root variant (홈 · 공간 · 기록 · 히스토리 · 가이드; title = tab name, Home shows "뽀득뽀득"): Ink `bb-title` left (Home: 28px round brand logo first, 8px gap), account icon (Muted, 44px) right to 내 정보. Sub-page variant: Slate back chevron (44px, falls back to /home on direct entry), centered Ink `bb-label` title, decorative "more" or an empty 44px spacer on the right.
- **Bottom nav:** White Page with a 1px Hairline top border, five tabs 홈 / 공간 / 기록 / 히스토리 / 가이드, each 64×48 with a 22px icon over a `bb-small` label, 3px gap. Active Slate, inactive Slate Muted; sub-pages light their parent tab.

### Dialog
Scrim over everything; White Page 342px card, 20px radius, 16px gap: `bb-title` Ink title, `bb-body` Muted body, primary Glass Button 56, 취소 text link. Focus moves to 취소; Escape and scrim tap close; body scroll locks.

### Toasts
- **Ink toast (top):** record events. Charcoal Ink, 52px, 18px radius, check icon + `bb-label-sm` white, 62px below the top edge.
- **Pill toast (bottom):** settings/item saved and "준비 중" notices (no icon). Slate, 310×48, 24px radius, 26px above the bottom (white text 7.9:1).
- **Motion:** fade + 8px slide in 200ms ease-out; auto-hide after 2s. Route hand-offs carry the message in router state and clear it so refresh does not replay.

### Motion summary
- **Press:** `scale(0.97)` for 120ms ease-out on tappable cards/rows.
- **Glass sweep:** as above, 480ms.
- **Water:** level changes rise/fall over 1300ms with a gentle overshoot; levels interpolate continuously between the four stages.
- **Soft bob:** 6px float, 1.8s loop, for onboarding illustration only.
- **Reduced motion:** press scale, sweep and bob are removed; color changes remain.

### Content & voice
Korean, soft 해요체, short. Color and copy describe care, never judgment.
- **Canonical phrases:** save toast `청소 기록을 저장했어요`; undo toast `청소 기록을 취소했어요`; undo action `기록 취소`; recency `방금` (<10 min) `· 오늘 · 어제 · N일 전 · 아직 기록 없음` (short form `… · 기록 없음`); no trailing "기록" since the context already says it; coming-soon `준비 중이에요`.
- **Fade stage labels (from `FADE_STAGES`, one wording app-wide):** 100% `최근 관리했어요`, 72% `잘 유지되고 있어요`, 48% `슬슬 다시 볼 때예요`, 28% `한번 관리해볼까요?`.
- **Space names:** core spaces are 욕실 · 주방 · 거실 · 방. Expansion spaces default to `공간1`, `공간2`, `공간3` until the user names them.
- **Banned words:** 미완료, 실패, 지연, overdue, 위험, 더러움. No cleanliness scores or completion percentages shown to users.
- **Price:** the one expansion price comes from `SPACE_PRICE_KRW`; never hard-code it in copy. **Price not final (2026-10-16):** while `SPACE_PRICE_FINAL` is false no screen shows an amount (dialog button reads `결제하기`); flip it to true before launch so the confirm dialog shows the amount again.
- **Titles:** one line (see Typography). Login opens with the brand block `색으로 채우는 나의 청소 기록 / 뽀득뽀득`, centered, under the five-pastel strip (`AuthHero`, also on 회원가입).

## Do's and Don'ts

### Do:
- **Do** use `GlassButton` for every filled CTA (56 primary / 52 secondary), and the 44px Slate text link for everything lighter.
- **Do** derive every space fill from `getSpace` / `spaceColor` and every water level from `spaceFade` / `itemFade` (background via `waterBase`), keeping icons and text at 100%.
- **Do** use Slate with white labels for every button, switch, check and selection chip (space chips included); keep space color for content (tiles, rows, cards, art).
- **Do** use `sky-surface` for cards/rows/chips and `sky-bg` for page, header, nav, dialog and fields; `sky-white` is literal white, not a surface.
- **Do** keep 24px gutters, 12px block gaps, 44px minimum targets, and `pb-nav` on every screen with the bottom nav.
- **Do** reuse `ItemRow`, `SpaceTile`, `SwitchRow`, `CheckRow`, `PageIntro`, `Pill`, `Dialog`, `Toast`/`useRouteToast` before writing a new row, card or modal.
- **Do** take icons from the SVG registry and fade-stage wording from `FADE_STAGES`.

### Don't:
- **Don't** let a fill drop below 28% or render "stale" as a warning color; there is no red/amber state in this system.
- **Don't** use the banned words or show a cleanliness score.
- **Don't** add drop shadows to cards, rows, tiles or dialogs.
- **Don't** set small Slate Muted text on a full 거실 / 공간1 / 공간3 fill; use `metaTextOnFill` (Charcoal Ink there).
- **Don't** use brand sky (`sky-brand`) as a button, chip, switch or check fill; it is a small accent only.
- **Don't** tint never-recorded items; they stay plain Surface.
- **Don't** show recency as opacity or an on/off fill; it is always a water level.
- **Don't** give an expansion space a core space's icon.
- **Don't** use typographic glyphs (‹ › ⋯ ✓ ＋ ✦) or Material Symbols for UI icons.
- **Don't** ship dark mode, the previous mint palette, or the old MD3 palette; dark tokens live in Figma Page 5 only for now.
- **Don't** change `fontSize` token values in `tailwind.config.js`.
