# Kurskrav 1DV613 (06_course_requirements.md)

## Syfte

Denna fil sammanfattar de kurskrav i 1DV613 som påverkar Abbas projekt, Gemini CLI-arbete, kod, testning, GitLab och dokumentation.

Gemini ska använda denna fil vid:
- planering
- kravarbete
- testning
- Wiki
- iterationsrapporter
- presentationer
- kodarbete
- reflektion
- slutrapport
- deployment eller GitLab-arbete

## Kursens karaktär

1DV613 är ett individuellt mjukvaruutvecklingsprojekt där studenten bygger en egen applikation från idé till leverans.

Projektet ska visa:
- strukturerad utvecklingsprocess
- kravhantering
- implementation
- testning
- versionshantering
- planering
- dokumentation
- driftsättning eller leverans
- muntlig och skriftlig kommunikation

Abbas projekt är därför inte bara en kodövning. Det ska visa hur mjukvaruutveckling bedrivs professionellt.

## Centrala lärandemål

### Kunskap och förståelse

Abbas ska kunna förklara:
- utvecklingsprocesser
- krav
- implementation
- testning
- leverans
- planering
- versionshantering
- automatiserade arbetsflöden
- CI/CD
- automatiserad testning

### Färdighet och förmåga

Abbas ska kunna:
- planera och genomföra ett individuellt projekt
- använda GitLab och versionshantering strukturerat
- följa kodstandard
- redovisa konventioner
- kommunicera status skriftligt och muntligt
- kommentera och utvärdera sin implementation själv

### Värderingsförmåga och förhållningssätt

Abbas ska kunna reflektera över:
- etik
- juridik
- upphovsrätt
- AI-genererad kod
- datahantering
- användarens trygghet
- professionellt ansvar

## Språk och dokumentation

All projekt- och kursdokumentation för Abbas ska vara på svenska. Tekniska termer får vara på engelska när det är naturligt, till exempel Template-JSON, Expo Router, Zustand, GitLab, CI/CD, FFmpeg och compile-server.

## Kommunikation

Kursens öppna kommunikation sker främst i Teams. Personliga frågor kan tas via direktkontakt enligt kursens instruktioner. Gemini ska inte anta att kursinformation är permanent om Abbas klistrar in ny information från Teams eller kurssidan.

Gemini ska formulera frågor till kursledning, handledare eller uppdragsgivare så att de går att besvara konkret.

## Examination

Kursen examineras löpande genom:
- standups
- gruppresentationer
- frågor från kursledare och studenter
- individuell uppföljning
- projektstatus
- Wiki och dokumentation
- kod och implementation
- testning
- slutpresentation

Gemini ska därför hjälpa Abbas skapa material som går att visa, förklara och försvara muntligt.

## Standup

Vid standup ska Abbas kunna redogöra för:
- vad som byggts
- varför det byggts
- vilka krav det kopplas till
- hur det testats
- vilka problem som uppstod
- vilka risker som finns kvar
- vad som ska göras nästa iteration
- hur teori från kursen kopplas till projektet

Material ska finnas lätt tillgängligt via GitLab Wiki.

## Närvaro och veckovis examination

Kursen bygger på veckovis uppföljning, standups och aktivt deltagande.

Gemini ska komma ihåg:
- Abbas ska ha material tillgängligt via GitLab Wiki inför möten.
- Abbas ska kunna presentera projektstatus, veckans arbete, problem, risker och nästa steg.
- Minst ett presentationstillfälle krävs under kursen.
- Uteblivanden ska undvikas och större frånvaro kan påverka examination.
- Fredagens grupparbete är starkt rekommenderat även när det inte är strikt obligatoriskt.

Praktisk konsekvens:
När Gemini hjälper Abbas med veckorapport, standup eller presentation ska den skapa material som går att visa direkt i GitLab Wiki.

## GitLab som central yta

GitLab används för:
- kod
- Wiki
- issues
- milestones
- iterations
- tidsrapportering
- commits
- spårbarhet
- partnerövning
- branching strategy
- eventuell automation

Gemini ska behandla GitLab som en del av examinationen, inte bara som backup för kod.

## Wiki som kurskrav

Wikin är projektets skriftliga bas.

Den bör innehålla:
- projektvision
- kravspecifikation
- backlog
- teststrategi
- testspecifikation
- riskhantering
- arkitektur
- iterationsrapporter
- tekniska beslut
- reflektioner
- deploymentbeskrivning när Docker eller Cumulus används

Dokumentationen ska vara levande och spegla verklig kod.

## Dokumentationsprincip

Dokumentation ska vara:
- relevant
- uppdaterad
- enkel att arbeta med
- kopplad till projektet
- tillräcklig för examination
- inte större än den behöver vara

Missvisande dokumentation är värre än tunn dokumentation.

## Kravhantering

Krav ska:
- ha tydligt ID
- ha namn
- ha beskrivning
- ha prioritet
- ha status
- ha beroenden
- vara testbara
- vara verifierbara
- vara validerbara
- vara spårbara till testfall
- vara spårbara till implementation

