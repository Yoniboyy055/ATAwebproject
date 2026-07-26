# ATA WP-04V design and change summary

## Visual system

The system retains ATA’s established deep green/navy and gold identity: operational green `#0B3032`, highland ink `#17393B`, signal gold `#F0B44B`, warm light `#F4F1E9`, mineral mist `#CBDAD3`, and controlled terracotta `#A3482E`. Serif display type carries destination storytelling while the existing sans-serif stack handles operations and data. No font, logo, image or commercial asset was added.

The signature visual is the highlands-to-coast descent. It gives the homepage and flagship journey a specific ATA idea without relying on invented cultural symbols. Motion is limited to small hover transitions and respects existing reduced-motion handling.

## Change record

- Homepage: monolithic scripted presentation replaced internally; route retained.
- Navigation: responsive, keyboard-visible public navigation created.
- Flagship tour: route retained and extended with controlled journey, price, dates, important information, request flow and sticky mobile action.
- Customer request: existing test-only form and API contract reused.
- Owner dashboard: `/ata-admin` route retained; overview and all priority owner controls added.
- Tour editor: working-tour readiness and editor capability map added.
- Pricing and availability: explicit placeholder states and locked publishing added.
- Verification/publication: five separate control gates added.
- Request workflow: all 15 statuses surfaced with confirmation restriction.
- Roles: ATA business authority is visible; YK Systems is not presented as business approver.
- Audit: actor/action/entity/value/time/environment presentation added.
- Review mode: `/ata-review` links the public and owner experiences without duplicating operations.

## Placeholder behaviour

Missing information is presented as “Not provided”, “Not published”, “Dates to be confirmed”, “Registration of interest open”, “Request current pricing”, or a locked control. Disabled publication controls explain the missing approval. Empty or unavailable information never silently becomes a public claim.

## Route compatibility

No existing route was removed. `/`, `/tours/flagship-preview` and `/ata-admin` retain their functions. Legacy `/admin`, `/packages`, customer dashboard and API routes remain unchanged. The new `/ata-review` route is non-operational.

