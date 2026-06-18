# Design Decisions

## D01 - Keep Review Signal Details As Baseline

Status: Accepted

### Context

The baseline app already spans backend, BFF, frontend, contracts, Bruno,
DPS-lite, and browser verification. It is useful as the workshop starting point
because participants can see a realistic delivery shape immediately.

### Decision

Keep Review Signal Details as `workshop/00-baseline-review-signal-details`.
The Review Readiness Matrix is a new workshop slice stacked on top of that
baseline.

### Consequences

- Participants do not spend the workshop generating a repo from scratch.
- The first prompt can focus on changing behavior, not bootstrapping structure.
- The branch history can show product scope, design, harness, implementation,
  and loop evidence as separate steps.

## D02 - Backend Owns Readiness Rules

Status: Accepted

### Context

The matrix needs deterministic behavior that can be verified by API smoke tests,
DPS-lite automation, and browser evidence.

### Decision

The Spring Boot backend owns readiness rule evaluation:

- derive required evidence from affected surfaces
- add risk-driven evidence requirements
- compute missing evidence
- derive the readiness signal
- build review matrix rows
- return stop condition and next action

The BFF maps field names and keeps the UI contract stable. It does not duplicate
readiness rules.

### Consequences

- API-level tests can prove the core behavior without inspecting frontend code.
- The BFF has a meaningful but thin mapping responsibility.
- UI changes remain focused on rendering and readability.

## D03 - Evidence Matrix Before Automation Repair

Status: Accepted

### Context

The workshop needs a real feedback loop, not just an implementation prompt.

### Decision

Add contract samples, Bruno smoke cases, and DPS-lite automation before the code
implementation branch. The harness branch is allowed to fail against the
baseline because the failure becomes the measured error signal for loop
engineering.

### Consequences

- Participants see why harness engineering precedes reliable loop engineering.
- Failed DPS-lite or smoke checks can be pasted directly into a repair prompt.
- The final branch can demonstrate the negative feedback loop: target, error,
  correction, evidence, and human review.
