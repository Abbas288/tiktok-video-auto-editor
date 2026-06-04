# Definition of Done (03_definition_of_done.md)

## Syfte

Denna fil definierar vad "klart" betyder i Abbas projekt. AI ska använda den innan den föreslår att en issue stängs, en commit görs eller en feature beskrivs som färdig.

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
- automatiska tester är körda om aktuell issue eller testfall kräver det, eller om testkod ändrats
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
- `npm test` har körts när aktuell issue eller testfall kräver automatiska tester, eller när testkod ändras

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
- route-parametrar normaliseras innan de styr state eller dataladdning

## DoD för deployment

Gäller bara issues som uttryckligen handlar om deployment, Docker, Cumulus, Expo Web, Nginx eller Caddy.

Deployment är klar när:
- syftet är tydligt kopplat till kurs, demo eller leveransform
- deployment inte ändrar appens kärnansvar
- Expo Web-export fungerar om webbdeployment används
- Docker build fungerar lokalt
- Docker Compose startar appen lokalt eller i vald miljö
- Cumulus eller motsvarande deployment är testad om det ingår i issue
- HTTP/HTTPS och reverse proxy är testade om Caddy eller Nginx används för detta
- `.dockerignore` hindrar onödiga filer från att hamna i imagen
- inga secrets, `.env`, certifikat eller privata nycklar ingår i Git eller image
- deployment är dokumenterad i Wiki, README eller ai-context
- relevanta testfall, till exempel TC-D1 till TC-D5, har status Pass eller tydlig kommentar

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
- untracked files är förstådda innan de läggs till

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
- AI inte har hittat på API-format utan källa
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
- appen startar i Expo med `npm start`
- TC1.1 till TC1.6 är genomförda eller dokumenterade
- `expo-video` får vara installerat utan att videospelaren räknas som implementerad

## DoD för route-stabilisering

Gäller bara issues som uttryckligen handlar om route-parametrar, template-id, editorstate eller stale state, till exempel `#42`.

Route-stabilisering är klar när:
- saknat template-id inte fastnar i loading
- ogiltigt template-id ger tydligt error state
- tidigare session rensas när template saknas eller inte hittas
- editor och preview hanterar route-parametrar konsekvent
- home visar tomt läge om templates saknas
- appen har körts med `npm start`
- `npx tsc --noEmit` passerar
- TC-E1 är dokumenterat som Pass eller Fail

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
- "Containern startar men appflödet är inte testat"
- "Deployment fungerar lokalt men är inte dokumenterad"

## Checklista före commit

- [ ] Kravet är tydligt.
- [ ] Acceptanskriterier finns.
- [ ] Implementation är begränsad till rätt scope.
- [ ] `npm run lint` har körts.
- [ ] `npx tsc --noEmit` har körts.
- [ ] `npm test` har körts om aktuell issue eller testfall kräver automatiska tester, eller om testkod ändras.
- [ ] `npm start` har körts om UI/appstruktur påverkas.
- [ ] `npx expo export --platform web` har körts om aktuell issue gäller Expo Web/deployment.
- [ ] Docker Compose-test har körts om deploymentfiler påverkas.
- [ ] Minst ett manuellt testfall har passerat.
- [ ] Edge case är testat eller dokumenterat.
- [ ] `git status` är granskat.
- [ ] `git diff` är granskat.
- [ ] `git diff --staged` är granskat om filer är staged.
- [ ] JSDoc finns där det krävs.
- [ ] Inga debug-loggar eller skräpfiler följer med.
- [ ] Inga secrets, `.env`, certifikat eller privata nycklar följer med.
- [ ] Abbas förstår ändringen.
