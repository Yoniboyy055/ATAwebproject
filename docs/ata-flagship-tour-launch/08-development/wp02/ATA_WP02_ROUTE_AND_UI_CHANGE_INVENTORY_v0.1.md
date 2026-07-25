# ATA WP-02 Route and UI Change Inventory v0.1

| Route / area | Change | Default exposure |
|---|---|---|
| `/tours/flagship-preview` | Added non-indexed skeleton | 404 unless explicit non-production test flags |
| `/api/ata/requests` | Added no-storage test request endpoint | 404 unless preview and request flags are enabled |
| `/api/booking` | Replaced legacy executor with 404 | Hidden |
| `/api/payments/create` | Added hard payment guard | Hidden |
| `/api/webhooks/stripe` | Added hard payment guard | Hidden |
| `/admin/*` and `/api/admin/*` | Middleware fail-closed | Hidden unless non-production legacy test flag |
| `/dashboard/*`, `/auth/*`, user APIs | Middleware fail-closed | Hidden unless non-production account test flag |
| `/book`, `/flights/*`, `/packages/*`, `/reviews/*` | Middleware fail-closed | Hidden by default |
| `/sitemap.xml` | Removed auth, dashboard and packages | Public-safe list |
| Legacy booking/package UI | Replaced automatic confirmation and reserve language | Still hidden |
| Structured data | Removed `InStock` | No inventory implication |

The build still lists statically compiled hidden routes; middleware controls runtime exposure. Permanent deletion is deferred until owner approval.

