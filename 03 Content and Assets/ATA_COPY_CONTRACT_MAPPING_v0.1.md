# ATA Copy-Contract Mapping v0.1

**Work Package:** Claude WP-02 — Content Model and Draft Copy
**Status:** Internal YK Systems working draft — not ATA-approved
**Baseline:** repo `main` @ `31251df` (merged WP-01); Codex contracts per Drive records (WP-02 set + two authorized WP-03 records, Codex baseline `b69b512`)
**Purpose:** bind all WP-02 copy to the implemented Codex technical foundation. Copy follows these contracts; it never redefines them.

---

## 1. Reconciliation — WP-02 contracts vs WP-03 refinements

| Area | Codex WP-02 record | Codex WP-03 refinement (authoritative) | Resolution for copy |
|---|---|---|---|
| Request statuses | Seven statuses: `NEW, CONTACTED, AWAITING_CUSTOMER, PROVISIONAL, CONFIRMED_OUTSIDE_SYSTEM, CLOSED, CANCELLED` | Transition matrix (encoded in `lib/ata/workflow.ts`): invalid jumps fail; manual confirmation requires explicit server authorization; closed records may archive; archived is terminal; **every pre-confirmation state's customer messaging explicitly says the request is not confirmed**. YK Systems reports the implemented lifecycle is 15 states; the two authorized records do not enumerate them all. | Copy is written as **rules plus named-state strings**: named strings for the eight states knowable from the records (the seven WP-02 statuses + `ARCHIVED`), and a **universal pre-confirmation rule** that safely covers any additional state (§3). No copy assumes a confirmed outcome unless status is exactly `CONFIRMED_OUTSIDE_SYSTEM`. |
| Confirmation authority | Only authorized ATA staff set `CONFIRMED_OUTSIDE_SYSTEM` | Manual confirmation requires explicit server authorization | Identical. Customer copy never states or implies confirmation as a system outcome. |
| Evidence states | `UNVERIFIED, OWNER_PROVIDED, DOCUMENT_VERIFIED, APPROVED_FOR_PUBLICATION, REJECTED` | Publication-state matrix adds hidden states: submitted, under review, verified-private, **expired, superseded, publication-blocked**; approved-for-publication is *eligible, not automatically published*; publishing requires a **separate authorized release action** | Adopted. For copy: only one condition ever renders a fact — approved-for-publication **and** released. Every other state renders nothing (§4 render rules). |
| Tour publication | `DRAFT → IN_REVIEW → APPROVED → PUBLISHED` (+ `SUSPENDED`/`ARCHIVED`); APPROVER/ADMIN identity required | Publication requires the separate release action | Adopted; copy deck content enters this pipeline as DRAFT. |
| Verification envelope | Render requires non-null value + public flag + `APPROVED_FOR_PUBLICATION` | Same, plus release action | All draft copy fields in the matrix are mapped to envelope fields; unapproved fields render **absent, not placeholder-faked** (Codex rule) — the flagship "verification ledger" pattern explains absence. |
| Receipt language | "Your request was received for test review. It is not a confirmed booking, reservation, price, seat, or payment." | Pre-confirmation messaging rule (above) | WP-02 drafts production-intent receipt copy that preserves every negative assertion of the Codex test string (§3.2). |

**Genuine conflicts found: none.** WP-03 refines WP-02 in every overlapping area; nothing contradicts. One **enumeration gap** is flagged, not resolved by invention:

> **DEP-01 — 15-state enumeration.** The full implemented request-state list exists only in `lib/ata/workflow.ts` (Codex branch `codex/ata-wp02-flagship-foundation` / WP-03 baseline `b69b512`, not present in this repository) and possibly in `ATA_WP03_UNIFIED_REQUEST_WORKFLOW_SPECIFICATION_v0.1.md` (not in the authorized two-file review). Copy for unenumerated states is covered by the universal pre-confirmation rule; exact per-state strings for the remaining states are marked **[VERIFIED SOURCE REQUIRED]** and should be finalized against that file or the workflow source when access is granted.

---

## 2. Missing-information markers (mandated set)

All WP-02 copy uses exactly these markers:

- **[ATA CONFIRMATION REQUIRED]** — fact only ATA can confirm (operational, commercial, identity)
- **[OWNER DECISION REQUIRED]** — a business choice, not a fact (e.g., seasonal positioning, tier model)
- **[RESEARCH REQUIRED]** — externally verifiable fact pending WP-03 research with citation
- **[VERIFIED SOURCE REQUIRED]** — statement needs a specific source document not yet available
- **[PLACEHOLDER — NOT FOR PUBLICATION]** — text that shows structure only and must never render publicly

WP-01 provenance labels (REFERENCE COPY / DRAFT YK SYSTEMS COPY) remain as secondary annotations for traceability.

---

## 3. Request-status copy contract

### 3.1 Universal rules

1. **Pre-confirmation rule (WP-03):** for every status except `CONFIRMED_OUTSIDE_SYSTEM`, rendered customer copy MUST include, verbatim or stronger: *"This is not a confirmed booking, reservation, seat, price, or payment."*
2. **Confirmation rule:** copy may describe a request as confirmed only when the record status is exactly `CONFIRMED_OUTSIDE_SYSTEM`, and must attribute confirmation to ATA staff ("confirmed personally by ATA"), never to the website.
3. **No invented transitions:** copy never promises a next status ("you will be confirmed") — only ATA's next *action* ("ATA will contact you").
4. **Reference ID:** every receipt shows the system-issued request reference.
5. **Unknown/unenumerated states** render the generic pre-confirmation template (3.2 row 1) until DEP-01 resolves.

