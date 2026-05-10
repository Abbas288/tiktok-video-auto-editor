# Projektregler (00_project_rules.md)

## Syfte

Denna fil innehåller fasta regler för hur Gemini ska hjälpa Abbas i projektet. Reglerna gäller kodarbete, testning, JSDoc, feature-by-feature, GitLab och commit-disciplin.

Gemini ska använda denna fil när den:
- skriver eller ändrar kod
- föreslår arkitektur
- föreslår testning
- granskar diff
- hjälper Abbas inför commit
- bedömer om en feature är redo

## Grundregel

Kod är inte värdefull bara för att den finns. Kod är värdefull först när den är förstådd, kopplad till krav, testad och dokumenterad.

## Arbetsflöde för varje feature

Varje feature måste gå igenom följande kedja:

Krav -> Acceptanskriterier -> Implementation -> Testfall -> Verifiering -> Dokumentation -> Commit

Gemini får inte hoppa över testning eller dokumentation för att koden ser rimlig ut.

## Steg för steg

### 1. Krav och acceptanskriterier

- Identifiera användarkrav, systemkrav, funktionella krav och icke-funktionella krav.
- Kraven ska vara testbara, verifierbara och validerbara.
- Kraven ska kunna kopplas till issue, testfall och implementation.
- Om kravet är oklart ska Gemini markera osäkerhet i stället för att hitta på scope.

### 2. Implementation

- Implementera minsta möjliga ändring som löser aktuell feature.
- Skriv kirurgisk, idiomatisk TypeScript.
- Undvik stora omskrivningar om det inte är nödvändigt.
- Bygg inte flera features samtidigt.
- Anpassa lösningen till Abbas app, inte till Ida, Wasim eller hagen-auto-edit.

### 3. Dokumentation

- Använd enkel JSDoc för exporterade funktioner, viktiga typer, stores och komplex logik.
- Dokumentera beslut om arkitektur eller scope ändras.
- Uppdatera `08_current_feature_context.md` när aktuell feature ändras.
- Uppdatera Wiki eller ai-context om teststrategi, krav eller arkitektur påverkas.

### 4. Testfall

- Skapa eller uppdatera testfall enligt TC-format.
- Testa normalfall och edge cases.
- Koppla testfall till krav.
- Dokumentera faktiskt resultat, inte bara förväntat resultat.

### 5. Verifiering

Minimikontroller före commit:

```bash
npm run lint
npx tsc --noEmit
npx expo start
```

Före commit ska även detta kontrolleras:

```bash
git status
git diff
```

Om filer redan är staged:

```bash
git diff --staged
```

Om kommandon saknas eller inte kan köras ska Gemini dokumentera varför.

### 6. Commit

- Commit får bara föreslås när ändringarna är granskade och testade.
- Commit ska ha ett tydligt syfte.
- Commit ska inte blanda orelaterade ändringar.
- Untracked files måste granskas innan `git add .`.

## Arkitekturlager

### Presentation

Ansvar:
- React Native screens
- Expo Router routes
- UI-komponenter
- användarinteraktion

Exempel:
- `app/(home)/index.tsx`
- `app/(editor)/[id].tsx`
- `app/(preview)/[id].tsx`
- `app/_layout.tsx`

Presentation får inte innehålla tung affärslogik eller detaljer om externa API-format.

### Application

Ansvar:
- Zustand stores
- EditSession
- orkestrering mellan UI och domänlogik
- laddning av session
- vald scen
- state transitions
- användarens ändringar före compile

Exempel:
- `src/store/useEditSession.ts`
- framtida `src/application/`

Application får samordna flöden men ska inte innehålla tung UI-rendering eller låg nivå nätverkskod.

### Domain

Ansvar:
- TypeScript-typer
- Template-JSON-schema
- ren affärslogik
- validering
- parser och normalisering
- EditSession-builder
- CompilePayload-builder

Exempel:
- `src/types/template.ts`
- framtida `src/domain/parseTemplate.ts`
- framtida `src/domain/buildEditSession.ts`
- framtida `src/domain/buildCompilePayload.ts`

Domain ska vara så oberoende som möjligt från React Native och Expo.

### Infrastructure

Ansvar:
- API-klienter
- Supabase/GCS
- compile-server
- filsystem
- nätverk
- RenderApiClient
- signerade media-URL:er

Exempel:
- framtida `src/services/`
- framtida `src/infrastructure/`

Infrastructure ska kunna mockas så att tester inte kräver riktiga API-anrop.

## Kodstil

- Använd strikt TypeScript.
- Undvik `any`. Om input har okänd struktur, använd `unknown` och validera innan användning.
- Skriv små funktioner.
- Separera UI från logik.
- Skapa tydliga typer för Template, Scene, TextOverlay, Transition, Effect, Music, EditSession och CompilePayload.
- Lägg inte API-anrop direkt i UI om det kan kapslas in i service eller infrastructure-lager.
- Håll mockdata tydligt separerad från riktig datahämtning.
- Undvik global magi, dolda sidoeffekter och hårdkodade specialfall.
- Lägg aldrig secrets, tokens, Supabase-nycklar eller privata signerade länkar i repo.
- Ta bort debug-loggar före commit.
- Undvik scope creep.

## JSDoc-princip

JSDoc krävs för:
1. exporterade funktioner
2. viktiga typer och interface
3. Zustand stores
4. parserfunktioner
5. builderfunktioner
6. komplex logik
7. kod som är svår att förstå vid snabb läsning

JSDoc krävs inte för:
1. triviala komponenter
2. självförklarande lokala variabler
3. små interna hjälpfunktioner

## Testning och kvalitetssäkring

AI används för hastighet, men Abbas är arkitekt och granskare.

Gemini ska:
- skriva kod som Abbas kan förstå
- förklara risker när AI-genererad kod kan skapa falsk trygghet
- föreslå testning före commit
- undvika scope creep
- inte fylla i okända krav med egna gissningar
- fråga eller markera osäkerhet när krav är oklara
- föreslå mockning när externa services används
- hålla implementationer små och verifierbara

## Referensregler

- `hagen-auto-edit` får användas som teknisk inspiration.
- Kod från referensprojekt får inte kopieras blint.
- Ida och Wasim får användas som jämförelse och kursinspiration.
- Ida och Wasim får aldrig vara kravkälla för Abbas kod, arkitektur eller issues.

## Git-regler

Innan commit:

```bash
git status
git diff
npm run lint
npx tsc --noEmit
```

Om UI eller appstruktur påverkas:

```bash
npx expo start
```

Om filer redan är staged:

```bash
git diff --staged
```

## Klarhetsregel

En feature är inte klar bara för att:
- appen startar
- happy path fungerar
- AI säger att det ser bra ut
- TypeScript inte klagar
- UI ser rimligt ut

En feature är klar först när den är testad mot krav, förstådd av Abbas och dokumenterad.


## När Gemini ska stanna

Gemini ska stanna och fråga Abbas när:
- ett krav är oklart
- en ny dependency behövs
- en ändring påverkar arkitekturen mycket
- kod kräver credentials eller externa API-nycklar
- en lösning riskerar att hamna utanför MVP
- testresultat saknas men commit efterfrågas
