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
  delivery-pack/       # product, design, testing, delivery, prompts
  manual-api/          # Bruno collection for local/manual API smoke checks
  testautomation/      # DPS-lite API + OneCare-lite UI testautomation
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

The Angular dev server proxies `/api` to the BFF on `http://localhost:3000`,
which keeps local development aligned with the deployed ingress shape.

## Container Images

Build deployable images from the repo root:

```bash
docker build --platform linux/amd64 -t cobold-vs-hero-backend:local backend
docker build --platform linux/amd64 -t cobold-vs-hero-bff:local bff
docker build --platform linux/amd64 -t cobold-vs-hero-frontend:local frontend
```

The frontend uses relative `/api` calls. In Kubernetes, ingress routes `/api` to
the BFF. The frontend nginx image also has a fallback `/api` proxy controlled by
`BFF_PROXY_URL`.

## Helm

Render the chart locally:

```bash
helm template cobold-vs-hero deploy/helm/cobold-vs-hero --namespace cobold
```

Deploy to the `pai` K3s cluster after pushing images to a registry:

```bash
export KUBECONFIG=infra/ansible/.generated/kubeconfig-pai

helm upgrade --install cobold-vs-hero deploy/helm/cobold-vs-hero \
  --namespace cobold \
  --set global.imageTag=<tag> \
  --set backend.image.repository=ghcr.io/greg0x/cobold-vs-hero-backend \
  --set bff.image.repository=ghcr.io/greg0x/cobold-vs-hero-bff \
  --set frontend.image.repository=ghcr.io/greg0x/cobold-vs-hero-frontend
```

The `Deploy` GitHub Actions workflow runs on the `pai` self-hosted runner,
builds and pushes these images to GHCR, then deploys the pushed image tag to the
local K3s server with Helm. Keep GHCR packages public for the simplest demo
setup, or configure `global.imagePullSecrets` if you want private images.

## Verify

```bash
mise run contracts:check
mise run be:test
mise run bff:build
mise run fe:build
```

After frontend and BFF dependencies are installed, `mise run verify` runs the
offline verification gates.

With the backend and BFF running, Bruno CLI gives a quick developer/manual
tester smoke check:

```bash
mise run api:smoke
```

For the heavier DPS-lite Python automation gate:

```bash
mise run api:testautomation
```

For the toy OneCare-style browser UI automation gate, install the Playwright
browser once, then run the UI testautomation while the backend, BFF, and
frontend are running:

```bash
mise run ui:install-browsers
mise run ui:testautomation
```
