# Nuvarande Feature-kontext (08_current_feature_context.md)

## Syfte

Denna fil beskriver den feature som Abbas och Gemini arbetar med just nu. Den ska uppdateras när aktuell feature ändras.

Gemini ska använda denna fil när den:
- ska förstå nuvarande implementation
- ska föreslå testfall
- ska avgöra vad som måste vara sant före commit
- ska skriva commit-meddelande
- ska undvika att råka bygga nästa feature för tidigt

## Aktuell feature

Expo Router foundation och grundläggande Template-JSON/EditSession-struktur.

Denna feature är projektets tekniska grund. Den ska inte räknas som färdig förrän navigation, typer, mockdata och state kan verifieras.

## Implementerat eller pågående

Följande delar ingår i aktuell implementation:

- Expo Router route groups:
  - `app/(home)/index.tsx`
  - `app/(editor)/[id].tsx`
  - `app/(preview)/[id].tsx`
  - `app/_layout.tsx`
- Grundläggande tema:
  - `src/styles/theme.ts`
- Template-typer:
  - `src/types/template.ts`
- Mockdata:
  - `src/data/mockTemplate.ts`
- EditSession state:
  - `src/store/useEditSession.ts`
- `expo-video` är installerat men riktig videospelare är inte implementerad ännu.

## Syfte

Syftet är att skapa grunden för steget:

Template-JSON -> EditSession -> Editor UI

Detta är nödvändigt innan timeline, preview, overlays, transitions, ljud och compile-payload kan byggas seriöst.

## Konkret template-video

Den aktuella template-videon används som praktisk referens för mockTemplate, scenindelning, preview-testning och senare compile-payload.
Mobilappen ska inte analysera videon själv. Analysen representeras som Template-JSON.
Videon är alltså utvecklingsunderlag, inte ett nytt frontendansvar.

## Koppling till produktflödet

Projektets huvudflöde är:

TikTok URL -> AI/API video analysis -> Template-JSON -> EditSession -> Editor UI -> Preview/Timeline -> Compile-payload -> backend/compile-server -> Rendered video via FFmpeg

Den aktuella featuren täcker denna del:

Template-JSON -> EditSession -> Editor UI

## Viktiga filer

### `app/_layout.tsx`

Ansvar:
- sätter upp root layout för Expo Router
- gör route groups möjliga
- ska inte innehålla domänlogik

### `app/(home)/index.tsx`

Ansvar:
- visa lista över templates eller projekt
- låta användaren välja ett template
- navigera till editor med template id

### `app/(editor)/[id].tsx`

Ansvar:
- läsa template id från route
- ladda rätt mockTemplate eller session
- visa grund för editorflödet
- senare innehålla timeline, preview och edit controls

### `app/(preview)/[id].tsx`

Ansvar:
- visa preview-route
- läsa template id
- senare visa förhandsvisning av redigerad session

### `src/styles/theme.ts`

Ansvar:
- samla färger, spacing och grundläggande designkonstanter
- undvika hårdkodad styling utspridd över hela appen

### `src/types/template.ts`

Ansvar:
- definiera Template, Scene, TextOverlay, Transition, Effect och Music
- fungera som domänkontrakt mellan AI/API JSON och mobilapp

### `src/store/useEditSession.ts`

Ansvar:
- hålla aktuell redigeringssession
- ladda template
- hålla selected scene
- senare hålla edits för overlays, transitions, audio och effects

### `src/data/mockTemplate.ts`

Ansvar:
- ge stabil testdata i dev-läge
- simulera Template-JSON från upstream AI/API
- ska inte behandlas som slutgiltigt backendformat

## Berörda filer

Förväntade berörda filer:

```text
tiktok-video-editor-app/app/_layout.tsx
tiktok-video-editor-app/app/(home)/index.tsx
tiktok-video-editor-app/app/(editor)/[id].tsx
tiktok-video-editor-app/app/(preview)/[id].tsx
tiktok-video-editor-app/src/styles/theme.ts
tiktok-video-editor-app/src/types/template.ts
tiktok-video-editor-app/src/data/mockTemplate.ts
tiktok-video-editor-app/src/store/useEditSession.ts
tiktok-video-editor-app/package.json
tiktok-video-editor-app/package-lock.json
README.md
.gitignore
```

Tidigare `App.tsx` och `index.ts` kan vara borttagna om Expo Router nu är entry pattern. Detta ska vara avsiktligt och verifierat innan commit.

## Krav som stöds

### Användarkrav

Som användare vill jag kunna välja ett videoprojekt eller en mall så att jag kan börja redigera.

