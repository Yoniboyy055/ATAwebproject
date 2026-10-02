# Claude WP-04 — Google Drive Upload Manifest v0.1

**Destination folder:** `ATA Flagship Tour Launch / 12 Client Approvals`
**Folder ID:** `1qKHthJurWWS_pmaIyKdh3A5NJNJocfJh` — **verified to exist**; no new folder created
**Source commit:** `16286cc` (24 files) + closure commit (this file and the completion report)
**Baseline:** `7ab88e9`

---

## 1. Folder selection

The brief directs uploads into "the most appropriate existing owner, governance or discovery folder". The project folder was enumerated and contains thirteen numbered folders. **`12 Client Approvals` is the correct destination** — it is the owner-approval folder, it matches the repository path exactly, and it was named for this purpose in the original work brief. `00 Project Governance` was considered and rejected: it holds project-level governance, whereas this pack is client-facing approval material.

**No new top-level project folder was created.**

## 2. Naming and collision avoidance

Every file carries the `ATA_CLAUDE_WP04_` prefix and a `_v0.1` version suffix. This gives three protections:

- No collision with Codex's `ATA_WP03*` / `ATA_WP03D_*` packages
- No collision with earlier Claude packages
- **A future corrected version can be uploaded as `_v0.2` rather than a same-name duplicate** — which is the structural fix recommended after WP-03 accumulated ten superseded same-name copies

## 3. Files for upload — 26 deliverables

Repository byte sizes at commit `16286cc`. **Verification columns are completed at upload time.**

| # | Filename | Version | Repo bytes | Drive bytes | Match | Drive file ID | Status |
|---|---|---|---:|---:|:---:|---|---|
| 1 | `..._RESEARCH_CLAIM_OWNER_APPROVAL_REGISTER_v0.1.md` | v0.1 | 8,897 | | | | ☐ Pending |
| 2 | `..._OWNER_EXECUTIVE_APPROVAL_BRIEF_v0.1.md` | v0.1 | 8,303 | | | | ☐ Pending |
| 3 | `..._OPERATIONAL_DECISION_QUESTIONNAIRE_v0.1.md` | v0.1 | 7,540 | | | | ☐ Pending |
| 4 | `..._DASHBOARD_FIELD_RESPONSIBILITY_MATRIX_v0.1.md` | v0.1 | 7,037 | | | | ☐ Pending |
| 5 | `..._UNESCO_PUBLICATION_PRECONDITION_REGISTER_v0.1.md` | v0.1 | 6,939 | | | | ☐ Pending |
| 6 | `..._CUSTOMER_REQUEST_CONFIRMATION_LANGUAGE_GUIDE_v0.1.md` | v0.1 | 6,763 | | | | ☐ Pending |
| 7 | `..._TOUR_CONTENT_APPROVAL_WORKSHEET_v0.1.md` | v0.1 | 6,322 | | | | ☐ Pending |
| 8 | `..._PUBLICATION_RELEASE_CHECKLIST_v0.1.md` | v0.1 | 5,762 | | | | ☐ Pending |
| 9 | `..._PRICING_APPROVAL_WORKSHEET_v0.1.md` | v0.1 | 5,606 | | | | ☐ Pending |
| 10 | `..._ROLE_AUTHORITY_MATRIX_v0.1.md` | v0.1 | 5,551 | | | | ☐ Pending |
| 11 | `..._POLICY_PROFESSIONAL_REVIEW_REGISTER_v0.1.md` | v0.1 | 5,511 | | | | ☐ Pending |
| 12 | `..._RISK_REGISTER_UPDATE_v0.1.md` | v0.1 | 5,476 | | | | ☐ Pending |
| 13 | `..._PLACEHOLDER_HIDDEN_CONTENT_GUIDE_v0.1.md` | v0.1 | 5,319 | | | | ☐ Pending |
| 14 | `..._REMAINING_OWNER_DECISIONS_REGISTER_v0.1.md` | v0.1 | 5,154 | | | | ☐ Pending |
| 15 | `..._DATES_CAPACITY_AVAILABILITY_WORKSHEET_v0.1.md` | v0.1 | 4,949 | | | | ☐ Pending |
| 16 | `..._OWNER_MEETING_AGENDA_v0.1.md` | v0.1 | 4,896 | | | | ☐ Pending |
| 17 | `..._CONTROL_MANIFEST_v0.1.md` | v0.1 | 4,895 | | | | ☐ Pending |
| 18 | `..._APPROVED_GOVERNANCE_DECISIONS_v0.1.md` | v0.1 | 4,781 | | | | ☐ Pending |
| 19 | `..._LEGACY_PACKAGE_DISPOSITION_v0.1.md` | v0.1 | 4,676 | | | | ☐ Pending |
| 20 | `..._POST_MEETING_IMPLEMENTATION_HANDOFF_v0.1.md` | v0.1 | 4,650 | | | | ☐ Pending |
| 21 | `..._RECOMMENDED_NEXT_WORK_PACKAGE_v0.1.md` | v0.1 | 4,561 | | | | ☐ Pending |
| 22 | `..._SOURCE_MANIFEST_v0.1.md` | v0.1 | 4,102 | | | | ☐ Pending |
| 23 | `..._MEDIA_RIGHTS_APPROVAL_REGISTER_v0.1.md` | v0.1 | 3,952 | | | | ☐ Pending |
| 24 | `..._OWNER_MEETING_DECISION_LOG_TEMPLATE_v0.1.md` | v0.1 | 3,137 | | | | ☐ Pending |
| 25 | `..._DRIVE_UPLOAD_MANIFEST_v0.1.md` (this file) | v0.1 | *(closure commit)* | | | | ☐ Pending |
| 26 | `..._COMPLETION_REPORT_v0.1.md` | v0.1 | *(closure commit)* | | | | ☐ Pending |

