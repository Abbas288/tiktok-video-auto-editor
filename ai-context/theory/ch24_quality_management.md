# Kapitel 24: Quality Management

## 1. Kärna i kapitlet

Kapitel 24 handlar om quality management, alltså hur man organiserar arbete så att mjukvaran får rätt kvalitet. Kvalitet handlar inte bara om att programmet startar. Det handlar om att systemet uppfyller krav, är begripligt, testbart, underhållbart och tillräckligt pålitligt för sin användning.

Quality management omfattar kvalitetsplanering, standarder, granskningar, mätning och förbättring.

## 2. Viktiga begrepp

- Software quality: hur väl mjukvaran uppfyller uttalade och förväntade behov.
- Quality management: aktiviteter som styr och kontrollerar kvalitet.
- Quality assurance: processer som ska säkerställa kvalitet.
- Quality planning: bestämma vilka standarder och mål som gäller.
- Quality control: kontrollera att produkten uppfyller standarder.
- Reviews: mänsklig granskning av krav, design, kod eller dokumentation.
- Standards: överenskomna regler för arbete och produkter.
- Metrics: mått som kan stödja bedömning av kvalitet.
- Process quality: kvalitet i arbetssättet.
- Product quality: kvalitet i det som levereras.

## 3. Relevans för 1DV613

I kursen ska Abbas visa ett kvalitetstänk. Det innebär:

- Definition of Done
- testplan
- testfall
- kodstandard
- JSDoc där det behövs
- GitLab-spårbarhet
- Wiki som levande dokumentation
- reflektion kring AI-genererad kod

Kvalitet är alltså både produkt och process.

## 4. Relevans för Abbas projekt

Abbas app har flera kvalitetskrav:

- Template-JSON ska valideras.
- EditSession ska vara korrekt.
- Timeline ska visa rätt scener.
- Preview ska vara stabil.
- Compile-payload ska matcha backendens förväntningar.
- Appen ska inte krascha vid trasig data.
- Koden ska vara begriplig och testbar.

AI-risk gör quality management extra viktigt. AI kan skapa mycket kod, men kvalitet kräver mänsklig granskning och verifiering.

## 5. När Gemini ska använda kapitlet

Använd detta kapitel när Gemini ska:

- uppdatera Definition of Done
- granska kodkvalitet
- skapa checklistor
- skriva QA-del i rapporten
- föreslå testning före commit
- skapa granskningsfrågor för AI-kod
- förbättra Wiki-struktur
- bedöma om dokumentation är tillräcklig

## 6. Vad som måste synas i wiki, rapport, testning eller presentation

Wiki ska visa:

- kvalitetsmål
- teststrategi
- DoD
- kodstandard
- dokumentationsstandard
- risker och åtgärder

Rapporten ska visa:

- hur Abbas säkrat kvalitet
- vad som testats
- vad som inte testats
- vilka kvalitetsrisker som kvarstår
- hur AI-genererad kod hanterats

Presentation kan säga:

"Kvaliteten i projektet bygger inte på att AI producerar mycket kod. Den bygger på tydliga krav, testbar arkitektur, manuella testfall, lint, TypeScript och granskning av diff före commit."

## 7. Praktisk koppling till projektet

Gemini ska använda följande kvalitetscheck före commit:

- Krav finns.
- Acceptanskriterier finns.
- Kod följer lagerarkitektur.
- `npm run lint` passerar.
- `npx tsc --noEmit` passerar.
- Manuella testfall har körts.
- Edge cases har testats eller dokumenterats.
- `git diff` är granskat.
- Ingen orelaterad kod följer med.
- JSDoc finns där det krävs.

Kvalitet i Abbas projekt betyder:

- inte mest kod
- inte snyggast demo
- inte flest features

Kvalitet betyder verifierat kärnflöde som går att förklara, testa och vidareutveckla.
