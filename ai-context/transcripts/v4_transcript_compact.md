# Kompakt transkript, vecka 4

## MÅSTE FÖLJAS
- Vecka 4 fokuserar på implementation, men teori om testning, design, modellering, arkitektur och Docker ska fortfarande användas.
- Arkitektur ska dokumenteras i wiki, även om den bara är en enkel skiss eller beskrivning i början.
- Fastna inte i att arkitekturen måste vara perfekt direkt. Det är en iterativ process.
- Tidiga prototyper är tillåtna om de används för att minska osäkerhet och risk.
- Definition of Done ska finnas som checklista.
- Testplan ska skapas och användas praktiskt.
- Manuella tester är en rimlig start om automatiska tester inte är etablerade ännu.
- Risker ska kopplas till konkreta implementationer eller spikes.

## BRA FÖR RAPPORT
- Arkitektur är inte bara diagram. Det är beslut om ansvar, gränser och beroenden.
- För Abbas projekt är det centralt att separera mobilappen från upstream AI/API och downstream compile-server.
- Docker är relevant för senare drift och för att köra backend/compile-server stabilt, men mobilappen ska inte köra FFmpeg lokalt.
- Testplanen beskriver vad som ska testas, hur det ska testas och vad som inte testas just nu.
- AI som utvecklingsstöd kräver starkare kontroll genom testning och dokumentation.

## BRA FÖR MUNTLIG REDOVISNING
- Beskriv arkitekturen enkelt: Presentation, Application, Domain, Infrastructure.
- Förklara att EditSessionStore fungerar som central state och att Template-JSON driver editorflödet.
- Förklara att compile-payload skapas i mobilappen men rendering sker i backend/compile-server via FFmpeg.
- Lyft att Abbas använder AI för acceleration men inte som ersättning för förståelse, kravspårbarhet och testning.

## BAKGRUND
- Veckan innehöll material om design, modellering, arkitektur och implementation.
- Containers och Docker introducerades som förberedelse för kommande drift och DevOps-arbete.
- Kursledningen betonade att viss teori läses innan den används praktiskt senare.
- Testplansexemplet visar att testning kan vara enkel och hands-on i början.

## Risker och krav som påverkar Abbas projekt
- Risk: bibliotek eller teknikval fungerar inte i Expo-miljö.
- Risk: videospelning från GCS eller signerad URL fungerar inte på riktig enhet.
- Risk: Expo Router-strukturen fungerar men saknar koppling till EditSession.
- Risk: en stor AI-genererad implementation går inte att förklara vid examination.
- Risk: compile-servern antas fungera utan att testas.
- Krav: dokumentera arkitektur och beslut i wiki.
- Krav: innan commit ska linter, testfall och förståelse kontrolleras.

## Saker Gemini ska komma ihåg vid kodarbete
- Föreslå spike när teknik är osäker, till exempel GCS-video, expo-video eller compile-server.
- Håll implementationen liten och testbar.
- Skriv inte om hela appen när en route eller store-funktion räcker.
- Koppla ny kod till ett konkret krav och testfall.
- Uppdatera `08_current_feature_context.md` när feature-konteksten ändras.
- För Docker: föreslå detta senare för backend/compile-server, inte som första lösning i mobilappen.
