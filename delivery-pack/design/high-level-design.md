# High-Level Design - Review Readiness Matrix

## Goal

Show how a proposed delivery move becomes a review readiness matrix across
backend, BFF, frontend, and verification surfaces.

This HLD is intentionally compact. It aligns the team before an agent
implements, and it gives reviewers a stable context artifact for the loop.

## Baseline

The current app already supports Review Signal Details:

```text
Cobold concern + Hero move + system mood
-> signal, reason, next action, evidence prompts, checklist
```

The new slice keeps the readiness signals but replaces the free-text input with
structured evidence data.

## Scope

In scope:

- Structured review readiness request.
- Required evidence derived from affected surfaces and risk flags.
- Missing evidence calculation.
- Review matrix rows for affected surfaces.
- Backend/BFF/frontend boundary updates.
- Contract, Bruno, DPS-lite, and browser verification surfaces.

Out of scope:

- Authentication.
- Persistence.
- User management.
- Real scoring framework.
- Production topology.
- Environment-specific configuration.

## System Context

```text
Hero proposer / reviewer
-> Angular UI
-> NestJS BFF
-> Spring Boot API
-> Review readiness response
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
| Angular UI | Collect change title, description, affected surfaces, provided evidence, and risk flags. Render signal, stop condition, next action, and review matrix. |
| NestJS BFF | Keep the UI contract stable, map backend field names to UI-facing names, and aggregate BFF/backend runtime status. |
| Spring Boot API | Derive required evidence, missing evidence, signal, stop condition, next action, and review matrix rows. |
| Contracts | Keep OpenAPI, PlantUML, and sample payloads aligned with behavior. |
| Bruno | Provide participant-friendly manual/API CLI smoke checks during development. |
| Testautomation | Provide the heavier DPS-lite API automation gate from outside the code. |

## Design Decisions

- The backend owns readiness rules and evidence derivation.
- The BFF owns field-name translation only; it should not duplicate readiness
  logic.
- The UI owns input ergonomics and matrix readability.
- The loop treats contract samples, API smoke, DPS-lite, browser evidence, and
  diff scope as feedback instruments.

## Assumptions

- The demo uses deterministic rule-based readiness logic so participants can
  reason about the loop without model nondeterminism.
- HLD/LLD stay short and reviewable during the workshop.
- Browser evidence can be captured live or replayed from a prepared run.
- The baseline status panel remains useful but is not the core workshop slice.

## Risks

- The agent may over-expand the design into persistence, auth, or a scoring
  framework.
- The matrix can become process theater if required evidence is not tied to
  affected surfaces and risk flags.
- The BFF can accidentally hide backend contract or validation behavior.
- UI wording can look successful while API behavior is still unverified.
- Harness checks can become too broad for a 3-hour workshop if the slice is not
  kept narrow.

## HLD Done Condition

- System boundaries are clear.
- Ownership of backend, BFF, frontend, and verification behavior is explicit.
- The sequence diagram matches the intended flow.
- Risks and non-goals are visible before implementation.
- The matrix has a clear verification path through API smoke, DPS-lite, and
  browser evidence.
