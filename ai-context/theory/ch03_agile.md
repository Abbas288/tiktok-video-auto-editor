# Kapitel 3: Agile Software Development

## 1. Kärna i kapitlet

Kapitel 3 handlar om agil utveckling. Kärnan är att krav ofta förändras och att mjukvara därför behöver utvecklas iterativt, med snabb feedback och små leveranser.

Agila metoder föredrar fungerande mjukvara, kundsamarbete, förändringsberedskap och nära kommunikation framför tunga dokument som ingen använder. Det betyder inte att dokumentation saknas. Det betyder att dokumentationen ska vara användbar, aktuell och kopplad till verkligt arbete.

## 2. Viktiga begrepp

- Agile development: iterativ och flexibel utveckling med fokus på fungerande mjukvara.
- User stories: korta krav ur användarens perspektiv.
- Product backlog: prioriterad lista över arbete.
- Sprint backlog: vad som görs i aktuell iteration.
- Increment: fungerande del av systemet efter en iteration.
- Customer involvement: återkoppling från kund eller representant.
- Refactoring: förbättra kodstruktur utan att ändra beteende.
- Test-first development: test skrivs före implementation.
- Continuous integration: ofta integrera och testa kod.
- Pair programming: två personer arbetar tillsammans vid samma kod, i kursen kan AI ibland fungera som stöd men inte som ansvarig utvecklare.

## 3. Relevans för 1DV613

Kursen vill se iterativt arbete. Abbas ska kunna visa hur projektet växer över tid, hur issues prioriteras, hur risker hanteras och hur varje iteration ger något konkret.

Agilt arbetssätt passar eftersom projektet har:

- kort tidsram
- osäkra tekniska risker
- extern uppdragsgivare
- AI/API-integration
- mobil video som riskområde
- krav som kan behöva justeras

## 4. Relevans för Abbas projekt

Abbas ska inte försöka bygga hela CapCut-liknande appen på en gång. Agil logik säger att han ska bygga ett fungerande kärnflöde först.

Prioriterad ordning:

1. Ladda Template-JSON.
2. Bygg EditSession.
3. Visa scener.
4. Navigera i editor.
5. Visa preview.
6. Testa video och timeline.
7. Lägg till overlays och effects.
8. Bygg compile-payload.

AI kan skapa mycket kod snabbt, men agil disciplin kräver att varje steg testas innan nästa tas.

## 5. När Gemini ska använda kapitlet

Använd detta kapitel när Gemini ska:

- skriva user stories
- bryta ner en stor feature
- prioritera backlog
- föreslå sprintmål
- begränsa scope
- förklara varför krav kan förändras
- hjälpa Abbas med iterationsrapport
- motivera att prototypen inte behöver vara perfekt direkt

## 6. Vad som måste synas i wiki, rapport, testning eller presentation

Wiki ska visa:

- backlog
- sprint eller iteration goals
- vad som implementerades
- vad som testades
- vad som flyttades fram
- varför scope begränsades

Rapport och presentation ska visa att Abbas arbetar iterativt:

- först grundstruktur
- sedan Template-JSON och state
- sedan UI och preview
- sedan compile-flöde

Det ska framgå att AI inte gör processen mindre viktig. AI gör snarare behovet av krav och testning större.

## 7. Praktisk koppling till projektet

När Gemini hjälper med kod ska det agila arbetssättet märkas genom:

- en feature per ändring
- issue-koppling
- konkret acceptanskriterium
- testfall direkt efter implementation
- ingen onödig feature expansion
- refaktorering bara när den förbättrar förståelse eller testbarhet

Exempel på bra user story för Abbas:

"Som användare vill jag se en horisontell tidslinje med alla scener så att jag får överblick över videons struktur."

Exempel på dålig user story:

"Som användare vill jag ha AI-redigering."

Den dåliga är för vag och leder till att AI gissar.
