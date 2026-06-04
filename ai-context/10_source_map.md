# Källkarta

## Syfte

Denna fil visar vilka källor AI ska använda och i vilken ordning.

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

### `AI_PROJECT_GUIDE.md`

Huvudstyrning. Läs först.

### `ai-context/00_project_rules.md`

Projektregler, Git-flöde, verifiering och issue-disciplin.

### `ai-context/01_abbas_project_context.md`

Produkt, målgrupp, MVP, scope och begränsningar.

### `ai-context/04_architecture.md`

Arkitektur, lager, compile-server och dataflöde.

### `ai-context/05_gitlab_workflow.md`

GitLab, issues, MR, brancher, estimates, spend och spårbarhet.

### `ai-context/13_cicd_deployment_context.md`

Faktisk CI/CD- och Cumulusmodell. Använd vid pipeline, Docker, Caddy, Cumulus, GitLab variables, deployment och runtime-felsökning.

### `ai-context/06_course_requirements.md`

Kurskrav, veckoteman, QA, CI/CD, etik och slutleverans.

### `ai-context/08_study_guide_context.md`

G- och VG-krav. Använd vid examination, kurskrav, betyg, Wiki-kontroll, release-testning och slutleverans.

### `ai-context/11_mvp_requirements.md`

Kravmodell för aktuell MVP.

### `ai-context/12_wiki_context.md`

Wiki-stil, dokumentationsmönster, rapportlogik och hur nya Wiki-utkast ska skrivas.

## Kodbas

Aktuell kodbas ska hämtas från:

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
* `tiktok-video-editor-app/src/store/`
* `compile-server/src/`
* `.gitlab-ci.yml`
* `tiktok-video-editor-app/docker-compose.yml`

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

## När AI ska använda vilken källa

* Kodändring: `AI_PROJECT_GUIDE.md`, `00_project_rules.md`, `04_architecture.md`, aktuell kodbas.
* Kravarbete: `01_abbas_project_context.md`, `11_mvp_requirements.md`, `06_course_requirements.md`, `08_study_guide_context.md`.
* CI/CD och deployment: `13_cicd_deployment_context.md`, `.gitlab-ci.yml`, `docker-compose.yml`, `Caddyfile`, Dockerfile och terminaloutput.
* Wiki och rapport: `12_wiki_context.md`, `wiki/wiki_source_summary.md`, relevant weekly-fil och `08_study_guide_context.md`.
* Testning: `02_testing_rules.md`, `03_definition_of_done.md`, kapitel 8 och aktuell testkod.
* Slutleverans: `08_study_guide_context.md`, `weekly/week_9_10_context.md`, testrapporter, iterationsrapporter och Wiki.
