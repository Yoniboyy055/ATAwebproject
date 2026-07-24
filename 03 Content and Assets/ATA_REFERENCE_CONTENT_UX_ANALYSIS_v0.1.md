# ATA Reference Content & UX Analysis

**Work Package:** WP-01 — Reference and Customer-Journey Analysis

---

## 1. Document Control

| Field | Details |
|---|---|
| Document title | ATA Reference Content & UX Analysis |
| Version | 0.1 |
| Status | Internal YK Systems working draft — **not ATA-approved** |
| Project | ATA Flagship Tour Launch (Phase 1) |
| Client | AMANUEL TRAVEL AGENCY (ATA) |
| Owner | YK Systems |
| Author | Claude — Research, Content, and Experience Design Lead |
| Date | 2026-07-23 |
| Repository branch | `claude/project-role-mpse1s` |
| Governing documents | YK Systems ATA Flagship Tour Launch SOW v0.9 (internal final); ATA UI Reference Knowledge Base v0.1 (MD + JSON); ATA Source Extraction and Delivery Control workbook v0.1; ATA Claude Work Brief v0.1 |
| Approval scope | This document contains analysis and recommendations only. No content herein is publication-approved. ATA owns final factual approval; ChatGPT (Delivery Lead) owns the single source of truth and release gates; Codex owns the authoritative repository audit. |

**Working flagship candidate wording (mandated):** throughout this document, the phrase *"Working Phase 1 flagship candidate: Asmara–Massawa Signature Tour, derived from ATA's supplied reference templates and pending ATA confirmation"* is the controlling description of the flagship package. Nothing in this analysis promotes it to ATA's final approved flagship.

---

## 2. Executive Interpretation

Phase 1 builds a **customer-acquisition and enquiry system around one flagship Eritrea tour** — *one tour, one audience, one launch system* (SOW §1, §4; SRC-OWN-001). The working Phase 1 flagship candidate is the **Asmara–Massawa Signature Tour**, derived from ATA's supplied reference templates and pending ATA confirmation (KB `raw_copy.flagship`; SRC-UI-003/004/005).

Controlling interpretations:

1. **The website is an enquiry system, not a brochure or a store.** Its success measure is qualified, structured requests: information, consultation/callback, quote, booking request, and provisional seat reservation (SOW §3.2). No action is described as an automatic confirmed booking, payment, or guaranteed seat (KB V-005).
2. **The first strategic audience is the Eritrean diaspora and homecoming market** (SRC-OWN-001), pending final ATA confirmation. All positioning, journey design, and copy priorities in this document serve that audience first.
3. **The mockups govern structure, not facts.** SRC-UI-001–005 supply layout, hierarchy, and journey patterns. Every sample price, tier, date, review, rating, guarantee, licence, cancellation term, supplier claim, contact detail, brand asset, and image is unverified reference content (KB `source_of_truth_rules`).
4. **One tour now; a reusable template for ~4 later** (SRC-OWN-001; SOW §2). The 15-package mock catalog (SRC-UI-002) is ideation only (KB V-012). Phase 1 does not expand into it.
5. **Airline ticketing is not the primary journey** (SRC-OWN-001). The existing site's flights-first presentation conflicts with this direction — see §3.4 (PRELIMINARY CLAUDE OBSERVATION; Codex to verify).
6. **Mobile-first is mandatory** (KB `ui_requirements.Mobile experience`). The mobile experience is designed as its own conversion journey, not a compressed desktop page.
7. **Speed with honesty.** ATA wants a fast launch, but YK Systems must not publish unsupported facts (SRC-OWN-001). The placeholder policy in §12.3 exists to reconcile these two pressures.

---

## 3. Source Review

### 3.1 Source register

| ID | Artifact | Type | Verification level |
|---|---|---|---|
| SRC-UI-001 | `33458.jpg` — Tour-first homepage reference (desktop + mobile) | UI reference image | Structure/journey reference only; no factual authority |
| SRC-UI-002 | `33459.jpg` — Tour package catalog reference (desktop) | UI reference image | Structure/journey reference only; no factual authority |
| SRC-UI-003 | `33460.jpg` — Flagship tour detail reference (desktop) | UI reference image | Structure/journey reference only; no factual authority |
| SRC-UI-004 | `33461.jpg` — Flagship tour detail reference (mobile sequence A) | UI reference image | Structure/journey reference only; no factual authority |
| SRC-UI-005 | `33532.jpg` — Flagship tour detail reference (mobile sequence B) | UI reference image | Confirms single-column mobile conversion journey; no factual authority |
| SRC-OWN-001 | ATA Owner Direction and Strategy Summary | YK Systems project record based on owner conversations | **Confirmed project direction** — valid for strategy/direction traceability only. NOT valid for price, dates, capacity, hotels, transport, suppliers, cancellation terms, licences, guide credentials, reviews, availability, booking confirmation, or package inclusions/exclusions |
| SOW v0.9 | YK Systems ATA Flagship Tour Launch SOW (internal final) | Governance document | Governs scope, deliverables, acceptance; not yet issued to/approved by ATA |
| KB v0.1 | ATA UI Reference Knowledge Base (MD + JSON) | Extraction record | Internal working record — not ATA-approved; contains verification queue V-001–V-012 |
| Workbook v0.1 | ATA Source Extraction and Delivery Control (10 sheets: Control, Sources, UI Requirements, Package Catalog, Flagship Master, Itinerary, Content Blocks, Verification Queue, Decisions, Work Plan) | Delivery-control record | Internal working record — not ATA-approved |

### 3.2 SRC-OWN-001 — recorded owner direction

Owner direction recorded by YK Systems (verbatim summary of record):

- ATA should focus on one thing first.
- Tours should become the primary website direction.
- Airline-ticket functionality should not be the current priority.
- The tour enquiry action should appear near the top of the homepage.
- The existing/reference design should be used as a template rather than rebuilding unnecessarily.
- Reusable package templates are important.
- ATA expects approximately four packages eventually.
- One package should be proven before multiplying the system.
- The first strategic audience is the Eritrean diaspora and homecoming market.
- Summer homecoming travel is considered an important opportunity.
- The website alone will not generate customers; campaigns, diaspora communities, referrals, and distribution will be necessary.
- ATA wants development effort minimized through reuse and templates.
- ATA intends to supply real package and operational information.
- ATA wants the website published quickly, but YK Systems must not publish unsupported facts.

**Usage boundary:** SRC-OWN-001 is cited in this document only for strategy and direction. It never validates a commercial or operational fact.

### 3.3 Reference-to-production treatment table (required addition A)

Classifications: **Reuse structurally** · **Adapt** · **Replace** · **Defer** · **Reject** · **Requires ATA confirmation** · **Requires research**. Multiple labels apply where content and structure diverge.

