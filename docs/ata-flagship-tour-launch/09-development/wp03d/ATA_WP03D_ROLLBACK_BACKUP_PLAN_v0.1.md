# ATA WP-03D Rollback and Backup Plan v0.1

1. Capture identity, schema, migrations, extensions, grants, policies, and counts.
2. Produce encrypted schema/data exports; separately export and hash the four package rows.
3. Test restoration in an isolated environment.
4. Apply approved changes in checkpoints and validate each checkpoint.
5. Preserve the old schema read-only through acceptance.
6. Roll back by restoring the last verified snapshot to a fresh project.

Free-plan backup guarantees and named backup/recovery/deletion authorities require owner confirmation.

