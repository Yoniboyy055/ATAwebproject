# ATA Existing Worktree Inventory v0.1

**Project:** ATA Flagship Tour Launch  
**Work package:** CODEX WP-01  
**Evidence captured:** 2026-07-23  
**Classification:** TECHNICAL EVIDENCE  

## Preservation statement

The original repository at `C:\Users\yonib\ATAwebproject` was treated as **READ-ONLY WORKING-STATE EVIDENCE**. Codex did not modify, stage, clean, reset, stash, commit, switch, rename, delete, format, install dependencies, run migrations, or execute application commands in that worktree.

WP-01 writes and baseline execution occur only in the separate worktree at `C:\Users\yonib\ATAwebproject-wp01-audit`.

## Repository states

| State | Path | Branch | Commit |
|---|---|---|---|
| Current working state | `C:\Users\yonib\ATAwebproject` | `main` | `4a63be636d8734ab0f94a6663c9ecc89f90901a2` |
| Committed baseline | `C:\Users\yonib\ATAwebproject-wp01-audit` | `codex/ata-wp01-repository-audit` | `739282567abffe7618f619c6afa10480223bc98f` (`origin/main`) |

The original worktree is one commit behind the refreshed `origin/main`, in addition to its local changes. Comparisons must therefore distinguish committed changes introduced between these commits from uncommitted working-state changes.

## Dirty-state summary

- Tracked status entries: **92**
- Untracked top-level status entries: **51**
- Tracked diff summary: **92 files changed, 2,661 insertions, 4,209 deletions**
- Deleted tracked CI files: `.github/workflows/ci-cd.yml`, `.github/workflows/ci.yml`
- Modified dependency manifests: `package.json`, `package-lock.json`
- Modified generated/cache evidence: `tsconfig.tsbuildinfo`
- No raw patch or full diff was created or uploaded.

## High-level changed areas

| Area | Current working-state evidence | State classification | Phase 1 significance |
|---|---|---|---|
| Environment templates | `.env.example`, `.env.production.example` modified | Current working state only relative to original HEAD; must also compare with refreshed baseline | Variable names and deployment assumptions |
| CI/CD | Two workflows deleted; a release workflow untracked | Current working state only | Baseline validation and release safety |
| Public pages | Homepage, About, Book, Contact, Content, Destinations, FAQ, Flights Results, Packages layout, Policies, Reviews, Services modified | Current working state only | Tour-first alignment and customer journey |
| Administration | Admin layout/dashboard/blog/bookings/packages/payments modified; new admin API folders untracked | Current working state only | Phase 1 package and enquiry administration |
| Customer dashboard | Layout, bookings, profile, quotes, saved packages, wishlist modified | Current working state only | Authentication and request history |
| APIs | Bookings, packages, payments, reviews, newsletter, user, admin, health, revalidation and Stripe webhook routes modified | Current working state only | Persistence, validation, notifications, payment risk |
| Data model | `prisma/schema.prisma`, seed and untracked migrations changed | Current working state only | Material schema/workflow evidence; owner review required |
| Authentication/security | `lib/auth.ts` modified; new middleware and auth helpers untracked | Current working state only | Admin/user authorization boundaries |
| Integrations | Email, SMS, Stripe, Builder.io, Sentry and analytics-related files changed or added | Current working state only | Production connectivity and secret handling |
| UI system | Navigation, footer, trust, hero, package, testimonial and shared UI components modified | Current working state only | Reuse/revise decisions |
| Media/design evidence | Destination/hero SVGs modified; numerous design/live/preview PNGs untracked | Current working state only | Visual comparison; ownership and source review |
| Documentation/artifacts | Entire `docs/` and `.artifacts/` appear untracked at original HEAD | Current working state only | May contain important prior evidence; do not overwrite |

## Files and areas requiring future owner review

1. `.env.example` and `.env.production.example` — inspect variable names only; verify no secret values were introduced.
2. `package.json` and `package-lock.json` — determine intended dependency/script changes before merging any later audit recommendations.
3. `prisma/schema.prisma` and `prisma/migrations/` — establish intended database state and migration ownership.
4. `.github/workflows/*` — reconcile deleted CI workflows and the new release workflow.
5. Payment and webhook routes — confirm whether Stripe paths are intended to remain disabled/deferred for request-based Phase 1.
6. Booking, package, admin, user and readiness APIs — compare current working-state behavior with the refreshed committed baseline.
7. Authentication helpers and `middleware.ts` — verify role boundaries and route protection.
8. Builder.io and Sentry additions — confirm production ownership, configuration and operational intent.
9. Untracked `docs/` — review before any future consolidation to prevent loss of active documentation.
10. Untracked screenshots and design assets — establish provenance, licensing, purpose and retention policy.

## Evidence commands captured

The following read-only commands were run in the original worktree:

```text
git status --short
git status --porcelain=v2
git diff --stat
git diff --name-status
git ls-files --others --exclude-standard
git rev-parse HEAD
git rev-parse origin/main
git branch --show-current
```

The raw console output was not copied into Drive. This inventory records only the minimum metadata needed for traceability and avoids reproducing potentially sensitive implementation content.

## Audit interpretation

**CONFIRMED REPOSITORY FINDING:** The original worktree is not a safe implementation or documentation target. It contains broad, material work across nearly every Phase 1 audit domain.

**CODEX RECOMMENDATION:** Treat `origin/main` at `7392825` as the formal reproducible baseline. Treat the original worktree as a separate, read-only candidate state whose relevant changes are compared at file and behavior level without executing it.

