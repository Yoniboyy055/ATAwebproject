# ATA Copy-Contract Mapping v0.1

**Work Package:** Claude WP-02 — Content Model and Draft Copy
**Status:** Internal YK Systems working draft — not ATA-approved
**Baseline:** repo `main` @ `31251df` (merged WP-01); Codex contracts per Drive records (WP-02 set + three authorized WP-03 records, Codex baseline `b69b512`)
**Purpose:** bind all WP-02 copy to the implemented Codex technical foundation. Copy follows these contracts; it never redefines them.

---

## 1. Reconciliation — WP-02 contracts vs WP-03 refinements

| Area | Codex WP-02 record | Codex WP-03 refinement (authoritative) | Resolution for copy |
|---|---|---|---|
| Request lifecycle | Seven statuses: `NEW, CONTACTED, AWAITING_CUSTOMER, PROVISIONAL, CONFIRMED_OUTSIDE_SYSTEM, CLOSED, CANCELLED` | **Fifteen-state lifecycle** (Unified Request Workflow Specification v0.1): Draft, Submitted, Under review, More information required, Qualified, Quote preparation, Quote sent, Customer response pending, Accepted in principle, Payment pending, **Manually confirmed** (the only confirmation-bearing state), Declined, Cancelled, Closed, Archived. Transition matrix: transitions encoded in `lib/ata/workflow.ts`; invalid jumps fail; manual confirmation requires explicit server authorization; closed records may archive; archived is terminal; every pre-confirmation state's customer messaging explicitly says the request is not confirmed. | **WP-03 lifecycle adopted in full** (§3.2). The WP-02 seven-status vocabulary is superseded for all copy. Approximate correspondence for traceability only (Codex owns any real migration mapping): NEW→Submitted · CONTACTED→Under review · AWAITING_CUSTOMER→Customer response pending / More information required · PROVISIONAL→Accepted in principle · CONFIRMED_OUTSIDE_SYSTEM→Manually confirmed · CLOSED→Closed · CANCELLED→Cancelled/Declined. |
| Confirmation authority | Only authorized ATA staff set the confirmed state | Only **Manually confirmed** bears confirmation; entering it requires explicit server authorization (transition matrix) | Identical intent. Customer copy never states or implies confirmation as a system outcome; confirmation is always attributed to ATA staff. |
| Request types | `INFORMATION, CONSULTATION, QUOTE, BOOKING_REQUEST, PROVISIONAL_RESERVATION` | Unchanged by WP-03 records reviewed | Types are unchanged (types ≠ statuses). Form presets stay five, provisional-hold preset flag-off. |
| Evidence states | `UNVERIFIED, OWNER_PROVIDED, DOCUMENT_VERIFIED, APPROVED_FOR_PUBLICATION, REJECTED` | Publication-state matrix adds hidden states: submitted, under review, verified-private, **expired, superseded, publication-blocked**; approved-for-publication is *eligible, not automatically published*; publishing requires a **separate authorized release action** | Adopted. For copy: only one condition ever renders a fact — approved-for-publication **and** released. Every other state renders nothing (§4). |
| Tour publication | `DRAFT → IN_REVIEW → APPROVED → PUBLISHED` (+ `SUSPENDED`/`ARCHIVED`); APPROVER/ADMIN identity required | Publication requires the separate release action | Adopted; copy deck content enters this pipeline as DRAFT. |
| Verification envelope | Render requires non-null value + public flag + `APPROVED_FOR_PUBLICATION` | Same, plus release action | All draft copy fields map to envelope fields; unapproved fields render **absent, not placeholder-faked** — the flagship "verification ledger" pattern explains absence. |
| Receipt language | "Your request was received for test review. It is not a confirmed booking, reservation, price, seat, or payment." | Pre-confirmation messaging rule (above) | WP-02 drafts production-intent receipt copy preserving every negative assertion of the Codex test string (§3.2/§3.3). |

**Genuine conflicts found: none.** WP-03 refines and supersedes WP-02 vocabulary; nothing contradicts.

