# UNESCO and Asmara Heritage Research Brief — Claude WP-03 v0.1

**Status:** Internal YK Systems research — **not ATA-approved; no wording herein is publication-released**
**Purpose:** replace the banned reference phrase "UNESCO-like architecture of Asmara" (V-010) with precise, defensible wording.
**Naming note:** filenames use the `ATA_CLAUDE_WP03_` prefix to avoid collision with Codex's separate `ATA_WP03_*` technical package already in Drive `02 Discovery`.

---

## 1. Verification limitation — read first

**`whc.unesco.org` could not be fetched directly from this environment.** Every direct request (WebFetch and curl, multiple paths: `/en/list/1550/`, `/en/decisions/6883/`, `/en/urban-heritage-atlas/asmara/`) returned HTTP 403/502. The agent proxy reported healthy with no relay failures, so the block is at the destination. Britannica, Wikipedia, climate-data.org and the World Bank climate portal were likewise unfetchable.

**Consequence:** the UNESCO facts below were obtained from **search-engine extracts of UNESCO's own pages** plus corroborating institutional sources (EU EEAS, UCL, Eritrean Ministry of Information). They are consistent across independent sources and I assess them as high confidence — but they are **not** verbatim primary-source quotations captured by me.

**Therefore:** before any UNESCO wording is published, YK Systems or ATA must open `https://whc.unesco.org/en/list/1550/` and confirm the exact official phrasing. Every claim below carries this as a publication precondition. I have not marked any UNESCO claim as fully primary-source verified, because I did not achieve that.

---

## 2. Verified factual propositions

| ID | Proposition | Confidence | Basis |
|---|---|---|---|
| U-01 | The official inscription name is **"Asmara: A Modernist African City"** | High | UNESCO list page title; corroborated by EEAS, UCL, Eritrean MoI |
| U-02 | Inscribed on the World Heritage List in **2017**, at the **41st session** of the World Heritage Committee, held in **Kraków, Poland** | High | UNESCO decision 41 COM 8B.11; corroborated |
| U-03 | Inscription date reported as **8 July 2017** (session ran 2–12 July 2017) | Medium-High | UCL; Eritrean MoI. Exact date should be confirmed on the UNESCO page |
| U-04 | It is a **cultural** property, World Heritage **reference number 1550** | High | UNESCO list URL `/en/list/1550/` and page classification |
| U-05 | Inscribed under criteria **(ii)** and **(iv)** | High | UNESCO decision 41 COM 8B.11 |
| U-06 | It is the **first World Heritage site in Eritrea** | High | EEAS; UCL; Eritrean MoI |
| U-07 | Described as **Africa's first modernist World Heritage site** | Medium | UCL and press. Phrase is a characterisation, not necessarily UNESCO's own wording — treat as attributed, not official |
| U-08 | The inscribed property covers approximately **480 hectares** and contains roughly **4,300 surveyed historical buildings** | Medium-High | Search extract of UNESCO/nomination material. Confirm before publishing figures |
| U-09 | The property extends from **Abba Shawel** (north) to **Gejeret and Tiravolo** (south), and from the **escarpment edge** (east) to **"Forto" and the Italian cemetery** (west) | Medium | Search extract of UNESCO/nomination material |
| U-10 | A **buffer zone** surrounds the property, following urban fabric and natural features up to surrounding hilltops and the escarpment edge | Medium | Same |
| U-11 | The city's planned form results from successive planning phases between **1893 and 1941** under Italian colonial occupation | High | UNESCO brief-synthesis extract |
| U-12 | The urban layout is **mainly an orthogonal grid**, later integrating **radial** elements | High | UNESCO brief-synthesis extract; criterion (iv) text |
| U-13 | UNESCO's official description explicitly records that the planning process was based on **functional *and racial* zoning** | High | UNESCO brief-synthesis extract — see §5, handle with care |
| U-14 | Criterion (ii) rests on Asmara being an outstanding example of the **transposition of planning ideas into an African context**, with modernist/rationalist forms drawing on **local morphologies, construction methods, materials, skills and labour** | High | UNESCO criterion text extract |
| U-15 | Criterion (iv) rests on the urban layout bearing **exceptional witness to early-20th-century urban planning applied in an African context** | High | UNESCO criterion text extract |

**Limited direct quotation** (UNESCO brief synthesis, as returned in search extract — verify verbatim before use):
> "The modernist city of Asmara, capital of Eritrea, is an outstanding example of a colonial capital that bears witness to the universal encounter with modernity in the 20th century and consequent postcolonial experiences."

---

## 3. What the designation does and does not cover — the core correction

The reference mockup's "UNESCO-like architecture of Asmara" is wrong in two directions at once: it **understates** the actual status (Asmara genuinely holds World Heritage inscription — "-like" is a needless hedge) while being **vague enough to imply** something unverified.

The accurate position:

- **The designation is urban, not building-by-building.** What is inscribed is the *historic urban landscape* — a planned city as a whole, its layout, zoning and coherent building stock within a defined perimeter. It is emphatically **not** a list of individually certified monuments.
- **Individual buildings are contributing elements**, not separately inscribed sites. Fiat Tagliero, Cinema Impero and the Cathedral sit *within* the inscribed property and contribute to its value; none is "a UNESCO site" in its own right.
- **The property has boundaries.** Areas of Asmara outside the ~480 ha perimeter are not part of the inscription, and the buffer zone is a protective layer, not part of the property.
- **Inscription is a heritage-protection status, not a quality rating, safety rating, or endorsement of any business.**

---

## 4. Proposed wording (DRAFT — Claude synthesis, ATA approval required)

