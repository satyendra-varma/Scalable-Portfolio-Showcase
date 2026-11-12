# Status — room motion (round 4)

Updated on 2026-11-12, after Step 2. The brief and the owner's decisions are in `docs/BRIEF-room-motion.md`.

## Where things are

- **Branch**: `feature/room-motion`, created from `feature/room-concepts` at `5ee726b`. It is **not pushed**, and nothing is merged.
- **Route**: `/room-motion`. The choices live in the address: `?motion=a|b|c|off&header=led|own&accent=amber|copper`. The defaults (Off, Amber LED header, Kapton amber) are left out.
- **Other branches are untouched**: `main`, `feature/room-concepts` and `feature/room-rotation`. The round 2 concepts still work at `/room-concepts`.

| Step | What | State |
| --- | --- | --- |
| 1 | Read the code, propose tooling | Done. Approved by the owner. |
| 2 | Static hybrid with the switcher and the header toggle | Done, commit `611bbfd`. Build passes, unit tests 90 of 90. |
| 3 | Motion B, "Power-on" | **Next.** Waiting for the owner's go-ahead. |
| 4 | Motion C, "Depth focus" | Not started. |
| 5 | Motion A, "Assembly" | Not started. |

The owner changed the build order after Step 1: B, then C, then A. The letters in the switcher stay A, B, C.

## What Step 2 built

- `src/variants/motion/`: the hybrid room. `MotionRoom` joins `MotionHeader` (Elevation's Amber LED header, or Exploded's own) and `MotionStage` (Exploded's room).
- The room is Exploded's drawing cut into **13 svg layers**, back to front: light, floor, traces, shadows, guides, wall, shelf, frame, cabinet, mailbox, desk, monitor, packets. Each object has a layer of its own (the desk and the monitor both belong to the System Explorer). A unit test checks that the layers draw exactly what Exploded draws, in the same paint order.
- The LED header's loading bar is a real element that shows `--rm-progress` (0 to 1, set on the room's root). It rests at 1, a full bar.
- The LED header keeps Amber LED whichever accent the room wears.
- `src/pages/room-motion.tsx` and `MotionSwitcher`: the page and its switcher (motion, header, accent). The switcher collapses to one bar and starts collapsed on a phone. With reduced motion the page always shows Off, and A, B and C cannot be chosen.
- Nothing moves yet. A, B and C show the same room as Off, except for the shared pulse on the hotspot dots and the panel's short slide, which Off switches off.

## Before starting Step 3

- **Tooling is approved**: the browser's Web Animations API for the openings, and Motion's non-React `animate` and springs (`framer-motion`, already installed) for hover, focus, open and close, loaded after first paint. No new dependency, no WebGL. The table is at the end of the brief.
- **Motion B needs a feed trace** from the header's loading bar down into the room. The owner approved adding it.
- **The transform-and-opacity unit test** (`src/styles/motion.test.ts`) must not be loosened for the site. Motion B's line drawing needs a narrow, named exception for `/room-motion` only. It is not added yet; add it with B and report it.
- **Performance**: one scripted trace per finished motion, not during iteration. Report frame-time numbers and long-frame counts only, and delete the trace files afterwards (S: is low on space).
- After the desktop motion is finished, Sonnet sub-agents build the reduced-motion state, the simpler mobile version and the test updates.

## Working in this copy

- Dependencies are installed in this working copy and match the lockfile. `pnpm` is not on the PATH, so run the tools directly from `artifacts/portfolio`: `node ../../node_modules/typescript/bin/tsc -p tsconfig.json --noEmit`, `node node_modules/vitest/vitest.mjs run`, `node node_modules/vite/bin/vite.js build --config vite.config.ts`.
- In Git Bash, do not set `BASE_PATH=/`: the shell rewrites it into a Windows path and the built site will not load.
- `.claude/launch.json` (not committed) starts the built site on port 5173 for a look in the browser.
- `artifacts/mockup-sandbox/src/.generated/mockup-components.ts` shows as modified but has no content change (line endings). Leave it out of commits.

---

# Status — rotating room (round 3)

*Carried over unchanged from `feature/room-rotation`. Everything below describes that branch, not this one.*

Written on 2026-11-11, when work was paused at the owner's request. Updated on 2026-11-12, after Concept B was finished. The design is in `docs/DESIGN-BRIEF.md`.

## Where things are

- **Branch**: `feature/room-rotation`, created from `feature/room-concepts` at `5ee726b`. It is **not pushed**, and nothing is merged to main.
- **Base**: `feature/room-concepts` (rounds 1 and 2) is pushed, and CI is green on ubuntu-latest and windows-latest for its tip `5ee726b`.
- **Routes**: `/room-concepts/rotate-lamp` and `/room-concepts/rotate-teardown`, each with its two accents in the dock. The round 2 concepts are still at their routes.

## Commits on this branch

| Commit | What | State |
| --- | --- | --- |
| `13ee493` | Design brief for round 3 | Done. Build, 70 unit, 5 API, 40 browser tests passed. |
| `5debc46` | Shared scroll-rotation system (3D stage, scroll-linked motion, page with inline sections, dock for five concepts) | Done. Build, 109 unit, 5 API, 60 browser tests passed. |
| `e463986` | WIP: Concept A, Lamp | Not finished. See below. |
| `5d72181` | WIP: Concept B, Teardown | Not finished. See below. |
| `21c05ef` | WIP: scroll-triggered reveals, pointer tilt and device tilt | Works, but not finished. See below. |
| `e0ece3f` | Concept B: one rule under each section heading, not two | Done. |
| `dd3c721` | Concept B: room between the cabinet's and the monitor's labels on a phone | Done. |
| `f583bd7` | Concept B's reveal style: sections assemble | Done. |
| `2c6e22b` | Reduced motion switched on while the page is open (both concepts) | Done. |

