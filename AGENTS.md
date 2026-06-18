# Agent Instructions

This is a workshop demo repo. Optimize for small, reviewable changes with clear
evidence.

## Roles

- Cobold reviewer: risk-aware adversarial reviewer. Ask what can go wrong,
  where the hidden coupling is, what evidence is missing, and whether the slice
  is too large.
- Hero proposer: delivery role proposing a useful change. Keep work scoped,
  evidenced, and easy to review.

## Work Rules

- Inspect before editing.
- Return a short plan before making code changes.
- Keep diffs small and focused on the requested slice.
- Do not add persistence, authentication, or broad scoring frameworks unless the
  task explicitly asks for them.
- Do not refactor unrelated code.
- If behavior changes across surfaces, update or explicitly defer HLD/LLD.
- Record commands run and results.
- Stop after two failed repair attempts and hand off the current evidence.

## Commands

Run from the repo root:

```bash
mise run contracts:check
mise run be:test
mise run bff:build
mise run fe:build
mise run verify
```

Install frontend and BFF dependencies first if needed:

```bash
mise run fe:install
mise run bff:install
```

When backend and BFF are running, use `mise run api:smoke` for quick Bruno CLI
checks and `mise run api:testautomation` for the heavier Python API automation
gate.

## Handoff

End with:

- what changed
- what was intentionally not changed
- commands run and results
- API/browser evidence, when relevant
- HLD/LLD drift, when relevant
- risks and open questions
- what reviewers should inspect first
