# ATA WP-02 Feature-Flag Architecture v0.1

## Flags

| Flag | Safe default | Activation rule |
|---|---:|---|
| `ATA_INTEGRATION_MODE` | `disabled` | Must equal `test` |
| `ATA_FLAGSHIP_PREVIEW_ENABLED` | false | Test mode and non-production only |
| `ATA_TEST_REQUESTS_ENABLED` | false | Test mode and non-production only |
| `ATA_CUSTOMER_ACCOUNTS_ENABLED` | false | Test mode and non-production only |
| `ATA_LEGACY_ADMIN_ENABLED` | false | Test mode and non-production only |

`livePayments`, `productionNotifications`, and `publicReviews` are hard-coded false in WP-02 and have no activation environment variable.

## Production fail-closed rule

When `VERCEL_ENV=production`, all test capabilities are false even if their environment strings say true. The preview returns 404 and is excluded from the sitemap.

## Hidden legacy surfaces

Middleware hides admin, dashboard, auth registration, book, flights, packages, reviews, and related APIs by default. Payment creation and Stripe webhooks contain independent 404 guards. The legacy booking executor is replaced by an unconditional 404 route.

## Ownership

Feature flags control exposure, not factual approval. A published tour additionally requires evidence approval and authorized publication state.

