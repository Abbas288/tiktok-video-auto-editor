# Wiki-kontext och dokumentationsstil

## Syfte

Denna fil sammanfattar Abbas GitLab Wiki som en styrande källa för hur ny dokumentation, ai-context och framtida wikiutkast ska skrivas.

Wikin ska inte bara betraktas som extra text. Den är projektets spårbara processdokumentation och visar hur krav, planering, risker, testning, implementation och reflektion hänger ihop.

## Dokumentationsstruktur

Wikin är organiserad i följande huvuddelar:

* Documentation: vision, requirements, architecture, design och contributing.
* Planning: project plan och risk management.
* Method: development strategy, quality assurance och test focus.
* Testing: test specification och testrapporter.
* Sprints: iterationsrapporter vecka för vecka.
* Delivery: demo och post mortem.

När AI skapar ny dokumentation ska den följa samma logik:

1. Vad byggs?
2. Varför byggs det?
3. Vilket krav eller problem hör det till?
4. Hur testades det?
5. Vad lärde Abbas sig?
6. Vilka risker eller begränsningar finns kvar?

## Stil

Abbas wiki har en personlig men professionell stil.

Skriv så här:

* tydligt och konkret
* korta stycken
* svenska som huvudspråk
* tekniska termer på engelska när de är naturliga
* koppla alltid kod till krav, testning och risk
* skriv i jag-form i iterationsrapporter och reflektioner
* skriv mer neutralt i tekniska sidor som Architecture, Requirements och Test Specification
* visa ärligt vad som gick bra och vad som inte gick bra

Undvik:

* överdrivet akademiskt språk
* långa abstrakta resonemang utan projektkoppling
* att låta allt vara perfekt
* att upprepa samma sak på flera ställen
* att låsa dokumentation till en implementation om kravet är mer generellt
* att skriva att något är klart utan verifiering

## Grundberättelsen i wikin

Projektet är LeTrend Mobile, även kallat The TikTok Catalyst.

Kärnproblemet är att restauranger, caféer och barer behöver TikTok-innehåll men saknar tid och teknisk redigeringskunskap.

Lösningen är en mobil videoredigeringsapp som använder en AI-genererad Template-JSON som grund. Användaren lägger in egna videoklipp, appen applicerar scenstruktur, timing, captions, filter, ljud och exportflöde.

Viktig formulering:

```text
Projektet handlar inte bara om att skapa en mobilvy. Det handlar om att bygga ett testbart editorflöde där Template-JSON, EditSession, timeline, preview och compile-payload hänger ihop som ett mjukvarusystem.
```

## Dokumentationen som projektets minne

En återkommande idé i wikin är att dokumentationen är projektets minne.

Det betyder:

* koden räcker inte ensam som bevis
* beslut måste dokumenteras
* risker måste synliggöras
* testresultat måste kopplas till krav
* iterationsrapporter ska visa progression
* ai-context ska hjälpa AI förstå projektet utan att gissa

När AI hjälper med ny dokumentation ska den därför alltid fråga sig:

* Vilken del av projektets historia kompletterar detta?
* Gör texten det lättare att förstå varför en ändring gjordes?
* Går det att följa ändringen från krav till test?

## AI-arbetssätt

Wikin beskriver ett tydligt strategibyte i vecka 4.

Tidigare ville Abbas koda allt själv. Efter tidsbrist, kurskrav och tung stack bytte han till ett AI-stött arbetssätt där AI används som hävstång.

Princip:

* AI producerar volym och första utkast.
* Abbas styr arkitektur, scope, kvalitet och verifiering.
* Kod har inget värde förrän den är förstådd, verifierad och dokumenterad.

AI ska därför inte behandla AI-genererad kod som automatiskt korrekt. Den ska hjälpa Abbas minska tillitsgapet.

## Riskbild

Wikin visar att riskerna har förändrats.

Tidiga risker:

* komplex UX
* videouppspelning i Expo
* integrationer och dataformat
* compile-server och payload-matchning

Senare huvudrisk:

* falsk trygghet i AI-genererad kod
* snabb implementation utan tillräcklig testning
* rörig ansvarsfördelning i komponenter
* dokumentation som halkar efter
* features som inte är verifierade

AI ska därför prioritera:

* små issues
* tydliga acceptanskriterier
* testfall före implementation
* verifiering med `npm run verify`
* manuell testning för UX
* refaktorering när filer blir för stora

## QA och testning

Wikin använder QA som en aktiv process, inte ett sista steg.

Kvalitetssäkring i Abbas projekt bygger på:

* tydliga krav
* acceptanskriterier som Definition of Done
* manuell UX-verifiering
* edge case-testning
* automatiserade tester av kritisk logik
* mockning och dependency injection
* regressionstestning vid refaktorering

Testnivåer som återkommer:

* enhetstestning för ren domänlogik
* komponenttestning för kontrollerade UI-komponenter
* manuell systemtestning för hela editorflödet
* regressionstestning efter refactor
* CI/CD-pipeline som quality gate

## Iterationsmönster

Iterationsrapporterna följer ungefär detta mönster:

```md
# Iterationsrapport – vecka X

## Mål

Kort vad iterationen skulle uppnå.

## Reflektion

Vad gick bra, vad gick mindre bra och vad tas med vidare.

## Genomfört arbete

Lista eller tabell med issues, kategori, estimat och arbetad tid.

## Testning och verifiering

Vilka tester kördes och vilka testfall/rapporter täcker arbetet.

## Risker och lärdomar

Kvarstående problem, ändrad riskbild och beslut inför nästa iteration.
```

När AI skriver iterationsrapport ska texten vara konkret och ärlig. Det är bättre att säga att något tog längre tid eller inte blev färdigt än att låtsas att allt gick enligt plan.

## Testrapportmönster

Testrapporterna i wikin brukar innehålla:

* allmän information
* syfte och scope
* testmiljö
* testtyp
* teststrategi
* testnivåer
* testresultat i tabell
* reflektion eller begränsningar

Resultat ska vara spårbara till issue och testfall.

Exempel på bra formulering:

```text
Den största begränsningen är att gröna enhetstester inte bevisar att hela appen fungerar på riktig mobilhårdvara. Därför kompletterades de automatiserade testerna med manuell testning av editorns kärnfunktioner.
```

## Branching och MR-disciplin

Wikin stödjer feature branching och MR som plats för spårbarhet.

Arbetsmönster:

1. Issue skapas med acceptanskriterier.
2. Testfall kopplas till issue.
3. Branch skapas från uppdaterad `main`.
4. Implementation görs i branch.
5. Verifiering körs.
6. MR beskriver ändringen och stänger issue/testfall.
7. Efter merge dras `main` igen.

Viktig regel:

```bash
git status
git switch main
git pull
git switch -c <issue-number-short-branch-name>
```

## Wiki som källa för framtida AI-svar

AI ska använda wikin när den hjälper Abbas med:

* ny wiki-text
* iterationsrapport
* testrapport
* post mortem
* demo-text
* MR-beskrivning
* riskanalys
* QA-reflektion
* motivering av AI-arbetssätt
* kurskoppling

Om användaren ber om text som ska in i GitLab Wiki ska AI emulera wiki-stilen i denna fil.
