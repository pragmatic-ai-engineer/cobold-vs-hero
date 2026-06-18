# Design Decisions

## D01 - Review Signal Contract

Status: Accepted

## Context

The workshop needs a clean vertical slice that spans backend, BFF, frontend, and
verification without copying enterprise implementation complexity.

The original response had a signal, headline, reviewer note, next action, and
checklist. That was useful for a UI demo but not strong enough for loop
engineering because the reason and evidence target were partly hidden in the
frontend.

## Decision

Make the backend response carry explicit review-signal details:

- `reason`: why the signal was selected.
- `evidencePrompts`: questions that guide proof collection.

The BFF maps backend fields into UI-facing names, and the frontend renders the
mapped result.

## Consequences

- API smoke can assert behavior without inspecting frontend code.
- The BFF has a real mapping responsibility.
- The UI can show evidence prompts without duplicating business reason logic.
- The loop contract has a measurable target for API, UI, and review evidence.
