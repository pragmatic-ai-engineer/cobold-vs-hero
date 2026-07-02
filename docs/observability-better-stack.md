# Better Stack observability

This repo is wired for Better Stack as the default workshop observability path.
The setup keeps secrets out of Git and keeps the app chart disabled by default
until the collector and OpenTelemetry Operator exist in the cluster.

## What this covers

- Kubernetes logs, metrics, and eBPF traces through the Better Stack collector.
- Java backend and NestJS BFF traces through OpenTelemetry Operator
  auto-instrumentation.
- Angular/browser errors, web vitals, console logs, web events, and session
  replay through the native Better Stack JavaScript tag.
- AI access later through the Better Stack MCP server.

## Better Stack collector

The preferred local path uses the Better Stack Telemetry API token stored in
1Password item `better_stack-pragmatic-ai.engineer`, field `credential`. It
creates or reuses a Kubernetes collector named `pai-cobold-vs-hero`, reads the
generated collector secret, stores that secret in Kubernetes, and installs the
collector Helm chart with OTLP ports enabled:

```bash
export KUBECONFIG=infra/ansible/.generated/kubeconfig-pai
mise run obs:betterstack:collector:install:op
```

Override defaults only if needed:

```bash
export OP_BETTERSTACK_TOKEN_ITEM=better_stack-pragmatic-ai.engineer
export OP_BETTERSTACK_TOKEN_FIELD=credential
export BETTERSTACK_COLLECTOR_NAME=pai-cobold-vs-hero
export BETTERSTACK_TEAM_NAME="<team name, only needed for global API tokens>"
```

If you already have a collector secret, you can install directly:

```bash
export KUBECONFIG=infra/ansible/.generated/kubeconfig-pai
export COLLECTOR_SECRET=<collector secret from Better Stack>

mise run obs:betterstack:collector:install
```

The task runs the same shape Better Stack documents:

```bash
kubectl create namespace observability --dry-run=client -o yaml | kubectl apply -f -
kubectl -n observability create secret generic better-stack-collector-secret \
  --from-literal=COLLECTOR_SECRET="$COLLECTOR_SECRET" \
  --dry-run=client -o yaml | kubectl apply -f -

helm repo add better-stack https://betterstackhq.github.io/collector-helm-chart
helm upgrade --install better-stack-collector better-stack/collector \
  --namespace observability \
  --set collector.env.COLLECTOR_SECRET="" \
  --set 'collector.envFrom[0].secretRef.name=better-stack-collector-secret' \
  --set collectOtel.grpcPort=4317 \
  --set collectOtel.httpPort=4318
```

After installing the collector, open Better Stack and navigate to
`Sources -> your collector -> Configure -> Ingesting`, then enable
OpenTelemetry SDK traces.

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

Create a local values file for the browser tag token:

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
    sampler:
      type: parentbased_traceidratio
      argument: "1"
    instrumentation:
      enabled: true
      name: better-stack
    exporter:
      endpoint: http://better-stack-collector-otlp.observability.svc:4318
      protocol: http/protobuf
  frontend:
    enabled: true
    token: "<the t= value from the copied Better Stack JavaScript tag>"
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

For GitHub Actions deploys, set these repository-level values:

- Variable: `BETTERSTACK_OBSERVABILITY_ENABLED=true`
- Secret: `BETTERSTACK_FRONTEND_TOKEN=<the t= value from the copied Better Stack JavaScript tag>`

The frontend token is the token passed to `https://betterstack.net/b.js?t=...`.
It is separate from the collector secret and from Better Stack API tokens.
Backend and BFF OpenTelemetry injection can run with only
`BETTERSTACK_OBSERVABILITY_ENABLED`, as long as the cluster collector is
already installed.

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

If traces are missing after the collector is healthy, restart the app workloads
so the collector and OpenTelemetry instrumentation attach to fresh processes:

```bash
kubectl -n cobold rollout restart deploy/cobold-vs-hero-backend deploy/cobold-vs-hero-bff deploy/cobold-vs-hero-frontend
```

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
- Better Stack Sentry SDK compatibility: https://betterstack.com/docs/errors/collecting-errors/sentry-sdk/
- Better Stack MCP server: https://betterstack.com/docs/getting-started/integrations/mcp/
- OpenTelemetry Operator auto-instrumentation: https://opentelemetry.io/docs/platforms/kubernetes/operator/automatic/
