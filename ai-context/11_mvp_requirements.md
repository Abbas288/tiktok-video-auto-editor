# MVP-krav

## Syfte

Denna fil samlar aktuell MVP för Abbas projekt. Den ska användas för förståelse mellan krav, kod, issues, testfall och presentation.

Kraven hålls kondenserade. GitLab-issues innehåller mer detaljerat syfte, acceptanskriterier, kopplade testfall, testtäckning och checklista.

## Kravmodell

* Användarkrav beskriver användarens mål och nytta på hög nivå.
* Systemkrav beskriver mer detaljerat vad systemet ska göra och vilka begränsningar som gäller.
* Funktionella krav beskriver systemets funktionalitet.
* Icke-funktionella krav beskriver systemets kvalitet, robusthet och begränsningar.
* Organisationskrav beskriver krav på utvecklingsprocess, verifiering, dokumentation och leverans.

## Användarkrav (Exempel)

### Användaren ska kunna skapa eller öppna projekt

Acceptans:

* projektöversikten visar projekt
* JSON-template kan importeras
* importerad template kan öppnas i editorn
* projekt kan döpas om och tas bort

### Användaren ska förstå template-flödet

Acceptans:

* AI-prompt kan kopieras
* template-guide kan öppnas
* guide förklarar kort vad template innehåller
* prompt visas i code snippet-ruta

### Användaren ska kunna lägga in egna videor per scen

Acceptans:

* egen MP4 kan kopplas till rätt scen
* användaren kan byta eller ta bort vald video
* video kortare än scen nekas med tydlig feedback
* video längre än scen kräver trimval
* alla scener måste ha godkända källor innan relevant preview eller compile

### Användaren ska kunna redigera centrala template-värden

Acceptans:

* textöverlägg kan justeras
* scene effects kan justeras
* transitions kan justeras
* audio-volym kan justeras
* ändringar påverkar preview och compile-payload där de stöds

### Användaren ska kunna exportera färdig video

Acceptans:

* compile kan startas från appen
* output visas i exportpanelen
* Open öppnar video
* Download på webben försöker ladda ner video
* Save på mobil sparar video där plattformen stödjer det
* trasig videoreferens hanteras tydligt

## Systemkrav (Exempel)

### JSON-mallen som används som indata ska valideras

Systemet ska neka ogiltig JSON, saknade fält och ogiltiga värden utan krasch.

### Videoredigeringssession ska byggas från template

Systemet ska skapa och uppdatera editor-state utan att förstöra template-kontraktet.

### Payload för kompilering ska vara ett stabilt kontrakt

Payload ska innehålla template-id, orientation, scener, text, effects, transitions, audio och scenvisa videokällor där de finns.

### Servern som ansvarar för kompilering ska kunna rendera MVP-output

Servern ska kunna köra placeholder-läge och FFmpeg-läge. FFmpeg-läge ska rendera scener, textöverlägg, scene effects, transitions och ljud på MVP-nivå.

### Otillgängliga mediareferenser ska hanteras säkert

Systemet ska inte behandla trasiga eller gamla mediareferenser som godkända scenkällor.

### Renderingsfel ska gå att felsöka

Compile-servern ska returnera kontrollerade fel och logga felkällan vid validerings- eller renderingsfel.

## Funktionella krav (Exempel)

* Importera och validera JSON-template från fil.
* Visa importerad template som projekt.
* Öppna projekt i editor.
* Rename projekt.
* Delete projekt med bekräftelse.
* Visa template-guide.
* Kopiera AI-prompt.
* Välj, byt och ta bort scenvideo.
* Validera scene video duration.
* Hantera trimval för scenvideo.
* Visa incomplete state när scenkällor saknas eller inte är användbara.
* Bygg preview timeline från scenkällor och template-data.
* Redigera textöverlägg.
* Justera scene effects.
* Justera transitions.
* Justera audio-volym.
* Bygg compile-payload.
* Rendera via compile-server.
* Open färdig video.
* Download eller save färdig video beroende på plattform.

## Icke-funktionella krav (Exempel)

* Appen ska hantera ogiltig template, saknad media och compile-fel utan krasch.
* Appen ska visa synlig och begriplig felåterkoppling vid importfel, mediafel och compile-fel.
* Compile-servern ska logga renderingsfel tillräckligt tydligt för felsökning.
* Loading-, upload- och compile-status ska ge tydlig återkoppling så att användaren förstår att processen pågår.
* Appens viktigaste actions ska vara enkla att hitta utan extern instruktion.
* Destruktiva actions ska skilja sig tydligt från vanliga actions.
* Appen ska vara användbar på både mobil och webb utan att viktiga kontroller döljs eller blir svåra att trycka på.
* Text, knappar och felmeddelanden ska ha tillräcklig kontrast och vara läsbara.
* Användaren ska kunna återhämta sig från fel utan att behöva rensa cookies eller webbplatsdata.
* Viktiga actions ska vara synliga utan onödig skrollning på vanliga mobilskärmar och ska helst använda tydligt etablerad ikon där det behövs för begriplighet och snabb avläsning med ögat.


## Organisationskrav (Exempel)

* Nya features, fixes och refactors ska ha issue och kopplade testfall.
* Issues ska innehålla syfte, acceptanskriterier, testtäckning och checklista där det är relevant.
* Arbete ska göras i en kortlivad branch från uppdaterad `main`.
* Ändringar ska granskas i en Merge Request.
* Relevant lokal verifiering och GitLab CI/CD-verifiering ska passera före merge.
* Kod ska följa projektets lagerarkitektur.
* Kritisk Domain- och Application-logik ska vara testbar där det är rimligt.
* AI-genererad kod ska förstås, granskas och testas innan den accepteras.
* Dokumentationen ska vara överlämningsbar och uppdateras när projektet förändras.
* Produktion ska driftsättas via GitLab-jobbet `deploy_production`.
* Tydliga releaser och kursleveranser ska versionsmärkas semantiskt.


## Aktuella kvalitetssignaler

AI ska kontrollera:

* att nya features, refaktoriseringar och fixes har issue och kopplade testfall
* att fixes har reproducerbart problem och verifiering
* att refactors inte ändrar användarbeteende
* att docs-issues inte råkar ändra kod
* att stora filer delas upp när de skadar läsbarhet eller testbarhet
* att acceptanskriterier och kopplade testfall är godkända innan en issue stängs

## Domänregler och avgränsning

* Template-JSON är kontraktet mellan upstream analys och mobilappen.
* Mobilappen konsumerar givna mediareferenser men analyserar eller kopierar inte TikTok-videor själv.
* En godkänd scenvideo måste täcka den scenlängd som krävs av templaten.
* Preview och slutlig FFmpeg-rendering behöver inte vara pixel-perfect lika på MVP-nivå.

## Användning i Wiki

Requirements-sidan ska ge en snabb överblick över vad som krävs och hur kraven kategoriseras. Detaljer om implementation och verifiering ska ligga i GitLab-issues, testfall och Merge Requests så att Wikin inte blir en duplicerad backlogg.
