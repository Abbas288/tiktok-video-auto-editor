# Kapitel 5: System Modeling

## 1. Kärna i kapitlet

Kapitel 5 handlar om system modeling, alltså att skapa abstrakta modeller av ett system för att förstå, diskutera och dokumentera det. Modeller hjälper utvecklare, kunder och andra intressenter att se systemets struktur, beteende, data och interaktioner utan att behöva läsa all kod.

Modeller är förenklingar. De visar vissa aspekter och döljer andra. Därför måste AI välja modelltyp efter syfte.

## 2. Viktiga begrepp

- System model: förenklad representation av ett system.
- Context model: visar systemets omgivning och externa beroenden.
- Interaction model: visar hur användare eller andra system interagerar med systemet.
- Structural model: visar systemets delar och relationer.
- Behavioral model: visar hur systemet beter sig över tid.
- UML: standardiserat sätt att rita mjukvarumodeller.
- Use case: beskriver användarinteraktion med systemet.
- Sequence diagram: visar meddelanden mellan komponenter över tid.
- Class diagram: visar typer, klasser och relationer.
- State machine: visar möjliga tillstånd och övergångar.

## 3. Relevans för 1DV613

Kursen kräver att Abbas kan förklara hur systemet är uppbyggt. Diagram och modeller gör det lättare att presentera arkitektur, krav och implementation.

I standups och presentationer är modeller särskilt viktiga eftersom de gör teknisk struktur begriplig utan att läraren behöver läsa koden.

## 4. Relevans för Abbas projekt

Abbas projekt har flera naturliga modeller:

### Context model

Visar externa aktörer och system:

- användare
- AI/API video analysis
- Supabase
- GCS
- mobilapp
- backend/compile-server
- FFmpeg

### Data flow model

Visar:

TikTok URL → AI/API video analysis → Template-JSON → EditSession → Editor UI → Preview/Timeline → Compile-payload → backend/compile-server → Rendered video via FFmpeg

### Class eller type model

Visar relationer mellan:

- Template
- Scene
- TextOverlay
- Transition
- Effect
- Music
- EditSession
- CompilePayload

### Interaction model

Visar användarflöde:

1. användaren öppnar appen
2. väljer template
3. appen bygger EditSession
4. användaren granskar timeline
5. användaren hoppar till scen
6. användaren gör ändringar
7. appen skapar compile-payload

## 5. När AI ska använda kapitlet

Använd detta kapitel när AI ska:

- skapa Mermaid-diagram
- förklara arkitektur i Wiki
- göra klassdiagram eller flödesdiagram
- beskriva hur Template-JSON och EditSession hänger ihop
- visa ansvar mellan mobilapp och backend
- skapa slideinnehåll om systemets uppbyggnad
- förklara en kodstruktur utan att visa för mycket kod

## 6. Vad som måste synas i wiki, rapport, testning eller presentation

Wiki och rapport bör innehålla minst:

- övergripande context/data flow
- lagerarkitektur
- typmodell för Template-JSON och EditSession
- flöde från editor till compile-payload

Presentation bör visa ett förenklat diagram, inte en jättestor teknisk karta. För Abbas är det viktigaste att visa:

- AI/API är upstream
- mobilappen konsumerar Template-JSON
- EditSession är internt state
- compile-server kör FFmpeg

## 7. Praktisk koppling till projektet

När AI hjälper med diagram ska det hålla rätt detaljnivå:

- För slides: få komponenter, tydliga pilar, brett och läsbart.
- För Wiki: mer detaljerat med ansvar per lager.
- För kodarbete: fokusera på typer och dataflöde.

Exempel på Mermaid-flöde AI kan använda:

```mermaid
flowchart LR
  A[TikTok URL] --> B[AI/API video analysis]
  B --> C[Template-JSON]
  C --> D[EditSession]
  D --> E[Editor UI]
  E --> F[Preview/Timeline]
  F --> G[Compile-payload]
  G --> H[backend/compile-server]
  H --> I[Rendered video via FFmpeg]
```

Modeller ska inte ersätta kod eller testning. De ska göra kod och testning lättare att förstå.
