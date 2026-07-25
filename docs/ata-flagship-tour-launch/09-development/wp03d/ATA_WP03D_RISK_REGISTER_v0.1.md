# ATA WP-03D Updated Risk Register v0.1

| ID | Risk | Severity | Treatment |
|---|---|---|---|
| D-01 | full Data API privileges without RLS | Critical | staged grants/policies |
| D-02 | password/token columns exposed | Critical | isolate/retire; rotate after cutover |
| D-03 | four unverified priced packages | High | quarantine and owner review |
| D-04 | live schema lacks ATA models | High | controlled replacement |
| D-05 | free-text states and float money | High | typed states/minor units |
| D-06 | no audit/version history | High | append-only records |
| D-07 | Free-plan backup limits | Medium | approved backup plan |
| D-08 | recent platform restart/521 interval | Medium | monitor; current health restored |
| D-09 | Auth deprecation warnings | Low | recheck during implementation |
| D-10 | FK/index advisor findings | Low | reassess after target workload |

References: [RLS](https://supabase.com/docs/guides/database/database-linter?lint=0013_rls_disabled_in_public), [sensitive columns](https://supabase.com/docs/guides/database/database-linter?lint=0023_sensitive_columns_exposed), [FK indexes](https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys).

