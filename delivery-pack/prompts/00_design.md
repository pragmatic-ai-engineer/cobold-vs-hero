# Prompt 00 - Draft Lightweight HLD/LLD

Use this before asking for an implementation plan.

```text
You are working in the Cobold vs Hero workshop repo.

Goal:
Turn the requested slice into a compact HLD and LLD that can guide an agent
implementation loop.

Inspect:
- delivery-pack/product-requirements.md
- delivery-pack/high-level-design.md
- delivery-pack/low-level-design.md
- contracts/openapi/cobold-briefing-api.yaml
- contracts/plantuml/briefing-flow.puml
- backend/
- bff/
- frontend/
- testautomation/

Return:
- HLD changes needed
- LLD changes needed
- design risks and assumptions
- contract/test/browser evidence that should verify the design
- stop conditions

Do not implement yet.
```
