# Test strategy

Status: planned; no test suite exists or has been run.

## Layers

- Frontend unit/component: Vitest + React Testing Library.
- Selected backend: xUnit + WebApplicationFactory with the model provider mocked.
- Browser: Playwright; Chromium plus additional browser engines where installed/supported.
- Accessibility: automated axe checks plus manual keyboard, screen-reader semantics, and reduced-motion review.
- Real AI evaluation: small, explicitly bounded smoke/evaluation set; provider calls incur credits and are not part of every deterministic unit run.

## .NET compatibility gate

- Install the selected SDK and record dotnet --info.
- Build a minimal ASP.NET Core process binding to the managed PORT.
- Confirm /api/healthz through managed routing.
- Make one bounded authenticated request using .NET HttpClient and server-injected credentials; never print keys, authorization headers, or raw credential configuration.
- Verify provider URL/authentication behavior, timeout/cancellation, and safe error reporting.
- Validate the published runtime/build configuration before release.

Status: catalog availability checked; none of these executable checks has run yet.

## Acceptance mapping

| Area | Requirements | Checks |
| --- | --- | --- |
| Source fidelity | FR-01/02/03/05 | Role, titles, dates, skills qualifiers and metrics match approved content; citations map to actual facts. |
| Link handling | FR-04/12 | Null/empty omitted; invalid or non-HTTPS links rejected; valid URLs rendered; no internal tool link. Test all states. |
| Content updates | FR-04 | Filling docs/project-links.json changes rendered links on the next build; clearing them removes the links. |
| Public privacy | FR-06/07/10 | Phone absent from public bundles, HTML/data, public knowledge, PDF text/metadata; original upload URL not publicly served. Use transient local checks against source without putting the phone in committed fixtures. |
| Download/contact | FR-06/07 | Download returns a valid reviewed PDF; email and LinkedIn targets are correct; location matches resume. |
| Chat success | FR-08/09 | Starter questions, evidence links, loading/keyboard behavior, bounded context, and success response. |
| Chat refusal | FR-08 | Unsupported salary, availability, relocation, invented experience and private-info questions produce the exact approved refusal. |
| Injection | FR-08/NFR-06 | Attempts to override instructions, expose prompt/private data, assert fabricated tenure, or introduce unsupported evidence are rejected or refused. No promise of complete resistance. |
| Chat failures | FR-09/NFR-06/07 | Invalid body, oversized request, timeout, provider failure, malformed response, unknown source IDs, and throttled request produce explicit safe states. |
| No logging/storage | FR-10 | Spy on app logging/storage adapters; assert no transcript/body persistence; review provider errors and request middleware for leakage. |
| Interactions | FR-11/NFR-01/02/03 | Routes/deep-link reload, navigation, any chosen filter/expansion, keyboard focus, chat open/close, and browser history. |
| Responsive/motion | NFR-01/02/03 | 360px, 390px, 768px, 1440px; long text, touch-friendly targets, no overflow, reduced-motion emulation. |
| SEO/performance | NFR-04/05 | Titles/descriptions, proper 404, sitemap/canonical on production, layout shift, asset loading and measured audit. |

## Evidence reporting

Record command, environment, test scope, result, and limitations in WORKLOG.md. A mocked AI test does not verify live provider availability or guarantee semantic grounding. A screenshot is visual evidence, not an interaction test. Never report tests as passed before running them.