| Reference element | Source | Classification | Treatment |
|---|---|---|---|
| Homepage hero (image + headline + sub + dual CTA) | SRC-UI-001, SRC-UI-002 | Reuse structurally + Adapt copy | Keep hero pattern; re-point primary CTA at the flagship candidate page and place enquiry action near top (SRC-OWN-001). Headline copy is REFERENCE COPY pending draft + approval. Hero image Requires ATA confirmation (media ownership, V-011). |
| Trust strip (icon claims below hero) | SRC-UI-001, SRC-UI-002 | Reuse structurally + Replace content | Keep the compact icon-strip pattern. Reject "Licensed Guides," "Best Price Guarantee," "24/7 Support," "Safe & Reliable" as claims unless ATA substantiates each (V-006). Populate only with verifiable claims (see §6). |
| Featured flagship cards | SRC-UI-001 | Adapt | One card fully populated (flagship candidate). Future package cards remain unpublished; card component built as reusable template (KB `ui_requirements.Featured tour cards`). "Most Popular" badge Requires ATA confirmation — no data supports popularity. |
| 15-package catalog grid | SRC-UI-002 | Defer + partial Reject | Grid component may be built as a future template (KB Phase 1 mapping), but publishing the 15 concepts is rejected for Phase 1 (V-012; SRC-OWN-001: ~4 packages eventually, one first). |
| Destination cards (Asmara, Massawa, Dahlak, Keren, Nakfa, Qohaito, Filfil) | SRC-UI-001 | Adapt + Requires research | Keep as discovery/navigation layer. Publish only destinations relevant to the flagship candidate at launch (Asmara, Massawa). Descriptions require research with citations; do not imply ATA operates tours to every listed destination. |
| Experience categories (walking, cycling, coffee, snorkeling, etc.) | SRC-UI-001 | Defer | Navigation value only after multiple packages exist. In Phase 1 they imply an operational breadth ATA has not confirmed. |
| Detail-page gallery | SRC-UI-003/004/005 | Reuse structurally + Requires ATA confirmation | Keep gallery pattern. Every image requires ownership/licence/consent verification (V-011). Reference images appear to be AI-generated or stock composites — must not ship. |
| Itinerary timeline (day-by-day, icons, per-day image) | SRC-UI-003/004/005 | Reuse structurally + Requires ATA confirmation | Core reusable component. All itinerary content is operationally unconfirmed (V-009): every line implies a supplier/access commitment. |
| Package tiers (Budget/Standard/Premium) | SRC-UI-003/004 | Defer + Requires ATA confirmation | Do not publish tiers until ATA confirms whether a tier model exists and its real prices (V-001). Build the schema tier-capable but nullable. |
| Price estimator ("$850 per person, starting from") | SRC-UI-003/004 | Reject content + Requires ATA confirmation | The number conflicts across references ($850 vs $450, V-001). Replace with "price on request" pattern (§12.3) until ATA supplies the real model. |
| Date selector ("Select your travel date") | SRC-UI-003 | Adapt | Convert from inventory-implying picker to *preferred travel window* input inside a request form. No availability promise is shown. |
| Reviews (4.9 / 126 + named quotes) | SRC-UI-003/004/005 | Reject + Requires ATA confirmation | Hide entirely until real, evidenced testimonials exist (V-008). Publishing sample reviews would be fabricated social proof. |
| FAQs (5 questions shown, no answers) | SRC-UI-003/004/005 | Reuse structurally + Requires ATA confirmation / research | The question set is genuinely good (it matches real objections — §6). Answers do not exist yet; each answer routes to ATA confirmation or research. |
| Inclusions / exclusions blocks | SRC-UI-003/004/005 | Reuse structurally + Requires ATA confirmation | Checklist pattern is strong for scan-reading. Every listed item is an operational promise requiring ATA confirmation (V-009). |
| Packing guidance | SRC-UI-003/004/005 | Adapt + Requires research | Low-risk content; validate against researched climate/seasonal facts (e.g., highland vs coast temperature difference) before publishing. |
| Sticky/repeated mobile CTA | SRC-UI-004/005 | Reuse structurally | Mobile references repeat the primary CTA after the itinerary and at page end. Adopt and strengthen with a persistent sticky bar (§10). |
| "Book Now" / "Book This Tour" / "Secure Your Spot Now" language | SRC-UI-001–005 | Reject | Violates request-based booking control (V-005). Replace with request/availability language per CTA rules (§18.4). |
| Newsletter section (footer) | SRC-UI-001/002 | Defer | KB Phase 1 mapping defers newsletter. Requires a consent/privacy posture ATA has not defined. |
| Wishlist / share functions | SRC-UI-003/004 | Defer (share) + Defer (wishlist) | Wishlist requires accounts and adds no Phase 1 conversion value. Share is genuinely useful for the diaspora referral journey (§8.3) — recommend as a lightweight non-account share link if Codex confirms low cost; otherwise defer both. |
| Breadcrumb + anchor tab navigation (Overview/Itinerary/Inclusions/Reviews/FAQ) | SRC-UI-003/004/005 | Reuse structurally | Keep on desktop and mobile with accessible focus/scroll behavior (KB `ui_requirements.Detail navigation`). Reviews tab hidden while reviews are unpublished. |
| Footer (quick links, destinations, travel info, legal) | SRC-UI-001/002 | Adapt | Keep structure; strip Visit Eritrea identity/contacts (V-004); legal links require ATA-approved policy documents; travel-info links only where content is verified. |
| Custom tour CTA ("Custom Tours Just for You") | SRC-UI-002 | Defer | Custom-tour automation is deferred (KB Phase 1 mapping). The consultation request (§11.2) covers this intent in Phase 1. |
| Utility bar (phone/email/social/language) | SRC-UI-001/002 | Adapt | Keep pattern with ATA-verified contact details only (V-004). Language selector deferred (KB `ui_requirements.Global navigation`). |

### 3.4 Preliminary repository observations — PRELIMINARY CLAUDE OBSERVATION

The following are **PRELIMINARY CLAUDE OBSERVATIONS** from a read-only review of the existing repository (`Yoniboyy055/ATAwebproject`, main branch as of 2026-07-22). They are **not** the formal repository audit. **Codex owns the authoritative repository, architecture, route, component, and reuse-versus-rebuild audit.** No implementation decision in this document rests on these observations; they are recorded so Codex can verify them.

| # | Observation | Location | Strategy conflict | Codex to verify |
|---|---|---|---|---|
| P-01 | Homepage metadata/JSON-LD leads with "Air tickets, diaspora travel"; services list opens with "Flights + Full Trip Support" | `app/page.tsx`, `lib/data.ts` | Conflicts with tour-first direction (SRC-OWN-001) | Confirm scope of flights-first copy across pages and metadata |
| P-02 | Dedicated `/flights` page and `FLIGHTS_IMPLEMENTATION.md` exist | `app/flights/`, repo root | Airline ticketing must not be the primary journey (SRC-OWN-001) | Decide route fate (retain-demoted / redirect / remove) in reuse-vs-rebuild report |
| P-03 | Stripe payment creation and webhook routes exist | `app/api/payments/create/`, `app/api/webhooks/stripe/` | Phase 1 is request-based; no automatic payment (KB V-005; SOW) | Confirm whether payment paths are reachable from public UI; recommend disable/flag strategy |
| P-04 | Four seeded generic packages at $299/$599/$899/$1,499 with no itinerary/date/capacity data | `prisma/seed.ts` | Sample prices must not surface as facts (KB `source_of_truth_rules`) | Confirm whether seed data can surface in production; assess Package model fit vs. §18.4 content model |
| P-05 | Placeholder initials-only testimonials shipped in code | `lib/data.ts` | Same class of risk as V-008 (unverified reviews) | Confirm all render locations; gate behind verification flag |
| P-06 | Existing enquiry/quote infrastructure: enquiries, quotes, bookings APIs; email/SMS/WhatsApp helpers | `app/api/enquiries/`, `app/api/quotes/`, `lib/email.ts`, `lib/sms.ts`, `lib/whatsappHelper.ts` | Potentially strong reuse for the request flow (§11) — positive finding | Confirm operational status, delivery configuration, and admin notification paths |
| P-07 | Admin portal with package/enquiry/booking CRUD exists | `app/admin/` | Potentially satisfies SOW admin-foundation requirement — positive finding | Confirm field coverage vs. §18.4 content model; verify auth hardening |
| P-08 | Destinations list spans 17 global cities (Dubai, London, Bangkok, NYC…) | `lib/data.ts` | Conflicts with Eritrea-focused tour-first Phase 1 | Confirm render locations; recommend demote/remove treatment |

---

## 4. Target Audience Analysis

**Status:** YK Systems analysis (DRAFT). The diaspora/homecoming market is confirmed as the *first strategic audience* by SRC-OWN-001; the segment definitions below are analytical constructs and are **not ATA-approved customer segments**. The reference imagery and copy (SRC-UI-001/002: "Welcome Home to Eritrea," family-group photography, "Rediscover Your Roots") demonstrate that the reference designer targeted the same market.

### 4.1 Eritrean diaspora travelers (broad segment)

| Dimension | Analysis |
|---|---|
| Primary motivations | Reconnect with homeland; introduce children/partners to Eritrea; cultural pride; combine family visit with a structured experience they don't have to organize themselves |
| Emotional needs | Being treated as returning family, not foreign tourists; trust that the operator understands diaspora realities (documents, time zones, remittance-style price sensitivity); pride in a professional Eritrean business |
| Practical needs | Planning around limited annual leave; coordination with international flights (which are excluded — SRC-UI-003 "What's Not Included"); document/visa guidance; communication on channels they already use (phone/WhatsApp) |
| Likely objections | "Is this a real company?"; "Why is the price what it is?"; "What exactly am I paying for versus arranging myself?"; fear of overpaying versus arranging through relatives |
| Trust requirements | Verifiable business identity and physical presence; a human contact with a name; transparent explanation of the pricing process; evidence of past delivery once available |
| Information required before enquiry | Full itinerary; inclusions/exclusions; how pricing works (even if "on request"); what happens after submitting a request; who responds and how fast |
| Recommended CTAs | "Request a quote" (primary); "Ask a question" via established messaging channel (secondary) |

### 4.2 Homecoming travelers (first return in years; summer peak)

| Dimension | Analysis |
|---|---|
| Primary motivations | A structured tour layered onto a family homecoming trip; seeing the country properly, not just the family living room; marking a milestone return |
| Emotional needs | Nostalgia and pride; reassurance about how much has changed; permission to be "a tourist at home" without embarrassment |
| Practical needs | Date flexibility around family obligations; short tour duration that fits inside a longer family stay (the 5-day reference duration suits this — SRC-UI-003); ability to add family members joining locally |
| Likely objections | Fixed departures conflicting with family schedules; paying for services relatives offer informally |
| Trust requirements | Flexibility signals (customization FAQ — SRC-UI-003); clear group/private options; respect for local family context |
| Information required before enquiry | Whether dates flex; whether locally-resident family can join; private-group pricing approach |
| Recommended CTAs | "Request a consultation" (primary — these travelers need conversation, not forms) |
| Open strategy question | SRC-OWN-001 identifies **summer homecoming** as a key opportunity, but the reference states **best time: October–April** (SRC-UI-003/004). This is a genuine strategic conflict — registered as V-014 (§13). Resolution requires research (coastal summer heat) plus an ATA seasonal-operations decision. |

### 4.3 Families and multigenerational groups

| Dimension | Analysis |
|---|---|
| Primary motivations | Shared experience across generations — grandparents showing grandchildren their country; reunion-style trips |
| Emotional needs | Confidence that elders will be comfortable and children safe; a pace nobody gets left behind by |
| Practical needs | Vehicle comfort on the escarpment drive (SRC-UI-003 Day 3); room configurations; meal accommodations; manageable walking distances; rest time |
| Likely objections | "Is the mountain drive safe for my mother?"; "Is the boat excursion safe for kids?"; "All Ages" claims that feel generic rather than earned |
| Trust requirements | Honest difficulty descriptions with specifics (what "Easy" actually means per day); named accommodation standards once confirmed; child/elder policy clarity |
| Information required before enquiry | Day-by-day pace; accessibility notes; private-group option; what "All Ages Welcome" (SRC-UI-004) is actually based on |
| Recommended CTAs | "Request a consultation" with group-size fields (§11.2) |

