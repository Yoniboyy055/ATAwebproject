# ATA WP-02 Drive Upload Manifest v0.1

**Purpose:** delivery record for Claude WP-02 artifacts in the established ATA Google Drive project location. No new Drive folder was created.

**Destination (existing folder):** `ATA Flagship Tour Launch / 03 Content and Assets` — Drive folder ID `1aJUSHAA-b891rot9riMMMe5NV7-mmeWp`
**Source branch:** `claude/wp02-content-model-draft-copy` (merged to `main` via PR #11)
**Source commit:** `9d908f7` — merged as `ea65b7a`
**Upload method:** Google Drive MCP connector (`create_file`, `disableConversionToGoogleType: true`)
**Upload date:** 2026-07-24

## 1. Final files — delivered and verified

| File | Repository path | Drive file ID | Expected size | Verified size | SHA-256 (repo) | Status |
|---|---|---|---|---|---|---|
| `ATA_DRAFT_COPY_DECK_v0.1.md` | `03 Content and Assets/ATA_DRAFT_COPY_DECK_v0.1.md` | `1kQTNWNR1IHvW5xeDd-CEsZ1hfkHLiN_L` | 13,918 | **13,918 ✓** | `c0f8777cbb470366fcb94d991586bab643e4d7ffc540691095ce4d215573fbb5` | **Verified** |
| `ATA_COPY_CONTRACT_MAPPING_v0.1.md` | `03 Content and Assets/ATA_COPY_CONTRACT_MAPPING_v0.1.md` | `1CAYbo7iYMNHEPqWByW0V2JHYyGkM6Orw` | 12,835 | **12,835 ✓** | `877979ae9c27d9704c7fcd7a439db80afe553fda0eecb17177e5519db3bb370e` | **Verified** |
| `ATA_FLAGSHIP_CONTENT_MATRIX_v0.1.md` | `03 Content and Assets/ATA_FLAGSHIP_CONTENT_MATRIX_v0.1.md` | `16_Uv_TDSAB2u9ZKsQncX0wzZScCW2Y2M` | 8,390 | **8,390 ✓** | `d54f438d9d58d35d554b4c04c7adefbc45945d6f165d9068645b5fc391f50f9b` | **Verified** |

**Verification performed:** exact filename match; correct parent folder confirmed by folder listing; file readable via connector download; byte size matches the repository version exactly. For the copy deck, the downloaded base64 stream was additionally compared head and tail against the local encoding — both byte-identical. The connector returns content as a re-encoded base64 stream rather than a raw file handle, so a full end-to-end SHA-256 recomputation is not available through it; exact byte-size equality plus boundary comparison is the strongest verification the tooling supports.

## 2. Outstanding — stale duplicates requiring manual removal

Two pre-correction copies remain in the same folder under identical filenames. They are **superseded** and must be trashed so no ambiguity remains.

| Stale file | Drive file ID | Stale size | Superseded by | Required action |
|---|---|---|---|---|
| `ATA_COPY_CONTRACT_MAPPING_v0.1.md` | `1m6lO6cd9_S6Qls9mdXStjiMneDWrV-mf` | 10,595 | `1CAYbo7iYMNHEPqWByW0V2JHYyGkM6Orw` (12,835) | **Trash — manual** |
| `ATA_FLAGSHIP_CONTENT_MATRIX_v0.1.md` | `18-M5fg6BUltmcFhFEKmyxhvYOcfr6ZVh` | 8,350 | `16_Uv_TDSAB2u9ZKsQncX0wzZScCW2Y2M` (8,390) | **Trash — manual** |

**Why manual:** the Google Drive MCP connector in this session exposes only `search_files`, `create_file`, `copy_file`, `download_file_content`, `read_file_content`, `get_file_metadata`, `get_file_permissions`, and `list_recent_files`. It has **no update, delete, trash, move, or rename capability**, so a stale file cannot be replaced or removed through it. No browser-control tool is available in this session either, so the authorised Chrome fallback could not be driven programmatically.

**Distinguishing the correct file:** the authoritative copy is always the **larger, newer** of each pair (created 2026-07-24 22:45–22:46 UTC), and matches the sizes in §1.

## 3. Delivery status

**WP-02 Drive delivery: FINAL FILES COMPLETE — folder cleanup outstanding.**
All three authoritative files are present, correct, and verified in the correct folder. Delivery is fully complete once the two stale duplicates in §2 are trashed.
