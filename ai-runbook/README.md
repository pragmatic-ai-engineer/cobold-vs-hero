# Shared AI Runbook

Ez a mappa a Cobold vs Hero projekt megosztható AI runbookja. A benne lévő
skillek helyi forrásból telepíthetők a `vercel-labs/skills` CLI-vel.

## Skillek

| Skill | Slash command | Mire való |
|---|---|---|
| `question` | `/question` | Feladatból semleges kutatási kérdéseket és artifact könyvtárat készít. |
| `research` | `/research` | `questions.md` alapján tényszerű codebase-kutatást ír `file:line` hivatkozásokkal. |

Mindkét skill önállóan is használható. A `question` csak a `codebase-locator`
agentet csomagolja. A `research` a kutatáshoz szükséges locator/analyzer/pattern
agenteket, plusz opcionális webes kutató agentet csomagol.

## Telepítés helyi mappából

A projekt gyökeréből:

```bash
NPM_CONFIG_REGISTRY=https://registry.npmjs.org \
NPM_CONFIG_USERCONFIG=/dev/null \
npx --yes skills@latest add ./ai-runbook \
  --skill question \
  --skill research \
  -a claude-code \
  -y
node ai-runbook/scripts/install-claude-assets.mjs
```

Az első parancs a skilleket telepíti a Claude Code projekt skill mappájába. A
második parancs a top-level slash commandokat és az agent definíciókat másolja a
`.claude/commands/` és `.claude/agents/` alá. A script eltávolítja a lokális
`question` és `research` bejegyzéseket a `skills-lock.json`-ból, mert a
`skills` CLI abszolút gépi pathot ír oda local source esetén.

Egyetlen skill telepítése:

```bash
NPM_CONFIG_REGISTRY=https://registry.npmjs.org \
NPM_CONFIG_USERCONFIG=/dev/null \
npx --yes skills@latest add ./ai-runbook --skill question -a claude-code -y
node .claude/skills/question/scripts/install-claude-assets.mjs
```

```bash
NPM_CONFIG_REGISTRY=https://registry.npmjs.org \
NPM_CONFIG_USERCONFIG=/dev/null \
npx --yes skills@latest add ./ai-runbook --skill research -a claude-code -y
node .claude/skills/research/scripts/install-claude-assets.mjs
```

Ha a gépen nincs privát npm registry beállítás, az `NPM_CONFIG_*` override-ok
elhagyhatók.

## Használat

```bash
/question "Rövid feladatleírás, ticket vagy fájlútvonal"
/research thoughts/2026-07-03-pelda-feladat/
```

A két fázis szándékosan külön kontextusban futtatható. A `/research` csak a
`questions.md` fájlt olvassa, és nem olvassa a `task.md`-t, hogy ne torzuljanak a
kutatási megállapítások.
