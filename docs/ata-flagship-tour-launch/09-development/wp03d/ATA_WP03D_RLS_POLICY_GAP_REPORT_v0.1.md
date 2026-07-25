# ATA WP-03D RLS and Policy-Gap Report v0.1

Security advisors returned fourteen `rls_disabled_in_public` errors. `pg_policies` returned zero policies.

Do not enable RLS as an isolated toggle. Target rules:

- public reads only released, approved, verified content;
- public requests enter through a validated server endpoint;
- ATA staff require invitation-only identity and active memberships;
- YK technical authority cannot approve ATA facts or confirm bookings;
- auditors receive read-only views;
- service-role credentials remain server-only and audited.

Tests must cover cross-role access, revoked sessions, stale JWT metadata, internal-note leakage, ownership, and release gates.

