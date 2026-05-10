# Teoriindex (09_theory_index.md)

## Syfte

Denna fil visar när Gemini ska använda varje teorikapitel i `ai-context/theory/`.

Gemini ska inte läsa alla teorifiler varje gång. Läs bara den teori som behövs för aktuell uppgift.

Gemini ska använda denna fil när den:
- behöver koppla kodarbete till kursens teori
- skriver Wiki, rapport eller presentation
- väljer vilka teorifiler som är relevanta för en issue
- motiverar krav, testning, arkitektur, planering eller GitLab-arbete

## Snabbregel

- Kravarbete: använd kapitel 4.
- Testarbete: använd kapitel 8.
- Planering och estimates: använd kapitel 23.
- Arkitektur: använd kapitel 6.
- Design och implementation: använd kapitel 7.
- Agilt arbetssätt: använd kapitel 3.
- Process och iterationer: använd kapitel 2.
- Evolution och vidareutveckling: använd kapitel 9.
- Configuration management, Git och versioner: använd kapitel 25.
- Återanvändning och hagen-auto-edit: använd kapitel 15 och 16.
- Service/API/backend/compile-server: använd kapitel 18.
- Projektledning: använd kapitel 22.
- Kvalitet: använd kapitel 24.

## Läsordning från kursen

- V1 till V2: kapitel 1, 2, 3
- V3: kapitel 4, 8, 23
- V4: kapitel 5, 6, 7
- V5: kapitel 9, 25
- V6: kapitel 15, 16, 18
- V7: kapitel 22, 24

## Snabbval

| Situation | Läs |
|---|---|
| Introduktion, professionell mjukvara, kvalitet på hög nivå | `ch01_introduction.md` |
| Process, iterationer, incremental development | `ch02_software_processes.md` |
| Agilt arbetssätt, user stories, backlog | `ch03_agile.md` |
| Krav, acceptanskriterier, spårbarhet | `ch04_requirements_engineering.md` |
| Diagram, flöden, klassdiagram, systemmodeller | `ch05_system_modeling.md` |
| Arkitektur, lager, ansvar, backend/frontend | `ch06_architectural_design.md` |
| Kodstruktur, JSDoc, designbeslut, refaktorering | `ch07_design_implementation.md` |
| Testplan, TC-format, regression, edge cases | `ch08_software_testing.md` |
| Vidareutveckling, teknisk skuld, ändrade krav | `ch09_software_evolution.md` |
| Återanvändning, hagen-auto-edit, bibliotek | `ch15_software_reuse.md` |
| Komponenter, interfaces, adapters | `ch16_cbse.md` |
| AI/API, Supabase, GCS, compile-server, tjänster | `ch18_service_oriented.md` |
| Risker, projektledning, status, standup | `ch22_project_management.md` |
| Estimat, spend, milestones, planering | `ch23_project_planning.md` |
| QA, DoD, granskningsregler | `ch24_quality_management.md` |
| Git, branches, commits, release, ändringskontroll | `ch25_configuration_management.md` |

## Kapitel 1: Introduction

Fil: `ai-context/theory/ch01_introduction.md`

Använd när:
- projektets syfte ska förklaras
- software engineering ska kopplas till verklig nytta
- etik och professionellt ansvar diskuteras
- projektets kundvärde ska beskrivas

Koppling till Abbas:
- appen är inte bara kod, utan en lösning för verkliga serviceverksamheter
- professionellt ansvar behövs eftersom AI, video, media och kunddata kan ingå

## Kapitel 2: Software Processes

Fil: `ai-context/theory/ch02_software_processes.md`

Använd när:
- arbetsprocessen ska beskrivas
- incremental development ska motiveras
- specification, development, validation och evolution ska kopplas till projektet
- iterationsrapporter skrivs

Koppling till Abbas:
- bygg en smal, körbar editor stegvis
- validera varje del innan nästa feature byggs

## Kapitel 3: Agile Software Development

Fil: `ai-context/theory/ch03_agile.md`

Använd när:
- user stories skrivs
- product backlog eller sprint backlog skapas
- förändrade krav diskuteras
- AI-stött arbetssätt behöver hållas disciplinerat

Koppling till Abbas:
- planera 1 till 2 iterationer framåt
- bygg små features
- samla feedback
- undvik stor allt på en gång-implementation

## Kapitel 4: Requirements Engineering

Fil: `ai-context/theory/ch04_requirements_engineering.md`

Använd när:
- krav skrivs eller förbättras
- krav delas upp
- användarkrav och systemkrav ska skiljas åt
- funktionella och icke-funktionella krav ska formuleras
- acceptanskriterier behövs
- krav ska kopplas till testfall

Koppling till Abbas:
- Template-JSON, EditSession, preview, timeline, compile-payload och GCS ska beskrivas som testbara krav
- krav får inte vara vaga AI-önskningar

## Kapitel 5: System Modeling

Fil: `ai-context/theory/ch05_system_modeling.md`

Använd när:
- diagram ska skapas
- klassdiagram, sekvensdiagram eller flödesdiagram behövs
- dataflödet ska förklaras

Koppling till Abbas:
- modellera flödet Template-JSON -> EditSession -> Editor UI -> Compile-payload
- visa hur UI, store och domain types samverkar

## Kapitel 6: Architectural Design

Fil: `ai-context/theory/ch06_architectural_design.md`

Använd när:
- arkitektursidan i Wiki ska skrivas
- lagerarkitekturen ska förklaras
- ansvar mellan frontend, backend och compile-server ska separeras
- risker med externa beroenden diskuteras

Koppling till Abbas:
- Presentation, Application, Domain, Infrastructure
- mobilappen skapar compile-payload men kör inte FFmpeg
- upstream AI/API analyserar TikTok-video, frontend konsumerar JSON

