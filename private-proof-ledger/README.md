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
| `auth/` | scrypt password hashing, credential authority, signed session tokens, signed proposal tokens, login throttling. |
| `ai/` | Anthropic call and the strict classification of its reply. |
| `database/` | Prisma schema, client, repository contract, Prisma and in-memory implementations. |
| `server/` | HTTP handlers, evidence rules, read model, page implementations. |
| `components/` | React UI (dashboard, withdrawals, history, notes, statement). |
| `tests/` | Jest specs; `tests/e2e/` holds the Playwright specs. |
| `scripts/` | Password hash generator. |
| `styles/` | Print CSS. |

---

## 3. Opening obligation

The opening obligation for this ledger is **fixed at CAD $36,000.00**
(`3600000` cents).

On first run the owner sees the figure — displayed, never editable, with no
money input field anywhere on the screen — ticks a confirmation box, and presses
**Lock Original Obligation**. The server accepts exactly `3600000` and rejects
every other value with `400`, so the browser cannot propose a different amount.

After locking it cannot be edited at all. A later correction must be recorded as
an auditable `ADJUSTMENT`. No transaction can be applied before the obligation
is locked.

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
| Change appearance, density, resolved-note display | ✅ | ✅ |
| See own role, session expiry, sign out | ✅ | ✅ |
| Change the owner password | ✅ | ❌ |
| Change the viewer password | ✅ | ❌ |
| Enable / disable viewer access | ✅ | ❌ |

Every restriction is enforced **server side** in
`private-proof-ledger/server/handlers.ts`. The browser never decides its own
role, and applied records are never edited or deleted — corrections are new
`ADJUSTMENT` records that reference the original.

### Credentials, sessions and rotation

Passwords live in the **private ledger database**, not the environment.
`LEDGER_OWNER_PASSWORD_HASH` / `LEDGER_VIEWER_PASSWORD_HASH` seed the
`LedgerCredential` rows on first run and are ignored from then on, so a password
changed in Settings survives every redeploy.

- Hashing is scrypt; only the hash is stored.
- Each credential carries a `credentialVersion`. Session tokens embed the
  version they were issued against, and every request re-checks it against the
  database — so rotating a password signs other devices out immediately.
- The owner's current password authorises both changes: their own, and the
  viewer's. The owner never needs to know the old viewer password.
- Rotating the owner password re-issues the acting device's cookie against the
  new version, so the person making the change stays signed in while every other
  owner device is signed out.

| Role | Session lifetime | Why |
|---|---|---|
| OWNER | 12 hours | Performs consequential financial writes. |
| VIEWER | 30 days | Only reads and comments; keep re-entry low friction. |

### Viewer access switch

The owner can disable viewer access entirely. Disabling bumps the viewer
credential version, so existing viewer sessions become invalid at once and
viewer login is refused with a clear message. The owner is unaffected. The
viewer sees the current state in Settings but cannot change it, and the
endpoint refuses a viewer with `403`.

---

## 6a. Settings

Deliberately small. Both roles get:

- **Appearance** — System / Dark / Light
- **Transaction density** — Comfortable / Compact
- **Resolved notes** — Show / Hide
- **Session** — role, expiry, Sign Out
- **Ledger status** — integrity result

These three preferences are per-device and stored in `localStorage`. They never
touch a financial value and are never sent to the server.

The owner additionally gets Change Owner Password, Change Viewer Password and
the Viewer Access switch. The viewer sees "Password changes are controlled by
the ledger owner" instead — and the server enforces that independently of what
the interface shows.

Settings never expose a password hash, a secret, a database URL or an API key.

---

## 7. The AI boundary and signed proposals

AI is an **interpreter**, never the accounting engine.

It may identify: transaction type, date, amount, reason, withdrawal principal,
an explicitly stated required repayment, a linked withdrawal, an adjustment
scope and target, and any disagreement between the screenshot and the
instruction.

It may **not** compute balances, totals, outstanding amounts or status. The
proposal schema has no field for them, and anything extra is stripped by Zod.

### Apply is bound to the exact analysed proposal

```
screenshot + instruction
        ↓
AI interpretation
        ↓
Zod validation → deterministic ledger rules (dry run against real history)
        ↓
server signs the proposal it approved
        ↓
owner reviews that proposal
        ↓
owner presses Apply Record  →  browser sends ONLY the signed token
        ↓
server re-verifies and rebuilds the record from the token alone
        ↓
immutable financial record
```

The HMAC signature covers the transaction type, date, amount, reason, required
repayment, linked transaction, adjustment scope and effect, correction target,
evidence id, **evidence SHA-256**, the owner's original instruction and its
**SHA-256**, the ledger head hash at issue time, an issue time, an expiry
(20 minutes) and a random nonce.

