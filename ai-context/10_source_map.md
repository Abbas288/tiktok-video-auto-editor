# Källkarta (10_source_map.md)

## Syfte

Denna karta listar tillgängliga källarkiv och originalfiler. Den styr när och hur Gemini ska läsa information för att undvika överfylld kontext.

Regel:

Läs stora källor selektivt via sökning eller riktad läsning. Läs aldrig in hela arkiv som permanent arbetskontext om det inte uttryckligen krävs.

## Prioriteringsordning

När källor motsäger varandra gäller:

1. Abbas kravspec eller SPEC_STUDENT
2. Abbas egen Wiki och projektdokumentation
3. Abbas aktuella kodbas
4. kursens officiella material
5. hagen-auto-edit som teknisk inspiration
6. Ida och Wasim som jämförelse och inspiration

## Högprioriterade projektkällor

### `SPEC_STUDENT.txt`

Innehåll:
- företagets kravspec för Abbas projekt
- appens scope
- Template-JSON
- GCS-video
- editorflöde
- hagen AI och Vertex AI som upstream
- vad Abbas ska bygga
- vad Abbas inte ska bygga
- referensrepo och compile-server

Använd när:
- projektets tekniska scope ska fastställas
- krav ska skrivas
- Template-JSON ska förstås
- appens ansvar ska skiljas från backendens ansvar
- compile-server eller FFmpeg diskuteras

Viktig regel:

Mobilappen ska läsa JSON, bygga redigeringssession och skapa compile-payload. Mobilappen ska inte bygga hagen AI-backend och inte köra FFmpeg lokalt.

### `README.md`

Innehåll:
- student-spec i repoform
- veckoplan
- kärnfunktioner
- teknikstack
- dev-miljö
- compile-server
- export
- frågor och kontakt

Använd när:
- planering vecka för vecka behövs
- MVP ska avgränsas
- tekniska val ska motiveras
- README behöver hållas synkat med ai-context

### `backup-wikisidor.txt`

Innehåll:
- Abbas Wiki-material
- projektplan
- riskhantering
- testfokus
- projektvision
- reflektioner
- iterationer
- dokumentation om AI-risk och falsk trygghet

Använd när:
- Wiki ska uppdateras
- iterationsrapport ska skrivas
- riskanalys behövs
- teststrategi ska förklaras
- Abbas egna reflektioner ska bevaras

### `gitlab_issues.txt`

Innehåll:
- Abbas issues
- user stories
- tasks
- estimates
- status
- backlog

Använd när:
- aktuell feature ska kopplas till issue
- branch eller commit ska namnges
- kravspårbarhet ska skapas
- sprint backlog ska planeras

### `commits plan.txt`

Innehåll:
- planerad commit- och featureordning

Använd när:
- commit-strategi ska följas
- features ska prioriteras
- Gemini behöver förstå ordningen för implementation

## Tekniska referenser

### `PROJECT_README.txt`

Innehåll:
- hagen-auto-edit
- JSON-template-system
- FFmpeg
- GCS
- Supabase
- compile-server
- auto-edit flow
- template descriptor

Använd när:
- compile-server ska förstås
- backendens roll ska förklaras
- JSON-template-inspiration behövs
- integration med GCS/Supabase diskuteras

### `codebase hagen-auto-edit.txt`

Innehåll:
- kodbasdump från hagen-auto-edit
- exempel på store, domain types, edit-screen, template och compile-flow

Använd när:
- tekniska mönster behövs
- typer och integrationer ska inspireras
- compile-payload eller renderingsflöde ska förstås

Begränsning:

Får aldrig kopieras blint. Ska anpassas till Abbas app och lagerarkitektur.

## Kursmaterial

### `studieguiden för kursen.txt`

Innehåll:
- kursregler
- GitLab
- Wiki
- standups
- examination
- projektgrupper
- kommunikation
- äganderätt
- extern uppdragsgivare

Använd när:
- kurskrav ska beskrivas
- standup eller examination ska förberedas
- Wiki-arbete ska struktureras
- extern uppdragsgivare diskuteras

### `alla kursens powerpoints hittills.txt`

Innehåll:
- kursens slides
- kravhantering
- testning
- GitLab
- Kanban
- Scrum
- iterations
- CI/CD
- Docker
- veckoteman

Använd när:
- kursens begrepp ska kopplas till projektet
- teori och praktik ska bindas ihop
- testplan, krav eller workflow ska skrivas

### `allt kursmaterial hittills.txt`

Innehåll:
- samlat kursmaterial
- veckosidor
- projektarbete
- GitLab iterations
- planering
- dokumentation
- extern uppdragsgivare

Använd när:
- kurskrav och arbetsmetod behöver kontrolleras
- GitLab iterationer och Wiki ska beskrivas
- projektprocess ska dokumenteras

### `v1-2_alla_powerpoints.txt`

Använd när:
- vision och planering ska beskrivas
- kapitel 1 till 3 ska kopplas till projektet
- presentationer från tidig kurs ska sammanfattas

### `v3_alla_powerpoints.txt`

