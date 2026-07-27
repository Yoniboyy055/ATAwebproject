# ATA WP-04V discovery and classification

Baseline: `7ab88e90aa51d12c25cc0cc74c13d5fec2c3b158`

Discovery completed before implementation. The repository contains three distinct surfaces: the public App Router site, the legacy `/admin` operations portal backed by Prisma APIs, and the controlled `/ata-admin` staging console introduced in WP-03. WP-04V upgrades `/ata-admin` in place and preserves `/admin` unchanged; it does not create a competing owner-dashboard URL.

## Public route map and disposition

| Route | Current role | Disposition |
|---|---|---|
| `/` | Public home | Retain route; refactor visual implementation |
| `/tours/flagship-preview` | Controlled flagship preview | Retain and extend |
| `/packages`, `/packages/[slug]` | Legacy database packages | Retain unchanged; excluded from preview fixtures |
| `/book`, `/contact` | Legacy request/contact | Retain unchanged |
| `/about`, `/services`, `/destinations`, `/faq`, `/blog` | Supporting public pages | Retain unchanged |
| `/ata-review` | None | Add review guide only; no production capability duplicated |

## Dashboard route map and disposition

| Route | Current role | Disposition |
|---|---|---|
| `/ata-admin` | Controlled ATA staging console | Retain route; replace internal presentation with owner experience |
| `/admin` | Legacy Prisma admin overview | Retain unchanged |
| `/admin/packages` | Legacy package CRUD | Retain unchanged; later migration candidate |
| `/admin/bookings`, `/admin/enquiries` | Legacy operations | Retain unchanged |
| `/admin/blog`, `/admin/users`, `/admin/payments`, `/admin/analytics` | Legacy administration | Retain unchanged |
| `/dashboard/*` | Customer account | Retain unchanged |

## Component reuse and change matrix

| Component or logic | Decision | Reason |
|---|---|---|
| `lib/ata/workflow.ts` | Retain unchanged | Tested 15-state workflow and manual-confirmation gate |
| `lib/ata/content-contract.ts` | Retain unchanged | Approved public copy controls |
| `lib/ata/feature-flags.ts` | Retain unchanged | Existing preview exposure boundary |
| `FlagshipRequestForm` | Retain and restyle | Existing test-only request contract |
| `Navbar`, `Footer` | Retain for legacy routes | Avoid broad route regression |
| `DesignHomePage` | Replace internally, route preserved | Monolithic DOM scripting, unverified claims, direct enquiry write |
| `/ata-admin` page | Replace internally, route preserved | Foundation is sound but not owner-operational |
| Legacy `/admin` pages | Deprecate later | Real Prisma dependencies conflict with isolated preview requirement |

## Architecture findings

- Next.js App Router, TypeScript, Tailwind, Prisma, NextAuth, Jest and Playwright are established.
- Middleware protects `/dashboard`; legacy `/admin` uses its own authentication assumptions.
- WP-03 domain, authorization, audit and feature-flag modules are intentional current architecture.
- The legacy seven-state request schema remains in `lib/ata/domain.ts`; the authoritative 15-state workflow is isolated in `lib/ata/workflow.ts`.
- No Supabase client dependency or adapter is present in the application baseline.
- Legacy packages and seed records are database-backed and are not reused by WP-04V.
- Existing public photography is repository-owned project material; WP-04V introduces no external asset.

## Duplicate-route prevention

The owner experience remains at `/ata-admin`. The only new route, `/ata-review`, is a navigation guide with no editing or operational capability. Public home and flagship routes are upgraded in place. No alternate dashboard, package, booking, or publication route is created.

