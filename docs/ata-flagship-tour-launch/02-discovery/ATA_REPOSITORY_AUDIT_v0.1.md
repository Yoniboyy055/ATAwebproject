# ATA Repository Audit v0.1

## Executive outcome

The repository is technically reusable but not Phase 1-ready. Keep Next.js App Router, TypeScript, Tailwind, Prisma/PostgreSQL, Zod, Jest and the existing component primitives. Revise the information architecture, tour model, request workflow, authorization and content governance. Disable or hide payments, customer accounts, reviews, newsletter, broad flight search and unverified catalog content until separately approved.

## State model

- **COMMITTED BASELINE:** `origin/main` at `7392825`, audited and executed in the clean worktree.
- **CURRENT WORKING STATE:** original `main` at `4a63be6` plus local changes, inspected read-only.
- Current working state differs from refreshed baseline across 183 tracked paths (12,121 insertions / 8,196 deletions) plus untracked files. It cannot be assumed newer or safer.

## Foundation

| Domain | Confirmed finding |
|---|---|
| Framework | Next.js 14.2.35 App Router, React 18.2, TypeScript 5.3 |
| Package manager | npm with `package-lock.json`; `npm ci` succeeds |
| Styling | Tailwind 3.4 plus global/design CSS |
| Content | Static data, Prisma PostgreSQL and Builder.io are mixed |
| Auth | NextAuth customer auth plus a separate shared-password admin system |
| Validation | Zod exists, but use is inconsistent |
| Tests | Jest; 8 suites / 62 tests. Playwright script references a package/config not established in baseline |
| Deployment | Vercel references in documentation; no `vercel.json`, `vercel.ts` or `.vercel` metadata in audited states |
| Integrations | Stripe, Resend, Twilio, Google OAuth, Builder.io, GA/GTM, Sentry dependency |

## Confirmed repository findings

1. Homepage metadata and content are flight/service-first, not tour-first.
2. `/flights` and `/flights/results` exist in both repository states.
3. Stripe PaymentIntent and webhook routes exist and are live-capable when secrets are configured.
4. Seed/package data uses four generic packages and price points; it is not a verified flagship-tour model.
5. Static testimonials are present and lack evidence/provenance.
6. Booking email/SMS code says “confirmed” before an ATA-controlled confirmation workflow.
7. Package schema lacks slug, itinerary, inclusions/exclusions separation, media, dates, capacity, publication state and verification flags.
8. Enquiry, booking, quote and contact pathways are fragmented across different endpoints and models.
9. Admin authentication is split from NextAuth and includes a shared-password design in the baseline.
10. The build succeeds without `DATABASE_URL`, but logs that database features will not work and Builder package slugs cannot load.

## Data and workflows

The baseline Prisma schema contains User, Account, Session, Package, Booking, Quote, SavedPackage, Review, Payment, Newsletter, Enquiry, BlogPost and BookingRequest. This is broader than Phase 1, yet the Package and Enquiry models are too shallow for the flagship requirements.

Workflow assessment:

| Workflow | Condition | Safety |
|---|---|---|
| Homepage enquiry | Persists to Prisma in B; removed in W relative to baseline | Partially functional; needs stronger validation, consent, anti-spam and notification contract |
| Rich booking form | May persist and send Resend/Twilio notifications | Misleading “confirmed” language; do not use as-is |
| Quote request | Authenticated/customer-oriented | Partially functional; not aligned to anonymous Phase 1 lead capture |
| Package browsing | Prisma/Builder/static mix | Unreliable without credentials; unverified facts |
| Newsletter | Database-backed | Functional in principle; out of scope |
| Stripe payment | Live-capable with secrets | Must be disabled during request-only Phase 1 |
| Admin CRUD | Package/enquiry/booking primitives exist | Reusable concepts; weak model/auth boundaries |

## Security and privacy

- Tracked secret scan found placeholders, not confirmed live credentials.
- Sensitive variables include `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`, OAuth secrets, Stripe secrets, Resend, Twilio and Builder webhook secret.
- Admin shared-password design and route-boundary inconsistency are high risks.
- Rate-limit utility exists, but coverage across all public mutation routes is inconsistent and memory-local limiting is unsuitable for distributed production.
- PII is stored across several tables; retention, consent, export and deletion policies are not defined.
- Some server helpers log validation/errors; production redaction must be verified.
- Payment amounts use floating-point fields; if future payments return, use integer minor units/Decimal and idempotency.

## SEO, accessibility and performance

- Metadata, sitemap, robots and JSON-LD exist.
- Metadata is flight-first and includes potentially unverified contact/address claims.
- Sitemap exposes auth/dashboard and hard-coded blog paths.
- `lib/schema.ts` uses `InStock`, conflicting with the no-live-inventory rule.
- Root layout duplicates viewport metadata and loads Google fonts with a lint warning.
- GA hook has a missing dependency warning; consent behavior is not documented.
- Homepage first-load JS is 248 kB and `DesignHomePage` depends on Three.js and extensive imperative DOM behavior.
- Build produced no automated accessibility or Lighthouse evidence.
- Images have AVIF/WebP variants, but current working state removes many committed destination images.

## Deployed-site audit

**UNABLE TO VERIFY:** `https://amanueltravel.com` did not resolve in DNS from the audit environment on 2026-07-23. Search indexing also returned no matching site result. Consequently navigation, console/network behavior, responsive behavior, metadata and performance could not be confirmed against a live deployment.

This is a launch blocker or an ownership/configuration clarification, not proof that no deployment exists. ATA/YK Systems must provide the current canonical deployment URL or repair DNS before WP-02 staging comparison.

## Current working-state comparison

The active dirty state:

- removes baseline admin login/enquiries/bookings/package APIs and middleware;
- removes `DesignHomePage`, Builder catch-all dependencies, numerous optimized images and tracked migrations;
- adds alternate homepage/search/lovable component systems, Sentry helpers, API utilities and documentation;
- changes package, auth, payment, API, UI and Prisma behavior broadly;
- has untracked migrations, middleware, screenshots and reports.

These changes may contain valuable work but require an owner-led reconciliation before reuse. WP-01 makes no merge recommendation for the dirty state as a whole.

