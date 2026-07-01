# UI Smoke

Quick Playwright browser checks for developers and manual testers.

This lane is intentionally shallow. It proves that the deployed UI loads, can
reach the BFF through `/api`, and can render one review readiness matrix.
Robust browser coverage belongs under `testautomation/ui`.

## Install

```bash
mise run ui:smoke:install
```

## Run

Start the app stack first:

```bash
mise run be:start
mise run bff:start
mise run fe:start
```

Then run:

```bash
mise run ui:smoke
```

Run in a visible browser:

```bash
mise run ui:smoke:headed
```

Override the UI URL when running against a deployed environment:

```bash
COBOLD_UI_BASE_URL=https://cobold.pragmatic-ai.engineer mise run ui:smoke
```

For local dev, the Angular dev server proxies `/api` to the BFF. If you need to
force a separate BFF URL, set `COBOLD_API_BASE_URL`; the smoke test will pass it
to the app as `?bffBaseUrl=...`.

## Recording A Quick Smoke

For manual exploration and one-off smoke creation:

```bash
cd smoke/ui
npm run codegen -- http://localhost:4200
```
