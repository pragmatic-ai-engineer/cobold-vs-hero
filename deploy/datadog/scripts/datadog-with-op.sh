#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../../.." && pwd)"

op_item="${OP_DATADOG_ITEM:-datadog-pragmatic-ai.engineer}"
command="${1:-help}"

usage() {
  cat <<EOF
Usage: $0 <agent|github|all>

Reads Datadog values from 1Password item '$op_item'.
Override the item with OP_DATADOG_ITEM.

Required fields:
  site                  Datadog site, for example datadoghq.eu or datadoghq.com
  api_key               Datadog API key for the Kubernetes Agent
  rum_application_id    Browser RUM application ID
  rum_client_token      Browser RUM client token

The api_key field also falls back to a field named credential for consistency
with existing repo helper scripts.
EOF
}

require_tool() {
  local tool="$1"

  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "$tool is required." >&2
    exit 1
  fi
}

read_op_field() {
  local field="$1"

  OP_BIOMETRIC_UNLOCK_ENABLED=true \
    op item get "$op_item" --fields "label=$field" --reveal 2>/dev/null || true
}

read_required_field() {
  local env_name="$1"
  shift
  local value="${!env_name:-}"

  if [[ -z "$value" ]]; then
    local field
    for field in "$@"; do
      value="$(read_op_field "$field")"
      if [[ -n "$value" ]]; then
        break
      fi
    done
  fi

  if [[ -z "$value" ]]; then
    echo "Unable to load $env_name from 1Password item '$op_item' fields: $*" >&2
    exit 1
  fi

  printf '%s' "$value"
}

load_agent_env() {
  DATADOG_SITE="$(read_required_field DATADOG_SITE site)"
  DATADOG_API_KEY="$(read_required_field DATADOG_API_KEY api_key credential)"
  export DATADOG_SITE DATADOG_API_KEY
}

load_rum_env() {
  DATADOG_RUM_APPLICATION_ID="$(read_required_field DATADOG_RUM_APPLICATION_ID rum_application_id application_id)"
  DATADOG_RUM_CLIENT_TOKEN="$(read_required_field DATADOG_RUM_CLIENT_TOKEN rum_client_token client_token)"
  export DATADOG_RUM_APPLICATION_ID DATADOG_RUM_CLIENT_TOKEN
}

install_agent() {
  load_agent_env
  mise run obs:datadog:agent:install
}

configure_github() {
  require_tool gh
  load_agent_env
  load_rum_env

  gh variable set DATADOG_OBSERVABILITY_ENABLED --body true
  gh variable set DATADOG_SITE --body "$DATADOG_SITE"
  gh variable set DATADOG_RUM_APPLICATION_ID --body "$DATADOG_RUM_APPLICATION_ID"
  gh secret set DATADOG_RUM_CLIENT_TOKEN --body "$DATADOG_RUM_CLIENT_TOKEN"
}

require_tool op
require_tool mise

cd "$repo_root"

case "$command" in
  agent)
    install_agent
    ;;
  github)
    configure_github
    ;;
  all)
    install_agent
    configure_github
    ;;
  help|-h|--help)
    usage
    ;;
  *)
    usage >&2
    exit 1
    ;;
esac
