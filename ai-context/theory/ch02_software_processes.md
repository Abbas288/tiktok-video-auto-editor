# Kapitel 2: Software Processes

## 1. Kärna i kapitlet

Kapitel 2 handlar om software process, alltså den organiserade kedja av aktiviteter som leder till en mjukvaruprodukt. Alla processer innehåller någon form av specifikation, utveckling, validering och evolution, men de kan organiseras på olika sätt.

Kapitlet jämför plan-driven processer, där mycket specificeras i förväg, med incremental och agile processer, där systemet byggs stegvis och förändras efter feedback. En central poäng är att olika system kräver olika processer. Det finns ingen metod som är bäst för alla projekt.

## 2. Viktiga begrepp

- Software process: strukturerad aktivitet för att utveckla mjukvara.
- Specification: definiera funktioner och begränsningar.
- Design and implementation: skapa arkitektur och kod.
- Validation: kontrollera att systemet möter kundens behov.
- Evolution: ändra systemet när behov förändras.
- Waterfall model: sekventiell modell med tydliga faser.
- Incremental development: systemet växer fram i små delar.
- Integration and configuration: system byggs av existerande komponenter och tjänster.
- Process activities: krav, design, implementation, testning och underhåll.
- Process improvement: förbättra arbetssättet över tid.

## 3. Relevans för 1DV613

Kursen kräver att Abbas visar ett medvetet arbetssätt. Det räcker inte att säga att koden skrevs. Han måste visa hur arbetet planerades, genomfördes, testades och följdes upp.

I 1DV613 är GitLab, Wiki, issues, milestones och iterationsrapporter praktiska bevis på process. De visar att utvecklingen inte bara sker slumpmässigt.

## 4. Relevans för Abbas projekt

Abbas projekt passar bäst som incremental development. Det är inte realistiskt att specificera hela videoredigeraren perfekt från början. Appen bör byggas i steg:

1. Expo Router foundation.
2. Template-JSON-typer.
3. EditSession.
4. Template parsing.
5. Home till editor-flöde.
6. Timeline.
7. Preview och video.
8. Text overlays.
9. Transitions och effects.
10. Compile-payload.
11. Backend/compile-server.

Varje steg måste testas innan nästa byggs. Detta minskar risken att ett stort AI-genererat kodblock ser korrekt ut men är svårt att verifiera.

## 5. När AI ska använda kapitlet

Använd detta kapitel när AI ska:

- hjälpa Abbas planera iterationer
- motivera incremental development
- skriva processdel i rapporten
- förklara varför projektet byggs feature-by-feature
- skapa eller förbättra GitLab issues
- hjälpa Abbas skriva iterationsrapport
- förklara varför prototyper används i början

## 6. Vad som måste synas i wiki, rapport, testning eller presentation

Wiki och rapport ska visa:

- vilken process Abbas följer
- varför incremental/agile passar ett kort studentprojekt
- hur krav, implementation och testning hänger ihop
- hur lärdomar från en iteration påverkar nästa
- hur AI används som stöd men inte ersätter process

Presentation bör visa:

- en tydlig ordning från Template-JSON till EditSession till UI
- att projektet inte försöker bygga allt samtidigt
- att testning följer efter varje implementation

## 7. Praktisk koppling till projektet

När AI kodar eller planerar ska kapitel 2 leda till:

- små commits
- små issues
- tydlig feature-scope
- testning före nästa steg
- inga stora omskrivningar utan anledning
- uppdaterad relevant ai-context
- dokumenterade risker när processen upptäcker osäkerhet

Processregeln för Abbas projekt är:

Bygg smalt. Testa hårt. Dokumentera kort. Gå vidare först när grunden håller.
