# Cobold vs Hero Delivery Pack

This folder is the shared product and delivery coordination surface for the
workshop demo.

It is intentionally named `delivery-pack`, not `.context`, because it is not
agent memory. It is the product and delivery packet a team can review together:
requirements, decisions, workflow, prompts, and follow-up notes.

## Files

- `product/` - PO-owned product brief and acceptance criteria.
- `design/` - designer/architect-owned HLD, LLD, and design decisions.
- `testing/` - acceptance matrix, smoke checks, browser evidence, and testautomation plan.
- `delivery/` - implementation plan, workflow, and decision log.
- `prompts/` - reusable agent handoffs for the workshop.

Runnable verification surfaces live next to the code they exercise:

- `../manual-api/` - Bruno collection for local/manual API smoke checks.
- `../testautomation/` - DPS-lite Python API testautomation.
