# Test plan — revised release

Status: **planned, not executed for this revision.** Earlier passing tests do not validate the changed requirements. This pass edits documentation only.

## Layers

- Vitest + React Testing Library: content/config validation, conditional link rendering, section and navigation state.
- Playwright: actual desktop/mobile navigation, keyboard focus, routes and external-link targets.
- Accessibility: automated checks plus manual keyboard, contrast and reduced-motion review.
- Build/output review: source fidelity, publication allowlist, generated assets and downloadable content.
- xUnit/application-host tests only for whatever ASP.NET Core surface the owner approves retaining. No live AI evaluation or paid provider calls belong to this release's acceptance run.

## Acceptance checks

| Area | Requirements | Checks |
| --- | --- | --- |
| Hero | FR-01 | Exact role and owner-supplied positioning; no additional claims. |
| Work | FR-02/03 | Exactly two projects in the approved order; source-backed context, contribution and tools. No fabricated outcomes; editorial outcome placeholders remain in documentation. |
| Attribution | FR-07 | The 35% query improvement is attributed to Nanomindz only. Skill qualifiers and employment/education dates match the source. |
| Missing URLs | FR-04/05 | Both literal placeholders, null and blank values display “Live link coming soon”; no anchor, button behavior, href, click handler or keyboard focus target. |
| Populated URLs | FR-04/06 | A valid HTTPS value produces the intended live link; changing one config value updates that project's rendered output after build. |
| Cleared/invalid URLs | FR-06 | Clearing restores the label. Unsafe schemes, credentials, local hosts and fabricated destinations fail validation without silently publishing. |
| Single source | FR-04 | No competing editable URL config remains; both cards and any retained detail pages use the same source. |
| Sections | FR-09 | Hero, Work, Experience, Skills, Education and Contact exist in the approved order and can be reached through sticky navigation. |
| Active navigation | FR-09/10 | Active marker and accessible current state track scrolling, clicks, hash navigation, history and top/bottom positions. Sticky header does not obscure targets. |
| Keyboard/mobile | FR-09/10 | Skip link moves focus to main; all controls have visible focus; mobile menu is usable and closes predictably; status is not conveyed only through color. |
| Responsive/motion | FR-10 | Check 360px, 390px, 768px, 1440px; no overflow; useful touch targets; reduced motion; readable content without animation. |
| Contact | FR-08 | Exact approved email, LinkedIn destination and city-level location; no additional fields. |
| Publication boundary | FR-11 | Inspect rendered pages, direct/legacy routes, HTML, bundles, source data, metadata, public assets, downloads, API responses and exposed design previews against CONTENT.md. Hiding navigation is not sufficient. |
| AI absence | FR-12 | No chat/guide/readiness UI, starter prompts, model-related network calls or public AI endpoint capability. Direct requests must not invoke the provider. |
| Optional PDF | FR-11 | If approved, inspect the new document visually and via text/metadata/link extraction against the allowlist. Otherwise no download CTA or stale public file is shipped. |
| SEO/performance | Quality targets | Correct titles/descriptions, approved routes and unknown-route behavior; production URLs verified; measure Lighthouse, LCP and CLS with conditions recorded. |

## Privacy test discipline

Use transient local source comparisons where necessary. Do not copy excluded source strings into committed snapshots, fixtures, public test artifacts or reports. Verify raw uploads cannot be served by any active preview or published service.

## Evidence and release gating

Record commands, environment, pass/fail results and unresolved limitations in WORKLOG.md after implementation. Listing a test suite is not executing it; screenshots are not interaction tests. Do not transfer prior checked items into the new checklist without revalidation.

## Open questions affecting tests

- Whether a backend is in scope determines API route and deployment tests.
- The download decision determines PDF versus absence checks.
- Detail-page retention determines deep-link and unknown-route expectations.
