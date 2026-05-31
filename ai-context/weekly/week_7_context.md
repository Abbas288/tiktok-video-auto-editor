# Vecka 7: CI/CD, QA-start och risk

## Syfte

Denna fil sammanfattar vecka 7 för Abbas projekt.

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

Abbas ska visa att projektet inte bara fungerar lokalt. Det ska finnas ett tydligt verifieringsflöde.

Minsta standard:

```bash
npm run lint
npm run typecheck
npm test
```

I appen används:

```bash
npm run verify
```

## CI/CD-principer

* Pipeline ska ge snabb feedback.
* Main ska skyddas från uppenbart trasig kod.
* Build och deploy ska vara reproducerbara.
* Secrets ska ligga i GitLab CI/CD variables, inte i repo.
* Deployment ska vara förstådd, inte bara kopierad.

## Koppling till Cumulus

Cumulus kan användas för webbdeployment eller backend/compile-server-experiment. Det ska inte blandas in i vanlig appfeature om issue inte handlar om deployment.

## QA-start

QA betyder att hårdtesta appen mot krav och testfall.

För Abbas betyder detta:

* gå igenom varje user story
* kontrollera manuella testfall
* kontrollera automatiska tester
* skapa fix-issues för fel
* skapa refactor-issues för kod som blivit svår att underhålla

## Risker att dokumentera

* AI-genererad kod kan se rätt ut men vara fel.
* Template-JSON kan vara ogiltig.
* Mediafiler kan saknas eller vara otillgängliga.
* Browser och mobil hanterar video olika.
* FFmpeg-rendering matchar inte preview i stora drag.
* CI/CD kan ge falsk trygghet om testerna är för smala.

## Bra för presentation

Säg att projektet använder verifiering som kvalitetsspärr:

`npm run verify` kör lint, TypeScript-kontroll och tester. Det minskar risken att AI-genererad kod går in i projektet utan kontroll.
