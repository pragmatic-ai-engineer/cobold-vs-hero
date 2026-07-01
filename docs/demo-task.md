# Demo Task: Cobold vs Hero Briefing

## Quirky Basic Task

Build a tiny "Cobold vs Hero" briefing tool.

The Cobold reviewer enters a risk concern. The Hero proposer enters the
proposed delivery move. The app returns a briefing signal:

- `truce` - safe starter slice
- `sparring` - useful idea, needs sharper acceptance criteria
- `shield-wall` - too risky; split the task before implementation

## Why This Works For The Workshop

- It is Java + NestJS + Angular, matching the target shop shape.
- It is domain-light and funny enough to be memorable.
- It has a clear backend/API/frontend split.
- It has lightweight HLD/LLD artifacts that connect design to implementation.
- It creates natural review questions without requiring real company repo
  access.
- It has verifier surfaces: backend tests, BFF build, Angular build, API/UI
  smoke checks, DPS-like API testautomation, and browser evidence.

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
  "reason": "Production-sensitive or high-coupling work needs a smaller slice before implementation.",
  "coboldWisdom": "The Cobold reviewer says: name the risky assumption...",
  "heroNextStep": "Write non-goals, split the change...",
  "evidencePrompts": [
    "Which smaller slice can be reviewed independently?",
    "Which rollback or recovery signal proves the risky path is controlled?"
  ],
  "checklist": ["split the task", "define rollback evidence", "request fresh-context review"]
}
```

## Good Workshop Slice

Good design-to-code slice:

> Improve the review signal details so the briefing explains why the signal was
> selected and what evidence the team should gather next.

Acceptance criteria:

- Each signal has a clear reason.
- The BFF maps backend fields into a UI-facing DTO.
- The UI makes the reason, next action, and evidence prompts easy to scan in a
  screen share.
- Backend tests, BFF build, frontend build, API smoke, and browser evidence
  prove the slice.
- Keep the change small; do not add persistence, auth, or a scoring framework.

## Follow-Up Slices

- Add frontend unit coverage for rendering a briefing.
- Add a history list of the last 3 briefings in memory.
- Add a `GET /api/cobold-vs-hero/examples` endpoint.
- Create an AI runbook prompt for reviewing a briefing change.
