# Claude-to-Codex Contract Reconciliation Matrix v0.1

**Baseline:** `1699cab1ef05fa7f1d68175b40740719e3444fc3`  
**Claude source:** `ea65b7a5472d143b6a5ab6521cf9e2a26167ed37` (`9d908f70e1e42791814e115765da316623f8aa44`)  
**Scope:** non-production, feature-flagged, test-only

| ID | Codex target | Nullable | Render rule | Dependency |
|---|---|---:|---|---|
| M-01 | Verified content or UI string | No | Safe editorial copy or released value | Editorial review |
| M-02 | Verified content or UI string | No | Safe editorial copy or released value | Editorial review |
| M-03 | AtaTour.media | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-04 | Verified content or UI string | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-05 | Verified content or UI string | No | Safe editorial copy or released value | Editorial review |
| M-06 | Verified content or UI string | No | Safe editorial copy or released value | Editorial review |
| M-07 | Verified content or UI string | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-08 | Verified content or UI string | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-09 | Verified content or UI string | No | Safe editorial copy or released value | Editorial review |
| M-10 | Verified content or UI string | No | Safe editorial copy or released value | Editorial review |
| M-11 | AtaTour / TourDomain | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-12 | AtaTour / TourDomain | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-13 | AtaTour / TourDomain | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-14 | AtaTour / TourDomain | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-15 | AtaTour / TourDomain | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-16 | AtaTour.media | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-17 | AtaTour / TourDomain | No | Safe editorial copy or released value | Editorial review |
| M-18 | AtaTour / TourDomain | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-19 | AtaTour / TourDomain | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-20 | AtaTour / TourDomain | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-21 | AtaTour / TourDomain | Yes | Controlled staging placeholder | Owner approval |
| M-22 | AtaTour / TourDomain | Yes | Controlled staging placeholder | Owner approval |
| M-23 | AtaTour / TourDomain | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-24 | Verified content or UI string | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-25 | Verified content or UI string | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-26 | Verified content or UI string | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-27 | Verified content or UI string | Yes | Controlled staging placeholder | Owner approval |
| M-28 | Review (disabled) | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-29 | Verified content or UI string | No | Safe editorial copy or released value | Editorial review |
| M-30 | Verified content or UI string | No | Safe editorial copy or released value | Editorial review |
| M-31 | Verified content or UI string | No | Safe editorial copy or released value | Editorial review |
| M-32 | Verified content or UI string | No | Safe editorial copy or released value | Editorial review |
| M-33 | Verified content or UI string | No | Safe editorial copy or released value | Editorial review |
| M-34 | request consentVersion | No | Safe editorial copy or released value | Editorial review |
| M-35 | RequestStatus copy map | No | Safe editorial copy or released value | Editorial review |
| M-36 | Verified content or UI string | Yes | Hidden until verified, approved, and released | Owner/research/evidence |
| M-37 | Verified content or UI string | No | Safe editorial copy or released value | Editorial review |
| M-38 | Verified content or UI string | No | Safe editorial copy or released value | Editorial review |

Outcome: aligned or intentionally deferred. Terminology updated to Codex identifiers. No workflow conflict. Separate release after approval was the one missing implementation and is now enforced.

## Safety

No production system, infrastructure, customer data, payment, notification, DNS, identity provider, or public content was changed.

