# Structure Outline

## Approach
Három új mező hozzáadása a teljes stack-en keresztül (OpenAPI -> Java Backend -> NestJS BFF -> Angular Frontend), a kockázati pontszám multiplier-alapú finomításával és kötelező frontend validációval.

## Phase 1: API Contract & Backend Logic
Az API szerződés frissítése és a kockázati logika implementálása a Java backendben.

**Files**: 
- `contracts/openapi/cobold-briefing-api.yaml`
- `backend/src/main/java/dev/workshop/demo/CoboldVsHeroController.java`

**Key changes**:
- `BriefingRequest`: új mezők hozzáadása a record-hoz (`targetEnvironment`, `implementationComplexity`, `teamExperience`).
- `riskScore(request: BriefingRequest): int`: logika bővítése multiplierekkel.
- OpenAPI schema: `BriefingRequest` objektum bővítése az új tulajdonságokkal.

**Verify**: `mise run be:test` (új teszt esetek hozzáadása a szorzók ellenőrzésére); manuális ellenőrzés Bruno-val (`mise run api:smoke`).

---

## Phase 2: BFF Data Propagation
Az új mezők átvezetése a NestJS BFF rétegen keresztül.

**Files**: 
- `bff/src/modules/briefing/briefing.dto.ts`
- `bff/src/modules/briefing/briefing.service.ts`

**Key changes**:
- `BriefingRequestDto`: interfész bővítése az új mezőkkel.
- `BriefingService.createBriefing(dto: BriefingRequestDto)`: adatok továbbítása a backend felé.

**Verify**: `mise run verify` (BFF build és tesztek); ellenőrzés, hogy a BFF transzformáció nélkül adja-e tovább az új mezőket.

---

## Phase 3: Frontend UI & Validation
Az új "Project Context" szekció és a validációs logika megvalósítása.

**Files**: 
- `frontend/src/app/app.ts`
- `frontend/src/app/app.html`

**Key changes**:
- `App` komponens: új szignálok (`targetEnvironment`, `implementationComplexity`, `teamExperience`).
- `isFormValid()`: új számított szignál vagy metódus a mezők meglétének ellenőrzésére.
- Template: `<fieldset>` hozzáadása legördülő listákkal és hibajelzéssel.

**Verify**: `ng test`; manuális teszt: a "Request briefing" gomb tiltva van, amíg az új mezők üresek.

---

## Phase 4: Integration & Automation
A teszt automatizációs suite frissítése az új képességekhez.

**Files**: 
- `testautomation/cobold_qa/client.py`
- `testautomation/tests/test_briefing_api.py`

**Key changes**:
- Python `CoboldClient`: `request_briefing` metódus frissítése.
- Integrációs tesztek: új tesztesetek, amelyek validálják a szorzók hatását a "signal" értékére.

**Verify**: `mise run api:testautomation`

---

## Testing Checkpoints
1. **Phase 1 után**: A backend API képes fogadni az új mezőket, és a pontszám változik a környezet/komplexitás függvényében.
2. **Phase 2 után**: A BFF hibátlanul továbbítja az új adatokat a backendnek.
3. **Phase 3 után**: Az űrlap vizuálisan megváltozott, és csak érvényes (kitöltött) állapotban küldhető el.
4. **Phase 4 után**: A teljes integrációs folyamat automatizáltan tesztelt és zöld.
