# Prompt 01 - Plan The Review Readiness Matrix Slice

Use this before implementation.

```text
You are working in the Cobold vs Hero workshop repo.

Current baseline:
The app implements Review Signal Details. It accepts coboldConcern, heroMove,
and systemMood, then returns signal, headline, reason, reviewer note, next
action, evidence prompts, and checklist.

New workshop goal:
Evolve the baseline into Review Readiness Matrix.

Smallest useful behavior:
For a proposed delivery move, let the user choose affected surfaces, provided
evidence, and risk profile. Return risks and evidence gaps for the selected
surfaces.

Primary users:
- QA, who needs required gates and missing evidence before testing or sign-off.
- Developers, who need to know what proof is enough for a reviewable change.

Expected input:
- affectedSurfaces: frontend, BFF, backend
- providedEvidence
- riskProfile

Expected output:
- signal: truce, sparring, or shield-wall
- requiredEvidence
- missingEvidence
- stopCondition
- nextAction
- reviewMatrix grouped by affected surface

Frontend scope:
- Use three main-page sections: affected area, provided evidence, risk profile.
- Do not use a separate form or modal.
- Show a clear signal for whether required quality gates are provided.
- Keep the matrix visible, readable, keyboard-accessible, and aligned with WCAG
  expectations relevant to the slice.

BFF scope:
- Own user-facing validation and transformation from backend domain language to
  UI-facing shape.
- Merge backend response fragments when they are used on the same UI view.
- Do not duplicate backend domain rules.
- Do not create a new BFF endpoint unless the plan explicitly justifies a phase
  2 contract change.

Backend scope:
- Own domain-specific readiness data handling.
- Derive required evidence and missing evidence from selected surfaces and risk
  profile.
- Do not create a new backend service.

Non-goals:
- No persistence.
- No authentication.
- No generic scoring engine.
- No unrelated UI redesign.
- No enterprise workflow integration.
- No Swagger/OpenAPI, HLD, LLD, or extra documentation updates in phase 1 unless
  the plan explicitly moves them into phase 2.
- No code comments for straightforward behavior.

First inspect:
- AGENTS.md
- delivery-pack/product/product-brief.md
- delivery-pack/testing/acceptance-and-test-plan.md
- delivery-pack/delivery/implementation-plan.md
- delivery-pack/delivery/workflow.md
- delivery-pack/delivery/decision-log.md
- delivery-pack/design/high-level-design.md
- delivery-pack/design/low-level-design.md
- contracts/openapi/cobold-briefing-api.yaml
- backend/
- bff/
- frontend/
- manual-api/
- testautomation/

Return:
- current repo inventory
- scoped vertical slice
- HLD/LLD/OpenAPI drift and whether it can stay deferred
- proposed implementation plan
- expected files or surfaces to change
- verification strategy with Bruno, DPS-lite, and browser evidence
- accessibility evidence to capture
- risks and stop conditions
- questions that must be answered before code

Do not edit yet.
```
