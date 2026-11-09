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
- Still present and now unused by any app: `lib/api-client-react`, `lib/api-zod` and `lib/api-spec` (health check only). Keep them if the API grows again; otherwise they can go.

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
