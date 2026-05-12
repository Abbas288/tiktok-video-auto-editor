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
- hjälper till med GitLab-spårbarhet

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
- Separera appfeature, dokumentation, test och deployment om de inte hör till samma issue.

### 3. Dokumentation

- Använd enkel JSDoc för exporterade funktioner, viktiga typer, stores och komplex logik.
- Dokumentera beslut om arkitektur eller scope ändras.
- Uppdatera `08_current_feature_context.md` när aktuell feature ändras.
- Uppdatera Wiki eller ai-context om teststrategi, krav eller arkitektur påverkas.
- Uppdatera deploymentdokumentation endast när aktuell issue gäller Docker, Cumulus, Nginx, Caddy eller Expo Web-export.

### 4. Testfall

- Skapa eller uppdatera testfall enligt TC-format.
- Testa normalfall och edge cases.
- Koppla testfall till krav.
- Dokumentera faktiskt resultat, inte bara förväntat resultat.
- När aktuell issue gäller routing eller template-id-stabilisering ska relevant edge case testas, till exempel TC-E1.
- När aktuell issue gäller Docker eller deployment ska relevanta TC-Dx-testfall testas.

### 5. Verifiering

Minimikontroller före commit:

```bash
npm run lint
npx tsc --noEmit
```

Om UI eller appstruktur påverkas:

```bash
npm start
```

När aktuell issue eller testfall kräver automatiska tester, eller när testkod ändras:

```bash
npm test
```

När aktuell issue uttryckligen gäller Expo Web eller deployment, till exempel `#35` eller `#40`:

```bash
npx expo export --platform web
docker compose build
docker compose up --build -d
docker compose ps
docker compose logs
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
- Deploymentfiler ska helst committas separat från editorlogik.
- Dokumentationsändringar ska helst committas separat om de inte direkt hör till samma feature.

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

### Deployment

Deployment är leveransform och driftkonfiguration, inte ett nytt lager i editorlogiken.

Ansvar vid deployment-issues:
- Expo Web-export
- statisk webbserver, exempelvis Nginx
- reverse proxy, exempelvis Caddy
- Dockerfile och Docker Compose
- Cumulus som kursens deploymentmiljö

Regler:
- Deployment får inte ändra appens kärnansvar.
- Expo Web-deployment är inte samma sak som native mobilrelease.
- FFmpeg ska inte flyttas till mobilappen.
- Secrets, `.env`, privata nycklar och certifikat får inte versionshanteras eller byggas in i imagen.
- Deploymentkommandon ska bara föreslås när aktuell issue faktiskt gäller deployment.

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
- Använd helper för route-parametrar när Expo Router kan returnera `string`, `string[]` eller `undefined`.

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
- föreslå `npm test` endast när aktuell issue eller testfall kräver automatiska tester, eller när testkod ändras
- föreslå `npx expo export --platform web` endast när aktuell issue gäller Expo Web eller deployment
- föreslå Docker Compose-testning endast när Dockerfiler eller deploymentkonfiguration påverkas

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

Om aktuell issue eller testfall kräver automatiska tester, eller testkod ändras:

```bash
npm test
```

Om UI eller appstruktur påverkas:

```bash
npm start
```

Om aktuell issue uttryckligen gäller Expo Web eller deployment:

```bash
npx expo export --platform web
docker compose build
docker compose up --build -d
```

Om filer redan är staged:

```bash
git diff --staged
```

## Branching och GitLab

- `main` ska hållas stabil.
- Använd kortlivade feature branches som standard.
- Branch ska vara kopplad till issue eller tydlig fix när det är möjligt.
- Git Flow är för tungt för Abbas projekt om det inte finns flera parallella releaser.
- Partnerövningar ska vara små, tidsboxade och fokusera på programförståelse, branching, MR och test.
- GitLab automation kan senare användas för lint, test, TypeScript, build och MR-kontroller.

## Klarhetsregel

En feature är inte klar bara för att:
- appen startar
- happy path fungerar
- AI säger att det ser bra ut
- TypeScript inte klagar
- UI ser rimligt ut
- Docker startar en container
- appen går att öppna lokalt en gång

En feature är klar först när den är testad mot krav, förstådd av Abbas och dokumenterad.

## När Gemini ska stanna

Gemini ska stanna och fråga Abbas när:
- ett krav är oklart
- en ny dependency behövs
- en ändring påverkar arkitekturen mycket
- kod kräver credentials eller externa API-nycklar
- en lösning riskerar att hamna utanför MVP
- testresultat saknas men commit efterfrågas
- Docker eller deployment riskerar att dra projektet bort från editor-MVP
- Git visar många orelaterade ändringar som inte kan förklaras
