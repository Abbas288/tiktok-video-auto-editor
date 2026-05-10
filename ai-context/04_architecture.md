# Arkitektur (04_architecture.md)

## Syfte

Denna fil beskriver Abbas arkitektur och ansvarsfördelning mellan mobilapp, upstream AI/API, Template-JSON, EditSession, backend/compile-server och FFmpeg.

Gemini ska använda denna fil när den:
- föreslår kodstruktur
- skriver Wiki eller rapport om arkitektur
- förklarar dataflöde
- separerar frontend, backend och externa services
- granskar om kod hamnar i rätt lager
- planerar tester för Domain, Application eller Infrastructure

## Övergripande dataflöde

Appen följer detta huvudflöde:

TikTok URL -> AI/API video analysis -> Template-JSON -> EditSession -> Editor UI -> Preview/Timeline -> Compile-payload -> backend/compile-server -> Rendered video via FFmpeg

## Ansvarsfördelning

### Upstream AI/API

Ansvar:
- tar emot eller arbetar utifrån en specifik TikTok-URL
- analyserar den specifika videons redigeringsmönster
- extraherar struktur, timing, scener, overlays, stil och effekter
- returnerar strukturerad JSON-data

Detta sker utanför mobilappen.

### Mobilappen

Ansvar:
- konsumera Template-JSON
- validera och normalisera data
- bygga EditSession
- visa home, editor och preview
- hantera timeline och scenval
- hantera text overlays, transitions, effects och audio
- skapa compile-payload
- kommunicera med backend/compile-server

Mobilappen ska inte:
- analysera TikTok-videor i frontend
- köra FFmpeg lokalt
- generera Supabase/GCS-data
- fungera som generell trendcrawler
- anta att mockTemplate är samma sak som verklig API-data

### Backend/compile-server

Ansvar:
- ta emot compile-payload
- hämta eller ta emot relevant media
- köra FFmpeg
- skapa färdig MP4
- returnera renderad video eller video-URL

### FFmpeg

Ansvar:
- faktisk videoprocessering
- klippning enligt redigeringsbeskrivning
- overlays
- transitions
- effekter
- ljudmix
- exportformat

## Lagerarkitektur

Appen delas upp i fyra logiska lager.

## 1. Presentation Layer

Teknik:
- React Native
- Expo Router
- UI-komponenter

Ansvar:
- visa screens
- hantera användarinteraktion
- visa timeline
- visa preview
- visa editor controls
- navigera mellan routes

Mappar:
- `app/`
- `src/components/`

Exempel:
- `app/(home)/index.tsx`
- `app/(editor)/[id].tsx`
- `app/(preview)/[id].tsx`
- `app/_layout.tsx`

Regel:

Presentation-lagret får inte innehålla tung affärslogik eller känna till detaljer om API-format utöver det som behövs för rendering.

## 2. Application Layer

Teknik:
- Zustand
- application services

Ansvar:
- hålla EditSession
- hantera selected scene
- orkestrera flödet mellan UI och domain
- hantera state transitions
- hålla användarens ändringar innan compile

Mappar:
- `src/store/`
- framtida `src/application/`

Exempel:
- `src/store/useEditSession.ts`

Regel:

Application-lagret får samordna, men ska inte blanda in UI-rendering eller låg nivå nätverkskod.

## 3. Domain Layer

Teknik:
- TypeScript
- rena funktioner
- schemas och types

Ansvar:
- definiera Template-JSON-kontrakt
- definiera Scene, TextOverlay, Transition, Effect, Music
- definiera EditSession
- validera Template-JSON
- bygga EditSession från Template
- bygga compile-payload från EditSession

Mappar:
- `src/types/`
- framtida `src/domain/`

Exempel:
- `src/types/template.ts`
- framtida `parseTemplate`
- framtida `buildEditSession`
- framtida `buildCompilePayload`

Regel:

Domain-lagret ska vara så oberoende som möjligt från React Native och Expo.

## 4. Infrastructure Layer

Teknik:
- API-klienter
- nätverk
- Supabase
- GCS
- compile-server
- filsystem

Ansvar:
- hämta templates
- hämta signerade media-URL:er
- skicka compile-payload
- ta emot renderingsresultat
- kapsla externa beroenden

Mappar:
- framtida `src/infrastructure/`
- framtida `src/services/`

