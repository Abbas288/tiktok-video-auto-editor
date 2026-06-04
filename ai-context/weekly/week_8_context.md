# Vecka 8: Automatiserad testning

## Syfte

Denna fil sammanfattar vecka 8 och hur den påverkar Abbas projekt.

## Fokus

Vecka 8 handlar om automatiserad testning, testnivåer och hur tester stödjer kvalitet.

Kursen lyfter:

* enhetstestning
* integrationstest
* systemtest
* AAA-mönster
* Jest och Supertest i Node-demo
* React Native och Expo-tester i Abbas projekt
* CI/CD som kör tester automatiskt
* testning som skydd mot falsk trygghet

## Relevans för Abbas projekt

Abbas projekt bör prioritera tester som går snabbt och testar rätt nivå.

### Domain

Testa ren logik:

* template parsing
* scene timing
* transitions
* overlay position
* scene video readiness
* compile-payload
* audio volume

### Application

Testa orchestration:

* compile controller
* project overview controller där det är rimligt
* scene video source factory

### Infrastructure

Testa felhantering och externa kontrakt:

* template repository
* template import service
* save/download/open
* video reference

### Presentation

Testa viktig interaktion:

* project cards
* template guide
* compile panel
* transition picker
* text overlays

## AAA

Tester ska helst följa:

1. Arrange: sätt upp data.
2. Act: kör funktionen eller interaktionen.
3. Assert: kontrollera resultat.

## Falsk trygghet

Mockar är bra men kan dölja riktiga integrationsproblem. AI ska därför inte påstå att appen är helt testad bara för att unit tests passerar.

Kombinera:

* automatiska tester
* manuell testning från GitLab testfall
* visuell kontroll där UI påverkas
* faktisk compile/export när exportflödet ändras

## Definition of Done

För app:

```bash
npm run lint:fix
npm run verify
```

För compile-server:

```bash
npm run lint:fix
npm run verify
```

## Bra för presentation

Förklara att testningen är kopplad till AI-risk:

AI kan generera kod som ser rimlig ut. Tester skyddar mot ogiltig data, trasiga edge cases och regressionsfel i template, preview och compile-flow.
