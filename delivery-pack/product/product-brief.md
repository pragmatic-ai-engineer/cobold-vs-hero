# Product Brief - Review Readiness Matrix

## Goal

Help QA, developers, and reviewers see whether a proposed delivery move has the
right evidence for the surfaces it affects before implementation or merge.

## Starting Baseline

The current app implements Review Signal Details. It accepts a Cobold concern,
Hero move, and system mood, then returns a signal, reason, reviewer note, next
action, evidence prompts, and checklist.

The next feature evolves that free-text briefing into a structured review
readiness matrix. The smallest useful behavior is to show risks and evidence
gaps for the selected affected surfaces.

## Users

- QA role: wants to see required quality gates and missing evidence before test
  effort is spent.
- Developer role: wants to know which proof is enough for a small, reviewable
  change.
- Reviewer role: wants affected surfaces, risk, available evidence, stop
  condition, and next action visible in one place.

## Vertical Slice

For a proposed delivery move, let the user choose:

- affected surfaces: frontend, BFF, backend
- available evidence
- risk profile

The system returns:

- one readiness signal: `truce`, `sparring`, or `shield-wall`
- required evidence
- missing evidence
- stop condition
- next action
- a review readiness matrix grouped by affected surface

The frontend shows three input sections:

- affected area
- provided evidence
- risk profile

The response view shows whether the required quality gates are present. For
example, a production-facing risk requires stronger evidence than a dev-only
change, and a backend change requires API smoke and DPS-lite automation without
requiring UI evidence unless the frontend is also affected.

## Readiness Signals

| Signal | Meaning |
| --- | --- |
| `truce` | Selected surfaces have the required evidence for the stated risk profile. |
| `sparring` | The move is useful, but evidence or acceptance details are incomplete. |
| `shield-wall` | Required gates are missing for high-risk or production-facing work; stop and split or gather evidence first. |

## Surface Evidence Rules

| Surface | Required evidence |
| --- | --- |
| Frontend | Frontend build, browser evidence, readable matrix, WCAG-oriented accessibility check. |
| BFF | BFF build, API smoke through the BFF, mapping evidence from backend domain language to UI-facing shape. |
| Backend | Backend test, API smoke, DPS-lite automation for required and missing evidence. |

Risk profile raises strictness. Production, customer-visible, payment, auth,
data, contract, or cross-surface coupling risks require the stronger evidence
set for every affected surface.

## BFF Responsibility

The BFF owns user-facing validation and transformation. It should translate
backend domain data into the UI shape and merge backend responses when multiple
backend data fragments are used on one frontend view.

The BFF should not own domain-specific readiness rules.

## Backend Responsibility

The backend owns domain-specific data handling and readiness evidence rules. It
returns the structured data the BFF can map into the UI-facing matrix.

## Acceptance Criteria

1. A proposed change can include affected surfaces.
2. A proposed change can include available evidence.
3. A proposed change can include a risk profile.
4. The system returns one readiness signal: `truce`, `sparring`, or
   `shield-wall`.
5. The system returns required evidence.
6. The system returns missing evidence.
7. The system returns a stop condition.
8. The system returns a next action.
9. The UI shows a review readiness matrix grouped by affected surface.
10. The UI makes required gates present or missing clear at a glance.
11. The site structure and UI adhere to Web Content Accessibility Guidelines
    expectations relevant to this slice.
12. Bruno smoke covers representative `truce`, `sparring`, and `shield-wall`
    cases.
13. DPS-lite automation checks required evidence and missing evidence.
14. Browser evidence shows the matrix is visible and readable.
15. The PR or handoff summary includes command evidence, browser evidence,
    risks, and known gaps.

## Non-Goals

- Do not use a separate form or modal to collect the information.
- Do not create a new BFF endpoint for this slice unless phase 2 explicitly
  changes that decision.
- Do not create a new backend service for this slice.
- Do not create or update Swagger/OpenAPI, HLD, LLD, or extra documentation in
  phase 1; leave that to phase 2.
- Do not add code comments just to explain straightforward behavior.
- Do not add persistence.
- Do not add authentication.
- Do not create a generic scoring engine.
- Do not redesign unrelated UI.
- Do not integrate with enterprise workflow systems.
