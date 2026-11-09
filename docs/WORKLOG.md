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

Per `docs/RESUME-SOURCE.md`, the internal project that isn't on the allowlist, its name and its metric are gone from every current file: the portfolio's project data and link handling (and their tests), `docs/public-facts.json`, `docs/README.md`, and both mockups. This log deliberately doesn't name it. The project pages, 404 list and mockups now show two projects, and the design brief says "two project subjects". Git history still contains the old text; see the history-rewrite plan below.

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
