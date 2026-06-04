# Kapitel 15: Software Reuse

## 1. Kärna i kapitlet

Kapitel 15 handlar om software reuse, alltså att återanvända befintlig mjukvara, komponenter, ramverk, design, tjänster eller kunskap i stället för att bygga allt från början.

Återanvändning kan spara tid och minska risk, men bara om det görs kontrollerat. Kod eller arkitektur som återanvänds utan förståelse kan skapa fel, beroenden och teknisk skuld.

## 2. Viktiga begrepp

- Software reuse: återanvändning av existerande mjukvaruresurser.
- Application system reuse: återanvända hela system eller större delar.
- Component reuse: återanvända komponenter.
- Object and function reuse: återanvända mindre koddelar.
- COTS: kommersiella färdiga komponenter.
- Frameworks: återanvändbar struktur som appen byggs inom.
- Product lines: familjer av liknande produkter.
- Design pattern reuse: återanvända lösningsmönster.
- API reuse: använda externa tjänster.
- Reuse risk: risk att beroenden inte passar projektets krav.

## 3. Relevans för 1DV613

Kursen tillåter och förväntar sig att studenten använder verktyg, ramverk och bibliotek. Det viktiga är att Abbas kan förklara vad som återanvänds, varför det valdes och hur det testas.

Återanvändning får inte dölja bristande förståelse. Abbas måste kunna försvara tekniska val.

## 4. Relevans för Abbas projekt

Abbas projekt bygger på återanvändning på flera nivåer:

- Expo och React Native som appplattform.
- Expo Router för navigation.
- Zustand för state.
- `expo-video` för videouppspelning.
- hagen-auto-edit som referensrepo.
- compile-server som möjlig återanvänd backend-komponent.
- Template-JSON-idén från upstream pipeline.
- TypeScript-typer och mönster inspirerade av referenskod.

Men det finns en hård regel:

hagen-auto-edit är inspiration, inte kod som ska kopieras rakt av.

## 5. När AI ska använda kapitlet

Använd detta kapitel när AI ska:

- avgöra om något från hagen-auto-edit ska användas
- motivera tekniska bibliotek
- skriva rapport om tekniska val
- förklara reuse i presentation
- varna för att kopiera kod utan anpassning
- föreslå adapter mot compile-server
- skapa riskanalys för beroenden

## 6. Vad som måste synas i wiki, rapport, testning eller presentation

Wiki och rapport ska visa:

- vilka externa verktyg som används
- varför de används
- vilka risker de skapar
- hur de testas
- vad som är egen implementation
- vad som är inspiration från hagen-auto-edit

Presentation kan säga:

"Jag återanvänder inte hagen-auto-edit som appkod. Jag använder det som teknisk referens för hur Template-JSON, compile-server och FFmpeg-flöden kan struktureras. Abbas mobilapp har egen arkitektur och egen implementation."

## 7. Praktisk koppling till projektet

När AI använder återanvändning ska den följa detta:

1. Identifiera vad som återanvänds.
2. Kontrollera att det passar Abbas krav.
3. Anpassa till lagerarkitekturen.
4. Skriv tydliga TypeScript-typer.
5. Testa integrationspunkten.
6. Dokumentera risk eller antagande.

Exempel:

- Bra: använda hagen-auto-edit för att förstå compile-serverns payloadidé.
- Dåligt: kopiera en stor editor screen från hagen-auto-edit utan att Abbas förstår den.

Återanvändning ska minska risk, inte flytta in okänd komplexitet i projektet.
