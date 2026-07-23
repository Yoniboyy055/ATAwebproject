# ATA Route and Component Inventory v0.1

**Baseline:** `origin/main` at `7392825`  
**State labels:** B = committed baseline; W = current working state; Both = present in both (content may differ).

## Public and customer routes

| Route | Purpose / primary implementation | Auth | Data source | State | Phase 1 treatment |
|---|---|---|---|---|---|
| `/` | Flight/service-first homepage; `DesignHomePage` | Public | Hard-coded UI + `/api/enquiries` | Both, materially different | REVISE to tour-first |
| `/[...page]` | Builder.io catch-all | Public | Builder API | B only | DEFER or tightly constrain |
| `/about` | Company/trust page | Public | Static | Both | REUSE WITH MINOR CHANGE after fact approval |
| `/auth/signin` | NextAuth sign-in | Public | NextAuth | Both | DEFER for public journey; retain if admin/customer accounts approved |
| `/blog`, `/blog/[slug]` | Blog index/detail | Public | Prisma/API | Both; APIs removed in W | DEFER |
| `/book` | Flight-booking request UI with estimated totals | Public | `/api/booking` and messaging | Both | REPLACE customer language/flow with request types |
| `/contact` | Contact page and enhanced form | Public | WhatsApp/form behavior | Both | REVISE |
| `/content` | Content showcase | Public | Static | Both | RETIRE from public IA |
| `/copyright` | Copyright statement | Public | Static | B only | REUSE WITH REVIEW |
| `/destinations` | Broad destination grid | Public | Static | Both | DEFER or revise to verified Eritrea context |
| `/faq` | General FAQ | Public | Static | Both | REVISE using approved answers |
| `/flights` | Flight search/intake | Public | Client-side/static | Both | DEFER/hide from primary navigation |
| `/flights/results` | Flight-results mock/request experience | Public | Client-side | Both, materially simplified in W | RETIRE or feature-flag |
| `/packages` | Generic package catalog | Public | API/Prisma/Builder | Both | REVISE as one-published-tour catalog |
| `/packages/[slug]` | Builder-backed package detail | Public | Builder API | B; availability uncertain in W | REPLACE data contract, reuse structural blocks |
| `/policies` | Policy hub | Public | Static | Both | REVISE; ATA approval required |
| `/policies/privacy` | Privacy page | Public | Static | Both | REVISE with legal review |
| `/policies/refunds` | Refund page | Public | Static | Both | HIDE until ATA-approved |
| `/policies/terms` | Terms page | Public | Static | Both | REVISE with legal review |
| `/reviews` | User review UI | Public | Prisma API | Both | DEFER; do not publish placeholders |
| `/services` | General agency services | Public | Static | Both | DEFER or secondary IA |
| `/dashboard` | Customer dashboard | Session intended | Browser/API | Both | DEFER |
| `/dashboard/bookings` | Customer bookings | Session intended | API | Both | DEFER |
| `/dashboard/profile` | Customer profile | Session intended | API/browser | Both | DEFER |
| `/dashboard/quotes` | Customer quotes | Session intended | API | Both | DEFER |
| `/dashboard/saved-packages` | Saved packages | Session intended | API | Both | DEFER |
| `/dashboard/wishlist` | Wishlist | Session intended | API | Both | DEFER |
| `/_not-found` | Next.js fallback | Public | Framework | Both | REUSE |

## Administration routes

| Route | Purpose | Boundary | State | Treatment |
|---|---|---|---|---|
| `/admin` | Admin dashboard | Middleware/admin auth in B | Both | REVISE |
| `/admin/login` | Shared-password admin login | `ADMIN_PASSWORD`/cookie | B only | REPLACE with identity-backed role auth |
| `/admin/analytics` | Statistics | Admin API | Both | DEFER |
| `/admin/blog` | Blog CRUD | Admin API | Both | DEFER |
| `/admin/bookings`, `/admin/bookings/[id]` | Booking management/detail | Admin API | List Both; detail B only | REVISE into unified enquiry queue |
| `/admin/enquiries` | Enquiry management | Admin API | B only | REUSE CONCEPT / REVISE |
| `/admin/packages` | Package CRUD | Admin API/Prisma | Both | REVISE to tour content model and publication states |
| `/admin/payments` | Payment ledger | Admin API/Stripe data | Both | DEFER/HIDE |
| `/admin/users` | User management | Admin API | Both | DEFER unless needed for ATA admins |

## API routes

