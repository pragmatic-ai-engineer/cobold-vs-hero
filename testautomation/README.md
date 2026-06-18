# DPS-Lite Heavyweight Testautomation

This folder is a tiny Python API automation suite that mirrors the role of DPS
without copying the enterprise framework.

It verifies the BFF boundary from outside the app. This is the heavier API
automation gate, not the quick developer smoke path. Use Bruno / `mise run
api:smoke` for fast local checks during development.

- representative `truce`, `sparring`, and `shield-wall` requests
- response signal
- reason and evidence prompts

Run it after backend and BFF are running:

```bash
mise run api:testautomation
```

Override the BFF base URL if needed:

```bash
COBOLD_API_BASE_URL=http://localhost:3000 mise run api:testautomation
```