`POST /api/proof-ledger/transactions` accepts only `{ proposalToken, confirm }`.
There are no transaction facts in the request for a modified browser to alter.
Before writing, the server re-checks that:

1. the session is an owner session;
2. the signature verifies and the token has not expired;
3. the ledger head still matches the token — which also makes a replayed token
   fail after the first successful apply;
4. the screenshot still exists and its **bytes re-hash** to the signed value;
5. the instruction hash of the rebuilt record matches the signed one.

The signing key is either `LEDGER_PROPOSAL_SECRET`, or an HMAC-derived key
separate from the session secret so proposal tokens and session cookies can
never be confused.

### Zero-mutation outcomes

The flow stops with **no transaction and no stored evidence** when:

- the screenshot and the instruction materially disagree (`Evidence Conflict
  Detected` is shown with both values);
- confidence is `LOW`;
- the reply does not match the schema;
- the proposal violates a ledger rule.

Evidence is only persisted once a proposal has passed every check, and no record
exists until the owner presses **Apply Record**.

## 7a. Adjustments

An `ADJUSTMENT` never rewrites the record it references. It is a separate,
hash-chained record carrying a scope, a signed effect and a correction target:

| Scope | Corrects |
|---|---|
| `BASE` | Base Remaining. |
| `WITHDRAWAL_PRINCIPAL` | The principal of a specific withdrawal. |
| `WITHDRAWAL_EXTRA` | The extra repayment added to a specific withdrawal. |

The engine derives effective truth:

```
Effective Principal = Original Principal + Σ principal adjustments
Effective Extra     = Original Extra     + Σ extra adjustments
Effective Required  = Effective Principal + Effective Extra
```

Repayments stay linked to the original withdrawal, and status is recalculated
against the **effective** required repayment — so a correction can move a
withdrawal from PARTIAL to CLOSED without any repayment being recorded.

Withdrawal totals and Total Currently Outstanding report effective truth. The
withdrawal card shows the original, the adjustment and the effective figure side
by side, but only when an adjustment exists; an uncorrected withdrawal keeps the
simple three-row breakdown.

A correction that would push a withdrawal below zero is refused, as is a
withdrawal-scoped correction pointed at a base deposit.

Example:

```
TX-014 Withdrawal
Original Principal        CAD $100
Principal Adjustments       CAD $0
Effective Principal       CAD $100

Original Extra             CAD $20
Extra Adjustments          -CAD $10
Effective Extra             CAD $10

Effective Required        CAD $110
Paid                       CAD $50
Remaining                  CAD $60
```

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
| `LedgerCredential` | Per-role password hash and credential version — the runtime authority. |
| `LedgerSetting` | Owner-controlled switches, currently viewer access. |
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

Every applied record hashes its canonical financial payload — including
`evidenceSha256` and `instructionSha256` — together with the previous record's
hash:

```
TX-001                → HASH-A
TX-002 + HASH-A       → HASH-B
TX-003 + HASH-B       → HASH-C
```

`verifyLedgerIntegrity()` re-derives every hash, checks that
`required − principal === extra` on each withdrawal, re-hashes the **stored
instruction text**, and loads and re-hashes the **actual screenshot bytes**.
Failures are reported as:

| Reason | Meaning |
|---|---|
| `HASH_MISMATCH` | The record no longer matches its stored hash. |
| `BROKEN_LINK` / `SEQUENCE_GAP` | A record was removed or reordered. |
| `EXTRA_MISMATCH` | The extra-repayment column was edited away from principal and required. |
| `EVIDENCE_HASH_MISMATCH` | The stored screenshot bytes were replaced. |
| `EVIDENCE_MISSING` | The screenshot behind a record is gone. |
| `INSTRUCTION_HASH_MISMATCH` | The stored instruction was reworded. |

Failure details never echo amounts, evidence or instruction contents. The result
is shown in the reconciliation bar and in Settings, and is available at
`GET /api/proof-ledger/integrity`.

This is not a blockchain — no consensus, no proof of work, no distribution.

## 11. Evidence storage

Screenshot bytes are stored in the **private ledger database** (`LedgerEvidence.data`).

- No new platform, no object storage service, no Supabase.
- No public URL. `GET /api/proof-ledger/evidence/[id]` requires an authenticated
  session and responds `private, no-store`.
- Images only (`image/png`, `image/jpeg`, `image/webp`, `image/heic`,
  `image/heif`), maximum 8 MB, SHA-256 recorded on upload.
- Screenshots are **never** committed to git.

### Pending lifecycle