Använd när:
- krav och test ska beskrivas
- testfall ska formateras
- GitLab requirements och traceability ska förklaras
- Kanban och Scrum ska kopplas till planering

### `v4-alla-powerpoints.txt`

Använd när:
- arkitektur, implementation och design diskuteras
- vecka 4 material ska sammanfattas
- implementation 1 ska kopplas till teori

### `v5-allt-på-kurssajtsen.txt`

Använd när:
- versionshantering och Git behöver kontrolleras
- GitLab från krav till implementation ska beskrivas
- branching strategies ska diskuteras
- partnerövning ska planeras eller dokumenteras
- software evolution och configuration management ska kopplas till projektet
- vecka 5-status behöver kontrolleras

### `v6-allt-på-kurssajtsen.txt`

Använd när:
- Docker Compose, production och deployment behöver kontrolleras
- Just Task It Docker Compose eller production-övningarna ska sammanfattas
- Cumulus, containers, reverse proxy eller Expo Web-deployment ska dokumenteras
- vecka 6-status behöver kontrolleras

### `transcription_demo5_docker_compose.txt`

Använd när:
- exakta detaljer från Docker Compose-demonstrationen behövs
- skillnaden mellan services, networks, volumes, ports, expose och depends_on ska förklaras
- Compose-arbetsflödet ska kopplas till Abbas deployment

### `v1-2_allt_på_kurssajten.txt`

Använd när:
- kursstart, vision, planering och tidiga wikiinstruktioner behöver kontrolleras
- vecka 1 till 2 ska beskrivas mer detaljerat

### `v3_allt_på_kurssajten.txt`

Använd när:
- krav, testning, GitLab issues, iterations eller planering från vecka 3 behöver kontrolleras
- Gemini behöver mer detaljer än `weekly/week_3_context.md`

### `v4-allt-på-kurssajtsen.txt`

Använd när:
- implementation, arkitektur, Docker-grund, Definition of Done eller testplan från vecka 4 behöver kontrolleras
- Gemini behöver mer detaljer än `weekly/week_4_context.md`

## Presentationer

### `alla_presentationer.txt`

Innehåll:
- gruppresentationer
- Abbas vision
- Ida och Wasim som referensprojekt
- examinationsfrågor
- presentationsteknik

Använd när:
- Abbas presentation ska förbättras
- vision ska formuleras
- gruppkontext behövs
- jämförelse med Ida och Wasim är relevant

Begränsning:

Ida och Wasim är endast inspiration. De får inte användas som kravkälla för Abbas kod.

## Testmaterial

### `exempel på testfall.txt`

Innehåll:
- exempel på TC-format
- testfall från andra projekt

Använd när:
- testfall behöver formateras
- TC-namngivning ska kontrolleras
- struktur för manual testing behövs

Begränsning:

Testfallen kommer från andra projekt och ska inte styra Abbas krav.

### `summa summarum.txt`

Innehåll:
- regressionstestning
- GitLab
- Docker
- containers
- kursanteckningar

Använd när:
- regressionstestning ska förklaras
- GitLab milestones och iterations diskuteras
- Docker eller drift ska kopplas till kursen

## Teorisammanfattningar

Originalfilerna med kapitelsammanfattningar ska behandlas som källarkiv.

De komprimerade filerna i `ai-context/theory/` ska vara arbetsmaterial för Gemini.

Användning:
- Läs bara relevant kapitel.
- Koppla alltid teori till Abbas projekt.
- Skriv inte långa föreläsningsanteckningar i ai-context.
- Behåll kursbegrepp.
- Förklara när teorin påverkar krav, testning, GitLab, arkitektur, kod eller Wiki.

Kapitel som används:
- ch01 introduction
- ch02 software processes
- ch03 agile
- ch04 requirements engineering
- ch05 system modeling
- ch06 architectural design
- ch07 design implementation
- ch08 software testing
- ch09 software evolution
- ch15 software reuse
- ch16 cbse
- ch18 service oriented
- ch22 project management
- ch23 project planning
- ch24 quality management
- ch25 configuration management

### `ALLA_KAPITEL_KURSBOK.txt`

Innehåll:
- samlad fil med kursbokens kapitelanteckningar och sammanfattningar
- fungerar som källarkiv när en AI-vänlig teorifil behöver kontrolleras mot originalsammanfattningen
- innehåller material för kapitel 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 18, 22, 23, 24 och 25

Använd när:
- en teorifil i `ai-context/theory/` känns för kort
- Gemini behöver kontrollera en detaljerad teoriuppgift
- rapport eller wiki behöver mer kursbokskoppling

Regel:
Använd först `ai-context/theory/`. Läs `ALLA_KAPITEL_KURSBOK.txt` selektivt bara när mer detalj behövs.

## Transkriptioner

### `v1-2_alla_transkriptioner.txt`

Använd när:
- tidiga kursinstruktioner behöver sammanfattas
- vision och planering behöver kompletteras

### `v3_alla transkriptioner.txt`

Använd när:
- krav och test behöver kompletteras
- lärarens muntliga instruktioner behövs

