# ATA Baseline Validation Report v0.1

**State tested:** clean `origin/main` commit `739282567abffe7618f619c6afa10480223bc98f`  
**Location:** `C:\Users\yonib\ATAwebproject-wp01-audit`  
**Database migrations:** not run  
**Production-connected submissions:** none

| Command | Result | Exit | Duration | Notes / Phase 1 impact |
|---|---|---:|---:|---|
| `git fetch origin --prune` | PASS | 0 | 4.5 s | Refreshed baseline safely |
| `git worktree add -b codex/ata-wp01-repository-audit ... origin/main` | PASS | 0 | 5 s | Original worktree untouched |
| `npm ci` | PASS | 0 | 271 s | 999 packages; Prisma generated; 22 vulnerabilities (1 low, 4 moderate, 15 high, 2 critical); deprecated packages |
| `npm run lint` | PASS with warnings | 0 | 47.5 s | Custom font warning; GA effect dependency warning |
| `npm run type-check` | PASS | 0 | 28.7 s | No TypeScript errors |
| `npm test -- --runInBand` | PASS | 0 | 23 s tool / 12.785 s Jest | 8 suites, 62 tests |
| `npm run build` | PASS with warnings | 0 | 120 s | 43 static pages; DB/Builder unavailable; metadata/font/GA warnings; homepage 248 kB |

An initial sandboxed lint attempt exited 1 because `.next/cache/eslint` could not be created outside the original workspace permission root. It was rerun with authorized write access in the clean audit worktree and passed. This was an audit-environment permission failure, not a repository lint failure.

## Not run

| Command | Reason |
|---|---|
| `npm run test:e2e` | Playwright dependency/config is not established by the locked baseline; no stable deployed/local test target; browser actions could reach live integrations |
| Database integration against PostgreSQL | No approved test database credentials; `DATABASE_URL` absent |
| Migrations/seed | Explicitly prohibited |
| Form/payment/email/SMS live tests | Explicitly prohibited |
| Lighthouse | Public domain failed DNS; local runtime performance measurement would require a controlled server/browser setup |
| `npm audit fix` | Would alter dependencies/lockfile and is outside WP-01 |

## Baseline interpretation

The code compiles and its unit/integration-style Jest suite passes, but that does not establish production readiness. Credential-free build behavior hides data/integration failures, test coverage does not prove the customer request flow, and dependency/security findings require deliberate remediation.