**Tests on the tip `2c6e22b`** (2026-11-12, this working copy, Windows 11, Chrome): build passes, unit tests 116 of 116, browser tests **73 of 74**. The API tests were not run again. Concept B passes all 14 of its browser tests after each of the four commits above.

The one failing browser test is still Concept A on the phone, in the "sections unfold" test: the accessibility scan reports that the desk monitor's label is partly covered, and that it sits too close to a skill chip scrolling under the pinned room.

## Concept A — Lamp (`rotate-lamp`)

Accents: Lamp amber `#FFB547`, Redline `#FF7A68`.

**Finished**

- The isometric room is ported from round 2 and cut into depth layers, with labels at their objects' depths and a phone composition.
- The title-block header, the explorer entrance and the choreography values are in.
- It builds, passes the unit tests, and passes its browser tests on desktop.

**Left**

- Fix the failing phone test: keep the desk monitor's label inside the pinned room and clear of the sections beneath it.
- The sub-agent building it was stopped before its final review. Nobody has yet checked its frames by eye: that the rest pose matches round 2, and that no label overlaps, is covered or leaves the screen at the start, middle and end of the scroll, at 1440 px and 390 px, in both accents.
- Check the header still leaves the desk monitor in the first screen now that the caption no longer pins on phones.

## Concept B — Teardown (`rotate-teardown`)

Accents: Kapton amber `#FFB547`, Copper `#E8957A`.

**Finished**

- The exploded room is ported from round 2 and cut into depth layers, under Elevation's instrument header, with labels and choreography values.
- It builds and passes the unit tests and all of its browser tests, on desktop and phone.

- Its frames were then checked from the code and the geometry, without screenshots (2026-11-12). Two problems were found and fixed: every section heading had two rules under it, and on a phone the cabinet's and the monitor's labels sat about 2px apart (and overlapped on a 320px screen).
- Its reveal style is in: each item of a section is lowered into place from above, later items from higher up.
- The packets follow the traces exactly, the alignment guides fade as the cards lift, and with reduced motion the packets are hidden and the guides stay.

**Left**

- Nobody has yet checked its frames by eye. That waits for the screenshots, by the owner's instruction. Look at the header on a phone: the "ROOM_01 / 4.20 m" tag sits about 3px above the end of the name's first line (the same as round 2's Elevation).
- The check above did not read the brief, so the packet stream and the guides are confirmed against the code's own intent, not the brief's wording.
- On a phone the two notes in the drawing ("ROOM_01 / 4.20 m", "// scale 1:40") are under 6px tall. Round 2's Exploded enlarged them on phones; this port does not. Decide once it has been seen.

## Shared work

**Finished**

- The room as a 3D diorama: scroll-linked turn (34° to 36° on desktop, 15° under 768 px), the desk monitor moving forward, and the layers separating. Transform and opacity only, on scroll timelines.
- Labels always face the visitor and are never covered by the drawing.
- The page: hero, then the room pinned beside the sections (System Explorer, Skills, Projects, Experience, Education, Contact). Flow 01 opens the System Explorer; flows 02 to 10 show "Planned" and are not interactive.
- Scroll-triggered reveals with staggered items, pointer tilt on mouse devices, and a "Tilt with device" switch on touch devices.
- With reduced motion the room already holds its rest pose, sections are visible without reveals, and tilt is off. Browser tests cover this.
- The dock lists five concepts and collapses to one bar.

- If a visitor switches to reduced motion while the page is open, the room returns to its rest pose, sections still waiting for a reveal show at once, and the tilt switch is hidden. A browser test covers this for both concepts.

**Left**

- Lamp's reveal style from the brief (items unfold like a sheet). Lamp still uses the default rise; Teardown's is done.
- Between 601px and 1023px wide the pinned room is as tall as its width allows. On a short, wide screen (a phone held sideways) it can fill the whole screen, so the first two sections pass under it unread. Not fixed; it affects both concepts.
- Screenshots and contact sheets in `docs/screenshots/rotation/`, the contrast table with rotation on, Lighthouse per concept and accent, and the scroll-smoothness check. None of these has been run on the concepts' own drawings. The scripts for them are written but are not in the repository.
- The owner's review of the contact sheets, then the push, CI on both systems, and the report in `docs/WORKLOG.md`.

## To resume

- Each sub-agent's working copy is a git worktree on its own branch, `r3/lamp` and `r3/teardown`, holding the same WIP work as the commits above. The worktrees live in a temporary folder and may be gone; the branches are enough.
- Concept B is finished apart from the check by eye. Next: finish Concept A and its reveal style, then the measurements.
- Dependencies are not installed in this working copy and `pnpm` is not on the PATH. The tests above ran against the dependencies already installed in the `r3/teardown` worktree, with the system Chrome (`PLAYWRIGHT_CHROMIUM_EXECUTABLE`) and a preview server started by hand. In Git Bash, do not set `BASE_PATH=/`: the shell rewrites it into a Windows path and the built site will not load.