A screenshot is stored `PENDING` with a 24-hour expiry the moment a proposal
passes validation. Applying its record marks it `APPLIED` and clears the expiry,
after which it is permanent. Expired `PENDING` rows — analyses the owner never
confirmed — are deleted opportunistically at the start of the next analysis.
`APPLIED` evidence is never cleaned up.

---

## 12. Environment variables

| Variable | Purpose |
|---|---|
| `LEDGER_DATABASE_URL` | PostgreSQL connection for the ledger. Must not point at `DATABASE_URL`. |
| `LEDGER_OWNER_PASSWORD_HASH` | scrypt hash of the owner password. |
| `LEDGER_VIEWER_PASSWORD_HASH` | scrypt hash of the viewer password. |
| `LEDGER_SESSION_SECRET` | 32+ characters, used to sign session cookies. |
| `LEDGER_PROPOSAL_SECRET` | Optional. 32+ characters for signing proposal tokens. When absent, a distinct key is derived from the session secret. |
| `ANTHROPIC_API_KEY` | Server-side key for screenshot interpretation. |
| `LEDGER_ANTHROPIC_MODEL` | Model identifier for the interpreter. Required — there is no default. |
| `LEDGER_ANTHROPIC_BASE_URL` | Optional. Overrides the API host for a proxy or an integration test. |

`LEDGER_OWNER_PASSWORD_HASH` and `LEDGER_VIEWER_PASSWORD_HASH` are **bootstrap
only**: they seed the credential rows on first run and are ignored afterwards.

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

Browser tests need a running server with the ledger environment configured:

```bash
PROOF_LEDGER_BASE_URL=http://127.0.0.1:3111 npx playwright test
```

The signed-in specs additionally need a provisioned ledger database and skip
themselves unless `PROOF_LEDGER_E2E_DB=1`, `PROOF_LEDGER_OWNER_PASSWORD` and
`PROOF_LEDGER_VIEWER_PASSWORD` are set. Use fictional data only, and never point
them at a ledger holding real records.

### What the Jest suite proves

- the fixed CAD $36,000.00 opening obligation — only `3600000` is accepted;
- base deposits, withdrawal principal versus extra repayment, partial and full
  repayment, multiple withdrawals, historical versus current totals, and an
  explicit no-double-counting assertion;
- repayments never touch the base;
- **proposal binding** — altered amount, date, type, required repayment or
  evidence id are all rejected; extra fields posted alongside the token are
  ignored; expired tokens and replays after a successful apply are rejected; a
  token issued against a different chain head is rejected; swapped evidence
  bytes and a mismatched instruction hash are rejected;
- **integrity** — clean history passes; edited amounts, removed records, an
  edited extra column, replaced screenshot bytes, missing evidence and a
  reworded instruction all fail with a specific reason;
- **adjustments** — base, principal and extra scopes; effective totals; status
  recalculation; the original record untouched; the adjustment visible in
  history; corrections below zero refused;
- **credentials** — bootstrap seeding happens once; a redeploy cannot overwrite
  a changed password; owner and viewer rotation; a viewer cannot rotate any
  password; the owner rotates the viewer's without the old one;
- **sessions** — credential versions embedded; stale owner and viewer sessions
  rejected; 12-hour owner and 30-day viewer lifetimes;
- **viewer access** — owner can disable and re-enable; disabled viewers cannot
  log in and existing sessions die; the owner is unaffected;
- **pending evidence** — created PENDING, promoted to APPLIED, expired pending
  rows purged, applied evidence never purged;
- notes never change a financial value.

### Live verification performed on this branch

The full stack was exercised against a real PostgreSQL database and a running
production build, with a local stand-in for the Anthropic API (via
`LEDGER_ANTHROPIC_BASE_URL`) so the owner flow could run end to end:

- owner and viewer login, credential rows seeded into the database;
- the fixed obligation — `CAD $10,000` refused, `CAD $36,000.00` locked;
- the full financial scenario: deposit CAD $500 → withdrawal CAD $100 with
  CAD $20 extra → partial CAD $50 → final CAD $70, ending at Base Remaining
  CAD $35,500.00, outstanding CAD $35,500.00, historical extra still CAD $20.00;
- the attack path — re-sending the signed token with `amountCents: 100000`,
  a different type, date and required repayment applied the signed CAD $100
  withdrawal unchanged; replaying the token afterwards failed with `CHAIN_MOVED`;
- a `WITHDRAWAL_EXTRA` adjustment of −CAD $10 producing effective totals while
  the original row kept principal CAD $100 / extra CAD $20 / required CAD $120;
- direct database tampering with screenshot bytes and with the stored
  instruction, each detected with the matching integrity reason;
- viewer password rotation by the owner, owner password rotation, and the viewer
  access switch — each invalidating the right sessions and leaving the owner
  working;
- 34 Playwright tests across desktop and mobile viewports.

