# Loop Contract - Review Readiness Matrix

This is the workshop loop contract for the Review Readiness Matrix slice. For
beginners, treat it as the scoreboard. For advanced users, treat it as the loss
function that keeps the agent loop stable.

## Goal

Evolve the baseline Review Signal Details app into a Review Readiness Matrix
that makes required evidence, missing evidence, stop conditions, and per-surface
review gaps visible through backend, BFF, frontend, Bruno, and DPS-lite.

## Loss Function

A run is worse when any of these are true:

- The public BFF contract and UI DTO disagree.
- Bruno smoke cannot prove the happy path quickly.
- DPS-lite catches a contract or behavior mismatch.
- Browser evidence cannot show signal, stop condition, next action, and matrix
  rows clearly.
- The diff expands outside the approved readiness slice.
- The agent claims success without command evidence.

## Constraints

- Do not add authentication, persistence, real scoring, or environment-specific
  enterprise configuration.
- Keep backend readiness rules in the Java service.
- Keep the BFF thin: map backend fields into the UI-facing DTO.
- Keep Bruno as the quick local/manual API smoke layer.
- Keep DPS-lite as the heavier API automation layer.
- Stop after two failed repair attempts for the same failing check.

## Instruments

| Instrument | Command or surface | Role |
| --- | --- | --- |
| Offline verification | `mise run verify` | Broad code gate. |
| Bruno smoke | `mise run api:smoke` | Fast API feedback through the BFF. |
| DPS-lite | `mise run api:testautomation` | Heavier API automation through the BFF. |
| Browser evidence | `http://localhost:4200` | UI proof for reviewer. |
| Diff boundary | `git diff --stat` | Scope control. |

## Iteration Rules

1. Run the cheapest relevant check first.
2. Use exact failing output as the feedback signal.
3. Repair only the surface named by the failure.
4. Rerun the failing check before broad verification.
5. Capture command evidence and remaining warnings.
6. Ask for human review when the loss is low enough to inspect.

## Stop Conditions

- Same check fails twice after targeted repairs.
- Source of truth between product brief, HLD/LLD, OpenAPI, and runtime behavior
  stays ambiguous.
- A repair requires changing the product goal rather than the implementation or
  harness.
- Browser evidence cannot show the matrix without confusing overlap.
- Diff grows beyond the workshop slice.

## Human Review Point

Human review should happen after:

- `mise run verify` passes.
- `mise run api:smoke` passes against running services.
- `mise run api:testautomation` passes against running services.
- Browser evidence is captured or replayed.
- The evidence journal names warnings, assumptions, and unresolved gaps.
