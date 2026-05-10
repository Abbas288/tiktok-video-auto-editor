# Kapitel 4: Requirements Engineering

## 1. Kärna i kapitlet

Kapitel 4 handlar om requirements engineering, alltså processen att ta fram, analysera, dokumentera, validera och hantera krav.

Ett krav är inte bara en funktion. Ett krav kan beskriva:

- tjänster systemet ska erbjuda
- beteenden systemet ska ha
- begränsningar systemet måste följa
- kvalitetsegenskaper systemet ska uppnå
- externa beroenden eller driftvillkor

Krav måste vara tydliga eftersom de styr design, implementation, testning, acceptanskriterier och projektplanering.

## 2. Viktiga begrepp

- Requirement: beskrivning av vad systemet ska göra eller vilka begränsningar som gäller.
- Requirements engineering: kravinsamling, analys, dokumentation, validering och förändringshantering.
- User requirements: krav på hög nivå skrivna för kund eller användare.
- System requirements: mer detaljerade krav skrivna för utvecklare och testare.
- Functional requirements: vad systemet ska göra.
- Non-functional requirements: kvalitet och begränsningar, till exempel prestanda, användbarhet, tillförlitlighet och säkerhet.
- Domain requirements: krav som kommer från verksamhetsområdet.
- Requirements elicitation: hitta krav genom samtal, observation, källor och analys.
- Requirements validation: kontrollera att kraven beskriver rätt system.
- Requirements management: hantera förändringar i krav över tid.
- Traceability: spåra krav till design, kod och testfall.

## 3. Relevans för 1DV613

I kursen är kravarbete centralt. Abbas behöver kunna visa att features inte bara byggs för att de verkar bra, utan för att de löser krav som är dokumenterade, testbara och kopplade till issues.

Kursen kräver särskilt att krav kan kopplas till:

- GitLab issues
- acceptanskriterier
- testfall
- Wiki
- implementation
- presentation

## 4. Relevans för Abbas projekt

Abbas projekt har lätt att bli för vagt om kraven bara skrivs som "AI-redigering" eller "CapCut-liknande app". Kapitel 4 hjälper Gemini att göra kraven testbara.

Exempel på användarkrav:

- Som användare vill jag kunna välja en template så att jag kan starta en redigeringssession.
- Som användare vill jag se scener i en tidslinje så att jag förstår videons struktur.
- Som användare vill jag kunna hoppa till en scen så att jag snabbt kan granska rätt del av videon.

Exempel på systemkrav:

- Systemet ska kunna läsa och validera ett Template-JSON.
- Systemet ska bygga en EditSession från en giltig Template.
- Systemet ska skapa en compile-payload från EditSession.

Exempel på funktionella krav:

- Appen ska visa templates på home route.
- Appen ska öppna editor route med template id.
- Appen ska visa scener med starttid och duration.

Exempel på icke-funktionella krav:

- Appen ska inte krascha om template id saknas.
- Template parsing ska ge tydligt fel vid saknade obligatoriska fält.
- UI ska förbli responsivt vid många scener.

## 5. När Gemini ska använda kapitlet

Använd detta kapitel när Gemini ska:

- skriva kravspecifikation
- förbättra GitLab issues
- skriva acceptanskriterier
- skapa testfall
- avgöra om ett krav är för vagt
- skilja user requirements från system requirements
- skilja functional från non-functional requirements
- hjälpa Abbas med presentation om krav
- koppla krav till TC-format

## 6. Vad som måste synas i wiki, rapport, testning eller presentation

Wiki och rapport ska visa:

- kravmodellens fyra kategorier
- tydliga exempel från Abbas app
- kravens spårbarhet till testfall
- att Template-JSON är ett centralt kravobjekt
- att AI/API-flödet är upstream och inte mobilappens ansvar
- att compile-payload är mobilappens output till backend

Testning ska visa:

- vilket krav varje testfall verifierar
- vilka acceptanskriterier som gäller
- om testfallet gäller användarbehov eller tekniskt systembeteende

Presentation ska kunna säga:

"Jag har skiljt på användarkrav och systemkrav. Exempelvis är det ett användarkrav att kunna granska scener i en timeline, medan det är ett systemkrav att Template-JSON kan valideras och omvandlas till EditSession."

## 7. Praktisk koppling till projektet

När Gemini kodar ska kapitel 4 påverka arbetet så här:

- Implementera inte en feature utan krav.
- Skriv acceptance criteria före eller samtidigt som implementation.
- Om en feature saknar tydligt krav, föreslå krav först.
- Koppla testfall till kravkategori.
- Undvik krav som inte går att testa.
- Behandla Template-JSON som formellt kontrakt mellan AI/API och mobilapp.

Bra krav för Abbas är specifika nog för att testas:

"Systemet ska visa ett felmeddelande om Template-JSON saknar `scenes`."

Dåligt krav:

"Appen ska vara smart."

Det dåliga kravet hjälper varken kod, testning eller presentation.
