# ATA WP-02 Approved, Rejected, Deferred, and Unresolved Change Register v0.1

## Approved for WP-02 implementation

| Change | Basis |
|---|---|
| Zod tour/request contracts | WP-01 architecture recommendation |
| Six publication states | Owner direction; `SUSPENDED` added explicitly |
| Evidence references and publication approval gate | Source-control requirement |
| Unified request types/statuses | SOW and WP-02 |
| Default-off preview/test flags | WP-02 safety controls |
| Identity role policy helper | Replaces shared-password direction |
| Legacy payment and booking disable guards | Phase 1 restrictions |
| Route/sitemap hiding | Flight-first, accounts, reviews and generic packages restricted |
| Safe request-received language | No automatic confirmation rule |
| No-storage test request adapter | Test-only implementation requirement |

## Rejected

| Dirty-state change | Reason |
|---|---|
| Mapping `contacted` requests to `confirmed` | False confirmation semantics |
| Unverified `850` total calculation | Invented commercial fact |
| Wholesale deletion of migrations and optimized images | Data and asset loss risk |
| Shared-password admin continuation | Explicitly prohibited |
| Production-capable Stripe behavior during WP-02 | Explicitly prohibited |
| Wholesale dirty-state merge | Conflicting architecture and unknown intent |

## Deferred

Customer dashboards, accounts, public reviews, newsletter, blog expansion, search, flight results, payment ledger, online payments, testimonials, generic packages, advanced analytics, Builder editorial decisions, and production notifications.

## Unresolved / owner approval required

- Which dirty-state documentation becomes authoritative.
- Which CI workflow is intended.
- Which migrations represent the real database state.
- Whether Builder.io remains.
- Which media files are licensed and approved.
- Canonical domain and Vercel project ownership.
- Identity provider and named admin roles.
- Whether any legacy public route should be permanently retired rather than hidden.

