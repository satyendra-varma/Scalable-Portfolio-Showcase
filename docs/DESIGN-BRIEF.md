# Portfolio design exploration

## Owner selection

The owner selected **System Explorer**. It has been integrated into `artifacts/portfolio` using the approved prototype source; Evidence Story remains a reference, not the production direction.

Status: two independent prototypes built and visually reviewed at desktop and 390px widths; neither direction is approved for production.

## Design problem

Help a recruiter understand a Full Stack .NET Software Engineer's strengths quickly, while giving an engineering reviewer enough verified technical evidence to continue exploring.

The website should communicate .NET backend expertise, practical business outcomes, React delivery, and cloud/deployment experience without overclaiming scale or exposing internal project details.

## Fixed constraints

- Resume is the factual source of truth; CONTENT.md owns the evidence and publication rules.
- Preserve the target role and factual attribution of metrics across both concepts.
- Include the same three project subjects, appropriate experience, and source-backed skills.
- No public phone, invented availability, fake project screenshots, fake repositories/demos, or invented infrastructure.
- Public contact uses only the approved email, LinkedIn, and resume location.
- Local interactions and navigation should work.
- Prototype ambassador must clearly state it is not connected to AI. Sample answers are examples, not live model responses.
- Never link the original resume as the public download; the sanitized PDF remains a production implementation item.
- Responsive, keyboard-friendly, and reduced-motion-aware.

## Variation axes

1. Content hierarchy: narrative/outcome emphasis versus capability/evidence exploration.
2. Interaction: reading-led disclosure versus visitor-directed discovery.
3. Visual mood: human and publication-like versus precise and instrument-like.

These axes should change how a visitor understands the work, not only the color palette.

## Direction: Evidence Story

Hypothesis: a direct, carefully edited narrative will make role alignment and source-backed outcomes easier to absorb in a short scan.

Mood: confident, human, and authored. Visual execution is delegated rather than fixed to a specific palette or layout.

Potential tradeoff to evaluate: clarity and continuity versus depth of interactive exploration.

Preview component: artifacts/mockup-sandbox/src/components/mockups/portfolio-story/EvidenceStory.tsx.

## Direction: System Explorer

Hypothesis: capability-led exploration will help technical reviewers inspect relevant evidence without reading every detail.

Mood: precise, quietly energetic, and immediately understandable. Interaction should organize information, not imitate a terminal or imply fake production telemetry.

Potential tradeoff to evaluate: exploration and technical distinctiveness versus first-scan simplicity.

Preview component: artifacts/mockup-sandbox/src/components/mockups/portfolio-explorer/SystemExplorer.tsx.

## Comparison criteria

1. Can a visitor immediately identify the target role?
2. Are strengths linked to accurate evidence rather than unsupported claims?
3. Can the visitor reach project details and contact actions without guessing?
4. Do interactions add understanding, with clear feedback and keyboard access?
5. Does the hierarchy remain readable at 390px?
6. Does the ambassador look integrated while honestly identifying preview behavior?
7. Is the overall design distinctive without interfering with professional credibility?

Selection should consider the full scrollable page and narrow-screen behavior, not just the desktop opening view.

## Production handoff

Owner selects a direction before it is integrated into the React app. Production work must connect the ASP.NET Core API, replace the ambassador demo with real validated behavior, generate the public-safe PDF, wire optional link configuration, and execute the agreed test plan. Visual prototype completion does not satisfy those requirements.
