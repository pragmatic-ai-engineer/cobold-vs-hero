# Cobold Local Bruno Smoke

Open this folder in Bruno:

```text
delivery-pack/manual-api/cobold-local
```

Use the `local` environment.

Run the smoke requests after the backend and BFF are running:

```bash
mise run be:start
mise run bff:start
```

Requests:

1. Truce briefing
2. Sparring briefing
3. Shield-wall briefing

These mirror the DPS-lite Python smoke tests under `testautomation/`.
