# Kurskrav 1DV613

## Syfte

Denna fil sammanfattar kurskrav och kursförväntningar som påverkar Abbas projekt.

## Kursens kärna

Kursen examinerar inte bara produktens slutläge. Den examinerar utvecklingsprocessen.

Abbas ska kunna visa:

* vision och målgrupp
* krav och backlogg
* issues med acceptanskriterier
* testfall
* implementation steg för steg
* versionshantering
* CI/CD eller verifieringsflöde
* driftsättning eller leveransförståelse
* dokumentation
* reflektion
* presentation och demo
* etiskt ansvar

## MVP-princip

En liten kontrollerad MVP är bättre än ett stort osäkert system. Slutprodukten ska vara möjlig att visa, testa och försvara.

## AI-princip

AI får användas, men Abbas ansvarar för resultatet. Det måste framgå att:

* AI fått rätt kontext
* AI-kod har granskats
* kod har verifierats
* Abbas kan förklara arkitektur och beslut
* falsk trygghet i AI-genererad kod hanteras med tester

## Veckoteman

* Vecka 1 till 2: vision, kursstart, projektidé, grupparbete.
* Vecka 3: krav och testning.
* Vecka 4: implementation och arkitektur.
* Vecka 5: Git, GitLab, branching, software evolution.
* Vecka 6: drift, Docker Compose, produktion, services och återanvändning.
* Vecka 7: CI/CD, deploy pipeline, QA-start och riskanalys.
* Vecka 8: automatiserad testning, testnivåer, AAA, integration och systemtest.
* Vecka 9: slutleverans, etik, professionellt ansvar, QA och överlämning.
* Vecka 10: demo, presentation och avslutande försvar.

## Vecka 7

Kursen förväntar sig:

* förståelse för CI/CD
* pipeline som verifierar kod
* diskussion om deploy pipeline
* fortsatt implementation med testkod
* påbörjad QA mot krav och user stories
* dokumentation av sprint backlog, product backlog och testspecifikation
* gruppdemo av pipeline och uppdaterad app

För Abbas projekt betyder detta:

* `npm run verify` ska vara central quality gate
* GitLab CI ska ses som bevis på kontrollerad process
* riskanalys ska inkludera AI-kod, Template-JSON, media, compile-server och export

## Vecka 8

Kursen fokuserar på automatiserade tester.

Abbas ska kunna visa:

* unit tests för isolerad domain-logik
* application/infrastructure-tester där det är rimligt
* robust felhantering
* edge cases
* AAA-mönster
* mockning utan falsk trygghet
* `npm run verify` som Definition of Done

## Vecka 9 till 10

Kursen går mot slutleverans.

Fokus:

* hårdtesta appen mot backlogg och testfall
* göra produkten mindre men stabil
* presentera tekniska val
* dokumentera begränsningar
* visa etik och ansvar
* förklara vad som händer efter kursen
* göra projektet överlämningsbart

## Etik

Etik handlar inte bara om avsikt. Det handlar även om kvalitet, risker, falska antaganden och konsekvenser.

AI ska hjälpa Abbas visa:

* att mjukvaruutvecklare ansvarar för kvalitet
* att felaktiga system kan skada människor
* att AI-genererad kod måste granskas
* att mätbara processer och tester minskar risk
* att dolda fel inte får mörkläggas
* att dolda antaganden ska minimeras

## Dokumentationskrav

Dokumentation ska vara användbar för:

* lärare
* gruppkamrater
* framtida utvecklare
* Abbas själv inför presentation och rapport

Viktiga dokument:

* Wiki
* README
* AI_PROJECT_GUIDE.md
* ai-context
* GitLab issues
* testfall
* MR-beskrivningar
* iterationsrapporter

## Betygskrav

`ai-context/08_study_guide_context.md` är den styrande ai-context-filen för G- och VG-krav.

Viktiga VG-signaler i Abbas projekt:

* spårbarhet mellan krav, issues, testfall och MR
* release-testöversikt och testrapporter
* minst 10 användbara automatiska metodtester
* automatiska tester i CI/CD
* sekvensdiagram och klassdiagram för centrala flöden
* CI/CD-baserad deployment till Cumulus
* dokumenterad branching strategy
* semantisk versionshantering
* tydlig etik- och AI-reflektion
