# Cloudflare Terraform

This stack manages the Cloudflare DNS records for the deployed workshop app and
current PR preview host shape:

```text
cobold.pragmatic-ai.engineer -> pai public IPv4
*.cobold.pragmatic-ai.engineer -> pai public IPv4
*.pragmatic-ai.engineer -> pai public IPv4
```

It intentionally starts with DNS only. Add WAF, cache, TLS, or redirect rules as
separate reviewed changes after the DNS record is under Terraform state.

TLS wildcard issuance is handled by the Ansible cert-manager bootstrap, not by
Terraform. That certificate covers both `*.pragmatic-ai.engineer` and
`*.cobold.pragmatic-ai.engineer`. This DNS stack routes both wildcard levels so
flat hosts like `demo.pragmatic-ai.engineer` and nested preview hosts like
`pr-42.cobold.pragmatic-ai.engineer` can reach Traefik.

## Credentials

Create a scoped Cloudflare API token for the `pragmatic-ai.engineer` zone:

- `Zone / Zone / Read`
- `Zone / DNS / Edit`

Do not commit the token. The provider reads it from:

```bash
export CLOUDFLARE_API_TOKEN="..."
```

For this repo, the token can also be loaded from 1Password. The default wrapper
expects:

```text
Item: cloudflare_token
Field label: credential
```

Run Terraform through the 1Password-backed mise tasks:

```bash
mise run cf:tf:plan:op
mise run cf:tf:apply:op
```

The wrapper uses the same retrieval pattern as the other local scripts:

```bash
OP_BIOMETRIC_UNLOCK_ENABLED=true op item get "cloudflare_token" --fields label=credential --reveal
```

If the item or field label changes, override the defaults:

```bash
OP_CLOUDFLARE_TOKEN_ITEM="cloudflare_token" \
OP_CLOUDFLARE_TOKEN_FIELD="credential" \
mise run cf:tf:plan:op
```

## Local Values

Copy the example file and fill in the real zone ID and `pai` public IPv4:

```bash
cp infra/terraform/cloudflare/terraform.tfvars.example infra/terraform/cloudflare/terraform.tfvars
$EDITOR infra/terraform/cloudflare/terraform.tfvars
```

`terraform.tfvars` is ignored by Git. The server IP should stay local, matching
the existing Ansible pattern in `infra/ansible/host_vars/pai/local.yml`.

The nested wildcard record supports PR preview hosts such as:

```text
pr-42.cobold.pragmatic-ai.engineer
```

The root wildcard record supports flat app hostnames such as:

```text
demo.pragmatic-ai.engineer
```

## Review Loop

From the repo root:

```bash
mise install terraform
mise run cf:tf:init
mise run cf:tf:fmt
mise run cf:tf:validate
mise run cf:tf:plan:op
```

Review the plan before applying:

```bash
mise run cf:tf:apply:op
```

## Existing DNS Record

If `cobold.pragmatic-ai.engineer` already exists in Cloudflare, import it before
the first apply. Look up the DNS record ID in Cloudflare, then run:

```bash
terraform -chdir=infra/terraform/cloudflare import \
  cloudflare_dns_record.cobold_app "$CLOUDFLARE_ZONE_ID/$CLOUDFLARE_DNS_RECORD_ID"
```

After import, run `mise run cf:tf:plan` and verify Terraform shows no
unexpected replacement or deletion before applying future changes.
