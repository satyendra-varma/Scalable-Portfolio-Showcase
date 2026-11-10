# Design brief — four night-blueprint rooms

Status: **in progress on `feature/night-room-variants`.** The owner compares the four variations at `/room-variants`, picks one, and the other three are removed in a follow-up task. The homepage `/` stays as it is until then.

## Why

The owner rejected the warm workshop as looking old. The site must feel modern and memorable enough that a recruiter or engineering lead pays attention, and it must still read as a **backend engineer's portfolio within seconds**. The owner judges styles by seeing them, not by their names, so the four variations sit side by side, one click apart, on phone and desktop.

## Concept: four drawings of one room

Engineers communicate through drawings. Each variation draws **the same room** as a different kind of technical drawing, so the four are different ways of seeing, not four tints of one picture. In every one, the **desk monitor is the focal point**, with its own idle animation, and it opens the System Explorer.

| # | Variation | Drawing | Accent | Monitor idle style | Ground | Display type |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **Isometric** (`isometric`) | Isometric blueprint: thin white linework, dimension lines and extension ticks on Prussian blue | `#5CE1F2` cyan | **Scanline sweep**: a soft light band travels down the screen | `#0A2240` Prussian blue | Space Grotesk |
| 2 | **Elevation** (`elevation`) | Front elevation of the desk wall, objects framed by HUD corner brackets, like a control room | `#FFB547` amber | **Terminal typing**: code lines draw in left to right, then a block caret blinks | `#0F1114` graphite | JetBrains Mono, uppercase |
| 3 | **Plan** (`plan`) | Top-down floor plan (walls, door swing, furniture) with a circular detail callout that magnifies the monitor | `#B6F25A` lime | **Radar sweep**: a rotating arm with blips that fade | `#06140F` phosphor green-black | DM Sans, heavy |
| 4 | **Exploded** (`exploded`) | Exploded axonometric: floor, desk and wall layers lifted apart along dashed guides | `#C69CFF` violet | **Packet stream**: dots travel out of the monitor along circuit traces | `#0E0B20` ink violet | Space Grotesk, oversized |

The four motions differ in kind: a vertical sweep, a write-on, a rotation and a travelling path. So do the four accent hues (187°, 36°, 84°, 265°).

### Palettes (text tokens)

| Token | Isometric | Elevation | Plan | Exploded |
| --- | --- | --- | --- | --- |
| `--bg` | `#0A2240` | `#0F1114` | `#06140F` | `#0E0B20` |
| `--surface` (panels) | `#0E2A4D` | `#171A1F` | `#0B2018` | `#161132` |
| `--chip` | `#11335B` | `#1F232A` | `#0F2A20` | `#1D1742` |
| hotspot label background (opaque) | `#061A30` | `#0A0B0D` | `#03100A` | `#090717` |
| `--ink` (text) | `#EAF4FF` | `#F3EFE8` | `#E8FFF2` | `#F2EDFF` |
| `--muted` (secondary text) | `#A8C3DE` | `#B5ADA1` | `#9FC8B3` | `#B9B0DD` |
| `--accent` | `#5CE1F2` | `#FFB547` | `#B6F25A` | `#C69CFF` |
| `--accent-ink` (text on accent) | `#04222E` | `#1C1203` | `#0C1A04` | `#170A2C` |
| `--evidence` ("From resume" marks) | `#FFD37A` | `#7DD3FC` | `#FFD166` | `#5EEAD4` |
| Lowest text contrast in the set | 6.99:1 | 7.10:1 | 8.30:1 | 7.66:1 |

Every text and background pair in these palettes clears WCAG 2.2 AA (4.5:1) with margin. The measured table for the built pages lives in `docs/screenshots/variants/CONTRAST.md`.

## Rules every variation follows

1. **Content:** only `docs/RESUME-SOURCE.md`, plus interface labels already in the app. The scenes add no words; decorative drawing text is limited to strings the current scene already uses.
2. **No new claims:** no metrics, projects, dates or claims. Private details stay out (phone, street address, the excluded internal project and its metrics).
3. **Hero first:** name, role and positioning sit **above** the scene at 390 px and 1440 px. A browser test checks the bounding boxes.
4. **Hotspots:** real buttons with visible text labels, at least 24 × 24 px, with an opaque label background. Focus shows a static outline that doesn't depend on motion.
5. **Motion:** `transform` and `opacity` only. With `prefers-reduced-motion`, pulses, idle loops and transitions stop, and no content depends on them. A unit test scans every room stylesheet's keyframes and transitions.
6. **Contrast:** WCAG 2.2 AA for all text; automated axe checks run on every variation.
7. **One explorer:** the System Explorer is the same component everywhere; only its tokens change.
8. **Flows:** flow 01, the CRM request lifecycle, is the only working diagram. Flows 02–10 are labelled "Planned" and can't be opened.

## System Explorer (shared)

The explorer is a full-screen blueprint panel. Its rail lists the three projects (Enterprise CRM Platform, Cloud E-Commerce Platform, Nanomindz Technologies) and their ten flows, numbered 01–10:

- **Flow 01** opens as a ten-node diagram. Nodes are keyboard-navigable and have a detail pane and an equivalent numbered list.
- **Flows 02–10** are plain list items tagged "Planned". They aren't buttons or links.

Node labels keep the "From resume" or "Representative design (to confirm)" markers.

## Comparison page

- `/room-variants` shows variation 1, and `/room-variants/<id>` shows each variation directly.
- A fixed dock switches between them with one click. Each dock item shows the name, accent swatch and hex, and idle style, and the active one is marked for assistive technology.
- The page asks search engines not to index it.

## Deliverables

- Screenshots of each variation at 390 px and 1440 px, plus a labelled contact sheet, in `docs/screenshots/variants/`.
- A contrast table for every text colour pair per variation, measured on the built pages.
- Lighthouse mobile performance per variation (median of 3 runs).
- Build, unit, API and Playwright checks passing locally and in CI (ubuntu-latest and windows-latest).

## History

- 2026-10: two mockups explored content hierarchy, **System Explorer** (capability-led) versus **Evidence Story** (narrative). System Explorer was selected; both mockups remain in `artifacts/mockup-sandbox`.
- 2026-11: the engineer's room replaced the single-page layout. The owner first picked the warm workshop, then made Night blueprint the only direction, and has now rejected the warm look as dated. See `docs/ROOM-DIRECTIONS.md`.
