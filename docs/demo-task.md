# Demo Task: Review Readiness Matrix

## Starting Point

The repo starts with a working Cobold vs Hero briefing tool.

The Cobold reviewer enters a risk concern. The Hero proposer enters the proposed
delivery move. The app returns a briefing signal:

- `truce` - safe starter slice
- `sparring` - useful idea, needs sharper acceptance criteria
- `shield-wall` - too risky; split the task before implementation

The current baseline already includes:

- Java backend classification
- NestJS BFF mapping
- Angular UI rendering
- OpenAPI, PlantUML, and sample payloads
- Bruno local/API smoke checks
- DPS-lite Python testautomation
- lightweight HLD/LLD and delivery-pack artifacts

This baseline is intentionally complete enough for workshop participants to
practice improving the AI delivery loop instead of bootstrapping a repo from
nothing.

## Workshop Slice

The next slice is the Review Readiness Matrix.

Starting vague request:

> The briefing is too vague. Make it useful enough that a team can decide
> whether a proposed change is safe to start, needs sharper acceptance criteria,
> or must be split before implementation.

Scoped task:

> For a proposed delivery move, let the user choose affected surfaces and
> available evidence. The system should return a readiness signal, required
> evidence, missing evidence, stop condition, next action, and a review readiness
> matrix. The UI should make the matrix readable, and the behavior should be
> verified through Bruno, DPS-lite, and browser evidence.

## Proposed Input

The workshop evolves the current free-text briefing input into structured review
readiness data:

```json
{
  "changeTitle": "Billing retry status panel",
  "changeDescription": "Add one backend endpoint, one BFF mapper, and one Angular panel.",
  "affectedSurfaces": ["backend", "bff", "frontend", "contract", "testing"],
  "providedEvidence": ["backend-test", "hld", "lld"],
  "riskFlags": ["customer-data", "unclear-scope"]
}
```

## Proposed Output

```json
{
  "signal": "sparring",
  "headline": "Useful slice, but evidence is incomplete.",
  "requiredEvidence": ["backend-test", "bruno-smoke", "dps-testautomation", "browser-screenshot", "hld", "lld"],
  "missingEvidence": ["bruno-smoke", "dps-testautomation", "browser-screenshot"],
  "stopCondition": "Do not implement until API, automation, and browser evidence are planned.",
  "nextAction": "Add smoke and automation evidence before asking for implementation.",
  "reviewMatrix": [
    {
      "surface": "backend",
      "expectedEvidence": ["backend-test"],
      "providedEvidence": ["backend-test"],
      "gap": "covered",
      "nextAction": "Keep backend assertion attached to the PR."
    }
  ]
}
```

## Acceptance Criteria

- The backend accepts structured readiness input.
- The backend derives required evidence from affected surfaces and risk flags.
- The backend returns explicit missing evidence.
- The backend returns a useful stop condition and next action.
- The BFF maps backend fields into the UI-facing DTO without duplicating
  readiness logic.
- The UI renders a readable matrix with surface, expected evidence, provided
  evidence, gap, and next action.
- Bruno smoke covers representative `truce`, `sparring`, and `shield-wall`
  readiness cases.
- DPS-lite automation verifies required evidence and missing evidence.
- Browser evidence proves the matrix is readable.

## Non-Goals

- Persistence.
- Authentication.
- User management.
- Real risk scoring engine.
- Historical reporting.
- Enterprise workflow integration.
- Large UI redesign.

## Workshop Branch Stack

The slice should be developed through numbered branches:

- `workshop/00-baseline-review-signal-details`
- `workshop/01-prompt-scope-review-readiness-matrix`
- `workshop/02-context-delivery-packet`
- `workshop/03-harness-before-code`
- `workshop/04-implementation-pass`
- `workshop/05-loop-repair-review-evidence`
