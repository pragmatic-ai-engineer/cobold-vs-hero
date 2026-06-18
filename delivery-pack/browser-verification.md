# Browser Verification Recipe

Use this as the browser evidence checklist for the workshop. It can be executed
with Agent Browser, Playwright, or a manual screen-share fallback.

## Preconditions

- Backend is running on `http://localhost:8080`.
- BFF is running on `http://localhost:3000`.
- Frontend is running on `http://localhost:4200`.

## Checks

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
- gaps that still need human verification
