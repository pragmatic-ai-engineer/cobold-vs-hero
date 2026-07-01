#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"
terraform_dir="$repo_root/infra/terraform/cloudflare"

token_item="${OP_CLOUDFLARE_TOKEN_ITEM:-cloudflare_token}"
token_field="${OP_CLOUDFLARE_TOKEN_FIELD:-credential}"

if ! command -v op >/dev/null 2>&1; then
  echo "1Password CLI is required: https://developer.1password.com/docs/cli/get-started/" >&2
  exit 1
fi

if ! command -v terraform >/dev/null 2>&1; then
  echo "Terraform is required. Run: mise install terraform" >&2
  exit 1
fi

token="$(
  OP_BIOMETRIC_UNLOCK_ENABLED=true \
    op item get "$token_item" --fields "label=$token_field" --reveal 2>/dev/null || true
)"

if [[ -z "$token" ]]; then
  echo "Unable to load Cloudflare token from 1Password item '$token_item' field '$token_field'." >&2
  echo "Override with OP_CLOUDFLARE_TOKEN_ITEM or OP_CLOUDFLARE_TOKEN_FIELD if needed." >&2
  exit 1
fi

CLOUDFLARE_API_TOKEN="$token" terraform -chdir="$terraform_dir" "$@"
