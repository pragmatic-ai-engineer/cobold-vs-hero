---
name: research
description: Használd, amikor questions.md alapján elfogulatlan, tényalapú codebase-kutatást kell készíteni file:line hivatkozásokkal, megoldási javaslat és design-döntés nélkül, vagy amikor a /research Claude Code slash commandot és a hozzá szükséges kutató agenteket kell telepíteni. A skill önállóan is használható kézzel írt questions.md fájllal.
---

# Research Skill

Ez a skill a QRSPI folyamat önálló kutatási lépése. A researcher csak a
`questions.md` fájlt olvassa, és dokumentálja, mi létezik a codebase-ben.

## Telepített skill és slash command

`npx skills add` a skillt telepíti, de a Claude Code slash command külön fájl a
projekt `.claude/commands/` mappájában. A `/research` command és a szükséges
agentek telepítéséhez futtasd a projekt gyökeréből:

```bash
node .claude/skills/research/scripts/install-claude-assets.mjs
```

Ha a skill globálisan lett telepítve, add meg a célprojektet:

```bash
node ~/.claude/skills/research/scripts/install-claude-assets.mjs /path/to/project
```

## Munkafolyamat

1. Olvasd el teljesen a `$ARGUMENTS/questions.md` fájlt.
2. Ne olvasd el a `task.md` fájlt, ticketet, design dokumentumot vagy feladatleírást.
3. Osszad szét a kérdéseket célzott agent promptokra:
   - `codebase-locator`: hol vannak a releváns fájlok;
   - `codebase-analyzer`: hogyan működik a konkrét kódút;
   - `codebase-pattern-finder`: milyen meglévő minták vannak;
   - `web-search-researcher`: csak akkor, ha a kérdés kifejezetten külső vagy
     aktuális dokumentációt kér.
4. Várd meg az összes agentet.
5. Olvass bele magad is azokba a fájlokba, ahol ellentmondás vagy hiány van.
6. Írd meg a `research.md` dokumentumot tömören, `file:line` hivatkozásokkal.
7. Mutass rövid összefoglalót, és jelezd, ha maradt nyitott terület.

## Kimenet

- `thoughts/<id>/research.md`
- Következő javaslat: `/design thoughts/<id>/` vagy közvetlen döntés, ha a
  felhasználó csak kutatást kért.

## Szabályok

- Dokumentarista vagy, nem tanácsadó.
- Ne javasolj implementációt, refaktort vagy optimalizációt.
- Ne olvasd a `task.md` fájlt.
- Minden állításhoz adj `file:line` hivatkozást, ha codebase-tényről van szó.
- Ha egy kérdés nem válaszolható meg a codebase-ből, mondd ki pontosan.
