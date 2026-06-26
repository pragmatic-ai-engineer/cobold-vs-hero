# Research Findings

## Q1: Hogyan történik a `briefing-form` adatainak validációja és küldése a frontend oldalon?

### Findings
- **Adatvalidáció**: Nincs explicit frontend oldali validáció. Nem használ Angular Validators-okat vagy HTML5 validációs attribútumokat. A mezők közvetlenül az `[(ngModel)]` kétirányú adatkötéssel kapcsolódnak a komponens változóihoz (`frontend/src/app/app.ts:77-80`).
- **Adatküldés**: A `requestBriefing()` metódus végzi az adatok küldését (`frontend/src/app/app.ts:77-92`).
- **Technológia**: Az Angular beépített `HttpClient` modulját használja POST kéréshez.
- **Végpont**: `${this.bffBaseUrl}/api/cobold-vs-hero/briefing` (`frontend/src/app/app.ts:84`).
- **Payload**: Három mezőt küld el: `coboldConcern`, `heroMove`, `systemMood` (`frontend/src/app/app.ts:78-82`).
- **Állapotkezelés**: Angular szignálokat (Signals) használ (`loading`, `briefing`, `error`) a folyamat követésére és a UI frissítésére (`frontend/src/app/app.ts:16-18`).

## Q2: Milyen módon dolgozza fel a backend (NestJS/Java) a jelenlegi `BriefingRequest` objektumot?

### Findings
- **Java Backend**: A kérést a `CoboldVsHeroController` kezeli (`backend/src/main/java/dev/workshop/demo/CoboldVsHeroController.java:32-45`). A `@Valid @RequestBody BriefingRequest request` annotációval fogadja az adatokat.
- **Kockázatelemzés**: A `riskScore()` metódus kulcsszavas egyezés alapján pontozza a kérést (`backend/src/main/java/dev/workshop/demo/CoboldVsHeroController.java:47-75`). A pontszám alapján dől el a válasz "signal" értéke (shield-wall, sparring, truce).
- **NestJS BFF**: A BFF csak továbbítja a kérést a backendnek (`bff/src/modules/briefing/briefing.service.ts:16-38`), de elvégzi a válasz mezők remapping-jét (pl. `coboldWisdom` -> `reviewerNote`).

## Q3: Milyen változások szükségesek a DTO-kban a backend oldalon az új mezők támogatásához, és hogyan biztosítható a visszamenőleges kompatibilitás?

### Findings
- **Java DTO**: A `BriefingRequest` record bővítése szükséges új mezőkkel (`backend/src/main/java/dev/workshop/demo/CoboldVsHeroController.java:120-124`).
- **NestJS DTO**: A `BriefingRequestDto` interfész frissítése szükséges (`bff/src/modules/briefing/briefing.dto.ts:1-5`).
- **Kompatibilitás**: Az új mezőket opcionálisként kell kezelni (Java-ban alapértelmezett értékkel vagy `Optional`-lal, TypeScript-ben `?` operátorral), így a régi frontend kliensek nem törnek el.
- **OpenAPI**: A szerződést is frissíteni kell (`contracts/openapi/cobold-briefing-api.yaml:85-97`).

## Q4: Milyen kockázatokkal jár az API sémájának módosítása, és milyen tesztek ellenőrzik jelenleg a briefing folyamat helyességét?

### Findings
- **Kockázatok**: Ha az új mezők kötelezőek lennének, a meglévő frontend (`frontend/src/app/app.ts:78-82`) hibát dobna. A teszt automatizáció (`testautomation/tests/test_briefing_api.py`) törhet, ha a válasz struktúrája vagy a várt szignálok változnak.
- **Ellenőrzés**: Unit tesztek a backend oldalon és Python alapú integrációs tesztek validálják a folyamatot.

## Q5: Hol találhatók az automatizált tesztek, amelyek a briefing flow működését validálják?

### Findings
- **Backend Unit Tesztek**: `backend/src/test/java/dev/workshop/demo/CoboldVsHeroControllerTests.java:23-47`.
- **API Integrációs Tesztek (Python)**: `testautomation/tests/test_briefing_api.py:4-51`.
- **Frontend Tesztek**: `frontend/src/app/app.spec.ts:42-66` (csak státusz kijelzést tesztel, a briefing folyamatot nem).
- **OpenAPI Ellenőrzés**: `contracts/openapi/cobold-briefing-api.yaml`.

## Cross-Cutting Observations
- A rendszer három rétegű: Frontend (Angular) -> BFF (NestJS) -> Backend (Java).
- A kérés validációja jelenleg csak a Java backend rétegben történik (`@NotBlank`).
- A NestJS BFF transzformációs rétegként is funkcionál, átnevezve bizonyos válasz mezőket.

## Open Areas
- A frontend oldalon jelenleg egyáltalán nincs validáció, ami hiba esetén rossz UX-hez vezethet.
- A BFF rétegben nincs beállítva ValidationPipe, így bármilyen payload átjut a backendig.
