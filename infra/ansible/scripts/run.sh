#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

if [ "$#" -eq 0 ]; then
  set -- -i inventory.yml site.yml
fi

if command -v ansible-playbook >/dev/null 2>&1; then
  exec ansible-playbook "$@"
fi

if command -v uvx >/dev/null 2>&1; then
  exec uvx --from ansible-core ansible-playbook "$@"
fi

echo "ansible-playbook is not installed and uvx is unavailable." >&2
echo "Install Ansible or uv, then rerun this script." >&2
exit 1
