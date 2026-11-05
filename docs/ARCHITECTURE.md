# Architecture — revised portfolio plan

Status: **proposal only, awaiting approval.** Existing code and running services still implement the earlier scope. No runtime, secret, provider or deployment settings are changed in this planning pass.

## Proposed release architecture

Use the existing React + TypeScript + Vite portfolio artifact. Prefer build-time, reviewed content and static assets for this content-focused release; no database, authentication, contact-delivery service or paid provider call is required.

The owner previously selected ASP.NET Core for server functionality. Preserve that choice for any future API work; do not substitute Express or introduce a Node bridge. Whether the existing API should remain deployed in this release is an open decision, not an assumption.

Recommended request flow:

Visitor → portfolio page and approved static assets → email/LinkedIn or a supplied project URL.

No AI request path belongs in this version. Hiding a chat component alone is insufficient: an approved implementation must prevent public use of the corresponding endpoints and remove their content from release outputs.

## Content ownership and configuration

- Logical path requested by the owner: `src/content/site.ts`.
- Workspace location: `artifacts/portfolio/src/content/site.ts`.
- This is the proposed single source for approved site copy, section identifiers, project order, and the two URL values named CRM_LINK and ECOMMERCE_LINK.
- Do not create the file in this planning phase.
- After approval, consolidate the existing scattered configuration into this file. Retire competing URL sources rather than maintaining two editable files.
- Literal placeholder, null or blank URL values render the exact non-clickable label “Live link coming soon”.
- A valid approved HTTPS URL renders a real link. Changing one value is a one-line edit; subsequent build/publication is still required.
- Validate populated URLs and data shape during the build. Reject executable schemes, credentials, local destinations and fabricated example destinations.
- Maintain resume traceability in CONTENT.md. Do not ship the raw resume or planning documents as public content.

## Page composition

Focused components for sticky navigation, Hero, Work, Experience, Skills, Education and Contact. Use stable section IDs and semantic landmarks.

Use an IntersectionObserver-based active-section mechanism, with deterministic behavior near the page top/bottom and when sections overlap the viewport. Navigation should expose the active location with `aria-current`, not color alone. Offset anchor scrolling for the sticky header and respect reduced-motion preferences.

Preserve the approved System Explorer visual identity while adjusting its content and section structure. A skip link must move focus to the main content. Mobile navigation must remain keyboard-operable, close predictably and not hide focused content.

Detail pages for the two approved projects are optional pending the owner's decision. If retained, derive them from the same content rather than duplicating facts.

## Publication cleanup after approval

Audit the existing application against the new content allowlist. Remove non-allowlisted content from all release surfaces, including obsolete routes, source data bundled into JavaScript, generated files, metadata and downloadable documents. A hidden card or navigation item is not a privacy control.

Keep original uploads outside public directories and denied by preview servers. Review any retained download by rendered pages, text extraction, metadata and link targets. Do not reuse the current PDF unchanged.

Address the earlier design previews as well as the main site before claiming the workspace complies with the revised publication rules. This planning pass makes no such claim.

## Tests and delivery

Use Vitest/React Testing Library for rendering and config states, then Playwright for real browser journeys. The revised static frontend does not need backend work merely to demonstrate a skill from the resume. If an API remains part of the release, use xUnit and application-host tests for its actual approved surface.

Run builds, source/privacy checks, browser/accessibility checks and documented performance measurements after implementing the approved scope. Old test results are historical evidence, not acceptance of this revision.

Publishing is a separate owner-approved action.

## Later phase: optional ambassador

Only after separate approval: curate an allowlisted knowledge set, use the selected ASP.NET Core boundary, keep credentials server-side, validate inputs and evidence, impose cost/request limits, provide explicit unsupported/error states, and define storage/provider-processing disclosures. Do not automatically reuse the earlier knowledge set or activate existing endpoints.

## Open questions

1. Frontend-only release, or retain a narrowly scoped ASP.NET Core service?
2. Omit the download, or commission a newly reviewed allowlisted PDF?
3. Keep two public project detail pages, or use only the requested single-page sections?
