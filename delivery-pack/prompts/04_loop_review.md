# Prompt 04 - Run The Repair Loop

Use this after implementation when at least one harness check fails or when you
need fresh-context review evidence.

```text
You are working in the Cobold vs Hero workshop repo.

Goal:
Drive the Review Readiness Matrix slice toward the loop contract.

Inspect first:
- delivery-pack/delivery/loop-contract.md
- delivery-pack/delivery/loop-evidence.md
- delivery-pack/testing/acceptance-and-test-plan.md
- contracts/openapi/cobold-briefing-api.yaml
- manual-api/
- testautomation/
- backend/
- bff/
- frontend/

Run or review evidence in this order:
1. Cheapest failing check.
2. The check that owns the failed contract or behavior.
3. `mise run verify`.
4. Live Bruno smoke when services are running.
5. DPS-lite when API behavior needs heavier proof.
6. Browser evidence when UI changed.

Rules:
- Use exact failing output as the feedback signal.
- Repair only the surface named by the failure.
- Do not expand into auth, persistence, real scoring, or environment-specific
  configuration.
- Stop if the same check fails twice after targeted repairs.
- Record commands, results, warnings, and remaining human-review gaps.

Return:
- findings first
- repair made or recommended
- evidence collected
- remaining risk
- whether the slice is ready for human review
```
