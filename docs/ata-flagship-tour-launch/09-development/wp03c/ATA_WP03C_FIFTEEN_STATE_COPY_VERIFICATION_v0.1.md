# Fifteen-State Copy Verification v0.1

**Baseline:** `1699cab1ef05fa7f1d68175b40740719e3444fc3`  
**Claude source:** `ea65b7a5472d143b6a5ab6521cf9e2a26167ed37` (`9d908f70e1e42791814e115765da316623f8aa44`)  
**Scope:** non-production, feature-flagged, test-only

| State | Exposure | Customer rule |
|---|---|---|
| DRAFT | Internal | No customer copy |
| SUBMITTED | External | Exact not-confirmed warning required |
| UNDER_REVIEW | External | Exact not-confirmed warning required |
| MORE_INFORMATION_REQUIRED | External | Exact not-confirmed warning required |
| QUALIFIED | Internal | No customer copy |
| QUOTE_PREPARATION | External | Exact not-confirmed warning required |
| QUOTE_SENT | External | Exact not-confirmed warning required |
| CUSTOMER_RESPONSE_PENDING | External | Exact not-confirmed warning required |
| ACCEPTED_IN_PRINCIPLE | External | Exact not-confirmed warning required |
| PAYMENT_PENDING | External | Exact not-confirmed warning required |
| MANUALLY_CONFIRMED | External | Only confirmation-bearing state |
| DECLINED | External | Exact not-confirmed warning required |
| CANCELLED | External | Exact not-confirmed warning required |
| CLOSED | External | Exact not-confirmed warning required |
| ARCHIVED | Internal | No customer copy |

Allowed transitions remain exclusively in `lib/ata/workflow.ts`; Archived is terminal and manual confirmation remains server-authorized.

## Safety

No production system, infrastructure, customer data, payment, notification, DNS, identity provider, or public content was changed.

