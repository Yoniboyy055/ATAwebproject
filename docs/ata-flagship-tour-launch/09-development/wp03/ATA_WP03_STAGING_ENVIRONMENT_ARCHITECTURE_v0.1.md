# Staging Environment Architecture v0.1

**Status:** Proposed / staging-only unless stated otherwise  
**Baseline:** `b69b512384740658e318c43d5de36aafe43b092d`

Separate preview deployment, database, OIDC application, environment variables, and test integrations. No production keys or data. Feature flags default off. Temporary technical default: local/test execution only until ATA/YK assigns ownership.

## Control statement

No production system, customer record, payment, notification, public content, or business-sensitive decision is changed by this document.
