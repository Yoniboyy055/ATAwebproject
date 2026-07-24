# Migration Proposal and Rollback Plan v0.1

**Status:** Proposed / staging-only unless stated otherwise  
**Baseline:** `b69b512384740658e318c43d5de36aafe43b092d`

Generate an additive migration only after staging approval; inspect SQL; back up; apply to staging; validate indexes and role boundaries. Rollback is application flag-off first, followed by an owner-approved reverse migration only while tables contain no required records. Never apply to production during WP-03.

## Control statement

No production system, customer record, payment, notification, public content, or business-sensitive decision is changed by this document.
