# Identity Provider Recommendation v0.1

**Status:** Proposed / staging-only unless stated otherwise  
**Baseline:** `b69b512384740658e318c43d5de36aafe43b092d`

Recommend invitation-only OIDC through the organization-controlled provider selected by ATA/YK. Disable credentials and public registration. Bind roles in server-side membership records using provider subject plus environment. Benefits: revocation, MFA policy, auditable identity. Risk: provider ownership is unresolved. Temporary default: trusted-session adapter in test/staging only.

## Control statement

No production system, customer record, payment, notification, public content, or business-sensitive decision is changed by this document.
