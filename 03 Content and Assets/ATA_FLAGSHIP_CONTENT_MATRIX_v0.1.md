# ATA Flagship Content Matrix v0.1

**Work Package:** Claude WP-02 — Content Model and Draft Copy
**Status:** Internal YK Systems working draft — not ATA-approved
**Subject:** Working Phase 1 flagship candidate: Asmara–Massawa Signature Tour, derived from ATA's supplied reference templates and pending ATA confirmation
**Governing contracts:** ATA_COPY_CONTRACT_MAPPING_v0.1 (this folder); Codex tour domain model, unified request workflow, feature-flag architecture (Drive `02 Discovery`); WP-01 analysis §9/§12 (`03 Content and Assets/ATA_REFERENCE_CONTENT_UX_ANALYSIS_v0.1.md`)

Marker key: **[ACR]** ATA confirmation required · **[ODR]** owner decision required · **[RR]** research required · **[VSR]** verified source required · **[PNP]** placeholder — not for publication

---

## 1. Content architecture overview

The flagship system is three content surfaces fed by one verified content store:

1. **Homepage** — sells the *existence and credibility* of the one tour (WP-01 §7 zone order).
2. **Flagship detail page** — sells the *tour itself* and converts to requests (WP-01 §9 order; Codex `/tours/flagship-preview` skeleton and verification-ledger pattern).
3. **Request flow + receipts** — converts and sets honest expectations (copy contract §3).

Every fact travels: intake (Codex intake templates) → verification envelope → approval → release → render. Copy below is authored *ready for that pipeline*: each field lists its Codex model target, so approved values drop in without rewriting.

## 2. Field-by-field matrix

Render values: **R** renders when published · **H** hidden until published · **CP** controlled placeholder (§12.3 pattern) while unpublished.

