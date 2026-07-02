# Continuous Delivery kutatási jegyzet

English version: [continuous-delivery-research.md](continuous-delivery-research.md)

Ez a workshop kicsiben modellezi a teljes enterprise delivery életciklust:
solution design, futtatható contractok, Java backend, NestJS BFF, Angular
frontend, manuális tesztelőknek szánt smoke checkek, mélyebb testautomation,
infrastructure as code, CI és automatikus deployment.

Nem az a lényeg, hogy minden enterprise rendszer pontosan így nézzen ki. Az a
lényeg, hogy egy kis repo is meg tudja mutatni a teljes Continuous Delivery
rendszert: minden változtatás legyen kicsi, érthető, tesztelhető,
deployolható és review-zható az ötlettől a productionig.

## Alaptézis

A Continuous Delivery nem csak CI job vagy deploy gomb, hanem socio-technical
delivery rendszer. A csapat úgy tervezi a munkát, hogy a `main` mindig közel
maradjon a releasable állapothoz, a deployment rutinszerű legyen, a kockázatot
pedig kisebb változtatásokkal, automatizált visszajelzéssel és emberi review-val
csökkentsük.

A workshop rövid definíciója:

```text
Ötlet -> solution -> contractok -> implementáció -> verifikáció -> csomagolás -> deploy -> evidence -> tanulás
```

## Életciklus térkép

| Életciklus lépés                | Workshop artifact                                             | Best-practice jel                                                                                   |
| ------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Product/task framing            | `docs/demo-task.md`                                           | A munka vékony, review-zható slice-ként indul, explicit non-goalokkal.                              |
| AI blueprint és team promptok   | `ai-runbook/`                                                 | Az AI használat explicit, nem rejtett ad hoc chat history.                                          |
| High-level design               | `solution/cobold-briefing/hld.md`                             | Az architektúra határai, szereplői, kockázatai és non-goaljai kód előtt látszanak.                  |
| Low-level design                | `solution/cobold-briefing/lld.md`                             | Az endpoint viselkedése, mapping, validáció és edge case-ek implementálhatóan konkrétak.            |
| Döntések                        | `solution/cobold-briefing/decisions.md`                       | A tradeoffok rögzítve vannak, így a reviewer szándékot is tud vizsgálni, nem csak szintaxist.       |
| Acceptance és test plan         | `solution/cobold-briefing/acceptance-and-test-plan.md`        | A szükséges evidence meg van tervezve, mielőtt a slice done lenne.                                  |
| API contract                    | `contracts/openapi/cobold-briefing-api.yaml`                  | Backend, BFF, UI, smoke tesztek és automation ugyanarra a futtatható megállapodásra épülnek.        |
| Flow/state diagramok            | `contracts/plantuml/`                                         | A komplexebb viselkedés látható, mielőtt szétszóródna a kódban.                                     |
| Backend implementáció           | `backend/`                                                    | A Java service birtokolja a domain viselkedést és a unit-level confidence-et.                       |
| BFF implementáció               | `bff/`                                                        | A NestJS BFF birtokolja a UI-facing mappinget, és elválasztja a frontendet a backend internals-től. |
| Frontend implementáció          | `frontend/`                                                   | Az Angular UI birtokolja a user workflow-t és a screen-shareable evidence-et.                       |
| Developer/manuális tester smoke | `smoke/api`, `smoke/ui`                                       | Gyors checkek bizonyítják a deployed shape-et full automation stack nélkül.                         |
| Mélyebb automation              | `testautomation/api`, `testautomation/ui`                     | Robusztus API és böngészős suite-ok védik az ismételhető regressziós útvonalakat.                   |
| Lokális task runner             | `mise.toml`                                                   | Tool verziók és parancsok közösek embereknek, agenteknek és CI-nak.                                 |
| CI                              | `.github/workflows/ci.yaml`                                   | Pull requestek és pushok ugyanazt a verification entrypointot futtatják.                            |
| Container csomagolás            | `backend/Dockerfile`, `bff/Dockerfile`, `frontend/Dockerfile` | A service-ek immutable deployment artifactokká válnak.                                              |
| Kubernetes deployment           | `deploy/helm/cobold-vs-hero/`                                 | A runtime konfiguráció verziózott és review-zható.                                                  |
| Szerver bootstrap               | `infra/ansible/`                                              | A cluster és runner setup reprodukálható, nem tribal knowledge.                                     |
| Edge/DNS infrastruktúra         | `infra/terraform/cloudflare/`                                 | A külső routing reviewed infrastructure code-ként kezelt.                                           |
| Auto deploy                     | `.github/workflows/deploy.yaml`                               | A pipeline image-eket buildel, GHCR-be pushol, majd Helm-mel deployol.                              |

