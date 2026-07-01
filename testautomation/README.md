# DPS-Lite / OneCare-Lite Testautomation

This folder is a tiny Python automation suite that mirrors the role of the
enterprise testautomation stack without copying the enterprise framework.

The API tests verify the BFF boundary from outside the app. This is the heavier
API automation gate, not the quick developer smoke path. Use Bruno / `mise run
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

## OneCare-lite UI automation

The UI testautomation is a toy version of the OneCare shape:

- `features/cobold_briefing_ui.feature` keeps the business-readable scenario
- `cobold_qa/ui/poms.py` groups page objects
- `cobold_qa/ui/page_objects.py` owns stable browser selectors
- `cobold_qa/ui/steps.py` exposes readable workflow steps
- `cobold_qa/ui/config.py` mirrors driver and label metadata

Install the browser once:

```bash
mise run ui:install-browsers
```

Run it after backend, BFF, and frontend are running:

```bash
mise run ui:testautomation
```

Override runtime URLs if needed:

```bash
COBOLD_UI_BASE_URL=http://localhost:4200 COBOLD_API_BASE_URL=http://localhost:3000 mise run ui:testautomation
```