### 4.4 First-time visitors to Eritrea (including non-Eritrean partners and friends)

| Dimension | Analysis |
|---|---|
| Primary motivations | Curiosity; accompanying a diaspora partner/friend; interest sparked by Asmara's architecture or Red Sea diving coverage |
| Emotional needs | Confidence to visit a destination with scarce mainstream travel information; feeling expected and guided rather than improvising |
| Practical needs | Entry/visa process guidance; money and connectivity basics; safety information from credible sources; language support expectations |
| Likely objections | Information scarcity about Eritrea online; uncertainty about entry requirements; perception risk from outdated or generic coverage |
| Trust requirements | Accurate, cited destination facts (this is where the corrected UNESCO statement matters — V-010); practical guidance that proves the operator knows the ground truth |
| Information required before enquiry | Entry requirements orientation (with a clear "confirm with official sources / ATA will guide you" posture); guide language; what's genuinely included |
| Recommended CTAs | "Request information" (primary); FAQ engagement (supporting) |

### 4.5 Heritage and cultural travelers

| Dimension | Analysis |
|---|---|
| Primary motivations | Asmara's modernist architecture; Massawa's Ottoman/Italian layers (SRC-UI-003 Day 4); photography; history-led travel |
| Emotional needs | Authenticity and depth — not a beach product with a museum bolted on; being taken seriously as an informed traveler |
| Practical needs | Site access reality (what is open, what can be photographed); knowledgeable guiding; enough time at key sites (Fiat Tagliero, Cinema Impero — SRC-UI-003 Day 2) |
| Likely objections | Vague or wrong claims ("UNESCO-like architecture" — V-010 — signals a non-serious operator to this segment); itineraries that are drive-past checklists |
| Trust requirements | Precise, researched site descriptions; the accurate UNESCO World Heritage framing of Asmara once verified; guide expertise evidence |
| Information required before enquiry | Site list with time allocation; guide knowledge level; customization for depth |
| Recommended CTAs | Itinerary deep-link + "Request a quote" |

### 4.6 Confidence-needing travelers (interested but hesitant)

| Dimension | Analysis |
|---|---|
| Primary motivations | Genuinely want the trip but need de-risking before committing money to an unfamiliar operator |
| Emotional needs | Certainty they will not be scammed; a human they can talk to; no-pressure engagement |
| Practical needs | Clear explanation of the booking process and what each step commits them to; payment expectations stated before any payment exists; cancellation/refund rules |
| Likely objections | No visible reviews; unclear refund terms; fear that "request" hides a hard-sell; upfront payment anxiety |
| Trust requirements | Explicit "what happens next" at every step (§11); request language that commits them to nothing; a callback option; honest absence of reviews rather than fake ones |
| Information required before enquiry | The booking/confirmation process end-to-end; cancellation policy (once ATA supplies it — V-007); who will contact them and when |
| Recommended CTAs | "Request a callback" (lowest-commitment entry point) |

---

## 5. Emotional and Commercial Promise

### 5.1 Reference messaging (REFERENCE COPY — not approved)

The references establish a consistent emotional register (SRC-UI-001/002):

- "Welcome Home to Eritrea" — homecoming as the core promise (SRC-UI-001)
- "Your Journey. Your Heritage. Your Home." — identity-led triad (SRC-UI-002)
- "Rediscover Your Roots" — reference brand tagline (SRC-UI-001–005; Visit Eritrea identity, not usable — V-004)
- "From the Cool Highlands to the Warm Red Sea – Experience Eritrea's Most Iconic Journey" — flagship subtitle built on geographic contrast (SRC-UI-003/004/005)
- Warmth/family photography, "the warmth of its people" — people-centered emotional proof (SRC-UI-001)

The emotional direction is: **home, heritage, family, warmth, guided ease**. This is well-matched to the confirmed first audience (SRC-OWN-001) and should be preserved *as direction*.

### 5.2 Recommended YK Systems positioning (DRAFT YK SYSTEMS COPY — for WP-02 development)

Recommended positioning spine, to be drafted fully in WP-02:

1. **Emotional promise:** *Come home properly.* A structured, guided way to experience Eritrea — for those returning, and those arriving for the first time.
2. **Commercial promise:** one clearly defined tour, honestly described, with a human answering every request. ATA organizes the ground experience so the traveler doesn't have to.
3. **Trust posture:** radical transparency substitutes for absent social proof at launch — show the real business, the real process, the real people, and say plainly what is still being confirmed.
4. **Geographic hook:** the highlands-to-Red-Sea contrast (SRC-UI-003 subtitle) is the strongest structural story in the reference pack and is *researchable fact* (altitude/climate contrast) — it can carry the flagship narrative without unverifiable claims.

### 5.3 Claims requiring ATA confirmation

- Any "we are local experts / our guides / our team" claims — team composition and credentials (V-006)
- "Perfect for first-time visitors," "All Ages," "Easy" — suitability claims imply operational knowledge ATA must stand behind (V-009)
- Any promise of response time ("we reply within X") — must match real ATA capacity (SRC-OWN-001 confirms ATA will supply operational info)
- Popularity/badge claims ("Most Popular") — no supporting data exists (SRC-UI-003)

### 5.4 Claims requiring independent research

- Whether and how Asmara holds UNESCO World Heritage status, and the correct descriptive language for it (V-010) — *note boundary: confirming the inscription does not confirm ATA's itinerary, access, guiding, pricing, or operating capacity*
- Highlands/coast climate contrast and honest seasonal guidance (feeds V-014)
- Massawa Old Town historical framing (Ottoman/Italian heritage) and current condition
- Escarpment drive characterization (distance, duration, road character) supporting honest difficulty copy
- Dahlak/Red Sea marine activity framing *if and when* boat excursion is confirmed operational (V-009)

---

## 6. Trust and Objection Model

Matrix status: YK Systems analysis (DRAFT). Placement references use §7 homepage zones and §9 detail-page sections.

| # | Objection / concern | Why it matters | Information that addresses it | Evidence required | Recommended placement | Routing |
|---|---|---|---|---|---|---|
| T-01 | Company credibility — "Is ATA real?" | Gate condition for any diaspora payment decision | Verified business identity, physical address, named principal, history, channels | ATA registration/identity facts; owner sign-off | Why ATA block (§7.9); footer; About page | REQUIRES ATA CONFIRMATION |
| T-02 | Package authenticity — "Does this tour actually run?" | Reference content is aspirational; travelers sense vagueness | Confirmed itinerary, named (or honestly generalized) suppliers, real departures | ATA operational confirmation (V-009) | Flagship detail (§9); FAQ | REQUIRES ATA CONFIRMATION |
| T-03 | Price transparency — "Why this price? Why should I trust it?" | Conflicting reference prices (V-001) make any published number suspect | Clear pricing model or honest "quote on request" with process explanation | ATA pricing decision | Pricing presentation (§9.11) and request CTA block (§9.21); quote-request flow (§11.3) | REQUIRES ATA CONFIRMATION |
| T-04 | Safety — general and route-specific | First-time visitors and families will not enquire without it | Factual, sourced safety posture; road/boat specifics answered plainly | Research (cited) + ATA operational answers | FAQ; Important Information (§9.17) | REQUIRES RESEARCH + ATA CONFIRMATION |
| T-05 | Transport quality — escarpment drive comfort | Multigenerational groups' top practical fear (§4.3) | Vehicle type/standard, journey time, stops | ATA supplier confirmation | Itinerary Day 3 notes; FAQ | REQUIRES ATA CONFIRMATION |
| T-06 | Accommodation standard | "4 Nights Accommodation" (SRC-UI-003) is meaninglessly vague | Named hotels or honest class description | ATA supplier confirmation (V-009) | Inclusions block; FAQ | REQUIRES ATA CONFIRMATION |
| T-07 | Guide quality and language | "Professional Guide" claim is unverified (V-006) | Guide profile, languages, experience — only as evidenced | ATA guide facts | Highlights; Why ATA | REQUIRES ATA CONFIRMATION |
| T-08 | Cancellation and refunds | "Free cancellation up to 7 days" (V-007) is an unapproved legal term | Real cancellation/refund policy in plain language | ATA policy + professional review | Policies page; booking-request consent step (§11.4) | REQUIRES ATA CONFIRMATION — flag for legal/professional review |
| T-09 | Communication reliability | Diaspora travelers span time zones; silence kills trust | Stated response expectation; named response owner; channel options | ATA capacity commitment | Every confirmation state (§11); contact page | REQUIRES ATA CONFIRMATION |
| T-10 | Family suitability | "All Ages Welcome" (SRC-UI-004) is unearned | Per-day pace notes; age-specific guidance; elder/child accommodations | ATA operational confirmation + research (activity risk) | Difficulty block (§9.5); FAQ | REQUIRES ATA CONFIRMATION + RESEARCH |
| T-11 | Customer support after booking request | Fear of being dropped post-request | Defined follow-up steps and timing (§11) | ATA process commitment | Confirmation states; FAQ | REQUIRES ATA CONFIRMATION |
| T-12 | Media authenticity — "Are these photos real?" | Reference imagery appears AI-generated/stock (V-011); fake imagery destroys the exact trust this audience needs | Real, owned, consented photography of actual locations | Media licence/ownership audit | Gallery (§9.6); hero | REQUIRES ATA CONFIRMATION |
| T-13 | Booking confirmation ambiguity — "Did I just book?" | Request-based model must never feel like limbo *or* false confirmation | Explicit status language: what a request is, what happens next, when it becomes confirmed | Copy discipline (§11, §18.4 CTA rules) | All request flows and confirmation screens | DRAFT YK SYSTEMS COPY (WP-02) |
| T-14 | Payment expectations — "When and how do I pay?" | No payment exists in Phase 1; silence creates suspicion | Plain statement: no online payment; ATA confirms details personally after request | ATA process confirmation | FAQ; booking-request flow | REQUIRES ATA CONFIRMATION |
| T-15 | Local operational capacity — "Can a small agency deliver this?" | The flagship spans two cities, transport, boat, hotels | Honest scale framing; partner acknowledgment where confirmed | ATA operational facts | Why ATA; About | REQUIRES ATA CONFIRMATION |