## Kapitel 7: Design and Implementation

Fil: `ai-context/theory/ch07_design_implementation.md`

Använd när:
- kodstruktur ska förbättras
- modulindelning ska motiveras
- JSDoc och kodkvalitet diskuteras
- refaktorering ska göras

Koppling till Abbas:
- separera UI från state och domänlogik
- skriv små, testbara funktioner
- undvik AI-genererad kod som blir svår att förstå

## Kapitel 8: Software Testing

Fil: `ai-context/theory/ch08_software_testing.md`

Använd när:
- testplan, testsviter eller testfall ska skrivas
- validation och defect testing ska förklaras
- release testing ska motiveras
- regressionstestning ska planeras
- edge cases ska identifieras

Koppling till Abbas:
- testa JSON-parser, Template-validering, EditSession, timeline, preview och compile-payload
- testning är kvittot på att AI-genererad kod går att lita på

## Kapitel 9: Software Evolution

Fil: `ai-context/theory/ch09_software_evolution.md`

Använd när:
- vidareutveckling diskuteras
- teknisk skuld analyseras
- förändrade krav hanteras
- framtida features planeras

Koppling till Abbas:
- Template-JSON kan ändras
- backend/API kan ändras
- appen ska kunna vidareutvecklas efter kursen

## Kapitel 15: Software Reuse

Fil: `ai-context/theory/ch15_software_reuse.md`

Använd när:
- hagen-auto-edit används som inspiration
- kod eller idéer från referensrepo diskuteras
- återanvändning ska motiveras eller begränsas

Koppling till Abbas:
- hagen-auto-edit får inspirera schema, compile-server och mönster
- kod ska inte kopieras blint
- anpassa alltid till Abbas arkitektur

## Kapitel 16: Component-Based Software Engineering

Fil: `ai-context/theory/ch16_cbse.md`

Använd när:
- komponenter, gränssnitt eller integrationer diskuteras
- existerande moduler ska kapslas in
- API-kontrakt behöver bli tydliga

Koppling till Abbas:
- TemplateParser, EditSessionStore, CompilePayloadFactory och RenderApiClient ska kunna ses som separata komponenter med tydliga ansvar

## Kapitel 18: Service-Oriented Software Engineering

Fil: `ai-context/theory/ch18_service_oriented.md`

Använd när:
- API-flöden diskuteras
- backend/compile-server beskrivs
- Supabase, GCS eller RenderApiClient används
- frontend och externa tjänster ska separeras

Koppling till Abbas:
- AI/API är upstream
- compile-server är downstream
- mobilappen ska vara klient, inte analysmotor eller renderingsmotor

## Kapitel 22: Project Management

Fil: `ai-context/theory/ch22_project_management.md`

Använd när:
- tidsplan, risker eller projektledning diskuteras
- iterationsrapporter skrivs
- prioriteringar motiveras
- scope måste begränsas

Koppling till Abbas:
- MVP måste hållas realistisk
- AI gör produktion snabbare men verifiering kräver mer disciplin
- risker ska kopplas till konkreta actions

## Kapitel 23: Project Planning

Fil: `ai-context/theory/ch23_project_planning.md`

Använd när:
- sprint backlog skapas
- estimates och spend diskuteras
- planering skrivs
- tasks bryts ned

Koppling till Abbas:
- planera små features
- jämför uppskattad tid och faktisk tid
- välj kärnflöde före extra features

## Kapitel 24: Quality Management

Fil: `ai-context/theory/ch24_quality_management.md`

Använd när:
- kvalitetssäkring diskuteras
- Definition of Done förbättras
- granskning, standarder eller processkvalitet behövs
- rapportens kvalitetsdel skrivs

Koppling till Abbas:
- kvalitet betyder verifierad kod, inte bara fungerande demo
- kod, test och dokumentation måste hålla ihop

## Kapitel 25: Configuration Management

Fil: `ai-context/theory/ch25_configuration_management.md`

Använd när:
- Git, branches, commits eller versionshantering diskuteras
- releaseversioner ska identifieras
- ändringshantering behövs
- CI/CD eller automatisering ska kopplas till kursen

Koppling till Abbas:
- GitLab issues, branches, MR, commits och versionshistorik är en del av examinationen
- varje ändring ska vara spårbar

## Abbas huvudflöde som all teori ska kopplas till

TikTok URL -> AI/API video analysis -> Template-JSON -> EditSession -> Editor UI -> Preview/Timeline -> Compile-payload -> backend/compile-server -> Rendered video via FFmpeg

## Projektets viktigaste teorikopplingar

- Krav och testning styr implementationen.
- Arkitektur ska göra appen testbar och förklarbar.
- Configuration management gör AI-genererad utveckling spårbar.
- Software evolution är viktigt eftersom Template-JSON och AI/API kan ändras.
- Service-oriented thinking är viktigt eftersom mobilappen konsumerar upstream AI/API och skickar compile-payload downstream.
- Software reuse är viktigt eftersom hagen-auto-edit och Ida/Wasim är inspiration men inte kravkällor.
- Quality management är viktigt eftersom kursen bedömer process, dokumentation och verifiering, inte bara kod.

## Regel för Gemini

När Gemini använder teori ska den alltid koppla den till minst en av dessa projektdelar:
- krav
- testning
- arkitektur
- kod
- GitLab issue
- Wiki
- rapport
- presentation
- risk
- Definition of Done

Teorin får inte bli allmän skoltext. Den ska hjälpa Gemini fatta bättre beslut när den kodar, testar, planerar eller dokumenterar Abbas projekt.

Om Gemini bara behöver en teori för ett kodbeslut ska den läsa den mest relevanta teorifilen, inte hela teorimappen.
