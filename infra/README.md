# Infrastructure

Infrastructure for the deployed workshop environment.

## Contents

| Path | Purpose |
| --- | --- |
| `ansible/` | Bootstraps and maintains the single-node `pai` K3s server. |
| `terraform/cloudflare/` | Manages Cloudflare DNS records for production and preview hosts. |

## Boundary

Keep machine-specific values local:

- real server IPs belong in ignored Ansible host vars.
- Cloudflare tokens belong in environment variables or 1Password.
- Terraform `terraform.tfvars` is local-only.
- generated kubeconfigs should not be committed.

## Common Flow

1. Bootstrap or update the server through `infra/ansible`.
2. Configure DNS through `infra/terraform/cloudflare`.
3. Deploy the app through GitHub Actions or the Helm chart in `deploy/`.
4. Verify with smoke checks against the public host.
