# Source Manifest — Claude WP-03 v0.1

**Inputs consumed by WP-03**

| # | Input | Type | Location | Use |
|---|---|---|---|---|
| 1 | YK Systems WP-03 task brief | Instruction | This session | Scope, controls, deliverable list |
| 2 | `ATA_REFERENCE_CONTENT_UX_ANALYSIS_v0.1.md` (WP-01) | Internal deliverable | Repo `03 Content and Assets/` @ `ea65b7a` | Conflict register V-001–V-018; research queue targets |
| 3 | `ATA_COPY_CONTRACT_MAPPING_v0.1.md` (WP-02) | Internal deliverable | Repo `03 Content and Assets/` @ `ea65b7a` | Marker set; publication gating; evidence classes |
| 4 | `ATA_FLAGSHIP_CONTENT_MATRIX_v0.1.md` (WP-02) | Internal deliverable | Repo `03 Content and Assets/` @ `ea65b7a` | Field IDs M-01–M-38 for mapping |
| 5 | `ATA_DRAFT_COPY_DECK_v0.1.md` (WP-02) | Internal deliverable | Repo `03 Content and Assets/` @ `ea65b7a` | Research-blocked slots; voice/register |
| 6 | Codex WP-02/WP-03 Drive records | External agent deliverables | Drive `02 Discovery` | Content model, publication states, request lifecycle (context only — not modified) |
| 7 | SRC-OWN-001 owner direction | Project record | WP-01 §3.2 | Summer-homecoming opportunity (V-014 input) |
| 8 | SRC-UI-003/004/005 reference itinerary | Reference images | WP-01 source register | Which sites and claims needed researching |
| 9 | External sources S-01–S-39 | Web research | See source-citation register | All factual claims |

**Outputs produced by WP-03:** 19 deliverables, all in repo `02 Discovery/` on branch `claude/wp03-verified-destination-claims-research`, prefixed `ATA_CLAUDE_WP03_` to avoid collision with Codex's separate `ATA_WP03_*` package already present in Drive `02 Discovery`.

**Not consumed / not available:** ATA owner conversations and intake material (still not supplied — noted since WP-01); Codex branch source `lib/ata/workflow.ts` (not in this repository); official Eritrean government pages for permits and road status (not reachable).

**Files not modified — confirmation:** no Codex implementation file, no Supabase object, no infrastructure, no `prisma/` schema or migration, no `app/`, `lib/` or `components/` source file, and no ATA price or operational data was created, edited or deleted by WP-03. The only repository writes were new Markdown research documents plus one administrative manifest update carried over from WP-02 closure (`2453c19`).
