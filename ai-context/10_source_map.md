# Källkarta

## Syfte

Denna fil visar vilka källor Gemini ska använda och i vilken ordning.

## Prioritet

När källor säger olika saker gäller denna ordning:

1. Abbas aktuella krav, issues och repo.
2. Abbas egen Wiki.
3. Aktuell kodbas från uppladdade filer eller inklistrad kod.
4. Kursens officiella material och studieguiden.
5. Kompakta transkript och sammanfattningar.
6. Hagen-auto-edit som teknisk inspiration.
7. Ida och Wasim som jämförelse och inspiration, inte teknisk kravkälla.

## Huvudkällor

### `GEMINI.md`

Huvudstyrning. Läs först.

### `ai-context/00_project_rules.md`

Projektregler, Git-flöde, verifiering och issue-disciplin.

### `ai-context/01_abbas_project_context.md`

Produkt, målgrupp, MVP, scope och begränsningar.

### `ai-context/04_architecture.md`

Arkitektur, lager, compile-server och dataflöde.

### `ai-context/06_course_requirements.md`

Kurskrav, veckoteman, QA, CI/CD, etik och slutleverans.

### `ai-context/08_study_guide_context.md`

Komprimerad studieguidemappning. Använd vid G/VG, examination, kurskrav, betyg, slutleverans och Wiki-kontroll.

### `ai-context/11_mvp_requirements.md`

Kravmodell för aktuell MVP.

### `ai-context/12_wiki_context.md`

Wiki-stil, dokumentationsmönster, rapportlogik och hur nya Wiki-utkast ska skrivas.

## Kodbas

Det finns ingen permanent codebase snapshot-fil. Aktuell kodbas ska hämtas från:

* användarens uppladdade kodsamling
* inklistrade filer i chatten
* terminaloutput
* aktuell branch-status

Viktiga kodområden:

* `tiktok-video-editor-app/app/`
* `tiktok-video-editor-app/src/application/`
* `tiktok-video-editor-app/src/components/`
* `tiktok-video-editor-app/src/domain/`
* `tiktok-video-editor-app/src/infrastructure/`
* `compile-server/src/`

## Veckofiler

### `ai-context/weekly/week_7_context.md`

Använd för CI/CD, pipeline, QA-start, Cumulus, riskanalys, projektledning och kvalitet.

### `ai-context/weekly/week_8_context.md`

Använd för automatiserade tester, AAA, Jest, jest-expo, testnivåer, integrationstest, systemtest och falsk trygghet i AI-kod.

### `ai-context/weekly/week_9_10_context.md`

Använd för slutleverans, etik, QA, presentation, demo, överlämning och projektets framtid.

## Transkriptfiler

Läs kompakta transkript före råtranskript.

* `ai-context/transcripts/v7_transcript_compact.md`
* `ai-context/transcripts/v8_transcript_compact.md`
* `ai-context/transcripts/v9_transcript_compact.md`

Råtranskript ska bara användas vid oklarheter.

## Wiki-underlag

### `ai-context/12_wiki_context.md`

Använd när Gemini ska skriva eller förbättra Wiki, iterationsrapport, testrapport, QA-text, riskanalys, post mortem eller demo-underlag.

### `ai-context/wiki/wiki_source_summary.md`

Använd som snabb karta över befintliga Wiki-sidor och deras syfte.

### Originalfil: `mina_wikisidor_samlade(2).txt`

Använd endast vid behov av exakt stil eller detaljer från tidigare Wiki-sidor. Den är råkälla och ska inte läsas som permanent arbetskontext varje gång.

## Studieguiden

### `ai-context/08_study_guide_context.md`

Använd först när Gemini ska kontrollera:

* kursmål
* provmoment
* G-krav
* VG-krav
* testkrav
* CI/CD-krav
* dokumentationskrav
* etik
* release-testning
* slutleverans
* presentation
* Wiki- och processkrav

### Originalfil: `studieguiden för kursen(3).txt`

Använd endast när exakt formulering krävs eller när ett betygskrav är oklart.

## När Gemini ska använda vilken källa

* Kodändring: `GEMINI.md`, `00_project_rules.md`, `04_architecture.md`, aktuell kodbas.
* Kravarbete: `01_abbas_project_context.md`, `11_mvp_requirements.md`, `06_course_requirements.md`, `08_study_guide_context.md`.
* Wiki och rapport: `12_wiki_context.md`, `wiki/wiki_source_summary.md`, relevant weekly-fil och `08_study_guide_context.md`.
* Testning: `03_definition_of_done.md`, `02_testing_rules.md`, `weekly/week_8_context.md`, `ch08_software_testing.md`, `08_study_guide_context.md`.
* CI/CD: `weekly/week_7_context.md`, `ch25_configuration_management.md`, `05_gitlab_workflow.md`, `08_study_guide_context.md`.
* QA: `weekly/week_8_context.md`, `weekly/week_9_10_context.md`, `ch24_quality_management.md`.
* Etik: `weekly/week_9_10_context.md`, `08_study_guide_context.md` och etikmaterial.
* Presentation: veckofiler, studieguiden, teoriindex och tidigare Wiki.
* Dokumentationsuppdatering: `GEMINI.md`, `10_source_map.md`, `08_study_guide_context.md`, `12_wiki_context.md`.

## Missförstånd att undvika

* Läs inte allt varje gång.
* Importera inte råmaterial rakt in i ai-context.
* Anta inte att Ida eller Wasim är kravkällor.
* Anta inte att hagen-auto-edit är Abbas egen kodbas.
* Anta inte att Docker-deployment betyder native mobilrelease.
* Anta inte att appen ska göra AI-analys.
* Anta inte att compile-serverns rendering är pixel-perfect mot preview.
* Anta inte att en gammal codebase snapshot är aktuell.
