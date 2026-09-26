# YK Systems HQ Governance Bootstrap

**Repository:** `Yoniboyy055/ATAwebproject`  
**Status:** MANDATORY YK SYSTEMS GOVERNANCE BOOTSTRAP  
**Canonical HQ:** `Yoniboyy055/Yksystems-HQ-Operations`

Canonical policy paths in HQ:
- `operations/governance/cross-model-authority-standard-v1.md`
- `operations/governance/yk-mandatory-operating-standard-v1.md`
- `operations/governance/yk-repository-governance-bootstrap-standard-v1.md`

Authority: current owner decision → current HQ policy → current project/client policy → task/session instructions → historical memory.

Automatically apply the relevant **Executive Cabinet**, **Income & Asset Engine**, **Security & Production Readiness**, **Design & UX Quality**, and **Interaction Cost / Path Efficiency** gates.

**"It works" is not enough.** Before material work is called done/ready/approved/launch-ready/production-ready, account for applicable business/authority, execution, security/reliability, design/UX, path-efficiency, and evidence gates. Mark irrelevant gates N/A with a reason.

When speed conflicts with quality: **ship smaller, not weaker**.

If private HQ cannot be read, this baseline still applies. Do not guess a material company/commercial/security/production/authority decision that requires current HQ state; stop/escalate.

Local ATA rules may be stricter, but may not weaken HQ. Do not copy HQ secrets, credentials, client-confidential data, or unrelated internal content into this repository.

## Shared simulation tool — MiroFish

MiroFish is a registered **shared YK Systems synthetic-audience and multi-agent scenario-simulation tool**. It is not a dependency to install inside this project by default.

Automatically consider MiroFish when material work depends on likely customer/audience/stakeholder reactions, objections, adoption behavior, pricing or offer response, onboarding/flow response, launch/message response, or second-order multi-actor effects.

If using MiroFish would materially reduce uncertainty or expose failure modes, route the scenario through the shared YK Systems MiroFish capability when available. The owner does not need to remember to request it.

Rules:

- label MiroFish output as **synthetic evidence**;
- never present it as proof of demand, willingness to pay, conversion, retention, or statistically representative customer behavior;
- use real-user/customer/payment evidence for consequential commercial validation;
- do not copy secrets, credentials, unnecessary PII, or confidential client data into a simulation seed;
- do not embed/fork MiroFish into this project without a separate owner-approved technical/licensing decision.

If MiroFish is materially required but unavailable in the active runtime, report:

`MIROFISH_REQUIRED_BUT_UNAVAILABLE`

Do not silently replace it with one model pretending to be a multi-agent simulation.

## Immediate activation — no grandfathering

This governance is **effective immediately for all open and in-progress YK Systems work in this repository**, including tasks, branches, pull requests, work items, release candidates, client deliverables, reviews and deployment plans that started before this bootstrap was installed.

Before the next material edit, review, merge, release, delivery, production authorization or completion claim:

1. re-read this `YK_SYSTEMS_HQ.md` and the current local project instructions;
2. re-evaluate the active work against the applicable mandatory operating systems and the six-question completion gate;
3. correct material gaps before proceeding;
4. record any N/A gate, blocker, known debt or owner-authorized exception explicitly.

Open work is not grandfathered by its start date or by an earlier review/approval.

Finally closed historical work does not need to be reopened solely because of this rule. If it is reactivated, modified, re-released or used as the active basis for new work, current governance applies from that point forward.

A model/agent session already running when this rule changed does not receive Git updates automatically. It must reload/re-read current repository instructions before its next material action. If current governance cannot be verified, stop/escalate rather than continue from stale instructions.

## Six-question completion gate

Before material work is called **done**, **ready**, **approved**, **launch-ready**, or **production-ready**, the executor/reviewer must determine which of the five operating systems apply and provide evidence for the applicable gates.

At minimum, the completion evidence must answer:

1. **Business/authority:** Is the work aligned with the current owner decision and commercial/operational objective?
2. **Execution:** Is the smallest coherent scope actually complete, testable and supportable?
3. **Security/reliability:** Are applicable security, privacy, failure-path, rollback and production-readiness checks verified?
4. **Design/UX:** Does the customer/user-facing result meet YK Systems' visual, usability, accessibility, trust and responsive-quality bar?
5. **Path efficiency:** Is the important happy path clear, and have avoidable clicks, decisions, fields, waits and dead ends been removed?
6. **Evidence:** What was tested/reviewed, what remains unverified, and what known debt or exception is being accepted?

If a gate is irrelevant, mark it **N/A with a short reason** rather than silently omitting it.