## Mit demonstrál ez?

1. **Vékony vertical slice-ok.** Egy hasznos változtatás menjen végig a
   dokumentáción, contractokon, backenden, BFF-en, frontenden, teszteken és
   deploymenten anélkül, hogy többhetes integrációs eseménnyé válna.

2. **Minden fontos dolog verziózott.** Solution intent, contractok, sample-ök,
   smoke tesztek, automation, Helm, Ansible, Terraform és workflow-k a kód
   mellett élnek, így a drift review-zható.

3. **A contract összeköti a szerepeket.** Az OpenAPI és a sample nem
   dokumentációs színház; ezek az architect, backend fejlesztő, BFF fejlesztő,
   frontend fejlesztő, tester és AI agent közös határai.

4. **A feedback költség szerint rétegzett.** Először local build és unit teszt;
   Bruno és Playwright smoke check bizonyítja a manuális tester útvonalat;
   pytest és Playwright automation ad mélyebb regressziós bizalmat.

5. **A manuális tesztelésnek tervezett szerepe van.** A manuális tesztelő ne
   homályos "please test" kérést kapjon, hanem gyors smoke collectiont,
   böngészőben látható evidence-et és tiszta acceptance promptokat.

6. **Az automation támogatja, de nem váltja ki a review-t.** A CI blokkolja a
   nyilvánvaló regressziókat. Az ember továbbra is nézi a scope-ot,
   tradeoffokat, release risket, data handlinget, UX-et és azt, hogy érdemes-e
   egyáltalán shipelni a slice-ot.

7. **A deployment reviewed runtime definíciókra épül.** Helm, Ansible,
   Terraform és GitHub Actions láthatóvá teszi a runtime pathot: image build,
   cluster setup, traffic routing, deployment commit SHA alapján.

8. **Ugyanazok a parancsok szolgálják az embereket és agenteket.**
   `mise run verify`, `mise run api:smoke`, `mise run ui:smoke` és a
   testautomation parancsok közös operating surface-t adnak fejlesztőknek,
   tesztelőknek, CI-nak és AI asszisztenseknek.

9. **A sebességet és stabilitást együtt mérjük.** A DORA jelenleg öt delivery
   performance metrikát emel ki: change lead time, deployment frequency, failed
   deployment recovery time, change fail rate és deployment rework rate. A
   workshop ezekkel tud scorecardot adni a delivery javításához.

10. **Az AI helye a delivery loopon belül van.** Az AI akkor erős, amikor
    contextet készít, opciókat draftol, driftet ellenőriz, teszteket javasol,
    evidence-et foglal össze, és explicit acceptance criteria alapján review-z.

## AI tooling extension pointok

Ott használjuk az AI-t, ahol erősíti a delivery rendszert:

| Delivery pillanat | AI miben segít                                             | Guardrail                                                             |
| ----------------- | ---------------------------------------------------------- | --------------------------------------------------------------------- |
| Task shaping      | Homályos kérésből scope, non-goal, risk és kérdéslista.    | Az értékért és prioritásért a human product owner felel.              |
| HLD/LLD drafting  | Első design opciók és edge case-ek a task alapján.         | Kell source file, constraint és explicit assumption.                  |
| Contract munka    | OpenAPI/sample/implementation drift keresése.              | A checked-in contract a review-zható source, nem a chat szöveg.       |
| Implementáció     | Kis diffek Java, BFF és Angular felületeken.               | A legkisebb vertical slice kell, és minden diffet át kell nézni.      |
| Test design       | Unit, smoke, API automation és browser path javaslatok.    | Ne duplikáljuk a teszteket; toljuk őket a legolcsóbb hasznos rétegbe. |
| Verifikáció       | Repo-owned parancsok futtatása és evidence összefoglalása. | Evidence-ben legyen parancs, target és maradék gap.                   |
| Review            | Scope, risk, missing test és docs drift ellenőrzése.       | Finding file/line hivatkozással jöjjön, ne érzésből.                  |
| Release handoff   | Release note, tester note és rollback note draftolása.     | A release authority maradjon embernél.                                |

