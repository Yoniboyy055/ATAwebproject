# Proof Ledger — Private Financial Record

A small, private financial evidence ledger between two people: an **OWNER** who
records transactions with screenshot proof, and a **VIEWER** who can read
everything and take part in the discussion but can never change a number.

Built with YK Systems.

---

## 1. Separation from ATA

This project lives inside the ATA repository for organisational convenience
only. **It is not an ATA business feature.**

- No ATA customers, bookings, travel requests, packages, pricing, customer
  payments, accounting, CRM, admin records or operational workflows are read or
  written.
- It uses its **own database** (`LEDGER_DATABASE_URL`) and its **own generated
  Prisma client**. There are no foreign keys, joins or shared models with the
  ATA schema.
- It has its own password-only authentication. It does not touch NextAuth, the
  ATA admin cookie, or any ATA session.
- It is not linked from any ATA page, is excluded from the sitemap, is
  disallowed in `robots.txt`, and every ledger response carries
  `noindex, nofollow`.

Everything except the thin Next.js adapters lives under `private-proof-ledger/`.

### Files outside this folder, and why

| File | Reason |
|---|---|
| `app/proof-ledger/{layout,page}.tsx` | Next.js requires route files under `app/`. Both are thin — they import `private-proof-ledger/server/pages`. |
| `app/proof-ledger/statement/page.tsx` | Same, for the printable statement. |
| `app/api/proof-ledger/**/route.ts` | Next.js route handler adapters. Each is ~10 lines and calls into `private-proof-ledger/server/handlers`. |
| `components/ConditionalLayout.tsx` | One line so ATA navigation and footer never render on `/proof-ledger`. |
| `app/robots.ts`, `public/robots.txt` | Disallow `/proof-ledger`. |
| `tailwind.config.cjs` | Adds `private-proof-ledger/**` to the content globs. |
| `package.json` | Ledger scripts (`ledger:generate`, `ledger:db:push`, `ledger:hash-password`, `test:ledger`). |
| `playwright.config.ts` | Browser test configuration. |
| `.env.example` | Documents the ledger environment variable names (no values). |

---

## 2. Architecture

```
Screenshot + owner explanation
        ↓
AI extraction            (private-proof-ledger/ai)          interpretation only
        ↓
Zod validation           (private-proof-ledger/schemas)      strict boundary
        ↓
Deterministic engine     (private-proof-ledger/ledger)       all arithmetic
        ↓
Owner confirmation       (components/NewTransactionPanel)    explicit approval
        ↓
Permanent record         (private-proof-ledger/database)     hash chained
```

| Folder | Role |
|---|---|
| `ledger/` | Pure deterministic domain: money, engine, hash chain, record preparation. No framework, database or network imports. |
| `schemas/` | Zod schemas — the only way untrusted input enters the domain. |
| `auth/` | scrypt password hashing, signed session tokens, login throttling. |
| `ai/` | Anthropic call and the strict classification of its reply. |
| `database/` | Prisma schema, client, repository contract, Prisma and in-memory implementations. |
| `server/` | HTTP handlers, evidence rules, read model, page implementations. |
| `components/` | React UI (dashboard, withdrawals, history, notes, statement). |
| `tests/` | Jest specs; `tests/e2e/` holds the Playwright specs. |
| `scripts/` | Password hash generator. |
| `styles/` | Print CSS. |

---

## 3. Opening obligation

The production opening obligation is **CAD $36,000.00** (`3600000` cents).

On first run the owner sees the figure, confirms it, and presses **Lock
Original Obligation**. After locking it cannot be casually edited — a later
correction must be recorded as an auditable `ADJUSTMENT`. No transaction can be
applied before the obligation is locked.

---

## 4. Financial model — three separate layers

### A. Base obligation

Only a `BASE_DEPOSIT` normally reduces it.

```
Base Deposited  = Σ BASE_DEPOSIT amounts
Base Remaining  = Original Obligation − Base Deposited + approved base adjustments
```

### B. Withdrawal principal

A withdrawal creates an **independent** obligation. It does not increase or
decrease Base Remaining — its base effect is always `0`.

### C. Extra repayment added

When the owner explicitly states a larger repayment, the difference is stored in
its own column (`extraRepaymentCents`) and shown on its own row. It is never
folded into a single unexplained number.

```
Required Repayment = Withdrawal Principal + Extra Repayment Added
CAD $120           = CAD $100             + CAD $20
```

If the owner states no extra, Extra Repayment Added is `CAD $0.00`. The system
never invents one, and there is no interest engine of any kind — no yearly,
monthly, compound or global rate. "Extra Repayment Added" applies only to the
individual withdrawal where the owner specified it.

### Worked example

| | |
|---|---|
| Original Obligation | CAD $36,000.00 |
| Base deposit of CAD $500 → Base Remaining | CAD $35,500.00 |
| Withdrawal principal | CAD $100.00 |
| Extra repayment added | CAD $20.00 |
| Required withdrawal repayment | CAD $120.00 |
| **Total Currently Outstanding** | **CAD $35,620.00** |

