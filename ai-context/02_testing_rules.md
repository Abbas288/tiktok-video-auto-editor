# Testregler (02_testing_rules.md)

## Syfte

Denna fil styr hur Gemini ska hjälpa Abbas med testning, testplan, testfall, testsviter, testrapport, edge cases, regressionstestning och kravspårbarhet.

Gemini ska använda denna fil när den:
- skriver testfall
- granskar en implementation
- hjälper till med GitLab issues
- skriver Wiki, rapport eller testrapport
- föreslår commit
- avgör om en feature kan räknas som klar

## Grundprincip

Testning i Abbas projekt har två huvudmål:

- Validation testing: visa att appen löser rätt problem och uppfyller användarens behov.
- Defect testing: försöka hitta fel genom att provocera fram krascher, felaktiga tillstånd och edge cases.

Princip:

"Testing can only show the presence of errors, not their absence."

Det betyder att godkända tester aldrig bevisar att appen är felfri. De visar bara att den klarar de testade fallen.

## Testkedjan

Varje feature följer denna kedja:

Krav -> Acceptanskriterier -> Implementation -> Testfall -> Verifiering -> Dokumentation -> Commit

Gemini får inte hoppa direkt från implementation till commit.

## Testspecifikation

Varje större feature eller iteration ska kunna dokumenteras i en testspecifikation.

Testspecifikationen ska innehålla:
- Testplan: strategi, verktyg, vad som testas och vad som inte testas.
- Testsviter: grupper av testfall kopplade till krav eller features.
- Testfall: steg-för-steg-instruktioner med konkret testdata.
- Testrapport: testad version, miljö, resultat och kort analys.
- Kravspårbarhet: koppling mellan krav, issue, testfall, implementation och resultat.

## Testplan

Testplanen ska svara på:
- Vad testas?
- Varför testas det?
- Vilka krav täcks?
- Vilka delar testas inte ännu?
- Vilka verktyg används?
- Vilka manuella tester krävs?
- Vilka automatiska tester finns eller bör finnas?
- Vilka risker kvarstår?
- Vilken miljö används?
- Vem ansvarar för testningen?

För Abbas projekt ska testplanen alltid prioritera kärnflödet:

Template-JSON -> EditSession -> Editor UI -> Preview/Timeline -> Compile-payload

## Testsviter

Testsviter grupperar testfall.

Exempel för Abbas projekt:
- TC1.x: Navigation och Expo Router foundation.
- TC2.x: Template-JSON och parsing.
- TC3.x: EditSession och Zustand state.
- TC4.x: Timeline och scenval.
- TC5.x: Preview och videouppspelning.
- TC6.x: Text overlays.
- TC7.x: Transitions och effects.
- TC8.x: Audio och musik.
- TC9.x: Compile-payload och backend.
- TC10.x: Export och sparande.
- TC11.x: Felhantering och edge cases.
- TC12.x: Regressionstestning.

## TC-format

Varje testfall ska dokumenteras så här:

```md
### TCx.y Titel

**Kravkoppling:** användarkrav/systemkrav/funktionellt krav/icke-funktionellt krav  
**Förutsättning:** Startläge innan testet  
**Testdata:** Konkret data som används  
**Steg:**  
1. Steg ett  
2. Steg två  
3. Steg tre  

**Förväntat resultat:** Vad som ska hända  
**Faktiskt resultat:** Vad som hände  
**Status:** Pass/Fail  
**Kommentar:** Kort analys vid behov
```

## Konkret testdata

Testfall ska använda konkreta värden.

Skriv inte:
- "Välj ett projekt."
- "Ange felaktig input."

Skriv hellre:
- "Välj template `pizza-launch-2026` från listan."
- "Ange template id `missing-template-id` och kontrollera att appen visar felmeddelande utan krasch."

## Manuell testning

Manuell testning används för UX, flöde och beteende som inte alltid fångas bra med kodtester.

Exempel:
- Känns flödet logiskt?
- Är navigationen tydlig?
- Visas rätt template?
- Kraschar appen vid snabb navigering?
- Är timeline begriplig?
- Hoppar videon till rätt scen?
- Upplevs preview som stabil?
- Är felmeddelanden begripliga?

Manuell testning är extra viktig när video, mobil UX, Expo Go eller fysisk enhet ingår.

## Automatiska tester

Automatiska tester bör prioriteras för logik som är kritisk och repeterbar.

Prioriterade områden:
- `parseTemplate(json: unknown): Template`
- `buildEditSession(template: Template): EditSession`
- `useEditSession`
- scene selection
- scene ordering
- timing och duration
- overlay visibility logic
- compile-payload builder
- validation av required fields
- fallback för ogiltig Template-JSON

Gemini ska föredra rena funktioner i Domain och Application när den skapar testbar kod.

## Regressionstestning

Regressionstestning ska användas för att säkerställa att nya ändringar inte förstör befintliga funktioner.

Tre nivåer:
1. Retest all
   - Kör alla relevanta tester.
   - Hög säkerhet men kan vara tidskrävande.

2. Regression test selection
   - Kör tester kopplade till ändrad kod.
   - Effektivt för små features.

