# Demo Task: Cobold vs Hero Briefing

## Quirky Basic Task

Build a tiny "Cobold vs Hero" briefing tool.

The Cobold reviewer enters a risk concern. The Hero proposer enters the
proposed delivery move. The app returns a briefing signal:

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
  "coboldConcern": "production payment integration refactor goes to release",
  "heroMove": "rewrite the flow quickly",
  "systemMood": "panic"
}
```

Response:

```json
{
  "signal": "shield-wall",
  "headline": "Cobold risk alarm: shrink the slice before implementation.",
  "coboldWisdom": "The Cobold reviewer says: name the risky assumption...",
  "heroNextStep": "Write non-goals, split the change...",
  "checklist": ["split the task", "define rollback evidence", "request fresh-context review"]
}
```

## Good Workshop Slice

Good design-to-code slice:

> Improve the review signal details so the briefing explains why the signal was
> selected and what evidence the team should gather next.

Acceptance criteria:

- Each signal has a clear reason.
- The UI makes the reason and next action easy to scan in a screen share.
- Existing tests still pass.
- Keep the change small; do not change the backend contract, add persistence,
  auth, or a scoring framework.

## Follow-Up Slices

- Add frontend unit coverage for rendering a briefing.
- Add a history list of the last 3 briefings in memory.
- Add a `GET /api/cobold-vs-hero/examples` endpoint.
- Add a CI task that runs backend tests and frontend build.
- Create an AI runbook prompt for reviewing a briefing change.
