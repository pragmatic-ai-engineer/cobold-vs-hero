# Onboarding

Hungarian version: [README.hu.md](README.hu.md).

This repo is a workshop-sized software delivery system. It is small enough to
understand quickly, but it keeps the important production-shaped boundaries:
backend, BFF, frontend, contracts, smoke checks, robust automation, deployment,
infrastructure, and observability.

## Mental Model

The product behavior is the Review Readiness Matrix.

```text
Angular UI
-> NestJS BFF
-> Spring Boot API
-> deterministic readiness rules
-> signal + evidence + matrix
```

The user describes a proposed delivery change, selects affected surfaces,
available evidence, and risk flags, then receives one of three signals:

- `truce` - review-ready starter slice.
- `sparring` - useful slice, but evidence is incomplete.
- `shield-wall` - too risky or too broad; split before implementation.

The teaching goal is not the fantasy theme. The teaching goal is controlled
AI-assisted delivery: shape the task, define contracts, implement a small
vertical slice, verify it, and keep review evidence visible.

## Repo Map

| Path | What to know first |
| --- | --- |
| `backend/` | Spring Boot API. Owns readiness rules and backend status. |
| `bff/` | NestJS BFF. Keeps the UI contract stable and proxies to backend. |
| `frontend/` | Angular UI. Renders status, inputs, evidence summary, and matrix. |
| `contracts/` | OpenAPI, PlantUML diagrams, and sample payloads. |
| `solution/cobold-briefing/` | HLD, LLD, decisions, acceptance and test plan. |
| `smoke/` | Fast Bruno API and Playwright UI checks. |
| `testautomation/` | Heavier Python API and UI automation lanes. |
| `deploy/` | Helm chart and Datadog deployment support. |
| `infra/` | K3s host bootstrap and Cloudflare DNS. |
| `docs/` | Repo-level task notes, onboarding, observability, research. |
| `ai-runbook/` | Shared AI-assisted work instructions. |

## Runtime Map

Local development uses three processes:

| Process | Command | URL | Responsibility |
| --- | --- | --- | --- |
| Backend | `mise run be:start` | `http://localhost:8080` | Readiness rules. |
| BFF | `mise run bff:start` | `http://localhost:3000` | UI API and status aggregation. |
| Frontend | `mise run fe:start` | `http://localhost:4200` | Browser UI. |

The Angular dev server proxies `/api` to the BFF. The BFF uses
`BACKEND_BASE_URL` or defaults to `http://localhost:8080`.

## First Local Run

From the repo root:

```bash
brew install mise
mise install
mise run fe:install
mise run bff:install
```

Start the stack:

```bash
mise run be:start
mise run bff:start
mise run fe:start
```

Open `http://localhost:4200`.

## Verification Ladder

Use the smallest useful check first:

| Need | Command |
| --- | --- |
| Contract files exist | `mise run contracts:check` |
| Backend tests | `mise run be:test` |
| BFF compiles | `mise run bff:build` |
| Frontend builds | `mise run fe:build` |
| Offline gate | `mise run verify` |
| Fast API smoke | `mise run api:smoke` |
| Fast UI smoke | `mise run ui:smoke` |
| Robust API automation | `mise run api:testautomation` |
| Robust UI automation | `mise run ui:testautomation` |

`mise run verify` does not require the full app stack. Smoke and testautomation
commands do.

## Change Workflow

1. Read `docs/demo-task.md` and the relevant component README.
2. Check whether the behavior is already described in `solution/` and
   `contracts/`.
3. Update solution or contract artifacts before implementation when behavior
   changes.
4. Keep readiness logic in `backend/`; keep BFF mapping thin; keep UI focused on
   rendering and interaction.
5. Run the smallest useful local gate, then a smoke or automation check when the
   change crosses service boundaries.
6. Attach evidence: command output, smoke result, screenshot, or explicit gap.
7. Keep documentation changes close to the artifact they explain.

## Deployment Shape

The deployed app runs on the `pai` K3s host:

- production host: `https://cobold.pragmatic-ai.engineer`
- preview host pattern: `https://pr-<number>.cobold.pragmatic-ai.engineer`
- images: GHCR under `ghcr.io/greg0x`
- deploy mechanism: GitHub Actions self-hosted runner plus Helm
- DNS: Cloudflare Terraform under `infra/terraform/cloudflare`
- TLS: cert-manager wildcard bootstrap under `infra/ansible`

## What Not To Do First

- Do not add persistence, authentication, user management, or a real scoring
  engine unless the workshop task explicitly moves there.
- Do not duplicate readiness rules in the BFF or frontend.
- Do not treat generated build folders or `node_modules` as source.
- Do not commit local IPs, Cloudflare tokens, Datadog API keys, or kubeconfig
  changes.
