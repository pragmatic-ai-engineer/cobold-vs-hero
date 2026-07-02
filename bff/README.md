# BFF

NestJS backend-for-frontend for the Angular app. It keeps the browser-facing API
stable and forwards readiness requests to the Spring Boot backend.

## Responsibilities

- Expose the UI-facing `/api/cobold-vs-hero/*` endpoints.
- Forward `POST /briefing` requests to the backend.
- Map backend `heroNextStep` to UI-facing `nextAction`.
- Aggregate BFF and backend status for the UI status panel.
- Emit structured logs and initialize `dd-trace` before Nest imports.

The BFF should stay thin. It does not own readiness rules.

## Main Files

| Path | Purpose |
| --- | --- |
| `src/main.ts` | Nest bootstrap. |
| `src/tracer.ts` | Datadog tracer initialization. |
| `src/modules/briefing/briefing.controller.ts` | UI-facing endpoints. |
| `src/modules/briefing/briefing.service.ts` | Backend calls, status aggregation, field mapping. |
| `src/modules/briefing/briefing.dto.ts` | TypeScript request/response shapes. |
| `src/observability/logger.ts` | Structured logs. |
| `Dockerfile` | Deployable BFF image. |

## Run

Install dependencies once:

```bash
mise run bff:install
```

Start the BFF:

```bash
mise run bff:start
```

Default URL: `http://localhost:3000`.

Default backend target: `http://localhost:8080`. Override with:

```bash
BACKEND_BASE_URL=http://localhost:8080 mise run bff:start
```

## Build

```bash
mise run bff:build
```

## Contract

The BFF must match the OpenAPI shape in `../contracts/openapi/cobold-briefing-api.yaml`
and the mapping table in `../solution/cobold-briefing/lld.md`.
