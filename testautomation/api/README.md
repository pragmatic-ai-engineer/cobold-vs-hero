# API Testautomation

This is the DPS-like Python API automation lane. It verifies the BFF boundary
from outside the app with richer checks than the Bruno smoke collection.

Coverage:

- representative `truce`, `sparring`, and `shield-wall` readiness requests
- response signal
- required evidence and missing evidence
- review matrix rows

Run it after backend and BFF are running:

```bash
mise run api:testautomation
```

Override the BFF base URL if needed:

```bash
COBOLD_API_BASE_URL=http://localhost:3000 mise run api:testautomation
```
