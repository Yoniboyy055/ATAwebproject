# Dashboard-Ready Content Recommendation Matrix — Claude WP-03 v0.1

**Purpose:** present WP-03 research so an ATA administrator can enter approved values through the owner dashboard, and so Codex can import them without redesign.
**Constraint honoured:** this proposes **no change to the Codex database architecture**. Every row maps onto the existing verification-envelope pattern (nullable value + public flag + evidence state + source ID + checker + timestamp) and the existing publication states.

**Display column:** `DISPLAY` = render once published · `HIDDEN` = withhold until approved · `PLACEHOLDER` = show the approved truthful-status pattern meanwhile.

| # | Recommended field | Public title | Public value (proposed) | Evidence source | Review date | Pub. eligibility | ATA approver | Display |
|---|---|---|---|---|---|---|---|---|
| D-01 | `destination.asmara.summary` (M-07) | Asmara | "Eritrea's highland capital at about 2,325 m — a planned modernist city whose historic centre UNESCO inscribed on the World Heritage List in 2017." | UNESCO list 1550; elevation multi-source | +24 mo | Conditional | Required | HIDDEN → DISPLAY on confirm |
| D-02 | `destination.massawa.summary` (M-07) | Massawa | "Eritrea's historic Red Sea port — an old town built from coral stone, layered with Ottoman, Egyptian and Italian history." | Eritrean MoI; multiple | +36 mo | **Eligible** | Required | DISPLAY on sign-off |
| D-03 | `tour.overview` → `{UNESCO_statement}` (M-18) | — | "In 2017 UNESCO inscribed Asmara's historic centre on the World Heritage List as *Asmara: A Modernist African City* — Eritrea's first World Heritage site, recognising the whole planned city rather than individual buildings." | UNESCO list 1550; decision 41 COM 8B.11 | +24 mo | Conditional | Required | HIDDEN → DISPLAY on confirm |
| D-04 | `tour.overview` → `{altitude_change}` (M-18) | — | "about 2,300 metres" | Derived from verified elevations | +60 mo | **Eligible** | Required | DISPLAY on sign-off |
| D-05 | `tour.factsRow.route` context (M-13) | Route | "Highland plateau (~2,325 m) to Red Sea coast (sea level)" | Multi-source elevation | +60 mo | **Eligible** | Required | DISPLAY on sign-off |
| D-06 | `tour.bestTime` (M-25) | Climate | Two-climate frame (climate brief §7.1) — states Asmara and Massawa conditions separately, makes no seasonal recommendation | FAO; climate aggregators | +36 mo | Conditional | Required | HIDDEN → DISPLAY on sign-off |
| D-07 | `tour.bestTime.recommendation` (M-25) | Best time to visit | **No value proposed** | — | — | **Blocked** | ATA decision V-014 | HIDDEN |
| D-08 | `tour.packing.intro` (M-24) | Packing | "Pack for two climates: cool highland evenings in Asmara, and hot coastal days in Massawa." | Climate brief | +36 mo | **Eligible** | Required | DISPLAY on sign-off |
| D-09 | `tour.difficulty` contribution (M-15) | Difficulty | "The escarpment drive is a long stretch in the vehicle, with continuous curves and a sustained descent." | Geographic sources | +36 mo | Conditional | Required | HIDDEN — one input to an ATA-owned statement |
| D-10 | `tour.importantInfo.altitude` (M-26) | Altitude | "Asmara sits at about 2,325 m — most visitors take a day to adjust." | Elevation verified; adjustment is general knowledge | +24 mo | Conditional | Required + **professional review** | HIDDEN |
| D-11 | `tour.importantInfo.permits` (M-26) | Travel permits | **No value proposed** — finding recorded only | Tier-4 travel sources; unofficial | +6 mo | **Blocked** | Required + **verification** | HIDDEN |
| D-12 | `itinerary.day2.sites` descriptive layer (M-20) | — | Fiat Tagliero (1938, Giuseppe Pettazzi); Cinema Impero (1937, Mario Messina); Lombard-Romanesque cathedral; Medeber artisan quarter; Harnet Avenue | Univ. of Manchester; Domus; Archnet; Wikipedia; Atlas Obscura | +36 mo | Conditional | Required — each site must actually be visited | HIDDEN per line |
| D-13 | `itinerary.day3.title/summary` (M-20) | Down the escarpment | "The drive from Asmara to the coast, descending roughly 2,300 metres through switchbacks and changing country." | Verified elevations; geographic sources | +36 mo | Conditional | Required | HIDDEN → DISPLAY on confirm |
| D-14 | `destination.massawa.condition` (M-18/M-26) | — | Honest condition disclosure (Massawa fact sheet §2) | Multiple; war-damage sources | **+12 mo** | Conditional | Required — ATA knows ground truth | HIDDEN |
| D-15 | `tour.price` (M-21) | Price | **No value** | — | — | **Blocked** | ATA (V-001) | **PLACEHOLDER** — "Price on request" |
| D-16 | `tour.departures` (M-22) | Dates | **No value** | — | — | **Blocked** | ATA (V-009/V-014) | **PLACEHOLDER** — "Departures confirmed personally by ATA" |
| D-17 | `media[]` (M-03/M-16) | — | **No value** | — | — | **Blocked** | ATA (V-011 licence/consent) | HIDDEN |
| D-18 | `faqs[F-05]` road comfort | Are the roads safe and comfortable? | Geometry half only ("long mountain descent, continuous curves"); **safety/comfort half is ATA's** | Geographic sources | +24 mo | Conditional | Required + professional review | HIDDEN |

