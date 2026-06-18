# Repo Context

This is a workshop demo repo with two applications:

- `backend/` - Spring Boot API, Java 17, Gradle wrapper
- `frontend/` - Angular app, Node 24

The demo domain is **Cobold vs Hero**:

- Cobold reviewer represents risk-aware adversarial review.
- Hero proposer represents the delivery role proposing a useful change.
- The app turns a risk concern and proposed delivery move into a small briefing
  signal that helps the team scope, verify, and review the work.

## Commands

From `demo/`:

```bash
mise run be:test
mise run fe:build
mise run verify
```

Install frontend dependencies first:

```bash
mise run fe:install
```

## Boundaries

- Keep changes small.
- Do not add persistence unless explicitly requested.
- Do not add authentication unless explicitly requested.
- Treat the API contract and Angular UI as the main surfaces.
- Prefer one backend test for API behavior and one frontend build/test check.
