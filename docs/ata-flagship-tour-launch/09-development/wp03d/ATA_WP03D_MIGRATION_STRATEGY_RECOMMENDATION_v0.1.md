# ATA WP-03D Migration Strategy Recommendation v0.1

Strategy A preserves unsafe semantics. Strategy C offers little value because no operational/customer records exist. Recommend **Strategy B—controlled replacement**.

First export and encrypt the schema and four package rows, hash them, and restore-test them. Quarantine package content; do not migrate it publicly until ATA verifies and approves it. Build the approved schema additively, validate policies and workflow, then archive legacy objects.

Rollback restores the last verified snapshot into a fresh project. Do not combine destructive removal and public cutover in one step.

