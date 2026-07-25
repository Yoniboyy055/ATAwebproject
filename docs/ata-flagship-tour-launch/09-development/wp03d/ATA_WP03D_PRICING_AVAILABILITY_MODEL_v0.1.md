# ATA WP-03D Pricing and Availability Model v0.1

Pricing states: `NOT_PROVIDED`, `DRAFT`, `UNDER_REVIEW`, `APPROVED`, `PUBLISHED`, `TEMPORARILY_UNAVAILABLE`.

Pricing types: `FIXED`, `STARTING_FROM`, `PER_PERSON`, `PER_GROUP`, `CUSTOM_QUOTE`, `CONTACT_ATA`.

Adult, child, supplement, deposit, and taxes/fees are nullable integer minor units with explicit currency. Add validity dates, internal/public notes, evidence, verification, approval, release, and version references.

Availability is a separate explicit state with nullable capacity. Price publication never means availability or confirmation. Online payment remains disabled.