**DEP-01 — resolved.** The full 15-state lifecycle is confirmed from `ATA_WP03_UNIFIED_REQUEST_WORKFLOW_SPECIFICATION_v0.1.md` (authorized read, 2026-07-24). *Residual, non-copy-blocking gap:* the exact per-pair transition table and per-transition role permissions remain encoded in `lib/ata/workflow.ts` (Codex branch, not in this repository). Copy does not depend on transition pairs — only on states and the confirmation rule — so no copy item is blocked. Codex remains the authority on transitions; any future copy that narrates a *specific transition* must be checked against that source.

---

## 2. Missing-information markers (mandated set)

- **[ATA CONFIRMATION REQUIRED]** — fact only ATA can confirm (operational, commercial, identity)
- **[OWNER DECISION REQUIRED]** — a business choice, not a fact
- **[RESEARCH REQUIRED]** — externally verifiable fact pending WP-03 research with citation
- **[VERIFIED SOURCE REQUIRED]** — statement needs a specific source document not yet available
- **[PLACEHOLDER — NOT FOR PUBLICATION]** — structural text that must never render publicly

WP-01 provenance labels (REFERENCE COPY / DRAFT YK SYSTEMS COPY) remain as secondary annotations.

---

## 3. Request-status copy contract (15-state lifecycle)

### 3.1 Universal rules

1. **Pre-confirmation rule (WP-03):** for every state except **Manually confirmed**, rendered customer copy MUST include, verbatim or stronger: *"This is not a confirmed booking, reservation, seat, price, or payment."*
2. **Confirmation rule:** copy may describe a request as confirmed only in the **Manually confirmed** state, and must attribute confirmation to ATA staff ("confirmed personally by ATA"), never to the website. Entering this state requires explicit server authorization (Codex transition matrix).
3. **No invented transitions:** copy never promises a next status — only ATA's next *action*.
4. **Reference ID:** every receipt and status view shows the system-issued request reference.
5. **Internal-only states render no customer copy.** If an internal state must surface, it renders the generic in-progress wording of *Under review*.
6. **Payment-pending rule:** no copy in any state invites payment through the website, displays an amount as due via the website, or implies payment completes a booking. Payment arrangements are described only as made directly with ATA.

### 3.2 Per-state exposure and customer-facing language

Wording is DRAFT YK SYSTEMS COPY, bound to rules 3.1. "Internal" = never rendered to customers.

| # | State | Exposure | Permitted customer-facing language | Prohibited | Authority to enter (per Codex records) |
|---|---|---|---|---|---|
| 1 | Draft | Internal (pre-submission system state) | — (the form itself is the experience) | Any status display | System |
| 2 | Submitted | Customer | "Your request has been received — reference {ID}. This is not a confirmed booking, reservation, seat, price, or payment. A person at ATA will review it and reply on your chosen channel." | "Booked," "confirmed," "reserved," "secured," any settled price/date | System on valid submission |
| 3 | Under review | Customer | "ATA is reviewing your request {ID}. Nothing is confirmed yet — a person at ATA will contact you." | Same | ATA staff / workflow |
| 4 | More information required | Customer | "ATA needs a little more information to continue with request {ID}. Please reply on your chosen channel. Your request stays open — nothing is confirmed or charged." | Pressure devices | ATA staff |
| 5 | Qualified | **Internal** (triage judgment) | — (renders as Under review wording if surfaced) | Exposing "qualified/unqualified" to customers | ATA staff |
| 6 | Quote preparation | Customer | "ATA is preparing your personal quote for request {ID}. A quote is not a booking — nothing is confirmed or charged." | Any computed/estimated amount from the website | ATA staff |
| 7 | Quote sent | Customer | "ATA has sent your personal quote for request {ID}. Review it and reply — nothing is booked until ATA confirms with you directly." | "Accept to book instantly" | ATA staff |
| 8 | Customer response pending | Customer | "ATA is waiting for your reply on request {ID}. Your request stays open — nothing is confirmed or charged." | Scarcity/countdown devices | ATA staff / workflow |
| 9 | Accepted in principle | Customer (careful) | "You and ATA have agreed in principle on request {ID}. This is not yet a confirmed booking — ATA will confirm the final details with you directly." | "Deal done," "booking secured," anything reading as confirmation | ATA staff |
| 10 | Payment pending | Customer (careful) | "ATA has arranged the payment details with you directly for request {ID}. No payment is taken through this website. Your booking is not confirmed until ATA confirms it with you personally." | Any pay-now CTA, amount-due display, or implication that paying auto-confirms | ATA staff |
| 11 | **Manually confirmed** | Customer — **only confirmation-bearing state** | "ATA has confirmed your booking personally — reference {ID}. Your confirmation details come directly from ATA." | Any implication the website executed the booking or payment | **Authorized ATA staff only; explicit server authorization** |
| 12 | Declined | Customer | "ATA was unable to proceed with request {ID}. No booking, reservation, or payment existed for it. You're welcome to send a new request or contact ATA directly." | Blame language; automated-rejection framing | ATA staff |
| 13 | Cancelled | Customer | "Request {ID} was cancelled. No booking, reservation, or payment existed for it." | — | ATA staff or customer-initiated per workflow |
| 14 | Closed | Customer | "Request {ID} is closed. You can submit a new request at any time." | — | ATA staff / workflow |
| 15 | Archived | **Internal** (terminal record state; entered from Closed; archived is terminal) | — | Any customer-visible text | System/staff per workflow |

