# Demo Task: Cobold vs Hero Briefing

## Quirky Basic Task

Build a tiny "Cobold vs Hero" briefing tool.

The Cobold team enters a legacy concern. The Hero team enters the proposed
modern delivery move. The app returns a briefing signal:

- `truce` - safe starter slice
- `sparring` - useful idea, needs sharper acceptance criteria
- `shield-wall` - too risky; split the task before implementation

## Why This Works For The Workshop

- It is Angular + Java, matching the target shop.
- It is domain-light and funny enough to be memorable.
- It has a clear backend/API/frontend split.
- It creates natural review questions without requiring real company repo
  access.
- It can grow gradually: validation, tests, history, CI, auth, persistence,
  prompt templates, MCP, or codebase-memory exercises.

## Current API

`POST /api/cobold-vs-hero/briefing`

Request:

```json
{
  "coboldConcern": "legacy mainframe payment batch refactor goes to prod",
  "heroMove": "rewrite the flow quickly",
  "systemMood": "panic"
}
```

Response:

```json
{
  "signal": "shield-wall",
  "headline": "Cobold cave alarm: shrink the quest before anyone touches production.",
  "coboldWisdom": "The Cobold team says: protect the legacy path...",
  "heroNextStep": "Write non-goals, split the change...",
  "checklist": ["split the task", "define rollback evidence", "request fresh-context review"]
}
```

## Good Workshop Slice

Ask an agent to inspect the repo and plan one change:

> Add a short reason field to the briefing response so reviewers can understand
> why the signal was chosen. Show the reason in the Angular result panel.

Acceptance criteria:

- Backend response includes `reason`.
- `reason` explains one or two scoring inputs in plain language.
- Angular result panel displays the reason.
- Existing tests still pass.
- Add or update one backend test.
- Keep the change small; do not add persistence, auth, or a scoring framework.

## Follow-Up Slices

- Add frontend unit coverage for rendering a briefing.
- Add a history list of the last 3 briefings in memory.
- Add a `GET /api/cobold-vs-hero/examples` endpoint.
- Add a CI task that runs backend tests and frontend build.
- Create an AI runbook prompt for reviewing a briefing change.
