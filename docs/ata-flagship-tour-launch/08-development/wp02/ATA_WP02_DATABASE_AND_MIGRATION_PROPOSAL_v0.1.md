# ATA WP-02 Database and Migration Proposal v0.1

## WP-02 database action

No Prisma schema or migration was changed. `npx prisma validate` passed using a non-routable local dummy URL; no connection was opened and no migration ran.

## Proposed additive migration

Add enums for tour publication, evidence, request type/status, and admin role. Add new tables:

- `Tour` with slug, working title, publication state and audit fields;
- `TourFieldEvidence` or structured evidence relations for field-level approval;
- `TourItineraryDay` and ordered content relations;
- `CustomerRequest` with unified type/status/contact/consent/source fields;
- `RequestNote` and assignment/audit fields;
- `NotificationOutbox` for durable, retryable side effects;
- identity-backed role fields or a dedicated membership table.

## Migration rules

1. Additive first; do not repurpose legacy `Package`, `Booking`, `Quote`, or `BookingRequest` columns in place.
2. Backfill nothing into published state.
3. Import legacy records only after source mapping and owner approval.
4. Use database enums or constrained values and indexed status/timestamp fields.
5. Keep price display separate from future monetary order/payment data.
6. Store money in integer minor units or Decimal if later approved.
7. Add rollback and staging verification before production.
8. Reconcile the dirty worktree’s untracked migrations before choosing a migration number.

## Blocker

The live database migration history and deployment ownership remain unverified. WP-03 must obtain a safe staging database or migration-only CI environment.

