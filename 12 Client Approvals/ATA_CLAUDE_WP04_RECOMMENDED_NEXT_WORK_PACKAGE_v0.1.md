# Recommendation for Claude's Next Work Package — WP-04 v0.1

## The honest position first

**The critical path no longer runs through Claude.** It runs through ATA answering questions and through Codex applying the schema replacement. Another Claude research or documentation package would add volume without reducing risk.

So the primary recommendation is conditional: the right next Claude package depends on what ATA returns.

---

## Primary recommendation — WP-05: Approved Content Activation Pack

**Trigger:** ATA has returned decisions from the owner meeting.

**Why it is the right next step.** Every prior package prepared for a decision. This one is the first that *consumes* decisions. It converts answers into released content and moves the approved-source-fact count above zero for the first time in the project.

**Scope:**
1. Take each approved decision and prepare the exact field value, evidence reference and review date for entry.
2. Run the twelve-gate publication checklist against each field and record the result.
3. Upgrade the research register — mark approved claims as approved source facts, with approver and date.
4. Upgrade UNESCO claims to primary-source verified, if the source text has been supplied.
5. Prepare wording for professional review where ATA has engaged reviewers — as proposals, never as final policy text.
6. Produce a first-release manifest: exactly which fields go live, in what order, released by whom.
7. Update the risk register as items close.

**Deliverable location:** `12 Client Approvals/` or a new `13 Content Activation/`, as YK Systems prefers.

---

## If ATA has not yet returned decisions

Do not start WP-05. Two smaller options are useful in the meantime:

**Option A — Verified-content first release (half a day).** Four items are fully verified, non-operational and need only wording sign-off: the destination list, the Massawa description, the two-climate frame, and the 2,300 m descent. Prepare them as a single small release package so ATA can approve four things rather than forty. Momentum matters, and it proves the pipeline end to end.

**Option B — UNESCO verbatim upgrade (minutes).** Still the best ratio in the project. If anyone supplies the text of `whc.unesco.org/en/list/1550/`, all fourteen UNESCO claims upgrade from corroborated to primary-source verified and two dashboard rows unblock.

---

## Explicitly not recommended

- **More destination research.** The five WP-03 topics are done. Additional destinations are speculative until ATA activates a catalogue beyond the flagship.
- **Drafting policy text.** Cancellation, refund, payment, privacy and safety wording needs a qualified professional. Producing plausible-sounding drafts would be the single most dangerous thing this project could do — it would look finished and carry no authority.
- **Any UI or implementation work.** Codex owns implementation.
- **Another governance document.** WP-04 is the governance layer. Adding to it now would be documentation for its own sake.
- **Revisiting the content contract.** It is current with the 15-state lifecycle and needs no change.

---

## What Codex should do next, for sequencing

Not Claude's call, recorded for the plan:

1. Export and hash the four legacy rows — a prerequisite for everything else.
2. Enable RLS and add policies. All 14 tables currently have RLS disabled with full Data API privileges.
3. Apply the controlled schema replacement, ensuring legacy rows cannot satisfy the publication predicate.
4. Configure invitation-only auth and issue invitations once ATA names its role holders.
5. Test restore into an isolated environment before the project is accepted as staging.

Items 1 and 2 are independent of any ATA decision and could start immediately.

---

## Sequencing view

```
ATA owner meeting  →  decisions  →  WP-05 activation  →  first release  →  approved facts > 0
       ↑                                                        ↑
  (blocking)                              (Option A can deliver a slice sooner)

Codex: legacy export → RLS → schema replacement → invitations → restore test
       ↑
  (items 1–2 can start now, no ATA dependency)
```

The two tracks are independent until the first release, which needs both.

---

## The measure of success for the next package

One number: **the approved source fact count.** It has been zero through four work packages, correctly. WP-05 succeeds if it becomes a positive integer with a named approver, a date, and evidence behind each entry.
