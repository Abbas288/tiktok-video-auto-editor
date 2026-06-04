# LeTrend Mobile

LeTrend Mobile är en template-baserad videoredigeringsapp byggd i React Native, Expo och TypeScript. Projektet utvecklas i kursen 1DV613 med fokus på krav, testning, versionshantering, CI/CD, driftsättning och en spårbar utvecklingsprocess.

## Vad appen gör

Appen låter användaren skapa eller importera ett videoprojekt från en Template-JSON, lägga till egna scenvideor, justera text, effekter, transitions och ljud, och skicka en compile-payload till en separat compile-server som renderar en MP4 med FFmpeg.

Kärnflöde:

```text
Template-JSON -> Project overview -> Editor -> Scene videos -> Preview/Timeline -> Compile-payload -> Compile-server -> FFmpeg -> Rendered MP4
```

## Viktig avgränsning

Mobilappen analyserar inte TikTok-videor själv och kör inte FFmpeg lokalt. Upstream AI/API och långsiktig molnlagring ligger utanför MVP:n. Appen konsumerar Template-JSON och låter användaren skapa en färdig video utifrån den.

## Teknik

| Del | Teknik |
|-----|--------|
| Mobilapp och webbapp | React Native, Expo, TypeScript, Expo Router |
| State | Zustand |
| Video och media | expo-video, expo-image-picker, expo-media-library, expo-file-system |
| Tester app | Jest, @testing-library/react-native |
| Compile-server | Node.js, Express, TypeScript, Zod |
| Rendering | FFmpeg och FFprobe |
| Deployment | Docker, Docker Compose, Caddy, GitLab CI/CD, Cumulus |

## Projektets kärnstruktur

```text
/
├── AI_PROJECT_GUIDE.md        # huvudstyrning för AI-assistenter
├── ai-context/                # kompakt projekt-, kurs- och arbetskontext
├── compile-server/            # backend som validerar payload och renderar MP4
├── tiktok-video-editor-app/   # Expo och React Native-app
├── .gitlab-ci.yml             # CI/CD-pipeline
└── README.md
```

## Förutsättningar

För lokal utveckling behövs:

* Node.js och npm
* FFmpeg och FFprobe när compile-servern körs i `ffmpeg`-läge
* Docker Desktop när Docker Compose eller container-build ska testas

## Lokal konfiguration

Skapa `tiktok-video-editor-app/.env.local` när appen ska använda den lokala compile-servern:

```env
EXPO_PUBLIC_COMPILE_SERVER_URL=http://localhost:3030
```

Exempel på lokal `compile-server/.env`:

```env
PORT=3030
COMPILE_PUBLIC_BASE_URL=http://localhost:3030
COMPILE_RENDERER=ffmpeg
COMPILE_PLACEHOLDER_VIDEO_URL=
COMPILE_OUTPUT_DIR=.compiled
COMPILE_TEMP_DIR=
COMPILE_UPLOAD_DIR=.uploads
COMPILE_FFMPEG_PATH=ffmpeg
COMPILE_FFPROBE_PATH=ffprobe
COMPILE_RENDER_TIMEOUT_MS=120000
COMPILE_FONT_FILE=
COMPILE_CLEANUP_TEMP_FILES=false
```

Lokala `.env`-filer ska inte committas.

## Kör compile-server lokalt

```bash
cd compile-server
npm install
npm run dev
```

## Kör appen lokalt

```bash
cd tiktok-video-editor-app
npm install
npm start
```

## Verifiering

App:

```bash
cd tiktok-video-editor-app
npm run lint:fix
npm run verify
```

Compile-server:

```bash
cd compile-server
npm run lint:fix
npm run verify
```

`npm run verify` kör lint, TypeScript-kontroll och tester.

## CI/CD och deployment

Cumulus kör containrar. GitLab CI/CD verifierar projektet, bygger Docker-images och startar produktionstjänsterna.

Faktiskt flöde:

```text
MR -> verify jobs -> merge to main -> verify jobs -> build Docker images -> manual deploy_production -> Cumulus containers
```

Verify-jobben körs för både appen och compile-servern. Efter merge till `main` körs verifieringen igen innan Docker-images byggs för webappen, compile-servern och Caddy. Jobbet `deploy_production` startas manuellt och styr Docker på Cumulus via Docker context över SSH.

Appen kan hittas i följande URL (bara en utvald grupp inom LNU har tillgång till Cumulus):

```
https://cu1223.camp.lnu.se/
```

Viktigt:

* Cumulus är körmiljö för containrar, inte arbetskatalog för koden.
* `.env`, SSH-nycklar, certifikat och andra secrets ska inte committas.
* `EXPO_PUBLIC_COMPILE_SERVER_URL` är publik klientkonfiguration för Expo Web-builden.
* Compile-servern använder `/api` via Caddy i deployed miljö.
* Uppladdade scenvideor och renderade filer lagras i separata Docker-volymer.

## Git-arbetsflöde

Projektet använder kortlivade branches kopplade till issues.

```bash
git status
git switch main
git pull
git switch -c <issue-number-short-branch-name>
```

Efter ändring:

```bash
git status
git diff
```

Commit och push görs först när relevant verifiering har passerat.

## Dokumentation och spårbarhet

Wiki beskriver projektets krav, testning, iterationer, arkitektur, risker och beslut. Kravsidan hålls kondenserad. Issues innehåller mer detaljerat syfte, acceptanskriterier, kopplade testfall, testtäckning och checklista.

Spårbarhetskedjan är:

```text
Krav -> GitLab issue -> acceptanskriterier -> testfall -> implementation -> MR -> resultat
```

Katalogen `ai-context/` ger kompakt projektkontext för utvecklingsarbete. Den ersätter inte aktuell kodbas, GitLab-issues eller Wiki.

## Definition of Done

En ändring är redo för merge först när den är:

* kopplad till rätt issue
* verifierad mot acceptanskriterier
* testad med relevanta manuella och automatiska tester
* granskad med `git diff`
* fri från secrets och skräpfiler
* dokumenterad där ändringen påverkar krav, arkitektur, testning eller arbetsflöde

## Kända begränsningar

* Upstream AI/API och långsiktig molnlagring ligger utanför MVP:n.
* Preview och slutlig FFmpeg-rendering är inte "pixel-perfect" lika.
* Exportbeteende skiljer sig mellan webb och mobil.
* Compile-servern är en avgränsad MVP-renderare, inte en fullständig videoredigeringsplattform.

## Projektets mål

Målet är inte att bygga en fullständig ersättare för en kommersiell videoredigerare. Målet är att visa ett litet men sammanhängande och verifierbart system där Template-JSON, editorstate, egna scenvideor, preview, compile och export fungerar som ett tydligt E2E-flöde.
