# Design brief — room concepts (round 2)

The homepage is the engineer's room: a hero (name, role, positioning line) above an illustrated room whose objects open the portfolio's sections. The desk monitor is the focal point and opens the System Explorer, the full-screen panel for the CRM, E-commerce and Nanomindz flows. This round develops three of the four night-room variations into concepts the owner can choose from, by layout **and** by mood.

## Why this round

The owner's verdict on round 1 (`/room-variants`, commit `78ce21c`):

- The four looked like **the same design in different colours**. They shared one shell: the same hero block, the same small label pills, the same flat line drawing in one accent.
- **Plan was boring.** It is removed (code, route, screenshots, tests).
- He still likes **Isometric's composition** and **Elevation's amber**.
- He dislikes **purple**: routine and overused. He wants more creative colour choices.
- The site must still read as a **backend engineer's portfolio** within seconds.

## Concept: one room, three media

Round 1 drew the same flat room four ways. Round 2 renders it in three different **media**, so each concept differs in drawing, light, type, labels and motion, not only in colour:

| # | Concept | Medium | The room is… | Light | Hero type | Explorer entrance | Idle style |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **Isometric** | The drawing | a working blueprint on the drafting table | a desk lamp's pool on the print | name lettered over drafting guidelines, dimensioned | unfolds like a sheet from the monitor | scanline sweep |
| 2 | **Elevation** | The screen | a control room with the lights down | the monitor lights the room | instrument readout with LED bar and caret | CRT power-on | terminal typing |
| 4 | **Exploded** | The object | a teardown under studio light | overhead spotlight, soft contact shadows | the name itself exploded into layers | rises into place from the monitor | packet stream |

Numbers keep round 1's numbering (Plan was 3), so the owner's references stay valid.

## Accent system

Each concept offers **three accent options**: amber `#FFB547` plus two colours chosen for what they mean in that concept's world. Each option is shown on the same layout and switched with one click.

**Restraint (rule 4).** An option is one main accent, one supporting tone, and the concept's neutrals:

| Token | Role | Used for |
| --- | --- | --- |
| `--accent` | the main accent: the colour of the room's light | the focal monitor label, active strokes, the role line, focus outlines, the selected explorer node, light and glow (non-text tints may use `color-mix` with transparent) |
| `--accent-ink` | text on accent fills (a near-black of the same hue) | the focal label, hovered labels, the selected node |
| `--evidence` | the **one supporting tone**: a pale tint of the same hue | resume-evidence markers: the `$ ` before the role, bullet markers, borders of resume-backed chips and explorer nodes |

No other hue appears. Text uses only these tokens and the neutrals (`--ink`, `--muted`), never `color-mix` or ad-hoc colours, so every text pair is measurable. **No purple or violet** anywhere, ground included: Exploded's violet ground is replaced (below).

**Why amber plus two per concept, not one shared trio.** A shared trio would make the three concepts look alike again. Each pair of extra colours is drawn from its concept's world, and no hue family appears in all three: red in 1 and 4, green in 1 and 2, blue in 2 and 4.

The registry (`src/variants/registry.ts`) is the single source of each option's hex values. The page sets them as custom properties on the room's root, with `data-accent="<id>"`.

## Shared rules

1. **Content** comes only from `docs/RESUME-SOURCE.md`, through `src/content/room.ts`, and the interface labels already in the app. No metrics, projects, dates or claims are added.
2. **Words inside drawings** are limited to the three existing decorative strings (`ROOM_01 / 4.20 m`, `> dotnet run`, `// scale 1:40`) plus content strings **imported from `room.ts`**: skill names, project names and employer names, verbatim. CRM flow step names stay out of drawings (some are representative, to confirm). A unit test renders every scene and checks each word.
3. **Privacy**: no phone number, street address, internal business-operations tool or its metrics.
4. **Hero first**: name, role and positioning sit above the scene at 390 px and 1440 px and are visible in the first view. Design goal for this round: the desk monitor is visible without scrolling at 1440 × 900 and 390 × 844. In round 1 it wasn't for Exploded at 1440, nor quite for Plan.
5. **Hotspots** stay real buttons with visible text. Labels are opaque, at least 24 × 24 px, and never overlap. Focus is a static outline.
6. **Motion**: only `transform` and `opacity` animate. With `prefers-reduced-motion: reduce`, all motion stops and nothing is hidden or misplaced (entrances use `backwards` fill).
7. **Contrast**: every text pair meets WCAG 2.2 AA (4.5:1, or 3:1 for large text) in every concept and accent.
8. **System Explorer**: the same shared panel everywhere. Flow 01 is the only working flow; flows 02–10 show "Planned" and do not open. Only the entrance animation and colours change per concept.
9. **Performance**: SVG drawings stay lean (no filters on animated elements, no noise textures, gradients for light and soft shadows). Lighthouse mobile performance stays at 90 or above.

