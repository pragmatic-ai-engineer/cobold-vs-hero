# Low-Level Design - Review Readiness Endpoint

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

## Request

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `changeTitle` | string | yes | Short name for the proposed delivery move. |
| `changeDescription` | string | yes | Summary of the delivery intent. |
| `affectedSurfaces` | string[] | yes | Any of `backend`, `bff`, `frontend`, `contract`, `testing`. |
| `providedEvidence` | string[] | yes | Evidence already available for review. |
| `riskFlags` | string[] | yes | Any of `production`, `customer-data`, `auth`, `payment`, `unclear-scope`. |

## Backend Response

| Field | Type | Notes |
| --- | --- | --- |
| `signal` | string | `truce`, `sparring`, or `shield-wall`. |
| `headline` | string | Short human-readable readiness summary. |
| `requiredEvidence` | string[] | Evidence expected from surfaces and risk flags. |
| `missingEvidence` | string[] | Required evidence not present in `providedEvidence`. |
| `stopCondition` | string | When the team should stop rather than implement. |
| `heroNextStep` | string | Recommended next delivery action. |
| `reviewMatrix` | object[] | One row per affected surface. |

Review matrix row:

| Field | Type | Notes |
| --- | --- | --- |
| `surface` | string | Affected surface. |
| `expectedEvidence` | string[] | Evidence expected for the surface. |
| `providedEvidence` | string[] | Matching evidence already provided. |
| `gap` | string | `covered` or a short missing-evidence summary. |
| `nextAction` | string | What the team should do for this surface. |

## BFF Mapping

| Backend field | UI field |
| --- | --- |
| `signal` | `signal` |
| `headline` | `headline` |
| `requiredEvidence` | `requiredEvidence` |
| `missingEvidence` | `missingEvidence` |
| `stopCondition` | `stopCondition` |
| `heroNextStep` | `nextAction` |
| `reviewMatrix` | `reviewMatrix` |

The BFF should stay thin. It maps field names and forwards behavior; it does not
own readiness rules.

## Evidence Rules

Base evidence by surface:

| Surface | Required evidence |
| --- | --- |
| `backend` | `backend-test` |
| `bff` | `bruno-smoke` |
| `frontend` | `browser-screenshot` |
| `contract` | `bruno-smoke` |
| `testing` | `dps-testautomation` |

Design evidence:

- Any multi-surface change requires `hld` and `lld`.
- `unclear-scope` requires `hld` and `lld`.

Risk evidence:

| Risk flag | Additional evidence |
| --- | --- |
| `production` | `dps-testautomation`, `browser-screenshot` |
| `customer-data` | `dps-testautomation` |
| `auth` | `dps-testautomation` |
| `payment` | `dps-testautomation`, `browser-screenshot` |
| `unclear-scope` | `hld`, `lld` |

## Signal Rules

| Condition | Signal |
| --- | --- |
| no missing evidence and no high-risk flags | `truce` |
| one or two missing evidence items and no high-risk flags | `sparring` |
| more than two missing evidence items, or any `production`, `payment`, or `auth` flag with missing evidence | `shield-wall` |

## Validation

- Blank `changeTitle` is invalid.
- Blank `changeDescription` is invalid.
- Empty `affectedSurfaces` is invalid.
- Empty arrays are allowed for `providedEvidence` and `riskFlags`.
- Unknown surfaces, evidence, or risk flags should be rejected by validation.

## Verification Cases

| Case | Expected signal | Evidence |
| --- | --- | --- |
| Small backend change with backend test | `truce` | Backend unit test, Bruno smoke, DPS-lite testautomation. |
| Multi-surface UI/API change missing browser and smoke evidence | `sparring` | Bruno smoke and DPS-lite assert missing evidence. |
| Production payment or auth change missing automation/browser proof | `shield-wall` | Backend unit test, Bruno smoke, DPS-lite testautomation, browser result panel. |
| BFF and backend runtime status | `UP` | Backend unit test, Bruno smoke, DPS-lite testautomation, browser status panel. |

## LLD Done Condition

- OpenAPI request/response shape matches backend behavior.
- BFF mapping table matches implementation.
- Samples, Bruno smoke requests, and DPS-lite testautomation cover representative
  signals.
- Validation behavior and known gaps are explicit.
- Browser evidence shows the matrix fields that API smoke checks assert.