**Model-level insight:** at launch, ATA will have *no reviews, no ratings, and no published guarantees*. The trust burden therefore shifts to: (1) verified identity, (2) precise and honest content (the researched Asmara/Massawa facts), (3) process transparency (§11 status language), and (4) media authenticity. This is achievable without a single unverified claim — and it is the differentiator against the reference's fabricated-proof approach.

---

## 7. Homepage Customer Journey

Recommended tour-first homepage hierarchy, first screen to footer. Pattern basis: SRC-UI-001 (primary), SRC-UI-002 (trust strip and catalog patterns). Direction basis: SRC-OWN-001 (enquiry action near top; flagship focus). Each zone lists: purpose · customer question answered · required content · required proof · primary CTA · mobile behavior · classification (Required / Adaptable / Deferred / Replaced).

### 7.1 Header and navigation — **Required**
- **Purpose:** orientation, credibility, persistent access to the request action.
- **Answers:** "Where am I, and how do I act when ready?"
- **Required content:** ATA identity; short nav (Home, Flagship Tour, About/Why ATA, FAQ, Contact); persistent request CTA button.
- **Proof:** ATA-verified brand and contact details (V-004 — never Visit Eritrea identity).
- **Primary CTA:** "Request to Book" (persistent, header-right; label per §18.4 rules).
- **Mobile:** hamburger menu; CTA remains visible outside the menu (SRC-UI-001 mobile keeps "Book Now" visible — adopt pattern, replace label).
- **Notes:** utility bar (phone/email) adaptable once contacts verified; language selector deferred (KB `ui_requirements`).

### 7.2 Hero — **Required**
- **Purpose:** emotional arrival + immediate statement that ATA sells one exceptional tour.
- **Answers:** "Is this for me, and what is the one thing offered?"
- **Required content:** homecoming-register headline (direction from SRC-UI-001 "Welcome Home to Eritrea" — final copy is WP-02 DRAFT); one-sentence value proposition naming the flagship candidate; real Eritrea photography.
- **Proof:** licensed, authentic imagery (V-011). No stock/AI substitutes.
- **Primary CTA:** "View the Tour" (scroll/link to flagship summary) + secondary "Request a Consultation."
- **Mobile:** headline ≤2 lines at 320px; CTA pair stacked, thumb-reachable; image art-directed for portrait crop.
- **Classification:** Required; hero copy Replaced (reference copy not publishable as-is).

### 7.3 Primary flagship-tour action — **Required**
- **Purpose:** satisfy SRC-OWN-001's mandate: enquiry action near the top.
- **Answers:** "How do I act right now without reading everything?"
- **Required content:** compact action row directly under hero: flagship name + duration + "Request availability" button. This is the top-of-page conversion shortcut for returning/referred visitors (§8.3, §8.6).
- **Proof:** none beyond verified flagship identity — the row makes no factual claims.
- **Primary CTA:** "Request Availability."
- **Mobile:** becomes the anchor for the sticky CTA bar (§10.2).

### 7.4 Trust indicators strip — **Required (content Replaced)**
- **Purpose:** fast credibility scan before scrolling.
- **Answers:** "Can I trust this company at a glance?"
- **Required content:** 3–4 icon claims ATA can substantiate. Candidates (each REQUIRES ATA CONFIRMATION): "Based in Asmara" (if verified), "Real human support," "Request-based booking — no automatic charges," "Established [year]" (if verified).
- **Proof:** every claim maps to a T-row in §6 with evidence on file.
- **Replaced:** "Licensed Guides," "Best Price Guarantee," "24/7 Support," "Safe & Reliable" (V-006).
- **Mobile:** 2×2 grid or horizontal scroll (SRC-UI-001 mobile pattern).

### 7.5 Flagship summary block — **Required**
- **Purpose:** sell the one tour on the homepage itself — image, name, subtitle, 3–4 facts, 3 highlights, price posture, CTA.
- **Answers:** "What exactly is the tour, and is it worth my time to read more?"
- **Required content:** flagship card (SRC-UI-001 featured-card pattern, single card treatment); duration fact; route fact; honest price posture per placeholder policy (§12.3).
- **Proof:** all facts REQUIRE ATA CONFIRMATION before publication (V-001, V-009).
- **Primary CTA:** "See Full Itinerary" → detail page.
- **Mobile:** full-width card; facts as icon row (SRC-UI-004 facts-row pattern).

### 7.6 Destination content — **Adaptable**
- **Purpose:** context and discovery; SEO surface for "Asmara" / "Massawa" queries.
- **Answers:** "Where would I actually go?"
- **Required content:** Phase 1: Asmara and Massawa cards only, with researched, cited descriptions (§5.4). Other reference destinations (Dahlak, Keren, Nakfa, Qohaito, Filfil — SRC-UI-001) deferred: publishing them implies operational reach ATA hasn't confirmed.
- **Proof:** research citations for descriptions; no operational claims.
- **Primary CTA:** each card links into the relevant flagship itinerary day.
- **Mobile:** horizontal scroll cards (SRC-UI-001 mobile pattern).

### 7.7 Experience categories — **Deferred**
- Reference shows 10 icon categories (SRC-UI-001). Defer: with one tour, categories navigate nowhere and imply breadth ATA hasn't confirmed. Revisit at ~4 packages.

### 7.8 Why ATA — **Required**
- **Purpose:** carry the trust burden that absent reviews cannot (§6 model-level insight).
- **Answers:** "Who is behind this, and why should I hand them my trip?"
- **Required content:** honest company story; named response owner; physical presence; how ATA works (request → human confirmation). All facts REQUIRE ATA CONFIRMATION.
- **Primary CTA:** "Request a Consultation."
- **Mobile:** short paragraphs, scannable; photo of real office/team if licensed (V-011).

### 7.9 Testimonials / trust evidence — **Deferred until evidence exists**
- Reference shows 4.9/126 + named reviews (V-008) — **Rejected** for launch. Until real evidence exists, this zone is omitted entirely (placeholder policy §12.3 prohibits empty-shell "reviews coming soon"). When ATA supplies verifiable testimonials, reinstate using the SRC-UI-003 card pattern.

### 7.10 FAQ preview — **Required**
- **Purpose:** objection handling and enquiry-volume reduction (SOW §3.1: reduce repetitive questions).
- **Required content:** 4–5 highest-objection FAQs (from §6: booking process, payment expectations, safety, family suitability, cancellation) with ATA-approved answers.
- **Primary CTA:** "View all FAQs" + "Ask a question."
- **Mobile:** accordion (SRC-UI-004 pattern).

### 7.11 Final CTA section — **Required**
- **Purpose:** close the page for readers who consumed everything.
- **Required content:** emotional recap line + request CTA; SRC-UI-003 "Ready to Experience Eritrea?" pattern with request-based language replacing "Book Your Adventure Now" (V-005).
- **Primary CTA:** "Request to Book the Tour."

### 7.12 Footer — **Required (content Adapted)**
- ATA-verified contacts only (V-004); quick links; legal links once policies exist (T-08); newsletter Deferred (KB Phase 1 mapping). No Visit Eritrea artifacts.

### 7.13 Zone order summary (mobile-first)

Header → Hero → Flagship action row → Trust strip → Flagship summary → Destinations (Asmara/Massawa) → Why ATA → FAQ preview → Final CTA → Footer. (Experience categories and testimonial zones deferred as above.)

---

## 8. Acquisition-Source Journeys

Context: SRC-OWN-001 — the website alone will not generate customers; campaigns, diaspora communities, and referrals are the expected sources. Each journey: entry → first message → trust-building → flagship review → request action → confirmation state → ATA follow-up expectation, with abandonment points (AP) and mitigations.

### 8.1 Social-media campaign visitor
- **Entry:** campaign creative → flagship detail page (recommended landing; not homepage) — almost certainly mobile.
- **First message:** flagship identity + subtitle must match the ad's promise within one screen (message-match discipline for WP-02 campaign copy).
- **Trust:** facts row → gallery (authentic imagery, T-12) → highlights.
- **Review:** itinerary skim via anchor nav (§10.4).
- **Action:** sticky CTA → availability request (§11.4 short form).
- **Confirmation:** immediate on-screen state + expectation of ATA reply window (§11).
- **APs & mitigations:** slow load on mobile data → performance budget (Codex); price shock/absence → honest price posture visible before form (§12.3); form length → progressive-disclosure short form (§11 shared base fields).

