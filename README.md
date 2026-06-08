# Cobold vs Hero Demo

Small Java + Angular demo repo for the CPI Hero workshop.

The theme is intentionally light:

- **Cobold team**: COBOL-background developers carrying legacy/system memory.
- **Hero team**: the Java/Angular delivery team proposing a modern change.
- **Goal**: turn a vague or risky request into a small, reviewable quest with
  context, verification, and reviewer notes.

## Structure

```text
demo/
  backend/             # Spring Boot API
  frontend/            # Angular app
  docs/                # workshop task and architecture notes
  shared-ai-runbook/   # prompts, agent instructions, review checklist
  mise.toml            # shared tool versions and commands
```

## Setup

```bash
cd demo
mise install
mise run frontend:install
```

## Run

Terminal 1:

```bash
mise run backend:start
```

Terminal 2:

```bash
mise run frontend:start
```

Open `http://localhost:4200`.

## Verify

```bash
mise run backend:test
mise run frontend:build
```

After frontend dependencies are installed, `mise run verify` runs both gates.
