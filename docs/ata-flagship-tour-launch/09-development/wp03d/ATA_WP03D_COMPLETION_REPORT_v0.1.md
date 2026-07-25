# ATA WP-03D Completion Report v0.1

**Audit date:** 2026-07-25  
**Baseline:** `470213b541f464ff1abe3278e2b5d374f696c4e2`  
**Branch:** `codex/ata-wp03d-supabase-staging-audit`  
**Project:** `amanuel-travel` (`ldvnzevwsfpcsilkegck`)  
**Method:** authenticated Supabase MCP metadata and `SELECT`-only SQL.

## Outcome

The project is `ACTIVE_HEALTHY` in `ca-central-1`, on the organization Free plan, with PostgreSQL 17.6. One `init` migration and fourteen legacy tables are present. Thirteen are empty; `public.packages` contains four legacy rows, all with non-null prices. Raw values were not copied.

All fourteen tables have RLS disabled, no policies, and full `anon`/`authenticated` privileges. Advisors independently flag exposed password/token columns. None of the proposed `Ata*` models is live.

Recommend controlled replacement after encrypted backup and restore testing. Quarantine the four packages for owner review; replace legacy auth/payment/booking/package structures; implement invitation-only identity and verified, versioned ATA models.

No Supabase, production, deployment, DNS, Stripe, notification, or customer-data change was made. Proposed SQL is documentation-only.

All 25 final Markdown artifacts were uploaded to and verified in `ATA Flagship Tour Launch / 02 Discovery`.
