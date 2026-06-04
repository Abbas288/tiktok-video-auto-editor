# GitLab Workflow (05_gitlab_workflow.md)

## Syfte

Denna fil styr hur AI ska hjälpa Abbas med GitLab, issues, branches, commits, merge requests, estimates och spend.

GitLab är projektets arbetsyta för:
- kod
- Wiki
- krav
- issues
- testfall
- versionshantering
- tidsrapportering
- spårbarhet mellan krav, implementation och test

AI ska använda denna fil när den:
- skriver eller granskar issues
- föreslår milestones eller iterations
- formulerar commits
- hjälper till med att kontrollera krav mot Wiki
- kopplar krav till testfall
- bedömer om en issue kan stängas
- förklarar `git status`, `git diff`, staging eller commit-flöde
- hjälper till med branching strategy, partnerövning eller GitLab automation

## Grundprincip

Varje feature ska kunna spåras genom hela kedjan:

Krav -> Issue -> Branch -> Implementation -> Testfall -> Verifiering -> Dokumentation -> Commit/Merge Request

AI får inte behandla kod som fristående från krav, testning och dokumentation.

## GitLab Wiki

Wikin är kursens huvudsakliga dokumentationsyta.

AI ska se wikin som:
- projektets minne
- platsen där beslut förklaras
- platsen där krav, risker, testning och iterationer följs upp
- underlag för examination, presentation och rapport

Dokumentation ska vara lätt att uppdatera. Hellre kort, korrekt och levande än lång och död.

När AI föreslår implementation ska den också ange om någon Wiki-sida behöver uppdateras.

## Issue-arbete

När AI hjälper till med en issue ska den följa detta:

1. Läs aktuell issue.
2. Identifiera mål och scope.
3. Kontrollera kravtyp.
4. Identifiera acceptanskriterier.
5. Kontrollera beroenden.
6. Föreslå testfall.
7. Implementera minsta möjliga ändring.
8. Verifiera.
9. Uppdatera dokumentation.
10. Föreslå commit.

## Issue-typer

Rekommenderade typer i Abbas projekt:
- USER STORY: beskriver användarvärde.
- SYSTEM: beskriver tekniskt systemkrav.
- FIX: fel som ska åtgärdas.
- TC-XXX: testfall.
- DOCS: dokumentationsarbete.
- DEPLOYMENT: Docker, Cumulus, reverse proxy, build eller releasekontroll.

## GitLab-detaljer som kan användas vid behov

AI kan föreslå följande när det hjälper Abbas strukturera issues:

- labels för typ av arbete, till exempel `feature`, `bug`, `docs`, `test`, `risk`, `spike`, `deployment`
- weight eller prioritet när flera issues konkurrerar
- beroenden mellan issues när en uppgift blockerar en annan
- Design Manager eller Figma-länk om UI-skisser, wireframes eller designbeslut behöver diskuteras
- milestone för större leverans eller kursiteration
- iteration cadence om återkommande sprintliknande cykler används

Regel:
Dessa verktyg ska bara användas när de hjälper projektet. AI ska inte skapa administrativt brus.

## User Story-format

```md
Som [roll] vill jag [mål] så att [värde].
```

Exempel:

```md
Som användare vill jag kunna välja en template så att jag kan starta en redigeringssession.
```

## Acceptanskriterier

Varje större issue bör ha acceptanskriterier.

Exempel:

```md
### Acceptanskriterier

- Home visar minst ett template.
- Användaren kan trycka på template.
- Appen navigerar till editor-route med template id.
- EditSession innehåller valt template.
- Appen kraschar inte om id saknas.
```

För deployment-issues bör acceptanskriterier också nämna build, lokal körning, säkerhetskontroll och eventuell Cumulus/HTTPS-verifiering.

## Abbas nuvarande issue-struktur

Kända issues i projektet visar denna riktning:
- `#1` läsa in och validera Template-JSON
- `#2` spela upp källvideo enligt starttider i mallen
- `#3` visa horisontell timeline
- `#4` klicka på scenblock och hoppa till scen
- `#5` visa text från mallen vid rätt tidpunkt
- `#6` ändra text, färg, storlek och position
- `#7` lägga till visuella filter
- `#8` hantera volym för originalljud och bakgrundsmusik
- `#9` skicka redigeringssession till compile-server
- `#10` ladda ner färdigredigerad fil
- `#11` välja övergång mellan scener
- `#13` initiera Expo-projektet
- `#14` installera kärnbibliotek
- `#15` sätta upp Expo Router-routes
- `#16` skapa `.env` och miljövariabler
- `#17` skapa konfigurationsfil
- `#18` definiera färgpalett
- `#19` definiera typografi
- `#35` Docker eller Expo Web deployment
- `#40` Cumulus, HTTPS eller reverse proxy
- `#42` och `#43` route-stabilisering, template-id och stale state

