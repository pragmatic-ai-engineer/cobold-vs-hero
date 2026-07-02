# Backend

Spring Boot API for the Cobold vs Hero demo. It owns the deterministic Review
Readiness Matrix rules.

## Responsibilities

- Expose `GET /api/cobold-vs-hero/status`.
- Expose `POST /api/cobold-vs-hero/briefing`.
- Derive required evidence from affected surfaces and risk flags.
- Compute missing evidence.
- Derive the readiness signal: `truce`, `sparring`, or `shield-wall`.
- Build one review matrix row per affected surface.

The backend is the source of truth for readiness behavior. Do not duplicate
these rules in the BFF or frontend.

## Main Files

| Path | Purpose |
| --- | --- |
| `src/main/java/dev/workshop/demo/CoboldVsHeroController.java` | API endpoints, readiness rules, response construction. |
| `src/main/resources/application.properties` | Spring configuration. |
| `src/test/java/dev/workshop/demo/CoboldVsHeroControllerTests.java` | Focused behavior tests. |
| `build.gradle` | Java 17, Spring Boot, validation, test dependencies. |
| `Dockerfile` | Deployable backend image. |

## Run

From the repo root:

```bash
mise run be:start
```

The backend listens on `http://localhost:8080`.

## Test

```bash
mise run be:test
```

The root verification gate also runs backend tests:

```bash
mise run verify
```

## Contract

The public API shape is documented in:

- `../contracts/openapi/cobold-briefing-api.yaml`
- `../contracts/samples/*.json`
- `../solution/cobold-briefing/lld.md`

When backend behavior changes, update the contract, samples, smoke checks, and
automation in the same slice.
