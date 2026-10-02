# Legacy Package Disposition Record — Claude WP-04 v0.1

**Status:** Owner-facing decision record. Classification is **approved**; the archive and replacement actions are technical work for Codex.
**Baseline:** `7ab88e9`

---

## 1. Classification

The four records in the Supabase `packages` table are classified:

> ## NON-AUTHORITATIVE LEGACY SEED DATA

| Record | Type | Price field | Classification |
|---|---|---:|---|
| Economy Package | Local | 299 | NON-AUTHORITATIVE LEGACY SEED DATA |
| Business Package | Local | 599 | NON-AUTHORITATIVE LEGACY SEED DATA |
| Standard Diaspora Package | Diaspora | 899 | NON-AUTHORITATIVE LEGACY SEED DATA |
| Premium Diaspora Package | Diaspora | 1499 | NON-AUTHORITATIVE LEGACY SEED DATA |

## 2. Why — in plain terms for the owner

These four rows are **not ATA products**. They are leftover seed data from an earlier, different build. Three things are wrong with them, and any one would be disqualifying on its own.

**They describe the wrong country.** The wording is Ethiopia-focused: Ethiopian residents, Ethiopian visa and re-entry documentation, Ethiopians living abroad, travelling "home" to Ethiopia. ATA's flagship is an **Eritrea** journey. Publishing Ethiopia-framed content on an Eritrean tour operator's site is not a small copy error — for a diaspora audience it reads as evidence that the operator does not know the region, which is the opposite of the trust ATA needs.

**They describe the wrong product.** They are generic flight-booking packages. ATA's flagship is a guided multi-day journey. The two are different businesses.

**Nothing in them is verified.** The prices, the service promises and the support promises have no evidence behind them. No one has confirmed that ATA offers these things, at these prices, with these inclusions. Under the project's standing rule — no unverified fact reaches a customer — all four fail.

## 3. What must happen to them

| Requirement | Detail |
|---|---|
| **Back up exactly** | Export all four rows byte-faithfully before any schema change, with a hash recorded. Per WP-03D rollback plan step 2, they are exported *separately* from the general dump so they can be produced on request |
| **Keep in the technical archive** | They remain retrievable. This is a business record of what the system contained, and deleting it would destroy evidence |
| **Do not approve as current products** | No approval path may promote them |
| **Do not migrate automatically** | No script may carry them into the public catalogue. Migration must be an explicit, per-record owner decision or not happen at all |
| **Do not display as flagship offerings** | They must not appear on any customer-facing surface, including previews |
| **Do not treat as precedent** | They establish no ATA price, inclusion, policy or service promise |

## 4. The specific risk this record exists to prevent

The failure mode is **silent survival**. A schema replacement that preserves data "to be safe" can leave four priced packages sitting in a table that a later catalogue query happily reads. Nobody decides to publish them; they simply never get removed from the read path.

That is how an unverified `1499` becomes a number a customer relies on. The prohibition on automatic migration (G-10) exists specifically to break that chain.

**Recommended technical control for Codex:** the replacement schema should make it impossible for a legacy row to satisfy the publication predicate — not merely unlikely. The archive should live outside the table the public projection reads, so that "forgot to filter" cannot become "published".

## 5. If ATA wants any of these products

Nothing here prevents ATA from offering a local package, a diaspora package, or a flight-inclusive product. It only prevents *these records* from becoming those products by inheritance.

To offer such a product, it enters as new content through the normal path: value supplied by ATA, evidence attached, approved by ATA, released by ATA. The legacy row may be used as a starting reference for a conversation. It may not be used as the source of a published fact.

## 6. Owner sign-off

| Item | Owner action | Status |
|---|---|---|
| Confirm the classification | ATA Owner acknowledges all four are non-authoritative | ☐ Pending |
| Confirm archive retention period | ATA states how long the archive is kept | ☐ Pending — WP-03D lists retention as "owner review" |
| Confirm none of the four is a current product | Explicit statement, so the record is unambiguous later | ☐ Pending |
| Decide whether any replacement product is wanted | Separate future decision; not required for launch | ☐ Pending |
