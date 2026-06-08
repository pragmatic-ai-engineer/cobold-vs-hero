# Review Checklist

Use this after an AI-assisted change.

## Findings First

- Does the API contract match the requested behavior?
- Did the frontend display only the intended new data?
- Did the change introduce unrelated files or refactors?
- Are validation and error cases reasonable for the slice?
- Is there one useful test or verification command?

## Evidence

Record:

- command run
- result
- known gaps
- follow-up items

## MR Notes

Answer:

- What changed?
- Why was it needed?
- What was intentionally not changed?
- What should reviewers look at first?
- What still needs manual or environment verification?
