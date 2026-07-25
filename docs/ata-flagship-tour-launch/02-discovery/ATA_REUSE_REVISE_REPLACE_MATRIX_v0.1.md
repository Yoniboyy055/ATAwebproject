# ATA Reuse–Revise–Replace Matrix v0.1

| Item | Condition / Phase 1 relevance | Recommendation | Reason / dependency | Risk | Complexity | Trace |
|---|---|---|---|---|---|---|
| Next.js App Router / TypeScript | Stable build; suitable | REUSE AS-IS | Avoid unnecessary migration | Low | Small | SOW 5.10; repository |
| Tailwind/shared UI primitives | Reusable | REUSE WITH MINOR CHANGE | Preserve design tokens and accessibility | Low | Small | repository |
| Prisma/PostgreSQL | Existing migrations/models | REUSE WITH CHANGE | Add safe tour/request models through reviewed migration later | Medium | Medium | SOW 5.8 |
| Builder.io | Credentials absent; catch-all governance | DEFER | Decide ownership/editor need before retaining | Medium | Medium | repository |
| Homepage | Flight-first and oversized | REVISE | Compose tour-first sections; do not rebuild platform | High | Large | OWNER DIRECTION; SRC-UI-001 |
| Flights routes | Existing but not launch priority | DEFER / feature-hide | Preserve code; remove from primary journey | Medium | Small | SOW 4 |
| Package index | Generic packages | REVISE | Publish one verified tour; support four future records | High | Medium | SRC-UI-002 |
| Package detail blocks | Useful gallery/itinerary/FAQ/pricing primitives | REUSE WITH CHANGE | Decouple from unverified Builder data | Medium | Medium | SRC-UI-003–005 |
| `Package` model | Too shallow | REPLACE model contract | Needs slug, state, itinerary, dates, verification and media | High | Medium | SOW 5.3 |
| Enquiry/Booking/Quote models | Fragmented | REVISE into unified request model | One request type enum and consistent status | High | Medium | SOW 5.7 |
| Confirmation UI/messages | Claims confirmation | REPLACE | Must say received/pending ATA review | Critical | Small | OWNER DIRECTION |
| Stripe routes/admin | Live-capable | DEFER and disable | No payment confirmation in Phase 1 | Critical | Small | WP-01 boundary |
| Resend/Twilio helpers | Useful transport adapters | REUSE WITH CHANGE | Transactional templates, explicit environment gate, no “confirmed” claim | High | Medium | SOW 5.7 |
| NextAuth | Sound base | REUSE WITH CHANGE | Use role-based admin auth; avoid parallel password system | High | Medium | SOW 5.8 |
| Shared-password admin auth | Split boundary | REPLACE | Least privilege and accountable identities | Critical | Medium | security evidence |
| Package admin | CRUD primitives | REVISE | Tour fields, publish states, verification flags, media | High | Large | SOW 5.8 |
| Enquiry admin | Useful queue concept | REVISE | Unified statuses, notes, filters, export, audit fields | High | Medium | SOW 5.8 |
| Customer dashboard/wishlist | Beyond initial acquisition flow | DEFER | Reduces scope and privacy surface | Medium | Small | SOW 9 |
| Reviews/testimonials | Unverified static and DB content | RETIRE until approved | Evidence/provenance required | High | Small | SRC-KB V-008 |
| Newsletter | Nonessential | DEFER | Consent/deliverability overhead | Medium | Small | SRC-UI-001 |
| Blog/content route | Nonessential and mixed persistence | DEFER | One-tour conversion priority | Low | Small | owner direction |
| Contact/about/footer | Useful structure, conflicting details | REUSE WITH CHANGE | Central verified business profile | High | Small | SRC-KB V-004 |
| SEO helpers/sitemap/robots | Present | REVISE | Remove private paths and inventory claims; tour schema | Medium | Medium | SOW 5.10 |
| Image pipeline | AVIF/WebP checks pass | REUSE AS-IS | Add rights/provenance registry | Medium | Small | repository |
| Three.js/imperative homepage | Heavy and brittle | REPLACE on critical path | Performance/accessibility/maintainability | Medium | Medium | build output |
| Current dirty-state docs/components | Potentially valuable but unreconciled | REQUIRES YK CONFIRMATION | Owner review before cherry-pick/merge | High | Large | SRC-REPO-WIP |

