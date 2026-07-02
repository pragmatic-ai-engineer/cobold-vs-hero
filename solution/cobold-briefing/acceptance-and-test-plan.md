# Acceptance And Test Plan - Review Readiness Matrix

This plan tracks the acceptance and verification surfaces for the workshop
baseline. It keeps quick developer smoke checks, browser evidence, and heavier
API/UI testautomation visible in one place.

## Acceptance Criteria

| ID | Acceptance criterion | Primary evidence |
| --- | --- | --- |
| AC1 | API accepts structured readiness input. | Backend unit test, Bruno smoke, DPS-like API testautomation. |
| AC2 | API derives required evidence from affected surfaces and risk flags. | Backend unit test, DPS-like API testautomation. |
| AC3 | API returns missing evidence explicitly. | Bruno smoke, DPS-like API testautomation. |
| AC4 | BFF maps backend response fields into the UI-facing DTO. | BFF build, Bruno smoke, DPS-like API testautomation. |
| AC5 | UI renders signal, stop condition, next action, evidence summary, and matrix rows. | Playwright smoke and OneCare-like UI automation. |
| AC6 | Representative `truce`, `sparring`, and `shield-wall` cases are covered. | Bruno smoke and DPS-like API testautomation. |
| AC7 | HLD/LLD explain behavior before implementation. | Solution review against `solution/cobold-briefing/`. |
| AC8 | Scope stays inside readiness behavior and verification surfaces. | Diff boundary review. |

## Verification Layers

| Layer | Tool / artifact | Command or location | Role |
| --- | --- | --- | --- |
| Offline gates | mise | `mise run verify` | Developer / agent |
| Quick API smoke | Bruno CLI | `mise run api:smoke` | Developer / manual tester |
| Quick UI smoke | Playwright | `mise run ui:smoke` | Developer / reviewer |
| Manual API check | Bruno app | `smoke/api` | Developer / manual tester |
| Heavy API automation | DPS-like pytest | `mise run api:testautomation` | Tester / CI candidate |
| Heavy UI automation | OneCare-like pytest + Playwright | `mise run ui:testautomation` | Tester / reviewer |
| Diff boundary | Git | `git diff --stat` | Reviewer |

## Preconditions

- Backend is running on `http://localhost:8080`.
- BFF is running on `http://localhost:3000`.
- Frontend is running on `http://localhost:4200` for browser checks.

## Quick Smoke Checks

Run after backend and BFF are running:

```bash
mise run api:smoke
```

Expected:

- `01-truce-readiness` returns `200`, `signal=truce`, and a covered matrix row.
- `02-sparring-readiness` returns `200`, `signal=sparring`, and missing
  evidence.
- `03-shield-wall-readiness` returns `200`, `signal=shield-wall`, missing
  evidence, and a split stop condition.

## Heavy API Testautomation

Run after backend and BFF are running:

```bash
mise run api:testautomation
```

Expected:

- Status check passes.
- Truce readiness has no missing evidence.
- Sparring readiness reports missing BFF/browser evidence.
- Shield-wall readiness requires a split for high-risk missing proof.

## Browser Checks

1. Open `http://localhost:4200`.
2. Submit the default sparring readiness input.
3. Verify the page shows:
   - `sparring`
   - missing `bruno-smoke`
   - missing `browser-screenshot`
   - matrix rows for backend, BFF, and frontend
4. Submit a shield-wall readiness input.
5. Verify the page shows:
   - `shield-wall`
   - split stop condition
   - missing automation/browser evidence
   - matrix rows for backend, BFF, frontend, contract, and testing
6. Capture one screenshot of the result panel.

## Evidence Note

Record:

- browser target
- input used
- visible signal
- visible missing evidence
- visible matrix rows
- screenshot path or recording note
- Bruno smoke result
- Playwright smoke result
- DPS-like API testautomation result
- OneCare-like UI testautomation result
- diff boundary summary
- gaps that still need human verification

