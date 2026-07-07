# Deploy

Deployment assets for the Cobold vs Hero app stack.

## Contents

| Path | Purpose |
| --- | --- |
| `helm/cobold-vs-hero/` | Helm chart for backend, BFF, frontend, ingress, TLS, and observability config. |
| `datadog/values-agent.yaml` | Datadog Agent Helm values for the `pai` K3s cluster. |
| `datadog/scripts/datadog-with-op.sh` | 1Password-backed helper for Datadog setup tasks. |

## Helm

Render the chart locally:

```bash
helm template cobold-vs-hero deploy/helm/cobold-vs-hero --namespace cobold
```

Deploy after images are available:

```bash
helm upgrade --install cobold-vs-hero deploy/helm/cobold-vs-hero \
  --namespace cobold \
  --create-namespace \
  --set global.imageTag=<tag>
```

The default public host is `cobold.pragmatic-ai.engineer`. Preview deploys use
`pr-<number>.cobold.pragmatic-ai.engineer`.

## Image Contract

The chart expects three images:

- `ghcr.io/pragmatic-ai-engineer/cobold-vs-hero-backend`
- `ghcr.io/pragmatic-ai-engineer/cobold-vs-hero-bff`
- `ghcr.io/pragmatic-ai-engineer/cobold-vs-hero-frontend`

GitHub Actions builds and pushes these images, then deploys the same commit SHA
as `global.imageTag`.

## Observability

Datadog is optional. The chart only enables app observability when the relevant
values are set. See `../docs/observability-datadog.md`.
