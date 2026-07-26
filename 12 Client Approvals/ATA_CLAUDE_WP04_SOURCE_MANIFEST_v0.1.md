# Source Manifest — Claude WP-04 v0.1

**Inputs consumed by WP-04**

| # | Input | Type | Location | Use |
|---|---|---|---|---|
| 1 | YK Systems WP-04 task brief | Instruction | This session | Scope, ten approved governance decisions, legacy disposition, controls |
| 2 | `ATA_CLAUDE_WP03_VERIFIED_CLAIMS_REGISTER_v0.1.md` | Claude deliverable | `02 Discovery/` @ `7ab88e9` | 57 claims → owner approval register |
| 3 | `ATA_CLAUDE_WP03_UNESCO_ASMARA_HERITAGE_BRIEF_v0.1.md` | Claude deliverable | `02 Discovery/` | UNESCO preconditions and prohibited wording |
| 4 | `ATA_CLAUDE_WP03_ERITREA_CLIMATE_SEASONALITY_BRIEF_v0.1.md` | Claude deliverable | `02 Discovery/` | Two-climate frame; V-014 basis |
| 5 | `ATA_CLAUDE_WP03_PROHIBITED_HIGH_RISK_CLAIMS_REGISTER_v0.1.md` | Claude deliverable | `02 Discovery/` | Prohibited-language check in the publication checklist |
| 6 | `ATA_CLAUDE_WP03_DASHBOARD_CONTENT_RECOMMENDATION_MATRIX_v0.1.md` | Claude deliverable | `02 Discovery/` | Field-level publication eligibility |
| 7 | `ATA_CLAUDE_WP03_REMAINING_ATA_DECISION_REGISTER_v0.1.md` | Claude deliverable | `02 Discovery/` | Carried into the consolidated decisions register |
| 8 | Asmara / Massawa / escarpment fact sheets | Claude deliverables | `02 Discovery/` | Site-by-site confirmation lists |
| 9 | `ATA_WP03D_OWNER_DASHBOARD_ARCHITECTURE_v0.1.md` | Codex deliverable | `docs/…/wp03d/` | Dashboard model; versioning; approver/releaser separation |
| 10 | `ATA_WP03D_PRICING_AVAILABILITY_MODEL_v0.1.md` | Codex deliverable | `docs/…/wp03d/` | Pricing states and types used verbatim in the worksheet |
| 11 | `ATA_WP03D_PLACEHOLDER_BEHAVIOR_SPECIFICATION_v0.1.md` | Codex deliverable | `docs/…/wp03d/` | Approved placeholder wording |
| 12 | `ATA_WP03D_TABLE_RISK_DISPOSITION_MATRIX_v0.1.md` | Codex deliverable | `docs/…/wp03d/` | Legacy `packages` disposition; RLS finding |
| 13 | `ATA_WP03D_SUPABASE_PROJECT_INVENTORY_v0.1.md` | Codex deliverable | `docs/…/wp03d/` | Staging project identity and state |
| 14 | `ATA_WP03D_ROLLBACK_BACKUP_PLAN_v0.1.md` | Codex deliverable | `docs/…/wp03d/` | Legacy export-and-hash requirement |
| 15 | `ATA_WP03D_STAGING_OWNERSHIP_TRANSFER_PLAN_v0.1.md` | Codex deliverable | `docs/…/wp03d/` | Unnamed custody roles → A-34–A-41 |
| 16 | `ATA_WP03C_OPEN_OWNER_DECISIONS_v0.1.md` | Codex deliverable | `docs/…/wp03c/` | Cross-checked against the consolidated register |
| 17 | `lib/ata/authorization.ts` | Implementation | Repo @ `7ab88e9` | Six roles and permissions — role matrix mirrors this, does not invent |
| 18 | `lib/ata/content-contract.ts` | Implementation | Repo @ `7ab88e9` | Per-state customer wording; prohibited phrases; editorial-marker detection |
| 19 | `lib/ata/workflow.ts` | Implementation | Repo @ `7ab88e9` | 15-state request lifecycle |
| 20 | Four legacy `packages` rows | Live data (described) | Supabase `ldvnzevwsfpcsilkegck` | Disposition record. **Read from the brief; the database was not accessed** |

## Not consumed / not available

- **The four legacy records were not read from Supabase.** Their content is taken from the WP-04 brief and the Codex table matrix. No Supabase connection was made, per repository controls.
- ATA owner intake material — still not supplied (open since WP-01).
- `whc.unesco.org` — still HTTP 403 to this environment.
- Official Eritrean permit and road-status sources — not reachable.
- Supplier documents, costing sheets, licences, media — none supplied.

## Outputs

26 deliverables in `12 Client Approvals/` on `claude/wp04-owner-content-approval-pack`, prefixed `ATA_CLAUDE_WP04_` and version-suffixed `_v0.1` to avoid collision with Codex's `ATA_WP03*` packages and to prevent same-name Drive upload collisions.

## Files not modified — confirmation

No application code, no `prisma/` schema or migration, no Supabase object, no authentication configuration, no infrastructure, no user, and no ATA operational data was created, edited or deleted. No migration was executed. Nothing was published. The diff is Markdown-only, confined to a new directory.
