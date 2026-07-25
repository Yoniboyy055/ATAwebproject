# ATA WP-03D Authentication Architecture Comparison v0.1

| Option | Assessment |
|---|---|
| Legacy NextAuth tables | Empty but dangerously exposed; retire after backup |
| Supabase Auth | Preferred invitation/session identity for staging |
| Codex membership model | Retain as server-side ATA/YK authorization layer |

Use invitation-only Supabase Auth with public registration disabled. Resolve roles server-side from `ata_admin_memberships`, keyed to the trusted Auth subject. Authorization belongs in app metadata/membership records, never user-editable metadata. Revocation disables membership and sessions; sensitive actions revalidate the current session.

No provider or user was configured.

