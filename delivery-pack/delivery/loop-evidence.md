# Loop Evidence - Review Readiness Matrix

Date: 2026-06-18

Branch: `workshop/05-loop-repair-review-evidence`

## Observed Feedback

### E0 - Offline Implementation Gate

Command:

```bash
mise run verify
```

Result:

- Passed contracts check.
- Passed backend tests.
- Passed BFF build.
- Passed Angular build.
- Warning remained: `src/app/app.scss` exceeds Angular's default 4 kB
  component-style warning budget by 1.23 kB.

### E1 - Stale Runtime Signal

Initial live checks hit already-running local services:

- status endpoints returned `UP`
- structured briefing calls returned `503` through the BFF
- backend returned `400` directly

Interpretation:

- The status check alone was insufficient evidence.
- The live services were not trustworthy until restarted from the current
  branch.

Loop response:

- Restart services from the current branch before judging implementation
  behavior.

### E2 - Bruno Smoke After Fresh Start

Commands:

```bash
mise run be:start
mise run bff:start
mise run api:smoke
```

Result:

- Passed 4/4 requests.
- Passed 21/21 assertions.
- Covered service status, `truce`, `sparring`, and `shield-wall` examples.

### E3 - DPS-lite Failure

Command:

```bash
mise run api:testautomation
```

Failure:

```text
KeyError: 'heroNextStep'
```

Interpretation:

- Runtime BFF response exposed `nextAction`.
- DPS-lite still asserted the backend field name `heroNextStep`.
- OpenAPI and response samples also advertised `heroNextStep`, while product
  brief, prompt, BFF DTO, and UI used `nextAction`.

Repair:

- Align public OpenAPI response and samples to `nextAction`.
- Add Bruno assertions for `nextAction`.
- Update DPS-lite assertion to `response["nextAction"]`.

### E4 - Repaired Live Checks

Commands:

```bash
mise run api:smoke
mise run api:testautomation
```

Result:

- Bruno passed 4/4 requests and 21/21 assertions.
- DPS-lite passed 4/4 tests.

### E5 - Final Offline Gate

Command:

```bash
mise run verify
```

Result:

- Passed.
- Angular stylesheet budget warning remained and is documented as a visible
  warning, not a functional failure.

## Diff Boundary

The loop repair changed only contract and verification artifacts:

- OpenAPI response field: `heroNextStep` -> `nextAction`
- response samples
- Bruno assertions
- DPS-lite assertion

No backend, BFF, or frontend implementation code changed during the repair.

## Remaining Human Review

- Decide whether to keep the Angular component-style budget warning visible for
  the workshop or raise the demo budget.
- Capture browser evidence for the matrix panel before using this branch as the
  final async checkpoint.
