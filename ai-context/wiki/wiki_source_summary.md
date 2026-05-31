# Wiki-källsammanfattning

## Syfte

Denna fil används för att Gemini snabbt ska förstå vilka wiki-sidor som redan finns och vad de bidrar med. Den ersätter inte GitLab Wiki, men minskar risken att Gemini skriver ny dokumentation som bryter mot befintlig stil.

## Home och navigering

Wikin har en tydlig startsida med länkar till:

* Documentation
* Planning
* Method
* Testing
* Sprints
* Delivery

Detta visar att projektet dokumenteras som en komplett mjukvaruleverans, inte bara som kod.

## Project Vision

Project Vision definierar:

* LeTrend Mobile som The TikTok Catalyst
* målgruppen restauranger, caféer och barer
* problemet med TikTok-kultur och tidsbrist
* lösningen som en AI-driven template-baserad editor
* kärnvärdet att användaren kan skapa trendanpassade videos utan djup redigeringskunskap

## Project Plan

Project Plan förklarar:

* att projektet både är kursprojekt och potentiell riktig produkt
* att MVP:n ska vara liten men stabil
* att AI gör kod snabbare men tidsestimering svårare
* att dokumentation fungerar som projektets minne
* att iterativ planering är viktigare än en perfekt statisk plan

## Risk Management

Risk Management visar skiftet från tekniska produktionsrisker till kvalitetsrisker.

Viktigaste risk:

```text
Jag producerar kod snabbare än jag hinner verifiera den.
```

Konsekvens för Gemini:

* föreslå aldrig stor kod utan tydlig scope
* prioritera verifiering
* påminn om test och diff
* skapa issues och testfall före implementation

## Development Strategy

Development Strategy beskriver AI som motor och Abbas som ratt.

Gemini ska tolka detta som:

* AI hjälper med boilerplate och första implementation
* Abbas styr arkitektur och kvalitet
* snabb kod kräver snabbare verifiering
* feature branches och MR används för spårbarhet

## Quality Assurance

Quality Assurance definierar Abbas Definition of Done:

* tydliga krav
* acceptanskriterier
* testfall
* verifiering
* validering mot användarbehov
* dokumenterade risker

Gemini ska använda detta som standard när den skapar issues, testfall, MR-beskrivningar eller refaktorplaner.

## Test Focus

Test Focus beskriver tre nivåer:

1. Manuell UX-verifiering.
2. Stresstestning och edge cases.
3. Automatiserad testning av kärnlogik.

Gemini ska inte överdriva automatisering. I detta projekt är automatiska tester främst för domänlogik, helpers, store och komponenter. Större editorflöden kräver fortfarande manuell verifiering.

## Testrapporter

Testrapporterna visar hur Abbas dokumenterar verifiering:

* miljö
* testtyp
* testobjekt
* testare
* scope och out of scope
* testresultat per testfall
* kommentarer om fail, fix och pass
* reflektion och begränsningar

Gemini ska skriva nya testrapporter med samma struktur.

## Iterationsrapporter

Iterationsrapporterna visar progression:

* vecka 1 till 2: orientering, teori och projektgrund
* vecka 3: GitLab, krav, teststrategi och planering
* vecka 4: strategibyte och AI som hävstång
* vecka 5: Template-JSON, repository, parsing och Zustand-grund
* vecka 6: Docker, Cumulus, HTTPS och deployment
* vecka 7: editor, timeline, overlays, fullscreen och CI/CD
* vecka 8: scene effects, audio, transitions och refactor

Gemini ska bevara denna kronologi när nya sammanfattningar skapas.

## Delivery

Delivery innehåller demo och post mortem som slutartefakter.

Gemini ska hjälpa Abbas skapa material som visar:

* vad som faktiskt fungerar
* vilka krav som demonstreras
* hur det testats
* vilka begränsningar som finns kvar
* hur projektet kan fortsätta efter kursen

## Viktig stilregel

Wikin är inte bara neutral teknisk dokumentation. Den visar Abbas resonemang, beslut och lärande. Ny dokumentation ska därför kombinera:

* konkret projektstatus
* teknisk precision
* ärlig reflektion
* koppling till krav, test och kurs
