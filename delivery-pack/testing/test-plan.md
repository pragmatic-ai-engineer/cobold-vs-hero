# Test Plan - Review Signal Details

This plan tracks the acceptance and verification surfaces for the workshop
slice. It keeps quick developer smoke checks, browser evidence, and heavier API
testautomation visible in one place.

## Acceptance Criteria

| ID | Acceptance criterion | Primary evidence |
| --- | --- | --- |
| AC1 | API returns a specific `reason` for each signal. | Backend unit test, Bruno smoke, DPS-lite testautomation. |
| AC2 | BFF maps backend response fields into the UI-facing DTO. | Bruno smoke, DPS-lite testautomation. |
| AC3 | UI renders signal, reason, next action, evidence prompts, and checklist. | Browser evidence. |
| AC4 | Representative `truce`, `sparring`, and `shield-wall` cases are covered. | Bruno smoke and DPS-lite testautomation. |
| AC5 | HLD/LLD explain behavior before implementation. | Design review against `delivery-pack/design/`. |
| AC6 | Scope stays inside briefing behavior and verification surfaces. | Diff boundary review. |

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

Expected:

- `01-truce-briefing` returns `200`, `signal=truce`, and a clear verification reason.
- `02-sparring-briefing` returns `200`, `signal=sparring`, and evidence prompts.
- `03-shield-wall-briefing` returns `200`, `signal=shield-wall`, and a smaller-slice reason.

## Heavy API Testautomation

Run after backend and BFF are running:

```bash
mise run api:testautomation
```

Expected:

- Three representative pytest cases pass.
- Failures become feedback for the next implementation iteration.

## Browser Checks

1. Open `http://localhost:4200`.
2. Submit a truce input.
3. Verify the page shows:
   - `truce`
   - reason text
   - next action
   - evidence prompts
4. Submit a shield-wall input.
5. Verify the page shows:
   - `shield-wall`
   - smaller-slice reason
   - split-task checklist item
6. Capture one screenshot of the result panel.

## Evidence Note

Record:

- browser target
- input used
- visible signal
- screenshot path or recording note
- Bruno smoke result
- DPS-lite testautomation result
- diff boundary summary
- gaps that still need human verification
