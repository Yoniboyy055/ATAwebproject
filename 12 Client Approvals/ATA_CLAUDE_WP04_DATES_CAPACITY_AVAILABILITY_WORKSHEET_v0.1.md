# Dates, Capacity and Availability Worksheet — Claude WP-04 v0.1

**Status:** Blank worksheet for ATA. **No date, capacity or availability figure is inferred or invented here.**

---

## 1. Why these three are separate

They are commonly confused, and confusing them is how a customer ends up believing they have a seat.

| Concept | Question it answers | Publishing it means |
|---|---|---|
| **Dates** | When does a departure exist? | A departure is planned |
| **Capacity** | How many people can it take? | An operational limit exists |
| **Availability** | Can this person join it? | Space may exist — **still not a reservation** |

**None of the three is a confirmation.** Only ATA's manual confirmation confirms anything.

## 2. Departure worksheet — repeat per departure

| # | Field | ATA value | Notes |
|---|---|---|---|
| D-01 | Departure date | ☐ | |
| D-02 | Return date | ☐ | |
| D-03 | Booking cutoff | ☐ | Last date a request can be accepted. Consider permit lead time |
| D-04 | Minimum participants | ☐ | Below this, does the departure run? |
| D-05 | Maximum participants | ☐ | Your real operational ceiling — vehicle, guide, accommodation |
| D-06 | Available spaces | ☐ | Must be maintained or left null. A stale number is worse than none |
| D-07 | Waitlist | ☐ | Do you operate one? What does joining it entitle someone to? |
| D-08 | Date status | ☐ | See §3 |
| D-09 | Operational readiness | ☐ | See §4 — the honest internal question |
| D-10 | Publication approval | ☐ | Name, date |

## 3. Date status — choose one per departure

| Status | Meaning | Public effect |
|---|---|---|
| Planned | Intended, not confirmed | Not public, or shown as indicative only |
| Confirmed | Will operate | Publishable |
| Suspended | Temporarily withdrawn | Removed from public view, record kept |
| Cancelled | Will not operate | Removed; existing requesters must be contacted |
| Closed | Cutoff passed | No longer accepting requests |

**Suspended and cancelled are different and both must be recorded.** Suspending is reversible; cancelling is not. If a departure is cancelled, the people who already enquired need a person from ATA to contact them — the system does not do this for you.

## 4. Operational readiness — before publishing any date

Do not publish a departure date until every answer is yes. If any is no, the date is `Planned`, not `Confirmed`.

| # | Question | Yes/No |
|---|---|---|
| R-01 | Is a guide confirmed available for these dates? | ☐ |
| R-02 | Is transport confirmed for the Asmara–Massawa segment? | ☐ |
| R-03 | Is accommodation confirmed in both locations? | ☐ |
| R-04 | Are travel permits obtainable for this window, if required? | ☐ |
| R-05 | Are the named itinerary sites accessible on these dates? | ☐ |
| R-06 | Is the season acceptable for the coastal segment? | ☐ |
| R-07 | Can ATA staff respond to enquiries throughout the window? | ☐ |
| R-08 | Is a minimum-not-met outcome defined and communicable? | ☐ |

**R-04 and R-06 are the two most likely to fail.** R-04 because the permit requirement is still unverified; R-06 because a July departure puts travellers in roughly 41 °C on the coast, which is an operational and duty-of-care judgement only ATA can make.

## 5. Capacity — the questions behind the number

Maximum participants is not one number; it is the smallest of several:

- How many does your vehicle seat comfortably for a long mountain descent?
- How many can one guide manage across the itinerary?
- What can your accommodation hold in both cities?
- What group size does any boat activity permit safely?
- At what size does the experience stop being what you are selling?

☐ Binding constraint identified: ______________

## 6. What must never be published

| Do not publish | Why |
|---|---|
| A departure date that is not operationally confirmed | It reads as a commitment |
| Available-space counts you cannot keep current | A stale count misleads |
| Scarcity pressure — "only 2 spaces left" | Requires live inventory that does not exist |
| "Guaranteed departure" | Unless you will run it at one participant and can prove it |
| Capacity figures presented as availability | Different things |
| Any implication that submitting a request holds a place | Blocked in code; nothing is held until ATA confirms |

## 7. Approved placeholder wording

- Dates → **"Dates to be confirmed"**
- Availability → **"Contact ATA for availability"**
- General → **"Final details confirmed directly by ATA"**

These are pre-approved and honest. A page that shows them is functioning correctly.

## 8. Sign-off per departure

| Step | Who | Date | Done |
|---|---|---|---|
| Dates entered | | | ☐ |
| §4 readiness passed | | | ☐ |
| Capacity confirmed | | | ☐ |
| Approved | ATA Owner / Administrator | | ☐ |
| **Released** (separate act) | ATA Owner / Administrator | | ☐ |
| Review date set | | | ☐ |
