# ATA Administrative Role and Authority Matrix — Claude WP-04 v0.1

**Status:** Owner-facing. Mirrors the roles implemented in `lib/ata/authorization.ts` at baseline `7ab88e9` — this document does not invent roles or permissions.
**Access model:** invitation-only (approved decision G-03). Every role is granted by invitation and is revocable.

---

## 1. The six roles

| Role | Code identifier | In plain terms |
|---|---|---|
| ATA Owner | `ATA_OWNER` | The business decision-maker. Final authority on facts, prices, policies, confirmation and publication |
| ATA Administrator | `ATA_ADMINISTRATOR` | Trusted senior ATA staff with the same operational authority as the Owner |
| ATA Content Manager | `ATA_CONTENT_MANAGER` | Writes and edits content. **Cannot approve or publish it** |
| ATA Operations Manager | `ATA_OPERATIONS_MANAGER` | Handles customer requests day to day. **Cannot confirm a booking** |
| YK Systems Technical Administrator | `YK_TECHNICAL_ADMINISTRATOR` | Runs the platform. **Cannot approve ATA business facts** |
| Read-only Auditor | `READ_ONLY_AUDITOR` | Can see everything, change nothing |

## 2. Authority matrix

✅ permitted · ❌ not permitted

| Action | ATA Owner | ATA Admin | Content Mgr | Operations Mgr | YK Technical | Auditor |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| Enter content | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Edit content | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Verify evidence | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Approve business facts** | ✅ | ✅ | ❌ | ❌ | **❌** | ❌ |
| **Release content publicly** | ✅ | ✅ | ❌ | ❌ | **❌** | ❌ |
| Read customer requests | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Manage customer requests | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Confirm a customer request** | ✅ | ✅ | ❌ | **❌** | **❌** | ❌ |
| Suspend content | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Archive content | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage users and invitations | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Change technical configuration | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Read audit trail | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |

Mapped to implemented permissions: `content:read`, `content:edit`, `content:approve`, `request:read`, `request:manage`, `request:confirm`, `access:manage`, `technical:manage`, `audit:read`.

## 3. The three boundaries that matter most

**YK Systems cannot approve your business facts.** `YK_TECHNICAL_ADMINISTRATOR` holds `technical:manage` and `audit:read` — it does **not** hold `content:approve`. This is enforced in software, not merely stated in a contract. We can build the field; we cannot fill it and certify it.

**Only ATA can confirm a customer.** `request:confirm` belongs to `ATA_OWNER` and `ATA_ADMINISTRATOR` alone. Notably the **Operations Manager cannot confirm** — they can move a request through every other state and prepare everything, but the moment of telling a customer "you are confirmed" stays with ATA's decision-makers. Manual confirmation is the only confirmation-bearing state in the workflow.

**Writing is not approving.** The Content Manager can draft all day and publish nothing. This is the control that stops good prose becoming an unverified public claim.

## 4. Suggested separation of duties

The matrix permits Owner and Administrator to do everything, but good practice separates the steps:

| Step | Suggested holder | Why |
|---|---|---|
| Enter / edit | Content Manager | Keeps drafting away from approval |
| Verify evidence | Administrator | Someone other than the author checks the support |
| Approve the fact | Owner or Administrator | Business accountability |
| Release publicly | **A different person from the approver, where staffing allows** | Two-person control on the final public step |

Where ATA is small and one person must hold several roles, that is workable — but the audit trail should show the same name at each step rather than obscuring it. A visible single point of authority is safer than a fake separation.

## 5. Named holders — to be completed by ATA

| Role | Named person | Email | Granted | Reviewed |
|---|---|---|---|---|
| ATA Owner | ☐ | ☐ | ☐ | ☐ |
| ATA Administrator | ☐ | ☐ | ☐ | ☐ |
| ATA Content Manager | ☐ | ☐ | ☐ | ☐ |
| ATA Operations Manager | ☐ | ☐ | ☐ | ☐ |
| YK Technical Administrator | ☐ | ☐ | ☐ | ☐ |
| Read-only Auditor | ☐ (optional) | ☐ | ☐ | ☐ |

Also required from ATA per the WP-03D transfer plan: named owners for **billing, backup, recovery, incident response, privacy/data control and deletion authority**. These are not covered by the six application roles and are currently unassigned.

## 6. Access review

| Control | Recommendation |
|---|---|
| Review cadence | Every 6 months, and immediately when anyone leaves ATA |
| Departure | Revoke on the same day |
| Shared logins | Prohibited — the audit trail depends on identity being individual |
| Elevation | Temporary, recorded, and reversed when finished |
| Auditor role | Recommended for any external review or dispute |

## 7. Open items for Codex

**PRELIMINARY CLAUDE OBSERVATION.** `canPublishTour()` currently resolves to `content:approve`, so **approve and release share one permission**. The WP-03D architecture describes them as separate steps with separate `approver` and `releaser` fields. This document treats them as two acts because the owner process requires it; whether that separation should be enforced by a distinct permission is Codex's call. Recorded so it is not lost.
