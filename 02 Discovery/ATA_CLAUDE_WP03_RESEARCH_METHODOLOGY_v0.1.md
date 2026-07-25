# Research Methodology — Claude WP-03 v0.1

**Status:** Internal YK Systems record
**Baseline:** `ea65b7a` · Branch `claude/wp03-verified-destination-claims-research`

---

## 1. Scope discipline

WP-03 researched exactly five topics, all externally verifiable:

1. Precise UNESCO wording relevant to Asmara
2. Eritrea climate and seasonality relevant to V-014
3. Source-backed Asmara destination descriptions
4. Source-backed Massawa destination descriptions
5. Accurate characterisation of the Asmara–Massawa escarpment and journey

**Nothing ATA-specific was researched, inferred, or decided.** Prices, pricing model, dates, availability, capacity, accommodation, transport arrangements, inclusions, exclusions, cancellation, refunds, payment, booking guarantees, customer promises, testimonials, and staffing/operational capability were all treated as out of scope and remain ATA-only. Where research touched the boundary — e.g. whether a boat excursion runs, how long the drive takes, whether the museum is open — the finding is recorded as **operational, ATA-only**, and no value was supplied.

## 2. Process

1. **Question framing** — each of the five topics was decomposed into specific factual propositions capable of being true or false, rather than open-ended browsing.
2. **Source seeking** — highest-tier source attempted first (UNESCO, FAO, World Bank, national institutions), descending only when higher tiers were unreachable or silent.
3. **Corroboration** — every material claim was sought from at least two independent sources. Single-source claims are marked as such and confidence-capped.
4. **Confidence assignment** — per §4 below, based on source tier, corroboration, and directness of access.
5. **Separation of layers** — every output distinguishes verified external fact, limited direct quotation, Claude synthesis, and proposed marketing wording.
6. **Boundary marking** — anything requiring ATA confirmation, professional/legal review, or an owner decision is labelled with the WP-02 marker set.
7. **Adversarial pass** — each proposed wording was re-read asking "how could a customer reasonably feel misled by this?" Findings from that pass produced the prohibited-claims register and the Massawa condition disclosure.

## 3. Tooling limitation — material and honestly reported

**Direct page fetching was unavailable in this environment.** Every attempt (`WebFetch` and `curl`, multiple user agents) returned HTTP 403 or 502 for `whc.unesco.org`, `britannica.com`, `en.wikipedia.org`, `climateknowledgeportal.worldbank.org`, and `climate-data.org`. The agent proxy reported healthy with no relay failures, so the blocking is at the destinations.

**Web search worked.** Search returns substantive content extracts from those same authoritative pages, and those extracts are the evidentiary basis for much of this package.

**What this means, stated plainly:**
- I could not capture **verbatim primary-source text** with certainty. Where a quotation appears, it is marked as a search-returned extract requiring verbatim confirmation.
- Facts corroborated across multiple independent sources are still assessed high confidence — that is a legitimate research standard.
- **No claim in this package is marked as fully primary-source verified**, because I did not achieve that standard. The confidence column reflects what I actually did, not what I would have preferred to do.
- Load-bearing wording — above all the UNESCO statement — carries a **publication precondition** that a human confirm it against the primary URL.

This limitation is the single biggest qualifier on the package and is repeated in each brief rather than buried here.

## 4. Confidence scale

| Level | Meaning |
|---|---|
| **High** | Multiple independent sources agree; source tier 1–3; claim is stable over time |
| **Medium-High** | Authoritative-source content reached via search extract, corroborated, no contradiction found |
| **Medium** | Single good source, or multiple secondary sources agreeing; plausible and uncontradicted |
| **Low-Medium** | Sourced but with known weakness (algorithmic source, wide variance between sources, or contested) |
| **Low** | Found but unreliable — recorded so it is not reused, not for publication |
| **Rejected** | Found and actively distrusted; recorded with the reason |

## 5. What research does not do

Research findings **do not become approved ATA content**. This package produces *recommendations with evidence*. Nothing here was inserted into production content, no repository implementation file was modified, no Codex architecture was touched, no database or infrastructure was changed, and no ATA operational data was created or edited.

Publication requires, per copy class: ATA factual confirmation, YK Systems editorial approval, and — for legal-, safety- or health-adjacent wording — professional review.
