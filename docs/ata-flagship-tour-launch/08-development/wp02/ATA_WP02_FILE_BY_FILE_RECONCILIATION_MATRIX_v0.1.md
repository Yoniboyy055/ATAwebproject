# ATA WP-02 File-by-File Reconciliation Matrix v0.1

**Compared state:** read-only dirty worktree at `C:\\Users\\yonib\\ATAwebproject` versus refreshed `origin/main` baseline used by WP-01.  
**Generated:** 2026-07-24  
**Control:** This is a proposed disposition register. No dirty-state file was copied, changed, staged, stashed, reset, deleted, or committed.

## Decision meanings

- **RETAIN SELECTIVELY / RETAIN CONCEPT:** preserve useful ideas through reviewed reimplementation.
- **REWRITE:** relevant to Phase 1 but not safe to merge as-is.
- **DEFER / HIDE:** preserve but keep outside the Phase 1 public path.
- **REJECT DELETION:** do not carry a dirty-state deletion forward without approval.
- **ESCALATE / UNRESOLVED:** owner or focused technical decision required.

## File matrix

| # | File | Dirty status | Proposed disposition | Rationale |
|---:|---|:---:|---|---|
| 1 | `.artifacts/next-dev-3000-clean.err.log` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 2 | `.artifacts/next-dev-3000-clean.out.log` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 3 | `.artifacts/next-dev-3001.err.log` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 4 | `.artifacts/next-dev-3001.out.log` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 5 | `.artifacts/next-dev.err.log` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 6 | `.artifacts/next-dev.out.log` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 7 | `.env.example` | M | ESCALATE | Owner review required for configuration, dependency, or database intent. |
| 8 | `.env.production.example` | M | ESCALATE | Owner review required for configuration, dependency, or database intent. |
| 9 | `.github/workflows/ci-cd.yml` | D | REJECT DELETION | Preserve baseline until an explicit retirement decision is approved. |
| 10 | `.github/workflows/ci.yml` | D | REJECT DELETION | Preserve baseline until an explicit retirement decision is approved. |
| 11 | `.github/workflows/release.yml` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 12 | `.gitignore` | M | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 13 | `.playwright-mcp/Amanuel-Travel-handoff-tar.gz` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 14 | `.playwright-mcp/console-2026-06-08T02-19-29-261Z.log` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 15 | `.playwright-mcp/console-2026-06-08T02-54-26-050Z.log` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 16 | `.playwright-mcp/console-2026-06-08T02-57-58-985Z.log` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 17 | `.playwright-mcp/console-2026-06-08T03-01-33-163Z.log` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 18 | `.playwright-mcp/page-2026-06-08T02-19-31-961Z.yml` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 19 | `.playwright-mcp/page-2026-06-08T02-45-38-088Z.yml` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 20 | `.playwright-mcp/page-2026-06-08T02-46-52-295Z.yml` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 21 | `.playwright-mcp/page-2026-06-08T02-52-46-294Z.yml` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 22 | `.playwright-mcp/page-2026-06-08T02-54-28-004Z.yml` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 23 | `.playwright-mcp/page-2026-06-08T02-58-02-127Z.yml` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 24 | `.playwright-mcp/page-2026-06-08T03-01-34-385Z.yml` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 25 | `app/about/page.tsx` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 26 | `app/admin/analytics/page.tsx` | M | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 27 | `app/admin/blog/page.tsx` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 28 | `app/admin/bookings/[id]/page.tsx` | D | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 29 | `app/admin/bookings/page.tsx` | M | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 30 | `app/admin/enquiries/page.tsx` | D | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 31 | `app/admin/layout.tsx` | M | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 32 | `app/admin/login/page.tsx` | D | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 33 | `app/admin/packages/page.tsx` | M | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 34 | `app/admin/page.tsx` | M | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 35 | `app/admin/payments/page.tsx` | M | DEFER | Keep disabled; do not carry production payment behavior into Phase 1. |
| 36 | `app/admin/users/page.tsx` | M | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 37 | `app/api/admin/analytics/route.ts` | M | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 38 | `app/api/admin/auth/route.ts` | D | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 39 | `app/api/admin/blog/[slug]/route.ts` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 40 | `app/api/admin/blog/route.ts` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 41 | `app/api/admin/bookings/route.ts` | D | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 42 | `app/api/admin/enquiries/route.ts` | D | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 43 | `app/api/admin/packages/[id]/route.ts` | D | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 44 | `app/api/admin/packages/route.ts` | D | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 45 | `app/api/admin/packages/sync/route.ts` | ? | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 46 | `app/api/admin/payments/route.ts` | M | DEFER | Keep disabled; do not carry production payment behavior into Phase 1. |
| 47 | `app/api/admin/stats/route.ts` | M | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 48 | `app/api/admin/users/route.ts` | M | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 49 | `app/api/blog/[slug]/route.ts` | D | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 50 | `app/api/blog/route.ts` | D | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 51 | `app/api/bookings/route.ts` | M | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 52 | `app/api/enquiries/route.ts` | D | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 53 | `app/api/health/builder/route.ts` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 54 | `app/api/health/route.ts` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 55 | `app/api/liveness/route.ts` | ? | RETAIN CONCEPT / REWRITE | Useful hardening or test concept; reimplement against WP-02 contracts. |
| 56 | `app/api/newsletter/route.ts` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 57 | `app/api/packages/route.ts` | M | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 58 | `app/api/payments/create/route.ts` | M | DEFER | Keep disabled; do not carry production payment behavior into Phase 1. |
| 59 | `app/api/readiness/__tests__/route.test.ts` | ? | RETAIN CONCEPT / REWRITE | Useful hardening or test concept; reimplement against WP-02 contracts. |
| 60 | `app/api/readiness/route.ts` | ? | RETAIN CONCEPT / REWRITE | Useful hardening or test concept; reimplement against WP-02 contracts. |
| 61 | `app/api/revalidate/__tests__/route.test.ts` | ? | RETAIN CONCEPT / REWRITE | Useful hardening or test concept; reimplement against WP-02 contracts. |
| 62 | `app/api/revalidate/route.ts` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 63 | `app/api/reviews/[id]/helpful/route.ts` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 64 | `app/api/reviews/route.ts` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 65 | `app/api/user/profile/route.ts` | ? | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 66 | `app/api/user/summary/route.ts` | ? | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 67 | `app/api/user/wishlist/[id]/route.ts` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 68 | `app/api/user/wishlist/route.ts` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 69 | `app/api/webhooks/stripe/route.ts` | M | DEFER | Keep disabled; do not carry production payment behavior into Phase 1. |
| 70 | `app/blog/[slug]/page.tsx` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 71 | `app/blog/page.tsx` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 72 | `app/book/page.tsx` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 73 | `app/contact/page.tsx` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 74 | `app/content/page.tsx` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 75 | `app/dashboard/bookings/page.tsx` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 76 | `app/dashboard/layout.tsx` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 77 | `app/dashboard/page.tsx` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 78 | `app/dashboard/profile/page.tsx` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 79 | `app/dashboard/quotes/page.tsx` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 80 | `app/dashboard/saved-packages/page.tsx` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 81 | `app/dashboard/wishlist/page.tsx` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 82 | `app/destinations/page.tsx` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 83 | `app/faq/page.tsx` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 84 | `app/flights/results/page.tsx` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 85 | `app/layout.tsx` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 86 | `app/packages/layout.tsx` | M | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 87 | `app/packages/page.tsx` | M | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 88 | `app/page.tsx` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 89 | `app/policies/page.tsx` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 90 | `app/reviews/page.tsx` | M | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 91 | `app/robots.ts` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 92 | `app/search/page.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 93 | `app/services/page.tsx` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 94 | `app/sitemap.ts` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 95 | `BUILDER_IO_QUICK_REFERENCE.md` | A | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 96 | `BUILDER_IO_SETUP.md` | A | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 97 | `CLEANUP_SUMMARY.md` | A | ESCALATE | Potentially valuable active documentation; owner must reconcile authority and currency. |
| 98 | `COMMUNICATION_INTEGRATION_GUIDE.md` | A | ESCALATE | Potentially valuable active documentation; owner must reconcile authority and currency. |
| 99 | `COMPLETE_ENHANCEMENTS_SUMMARY.md` | A | ESCALATE | Potentially valuable active documentation; owner must reconcile authority and currency. |
| 100 | `components/AdvancedSearchForm.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 101 | `components/AirlinePartners.tsx` | ? | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 102 | `components/BuilderSyncControls.tsx` | ? | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 103 | `components/ConditionalLayout.tsx` | D | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 104 | `components/DashboardShell.tsx` | ? | DEFER / HIDE | Outside the tour-first Phase 1 critical path. |
| 105 | `components/DesignHomePage.tsx` | D | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 106 | `components/ErrorBoundary.tsx` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 107 | `components/FaqChatWidget.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 108 | `components/Footer.tsx` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 109 | `components/GoogleAnalytics.tsx` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 110 | `components/home/CategoryTiles.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 111 | `components/home/CTASection.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 112 | `components/home/DestinationsMap.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 113 | `components/home/FeaturedDeals.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 114 | `components/home/HeroSection.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 115 | `components/home/Testimonials.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 116 | `components/HowItWorksSection.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 117 | `components/LiveChat.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 118 | `components/lovable/LovableDestinations.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 119 | `components/lovable/LovableFaqPreview.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 120 | `components/lovable/LovableFinalCta.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 121 | `components/lovable/LovableHero.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 122 | `components/lovable/LovablePackages.tsx` | A | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 123 | `components/lovable/LovableServices.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 124 | `components/lovable/LovableTestimonials.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 125 | `components/lovable/LovableTrust.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 126 | `components/ModernTrustStrip.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 127 | `components/Navbar.tsx` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 128 | `components/PackagesSection.tsx` | A | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 129 | `components/QuoteForm.tsx` | A | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 130 | `components/SearchResults.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 131 | `components/SignOutButton.tsx` | ? | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 132 | `components/ui/BentoGrid.tsx` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 133 | `components/ui/Button.tsx` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 134 | `components/ui/Input.tsx` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 135 | `components/ui/SectionHeader.tsx` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 136 | `components/WhatsAppButton.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 137 | `components/WhoWeServeSection.tsx` | A | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 138 | `current-hero.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 139 | `DEPLOYMENT_VERIFICATION_GUIDE.md` | A | ESCALATE | Potentially valuable active documentation; owner must reconcile authority and currency. |
| 140 | `design-hero.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 141 | `design-s2.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 142 | `design-s3.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 143 | `design-s4.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 144 | `design-s5.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 145 | `design-s6.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 146 | `design-s7.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 147 | `design-s8.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 148 | `docs/production-runbook.md` | ? | ESCALATE | Potentially valuable active documentation; owner must reconcile authority and currency. |
| 149 | `FINAL_VERIFICATION_REPORT.md` | A | ESCALATE | Potentially valuable active documentation; owner must reconcile authority and currency. |
| 150 | `IMPROVEMENTS_IMPLEMENTATION.md` | A | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 151 | `instrumentation.ts` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 152 | `jest.config.ts` | M | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 153 | `lib/__tests__/builder-admin.test.ts` | ? | RETAIN CONCEPT / REWRITE | Useful hardening or test concept; reimplement against WP-02 contracts. |
| 154 | `lib/__tests__/builder-sync.test.ts` | ? | RETAIN CONCEPT / REWRITE | Useful hardening or test concept; reimplement against WP-02 contracts. |
| 155 | `lib/ab-testing.ts` | A | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 156 | `lib/admin-auth.ts` | D | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 157 | `lib/admin.ts` | M | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 158 | `lib/auth-helpers.ts` | ? | RETAIN CONCEPT / REWRITE | Useful hardening or test concept; reimplement against WP-02 contracts. |
| 159 | `lib/auth.ts` | M | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 160 | `lib/builder-admin.ts` | ? | REWRITE | Relevant domain surface, but must use unified requests, verified tours, and identity roles. |
| 161 | `lib/builder-sync.ts` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 162 | `lib/config.ts` | M | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 163 | `lib/db-optimization.ts` | A | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 164 | `lib/email.ts` | M | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 165 | `lib/env.ts` | M | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 166 | `lib/http-utils.ts` | A | RETAIN CONCEPT / REWRITE | Useful hardening or test concept; reimplement against WP-02 contracts. |
| 167 | `lib/logger.ts` | ? | RETAIN CONCEPT / REWRITE | Useful hardening or test concept; reimplement against WP-02 contracts. |
| 168 | `lib/meta-tags.ts` | M | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 169 | `lib/schema.ts` | M | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 170 | `lib/search.ts` | A | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 171 | `lib/sentry-config.ts` | A | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 172 | `lib/sentry.server.config.ts` | A | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 173 | `lib/sentry.ts` | A | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 174 | `lib/site.ts` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 175 | `lib/sms.ts` | M | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 176 | `lib/swagger.ts` | A | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 177 | `live-dest.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 178 | `live-footer.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 179 | `live-hero.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 180 | `live-nav.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 181 | `live-packages.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 182 | `live-partners.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 183 | `live-services.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 184 | `live-transition.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 185 | `middleware.ts` | D | RETAIN CONCEPT / REWRITE | Useful hardening or test concept; reimplement against WP-02 contracts. |
| 186 | `next.config.enhanced.js` | A | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 187 | `package-lock.json` | M | ESCALATE | Owner review required for configuration, dependency, or database intent. |
| 188 | `package.json` | M | ESCALATE | Owner review required for configuration, dependency, or database intent. |
| 189 | `preview-destinations.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 190 | `preview-footer.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 191 | `preview-hero.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 192 | `preview-home-full.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 193 | `preview-testimonials.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 194 | `preview-trust-services.png` | ? | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 195 | `prisma/migrations/20260322000000_production_foundation/migration.sql` | ? | ESCALATE | Owner review required for configuration, dependency, or database intent. |
| 196 | `prisma/migrations/20260612000000_init/migration.sql` | D | ESCALATE | Owner review required for configuration, dependency, or database intent. |
| 197 | `prisma/migrations/20260612000001_add_blog_posts/migration.sql` | D | ESCALATE | Owner review required for configuration, dependency, or database intent. |
| 198 | `prisma/migrations/migration_lock.toml` | D | ESCALATE | Owner review required for configuration, dependency, or database intent. |
| 199 | `prisma/schema.prisma` | M | ESCALATE | Owner review required for configuration, dependency, or database intent. |
| 200 | `prisma/seed.ts` | M | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 201 | `PRODUCTION_READINESS_REPORT.md` | A | ESCALATE | Potentially valuable active documentation; owner must reconcile authority and currency. |
| 202 | `PROJECT_STATUS_COMPLETE.md` | A | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 203 | `public/favicon.svg` | M | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 204 | `public/images/blur.json` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 205 | `public/images/dest-1.svg` | M | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 206 | `public/images/dest-2.svg` | M | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 207 | `public/images/dest-3.svg` | M | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 208 | `public/images/dest-4.svg` | M | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 209 | `public/images/dest-5.svg` | M | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 210 | `public/images/dest-6.svg` | M | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 211 | `public/images/dest-asmara-1200.avif` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 212 | `public/images/dest-asmara-1200.webp` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 213 | `public/images/dest-asmara-400.avif` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 214 | `public/images/dest-asmara-400.webp` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 215 | `public/images/dest-asmara-800.avif` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 216 | `public/images/dest-asmara-800.webp` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 217 | `public/images/dest-asmara.jpg` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 218 | `public/images/dest-dahlak-1200.avif` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 219 | `public/images/dest-dahlak-1200.webp` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 220 | `public/images/dest-dahlak-400.avif` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 221 | `public/images/dest-dahlak-400.webp` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 222 | `public/images/dest-dahlak-800.avif` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 223 | `public/images/dest-dahlak-800.webp` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 224 | `public/images/dest-dahlak.jpg` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 225 | `public/images/dest-keren-1200.avif` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 226 | `public/images/dest-keren-1200.webp` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 227 | `public/images/dest-keren-400.avif` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 228 | `public/images/dest-keren-400.webp` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 229 | `public/images/dest-keren-800.avif` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 230 | `public/images/dest-keren-800.webp` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 231 | `public/images/dest-keren.jpg` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 232 | `public/images/dest-massawa-400.avif` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 233 | `public/images/dest-massawa-400.webp` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 234 | `public/images/dest-massawa-800.avif` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 235 | `public/images/dest-massawa-800.webp` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 236 | `public/images/dest-massawa.jpg` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 237 | `public/images/hero-1600.webp` | A | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 238 | `public/images/hero-800.avif` | M | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 239 | `public/images/hero.jpg` | D | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 240 | `public/images/hero.svg` | M | DEFER | Preserve; verify provenance, rights, and intended use before selection. |
| 241 | `sentry.client.config.ts` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 242 | `sentry.edge.config.ts` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 243 | `sentry.server.config.ts` | ? | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 244 | `STATUS_REPORT.md` | A | ESCALATE | Potentially valuable active documentation; owner must reconcile authority and currency. |
| 245 | `styles/design.css` | D | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 246 | `styles/globals.css` | M | RETAIN SELECTIVELY | Review visual/interaction value; do not wholesale copy unverified content or behavior. |
| 247 | `supabase_init.sql` | A | ESCALATE | Owner review required for configuration, dependency, or database intent. |
| 248 | `tailwind.config.cjs` | M | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 249 | `tsconfig.tsbuildinfo` | A | UNRESOLVED | Requires focused owner or technical review before reconciliation. |
| 250 | `UNMERGED_BRANCHES_REPORT.md` | A | ESCALATE | Potentially valuable active documentation; owner must reconcile authority and currency. |

## Totals

- Tracked comparison entries: **184**
- Untracked files enumerated individually: **69**
- Total file decisions: **250**

The matrix is intentionally conservative. It does not authorize wholesale copying from the dirty state and does not treat newer timestamps or larger diffs as evidence of correctness.

