# ATA WP-03D Recommended Controlled Implementation Package v0.1

Recommend **WP-04A—Supabase Staging Backup, Security Boundary, and Target Schema Implementation**, only after explicit approval.

Gates: approve controlled replacement; assign ATA/YK/billing/backup/recovery/data-controller owners; decide treatment of four packages; approve invitation-only Auth, retention, and media/evidence rules; approve migration/rollback.

WP-04A should backup/restore-test first, refine Prisma, generate reviewed migrations, implement grants/RLS with adversarial tests, import no unverified facts, rerun advisors, and stop before production. WP-03D does not begin it.

