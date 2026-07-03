---
name: question
description: Használd, amikor egy feladatból semleges, megoldási javaslat nélküli kutatási kérdéseket kell készíteni QRSPI/RPI jellegű munkafolyamathoz, vagy amikor a /question Claude Code slash commandot és a hozzá szükséges agentet kell telepíteni. Létrehozza a task.md és questions.md artifactokat, és könnyű codebase-feltérképezéshez codebase-locator agentet használ.
---

# Question Skill

Ez a skill a QRSPI folyamat első önálló lépése: a feladatot tiszta, semleges
kutatási kérdésekre bontja, hogy a következő kontextusban futó kutatás ne a
megoldást, hanem a codebase tényeit keresse.

## Telepített skill és slash command

`npx skills add` a skillt telepíti, de a Claude Code slash command külön fájl a
projekt `.claude/commands/` mappájában. A `/question` command és a szükséges
`codebase-locator` agent telepítéséhez futtasd a projekt gyökeréből:

```bash
node .claude/skills/question/scripts/install-claude-assets.mjs
```

Ha a skill globálisan lett telepítve, add meg a célprojektet:

```bash
node ~/.claude/skills/question/scripts/install-claude-assets.mjs /path/to/project
```

## Munkafolyamat

1. Olvasd el teljesen a kapott feladatleírást, ticketet vagy fájlt.
2. Ha artifact könyvtárat kaptál, használd azt, és olvasd el a meglévő
   `task.md` vagy `route.md` fájlokat, ha vannak.
3. Végezz könnyű feltérképezést `codebase-locator` agenttel, hogy a kérdések a
   releváns kódrészekre irányuljanak.
4. Írj 3-7 semleges, ténykereső kérdést. Ne kérdezd azt, hogy mit érdemes
   építeni; azt kérdezd, mi létezik és hogyan működik.
5. Hozz létre vagy frissíts egy `thoughts/<id>/` artifact könyvtárat.
6. Írd meg a `task.md` rövid feladatösszefoglalót és a `questions.md`
   kutatási kérdéseket.
7. Mutasd meg a kérdéseket a felhasználónak jóváhagyásra vagy szerkesztésre.

## Kimenet

- `thoughts/<id>/task.md`
- `thoughts/<id>/questions.md`
- Következő javaslat: `/research thoughts/<id>/`

## Szabályok

- A `questions.md` ne tartalmazza a megoldási célt vagy a kívánt viselkedést.
- A kérdések legyenek semlegesek és különböző codebase-területeket célozzanak.
- Egyszerű, 1-2 fájlos feladathoz ne erőltesd a teljes QRSPI folyamatot.
- Ha a `route.md` explicit non-goalokat tartalmaz, tartsd őket tiszteletben.
