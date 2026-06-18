# Product Brief - Review Readiness Matrix

## Goal

Help a delivery team decide whether a proposed change is ready to implement,
needs sharper acceptance criteria, or must be split before implementation.

## Starting Baseline

The current app already returns a review signal with a reason, next action,
evidence prompts, and checklist. That baseline is useful, but it still relies on
free-text interpretation. The workshop slice makes the evidence expectations
explicit and comparable.

## Users

- Product/PO role: wants a clear readiness decision and concrete non-goals.
- Designer/architect role: wants HLD/LLD alignment before implementation.
- Backend/BFF/frontend engineer: wants a small implementable scope with clear
  evidence obligations.
- Tester: wants visible required evidence and missing evidence.
- Reviewer: wants risk, behavior, proof, and stop conditions visible before
  merge.

## Behavior

The readiness flow accepts:

- `changeTitle`: short name for the proposed move.
- `changeDescription`: summary of the delivery intent.
- `affectedSurfaces`: surfaces touched by the change.
- `providedEvidence`: evidence the team already has.
- `riskFlags`: explicit risk signals that should raise review strictness.

It returns:

- `signal`: `truce`, `sparring`, or `shield-wall`.
- `headline`: short human-readable readiness summary.
- `requiredEvidence`: evidence expected for the selected surfaces and risks.
- `missingEvidence`: required evidence that has not been provided.
- `stopCondition`: when the team should pause instead of implementing.
- `nextAction`: the smallest useful next step.
- `reviewMatrix`: row-by-row comparison of expected evidence, provided
  evidence, gap, and next action for each affected surface.

## Acceptance Criteria

1. The API accepts structured readiness input.
2. The API derives required evidence from affected surfaces and risk flags.
3. The API returns missing evidence explicitly.
4. The BFF maps backend fields into a UI-facing DTO.
5. The UI renders signal, stop condition, next action, and matrix rows.
6. Bruno smoke covers representative `truce`, `sparring`, and `shield-wall`
   readiness cases.
7. DPS-lite automation checks required evidence and missing evidence.
8. Browser evidence proves the matrix is readable.
9. The change stays scoped to readiness behavior and verification surfaces.

## Non-Goals

- Authentication.
- Persistence.
- User management.
- Real scoring framework.
- Enterprise environment configuration.
- Historical reporting.