### Shared hooks for depth

- **Object highlight**: hotspot buttons carry `data-hotspot="<id>"`, and drawings mark the matching group with `data-object="<id>"`. A concept's CSS responds with `:has([data-hotspot=x]:is(:hover, :focus-visible))`, so pointer and keyboard users see the same thing.
- **Hero decoration**: a concept may export `HeroDecor`, rendered inside the hero as `aria-hidden` decoration. The heading text itself stays shared.
- **Explorer origin**: opening a panel sets `--open-x` and `--open-y` (the opener's centre, in viewport px) on the room's root, so an entrance can grow from the desk monitor.

## 1 · Isometric — the drawing, under the lamp

Keeps the 2:1 isometric room the owner likes, the title-block hero, the drafting callout tags and the scanline sweep.

**Ground** (unchanged): `--bg #0A2240` Prussian blue · `--surface #0E2A4D` · `--chip #11335B` · `--hot #061A30` · `--ink #EAF4FF` · `--muted #A8C3DE` · lines `#2C5C8A`.

**Design additions (rule 6)**

1. **Lighting.** An architect's arm lamp is clamped to the desk. It throws a cone and an elliptical pool of accent light across the desk and floor, built from layered gradients. The monitor's glow spills onto the desk and wall, and the corners of the room fall into shade.
2. **Richer object detail.** Drafting materials replace bare outlines:
   - section hatching on cut edges;
   - cross-hatched cast shadows under the desk, chair and cabinet (the drafting convention, not blur);
   - wood grain on the desk top and perforated metal on the cabinet side;
   - varied, leaning books with bookends;
   - a chair, a keyboard with a key grid, and the monitor cable.
3. **Hero typography.** The name is lettered over faint drafting guidelines (cap line, x-height, baseline), the way drafters prepare hand lettering, with a dimension line spanning its width.
4. **A detail to discover.** The book spines carry the real skill names, the framed drawing carries the two project names, and the cabinet drawers carry the two employers, all in tiny lettering. Pointing at or focusing a hotspot outlines its object in the accent.
5. **Bolder explorer entrance.** The System Explorer unfolds from the desk monitor like a drawing sheet: it scales up from the opener's point while a grid fades in.

**Accent options**

| Option | Main | Ink on fill | Support | Why it fits | Lowest text pair |
| --- | --- | --- | --- | --- | --- |
| Lamp amber | `#FFB547` | `#1F1404` | `#FFDDA8` | the desk lamp: warm light on a cold print, the classic complement to Prussian blue | 7.25:1 (on chip) |
| Redline | `#FF7A68` | `#2A0B06` | `#FFC9C0` | the revision pencil: engineers mark changes on drawings in red. Bold and editorial, not alarm red | 5.00:1 (on chip) |
| Greenline | `#8EE3B8` | `#062214` | `#C8F2DC` | the as-built pencil: green marks what was built and verified. Calm, fresh, and clear of the blue-grey neutrals | 8.39:1 (on chip) |

## 2 · Elevation — control room, lights down

Keeps the straight-on elevation of the desk wall, the HUD brackets, the terminal typing, the heavy mono name and the phone composition.

**Ground** (unchanged): `--bg #0F1114` graphite · `--surface #171A1F` · `--chip #1F232A` · `--hot #0A0B0D` · `--ink #F3EFE8` · `--muted #B5ADA1` · lines `#3A414C`.

**Design additions (rule 6)**

1. **Lighting.** The room lights are down and the monitor lights the room:
   - a soft cone of accent light falls on the desk and floor;
   - edges facing the screen catch a rim light;
   - the wall falls off into shade.
2. **Richer object detail.** Solid, lit forms replace the wireframe:
   - lit fronts and darker sides on every object;
   - keycaps, cable runs and a mug whose steam drifts;
   - a small network switch under the desk with LED points;
   - book spines with skill names, drawers with employer names, and the project frame with both project names.
3. **Hero typography.** The name becomes an instrument readout:
   - a segmented LED bar beneath it;
   - a status dot before the role and a block caret after it, both blinking;
   - when motion is reduced, both stay lit and still.
4. **Bolder explorer entrance.** A CRT power-on: the panel opens as a bright horizontal line that expands to full height, then settles.
5. **A detail to discover.** The switch LEDs blink in an irregular pattern. Pointing at or focusing a hotspot powers its object: its brackets and light come up in the accent.

**Accent options**: the three lights on a server's front panel.

| Option | Main | Ink on fill | Support | Why it fits | Lowest text pair |
| --- | --- | --- | --- | --- | --- |
| Amber LED | `#FFB547` | `#1F1404` | `#FFDDA8` | the amber the owner likes: warning LED and P3 phosphor; warm, retro-instrument | 8.97:1 (on chip) |
| Green LED | `#5CF29E` | `#03200F` | `#BDF8D6` | the healthy-status LED: everything nominal; cool and confident | 11.00:1 (on chip) |
| Blue LED | `#7DA8FF` | `#06142E` | `#C9DAFF` | the identify LED technicians use to find one server in a rack; calm, precise, a backend detail | 6.69:1 (on chip) |

## 4 · Exploded — teardown under studio light

Keeps the exploded axonometric: floor plate, floating desk and monitor, lifted wall panel with shelf and frame, side pieces, dashed alignment guides, the packet stream and the oversized name.

**Ground** (new, purple removed): `--bg #1A1918` warm-neutral charcoal studio · `--surface #22211F` · `--chip #2A2826` · `--hot #121110` · `--ink #F4F1EB` · `--muted #B8B2A8` · lines `#47443F`.

**Design additions (rule 6)**

1. **Lighting.** A soft overhead spotlight lights the studio sweep and falls off at the edges. Each floating part casts a soft contact shadow on the floor plate, built from gradients: the higher the part, the softer and fainter its shadow.
2. **Richer object detail.** The parts read as a product render:
   - shaded volumes and a brushed-metal desk top;
   - a glass monitor with a diagonal reflection;
   - shelf faces with grain and a matte cabinet with highlight edges;
   - book spines carrying skill names.
3. **Hero typography.** The name itself is exploded: an outline copy, hidden from screen readers, is lifted behind the solid name and joined to it by short dashed guides.
4. **A detail to discover.** Pointing at or focusing a hotspot lifts its part further from the floor while its shadow shrinks and fades: the teardown responds.
5. **Bolder explorer entrance.** The explorer rises from the desk monitor with a lift-and-settle.

**Accent options**: materials found inside the machine.

| Option | Main | Ink on fill | Support | Why it fits | Lowest text pair |
| --- | --- | --- | --- | --- | --- |
| Kapton amber | `#FFB547` | `#1F1404` | `#FFDDA8` | Kapton tape, the amber film wrapped around every board; warm and familiar | 8.36:1 (on chip) |
| Copper | `#E8957A` | `#2A120A` | `#F6CDBF` | traces, heat pipes, cable cores: a rosy metal, clearly apart from amber | 6.30:1 (on chip) |
| Steel | `#93B7DD` | `#0A1726` | `#CFE0F2` | the chassis: cool brushed steel; the quiet, technical option | 7.03:1 (on chip) |

## Comparison page

`/room-concepts` shows one concept at a time with a fixed dock: three concept tabs and, for the current concept, a one-click accent switcher (swatch, name, hex). URLs are `/room-concepts/<concept>/<accent>`; the default is Isometric, Lamp amber. The page is `noindex, nofollow`, and the homepage `/` is unchanged until the owner picks. Round 1's `/room-variants` is retired.

## Deliverables

- `docs/screenshots/concepts/`: every concept × accent at 1440 px and 390 px, and a contact sheet. Each row is labelled with the accent's name, hex and contrast ratio, with a short note per concept on what changed from round 1.
- `docs/screenshots/concepts/CONTRAST.md`: every text colour pair and its ratio, per concept and accent, measured in the browser.
- Lighthouse mobile performance per concept (median of 3 runs).
- Build, unit, API and Playwright tests passing locally after every commit, and on CI (ubuntu-latest, windows-latest) after the owner reviews the contact sheet.
- Nothing merged to main. The owner picks one concept and one accent; the rest are removed in a follow-up.

## History

- 2026-10: two mockups explored content hierarchy, **System Explorer** (capability-led) versus **Evidence Story** (narrative). System Explorer was selected; both mockups remain in `artifacts/mockup-sandbox`.
- 2026-11: the engineer's room replaced the single-page layout. The owner first picked the warm workshop, then made Night blueprint the only direction, and then rejected the warm look as dated. See `docs/ROOM-DIRECTIONS.md`.
- 2026-11, round 1 (`feature/night-room-variants`): four night-blueprint variations at `/room-variants`: Isometric (cyan), Elevation (amber), Plan (lime) and Exploded (violet). The owner kept Isometric's composition and Elevation's amber, dropped Plan and purple, and asked for more depth and more creative colour.
