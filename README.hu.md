# Cobold vs Hero demó

Angol verzió: [README.md](README.md).

Ez a repo a Pragmatic AI Engineer workshop kicsi, de végigfuttatható delivery
demója. Ugyanazokat a fontos határokat mutatja, mint egy valósabb rendszer:
backend, BFF, frontend, contractok, smoke ellenőrzések, tesztautomatizáció,
deployment és infrastruktúra.

## Téma

- **Cobold reviewer**: kockázatérzékeny ellenfél, aki azt kérdezi, mi romolhat
  el.
- **Hero proposer**: a delivery szerep, aki hasznos változtatást javasol.
- **Cél**: egy tervezett változtatásból review readiness matrix készüljön:
  szükséges bizonyítékok, hiányzó bizonyítékok, stop condition és következő
  lépések.

## Kezdés

Új résztvevőként ezt a sorrendet kövesd:

1. [docs/onboarding/README.hu.md](docs/onboarding/README.hu.md) - repo túra,
   runtime térkép, ellenőrzési út és változtatási workflow.
2. [docs/README.hu.md](docs/README.hu.md) - dokumentációs index.
3. [docs/demo-task.hu.md](docs/demo-task.hu.md) - workshop baseline, feature
   szándék, API forma és elfogadási feltételek.
4. [solution/cobold-briefing/README.hu.md](solution/cobold-briefing/README.hu.md)
   - HLD, LLD, döntések és tesztterv belépési pontja.
5. Az érintett komponens README-je: `backend/`, `bff/`, `frontend/`,
   `contracts/`, `smoke/`, `testautomation/`, `deploy/`, `infra/`.

Nem minden README kap magyar változatot. A magyar doksik a workshophoz
legfontosabb belépési és orientációs felületekre fókuszálnak.

## Fő mappák

```text
cobold-vs-hero/
  backend/             # Spring Boot API, Java 17, Gradle
  bff/                 # NestJS BFF, TypeScript
  frontend/            # Angular app
  solution/            # HLD, LLD, döntések, elfogadási terv
  contracts/           # OpenAPI, PlantUML, minta payloadok
  smoke/               # gyors Bruno és Playwright smoke ellenőrzések
  testautomation/      # robusztusabb Python API és UI automatizáció
  deploy/              # Helm chart a K3s deployhoz
  infra/               # Ansible bootstrap és Cloudflare Terraform
  docs/                # résztvevői doksik és referencia jegyzetek
  ai-runbook/          # promptok, agent instrukciók, loop contract
  mise.toml            # közös tool verziók és parancsok
```

## Lokális futtatás

Telepítsd a `mise` CLI-t, ha még nincs fent:

```bash
brew install mise
```

A repo rootból:

```bash
mise install
mise run fe:install
mise run bff:install
```

Három terminál kell:

```bash
mise run be:start
mise run bff:start
mise run fe:start
```

Nyisd meg: `http://localhost:4200`.

Portok:

- backend: `http://localhost:8080`
- BFF: `http://localhost:3000`
- frontend: `http://localhost:4200`

## Ellenőrzés

Offline kapuk:

```bash
mise run verify
```

Gyors smoke:

```bash
mise run api:smoke
mise run ui:smoke
```

Részletesebb automatizáció:

```bash
mise run api:testautomation
mise run ui:testautomation
```

## Deployment röviden

Az alap host:

```text
https://cobold.pragmatic-ai.engineer
```

Preview host minta:

```text
pr-42.cobold.pragmatic-ai.engineer
```

DNS: `infra/terraform/cloudflare`. K3s/server bootstrap: `infra/ansible`.
Helm chart: `deploy/helm/cobold-vs-hero`.
