# AI Project Guide

## Syfte

Den här filen är huvudstyrning för AI-assistenter i detta 1DV613-projekt. Läs den före kodändringar, dokumentation, issues, MR-beskrivningar och större beslut.

## Projektidentitet

* Projekt: LeTrend Mobile, även kallat The TikTok Catalyst.
* Produkt: React Native och Expo-app för template-baserad videoredigering.
* Målgrupp: restauranger, caféer, barer och andra serviceverksamheter.
* Kärnvärde: användaren ska kunna skapa TikTok-anpassade videor snabbare genom ett styrt template-flöde.
* Språk: svenska i issues, testfall, Wiki, MR-beskrivningar och ai-context. Engelska i kodbasen och tekniska termer där de är naturliga.

## Viktigaste systemflöde

`TikTok-reference -> upstream AI/API -> Template-JSON -> EditSession -> Editor UI -> Preview/Timeline -> Compile-payload -> compile-server -> FFmpeg-renderad MP4 -> export/save/open`

## Scope

Mobilappen ska:

* importera och validera JSON-templates
* visa projektöversikt
* hantera projektnamn och radering
* låta användaren välja egna MP4-klipp per scen
* kräva godkända scenklipp innan compile
* visa och redigera text, effects, transitions och ljudvärden från templaten
* bygga compile-payload
* visa exportstatus och actions för open, download och save

Mobilappen ska inte:

* analysera TikTok-videor själv
* köra FFmpeg lokalt
* bygga upstream AI-backend
* blanda deploymentarbete med editorlogik

Compile-servern ska:

* ta emot compile-payload
* validera payload
* stödja placeholder-läge för snabb testning
* stödja FFmpeg-läge för renderad output
* läsa egna uppladdade scenvideor från upload-volymen i deployed miljö
* hantera text, scene effects, transitions, originalvolym och musik på MVP-nivå
* returnera en användbar referens till färdig video

## Teknik

* App: React Native, Expo, TypeScript, Expo Router.
* State: Zustand.
* Video: `expo-video`.
* Media: `expo-image-picker`, `expo-media-library`, `expo-file-system`, `expo-document-picker`.
* Clipboard: `expo-clipboard`.
* Tester app: Jest och `@testing-library/react-native`.
* Compile-server: Node.js, Express, TypeScript, Zod, FFmpeg, FFprobe, Vitest.
* Deployment: Docker, Docker Compose, Caddy, GitLab CI/CD och Cumulus.

## Arbetsmetodik

Standardflöde för ny issue:

```bash
git status
git switch main
git pull
git switch -c <issue-number-short-branch-name>
```

Efter implementation:

```bash
git status
git diff
```

Commit och push föreslås först när relevant verifiering är gjord.

## GitLab-historik via CSV

Abbas bifogar ofta en CSV-export med samlade GitLab work items, till exempel:

`1dv613-student-af223qz-workspace-my-1dv613-project_work_items_2026-06-03.csv`

CSV-filen ger historik över tidigare issues och testfall och hjälper AI förstå var projektet befinner sig i utvecklingsprocessen. Den kan även innehålla status, estimat, spenderad tid och kopplingar mellan arbetsobjekt.

AI ska använda CSV-exporten som historisk kontext, men kontrollera den mot aktuell konversation, aktuell kodbas, terminaloutput och nyare GitLab-information. En äldre export får inte behandlas som aktuell sanning om senare information finns.

## CI/CD och Cumulus

Detta är projektets faktiska deploymentmodell:

* GitLab CI/CD bygger och verifierar projektet.
* GitLab runner styr Docker på Cumulus via Docker context över SSH.
* Cumulus är körmiljö för containrar, inte arbetskatalog för koden.
* Koden ska inte klonas eller redigeras manuellt på Cumulus.
* App, compile-server och Caddy körs som separata services i Docker Compose.
* Deploy till produktion görs via GitLab-jobbet `deploy_production`.
* Deployment-jobbet är manuellt och körs först när verify och build är gröna.

Viktig princip:

`local branch -> MR -> main -> GitLab verify -> GitLab build images -> manual deploy_production -> Cumulus containers`

AI ska inte föreslå att man går in på Cumulus och letar efter repo-koden. Om Cumulus-servern ser tom ut är det normalt i detta upplägg.

## Verifiering

För appen:

```bash
cd tiktok-video-editor-app
npm run lint:fix
npm run verify
```

För compile-servern:

```bash
cd compile-server
npm run lint:fix
npm run verify
```

För dokumentation:

```bash
git status
git diff
```

Deploymentrelaterade ändringar kräver dessutom relevant Docker-, GitLab- eller Cumulus-verifiering.

## Definition of Done

En ändring är inte klar förrän den är:

* kopplad till issue
* verifierad mot acceptanskriterier
* testad manuellt och automatiskt där det behövs
* granskad med `git diff`
* fri från secrets och skräpfiler
* möjlig att förklara i MR, Wiki eller iterationsrapport

## AI-regler

AI ska:

* börja från aktuell kodbas och aktuell branch
* använda issue, testfall och acceptanskriterier som styrning
* föreslå små ändringar med tydligt scope
* vara skeptisk mot stora refaktoriseringar
* inte låsa issues till implementation om beteendet är det viktiga
* skriva kompletta ersättningsfiler när Abbas ber om kod
* föreslå verifiering innan commit och push
* erkänna osäkerhet när underlaget inte räcker

AI ska inte:

* hitta på filer, branches eller serverstruktur
* blanda gamla issues med nya
* föreslå terminalsteg på Cumulus när stegen ska köras lokalt
* committa `.env`, nycklar, certifikat eller genererade buildfiler
* påstå att något är klart bara för att pipeline är grön

## Viktiga ai-context-filer

Läsordning:

1. `AI_PROJECT_GUIDE.md`
2. `ai-context/00_project_rules.md`
3. `ai-context/01_abbas_project_context.md`
4. `ai-context/04_architecture.md`
5. `ai-context/05_gitlab_workflow.md`
6. `ai-context/13_cicd_deployment_context.md` vid CI/CD, Docker eller Cumulus
7. `ai-context/08_study_guide_context.md` vid betyg, G/VG, examination eller slutleverans
8. `ai-context/12_wiki_context.md` vid Wiki, rapporter och dokumentation

## Högsta prioritet vid konflikt

När källor säger olika saker gäller denna ordning:

1. Abbas senaste instruktion i aktuell konversation.
2. Aktuell kodbas och terminaloutput.
3. GitLab issues, testfall, MR-historik och senaste relevanta CSV-export.
4. Wiki och ai-context.
5. Kursmaterial och studieguiden.
6. Externa best practices och dokumentation.
