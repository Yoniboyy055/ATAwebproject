# ATA WP-04V test, accessibility and browser report

## Automated checks

| Check | Result |
|---|---|
| `npm ci` | Passed; lockfile unchanged |
| TypeScript | Passed |
| ESLint | Passed with two inherited warnings |
| Jest | 16 suites, 98 tests passed |
| Copy and prohibited language | Passed in test suite |
| Feature flags and route exposure | Passed in test suite |
| Workflow and confirmation controls | Passed in test suite |
| Image variants and blur placeholders | Passed |
| Production build | Passed; 46 static pages generated |

Inherited warnings: `app/layout.tsx` custom-font loading, `components/GoogleAnalytics.tsx` hook dependency, stale Browserslist data, absent local Builder key and database URL for legacy routes.

## Browser matrix

Browser verification used the running preview with test-only flags and no database URL.

| Surface | Viewport | Result |
|---|---:|---|
| Homepage | 1440 × 1000 | Pass; no overflow, images loaded, no console warnings/errors |
| Flagship | 1440 × 1000 | Pass; no overflow, no legacy prices, preview label visible |
| Owner dashboard | 1440 × 1000 | Pass; 15 states and confirmation restriction visible |
| Review guide | 1366 × 768 | Pass; nine review links, no overflow |
| Homepage/menu | 390 × 844 | Pass; menu opens, no overflow |
| Flagship/sticky action | 390 × 844 | Pass; sticky request action present |
| Owner dashboard | 390 × 844 | Pass; no page overflow, table has local horizontal alternative |
| Request form | 430 × 932 | Pass; labelled controls and confirmation wording present |

Console inspection found no errors or warnings on verified WP-04V routes. Images reported complete with non-zero natural width. No failed application request was observed during navigation.

## Accessibility

Semantic headings, navigation landmarks, labelled form controls, visible focus outlines, keyboard-operable links/buttons and sufficient contrast are present. The mobile menu exposes `aria-expanded` and a controlled target. Content remains readable without hover. Disabled publication actions are visibly disabled and accompanied by explanatory text.

Keyboard checks covered menu, links and form controls through semantic element inspection and existing form behavior. No modal or focus trap was introduced.

## Safety verification

No Supabase library or request appears in the WP-04V implementation. No database URL was configured during verification. The preview adapter is deterministic and read-only. Network activity was limited to localhost page and image requests. No production URL, DNS, database, payment, email, SMS or invitation action was called.

## Dependency audit

`npm audit` reports 22 inherited vulnerabilities: 1 low, 4 moderate, 15 high and 2 critical. No dependency was added or upgraded in WP-04V. Automatic fixes were not applied because several recommended paths include breaking framework upgrades. This remains a separate remediation package and a release risk.