### 8.2 Direct / branded visitor
- **Entry:** homepage via typed URL or business card.
- **Journey:** hero → trust strip → flagship summary → detail page → request.
- **APs:** flights-era expectations from prior site (P-01) — returning customers may seek ticketing. Mitigation: a clearly-signposted secondary path to ATA's other services contact (without making it the primary journey; SRC-OWN-001), handled in nav/footer, not the hero.

### 8.3 Diaspora-community referral
- **Entry:** WhatsApp/Telegram/Facebook message from family or community — the highest-trust, highest-value channel (SRC-OWN-001).
- **First message:** arrives pre-trusted; needs *confirmation*, not persuasion: the page must match what the referrer described.
- **Action:** fastest path to a human — "Request a callback" prominence matters most here.
- **APs:** broken/ugly link previews → Open Graph metadata for the flagship page (Codex); mismatch between referrer's verbal price and site posture → consistent "price on request" until V-001 resolves.
- **Note:** lightweight share function on the flagship page directly serves this loop (§3.3 wishlist/share row).

### 8.4 Shared package link
- Same dynamics as 8.3 but colder (forwarded beyond first-degree trust). The flagship page must self-introduce ATA briefly (one-line "who is ATA" strip with link to Why ATA) since these visitors never see the homepage. AP: no company context on detail page → add the strip.

### 8.5 Search-engine visitor
- **Entry:** queries like "Eritrea tour," "Asmara Massawa tour," "visit Asmara" → flagship page or destination content (§7.6).
- **Trust:** content accuracy is the differentiator — the corrected UNESCO framing (V-010) and cited destination facts earn authority that thin competitor content cannot.
- **APs:** arriving on a destination page with no route to the tour → every destination block links into the flagship itinerary; unverifiable claims → placeholder policy discipline.

### 8.6 Returning visitor
- **Entry:** direct return after prior research or an earlier request.
- **Journey:** hero → flagship action row (§7.3) shortcut → request or status enquiry.
- **APs:** can't find previous request status → confirmation emails must carry a reference ID and ATA contact (§11); nothing changed since last visit → content freshness owned by ATA via admin (P-07, Codex to verify capability).

---

## 9. Flagship Tour Detail Structure

Recommended Phase 1 content order for the working flagship candidate page, derived from SRC-UI-003 (desktop) and SRC-UI-004/005 (mobile). The desktop layout may place the booking/request card in a right rail (SRC-UI-003); the order below is the canonical mobile/single-column sequence. Every row carries a provenance label for its *content* (structure is YK Systems recommendation throughout).

| # | Section | Content basis | Provenance label | Notes |
|---|---|---|---|---|
| 9.1 | Package identity + short promise (name, subtitle) | KB `raw_copy.flagship` | REFERENCE COPY → DRAFT YK SYSTEMS COPY in WP-02 | Name itself REQUIRES ATA CONFIRMATION (flagship candidate status) |
| 9.2 | Badge/status ("Most Popular") | SRC-UI-003/004 | REQUIRES ATA CONFIRMATION | Omit at launch — no data supports it. Schema keeps nullable badge field |
| 9.3 | Facts row: duration, route | SRC-UI-003/004 facts | REQUIRES ATA CONFIRMATION | 5 Days / 4 Nights is reference data until ATA confirms |
| 9.4 | Audience suitability ("All Ages") | SRC-UI-004 | REQUIRES ATA CONFIRMATION + REQUIRES RESEARCH | Replace blanket claim with specific guidance (§4.3, T-10) |
| 9.5 | Difficulty / physical expectations | SRC-UI-003/004 | REQUIRES ATA CONFIRMATION + REQUIRES RESEARCH | "Easy" must be substantiated per-day (escarpment drive, walking, boat) |
| 9.6 | Gallery | SRC-UI-003/004/005 | REQUIRES ATA CONFIRMATION | Real licensed media only (V-011); launchable with 8–12 strong images |
| 9.7 | Summary (short) | KB `raw_copy.flagship.summary` | REFERENCE COPY → WP-02 redraft | |
| 9.8 | Long overview | KB `raw_copy.flagship.overview` | REFERENCE COPY → WP-02 redraft + REQUIRES RESEARCH | Must drop "UNESCO-like" (V-010) for researched wording |
| 9.9 | Highlights (5–7) | KB `raw_copy.flagship.highlights` | REFERENCE COPY; each highlight REQUIRES ATA CONFIRMATION | Each highlight is an operational promise (V-009) |
| 9.10 | Day-by-day itinerary (5 days) | KB `flagship_itinerary` | REFERENCE COPY; REQUIRES ATA CONFIRMATION per line | Structure is the core reusable component (§3.3) |
| 9.11 | Pricing presentation | SRC-UI-003/004 tiers + estimate | REQUIRES ATA CONFIRMATION (V-001) | Launch posture: price-on-request pattern (§12.3) unless ATA confirms model |
| 9.12 | Dates & availability language | SRC-UI-003 date selector | REQUIRES ATA CONFIRMATION | Launch posture: preferred-window input in request form; "ATA confirms availability personally" |
| 9.13 | Inclusions | KB `raw_copy.flagship.included` | REQUIRES ATA CONFIRMATION (V-009) | |
| 9.14 | Exclusions | KB `raw_copy.flagship.not_included` | REQUIRES ATA CONFIRMATION | Lower risk (exclusions protect ATA) but still confirm |
| 9.15 | Packing guidance | KB `raw_copy.flagship.packing` | REQUIRES RESEARCH | Validate against climate facts; low commercial risk |
| 9.16 | Best time to visit | SRC-UI-003/004 "October–April" | REQUIRES RESEARCH + REQUIRES ATA CONFIRMATION | Conflicts with summer-homecoming strategy (V-014) — resolve before publishing |
| 9.17 | Important information | SRC-UI-004 "View Important Information" | REQUIRES ATA CONFIRMATION + REQUIRES RESEARCH | Entry/visa/safety orientation; flag legal-adjacent wording for professional review |
| 9.18 | Policies (cancellation/refund) | SRC-UI-003 "Free cancellation up to 7 days" | REQUIRES ATA CONFIRMATION (V-007) — legal review | Never publish reference term; omit section until real policy exists, with process transparency in FAQ instead |
| 9.19 | Reviews / testimonial evidence | SRC-UI-003/004/005 rating + quotes | REQUIRES ATA CONFIRMATION (V-008) | Hidden at launch (§7.9) |
| 9.20 | FAQs | KB `raw_copy.flagship.faqs` (questions only) | Questions: REFERENCE COPY (good); Answers: REQUIRES ATA CONFIRMATION / RESEARCH | |
| 9.21 | Request-based booking CTA block | SRC-UI-003 booking card | Structure reuse; language DRAFT YK SYSTEMS COPY | Request language rules §18.4; "Secure Your Spot Now" rejected (V-005) |
| 9.22 | Final conversion section | SRC-UI-003/004/005 final CTA | DRAFT YK SYSTEMS COPY | Request-based replacement for "Book Your Adventure Now" |

**APPROVED SOURCE FACT count in this structure: zero.** No commercial or operational claim in the reference pack currently meets the evidence bar. This is expected at WP-01 stage and is the central launch dependency (§16).

---

## 10. Mobile Conversion Sequence

The mobile page is the primary experience (KB `ui_requirements.Mobile experience`; §8.1 campaign traffic). Basis: SRC-UI-004/005 single-column sequence, strengthened.

1. **Above the fold (first viewport):** flagship name, subtitle (≤2 lines), hero image, facts row (duration · route · difficulty), primary request CTA. The visitor can act without scrolling (SRC-UI-004 shows this pattern with "Book This Tour" — adopt structure, replace label).
2. **Sticky CTA bar:** after the visitor scrolls past the first CTA, a slim persistent bar shows [flagship name · price posture · "Request Availability"]. References repeat the CTA only twice (SRC-UI-004: after itinerary, page end); a sticky bar outperforms repetition and is standard mobile conversion practice. Suppress while a form is open.
3. **Section order:** identity → facts → CTA → highlights → gallery preview → overview → anchor bar → itinerary (sequential, day cards) → inclusions/exclusions → packing → best time → difficulty → important info → FAQs → final CTA (per §9 order, reviews omitted at launch).
4. **Anchor navigation:** horizontally scrollable tab bar (Overview · Itinerary · Inclusions · FAQ) pinned below the header once reached (SRC-UI-004/005 pattern); Reviews tab appears only when evidence exists. Anchors must not trap scroll; accessible focus management required (KB `ui_requirements.Detail navigation`).
5. **Price and availability placement:** price posture appears (a) in sticky bar, (b) in the request block after itinerary — *after* context, never as a bare number before the visitor knows what it buys (SRC-UI-004 places tiers after the full itinerary; adopt this sequencing).
6. **Form entry points:** every CTA opens the same request sheet (bottom sheet or dedicated page) pre-set to the relevant request type; no CTA navigates away from context without return.
7. **Scannability:** every section ≤4 lines before a break; checklists over paragraphs (SRC-UI-003 inclusion checklists scan well); day cards collapsed to title + first two items with expand.
8. **Image/gallery behavior:** lazy-loaded, swipeable gallery; "+N photos" pattern (SRC-UI-004) acceptable; hard performance budget on hero image (Codex owns budget figures).
9. **Confirmation states:** full-screen confirmation after any request — what was received, reference ID, what happens next, expected response window, ATA contact fallback (§11). Never a toast that can be missed.
10. **Return-to-tour and contact options:** confirmation screen offers "Back to the tour" and "Contact ATA directly" (verified channels only — V-004).

