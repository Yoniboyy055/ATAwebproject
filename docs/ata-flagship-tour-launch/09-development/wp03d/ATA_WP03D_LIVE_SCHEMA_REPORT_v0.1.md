# ATA WP-03D Live Schema Report v0.1

The live `public` schema contains `users`, `accounts`, `sessions`, `verification_tokens`, `packages`, `bookings`, `quotes`, `saved_packages`, `reviews`, `payments`, `newsletters`, `enquiries`, `booking_requests`, and `blog_posts`.

`packages` has 4 rows; the other 13 tables have 0. All package prices are non-null, two rows are marked recommended, and types are `Diaspora`/`Local`. These are unverified legacy records, not flagship facts.

Structural findings:

- text/CUID-style IDs and unconstrained text statuses;
- monetary values use `double precision`;
- `verification_tokens` has no primary key;
- `accounts.userId` and `sessions.userId` FKs lack covering indexes;
- no public views, routines, or triggers;
- no live `ata_admin_memberships`, `ata_business_facts`, `ata_tours`, `ata_requests`, or `ata_audit_events`.

