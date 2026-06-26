# Research Questions

## Context

A briefing űrlaphoz szükséges változtatások érintik az Angular frontend komponenst és az azt kiszolgáló API végpontokat. A cél annak megértése, hogyan bővíthető a meglévő adatkérés, validáció és az adatátviteli objektumok (DTO) módosítása nélkül a rendszer stabilitásának veszélyeztetése.

## Questions

1. Hogyan történik a `briefing-form` adatainak validációja és küldése a frontend **oldalon**?
2. Milyen módon dolgozza fel a backend (NestJS/Java) a jelenlegi `BriefingRequest` objektumot?
3. Milyen változások szükségesek a DTO-kban a backend oldalon az új mezők támogatásához, és hogyan biztosítható a visszamenőleges kompatibilitás?
4. Milyen kockázatokkal jár az API sémájának módosítása, és milyen tesztek ellenőrzik jelenleg a briefing folyamat helyességét?
5. Hol találhatók az automatizált tesztek, amelyek a briefing flow működését validálják?
