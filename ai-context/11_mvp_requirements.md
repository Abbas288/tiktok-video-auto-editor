# MVP-krav

## Syfte

Denna fil samlar aktuell MVP för Abbas projekt. Den ska användas för spårbarhet mellan kod, issues, testfall och presentation.

## Kravmodell

* UR: användarkrav.
* SR: systemkrav.
* FR: funktionella krav.
* NFR: icke-funktionella krav.

## Användarkrav

### UR1: Användaren ska kunna skapa eller öppna projekt

Acceptans:

* projektöversikten visar projekt
* JSON-template kan importeras
* importerad template kan öppnas i editorn
* projekt kan döpas om och tas bort

### UR2: Användaren ska förstå template-flödet

Acceptans:

* AI-prompt kan kopieras
* template-guide kan öppnas
* guide förklarar kort vad template innehåller
* prompt visas i code snippet-ruta

### UR3: Användaren ska kunna lägga in egna videor per scen

Acceptans:

* egen MP4 kan kopplas till rätt scen
* användaren kan byta eller ta bort vald video
* video kortare än scen nekas med tydlig feedback
* video längre än scen kräver intervall eller trimval
* alla scener måste ha godkända källor innan relevant preview/compile

### UR4: Användaren ska kunna redigera centrala template-värden

Acceptans:

* textöverlägg kan justeras
* scene effects kan justeras
* transitions kan justeras
* audio-volym kan justeras
* ändringar påverkar preview och compile-payload där de stöds

### UR5: Användaren ska kunna exportera färdig video

Acceptans:

* compile kan startas från appen
* output visas i exportpanelen
* Open öppnar video
* Download på webben försöker ladda ner
* Save på mobil sparar där plattformen stödjer det
* trasig videoreferens hanteras tydligt

## Systemkrav

### SR1: Template-JSON ska valideras

Systemet ska neka ogiltig JSON, saknade fält och ogiltiga värden utan krasch.

### SR2: EditSession ska byggas från Template

Systemet ska skapa och uppdatera state utan att förstöra template-kontraktet.

### SR3: CompilePayload ska vara stabilt kontrakt

Payload ska innehålla template-id, orientation, scener, text, effects, transitions, audio och scenvisa videokällor där de finns.

### SR4: Compile-servern ska kunna rendera MVP-output

Servern ska kunna köra placeholder-läge och FFmpeg-läge. FFmpeg-läge ska rendera scener, textöverlägg, scene effects, transitions och ljud på MVP-nivå.

### SR5: Projektkontext ska vara uppdaterad

`GEMINI.md` och `ai-context/` ska ge AI korrekt projektkontext, aktuell kodbas, kurskrav och arbetsflöde.

## Funktionella krav

* FR1: Importera JSON-template från fil.
* FR2: Visa importerad template som projekt.
* FR3: Öppna projekt i editor.
* FR4: Rename projekt.
* FR5: Delete projekt med bekräftelse.
* FR6: Visa template-guide.
* FR7: Kopiera AI-prompt.
* FR8: Välj scenvideo.
* FR9: Validera scene video duration.
* FR10: Visa incomplete state när scenkällor saknas.
* FR11: Bygg preview timeline från scenkällor.
* FR12: Bygg compile-payload.
* FR13: Rendera via compile-server.
* FR14: Open färdig video.
* FR15: Download/save färdig video.

## Icke-funktionella krav

* NFR1: Appen ska inte krascha vid ogiltig template.
* NFR2: Appen ska ge tydlig felåterkoppling.
* NFR3: Kod ska följa lagerarkitektur.
* NFR4: Domain-logik ska vara testbar.
* NFR5: `npm run verify` ska passera före MR.
* NFR6: AI-genererad kod ska granskas och testas.
* NFR7: Dokumentationen ska vara överlämningsbar.

## Aktuella kvalitetssignaler

Gemini ska kontrollera:

* att nya features har issue och testfall
* att fixes har reproducerbart problem och verifiering
* att refactors inte ändrar användarbeteende
* att docs-issues inte råkar ändra kod
* att stora filer delas upp när de skadar testbarhet
