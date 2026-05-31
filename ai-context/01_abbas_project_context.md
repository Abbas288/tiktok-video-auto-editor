# Abbas projektkontext

## Syfte

Denna fil beskriver vad Abbas bygger och vad Gemini inte får anta. Använd den vid krav, kod, testfall, Wiki, MR och presentation.

## Produkt

LeTrend Mobile är en mobilapp för template-baserad videoredigering. Appen ska hjälpa serviceverksamheter skapa TikTok-anpassade videos genom att använda en JSON-template som beskriver scenstruktur, timing, text, effekter, transitions och ljud.

## Målgrupp

Primärt:

* restauranger
* caféer
* barer
* serviceverksamheter med råmaterial men begränsad tid för redigering

## Problem

Målgruppen har ofta material men saknar tid och redigeringskompetens. Vanliga editorer kräver för mycket manuellt arbete. Appen ska göra redigeringsflödet mer styrt och snabbare.

## MVP-idé

MVP:n ska visa ett fungerande flöde:

1. användaren skapar eller importerar ett projekt från JSON-template
2. template valideras
3. användaren lägger in egna MP4-klipp per scen
4. appen visar scenmetadata och readiness
5. användaren kan previewa och justera text, effects, transitions och ljud
6. appen skapar compile-payload
7. compile-server renderar eller returnerar output beroende på läge
8. användaren kan öppna eller ladda ner/spara färdig video

## Aktuell funktionalitet

Projektet har nu stöd för:

* projektöversikt från startsidan
* import av JSON-template via fil
* kopierbar AI-prompt för template-generering
* separat template-guide med code snippet-ruta
* rename och delete av projekt
* scenvisa användarvideor
* readiness innan preview/compile
* preview-flöde utan gamla placeholders när scenkällor saknas
* textöverlägg, scene effects, transitions och audio-inställningar
* compile-server med placeholder- och FFmpeg-läge
* exportpanel med separat open och download/save
* skydd mot trasiga exportreferenser
* testsviter för domain, application, infrastructure och UI-komponenter

## Upstream AI/API

Upstream AI/API ansvarar för analys av videoreferens och generering av Template-JSON. Mobilappen ska inte göra denna analys själv.

Gemini ska inte anta att:

* TikTok-parsning sker i mobilappen
* Vertex AI eller hagen backend finns i Abbas repo
* appen laddar ner eller kopierar TikTok-videos juridiskt
* hagen-auto-edit är en kravkälla

## Template-JSON

Template-JSON är kontraktet mellan upstream analys och editorn. Den beskriver:

* projektets titel
* orientation
* source video reference
* scener
* start och duration
* scene instruction eller description
* text overlays
* effects
* transitions
* originalVolume
* music

När användaren lägger in egna klipp ska de egna klippen ersätta standardkällan per scen där de finns.

## Begränsningar

MVP:n behöver inte vara pixel-perfect mot editor-preview. Det viktiga är att centrala ändringar syns och att flödet är begripligt, testbart och demonstrerbart.

Utanför scope om issue inte uttryckligen säger annat:

* native release till App Store eller Google Play
* full trendcrawler
* full AI-backend
* full videoeditor som CapCut
* pixel-perfect FFmpeg-matchning
* multi-user auth
* betalning

## För presentation och rapport

Lyft fram:

* Template-JSON som kontrakt
* lagerarkitektur
* validering som skydd mot AI-data
* testning som Definition of Done
* CI/CD och verifiering som kvalitetssäkring
* etiskt ansvar: inte lita blint på AI eller osäker kod
* MVP-avgränsning: liten men verifierbar produkt
