# Implementation Plan - Review Readiness Matrix

## Slice 0 - Baseline

- Keep the existing Review Signal Details app as the starting point.
- Preserve baseline verification commands and runtime status behavior.
- Branch: `workshop/00-baseline-review-signal-details`.

## Slice 1 - Product And Prompt Scope

- Define the Review Readiness Matrix task.
- Clarify non-goals and acceptance criteria.
- Update the first planning prompt so an agent inspects before editing.
- Branch: `workshop/01-prompt-scope-review-readiness-matrix`.

## Slice 2 - Context Delivery Packet

- Update HLD for system boundaries, responsibilities, assumptions, and risks.
- Update LLD for request fields, response fields, evidence rules, signal rules,
  validation, and verification cases.
- Record design decisions about baseline, backend ownership, and harness-before-
  implementation.
- Branch: `workshop/02-context-delivery-packet`.

## Slice 3 - Harness Before Code

- Update OpenAPI and samples for structured readiness input.
- Update PlantUML flow/state diagrams.
- Add Bruno smoke requests for representative `truce`, `sparring`, and
  `shield-wall` readiness cases.
- Add DPS-lite API automation that fails against the baseline and becomes the
  loop's measured error signal.
- Branch: `workshop/03-harness-before-code`.

## Slice 4 - Implementation Pass

- Update backend request/response records and readiness rules.
- Map backend response through the NestJS BFF.
- Render structured readiness input and matrix output in Angular.
- Run the cheapest relevant checks first, then the broader gates.
- Branch: `workshop/04-implementation-pass`.

## Slice 5 - Loop Repair, Review, And Evidence

- Feed exact failing harness output back into the agent.
- Repair only scoped failures.
- Capture command, API, DPS-lite, browser, and diff evidence.
- Run fresh-context review against the loop contract.
- Branch: `workshop/05-loop-repair-review-evidence`.

## Stop Conditions

- Source of truth remains ambiguous.
- Same check fails twice after a targeted repair.
- Diff expands into persistence, auth, or real scoring.
- Browser evidence cannot show the matrix clearly.
- The agent claims success without command or browser evidence.
