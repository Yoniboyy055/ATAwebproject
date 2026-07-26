# Publication-Release Checklist — Claude WP-04 v0.1

**Status:** Gate. **Every item must pass. A single failure blocks publication of that field.**
**Scope:** applies per field, not per page. Approving a summary does not approve a price.

---

## 1. How to use this

Run the checklist against **one field at a time**. Twelve checks, in order. Any "no" stops the release — you do not proceed and revisit later, you stop.

The order matters: the cheap checks come first so you do not spend a professional review on a field that has no evidence attached.

## 2. The twelve gates

| # | Gate | Question | Pass |
|---|---|---|:--:|
| 1 | **Value provided** | Is there a real, non-null value? Not a placeholder typed into the value field, not "TBC", not a guess | ☐ |
| 2 | **Evidence attached** | Is the supporting evidence recorded and retrievable — document, source URL, or owner statement? | ☐ |
| 3 | **Source verified** | Has the evidence been checked by someone other than whoever entered it? | ☐ |
| 4 | **Business owner identified** | Is it recorded who at ATA owns this fact? | ☐ |
| 5 | **Review complete** | Has the required review happened — editorial, and professional where flagged? | ☐ |
| 6 | **ATA approval complete** | Has an ATA Owner or Administrator approved it, by name and date? | ☐ |
| 7 | **Publication-release authority** | Is the release being performed by someone holding release authority — **as a separate act from approval**? | ☐ |
| 8 | **Media rights complete** | If any image or media is involved: licence held, consent held for identifiable people? | ☐ |
| 9 | **Expiry or review date set** | Is there a date by which this must be re-checked? | ☐ |
| 10 | **Prohibited-language check passed** | Does it avoid every prohibited phrase and claim class? See §3 | ☐ |
| 11 | **Customer confirmation wording passed** | Does nothing imply a booking, seat, reservation, price or payment is secured? | ☐ |
| 12 | **Placeholder behaviour tested** | With the value removed, does the page degrade to approved placeholder wording — not to a broken or empty state? | ☐ |

## 3. Gate 10 — prohibited-language check

**Blocked in code** (`PROHIBITED_PUBLIC_PHRASES`):

"book now" · "secure your spot" · "pay now" · "guaranteed seat" · "booking confirmed" · "reservation confirmed"

**Blocked by the WP-03 claims register — check manually:**

| Class | Examples |
|---|---|
| UNESCO misuse | "UNESCO-approved", "UNESCO-endorsed", per-building "UNESCO-listed", "all of Asmara", "UNESCO-certified guides", any emblem |
| Unverifiable comparatives | "best-preserved in Africa", "world's finest", "most spectacular" — **asserted in ATA's voice**. Attribution to a named source is permitted |
| Promotional adjectives as fact | "pristine", "untouched", "undiscovered", "hidden gem" |
| Colonial-nostalgic framing | "Little Rome", "a slice of Italy in Africa" |
| Single-season claims | Any one "best time to visit" for the whole tour |
| Blanket suitability | "All Ages Welcome", "easy" for the escarpment day |
| Unsupported assurances | "safe swimming", "smooth roads", "safe drive" |
| Health or medical advice | Anything beyond a neutral, professionally reviewed note |
| Legacy prices | 299 / 599 / 899 / 1499 |
| Non-operational attractions | "Ride the historic cableway" — it was dismantled |
| Journey duration | Any specific figure not supplied by ATA |
| Editorial markers | `[ACR]` `[ODR]` `[RR]` `[VSR]` `[PNP]`, `M-nn` references, `SRC-`, "TODO" — detected by `hasEditorialMarker()` |

## 4. Gate 12 — how to actually test placeholder behaviour

This gate is skipped most often and matters most, because it is the only one that tests what customers see when something is *missing* — which is the normal state of this site right now.

1. Set the field to null in staging.
2. Load the public page.
3. Confirm the approved wording appears: "Request current pricing" · "Dates to be confirmed" · "Contact ATA for availability" · "Final details confirmed directly by ATA".
4. Confirm no empty element, no `null`, no `undefined`, no zero, no stray currency symbol.
5. Confirm the placeholder does not imply a secured seat, reservation, payment, itinerary, price or booking.
6. Restore the value.

## 5. Escalation — when a gate fails

| Failed gate | Action |
|---|---|
| 1–2 | Return to the Content Manager. Do not approve |
| 3 | Obtain independent verification |
| 4 | Assign a business owner before proceeding |
| 5 | Route to professional review. **Do not substitute internal judgement for legal, medical or safety review** |
| 6–7 | Stop. Only ATA Owner or Administrator may approve and release |
| 8 | Remove the media until rights are documented |
| 9 | Set a review date. Condition, access, permits and prices decay fastest |
| 10–11 | Rewrite. Re-run from gate 5 |
| 12 | Raise with YK Systems as a technical defect |

## 6. Release record

| Field | Value |
|---|---|
| Field released | |
| Version released | |
| Value | |
| Evidence reference | |
| Business owner | |
| Approved by / date | |
| **Released by / date** | |
| Review due | |
| All twelve gates passed | ☐ |

Editing creates a new version; the public site reads only the released one. A release record is therefore a permanent statement about a specific immutable version — not about "the field".

## 7. Suspension and rollback

Any ATA Owner or Administrator may **suspend** a released field immediately, without a review cycle, if it is found to be wrong. Suspension reverts the public surface to placeholder behaviour.

Suspend first, investigate second. A wrong published fact is a live customer-facing risk; the audit trail preserves what happened, so there is nothing to lose by acting quickly.
