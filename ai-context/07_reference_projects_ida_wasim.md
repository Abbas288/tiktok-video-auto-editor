# Referensprojekt: Ida och Wasim (07_reference_projects_ida_wasim.md)

## Syfte

Denna fil förhindrar att Gemini blandar ihop Abbas projekt med gruppmedlemmarnas projekt.

Abbas projekt är alltid huvudprojektet när frågan gäller:
- mitt projekt
- min app
- min kod
- mitt repo
- mina issues
- min implementation
- min arkitektur
- min Wiki
- mitt GitLab
- min presentation

Ida och Wasim är endast referensprojekt.

## När Gemini ska använda denna fil

Använd denna fil när:
- gruppmaterial nämner Ida eller Wasim
- presentationer jämför projekten
- Gemini hämtar inspiration från kursens exempel
- krav, testfall eller arkitektur riskerar att blandas ihop
- Abbas ber om hjälp med sitt eget projekt efter att gruppmaterial har använts

## Abbas projekt

Abbas projekt heter:
- LeTrend Mobile
- The TikTok Catalyst
- tiktok-video-editor-app

Kärnan är en mobilapp för AI-stödd TikTok-videoredigering för serviceverksamheter.

Flödet är:

TikTok URL -> AI/API video analysis -> Template-JSON -> EditSession -> Editor UI -> Preview/Timeline -> Compile-payload -> backend/compile-server -> Rendered video via FFmpeg

## Ida

Idas projekt är en Study Tracker.

Det kan användas som inspiration för:
- tydlig problemformulering
- användarvärde
- hur man presenterar en vision
- hur man strukturerar krav
- hur man skriver testfall
- hur man visar dashboard eller statistikvy

Det får inte användas som källa för:
- Abbas appkrav
- Abbas kod
- Abbas arkitektur
- Abbas issues
- Abbas Template-JSON
- Abbas UI-flöde
- Abbas tekniska stack
- Abbas AI/API-flöde

## Wasim

Wasims projekt är en Pomodoro-app.

Det kan användas som inspiration för:
- enkel och tydlig UI-struktur
- fokus på målgrupp
- hur man formulerar värde för användaren
- hur man skriver enkla user stories
- hur man presenterar arbetsflöden

Det får inte användas som källa för:
- Abbas appkrav
- Abbas implementation
- Abbas arkitektur
- Abbas timeline/editorflöde
- Abbas AI/API-flöde
- Abbas compile-payload
- Abbas tekniska stack

## hagen-auto-edit

`hagen-auto-edit` är teknisk inspiration, inte kravkälla för Abbas kod.

Det kan användas som inspiration för:
- Template-JSON-struktur
- compile-server
- FFmpeg-flöde
- GCS/Supabase-mönster
- Zustand-liknande statehantering
- typer och domänmodeller

Det får inte:
- kopieras blint
- ersätta Abbas lagerarkitektur
- göra frontend ansvarig för backendlogik
- användas för att införa features utanför Abbas MVP
- blandas ihop med Ida eller Wasim

## Särskilt viktiga delar från hagen-auto-edit

När Gemini behöver teknisk inspiration, börja med att leta efter dessa delar selektivt:

- `apps/compile-server/`
  - visar serverbaserad FFmpeg-kompilering
  - relevant för `CompilePayload` och API-integration senare
- `packages/server/templates/portrait.json`
  - visar exempel på template-struktur
  - relevant när Abbas schema ska jämföras med backendens förväntningar
- `src/director/TemplateDirector.ts`
  - visar renderingsflöde och hur template kan tolkas downstream
  - använd som idé, inte som frontendlogik
- `src/editor/managers/FormatterManager.ts`
  - visar textfilter och FFmpeg-förberedelse
  - relevant för compile-server och payload, inte för mobil UI direkt
- `apps/le-clap/src/types/domain.ts`
  - inspiration för typer
  - Abbas ska ändå ha egna typer som matchar hans projekt
- `apps/le-clap/src/store/leTrendStore.ts`
  - inspiration för Zustand-session
  - Abbas store ska vara enklare och anpassad till `EditSession`
- `apps/le-clap/app/(fullscreen)/edit/[id].tsx`
  - inspiration för editorflöde
  - ska inte kopieras utan anpassas till Abbas route groups

## Hur Gemini ska resonera när referenskod används

Innan Gemini använder referenskod ska den fråga:
1. Stöder detta Abbas MVP?
2. Passar detta Abbas lagerarkitektur?
3. Kan detta testas?
4. Kräver detta ny dependency?
5. Är detta frontendansvar eller backendansvar?
6. Riskerar detta att göra appen större än kursens tid tillåter?

Om svaret är oklart ska Gemini föreslå en mindre lösning eller fråga Abbas.

## Vanliga fel Gemini ska undvika

- Blanda ihop Abbas mobilapp med hagen backend.
- Blanda ihop Abbas projekt med Ida eller Wasim.
- Skriva att Abbas app kopierar TikTok-videor.
- Anta att mobilappen gör TikTok-analys själv.
- Anta att FFmpeg ska köras i mobilen.
- Föreslå Tamagui utan att Abbas uttryckligen ändrar teknikval.
- Föreslå stor refaktor utan testbehov.
- Använda hagen-auto-edit som facit för alla Abbas beslut.

## Gruppmaterial

Gruppens material kan användas för:
- presentationsteknik
- examinationsfrågor
- jämförelse mellan projekt
- processreflektion
- hur teori kan tillämpas
- hur krav och testning kan presenteras

Men när Gemini genererar något för Abbas ska Abbas projekt alltid vara primär kontext.

## Säkra formuleringar

Gemini får skriva:
- "Idas och Wasims projekt används endast som jämförelse och inspiration."
- "Abbas projekt är huvudprojektet och kravkällan för kodarbete."
- "Strukturen från gruppens presentation kan inspirera dokumentation, men den ändrar inte Abbas scope."

## Osäkra formuleringar

Gemini får inte skriva:
- "Eftersom Ida använder X bör Abbas också använda X."
- "Wasims projekt visar att Abbas app behöver Pomodoro-liknande funktioner."
- "Gruppens projekt kräver att Abbas bygger dashboard."
- "Ida eller Wasim definierar krav för Abbas app."

## Praktisk kontrollfråga

Om information kommer från Ida eller Wasim ska Gemini fråga:

1. Är detta bara presentationsstruktur?
2. Är detta generell kursmetod?
3. Eller riskerar detta att bli fel krav för Abbas?

Om det riskerar att bli fel krav ska det inte användas.

## Prioritet

Vid konflikt mellan källor gäller:

1. Abbas kravspec eller SPEC_STUDENT
2. Abbas Wiki eller egen projektdokumentation
3. Abbas kodbas
4. kursens officiella material
5. hagen-auto-edit som teknisk inspiration
6. Ida och Wasim endast som jämförelse
