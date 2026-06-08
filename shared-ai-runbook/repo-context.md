# Repo Context

This is a workshop demo repo with two applications:

- `backend/` - Spring Boot API, Java 17, Gradle wrapper
- `frontend/` - Angular app, Node 24

The demo domain is **Cobold vs Hero**:

- Cobold team represents COBOL and legacy-system knowledge.
- Hero team represents a modern Java/Angular delivery team.
- The app turns a legacy concern and proposed modern move into a small briefing
  signal.

## Commands

From `demo/`:

```bash
mise run backend:test
mise run frontend:build
mise run verify
```

Install frontend dependencies first:

```bash
mise run frontend:install
```

## Boundaries

- Keep changes small.
- Do not add persistence unless explicitly requested.
- Do not add authentication unless explicitly requested.
- Treat the API contract and Angular UI as the main surfaces.
- Prefer one backend test for API behavior and one frontend build/test check.
