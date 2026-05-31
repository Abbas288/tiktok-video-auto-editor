# GEMINI Projektinstruktioner

## Syfte

Denna fil är huvudstyrning för Gemini i Abbas 1DV613-projekt. Läs den före kodändringar, dokumentation och större beslut.

## Projektidentitet

* Projekt: LeTrend Mobile, även kallat The TikTok Catalyst.
* Produkt: React Native och Expo-app för videoredigering i CapCut-liknande flöde.
* Målgrupp: restauranger, caféer, barer och andra serviceverksamheter.
* Kärnvärde: användaren ska kunna skapa TikTok-anpassade videos snabbare genom template-baserad redigering.
* Språk: svenska i issues, testfall, Wiki, MR-beskrivningar och ai-context. Engelska tekniska termer får användas när de är naturliga.

## Viktigaste systemflöde

TikTok URL -> upstream AI/API -> Template-JSON -> EditSession -> Editor UI -> Preview -> Compile-payload -> compile-server -> FFmpeg-renderad video -> export/save/open.

## Scope

Mobilappen ska:

* importera och validera JSON-templates
* visa projektöversikt
* hantera projektnamn och radering
* låta användaren välja egna MP4-klipp per scen
* kräva godkända scenklipp innan preview och compile där detta gäller
* visa och redigera text, effekter, transitions och ljudvärden från templaten
* skapa compile-payload
* visa exportstatus och actions för save/download/open

Mobilappen ska inte:

* analysera TikTok-videos själv
* köra FFmpeg lokalt
* bygga hagen AI-backend
* anta att `gs://` kan spelas direkt
* blanda deploymentarbete med editorlogik

Compile-servern ska:

* ta emot compile-payload
* validera payload
* stödja placeholder-läge för snabb testning
* stödja FFmpeg-läge för renderad output
* använda scenvisa videokällor där de finns
* hantera text, scene effects, transitions, originalvolym och musik så långt MVP:n stödjer
* returnera en användbar referens till färdig video

## Aktuell teknik

* App: React Native, Expo, TypeScript, Expo Router.
* State: Zustand.
* Video: `expo-video`.
* Media: `expo-image-picker`, `expo-media-library`, `expo-file-system`, `expo-document-picker`.
* Clipboard: `expo-clipboard`.
* Ikoner: `@expo/vector-icons`.
* Backend: Node, Express, TypeScript, Zod, FFmpeg.
* Test: Jest, jest-expo, React Native Testing Library, Vitest för compile-server.
* Arkitektur: Presentation, Application, Domain, Infrastructure.


## Wiki och dokumentationsstil

GitLab Wiki är en primär källa för Abbas process, stil och dokumentationsmönster. När uppgiften gäller Wiki, rapport, reflektion, demo, post mortem, testrapport eller ai-context ska Gemini läsa:

1. `ai-context/12_wiki_context.md`
2. `ai-context/wiki/wiki_source_summary.md`
3. relevant weekly- eller transcript-fil
4. originalkällan `mina_wikisidor_samlade(2).txt` endast vid behov

Ny Wiki-text ska vara kort, konkret och ärlig. Den ska koppla arbete till krav, testning, risker och lärdomar. Abbas stil är personlig i reflektioner och mer neutral i tekniska sidor.

## Fast Git-arbetsflöde

Innan ny implementation eller dokumentationsuppgift:

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

För appen:

```bash
cd tiktok-video-editor-app
npm run lint:fix
npm run verify
```

För compile-server:

```bash
cd compile-server
npm run lint:fix
npm run verify
```

Föreslå inte commit innan status, diff och relevant verifiering är gjorda.

## Branch, commit och MR

Standardkedja:

Issue -> Branch -> Implementation -> Verification -> Commit -> Push -> MR -> Merge -> main pull.

Commit-exempel:

```bash
feat: add template guide page
fix: separate export download and open actions
refactor: split project overview
docs: update ai context
```

MR-beskrivningar ska vara korta:

```text
## Sammanfattning
Kort beskrivning av vad MR ändrar och vilket beteende som bevaras.

## Kopplade issues
**Docs:** Closes #X
```

## Kodstandard

* Skriv komplett ersättningskod när Abbas ber om kod.
* Bevara befintliga kontrakt, exports och tester.
* Undvik implementation som låser issues till onödigt specifika interna lösningar.
* Använd `unknown` för okänd input och validera innan användning.
* Undvik `any`.
* Håll SoC och DRY.
* Flytta domänlogik från UI när filer blir stora.
* Lägg JSDoc på exporterade funktioner, viktiga typer, parserfunktioner, builderfunktioner, stores och komplex logik.
* Skriv inte JSDoc på triviala lokala detaljer.

## Teststandard

`npm run verify` är grundnivå för appen och betyder:

* lint
* typecheck
* test

Testa särskilt:

* Template-JSON-validering
* route-parametrar
* EditSession-state
* scene video readiness
* compile-payload
* save/download/open-export
* felhantering
* edge cases

## AI-regler

* AI-genererad kod måste granskas skeptiskt.
* Gemini får inte anta att kod fungerar för att den ser rimlig ut.
* Gemini ska prioritera liten verifierad MVP före stor osäker lösning.
* Gemini ska inte läsa stora originalfiler om en kompakt ai-context-fil räcker.
* Gemini ska inte blanda Abbas projekt med Ida, Wasim eller hagen-auto-edit.
* Hagen-auto-edit är inspiration, inte kravkälla.

## Kontextprioritet

Läs i denna ordning:

1. `GEMINI.md`
2. `ai-context/00_project_rules.md`
3. `ai-context/01_abbas_project_context.md`
4. `ai-context/04_architecture.md`
5. relevant fil i `ai-context/weekly/`
6. relevant fil i `ai-context/theory/`
7. `ai-context/08_study_guide_context.md` när uppgiften gäller kurskrav, betyg eller VG
8. relevant kompakt transkript
9. originalkälla via riktad sökning

## Viktiga filer

* `ai-context/08_study_guide_context.md`: komprimerad studieguidemappning mot G och VG.
* `ai-context/11_mvp_requirements.md`: MVP-krav och spårbarhet.
* `ai-context/12_wiki_context.md`: Wiki-stil, dokumentationsmönster och rapportlogik.
* `ai-context/10_source_map.md`: källor och när de ska användas.
* `ai-context/weekly/week_7_context.md`: CI/CD och QA-start.
* `ai-context/weekly/week_8_context.md`: automatiserad testning.
* `ai-context/weekly/week_9_10_context.md`: slutleverans, etik, presentation och överlämning.
