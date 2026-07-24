# Administrative Audit Event Specification v0.1

**Status:** Proposed / staging-only unless stated otherwise  
**Baseline:** `b69b512384740658e318c43d5de36aafe43b092d`

Record actor subject, assigned role, action, entity type/id, previous and new values, timestamp, environment, and relevant request/tour reference. Log access assignment/revocation, content verification/approval, status transitions, manual confirmation, and publication. Never place secrets or unnecessary PII in audit values.

## Control statement

No production system, customer record, payment, notification, public content, or business-sensitive decision is changed by this document.
