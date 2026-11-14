# Portfolio documentation

Status: The Power-on Engineer's Room is the home page at `/` (see [STATUS.md](STATUS.md)). The earlier room is at `/room-original` and the round 2 concepts at `/room-concepts`, reachable by direct link only, not linked from anywhere and marked noindex. The React/TypeScript frontend and an ASP.NET Core .NET 10 API (health check only) run in development. The AI guide was removed from v1. Full release audits remain pending; the site has not been published.

## Reading order

1. [Functional requirements](FRD.md)
2. [Content and evidence](CONTENT.md)
3. [Architecture and alternatives](ARCHITECTURE.md)
4. [Delivery stages](PLAN.md)
5. [Test plan](TEST-PLAN.md)
6. [Release checklist](RELEASE-CHECKLIST.md)
7. [Work log](WORKLOG.md)

Visual exploration: [Design brief and comparison criteria](DESIGN-BRIEF.md).

Architecture decisions: [ASP.NET Core backend](decisions/001-aspnet-core-backend.md).

Public project URLs live in `artifacts/portfolio/src/content/site.ts` (`CRM_LINK`, `ECOMMERCE_LINK`). A blank value shows "Live link coming soon" as plain text. A real public HTTPS URL becomes a link; anything else (http, localhost, example domains, credentials) fails the build. After changing a URL, rebuild and publish again to update a published site.

Requirements are not test results. See WORKLOG.md and RELEASE-CHECKLIST.md for what was actually verified and what is still pending.

## Common commands

Works the same on Windows, macOS and Linux. Needs Node 24, pnpm 10 (`corepack enable` picks the pinned version) and the .NET 10 SDK for the API.

- Install: `pnpm install`
- Everything (typecheck + all builds): `pnpm run build`
- Portfolio dev server: `pnpm --filter @workspace/portfolio dev` (port 5173; override with `PORT`)
- Frontend unit/component tests: `pnpm --filter @workspace/portfolio test`
- API unit/integration tests: `pnpm --filter @workspace/api-server test`
- Frontend type check: `pnpm --filter @workspace/portfolio typecheck`
- API release package: `pnpm --filter @workspace/api-server build`
- Resume redaction script: `python3 scripts/sanitize_resume.py` (needs `pymupdf` and the original upload in `attached_assets/`, which isn't in the repo). It only removes phone numbers, so its output is not a clean public copy on its own.
- Browser suite: `pnpm --filter @workspace/portfolio test:e2e`. It builds the site and serves the production preview on port 4173 itself (set `PLAYWRIGHT_BASE_URL` to test a running site instead). It needs Chromium: run `pnpm --filter @workspace/portfolio exec playwright install chromium` once, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to an installed Chrome.

`BASE_PATH` defaults to `/`. Set it only when the site is served from a sub-path.

There is no resume download in v1, and no PDF ships with the site. When the clean public copy exists (allowlisted content only, no phone number or street address), add it at `artifacts/portfolio/public/resume.pdf` and bring back the download button. Until then the room's Contact panel says the download is unavailable.
