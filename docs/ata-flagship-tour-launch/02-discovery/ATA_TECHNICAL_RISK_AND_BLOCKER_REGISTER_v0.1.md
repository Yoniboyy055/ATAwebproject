# ATA Technical Risk and Blocker Register v0.1

| ID | Risk / evidence | Severity | Phase 1 effect | Required action / owner |
|---|---|---|---|---|
| R-001 | Intended domain `amanueltravel.com` does not resolve | Critical blocker | Cannot verify or launch public site | YK/ATA provide canonical URL, DNS and account ownership |
| R-002 | 22 npm audit findings: 2 critical, 15 high | Critical | Security/release risk | WP-02 dependency triage; no blind major upgrade |
| R-003 | Payment routes and “confirmed” email/SMS language exist | Critical | Violates request-only model | Feature-disable Stripe and replace confirmation semantics |
| R-004 | Split/shared-password admin auth | Critical | Weak accountability/access control | Consolidate on identity-backed roles |
| R-005 | Dirty state diverges across 183 tracked paths plus untracked work | High | Reuse decisions can be invalidated | Owner-led reconciliation against WP-01 branch |
| R-006 | Tour/package model lacks required fields and publication states | High | Cannot safely represent flagship | Approve model before migration |
| R-007 | Inputs and contact/business claims remain unverified | High | Misrepresentation risk | ATA content approval gate |
| R-008 | Fragmented enquiry/quote/booking models | High | Duplicate/inconsistent customer records | Unified request architecture |
| R-009 | No confirmed distributed anti-spam/rate limiting | High | Abuse and cost risk | Add server validation, honeypot, managed rate limit/CAPTCHA decision |
| R-010 | Builder dependency lacks baseline key and package build fetch fails | High | Missing package pages/content | Decide retain/remove and establish ownership |
| R-011 | Database unavailable in credential-free build | High | End-to-end persistence unverified | Safe test DB/staging credentials in WP-02 |
| R-012 | Static testimonials, prices and inventory schema | High | Unverified claims | Hide unless individually approved |
| R-013 | PII retention/consent/deletion undefined | High | Privacy and operations risk | ATA policy/legal decisions; document retention |
| R-014 | Public sitemap includes auth/dashboard and uncertain blogs | Medium | SEO leakage/poor indexing | Generate from published public records |
| R-015 | Homepage 248 kB first-load JS and heavy imperative UI | Medium | Mobile conversion/performance risk | Componentize and remove nonessential Three.js |
| R-016 | No Lighthouse/accessibility/E2E baseline | Medium | Unknown mobile/accessibility quality | Run against stable local/staging URL |
| R-017 | GA consent and event taxonomy not established | Medium | Privacy/measurement gaps | Obtain account and consent decisions |
| R-018 | Current working state removes migrations and optimized assets | High | Data/media regression if merged | Review intent; never wholesale overwrite |
| R-019 | No Vercel project metadata/config in repository | Medium | Deployment ownership unclear | Document project/team/account; use approved local/npx CLI only if needed |
| R-020 | E2E script exists without established Playwright dependency/config | Medium | False confidence in test coverage | Add explicit, pinned E2E setup in WP-02 |

## Immediate decision blockers

1. Canonical deployment/domain and owner account.
2. ATA-approved business identity/contact details.
3. Flagship operational facts and publication approvals.
4. Request types, response SLA and status ownership.
5. Admin identities/roles.
6. Whether Builder remains an approved content system.
7. Which dirty-state changes should be reconciled into future work.

