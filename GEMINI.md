# GEMINI Projektinstruktioner

## Syfte

Denna fil är huvudstyrningen för Gemini CLI i Abbas projekt. Den ska läsas före större originalfiler och före kodändringar.

Gemini ska använda filen när den:
- ska skriva eller ändra kod
- ska skapa dokumentation
- ska föreslå tester
- ska hjälpa med GitLab
- ska avgöra om en feature kan committas
- behöver förstå projektets tekniska scope

## Projektidentitet

- Huvudprojekt: Abbas projekt "LeTrend Mobile" eller "The TikTok Catalyst".
- Produkt: mobilapp för automatisk videoredigering i CapCut-stil.
- Målgrupp: serviceverksamheter, särskilt restauranger, caféer och barer.
- Kärnvärde: spara tid och hjälpa verksamheter skapa TikTok-anpassat videoinnehåll utan tung manuell redigering.
- Språk: all dokumentation, projektkontext, testfall och Wiki-text ska skrivas på svenska.
- Tekniska termer får behållas på engelska när det är naturligt: Template-JSON, EditSession, Expo Router, Zustand, FFmpeg, Supabase, GCS, CI/CD och TypeScript.

## Viktigaste produktflödet

TikTok URL -> AI/API video analysis -> Template-JSON -> EditSession -> Editor UI -> Preview/Timeline -> Compile-payload -> backend/compile-server -> Rendered video via FFmpeg

## AI/API-scope

- AI/API-flödet är upstream från mobilappen.
- Användaren eller systemet matar in en specifik TikTok-URL.
- En AI/API analyserar den specifika videons redigeringsmönster.
- API:t returnerar strukturerad JSON-data.
- Mobilappen analyserar inte TikTok-videon direkt.
- Mobilappen konsumerar Template-JSON, bygger EditSession och visar editorflödet.
- Mobilappen skapar compile-payload.
- Backend/compile-server utför faktisk rendering via FFmpeg.
- Syftet är att härma redigeringsformat, struktur och stil, inte att kopiera originalvideons innehåll rakt av.

## Deployment-scope

Docker, Docker Compose, Nginx, Caddy, Expo Web-export och Cumulus gäller bara när aktuell issue uttryckligen handlar om deployment eller release, till exempel `#35` eller `#40`.

Vid vanlig apputveckling ska Gemini inte föreslå Docker-kommandon, Expo Web-export eller deployment-testning om issue inte kräver det.

Deployment i Abbas projekt betyder webbdeployment eller framtida backend/compile-server. Det betyder inte native mobilrelease och det får inte ändra mobilappens kärnansvar.

## Kärnmandat

1. Bygg strikt en feature i taget.
2. Koppla varje feature till krav, acceptanskriterier och testfall.
3. Ingen feature är klar utan verifiering.
4. AI-genererad kod får aldrig antas fungera.
5. Kontrollera edge cases, felhantering och affärslogik.
6. Läs `ai-context/` före stora originalfiler.
7. Ida, Wasim och `hagen-auto-edit` är inspiration, inte kravkälla för Abbas implementation.
8. Implementera inte ny feature när uppgiften bara gäller dokumentation.
9. Föreslå inte commit innan testning och diff-granskning är gjord.

## Kravmodell

Projektet skiljer mellan:
- användarkrav
- systemkrav
- funktionella krav
- icke-funktionella krav

Krav ska vara:
- testbara
- verifierbara
- validerbara
- spårbara till issue
- spårbara till testfall
- spårbara till implementation

## Teknisk standard

- App: React Native, Expo, TypeScript, Expo Router.
- State: Zustand.
- Video: `expo-video`.
- Backend och rendering: backend/compile-server med FFmpeg.
- Data: Template-JSON från upstream AI/API och eventuellt Supabase/GCS.
- Arkitektur: Presentation, Application, Domain, Infrastructure.
- JSDoc krävs för:
  1. exporterade funktioner
  2. viktiga typer och interface
  3. Zustand stores
  4. parserfunktioner
  5. builderfunktioner
  6. komplex logik
  7. kod som är svår att förstå vid snabb läsning
- JSDoc krävs inte för:
  1. triviala komponenter
  2. självförklarande lokala variabler
  3. små interna hjälpfunktioner
- TypeScript: undvik `any`. Använd `unknown` för okänd input och validera innan användning.
- Tamagui används inte. Presentation-lagret består av React Native-komponenter, screens och Expo Router-routes.
- `gs://`-adresser kan normalt inte spelas direkt i mobilen. Använd signerad eller servergenererad URL när video ska spelas i appen.
- FFmpeg ska inte köras i mobilappen. Tung rendering sker i backend/compile-server.

## Navigering i kodbas

- Appkod: `./tiktok-video-editor-app/`
- Routes: `app/(home)`, `app/(editor)`, `app/(preview)`
- Root layout: `app/_layout.tsx`
- Theme: `src/styles/theme.ts`
- Template-typer: `src/types/template.ts`
- Mockdata: `src/data/mockTemplate.ts`
- Session-state: `src/store/useEditSession.ts`

## Arbetsordning för kod

1. Läs relevant ai-context-fil.
2. Identifiera aktuell issue eller feature.
3. Kontrollera krav och acceptanskriterier.
4. Implementera minsta möjliga ändring.
5. Testa enligt issue och testfall.
6. Vid vanlig Expo-verifiering används `npm start`.
7. Uppdatera relevant ai-context eller Wiki vid behov.
8. Kör `git status` och `git diff`.
9. Föreslå commit först när verifiering är gjord.

## Verifiering

Standardkontroller före commit:

```bash
npm run lint
npx tsc --noEmit
git status
git diff
```

Om UI eller appstruktur påverkas:

```bash
npm start
```

Om aktuell issue eller testfall kräver automatiska tester, eller om testkod ändras:

```bash
npm test
```

Om aktuell issue uttryckligen gäller Expo Web eller deployment, till exempel `#35` eller `#40`:

```bash
npx expo export --platform web
docker compose build
docker compose up --build -d
```

Om filer redan är staged:

```bash
git diff --staged
```

## Commit-standard

Använd tydliga commits:

```bash
feat: setup Expo Router foundation
fix: handle missing template id
test: add manual test cases for template loading
docs: update current feature context
refactor: separate template parsing from UI
style: adjust editor screen spacing
```

## Kontextprioritet

När Gemini behöver projektkontext ska den läsa i denna ordning:

1. `GEMINI.md`
2. relevanta filer i `ai-context/`
3. relevant teorifil i `ai-context/theory/`
4. relevant veckofil i `ai-context/weekly/`
5. relevant kompakt transkript i `ai-context/transcripts/`
6. originalkällor via riktad sökning

Gemini ska inte läsa stora originalfiler som permanent arbetskontext om en kompakt ai-context-fil räcker.

## Förbud

Gemini får inte:
- implementera ny feature när uppgiften bara gäller dokumentation
- ändra appkod utan uttrycklig instruktion
- skapa stora sammanfattningsfiler
- läsa in alla originalfiler som permanent arbetskontext
- blanda ihop Abbas projekt med Ida eller Wasim
- påstå att något är klart utan testning
- föreslå commit utan att först kontrollera test och diff
- skriva att appen kopierar TikTok-videos i juridisk mening
- lägga secrets, tokens, Supabase-nycklar, API-nycklar, `.env` eller privata signerade länkar i repo
- blanda deploymentarbete med editorlogik om de inte hör till samma issue
