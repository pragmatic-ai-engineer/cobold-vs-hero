# UI Testautomation

This is the OneCare-like Python browser automation lane. It keeps the
business-readable scenario, page object layer, step helpers, and test metadata
together without copying the enterprise framework.

It verifies the review readiness matrix that the API automation already checks:
signal, missing evidence, and matrix rows.

Layout:

```text
testautomation/ui/
  features/         # business-readable scenarios
  page_objects.py   # stable browser selectors
  poms.py           # page object grouping
  steps.py          # readable workflow steps
  config.py         # driver and label metadata
  tests/            # pytest entrypoints
```

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