Exempel:
- framtida `TemplateApiClient`
- framtida `RenderApiClient`
- framtida `GcsMediaResolver`

Regel:

Infrastructure ska kunna mockas så att tester inte kräver riktiga API-anrop.

## Viktiga arkitekturkomponenter

### Template-JSON

Extern redigeringsbeskrivning från upstream AI/API.

### EditSession

Internt state för användarens redigeringsarbete.

### Timeline

UI-representation av scener och timing.

### Preview

Visuell kontroll av hur redigeringen ser ut innan rendering.

### CompilePayloadFactory

Framtida domain/application-komponent som översätter EditSession till backendens format.

### RenderApiClient

Framtida infrastructure-komponent som skickar payload till backend/compile-server.

## Viktiga runtime-flöden

### Template-laddning

`Template source -> parseTemplate -> Template -> buildEditSession -> useEditSession -> Editor UI`

Risker:
- trasig JSON
- saknade scener
- negativ duration
- överlappande tider
- saknad `sourceVideoUrl`
- GCS-länk utan signerad URL

### Scenbaserad editor

`EditSession -> activeScene -> VideoPreview seek(startSeconds) -> SceneTimeline -> användarändring -> store update`

Risker:
- scen-ID saknas
- navigation öppnas med fel template-ID
- UI visar scen men store saknar aktiv session
- preview och timeline hamnar ur synk

### Text overlay

`Scene.textOverlays -> render overlays by timing -> edit overlay -> update EditSession -> preview updated`

Risker:
- overlay visas utanför sin tidsperiod
- position hamnar utanför skärm
- färg eller fontstorlek saknar validering
- ändring sparas i UI men inte i store

### Compile och export

`EditSession -> buildCompileRequest -> compileApi.post -> backend/compile-server -> FFmpeg -> MP4 -> preview/export`

Risker:
- payload matchar inte serverns format
- upload misslyckas
- servern saknar FFmpeg
- lång kompilering saknar progress
- fel videoformat vid export

## Route-struktur

Aktuell eller planerad Expo Router-struktur:

```text
app/
  _layout.tsx
  (home)/
    index.tsx
  (editor)/
    [id].tsx
  (preview)/
    [id].tsx
```

Route-regler:
- Home ska lista templates eller mockade projekt.
- Editor ska läsa route-param `id` och försöka ladda motsvarande template/session.
- Preview ska visa aktuell session eller färdig renderad video beroende på feature-steg.
- Felaktigt `id` ska ge tydligt error state, inte krasch.

## State-principer

`useEditSession` ska vara den centrala platsen för aktiv editorstate.

Bör innehålla eller senare kunna innehålla:
- `currentTemplate`
- `currentSession`
- `activeSceneId`
- `isDirty`
- `loadTemplate(template)`
- `selectScene(sceneId)`
- `updateTextOverlay(sceneId, overlayId, patch)`
- `updateSceneEffect(sceneId, effectPatch)`
- `resetSession()`

Regler:
- Store ska inte själv hämta all extern data om det gör testning svår.
- Store-actions ska vara små och begripliga.
- Kritiska stateövergångar ska kunna testas.

## Beslutsregel för framtida implementation

När en ny feature ska byggas, välj lösningen som:
1. stöder MVP-flödet
2. kan testas isolerat
3. inte blandar frontend med backendansvar
4. går att förklara i kursens Wiki eller presentation
5. minskar risken för dolda AI-fel


## Arkitekturella principer

- Separation of Concerns: varje lager har eget ansvar.
- Testability: domain och application ska kunna testas utan UI.
- Mockability: externa beroenden ska kunna ersättas i test.
- Template-driven: editorflödet styrs av Template-JSON och EditSession.
- Verifiering före volym: bygg hellre liten testbar arkitektur än stor osäker demo.
- Ingen lokal FFmpeg i mobilappen.
- Ingen TikTok-analys i frontend.

## Risker

- Om UI direkt tolkar rå JSON blir appen svårtestad.
- Om EditSession saknar tydligt schema blir compile-payload osäker.
- Om backendformat antas utan test kan rendering fallera sent.
- Om mockTemplate skiljer sig från riktig API-data kan appen ge falsk trygghet.
- Om AI skapar för mycket kod utan arkitekturlager blir vidareutveckling dyr.
