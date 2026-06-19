# Acceptance And Test Plan - Review Readiness Matrix

This plan tracks the evidence needed for the Review Readiness Matrix slice. It
keeps quick API smoke, DPS-lite automation, browser evidence, accessibility
expectations, and handoff evidence visible in one place.

## Acceptance Criteria

| ID | Acceptance criterion | Primary evidence |
| --- | --- | --- |
| AC1 | A proposed change can include affected surfaces. | Backend/BFF/API smoke evidence. |
| AC2 | A proposed change can include available evidence. | Backend/BFF/API smoke evidence. |
| AC3 | A proposed change can include a risk profile. | Backend/BFF/API smoke evidence. |
| AC4 | The system returns one signal: `truce`, `sparring`, or `shield-wall`. | Bruno smoke, DPS-lite automation. |
| AC5 | The system returns required evidence for the selected surfaces and risk profile. | DPS-lite automation. |
| AC6 | The system returns missing evidence explicitly. | DPS-lite automation. |
| AC7 | The system returns a stop condition and next action. | Bruno smoke, DPS-lite automation, browser evidence. |
| AC8 | The UI shows a review readiness matrix grouped by affected surface. | Browser evidence. |
| AC9 | The UI makes required gates present or missing clear at a glance. | Browser evidence, accessibility check. |
| AC10 | The site structure and UI follow WCAG expectations relevant to this slice. | Browser keyboard/readability check. |
| AC11 | Bruno smoke covers representative `truce`, `sparring`, and `shield-wall` cases. | `mise run api:smoke`. |
| AC12 | DPS-lite automation checks required evidence and missing evidence. | `mise run api:testautomation`. |
| AC13 | The PR or handoff includes command evidence, browser evidence, risks, and known gaps. | Handoff review. |

## Verification Layers

| Layer | Tool / artifact | Command or location | Role |
| --- | --- | --- | --- |
| Offline gates | mise | `mise run verify` | Developer / agent |
| Quick API smoke | Bruno CLI | `mise run api:smoke` | Developer / manual tester |
| Manual API check | Bruno app | `manual-api/cobold-local` | Developer / manual tester |
| Heavy API automation | DPS-lite pytest | `mise run api:testautomation` | QA / CI candidate |
| Browser evidence | Agent Browser, Playwright, or manual screen share | See browser checks below | QA / reviewer |
| Accessibility evidence | Browser keyboard/readability pass | See accessibility checks below | QA / reviewer |
| Diff boundary | Git | `git diff --stat` | Reviewer |

## Preconditions

- Backend is running on `http://localhost:8080`.
- BFF is running on `http://localhost:3000`.
- Frontend is running on `http://localhost:4200` for browser checks.

## Representative Smoke Cases

| Case | Input shape | Expected result |
| --- | --- | --- |
| Truce | One low-risk surface with all required evidence selected. | `signal=truce`, no missing evidence for the selected surface. |
| Sparring | One or more surfaces selected with a non-blocking evidence gap. | `signal=sparring`, missing evidence and next action are specific. |
| Shield-wall | Production/customer/data risk with required gates missing. | `signal=shield-wall`, stop condition tells the team to pause before implementation or merge. |

## Quick API Smoke

Run after backend and BFF are running:

```bash
mise run api:smoke
```

Expected:

- Truce case returns `200`, `signal=truce`, required evidence, and no blocking
  missing evidence.
- Sparring case returns `200`, `signal=sparring`, required evidence, missing
  evidence, and a focused next action.
- Shield-wall case returns `200`, `signal=shield-wall`, missing required gates,
  a stop condition, and a split-or-prove next action.

## Heavy API Testautomation

Run after backend and BFF are running:

```bash
mise run api:testautomation
```

Expected:

- Representative cases pass for `truce`, `sparring`, and `shield-wall`.
- Required evidence changes when affected surfaces change.
- Missing evidence changes when provided evidence changes.
- Production or high-risk profiles require stronger evidence than dev-only
  profiles.

## Browser Checks

1. Open `http://localhost:4200`.
2. Verify the input view has three sections on the main page:
   - affected area
   - provided evidence
   - risk profile
3. Submit a truce case.
4. Verify the result view shows:
   - `truce`
   - required evidence
   - no blocking missing evidence
   - matrix rows grouped by affected surface
5. Submit a shield-wall case.
6. Verify the result view shows:
   - `shield-wall`
   - missing required gates
   - stop condition
   - next action
   - matrix rows grouped by affected surface
7. Capture one screenshot of the matrix.

## Accessibility Checks

- Inputs have visible labels and can be reached by keyboard.
- The submit path works without a mouse.
- The matrix has a clear heading and readable row/column labels.
- Present and missing gates are not communicated by color alone.
- Text remains readable at common workshop screen-share widths.
- Focus indicators are visible.

## Evidence Note

Record:

- browser target
- input used
- visible signal
- matrix screenshot path or recording note
- Bruno smoke result
- DPS-lite automation result
- offline gate result, if run
- diff boundary summary
- HLD/LLD/OpenAPI drift note, because phase 1 intentionally defers those
  artifacts
- gaps that still need human verification
