# Pricing Approval Worksheet — Claude WP-04 v0.1

**Status:** Blank worksheet for ATA to complete. **No price is proposed, inferred or invented anywhere in this document.**
**Aligns with:** WP-03D pricing and availability model.

---

## 1. Before you start

Three things to know:

**You do not have to publish a price.** `CONTACT_ATA` and `CUSTOM_QUOTE` are legitimate pricing types. For a bespoke multi-day tour with variable group sizes, quote-only is often the more honest and more commercially sensible choice. A page saying "Request current pricing" is not an unfinished page.

**A published price is a commitment.** Once live it is what a customer relies on. That is why it needs a supporting document and a validity window.

**Price is independent of availability.** Publishing a price says nothing about whether a departure exists or a seat is free. The system keeps these separate deliberately.

## 2. Pricing status — choose one

| Status | Meaning | Public effect |
|---|---|---|
| `NOT_PROVIDED` | No price exists yet | Placeholder shown |
| `DRAFT` | Being worked out internally | Not public |
| `UNDER_REVIEW` | Submitted for approval | Not public |
| `APPROVED` | Approved but not yet released | Not public |
| `PUBLISHED` | Approved and released | Public |
| `TEMPORARILY_UNAVAILABLE` | Was public, withdrawn | Placeholder shown |

**Current status: `NOT_PROVIDED`.** ☐ ATA selects: ______________

## 3. Price type — choose one

| Type | When to use | Customer sees |
|---|---|---|
| `FIXED` | One firm price | A single price |
| `STARTING_FROM` | Varies by group/season | "From …" |
| `PER_PERSON` | Priced per traveller | Per-person price |
| `PER_GROUP` | Priced for whole group | Group price |
| `CUSTOM_QUOTE` | Always quoted individually | Quote invitation |
| `CONTACT_ATA` | Not published at all | "Contact ATA for current pricing" |

☐ ATA selects: ______________

⚠️ If you choose `STARTING_FROM`, the "from" figure must be a price you will actually honour for at least one real configuration. A "from" price no one can obtain is the most common misleading-pricing complaint in travel.

## 4. The worksheet

Amounts are stored as **minor units with an explicit currency** (e.g. 1,250.00 USD = `125000`, `USD`). Leave blank rather than guessing — blank is a valid state; a wrong number is not.

| # | Field | ATA value | Notes |
|---|---|---|---|
| P-01 | Pricing status | ☐ | §2 |
| P-02 | Price type | ☐ | §3 |
| P-03 | Currency | ☐ | ISO code. Consider what your diaspora audience actually pays in |
| P-04 | Adult price | ☐ | |
| P-05 | Child price | ☐ | State the age range this applies to |
| P-06 | Group price | ☐ | State the group size it assumes |
| P-07 | Deposit | ☐ | Amount **and** whether refundable — refundability is a policy question |
| P-08 | Supplement | ☐ | E.g. single occupancy. Name what triggers it |
| P-09 | Taxes and fees | ☐ | State whether **included in** or **added to** the price above |
| P-10 | Valid from | ☐ | Date |
| P-11 | Valid until | ☐ | Date. A price with no expiry becomes a stale commitment |
| P-12 | Internal notes | ☐ | Not public — margin, basis, supplier assumptions |
| P-13 | Public pricing notes | ☐ | What the customer reads alongside the number |
| P-14 | Approval authority | ☐ | Name and role of the person approving |
| P-15 | Supporting document | ☐ | Costing sheet, supplier quote, rate card — attached reference |
| P-16 | Publication release | ☐ | Name, date, and the separate act of releasing |

## 5. Questions your price must survive

Before approving, check the number answers all of these. If any answer is "not sure", the price is not ready.

1. What exactly does it include — and what does it not?
2. What group size does it assume, and what happens above or below it?
3. Does it change by season? (Massawa in July is a different operational cost from Massawa in January.)
4. Are internal flights, permits, entry fees and meals in or out?
5. What is the child age range?
6. Does it hold if a supplier raises rates mid-window?
7. Is there any deposit, and is it refundable?
8. How long will you honour it?

Item 4 connects to an unresolved research finding: **travel permits may be required outside Asmara.** If a permit carries a fee, it belongs in this calculation before you publish anything.

## 6. Approved placeholder wording

Until a price is released, one of these appears. All three are pre-approved:

- "Request current pricing"
- "Contact ATA for current pricing"
- "Price to be confirmed directly by ATA"

These are honest, complete statements. They do not signal an unfinished website.

## 7. Prohibited pricing language

| Do not use | Why |
|---|---|
| Any of the legacy figures — 299 / 599 / 899 / 1499 | Non-authoritative legacy seed data; not ATA prices |
| "Best price" / "lowest price" / "unbeatable" | Unverifiable comparative claims |
| Invented discounts or struck-through prices | Misleading unless the higher price was genuinely charged |
| Scarcity pressure — "only 2 left at this price" | Requires real inventory data, which does not exist |
| "Pay now" / "Book now" | Blocked in code; payments are disabled |
| Any figure without a currency | Ambiguous, and ambiguity favours a complaint |

## 8. Sign-off

| Step | Who | Date | Done |
|---|---|---|---|
| Price prepared | | | ☐ |
| Supporting document attached | | | ☐ |
| Reviewed against §5 questions | | | ☐ |
| Approved | ATA Owner / Administrator | | ☐ |
| **Released** (separate act) | ATA Owner / Administrator | | ☐ |
| Review date set | | | ☐ |
