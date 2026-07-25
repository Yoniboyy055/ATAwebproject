# Recommended ATA WP-03 Scope v0.1

## Title

**WP-03 — Owner Decisions, Identity-Backed Admin, Staging Data Model, and Verified Content Intake**

## Preconditions

Resolve owner decisions OD-01 through OD-06 at minimum. Provide a controlled staging URL, Vercel ownership, identity provider/admin list, Builder decision, CI direction, and safe staging database/migration history.

## Scope

1. Reconcile approved dirty-state concepts through reviewed commits.
2. Implement additive Prisma migration for tours, evidence, requests, roles, notes, and outbox.
3. Connect identity-backed admin membership and role enforcement.
4. Build draft/review/approve/publish admin workflow.
5. Persist unified requests in staging with retention and redacted logging.
6. Add managed spam/rate controls and test notifications only.
7. Create verified content-intake tooling with source/evidence capture.
8. Complete browser-based mobile/desktop, accessibility, Lighthouse and E2E testing.
9. Triage critical/high dependencies without uncontrolled major upgrades.
10. Keep payments and automatic confirmation disabled.

## Exit criteria

Approved migration applied only to staging; role tests pass; no shared-password path; first tour remains unpublished until facts are approved; request workflow persists safely; Drive records are complete; no production deployment.

