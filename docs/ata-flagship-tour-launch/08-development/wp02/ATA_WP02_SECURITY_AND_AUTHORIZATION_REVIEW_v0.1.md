# ATA WP-02 Security and Authorization Review v0.1

## Controls implemented

- Default-deny feature flags.
- Production environment override that disables all WP-02 test features.
- Hard-disabled Stripe and notification capability flags.
- 404 guards on payment/webhook and legacy booking execution.
- Middleware hiding of shared-password admin and customer-account surfaces.
- Identity-context role policy: viewer, editor, approver, admin.
- Publication restricted to approver/admin.
- Request management restricted to editor or higher.
- Server-side Zod validation, honeypot, field bounds and explicit consent.
- No-storage/no-notification test adapter.
- No request PII in generated test IDs or logs.
- No tracked live secrets found in WP-02 diff.

## Known limitations

The identity policy is not yet connected to a production identity membership table. The baseline shared-password code remains in the repository but is unreachable by default. Memory-local rate limiting in legacy code is not a production distributed control. CSP/security-header reconciliation from the dirty state remains pending. PII retention and deletion rules require ATA approval.

## Required WP-03 gate

Implement identity-backed membership and server-side authorization in staging before enabling any admin surface. Add integration tests proving unauthenticated 401/404, insufficient-role 403, and permitted role transitions.

