# Status — room motion (round 4)

Updated on 2026-11-12, when work on Step 3 (Motion B) was stopped part-way at the owner's request (usage limit). The brief and the owner's decisions are in `docs/BRIEF-room-motion.md`.

## Where things are

- **Branch**: `feature/room-motion`, created from `feature/room-concepts` at `5ee726b`. It is **not pushed**, and nothing is merged.
- **Route**: `/room-motion`, and `/room-motion?motion=a|b|c|off`. Off is the default.
- **Other branches are untouched**: `main`, `feature/room-concepts` and `feature/room-rotation`.

| Step | What | State |
| --- | --- | --- |
| 1 | Read the code, propose tooling | Done. Approved by the owner. |
| 2 | Static hybrid with the switcher | Done, commit `611bbfd`. |
| — | Kapton amber and the Amber LED header only | Done, commit `1093a57`. The Copper accent, Exploded's own header and their switcher options are removed. |
| 3 | Motion B, "Power-on" | **Work in progress**, commit `b557bef`. Desktop motion is built; see below for what is left. |
| 4 | Motion C, "Depth focus" | Not started. |
| 5 | Motion A, "Assembly" | Not started. |

**State of the WIP commit**: typecheck passes and the build passes. **Unit tests: 91 of 94.** The three failures are expected and are listed under "Left".

## Motion B: what is built (desktop)

Seen working in the browser at 1280 px wide. Files are in `src/variants/motion/`.

- **Wiring** (`wiring.tsx`): the room has a new tree of traces. Power enters at the top of the wall's corner, runs along the foot of both slabs to the bookshelf and the project frame, down the left slab's end to the floor, then to the filing cabinet, the desk and monitor, and the mailbox. Each segment knows its distance from the entry point, so the stylesheet lights the whole tree at one speed.
- **Feed** (`Feed.tsx`): the trace from the end of the header's loading bar down to the top of the wall, measured from the page and re-measured on resize.
- **Opening** (`power.css`, `usePowerOn.ts`), about 2.9 s: the room draws itself as linework while the loading bar charges; power then runs down the feed and along the traces; each object lights, with a slight overshoot and a flash, when its trace arrives; the room's own light comes up with the monitor.
- **Skip and return**: any click, tap or key finishes the opening at once. After the first visit in a browser session (sessionStorage `rm-b-seen`), a short power-only opening plays.
- **Idle**: packets travel from the loading bar to each object in turn; the monitor's cursor, the header's status light and caret blink.
- **Hover and focus**: a pulse runs the last stretch of that object's trace, then the object rises a little and glows. Leaving reverses it.
- **Open and close** (`MotionPanel.tsx`, `panel.css`): the object's box is traced, ties run to the panel's corners, the panel's frame is traced, and the sheet unfolds. Everything is a function of one number moved by a spring from Motion, so closing part-way turns it round. Motion loads as its own chunk after first paint (22 kB gzipped, `motionLib.ts`).

## Motion B: not tested

- Mobile and touch: not looked at, at any size. The feed line probably sits too close to the header's corner bracket on a phone.
- The full-screen System Explorer panel (it unfolds out of the monitor's box): written, not looked at.
- Closing a panel part-way, and switching from one hotspot to another while a panel closes: written, not looked at.
- Keyboard focus pulses, and the list view with Motion B on.
- Any browser other than Chrome.
- No performance trace has been run. Line drawing and the packets animate `stroke-dashoffset`, which repaints on the main thread.

## Motion B: left

1. **Tests and the test exception.** Three unit tests fail:
   - `src/styles/motion.test.ts` rejects `power.css`, because the keyframes `rm-b-draw` animate `stroke-dashoffset`. Add the narrow, named exception the owner asked for: that one keyframe name, in that one file. Do not loosen the rule for the site.
   - Two tests in `motion-room.test.tsx` still expect the old 13 layers and an exact match with Exploded. There are now 15 layers (`wallwire` and `bloom` are new, `packets` became `flows`) and the `traces` layer has the new wiring, so the comparison must leave those layers out.
   - Nothing yet tests the wiring, the opening's phases, or the panel in Motion B.
2. **Simpler mobile and touch version**: shorter opening without the linework, no hover effects, tap to focus, a simpler panel.
3. **Reduced-motion state**: with reduced motion the page already shows Off, which is the powered room with the feed and an instant panel. It needs checking and a test.
4. **One performance trace** of the finished motion: frame-time numbers and long-frame counts only, then delete the trace file.
5. The report for Step 3, then the owner's go-ahead for Motion C.

Steps 2 to 4 were meant for Sonnet sub-agents once the desktop motion was done. None was started.

## Working in this copy

- Dependencies are installed in this working copy and match the lockfile. `pnpm` is not on the PATH, so run the tools directly from `artifacts/portfolio`: `node ../../node_modules/typescript/bin/tsc -p tsconfig.json --noEmit`, `node node_modules/vitest/vitest.mjs run`, `node node_modules/vite/bin/vite.js build --config vite.config.ts`.
- In Git Bash, do not set `BASE_PATH=/`: the shell rewrites it into a Windows path and the built site will not load.
- `.claude/launch.json` (not committed, by the owner's decision) starts the built site on port 5173 for a look in the browser. Build first.
- The browser pane slows a page to about one frame a second when it is in the background. Motion's spring then looks stalled; CSS animations do not. Check the pane is showing before judging smoothness.
- `artifacts/mockup-sandbox/src/.generated/mockup-components.ts` shows as modified but has no content change (line endings). Keep it out of commits, by the owner's decision.
- The phone-size overlap of the "ROOM_01 / 4.20 m" tag and the ruler is left for later, by the owner's decision.

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