AI ska använda dessa som projektets faktiska backlog, men ska kontrollera aktuell GitLab-status om Abbas klistrar in ny status.

## Estimate och spend

Innan arbete börjar bör issue få estimate:

```text
/estimate 2h
```

Efter arbete ska faktisk tid rapporteras:

```text
/spend 1h45m
```

Skillnaden mellan estimate och spend är viktig eftersom den visar planering, osäkerhet och reflektion.

AI gör implementation snabbare men verifiering långsammare. Estimate måste därför inkludera:
- förståelse
- implementation
- testning
- diff-granskning
- dokumentation
- deploymentkontroll om aktuell issue gäller Docker eller Cumulus

## Branch-regel

Feature branches ska vara små och kopplade till issue.

Format:

```bash
git checkout -b <issue-nummer>-kort-beskrivning
```

Exempel:

```bash
git checkout -b 15-expo-router-foundation
git checkout -b 4-scene-timeline-navigation
git checkout -b 9-compile-payload-request
git checkout -b 42-fix-route-template-loading
```

## Branching strategy

Standardval för Abbas projekt:
- short-lived feature branches
- `main` hålls stabil
- en tydlig branch per feature, fix eller deploymentuppgift
- merge först efter test och diff-granskning

Varför detta passar:
- projektet är ett individuellt studentprojekt
- features är små och ska kunna granskas snabbt
- det finns inte flera parallella produktreleaser
- det minskar risken för stora, gamla branches som blir svåra att merga

Strategier som normalt är för tunga här:
- Git Flow, eftersom den är bättre för flera parallella releaser och releasegrenar
- långlivade branches, eftersom de ökar risk för stale code och mergekonflikter
- Release Flow, om projektet inte har flera stabila produktversioner

## Commit-regel

Commits ska vara små och ha ett enda syfte.

Prefix:
- `feat:` ny funktion
- `fix:` buggfix
- `test:` testfall eller testkod
- `docs:` dokumentation
- `refactor:` omstrukturering utan ny funktion
- `chore:` beroenden, config eller underhåll
- `build:` build- eller paketrelaterade ändringar
- `style:` styling eller layout utan beteendeförändring

Exempel:

```bash
git commit -m "feat: setup Expo Router foundation"
git commit -m "test: add manual test cases for template loading"
git commit -m "docs: update current feature context"
git commit -m "fix: handle invalid template route state"
git commit -m "chore: add Docker Compose deployment"
```

## Före commit

Kör:

```bash
git status
git diff
npm run lint
npx tsc --noEmit
```

När aktuell issue eller testfall kräver automatiska tester, eller testkod ändras:

```bash
npm test
```

Om UI/appstruktur påverkas:

```bash
npm start
```

Om aktuell issue uttryckligen gäller Expo Web eller deployment:

```bash
npx expo export --platform web
docker compose build
docker compose up --build -d
```

Om filer är staged:

```bash
git diff --staged
```

## Merge Request

Även om Abbas arbetar ensam är MR användbart för självgranskning.

MR ska visa:
- vad som ändrats
- vilken issue som löses
- vilka testfall som körts
- vilka risker som finns kvar
- om dokumentation har uppdaterats

MR-template:

```md
## Vad har ändrats?

## Kopplad issue
Closes #<nummer>

## Testning
- [ ] npm run lint
- [ ] npx tsc --noEmit
- [ ] npm start, om UI/appstruktur påverkas
- [ ] npm test, endast om aktuell issue/testfall kräver automatiska tester eller testkod ändras
- [ ] Manuellt testfall TCx.y passerar

## Risker

## Dokumentation
```

Vid deployment-issue:

```md
## Deploymenttest
- [ ] npx expo export --platform web
- [ ] docker compose build
- [ ] docker compose up --build -d
- [ ] TC-D4 säkerhetskontroll
```

## Partnerövning vecka 5

Syfte:
- öva programförståelse
- arbeta i någon annans repo
- använda branch, commit och MR
- visa att små ändringar kräver förståelse av struktur och beroenden

Regler:
- ge partner Developer-rättighet i GitLab
- ta backup eller kontrollera att main är ren före arbete
- skapa en liten branch i partnerrepo
- välj en liten refaktorering eller buggfix
- håll arbetet tidsboxat, cirka 2 timmar
- gör inte en stor feature
- dokumentera vad som var svårt att förstå
- koppla reflektionen till program understanding och branching strategy

För Abbas projekt får partnerövningen inte bli kravkälla för appens produktfunktioner.

## GitLab automation

