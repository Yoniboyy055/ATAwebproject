# ATA WP-02 Proposed Unified Request-Workflow Model v0.1

## Request types

`INFORMATION`, `CONSULTATION`, `QUOTE`, `BOOKING_REQUEST`, and `PROVISIONAL_RESERVATION`.

## Statuses

`NEW`, `CONTACTED`, `AWAITING_CUSTOMER`, `PROVISIONAL`, `CONFIRMED_OUTSIDE_SYSTEM`, `CLOSED`, and `CANCELLED`.

Only an authorized ATA staff action may set `CONFIRMED_OUTSIDE_SYSTEM`. Submission never changes directly to a confirmed state.

## Flow

Customer input → server-side Zod validation → honeypot/spam gate → durable request record (future migration) → event/outbox → ATA notification → safe receipt.

The WP-02 adapter stops after validation and returns a synthetic test ID. It stores nothing and sends no message.

## Required input

Type, name, email, phone, preferred contact method, consent version, and consent acceptance. Tour, traveler count, preferred date, and message are nullable.

## Receipt language

“Your request was received for test review. It is not a confirmed booking, reservation, price, seat, or payment.”

## Future operational controls

Status-transition permissions, assignment, internal notes, response SLA, redacted logs, duplicate detection, retention/deletion, export controls, idempotency, managed rate limiting, CAPTCHA decision, and transactional outbox retries.