---

## 11. Request and Availability Flow

Phase 1 booking control (SOW; KB V-005): five request types, all human-confirmed by ATA. **No automatic payment, no live inventory, no automatic booking confirmation is designed here.** Preliminary note: existing enquiry/quote APIs and email/SMS/WhatsApp helpers may be reusable (P-06 — Codex to verify).

**Shared base fields (all request types):** name · contact channel + detail (email/phone/WhatsApp) · preferred contact language (optional) · message (optional) · consent acknowledgement. Progressive disclosure: start with the base, add type-specific fields.

**Shared status principle:** every submission returns a reference ID, a plain-language statement of what the request *is and is not*, an expected ATA response window (REQUIRES ATA CONFIRMATION of real capacity — T-09), and a fallback contact channel.

### 11.1 General information request
- **Intent:** "Tell me more before I commit to anything."
- **Minimum fields:** base fields + question text.
- **Optional:** how they heard about ATA (attribution — feeds SRC-OWN-001 distribution strategy).
- **Consent:** contact-use acknowledgement.
- **Status language:** "Your question has been received."
- **Confirmation message:** question received · reference ID · response window · no obligation created.
- **ATA notification:** routed to named response owner (owner identity REQUIRES ATA CONFIRMATION — §16).
- **Next step:** ATA replies on chosen channel.
- **Misleading-language risk:** low; avoid implying instant/24-7 response (V-006).

### 11.2 Consultation / callback request
- **Intent:** "I want to talk to a human before deciding." (Primary CTA for homecoming and confidence-needing segments — §4.2, §4.6.)
- **Minimum fields:** base + preferred call window + time zone.
- **Optional:** group size; topic.
- **Consent:** contact-use acknowledgement.
- **Status language:** "Your callback request has been received."
- **Confirmation:** when ATA will attempt contact; what to prepare; how to reschedule.
- **ATA notification:** with the caller's stated window and time zone prominent.
- **Next step:** ATA calls/messages within the stated window.
- **Risk:** promising windows ATA can't meet across time zones — window copy REQUIRES ATA CONFIRMATION.

### 11.3 Quote request
- **Intent:** "What would this cost for my party?" (Resolves V-001 pressure honestly while pricing is unconfirmed.)
- **Minimum fields:** base + party size (adults/children) + preferred travel window (month-level).
- **Optional:** tier interest (only if tiers are ever confirmed — V-001); special requirements.
- **Consent:** acknowledgement that the quote is prepared personally and is not an automatic price.
- **Status language:** "Your quote request has been received — ATA will prepare a personal quote."
- **Confirmation:** what the quote will include; response window; validity posture set by ATA.
- **ATA notification:** full party/window detail.
- **Next step:** ATA sends quote; quote validity/terms REQUIRE ATA CONFIRMATION.
- **Risk:** any auto-displayed number becomes a de facto price (V-001). Show no computed totals.

### 11.4 Booking request
- **Intent:** "I want to take this tour — start the process."
- **Minimum fields:** base + party size + preferred travel window + acknowledgement checkbox (see consent).
- **Optional:** flexibility on dates; special requirements; how they heard about ATA.
- **Consent (critical):** explicit checkbox: *"I understand this is a booking request, not a confirmed booking. ATA will contact me to confirm availability, price, and details before anything is final. No payment is taken now."* (Wording DRAFT YK SYSTEMS COPY; flag for ATA/professional review — T-08, T-13.)
- **Status language:** "Booking request received — pending ATA confirmation." Never "booked," "confirmed," or "reserved."
- **Confirmation:** restates non-confirmed status; reference ID; ATA's next contact step and window; note that no payment has been taken.
- **ATA notification:** highest priority routing; response-time expectation is a business commitment (T-09).
- **Next step:** ATA confirms availability and price personally; conversion to confirmed booking happens **off-platform in Phase 1** via ATA's own process (process REQUIRES ATA CONFIRMATION).
- **Risk:** highest of all flows. "Book Now"-style language (V-005) or a payment field would convert this into a false transaction. Prohibited-claims list §18.4 governs.

### 11.5 Provisional seat-reservation request
- **Intent:** "Hold a place for me while details are finalized."
- **Minimum fields:** base + party size + preferred travel window/departure (if departures ever exist — V-001/V-009) + acknowledgement checkbox.
- **Optional:** hold-duration preference.
- **Consent (critical):** explicit: *"A provisional reservation request asks ATA to hold availability if possible. It is not a guaranteed seat and creates no payment obligation. ATA will confirm whether a hold is possible and for how long."* (DRAFT — ATA/professional review.)
- **Status language:** "Provisional reservation request received — ATA will confirm whether a hold is possible."
- **Confirmation:** explicitly states no seat is guaranteed; ATA response window; reference ID.
- **ATA notification:** priority routing with capacity implications flagged.
- **Next step:** ATA confirms hold possibility, duration, and any conditions — all REQUIRE ATA CONFIRMATION (capacity is undefined — §16).
- **Risk:** "Secure Your Spot Now" (SRC-UI-003, V-005) is the exact anti-pattern: it converts a hold *request* into an implied guarantee. This flow should be **feature-flagged off at launch** unless ATA defines a real hold process (§18.4).

### 11.6 Flow-level requirements
- One shared form engine, five presets (Codex handoff §18.4).
- All submissions persist with type, timestamp, status, and reference ID; visible in admin (P-07 — Codex to verify fit).
- Confirmation email/message mirrors the on-screen state (channel infra P-06 — Codex to verify).
- No request type ever displays a price, seat count, or date as *available* — availability statements are exclusively ATA's, post-request.

---

## 12. Content and Evidence Requirements

### 12.1 Evidence rules recap

Five status labels govern every content item (Work Brief; KB `source_of_truth_rules`): REFERENCE COPY · DRAFT YK SYSTEMS COPY · REQUIRES RESEARCH · REQUIRES ATA CONFIRMATION · APPROVED SOURCE FACT (only with genuine evidence). Research facts about Eritrea never validate ATA operational claims (§6 boundary; approval instruction 6).

### 12.2 Minimum viable launch content (required addition B)

The smallest complete content set for one credible flagship launch:

**Launch-critical (cannot launch without):**
1. Confirmed flagship identity: final name, duration, route (V-001/V-009; currently candidate only).
2. ATA-confirmed day-by-day itinerary — every line operationally deliverable (V-009).
3. ATA-confirmed inclusions and exclusions (V-009).
4. Pricing posture: either a confirmed price/model **or** the approved price-on-request pattern (§12.3) — never reference numbers (V-001).
5. Working request flows: information, consultation, quote, booking request — with confirmation states and ATA notification (§11).
6. Verified ATA business identity and contact details site-wide (V-004).
7. Honest trust strip + Why ATA content from confirmed facts (V-006, T-01).
8. 8–12 licensed, authentic images covering hero, Asmara, escarpment/route, Massawa (V-011).
9. Corrected Asmara description with accurate UNESCO framing, cited (V-010).
10. Payment-expectation statement (no online payment; ATA confirms personally) (T-14).
11. Difficulty/suitability statement ATA stands behind (V-009, T-10).
12. Mobile-tested page meeting §10 sequence.

**High priority (launch week, not launch-blocking):**
- 8–10 ATA-approved FAQ answers (§9.20); best-time guidance after V-014 resolution; packing list (researched); Asmara/Massawa destination blurbs (cited); interim policies statement (honest process description while formal policy is drafted — T-08).

**Useful after launch:**
- Expanded gallery; additional destination content (Keren, Dahlak — research-backed); About-page depth; blog/SEO content; attribution analytics refinement.

**Deferred (Phase 1 exclusions):**
- Reviews/ratings system (until evidence — V-008); package tiers (until V-001 resolves); date selectors implying inventory; newsletter; wishlist; multilingual; payments; 15-package catalog (V-012); provisional-hold flow if ATA defines no hold process (§11.5).

### 12.3 Placeholder policy for staging and launch (required addition C)

**Principle:** a placeholder must state the *truthful status of information*, never simulate the information itself. Placeholders that could mislead are prohibited.

| Situation | Approved placeholder pattern | Prohibited pattern |
|---|---|---|
| Price unconfirmed (V-001) | "Price on request — submit a quote request and ATA will prepare a personal quote." | Any number: "From $850," "$450–$3,000," sample tiers |
| Dates/departures unconfirmed | "Departure dates are confirmed personally by ATA. Tell us your preferred travel window." | Date pickers implying open inventory; "Next departure: …" |
| Availability unknown | "Submit a request and ATA will confirm availability." | "Only X seats left," "Secure your spot now" (V-005) |
| Reviews absent (V-008) | Omit the section entirely. | Star ratings, "reviews coming soon" shells, sample quotes |
| Guarantees unapproved (V-006) | Omit. | "Best price guarantee," "24/7 support," "free cancellation" (V-007) |
| Suppliers unconfirmed (V-009) | Generic truthful phrasing: "accommodation arranged by ATA" *only if ATA confirms it arranges accommodation.* | Named hotels, boat operators, restaurants |
| Cancellation policy absent (V-007) | "Cancellation terms are provided by ATA with your quote/confirmation." (interim; flag for professional review) | Any specific term |
| Imagery unlicensed (V-011) | Fewer, real images; text-led sections. | Stock/AI imagery presented as Eritrea/ATA reality |
| Team/credentials unconfirmed (V-006) | "You'll deal directly with ATA's team in Asmara" *only if verified.* | "Licensed guides," named staff without consent |
| Capacity/holds undefined | Hide provisional-reservation flow (feature flag). | "Reserve your seat" |

