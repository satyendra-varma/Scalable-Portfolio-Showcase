# Revised release checklist

Status: **awaiting plan approval; implementation not started for this revision.**

All items are intentionally unchecked. Previous checks apply to the earlier scope only.

## Approval

- [ ] Owner approves the six revised planning documents.
- [ ] Resolve frontend-only versus retained ASP.NET Core service.
- [ ] Resolve omission versus newly reviewed download.
- [ ] Resolve two detail pages versus section-only presentation.

## Content

- [ ] Exact hero role and positioning match FRD.md.
- [ ] The three recruiter takeaways are clear and source-backed.
- [ ] Work contains exactly the two approved projects, in order.
- [ ] Project context, contribution, tools and any published outcomes are supported.
- [ ] Missing outcomes remain editorial placeholders in CONTENT.md, not invented claims.
- [ ] The 35% result is correctly attributed to Nanomindz.
- [ ] Contact and background content match the approved sources.
- [ ] Every release surface conforms to the CONTENT.md allowlist.

## Configuration and behavior

- [ ] One `src/content/site.ts` within the portfolio owns both link values.
- [ ] Missing links show exactly “Live link coming soon” as non-clickable text.
- [ ] Valid, cleared and invalid URL states pass tests.
- [ ] Hero, Work, Experience, Skills, Education and Contact appear in order.
- [ ] Sticky navigation and accessible active-section state work.
- [ ] Skip link, keyboard focus, mobile navigation and reduced motion work.
- [ ] AI UI, calls and public endpoint capability are absent in this version.
- [ ] Legacy routes, generated assets and exposed previews cannot reveal non-allowlisted material.
- [ ] Original uploads remain inaccessible; any approved new download has passed review.

## Verification

- [ ] Updated unit/component tests pass.
- [ ] Any retained API tests pass against the revised approved surface.
- [ ] Browser journeys pass on desktop and mobile.
- [ ] Accessibility and responsive checks are recorded.
- [ ] Production builds pass and output privacy checks pass.
- [ ] Performance is measured; unresolved limitations are documented.
- [ ] WORKLOG.md records actual results without carrying forward obsolete passes.

## Publishing

- [ ] Owner reviews the implemented revision.
- [ ] Owner separately approves publishing.
- [ ] Configure only verified published-domain metadata and deployment routes.
- [ ] Verify the published sections, links, optional detail pages and optional download.
- [ ] Verify AI cannot be invoked publicly and no disallowed release outputs remain.
- [ ] Record release verification and recovery approach.
