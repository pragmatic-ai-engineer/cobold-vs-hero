# High-Level Design - Review Signal Details

## Goal

Show how a proposed delivery move becomes a reviewable briefing across backend,
BFF, frontend, and verification surfaces.

This HLD is intentionally compact. It exists to align the team before an agent
implements, not to replace a full enterprise design package.

## Scope

In scope:

- Review signal flow for `truce`, `sparring`, and `shield-wall`.
- Runtime status flow for the NestJS BFF and Spring Boot backend.
- API/BFF/frontend boundaries.
- Evidence surfaces used by the loop.
- Design assumptions and risks visible to reviewers.

Out of scope:

- Authentication.
- Persistence.
- Real scoring framework.
- Production topology.
- Environment-specific configuration.

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

Canonical flow diagram:

- `contracts/plantuml/briefing-flow.puml`

## Component Responsibilities

| Component | Responsibility |
| --- | --- |
| Angular UI | Collect concern, proposed move, and mood. Render signal, reason, next action, evidence prompts, checklist, and runtime status. |
| NestJS BFF | Keep the UI contract stable, map backend field names to UI-facing names, and aggregate BFF/backend runtime status. |
| Spring Boot API | Classify the review signal and produce reason, reviewer note, next action, evidence prompts, checklist, and backend runtime status. |
| Contracts | Keep OpenAPI, PlantUML, and sample payloads aligned with behavior. |
| Bruno | Provide participant-friendly manual/API CLI smoke checks during development. |
| Testautomation | Provide the heavier DPS-lite API automation gate from outside the code. |

## Design Decisions

- The backend owns signal classification and evidence prompt generation.
- The BFF owns field-name translation only; it should not duplicate scoring
  logic.
- The BFF owns the aggregate runtime status response because the UI should have
  one local endpoint to inspect both services.
- The UI owns readability and screen-share suitability.
- The loop treats contract samples, API smoke, browser evidence, and diff scope
  as feedback instruments.

## Assumptions

- The demo uses deterministic keyword-based classification so participants can
  reason about the loop without needing model nondeterminism.
- HLD/LLD stay short and reviewable during the workshop.
- Browser evidence can be captured live or replayed from a prepared run.

## Risks

- The agent may over-expand the design into persistence, auth, or a scoring
  framework.
- The BFF can accidentally hide backend contract or validation behavior.
- The status page can look healthy while deeper dependencies are unavailable;
  this slice only reports runtime reachability.
- UI wording can look successful while API behavior is still unverified.
- Diagrams can drift from OpenAPI and tests unless they are part of the review
  checklist.

## HLD Done Condition

- System boundaries are clear.
- The sequence diagram matches the intended flow.
- Ownership of backend, BFF, frontend, and verification behavior is explicit.
- Runtime status behavior is documented as a shallow reachability signal.
- Risks and non-goals are visible before implementation.
