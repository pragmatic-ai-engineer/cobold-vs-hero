# HLD - Cobold Briefing

## Goal

Show how a proposed delivery move becomes a reviewable briefing across backend,
BFF, frontend, and verification surfaces.

This HLD is intentionally compact. It exists to align the team before an agent
or developer implements the slice.

## Scope

In scope:

- Review signal flow for `truce`, `sparring`, and `shield-wall`.
- Runtime status flow for the NestJS BFF and Spring Boot backend.
- API, BFF, frontend, contract, and verification boundaries.
- Evidence surfaces used by the delivery loop.
- Assumptions, risks, and non-goals visible before implementation.

Out of scope:

- Authentication.
- Persistence.
- Real scoring framework.
- Production topology.
- Environment-specific runtime configuration beyond the demo deployment.

## System Context

```text
Hero proposer
-> Angular UI
-> NestJS BFF
-> Spring Boot API
-> Review signal response
-> Cobold reviewer / human decision

Angular UI
-> NestJS BFF status endpoint
-> Spring Boot API status endpoint
-> Runtime status panel
```

Canonical contract diagrams:

- `contracts/plantuml/briefing-flow.puml`
- `contracts/plantuml/briefing-state.puml`

## Component Responsibilities

| Component | Responsibility |
| --- | --- |
| Angular UI | Collect concern, proposed move, mood, target environment, complexity, and team experience. Render signal, reason, next action, evidence prompts, checklist, and runtime status. |
| NestJS BFF | Keep the UI contract stable, map backend field names to UI-facing names, and aggregate BFF/backend runtime status. |
| Spring Boot API | Classify the review signal and produce reason, reviewer note, next action, evidence prompts, checklist, and backend runtime status. |
| Contracts | Keep OpenAPI, PlantUML, and sample payloads aligned with behavior. |
| Bruno | Provide participant-friendly manual/API CLI smoke checks during development. |
| Testautomation | Provide the heavier DPS-like API and UI automation gates from outside the code. |

## Solution Flow

1. The Hero proposer describes a delivery move and the Cobold reviewer concern.
2. The UI collects context that affects risk: system mood, target environment,
   implementation complexity, and team experience.
3. The BFF forwards the request to the backend without owning scoring rules.
4. The backend computes a deterministic risk score and selects a signal.
5. The backend returns the reason, reviewer note, next action, evidence prompts,
   and checklist.
6. The BFF maps backend field names to UI-facing names.
7. The UI renders the briefing and status panel for review.
8. The team uses contract samples, smoke checks, automation, and browser
   evidence to decide whether the slice is review-ready.

## Key Decisions

- The backend owns signal classification and evidence prompt generation.
- The BFF owns field-name translation and aggregate status only.
- The frontend owns readable presentation and screen-share suitability.
- The contract package is the executable agreement between solution, code, and
  verification.
- The demo uses deterministic rules instead of model output so participants can
  inspect cause and effect.

## Assumptions

- HLD/LLD stay short enough to review during the workshop.
- Browser evidence can be captured live or replayed from a prepared run.
- The toy scoring model is useful as a workflow target even though it is not a
  production risk model.

## Risks

- The implementation may expand into persistence, auth, or real scoring too
  early.
- The BFF can accidentally hide backend validation or contract behavior.
- The status panel can look healthy while deeper dependencies are unavailable;
  this slice only reports BFF/backend reachability.
- UI wording can look successful while API behavior is still unverified.
- Diagrams, OpenAPI, samples, and tests can drift unless they are part of the
  review checklist.

## HLD Done Condition

- System boundaries are clear.
- The sequence and state diagrams match the intended flow.
- Ownership of backend, BFF, frontend, contracts, and verification behavior is
  explicit.
- Runtime status behavior is documented as a shallow reachability signal.
- Risks and non-goals are visible before implementation.

