# Transkriptregler (transcript_rules.md)

## Syfte
Denna fil styr hur Gemini ska använda transkriptioner från kursen. Transkriptionerna är råmaterial, inte primär arbetskontext. Gemini ska läsa dem selektivt och omvandla dem till praktisk projektkunskap.

## Grundregel
Transkriptioner ska aldrig klistras in som en enda lång kontextmassa. De ska kondenseras efter vecka, tema och relevans.

## Vad som ska behållas
Behåll information som påverkar:
- examination
- standups
- presentationer
- GitLab
- wiki
- krav
- testning
- implementation
- arkitektur
- riskhantering
- Docker och drift
- betygskriterier
- individuell uppföljning
- Abbas projektbeslut

## Vad som ska kastas bort
Ta bort:
- småprat
- upprepningar
- felsägningar
- tekniskt brus från transkriberingen
- långa sidospår utan kursrelevans
- detaljer som inte påverkar Abbas projekt

## Struktur för kompakta transkript
Varje kompakt transkript ska använda denna struktur:

```md
# Kompakt transkript, vecka X

## MÅSTE FÖLJAS

## BRA FÖR RAPPORT

## BRA FÖR MUNTLIG REDOVISNING

## BAKGRUND

## Risker och krav som påverkar Abbas projekt

## Saker Gemini ska komma ihåg vid kodarbete
```

## Prioriteringsordning
När informationen är för lång ska Gemini prioritera:
1. kurskrav och examination
2. krav, testning och GitLab
3. implementation och arkitektur
4. risker och Definition of Done
5. veckospecifik arbetsplan
6. allmän teori

## Språk
Skriv på svenska. Behåll etablerade tekniska termer på engelska.

## Särskilt för Abbas projekt
Transkript ska alltid kopplas till Abbas verkliga projektflöde:

`TikTok URL -> AI/API video analysis -> Template-JSON -> EditSession -> Editor UI -> Preview/Timeline -> Compile-payload -> backend/compile-server -> Rendered video via FFmpeg`

Gemini ska aldrig låta transkriptioner från grupparbete med Ida och Wasim bli krav för Abbas kod.

## När råtranskript ska läsas igen
Läs råtranskript bara när:
- Abbas frågar efter exakt kursformulering
- en veckorapport behöver mer detaljer
- en presentation ska förberedas
- en examinerande fråga behöver besvaras
- något i de kompakta filerna verkar otillräckligt

## När råtranskript inte ska läsas
Läs inte råtranskript när:
- Gemini ska implementera kod
- en enkel issue ska lösas
- kompaktfilen redan täcker frågan
- stora filer riskerar att kapa kontexten