| Route(s) | Purpose | Validation / persistence | State | Treatment |
|---|---|---|---|---|
| `/api/auth/[...nextauth]`, `/api/auth/register` | Authentication/registration | NextAuth, Prisma, Zod | Both | REVISE; no open customer registration required |
| `/api/admin/auth` | Shared admin login | Password/cookie | B only | REPLACE |
| `/api/admin/analytics`, `/stats`, `/users` | Admin reporting/users | Prisma | Both | DEFER |
| `/api/admin/blog`, `/blog/[slug]` | Blog CRUD | Prisma | Both | DEFER |
| `/api/admin/bookings` | Booking-request admin | Prisma | B only | REVISE |
| `/api/admin/enquiries` | Enquiry admin | Prisma | B only | REVISE |
| `/api/admin/packages`, `/packages/[id]` | Package CRUD | Prisma | B only | REVISE |
| `/api/admin/payments` | Payment reporting | Prisma | Both | DEFER |
| `/api/blog`, `/api/blog/[slug]` | Public blog | Prisma | B only | DEFER |
| `/api/booking` | Rich flight booking request | Zod; email/SMS side effects possible | Both | REPLACE; unsafe confirmation language |
| `/api/bookings` | Authenticated bookings | Prisma | Both | DEFER |
| `/api/enquiries` | Homepage enquiry | Minimal manual validation, Prisma | B only | REVISE; W removes it |
| `/api/packages` | Public packages | Prisma/Builder fallback | Both, materially changed | REVISE |
| `/api/quotes` | Authenticated quote requests | Prisma | Both | REVISE or unify |
| `/api/newsletter` | Subscription | Prisma | Both | DEFER |
| `/api/payments/create` | Stripe PaymentIntent | Stripe + auth | Both | DISABLE/DEFER |
| `/api/webhooks/stripe` | Stripe webhook | Signature verification + Prisma | Both | DISABLE/DEFER |
| `/api/reviews`, `/reviews/[id]/helpful` | Reviews | Prisma | Both | DEFER |
| `/api/user/wishlist`, `/wishlist/[id]` | Wishlist | Session + Prisma | Both | DEFER |
| `/api/revalidate` | Builder webhook cache invalidation | Secret token | Both | REVISE if Builder retained |
| `/api/health`, `/api/health/builder` | Health checks | Config/Prisma/Builder | Both | REUSE WITH MINOR CHANGE |

## Major component inventory

| Component group | Examples | Condition | Recommendation |
|---|---|---|---|
| Layout/navigation | `ConditionalLayout`, `Navbar`, `Footer`, providers | Broad flight/services IA; mixed contacts | REVISE |
| Homepage | `DesignHomePage` | 1,194-line client component, direct DOM listeners, Three.js; W deletes it | REPLACE composition, reuse selected visual assets only |
| Forms | `EnhancedContactForm`, `QuoteModal`, `NewsletterSignup`, booking page form | Fragmented schemas and outcomes | REVISE into one request model |
| Tour/package blocks | Builder `PackagesGrid`, `FeaturedPackagesCarousel`, `ItineraryTimeline`, `PricingBox`, `Gallery`, `FAQ`, `ImportantInfo`, `TrustBar` | Useful structural primitives, Builder-coupled | REUSE WITH CHANGE |
| Destinations | `DestinationsGrid`, static `lib/data.ts` | Generic and duplicated imagery | REVISE/DEFER |
| Testimonials/reviews | Hard-coded testimonials, review pages | Unverified | RETIRE until evidence |
| Trust | `TrustBar` and homepage trust statements | Some unsupported claims | REVISE with nullable/hidden verified fields |
| Admin | Package, booking, enquiry, blog, user, payment pages | CRUD exists but auth/model boundaries weak | REVISE |
| Customer dashboard | Dashboard pages/providers | Beyond Phase 1 | DEFER |
| Analytics | `GoogleAnalytics`, structured-data helpers | Useful but warning and consent questions | REUSE WITH CHANGE |
| Shared UI | Button, Card, Section, Input, headings, error boundaries | Generally reusable | REUSE AS-IS or minor change |
| Mobile | Responsive CSS/components; no dedicated E2E proof | Partial | REVISE and test |

## Reachability notes

- Sitemap exposes `/auth/signin` and `/dashboard`, which should not be public SEO destinations.
- Sitemap includes three hard-coded blog slugs that are not guaranteed to exist.
- Catch-all Builder route can mask intended 404 behavior and expands content governance risk.
- Admin and API routes exist in the baseline even where public navigation does not link them.

