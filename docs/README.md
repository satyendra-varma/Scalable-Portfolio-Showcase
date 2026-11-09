# Portfolio documentation

Status: System Explorer selected and implemented. The React/TypeScript frontend and an ASP.NET Core .NET 10 API (health check only) run in development. The AI guide was removed from v1. Full release audits remain pending; the site has not been published.

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

Missing public project URLs belong in [project-links.json](project-links.json). Null/blank entries produce no link or dummy button. After adding real HTTPS URLs, rebuild and publish again to update a published site.

Requirements are not test results. See WORKLOG.md and RELEASE-CHECKLIST.md for what was actually verified and what is still pending.

## Common commands

- Frontend unit/component tests: `pnpm --filter @workspace/portfolio test`
- API unit/integration tests: `pnpm --filter @workspace/api-server test`
- Frontend type check: `pnpm --filter @workspace/portfolio typecheck`
- API release package: `pnpm --filter @workspace/api-server build`
- Regenerate API hooks/schemas: `pnpm --filter @workspace/api-spec codegen`
- Recreate sanitized public resume: `python3 scripts/sanitize_resume.py`
- Prepared browser suite: `pnpm --filter @workspace/portfolio test:e2e` (not run in the first build; requires browser installation and running app).

The Vite configs require `PORT` and `BASE_PATH` environment values (Replit used to supply them). Set them explicitly for a local build, for example `PORT=4173 BASE_PATH=/`.

[public-facts.json](public-facts.json) holds the curated facts the removed AI guide answered from. Nothing in v1 reads it; it is kept only as reference for a possible later phase. The original uploaded PDF is not the public download.
