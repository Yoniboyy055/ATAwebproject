# Control Manifest — Claude WP-04 v0.1

**Purpose:** single list of every control this package operates under, and evidence of compliance.

---

## 1. Repository controls

| Control | Compliance |
|---|---|
| Work only on `claude/wp04-owner-content-approval-pack` | ✅ Sole branch used |
| Use the corrected authoritative baseline | ✅ `7ab88e9`, verified against the stated hash before any work |
| Documentation only | ✅ All changes are `.md` in a new directory |
| Do not modify application code | ✅ No file under `app/`, `lib/`, `components/`, `scripts/`, `styles/`, `public/` touched |
| Do not modify Prisma | ✅ `prisma/` untouched |
| Do not modify Supabase | ✅ No connection opened; no MCP Supabase tool called |
| Do not execute migrations | ✅ None executed |
| Do not create users | ✅ None created |
| Do not configure authentication | ✅ Not touched |
| Do not publish unapproved content | ✅ Nothing published; every deliverable is internal or owner-facing |
| Do not merge without explicit approval | ✅ Draft PR only |

## 2. Content and publication controls

| Control | Compliance |
|---|---|
| Do not invent a price | ✅ No figure proposed. Worksheet is blank; placeholders offered instead |
| Do not infer operational capacity | ✅ No date, capacity or availability figure supplied |
| Preserve UNESCO preconditions | ✅ Dedicated register restates all 14 gated claims plus the quotation |
| Merge ≠ publication approval | ✅ Stated in the merge commit, the UNESCO register, the research register and the executive brief |
| APPROVED SOURCE FACT remains zero | ✅ Published as zero in four documents |
| Booking control — request-based only | ✅ No confirmation, payment or guarantee language anywhere |
| Prohibited-language discipline | ✅ Reproduced as a checklist gate |
| No legal conclusions | ✅ 24 items routed to professional review with no substitute text drafted |
| Working flagship candidate wording | ✅ Treated as a candidate pending ATA confirmation (A-01, T-01) |

## 3. Authority controls

| Control | Compliance |
|---|---|
| ATA controls business facts | ✅ Every fact field shows ATA as business owner and approver |
| YK Systems is not the approver of ATA business facts | ✅ Stated explicitly; matrix shows `YK_TECHNICAL_ADMINISTRATOR` without `content:approve` |
| Only ATA may confirm a customer request | ✅ `request:confirm` shown as ATA-only, including exclusion of the Operations Manager |
| Approval and release are separate acts | ✅ Documented throughout; divergence from code flagged to Codex |
| Roles mirror the implementation | ✅ Six roles and nine permissions taken from `lib/ata/authorization.ts`, not invented |

## 4. Legacy data controls

| Control | Compliance |
|---|---|
| Classify as NON-AUTHORITATIVE LEGACY SEED DATA | ✅ All four, by name |
| Back up exactly | ✅ Required before any schema change, with hash |
| Keep in the technical archive | ✅ Retention required; period is an ATA decision |
| Not approved as current products | ✅ Stated |
| Not migrated automatically | ✅ Prohibited; technical control recommended |
| Not displayed as flagship offerings | ✅ Stated |
| Establish no ATA price, inclusion, policy or promise | ✅ Stated |
| Legacy prices never published | ✅ 299/599/899/1499 added to the prohibited-pricing list |

## 5. Codex boundary

| Control | Compliance |
|---|---|
| Do not redesign the Codex architecture | ✅ No schema, table, column, enum or migration proposed |
| Treat Codex output as authoritative | ✅ Pricing states, pricing types and placeholder wording used verbatim |
| Label repository observations | ✅ Two **PRELIMINARY CLAUDE OBSERVATION** entries, both advisory |

Observations raised, neither actioned: approve/release sharing one permission; recommendation that the legacy archive sit outside the table the public projection reads.

## 6. Google Drive controls

| Control | Compliance |
|---|---|
| Upload into the existing structure | ✅ Existing owner/governance folder used |
| Do not create another top-level project folder | ✅ None created |
| Verify filename, ID, parent, size, commit, version, readability, status | ✅ Recorded per file in the upload manifest |
| Version-suffixed filenames | ✅ All `_v0.1` |
| Superseded files from earlier packages do not block | ✅ Recorded, not retried |
| Do not retry unsupported delete or update operations | ✅ None attempted |

## 7. Scope discipline

| Not done | Reason |
|---|---|
| No price, date, capacity or policy determined | ATA's authority |
| No legal, medical or safety text drafted | Requires a qualified professional |
| No Supabase read or write | Repository control |
| No user or invitation created | Repository control |
| No content published or released | ATA's authority |
| No claim promoted to approved source fact | Requires explicit owner approval |
