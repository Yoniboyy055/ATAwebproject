# Authentication and Authorization Architecture v0.1

**Status:** Proposed / staging-only unless stated otherwise  
**Baseline:** `b69b512384740658e318c43d5de36aafe43b092d`

OIDC establishes identity; server membership establishes role; permission checks authorize actions. Client roles, cookies, query parameters, forms, metadata, and request bodies are never authority. Public self-registration and legacy shared-password access remain disabled. Production is fail-closed.

## Control statement

No production system, customer record, payment, notification, public content, or business-sensitive decision is changed by this document.
