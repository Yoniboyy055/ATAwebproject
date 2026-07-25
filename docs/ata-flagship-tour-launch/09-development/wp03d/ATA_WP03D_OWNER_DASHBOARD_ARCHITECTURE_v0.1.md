# ATA WP-03D Owner-Dashboard Architecture v0.1

Use a staging-only server-authorized dashboard, not a direct table editor. Modules cover tours/facts, evidence/media rights, pricing/availability, request operations, verification/approval/release queues, memberships, and audit exports.

Each fact is nullable and versioned with status, evidence, public intent, reviewer, approver, releaser, and review date. Edits create new versions; release selects an approved immutable version. The public site reads only a released projection.

Administrative routes require invitation-only identity, active environment membership, server permission checks, protected mutations, and append-only audit events.

