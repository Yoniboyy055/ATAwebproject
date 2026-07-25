# ATA WP-03D Data API and Grants Assessment v0.1

Every application table grants `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `REFERENCES`, and `TRIGGER` to both `anon` and `authenticated`. Default ACLs also broadly grant future tables, sequences, and functions.

Because `public` is exposed and RLS is disabled, this is a critical structural exposure.

Remediation order: backup; define exposed/private schemas; design policy tests; revoke broad defaults; reduce per-table grants; enable RLS together with tested policies; expose narrow security-invoker views/RPCs; rerun advisors and API tests. No grant changed in WP-03D.

