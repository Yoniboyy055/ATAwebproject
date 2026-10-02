# Post-Meeting Implementation Handoff — Claude WP-04 v0.1

**Purpose:** turn the decision log into sequenced work, with the right party doing each part.
**Complete after the owner meeting.**

---

## 1. Routing rule

| Decision type | Goes to | Why |
|---|---|---|
| A business fact was approved | **ATA** enters it; ATA approves; ATA releases | Only ATA may do this |
| A field needs building or fixing | **Codex** (technical) | Implementation |
| A policy needs drafting | **Professional reviewer** | Not YK Systems, not Claude |
| Wording needs preparing for review | **Claude** | Drafting proposals, never approving |
| Access needs granting | **YK Systems** | Technical administration |
| A decision was deferred | **ATA**, with an owner and a date | Stays visible |

**Nothing routes to YK Systems for business approval.** If an item appears to, it has been mis-routed.

## 2. ATA actions

| # | Action | Owner | Due | Done |
|---|---|---|---|:--:|
| 1 | Enter approved values into the dashboard | | | ☐ |
| 2 | Attach evidence to each entered value | | | ☐ |
| 3 | Approve each field by name | | | ☐ |
| 4 | Release approved fields (separate act) | | | ☐ |
| 5 | Set review dates | | | ☐ |
| 6 | Send policy items to legal | | | ☐ |
| 7 | Engage a cultural reviewer for historical framing | | | ☐ |
| 8 | Verify the travel-permit requirement officially | | | ☐ |
| 9 | Compile media with licence and consent records | | | ☐ |
| 10 | Confirm named role holders to YK Systems | | | ☐ |

## 3. YK Systems / Codex actions

| # | Action | Owner | Due | Done |
|---|---|---|---|:--:|
| 1 | Export and hash the four legacy package rows before any schema change | | | ☐ |
| 2 | Apply controlled schema replacement per WP-03D | | | ☐ |
| 3 | Ensure legacy rows cannot satisfy the publication predicate | | | ☐ |
| 4 | Configure invitation-only auth and issue invitations to named holders | | | ☐ |
| 5 | Verify `livePayments` remains disabled | | | ☐ |
| 6 | Confirm placeholder behaviour for every field (checklist gate 12) | | | ☐ |
| 7 | Confirm the audit trail records enter / approve / release separately | | | ☐ |
| 8 | Consider separating approve from release as distinct permissions | | | ☐ |
| 9 | Enable RLS and add policies — currently disabled on all tables | | | ☐ |
| 10 | Test restore into an isolated environment before acceptance | | | ☐ |

Items 9 and 10 come from the WP-03D audit and are prerequisites for treating the project as trustworthy staging.

## 4. Claude actions

| # | Action | Depends on | Done |
|---|---|---|:--:|
| 1 | Prepare wording for newly approved facts | ATA decisions | ☐ |
| 2 | Update the research register with approved claims | ATA approvals | ☐ |
| 3 | Upgrade UNESCO claims once the source text is supplied | R-24 | ☐ |
| 4 | Prepare policy wording **for professional review**, not as final text | Legal engagement | ☐ |
| 5 | Update the risk register as items close | Ongoing | ☐ |

**Claude does not approve, release, or draft final policy text.**

## 5. Sequencing

**Stage 1 — no dependencies.** Legacy export and hash · UNESCO source check · name the role holders · issue invitations · enable RLS.

**Stage 2 — needs Stage 1.** Release the four verified content items · enter the pricing decision (including quote-only) · set the response commitment · publish the privacy notice once drafted.

**Stage 3 — needs professional review.** Policies · health and heat guidance · water-activity content · historical framing.

**Stage 4 — needs operational confirmation.** Itinerary line by line · departures and capacity · accommodation and transport · permit content.

**Stage 5 — production.** A separate ATA-controlled environment, per approved decision G-05. Not before Stage 1–4 are materially complete.

## 6. Definition of done for a released field

A field is done when all of these are true:

☐ Value entered by an authorised editor
☐ Evidence attached and retrievable
☐ Verified by someone other than the author
☐ Business owner recorded
☐ Professional review complete, where flagged
☐ Approved by ATA, by name and date
☐ **Released as a separate act**
☐ Review date set
☐ Prohibited-language check passed
☐ Placeholder behaviour tested with the value removed

Anything less is in progress, regardless of how finished the page looks.

## 7. Next checkpoint

| Field | Value |
|---|---|
| Date | |
| Purpose | Review Stage 1 completion and first release |
| Required attendees | ATA Owner, YK Systems |
| Success measure | At least one field fully released, and approved source facts above zero |
