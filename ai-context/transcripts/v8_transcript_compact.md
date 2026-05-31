# Kompakt transkript vecka 8

## MÅSTE FÖLJAS

* Tester ska köras automatiskt där det är rimligt.
* Tester ska inte bara bekräfta happy path.
* Edge cases och feldata ska testas.
* Testkod ska vara begriplig.
* `npm run verify` är en viktig quality gate i Abbas projekt.

## BRA FÖR RAPPORT

Vecka 8 visar hur automatiserad testning stärker projektets trovärdighet. Tester kan delas upp i unit, integration och systemnivå. Alla delar behöver inte vara perfekta, men kritisk logik ska verifieras.

AAA-mönstret är bra för tydliga tester:

1. Arrange.
2. Act.
3. Assert.

## BRA FÖR MUNTLIG REDOVISNING

För Abbas projekt är starka exempel:

* parseTemplate som stoppar defekt AI/API-data
* scene video readiness
* compile-payload
* template repository
* save/download/open
* Zustand state och immutabla uppdateringar

## BAKGRUND

Node/Express/Jest-exemplet är pedagogiskt. Det visar hur en liten funktion och en endpoint testas automatiskt. Abbas projekt är större, men principen är samma: separera testbar logik från UI och verifiera den automatiskt.
