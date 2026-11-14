# Status — room motion (round 4)

Updated on 2026-11-13, after the rework of Motion B's opening (the owner's second brief of that day). The original brief, the owner's decisions and the **working rules from 13 November** are in `docs/BRIEF-room-motion.md`. Read those rules before doing anything else.

**Nothing in the rework has been looked at in a browser.** By the working rules the owner checks the page and reports. Everything below about how it looks is what the code is written to do.

## Where things are

- **Branch**: `feature/room-motion`, created from `feature/room-concepts` at `5ee726b`. It is **not pushed**, and nothing is merged.
- **Route**: `/room-motion`, and `/room-motion?motion=a|b|c|off`. Off is the default. For Motion B, `&speed=4|6|8` picks the opening's length; 6 is the default and is left out of the address.
- **Other branches are untouched**: `main`, `feature/room-concepts` and `feature/room-rotation`.

| Step | What | State |
| --- | --- | --- |
| 1 | Read the code, propose tooling | Done. Approved by the owner. |
| 2 | Static hybrid with the switcher | Done, commit `611bbfd`. |
| — | Kapton amber and the Amber LED header only | Done, commit `1093a57`. |
| 3 | Motion B, "Power-on" | **Desktop opening reworked, waiting for the owner's look.** First build `b557bef`; rework `99ff493`, `e96a24d`, `6e4214d`, `699921b`. |
| 4 | Motion C, "Depth focus" | Not started. |
| 5 | Motion A, "Assembly" | Not started. |

**State of the tip**: typecheck passes and the build passes. **Unit tests: 95 of 98.** The three failures are the same expected ones, listed under "Left".

## Motion B: the rework of 13 November

**Why**: the owner saw the first build and said the opening was over in one or two seconds, too fast to follow, lit things only a little, and was missed where the room sat below the first screen. The opening is now 4, 6 or 8 seconds (this replaces "2 to 3 seconds" in the brief), starts only when the room is seen, and has a much stronger before and after. The idle packets and the hover lift are **unchanged**, by the owner's instruction.

Files are in `src/variants/motion/`: `power.css` (all the timing), `usePowerOn.ts` (when it starts, skip), `wiring.tsx` (traces, the travelling head), `Feed.tsx`, `fit.css` (the desktop fit), `MotionStage.tsx`.

### What is built (desktop)

1. **The room fits the first screen** (`fit.css`, Motion B only, from 1100 px wide).
   - Wide window: the header is a 340 px title block at the top left, with the name on three lines, and the room takes the full height beside it. The feed leaves the loading bar, climbs beside the header, runs over the top of the wall and drops into the corner.
   - Squarer window (narrower than 7:5): a compact two-row header above the room, the feed as before.
   - The room is never made smaller than the window's height forces. Worked out from the CSS, not measured: in a full-screen window on a 1920x1080 screen the room is its full 1120 px; on a 1366x768 screen (about 640 px of window height) it is about 800 px wide, because a 1120 px room is 747 px tall and cannot fit that height at any header size.
2. **The opening waits to be seen** (`usePowerOn.ts`). At page load the loading bar charges and the linework is drawn. Then the room waits dark, every animation paused on its first frame (`data-b='dark'`), until the bar has charged, 60% of the room is on screen and the tab is in front. It then runs once, on time (`data-b='opening'`, then `'on'`). Nothing follows the scroll position.
3. **Three speeds** in the switcher: 4, 6 and 8 seconds, with a Replay button. Power covers the feed and the furthest trace in 2.3, 3.7 or 5.2 seconds at one constant speed, and each object's own beats stretch with it (`--rm-travel`, `--rm-k` in `power.css`).
4. **Power travels as a head with a tail** (`Heads` in `wiring.tsx`): a hot point with a 150-unit fading tail, moved by transform only. It turns corners, splits in two at each branch, and its tail drains into whatever the trace ends at. The lit trace is drawn in behind it.
5. **Before power**: near-black stage, dim linework, dim copper, labels hidden. The loading bar is the one bright thing.
6. **Each object comes on in its own way** as its trace arrives. All of them first flicker, like a tube striking. Then: the shelf's spines light one by one; the project frame draws its three boxes and then the links; the cabinet's drawers come on from the top down; the mailbox's flag goes up; the monitor boots (title bar, its three lights, the prompt types `dotnet run` letter by letter, the output prints, then the glare and the amber edge). Each label appears only when its object is live.
7. **Skip**: any click, tap or key while the opening runs finishes it at once. While the room is still dark and off screen, keys and clicks elsewhere do not skip it (scrolling to the room with the keyboard must not kill the opening); a click on the room, or keyboard focus reaching a label, powers it at once.

