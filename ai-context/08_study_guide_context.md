# Betygskrav G och VG

## Syfte

Denna fil sammanfattar betygskraven i 1DV613 som direkt påverkar Abbas projekt. Den ska användas när AI hjälper till med informera om kurskrav, Wiki, issues, testfall, testrapporter, iterationsrapporter, presentation och slutleverans.

Fokus här är bara G- och VG-krav.

## Provmoment

| Provmoment | Innehåll | Betyg | Poäng |
|------------|---------|-------|-------|
| 2101 | Muntlig examination | U/G | 4 hp |
| 2102 | Projekt | U/G/VG | 11 hp |

För slutbetyget VG krävs G på 2101 och VG på 2102.

## Kursmål som examineras muntligt

Abbas ska kunna resonera om:

* utvecklingsprocesser och begrepp som krav, implementation, testning, leverans och planering
* automatisering i mjukvaruutveckling, inklusive arbetsflöden, versionshantering, kontinuerlig leverans och automatiserad testning
* juridik och etik i mjukvaruutveckling och i relation till valt projekt

## Kursmål som examineras i projektet

Projektet ska visa att Abbas kan:

* planera och genomföra ett individuellt utvecklingsprojekt med strukturerad process
* arbeta med versionshantering, kodstandard och etablerade konventioner
* redovisa och kommunicera resultat och status skriftligt och muntligt
* utvärdera implementationen genom strukturerad testning
* reflektera kring lagstiftning och etik i relation till projektet

## G-krav: övergripande

För G måste alla projektuppgifter genomföras och godkännas. Appen måste ha rimlig svårighetsgrad. Projektet får använda externa källor och AI, men Abbas måste tydligt ange vad som är lånat, vad han själv har byggt och följa relevanta licenser.

## G-krav: kravhantering och planering

Abbas ska visa att:

* det går att se vad som planerats för varje iteration
* det går att följa upp vad som faktiskt blev gjort
* uppgifter har brutits ner till lämplig storlek
* funktionella krav beskriver produktens funktionalitet på rätt nivå
* icke-funktionella krav beskriver produktens kvaliteter på rätt nivå
* det finns etiska överväganden kring appen och projektet

## G-krav: testning

Abbas ska visa att:

* varje implementerat krav har minst ett testfall
* alla testfall behöver inte vara godkända, men de ska vara dokumenterade
* tidigare implementerade krav regressionstestas och redovisas i veckomöten
* minst en metod är automatiskt enhetstestad
* automatiska tester är användbara, alltså varje test ska kunna fånga en rimlig bugg
* metoden som testas automatiskt har minst en kontrollsats, till exempel `if`, `for`, `while` eller `try-catch`

## G-krav: implementation

Koden ska hålla acceptabel kvalitet. Det betyder:

* undvik duplicering
* använd begripliga namn på filer, variabler, klasser och funktioner
* dela upp koden i flera filer
* dokumentera och följ kodstandard
* ha en enklare schematisk bild över arkitekturen
* driftsätt appen
* versionshantera hela kodbasen kontinuerligt
* dokumentera koden så att andra utvecklare kan förstå den

## VG-krav: grundregel

För VG krävs att G-kraven är uppfyllda. Därefter bedöms projektet mot högre krav på spårbarhet, prioritering, testning, kodkvalitet, dokumentation och CI/CD.

## VG-krav: kravhantering och planering

Abbas ska visa att:

* majoriteten av iterationsplanerna resonerar kring föregående iterations resultat och arbetssätt
* processförbättringar har genomförts och utvärderats löpande
* uppgifter och krav har prioriterats genomtänkt
* prioriteringsmetoden är beskriven och motiverad
* det finns tydliga beroenden och spårbarhet mellan artefakter, till exempel issue, krav, testfall och MR
* kraven är väl beskrivna och kategoriserade
* kravkategorier är definierade
* kvalitetskrav är väl definierade och testbara
* organisationskrav är väl definierade och testbara

## VG-krav: testning

Abbas ska visa att:

* release-testningen har en överblick som visar vilka krav som är implementerade och testade
* krav med scenarion täcks av minst ett test per scenario
* tester kan vara manuella eller automatiserade, men de ska vara spårbara
* projektet har automatiska enhetstester för minst 10 olika metoder
* varje automatiskt test är användbart enligt G-kravet
* automatiska tester körs i projektets CI/CD-flöde
* en annan student har testat appen och feedbacken är dokumenterad

## VG-krav: implementation

Koden ska hålla hög kvalitet. Det betyder:

* låg nivå av upprepning
* undvik upprepade hårdkodade konstanter och dolda beroenden
* jämn storlek och komplexitet mellan funktioner, klasser, moduler och modeller
* ingen central del ska vara orimligt stor eller komplicerad jämfört med andra delar
* koden är organiserad i tydliga logiska delar
* valda tekniker och arkitektur följer etablerad praxis
* undvik globala variabler och använd inkapsling
* kodstandard verifieras automatiskt i GitLab när koden ändras
* centrala flöden dokumenteras med sekvensdiagram
* utvalda delar dokumenteras med klassdiagram eller motsvarande
* appen kan driftsättas via GitLab CI/CD
* semantisk versionshantering följs
* branching strategy är vald, följd och dokumenterad
* kod dokumenteras så att utvecklingsverktyg kan dra nytta av den, till exempel JSDoc eller motsvarande

## Praktisk kontroll för Abbas projekt

För att sikta på VG ska AI alltid kontrollera detta:

* Finns issue och acceptanskriterier?
* Finns kopplade testfall?
* Finns spårbarhet från krav till issue, test och MR?
* Är `npm run verify` grön för relevant del?
* Körs automatiska tester i GitLab CI/CD?
* Är deployment via GitLab och Cumulus dokumenterad?
* Finns sekvensdiagram och klassdiagram för centrala flöden?
* Finns release-testöversikt eller testrapport?
* Är begränsningar och risker ärligt dokumenterade?
* Är AI-användning transparent och verifierad?
