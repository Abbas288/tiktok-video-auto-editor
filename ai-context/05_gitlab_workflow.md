# GitLab Workflow (05_gitlab_workflow.md)

## Syfte

Denna fil styr hur Gemini ska hjälpa Abbas med GitLab, issues, branches, commits, merge requests, estimates, spend, milestones, iterations och Wiki.

GitLab är projektets arbetsyta för:
- kod
- Wiki
- krav
- issues
- testfall
- iterationsrapporter
- versionshantering
- tidsrapportering
- spårbarhet mellan krav, implementation och test

Gemini ska använda denna fil när den:
- skriver eller granskar issues
- föreslår milestones eller iterations
- formulerar commits
- hjälper till med Wiki
- kopplar krav till testfall
- sammanfattar iterationer
- bedömer om en issue kan stängas
- förklarar `git status`, `git diff`, staging eller commit-flöde

## Grundprincip

Varje feature ska kunna spåras genom hela kedjan:

Krav -> Issue -> Branch -> Implementation -> Testfall -> Verifiering -> Dokumentation -> Commit/Merge Request

Gemini får inte behandla kod som fristående från krav, testning och dokumentation.

## GitLab Wiki

Wikin är kursens huvudsakliga dokumentationsyta.

Gemini ska se wikin som:
- projektets minne
- platsen där beslut förklaras
- platsen där krav, risker, testning och iterationer följs upp
- underlag för examination, presentation och rapport

Dokumentation ska vara lätt att uppdatera. Hellre kort, korrekt och levande än lång och död.

När Gemini föreslår implementation ska den också ange om någon Wiki-sida behöver uppdateras.

## Issue-arbete

När Gemini hjälper till med en issue ska den följa detta:

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
- FUNCTIONAL REQUIREMENT: beskriver vad systemet ska göra.
- NON-FUNCTIONAL REQUIREMENT: beskriver kvalitet, stabilitet, prestanda, säkerhet eller användbarhet.
- TASK: konkret arbetsuppgift.
- BUG: fel som ska åtgärdas.
- TEST: testfall eller testsvit.
- DOCS: dokumentationsarbete.
- SPIKE: kort undersökning för att minska risk.
- RISK: risk eller åtgärd.

## GitLab-detaljer som kan användas vid behov

Gemini kan föreslå följande när det hjälper Abbas strukturera issues:

- labels för typ av arbete, till exempel `feature`, `bug`, `docs`, `test`, `risk`, `spike`
- weight eller prioritet när flera issues konkurrerar
- beroenden mellan issues när en uppgift blockerar en annan
- Design Manager eller Figma-länk om UI-skisser, wireframes eller designbeslut behöver diskuteras
- milestone för större leverans eller kursiteration
- iteration cadence om återkommande sprintliknande cykler används

Regel:
Dessa verktyg ska bara användas när de hjälper projektet. Gemini ska inte skapa administrativt brus.

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

Gemini ska använda dessa som projektets faktiska backlog, men ska kontrollera aktuell GitLab-status om Abbas klistrar in ny status.

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
```

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
```

## Före commit

Kör:

```bash
git status
git diff
npm run lint
npx tsc --noEmit
```

Om UI/appstruktur påverkas:

```bash
npx expo start
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
- [ ] Manuellt testfall TCx.y passerar

## Risker

## Dokumentation
```

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

Abbas har haft problem med att komma igång med tidsloggning och GitLab Iterations. Gemini ska därför vara extra tydlig med konkreta steg.

## Kanban och sprint

Använd båda:
- Kanban för daglig överblick: To Do, In Progress, Done.
- Sprint/Iteration för veckans mål och uppföljning.

## `.gitignore`

Projektet kan ha en `.gitignore` i roten och en i appmappen om båda fyller olika syften.

Rimlig modell:
- root `.gitignore`: projektövergripande skräp, AI-context cache, OS-filer, editor-filer, `.env`
- app `.gitignore`: Expo/Node-specifika filer, `node_modules`, `.expo`, build-output

Gemini ska inte slentrianmässigt ta bort en `.gitignore`. Först ska den kontrollera vad varje fil ignorerar.

## Riskhantering i GitLab

Risker ska bli konkreta uppgifter, inte bara text i Wiki.

Exempel:
- Risk: GCS-video laddar inte i Expo.
- Spike: testa signerad video-URL i Expo Go.
- Acceptanskriterium: video kan öppnas eller felhantering visas.
- Testfall: TC för lyckad laddning och TC för bruten URL.

Andra risker för Abbas projekt:
- Template-JSON ändras av upstream AI/API.
- Compile-server förväntar sig annat payload-format.
- Expo-video fungerar olika på emulator och fysisk enhet.
- AI-genererad kod skapar falsk trygghet.
- Scope creep gör att editor-UI blir för stort innan kärnflödet fungerar.

## Vad Gemini inte får göra

Gemini får inte:
- föreslå commit utan verifiering
- blanda flera features i samma commit om det går att undvika
- ignorera untracked files
- anta att ändringar är korrekta utan diff
- skriva över stora filer utan anledning
- skapa features som inte är kopplade till issue eller krav
- behandla Ida eller Wasim som kravkälla för Abbas repo

## GitLab och examination

GitLab används för att visa att Abbas arbetar strukturerat:
- planering per iteration
- issues som krav och tasks
- tidrapportering
- commits över tid
- Wiki som levande dokumentation
- testfall och testresultat
- reflektion över vad som fungerade och inte fungerade

Gemini ska därför alltid koppla kodarbete till GitLab-spår när det är relevant.

## Iterationsrapport

När Gemini skriver iterationsrapport ska den få med:
- mål för iterationen
- vad som planerades
- vad som blev gjort
- vad som inte blev klart
- tidsestimat jämfört med faktisk tid
- vilka issues som berördes
- vilka testfall som kördes
- vilka risker som upptäcktes
- vad som flyttas till nästa iteration
- personlig reflektion i Abbas ton