### Added beyond the owner's list

- The bar **releases its charge**: a bright block runs along its segments and leaves by the end where the feed begins, then the bar dips. While it waits for the room to be seen, the charged bar breathes.
- **A ring spreads from every pad** as power reaches it, and once more from all of them together when the room goes live.
- **The room comes on in stages**: the wall half lit as power enters it, the floor plate as power steps down onto it, the full light only when the monitor has booted. The header's status light blinks "standby" until then and goes solid at that moment.
- The opening also waits for the **tab to be in front**, so a page opened in a background tab is not missed.
- The switcher is a **compact panel at the bottom left** on desktop, so it does not cover the room.

### Changed from the brief: for the owner to confirm

- **The short "return visit" opening is switched off.** Every load, and every Replay, plays the full opening, so the three speeds can be compared. The brief says the opening must not replay in full on every return. Decide what a return shows once a speed is chosen.
- **The tight header is Motion B's only.** A, C and Off keep the old header and layout until their turn.

### Look at first

1. `/room-motion?motion=b` in a full-screen window: does the header sit clear of the room, and does the feed line run clear of the header's text and the room's labels? The layout was built from the drawing's geometry, not from a look at the page.
2. The three speeds, with Replay. Can the eye follow the head from the bar to each object?
3. The monitor's typing: the cover that hides the untyped letters is a flat dark rectangle laid over the screen. If its edge shows, or the letters and the cursor do not line up, say so.
4. The dark room: is the linework too dim or too bright before power?

### Not checked

- Anything in a browser, at any size: see the note at the top.
- Mobile and touch, and widths under 1100 px: not touched in the rework. They get the new opening with the old layout.
- The full-screen System Explorer panel, closing a panel part-way, switching hotspots while a panel closes, keyboard focus pulses, the list view with Motion B on, any browser other than Chrome: as before, written and not looked at.
- No performance trace. The head adds about twenty small moving groups; the linework and the lit traces still animate `stroke-dashoffset`, which repaints on the main thread.

## Motion B: left

Items 1 to 3 go to Sonnet or Haiku sub-agents, or to a session running on Sonnet (working rules). None has been started; the owner wants B right first.

1. **Tests and the test exception.** Three unit tests fail:
   - `src/styles/motion.test.ts` rejects `power.css`, because the keyframes `rm-b-draw` animate `stroke-dashoffset`. It is still the only keyframe that does. Add the narrow, named exception the owner asked for, for `/room-motion` only: that one keyframe name, in that one file. Do not loosen the rule for the site, and report the exception.
   - Two tests in `motion-room.test.tsx` still expect the old 13 layers and an exact match with Exploded. There are 15 layers (`wallwire` and `bloom` are new, `packets` became `flows`); `traces`, `wallwire` and `flows` hold things Exploded does not have (the wiring, the heads, the pad rings, the typing cover), so the comparison must leave those layers out. The object layers themselves are unchanged.
   - Nothing yet tests the wiring, the opening's phases (`dark`, `opening`, `on`), or the panel in Motion B. The switcher's speed row and `parseSpeed` are tested.
2. **Simpler mobile and touch version**: shorter opening without the linework, no hover effects, tap to focus, a simpler panel.
3. **Reduced-motion state**: with reduced motion the page already shows Off, which is the powered room with the feed and an instant panel. It needs checking and a test.
4. **Return visits**: see "Changed from the brief".
5. **Performance trace**: **not yet, and not by a model unless the owner asks.** The owner chooses a motion first.
6. **Looking at it**: the owner checks the page and reports what they see. No model opens a browser or takes screenshots unless asked. Open `/room-motion?motion=b` after building and starting the preview (see below).
7. The report for Step 3, then the owner's go-ahead for Motion C.

## Working in this copy

- Dependencies are installed in this working copy and match the lockfile. `pnpm` is not on the PATH, so run the tools directly from `artifacts/portfolio`: `node ../../node_modules/typescript/bin/tsc -p tsconfig.json --noEmit`, `node node_modules/vitest/vitest.mjs run`, `node node_modules/vite/bin/vite.js build --config vite.config.ts`.
- In Git Bash, do not set `BASE_PATH=/`: the shell rewrites it into a Windows path and the built site will not load.
- `.claude/launch.json` (not committed, by the owner's decision) starts the built site on port 5173 for a look in the browser. Build first.
- If the page is open in a browser that is in the background, it may slow to about one frame a second. Motion's spring then looks stalled; CSS animations do not. Bring the window to the front before judging smoothness.
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
