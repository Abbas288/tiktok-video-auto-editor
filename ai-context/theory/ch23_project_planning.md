# Kapitel 23: Project Planning

## 1. Kärna i kapitlet

Kapitel 23 handlar om projektplanering, schemaläggning och estimering. Ett mjukvaruprojekt behöver brytas ner i arbete som går att planera, följa upp och justera.

Projektplanering är inte en engångsaktivitet. Planen måste uppdateras när ny information, nya problem, ändrade krav eller tekniska risker uppstår.

Kapitlet skiljer också mellan kostnad, effort och pris. För Abbas är pris mindre relevant, men effort, tidsestimering och uppföljning är direkt relevant för GitLab och iterationsrapporter.

## 2. Viktiga begrepp

- Project planning: bryta ner och styra arbetet.
- Project plan: dokument som beskriver arbete, resurser, schema och risker.
- Scheduling: placera aktiviteter i tid.
- Effort: arbetstid som krävs.
- Estimate: uppskattad tid eller arbetsmängd.
- Actual time: faktisk tid.
- Milestone: förutsägbart kontrollpunkt eller resultat.
- Deliverable: arbetsprodukt som levereras.
- Planning game: agil planering där scope justeras efter kapacitet.
- Bar chart: visuell plan över aktiviteter i tid.
- Estimation uncertainty: tidiga estimat är osäkra.

## 3. Relevans för 1DV613

I kursen ska Abbas visa planering genom GitLab issues, estimates, spend, iterationsrapporter och Wiki.

Det viktiga är inte att estimaten alltid är perfekta. Det viktiga är att Abbas kan:

- uppskatta arbete
- jämföra estimate och faktisk spend
- reflektera över skillnaden
- justera planeringen
- bryta ner stora features
- visa framdrift

## 4. Relevans för Abbas projekt

Abbas app är stor i visionen men kursen är tidsbegränsad. Därför måste planeringen skydda MVP.

Planeringen bör fokusera på kärnflödet:

1. Projektgrund och routes.
2. Template-JSON-typer.
3. EditSession.
4. Template parsing.
5. Timeline.
6. Preview.
7. Text overlays.
8. Transitions/effects.
9. Compile-payload.
10. Compile-server integration.

Om tid saknas ska extra polish, avancerade effects och direkt TikTok-delning prioriteras bort.

## 5. När AI ska använda kapitlet

Använd detta kapitel när AI ska:

- skapa eller förbättra issues
- föreslå estimates
- skriva sprint backlog
- skriva iterationsrapport
- analysera tidsavvikelse
- prioritera features
- skapa milestone eller deliverable
- föreslå vad som bör flyttas till nästa iteration

## 6. Vad som måste synas i wiki, rapport, testning eller presentation

Wiki och rapport ska visa:

- planerade features
- faktisk progress
- estimates
- spend
- skillnad mellan plan och verklighet
- risker som påverkat tid
- vilka delar som prioriterats bort
- varför planeringen ändrats

Presentation kan säga:

"Planeringen ändrades eftersom projektets risk inte låg i att skriva mer UI, utan i att verifiera Template-JSON, EditSession, videouppspelning och compile-payload. Därför prioriterades teknisk grund före stora visuella features."

## 7. Praktisk koppling till projektet

När AI hjälper Abbas planera ska issues vara små nog att testas.

Dålig issue:

"Bygg editor."

Bra issues:

- "Definiera Template-JSON-typer."
- "Bygg EditSession från mockTemplate."
- "Visa scener i editor route."
- "Klick på scen uppdaterar selectedSceneId."
- "Skapa compile-payload från EditSession."

Rekommenderad issue-struktur:

```md
## Mål

## Kravkoppling

## Acceptanskriterier

## Testfall

## Risker

## Estimate
```

AI ska komma ihåg:

- Estimat ska inkludera testning och dokumentation.
- AI kan minska kodtid men ökar granskningsbehov.
- Om tiden spricker ska scope minskas, inte testning hoppas över.