Abbas projekt ska skilja mellan:
- användarkrav
- systemkrav
- funktionella krav
- icke-funktionella krav

För Abbas projekt betyder detta att Template-JSON, EditSession, timeline, preview, compile-payload och renderingsflödet måste uttryckas som tydliga krav, inte bara kod.

## Testning

Testning ska dokumenteras och kopplas till krav.

Gemini ska hjälpa Abbas skapa:
- testplan
- testsviter
- manuella testfall
- automatiska testförslag
- testrapport
- kravspårbarhet
- edge case-testning
- regressionstestning
- deploymenttest när Docker eller Cumulus påverkas

Testfall ska följa:

```text
TC[svit].[nummer]
```

Exempel:

```text
TC1.1 Home route renders project list
TC1.2 Invalid template id is handled
TC2.1 Template can be parsed into EditSession
TC-D1 Lokal Docker-build
TC-E1 Editor och preview hanterar saknat eller ogiltigt template-id
```

Alla testfall behöver inte vara lyckade, men misslyckade test ska leda till analys, issue eller ny plan.

## Implementation

Implementation ska visa att Abbas kan bygga en fungerande applikation och samtidigt följa en strukturerad process.

För Abbas projekt ska Gemini prioritera:
- React Native och Expo på ett rimligt sätt
- TypeScript-typer för Template-JSON
- Zustand store för EditSession
- Expo Router-routes
- tydlig separation mellan UI, state, domain och infrastructure
- testbar kod
- inga antaganden om att frontend analyserar TikTok-videos
- stabil route-hantering för template-id och editorstate

## Versionshantering

Allt Abbas själv producerar ska versionshanteras:
- kod
- dokumentation
- Wiki
- testfall
- konfiguration
- relevanta assets

Gemini ska tänka:

Issue -> Branch -> Implementation -> Test -> Commit -> MR -> Spend

Gemini ska stödja:
- tydliga commits
- branch-disciplin
- `git status` före commit
- `git diff` före commit
- inga hemligheter i Git
- `.env.example` när miljövariabler behövs
- `.gitignore` som skyddar `node_modules`, Expo-cache, env-filer och skräpfiler
- `.dockerignore` när Docker används
- package-lock eller annan lockfil som hanteras medvetet

## Veckoteman

Kursen följer ungefär dessa teman:
- Vecka 1 till 2: Vision och planering
- Vecka 3: Krav och test
- Vecka 4: Implementation 1 och arkitektur
- Vecka 5: Versionshantering, GitLab, branching och software evolution
- Vecka 6: Drift, Docker Compose, produktion, återanvändning, komponenter och services
- Vecka 7: CI/CD
- Vecka 8: Automatiserade tester
- Vecka 9: Leverans och etik
- Vecka 10: Demo och presentation

Kapitelkoppling:
- V1 till V2: kapitel 1, 2, 3
- V3: kapitel 4, 8, 23
- V4: kapitel 5, 6, 7
- V5: kapitel 9, 25
- V6: kapitel 15, 16, 18
- V7: kapitel 22, 24

Gemini ska använda `ai-context/theory/` före originalkapitlen när sådana filer finns.

## Vecka 5: Git, branching och partnerövning

Vecka 5 kräver att Abbas kan visa:
- versionshantering som mer än backup
- `git status`, `git diff`, staging, commit och push
- skillnaden mellan tracked och untracked files
- att `git commit -a` inte tar med nya filer
- koppling mellan krav, issue, branch, commit/MR och test
- reflektion över branching strategies
- partnerövning där en liten ändring görs i någon annans repo

För Abbas projekt är short-lived feature branches rimlig standard. Git Flow är normalt för tungt eftersom projektet inte har flera parallella releaser.

## Arkitektur och design

Kursen förväntar sig minst en enkel schematisk bild eller beskrivning av applikationens arkitektur.

För Abbas projekt ska arkitekturen beskrivas som:
- Presentation: screens, routes, UI-komponenter
- Application: Zustand store, orchestration, use cases
- Domain: Template, Scene, EditSession, Overlay, Transition, CompilePayload
- Infrastructure: API-klienter, TemplateRepository, GCS, Supabase, RenderApiClient, compile-server
- Deployment: Expo Web-export, Docker Compose, Nginx/Caddy, Cumulus när detta används som leveransform

Viktigt flöde:

TikTok URL -> AI/API video analysis -> Template-JSON -> EditSession -> Editor UI -> Preview/Timeline -> Compile-payload -> backend/compile-server -> Rendered video via FFmpeg

## Driftsättning och Docker

Docker och containers är kursmaterial som blir viktigt under vecka 6. För Abbas projekt är Docker främst relevant för Expo Web-deployment och framtida backend/compile-server, inte för att mobilappen själv ska köra FFmpeg.

