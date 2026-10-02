# Approved Governance Decisions — Claude WP-04 v0.1

**Status:** Record of decisions **already approved** by YK Systems and ATA. These are settled inputs to WP-04, not open questions.
**Baseline:** `7ab88e9`

---

## 1. The ten approved decisions

| # | Decision | Consequence for this pack |
|---|---|---|
| G-01 | Existing Supabase project `ldvnzevwsfpcsilkegck` will be used as **ATA staging** | Every instruction here targets staging. Nothing in WP-04 assumes a production environment exists |
| G-02 | The staging database will use **controlled schema replacement** | Legacy tables are replaced, not patched. Owner content instructions are written against the replacement model, not the legacy `packages` shape |
| G-03 | Authentication will use **invitation-only Supabase Auth** | No self-registration. Every role in the authority matrix is granted by invitation and revocable |
| G-04 | **Online payments remain disabled** | No field, placeholder or customer message in this pack may imply a payment can be taken on the website |
| G-05 | A separate **ATA-controlled production environment** will be created later | "Published" in this pack means released on staging. Public launch is a later, separate gate |
| G-06 | **ATA controls** business facts, prices, policies, confirmation and publication | ATA is the approver of record for every business fact. This is the single most important control in the pack |
| G-07 | **YK Systems retains** technical administration and support authority | YK Systems administers the platform and does **not** approve ATA business facts |
| G-08 | The four legacy package records will be **exported and archived** | Backup before replacement is mandatory, not optional |
| G-09 | The four legacy package records are **not approved public ATA content** | They cannot appear on any customer-facing surface |
| G-10 | The four legacy package prices **must not be published automatically** | No migration path may carry `299 / 599 / 899 / 1499` into a public catalogue |

## 2. What these decisions settle — and what they do not

**Settled.** Environment strategy, authentication model, payment posture, who approves business facts, who administers the platform, and the disposition of legacy data.

**Not settled by them.** Every actual business fact remains outstanding: no price, date, capacity, inclusion, policy or promise is approved by any decision above. G-06 establishes *who decides*; it does not decide anything.

This distinction matters because it is the most common way a governance decision gets over-read. "ATA controls pricing" is not a pricing decision. It is the allocation of authority that makes a pricing decision possible.

## 3. The separation that must not blur

| | ATA | YK Systems |
|---|---|---|
| Business facts (price, dates, capacity, inclusions) | **Decides** | Implements the field, never fills it |
| Policies (cancellation, refund, payment, data) | **Decides**, with professional review | Implements, flags where review is needed |
| Customer confirmation | **Only ATA may confirm** | Cannot confirm on ATA's behalf |
| Publication release | **ATA releases** | Builds the release mechanism |
| Platform, schema, environments, access mechanics | Requests and approves outcomes | **Administers** |
| Evidence storage and audit trail | Supplies evidence | Guarantees it is recorded and immutable |

**G-07 is a limit as much as a grant.** YK Systems holding technical authority is precisely why YK Systems must not be the approver of ATA facts — the party that can change the system must not also be the party that certifies the content, or the audit trail loses its independence.

## 4. Alignment with the implemented architecture

These decisions are consistent with what Codex has built at baseline `7ab88e9`:

- `lib/ata/authorization.ts` grants `content:approve` to `ATA_OWNER` and `ATA_ADMINISTRATOR` only. `YK_TECHNICAL_ADMINISTRATOR` holds `technical:manage` and **not** `content:approve`. G-06 and G-07 are enforced in code, not merely stated in policy.
- `request:confirm` is likewise withheld from `YK_TECHNICAL_ADMINISTRATOR`, matching "only ATA may confirm".
- Feature flags hold `livePayments` false, matching G-04.

**PRELIMINARY CLAUDE OBSERVATION — for Codex, not a redesign.** The WP-03D architecture describes *approval* and *release* as distinct steps with separate `approver` and `releaser` fields, but `canPublishTour()` currently maps release to the same `content:approve` permission. If separation of approval from release is intended to be enforceable rather than procedural, that likely needs a distinct permission. Flagged for Codex's judgement; the authority matrix in this pack documents them as two separate acts regardless, because the owner-facing process requires it.
