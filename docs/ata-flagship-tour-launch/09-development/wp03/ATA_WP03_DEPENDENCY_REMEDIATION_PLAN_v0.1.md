# Dependency Remediation Plan v0.1

**Status:** Proposed / staging-only unless stated otherwise  
**Baseline:** `b69b512384740658e318c43d5de36aafe43b092d`

Prioritize direct production-exposed critical/high issues, then exploitable transitive issues, then development tooling. Use isolated branches, pinned changes, lockfile review, full tests/build, and rollback commits. Major upgrades require separate approval.

## Control statement

No production system, customer record, payment, notification, public content, or business-sensitive decision is changed by this document.
