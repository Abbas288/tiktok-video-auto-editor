# Projektets historik och spårbarhet

Detta arkiv bevarar projektets arbetsobjekt, merge requests, kommentarer, systemhändelser och tidrapportering från GitLab.

| Del | Antal |
|---|---|
| Issues | 42 |
| Testfall | 117 |
| Krav | 12 |
| Nummerplatser | 14 |
| Merge requests, samtliga mergade | 37 |
| Användarkommentarer | 4 |
| Systemnoteringar | 1 449 |
| Tidposter | 40 |
| Registrerad tid | 106 timmar |
| Estimerad tid | 108 timmar 10 minuter |

## Arbetsobjekt

[Lista och läsversioner](work-items/README.md). Ursprungliga nummer 1–185 behålls genom 14 uttryckliga nummerplatser. Nummerplatserna återskapar ingen arbetsuppgift.

Samtliga arbetsobjekt är stängda i källan. Ursprunglig typ och status bevaras. Ett stängt testfall är inte automatiskt ett godkänt testresultat.

## Krav

De äldre kravnumren och work-itemnumren avser samma 12 krav. Varje krav förekommer en gång. Kraven är arkiverade; ingen kravtestrapport finns i det hämtade underlaget.

| Äldre kravnummer | Arbetsobjekt | Titel |
|---|---|---|
| 1 | [#173](https://github.com/Abbas288/tiktok-video-auto-editor/issues/173) | REQ-01: Projekt och templates |
| 2 | [#174](https://github.com/Abbas288/tiktok-video-auto-editor/issues/174) | REQ-02: Template-guide och AI-prompt |
| 3 | [#175](https://github.com/Abbas288/tiktok-video-auto-editor/issues/175) | REQ-03: Editor och scenöversikt |
| 4 | [#176](https://github.com/Abbas288/tiktok-video-auto-editor/issues/176) | REQ-04: Textöverlägg |
| 5 | [#177](https://github.com/Abbas288/tiktok-video-auto-editor/issues/177) | REQ-05: Effekter och övergångar |
| 6 | [#178](https://github.com/Abbas288/tiktok-video-auto-editor/issues/178) | REQ-06: Ljudkontroll |
| 7 | [#179](https://github.com/Abbas288/tiktok-video-auto-editor/issues/179) | REQ-07: Egna scenvideor |
| 8 | [#180](https://github.com/Abbas288/tiktok-video-auto-editor/issues/180) | REQ-08: Compile-payload |
| 9 | [#181](https://github.com/Abbas288/tiktok-video-auto-editor/issues/181) | REQ-09: Serverrendering |
| 10 | [#182](https://github.com/Abbas288/tiktok-video-auto-editor/issues/182) | REQ-10: Export |
| 11 | [#183](https://github.com/Abbas288/tiktok-video-auto-editor/issues/183) | REQ-11: Robust felhantering |
| 12 | [#184](https://github.com/Abbas288/tiktok-video-auto-editor/issues/184) | REQ-12: Verifiering och leverans |

## Merge requests

[Läs de 37 ursprungliga merge requests](merge-requests/README.md). Dessa är historikposter med originalbeskrivning, brancher, commitkopplingar och diskussioner; de är inte nya pull requests.

## Kommentarer och systemhistorik

De fyra användarkommentarerna bevaras separat och kan importeras som kommentarer. [Systemhistoriken](system-history/README.md) omfattar 1 449 händelser och hålls skild från användarkommentarerna. Originalens författare och datum anges; GitHubs vanliga API använder importkontot och importtidpunkten för nya objekt.

## Tidrapportering

[Läsbar CSV](timelogs.csv) och [JSON](timelogs.json) innehåller alla 40 tidposter med ursprunglig person, datum, sekunder och eventuell beskrivning. Arbetsobjektens estimat och tidssummor bevaras i respektive metadata. GitLab-systemnoteringar om tid är historik och ska inte summeras som ytterligare tidposter.

## Originaldata och kontroll

`source-data/` innehåller ursprungliga API-objekt och diskussioner. `mapping.json` mappar källobjekt och äldre kravnummer till måladresser. `import-manifest.json` beskriver de planerade GitHub-objekten och innehållens SHA-256-värden. `validation.json` och `checksums.json` beskriver kontrollresultat och arkivfiler.

Referenser till det egna projektet pekar på motsvarande GitHub-objekt eller MR-arkiv. Kodblock och inlinekod behåller originaltext. Referenser till andra projekt behåller sina egna mål. Källadresserna bevaras i originaldata och ursprungsmetadata.
