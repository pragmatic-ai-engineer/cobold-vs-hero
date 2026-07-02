# Contracts

Executable contract package for the Review Readiness Matrix. These files keep
solution docs, implementation, smoke checks, and automation aligned.

## Contents

| Path | Purpose |
| --- | --- |
| `openapi/cobold-briefing-api.yaml` | Public API contract for status and briefing endpoints. |
| `plantuml/briefing-flow.puml` | Sequence-level flow across UI, BFF, backend, and reviewer. |
| `plantuml/briefing-state.puml` | Readiness signal state model. |
| `samples/*-request.json` | Representative briefing inputs. |
| `samples/*-response.json` | Expected response shapes for truce, sparring, and shield-wall. |
| `samples/status-response.json` | Aggregate status response sample. |

## Check

The root contract check confirms the important files exist:

```bash
mise run contracts:check
```

This is intentionally lightweight. Behavioral proof comes from backend tests,
Bruno smoke, Playwright smoke, and Python testautomation.

## Update Rule

When behavior changes, update in this order:

1. `solution/cobold-briefing/hld.md` or `lld.md` if intent or rules changed.
2. OpenAPI schema.
3. PlantUML diagrams if flow or state changed.
4. Sample payloads.
5. Smoke checks and automation.
6. Implementation.

In small changes, several of those edits can land in one commit, but review
should still compare all surfaces for drift.
