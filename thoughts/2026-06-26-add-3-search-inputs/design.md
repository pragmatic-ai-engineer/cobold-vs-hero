# Design Discussion

## Current State
A briefing-form jelenleg három szabad szöveges mezőt tartalmaz: `coboldConcern`, `heroMove` és `systemMood` (`frontend/src/app/app.html:56-69`). A backend (`backend/src/main/java/dev/workshop/demo/CoboldVsHeroController.java:47-75`) kulcsszavas kereséssel számol egy alap kockázati pontszámot, ami alapján meghatározza a választ (truce, sparring, shield-wall). Jelenleg nincs frontend oldali validáció, és a NestJS BFF (`bff/src/modules/briefing/briefing.service.ts:16-38`) csak transzformációs rétegként működik.

## Desired End State
Az űrlap kiegészül egy "Project Context" szekcióval, amely három új, kötelezően kitöltendő mezőt tartalmaz. Ezek a mezők finomítják a kockázati pontszámot szorzók alkalmazásával, pontosabb "signal"-t eredményezve. A frontend validálja a mezők meglétét a küldés előtt.

## Patterns to Follow
- **Angular Signals**: Az új mezők állapotát is szignálokkal kezeljük a komponensben (`frontend/src/app/app.ts:16-18`).
- **Java Records**: A backend DTO-kat továbbra is record-ként definiáljuk a konzisztencia érdekében (`backend/src/main/java/dev/workshop/demo/CoboldVsHeroController.java:120-124`).
- **Keyword-based base score**: Megtartjuk az alap pontszám számítását a meglévő szöveges mezőkből (`backend/src/main/java/dev/workshop/demo/CoboldVsHeroController.java:47-75`).

## Design Decisions
1. **Új mezők (Process Context)**:
   - `targetEnvironment` (Options: dev, staging, production)
   - `implementationComplexity` (Options: low, medium, high)
   - `teamExperience` (Options: junior, senior, expert)
2. **Kockázati logika (Multipliers)**:
   - Az alap pontszámot szorozzuk a kontextus alapján. Pl. `production` környezet esetén x2, `high complexity` esetén x1.5, `junior team` esetén x1.2.
3. **UI Elrendezés (Grouped)**:
   - Új `<fieldset class="project-context">` csoportosítás az Angular template-ben, legördülő listákkal (`select`), hogy korlátozzuk a bevitelt és egyszerűsítsük a validációt.
4. **Validáció (Mandatory)**:
   - HTML5 `required` attribútum és Angular form state ellenőrzés bevezetése. A "Request briefing" gomb csak akkor aktív, ha minden mező ki van töltve.

## What We're NOT Doing
- Nem módosítjuk a meglévő mezők (`coboldConcern`, stb.) alapvető működését.
- Nem vezetünk be adatbázis-alapú perzisztenciát; a kérés továbbra is tiszta request-response alapú marad.
- Nem változtatunk a BFF remapping logikáján a válasz oldalon.

## Open Risks
- **Retro-kompatibilitás**: Bár a DTO-kban opcionálisnak jelöljük az új mezőket a biztonság kedvéért, a frontend kényszeríteni fogja a küldésüket. Ha több kliens lenne, ez kockázatot jelentene.
- **Pontozási egyensúly**: A szorzók miatt könnyebben elérhető a `shield-wall` (7+ pont). Szükség lehet a határértékek finomhangolására az integrációs tesztek alapján.
