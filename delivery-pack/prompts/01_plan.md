# Prompt 01 - Scope The Review Readiness Slice

Use this before design, contracts, or implementation.

```text
You are working in the Cobold vs Hero workshop repo.

Current baseline:
The app already implements Review Signal Details. It accepts coboldConcern,
heroMove, and systemMood, then returns signal, headline, reason, reviewer note,
next action, evidence prompts, and checklist.

New workshop goal:
Evolve the baseline into Review Readiness Matrix.

The proposed change should accept:
- changeTitle
- changeDescription
- affectedSurfaces
- providedEvidence
- riskFlags

It should return:
- signal
- headline
- requiredEvidence
- missingEvidence
- stopCondition
- nextAction
- reviewMatrix rows with surface, expected evidence, provided evidence, gap,
  and next action

First inspect:
- docs/demo-task.md
- delivery-pack/product/product-brief.md
- delivery-pack/design/high-level-design.md
- delivery-pack/design/low-level-design.md
- delivery-pack/testing/acceptance-and-test-plan.md
- contracts/openapi/cobold-briefing-api.yaml
- backend/
- bff/
- frontend/
- manual-api/
- testautomation/

Return:
- scoped task
- non-goals
- acceptance criteria
- expected files or surfaces to change
- verification strategy
- likely stop conditions
- questions that must be answered before code

Do not edit yet.
```
