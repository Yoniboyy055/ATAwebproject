# ATA WP-03D Migration SQL Preview Plan v0.1

**Documentation only—do not execute.**

```sql
begin;
-- Create a non-exposed internal schema and additive typed ATA tables.
-- Revoke broad default privileges before exposing new objects.
-- Enable RLS only alongside reviewed, table-specific policies.
-- Expose released content through security-invoker projections.
rollback;
```

Implementation must generate a migration, use a disposable validation target, review the schema diff, test policies and rollback, and rerun advisors. Executable columns/policies remain blocked by owner decisions.

