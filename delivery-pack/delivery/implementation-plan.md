# Implementation Plan - Review Readiness Matrix

This plan is preparation for the upcoming implementation loop. It replaces the
baseline Review Signal Details slice with the next vertical slice: structured
review readiness by affected surface, provided evidence, and risk profile.

## Phase 1 - Scope And Plan

- Treat the existing briefing flow as the baseline.
- Scope one vertical slice that reuses the current app shape.
- Keep the user input on the main page with three sections:
  - affected area
  - provided evidence
  - risk profile
- Return a single readiness signal plus required evidence, missing evidence,
  stop condition, next action, and matrix rows grouped by surface.
- Explicitly defer Swagger/OpenAPI, HLD, LLD, and extra documentation updates to
  phase 2 unless the next planning pass changes that decision.

## Slice 1 - Domain Rules

- Define the supported affected surfaces: frontend, BFF, backend.
- Define supported evidence options for the slice:
  - frontend build
  - BFF build
  - backend test
  - API smoke
  - DPS-lite automation
  - browser evidence
  - accessibility/readability check
- Define supported risk profile options:
  - dev-only
  - production-facing
  - customer-visible
  - data/auth/payment/contract risk
  - cross-surface coupling
- Map affected surfaces and risk profile to required evidence.
- Derive missing evidence by comparing required evidence with provided evidence.

## Slice 2 - Backend Behavior

- Keep backend ownership of domain-specific readiness data handling.
- Return structured required evidence, missing evidence, stop condition, next
  action, and matrix rows.
- Keep the readiness logic deterministic and small.
- Do not add persistence, authentication, or a generic scoring engine.
- Do not create a new backend service in this slice.

## Slice 3 - BFF Transformation

- Keep the BFF responsible for user-facing validation and transformation.
- Map backend domain language into UI-facing labels and matrix rows.
- Merge backend fragments into one UI response if the backend response is split.
- Do not duplicate domain readiness rules in the BFF.
- Do not create a new BFF endpoint in this slice unless phase 2 explicitly
  changes the contract plan.

## Slice 4 - Frontend Matrix

- Replace free-text briefing inputs with three main-page sections:
  - affected area
  - provided evidence
  - risk profile
- Render the readiness signal, required evidence, missing evidence, stop
  condition, next action, and grouped matrix.
- Keep the UI readable in a workshop screen share.
- Keep state, labels, and keyboard flow aligned with WCAG expectations relevant
  to the slice.
- Do not redesign unrelated UI.

## Slice 5 - Verification Harness

- Update Bruno smoke cases for representative `truce`, `sparring`, and
  `shield-wall` readiness scenarios.
- Update DPS-lite automation to assert required evidence and missing evidence.
- Capture browser evidence proving the matrix is visible and readable.
- Run offline gates after implementation:

```bash
mise run contracts:check
mise run be:test
mise run bff:build
mise run fe:build
mise run verify
```

- When backend and BFF are running, run:

```bash
mise run api:smoke
mise run api:testautomation
```

## Stop Conditions

- The plan requires a new endpoint or new backend service before phase 2 approves
  that contract change.
- Required evidence cannot be expressed without a broader scoring framework.
- UI work turns into an unrelated redesign.
- HLD, LLD, or OpenAPI drift becomes too large to defer safely.
- Two repair attempts fail against the same verification gate.

## Handoff Requirements

- What changed.
- What was intentionally not changed.
- Commands run and results.
- API and browser evidence.
- HLD/LLD/OpenAPI drift.
- Risks and open questions.
- What reviewers should inspect first.
