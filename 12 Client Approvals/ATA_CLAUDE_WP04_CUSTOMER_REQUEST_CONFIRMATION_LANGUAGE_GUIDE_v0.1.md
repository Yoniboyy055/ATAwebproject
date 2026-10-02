# Customer Request and Confirmation Language Guide — Claude WP-04 v0.1

**Status:** Owner-facing guide to the customer wording already implemented in `lib/ata/content-contract.ts`.
**Constraint:** this wording is **enforced in code**. ATA may refine tone; ATA may not remove the safety qualifier.

---

## 1. The single most important rule

> **Only ATA can confirm. The website never confirms anything.**

Every customer-facing status message except the final one carries the qualifier:

> *"This is not a confirmed booking, reservation, seat, price, or payment."*

That sentence is the difference between an enquiry system and an accidental booking engine. It stays.

## 2. The five request types

| Type | What the customer is asking for |
|---|---|
| `INFORMATION` | Tell me more |
| `CONSULTATION` | I'd like to discuss this |
| `QUOTE` | What would this cost for my group? |
| `BOOKING_REQUEST` | I want to travel — please arrange it |
| `PROVISIONAL_RESERVATION` | Can you hold something for me? |

⚠️ Even `PROVISIONAL_RESERVATION` **holds nothing** until a person at ATA acts. The name describes the customer's intent, not a system guarantee. If ATA offers provisional holds, that is a real operational commitment ATA must define — the website cannot create it.

## 3. The fifteen states and what the customer is told

| State | Customer sees | Visible? |
|---|---|:--:|
| Draft | — | Internal |
| Submitted | "Your request has been received. *[qualifier]* A person at ATA will review it and reply on your chosen channel." | ✅ |
| Under review | "ATA is reviewing your request. *[qualifier]* A person at ATA will contact you." | ✅ |
| More information required | "ATA needs more information to continue. *[qualifier]* Please reply on your chosen channel." | ✅ |
| Qualified | — | Internal |
| Quote preparation | "ATA is preparing your personal quote. *[qualifier]*" | ✅ |
| Quote sent | "ATA has sent your personal quote. *[qualifier]* Review it and reply directly to ATA." | ✅ |
| Customer response pending | "ATA is waiting for your reply. *[qualifier]*" | ✅ |
| Accepted in principle | "You and ATA have agreed in principle. *[qualifier]* ATA will confirm final details with you directly." | ✅ |
| Payment pending | "ATA will arrange any payment details with you directly. **No payment is taken through this website.** *[qualifier]*" | ✅ |
| **Manually confirmed** | **"ATA has confirmed your booking personally. Your confirmation details come directly from ATA."** | ✅ |
| Declined | "ATA was unable to proceed with your request. *[qualifier]* You may send a new request or contact ATA directly." | ✅ |
| Cancelled | "Your request was cancelled. *[qualifier]*" | ✅ |
| Closed | "Your request is closed. *[qualifier]* You may submit a new request at any time." | ✅ |
| Archived | — | Internal |

## 4. Manually confirmed — the one state that carries weight

**This is the only confirmation-bearing state in the entire system**, and the only message without the qualifier — because here something genuinely *is* confirmed.

Three properties:

1. Only `ATA_OWNER` and `ATA_ADMINISTRATOR` may set it. Not the Operations Manager. Not YK Systems.
2. It requires explicit server-side authorisation — it cannot be reached by an ordinary state change.
3. The wording deliberately says confirmation "comes directly from ATA" — the site reports that ATA confirmed; it does not confirm on ATA's behalf.

**Before anyone sets this state, ATA must actually have confirmed it** with the customer, and have whatever the customer needs. Setting it as a workflow convenience would make the site lie.

## 5. Accepted in principle vs manually confirmed

The distinction most likely to be blurred in daily use:

| | Accepted in principle | Manually confirmed |
|---|---|---|
| Means | We've agreed the shape of it | It is booked |
| Carries qualifier | Yes | No |
| Who may set | Owner / Administrator | Owner / Administrator only |
| Customer should expect | Further contact to finalise | Confirmation details from ATA |

Use "accepted in principle" generously — it is honest and keeps momentum. Use "manually confirmed" only when it is true.

## 6. Payment pending — why it reads oddly, and why that is right

"Payment pending" does **not** mean the website is waiting for a payment. Payments are disabled. It means ATA and the customer are arranging payment **outside** the website.

The message says so explicitly. Do not soften this into anything that implies an online payment step exists.

## 7. Prohibited phrases — blocked in code

"book now" · "secure your spot" · "pay now" · "guaranteed seat" · "booking confirmed" · "reservation confirmed"

These are rejected by the content contract. Beyond the literal strings, avoid the whole class: anything implying the site secures, reserves, holds or charges.

## 8. Booking-request instructions — ATA to complete

| # | Field | ATA value |
|---|---|---|
| L-01 | What the customer should include in a request | ☐ |
| L-02 | Which channels you will reply on | ☐ |
| L-03 | **Your response commitment** (e.g. "within two working days") | ☐ |
| L-04 | Who replies, by role | ☐ |
| L-05 | What happens outside working hours | ☐ |

**L-03 is the main promise the site makes.** Before publishing it, be sure it is one you will keep every time — a missed response window damages trust more than not stating one.

## 9. Quote language — ATA to complete

| # | Field | ATA value |
|---|---|---|
| L-06 | How long a quote stays valid | ☐ |
| L-07 | What could change it | ☐ |
| L-08 | Whether a quote holds a place | ☐ — **recommended answer: no** |
| L-09 | How a customer accepts a quote | ☐ |

## 10. Confirmation language — ATA to complete

| # | Field | ATA value |
|---|---|---|
| L-10 | What a confirmed customer receives from ATA | ☐ |
| L-11 | Who at ATA issues it | ☐ |
| L-12 | Timescale from agreement to confirmation | ☐ |
| L-13 | What confirmation includes and excludes | ☐ |

## 11. Tone

The register that fits: **warm, direct, unhurried, second person, honesty-forward.** No scarcity, no urgency, no superlatives.

For a diaspora audience deciding whether to trust a small operator with a journey home, "a person at ATA will reply" is a stronger promise than any amount of polish — provided it is true.

## 12. Sign-off

| Step | Who | Date | Done |
|---|---|---|---|
| L-01–L-13 completed | ATA | | ☐ |
| Response commitment agreed and staffable | ATA Owner | | ☐ |
| Confirmation authority named | ATA Owner | | ☐ |
| Wording reviewed against the code contract | YK Systems | | ☐ |
| Approved | ATA Owner / Administrator | | ☐ |
| **Released** (separate act) | ATA Owner / Administrator | | ☐ |