3. Prioritization of test cases
   - Kör viktigaste tester först.
   - Använd när tiden är begränsad.

I Abbas projekt ska regressionstestning prioriteras runt:
- navigation
- Template-JSON
- EditSession
- timeline
- preview
- compile-payload

Exempel:
- Ändring i `useEditSession` kräver regressionstest av template-laddning, editor-route och preview-route.
- Ändring i `src/types/template.ts` kräver TypeScript-kontroll och test av mockTemplate.
- Ändring i compile-payload kräver regressionstest av hela EditSession till compile-flödet.

## Negativ testning och edge cases

Gemini ska alltid föreslå minst ett negativt test när en feature hanterar input.

Viktiga edge cases:
- saknat template id
- ogiltigt template id
- tom `scenes` array
- scen med duration 0
- negativ duration
- överlappande scener
- text overlay utan text
- text overlay utanför skärmen
- trasig `sourceVideoUrl`
- saknad GCS-signerad URL
- nätverksfel
- compile-server nere
- API svarar med fel format
- väldigt många scener
- väldigt många text overlays
- snabb upprepad navigation
- appen öppnas direkt på editor-route utan session
- AI/API returnerar JSON som är rimlig men ofullständig

## Explorativ testning

Explorativ testning används när funktionaliteten är ny och osäker.

Gemini ska föreslå att Abbas:
- använder appen fritt i 10 till 20 minuter
- loggar exakt vad han gör
- gör om upptäckta buggar till TC-fall
- flyttar buggar till GitLab issues

## Användartester

Eftersom projektet har verklig företagsnytta bör användartester användas när ett flöde går att demonstrera.

Bra frågor:
- Förstår du vad denna vy används till?
- Är det tydligt vilken scen som är vald?
- Känns flödet snabbt nog?
- Saknas något för att kunna använda detta i verkligt redigeringsarbete?

Undvik vaga frågor som:
- "Är det bra?"

## Kravspårbarhet

Varje testfall måste kunna spåras till minst ett krav.

Spårbarhetskedja:

Krav -> Issue -> Testfall -> Implementation -> Resultat

Om testfall inte kan kopplas till krav är antingen testet för otydligt eller kravet för svagt.

## AI-risk och falsk trygghet

AI-genererad kod ska behandlas som misstänkt tills den är verifierad.

Risker:
- koden fungerar bara i happy path
- AI gissar dataformat
- AI blandar ihop projekt
- AI skapar kod som ser rätt ut men bryter arkitekturen
- AI producerar mer kod än Abbas hinner förstå

Motåtgärder:
- verifiering före volym
- små commits
- testfall före eller direkt efter implementation
- `git diff` före commit
- edge case-tänk
- dokumentera antaganden
- mocka externa tjänster när möjligt

## Testad version

När testresultat dokumenteras ska versionen identifieras.

Försök först:

```bash
git describe --tags --dirty
```

Om projektet saknar tags:

```bash
git rev-parse --short HEAD
git branch --show-current
```

Dokumentera även datum och testmiljö.

## Minimikrav innan commit

Innan commit ska följande vara sant:
- `git status` har kontrollerats.
- `git diff` har granskats.
- `npm run lint` har körts.
- `npx tsc --noEmit` har körts.
- Appen har startats med `npx expo start` om UI påverkas.
- Minst ett relevant manuellt testfall har passerat.
- Edge case har testats eller dokumenterats som kvarstående risk.
- Koden har JSDoc där det krävs.
- Inga debug-loggar eller skräpfiler följer med.

## Exempel: Expo Router foundation

### TC1.1 Home route renders project list

**Kravkoppling:** användarkrav, funktionellt krav  
**Förutsättning:** appen startar och mockTemplate finns  
**Testdata:** template id `pizza-launch-2026`  

**Steg:**
1. Starta appen.
2. Öppna home route.
3. Kontrollera att template visas.

**Förväntat resultat:** home route renderas utan krasch och användaren ser minst ett template.  
**Faktiskt resultat:** fylls i vid test.  
**Status:** Pass/Fail  
**Kommentar:** fylls i vid behov.

### TC1.2 Template can be loaded into EditSession

**Kravkoppling:** systemkrav, funktionellt krav  
**Förutsättning:** `useEditSession` och `mockTemplate` finns  
**Testdata:** template id `pizza-launch-2026`  

**Steg:**
1. Välj template på home.
2. Navigera till editor.
3. Kontrollera att EditSession innehåller template och scenes.

**Förväntat resultat:** sessionen innehåller korrekt template id och minst en scen finns i state.  
**Faktiskt resultat:** fylls i vid test.  
**Status:** Pass/Fail  
**Kommentar:** fylls i vid behov.

### TC1.3 Invalid template id is handled

**Kravkoppling:** icke-funktionellt krav  
**Förutsättning:** editor route kan öppnas med id  
**Testdata:** template id `missing-template-id`  

**Steg:**
1. Öppna editor med ogiltigt id.
2. Kontrollera att appen inte kraschar.

**Förväntat resultat:** användaren får fallback eller felmeddelande och appen kraschar inte.  
**Faktiskt resultat:** fylls i vid test.  
**Status:** Pass/Fail  
**Kommentar:** fylls i vid behov.
