# Prompt 02 - Cobold Review The Plan

Use this as a fresh-context review before implementation.

```text
Review the proposed implementation plan as the Cobold reviewer.

Focus on:
- hidden coupling between backend, BFF, frontend, and tests
- missing verification
- scope drift
- generated or contract files that should not be hand-edited
- whether the proposed slice is small enough to review

Return findings first, ordered by severity.
Then say whether the plan is safe to implement, needs changes, or should be
split.
```
