# Kapitel 9: Software Evolution

## 1. Kärna i kapitlet

Kapitel 9 handlar om software evolution, alltså att mjukvara nästan alltid måste ändras efter att den skapats. Krav, användare, teknik, marknad, API:er, säkerhetskrav och affärsmål förändras.

Mjukvara som inte kan förändras blir snabbt mindre värdefull. Därför måste system byggas så att de går att förstå, ändra, testa och vidareutveckla.

## 2. Viktiga begrepp

- Software evolution: förändring av mjukvara över tid.
- Maintenance: ändringar efter leverans.
- Corrective maintenance: rätta fel.
- Adaptive maintenance: anpassa till ny miljö.
- Perfective maintenance: förbättra funktionalitet eller kvalitet.
- Preventive maintenance: minska framtida problem.
- Legacy system: äldre system som fortfarande är viktiga.
- Lehman's laws: mjukvarusystem måste förändras eller bli mindre användbara.
- Technical debt: kortsiktiga beslut som gör framtida ändringar dyrare.
- Refactoring: förbättra struktur utan att ändra beteende.

## 3. Relevans för 1DV613

I kursen ska Abbas visa att projektet inte bara fungerar just nu, utan att det finns en genomtänkt väg för vidareutveckling. Slutrapport och post mortem bör diskutera vad som skulle ändras, förbättras eller byggas vidare.

Evolution är också relevant för iterationsrapporter: varje vecka leder till ny kunskap och justering av planen.

## 4. Relevans för Abbas projekt

Abbas projekt är starkt evolutionärt eftersom flera saker kan ändras:

- Template-JSON-formatet från AI/API
- vilka fält som finns i scenes
- hur text overlays representeras
- hur compile-servern vill ha payload
- om GCS-länkar är signerade eller indirekta
- vilka videoformat som stöds
- vilka features som hinner byggas i kursen

Därför måste appen ha tydliga gränser mellan:

- extern Template-JSON
- intern EditSession
- UI
- compile-payload
- backend integration

Om dessa blandas blir varje framtida ändring dyr.

## 5. När AI ska använda kapitlet

Använd detta kapitel när AI ska:

- beskriva vidareutveckling i rapporten
- analysera teknisk skuld
- föreslå refaktorering
- hantera ändrat JSON-schema
- dokumentera risker med API-förändringar
- förklara varför lagerarkitekturen är viktig
- skriva future work
- hjälpa Abbas formulera post mortem

## 6. Vad som måste synas i wiki, rapport, testning eller presentation

Rapporten bör nämna:

- vilka delar som är byggda för förändring
- vilka delar är mest känsliga för förändring
- hur Template-JSON kan versioneras
- hur compile-payload kan behöva anpassas
- hur testning skyddar mot regression
- vad som är teknisk skuld

Presentation kan säga:

"Eftersom AI/API-formatet kan ändras har jag separerat Template-JSON, EditSession och compile-payload. Det gör att förändringar kan hanteras i parser eller builder i stället för i hela UI:t."

## 7. Praktisk koppling till projektet

När AI kodar ska kapitel 9 leda till:

- använd adapter eller parser mellan extern JSON och intern session
- undvik att UI är beroende av rå API-data
- skapa tydliga typer
- skriv regressionstester för kritiska flöden
- dokumentera antaganden om API-format
- refaktorera när en fil får flera ansvar

Framtida robust lösning:

```text
Template-JSON v1 → parseTemplate → EditSession → buildCompilePayload → CompilePayload v1
```

Om `Template-JSON v2` kommer senare ska helst bara parser och typer behöva ändras.