### 3.3 CTA vocabulary (contract)

- **Allowed:** Request, Enquire, Ask, Check Availability (only adjacent to "ATA will confirm"), Plan, View, See, Submit
- **Prohibited:** Book Now, Book This Tour, Secure Your Spot, Reserve Now, Buy, Pay, Pay Now, Instant, Guaranteed, Confirmed (as CTA), scarcity/countdown devices

---

## 4. Content publication copy contract

| Publication/evidence condition (WP-03 matrix) | Customer-facing behavior | Copy obligation |
|---|---|---|
| Submitted / under review / verified-private | **Hidden** | Nothing renders; no "coming soon" shells |
| Verified + approved-for-publication (not yet released) | **Hidden** (eligible only) | Nothing renders |
| Published (separate authorized release action) | **Renders** | Copy may state the fact plainly; retains source ID in the envelope |
| Rejected / expired / superseded / publication-blocked | **Hidden** | Nothing renders; superseded copy never lingers |
| Missing but structurally expected (e.g., price) | **Controlled placeholder** only where WP-01 §12.3 defines a truthful-status pattern (price-on-request, dates-confirmed-personally, availability-on-request) | Placeholder states the *status of information*, never simulates the fact; all other absent facts render as absence via the verification ledger |

**Render / hide / placeholder decision rule:** rendered only if published; hidden by default; controlled placeholders only for the three conversion-critical fields above, using the exact §12.3 patterns.

---

## 5. Evidence and approval requirements per copy class

| Copy class | Minimum evidence to publish | Approval |
|---|---|---|
| Emotional/positioning copy asserting no operational fact | Editorial review — zero factual claims | YK Systems edit + ATA sign-off |
| Destination facts (Asmara, Massawa, UNESCO, climate) | `DOCUMENT_VERIFIED` research citation → `APPROVED_FOR_PUBLICATION` | WP-03 research + ATA/YK release |
| ATA operational facts (itinerary, inclusions, duration, difficulty, suitability) | `OWNER_PROVIDED` → `DOCUMENT_VERIFIED` where documents exist → `APPROVED_FOR_PUBLICATION` | ATA confirmation mandatory |
| Commercial facts (price, tiers, dates, capacity, holds) | ATA decision + `APPROVED_FOR_PUBLICATION` | ATA; until then §12.3 placeholder |
| Legal/policy copy (cancellation, refunds, consent text) | ATA-approved terms + professional review | ATA + professional review; never drafted-to-publish by YK Systems — all consent/policy drafts herein are working proposals, not legal advice |
| Trust/identity claims | Documentary evidence per claim (V-006 discipline) | ATA |
| Testimonials/reviews | Real, consented, evidenced | ATA; module remains flag-off until then |

---

*End of ATA_COPY_CONTRACT_MAPPING_v0.1 — copy binds to Codex contracts; where WP-03 refines WP-02, WP-03 governs. DEP-01 resolved; residual transition-pair detail remains with Codex source and is not copy-blocking.*
