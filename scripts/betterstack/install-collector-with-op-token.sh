#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"

token_item="${OP_BETTERSTACK_TOKEN_ITEM:-better_stack-pragmatic-ai.engineer}"
token_field="${OP_BETTERSTACK_TOKEN_FIELD:-credential}"
collector_name="${BETTERSTACK_COLLECTOR_NAME:-pai-cobold-vs-hero}"
collector_note="${BETTERSTACK_COLLECTOR_NOTE:-Pragmatic AI Engineer workshop K3s cluster}"
team_name="${BETTERSTACK_TEAM_NAME:-}"
api_base="${BETTERSTACK_API_BASE:-https://telemetry.betterstack.com/api/v1}"

if [[ -z "${KUBECONFIG:-}" && -f "$repo_root/infra/ansible/.generated/kubeconfig-pai" ]]; then
  export KUBECONFIG="$repo_root/infra/ansible/.generated/kubeconfig-pai"
fi

for command_name in op curl jq kubectl helm; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "$command_name is required for Better Stack collector setup." >&2
    exit 1
  fi
done

api_token="$(
  OP_BIOMETRIC_UNLOCK_ENABLED=true \
    op item get "$token_item" --fields "label=$token_field" --reveal 2>/dev/null || true
)"

if [[ -z "$api_token" ]]; then
  echo "Unable to load Better Stack API token from 1Password item '$token_item' field '$token_field'." >&2
  echo "Override with OP_BETTERSTACK_TOKEN_ITEM or OP_BETTERSTACK_TOKEN_FIELD if needed." >&2
  exit 1
fi

validate_json() {
  local payload="$1"
  local context="$2"

  if ! jq -e . >/dev/null 2>&1 <<<"$payload"; then
    echo "Better Stack returned a non-JSON response while $context." >&2
    exit 1
  fi

  if jq -e 'has("errors") or has("error")' >/dev/null 2>&1 <<<"$payload"; then
    echo "Better Stack API error while $context:" >&2
    jq -c '{errors: .errors, error: .error, invalid_attributes: .invalid_attributes}' <<<"$payload" >&2
    exit 1
  fi
}

echo "Looking for Better Stack Kubernetes collector '$collector_name'."
collectors_json="$(
  curl -sS \
    -H "Authorization: Bearer $api_token" \
    "$api_base/collectors?per_page=250"
)"
validate_json "$collectors_json" "listing collectors"

collector_secret="$(
  jq -r --arg name "$collector_name" '
    .data[]?
    | select(.attributes.name == $name and .attributes.platform == "kubernetes")
    | .attributes.secret
  ' <<<"$collectors_json" | head -n 1
)"

if [[ -z "$collector_secret" ]]; then
  echo "Creating Better Stack Kubernetes collector '$collector_name'."
  create_payload="$(
    jq -n \
      --arg name "$collector_name" \
      --arg note "$collector_note" \
      --arg team_name "$team_name" \
      '{
        name: $name,
        platform: "kubernetes",
        note: $note,
        configuration: {
          components: {
            ebpf_metrics: true,
            ebpf_red_metrics: true,
            ebpf_tracing_full: true,
            logs_kubernetes: true,
            metrics_databases: true,
            traces_opentelemetry: true
          },
          logs_sample_rate: 100,
          traces_sample_rate: 100
        }
      } + (if $team_name == "" then {} else {team_name: $team_name} end)'
  )"

  create_json="$(
    curl -sS -X POST "$api_base/collectors" \
      -H "Authorization: Bearer $api_token" \
      -H "Content-Type: application/json" \
      -d "$create_payload"
  )"
  validate_json "$create_json" "creating collector"

  collector_secret="$(jq -r '.data.attributes.secret // empty' <<<"$create_json")"
fi

if [[ -z "$collector_secret" ]]; then
  echo "Better Stack collector '$collector_name' did not return a collector secret." >&2
  exit 1
fi

echo "Installing Better Stack collector into Kubernetes namespace 'observability'."
kubectl create namespace observability --dry-run=client -o yaml | kubectl apply -f -
kubectl -n observability create secret generic better-stack-collector-secret \
  --from-literal=COLLECTOR_SECRET="$collector_secret" \
  --dry-run=client -o yaml | kubectl apply -f -

helm repo add better-stack https://betterstackhq.github.io/collector-helm-chart
helm repo update
helm upgrade --install better-stack-collector better-stack/collector \
  --namespace observability \
  --set collector.env.COLLECTOR_SECRET="" \
  --set 'collector.envFrom[0].secretRef.name=better-stack-collector-secret' \
  --set collectOtel.grpcPort=4317 \
  --set collectOtel.httpPort=4318

echo "Better Stack collector '$collector_name' is installed. The collector secret was stored only in Kubernetes."
