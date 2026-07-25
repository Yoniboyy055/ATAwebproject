# Legacy Route Disposition Register v0.1

**Status:** Proposed / staging-only unless stated otherwise  
**Baseline:** `b69b512384740658e318c43d5de36aafe43b092d`

Keep /admin, /dashboard, /auth/register, /book, /packages, /flights, /reviews and associated legacy APIs hidden by middleware and hard guards. Rewrite useful concepts through reviewed commits. Delete only after owner approval and replacement verification.

## Control statement

No production system, customer record, payment, notification, public content, or business-sensitive decision is changed by this document.
