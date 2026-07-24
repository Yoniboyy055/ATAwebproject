# ATA WP-02 Drive Upload Manifest v0.1

**Purpose:** delivery record for Claude WP-02 artifacts to the established ATA Google Drive project location. The Drive connector repeatedly declined the copy-deck upload (three declines across reconnect cycles); per closure-pass instructions the upload was not re-attempted further and this manifest records the exact manual-upload requirement. No new Drive folder was or should be created.

**Destination (existing folder):** `ATA Flagship Tour Launch / 03 Content and Assets` — Drive folder ID `1aJUSHAA-b891rot9riMMMe5NV7-mmeWp`
**Repository branch:** `claude/wp02-content-model-draft-copy`
**Final commit:** `9e1ef25`

| File | Local path (worktree `/home/user/ATAwebproject-wp02`) | Size (bytes) | SHA-256 | Drive status |
|---|---|---|---|---|
| `ATA_DRAFT_COPY_DECK_v0.1.md` | `03 Content and Assets/ATA_DRAFT_COPY_DECK_v0.1.md` | 13,918 | `c0f8777cbb470366fcb94d991586bab643e4d7ffc540691095ce4d215573fbb5` | **Manual upload required** — connector declined; file never reached Drive |
| `ATA_COPY_CONTRACT_MAPPING_v0.1.md` | `03 Content and Assets/ATA_COPY_CONTRACT_MAPPING_v0.1.md` | 12,835 | `877979ae9c27d9704c7fcd7a439db80afe553fda0eecb17177e5519db3bb370e` | **Manual replace required** — Drive holds the earlier `9af73be` version (file ID `1m6lO6cd9_S6Qls9mdXStjiMneDWrV-mf`, 10,595 bytes); superseded by the 15-state lifecycle update. Connector has no update/delete capability; re-creating would duplicate the filename |
| `ATA_FLAGSHIP_CONTENT_MATRIX_v0.1.md` | `03 Content and Assets/ATA_FLAGSHIP_CONTENT_MATRIX_v0.1.md` | 8,390 | `d54f438d9d58d35d554b4c04c7adefbc45945d6f165d9068645b5fc391f50f9b` | **Manual replace required** — Drive holds the earlier `9af73be` version (file ID `18-M5fg6BUltmcFhFEKmyxhvYOcfr6ZVh`, 8,350 bytes); one-line M-35 marker update outstanding |

**Verification procedure after manual upload:** confirm filename and parent folder match this manifest; download and compare byte size and SHA-256 against the values above (all values are for commit `9e1ef25`).

**WP-02 Drive delivery status: INCOMPLETE** until all three rows verify.
