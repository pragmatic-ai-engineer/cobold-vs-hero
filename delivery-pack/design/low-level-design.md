# Low-Level Design - Briefing Endpoint

## Endpoint

`POST /api/cobold-vs-hero/briefing`

Canonical contract:

- `contracts/openapi/cobold-briefing-api.yaml`

Representative examples:

- `contracts/samples/truce-request.json`
- `contracts/samples/sparring-request.json`
- `contracts/samples/shield-wall-request.json`
- `contracts/samples/truce-response.json`

## Request

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `coboldConcern` | string | yes | Risk-aware concern from the reviewer role. |
| `heroMove` | string | yes | Proposed delivery move. |
| `systemMood` | string | yes | Lightweight context that can raise or lower risk. |

## Backend Response

| Field | Type | Notes |
| --- | --- | --- |
| `signal` | string | `truce`, `sparring`, or `shield-wall`. |
| `headline` | string | Short human-readable summary. |
| `reason` | string | Why this signal was selected. |
| `coboldWisdom` | string | Reviewer note that keeps the risky assumption visible. |
| `heroNextStep` | string | Recommended next delivery action. |
| `evidencePrompts` | string[] | Questions that guide proof collection. |
| `checklist` | string[] | Concrete review checklist items. |

## BFF Mapping

| Backend field | UI field |
| --- | --- |
| `signal` | `signal` |
| `headline` | `headline` |
| `reason` | `reason` |
| `coboldWisdom` | `reviewerNote` |
| `heroNextStep` | `nextAction` |
| `evidencePrompts` | `evidencePrompts` |
| `checklist` | `checklist` |

The BFF should stay thin. It maps field names and forwards behavior; it does not
own classification rules.

## Classification Rules

The backend computes a simple risk score from the request text:

- Production, release, payment, billing concerns raise risk.
- Auth, customer, and data concerns raise risk.
- Batch, integration, contract, legacy, migration, and refactor concerns raise
  risk.
- Panic, chaos, and tired mood raise risk.
- Small, test, review, and adapter delivery moves lower risk.

Signal thresholds:

| Score | Signal |
| --- | --- |
| `0..3` | `truce` |
| `4..6` | `sparring` |
| `7+` | `shield-wall` |

## Validation

The backend rejects blank request fields through validation annotations.

Current BFF behavior turns non-2xx backend responses into a service-unavailable
response. That is acceptable for the workshop slice, but it is a useful review
finding if the task expands toward production-grade validation behavior.

## Verification Cases

| Case | Expected signal | Evidence |
| --- | --- | --- |
| Small reviewed UI/support change | `truce` | Backend unit test, Bruno smoke, DPS-lite testautomation. |
| Inconsistent customer API/UI mapping | `sparring` | Bruno smoke and DPS-lite testautomation assert acceptance-criteria prompt. |
| Production payment integration refactor | `shield-wall` | Backend unit test, Bruno smoke, DPS-lite testautomation, browser result panel. |

## LLD Done Condition

- OpenAPI request/response shape matches backend behavior.
- BFF mapping table matches implementation.
- Samples, Bruno smoke requests, and DPS-lite testautomation cover representative
  signals.
- Validation behavior and known gaps are explicit.
- Browser evidence shows the fields that the API smoke checks assert.
