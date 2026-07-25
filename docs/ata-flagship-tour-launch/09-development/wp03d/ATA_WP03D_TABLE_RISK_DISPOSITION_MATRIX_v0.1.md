# ATA WP-03D Table Risk and Disposition Matrix v0.1

All tables have full Data API privileges, RLS disabled, and no policies.

| Table | Purpose/key structure | Rows | Sensitive data | Recommendation | Retention |
|---|---|---:|---|---|---|
| `users` | NextAuth user PK/email | 0 | password, contact | Replace | none |
| `accounts` | OAuth account FK user | 0 | access/refresh/id tokens | Remove later | none |
| `sessions` | session FK user | 0 | session token | Remove later | none |
| `verification_tokens` | token pair; no PK | 0 | verification token | Remove later | none |
| `packages` | generic package catalogue | 4 | unverified prices/claims | Archive then replace | owner review |
| `bookings` | flight/package booking FKs | 0 | travel/contact/price | Replace | none |
| `quotes` | standalone quote FKs | 0 | contact/price | Fold into request | none |
| `saved_packages` | customer favourites | 0 | behavioral link | Remove later | none |
| `reviews` | testimonial FK user | 0 | review content | Remove/defer | none |
| `payments` | Stripe record FKs | 0 | Stripe IDs/amount | Archive/remove | none |
| `newsletters` | subscription | 0 | email/consent | Defer/redesign | none |
| `enquiries` | contact enquiry | 0 | contact details | Redesign into request | none |
| `booking_requests` | flight-first form | 0 | contact/travel | Replace | none |
| `blog_posts` | basic CMS | 0 | attribution | Redesign | none |

Unused-index notices are expected at this data volume and do not authorize removal.

