# Prompt 00 - Draft Lightweight HLD/LLD

Use this before asking for an implementation plan.

```text
You are working in the Cobold vs Hero workshop repo.

Goal:
Turn the requested slice into a compact HLD and LLD that can guide an agent
implementation loop.

Inspect:
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
- testautomation/

Return:
- HLD changes needed
- LLD changes needed
- design decision changes needed
- testing plan changes needed
- design risks and assumptions
- contract/test/browser evidence that should verify the design
- stop conditions

Do not implement yet.
```
