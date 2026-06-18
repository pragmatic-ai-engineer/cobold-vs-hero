# Cobold Local Bruno Smoke

Open this folder in Bruno:

```text
manual-api/cobold-local
```

Use the `local` environment.

Run the smoke requests after the backend and BFF are running:

```bash
mise run be:start
mise run bff:start
```

For quick command-line smoke checks during development:

```bash
mise run api:smoke
```

Requests:

1. Truce readiness
2. Sparring readiness
3. Shield-wall readiness

These mirror the heavier DPS-lite Python testautomation suite under
`testautomation/`.

On `workshop/03-harness-before-code`, these requests are expected to fail
against the baseline app. That failure is the measured feedback used by the
implementation loop.
