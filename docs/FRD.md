# Functional requirements document

Status: draft. Target role, content boundaries, first-release ambassador, and ASP.NET Core backend confirmed; design remains open.

## Purpose

Build a distinctive, interactive, professional portfolio for a **Full Stack .NET Software Engineer**. Make backend expertise and full-stack delivery easy to understand in a short recruiter scan, with deeper evidence for engineering reviewers.

## Audiences and journeys

- Recruiter: understand target role and strongest evidence, inspect selected work, download the public resume, contact the candidate.
- Engineering reviewer: inspect verified technical contributions and project outcomes, then ask the ambassador evidence-based questions.
- Site owner: edit approved content and optional project URLs in version-controlled files, then rebuild/release.

## Requirements and acceptance criteria

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| FR-01 | Clear positioning | The primary role reads “Full Stack .NET Software Engineer”; backend, frontend, and delivery capabilities use source-backed descriptions. |
| FR-02 | Featured projects | CRM, Business Operations & Auditing Engine, and Cloud E-Commerce Platform are represented. Each distinguishes supported contributions, technology, and outcomes; unknown information is omitted rather than inferred. |
| FR-03 | Verifiable case studies | Every biographical or project claim maps to the resume. Conceptual diagrams are labeled illustrative and never represented as verified production topology. Unsupported details require owner approval before publication. |
| FR-04 | Optional project links | CRM and e-commerce URLs come from docs/project-links.json. Null/empty values render no link. Only valid HTTPS URLs are permitted. Internal Business Operations links are never displayed. |
| FR-05 | Professional background | Experience dates, titles, employer names, skills, and education match the resume without inferred seniority, availability, or proficiency. |
| FR-06 | Public contact | Email, supplied LinkedIn, and the resume's city/province/country may appear. Phone number is excluded. No street address is invented. |
| FR-07 | Resume download | Download a reviewed public PDF with the phone removed. Redaction removes underlying text/metadata exposure, not just visible pixels. Never serve the original uploaded PDF publicly. |
| FR-08 | Grounded ambassador | First release includes chat answering only from the approved public resume-derived content. Answers cite valid source IDs mapped to site sections; unsupported questions receive “I don’t have verified information about that.” |
| FR-09 | Ambassador usability | Four source-supported starter questions; keyboard-operable chat; visible loading, failure, retry, and rate-limit states. A service failure is not disguised as a factual refusal. |
| FR-10 | Ambassador privacy | No chat transcripts persisted or intentionally logged by application code; no browser storage of chat content. Disclose that submitted text is processed by the AI provider; verify provider retention policy before claiming anything about it. |
| FR-11 | Functional interactions | Navigation, project exploration, and any approved filter or expansion work on desktop, touch, and keyboard. No fake buttons, invented live metrics, or fake testimonials. |
| FR-12 | Missing content handling | Missing URLs and images never create broken links/assets. No public “coming soon” project buttons unless explicitly approved. No generic generated portrait representing the candidate. |

## Non-functional requirements

- NFR-01: Target WCAG 2.2 AA; semantic structure, contrast, visible focus, dialog focus management, and reduced-motion support. Automated tests supplement, not replace, manual review.
- NFR-02: Verify at 390px, narrow mobile, tablet, and desktop widths; no unintended horizontal overflow.
- NFR-03: Keep content readable without animation; avoid blocking loaders, scroll hijacking, or decorative effects that obscure evidence.
- NFR-04: Proposed performance budgets: Lighthouse mobile performance >=90 on representative content; layout shift <=0.1; evaluate LCP against 2.5s as a target under documented test conditions. These are targets, not existing measurements or guarantees.
- NFR-05: Route-specific titles/descriptions for case studies, semantic crawlable content, sensible 404s, favicon, sitemap, and robots policy. Production canonical URLs are configured only after the real published URL is known.
- NFR-06: Server-side AI credentials/calls, request validation, bounded input/output, timeouts, safe rendering, explicit errors, and rate/concurrency controls.
- NFR-07: Site must remain useful when AI is unavailable.

## Out of scope unless approved

Accounts, admin CMS, database, persisted chat, live GitHub statistics, email delivery forms, analytics/tracking, blog, payments, unsupported architecture claims, and public access to the internal Business Operations tool.

## Open decisions

1. Preferred visual direction after comparing two alternatives.
2. Public display name/short form; use the resume's full name unless the owner requests otherwise.
3. Any case-study depth beyond the resume requires new owner-approved source material.

## Confirmed implementation stack

React + TypeScript frontend, ASP.NET Core API, xUnit backend tests, and Playwright browser coverage before release. Runtime and live managed-AI compatibility remain implementation gates, not completed checks.
