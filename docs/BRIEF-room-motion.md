# Brief — room motion

The owner's brief for the room-motion job, saved as given on 2026-11-12, followed by the owner's decisions after Step 1. Where the two differ, the decisions win.

## The brief

Be ambitious.

### The job

Build a hybrid room on a new branch, feature/room-motion, cut from feature/room-concepts: the Elevation header (Amber LED: framed name and title with the loading bar) on top of the Exploded room (Kapton amber and Copper accents). Then build three distinct motion concepts on that room, selectable from a switcher at /room-motion, so I can compare them live and choose from the result.

Work in steps. Stop and report after each one. Do not start the next step until I say so.

- Step 1 (no code changes): Read docs/STATUS.md and the round 2 Elevation and Exploded code. Report: how the Exploded room is built (SVG, CSS 3D, images, canvas), what animation tooling is installed, and your tooling proposal for each motion concept below. For any library, give its bundle size, why CSS and browser APIs alone would fall short, and whether it can load after first paint. Also tell me which concept you think will look best and which is riskiest.
- Step 2: Static hybrid at /room-motion with a switcher (motion: A, B, C, off) and a header toggle (Amber LED header / Exploded's own header).
- Step 3: Motion A, "Assembly".
- Step 4: Motion B, "Power-on".
- Step 5: Motion C, "Depth focus".

### The why

This is a portfolio for a backend-led Full Stack .NET engineer. Basic hover fades are what everyone ships. The motion has to be the reason someone remembers the site: smooth, deliberate, detailed. Round 3 (scroll-driven 3D rotation) was rejected because it looked bad and moved erratically, so smoothness and control matter more than spectacle. I am choosing between the three from the finished result, so each one needs to be built to the same level of polish.

### What I told my lead (my answers, use them as given)

- Base: I like the Elevation header best, but its room is flat and hard to animate. Exploded already has depth. So: Elevation header on the Exploded room.
- Ambition: anyone can do basic light animation. To stand out I want very smooth transitions and effects with real detail.
- Options: I want to choose from finished results, not commit to one idea and be disappointed.
- Tooling: whatever looks best, but propose it to me first.
- Opening: 2 to 3 seconds, skippable.
- Devices: desktop first, simpler on mobile.

### The motion concepts

Each one covers: page load, idle, hotspot hover/focus, hotspot open, and close. These are starting points. Push the detail further where you see a better idea, and tell me what you changed.

A. Assembly. The room starts fully exploded and the layers travel in and seat themselves, staggered, with a slight settle. The header loading bar is the real progress of that assembly, not a decoration. Opening a hotspot pulls that object's layer out of the stack and it becomes the panel (one continuous transition, no cut). Closing reseats it.

B. Power-on. The room draws itself as blueprint linework, then power arrives: amber spreads along copper traces from the header into each object, which lights when its trace reaches it. Hover or focus sends a pulse down the trace to that object. Opening unfolds the object into its panel along the same linework.

C. Depth focus. The layers respond to the pointer with spring-based parallax, a few degrees at most. Hover or focus lifts one layer toward the viewer while the others dim and soften. Opening slides the lifted layer forward into the panel.

### The rules

- The opening runs 2 to 3 seconds and is skippable by click, tap, or any key, and it must not replay in full on every return to the room. Reason: a recruiter should never wait on an animation.
- Desktop is the showpiece. On mobile and touch, ship a simpler version of each concept (shorter opening, no pointer effects, tap to focus) that still looks intentional. Reason: that is where I want the effort, but mobile must not look broken.
- No scroll-driven animation and no free rotation. Reason: that is what failed in round 3.
- Any tooling is allowed (animation library or WebGL) but only after I approve your Step 1 proposal. Reason: I want the best result, and I approve dependencies.
- Heavy libraries load after the page is usable, and layout space is reserved up front. Reason: CLS must stay 0 and first paint must stay fast, even if the Lighthouse score dips during exploration.
- After each motion step, check it in the browser performance panel and tell me honestly if it drops frames and where. Reason: round 3 felt erratic and I would rather hear it from you than find it.
- Every motion must be interruptible and reversible mid-flight (hover away, close early, switch hotspot). Reason: animations that must finish before responding feel broken.
- Respect prefers-reduced-motion with a still, fully usable version, and keep every hotspot reachable by keyboard with visible focus. "Off" in the switcher shows this state. Reason: the site must work for everyone.
- Content comes only from docs/RESUME-SOURCE.md plus UI labels. No invented metrics, dates, projects, or claims. Keep [TO CONFIRM] labels and "Live link coming soon." No phone number, street address, or the internal business-operations tool. Reason: standing content rules.
- Do not touch the other /room-concepts variants, main, or feature/room-rotation. Reason: I still need round 2 for comparison.
- Do not push or merge. Commit locally only. Reason: I approve every push.
- No Lighthouse runs, contact sheets, or full Playwright sweeps. Run the build and the existing unit tests only. Reason: usage limits.
- Use sub-agents on Sonnet or Haiku for mechanical work (copying the header, wiring the switcher). Reason: usage limits.
- Update docs/STATUS.md after each commit with the step finished and the next step. Reason: I resume sessions from that file.

### Effort per step

- Step 1 (read and propose): moderate. Read only the round 2 Elevation and Exploded files and STATUS.md, not the whole repo.
- Step 2 (static hybrid): low. This is assembly of existing parts.
- Steps 3 to 5 (motion): high. This is where the thinking and polish go. Spend it on timing, easing, and detail, not on scaffolding.

Use sub-agents on Sonnet wherever work is parallel or mechanical, and keep the main model for motion design:

- Step 1: one sub-agent summarises the Elevation code, one the Exploded code, in parallel.
- Step 2: one copies the header, one wires the switcher and toggle.
- Steps 3 to 5: after the main model finishes the desktop motion, sub-agents build the reduced-motion state, the simpler mobile version, and any test updates.

Reason: usage limits, and the expensive model should only do the part that needs taste.

### Done looks like

- Step 1: a written report and proposal, no code changed.
- Steps 2 to 5: /room-motion loads the hybrid room with a working motion switcher and header toggle, one local commit per step on feature/room-motion, build passing.
- Each report tells me: what you built, what you changed from the concept and why, anything that felt janky that you could not fix, and what to look at first when I open it.

## The owner's decisions after Step 1 (2026-11-12)

Approved. Start Step 2, with these conditions:

1. Tooling: approved as proposed. No WebGL.
2. Perspective in C: allowed, a few degrees at most, pointer only.
3. B: add the feed trace from the loading bar into the room.
4. docs/STATUS.md: check main and the other branches first and carry the existing copy over. Create a fresh one only if none exists, and tell me. Also save the full brief as docs/BRIEF-room-motion.md.
5. Dependencies: reuse the installed copy only if the lockfile matches. If it does not, stop and tell me.
6. Performance: one scripted trace per finished motion, not during iteration. Report only frame-time numbers and long-frame counts, never trace contents. Delete trace files afterwards (S: is low on space).
7. New build order after Step 2: B (Power-on), then C (Depth focus), then A (Assembly).
8. The transform-and-opacity unit test: do not loosen it for the site. Add a narrow, named exception for /room-motion only, and report it.
9. You wrote "five layers" but listed six. Confirm the real count before splitting the SVG.
10. Reusing the layer split from round 3: copy the code into the new branch. Do not merge or modify feature/room-rotation.

Still no push or merge. Stop and report after Step 2.

## The approved tooling (from the Step 1 proposal)

No new dependency.

| Part | Tool |
| --- | --- |
| Openings, all three concepts | The browser's Web Animations API, with spring-shaped easing. Starts at first paint, can be skipped, reports progress. |
| Hover, focus, open and close, all three | Motion's non-React `animate` and springs (`framer-motion` 12.43, already installed, unused until now). Measured at 22.4 kB gzipped; loads after first paint. |
| A: the layer becomes the panel | Hand-built: one spring drives the layer and the panel together. |
| B: line drawing | The browser API, animating stroke dash offset on a strokes-only copy of the layers. It repaints on the main thread; if it drops frames, fall back to transform-only reveals. |
| C: pointer parallax | Motion springs, a few degrees at most, pointer only. |
| C: "soften" | Cross-fade to a pre-blurred copy, not an animated blur. |

Not used: GSAP, WebGL, the browser's View Transitions (they cannot be interrupted), Motion's React layout animations.

## Working rules from 13 November

The owner's rules for every later session on this job, written after the usage limit was reached on 12 November. They override anything above that says otherwise, including the earlier rules to check each motion in the browser performance panel and to run a trace after each motion step.

- The main model writes motion design only: timing, easing, choreography, visual detail. Reason: that is the only part that needs the strongest model.
- Tests, the test exception, typecheck and build fixes, the mobile version, and the reduced-motion state go to sub-agents on Sonnet or Haiku, or to a session running on Sonnet. Reason: usage limits.
- No model opens a browser, takes screenshots, or records traces unless the owner asks. The owner checks the page and reports what they see. Reason: browser checks used a large share of the last limit.
- Sub-agents return under 150 words plus file paths, never file contents. Show only the last 20 lines of command output. Reason: context size.
- No performance trace until the owner has chosen a motion. Reason: no point measuring options that may be rejected.
- Commit locally after each finished piece, before starting the next. Reason: a limit can hit at any time.
- No push or merge. Reason: the owner approves every push.