Gemini ska komma ihåg:
- mobilappen kör inte FFmpeg lokalt
- compile-servern kan containeriseras separat i framtiden
- Expo Web kan exporteras och serveras som statiska filer
- Docker Compose kan användas för webbserver och reverse proxy
- Docker löser miljöproblem och "works on my machine"
- appar bör inte köras som root i containers om det går att undvika
- images ska vara små och rena
- environment variables ska hanteras säkert
- `.env`, privata nycklar, certifikat och tokens får inte checkas in eller byggas in i imagen
- `latest` bör undvikas i produktion där stabilitet är viktig
- production ska skiljas från development

För Abbas kan en kursrimlig deployment vara:

```text
Expo Web export -> Nginx container -> Caddy reverse proxy -> Cumulus demo
```

Detta ska beskrivas som webbdeployment för kursen, inte som färdig native mobilrelease.

## Extern uppdragsgivare

Eftersom Abbas projekt är kopplat till LeTrend ska Gemini tänka som i ett kundprojekt.

Det betyder:
- behov ska verifieras
- antaganden ska dokumenteras
- leveranser ska demonstreras
- feedback ska påverka planering
- tekniska detaljer ska förklaras begripligt
- omfattningen ska hållas realistisk
- korta avstämningar ska visa vad som faktiskt fungerar

Bra frågor till uppdragsgivare:
- Fungerar detta flöde som du tänkt dig?
- Saknas något viktigt för att detta ska fungera i ert arbetsflöde?
- Är detta en rimlig MVP-nivå?

Dålig fråga:
- Är det bra?

## Projektets utbildningsram

Projektet är en kursprototyp, inte en färdig produktionslösning.

Det betyder:
- scope måste vara realistiskt
- vissa krav kan förenklas
- tekniska risker ska dokumenteras
- det viktigaste är att visa strukturerad utvecklingsprocess
- fungerande kärnflöde är viktigare än många halvfärdiga features

## Viktigt för Abbas projekt

Abbas ska prioritera ett fungerande kärnflöde:

TikTok URL -> AI/API video analysis -> Template-JSON -> EditSession -> Editor UI -> Preview/Timeline -> Compile-payload -> backend/compile-server -> Rendered video via FFmpeg

Kursmässigt räcker det inte att detta finns i kod. Abbas måste kunna visa:
- varför detta är rätt MVP
- vilka krav det uppfyller
- hur det testats
- vilka begränsningar som finns
- hur det kan vidareutvecklas
- hur GitLab, testfall och eventuell deployment gör arbetet spårbart

## Etik och juridik

Abbas projekt rör video, AI, TikTok-format och potentiellt användargenererat material.

Gemini ska hjälpa Abbas reflektera över:
- upphovsrätt
- att appen härmar redigeringsformat, inte kopierar originalinnehåll
- integritet för video och användardata
- AI-ansvar
- transparens mot användaren
- lagring av media
- beroenden och licenser

Skriv:
- härma redigeringsformat
- återskapa struktur, timing och stil
- använda en video som stilreferens
- analysera redigeringsmönster
- skapa ny video utifrån mall

Undvik:
- kopiera originalvideo
- stjäla innehåll
- automatiskt återpublicera TikTok-innehåll
- påstå att appen kringgår TikToks regler

## AI-användning i kursen

Gemini får användas som utvecklingsstöd, men får inte bli ansvarsbärare.

Gemini ska:
- hjälpa Abbas förstå koden
- skapa testfall och dokumentation
- föreslå små implementationer
- förklara risker
- påminna om verifiering

Gemini får inte:
- ersätta Abbas egen förståelse
- kalla AI-genererad kod klar utan test
- skapa stora kodändringar utan kravkoppling
- blanda ihop referensprojekt med Abbas krav

## Slutpresentation

Slutpresentationen bör kunna visa:
1. Problemet
2. Målgruppen
3. Lösningen
4. Arkitekturen
5. Template-JSON-flödet
6. Editorflödet
7. Testning
8. Risker
9. Vad som fungerar
10. Begränsningar
11. Nästa steg

Om deployment ingår bör presentationen även kunna visa:
- hur appen byggdes eller levererades
- hur Docker eller Cumulus användes
- vilka deploymenttester som kördes
- varför detta är en kursrimlig leveransform

## Regel för Gemini

När Gemini hjälper Abbas ska den alltid fråga:

Kan Abbas förklara detta på en standup, koppla det till krav, visa testning och försvara varför det är rimligt för kursens omfattning?

Om svaret är nej är lösningen eller dokumentationen inte färdig.

## Vad Gemini aldrig ska tappa bort

- Abbas projekt är huvudprojektet.
- Ida och Wasim är endast referenser.
- Hagen-auto-edit är inspiration, inte kravkälla som ska kopieras.
- Mobilappen analyserar inte TikTok-videon själv.
- Mobilappen konsumerar Template-JSON.
- Template-JSON bygger EditSession.
- EditSession driver editor, timeline och preview.
- Compile-payload skickas till backend/compile-server.
- Renderad video skapas via FFmpeg utanför mobilappen.
- Testning och dokumentation är en del av kursens kärna.
- GitLab visar spårbarheten i arbetet.
- Docker och Expo Web-deployment är leveransform, inte ny produktlogik.
