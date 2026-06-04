# Vecka 7: CI/CD, QA-start och risk

## Syfte

Denna fil sammanfattar vecka 7 och hur CI/CD ska förstås i Abbas projekt.

## Fokus

Vecka 7 flyttar kursen mot automatiserad verifiering, CI/CD, riskanalys och kvalitet.

Kursen lyfter:

* CI/CD pipeline
* deploy through a pipeline
* Cumulus och Docker-baserad deploy
* fortsatta features med testkod
* QA mot krav och user stories
* dokumentation av backlogg, sprint och testspecifikation
* gruppdemo och diskussion

## Viktigt för Abbas projekt

Projektet ska visa att koden inte bara fungerar lokalt. Det ska finnas ett tydligt verifieringsflöde för både app och compile-server.

Lokal standard för app:

```bash
cd tiktok-video-editor-app
npm run verify
```

Lokal standard för compile-server:

```bash
cd compile-server
npm run verify
```

## Faktisk CI/CD-modell

Abbas projekt använder GitLab CI/CD med tre huvudsteg:

1. `verify`
2. `build`
3. `deploy`

Verify kör separata jobb för app och compile-server:

* lint
* TypeScript-kontroll
* tester

Build kör på `main` och skapar Docker-images för:

* webapp
* compile-server
* Caddy

Deploy är manuellt och använder Docker context över SSH för att styra Docker på Cumulus.

## Cumulus-modellen

Cumulus ska köra containrar. GitLab ska bygga och deploya dem. Cumulus ska inte vara arbetskatalog för koden.

Det betyder:

* klona inte repot manuellt på Cumulus
* kör inte lokal kodredigering på Cumulus
* använd Cumulus för logs, containerstatus och runtime-felsökning
* använd GitLab-pipeline för riktig deployment

## CI/CD-principer

* Pipeline ska ge snabb feedback.
* Main ska skyddas från uppenbart trasig kod.
* Build och deploy ska vara reproducerbara.
* Secrets ska ligga i GitLab CI/CD variables, inte i repo.
* Deployment ska vara förstådd, inte bara kopierad.
* Grön pipeline ersätter inte manuell systemtestning av kritiska flöden.

## QA-start

QA betyder att hårdtesta appen mot krav och testfall.

För Abbas betyder detta:

* gå igenom varje user story
* kontrollera manuella testfall
* kontrollera automatiska tester
* testa deployed miljö när issue gäller deployment
* skapa fix-issues för fel
* skapa refactor-issues för kod som blivit svår att underhålla

## Risker att dokumentera

* AI-genererad kod kan se rätt ut men vara fel.
* Template-JSON kan vara ogiltig.
* Mediafiler kan saknas eller vara otillgängliga.
* Browser och mobil hanterar video olika.
* FFmpeg-rendering matchar inte preview pixelperfekt.
* CI/CD kan ge falsk trygghet om testerna är för smala.
* Deployment kan fungera tekniskt men ändå faila i ett manuellt appflöde.

## Bra för presentation

Säg att projektet använder verifiering som kvalitetsspärr:

`npm run verify` och GitLab CI/CD minskar risken att AI-genererad eller trasig kod når `main`. Deployment till Cumulus sker via pipeline och Docker Compose, inte genom manuellt repoarbete på servern.