## Evidence detail — claim traceability, confidence and limitations

Keyed to the same `D-` identifiers. This is the companion half of the matrix above: it carries the **source claim IDs**, **confidence** and **limitations** for every row, so an administrator entering a value can trace it back to the verified-claims register rather than taking the wording on trust. Split into two tables only for readability — together they record all ten required fields per item.

| # | Source claim IDs (verified-claims register) | Confidence | Limitations |
|---|---|---|---|
| D-01 | U-01, U-02, C-04 | High | UNESCO wording via search extract, not verbatim capture; publication precondition CD-01 |
| D-02 | MW-01, MW-03, MW-04, MW-05 | High (architecture/history) | Massawa is thinly covered by primary institutional sources; several findings rest on state media and secondary travel sources |
| D-03 | U-01, U-02, U-05, U-06, U-11, U-12 | High | Verbatim phrasing unconfirmed; precondition CD-01 |
| D-04 | ES-02 (derived from ES-01 / C-04) | High | Arithmetic derivation, clearly marked as such |
| D-05 | ES-01, C-04 | High | None material |
| D-06 | C-01, C-02, C-03 (structure); C-05–C-11 (monthly) | High (structure, FAO) · Medium to Medium-High (monthly) | Aggregator baseline periods unstated; averages are not forecasts — publish rounded, never decimals |
| D-07 | — | — | No value proposed; ATA decision V-014 |
| D-08 | C-05, C-06, C-09, C-10 | Medium to Medium-High | Climate averages; packing *list* remains ATA operational content |
| D-09 | ES-04 | Medium | Sourced from a military-geography description; "hundreds of hairpin bends" is not a publishable count |
| D-10 | C-04 (elevation), C-12 (adjustment) | High (elevation) · Medium (physiological) | **Health-adjacent**; the adjustment framing is general altitude knowledge, not Eritrea-specific evidence |
| D-11 | TR-01 | Medium | **Tier-4 sourcing only**; no official government source reachable. High operational impact — verify before any use |
| D-12 | AS-07, AS-08, AS-09, AS-11, AS-12, AS-14 | High (AS-07, AS-08, AS-11, AS-14) · Medium (AS-09, AS-12) | Cathedral date rejected (AS-10) — omit; cathedral name is an ATA choice (A-04); access to every site is unverified (AS-13) |
| D-13 | ES-02, ES-03, ES-04 | High (elevation/terrain) | Journey **duration** deliberately excluded — ES-06 rejected as unreliable |
| D-14 | MW-07, MW-08 | Medium-High | **Time-sensitive**; ATA holds current ground truth; 12-month review |
| D-15 | — | — | No value; ATA pricing decision V-001 |
| D-16 | — | — | No value; ATA departures/capacity, V-009 / V-014 |
| D-17 | — | — | No value; ATA media licensing and consent, V-011 |
| D-18 | ES-04 (geometry); ES-08 (blocked) | Medium (geometry) · none (safety) | Research answers only the geometry half; safety and comfort are unsourceable externally and remain ATA's |

## Administrator guidance (proposed, no architecture change)

For each row an ATA administrator would: paste the public value, set the evidence state to the highest justified level, record the source ID and review date, set the public flag, and — separately — trigger the authorised release action. Rendering still requires all three conditions from the Codex model (non-null value + public flag + approved-for-publication) plus release.

**Recommended admin-side ordering:** D-02, D-04, D-05, D-08 first — these are the fully-eligible, low-risk rows and would let a real page render honest content immediately. D-01/D-03 follow the moment UNESCO wording is confirmed. D-07, D-11, D-15, D-16, D-17 stay blocked until ATA decisions and evidence arrive.

**Not proposed:** any new table, column, enum value, or migration. If ATA later wants a structured `sourceUrl` + `reviewDate` pair surfaced in the dashboard UI for these rows, that is a Codex decision, not a Claude one — flagged for their consideration only.
