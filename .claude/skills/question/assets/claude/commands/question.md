---
description: Feladat bontása semleges kutatási kérdésekre
model: claude-legroom-gemini-3-1-flash-lite
argument-hint: "<feladatleírás, ticket fájl, issue URL vagy thoughts/<id>/ könyvtár>"
---

# Question - Semleges kutatási kérdések

Alakítsd a feladatot 3-7 konkrét, semleges kutatási kérdéssé. Ezeket a
következő fázisban a `/research` fogja megválaszolni külön kontextusban, a
feladat céljának ismerete nélkül.

## Input

A felhasználó feladatleírást, ticket fájlt, issue linket vagy artifact könyvtárat
ad meg.

Ha `$ARGUMENTS` könyvtár, olvasd el belőle a `task.md` és `route.md` fájlokat,
ha léteznek, és ugyanazt a könyvtárat használd tovább.

## Folyamat

1. Olvasd el teljesen a kapott fájlokat vagy szöveget.
2. Ha van `route.md`, tartsd tiszteletben a kategóriát, modellt, effortot,
   explicit non-goalokat és ajánlott útvonalat.
3. Indíts `codebase-locator` agentet könnyű feltérképezésre. A cél az, hogy a
   kérdések a releváns fájlokra, komponensekre és folyamatokra irányuljanak.
4. Írj 3-7 kutatási kérdést:
   - minden kérdés másik codebase-területet vagy kockázatot célozzon;
   - a kérdések ténykeresők legyenek;
   - ne kérdezz megoldási javaslatot vagy preferált implementációt;
   - részesítsd előnyben a "hogyan működik most" és "hol van definiálva"
     típusú kérdéseket.

   Jó példa: "Hogyan kezeli a BFF a Cobold briefing kérést, és hol történik a
   backend hívás?"

   Rossz példa: "Mi lenne a legjobb módja egy új Cobold endpoint hozzáadásának?"

5. Határozd meg az artifact könyvtárat:
   - ticket esetén: `thoughts/PROJ-1234-rovid-leiras/`;
   - ticket nélkül: `thoughts/YYYY-MM-DD-rovid-leiras/`;
   - meglévő artifact könyvtár esetén: használd azt.
6. Hozd létre a könyvtárat, ha nem létezik.
7. Írd meg a `task.md` fájlt 2-3 mondatban: mit kell elérni és miért.
8. Írd meg a `questions.md` fájlt:

   ```markdown
   # Research Questions

   ## Context
   [2-3 mondat arról, mely codebase-területeket kell kutatni. Ne írd le, mit
   építünk vagy mi a kívánt megoldás.]

   ## Questions
   1. [Semleges, ténykereső kérdés]
   2. [Semleges, ténykereső kérdés]
   ```

9. Mutasd meg a kérdéseket a felhasználónak, és várj jóváhagyásra vagy
   módosításra.

## Kimenet

- Létrehozott vagy frissített könyvtár: `thoughts/<id>/`
- Fájlok: `thoughts/<id>/task.md`, `thoughts/<id>/questions.md`
- Mondd meg: `Következő lépés: /research thoughts/<id>/`

## Szabályok

- A `questions.md` nem tartalmazhatja a feladat célját, a kívánt viselkedést
  vagy a megoldási irányt.
- A researcher a `questions.md` alapján ne tudja kitalálni, milyen feature-t
  építünk.
- Minden kérdés legyen konkrét és kutatható a codebase-ben.
- Ha a feladat túl kicsi 3 kérdéshez, mondd ki, hogy a teljes workflow túl nagy.
