# LLD - Cobold Briefing

## Endpoints

`POST /api/cobold-vs-hero/briefing`

`GET /api/cobold-vs-hero/status`

Canonical contract:

- `contracts/openapi/cobold-briefing-api.yaml`

Representative examples:

- `contracts/samples/truce-request.json`
- `contracts/samples/sparring-request.json`
- `contracts/samples/shield-wall-request.json`
- `contracts/samples/truce-response.json`
- `contracts/samples/status-response.json`

## Briefing Request

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `coboldConcern` | string | yes | Risk-aware concern from the reviewer role. |
| `heroMove` | string | yes | Proposed delivery move. |
| `systemMood` | string | yes | Lightweight context that can raise or lower risk. |
| `targetEnvironment` | enum | yes | `dev`, `staging`, or `production`. |
| `implementationComplexity` | enum | yes | `low`, `medium`, or `high`. |
| `teamExperience` | enum | yes | `junior`, `senior`, or `expert`. |

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

The BFF should stay thin. It maps field names, handles backend reachability, and
returns the UI-facing shape. It does not own classification rules.

## Status Response

The UI calls the BFF status endpoint. The BFF reports itself as `bff-nestjs`,
then probes the backend status endpoint and returns both service entries.

| Field | Type | Notes |
| --- | --- | --- |
| `status` | string | `UP` when both services are up, otherwise `DEGRADED`. |
| `checkedAt` | string | ISO timestamp for the aggregate check. |
| `services` | object[] | Ordered service status entries for BFF then backend. |

Service entry fields:

| Field | Type | Notes |
| --- | --- | --- |
| `service` | string | `bff-nestjs` or `be-java`. |
| `runtime` | string | `nestjs` or `spring-boot`. |
| `status` | string | `UP` or `DOWN`. |
| `checkedAt` | string | ISO timestamp for that service check. |
| `endpoint` | string | Endpoint used for the check. |
| `detail` | string | Optional failure detail when the backend status check fails. |

The backend status endpoint returns its own service metadata plus configured
server port. The BFF intentionally does not expose dependency-level health in
this slice.

## Classification Rules

The backend computes a simple risk score from the request text and selected
context fields.

Base score:

- Production, release, payment, or billing concerns add 4.
- Auth, customer, or data concerns add 3.
- Batch, integration, or contract concerns add 2.
- Legacy, migration, or refactor concerns add 3.
- Panic, chaos, or tired mood adds 3.
- Small, test, review, or adapter delivery moves subtract 2.

Multipliers:

| Field | Value | Multiplier |
| --- | --- | --- |
| `targetEnvironment` | `production` | `2.0` |
| `targetEnvironment` | `staging` | `1.5` |
| `targetEnvironment` | `dev` | `1.0` |
| `implementationComplexity` | `high` | `1.5` |
| `implementationComplexity` | `medium` | `1.2` |
| `implementationComplexity` | `low` | `1.0` |
| `teamExperience` | `junior` | `1.2` |
| `teamExperience` | `senior` | `1.1` |
| `teamExperience` | `expert` | `1.0` |

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
| Small reviewed dev change | `truce` | Backend unit test, Bruno smoke, DPS-like testautomation. |
| Inconsistent customer API/UI mapping | `sparring` | Bruno smoke and DPS-like testautomation assert acceptance-criteria prompt. |
| Production payment integration refactor | `shield-wall` | Backend unit test, Bruno smoke, DPS-like testautomation, browser result panel. |
| BFF and backend runtime status | `UP` | Backend unit test, Bruno smoke, DPS-like testautomation, browser status panel. |

## LLD Done Condition

- OpenAPI request/response shape matches backend behavior.
- BFF mapping table matches implementation.
- Samples, Bruno smoke requests, and DPS-like testautomation cover
  representative signals.
- Runtime status response is documented and covered in OpenAPI, sample payloads,
  Bruno smoke, automation, and browser evidence.
- Validation behavior and known gaps are explicit.
- Browser evidence shows the fields that the API smoke checks assert.

