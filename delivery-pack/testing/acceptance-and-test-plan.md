# Acceptance And Test Plan - Review Readiness Matrix

This plan tracks the acceptance and verification surfaces for the workshop
slice. It keeps quick developer smoke checks, browser evidence, and heavier API
testautomation visible in one place.

## Harness Branch Intent

`workshop/03-harness-before-code` defines the target checks before
implementation. Bruno and DPS-lite are expected to fail against the baseline.
That failure is the measured error signal for the loop.

## Acceptance Criteria

| ID | Acceptance criterion | Primary evidence |
| --- | --- | --- |
| AC1 | API accepts structured readiness input. | Backend unit test, Bruno smoke, DPS-lite testautomation. |
| AC2 | API derives required evidence from affected surfaces and risk flags. | Backend unit test, DPS-lite testautomation. |
| AC3 | API returns missing evidence explicitly. | Bruno smoke, DPS-lite testautomation. |
| AC4 | BFF maps backend response fields into the UI-facing DTO. | Bruno smoke, DPS-lite testautomation. |
| AC5 | UI renders signal, stop condition, next action, and matrix rows. | Browser evidence. |
| AC6 | Representative `truce`, `sparring`, and `shield-wall` cases are covered. | Bruno smoke and DPS-lite testautomation. |
| AC7 | HLD/LLD explain behavior before implementation. | Design review against `delivery-pack/design/`. |
| AC8 | Scope stays inside readiness behavior and verification surfaces. | Diff boundary review. |

## Verification Layers

| Layer | Tool / artifact | Command or location | Role |
| --- | --- | --- | --- |
| Offline gates | mise | `mise run verify` | Developer / agent |
| Quick API smoke | Bruno CLI | `mise run api:smoke` | Developer / manual tester |
| Manual API check | Bruno app | `manual-api/cobold-local` | Developer / manual tester |
| Heavy API automation | DPS-lite pytest | `mise run api:testautomation` | Tester / CI candidate |
| Browser evidence | Agent Browser, Playwright, or manual screen share | See browser checks below | Tester / reviewer |
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

Expected after implementation:

- `01-truce-readiness` returns `200`, `signal=truce`, and a covered matrix row.
- `02-sparring-readiness` returns `200`, `signal=sparring`, and missing evidence.
- `03-shield-wall-readiness` returns `200`, `signal=shield-wall`, missing evidence, and a split stop condition.

Expected on `workshop/03-harness-before-code`:

- Checks fail because the baseline still accepts the old free-text request.

## Heavy API Testautomation

Run after backend and BFF are running:

```bash
mise run api:testautomation
```

Expected after implementation:

- Status check passes.
- Truce readiness has no missing evidence.
- Sparring readiness reports missing BFF/browser evidence.
- Shield-wall readiness requires a split for high-risk missing proof.

Expected on `workshop/03-harness-before-code`:

- Readiness tests fail and produce feedback for implementation.

## Browser Checks

1. Open `http://localhost:4200`.
2. Submit a truce readiness input.
3. Verify the page shows:
   - `truce`
   - required evidence
   - empty missing evidence
   - a covered backend matrix row
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
- DPS-lite testautomation result
- diff boundary summary
- gaps that still need human verification
