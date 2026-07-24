# Request Status Transition Matrix v0.1

**Status:** Proposed / staging-only unless stated otherwise  
**Baseline:** `b69b512384740658e318c43d5de36aafe43b092d`

Transitions are encoded in lib/ata/workflow.ts. Invalid jumps fail. Manual confirmation requires explicit server authorization. Closed records may archive; archived records are terminal. Customer messaging for every pre-confirmation state explicitly says the request is not confirmed.

## Control statement

No production system, customer record, payment, notification, public content, or business-sensitive decision is changed by this document.
