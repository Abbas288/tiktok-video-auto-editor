# Kapitel 6: Architectural Design

## 1. Kärna i kapitlet

Kapitel 6 handlar om architectural design, alltså hur ett system delas upp i stora delar och hur dessa delar samverkar. Arkitekturen avgör systemets kvalitetsegenskaper: hur lätt systemet är att testa, ändra, förstå, skala och integrera med andra system.

Arkitektur är inte bara en bild. Det är beslut om ansvar, beroenden, dataflöden och begränsningar.

## 2. Viktiga begrepp

- Software architecture: hög nivå struktur av systemets komponenter och relationer.
- Architectural views: olika perspektiv på samma system.
- Layered architecture: system delas i lager med olika ansvar.
- Repository architecture: delad databas eller gemensam datakälla.
- Client-server architecture: klienter kommunicerar med server.
- Pipe and filter: data transformeras steg för steg.
- MVC: separation mellan model, view och controller.
- Non-functional requirements: kvalitetsegenskaper som påverkar arkitektur.
- Architectural patterns: återanvändbara lösningar på återkommande strukturproblem.

## 3. Relevans för 1DV613

Kursen kräver att Abbas kan förklara arkitektur, inte bara visa filer. Arkitekturen ska kopplas till:

- testbarhet
- GitLab issues
- krav
- risker
- implementation
- presentation
- Wiki

Vecka 4 fokuserar särskilt på implementation och arkitektur. Därför måste arkitekturen vara tillräckligt tydlig för att läraren ska se hur systemet är tänkt att växa.

## 4. Relevans för Abbas projekt

Abbas app bör använda lagerarkitektur:

### Presentation

React Native screens, Expo Router routes och UI-komponenter.

Exempel:

- `app/(home)/index.tsx`
- `app/(editor)/[id].tsx`
- `app/(preview)/[id].tsx`

### Application

Zustand store och flödeslogik.

Exempel:

- `useEditSession`
- selected scene
- laddad template
- användarens edits

### Domain

Rena typer, validering och transformationslogik.

Exempel:

- Template
- Scene
- TextOverlay
- Transition
- Effect
- EditSession
- parseTemplate
- buildCompilePayload

### Infrastructure

Externa beroenden.

Exempel:

- TemplateApiClient
- GCS signed URL resolver
- RenderApiClient
- Supabase client
- compile-server

## 5. När Gemini ska använda kapitlet

Använd detta kapitel när Gemini ska:

- uppdatera `04_architecture.md`
- skapa arkitekturdiagram
- placera ny kod i rätt lager
- bedöma om UI har för mycket logik
- föreslå mappar eller filstruktur
- förklara varför FFmpeg inte körs i mobilappen
- hantera integration med AI/API och compile-server
- skriva arkitekturdel i rapport eller presentation

## 6. Vad som måste synas i wiki, rapport, testning eller presentation

Wiki ska visa:

- dataflödet från TikTok URL till renderad video
- ansvarsfördelning mellan AI/API, mobilapp och backend
- lagerarkitekturen
- varför separation behövs för testbarhet
- risker med externa system

Presentation bör visa en förenklad arkitekturbild:

TikTok URL → AI/API → Template-JSON → EditSession → UI → Compile-payload → backend/FFmpeg

Det måste vara tydligt att:

- mobilappen inte analyserar TikTok-videon
- mobilappen inte kör FFmpeg lokalt
- Template-JSON är bron mellan AI/API och editor
- backend/compile-server är downstream

## 7. Praktisk koppling till projektet

När Gemini skriver kod ska kapitel 6 styra placering och ansvar:

- Screens visar data och tar emot input.
- Zustand håller session state.
- Domain bygger och validerar data.
- Infrastructure pratar med externa tjänster.

Fel arkitektur:

- `app/(editor)/[id].tsx` innehåller parsing, API-anrop, compile-payload och UI i samma fil.

Bättre arkitektur:

- screen läser id och renderar UI
- store håller session
- domain bygger session från template
- service hämtar template
- payload builder skapar compile-data

Arkitekturen ska göra det möjligt att testa JSON-parser, EditSession och compile-payload utan att starta hela appen.
