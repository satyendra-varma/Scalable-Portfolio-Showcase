# Functional requirements — revised portfolio

Status: **planning only; awaiting owner approval.** This document supersedes conflicting earlier release requirements. The existing application has not been changed to match this plan.

## Purpose and positioning

Target role: **Full Stack .NET Software Engineer**

Exact hero positioning:

> Backend-led full-stack engineer building scalable .NET systems and shipping them end to end.

Recruiters should remember:

1. Designs scalable multi-tenant backends with .NET 8 and Domain-Driven Design.
2. Ships and runs systems end to end: Docker, AWS EC2, NGINX reverse proxy, Certbot SSL, CI/CD.
3. Reduced complex database query times by **35% at Nanomindz Technologies**.

The supplied resume is factual authority. Only explicitly permitted material may be published, even when additional material exists in the source. The supplied LinkedIn URL is a contact destination, not an additional source of claims.

## Required sections, in order

Hero, Work, Experience, Skills, Education, Contact.

## Acceptance criteria

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| FR-01 | Positioning | Display the exact target role and hero sentence above, without invented availability, seniority, or achievements. |
| FR-02 | Work | Exactly two featured projects, ordered Enterprise CRM Platform, then Cloud E-Commerce Platform. |
| FR-03 | Evidence | Each project presents source-supported context/problem, contribution, tools, and outcome. Missing outcomes are recorded as “Outcome: to be added” in CONTENT.md, never invented. Do not expose editorial placeholders as achievements. |
| FR-04 | Link configuration | One config file, `src/content/site.ts` within the portfolio artifact, contains CRM_LINK and ECOMMERCE_LINK. Replacing either value with an approved HTTPS URL is a one-line edit. |
| FR-05 | Pending links | Until populated, each project card shows exactly “Live link coming soon” as non-clickable text, not an anchor, disabled fake button, or keyboard focus target. |
| FR-06 | Link updates | Valid URLs create accessible live links; clearing a URL restores the label. Reject unsafe URLs and accidental placeholder destinations. Changes to a published site require rebuilding and publishing. |
| FR-07 | Background | Experience, Skills, and Education use only approved resume facts. Attribute the 35% improvement to Nanomindz, not to either featured project. Preserve skill qualifiers and source dates. |
| FR-08 | Contact | Show only the approved email, LinkedIn, and Vancouver, BC, Canada. Do not add other contact details. |
| FR-09 | Navigation | Sticky navigation links to the six sections. A visible active-section indicator follows scrolling and navigation; expose current location accessibly. Include a working skip-to-content link. |
| FR-10 | Responsive access | Desktop, mobile, touch, and keyboard navigation work; headings are not obscured by sticky navigation. Visible focus and reduced-motion behavior are required. |
| FR-11 | Publication allowlist | Publish only the approved content in CONTENT.md. Apply this to routes, HTML, bundles, metadata, assets, downloads, previews and API responses—not merely visible navigation. |
| FR-12 | No AI in this version | No guide, chat, starter questions, AI readiness UI, provider calls, or publicly usable AI endpoints in the revised release. Consider an ambassador only in a later, separately approved phase. |

## Quality targets

- Semantic landmarks and heading hierarchy; target WCAG 2.2 AA.
- Check 360px, 390px, 768px, and 1440px layouts, including long names and section navigation.
- No scroll hijacking, mandatory animation, fabricated live statistics, or fake testimonials.
- Target mobile Lighthouse performance ≥90, CLS ≤0.1 and LCP ≤2.5s under documented conditions; these are unmeasured targets, not promises.
- Accurate page title/description, favicon and useful unknown-route behavior. Use a verified published URL for canonical/social metadata, never a guessed domain.
- No accounts, database, tracking, email form service or new integrations needed for the proposed release.

## Open questions

1. Should this release be frontend-only, leaving the previously selected ASP.NET Core backend for future server features?
2. Should the existing resume-download feature be omitted, or retained only after producing and approving a new PDF using the revised publication allowlist? The current download must not carry forward unchanged.
3. Should the two approved projects retain their existing detail pages, or appear only in the Work section?

The previously selected System Explorer visual identity remains the design baseline; this plan does not authorize a new design direction.

## Approval boundary

Do not implement, alter services, update public assets, or publish until the owner approves the revised plan and resolves consequential open questions.
