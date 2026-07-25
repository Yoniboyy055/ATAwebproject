# Staging Database Model v0.1

**Status:** Proposed / staging-only unless stated otherwise  
**Baseline:** `b69b512384740658e318c43d5de36aafe43b092d`

Additive models: AtaAdminMembership, AtaBusinessFact, AtaTour, AtaRequest, AtaAuditEvent. Unknown values are nullable or explicitly UNVERIFIED. Tour publication, approval, verification, and availability are separate. Requests store assignment, follow-up, missing information, manual confirmation authority, closure, and environment.

## Control statement

No production system, customer record, payment, notification, public content, or business-sensitive decision is changed by this document.
