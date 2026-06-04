# Arkitektur

## Syfte

Denna fil beskriver ansvarsfördelning och dataflöde i Abbas projekt. Använd den vid kod, refactor, testning, rapport, Wiki och presentation.

## Huvudflöde

TikTok URL -> upstream AI/API -> Template-JSON -> parse/validation -> EditSession -> Editor UI -> Preview -> CompilePayload -> compile-server -> FFmpeg -> export.

## Lager

### Presentation

Innehåller:

* Expo Router routes
* screens
* React Native-komponenter
* UI-state som bara gäller rendering

Exempel:

* `app/(home)/index.tsx`
* `app/editor/[id].tsx`
* `app/preview/[id].tsx`
* `app/template-guide.tsx`
* `src/components/project-overview/*`
* `src/components/video-stage/*`
* `src/components/CompilePanel.tsx`

Presentation ska inte äga domänregler.

### Application

Innehåller orchestration och hooks som kopplar UI till domain och infrastructure.

Exempel:

* `useProjectOverviewController`
* `useEditorController`
* `useEditorCompileController`
* `useSceneVideoController`
* `sceneVideoSourceFactory`

Application får använda domain och infrastructure men ska hålla UI-komponenter tunna.

### Domain

Innehåller ren logik och regler.

Exempel:

* template parsing och validation
* compile-payload builder
* scene video readiness
* scene preview timeline
* transitions
* scene effects
* overlay position
* zoom/pan
* audio volume
* template guide content

Domain ska vara testbar utan Expo runtime.

### Infrastructure

Innehåller externa system, repositories och platform APIs.

Exempel:

* `templateRepository`
* `templateImportService`
* `compileService`
* `saveCompiledVideo`
* `videoReference`
* Expo FileSystem, MediaLibrary, DocumentPicker, ImagePicker, Clipboard

Infrastructure ska kapsla plattformsspecifika detaljer.

### Compile-server

Compile-servern är separat backend.

Ansvar:

* validera compile-payload
* hantera upload och `/compiled`
* stödja placeholder-läge
* rendera i FFmpeg-läge
* använda scenvisa videokällor
* skapa ASS-subtitles för textoverlay
* applicera scene effects och transitions
* hantera originalVolume och music.volume
* skapa användbar outputreferens

## Viktiga kontrakt

### Template

Template är projektets inputmodell. Den ska valideras innan editorflödet använder den.

### EditSession

EditSession är appens aktiva redigeringsstate.

### Scene video source

Egen användarvideo per scen ska kopplas till rätt scen. Om videon är längre än scenen ska trimintervall användas. Om den är kortare ska användaren meddelas.

### CompilePayload

CompilePayload är kontraktet mellan app och compile-server. Det ska innehålla mallens stylingdata och scenvisa videokällor där sådana finns.

## Preview-regel

När godkända scenkällor saknas ska editorn inte spela upp gamla placeholder-klipp. Den ska visa ett tydligt empty/incomplete state.

När alla scenkällor är godkända får preview kännas som en sammanhängande video, men faktisk slutrendering sker i compile-servern.

## Export-regel

Open och download/save är olika actions.

* Open öppnar färdig video för uppspelning.
* Download på webben försöker starta browser-download.
* Save på mobil använder enhetens media library där plattformen stödjer det.

## Deployment-regel

Deployment är separat från editorlogik. Docker, Cumulus, Nginx, Caddy och GitLab Runner ska bara påverka deployment-issues.

## Arkitekturrisker

AI ska vara extra försiktig med:

* stora komponentfiler
* state och UI blandat i samma fil
* editorlogik i infrastructure
* plattformsdetaljer i domain
* dolda antaganden om media-URL:er
* AI-genererad kod utan tester
* compile-server och appkontrakt som glider isär
