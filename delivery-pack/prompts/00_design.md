# Prompt 00 - Draft Matrix HLD/LLD

Use this before asking for contracts, tests, or implementation.

```text
You are working in the Cobold vs Hero workshop repo.

Goal:
Turn the Review Readiness Matrix product brief into compact HLD and LLD updates
that can guide an agent implementation loop.

Baseline:
The current app already implements Review Signal Details. Do not treat that as
stale. Treat it as the starting point.

Inspect:
- docs/demo-task.md
- delivery-pack/product/product-brief.md
- delivery-pack/design/high-level-design.md
- delivery-pack/design/low-level-design.md
- delivery-pack/design/decisions.md
- delivery-pack/testing/acceptance-and-test-plan.md
- contracts/openapi/cobold-briefing-api.yaml
- contracts/plantuml/briefing-flow.puml
- backend/
- bff/
- frontend/
- manual-api/
- testautomation/

Return:
- HLD changes needed
- LLD changes needed
- design decision changes needed
- testing plan changes needed
- contract/sample changes needed
- browser evidence that should verify the design
- stop conditions

Do not implement yet.
```
