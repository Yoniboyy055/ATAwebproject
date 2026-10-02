# Risk Register Update — Claude WP-04 v0.1

**Basis:** extends WP-01 (V-001–V-018), WP-03 (V-019–V-025) and the Codex WP-03D register.
**Baseline:** `7ab88e9`

---

## 1. Risks changed by WP-04

| ID | Item | Previous | New state |
|---|---|---|---|
| V-001 | Pricing model undefined | High | **Unchanged as a risk, but now actionable.** A blank worksheet with an explicit quote-only option exists, so ATA can resolve it in one decision rather than an open-ended discussion |
| V-004 | Business identity unverified | High | Unchanged. Now registered as A-10 with a named blocker |
| V-008 | Testimonials unverified | Medium | Unchanged. No testimonial may be published; register entry exists |
| V-009 | Tour facts unconfirmed | High | **Narrowed.** Each site is now individually listed with the specific confirmation needed, rather than a general gap |
| V-011 | Media licensing unverified | High | **Structurally addressed.** A rights register now blocks publication without a completed row. Risk stays High until ATA supplies media |
| V-014 | Season strategy | Medium | **Unchanged, and now separable.** The two-climate frame lets seasonal content ship without the decision |
| V-019 | Travel-permit dependency | High | **Unchanged and escalated in visibility.** Now A-03 and R-23, flagged as the most consequential open item |
| V-022 | Primary-source verification gap | Medium | **Unchanged.** UNESCO precondition register restates every gated claim; the fix remains a five-minute human check |

## 2. New risks identified by WP-04

| ID | Risk | Description | Severity | Mitigation in place |
|---|---|---|---|---|
| **V-026** | **Legacy data silent survival** | A schema replacement that preserves data "to be safe" can leave four priced packages readable by a later catalogue query. Nobody decides to publish them; they are simply never removed from the read path. This is how an unverified `1499` becomes a number a customer relies on | **High** | Classification recorded; automatic migration prohibited (G-10); recommendation that the archive live outside the table the public projection reads, so "forgot to filter" cannot become "published" |
| **V-027** | **Approve and release conflated** | `canPublishTour()` resolves to `content:approve`, so the two-person control implied by the WP-03D architecture's separate `approver` and `releaser` fields is procedural rather than enforced | Medium | Documented as two distinct acts throughout this pack; flagged to Codex as a preliminary observation |
| **V-028** | **Merge mistaken for approval** | The most likely governance failure now: research on `main` being treated as approved content. "It's merged" reads as "it's agreed" | **Medium-High** | Stated in the merge commit itself, the UNESCO register, the research register and the executive brief. Approved source fact count published as zero |
| **V-029** | **Response commitment unstaffed** | The site's central promise is that a person replies. If published without staffing, every unanswered enquiry damages trust more than having made no promise | **Medium-High** | A-09 and L-03 require the commitment to be named and staffable before publication |
| **V-030** | **RLS disabled on all tables** | Codex WP-03D found full Data API privileges, RLS disabled, no policies, on all 14 tables | **High** (technical) | Codex-owned; recorded here because it gates treating the project as trustworthy staging. Handoff item 9 |
| **V-031** | **Free-plan backup assumptions** | Backup guarantees on the Free plan are not confirmed, and backup/recovery/deletion authorities are unnamed | Medium | A-34–A-40; WP-03D transfer plan requires restore testing before acceptance |
| **V-032** | **Professional review deferred indefinitely** | 24 items need qualified review. The temptation is to publish "reasonable-sounding" policy text instead | **Medium-High** | Policy register offers no draft legal text at all, so there is nothing to publish by accident. Policy fields stay hidden |
| **V-033** | **Image and copy divergence** | Honest copy saying Massawa is partly ruined, paired with a pristine stock photograph, undoes the copy | Medium | Media register M-15 requires accuracy against approved copy |

## 3. Risks explicitly not increased

WP-04 determined no price, date, capacity, inclusion, policy or promise. It modified no application code, no schema, no migration, no authentication and no infrastructure. It created no users and published nothing.

The pack therefore adds no commercial, operational or technical risk. It converts existing unknowns into named, owned, answerable decisions.

## 4. Net posture

**Reduced:** the chance of unverified content reaching a customer, through the twelve-gate checklist, the placeholder discipline and the prohibited-language list.

**Made visible:** V-026 (legacy survival) and V-028 (merge mistaken for approval) — both were latent and unnamed before this package.

**Unchanged and still the largest exposure:** V-019 travel permits. It is the only open item that could affect whether the flagship works as described, and it cannot be resolved by anyone but ATA plus an official source.

## 5. Highest-severity open items

| Rank | ID | Item | Owner |
|---:|---|---|---|
| 1 | V-019 | Travel permits | ATA + official verification |
| 2 | V-030 | RLS disabled | Codex |
| 3 | V-026 | Legacy data survival | Codex + ATA |
| 4 | V-011 | Media licensing | ATA |
| 5 | V-029 | Response commitment staffing | ATA |
