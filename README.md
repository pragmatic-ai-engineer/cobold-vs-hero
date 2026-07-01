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
  solution/            # HLD, LLD, decisions, acceptance plan
  contracts/           # OpenAPI, PlantUML, sample payloads
  smoke/
    api/               # Bruno API smoke checks for devs/manual testers
    ui/                # placeholder for quick browser smoke checks
  testautomation/
    api/               # DPS-like robust Python API automation
    ui/                # OneCare-like robust Python UI automation
  deploy/              # Helm chart for the K3s deployment
  infra/               # Ansible bootstrap and Cloudflare Terraform
  docs/                # workshop task notes
  shared-ai-runbook/   # prompts, agent instructions, loop contract, review checklist
  mise.toml            # shared tool versions and commands
```

## Solution Flow

The pre-implementation solution package lives in:

```text
solution/cobold-briefing/
```

Use it before implementation:

```text
HLD -> LLD -> contracts -> code -> smoke checks -> evidence
```

`contracts/` stays the swagger-style package: OpenAPI, PlantUML, and sample
payloads that implementation and tests execute against.

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

The default deployed host is:

```text
https://cobold.pragmatic-ai.engineer
```

Cloudflare DNS is managed through the Terraform stack in
`infra/terraform/cloudflare`. The intended DNS record is:

```text
Type: A
Name: cobold
Content: <pai public IPv4>
Proxy status: DNS only for direct origin testing, or proxied if Cloudflare TLS is configured
```

Prepare local Cloudflare values and preview the change:

```bash
cp infra/terraform/cloudflare/terraform.tfvars.example infra/terraform/cloudflare/terraform.tfvars
$EDITOR infra/terraform/cloudflare/terraform.tfvars
mise run cf:tf:init
mise run cf:tf:plan:op
```

If the DNS record already exists, import it before the first apply; see
`infra/terraform/cloudflare/README.md`.

## Verify

```bash
mise run contracts:check
mise run be:test
mise run bff:build
mise run fe:build
```

After frontend and BFF dependencies are installed, `mise run verify` runs the
offline verification gates.

With the backend and BFF running, the Bruno API smoke collection gives a quick
developer/manual tester check:

```bash
mise run api:smoke
```

With the backend, BFF, and frontend running, the Playwright UI smoke suite gives
a quick browser-visible check:

```bash
mise run ui:smoke:install
mise run ui:smoke
```

For the heavier DPS-like Python API automation gate:

```bash
mise run api:testautomation
```

For the heavier OneCare-like browser UI automation gate, install the Playwright
browser once, then run the UI testautomation while the backend, BFF, and
frontend are running:

```bash
mise run ui:install-browsers
mise run ui:testautomation
```