**Staging rule:** staging may show placeholder *patterns* with clearly-marked TODO status labels visible to reviewers, but any environment ATA might share externally follows the same no-misleading rule.

---

## 13. Conflict and Verification Register

Entries V-001–V-012 originate in KB v0.1 (authoritative register owned by ChatGPT/Delivery Lead). V-013+ are **proposed additions from WP-01** for Delivery Lead adoption. Repo-based entries are PRELIMINARY CLAUDE OBSERVATIONS pending Codex verification.

| ID | Item | Conflicting content / observation | Risk | Temporary treatment | Required resolution |
|---|---|---|---|---|---|
| V-001 | Flagship price | $850 homepage vs $450 catalog vs tiers $450–$3,000 (SRC-UI-001/002/003/004) | High | Price-on-request pattern (§12.3); no numbers anywhere | ATA defines real pricing model and whether tiers exist |
| V-002 | Dahlak package identity/price | Two names; $1,250 vs $900 (SRC-UI-001/002) | High | Not published (Phase 1 out of scope) | ATA confirmation if/when package activates |
| V-003 | Asmara City Explorer price | $75 vs $25 (SRC-UI-001/002) | High | Not published | ATA confirmation if/when activated |
| V-004 | Brand identity/contacts | Visit Eritrea logo, +291 1 123 456, info@visiteritrea.com (SRC-UI-001–005) | High | Never reproduced in any ATA surface | ATA-approved identity and verified contact set |
| V-005 | Booking language | "Book Now," "Book This Tour," "Secure Your Spot Now" (SRC-UI-001–005) | High | Replaced by request-based CTA rules (§18.4) | ATA approval of request-language set (WP-02 drafts) |
| V-006 | Guarantees/credentials | "Licensed Guides," "Best Price Guarantee," "24/7 Support," "Safe & Reliable" (SRC-UI-001/002) | High | Omitted; substitute trust strip (§7.4) | Documentary/operational evidence per claim |
| V-007 | Cancellation policy | "Free cancellation up to 7 days" (SRC-UI-003) | High | Omitted; interim process statement (§12.3); flagged for professional review | ATA-approved cancellation/refund terms |
| V-008 | Reviews/rating | 4.9/126; Daniel H., Selam M., Yonas T. quotes (SRC-UI-003/004/005) | High | Section omitted at launch | Real, evidenced testimonials with consent |
| V-009 | Tour facts/activity availability | All itinerary lines, "All Ages," "Easy," hotels, boat, snorkeling, entrance fees (SRC-UI-003/004/005) | High | All labeled REQUIRES ATA CONFIRMATION (§9) | ATA supplier/operational confirmation per item |
| V-010 | UNESCO wording | "UNESCO-like architecture of Asmara" (SRC-UI-003/004) | Medium | Phrase banned; researched replacement in WP-03 | Research with primary citation; the reference wording appears to understate a verifiable heritage listing — WP-03 must confirm with primary sources before any replacement wording is drafted |
| V-011 | Media ownership | Professional/apparently AI-generated imagery throughout references | High | No reference image ships; §12.3 imagery rule | Licence/consent audit; ATA-supplied authentic media |
| V-012 | Catalog scale | 15 concepts vs one-tour Phase 1 (SRC-UI-002; SRC-OWN-001) | Medium | Catalog unpublished; card/grid kept as template | Owner direction stands: 1 now, ~4 later |
| V-013 *(proposed — PRELIMINARY)* | Flights-first repo posture | Homepage metadata "Air tickets…," `/flights` route, flights-led services copy (P-01/P-02/P-08) | High | No code change in WP-01; recorded for Codex | Codex reuse-vs-rebuild decision; YK Systems approval of route/copy treatment |
| V-014 *(proposed)* | Season strategy conflict | SRC-OWN-001: summer homecoming is a key opportunity **vs** SRC-UI-003/004: "Best time: October–April" | High | Neither claim published | Research (coastal summer climate reality) + ATA seasonal-operations decision; possibly two honest seasonal framings |
| V-015 *(proposed — PRELIMINARY)* | Seeded package prices | Repo seed data $299/$599/$899/$1,499 generic packages (P-04) conflicts with both reference tiers and no-unverified-price rule | High | No code change; must not surface publicly | Codex confirms exposure; data replaced by §18.4 model when implemented |
| V-016 *(proposed — PRELIMINARY)* | Existing placeholder testimonials | Initials-only testimonials in `lib/data.ts` (P-05) — same class as V-008 | Medium | Recorded for Codex | Remove/gate at implementation |
| V-017 *(proposed — PRELIMINARY)* | Payment routes vs request-based control | Stripe create/webhook routes present (P-03) | High | No code change; no UI may reach payment in Phase 1 | Codex confirms reachability; disable/flag until a payment phase is approved |
| V-018 *(proposed)* | "All Ages Welcome" vs water-activity risk | SRC-UI-004 claims all-ages suitability while itinerary includes boat excursion + snorkeling (SRC-UI-003 Day 4) | Medium | Blanket claim not published; specific per-activity guidance drafted in WP-02 | ATA safety posture + activity-risk research (WP-03); flag safety wording for professional review |

---

## 14. Preliminary Recommendations

1. **Adopt the reference structure, reject its facts.** The SRC-UI pack is a genuinely strong conversion skeleton (early CTA, anchor nav, sequential itinerary, checklist blocks, FAQ accordion). Phase 1 should reuse it structurally per §3.3 and repopulate content through the WP-02 matrix. (SRC-UI-001–005; SRC-OWN-001 reuse directive.)
2. **Launch trust on honesty, not social proof.** With reviews, guarantees, and credentials all unverified, the trust system is: verified identity + precise researched content + process transparency + authentic media (§6). This is sufficient for launch and differentiates ATA from fabricated-proof competitors.
3. **Resolve pricing posture early.** Price is the top pre-enquiry question (T-03) and the reference's worst conflict (V-001). If ATA cannot confirm a model quickly, launch confidently with the quote-request pattern — it is honest and conversion-viable — rather than delaying launch for pricing (supports SRC-OWN-001 speed goal).
4. **Treat the summer/season conflict (V-014) as a strategy decision, not a copy detail.** It affects campaign timing, the "best time" section, and the homecoming positioning itself. Escalate to YK Systems/ATA with the WP-03 climate research attached.
5. **Feature-flag the provisional-reservation flow off at launch** unless ATA defines a real hold process (§11.5). Four request types are enough to launch.
6. **Keep the flagship page self-sufficient** (mini "who is ATA" strip, Open Graph metadata) because referral and campaign traffic lands there directly and may never see the homepage (§8.1, §8.3, §8.4).
7. **Build every content field verification-aware** (§18.4): unverified fields render nothing rather than placeholders-as-facts. This lets ATA's confirmations flow to production without redesign — the reconciliation of "publish quickly" with "no unsupported facts" (SRC-OWN-001).
8. **Do not carry the 17-city global destination grid into the tour-first site** (P-08; PRELIMINARY — Codex to verify render locations). Phase 1 destination content is Asmara + Massawa.

---

## 15. Inputs Required From Codex

WP-01 findings for Codex verification (Codex owns the authoritative repository, architecture, route, component, and reuse-versus-rebuild audit; nothing below is an implementation decision):

1. Verify preliminary observations P-01–P-08 (§3.4) and adopt/reject proposed register entries V-013, V-015, V-016, V-017 (§13).
2. Reuse-vs-rebuild verdicts needed by WP-02/WP-04 planning:
   - Package model & admin CRUD (P-04/P-07) versus the §18.4 content model — extend or replace?
   - Enquiry/quote APIs + email/SMS/WhatsApp helpers (P-06) versus the §11 five-type request flow — extend or replace?
   - `/flights` route and flights-first metadata treatment options (retain-demoted / redirect / remove) for YK Systems decision (V-013).
   - Stripe route reachability and the cleanest Phase 1 disablement (V-017).
3. Confirm feature-flag capability for: reviews, tiers, provisional-reservation flow, package catalog cards, newsletter (§18.4).
4. Confirm Open Graph/metadata control per page for the referral journey (§8.3–8.4).
5. Provide mobile performance budgets (LCP target, image budget) that §10 must design within.
6. Confirm staging environment approach consistent with the §12.3 staging rule.

---

## 16. Inputs Required From YK Systems or ATA

Launch-critical confirmations (full clarification list is WP-04 scope; these are the WP-01 top set):

