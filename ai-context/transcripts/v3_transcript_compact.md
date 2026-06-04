# Kompakt transkript, vecka 3

## MÅSTE FÖLJAS
- Vecka 3 handlar om krav, testning och planering.
- Enkla krav kan vara tvetydiga. Därför måste krav vara tydliga, verifierbara och validerbara.
- Testning ska börja tidigt och kopplas till krav.
- Manuella testfall ska kunna följas av någon annan.
- GitLab ska användas för issues, planering, prioritering och uppföljning.
- Wiki-sidor för krav, planering, testning och design ska börja fyllas.
- Det viktiga är inte att GitLab-processen är perfekt från dag ett, utan att Abbas provar och bygger struktur.

## BRA FÖR RAPPORT
- Software engineering handlar om att hantera komplexitet och kvalitet, inte bara skriva kod.
- Krav behövs för att förstå vad som ska byggas, planera arbetet och senare testa om det byggda systemet uppfyller behovet.
- Testning visar bara att fel finns, inte att systemet är felfritt.
- Testfall ska väljas medvetet. Happy path räcker inte.
- Testfall bör inkludera gränsvärden, ogiltig indata och edge cases.
- AI gör planering svårare eftersom kod kan produceras snabbt men förståelse, verifiering och dokumentation fortfarande tar tid.

## BRA FÖR MUNTLIG REDOVISNING
- Förklara skillnaden mellan att skriva kod och att verifiera att koden gör rätt sak.
- Beskriv hur Abbas började använda issues som kravspecifikation.
- Lyft att Template-JSON kräver särskilt tydliga krav eftersom en liten feltolkning kan påverka hela editorflödet.
- Beskriv teststrategin som: först manuell verifiering av kärnflödet, sedan automatiska tester för ren logik.

## BAKGRUND
- Föreläsningen om att arbeta i projekt betonade process, Git, GitLab och behovet av att veta vad som ska göras, göra det och kontrollera att det blev rätt.
- Kravföreläsningarna betonade att krav kommer från flera intressenter och måste kunna användas av utvecklare.
- Testföreläsningarna betonade att testfall bör byggas utifrån krav och konkreta scenarier.

## Risker och krav som påverkar Abbas projekt
- Risk: otydliga krav ger otydlig AI-genererad kod.
- Risk: testningen halkar efter implementationen.
- Risk: issues blir för stora och svåra att slutföra.
- Risk: AI skapar kod som verkar rimlig men bygger på fel antagande om Template-JSON.
- Krav: minst ett testfall per implementerat krav.
- Krav: regressionstest ska göras när tidigare funktionalitet påverkas.

## Saker AI ska komma ihåg vid kodarbete
- När AI implementerar en feature ska den först identifiera kravet.
- Varje kodändring ska få testförslag direkt.
- Testfall ska använda `TCx.y` och kopplas till krav.
- AI ska föreslå små issues om uppgiften är stor.
- Vid Template-JSON ska AI alltid tänka på validering, normalisering och felhantering.
- Vid Zustand-store ska AI tänka på state-reset, invalid id och flera templates.
