# Smoke Checks

Fast checks for developers, agents, and manual testers. These are intentionally
shallower than `testautomation/`: they answer "is the demo path alive and
roughly correct?" before a deeper gate runs.

## Lanes

| Path | Tool | Purpose |
| --- | --- | --- |
| `api/` | Bruno CLI | Quick API checks against the BFF. |
| `ui/` | Playwright | Quick browser check against the Angular UI. |

## Run

Start backend and BFF before API smoke:

```bash
mise run be:start
mise run bff:start
mise run api:smoke
```

Start the full stack before UI smoke:

```bash
mise run be:start
mise run bff:start
mise run fe:start
mise run ui:smoke
```

Run both:

```bash
mise run smoke:all
```