---

## 5. Historical versus current totals

The withdrawal totals block reports both, clearly labelled:

| Figure | Kind |
|---|---|
| Total Principal Withdrawn | historical — includes closed withdrawals |
| **Total Extra Repayment Added** | historical — includes closed withdrawals |
| Total Required Repayment | historical |
| Total Repayments Paid | historical |
| Withdrawal Repayment Remaining | current |

A fully repaid withdrawal still contributes to the historical extra total while
contributing nothing to the current outstanding balance.

### No double counting

```
Total Currently Outstanding = Base Remaining + Open Required Withdrawal Repayment
```

Extra Repayment Added is **already inside** required withdrawal repayment, so it
is never added again. This is asserted directly in the test suite.

---

## 6. Permissions

| Capability | OWNER | VIEWER |
|---|---|---|
| View balances, withdrawals, principal, extra, totals | ✅ | ✅ |
| View evidence (after authentication) | ✅ | ✅ |
| Write notes and replies | ✅ | ✅ |
| Print / save statement | ✅ | ✅ |
| Lock the opening obligation | ✅ | ❌ |
| Upload evidence, run analysis, apply records | ✅ | ❌ |
| Create adjustments | ✅ | ❌ |
| Change any amount, date or withdrawal status | ✅ (via new records only) | ❌ |
| Resolve a discussion | ✅ | ❌ |

Every restriction is enforced **server side** in
`private-proof-ledger/server/handlers.ts`. The browser never decides its own
role, and applied records are never edited or deleted — corrections are new
`ADJUSTMENT` records that reference the original.

---

## 7. The AI boundary

AI is an **interpreter**, never the accounting engine.

It may identify: transaction type, date, amount, reason, withdrawal principal,
an explicitly stated required repayment, a linked withdrawal, and any
disagreement between the screenshot and the instruction.

It may **not** compute balances, totals, outstanding amounts or status. The
proposal schema has no field for them, and anything extra is stripped by Zod.

The flow stops with **zero mutation** — no transaction and no stored evidence —
when:

- the screenshot and the instruction materially disagree (`Evidence Conflict
  Detected` is shown with both values);
- confidence is `LOW`;
- the reply does not match the schema;
- the proposal violates a ledger rule (unknown linked withdrawal, repayment
  larger than outstanding, required repayment below principal, and so on).

Evidence is only persisted once a proposal has passed every check, and no
record exists until the owner presses **Apply Record**.

---

## 8. Money storage

All amounts are **integer cents**. `CAD $36,000.00` is `3600000`. There is no
floating-point arithmetic anywhere in the financial path, and parsing rejects
anything it cannot represent exactly (`12.345` is refused).

---

## 9. Data model

| Model | Purpose |
|---|---|
| `LedgerConfig` | Currency, original obligation, locked timestamp. |
| `LedgerTransaction` | The permanent record, including `withdrawalPrincipalCents`, `extraRepaymentCents`, `requiredRepaymentCents`, `baseEffectCents`, `previousRecordHash`, `recordHash`. |
| `LedgerEvidence` | Screenshot bytes, MIME type, byte size, SHA-256, timestamp. |
| `LedgerNote` | Append-only discussion, optionally attached to a transaction. |

`repaymentPaidCents` and `status` on `LedgerTransaction` are **denormalised
caches**. They are excluded from the hash and the engine always derives the
authoritative values from history.

Transaction codes (`TX-001`, `TX-002`, …) are human-facing; the database uses a
separate primary key.

---

## 10. Tamper evidence

Every applied record hashes its canonical financial payload together with the
previous record's hash:

```
TX-001                → HASH-A
TX-002 + HASH-A       → HASH-B
TX-003 + HASH-B       → HASH-C
```

`verifyChain()` re-derives every hash and also checks that
`required − principal === extra` on each withdrawal. Editing an applied amount,
removing a record from the middle, or rewriting the extra-repayment column all
fail verification. The result is shown in the reconciliation bar and on the
statement, and is available at `GET /api/proof-ledger/integrity`.

This is not a blockchain — no consensus, no proof of work, no distribution.

---

## 11. Evidence storage

Screenshot bytes are stored in the **private ledger database** (`LedgerEvidence.data`).

- No new platform, no object storage service, no Supabase.
- No public URL. `GET /api/proof-ledger/evidence/[id]` requires an authenticated
  session and responds `private, no-store`.
- Images only (`image/png`, `image/jpeg`, `image/webp`, `image/heic`,
  `image/heif`), maximum 8 MB, SHA-256 recorded on upload.
- Screenshots are **never** committed to git.

---

## 12. Environment variables

| Variable | Purpose |
|---|---|
| `LEDGER_DATABASE_URL` | PostgreSQL connection for the ledger. Must not point at `DATABASE_URL`. |
| `LEDGER_OWNER_PASSWORD_HASH` | scrypt hash of the owner password. |
| `LEDGER_VIEWER_PASSWORD_HASH` | scrypt hash of the viewer password. |
| `LEDGER_SESSION_SECRET` | 32+ characters, used to sign session cookies. |
| `ANTHROPIC_API_KEY` | Server-side key for screenshot interpretation. |
| `LEDGER_ANTHROPIC_MODEL` | Model identifier for the interpreter. Required — there is no default. |

