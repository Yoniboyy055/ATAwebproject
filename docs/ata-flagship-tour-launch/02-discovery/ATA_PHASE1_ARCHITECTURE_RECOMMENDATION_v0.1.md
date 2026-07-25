# ATA Phase 1 Architecture Recommendation v0.1

## Recommended architecture

Retain the Next.js App Router monolith on Vercel, TypeScript, Tailwind, Prisma/PostgreSQL, Zod and Jest. Build a narrowly scoped tour and request domain inside the existing application. Do not introduce a second backend, automatic inventory or payment system.

## Domain model

### Tour

Use a reusable `Tour` record with:

- stable `id`, unique `slug`, internal title and public title;
- publication state: `DRAFT`, `IN_REVIEW`, `APPROVED`, `PUBLISHED`, `UNPUBLISHED`, `ARCHIVED`;
- fact-verification status per sensitive field or structured section;
- nullable public fields so unverified values render nothing rather than placeholders;
- summary, overview, duration text, difficulty, age guidance;
- itinerary days, inclusions, exclusions, FAQs, policies and media relations;
- optional price display fields separated from payment logic;
- optional date/departure records with `REQUEST_ONLY` availability semantics;
- SEO title/description/image;
- created/updated/published timestamps and accountable editor/approver.

Only one Tour should be `PUBLISHED` in Phase 1. The model should support four future tours without publishing empty cards.

### Customer request

Use one `CustomerRequest` aggregate:

- `type`: `INFORMATION`, `CONSULTATION`, `QUOTE`, `BOOKING_REQUEST`, `PROVISIONAL_RESERVATION`;
- `status`: `NEW`, `CONTACTED`, `AWAITING_CUSTOMER`, `PROVISIONAL`, `CONFIRMED_OUTSIDE_SYSTEM`, `CLOSED`, `CANCELLED`;
- optional `tourId`/departure reference;
- contact fields, traveler count, preferred date/time/contact channel, freeform notes;
- consent version/timestamp, source/campaign fields, spam signals;
- internal notes and assigned user;
- immutable submission timestamp and audit timestamps.

The public confirmation must say the request was received and is pending ATA review. Only staff may set `CONFIRMED_OUTSIDE_SYSTEM`.

## Request flow

Browser → Zod client guidance → server route/action with authoritative validation → spam/rate-limit gate → database transaction → event/outbox record → ATA/customer notification worker → request-received page.

Notification failure must not lose the request. Use an outbox/event record and retryable delivery. Redact PII in logs. Email/SMS providers remain adapters and should be test/staging-gated.

## Administration

- Consolidate admin identity on NextAuth (or another approved identity provider) with explicit `ADMIN`/`EDITOR` roles.
- Remove shared-password production auth.
- Provide tour draft/review/publish controls; unverified fields are hidden.
- Provide request queue, search/filter/export, status transitions, assignment and notes.
- Record who changed publication/status and when.
- Keep payment ledger, blog, reviews and customer dashboards out of the Phase 1 navigation.

## Content and media

- Centralize approved ATA identity/contact data.
- Store media in an ATA-owned approved service; persist source, rights/consent, alt text, crop/focal data and approval state.
- Preserve image optimization and responsive variants.
- If Builder is retained, define it as an editing surface with strict schemas, not a catch-all routing authority. Otherwise use the database/admin UI already present.

## SEO, analytics and mobile

- Generate sitemap only from published public pages/tours; exclude admin, auth and dashboard.
- Use `TouristTrip`/`Product` structured data only where fields are verified; never emit `InStock` without real inventory.
- Define events for flagship view, CTA start, request type and successful request—no sensitive form values.
- Implement consent before analytics where required.
- Server-render the primary content, minimize client JS, remove Three.js from the critical journey, use sticky/early mobile CTA and test zoom/keyboard/focus/error behavior.

## Migration sequence

1. Reconcile dirty-state changes and protect current work.
2. Approve the domain/data contract and content verification rules.
3. Add additive schema migration and adapters; do not destructively convert legacy data.
4. Build flagship route behind a server-controlled feature flag.
5. Build unified request flow and admin queue using test services.
6. Hide flight-first/payment/review/customer-account surfaces from primary IA.
7. Import only ATA-approved flagship facts and licensed media.
8. Run accessibility, performance, security and end-to-end staging gates.
9. Obtain ATA content/UAT approval before production.

## Future payment compatibility

Keep a future `Order`/`Payment` boundary separate from `CustomerRequest`. A request may later lead to an order, but submitting a request never creates a charge or confirmed inventory. Future payment work requires approved currency/minor units, tax/refund rules, idempotency, webhook reconciliation and operational ownership.

