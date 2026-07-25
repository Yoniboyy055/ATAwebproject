# ATA WP-03D Sensitive-Data Exposure Assessment v0.1

Advisors flagged `users.password`, `accounts.access_token`, `accounts.refresh_token`, and `verification_tokens.token`. Session/OAuth ID tokens, contact details, travel details, Stripe IDs, prices, notes, and emails add further exposure.

The risk is critical despite zero rows in credential tables. The four populated packages expose unverified prices and content.

Recommended controls: retire legacy auth tables; use Supabase Auth; isolate internals in non-exposed schemas; minimize grants; use tested RLS; keep service secrets server-only; rotate keys only after validated cutover; redact audit/log values.

