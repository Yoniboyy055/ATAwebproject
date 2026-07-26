# Placeholder and Hidden-Content Guide — Claude WP-04 v0.1

**Status:** Owner-facing explanation of a control that is easy to mistake for a bug.
**Aligns with:** WP-03D placeholder behaviour specification.

---

## 1. The core idea

> **Missing information is stored as null plus an explicit status. Never as fake data.**

When your site shows "Request current pricing" instead of a number, that is the system **working**. It is refusing to invent a price. The alternative — a placeholder number, a zero, a "£0.00", a made-up date — is how travel websites end up making commitments nobody authorised.

## 2. Approved placeholder wording

These four are pre-approved and may be used without further sign-off:

| Missing value | Approved wording |
|---|---|
| Price | **"Request current pricing"** |
| Dates | **"Dates to be confirmed"** |
| Availability | **"Contact ATA for availability"** |
| Final details | **"Final details confirmed directly by ATA"** |

Also approved for pricing specifically: "Contact ATA for current pricing" · "Price to be confirmed directly by ATA".

## 3. Placeholder versus hidden — when each applies

Two different behaviours, chosen by what the absence means to a customer.

| Behaviour | Use when | Customer experience |
|---|---|---|
| **Placeholder** | The customer expects the information and its absence needs explaining | Sees controlled wording and knows what to do next |
| **Hidden** | Showing the field's absence would confuse or invite a wrong inference | The section is simply not there |

| Field | Behaviour | Why |
|---|---|---|
| Price | Placeholder | Everyone looks for it; silence looks evasive |
| Dates | Placeholder | Same |
| Availability | Placeholder | Same |
| Itinerary day detail | Hidden per line | A half-empty day list implies the day is empty |
| Accommodation | Hidden | An empty field invites "so where do I sleep?" |
| Inclusions / exclusions | Hidden | A partial list is worse than none — it implies the missing items are excluded |
| Cancellation / refund policy | Hidden | A partial policy is a legal exposure |
| Images | Neutral placeholder | Layout must not collapse |
| Capacity | Hidden | Not something a customer needs before enquiring |
| Operational warnings | Hidden | A partial warning is a false reassurance |

**The rule behind the rule:** use a placeholder when absence is *informative*; hide when absence would be *misleading*.

## 4. What a placeholder must never do

| Never | Why |
|---|---|
| Imply a secured seat, reservation or booking | The site holds nothing. Only ATA confirms |
| Imply a price exists but is hidden | "Special price — enquire" suggests a number you have not set |
| Imply payment is possible | Payments are disabled |
| Imply an itinerary is fixed | Days are unconfirmed |
| Show `0`, `null`, `undefined`, `NaN`, `—`, or a bare currency symbol | A leaked technical state, not a message |
| Use urgency or scarcity | No live inventory exists to justify it |
| Look like an error | Placeholder text should read as intentional |

## 5. Production behaviour

Production **hides unverifiable sections** unless controlled wording has been approved for them. This is deliberately stricter than staging.

The practical consequence: a section can be visible in staging while you work on it, and invisible in production until it is genuinely ready. You will see more on staging than the public sees. That gap is the safety margin, not an inconsistency.

## 6. Why the site currently looks sparse

Almost every commercial field is null, because almost every commercial fact is still with you. So the flagship page today shows:

- Verified geography and heritage content
- Honest destination descriptions
- Two-climate seasonal information
- "Request current pricing"
- "Dates to be confirmed"
- An invitation to send a request, answered by a person

**That is a coherent, honest page** — not a broken one. Adding invented content would make it look more finished and make it worse.

## 7. The "verification ledger" idea

The flagship preview includes a line explaining the gaps to customers directly:

> "Some details are still being verified with ATA. We show only what is approved; when something is missing, that is a control, not an error."

This is worth considering for the public site too. For an operator with no reviews and no long track record, visibly refusing to overclaim is a trust signal rather than a weakness. Research concluded candour is ATA's strongest available asset — this is one place it becomes concrete.

**ATA decision:** ☐ Include a verification note publicly · ☐ Keep it internal only

## 8. Testing checklist for each field

| # | Test | Pass |
|---|---|:--:|
| 1 | Set the value to null in staging | ☐ |
| 2 | Approved wording appears, correctly spelled | ☐ |
| 3 | No technical artefact leaks (`null`, `0`, bare symbol) | ☐ |
| 4 | Layout does not collapse or overflow | ☐ |
| 5 | Nothing implies a secured booking, price or payment | ☐ |
| 6 | Behaviour is correct on mobile as well as desktop | ☐ |
| 7 | Hidden sections leave no empty heading behind | ☐ |
| 8 | Restore the value and confirm normal rendering returns | ☐ |

Gate 12 of the publication checklist requires this test. It is the one that catches problems customers would actually see.
