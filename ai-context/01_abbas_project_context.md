# Abbas Projektkontext (01_abbas_project_context.md)

## Syfte

Denna fil beskriver Abbas projekt som Gemini alltid ska utgå från. Den ska användas för att undvika att projektet glider mot fel scope eller blandas ihop med referensprojekt.

Gemini ska använda denna fil när den:
- skriver krav
- föreslår kod
- skriver Wiki eller rapport
- förklarar arkitektur
- skapar testfall
- bedömer om en feature tillhör MVP
- jämför Abbas projekt med hagen-auto-edit, Ida eller Wasim

## Vision: The TikTok Catalyst (LeTrend Mobile)

En smart mobilapp för automatisk videoredigering i CapCut-stil som agerar digital TikTok-manager för serviceverksamheter, särskilt restauranger, caféer och barer.

## Problemet

Serviceverksamheter har ofta bra råmaterial, till exempel matlagning, produkter, lokaler och personal. Problemet är inte att de saknar innehåll. Problemet är att de saknar tid, redigeringskunskap och förståelse för TikTok-kultur.

De behöver innehåll som känns snabbt, trendigt, engagerande och anpassat till plattformens tempo. Vanliga redigeringsverktyg som CapCut är kraftfulla men kräver manuell kompetens och tid.

Bra råmaterial tappar värde om det klipps för långsamt, saknar hook eller inte följer plattformens rytm. Målet är därför ett återkommande arbetsflöde, inte bara enstaka manuella experiment.

## Målgrupp

Primär målgrupp:
- restauranger
- caféer
- barer
- andra serviceverksamheter som vill växa på TikTok

Målgruppen har ofta:
- råmaterial som kan bli bra content
- låg tid för manuell redigering
- begränsad teknisk redigeringskunskap
- behov av snabb produktion
- affärsmål kopplade till synlighet, kunder och försäljning

## Lösningen och USP

Appens USP är att den kan härma redigeringsmönster, struktur och stil från en specifik trendig TikTok-video och använda detta som mall för en ny video.

Appen minskar behovet av manuell redigering genom ett mallbaserat arbetsflöde där `Template-JSON` fungerar som redigeringsbeskrivning.

Värdet är:
- snabbare produktion av TikTok-anpassat material
- mindre krav på teknisk redigeringskunskap
- tydligare koppling mellan trend och ny video
- mer konsekvent redigeringsformat
- bättre möjlighet för verksamheter att skapa engagerande innehåll

## AI/API-flöde

Projektets kärnidé är att användaren kan utgå från en specifik TikTok-video som stilreferens.

Flödet är:

TikTok URL -> AI/API video analysis -> Template-JSON -> EditSession -> Editor UI -> Preview/Timeline -> Compile-payload -> backend/compile-server -> Rendered video via FFmpeg

Användaren eller systemet matar in en URL till en TikTok-video. En AI/API analyserar videon och returnerar strukturerad JSON-data om videons redigeringsmönster, till exempel:
- scener
- duration
- timing
- textoverlays
- klippstruktur
- effekter
- stilinformation
- musik eller ljudstruktur om tillgängligt

Mobilappen ansvarar inte för att analysera TikTok-videon direkt. Mobilappen ansvarar för att konsumera Template-JSON, bygga en EditSession, visa editorflödet och senare skapa en compile-payload.

Mobilappen skapar alltså en redigeringsbeskrivning, medan backend/compile-server ansvarar för den faktiska renderingen via FFmpeg.

Syftet är att kunna härma en trendig videos redigeringsformat och stil, inte att kopiera originalvideons innehåll rakt av.

## Template-JSON

Template-JSON är bryggan mellan upstream AI/API och mobilappen.

Template-JSON beskriver:
- vilken video som används
- scenernas ordning
- starttider
- duration
- instruktioner
- text overlays
- transitions
- effects
- musik och ljud
- metadata som behövs för editor och rendering

Viktig princip:

Appen splittrar inte videofilen själv. Källvideon ligger hel i GCS eller motsvarande lagring. JSON-filen beskriver var varje scen börjar och slutar samt vilka overlays, effekter och övergångar som ska användas.

## EditSession

EditSession är appens interna arbetsformat.

Template-JSON kommer från upstream AI/API. EditSession är det interaktiva state som användaren arbetar med i appen.

EditSession ska senare kunna innehålla:
- vald template
- scener
- selected scene
- text edits
- transition edits
- effect edits
- audio settings
- preview state
- data för compile-payload

## Vad ingår i Abbas scope

Appens huvudansvar är editorflödet:
- ladda Template-JSON
- hämta eller använda videoreferens
- bygga EditSession
- visa projekt eller templates på home
- navigera till editor
- visa scener och timing
- hantera timeline
- hantera preview
- hantera text overlays
- hantera transitions och effects
- hantera musik och ljud
- skapa compile-payload
- skicka payload till backend/compile-server
- visa eller spara renderad video när backend returnerar resultat

## Vad ingår inte just nu

Detta ska inte implementeras i mobilappen just nu:
- analys av TikTok-video i frontend
- Vertex AI eller hagen AI-backend
- automatisk trendcrawler
- Supabase-datagenerering
- GCS-synk som projektägaren ansvarar för
- direktpublicering till TikTok
- avancerad auto-undertextning om det inte senare blir uttalat sträckmål
- beat detection om det inte senare blir uttalat sträckmål
- lokal FFmpeg-rendering i mobilappen

## Teknikstack

Nuvarande och planerad stack:
- React Native
- Expo
- TypeScript
- Expo Router
- Zustand
- expo-video
- senare eventuellt TanStack Query
- senare eventuellt expo-file-system
- senare eventuellt expo-media-library
- backend/compile-server med FFmpeg
- Supabase och GCS som externa resurser om projektägaren tillhandahåller dem

## Kravmodell

Projektet dokumenterar krav för hög spårbarhet och verifierbarhet.

Krav delas in i:
- användarkrav
- systemkrav
- funktionella krav
- icke-funktionella krav

Varje krav bör ha:
- ID
- namn
- beskrivning
- prioritet
- status
- beroenden
- acceptanskriterier
- spårbarhet till issue
- spårbarhet till testfall
- spårbarhet till implementation

## Prioriterad MVP

MVP ska prioritera ett fungerande kärnflöde före stora extra features.

Viktigaste kärnflödet:
1. Visa templates eller projekt.
2. Välj template.
3. Ladda Template-JSON eller mockTemplate.
4. Bygg EditSession.
5. Visa editor-route.
6. Visa scener.
7. Navigera mellan scener.
8. Visa preview-grund.
9. Förbered compile-payload.
10. Dokumentera testning och risker.

## Viktigaste risker

- AI-genererad kod kan ge falsk trygghet.
- Template-JSON från mockdata kan skilja sig från riktig API-data.
- Videouppspelning i Expo kan bli central teknisk risk.
- GCS kräver signerade URL:er.
- Compile-payload kan inte matcha backendens förväntade format.
- Scope creep kan göra appen bred men instabil.
- För lite testning kan göra att appen ser klar ut men inte håller.

## Projektprincip

En liten, stabil och testad editor är mer värdefull än en stor demo med många halvfärdiga funktioner.
