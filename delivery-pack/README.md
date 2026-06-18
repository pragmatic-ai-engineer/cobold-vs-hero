# Cobold vs Hero Delivery Pack

This folder is the shared product and delivery coordination surface for the
workshop demo.

It is intentionally named `delivery-pack`, not `.context`, because it is not
agent memory. It is the product and delivery packet a team can review together:
requirements, decisions, workflow, prompts, manual API checks, and follow-up
notes.

## Files

- `product-requirements.md` - behavior contract at product/API level.
- `implementation-plan.md` - small implementation slices.
- `decision-log.md` - accepted decisions and open questions.
- `workflow.md` - how the loop runs during the workshop.
- `adrs/` - lightweight architectural decisions.
- `prompts/` - reusable prompt handoffs for the workshop.
- `manual-api/` - Bruno collection for manual/API smoke checks.

HLD/LLD are deliberately out of scope for this workshop version.