| # | Confirmation needed | Register ref |
|---|---|---|
| 1 | Final flagship identity: is Asmara–Massawa Signature Tour confirmed as the Phase 1 package (name, 5D/4N, route)? | V-001, V-009 |
| 2 | Real pricing model: fixed price, ranges, tiers or quote-only; currency; per-person vs group | V-001 |
| 3 | Departure model: fixed dates, on-request scheduling, frequency, capacity | V-009, V-014 |
| 4 | Itinerary confirmation line-by-line, including boat excursion and snorkeling operability | V-009, V-018 |
| 5 | Inclusions/exclusions confirmation | V-009 |
| 6 | Booking process reality: what happens after a booking request; payment expectations; who responds and in what window | V-005, T-09, T-14 |
| 7 | Cancellation/refund rules (for professional review before publication) | V-007 |
| 8 | Media: what authentic photography ATA owns or can commission; licences/consents | V-011 |
| 9 | Real testimonials/trust evidence, if any exist, with consent | V-008 |
| 10 | Verified business identity set: legal name, address, phone(s), email, social accounts, named response owner | V-004, T-01 |
| 11 | Seasonal strategy decision after climate research: summer homecoming vs October–April framing | V-014 |
| 12 | Audience confirmation: diaspora/homecoming as the stated primary audience for positioning | SRC-OWN-001 |
| — | Also required from YK Systems: ATA owner conversations / intake material (Work Brief input 5) has not been supplied to Claude; SRC-OWN-001 summarizes it but source material would strengthen WP-02 Why-ATA and FAQ drafting | — |

---

## 17. Recommended Next Work Package

**WP-02 — Content Model and Draft Copy** (per Work Brief): build `ATA_FLAGSHIP_CONTENT_MATRIX_v0.1.md` and `ATA_DRAFT_COPY_DECK_v0.1.md` on this document's §9 structure, five-label discipline, §12.3 placeholder patterns, and §18.4 CTA rules — so that draft copy exists for every section the moment ATA confirmations arrive.

**Run WP-03 (Research Queue) in parallel** where it unblocks WP-02: the UNESCO correction (V-010), climate/seasonality (V-014), and destination descriptions are needed *inside* the copy deck. WP-04 (clarifications draft) should follow immediately after, harvesting §16 directly.

---

## 18. Closing Register

### 18.1 Executive summary

WP-01 analyzed the five Visit Eritrea references (SRC-UI-001–005), the SOW v0.9, the knowledge base v0.1, the delivery workbook, and recorded owner direction (SRC-OWN-001) to define how ATA's Phase 1 one-tour launch system should work. Conclusion: the reference pack supplies an excellent conversion *structure* — tour-first homepage, early CTA, sequential mobile itinerary, checklist content blocks — and an unusable *fact layer*: every price, review, guarantee, policy, credential, and image is unverified, and several conflict internally. The recommended system reuses the structure (§3.3), rebuilds trust on verified identity + researched accuracy + process transparency (§6), converts all booking actions to five request-based flows with explicit non-confirmation language (§11), and launches on a minimum viable content set (§12.2) with truthful placeholders (§12.3). Zero items currently qualify as APPROVED SOURCE FACT; the launch path therefore runs through the §16 ATA confirmations. The working Phase 1 flagship candidate remains the Asmara–Massawa Signature Tour, derived from ATA's supplied reference templates and pending ATA confirmation.

### 18.2 Top ten launch-critical findings

1. No commercial or operational claim in the reference pack meets the evidence bar — zero APPROVED SOURCE FACTs exist today (§9).
2. The flagship price is internally contradictory across references ($450–$3,000 spread) and must launch as price-on-request unless ATA confirms a model (V-001).
3. All booking language in the references implies confirmation and inventory that don't exist; request-based replacement language is mandatory (V-005, §11).
4. The reviews/rating block is fabricated social proof and must be omitted, not imitated (V-008).
5. The trust strip's four claims are all unverifiable; an honest substitute strip is defined (V-006, §7.4).
6. "UNESCO-like architecture" is banned wording; WP-03 research is expected to support stronger, accurate wording, pending primary-source verification (V-010).
7. A genuine strategy conflict exists between summer-homecoming positioning and the reference's October–April best-time claim (V-014) — decision required, not copywriting.
8. Reference imagery cannot ship (ownership/authenticity — V-011); 8–12 authentic licensed images are a launch-critical dependency (§12.2).
9. The existing repository is flights-first with reachable payment routes and sample-priced seed packages — directly conflicting with Phase 1 strategy (PRELIMINARY; V-013/V-015/V-017, Codex to verify).
10. The existing enquiry/quote/admin infrastructure may cover much of the §11 request system — a significant reuse opportunity (PRELIMINARY; P-06/P-07, Codex to verify).

### 18.3 Top ten ATA confirmations required

Condensed from §16: (1) flagship identity; (2) pricing model; (3) departure/capacity model; (4) itinerary line-by-line; (5) inclusions/exclusions; (6) booking-process reality incl. payment expectations and response owner; (7) cancellation/refund terms; (8) authentic media and licences; (9) real testimonials with consent, if any; (10) verified business identity set. Plus the seasonal-strategy decision (V-014) and audience confirmation.

### 18.4 Codex implementation handoff (required addition D)

**Content model fields (Package entity — all fact fields nullable, publication-gated):**

- `name`, `slug`, `status` (draft / pending_verification / published)
- `badge` (nullable — unpublished until criteria verified, §9.2)
- `subtitle`, `summary`, `overview`
- `facts`: `durationDays`, `durationNights`, `route[]`, `suitability` (nullable), `difficulty` (nullable)
- `highlights[]` — each with `verificationState`
- `itineraryDays[]`: `{ day, title, items[], image (nullable), verificationState }`
- `priceModel` enum: `on_request` (default) / `fixed` / `range` / `tiered`; `tiers[]` nullable; `currency` nullable
- `departureModel` (nullable): fixed_dates / on_request; `capacity` nullable
- `included[]`, `excluded[]`, `packing[]` — verification-stated
- `bestTime` (nullable — blocked on V-014)
- `importantInfo` (nullable), `policies` (nullable — blocked on V-007)
- `faqs[]`: `{ question, answer, status }` — unanswered FAQs never render
- `media[]`: `{ asset, licenceStatus, consentStatus }` — unlicensed media never renders
- `reviews[]` — behind feature flag, empty at launch (V-008)
- Enquiry/Request entity: `type` (info / consultation / quote / booking_request / provisional_hold), base fields (§11), `referenceId`, `status`, `submittedAt`, `attributionSource` (nullable)

**Required UI states:** every fact-bearing component has a verified-render and an unverified-render (omit or truthful-placeholder per §12.3 — never sample data); price block renders `on_request` pattern by default; reviews/tiers/date-picker/hold-flow render nothing when flagged off; request forms have submitted/confirmation states per §11 with reference ID.

**CTA language rules:** Allowed verbs: *Request, Enquire, Ask, Check availability (only with "ATA will confirm" reassurance), Plan, View, See.* Prohibited: *Book Now, Book This Tour, Secure Your Spot, Reserve Now, Buy, Pay, Instant, Guaranteed, Confirmed* (as CTA or status), and any countdown/scarcity device. Status vocabulary: "received," "pending ATA confirmation," "ATA will contact you" — never "booked/confirmed/reserved" pre-confirmation.

**Form-flow requirements:** one shared form engine with five presets (§11); progressive disclosure from base fields; mandatory acknowledgement checkboxes on booking-request and provisional-hold flows (wording from WP-02, ATA/professional review); no payment fields anywhere; admin notification routing per type with priority on booking requests; confirmation email/message mirrors on-screen state.

**Mobile requirements:** §10 sequence is normative — above-the-fold CTA, sticky CTA bar (suppressed during form entry), pinned anchor nav, price-after-context, full-screen confirmations, lazy media, performance budget (Codex to set figures).

**Prohibited claims (hard blocklist):** Licensed Guides · Best Price Guarantee · 24/7 Support · Safe & Reliable (as a badge) · Free cancellation · any star rating or review count · any price from the reference pack · "Most Popular" · "All Ages Welcome" (blanket) · Visit Eritrea identity, domain, phone, or email · any named supplier before confirmation.

**Unresolved dependencies:** V-001 pricing; V-007 policy; V-009 itinerary/suppliers; V-011 media; V-014 seasonality; ATA identity set (V-004); response-owner/window (T-09); hold-process definition (§11.5).

**Nullable/unpublished-until-verified fields:** price, tiers, currency, dates, capacity, supplier names, hotel names, badge, suitability, bestTime, policies, reviews, response-time promises.

**Feature-flag or hide until verified:** reviews module · package tiers · date selector · provisional-hold flow · package catalog cards beyond the flagship · newsletter · wishlist/share (pending Codex cost check) · any payment path (must be unreachable in Phase 1 — V-017).

### 18.5 Recommended WP-02 for Claude

WP-02 — Content Model and Draft Copy (§17): flagship content matrix + draft copy deck, five-label discipline, WP-03 research running in parallel for the copy-blocking facts (UNESCO, climate/seasonality, destination descriptions).

### 18.6 Files created or modified

| File | Action |
|---|---|
| `03 Content and Assets/ATA_REFERENCE_CONTENT_UX_ANALYSIS_v0.1.md` | Created (this document) |
| `03 Content and Assets/` | Folder created |
| Application code, routes, components, production content, databases, deployment configuration | **Not modified** (per WP-01 controls) |

---

*End of ATA_REFERENCE_CONTENT_UX_ANALYSIS_v0.1 — YK Systems internal working draft. Not ATA-approved. No content herein is publication-approved.*
