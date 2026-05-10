# Kapitel 7: Design and Implementation

## 1. Kärna i kapitlet

Kapitel 7 handlar om hur design omsätts till fungerande kod. Det betonar att design och implementation ofta överlappar, särskilt i moderna och agila projekt. Bra implementation handlar inte bara om att skriva kod snabbt, utan om att skapa kod som går att förstå, testa, återanvända och ändra.

Kapitlet behandlar designprinciper, återanvändning, open source, konfigurationshantering, host-target development och praktiska programmeringsbeslut.

## 2. Viktiga begrepp

- Design: plan för hur systemet ska struktureras.
- Implementation: faktisk kod och integration.
- Object-oriented design: design byggd kring objekt och deras ansvar.
- Design patterns: återanvändbara lösningar på vanliga designproblem.
- Implementation issues: återanvändning, configuration management och host-target development.
- Open source development: använda och bidra till öppen källkod.
- Refactoring: förbättra kodens struktur utan att ändra beteende.
- Code smells: tecken på att kod bör förbättras.
- Host-target development: utveckling på en maskin eller miljö, körning på en annan.

## 3. Relevans för 1DV613

Kursen kräver inte bara att Abbas kodar, utan att han kan visa designbeslut. Det ska synas att han har tänkt på:

- kodstruktur
- testbarhet
- ansvarsfördelning
- konventioner
- JSDoc
- Git-historik
- reflektion kring AI-genererad kod

## 4. Relevans för Abbas projekt

Abbas bygger en React Native/Expo-app där implementationen lätt kan bli rörig om allt läggs i route-filer. Kapitel 7 stödjer en mer hållbar struktur.

Viktiga designbeslut för Abbas:

- Template-JSON ska ha tydliga TypeScript-typer.
- EditSession ska vara appens interna arbetsformat.
- UI ska inte tolka rå JSON direkt.
- `useEditSession` ska hålla state men inte göra allt.
- Domain-funktioner ska vara rena där det går.
- Backend och compile-server ska kapslas i infrastructure.
- `hagen-auto-edit` får inspirera men inte styra appens kod rakt av.

## 5. När Gemini ska använda kapitlet

Använd detta kapitel när Gemini ska:

- skriva eller refaktorera kod
- välja filplacering
- föreslå JSDoc
- separera komponenter
- skapa helpers eller domain functions
- förklara open source eller dependencies
- bedöma om kod är för stor eller för kopplad
- skriva design-del i Wiki eller rapport

## 6. Vad som måste synas i wiki, rapport, testning eller presentation

Wiki och rapport ska visa:

- varför appen har lager
- varför Template-JSON inte läses direkt i UI överallt
- varför Zustand används för EditSession
- varför referensrepo används som inspiration
- hur implementationen byggs stegvis
- hur testbarhet påverkar design

Presentation kan nämna:

"Jag använder AI för hastighet, men designen bygger på tydlig separation mellan UI, state, domänlogik och externa tjänster. Det minskar risken för AI-genererad kod som ser rätt ut men är svår att testa."

## 7. Praktisk koppling till projektet

När Gemini kodar ska kapitel 7 leda till:

- små, fokuserade filer
- tydliga props och typer
- ingen tung logik i screens
- JSDoc på viktiga exporter
- ingen kopiering från hagen-auto-edit utan anpassning
- refaktorering när kod börjar blanda ansvar

Exempel på bra praktisk struktur:

```text
src/types/template.ts
src/store/useEditSession.ts
src/domain/parseTemplate.ts
src/domain/buildEditSession.ts
src/domain/buildCompilePayload.ts
src/services/renderApiClient.ts
```

Exempel på varning:

Om Gemini vill skapa en jättestor `editor.tsx` som gör allt, ska den stoppa och föreslå separering.
