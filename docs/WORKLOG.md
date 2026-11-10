# Work log

## v1 cleanup — branch `cleanup/v1-scope` (2026-11-08)

Owner-approved decisions for v1:

- Night blueprint is the only room direction; the warm workshop, the A/B switcher and `/room-directions` go.
- The room's project panels are the only project view; the `/projects/*` pages, the old shell, the old 404 link list and the old footer's resume link go.
- No AI guide in v1: no endpoints, tests, chat UI or model calls.
- Replit files and dependencies are removed without replacements for now (recorded below for later planning).
- The committed resume PDF is replaced by a placeholder until a clean public copy exists.
- The build must run on Windows and Linux.

Each step is a separate commit on the branch.

### Replit removal (step 1)

| Removed | What it did | What a future replacement needs to cover |
| --- | --- | --- |
| `.replit` | Declared the toolchain (Node 24, .NET 10, Python 3.13, Nix packages for MuPDF), the autoscale deployment with a post-build `pnpm store prune`, the Run-button workflow and the post-merge hook. | Pinned toolchain versions (Node 24, pnpm 10, .NET 10 SDK; Python with PyMuPDF only for the resume script), a hosting target, and its build and start commands. |
| `.replitignore` | Kept `.agents`, build output, test results and `attached_assets` out of deploy images. | An equivalent ignore list for whatever builds the deploy image (for example `.dockerignore`), so uploads and agent files never ship. |
| `replit.md` | Unfilled Replit Agent template; it described Express and Postgres, which this project doesn't use. | Nothing; `docs/README.md` is the project overview. |
| `.agents/` | Replit Agent memory (owner decisions, toolchain notes) and pointers to preview screenshots in Replit storage. | Nothing. The decisions live in `docs/`; the toolchain notes are kept below. |
| `artifacts/portfolio/.replit-artifact/artifact.toml` | Served the site: dev command, production build (`pnpm --filter @workspace/portfolio run build`), static serving of `artifacts/portfolio/dist/public`, SPA rewrite `/* → /index.html`, and `PORT=21113`, `BASE_PATH=/`. | Static hosting of `dist/public` with the same SPA rewrite (so unknown paths reach the app's 404 page), the build command, and `BASE_PATH` if the site isn't served from `/`. |
| `artifacts/api-server/.replit-artifact/artifact.toml` | Ran the ASP.NET Core API under `/api` on port 8080 with `ASPNETCORE_ENVIRONMENT=Production`; built with the package script, started with `dotnet dist/dotnet/Portfolio.Api.dll`, and health-checked `/api/healthz` at startup. | Only if the API stays in the release: a .NET 10 host, routing of `/api/*`, `PORT`, and a health check on `/api/healthz`. |
| `artifacts/mockup-sandbox/.replit-artifact/artifact.toml` | Ran the design-preview canvas in development at `/__mockup` on port 8081. It was never deployed. | A local dev command only. |
| `pyproject.toml`, `uv.lock`, `src/repl_nix_workspace/` | Replit's Python workspace. Its only real content was the `pymupdf` dependency of `scripts/sanitize_resume.py`. | A Python dependency file (for example `requirements.txt` with `pymupdf`) if the resume script is kept. |
| `@replit/connectors-sdk` (root dependency) | Replit's integrations SDK. Nothing imported it. | Nothing. |
| `@replit/vite-plugin-runtime-error-modal` | Replit's runtime-error overlay, always on in both Vite apps. `main.tsx` carried an `onCaughtError` workaround to stop caught errors raising it; that went too. | Nothing required: Vite's own overlay still shows compile errors, and React logs caught errors to the console. |
| `@replit/vite-plugin-dev-banner` | Replit's banner in the portfolio dev preview (only when `REPL_ID` was set). | Nothing. |
| `@replit/vite-plugin-cartographer` | Element mapping for Replit Agent's visual editor (only when `REPL_ID` was set). | Nothing. |
| Replit entries in `pnpm-workspace.yaml` | Catalog versions for the three plugins, and an exemption of `@replit/*` and `stripe-replit-sync` from the one-day minimum release age. | Nothing; the release-age rule now applies to every package. |
| Replit section of `.gitignore`, `.pythonlibs/` | Ignored Replit's cache, pnpm store (`.local/`) and Python library folders. | Nothing. |

Handled by later steps: `scripts/post-merge.sh` (step 2), Replit's managed-AI settings `AI_INTEGRATIONS_OPENAI_*` (removed with the AI guide, step 2), and the overrides that strip non-Linux native binaries (step 7). Two unused shadcn components (`ui/button.tsx`, `ui/badge.tsx`) still carry `// @replit` comments; they were left untouched.

Toolchain notes kept from the removed agent memory:

- The API's production package uses `dotnet msbuild -t:Publish` (its `build` script) because `dotnet publish` with an output property failed with MSB1008 in Replit's SDK. Recheck before switching back.
- The API test script restores serially (`-p:RestoreDisableParallel=true`); unbounded restores stalled in Replit's container.

### Dead code and AI guide removal (step 2)

- Old single-page home: `pages/home.tsx` and its `Hero`, `Explorer`, `Ambassador` and `Sections` components (nothing routed to them), plus the portfolio.ts exports only they used.
- Replit template leftovers: the Express server (`artifacts/api-server/src`, `build.mjs`, its tsconfig and Node dependencies), `lib/db` (Postgres/Drizzle), `scripts/post-merge.sh`, and the `scripts` workspace package (`hello.ts`, package.json, tsconfig). `scripts/sanitize_resume.py` stays as a plain script.
- Stale browser test `e2e/portfolio.spec.ts` (it targeted `/#ambassador`, which no longer exists).
- AI guide: the `/api/ambassador` and `/api/ambassador/status` endpoints, the evidence catalog and model selector, the rate limiter that only guarded them, their xUnit tests, the ambassador operations in `lib/api-spec/openapi.yaml` and the generated hooks/schemas (regenerated with orval), the managed-AI smoke check `scripts/dotnet-compatibility`, and the static "ask the portfolio" chat previews in the SystemExplorer and EvidenceStory mockups. No code makes model calls.
- The API keeps `/api/healthz`, its security headers and the problem-details 404. New `HealthTests.cs` covers those and asserts both former AI routes return 404.
- `lib/api-client-react`, `lib/api-zod` and `lib/api-spec` (health check only) were left in place here and deleted in a later commit, once it was confirmed nothing used them.

### Excluded internal project removed from current files (step 3)

Per `docs/RESUME-SOURCE.md`, the internal project that isn't on the allowlist, its name and its metric are gone from every current file: the portfolio's project data and link handling (and their tests), `docs/public-facts.json` (deleted entirely in a later commit), `docs/README.md`, and both mockups. This log deliberately doesn't name it. The project pages, 404 list and mockups now show two projects, and the design brief says "two project subjects". Git history still contains the old text; see the history-rewrite plan below.

### Resume PDF replaced by a placeholder (step 4)

- Removed the committed `artifacts/portfolio/public/resume.pdf` (phone redacted, but it carried the excluded project and other text outside the allowlist).
- Added a one-page placeholder at the same path that says to replace it with the clean public copy. `.gitattributes` marks PDFs as binary so line-ending conversion can't corrupt them.
- Removed the old footer's "Download resume" link and the unused `RESUME_URL` helper. The room's contact panel already shows "Resume download unavailable".
- `scripts/sanitize_resume.py` only redacts phone numbers. Running it on the original upload would reproduce excluded content, so a clean copy needs a separate review against `docs/RESUME-SOURCE.md`.

### Unlabeled and placeholder text removed (step 5)

- Room project cards: dropped the "Outcome: Not yet documented." row. Outcomes stay as editorial placeholders in `docs/CONTENT.md` until verified ones exist.
- RecruiterBrief mockup: removed both three-step flows (they were headed "RESUME EVIDENCE" without a "Representative design (to confirm)" label), their styles, and the sentence that described them. The block is now titled "Role context and boundaries."
- SystemExplorer mockup: removed the "CURRENT ROLE" badge (CONTENT.md: don't assert current employment) and its "PUBLIC-SAFE PROFILE · RESUME PDF PENDING REVIEW" footer line.
- EvidenceStory mockup: removed the "Working thesis" band.
- Old site footer: removed "PUBLIC-SAFE PROFILE · RESUME-BACKED FACTS ONLY".

### Night blueprint room is the only view (step 6)

- Routes: `/` is the room; everything else, including the retired `/room-directions`, `/room-directions/:dir` and `/projects/:slug`, shows the 404 page.
- Removed: the warm workshop illustration and styles, the A/B direction switcher, the old System Explorer shell (`SiteShell`, `ProjectLinks`, project pages, `content/portfolio.ts`, `lib/paths.ts`, `explorer.css`, `additions.css`), and the 404 page's old link list.
- Link config: `docs/project-links.json` is gone. `src/content/site.ts` is the single source for `CRM_LINK` and `ECOMMERCE_LINK`, and its values now go through the same URL validation (in the room and at build time) that the old file had.
- Renamed: `pages/room-directions.tsx` → `pages/room.tsx`, `content/room-preview.ts` → `content/room.ts`, `e2e/room-directions.spec.ts` → `e2e/room.spec.ts`.
- Polish:
  - The header slot the switcher used now holds a "Get in touch" email link.
  - The Explorer's stale "deferred until a direction is chosen" banner now says one flow is mapped and nine are not drawn yet.
  - The 404 page uses the blueprint styling with a single "Back to the room" link.
  - `index.html` loads the room's fonts (no more render-delaying CSS `@import`) and uses the room's theme colour.

### Build and tests run on Windows and Linux (step 7)

**Native-binary overrides removed.** `pnpm-workspace.yaml` excluded every non-linux-x64 binary of esbuild, Rollup, Lightning CSS and Tailwind's engine (plus unused ngrok binaries), because Replit only ran Linux. On Windows that broke `vite build` and Vitest with `Cannot find module @rollup/rollup-win32-x64-msvc`; esbuild only survived by downloading its binary through npm during install.

**Trade-off.** The lockfile now lists every platform's optional binary (5,861 → 6,466 lines). pnpm still installs only the binary for the current machine, so installs aren't heavier, but the lockfile is bigger and Linux installs resolve a little more metadata. The old setup kept Replit's Linux images minimal at the cost of breaking Windows and macOS. If a future Linux-only deploy needs a slimmer install, set pnpm's `supportedArchitectures` in that environment instead of stripping binaries for everyone.

**Scripts.**

- API `test`: dropped the Unix-only `DOTNET_PROCESSOR_COUNT=2` prefix, which `cmd.exe` can't run (it was a Replit container workaround). Serial restore stays. If restores stall on a small CI machine, set that variable in the CI environment.
- API `typecheck`: dropped `--no-restore`, which failed on fresh clones with NETSDK1004. Restore is a no-op once packages are restored.
- Root `preinstall`: the pnpm-only guard is a Node one-liner instead of `sh -c` (which needed Git's `sh` on Windows).
- Root `packageManager: pnpm@10.34.9`, so Corepack uses the same pnpm everywhere.
- Vite configs: `BASE_PATH` defaults to `/`, and `PORT` to 5173 (portfolio) or 5174 (mockup sandbox), so `pnpm run build` needs no environment variables in any shell. Set either one to override.
- Playwright: `test:e2e` builds and serves the production preview itself on port 4173 unless `PLAYWRIGHT_BASE_URL` points at a running site.

### Git history rewrite — planned, NOT run (needs owner approval)

**Why.** Deleting files in new commits doesn't remove them from history. Every earlier commit on GitHub still holds (1) the old resume PDF, blob `4ffe67636220cea02bc890184affd24c70ce36a8` (added in `2b3afea`), and (2) the excluded project's name and metric in older versions of the docs, portfolio code, mockups, AI knowledge file and agent memory. Commit messages don't contain either (checked).

**Tool.** [git-filter-repo](https://github.com/newren/git-filter-repo): `pip install git-filter-repo`.

**When.** After this branch is merged into `main` and pushed, so every commit to keep is on GitHub.

**Prepare two files outside the repository** (they must never be committed):

- `strip-blobs.txt`, containing one line: `4ffe67636220cea02bc890184affd24c70ce36a8`. This deletes only the old PDF's contents; the placeholder has a different blob ID, so it stays.
- `replacements.txt`, one rule per line in filter-repo's format (`text==>replacement`, or `regex:pattern==>replacement`), covering the excluded project's name and its variants, the metric, and its distinctive description phrases, each replaced with `[removed]`. The terms live only in this file so that the log never names them.

**Commands** (run from the folder holding the two files):

```bash
git clone --mirror https://github.com/satyendra-varma/Scalable-Portfolio-Showcase.git portfolio-backup.git
git clone --mirror https://github.com/satyendra-varma/Scalable-Portfolio-Showcase.git portfolio-rewrite.git
cd portfolio-rewrite.git
git filter-repo --strip-blobs-with-ids ../strip-blobs.txt --replace-text ../replacements.txt
git remote add origin https://github.com/satyendra-varma/Scalable-Portfolio-Showcase.git
git push --force --mirror origin
```

Optional additions to the same run: `--path .agents --invert-paths` also strips the old Replit Agent files, which hold the Repl ID and storage paths.

**Effect.**

- Every commit gets a new hash, and the old PDF and the replaced text disappear from all versions.
- `portfolio-backup.git` keeps the untouched originals; delete it once the result is verified.
- **Every existing clone, including the local working copy on `S:`, must be re-cloned** (or hard-reset to the new `main`). Never push from an old clone: that would bring the history back.
- filter-repo drops `origin` on purpose; the commands above re-add it.
- GitHub can keep unreferenced objects and cached views for a while, and pull-request refs can't be rewritten. If that matters, ask GitHub Support to run garbage collection after the push.

**Check afterwards:**

- `git cat-file -t 4ffe67636220cea02bc890184affd24c70ce36a8` should fail.
- `git log --all -p | grep -i -F -f terms.txt` should print nothing (`terms.txt` is the same terms, one per line, also kept outside the repo).

## Follow-up: CI and final cleanup (2026-11-09)

Earlier follow-up commits on the same branch:

- `fe4a398` Add CI for Linux and Windows (`.github/workflows/ci.yml`; run 42580299290 passed on both).
- `5ae71a2` Remove unlabeled mockup claims and Replit comments (run 42581151296 passed on both).

### Commits in this task

| Commit | Message | Build | Unit tests | API tests | Playwright |
| --- | --- | --- | --- | --- | --- |
| `6533a5f` | Delete public-facts.json | pass | 19/19 | 5/5 | 10/10 |
| `6769b8e` | Delete the unused generated API packages | pass | 19/19 | 5/5 | 10/10 |

Local checks ran on Windows 11 against a clean copy of each commit: frozen-lockfile install, root `pnpm run build` (typecheck plus every package build), Vitest, the API test script, and Playwright (desktop and mobile Chromium, using the installed Chrome). No failures, so no fixes were needed.

`pnpm-lock.yaml` was regenerated with `pnpm install --lockfile-only` (5,827 lines, down from 6,466; orval and its dependencies dropped out). It was not hand-edited, and each check's frozen install confirmed it matches the package files.

### CI on the final code commit (`6769b8e`)

Run [42583363353](https://github.com/satyendra-varma/Scalable-Portfolio-Showcase/actions/runs/42583363353), conclusion **success**:

| Job | Duration | Unit tests | API tests | Playwright |
| --- | --- | --- | --- | --- |
| ubuntu-latest | about 2 min | 19/19 | 5/5 | 10/10 |
| windows-latest | about 6 min | 19/19 | 5/5 | 10/10 |

### Lighthouse (measured, nothing changed)

Lighthouse 13.6.0, mobile form factor, simulated throttling, headless Chrome, against the local production preview of `6769b8e`; three runs. Not a deployed-site measurement.

- Scores in all three runs: Performance **88**, Accessibility 100, Best Practices 100, SEO 100.
- LCP 0.9 s, TBT 40–70 ms, **CLS 0.233–0.237**.
- Performance misses the 90+ target only because of CLS. Lighthouse attributes one layout shift of `main#rp-main` to "Web font loaded" (three fonts).
- This is a regression from the earlier v1 cleanup step 6, which moved the room's fonts from a render-blocking CSS `@import` into a non-blocking `<link>` in `index.html`. The Replit measurement before that change showed CLS 0.034. Not fixed here (see "Needs decision").

### Remaining mentions of the removed items

- `docs/WORKLOG.md` (the step 2 AI-guide bullet, the step 2 note about the three packages, and the step 3 note about `public-facts.json`): historical notes that now say the items were removed later. **Harmless.**
- No code, config, workflow or other doc mentions `lib/api-client-react`, `lib/api-zod`, `lib/api-spec` or `public-facts.json`.

### Proposed additions (not built)

- ~~Self-host the fonts with a metric-matched fallback to remove the CLS.~~ Done in the second pass (`256ea15`).
- Keep the room header on one row on phones (the "Get in touch" link wraps under the pill at 390 px).
- Draw the nine remaining System Explorer flows, once their stages are confirmed (`docs/ROOM-DIRECTIONS.md` question 7).
- Add a Lighthouse check to CI so performance regressions surface automatically.
- Cache Playwright's Chromium in CI to shorten the Windows job.

### Needs decision

- ~~**Room content vs `docs/RESUME-SOURCE.md`.**~~ Those items were added to RESUME-SOURCE in the second pass (`a161c07`); the remaining differences are listed in the second-pass report below.
- ~~**The CLS fix.**~~ Done in the second pass (`256ea15`): CLS 0.233 → 0.
- ~~**Orphaned config.**~~ All removed in the second pass (`64cf5dc`). Correction: nothing installed `proxy-addr` at that point; the earlier "transitive copy" note was wrong (the search had matched the override line itself).
- **The API service** now only answers `/api/healthz`. Keep it for a later phase, or drop it for a frontend-only v1 (FRD open question 1).
- **Unused shadcn components** in `artifacts/portfolio/src/components/ui/` (most are unused by the room).
- ~~**RecruiterBrief mockup headline** isn't resume wording.~~ Resolved: the RecruiterBrief mockup was deleted.
- ~~**Placeholder `resume.pdf`** is still served.~~ Resolved: the placeholder was removed.
- **Git history rewrite** is still pending your approval (plan above).

### Unsure

- I read "regenerate pnpm-lock.yaml by running pnpm install" as `pnpm install --lockfile-only`. That rewrites the lockfile without creating `node_modules` or a pnpm store on the `S:` drive. A full `pnpm install` from that lockfile then ran in every check, locally and in CI.
- This report is committed after the code, so the CI run listed above covers the last code commit (`6769b8e`). The report commit itself only changes this file.

## Open items closed (2026-11-09, second pass)

### Resume PDF removed (step 5)

The placeholder `artifacts/portfolio/public/resume.pdf` is gone, so builds no longer publish any PDF, and nothing links to `/resume.pdf` (a browser test checks that the path doesn't return a PDF). **The download button returns when the clean public PDF is added** at that path: review it against `docs/RESUME-SOURCE.md`, then restore a download link in the room's Contact panel, which until then says the download is unavailable. The real PDF was not added.

### Report

**Commits**

| Commit | Message | Build | Unit tests | API tests | Playwright |
| --- | --- | --- | --- | --- | --- |
| `256ea15` | Self-host the room fonts with metric-matched fallbacks | pass | 19/19 | 5/5 | 12/12 |
| `b221968` | Give the room journey browser test the slow-test budget (CI fix for step 1) | pass | 19/19 | 5/5 | 12/12 |
| `a161c07` | Add the remaining resume skills and focus to RESUME-SOURCE | pass | 19/19 | 5/5 | 12/12 |
| `64cf5dc` | Remove leftover config from the deleted packages | pass | 19/19 | 5/5 | 12/12 |
| `a44547c` | Delete the RecruiterBrief mockup | pass | 19/19 | 5/5 | 12/12 |
| `42c9aca` | Stop serving the placeholder resume PDF | pass | 19/19 | 5/5 | 14/14 |

Local checks ran on Windows 11 against a clean copy of each commit: frozen install, root build, Vitest, the API test script, and Playwright (desktop and mobile Chromium). Browser tests went from 10 to 12 with the fonts test (step 1), and from 12 to 14 with the "no PDF served" test (step 5).

**CI per commit** (ubuntu-latest / windows-latest)

| Commit | Run | Result |
| --- | --- | --- |
| `256ea15` | 42587406470 | Ubuntu pass; **Windows failed**: 11/12 browser tests (see the CI fix below) |
| `b221968` | 42588601812 | pass / pass |
| `a161c07` | 42591558671 | pass / pass |
| `64cf5dc` | 42605566395 | pass / pass |
| `a44547c` | 42619917126 | pass / pass |
| `42c9aca` | [42666562361](https://github.com/satyendra-varma/Scalable-Portfolio-Showcase/actions/runs/42666562361) | pass / pass |

**Final commit `42c9aca`.** Unit 19/19, API 5/5 and Playwright 14/14 on both ubuntu-latest (browser suite 23.6 s) and windows-latest (41.9 s).

**CI fix.** On `256ea15`, only the desktop room-journey test failed, and only on Windows. It exceeded Playwright's 30 s default at 31.6 s, with multi-second idle gaps between actions. It had taken 7–16 s in earlier Windows runs, 5.9 s on mobile in the same run, and passed on Linux and locally. `b221968` marks that one journey `test.slow()` (three times the budget); the application is unchanged. It passed on the first retry.

**Lighthouse** (13.6.0, mobile form factor, simulated throttling, headless Chrome, local production preview; 3 runs each)

| Build | Performance (runs → median) | CLS (median) | LCP / TBT (median) |
| --- | --- | --- | --- |
| Before: `6769b8e` (same code as `fa77f78`) | 88, 88, 88 → **88** | **0.233** | 0.9 s / 50 ms |
| After the font fix (`256ea15` contents) | 100, 99, 100 → **100** | **0** | 1.54 s / 42 ms |
| Final: `42c9aca` | 100, 100, 94 → **100** | **0** | 0.91 s / 46 ms |

- Accessibility, Best Practices and SEO were 100 in every run.
- The single 94 came from one run's main-thread blocking time (278 ms), not layout.
- With the web fonts blocked, the adjusted fallbacks lay out the hero pixel-identically to the web fonts at 1440 px and 390 px.

**Room vs `docs/RESUME-SOURCE.md`.** The five requested items now appear in RESUME-SOURCE with the resume's wording. No `[TO CONFIRM]` marker applied only to them, so none were removed. The room uses the same wording for them. The room shows nothing beyond RESUME-SOURCE except the items listed under "Needs decision" below.

**Remaining mentions of removed items**

- `docs/WORKLOG.md`: historical notes about `public-facts.json`, the `lib/api-*` packages, the RecruiterBrief mockup, the old resume PDF, and the earlier orphaned-config list (now marked resolved). Harmless.
- `docs/README.md`: the "no resume download yet" note. Intended.
- `artifacts/portfolio/e2e/room.spec.ts`: two tests checking that no resume link exists and no PDF is served. Intended.
- `scripts/sanitize_resume.py`: its output path is `public/resume.pdf`, which is where a clean copy would go. Harmless, but the script only redacts phone numbers.
- `artifacts/mockup-sandbox/index.html` and the two mockup `_group.css` files still load Google Fonts. Step 1 covered the room; the mockup sandbox is a development-only canvas and isn't deployed. Needs decision.
- No current code, config or doc mentions `public-facts.json`, `lib/api-*`, react-query, the `js-yaml`/`proxy-addr` overrides, `typecheck:libs` or the RecruiterBrief mockup, and the lockfile has no react-query, js-yaml, proxy-addr or orval entries. `zod` is still in the lockfile, but only as a dependency of `chromium-bidi` (browser-test tooling), not of this project.

**Proposed additions (not built)**

- Keep the room header on one row on phones; at 390 px the "Get in touch" link wraps under the pill.
- Draw the nine remaining System Explorer flows once their stages are confirmed (`docs/ROOM-DIRECTIONS.md` question 7).
- Add a Lighthouse check to CI so a CLS or performance regression fails the build.
- Cache Playwright's Chromium in CI to shorten the Windows job.

**Needs decision**

- ~~**Room content not in RESUME-SOURCE.**~~ Resolved: see "Room content matched to RESUME-SOURCE" below.
- **Mockup-sandbox Google Fonts** (see above): self-host them too, or leave them, since the canvas is never deployed.
- **The API service** only answers `/api/healthz`. Keep it, or drop it for a frontend-only v1.
- **Unused shadcn components** in `artifacts/portfolio/src/components/ui/`.
- **Git history rewrite** is still pending approval. It was not run, and nothing was force-pushed.

**Unsure**

- This task's brief started with the placeholder "[PASTE THE AMBITION BRIEF]". I applied the earlier ambition brief and its limits: resume-source facts only, no new features, and accessible motion.
- **Local check of `a44547c`:** the first run failed at install because two copies of my own check ran into the same folder (`EBUSY`/`EEXIST`). That was a mistake in how I launched it, not a project problem. The second, clean run passed.
- **Fallback sizes** were measured in Chrome on Windows against Arial and Courier New. On systems without those fonts (most Linux desktops) the fallback chain continues to the system font, which isn't size-matched. The font preload makes a visible swap rare either way.
- **Lockfile:** regenerated with `pnpm install --lockfile-only`; every check then did a full frozen install from it.
- **Lighthouse** was measured on a local production preview, not a deployed site.

## Room content matched to RESUME-SOURCE (2026-11-09)

**Commits**

| Commit | Message |
| --- | --- |
| `6f2e34f` | Close the remaining gaps in RESUME-SOURCE |
| `b0a4aef` | Make the room show exactly what RESUME-SOURCE lists |

**Local results** (Windows 11, clean copy of `b0a4aef`): build pass, unit tests 25/25, API tests 5/5, Playwright 14/14. Unit tests went from 19 to 25 with the new `room.source.test.ts`, which reads this repo's `docs/RESUME-SOURCE.md` and fails if any room string isn't in it verbatim.

**CI** on `b0a4aef`, run [42721799495](https://github.com/satyendra-varma/Scalable-Portfolio-Showcase/actions/runs/42721799495): success on both systems.

| Job | Unit tests | API tests | Playwright |
| --- | --- | --- | --- |
| ubuntu-latest | 25/25 | 5/5 | 14/14 |
| windows-latest | 25/25 | 5/5 | 14/14 |

**Changed in `docs/RESUME-SOURCE.md`**

- New "Positioning" section with the line labeled "Owner-approved positioning line (based on resume)."
- CRM project: "EF Core Global Query Filters for automated soft deletes" (the resume's exact wording); "applies to every read" stays [TO CONFIRM].
- Education: "Fairleigh Dickinson University, Vancouver, BC, Canada".
- Architecture and testing: "Domain-Driven Design (DDD)". AWS already read "AWS (EC2, S3)", the resume's exact phrasing, so it is unchanged.

**Changed in the room** (the only source is RESUME-SOURCE, copied verbatim)

- Project cards show the source's project bullets. Removed: the paraphrased context/contribution/tools text (including "Delivered a scalable ...", which isn't in the source) and the Context/Contribution/Tools labels.
- Skills panel follows the source's skill lines, group names and order:
  - groups: Backend, Frontend, Databases, Security, Cloud and DevOps, Architecture and testing, Development practices;
  - chips: "AWS (EC2, S3)" (was two chips), "Domain-Driven Design (DDD)" (was "DDD"), "SQL Server (MSSQL)", "JWT auth".
- The "EF Core global query filters" chip left the skills panel, because the source lists it under the CRM project, not under Skills. The CRM card shows it instead.
- Experience: the Nanomindz bullets now use the source's full wording. Dates read "Apr 2023 to present" and "Jul 2020 to Jun 2021", and "(as stated in resume)" is gone.
- Education: "Sep 2021 to Apr 2023" and the source's "Focus: ..." line ("Listed focus:" is gone).
- Fixed: Tailwind's reset hid the bullet markers on the room's bullet lists. They now show, in the blueprint amber.

**Still shown, not from the source** (left on purpose)

- Interface text: hotspot names, buttons, filter status messages, "Live link coming soon" and "Resume download unavailable".
- The System Explorer's CRM flow notes, which are design annotations labeled "Representative design (to confirm)" rather than resume claims.

## Approved homepage update

The owner explicitly approved making the warm Engineer’s Room the default homepage. `/` now renders that room directly; comparison URLs remain available. Homepage title and labeling were updated without changing the room's interaction model.

Verification: frontend type check and five focused room component tests passed; the restarted frontend serves the room at `/`, confirmed by a rendered screenshot. No publishing or unrelated content/API migration was performed.

## Current checkpoint: revised planning only

The latest attached brief supersedes conflicting earlier scope. **No application code, public assets, configuration, workflows, integrations or deployment settings were changed in this planning pass.**

### Completed in this pass

- Read the revised brief and compared it with the earlier requirements.
- Revised FRD.md, ARCHITECTURE.md, CONTENT.md, WORKLOG.md, TEST-PLAN.md and RELEASE-CHECKLIST.md.
- Recorded the exact positioning, two-project order, six sections, sticky active-section navigation, publication allowlist and pending-link behavior.
- Specified the future single content/config file without creating or editing it.
- Moved the ambassador to a later, separately approved phase.
- Recorded unknowns instead of inventing outcomes or deployment decisions.
- Stopped at the approval boundary.

### Existing implementation: historical, not compliant with this revision

An earlier React/TypeScript portfolio and ASP.NET Core service already exist. Earlier verification reported 23 backend and 20 frontend tests passing, successful builds and bounded live checks. Those checks exercised the previous scope.

The current running site, generated assets, previews and API still reflect earlier decisions. **Do not publish or describe them as conforming to this revised plan.** Existing public-download and release outputs require review/replacement before reuse.

No new application tests were run in this documentation-only pass, and no revised acceptance criteria are marked passed.

## Approval questions

1. Use a frontend-only release, reserving the selected ASP.NET Core backend for future features, or keep an approved minimal API?
2. Omit the download or retain it only after creating a newly reviewed allowlisted PDF?
3. Keep detail pages for the two approved projects, or use the requested single-page sections alone?

Pending live URLs and verified project outcomes are content questions; do not fabricate them to unblock work.

## Proposed steps after approval

1. Confirm the open release decisions and record the approved scope.
2. Consolidate approved copy and CRM_LINK/ECOMMERCE_LINK into the single planned config file.
3. Apply the new sections, positioning, project order and link-label states while preserving the selected visual identity.
4. Implement sticky navigation, active-section indication and accessible anchor/focus behavior.
5. Remove non-allowlisted release content and AI functionality across UI, routes, data, endpoints, assets and earlier public previews.
6. Omit or replace the download according to the owner's decision.
7. Update tests, run builds and privacy checks, then browser/accessibility/performance verification.
8. Present results for review. Publish only after separate owner approval.

## Gate

**Awaiting approval. Do not start these implementation steps yet.**
