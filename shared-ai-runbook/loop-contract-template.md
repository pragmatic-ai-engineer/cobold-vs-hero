# Loop Contract Template

Use this before asking an agent to implement. The goal is to define the
scoreboard before the agent starts optimizing.

```text
Goal:
<What outcome should the loop move toward?>

Target / success score:
- 
- 
- 

Constraints:
- 
- 
- 

Instruments:
- backend:
- frontend:
- browser/manual:
- diff:

Iteration rules:
1. Inspect first, do not edit.
2. Return a short plan and assumptions.
3. Wait for human approval if the plan changes scope.
4. Implement the smallest useful slice.
5. Run the agreed checks.
6. Fix only scoped failures.
7. Stop and hand off if a stop condition is hit.

Stop conditions:
- Missing source of truth.
- No reliable verification path.
- Same failure after two repair attempts.
- Diff expands into unrelated files.
- Agent proposes forbidden work.

Human review point:
- Plan approval before editing.
- Diff and evidence review before calling it done.

Evidence required:
- Commands run and results.
- Changed files summary.
- Screenshot or manual UI observation if the UI changed.
- Risks, gaps, and follow-up items.
```