### Systemkrav

Systemet ska kunna läsa ett Template-JSON-liknande objekt och bygga en intern EditSession.

### Funktionella krav

- Systemet ska visa en startsida.
- Systemet ska kunna navigera till editor-route med template id.
- Systemet ska kunna navigera till preview-route med template id.
- Systemet ska kunna lagra vald template i Zustand-store.
- Systemet ska kunna läsa mockTemplate utan TypeScript-fel.

### Icke-funktionella krav

- Navigation ska inte krascha vid giltigt template id.
- Ogiltigt eller saknat id ska hanteras utan krasch.
- Kod ska vara typad utan `any`.
- Grundstrukturen ska vara lätt att testa och vidareutveckla.

## Manuella testfall innan commit

### TC1.1 Home route renders project list

**Förutsättning:** Appen startar utan cachefel och mockTemplate finns.  
**Testdata:** template id `pizza-launch-2026`

**Steg:**
1. Starta appen.
2. Öppna home route.
3. Kontrollera att minst ett projekt eller template visas.

**Förväntat resultat:** Home route renderas utan krasch och template eller projekt syns för användaren.

### TC1.2 Template can be loaded into EditSession

**Förutsättning:** MockTemplate finns och `useEditSession` är kopplad till editorflödet.  
**Testdata:** template id `pizza-launch-2026`

**Steg:**
1. Välj ett template från home.
2. Navigera till editor.
3. Kontrollera att sessionen innehåller template id och scenes.

**Förväntat resultat:** EditSession innehåller korrekt template och scener finns i state.

### TC1.3 Navigation opens editor route with template id

**Förutsättning:** Home route visar template.

**Steg:**
1. Klicka på template.
2. Kontrollera att appen öppnar `/(editor)/[id]`.

**Förväntat resultat:** Editor-route öppnas med rätt id och ingen krasch sker.

### TC1.4 Preview route opens with template id

**Förutsättning:** Template id finns.

**Steg:**
1. Navigera till preview-route.
2. Kontrollera att id läses korrekt.

**Förväntat resultat:** Preview-route öppnas och template id visas eller används i state.

### TC1.5 Theme and template types compile without TypeScript errors

**Förutsättning:** Dependencies är installerade.

**Steg:**
1. Kör `npx tsc --noEmit`.
2. Kontrollera resultatet.

**Förväntat resultat:** TypeScript kör klart utan typfel.

### TC1.6 Invalid template id does not crash app

**Förutsättning:** Appen körs och editor route kan öppnas med id.  
**Testdata:** template id `missing-template-id`

**Steg:**
1. Öppna editor route med ett ID som inte finns.
2. Kontrollera att appen inte kraschar.

**Förväntat resultat:** Appen visar error state eller fallback state utan krasch.

## Automatiska tester som bör skapas senare

- Unit test för `useEditSession`.
- Unit test för att ladda template.
- Unit test för ogiltigt template id.
- Unit test för scene selection.
- Unit test för framtida `parseTemplate`.
- Component test för home route.
- Component test för editor route.
- Regressionstest för navigation mellan home, editor och preview.

## Risker kvar

- `expo-video` är installerat men videospelaren är inte implementerad.
- `mockTemplate` kan avvika från riktigt Template-JSON från upstream AI/API.
- GCS-länkar kräver signerade URL:er och är inte lösta i frontend ännu.
- Editor route kan se fungerande ut utan att sessionen är korrekt verifierad.
- Compile-payload finns inte ännu.
- Risken för falsk trygghet är hög om man committar utan test.

## Måste vara sant innan commit

- `npm run lint` har körts.
- `npx tsc --noEmit` har körts.
- Appen har startats med `npx expo start`.
- TC1.1 till TC1.6 är manuellt verifierade eller tydligt dokumenterade som ej körda.
- `git status` är granskat.
- `git diff` är granskat.
- Inga debug-loggar eller skräpfiler följer med.
- README, Wiki eller ai-context är uppdaterade om scope eller arkitektur ändrats.

## Rekommenderad commit

```bash
git status
git diff
git add <granskade-filer>
git commit -m "feat: setup Expo Router foundation and project context"
```

Commit ska bara göras om testerna ovan faktiskt är genomförda.


## Nästa rimliga feature efter denna

Nästa feature bör vara en av:
1. riktig `parseTemplate(json: unknown): Template`
2. `buildEditSession(template: Template): EditSession`
3. enkel scenlista i editor
4. grundläggande `expo-video` preview med seek till `startSeconds`

Välj bara en.
