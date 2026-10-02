# Claude WP-04 — Completion Report v0.1

**Work package:** WP-04 — ATA Owner Content Approval and Publication Pack
**Role:** Research, Content, and Experience Design Lead (Claude) for YK Systems
**Date:** 26 July 2026
**Status:** Owner pack complete in the repository. **Draft PR #15 open. Not merged. One outstanding step: Google Drive upload.**

---

## 1. Corrected baseline

| Item | Value |
|---|---|
| Previous baseline | `754a6a4` — **superseded** |
| Corrected baseline | **`7ab88e9`** — verified character-for-character against the hash supplied by YK Systems |
| Baseline contents | Claude WP-03 research + Codex WP-03C content-contract integration + Codex WP-03D Supabase staging audit |

**Stage 1 safety verification, before any reset:**

| Check | Result |
|---|---|
| Remote `main` matches the stated hash | ✅ Exact |
| Commits on WP-04 beyond `754a6a4` | ✅ **None** |
| Uncommitted changes in the worktree | ✅ None |
| Untracked or ignored files | ✅ None at all |
| **Work lost by the reset** | ✅ **None — nothing existed to lose** |

Local `main` was fast-forwarded to `7ab88e9`, then the WP-04 branch was hard-reset onto it. No unexpected WP-04 changes existed, so there was nothing to stop and report.

## 2. Branch, worktree, commits

| Item | Value |
|---|---|
| Branch | `claude/wp04-owner-content-approval-pack` |
| Worktree | `/home/user/ATAwebproject-wp04` |
| Baseline | `7ab88e9` |
| Commit 1 | `16286cc` — 24 deliverables, 138,779 bytes |
| Commit 2 | Closure — this report and the Drive upload manifest |
| Draft PR | **#15** — open, draft, not merged |
| Worktree status | Clean |

## 3. Changed files

**26 Markdown files, all in a new `12 Client Approvals/` directory.** Verified mechanically:

| Check | Result |
|---|---|
| All changes Markdown | ✅ |
| `app/`, `lib/`, `components/`, `prisma/`, `scripts/`, `styles/`, `public/` | ✅ Untouched |
| `package*.json`, `tsconfig`, `next.config`, `middleware` | ✅ Untouched |
| Supabase connection opened | ✅ **None** — no Supabase MCP tool called |
| Migrations executed | ✅ None |
| Users created / auth configured | ✅ None |
| Content published | ✅ None |

## 4. Checks

All green on `16286cc`, first run, no re-runs needed:

| Check | Result |
|---|---|
| `install` | ✅ success |
| `lint` | ✅ success |
| `test` | ✅ success |
| `build` (×3) | ✅ success |
| `security-audit` | ✅ success |
| `deploy-staging` / `deploy-production` | skipped (expected on PRs) |
| Vercel previews (×4) | ✅ Ready |
| Unresolved review comments | ✅ **Zero** |

## 5. Legacy package classification

All four records classified **NON-AUTHORITATIVE LEGACY SEED DATA**:

| Record | Type | Price field |
|---|---|---:|
| Economy Package | Local | 299 |
| Business Package | Local | 599 |
| Standard Diaspora Package | Diaspora | 899 |
| Premium Diaspora Package | Diaspora | 1499 |

Three independent disqualifications, any one sufficient: **wrong country** (Ethiopia-focused — Ethiopian residents, Ethiopian visas, travel "home" to Ethiopia, against an Eritrea flagship); **wrong product** (generic flight packages, not a guided multi-day journey); **nothing verified** (prices, service promises and support promises have no evidence).

Required disposition recorded: backed up exactly with a hash, retained in the technical archive, never approved as products, never auto-migrated, never displayed as flagship offerings, establishing no ATA price, inclusion, policy or promise. Legacy prices added to the prohibited-pricing list.

**The specific risk named and mitigated is silent survival** — a schema replacement that preserves data "to be safe", leaving four priced packages readable by a later catalogue query. Nobody decides to publish them; they are simply never removed from the read path. That is how an unverified `1499` becomes a number a customer relies on. Recorded as new risk **V-026** with a recommended technical control: the archive should sit outside the table the public projection reads, so "forgot to filter" cannot become "published".

**Note on source:** the four records were **not read from Supabase**. Their content is taken from the WP-04 brief and the Codex table matrix, per repository controls.

## 6. Owner decisions incorporated

All ten approved governance decisions are treated as settled and recorded as G-01 to G-10: staging project, controlled schema replacement, invitation-only auth, payments disabled, later production environment, ATA controls business facts, YK Systems retains technical authority, legacy archived, legacy not approved, legacy prices never auto-published.

They are consistent with the implementation at `7ab88e9`: `lib/ata/authorization.ts` grants `content:approve` to `ATA_OWNER` and `ATA_ADMINISTRATOR` only, withholds it from `YK_TECHNICAL_ADMINISTRATOR`, and likewise withholds `request:confirm`. **G-06 and G-07 are enforced in code, not merely stated in policy.**

One distinction is made explicit because it is the most commonly over-read: **G-06 establishes who decides; it does not decide anything.** No price, date or policy is approved by any governance decision.

