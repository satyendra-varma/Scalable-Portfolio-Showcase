# Status — room motion (round 4)

Updated on 2026-11-13, after the return-visit opening was changed from 1 second to about 3 (the owner's fourth brief of that day; the third chose Motion B, "Power-on", at 4 seconds and asked for it to be finished). The original brief, the owner's decisions and the **working rules from 13 November** are in `docs/BRIEF-room-motion.md`. Read those rules before doing anything else.

**No model has looked at any of this in a browser.** By the working rules the owner checks the page and reports. The one exception is the scripted performance measurement below, which the owner asked for. Everything about how the page looks is what the code is written to do.

## Where things are

- **Branch**: `feature/room-motion`. It is **not pushed**, and nothing is merged.
- **Route**: `/room-motion` plays Power-on. `/room-motion?motion=off` is the still state. Motions A and C and the 6 and 8 second speeds are removed from the switcher and the code. The switcher keeps Power-on, Off and Replay.
- **Other branches are untouched**: `main`, `feature/room-concepts` and `feature/room-rotation`.
- **State of the tip**: typecheck passes, the build passes, and **all 148 unit tests pass**.

| Commit | What |
| --- | --- |
| `eebc077` | Power-on locked at 4 seconds; A, C and the speed options removed. |
| `42eeaab` | Return visits in a session get a 1-second opening. |
| `f17d275` | Mobile: a 2.5-second opening, tap in place of hover, a readable room at phone width, the header tag fixed. |
| `1d2f07f` | Reduced motion: the room lit and still, in the same layout as Power-on. |
| `8ff1613` | Tests: the line-drawing exception, the fifteen layers, the new openings. |
| `49f8c1d` | Return visits play the full opening compressed to about 3 seconds (replaces the 1-second version). |
| `b9e0456` | A phone always plays the mobile opening; the return opening is desktop only. |

**Not changed in this job**, by the owner's instruction: the desktop opening, the idle packets, the hover lift, and how the panels open. The only edit to `power.css` moved the 4-second values (`--rm-travel: 2.3`, `--rm-k: .8`) into the base rule.

## What a visitor gets

| Visitor | Opening | Where it is written |
| --- | --- | --- |
| Desktop, first visit in a browser session | The full opening, "4 seconds", as approved | `power.css` |
| Phone or touch screen, every visit | "Mobile", about 2.5 seconds | `lite.css` |
| Desktop, later visits in the same session | "Return": the full opening at a quicker pace, about 3 seconds | `return.css` (pace only; the rules are `power.css`) |
| Reduced motion, or Off in the switcher | No opening: the room lit and still | `room.css` |

The room's root says which one plays: `data-opening='full' | 'mobile' | 'return'` (`opening.ts`, chosen once when the room mounts). **Replay** always plays the first-visit opening for the device. To see the return version, on a desktop: reload the page, or switch to Off and back.

### The return opening, about 3 seconds

The owner saw the first return version (1 second, without the travelling light) and rejected it: too fast, and it dropped the best part. It is now the full opening itself, the same rules in `power.css`, run faster. Worked out from the timings, not measured: about 0.25 seconds of dark room, then about 3 seconds from power leaving the bar to the last animation ending.

- **Kept, all of it**: the dark room in linework, the bar letting go, the head and its tail travelling down the feed and along the traces, the ring at each junction, each object's own start-up, labels after their objects, the room's light last.
- **Shortened**: power's travel from the bar to the furthest object, 2.3 seconds to 1.6; each object's own start-up and the bar's release, to five eighths of their length (`--rm-k` .8 to .5), so the monitor types its line in a quarter of a second; the ring and the glow when the room goes live, to 0.65 seconds.
- **Skipped**: the drawing at page load. The linework and the copper are already drawn and the bar is already full, so power leaves after 0.25 seconds, not 1.35.

### The mobile opening (`lite.css`)

**Kept**: the room starts dark and comes alive; the loading bar lets go of its charge; power moves outward from the bar at one constant speed, so the nearest object lights first; every object strikes with the tube flicker; each label appears only when its object is live; the room's own light comes up last, with one ring from every pad.

**Dropped**: the drawn linework (the dark room is the room itself at low light, not an outline); the travelling head and its tail; the ring at each junction on the way; the half-lit stage; each object's own start-up (spines one by one, the frame drawing its boxes, the drawers, the flag, the monitor typing its line).

How it is built: while the mobile opening waits or runs the root carries `data-lite` and no `data-b`, so none of the full opening's rules apply; when it ends the root carries `data-b='on'`, the same resting state as after the full opening. `lite.css` animates transform and opacity only.

### Mobile and touch

- **Which devices**: 600 px wide or less, or a screen with no hover (`MOBILE_QUERY` in `opening.ts`).
- **Tap in place of hover** (`touch.css`, touch screens only): a tap sends the pulse down the trace, the label gives a small press, and the object lifts and glows for as long as its panel is open, then settles. Nothing stays lifted or highlighted after a tap. Keyboard focus still lifts and outlines.
- **Tap targets**: each label looks the same and has an invisible hit area of at least 44 px.
- **Labels at phone width**: worked out by arithmetic at 390 and 320 px: the five labels do not overlap and stay inside the room. No position was changed. At 320 px the hit areas of "System Explorer" and "Experience" overlap by about 8 px; the visible labels do not.
- **The "ROOM_01 / 4.20 m" tag in the header**: at 600 px and under the header has 36 px of top padding, so the ruler, the tag and the name each have their own band (14 px between the tag and the name). The desktop header is unchanged.
- **The panel** opens on a phone exactly as on a desktop.

### Reduced motion

The page shows Off: the powered room, lit traces, labels showing, the panel opening at once, nothing moving. Off now uses the same first-screen layout as Power-on (`fit.css` applies to both), and the feed line is drawn. A rule in `room.css` also switches off every animation and transition under `prefers-reduced-motion`, in case the script's answer is ever late.

### Tests

- `src/styles/motion.test.ts`: the transform-and-opacity rule still covers the whole site. **One named exception** (`LINE_DRAWING`): in `variants/motion/power.css` only, the keyframes `rm-b-draw` only, may animate `stroke-dashoffset` only. Tests check the exception is still in use and excuses nothing else.
- `motion-room.test.tsx`: the fifteen layers, and the comparison with Exploded (it leaves out only the wiring, heads, pads, blooms, flows and typing cover, and on Exploded's side the traces, pads and packets the hybrid replaces).
- New: `opening.test.ts`, `power-on.test.tsx`, `stylesheets.test.ts` (the kinds of opening, the phases, skip, Replay, reduced motion on the page, tap, and the stylesheets' scoping).
- Not testable in unit tests: real timing and rendering, the wait for the room to be seen, the CSS cascade, real touch.

### Performance: one scripted measurement of the full opening

Desktop Chrome, headless, 1920x1080, hardware-accelerated, from power leaving the bar to the room being on. The browser ran uncapped at about 200 frames a second, so frame times are lower than on a 60 Hz screen. The trace files are deleted.

| | Normal CPU | CPU slowed 4x |
| --- | --- | --- |
| Length of the opening | 4946 ms | 5046 ms |
| Frames | 1031 | 647 |
| Frame time: mean / median / 95th percentile | 4.8 / 4.6 / 5.3 ms | 7.8 / 7.5 / 10.6 ms |
| Longest frame | 114 ms | 132 ms |
| Frames over 33 ms / 50 ms / 100 ms | 2 / 1 / 1 | 3 / 2 / 2 |
| Main-thread tasks over 50 ms | 0 | 1 |

Two things to know. The "4 second" opening measures about 4.9 seconds from power leaving the bar to the last animation ending; it is the same opening the owner chose, not a change. And each run has one frame over 100 ms; the measurement does not say where in the opening it falls. The return and mobile openings were not measured. The return opening runs the same animations as the full one in less time.

## Decided for the owner, to confirm

- **"Browser session" is the tab's session** (`sessionStorage`): a reload or coming back to the page plays the return version; a new tab plays the full opening once.
- **A phone or touch screen plays the mobile opening on every visit**, first or not. The 3-second return opening is for desktops only: it has the linework and the travelling head, which the brief keeps off phones, and the owner has not judged mobile yet. So on a phone there is no shorter return version now (the 1-second one is gone). The choice is one line in `opening.ts` (`pickOpening`).
- **"Mobile" is 600 px or less, or no hover.** A window between 601 and 1099 px wide with a mouse still plays the full opening in the older stacked layout.
- **Off and reduced motion use the fitted first-screen layout**, as Power-on does.
- **The two small notes drawn in the room** ("ROOM_01 / 4.20 m", "// scale 1:40") are about 8 px tall on a phone and are left as decoration.
- The switcher names the two states "On · Power-on" and "Off · Still".

## Look at first

1. A phone, or a narrow window: the dark room (is the unlit room too dim or too bright?), the 2.5-second opening, then tap a label and close the panel.
2. Reload on the desktop: the 3-second return version. Can the eye still follow the head, and does the monitor's typing read at that pace? Then Replay for the full one.
3. The header at phone width: the tag above the name.
4. Reduced motion (or Off) on the desktop: the room should sit as it does in Power-on.

## Not checked

- Anything in a browser, at any size, apart from the measurement above.
- On a phone the feed line runs from the bar's end down the header's right edge, close to the corner bracket. It may look crowded.
- The full-screen System Explorer panel, closing a panel part-way, switching hotspots while a panel closes, the list view with Power-on, any browser other than Chrome: written and not looked at.

## Left

1. The owner's look, and any fixes from it.
2. `/room-motion` is still the comparison page: it has the switcher (Power-on, Off, Replay) and is marked noindex. Making it the real site (its route, removing the switcher, search-engine settings) is the next job and waits for the owner.
3. Push and merge: only when the owner says.

## Working in this copy

- Dependencies are installed in this working copy and match the lockfile. `pnpm` is not on the PATH, so run the tools directly from `artifacts/portfolio`: `node ../../node_modules/typescript/bin/tsc -p tsconfig.json --noEmit`, `node node_modules/vitest/vitest.mjs run`, `node node_modules/vite/bin/vite.js build --config vite.config.ts`.
- In Git Bash, do not set `BASE_PATH=/`: the shell rewrites it into a Windows path and the built site will not load.
- `.claude/launch.json` (not committed, by the owner's decision) starts the built site on port 5173 for a look in the browser. Build first.
- If the page is open in a browser that is in the background, it may slow to about one frame a second. Motion's spring then looks stalled; CSS animations do not. Bring the window to the front before judging smoothness.
- `artifacts/mockup-sandbox/src/.generated/mockup-components.ts` shows as modified but has no content change (line endings). Keep it out of commits, by the owner's decision.

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