## 15. Deployment

1. Provision a PostgreSQL database dedicated to the ledger. It must not be the
   ATA business database, and must not be Supabase.
2. Generate the bootstrap hashes and secrets:
   ```bash
   npm run ledger:hash-password -- "a long owner password"
   npm run ledger:hash-password -- "a long viewer password"
   openssl rand -base64 48   # LEDGER_SESSION_SECRET
   openssl rand -base64 48   # LEDGER_PROPOSAL_SECRET (optional)
   ```
3. Set the environment variables on the canonical Vercel project — for the
   Preview environment if that is where the owner will test, and for Production
   when it goes live. Never commit any value.
4. Deploy. `postinstall` and `build` both run `prisma generate` for the ATA
   schema and `ledger:generate` for the ledger schema.
5. Create the tables once against the ledger database:
   ```bash
   LEDGER_DATABASE_URL="…" npm run ledger:db:push
   ```
6. Open `/proof-ledger`, sign in as owner, tick the confirmation and press
   **Lock Original Obligation**.
7. Confirm `/robots.txt` disallows `/proof-ledger` and that the page is not
   linked anywhere in ATA.

If the Vercel project has Deployment Protection enabled, preview URLs require a
Vercel login. Either share the protection bypass, or deploy to an environment
the owner can reach directly from a phone.

### Builds that are cancelled before they start

`at-awebproject` has Vercel's **Only build verified commits** setting enabled.
A commit without a verified GitHub signature is cancelled rather than built, so
there is no build log and the pull request simply turns red with
"Canceled from the Vercel Dashboard". The deployment record names the cause:

```
"githubCommitVerification": "unverified"
"errorLink": ".../git-settings#verified-commits"
```

Commits pushed through the GitHub API are signed automatically and build.
Commits pushed from a local git without a signing key do not. To push from a
workstation, either configure signing:

```bash
git config gpg.format ssh
git config user.signingkey ~/.ssh/id_ed25519.pub
git config commit.gpgsign true
```

(then add that key to GitHub as a **signing** key, not just an authentication
key), or turn the setting off under Settings → Git on the project.

### The ledger Prisma client must be traced into the bundle

The ledger client is generated to `node_modules/.prisma/proof-ledger-client`
rather than the default location, so Next.js does not trace it into the
serverless bundles on its own. `next.config.js` lists it under
`experimental.outputFileTracingIncludes` for the ledger page, the statement page
and the ledger API routes.

Without that, the query engine binary is missing at runtime and every ledger
request fails with `PrismaClientInitializationError`, which the application
reports as "Ledger database unavailable" — indistinguishable from a genuine
connection problem. Verify after a build with:

```bash
grep -c proof-ledger-client .next/server/app/proof-ledger/page.js.nft.json
```

A zero there means the bundle is broken regardless of what `LEDGER_DATABASE_URL`
contains.

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
- Apply is bound to a server-signed proposal, so the browser cannot substitute
  transaction facts between review and approval.
- Screenshot bytes are re-hashed at apply time and at every integrity check —
  the stored hash column is never trusted on its own.
- Passwords are database-owned with versioned credentials, so rotation actually
  invalidates other devices.
- Settings responses contain no hash, secret, connection string or API key.
- Access does not rely on the URL being secret.

---

## 17. Rollback and recovery

- **Data**: financial truth is reconstructable from `ledger_transactions`
  alone. Back up the ledger database with `pg_dump` before any migration.
- **A wrong record**: never edit or delete it. Record an `ADJUSTMENT`
  referencing it, with a reason.
- **A suspected tamper**: open `/api/proof-ledger/integrity`, or read the
  Integrity line in Settings. Failures name the exact transaction codes and the
  kind of break, without echoing any content.
- **A forgotten owner password**: set a fresh `LEDGER_OWNER_PASSWORD_HASH`, then
  delete the `OWNER` row from `ledger_credentials` so the next start re-seeds
  from it. This is the one operation that needs direct database access.
- **A lost viewer password**: the owner rotates it from Settings; no database
  access needed.
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
- **Adjustments are additive, not retroactive re-statements.** History shows the
  original figure and the correction beside it; there is no single "as if it had
  always been" record.
- **Light appearance is a token remap**, not a separately designed theme. It is
  legible and consistent, but the interface was designed dark first.
- **No note attachments** in v1.
- **The AI interpreter needs network access.** With no key configured, or the
  service unreachable, analysis returns a clear error and the owner cannot add a
  record until it recovers.
- **A forgotten owner password needs database access** to reset, by design —
  there is no email recovery and no second owner.
- **Browser specs that need a database are skipped by default**, so a clean
  checkout proves the login, exposure and access-control paths but not the
  signed-in dashboard.