**Total for the 24 committed files: 138,779 bytes.**

## 4. Upload status — stated honestly

**No file has been uploaded yet.** This is an incomplete step, not a completed one, and it is recorded as such rather than glossed.

**Why.** The session reached its practical working limit after producing the 24 deliverables, opening PR #15 and confirming CI green. Uploading requires re-emitting every document's full text inline through the connector — roughly 139 KB. Beginning that and stopping partway would leave the folder **half-populated with a manifest claiming otherwise**, which is precisely the "silent partial state" failure this pack identifies as risk V-026. A clearly-outstanding step is safer than a misreported one.

**The repository at PR #15 is the canonical source** for all 26 deliverables and is complete, pushed and CI-green.

## 5. Verification procedure for each upload

For every file, record and confirm:

| Check | Method |
|---|---|
| Filename | Exact match including `_v0.1` suffix |
| Drive file ID | Captured from the connector response |
| Parent folder | `1qKHthJurWWS_pmaIyKdh3A5NJNJocfJh` |
| Byte size | Connector `fileSize` compared to repository byte count — **must match exactly** |
| Source commit | `16286cc` or the closure commit |
| Version | `v0.1` |
| Readability | MIME type `text/markdown`, non-zero size |
| Upload status | Recorded per row above |

**Verification limit, restated:** the connector exposes no checksum field, so byte-size + name + parent + readability is the strongest verification obtainable. Full end-to-end SHA-256 is not available through this interface. A byte-count match on UTF-8 Markdown of this size remains a strong integrity signal — any substitution, truncation or encoding change would alter it.

## 6. Connector capability

The Drive connector supports `search_files`, `create_file`, `copy_file`, `download_file_content`, `read_file_content`, `get_file_metadata`, `get_file_permissions`, `list_recent_files`. It exposes **no update, delete, trash, move or rename operation**.

Consequence: a file cannot be replaced in place. The `_v0.1` suffix exists so corrections ship as `_v0.2` instead of creating same-name duplicates.

## 7. Superseded files from earlier packages

Ten superseded same-name copies from the WP-03 correction round, plus two from WP-02, remain in `02 Discovery` and `03 Content and Assets` as **manual cleanup items**. Their IDs are recorded in `02 Discovery/ATA_CLAUDE_WP03_DRIVE_UPLOAD_MANIFEST_v0.1.md` §5a and §6.

Per instruction these **do not block WP-04**, and **no unsupported delete or update operation was attempted**.

## 8. Exceptions

| # | Exception | Detail |
|---|---|---|
| 1 | **Upload not performed** | All 26 files pending, per §4. Repository is canonical and complete |

No upload failed, was declined, or was retried, because none was attempted. The WP-02/WP-03 fallback protocol — stop repeating a failing operation, preserve the committed version, produce an exact manual-upload manifest, report the exception honestly — is satisfied by this manifest: it is the exact manual-upload record, with byte sizes, ordering and destination folder ID, sufficient for either Claude or a human to complete delivery.