### 3.2 Per-status customer-facing language

| Status | Permitted customer-facing language (DRAFT YK SYSTEMS COPY) | Prohibited | Authorized role/action to enter state |
|---|---|---|---|
| *(any pre-confirmation state, generic template)* | "Your request has been received — reference {ID}. This is not a confirmed booking, reservation, seat, price, or payment. ATA will contact you personally." | "Booked," "confirmed," "reserved," "your seat," "secured," any price/date as settled | System on valid submission (per workflow) |
| `NEW` | Generic template + "What happens next: an ATA team member reviews your request and replies on your chosen contact channel." | Same | System on submission |
| `CONTACTED` | "ATA has been in touch about your request {ID}. Nothing is confirmed yet — details are agreed directly with ATA." | Same | ATA staff action |
| `AWAITING_CUSTOMER` | "ATA is waiting for your reply on request {ID}. Your request stays open — nothing is confirmed or charged." | Pressure/scarcity devices | ATA staff action |
| `PROVISIONAL` | "ATA is provisionally holding your request {ID} while details are finalized. A provisional hold is not a guaranteed seat and creates no payment obligation." | "Seat secured," "guaranteed," countdowns | ATA staff action (server-authorized) |
| `CONFIRMED_OUTSIDE_SYSTEM` | "ATA has confirmed your booking personally, outside this website. Your confirmation details come directly from ATA — reference {ID}." | Any implication the website executed the booking or payment | **Authorized ATA staff only; explicit server authorization (WP-03)** |
| `CLOSED` | "Request {ID} is closed. You can submit a new request at any time." | — | ATA staff action |
| `CANCELLED` | "Request {ID} was cancelled. No booking, reservation, or payment existed for it." | — | ATA staff or customer-initiated per workflow |
| `ARCHIVED` (WP-03) | *(not customer-facing; terminal record state)* — no customer copy renders | Any customer-visible text | System/staff from `CLOSED`; terminal |
| *Remaining WP-03 states* | Generic template (row 1) — **[VERIFIED SOURCE REQUIRED — DEP-01]** | All confirmation vocabulary | Per `lib/ata/workflow.ts` |

### 3.3 CTA vocabulary (unchanged from WP-01 §18.4, restated as contract)

- **Allowed:** Request, Enquire, Ask, Check Availability (only adjacent to "ATA will confirm"), Plan, View, See, Submit
- **Prohibited:** Book Now, Book This Tour, Secure Your Spot, Reserve Now, Buy, Pay, Instant, Guaranteed, Confirmed (as CTA), scarcity/countdown devices

---

## 4. Content publication copy contract

| Publication/evidence condition (WP-03 matrix) | Customer-facing behavior | Copy obligation |
|---|---|---|
| Submitted / under review / verified-private | **Hidden** | Nothing renders; no "coming soon" shells |
| Verified + approved-for-publication (not yet released) | **Hidden** (eligible only) | Nothing renders |
| Published (separate authorized release action) | **Renders** | Copy may state the fact plainly; retains source ID in the envelope |
| Rejected / expired / superseded / publication-blocked | **Hidden** | Nothing renders; superseded copy never lingers |
| Missing but structurally expected (e.g., price) | **Controlled placeholder** only where WP-01 §12.3 defines a truthful-status pattern (price-on-request, dates-confirmed-personally, availability-on-request) | Placeholder states the *status of information*, never simulates the fact; all other absent facts render as absence via the verification ledger |

**Render / hide / placeholder decision rule for every copy field:** rendered only if published; hidden by default; a controlled placeholder is used *only* for the three conversion-critical fields above, using the exact §12.3 patterns.

---

## 5. Evidence and approval requirements per copy class

| Copy class | Minimum evidence to publish | Approval |
|---|---|---|
| Emotional/positioning copy (hero, narrative) that asserts no operational fact | Editorial review — contains zero factual claims | YK Systems edit + ATA sign-off |
| Destination facts (Asmara, Massawa, UNESCO, climate) | `DOCUMENT_VERIFIED` research citation → `APPROVED_FOR_PUBLICATION` | WP-03 research + ATA/YK release |
| ATA operational facts (itinerary lines, inclusions, duration, difficulty, suitability) | `OWNER_PROVIDED` → `DOCUMENT_VERIFIED` where documents exist → `APPROVED_FOR_PUBLICATION` | ATA confirmation mandatory |
| Commercial facts (price, tiers, dates, capacity, holds) | ATA decision + `APPROVED_FOR_PUBLICATION` | ATA; until then §12.3 placeholder |
| Legal/policy copy (cancellation, refunds, consent text) | ATA-approved terms + professional review | ATA + professional review; never drafted-to-publish by YK Systems |
| Trust/identity claims | Documentary evidence per claim (V-006 discipline) | ATA |
| Testimonials/reviews | Real, consented, evidenced | ATA; module remains flag-off until then |

---

*End of ATA_COPY_CONTRACT_MAPPING_v0.1 — copy binds to Codex contracts; where WP-03 refines WP-02, WP-03 governs. DEP-01 is the single open dependency.*
