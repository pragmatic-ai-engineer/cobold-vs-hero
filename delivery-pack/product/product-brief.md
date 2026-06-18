# Product Brief - Review Signal Details

## Goal

Help a delivery team turn a risky or vague engineering idea into a reviewable
delivery slice.

## Users

- Product/PO role: wants a clear decision about whether the work is ready.
- Designer/architect role: wants HLD/LLD alignment before implementation.
- Backend/BFF/frontend engineer: wants a small implementable scope.
- Tester: wants concrete evidence expectations.
- Reviewer: wants risk, behavior, and verification visible before merge.

## Behavior

The briefing flow accepts:

- Cobold concern: the risk-aware objection.
- Hero move: the proposed delivery move.
- System mood: lightweight context about urgency or stability.

It returns:

- `signal`: `truce`, `sparring`, or `shield-wall`.
- `headline`: short human-readable signal summary.
- `reason`: why the signal was selected.
- `coboldWisdom`: reviewer note that keeps the risky assumption visible.
- `heroNextStep`: next delivery action.
- `evidencePrompts`: questions that guide proof collection.
- `checklist`: concrete review checklist items.

## Acceptance Criteria

1. The API returns a specific `reason` for each signal.
2. The BFF maps backend response fields into a UI-facing DTO.
3. The UI renders signal, reason, next action, evidence prompts, and checklist.
4. API smoke checks cover truce, sparring, and shield-wall examples.
5. HLD and LLD explain the agreed behavior before implementation.
6. The change stays scoped to briefing behavior and verification surfaces.

## Non-Goals

- Authentication.
- Persistence.
- Real scoring framework.
- Enterprise environment configuration.
