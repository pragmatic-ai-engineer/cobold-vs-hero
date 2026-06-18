# Review Checklist

Use this after an AI-assisted change.

## Findings First

- Does the API contract match the requested behavior?
- Does the BFF mapping preserve the backend behavior without hiding risk?
- Did the frontend display only the intended new data?
- Did the change introduce unrelated files or refactors?
- Are validation and error cases reasonable for the slice?
- Are API smoke and browser evidence present when behavior changed?
- Did the diff stay inside the agreed surfaces?

## Evidence

Record:

- command run
- result
- API smoke result
- browser evidence or explicit reason it was skipped
- known gaps
- follow-up items

## MR Notes

Answer:

- What changed?
- Why was it needed?
- What was intentionally not changed?
- What should reviewers look at first?
- What still needs manual or environment verification?
