# Work log

## Current checkpoint: revised planning only

The latest attached brief supersedes conflicting earlier scope. **No application code, public assets, configuration, workflows, integrations or deployment settings were changed in this planning pass.**

### Completed in this pass

- Read the revised brief and compared it with the earlier requirements.
- Revised FRD.md, ARCHITECTURE.md, CONTENT.md, WORKLOG.md, TEST-PLAN.md and RELEASE-CHECKLIST.md.
- Recorded the exact positioning, two-project order, six sections, sticky active-section navigation, publication allowlist and pending-link behavior.
- Specified the future single content/config file without creating or editing it.
- Moved the ambassador to a later, separately approved phase.
- Recorded unknowns instead of inventing outcomes or deployment decisions.
- Stopped at the approval boundary.

### Existing implementation: historical, not compliant with this revision

An earlier React/TypeScript portfolio and ASP.NET Core service already exist. Earlier verification reported 23 backend and 20 frontend tests passing, successful builds and bounded live checks. Those checks exercised the previous scope.

The current running site, generated assets, previews and API still reflect earlier decisions. **Do not publish or describe them as conforming to this revised plan.** Existing public-download and release outputs require review/replacement before reuse.

No new application tests were run in this documentation-only pass, and no revised acceptance criteria are marked passed.

## Approval questions

1. Use a frontend-only release, reserving the selected ASP.NET Core backend for future features, or keep an approved minimal API?
2. Omit the download or retain it only after creating a newly reviewed allowlisted PDF?
3. Keep detail pages for the two approved projects, or use the requested single-page sections alone?

Pending live URLs and verified project outcomes are content questions; do not fabricate them to unblock work.

## Proposed steps after approval

1. Confirm the open release decisions and record the approved scope.
2. Consolidate approved copy and CRM_LINK/ECOMMERCE_LINK into the single planned config file.
3. Apply the new sections, positioning, project order and link-label states while preserving the selected visual identity.
4. Implement sticky navigation, active-section indication and accessible anchor/focus behavior.
5. Remove non-allowlisted release content and AI functionality across UI, routes, data, endpoints, assets and earlier public previews.
6. Omit or replace the download according to the owner's decision.
7. Update tests, run builds and privacy checks, then browser/accessibility/performance verification.
8. Present results for review. Publish only after separate owner approval.

## Gate

**Awaiting approval. Do not start these implementation steps yet.**
