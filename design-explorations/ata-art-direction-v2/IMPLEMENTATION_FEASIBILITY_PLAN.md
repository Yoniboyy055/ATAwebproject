# ATA Art Direction V2: feasibility and phased delivery plan

**Status: planning document for separate owner approval. It authorises nothing.** No application code, merge, release or deployment follows from it. Basis: owner decision of 2 Nov 2026 (issue #24, comment 6578739419), which approves V2 as the creative baseline only.

## 1. What is being planned
The approved direction: Eritrea tourism first, cinematic storytelling, one graded image language, refined editorial type, grounded tactile depth, a responsive hero, one connected scroll journey (Asmara plateau to the Red Sea), and a human-led demo-only enquiry. Not an airline or ticketing look.

## 2. Binding conditions and how each is handled
| Condition (from the decision) | Handling in this plan |
|---|---|
| 3D quality bar unmet | Phase 2 is a gated spike with pass/fail tests. Heavy 3D is not committed to until it passes. |
| Concept imagery is AI, not documentary | Phase 1 replaces it with licensed, authentic imagery. Nothing AI-generated ships as documentary. |
| Reference screenshot unseen | Phase 0 needs the image from the owner. Visual fidelity sign-off waits for it. |
| Discovery to trust to human enquiry path; accessibility, performance, responsive | Built into the acceptance tests (section 6). |
| ATA business sign-offs | Listed as release gates (section 8). Not assumed. |

## 3. Phase 0: inputs only ATA can supply (blocking)
1. The "3D Soft Realism" screenshot (to check the surface and depth treatment against the real reference).
2. A named ATA enquiry contact, response commitment, and whether a photo may be shown.
3. Decision on hero subject: architecture, people, or landscape.
4. Whether Tigrinya or Ge'ez text is wanted, and who reviews it.
5. Confirmation of copy: UNESCO wording, "arranged by people who know the road", and any operational claim.

## 4. Phase 1: visual asset plan
- **Photography brief** for a commissioned or licensed shoot: Asmara avenue at golden hour, people at ease, the escarpment road at consistent light, Massawa and the coast. Shoot to one lighting direction so the scroll move needs no hiding of seams.
- **Rights record per asset:** photographer, licence, permitted channels and territories, duration, model and property releases, approver. Nothing publishes without it.
- **Interim option:** open-licence Wikimedia photographs for internal review only, graded with the same script. They are older snapshots and not a launch hero.
- **Not used:** EOX satellite tiles (non-commercial), Google Earth, owner photographs with unknown rights.
- **Output:** a graded, resized asset set (AVIF/WebP, desktop and mobile crops) with a manifest.

## 5. Phase 2: 3D feasibility spike (isolated, gated)
Test the cheapest approach that can pass, in this order, and stop at the first that meets the bar:
| Option | What it is | Expected cost | Main risk |
|---|---|---|---|
| A. Lit surfaces only | Cards and controls with consistent light, layered shadow, no 3D geometry | Very low | May feel too flat for the reference |
| B. Depth from the photograph | Layered parallax from hand-cut or depth-map layers of a licensed photo, light always matches | Low to medium, plus layer cutting | Cut-out artefacts at layer edges |
| C. Pre-rendered sequence | A Blender-rendered, light-matched object played by scroll (as in the rejected prototypes, but lit to the photograph) | Medium, larger downloads | Looks pasted if light or scale is off |
| D. Real-time scene | three.js with a model | High | Mobile performance, battery, accessibility, loading |

**Pass/fail tests for a spike:** (1) light direction, colour and shadow agree with the photograph on inspection by two people; (2) object scale and perspective match the plate; (3) no visible edge halo at 1x and 2x; (4) 2D fallback is a complete, good-looking page; (5) performance budget below is met on a mid-range Android phone; (6) works with reduced motion; (7) every 3D element has a stated reason in terms of discovery, story or usability.
Spikes live in an isolated folder, are labelled as feasibility tests, and are never reused as launch assets.

## 6. Acceptance tests (apply to any build)
- **Path:** discovery, then trust (named human, plain commitments), then a demo-only enquiry in no more than two screens on mobile.
- **Performance** (targets to confirm with ATA, on a mid-range phone over fast 4G): largest contentful paint under 2.5 s, no layout shift from images, total first-load media within an agreed budget, 3D assets lazy-loaded and skippable.
- **Accessibility:** keyboard and screen-reader path for the whole journey, WCAG contrast on all text over images, meaningful alt text, scroll motion honouring reduced-motion with a complete still fallback, no motion that is needed to understand content.
- **Responsive:** separate 390 px compositions, checked at 320 to 1920 px.
- **Content:** no price, date, duration, capacity or availability unless ATA supplies it; no UNESCO or heritage claim without verified wording.
- **Privacy:** the enquiry stays demo-only until a separate authorisation covers data capture, consent text and storage.

## 7. Phased delivery (each phase needs its own owner approval)
| Phase | Deliverable | Output | Gate to proceed |
|---|---|---|---|
| 0 | Inputs from ATA | Reference screenshot, contact, subject decision | Inputs received |
| 1 | Asset plan and photography | Licensed graded asset set and rights manifest | Rights record complete |
| 2 | 3D spike (isolated) | A short report with pass/fail per test and a recommendation | Owner reviews the report |
| 3 | Static high-fidelity frames from real assets | Revised hero, storyboard and enquiry frames | Owner approves visuals |
| 4 | Implementation authorisation | Written scope, stack, repo and branch decisions | Separate explicit owner approval |
| 5 | Build, test, review | Pages built against section 6 | All acceptance tests pass |
| 6 | Release | Staged release with rollback | All release gates below |

Phases 0 to 3 touch no application code. Phase 4 is where any change to the ATA application is first considered.

## 8. Risks and release gates
**Risks:** photography cost and lead time; licence gaps; 3D that does not pass the spike (mitigation: ship option A or B); heavy media harming mobile load; copy or heritage claims made before verification; scope creep into booking or payments.
**Release gates (all required):** rights manifest complete; ATA sign-off on itinerary, offer, travel requirements, commercial claims, contacts and commitments; acceptance tests passed on real devices; accessibility review; owner explicit release approval; rollback plan.

## 9. What this plan does not claim
It does not estimate cost or dates (they depend on Phase 0 inputs and the photography route). It does not assert that any 3D option will pass; the spike decides. It was produced without seeing the reference screenshot.
