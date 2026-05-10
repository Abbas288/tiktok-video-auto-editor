# Definition of Done (03_definition_of_done.md)

## Syfte

Denna fil definierar vad "klart" betyder i Abbas projekt. Gemini ska använda den innan den föreslår att en issue stängs, en commit görs eller en feature beskrivs som färdig.

## Huvudregel

Inget är klart förrän det är:
- förstått
- kopplat till krav
- implementerat
- verifierat
- dokumenterat
- granskat i Git diff

Kod som existerar men inte är testad har inget bevisat värde.

## DoD för en feature

En feature är klar när:
- den löser ett tydligt krav
- kravtyp är identifierad: användarkrav, systemkrav, funktionellt krav eller icke-funktionellt krav
- acceptanskriterierna är uppfyllda
- implementationen är begränsad till rätt scope
- implementationen följer lagerarkitekturen
- relevanta manuella testfall har passerat
- automatiska tester finns eller är motiverat uppskjutna
- minst ett positivt test och ett relevant edge case är hanterat
- inga kända blockerande buggar återstår
- inga kända regressioner har introducerats
- dokumentation är uppdaterad vid behov
- Abbas förstår hur lösningen fungerar

## DoD för en GitLab issue

En GitLab issue får stängas när:
- issue har tydlig koppling till krav eller feature
- issue-beskrivningen matchar vad som faktiskt byggts
- acceptanskriterier är uppfyllda eller tydligt omförhandlade
- minst ett testfall är kopplat till issue
- testresultat är dokumenterade
- implementation är pushad eller redo för merge
- lint är grön
- TypeScript är grön
- faktisk arbetstid är rapporterad med `/spend`
- koden är committad på rätt branch
- commit-meddelandet är tydligt
- Wiki eller ai-context är uppdaterad om ändringen påverkar projektets dokumentation

## DoD för testning

Testningen är klar när:
- testfall följer TC-format
- testdata är konkret
- normalfall är testat
- minst ett relevant edge case är testat
- förväntat resultat är tydligt
- faktiskt resultat är dokumenterat
- status är dokumenterad som Pass eller Fail
- testet har kravkoppling
- regressionstest har körts om ändringen påverkar tidigare flöden
- testad version, branch eller commit är dokumenterad vid större testning
- testmiljö eller enhet är angiven när det påverkar resultatet

## DoD för dokumentation

Dokumentation är klar när:
- den speglar faktisk kod
- den är begriplig för Abbas vid standup
- den kan kopplas till krav, test eller beslut
- den är skriven på svenska
- tekniska termer är konsekventa
- den inte innehåller irrelevant kursmaterial
- den inte blandar Abbas projekt med Ida eller Wasim
- Wiki och ai-context är uppdaterade när arkitektur, teststrategi eller krav ändras

## DoD för kod

Kod är klar när:
- den är typad
- den undviker `any`
- den följer lagerarkitekturen
- UI och logik är separerade där det är rimligt
- externa beroenden ligger i Infrastructure eller isolerade services
- store-logik är begriplig och testbar
- exporterade funktioner, viktiga typer, stores och komplex logik har JSDoc
- debug-loggar är borttagna
- felhantering finns där det behövs
- filerna är små nog att förstå
- mockdata inte förväxlas med riktig API-data

## DoD för commit

En commit är klar när:
- committen har ett tydligt syfte
- inga orelaterade ändringar följer med
- `git status` är granskat
- `git diff` är granskat
- testning har gjorts
- commit-meddelandet följer konvention
- inga skräpfiler följer med
- inga hemligheter eller miljövariabler committas

Rekommenderat format:

```bash
git commit -m "feat: setup Expo Router foundation"
```

## DoD för AI-genererad kod

AI-genererad kod får bara accepteras om:
- Abbas förstår vad koden gör
- koden passar projektets lagerarkitektur
- koden är kopplad till krav eller issue
- minst ett testfall verifierar normalfallet
- minst ett edge case har testats eller dokumenterats
- antaganden är dokumenterade
- koden inte introducerar onödigt scope creep
- Gemini inte har hittat på API-format utan källa
- koden är granskad med `git diff`

AI-genererad kod som bara ser rätt ut men inte är verifierad ska behandlas som ofärdig.

## DoD för aktuell Expo Router foundation

Den aktuella grunden är klar när:
- home route renderas
- editor route öppnas med template id
- preview route öppnas med template id
- `mockTemplate` kan laddas
- `useEditSession` kan hålla vald template
- `src/styles/theme.ts` kompilerar
- `src/types/template.ts` kompilerar
- TypeScript kompilerar
- lint passerar
- appen startar i Expo
- TC1.1 till TC1.6 är genomförda eller dokumenterade
- `expo-video` får vara installerat utan att videospelaren räknas som implementerad

## Vad som inte får räknas som klart

Följande är inte tillräckligt:
- "Det borde fungera"
- "AI säger att det är rätt"
- "Det ser bra ut i UI"
- "TypeScript klagar inte"
- "Jag testade en gång snabbt"
- "Happy path fungerar"
- "Koden finns men är inte kopplad till krav"
- "Testning görs senare"

## Checklista före commit

- [ ] Kravet är tydligt.
- [ ] Acceptanskriterier finns.
- [ ] Implementation är begränsad till rätt scope.
- [ ] `npm run lint` har körts.
- [ ] `npx tsc --noEmit` har körts.
- [ ] `npx expo start` har körts om UI/appstruktur påverkas.
- [ ] Minst ett manuellt testfall har passerat.
- [ ] Edge case är testat eller dokumenterat.
- [ ] `git status` är granskat.
- [ ] `git diff` är granskat.
- [ ] JSDoc finns där det krävs.
- [ ] Inga debug-loggar eller skräpfiler följer med.
- [ ] Abbas förstår ändringen.
