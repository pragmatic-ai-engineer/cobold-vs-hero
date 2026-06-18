# Repo Context

This is a workshop demo repo with an umbrella structure:

- `backend/` - Spring Boot API, Java 17, Gradle wrapper
- `bff/` - NestJS BFF, TypeScript
- `frontend/` - Angular app, Node 24
- `contracts/` - OpenAPI, PlantUML, and sample payloads
- `delivery-pack/` - PRD, HLD, LLD, ADR, workflow, prompts, and Bruno smoke checks
- `testautomation/` - DPS-lite Python API testautomation

The demo domain is **Cobold vs Hero**:

- Cobold reviewer represents risk-aware adversarial review.
- Hero proposer represents the delivery role proposing a useful change.
- The app turns a risk concern and proposed delivery move into a small briefing
  signal that helps the team scope, verify, and review the work.

## Commands

From the repo root:

```bash
mise run contracts:check
mise run be:test
mise run bff:build
mise run fe:build
mise run verify
```

Install frontend and BFF dependencies first:

```bash
mise run fe:install
mise run bff:install
```

With backend and BFF running, execute the live API behavior gate:

```bash
mise run api:smoke
mise run api:testautomation
```

## Boundaries

- Keep changes small.
- Do not add persistence unless explicitly requested.
- Do not add authentication unless explicitly requested.
- Treat the API contract, backend, BFF, Angular UI, and verifier surfaces as the
  main workshop slice.
- Prefer focused backend tests, BFF build, frontend build, API smoke, and
  browser evidence over broad refactors.
