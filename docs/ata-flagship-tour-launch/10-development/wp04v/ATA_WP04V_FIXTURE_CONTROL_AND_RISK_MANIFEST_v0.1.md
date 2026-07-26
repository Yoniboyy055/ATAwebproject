# ATA WP-04V fixture, control and risk manifest

## Fixture inventory

- Two fictional working tours with non-commercial statuses only.
- Three fictional customer requests with `ATA-DEMO-*` identifiers.
- Ten summary counts explicitly marked “Demo count”.
- One fictional audit event.
- The authoritative 15-state list imported from tested workflow logic.

Provenance: `WP-04V deterministic demonstration data. Not sourced from Supabase or legacy package records.`

The adapter has no persistence. Reset is therefore a page reload; the deterministic repository returns the original fixtures. No localStorage, cookie, server write or database write is used.

## Control manifest

| Control | Implementation |
|---|---|
| Preview visibility | Banner on every WP-04V screen |
| Supabase isolation | No client, URL, key or write path |
| Legacy fixture isolation | New identifiers, titles and descriptions |
| Price safety | Contact/request placeholders only |
| Date safety | Unpublished/to-be-confirmed states |
| Claim safety | Neutral public copy; internal controls remain dashboard-only |
| Approval separation | Verification, ATA approval and release distinct |
| Confirmation authority | Existing workflow gate retained |
| Production protection | Exact non-production branch preview flag |

## Risk register

| Risk | Status | Treatment |
|---|---|---|
| Actual ATA facts unavailable | Open | Controlled placeholders |
| Media rights incomplete | Open | Existing repository images only; rights review still required |
| Inherited dependency advisories | Open, high | Separate controlled upgrade package |
| Legacy admin architecture divergence | Open | Preserved; later migration behind adapter |
| Preview protection depends on Vercel settings | Verify after deploy | Do not advertise URL until protection is confirmed |
| Existing Builder/database warnings | Inherited | Documented; not required by isolated preview routes |

