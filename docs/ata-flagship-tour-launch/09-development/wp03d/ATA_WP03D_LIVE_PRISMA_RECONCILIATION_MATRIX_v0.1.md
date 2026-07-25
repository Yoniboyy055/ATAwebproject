# ATA WP-03D Live-Schema-to-Prisma Reconciliation Matrix v0.1

| Required field/capability | Live | WP-03C | Reconciliation |
|---|---|---|---|
| verified nullable tour | package title/price only | `AtaTour` nullable fields | replace |
| evidence | none | source/verification fields | normalize evidence |
| approval/release | blog boolean only | states/runtime release gate | add explicit release actor/time |
| 15-state request | free-text statuses | `AtaRequest` + workflow code | add typed persistence/history |
| manual confirmation | booking text status | authority ID/timestamp | server-enforce |
| roles/ATA-YK split | none | membership/authorization module | add live |
| audit/version history | none | audit model/version ints | append-only events/versions |
| title/summary/destination | incomplete package fields | nullable tour fields | owner-approved migration only |
| dates/status | booking dates only | dates/dateStatus | missing |
| price/status/currency | float/default USD | minor units/status/currency | replace; never infer |
| capacity/availability | none | present | missing |
| itinerary/include/exclude | package includes only | JSON/domain fields | redesign/version |
| accommodation/transport | flight text only | nullable tour fields | missing/unverified |
| media/rights | image strings | media JSON | add evidence/rights |
| assignment/notes | mixed notes | explicit request roles/notes | missing |
| legacy payments/reviews | unsafe dedicated tables | intentionally deferred | archive/remove |
| newsletter/blog | standalone tables | no additive equivalent | defer/redesign |

The checked-in Prisma schema is proposed state, not migration truth, and needs refinement before implementation.