| # | Copy field | Codex model target | Draft copy exists (deck §) | Evidence class (contract §5) | Render | Markers |
|---|---|---|---|---|---|---|
| M-01 | Site header CTA label | UI string | Deck 2.1 | Editorial | R | — |
| M-02 | Hero headline + subline (homepage) | UI string (page content) | Deck 3.1 | Editorial | R | — |
| M-03 | Hero image | media[] + rights record | — | Media rights | H | [ACR] licence/consent (V-011) |
| M-04 | Trust strip claims (3–4) | UI strings, claim-evidence map | Deck 3.2 | Trust/identity | H | [ACR] per claim |
| M-05 | Flagship action row (name + duration + CTA) | tour.verifiedTitle, duration envelope | Deck 3.3 | Operational (duration) | Title H; CTA R | [ACR] name + duration |
| M-06 | Flagship summary card (homepage) | tour.verifiedSummary | Deck 3.4 | Editorial + operational facts | H facts; R narrative | [ACR] facts row |
| M-07 | Destination blurbs: Asmara, Massawa | destination content fields | Deck 3.5 | Destination facts | H | [RR] cited descriptions; [ACR] none implied operational |
| M-08 | Why ATA block | page content | Deck 3.6 | Trust/identity | H | [ACR] company facts; [VSR] owner intake material |
| M-09 | FAQ preview (4–5 process FAQs) | faqs[] {question, answer, status} | Deck 6 | Mixed (see per-FAQ) | R for process answers once approved; H otherwise | per-FAQ |
| M-10 | Final CTA section (homepage) | UI strings | Deck 3.7 | Editorial | R | — |
| M-11 | Detail: package identity (name, subtitle) | tour.internalWorkingTitle → verifiedTitle | Deck 4.1 | Operational | H (ledger explains) | [ACR] final name |
| M-12 | Detail: badge | badge (nullable) | — (omitted) | — | H | [ACR] criteria; no draft — unearned |
| M-13 | Detail: facts row (duration, route) | duration/route envelopes | Deck 4.2 | Operational | H | [ACR] |
| M-14 | Detail: suitability statement | suitability envelope | Deck 4.3 | Operational + research | H | [ACR] + [RR] activity risk (V-018) |
| M-15 | Detail: difficulty statement | difficulty envelope | Deck 4.3 | Operational + research | H | [ACR] + [RR] escarpment characterization |
| M-16 | Detail: gallery + captions | media[] + rights | — | Media rights | H | [ACR] (V-011) |
| M-17 | Detail: short summary | verifiedSummary | Deck 4.4 | Editorial + facts | Narrative R; embedded facts H | [ACR] facts |
| M-18 | Detail: long overview | overview envelope | Deck 4.5 | Editorial + destination facts | As M-17 | [RR] UNESCO wording (V-010) |
| M-19 | Detail: highlights (5–7) | highlights[] envelopes | Deck 4.6 | Operational | H per item | [ACR] each = operational promise (V-009) |
| M-20 | Detail: day-by-day itinerary | itineraryDays[] verified titles/summaries | Deck 4.7 | Operational | H per line | [ACR] line-by-line (V-009) |
| M-21 | Detail: pricing block | price display envelope; priceModel | Deck 4.8 | Commercial | **CP** (price-on-request) | [ACR]+[ODR] model (V-001) |
| M-22 | Detail: dates/availability | availability note envelope; departureModel | Deck 4.9 | Commercial | **CP** (window input; ATA confirms personally) | [ACR]+[ODR] (V-009/V-014) |
| M-23 | Detail: inclusions / exclusions | verified inclusions/exclusions | Deck 4.10 | Operational | H per item | [ACR] (V-009) |
| M-24 | Detail: packing guidance | content field | Deck 4.11 | Destination facts | H | [RR] climate validation |
| M-25 | Detail: best time to visit | content field | Deck 4.12 | Destination + strategy | H | [RR] climate + **[ODR]** season strategy (V-014) |
| M-26 | Detail: important information | importantInfo envelope | Deck 4.13 | Mixed; legal-adjacent | H | [ACR]+[RR]; professional review flag |
| M-27 | Detail: policies | policies (nullable) | — (interim statement only, Deck 4.14) | Legal | H; CP interim process line only | [ACR] + professional review (V-007) |
| M-28 | Detail: reviews | reviews[] (flag off) | — | Testimonial | H (module off) | [ACR] evidence + consent (V-008) |
| M-29 | Detail: FAQs (full set) | faqs[] | Deck 6 | Mixed | Per-answer | per-FAQ |
| M-30 | Detail: request CTA block | UI strings + form presets | Deck 5 | Editorial (bound to contract §3) | R | — |
| M-31 | Detail: final conversion section | UI strings | Deck 4.15 | Editorial | R | — |
| M-32 | Verification-ledger explainer line | UI string (Codex ledger pattern) | Deck 4.16 | Editorial | R | — |
| M-33 | Request form microcopy (labels, helper text) | form strings | Deck 5.1 | Editorial | R | — |
| M-34 | Consent checkbox texts (booking, provisional) | consent version records | Deck 5.2 | Legal-adjacent | R after approval | [ACR] + professional review |
| M-35 | Receipt/status strings (all states) | status message map | Deck 5.3 + contract §3.2 | Editorial bound to workflow | R | — (full 15-state lifecycle confirmed; per-state strings in contract §3.2) |
| M-36 | Mini "who is ATA" strip (detail page) | UI string | Deck 4.17 | Trust/identity | H until identity verified | [ACR] (V-004) |
| M-37 | Open Graph title/description (flagship) | SEO fields (future extension) | Deck 7 | Editorial | R | — (facts excluded) |
| M-38 | Error/fallback states (form failure) | UI strings | Deck 5.4 | Editorial | R | — |

## 3. Content hierarchy (authoritative order)

- **Homepage:** M-01 → M-02 → M-05 → M-04 → M-06 → M-07 → M-08 → M-09 → M-10 → footer (WP-01 §7.13; experience categories and testimonials deferred).
- **Flagship detail (single-column canonical):** M-11 → M-12* → M-13 → M-14/15 → M-16 → M-17 → M-18 → M-19 → M-20 → M-21 → M-22 → M-23 → M-24 → M-25 → M-26 → M-27* → M-28* → M-29 → M-30 → M-31 (+M-32 ledger adjacent to any hidden block; M-36 near top for direct-arrival traffic). *Omitted at launch.
- **Mobile behavior:** per WP-01 §10 — above-the-fold identity+CTA, sticky CTA bar, pinned anchor nav (Overview · Itinerary · Inclusions · FAQ), price-after-context, full-screen receipts. All copy fields ≤4 scan-lines per block; itinerary day cards collapse to title + two items.

## 4. Source and verification requirements summary

- Zero fields in this matrix are publication-ready today; **no APPROVED SOURCE FACT exists** (unchanged from WP-01 §9).
- The fastest path to a rendering page: ATA completes the Codex intake templates (`ATA_WP03_FLAGSHIP_TOUR_INTAKE_TEMPLATE`, `ATA_WP03_ATA_BUSINESS_FACT_INTAKE_TEMPLATE`) → envelopes populate → approval → release. The deck's draft copy then needs only fact-slot substitution, not rewriting.
- WP-03 research (parallel lane) feeds only M-07, M-18, M-24, M-25 destination/climate/UNESCO content — never commercial or operational fields.

---

*End of ATA_FLAGSHIP_CONTENT_MATRIX_v0.1.*
