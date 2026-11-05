# Delivery plan

All stages are planned unless explicitly marked complete in WORKLOG.md.

## 1. Requirements and content

- Confirm role, public/private boundaries, project availability, and AI scope.
- Draft FRD, content evidence register, and documentation structure.
- Backend chosen: ASP.NET Core. Ask for missing factual details rather than infer them.
- Exit: agreed scope and explicit remaining content gaps.

## 2. Architecture and contract

- Record selected backend and why; install the selected .NET runtime and provision the managed AI provider during implementation.
- Gate implementation on a .NET build, managed routing/health check, and a bounded authenticated .NET-to-AI compatibility smoke check. Available runtime catalog entries are not equivalent to passing this gate.
- Define public content schema, optional URL validation, source IDs, and safe resume process.
- Define OpenAPI ambassador request/response/errors; generate the TypeScript client and implement that same contract in .NET.
- Exit: documented contract and no dependency on confidential material.

## 3. Visual exploration

- Produce two meaningfully different, recruiter-focused directions.
- Compare role clarity, evidence hierarchy, readability, mobile behavior, and interaction usefulness.
- Ask the owner to choose one; refine tokens, motion, accessibility, and interaction/error states.
- Exit: approved direction, not merely a generic template.

## 4. Build

- Create the web app once planning gates are settled.
- For a backend-backed React build: contract/codegen first, then launch frontend design implementation while backend work proceeds independently.
- Wire approved content and optional links; build core routes and contact/download behavior.
- Add real ambassador behavior, citations, refusal/error handling, and controls.
- Exit: complete core experience with no fake actions or sensitive source leakage.

## 5. Quality

- Add and run unit and integration tests appropriate to the selected backend.
- Run browser tests once a coherent implementation is available, before release.
- Review factual claims, public-safe PDF, chat refusal/attack cases, keyboard flow, reduced motion, narrow layouts, and representative performance.
- Exit: recorded test results and known limitations; no unreported critical defects.

## 6. Release

- Complete RELEASE-CHECKLIST.md.
- Ask for publish approval; publishing is not implied by the original attached template.
- Verify published routes, headers, public PDF, links, and AI behavior.
- Exit: working live URL and a documented result, not just a successful build.

## Tracking conventions

- FRD owns scope and acceptance criteria.
- CONTENT owns facts and publication boundaries.
- ARCHITECTURE owns technical decisions and open tradeoffs.
- WORKLOG owns progress/blockers; do not scatter competing task lists across files.
- TEST-PLAN owns test mapping and result evidence.
- RELEASE-CHECKLIST owns release readiness.
- Do not mark planned work as completed or create redundant documents for every edit.