Never commit real values. `.env.example` documents the names only.

---

## 13. Setup

```bash
# 1. Generate password hashes (fictional examples — use your own)
npm run ledger:hash-password -- "a long owner password"
npm run ledger:hash-password -- "a long viewer password"

# 2. Generate a session secret
openssl rand -base64 48

# 3. Put all six variables in your deployment environment

# 4. Generate the ledger Prisma client (also runs on postinstall and build)
npm run ledger:generate

# 5. Create the ledger tables in the ledger database
npm run ledger:db:push
```

Then open `/proof-ledger`, sign in with the owner password, confirm
`CAD $36,000.00` and press **Lock Original Obligation**.

---

## 14. Testing

```bash
npm run test:ledger    # Proof Ledger unit and handler tests
npm test               # whole repository
npm run type-check
npm run lint
npm run build
```

Browser tests:

```bash
# Server must already be running with the ledger environment configured.
PROOF_LEDGER_BASE_URL=http://127.0.0.1:3111 npx playwright test
```

Specs that need a provisioned ledger database skip themselves unless
`PROOF_LEDGER_E2E_DB=1`, `PROOF_LEDGER_OWNER_PASSWORD` and
`PROOF_LEDGER_VIEWER_PASSWORD` are set. Use fictional data only.

The Jest suite covers the opening obligation, base deposits, withdrawal
principal versus extra repayment, partial and full repayment, multiple
withdrawals, historical versus current totals, the explicit no-double-counting
assertion, the rule that repayments never touch the base, AI ambiguity and
conflict producing zero mutation, viewer restrictions, notes never affecting
money, adjustments preserving the original record, and hash-chain integrity
passing clean history while failing tampered history.

---

## 15. Deployment

1. Provision a PostgreSQL database dedicated to the ledger.
2. Set the six environment variables in the hosting environment (production and
   preview separately).
3. Deploy. `postinstall` and `build` both run `prisma generate` for the ATA
   schema and `ledger:generate` for the ledger schema.
4. Run `npm run ledger:db:push` against the ledger database once.
5. Open `/proof-ledger`, sign in as owner, lock `CAD $36,000.00`.
6. Confirm `/robots.txt` disallows `/proof-ledger` and that the page is not
   linked anywhere in ATA.

---

## 16. Security

- Passwords are stored only as scrypt hashes; verification is constant time and
  both role hashes are always checked so timing does not reveal which matched.
- Sessions are HMAC-SHA256 signed, HttpOnly, `SameSite=Strict`, `Secure` in
  production, and expire after 12 hours.
- Login attempts are throttled per client (8 per 15 minutes).
- Every mutation re-checks the role on the server and recomputes the record from
  stored history — posted values are inputs, never results.
- Evidence uploads are size-limited and restricted to an image allowlist.
- The AI key is server side only and analysis failures are reported without
  echoing request content into logs.
- A ledger database outage returns a clear `503` stating that nothing has been
  changed, rather than an opaque error.
- Access does not rely on the URL being secret.

---

## 17. Rollback and recovery

- **Data**: financial truth is reconstructable from `ledger_transactions`
  alone. Back up the ledger database with `pg_dump` before any migration.
- **A wrong record**: never edit or delete it. Record an `ADJUSTMENT`
  referencing it, with a reason.
- **A suspected tamper**: open `/api/proof-ledger/integrity`. Failures name the
  exact transaction codes and the kind of break.
- **Disabling the feature**: remove `LEDGER_SESSION_SECRET` (or the password
  hashes) and the ledger renders a configuration screen and accepts no logins.
  Deleting `app/proof-ledger` and `app/api/proof-ledger` removes the routes
  entirely without touching any ATA code.

---

## 18. Known limitations

- **Login throttling is per process.** On a multi-instance deployment the
  effective limit is per instance. Adequate for two people; not a substitute for
  a shared store at scale.
- **Evidence is stored in the database.** Simple and private, but 8 MB images in
  Postgres will grow the database and the backups. There is no thumbnailing.
- **HEIC uploads are stored but cannot be analysed** — the interpreter needs
  PNG, JPEG or WebP. The upload form asks for those three.
- **Overpayment is refused rather than absorbed.** A repayment larger than the
  outstanding amount is rejected with a message; correcting it needs an
  adjustment. The engine still clamps defensively if such data ever appears.
- **Adjustments affect the base only.** There is no adjustment that rewrites a
  withdrawal's principal or extra repayment; the original record stands and the
  correction is recorded alongside it.
- **No note attachments** in v1.
- **The AI interpreter needs network access.** With no key configured, or the
  service unreachable, analysis returns a clear error and the owner cannot add a
  record until it recovers.
- **Browser specs that need a database are skipped by default**, so a clean
  checkout proves the login, exposure and access-control paths but not the
  signed-in dashboard.
