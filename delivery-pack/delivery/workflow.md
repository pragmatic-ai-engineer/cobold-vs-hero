# Workshop Workflow

## Operating Model

Use the repo root `mise` tasks as the command surface.

Each surface owns one part of the loop:

- `delivery-pack/design/high-level-design.md` defines system boundaries and flow.
- `delivery-pack/design/low-level-design.md` defines endpoint details and mapping.
- `delivery-pack/testing/acceptance-and-test-plan.md` defines acceptance evidence.
- `delivery-pack/delivery/loop-contract.md` defines the loop goal, loss
  function, constraints, instruments, and stop rules.
- `delivery-pack/delivery/loop-evidence.md` records loop feedback and repair
  evidence.
- `contracts/` defines target behavior.
- `backend/` computes the review signal.
- `bff/` maps backend behavior to UI shape.
- `frontend/` renders the reviewable briefing.
- `testautomation/` verifies API behavior from outside.
- `manual-api/` supports manual and CLI Bruno smoke checks.

## Loop

```text
shape task
-> draft/update lightweight HLD
-> draft/update lightweight LLD
-> inspect sources
-> propose plan
-> Cobold review challenges proof and scope
-> implement smallest slice
-> run code gates
-> run Bruno smoke
-> run DPS-lite testautomation when the loop needs heavier evidence
-> capture browser evidence
-> fresh-context review
-> human decision
```

## Done For The Demo Slice

- `mise run verify` passes.
- `mise run api:smoke` passes while services are running.
- `mise run api:testautomation` passes when heavier API evidence is needed.
- HLD/LLD still match the implemented contract and evidence.
- UI evidence is captured or replayed.
- Diff stays inside agreed surfaces.
- PR/handoff notes include commands, evidence, risks, and gaps.