GitLab automation kan senare användas för:
- lint
- TypeScript-kontroll
- automatiska tester
- Expo Web build
- Docker build
- MR-kontroller
- skydd mot merge om pipeline failar

Regel:
Automation ersätter inte Abbas förståelse. Den ger bara snabbare kontroll av kända verifieringssteg.

## Milestones

Milestones används för större planeringsblock eller release-delar.

Exempel:
- Iteration 1: Vision och planering
- Iteration 2: Krav och test
- Iteration 3: Expo Router foundation
- Iteration 4: Template parser och EditSession
- Iteration 5: Timeline foundation
- Iteration 6: Drift, Docker eller compile-server
- Iteration 7: CI/CD och automatiska tester
- Iteration 8: Leverans, etik och slutdemo

## Iterations

Iterations används för veckovis eller sprintliknande planering.

Varje iteration bör ha:
- mål
- valda issues
- estimate
- faktisk spend
- kort reflektion
- vad som gick bra
- vad som inte gick bra
- vad som flyttas vidare
- skillnaden mellan plan och faktisk utveckling

Abbas har haft problem med att komma igång med tidsloggning och GitLab Iterations. AI ska därför vara extra tydlig med konkreta steg.

## Kanban och sprint

Använd båda:
- Kanban för daglig överblick: To Do, In Progress, Done
- Sprint/Iteration för veckans mål och uppföljning.

Notera: Abbas har valt att följa kanban-metodiken med papper och penna, medan sprint/iteration-relaterad dokumentation sker i GitLab. 

## `.gitignore`

Projektet kan ha en `.gitignore` i roten och en i appmappen om båda fyller olika syften.

Rimlig modell:
- root `.gitignore`: projektövergripande skräp, AI-context cache, OS-filer, editor-filer, `.env`
- app `.gitignore`: Expo/Node-specifika filer, `node_modules`, `.expo`, build-output

AI ska inte slentrianmässigt ta bort en `.gitignore`. Först ska den kontrollera vad varje fil ignorerar.

## `.dockerignore`

När Docker används ska `.dockerignore` hindra onödiga eller farliga filer från att hamna i image.

Exempel på sådant som normalt ska ignoreras:
- `node_modules`
- `.git`
- `.expo`
- `dist` om den byggs i Docker
- `.env`
- privata nycklar
- certifikat
- cachefiler
- lokala editorfiler

## Riskhantering i GitLab

Risker ska bli konkreta uppgifter, inte bara text i Wiki.

Exempel:
- Risk: GCS-video laddar inte i Expo.
- Undersökning: testa signerad video-URL i Expo Go.
- Acceptanskriterium: video kan öppnas eller felhantering visas.
- Testfall: TC för lyckad laddning och TC för bruten URL.

Andra risker för Abbas projekt:
- Template-JSON ändras av upstream AI/API.
- Compile-server förväntar sig annat payload-format.
- Expo-video fungerar olika på emulator och fysisk enhet.
- AI-genererad kod skapar falsk trygghet.
- Scope creep gör att editor-UI blir för stort innan kärnflödet fungerar.
- Docker/deployment tar tid från editor-MVP om det inte avgränsas.
- Secrets eller `.env` råkar committas.

## Vad AI inte får göra

AI får inte:
- föreslå commit utan verifiering
- blanda flera features i samma commit om det går att undvika
- ignorera untracked files
- anta att ändringar är korrekta utan diff
- skriva över stora filer utan anledning
- skapa features som inte är kopplade till issue eller krav
- behandla Ida eller Wasim som kravkälla för Abbas repo
- blanda partnerövningens kodidéer med Abbas produktkrav
- behandla Docker som färdig produktkvalitet utan testfall

## GitLab och examination

GitLab används för att visa att Abbas arbetar strukturerat:
- planering per iteration
- issues som krav och tasks
- tidrapportering
- commits över tid
- Wiki som levande dokumentation
- testfall och testresultat
- reflektion över vad som fungerade och inte fungerade
- branching strategy och partnerövning
- eventuell automation och deployment

AI ska därför alltid koppla kodarbete till GitLab-spår när det är relevant.

## Faktisk CI/CD och Cumulus-deployment

Projektets deploymentmodell är:

```text
local branch -> MR -> main -> GitLab verify -> GitLab build -> manual deploy_production -> Cumulus containers
```

Viktigt:

* Cumulus är runtime-server för containrar, inte arbetskatalog för koden.
* GitLab CI/CD bygger webapp, compile-server och Caddy som Docker-images.
* Deploy-jobbet skapar Docker context mot Cumulus via SSH.
* `deploy_production` är manuellt och ska bara köras när verify och build är gröna.
* AI ska inte föreslå manuell kloning av repot på Cumulus.

Läs även `ai-context/13_cicd_deployment_context.md` vid deploymentfrågor.
