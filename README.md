# Cobold vs Hero Demo

Small umbrella-style demo repo for the Pragmatic AI Engineer workshop. It keeps
the same delivery shape as the participant environment without copying
enterprise code or legacy complexity.

The theme is intentionally light:

- **Cobold reviewer**: a risk-aware adversary that asks what could go wrong.
- **Hero proposer**: the delivery role proposing a useful change.
- **Goal**: turn a vague or risky request into a small, reviewable slice with
  context, verification, and reviewer notes.

## Structure

```text
demo/
  backend/             # Spring Boot API, Java 17, Gradle
  bff/                 # NestJS BFF, TypeScript
  frontend/            # Angular app
  contracts/           # OpenAPI, PlantUML, sample payloads
  delivery-pack/       # PRD, HLD, LLD, ADR, prompts, workflow, Bruno collection
  testautomation/      # DPS-lite Python API smoke tests
  docs/                # workshop task notes
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
mise run bff:install
```

## Run

Terminal 1:

```bash
mise run be:start
```

Terminal 2:

```bash
mise run bff:start
```

Terminal 3:

```bash
mise run fe:start
```

Open `http://localhost:4200`.

## Verify

```bash
mise run contracts:check
mise run be:test
mise run bff:build
mise run fe:build
```

After frontend and BFF dependencies are installed, `mise run verify` runs the
offline verification gates.

With the backend and BFF running, the DPS-lite API smoke tests add the live
behavior gate:

```bash
mise run api:smoke
```
