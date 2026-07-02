# Pai server bootstrap

Ansible setup for the single-node Hetzner/K3s workshop server.

Target SSH host is expected to exist in your local `~/.ssh/config`:

```sshconfig
Host pai
  Hostname ...
  User root
  IdentityFile ~/.ssh/pai.pub
  IdentitiesOnly yes
  ServerAliveInterval 30
  ServerAliveCountMax 3
```

Create a local-only host vars file with the real server IP:

```bash
mkdir -p host_vars/pai
$EDITOR host_vars/pai/local.yml
```

`host_vars/pai/local.yml` is ignored by Git. Keep the real server IP there,
not in committed files. It should define:

```yaml
---
public_ipv4: 203.0.113.10
```

## Run

From this directory:

```bash
./scripts/run.sh
```

Or directly, if Ansible is already installed:

```bash
ansible-playbook -i inventory.yml site.yml
```

The runner uses `ansible-playbook` when available and falls back to
`uvx --from ansible-core ansible-playbook`.

## TLS

The TLS bootstrap installs cert-manager, keeps the HTTP-01
`letsencrypt-prod` issuer for normal host-specific ingress certificates, and
also creates a Cloudflare DNS-01 issuer for wildcard certificates.

Wildcard TLS needs a scoped Cloudflare token with `Zone / Zone / Read` and
`Zone / DNS / Edit` on `pragmatic-ai.engineer`:

```bash
export CLOUDFLARE_API_TOKEN="..."
./scripts/run.sh -i inventory.yml site.yml --tags tls
```

The DNS-01 certificate is stored in `kube-system` as:

```text
Certificate: pragmatic-ai-engineer-wildcard
Secret:      pragmatic-ai-engineer-wildcard-tls
SANs:        *.pragmatic-ai.engineer, *.cobold.pragmatic-ai.engineer
```

Traefik's default `TLSStore` uses that secret. Preview deploys also copy the
same wildcard TLS data into each PR namespace because Kubernetes ingress TLS
secrets are namespace-scoped.

## GitHub Actions Runner

The playbook can install repo-level self-hosted GitHub Actions runners on
`pai`. By default it registers six runner services: `pai`, then `pai-2` through
`pai-6`. They share the labels `self-hosted`, `pai`, `k3s`, and `docker`, which
allows two preview PR builds to run their three image-build jobs in parallel.

For the first registration, create a one-hour registration token:

```bash
export GITHUB_RUNNER_REGISTRATION_TOKEN="$(
  gh api \
    --method POST \
    repos/greg0x/cobold-vs-hero/actions/runners/registration-token \
    --jq .token
)"
```

Then apply only the runner-related tasks:

```bash
./scripts/run.sh -i inventory.yml site.yml --tags github_runner
```

After a runner instance is registered once, the token is not needed for normal
playbook runs. The runners run as the `github-runner` user, have Docker access
for image builds, have a local K3s kubeconfig for Helm deploys, and have the
Ubuntu libraries needed by Playwright Chromium smoke tests.

## What It Installs

- Ubuntu base packages for operations and repo work.
- SSH hardening that keeps root key login but disables password login.
- Kernel/sysctl settings expected by Kubernetes and local databases.
- Helm from the official Debian/Ubuntu apt repository.
- `mise`, so repo-local `mise.toml` files can install Java, Node, and `uv`.
- K3s single-node Kubernetes with bundled Traefik and local-path storage.
- cert-manager with HTTP-01 and Cloudflare DNS-01 Let's Encrypt issuers.
- Namespaces for `cobold`, `centaur`, `data`, and `ci`.
- Optional repo-level GitHub Actions runners for building images and deploying
  locally on `pai`.
- Playwright Chromium host libraries for deployed UI smoke tests on the
  self-hosted runners.

The playbook fetches a local kubeconfig to:

```text
infra/ansible/.generated/kubeconfig-pai
```

Use it from your Mac with:

```bash
export KUBECONFIG=infra/ansible/.generated/kubeconfig-pai
kubectl get nodes
```

Port `6443/tcp` must stay open to your IP in the Hetzner firewall for remote
`kubectl`. If you delete that firewall rule, SSH into the server and use
`kubectl` there.

## Notes

- No external Hetzner Volume is required; K3s local-path storage uses the
  server SSD.
- Do not expose Mongo, Postgres, NodePorts, or internal Centaur services in the
  Hetzner firewall. Public traffic should enter through 80/443.
- K3s stores the admin kubeconfig at `/etc/rancher/k3s/k3s.yaml`.
