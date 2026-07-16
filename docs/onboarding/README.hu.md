# Onboarding

Angol verzió: [README.md](README.md).

Ez a repo workshop méretű software delivery rendszer. Elég kicsi ahhoz, hogy
gyorsan átlássuk, de megtartja a fontos, production-szerű határokat: backend,
BFF, frontend, contractok, smoke ellenőrzések, robusztusabb automatizáció,
deployment, infrastruktúra és observability.

## Mentális modell

A termék viselkedés neve: Review Readiness Matrix.

```text
Angular UI
-> NestJS BFF
-> Spring Boot API
-> determinisztikus readiness szabályok
-> signal + evidence + matrix
```

A felhasználó leír egy tervezett delivery változtatást, kiválasztja az érintett
felületeket, a rendelkezésre álló bizonyítékokat és a risk flag-eket. Ezután a
rendszer három signal egyikét adja vissza:

- `truce` - review-ready kezdő szelet.
- `sparring` - hasznos szelet, de hiányos a bizonyíték.
- `shield-wall` - túl kockázatos vagy túl széles; implementáció előtt szét kell
  bontani.

A tanítási cél nem a fantasy téma. A tanítási cél a kontrollált AI-asszisztált
delivery: feladat formálása, contractok rögzítése, kis vertikális szelet
implementálása, ellenőrzése és review bizonyíték láthatóvá tétele.

## Repo térkép

| Útvonal | Első tudnivaló |
| --- | --- |
| `backend/` | Spring Boot API. Itt vannak a readiness szabályok és backend status. |
| `bff/` | NestJS BFF. Stabil UI contract és backend proxy. |
| `frontend/` | Angular UI. Status, inputok, evidence summary és matrix renderelés. |
| `contracts/` | OpenAPI, PlantUML diagramok és minta payloadok. |
| `solution/cobold-briefing/` | HLD, LLD, döntések, elfogadási és tesztterv. |
| `smoke/` | Gyors Bruno API és Playwright UI ellenőrzések. |
| `testautomation/` | Robusztusabb Python API és UI automatizációs sávok. |
| `deploy/` | Helm chart és Datadog deployment támogatás. |
| `infra/` | K3s host bootstrap és Cloudflare DNS. |
| `docs/` | Repo-szintű task jegyzetek, onboarding, observability, kutatás. |
| `ai-runbook/` | Közös AI-asszisztált munkautasítások. |

## Runtime térkép

Lokális fejlesztéshez három processz kell:

| Processz | Parancs | URL | Felelősség |
| --- | --- | --- | --- |
| Backend | `mise run be:start` | `http://localhost:8080` | Readiness szabályok. |
| BFF | `mise run bff:start` | `http://localhost:3000` | UI API és status aggregáció. |
| Frontend | `mise run fe:start` | `http://localhost:4200` | Böngészős UI. |

Az Angular dev server a `/api` hívásokat a BFF felé proxyzza. A BFF a
`BACKEND_BASE_URL` változót használja, vagy alapból `http://localhost:8080`
címre megy.

## Első lokális futtatás

A repo rootból:

```bash
brew install mise
mise install
mise run fe:install
mise run bff:install
```

Stack indítása:

```bash
mise run be:start
mise run bff:start
mise run fe:start
```

Nyisd meg: `http://localhost:4200`.

## Ellenőrzési lépcső

Mindig a legkisebb hasznos ellenőrzést válaszd:

| Cél | Parancs |
| --- | --- |
| Contract fájlok léteznek | `mise run contracts:check` |
| Backend tesztek | `mise run be:test` |
| BFF fordítás | `mise run bff:build` |
| Frontend build | `mise run fe:build` |
| Offline gate | `mise run verify` |
| Gyors API smoke | `mise run api:smoke` |
| Gyors UI smoke | `mise run ui:smoke` |
| Robusztus API automatizáció | `mise run api:testautomation` |
| Robusztus UI automatizáció | `mise run ui:testautomation` |

`mise run verify` nem igényli a teljes app stacket. A smoke és testautomation
parancsok igen.

## Változtatási workflow

1. Olvasd el a [docs/demo-task.hu.md](../demo-task.hu.md) fájlt és az érintett
   komponens README-jét.
2. Nézd meg, hogy a viselkedés már szerepel-e a `solution/` és `contracts/`
   artifactokban.
3. Ha viselkedés változik, implementáció előtt vagy azzal együtt frissítsd a
   solution vagy contract artifactokat.
4. A readiness logika maradjon a `backend/` alatt; a BFF legyen vékony mapping;
   a UI renderelésre és interakcióra fókuszáljon.
5. Futtasd a legkisebb hasznos lokális gate-et, majd service-határt átlépő
   változásnál smoke vagy automatizációs ellenőrzést.
6. Rögzíts bizonyítékot: parancs output, smoke eredmény, screenshot vagy
   explicit gap.
7. A doksi változás legyen közel ahhoz az artifacthoz, amit magyaráz.

## Deployment forma

A deployolt app a `pai` K3s hoston fut:

- production host: `https://cobold.mimukodik.hu`
- preview host minta: `https://cobold-pr-<number>.mimukodik.hu`
- image-ek: GHCR, `ghcr.io/mimukodik`
- deploy: GitHub Actions self-hosted runner + Helm
- DNS: Cloudflare Terraform, `infra/terraform/cloudflare`
- TLS: cert-manager wildcard bootstrap, `infra/ansible`

## Mit ne csinálj először

- Ne adj hozzá persistence-t, authenticationt, user managementet vagy valódi
  scoring engine-t, hacsak a workshop feladat ezt nem kéri.
- Ne duplikáld a readiness szabályokat a BFF-ben vagy frontendben.
- Ne kezeld source-ként a generated build mappákat vagy `node_modules` tartalmat.
- Ne commitolj lokális IP-t, Cloudflare tokent, Datadog API key-t vagy
  kubeconfig változást.
