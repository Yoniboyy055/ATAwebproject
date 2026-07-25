# Manual Confirmation Control Specification v0.1

**Status:** Proposed / staging-only unless stated otherwise  
**Baseline:** `b69b512384740658e318c43d5de36aafe43b092d`

Only ATA Owner or ATA Administrator may manually confirm. YK technical access cannot confirm. Required controls: current trusted identity, assigned role, valid prior state, audit event, timestamp, and confirmation authority ID. Payment alone never confirms a booking.

## Control statement

No production system, customer record, payment, notification, public content, or business-sensitive decision is changed by this document.