### `V4_TRANSKRIPTIONER_MERGED.txt`

Använd när:
- implementation, arkitektur eller hagen AI-pipeline behöver djupdykning
- lärarens instruktioner för vecka 4 behöver extraheras

### Vecka 5-transkriptioner

Använd när:
- Git, GitLab, partnerövning, branching strategy eller configuration management behöver kompletteras
- lärarens muntliga instruktioner för versionshantering behövs

### Vecka 6-transkriptioner

Använd när:
- Docker Compose, production, Cumulus, deployment eller demonstrationen behöver kompletteras
- lärarens muntliga instruktioner om drift behövs

Regel för transkriptioner:
- ta bort småprat och upprepningar
- behåll kurskrav, examination, GitLab, testning, krav, Wiki och presentation
- dela upp per vecka och tema
- markera:
  - MÅSTE FÖLJAS
  - BRA FÖR RAPPORT
  - BRA FÖR MUNTLIG REDOVISNING
  - BAKGRUND

## AI-vänliga transkriptfiler

Dessa filer ska användas före råtranskriptionerna när de finns:

- `ai-context/transcripts/transcript_rules.md`
- `ai-context/transcripts/v1_2_transcript_compact.md`
- `ai-context/transcripts/v3_transcript_compact.md`
- `ai-context/transcripts/v4_transcript_compact.md`
- `ai-context/transcripts/v5_transcript_compact.md`
- `ai-context/transcripts/v6_transcript_compact.md`

Använd när Gemini behöver:
- exakt kursbetoning från muntliga genomgångar
- vad läraren betonade som viktigt
- hur veckans examination kopplas till projektet
- vad som ska tas upp i presentation eller Wiki

## Veckokontext

AI-vänliga arbetsfiler:

- `ai-context/weekly/week_1_2_context.md`
- `ai-context/weekly/week_3_context.md`
- `ai-context/weekly/week_4_context.md`
- `ai-context/weekly/week_5_context.md`
- `ai-context/weekly/week_6_context.md`

Använd när Gemini behöver:
- förstå veckans kursfokus
- skriva iterationsrapport
- koppla projektstatus till kursens moment
- prioritera vad som ska byggas, testas och dokumenteras

## När Gemini ska använda vilken källa

- Kodändring: börja med `GEMINI.md`, `00_project_rules.md`, `04_architecture.md`, `08_current_feature_context.md`.
- Kravarbete: börja med `01_abbas_project_context.md`, `06_course_requirements.md`, `ch04_requirements_engineering.md`, `gitlab_issues.txt`.
- Testning: börja med `02_testing_rules.md`, `03_definition_of_done.md`, `ch08_software_testing.md`, `exempel på testfall.txt`.
- GitLab: börja med `05_gitlab_workflow.md`, `gitlab_issues.txt`, `commits plan.txt`.
- Arkitektur: börja med `04_architecture.md`, `ch06_architectural_design.md`, `ch07_design_implementation.md`, `PROJECT_README.txt`.
- Compile/export: börja med `04_architecture.md`, `SPEC_STUDENT.txt`, `PROJECT_README.txt`, `codebase hagen-auto-edit.txt`.
- Deployment: börja med `04_architecture.md`, `06_course_requirements.md`, `weekly/week_6_context.md`, `transcripts/v6_transcript_compact.md`, `v6-allt-på-kurssajtsen.txt`, `transcription_demo5_docker_compose.txt`.
- Presentation: börja med `alla_presentationer.txt`, veckokontext och relevanta teorifiler.
- Wiki: börja med `backup-wikisidor.txt`, veckokontext, GitLab workflow och relevant teori.

## Viktiga missförstånd att undvika

- Anta inte att alla stora filer ska in i prompten.
- Anta inte att alla teorikapitel är lika relevanta för varje feature.
- Anta inte att hagen-auto-edit är Abbas kodbas.
- Anta inte att Ida och Wasim är kravkällor.
- Anta inte att mobilappen ansvarar för AI-analys eller FFmpeg-rendering.
- Anta inte att en feature är klar utan testfall och verifiering.
- Anta inte att Docker-deployment betyder native mobilrelease.
- Anta inte att Cumulus, Caddy eller Nginx ska påverka editorlogiken.

## Minsta rekommenderade läsordning för ny session

1. `GEMINI.md`
2. `ai-context/00_project_rules.md`
3. `ai-context/01_abbas_project_context.md`
4. `ai-context/04_architecture.md`
5. `ai-context/08_current_feature_context.md`
6. relevant teori eller veckofil
7. originalkälla endast vid behov

## Regel för Gemini

När Gemini ska arbeta med en uppgift:

1. Läs `GEMINI.md`.
2. Läs relevant fil i `ai-context/`.
3. Identifiera vilken originalkälla som behövs.
4. Läs originalkälla selektivt.
5. Skriv kort, praktiskt och projektspecifikt.
6. Koppla alltid tillbaka till Abbas app.
7. Undvik att skapa stora sammanfattningsfiler.
8. Implementera inte kod om uppgiften bara gäller dokumentation.