## 7. Owner decisions still required

**41 outstanding**, consolidated from WP-01, WP-03, Codex WP-03C and Codex WP-03D:

| Category | Count |
|---|---:|
| 🔴 Launch-blocking | 14 |
| 🟠 Section-blocking | 12 |
| 🟡 Quality | 7 |
| Technical custody (billing, backup, recovery, incident, privacy, deletion) | 8 |

Plus **24 items routed to qualified professional review**: 10 legal, 5 safety, 4 medical, 3 cultural, 2 official verification. **No legal, medical or safety conclusion is drawn anywhere in this pack** — deliberately, so that there is no plausible-sounding draft to publish by accident.

**The shortest path to a publishable page needs only seven of the 41:** confirm the flagship, choose a pricing model (quote-only is a valid answer), name the approver and releaser, set the response commitment, supply licensed images, publish a privacy notice, and complete the five-minute UNESCO source check.

## 8. Publication blockers

| Blocked | Reason |
|---|---|
| Any price | Not supplied. Legacy prices prohibited |
| Dates, capacity, availability | Not supplied |
| Itinerary detail | Sites unconfirmed as visited or enterable |
| Accommodation, transport | Supplier evidence not supplied |
| Inclusions, exclusions | Not supplied |
| Cancellation, refund, payment policy | Professional review required |
| All UNESCO wording | `whc.unesco.org` still returns HTTP 403 — precondition stands |
| Travel-permit content | Tier-4 sourcing only; official verification required |
| Museum, boat excursion, snorkelling | Operational and safety facts only ATA holds |
| Altitude and heat guidance | Medical review required |
| Historical framing | Cultural review recommended |
| All images | No rights records supplied |
| Testimonials, licences | No verified material supplied |

**APPROVED SOURCE FACT count: still zero.** Published as zero in four documents. Merge approval is not publication approval.

## 9. Drive delivery

**Destination confirmed:** `12 Client Approvals`, folder ID `1qKHthJurWWS_pmaIyKdh3A5NJNJocfJh`, verified to exist. No new top-level folder created. All filenames carry a `_v0.1` suffix so future corrections ship as `_v0.2` rather than same-name duplicates — the structural fix recommended after WP-03.

**Upload status: not performed. All 26 files pending.**

This is reported as an incomplete step rather than glossed. The session reached its practical working limit after producing 24 deliverables, opening PR #15 and confirming CI green. Uploading requires re-emitting roughly 139 KB of document text inline. Starting that and stopping partway would leave the folder half-populated with a manifest claiming otherwise — precisely the silent-partial-state failure this pack identifies as V-026. **A clearly-outstanding step is safer than a misreported one.**

The Drive upload manifest is a complete manual-upload record: destination folder ID, every filename, exact byte size, upload order, and the per-file verification procedure. Either Claude or a human can complete delivery from it without further preparation.

**The repository at PR #15 is canonical and complete for all 26 deliverables.**

## 10. Upload exceptions

| # | Exception | Detail |
|---|---|---|
| 1 | Upload not performed | All 26 pending. Repository canonical. Manual-upload manifest supplied |

No upload failed, was declined or was retried, because none was attempted. **No unsupported delete or update operation was attempted.** The twelve superseded files from WP-02 and WP-03 remain manual cleanup items and did not block WP-04.

## 11. Two observations for Codex

Advisory only. No redesign proposed, no architecture contradicted.

1. **Approve and release share one permission.** `canPublishTour()` resolves to `content:approve`, while the WP-03D architecture describes approval and release as separate steps with separate `approver` and `releaser` fields. This pack documents them as two acts because the owner process requires it; whether the separation should be enforced by a distinct permission is Codex's call. Recorded as risk **V-027**.
2. **Legacy archive placement.** The archive should live outside the table the public projection reads, so a missing filter cannot become a publication.

Also carried forward from the WP-03D audit, as prerequisites for trustworthy staging: **RLS is disabled on all 14 tables** with full Data API privileges and no policies (**V-030**), and Free-plan backup guarantees plus backup/recovery/deletion authorities are unconfirmed (**V-031**).

## 12. Recommendation for the next package

**WP-05 — Approved Content Activation Pack**, triggered by ATA returning decisions from the owner meeting. Every prior package prepared for a decision; WP-05 would be the first to consume decisions and move the approved-source-fact count above zero.

If decisions have not yet returned, two smaller items are useful: a **verified-content first release** (four items need only wording sign-off), and the **UNESCO verbatim upgrade** (still the best effort-to-value ratio in the project).

**Not recommended:** more destination research, drafting policy text, any implementation work, or another governance document.

**The critical path no longer runs through Claude.** It runs through ATA answering questions and Codex applying the schema replacement. Codex items 1 and 2 — legacy export-and-hash, and enabling RLS — have no ATA dependency and could start immediately.

## 13. Success measure for what comes next

One number: **the approved source fact count.** It has been zero across four work packages, correctly. The next package succeeds if it becomes a positive integer with a named approver, a date, and evidence behind each entry.