## Workshop storyline

1. Indulás a Cobold vs Hero taskkal és acceptance criteriákkal.
2. Megmutatni, hogy HLD, LLD, döntések, OpenAPI, diagramok és sample-ök hogyan
   teszik review-zhatóvá a munkát implementáció előtt.
3. Egy kis vertical slice implementálása vagy inspektálása backenden, BFF-en és
   UI-on keresztül.
4. Gyors local gate-ek futtatása: `mise run verify`.
5. Manuális-tester smoke checkek futtatása Brunóval és Playwrighttal.
6. Mélyebb API/UI automation futtatása nagyobb confidence-ért.
7. Megmutatni, hogy a CI ugyanazt a verification pathot ismétli.
8. Megmutatni, hogy a deploy image-eket buildel, GHCR-be pushol, majd Helm-mel
   K3s-re alkalmazza.
9. A loop lezárása evidence-szel: mi változott, mi ment át, milyen risk maradt,
   és mit kell legközelebb javítani.

## Readiness checklist

Enterprise slice-okhoz használható rövid Continuous Delivery checklist:

- A tasknak van scope-ja, non-goalja, riskje és acceptance criteriája.
- A HLD és LLD kód előtt elmagyarázza a tervezett viselkedést.
- Az API contractok és sample-ök egyeznek az implementációval és tesztekkel.
- A repo hidden setup nélkül verifikálható lokális parancsokkal.
- A gyors tesztek a hibák nagy részét elkapják a drágább UI automation előtt.
- A manuális tesztelők smoke pathjai valódi acceptance criteriákhoz kötődnek.
- A CI ugyanazokat a parancsokat futtatja, mint a fejlesztők és agentek.
- A deployment artifact immutable és commit SHA-hoz kötött.
- A runtime konfiguráció Helm, Ansible és Terraform által verziózott.
- A deploy path tartalmaz rollout statust és ismert rollback sztorit.
- Az evidence verifikáció után készül, nem emlékezetből rekonstruáljuk.
- Az AI használat explicit, review-zható és checked-in contexthez kötött.

## Jó következő bővítések

Ez a repo már erős Continuous Delivery teaching baseline. A következő
legértékesebb lépések:

- Release note és rollback note generálása a merged diffből.
- Alap observability: health checkek, structured logok és egy dashboard.
- Dependency/security scanning és SBOM generálás.
- Feature flag vagy branch-by-abstraction példa kockázatos változtatásokhoz.
- Kis DORA/evidence dashboard GitHub Actions és deploy history alapján.

## Hivatkozások

- [Continuous Delivery](https://continuousdelivery.com/) Jez Humble és
  contributors: rövid definíció és alapelvek.
- [Continuous Delivery: Reliable Software Releases through Build, Test, and
  Deployment Automation](https://martinfowler.com/books/continuousDelivery.html)
  Jez Humble és David Farley: a foundational könyv.
- [Continuous Integration](https://martinfowler.com/articles/continuousIntegration.html)
  Martin Fowler: frissített CI practice guide.
- [DORA software delivery performance metrics](https://dora.dev/guides/dora-metrics/):
  aktuális delivery-performance scorecard.
- [Accelerate](https://itrevolution.com/product/accelerate/) Nicole Forsgren,
  Jez Humble és Gene Kim: research-backed software delivery performance.
- [The DevOps Handbook, Second Edition](https://itrevolution.com/product/the-devops-handbook-second-edition/)
  Gene Kim, Jez Humble, Patrick Debois, John Willis és Nicole Forsgren:
  enterprise transformation és a Three Ways.
- [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
  Ham Vocke: gyakorlati test layering delivery pipeline-okhoz.
- [Trunk Based Development](https://trunkbaseddevelopment.com/) Paul Hammant
  és contributors: CI/CD-t támogató branching model.
- [Google SRE: Release Engineering](https://sre.google/sre-book/release-engineering/):
  reproducible, automated release process guidance.
- [Team Topologies](https://teamtopologies.com/book) Matthew Skelton és
  Manuel Pais: team design fast flow-hoz.
- [Dave Farley: Continuous Delivery Explained in 15 Minutes](https://www.youtube.com/watch?v=tQMrrNo16jo):
  rövid videós bevezető.
- [Jez Humble: Continuous Delivery](https://www.youtube.com/watch?v=skLJuksCRTw):
  classic talk az eredeti practice-ről.
