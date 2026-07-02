# Cobold Review Readiness solution package

Angol verzió: [README.md](README.md).

Ez a mappa a Cobold vs Hero review readiness matrix implementáció előtti
solution felülete.

Szándékosan `solution`, nem `design`: a frontend design jelenthet Figma-t,
vizuális irányt vagy UI layoutot. Ezek a fájlok a technikai megoldást írják le,
aminek implementáció előtt látszania kell.

## Tulajdonosi modell

| Artifact | Elsődleges tulajdonos | Cél |
| --- | --- | --- |
| `hld.md` | Solution architect | End-to-end szándék, határok, szereplők, fő flow, kockázatok és non-goals. |
| `lld.md` | Implementációs designer / senior fejlesztő | Endpoint részletek, evidence szabályok, mapping, validáció és implementációs jegyzetek. |
| `decisions.md` | Csapat | Elfogadott technikai döntések és következmények. |
| `acceptance-and-test-plan.md` | Csapat + tesztelő | Elfogadási feltételek és szükséges bizonyítékok. |

## Kapcsolat a contracts mappával

A `solution/` azt magyarázza el, mit kell tennie a rendszernek és miért.

A `contracts/` a swagger-szerű csomag, ami ellen az implementáció és a tesztek
futnak:

- OpenAPI request és response forma.
- PlantUML sequence és state diagramok.
- Request/response minta payloadok.

Ha a solution változik, a releváns contract artifactokat implementáció előtt
vagy azzal együtt frissítsd. Ha az implementáció viselkedést változtat, nézd
meg, hogy a HLD, LLD, OpenAPI, PlantUML, minták, Bruno smoke, UI smoke és
automatizáció még ugyanazt írják-e le.

## Workshop loop

```text
draft HLD
-> LLD finomítás
-> contracts frissítés
-> smoke és automation elvárások
-> legkisebb vertikális szelet implementálása
-> code gate-ek és smoke ellenőrzések
-> bizonyíték rögzítése
-> drift review solution, contracts, code és tesztek között
```
