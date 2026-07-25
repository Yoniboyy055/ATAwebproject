# ATA WP-03D Dependency and Integration Register v0.1

| Dependency | State/disposition |
|---|---|
| Supabase PostgreSQL | active staging candidate; audit only |
| Supabase Auth | 0 users; invitation-only recommended |
| Storage/Edge Functions | 0; not configured/deployed |
| Prisma | live legacy schema plus unapplied `Ata*` proposal |
| NextAuth tables | empty/exposed; retire after backup |
| Stripe table | empty; isolate/archive |
| Google Drive | required delivery destination |
| Vercel/notifications | untouched/out of scope |

No dependency, lockfile, provider, or environment variable changed.