### 4.1 Technically precise (for Important Information / About)
> "Asmara's historic centre is inscribed on the UNESCO World Heritage List as *Asmara: A Modernist African City* (inscribed 2017, criteria ii and iv). The inscription recognises the planned modernist city as a whole — its early-20th-century urban layout and its coherent stock of rationalist and modernist buildings — rather than listing individual buildings separately."

### 4.2 Concise customer-facing (hero-adjacent / destination card, ≤2 lines)
> "Asmara's historic centre is a UNESCO World Heritage Site — inscribed in 2017 as *Asmara: A Modernist African City*."

Shorter variant for tight mobile space:
> "A UNESCO World Heritage city centre, inscribed in 2017."

### 4.3 Extended educational (overview / long-form)
> "In 2017, UNESCO inscribed Asmara's historic centre on the World Heritage List as *Asmara: A Modernist African City* — Eritrea's first World Heritage site. What UNESCO recognised is unusual: not a single monument, but an entire planned city. Laid out in successive phases between 1893 and 1941, Asmara combines an orthogonal street grid with later radial elements, and preserves a coherent, largely intact ensemble of early modernist and rationalist architecture — cinemas, workshops, churches, mosques, offices and homes built with modern materials but relying on local craft, labour and building traditions. Walking Asmara is walking the inscribed property itself."

### 4.4 Prohibited / high-risk wording

| Do not use | Why |
|---|---|
| "UNESCO-like architecture" | Inaccurate and self-undermining; understates real status while implying something unverified (V-010) |
| "UNESCO-approved tour" / "UNESCO-endorsed" / any UNESCO logo | Falsely implies UNESCO endorses ATA. UNESCO endorses no commercial operator |
| "UNESCO-listed buildings" (of Fiat Tagliero, Cinema Impero, the Cathedral, etc.) | Individual buildings are contributing elements, not separate inscriptions |
| "All of Asmara is a UNESCO World Heritage Site" | The property is a bounded ~480 ha historic perimeter, not the whole municipality |
| "UNESCO World Heritage Site of Eritrea" (implying the country) | The property is Asmara's historic centre |
| "UNESCO-certified guides" | No such UNESCO certification exists for guides |
| Using World Heritage status to imply safety, quality, or service standards | Inscription is a heritage protection status only |

### 4.5 Publication preconditions
1. Confirm exact official name, year, criteria and any quoted phrasing against `whc.unesco.org/en/list/1550/`.
2. Confirm the 480 ha / 4,300 buildings figures before publishing any number, or omit the numbers (the wording works without them).
3. UNESCO name/emblem usage: **no UNESCO logo or emblem may be used.** Textual reference to inscription status is normal practice; emblem use is restricted. If ATA wants any emblem, that requires professional/legal review and UNESCO permission — flag, do not assume.

---

## 5. Cultural-sensitivity note (Claude synthesis — recommend ATA review)

UNESCO's own description of the property records that Asmara's planning was based on **functional *and racial* zoning** (U-13). The inscribed heritage is therefore explicitly colonial heritage, including its segregationist planning.

This matters for a diaspora-facing product. Recommended posture:

- Do not romanticise the colonial period or credit Italy alone for the city. UNESCO's criterion (ii) itself emphasises **local morphologies, construction methods, materials, skills and labour** — Eritrean hands built it.
- Avoid framings like "a slice of Italy in Africa" or "Little Rome," which erase Eritrean agency and can read as celebratory of colonisation to the exact audience ATA is courting.
- Preferred framing: an Eritrean city that absorbed, adapted and now stewards a modernist inheritance — with Eritrean labour and craft named, and the indigenous quarter (Abba Shawel) acknowledged as part of the inscribed property.
- Any historical narration touching colonisation, occupation or the independence struggle should be reviewed by ATA (and ideally an Eritrean cultural reviewer) before publication.

**This is a recommendation on tone, not a verified fact.** ATA owns the final voice.

---

## 6. Field mapping (for later Codex import — no architecture change proposed)

| Proposed content | Suggested Codex/matrix target | Publication eligibility |
|---|---|---|
| §4.2 concise wording | Destination content field — Asmara (WP-02 matrix **M-07**) | Conditional — after primary-source confirmation |
| §4.1 precise wording | `importantInfo` envelope (**M-26**) | Conditional — same |
| §4.3 extended wording | Tour `overview` envelope (**M-18**), replacing the "UNESCO-like" slot `{UNESCO_statement}` | Conditional — same |
| §4.4 blocklist | Codex prohibited-claims blocklist (WP-02 contract §18.4 equivalent) | Immediate — safety control, not customer content |

---

## 7. Sources

- [Asmara: A Modernist African City — UNESCO World Heritage Centre](https://whc.unesco.org/en/list/1550/) *(not directly fetchable; accessed via search extract)*
- [UNESCO World Heritage Centre — Decision 41 COM 8B.11](https://whc.unesco.org/en/decisions/6883/) *(same)*
- [UNESCO World Heritage Centre — Urban Heritage Atlas: Asmara](https://whc.unesco.org/en/urban-heritage-atlas/asmara/) *(same)*
- [Asmara is officially a UNESCO World Heritage site — EU EEAS](https://www.eeas.europa.eu/node/29545_en)
- [Helping secure Asmara's UNESCO World Heritage status — UCL](https://www.ucl.ac.uk/impact/case-studies/2022/apr/helping-secure-asmaras-unesco-world-heritage-status)
- [Asmara's Upgraded Status: Honour and Responsibility — Eritrea Ministry of Information](https://shabait.com/2017/07/29/asmaras-upgraded-status-honour-and-responsibility/)
- [Asmara: Africa's Modernist City (UNESCO World Heritage Nomination) — The Journal of Architecture](https://www.tandfonline.com/doi/abs/10.1080/13602365.2016.1276093)
