# Owner-Dashboard Field Responsibility Matrix — Claude WP-04 v0.1

**Status:** Owner-facing guidance. Maps onto the existing WP-03D dashboard architecture — **no schema or architecture change is proposed.**
**Baseline:** `7ab88e9`

**Legend — Evidence:** `ATA-STATED` owner statement recorded · `ATA-DOC` supporting document required · `RESEARCH` externally sourced (WP-03) · `PROF` professional review required · `RIGHTS` licence or consent required
**Legend — Publication:** `RELEASABLE` can go live on ATA sign-off · `COND` conditional on a named precondition · `BLOCKED` cannot publish yet
**Legend — Placeholder:** the controlled wording shown while the value is null, per WP-03D placeholder specification.

Roles abbreviated: **O** Owner · **A** Administrator · **CM** Content Manager · **OM** Operations Manager · **YK** Technical Administrator

---

## 1. Tour identity and description

| Field | Business owner | Editor | Approver | Evidence | Publication | Placeholder | Review | YK review? |
|---|---|---|---|---|---|---|---|:--:|
| Tour title | ATA | CM | O/A | ATA-STATED | BLOCKED — flagship not confirmed | Section hidden | 12 mo | No |
| Tour summary | ATA | CM | O/A | ATA-STATED + RESEARCH | COND on title | Section hidden | 12 mo | No |
| Destinations | ATA | CM | O/A | RESEARCH (verified) | **RELEASABLE** | — | 36 mo | No |
| Destination descriptions | ATA | CM | O/A | RESEARCH | Massawa RELEASABLE · Asmara COND on UNESCO check | Section hidden | 36 mo | No |
| Itinerary | ATA | CM | O/A | ATA-DOC per day | BLOCKED — sites unconfirmed | "Final details confirmed directly by ATA" | 12 mo | No |
| Climate / seasonality | ATA | CM | O/A | RESEARCH (FAO) | **RELEASABLE** (facts only) | — | 36 mo | No |
| Operational warnings | ATA | CM | O/A | ATA-STATED + PROF | BLOCKED | Section hidden | 6 mo | Flag only |

## 2. Commercial fields

| Field | Business owner | Editor | Approver | Evidence | Publication | Placeholder | Review | YK review? |
|---|---|---|---|---|---|---|---|:--:|
| Price | **ATA only** | O/A | O/A | ATA-DOC | BLOCKED | "Request current pricing" | 6 mo | No |
| Pricing type | ATA | O/A | O/A | ATA-STATED | BLOCKED | — | 12 mo | No |
| Currency | ATA | O/A | O/A | ATA-STATED | BLOCKED | — | 24 mo | No |
| Dates | ATA | O/A/OM | O/A | ATA-STATED | BLOCKED | "Dates to be confirmed" | 3 mo | No |
| Date status | ATA | OM | O/A | ATA-STATED | BLOCKED | — | 3 mo | No |
| Capacity | ATA | O/A/OM | O/A | ATA-STATED | BLOCKED | Not displayed | 6 mo | No |
| Availability | ATA | OM | O/A | ATA-STATED | BLOCKED | "Contact ATA for availability" | Continuous | No |

**Price publication never implies availability or confirmation** (WP-03D pricing model). These are independent states and must be approved independently.

## 3. Inclusions, suppliers and logistics

| Field | Business owner | Editor | Approver | Evidence | Publication | Placeholder | Review | YK review? |
|---|---|---|---|---|---|---|---|:--:|
| Inclusions | ATA | CM | O/A | ATA-DOC | BLOCKED | Section hidden | 12 mo | No |
| Exclusions | ATA | CM | O/A | ATA-DOC | BLOCKED | Section hidden | 12 mo | No |
| Accommodation | ATA | O/A/OM | O/A | ATA-DOC (supplier) | BLOCKED | Section hidden | 12 mo | No |
| Transportation | ATA | O/A/OM | O/A | ATA-DOC (supplier) | BLOCKED | Section hidden | 12 mo | No |

Exclusions deserve as much care as inclusions. What a traveller is *not* getting is where disputes originate.

## 4. Policies and payment

| Field | Business owner | Editor | Approver | Evidence | Publication | Placeholder | Review | YK review? |
|---|---|---|---|---|---|---|---|:--:|
| Cancellation policy | ATA | O/A | O/A + **PROF** | ATA-STATED + PROF | BLOCKED | Section hidden | 12 mo | Flag only |
| Refund policy | ATA | O/A | O/A + **PROF** | ATA-STATED + PROF | BLOCKED | Section hidden | 12 mo | Flag only |
| Payment information | ATA | O/A | O/A + **PROF** | ATA-STATED | BLOCKED | "No payment is taken through this website" | 12 mo | **Yes** |

Payment information is the one field where YK Systems technical review **is** required — the wording must remain consistent with `livePayments` being disabled. If copy ever implies online payment while the flag is false, the site is lying to customers.

## 5. Identity, contact and media

| Field | Business owner | Editor | Approver | Evidence | Publication | Placeholder | Review | YK review? |
|---|---|---|---|---|---|---|---|:--:|
| Contact details | ATA | O/A | O/A | ATA-DOC (verified) | BLOCKED | Section hidden | 6 mo | No |
| Images | ATA | CM | O/A | **RIGHTS** | BLOCKED | Neutral placeholder | 12 mo | No |
| Media rights | ATA | O/A | O/A | **RIGHTS** (licence/consent) | BLOCKED | — | 12 mo | Flag only |

No image publishes without its rights record. An unlicensed photograph is a legal exposure, not a design detail.

## 6. Customer-facing request language

| Field | Business owner | Editor | Approver | Evidence | Publication | Placeholder | Review | YK review? |
|---|---|---|---|---|---|---|---|:--:|
| Booking-request instructions | ATA | CM | O/A | ATA-STATED | COND | Controlled default | 12 mo | **Yes** |
| Quote language | ATA | CM | O/A | ATA-STATED | COND | Controlled default | 12 mo | **Yes** |
| Confirmation language | **ATA only** | O/A | O/A | ATA-STATED | COND | Controlled default | 12 mo | **Yes** |

All three require YK technical review because they are constrained by the implemented content contract (`lib/ata/content-contract.ts`). The per-state customer wording and the prohibited-phrase list are enforced in code; owner edits must stay inside those rails. **Confirmation language is the highest-risk copy in the product** — it is the only place the site can imply something is secured.

## 7. Rules that apply to every field

1. **Null is a valid, honest state.** Store null plus an explicit status. Never enter placeholder data into a value field to make a page look finished.
2. **Editing creates a new version.** The public site reads only the released version, so drafting is always safe.
3. **Four conditions, then a fifth.** A value renders only with a non-null value, a public-intent flag, an approved-for-publication state — and then a separate release action.
4. **Approval is per-field.** Approving a summary does not approve a price.
5. **Every field carries a review date.** Condition, access, permits and prices decay fastest.
6. **Prohibited phrases are blocked globally:** "book now", "secure your spot", "pay now", "guaranteed seat", "booking confirmed", "reservation confirmed".

## 8. What is releasable today

Four fields could go live on ATA wording sign-off alone, with no outstanding research or policy dependency:

- **Destinations** (verified)
- **Massawa destination description** (architecture and history layer)
- **Climate / seasonality** (FAO-sourced facts, both places named separately)
- **The 2,300 m descent** within the tour summary

Everything else is waiting on an ATA fact, a professional review, or the single UNESCO source check.
