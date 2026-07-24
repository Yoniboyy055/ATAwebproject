# ATA WP-02 Proposed Tour-Domain Model v0.1

## State machine

`DRAFT → IN_REVIEW → APPROVED → PUBLISHED`

From any pre-publication state, an authorized editor may return the record to `DRAFT`. A published tour may move to `SUSPENDED` for temporary removal or `ARCHIVED` for permanent historical retention. Publication requires an `APPROVER` or `ADMIN` identity.

## Verification envelope

Every sensitive public text field uses:

- nullable `value`;
- `public` intent flag;
- one or more evidence references;
- source ID and optional source URL;
- evidence status;
- checker, timestamp, and note.

Rendering requires all three: non-null value, public flag, and `APPROVED_FOR_PUBLICATION` evidence. Otherwise the value is absent, not replaced by fabricated content.

## Tour aggregate

- id and stable slug;
- internal working title;
- publication state;
- verified title, summary, duration, price display, and availability note;
- ordered itinerary days with verified titles/summaries;
- verified inclusions and exclusions;
- source IDs and timestamps.

## Evidence states

`UNVERIFIED`, `OWNER_PROVIDED`, `DOCUMENT_VERIFIED`, `APPROVED_FOR_PUBLICATION`, and `REJECTED`.

## Implemented contract

The Zod contract is in `lib/ata/domain.ts`. The preview record contains only the working candidate name as internal context. All commercial/public fields are null and hidden.

## Future extensions requiring approval

Media rights records, departure/date entities, accessibility facts, supplier references, policy relations, SEO fields, translations, and accountable database audit fields.

