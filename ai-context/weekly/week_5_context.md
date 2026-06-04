# Vecka 5: Versionshantering, GitLab och vidareutveckling

## Tema

Versionshantering, Git-arbetsflöden, GitLab från krav till implementation, software evolution, configuration management, branching strategies och partnerövning.

## Kursens fokus

- Läsa kapitel 9 och 25.
- Förstå hur mjukvara förändras över tid.
- Arbeta med Git, branches, commits, merge och remote repository.
- Koppla krav, issues och implementation i GitLab.
- Förbereda mer avancerad versionshantering och kvalitetssäkring.
- Förstå configuration management som hantering av versioner, konfigurationer, builds och releases.
- Genomföra partnerövning i en annan students repo.
- Förbereda presentation vecka 6 om partnerövning, branching strategy och GitLab automation.

## Abbas projektfokus

Abbas projekt börjar nu gå från grundstruktur till vidareutveckling. Därför blir versionshantering extra viktig.

Viktigt:
- varje commit ska vara begriplig
- varje issue ska ha tydlig koppling till krav och test
- varje större ändring ska kunna förklaras i wiki
- gamla fungerande flöden ska regressionstestas när nya läggs till
- route-stabilisering, Template-JSON och EditSession ska inte blandas i samma commit som orelaterad deployment eller dokumentation
- AI-genererad kod ska granskas extra noggrant eftersom många filer kan ändras snabbt

## Git-arbetsflöde

AI ska använda denna mentala modell:

`working directory -> staging area -> local repository -> remote repository`

Praktiskt:
- `git status` före varje commit
- `git diff` innan staging
- `git diff --staged` efter staging
- `git add <fil>` när bara specifika filer ska med
- `git commit` lokalt
- `git push` till GitLab

Kom ihåg:
- `git commit -a` tar inte med nya filer.
- untracked files måste granskas innan de läggs till.
- `git add .` kan råka ta med oönskade filer.

## Branches

Branches är användbara även när Abbas arbetar ensam.

Rekommenderat:
- `main` ska vara stabil
- större feature byggs på feature branch
- merge efter test och DoD
- radera branch när arbetet är sammanfört

Standardstrategi för Abbas:
- short-lived feature branches
- tydligt branch-namn kopplat till issue eller fix
- en feature eller fix per branch

Exempel:

```bash
git checkout -b 42-fix-route-template-loading
```

## Branching strategies

### Short-lived feature branches

Passar Abbas projekt bäst.

Varför:
- små ändringar
- lättare diff-granskning
- snabbare merge
- `main` hålls stabil
- mindre risk för stale code

### Git Flow

Ofta för tungt för Abbas projekt.

Varför:
- kräver flera långlivade branches
- passar bättre när projektet har flera parallella releaser
- kan skapa mer process än värde i ett kort studentprojekt

### Release Flow

Inte prioriterat om projektet inte har flera stabila produktversioner.

### Långlivade branches

Bör undvikas.

Risker:
- mergekonflikter
- gammal kod
- svårare regressionstestning
- otydlig historik

## Configuration management

AI ska tänka på:
- vilka filer hör till koden
- vilka filer är miljö, cache eller byggartefakter
- vilka konfigurationsfiler behövs
- vilka miljövariabler ska aldrig committas
- hur ändringar kan spåras över tid
- vilken version som faktiskt testades

För Abbas projekt gäller:
- `.env` ska inte committas
- `.env.example` bör finnas när miljövariabler införs
- GCS/Supabase/compile-server URLs ska hanteras som konfiguration
- package-lock ska committas om npm används
- `.dockerignore` behövs när Docker används
- `dist`, cache och genererade filer ska inte committas utan tydligt beslut

## Software evolution

Abbas app kommer förändras när Template-JSON, AI/API och compile-servern utvecklas.

AI ska därför:
- undvika hårdkodade antaganden om JSON som kan ändras
- isolera API-format och parsning
- föreslå adapters eller repositories när externa format ändras
- skydda EditSession som intern modell
- låta Template-JSON vara bryggan mellan upstream AI/API och appens editorflöde
- föreslå regressionstest när parser, store eller route-laddning ändras

## Partnerövning

Syfte:
- träna Git-arbete i någon annans repo
- förstå främmande kod innan ändring
- arbeta med branch, commit och eventuell MR
- reflektera över program understanding

Rimligt upplägg:
1. Ge partner Developer-rättighet i GitLab.
2. Kontrollera att egen main är ren eller att backup finns.
3. Välj en mycket liten ändring i partnerns repo.
4. Skapa branch.
5. Gör ändringen.
6. Kör rimliga tester.
7. Skapa commit eller MR.
8. Dokumentera vad som var svårt att förstå.

Begränsning:
- max cirka 2 timmar
- ingen stor feature
- ingen stor refaktorering
- partnerns kod ska inte styra Abbas krav

## GitLab automation

GitLab automation kan senare användas för:
- lint
- TypeScript
- automatiska tester
- Expo Web build
- Docker build
- MR-kontroller

Viktigt:
Automation ersätter inte förståelse. Den kontrollerar bara kända steg och gör processen mer spårbar.

## Presentation vecka 6

Material till presentation kan innehålla:
- vad partnerövningen gick ut på
- vilken liten ändring som gjordes
- varför program understanding var viktigt
- vilken branching strategy gruppen valde
- varför short-lived feature branches passar studentprojektet
- vilka delar GitLab kan automatisera
- hur detta kopplas till kapitel 9 och 25

## Risker

- ändringar i Template-JSON bryter appen
- snabb AI-kod gör Git-historiken svår att följa
- för stora commits gör felsökning svårare
- miljövariabler eller hemligheter råkar committas
- appen saknar regressionstest när foundation ändras
- partnerövningen blir för stor
- GitLab-processen blir dokumentation utan koppling till verklig kod
- branch lever för länge och blir svår att merga

## Praktisk koppling till kod

När AI föreslår ändring ska den också föreslå:
- vilken issue ändringen hör till
- vilka filer som påverkas
- vilka tester som ska köras
- vilken commit-typ som passar
- om `.gitignore`, `.env.example`, `.dockerignore` eller dokumentation behöver ändras

Innan commit:

```bash
git status
git diff
npm run lint
npx tsc --noEmit
```

Om aktuell issue eller testfall kräver automatiska tester, eller om testkod ändras:

```bash
npm test
```

Om filer är staged:

```bash
git diff --staged
```

Vid UI-ändring:

```bash
npm start
```

## Standup-formulering

Abbas bör kunna säga:

"Den här veckan fokuserade jag på versionshantering och spårbarhet. Jag arbetade med små branches, granskade diff innan commit och kopplade ändringar till issues och testfall. Jag reflekterade också över att AI-genererad kod gör Git-disciplin viktigare, eftersom många filer kan ändras snabbt och måste kunna förklaras i efterhand."
