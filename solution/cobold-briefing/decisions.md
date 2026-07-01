# Solution Decisions

## D01 - Review Signal Contract

Status: Accepted

### Context

The workshop needs a clean vertical slice that spans backend, BFF, frontend, and
verification without copying enterprise implementation complexity.

The response must be strong enough for loop engineering. A signal and headline
alone are not enough because the reason and evidence target would be partly
hidden in frontend wording.

### Decision

Make the backend response carry explicit review-signal details:

- `reason`: why the signal was selected.
- `evidencePrompts`: questions that guide proof collection.
- `checklist`: concrete review checks tied to the signal.

The BFF maps backend fields into UI-facing names, and the frontend renders the
mapped result.

### Consequences

- API smoke can assert behavior without inspecting frontend code.
- The BFF has a real mapping responsibility.
- The UI can show evidence prompts without duplicating business reason logic.
- The loop contract has a measurable target for API, UI, and review evidence.

## D02 - Solution Package Before Implementation

Status: Accepted

### Context

The workshop mirrors a workflow where a solution architect first writes the
end-to-end plan, then the implementation team expands it into lower-level
details and contract artifacts.

The previous `delivery-pack/design` folder was too broad and was removed during
repo cleanup, which also removed the HLD and LLD checks from the visible flow.

### Decision

Use `solution/cobold-briefing/` for pre-implementation solution artifacts:

- `hld.md`
- `lld.md`
- `decisions.md`
- `acceptance-and-test-plan.md`

Keep executable contract artifacts in `contracts/`.

### Consequences

- `solution/` avoids confusion with frontend/Figma design.
- HLD/LLD are visible before code changes.
- Contract artifacts stay close to the swagger-style workflow.
- CI can check that the solution layer exists.

## D03 - Deterministic Scoring For The Demo

Status: Accepted

### Context

The briefing tool is a workshop target. Participants need to understand how a
request turns into a signal and how tests prove the behavior.

### Decision

Use deterministic keyword and context scoring in the backend instead of model
output or a persisted risk framework.

### Consequences

- The slice is predictable and testable.
- Backend tests and API smoke checks can assert exact signals.
- The demo stays focused on solution-to-contract-to-code flow.
- This is explicitly not a production-grade risk model.

