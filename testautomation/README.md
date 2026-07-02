# Testautomation

This folder contains the heavier tester-owned automation gates. These are not
the fast developer/manual smoke checks; those live under `smoke/`.

Layout:

```text
testautomation/
  api/   # DPS-like Python API tests
  ui/    # OneCare-like Python browser tests
```

Run the robust API gate after backend and BFF are running:

```bash
mise run api:testautomation
```

Run the robust UI gate after backend, BFF, and frontend are running:

```bash
mise run ui:testautomation
```

Run both robust gates:

```bash
mise run testautomation:all
```
