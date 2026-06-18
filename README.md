# Cobold vs Hero Demo

Small Java + Angular demo repo for the Pragmatic AI Engineer workshop.

The theme is intentionally light:

- **Cobold reviewer**: a risk-aware adversary that asks what could go wrong.
- **Hero proposer**: the delivery role proposing a useful change.
- **Goal**: turn a vague or risky request into a small, reviewable slice with
  context, verification, and reviewer notes.

## Structure

```text
demo/
  backend/             # Spring Boot API
  frontend/            # Angular app
  docs/                # workshop task and architecture notes
  shared-ai-runbook/   # prompts, agent instructions, loop contract, review checklist
  mise.toml            # shared tool versions and commands
```

## Setup

Install `mise` first if it is not already available:

```bash
brew install mise
```

For non-macOS platforms, use the official installation guide:
https://mise.jdx.dev/installing-mise.html

Then install the pinned Java and Node versions and frontend dependencies:

```bash
cd demo
mise install
mise run fe:install
```

## Run

Terminal 1:

```bash
mise run be:start
```

Terminal 2:

```bash
mise run fe:start
```

Open `http://localhost:4200`.

## Verify

```bash
mise run be:test
mise run fe:build
```

After frontend dependencies are installed, `mise run verify` runs both gates.
