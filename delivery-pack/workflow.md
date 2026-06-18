# Workshop Workflow

## Operating Model

Use the repo root `mise` tasks as the command surface.

Each surface owns one part of the loop:

- `contracts/` defines target behavior.
- `backend/` computes the review signal.
- `bff/` maps backend behavior to UI shape.
- `frontend/` renders the reviewable briefing.
- `testautomation/` verifies API behavior from outside.
- `delivery-pack/manual-api/` supports manual Bruno smoke checks.

## Loop

```text
shape task
-> inspect sources
-> propose plan
-> Cobold review challenges proof and scope
-> implement smallest slice
-> run code gates
-> run API smoke / testautomation
-> capture browser evidence
-> fresh-context review
-> human decision
```

## Done For The Demo Slice

- `mise run verify` passes.
- `mise run api:smoke` passes while services are running.
- UI evidence is captured or replayed.
- Diff stays inside agreed surfaces.
- PR/handoff notes include commands, evidence, risks, and gaps.
