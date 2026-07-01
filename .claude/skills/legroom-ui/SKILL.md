---
name: legroom-ui
description: Open the local Legroom observability and routing dashboard. Use when the user runs /legroom-ui or asks to open the Legroom UI.
allowed-tools: Bash
---

<!-- legroom-managed: ui-skill-v1 -->

# Legroom UI

Open the local Legroom dashboard served by the Legroom service.

## Run

Open the service-managed dashboard:

```bash
legroom ui
```

If the command fails because the UI service is not reachable, run:

```bash
legroom service status
```

Report the status and suggest starting the service with:

```bash
legroom service install --start
```

For source-checkout development only, `legroom ui serve --assets-dir
apps/legroom-ui/dist` can serve the dashboard in the foreground after
`mise run ui:build`.

Do not print raw prompts, raw transcripts, source code, API tokens, full
environment values, or credential-bearing URLs. The Legroom UI endpoints are
intended to serve content-free local observability snapshots.
