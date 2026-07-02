# Better Stack observability

This repo is wired for Better Stack as the default workshop observability path.
The setup keeps secrets out of Git and keeps the app chart disabled by default
until the collector and OpenTelemetry Operator exist in the cluster.

## What this covers

- Kubernetes logs, metrics, and eBPF traces through the Better Stack collector.
- Java backend and NestJS BFF traces through OpenTelemetry Operator
  auto-instrumentation.
- Angular/browser errors, web vitals, console logs, web events, and session
  replay through the Better Stack JavaScript tag.
- AI access later through the Better Stack MCP server.

## Better Stack collector

Create a Better Stack Telemetry collector and copy its collector secret. Then
install the collector with OTLP ports enabled:

```bash
export KUBECONFIG=infra/ansible/.generated/kubeconfig-pai
export COLLECTOR_SECRET=<collector secret from Better Stack>

mise run obs:betterstack:collector:install
```

The task runs the same shape Better Stack documents:

```bash
helm repo add better-stack https://betterstackhq.github.io/collector-helm-chart
helm upgrade --install better-stack-collector better-stack/collector \
  --namespace observability \
  --create-namespace \
  --set collector.env.COLLECTOR_SECRET="$COLLECTOR_SECRET" \
  --set collectOtel.grpcPort=4317 \
  --set collectOtel.httpPort=4318
```

Better Stack's eBPF auto-instrumentation expects a Linux kernel with the needed
eBPF features. If traces do not appear, run their check from the docs:

```bash
kubectl run -i --rm ebpf-check \
  --image=alpine \
  --restart=Never \
  --privileged=true \
  -- sh -c "apk add --no-cache bash wget -q && wget -qO- https://telemetry.betterstack.com/api/collector/public/ebpf.sh | bash"
```

## OpenTelemetry Operator

The app chart creates an `Instrumentation` resource when
`observability.enabled=true`. Install the OpenTelemetry Operator before enabling
that chart setting:

```bash
export KUBECONFIG=infra/ansible/.generated/kubeconfig-pai
mise run obs:otel:operator:install
```

The existing K3s cluster already uses cert-manager for TLS. If the operator
webhook does not start, check cert-manager first.

## App deployment

Create a local values file for the browser token:

```bash
cp deploy/helm/cobold-vs-hero/values-observability.example.yaml \
  deploy/helm/cobold-vs-hero/values-observability.local.yaml
```

Edit only the `observability` block:

```yaml
observability:
  enabled: true
  environment: demo
  serviceNamespace: cobold-vs-hero
  opentelemetry:
    propagators: tracecontext,baggage
    instrumentation:
      enabled: true
      name: better-stack
    exporter:
      endpoint: http://better-stack-collector-otlp.observability.svc:4318
      protocol: http/protobuf
  frontend:
    enabled: true
    token: "<Frontend token from Better Stack Error Tracking>"
    release: ""
    debug: false
```

The local file is ignored by Git.

Deploy with the normal image settings plus the local values file:

```bash
helm upgrade --install cobold-vs-hero deploy/helm/cobold-vs-hero \
  --namespace cobold \
  --create-namespace \
  --values deploy/helm/cobold-vs-hero/values-observability.local.yaml \
  --set global.imageTag=<tag> \
  --set backend.image.repository=ghcr.io/greg0x/cobold-vs-hero-backend \
  --set bff.image.repository=ghcr.io/greg0x/cobold-vs-hero-bff \
  --set frontend.image.repository=ghcr.io/greg0x/cobold-vs-hero-frontend
```

For a one-off render without a real token:

```bash
mise run obs:helm:template
```

## Verification

Check that the collector is running:

```bash
kubectl -n observability get pods
kubectl -n observability logs ds/better-stack-collector --tail=100
```

Check that the OpenTelemetry Operator injected the backend and BFF pods:

```bash
kubectl -n cobold get pod -l app.kubernetes.io/component=backend -o jsonpath='{.items[0].spec.initContainers[*].name}{"\n"}'
kubectl -n cobold get pod -l app.kubernetes.io/component=bff -o jsonpath='{.items[0].spec.initContainers[*].name}{"\n"}'
```

Exercise the request path:

```bash
curl https://cobold.pragmatic-ai.engineer/api/cobold-vs-hero/status
curl -X POST https://cobold.pragmatic-ai.engineer/api/cobold-vs-hero/briefing \
  -H 'content-type: application/json' \
  -d '{"changeTitle":"Observability smoke","changeDescription":"Trace the full request path.","affectedSurfaces":["backend","bff","frontend"],"providedEvidence":["hld"],"riskFlags":[]}'
```

Then verify in Better Stack:

- Live tail has container logs from `backend`, `bff`, and `frontend`.
- Tracing shows Java backend and NestJS BFF spans.
- The frontend application shows browser events after opening the deployed app.
- Uptime has a monitor for `https://cobold.pragmatic-ai.engineer`.

## AI tooling

Better Stack exposes a remote MCP server. For Claude Code with OAuth:

```bash
mise run obs:mcp:claude:add
```

For token-based clients, use the Better Stack MCP docs and keep the API token
in the client environment, not in this repo.

## References

- Better Stack collector: https://betterstack.com/docs/logs/collector/
- Better Stack JavaScript tag: https://betterstack.com/docs/errors/js-tag/start/
- Better Stack MCP server: https://betterstack.com/docs/getting-started/integrations/mcp/
- OpenTelemetry Operator auto-instrumentation: https://opentelemetry.io/docs/platforms/kubernetes/operator/automatic/
