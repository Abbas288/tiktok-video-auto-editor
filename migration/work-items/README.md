# Arbetsobjekt och nummerplatser

| Nummer | Ursprunglig typ | Titel |
|---|---|---|
| [#1](001.md) | Issue | SYSTEM: Systemet ska kunna läsa in och validera ett Template-JSON så att appen kan bygga upp en intern redigeringssession. |
| [#2](002.md) | Issue | USER STORY: Som användare vill jag att källvideon spelas upp i editorn, så att jag visuellt kan granska det rörliga materialet jag redigerar istället för att se en tom yta. |
| [#3](003.md) | Issue | USER STORY: Som användare vill jag se en horisontell tidslinje med alla scener, så att jag får en överblick över videons struktur. |
| [#4](004.md) | Issue | USER STORY: Som användare vill jag kunna klicka på ett specifikt scen-block i tidslinjen så att videon direkt hoppar till den scenen. |
| [#5](005.md) | Issue | USER STORY: Som användare vill jag att text från mallen visas ovanpå videon vid exakt rätt tidpunkt, så att rätt budskap framgår. |
| [#6](006.md) | Issue | USER STORY: Som användare vill jag kunna ändra textens innehåll, färg, storlek och dra den till en ny position på skärmen så att jag kan anpassa utseendet. |
| [#7](007.md) | Issue | USER STORY: Som användare vill jag kunna lägga till visuella filter (ljusstyrka, kontrast, zoom) på en specifik scen. |
| [#8](008.md) | Issue | USER STORY: Som användare vill jag kunna justera volymen för både originalljudet och bakgrundsmusiken, eller stänga av ljudet helt, så att musiken inte överröstar pratet. |
| [#9](009.md) | Issue | SYSTEM: Systemet ska kunna skicka den färdiga redigeringssessionen till compile-servern och ta emot en färdig videofil. |
| [#10](010.md) | Issue | USER STORY: Som användare vill jag ladda ner den färdigredigerade filen till min telefon så att jag kan publicera den |
| [#11](011.md) | Issue | USER STORY: Som användare vill jag kunna välja en övergång mellan två scener på tidslinjen, så att projektets klippflöde blir tydligare och kan förberedas för en snyggare export. |
| #12 | Nummerplats | [Nummerplats #12] Ingen arbetsuppgift i källunderlaget |
| #13 | Nummerplats | [Nummerplats #13] Ingen arbetsuppgift i källunderlaget |
| #14 | Nummerplats | [Nummerplats #14] Ingen arbetsuppgift i källunderlaget |
| #15 | Nummerplats | [Nummerplats #15] Ingen arbetsuppgift i källunderlaget |
| #16 | Nummerplats | [Nummerplats #16] Ingen arbetsuppgift i källunderlaget |
| #17 | Nummerplats | [Nummerplats #17] Ingen arbetsuppgift i källunderlaget |
| #18 | Nummerplats | [Nummerplats #18] Ingen arbetsuppgift i källunderlaget |
| #19 | Nummerplats | [Nummerplats #19] Ingen arbetsuppgift i källunderlaget |
| [#20](020.md) | Testfall | TC1.1 Home-vyn renderar template-listan |
| [#21](021.md) | Testfall | TC1.2 Template laddas in i EditSession |
| [#22](022.md) | Testfall | TC1.3 Editor-vyn öppnas med template-id |
| [#23](023.md) | Testfall | TC1.4 Preview-vyn öppnas med template-id |
| [#24](024.md) | Testfall | TC1.5 TypeScript och lint passerar |
| [#25](025.md) | Testfall | TC1.6 Ogiltigt template-id kraschar inte appen |
| [#26](026.md) | Testfall | TC2.1 Giltig Template-JSON tolkas |
| [#27](027.md) | Testfall | TC2.2 Saknad scenlista avvisas |
| [#28](028.md) | Testfall | TC2.3 Tom scenlista hanteras |
| [#29](029.md) | Testfall | TC2.4 Negativ 'duration' avvisas |
| [#30](030.md) | Testfall | TC2.5 Ogiltig sourceVideoUrl hanteras |
| [#31](031.md) | Testfall | TC2.6 EditSession sparar aktiv scen |
| [#32](032.md) | Issue | BUG: Routing-konflikt mellan editor och preview i Expo Router |
| [#33](033.md) | Issue | FIX: "Go back"-knappen fungerar inte vid direktnavigering till ogiltigt ID |
| [#34](034.md) | Issue | Fix: Show error message when templates fail to load |
| [#35](035.md) | Issue | SYSTEM: Systemet ska kunna driftsättas på Cumulus med Docker Compose. |
| [#36](036.md) | Testfall | TC-D1: Lokal Docker-build |
| [#37](037.md) | Testfall | TC-D2: Lokal körning via Docker Compose |
| [#38](038.md) | Testfall | TC-D3: Driftsättning till Cumulus |
| [#39](039.md) | Testfall | TC-D4: Säkerhetskontroll före commit |
| [#40](040.md) | Testfall | TC-D5: HTTPS och certifikat fungerar på Cumulus |
| [#41](041.md) | Issue | FIX: Lägg till HTTPS för Cumulus-deployment |
| [#42](042.md) | Issue | FIX: Stabilisera template-id i editor och preview |
| [#43](043.md) | Testfall | TC-E1: Editor och preview hanterar saknat eller ogiltigt template-id |
| [#44](044.md) | Testfall | TC-V1: Videon laddas och kan spelas upp i editorn |
| [#45](045.md) | Testfall | TC-V2: Ogiltig video-URL kraschar inte appen |
| [#46](046.md) | Testfall | TC-T1: Tidslinjen renderar scener kronologiskt och går att scrolla |
| [#47](047.md) | Testfall | TC-T2: Tidslinjen hanterar tom scenlista säkert |
| [#48](048.md) | Testfall | TC-S1: Videon hoppar till rätt starttid vid klick på scen i tidslinjen |
| [#49](049.md) | Testfall | TC-S2: Upprepade klick på olika scener synkar spelaren korrekt |
| [#50](050.md) | Testfall | TC-O1: Text visas och döljs synkroniserat med videons tid |
| [#51](051.md) | Testfall | TC-O2: Text renderas med rätt stil och position ovanpå videon |
| [#52](052.md) | Testfall | TC-O3: Hantering av extremt långa textsträngar (Defect Test/ Edge Case) |
| [#53](053.md) | Testfall | TC-O4: Hantering av tomma textsträngar (Edge Case) |
| [#54](054.md) | Testfall | TC-O5: Flera överlappande textöverlagringar (Edge Case) |
| [#55](055.md) | Testfall | TC-O6: Återgivning av specialtecken och emojis |
| [#56](056.md) | Testfall | TC-O7: Fullscreen bevarar text-overlays på video |
| [#57](057.md) | Testfall | TC-E1: Redigera textinnehåll, färg och storlek uppdaterar vyn direkt |
| [#58](058.md) | Testfall | TC-E2: Dra-och-släpp uppdaterar textens position säkert |
| [#59](059.md) | Testfall | TC-E3: Utkast överlever att editorn stängs och öppnas igen |
| [#60](060.md) | Testfall | TC-E4: Utkast överlever browser-refresh |
| [#61](061.md) | Testfall | TC-E5: Fullscreen fungerar som förhandsvisning och blockerar textredigering |
| [#62](062.md) | Issue | SYSTEM: Systemet ska verifiera och driftsätta appen via CI/CD |
| [#63](063.md) | Testfall | TC-C1: Merge Request verifieras automatiskt med verify-steget |
| #64 | Nummerplats | [Nummerplats #64] Ingen arbetsuppgift i källunderlaget |
| [#65](065.md) | Testfall | TC-C2: Docker-image byggs och sparas i registret vid merge till main |
| [#66](066.md) | Testfall | TC-C3: Appen uppdateras på Cumulus vid deploy-steget |
| [#67](067.md) | Testfall | TC-F1: Ändra ljusstyrka, kontrast och zoom för vald scen |
| [#68](068.md) | Testfall | TC-F2: Filter påverkar endast vald scen |
| [#69](069.md) | Testfall | TC-F3: Filterändringar sparas som utkast |
| [#70](070.md) | Testfall | TC-F4: Reset återställer scenens filter |
| [#71](071.md) | Testfall | TC-A1: Bakgrundsmusik följer videons uppspelning |
| [#72](072.md) | Testfall | TC-A2: Användaren kan justera och tysta ljudkällor via editorn |
| [#73](073.md) | Testfall | TC-A3: Volyminställningar sparas i utkast |
| [#74](074.md) | Testfall | TC-A4: Användaren kan använda mute-knappen för varje ljudkälla |
| [#75](075.md) | Testfall | TC-R1: Volymvärden hanteras konsekvent efter refaktorering |
| [#76](076.md) | Testfall | TC-R2:Malländringar bevaras korrekt utan mutation efter refaktorering |
| [#77](077.md) | Testfall | TC-R3: Utkast kombineras med aktuell mall utan dataförlust |
| [#78](078.md) | Issue | REFACTOR: Bryt ut hjälpfunktioner för ljud- och mallredigering utan att ändra funktionalitet |
| [#79](079.md) | Issue | REFACTOR: Förtydliga editorns koordineringslogik utan att ändra funktionalitet |
| [#80](080.md) | Testfall | TC-R4: Editorflödet fungerar efter refaktorering |
| [#81](081.md) | Testfall | TC-R5: Editorverktygen fungerar efter refaktorering |
| [#82](082.md) | Issue | REFACTOR: Standardisera editorpaneler och kontrollrader utan att ändra funktionalitet |
| [#83](083.md) | Testfall | TC-R6: Editorpaneler visas och fungerar efter standardisering |
| [#84](084.md) | Testfall | TC-R7: Kontrollrader och knappar behåller sitt beteende efter standardisering |
| [#85](085.md) | Testfall | TC-T1: Användaren kan välja en övergång mellan två scener |
| [#86](086.md) | Testfall | TC-T2: Användaren kan ändra en vald övergång |
| [#87](087.md) | Testfall | TC-T3: Övergångar sparas i utkast |
| [#88](088.md) | Testfall | TC-T4: Vald övergång förhandsvisas i editorn |
| [#89](089.md) | Testfall | TC-C1: Compile payload skapas från aktuell redigeringssession |
| #90 | Nummerplats | [Nummerplats #90] Ingen arbetsuppgift i källunderlaget |
| [#91](091.md) | Testfall | TC-C2: UI visar tydligt att kompilering pågår |
| [#92](092.md) | Testfall | TC-C3: Appen tar emot och visar färdig kompilerad video |
| [#93](093.md) | Testfall | TC-D1: Exportåtgärder visas när färdig video finns |
| [#94](094.md) | Testfall | TC-D2: Användaren kan spara eller ladda ner färdig video lokalt |
| [#95](095.md) | Testfall | TC-D3: Nekad behörighet eller misslyckat sparande hanteras säkert |
| [#96](096.md) | Issue | SYSTEM: Systemet ska hantera en minimal compile-server integration för render-pipeline |
| [#97](097.md) | Testfall | TC-S1: Appen kan skicka redigeringssession till compile-servern |
| [#98](098.md) | Testfall | TC-S2: Appen hanterar svar från compile-servern |
| [#99](099.md) | Testfall | TC-S3: Fel från compile-servern hanteras säkert |
| [#100](100.md) | Issue | SYSTEM: Systemet ska kunna rendera redigeringssession med FFmpeg i compile-servern |
| [#101](101.md) | Testfall | TC-RF1: Servern renderar video i renderingsläge |
| [#102](102.md) | Testfall | TC-RF2: Textöverlägg och scene effects syns i exporterad video |
| [#103](103.md) | Testfall | TC-RF3: Övergångar och ljudinställningar påverkar exporterad video |
| [#104](104.md) | Testfall | TC-RF4: Renderingsfel hanteras utan serverkrasch |
| [#105](105.md) | Testfall | TC-D4: Trasig exportadress hanteras med begriplig felsida |
| [#106](106.md) | Issue | USER STORY: Som användare vill jag lägga in egna videokällor för alla scener så att den färdiga videon bygger på mitt eget material |
| [#107](107.md) | Testfall | TC-SV1: Användaren kan välja och godkänna video för en scen |
| [#108](108.md) | Testfall | TC-SV2: Nekad behörighet vid videoval hanteras säkert |
| [#109](109.md) | Testfall | TC-SV3: För lång video kräver valt klippintervall |
| [#110](110.md) | Testfall | TC-SV4: Compile blockeras tills alla scener har godkända videor |
| [#111](111.md) | Testfall | TC-SV5: Export använder godkända scenvideor och mallens redigeringsdata |
| [#112](112.md) | Testfall | TC-SV6: Preview blockeras tills alla scenvideor är godkända |
| [#113](113.md) | Issue | REFACTOR: Minska ansvar i editor-controller och förbättra testbarheten |
| [#114](114.md) | Testfall | TC-RC1: Editorflödet fungerar efter refaktorering |
| [#115](115.md) | Testfall | TC-RC2: Textöverlägg, scene filters och transitions påverkas inte av refaktorering |
| [#116](116.md) | Testfall | TC-RC3: Egna scenvideor fungerar efter refaktorering |
| [#117](117.md) | Testfall | TC-RC4: Compile-flow fungerar efter refaktorering |
| [#118](118.md) | Testfall | TC-RC5: Verifiering och regressionsskydd passerar |
| [#119](119.md) | Issue | USER STORY: Som användare vill jag ha ett mer fokuserat editorgränssnitt så att jag kan redigera utan att tappa överblick |
| [#120](120.md) | Testfall | TC-UX1: Scenvideo-sektionen är kompakt och scenval fungerar |
| [#121](121.md) | Testfall | TC-UX2: Scenkort visar rätt metadata och kompakt status |
| [#122](122.md) | Testfall | TC-UX3: Ikonbaserade video-actions fungerar |
| [#123](123.md) | Testfall | TC-UX4: Kompakt editor påverkar inte preview, filters eller compile |
| [#124](124.md) | Issue | USER STORY: Som användare vill jag skapa projekt från en egen JSON-template så att editorn inte är låst till mockdata |
| [#125](125.md) | Testfall | TC-CP1: Användaren kan skapa projekt från giltig JSON-template |
| [#126](126.md) | Testfall | TC-CP2: Ogiltig template hanteras tydligt |
| [#127](127.md) | Testfall | TC-CP3: Användaren kan kopiera AI-prompt för template-generering |
| [#128](128.md) | Testfall | TC-CP4: Importerad template styr editorflödet |
| [#129](129.md) | Testfall | TC-CP5: End-to-end generering av template via AI |
| [#130](130.md) | Issue | FIX: Förbättra root-navbar och gör My Projects klickbar |
| #131 | Nummerplats | [Nummerplats #131] Ingen arbetsuppgift i källunderlaget |
| [#132](132.md) | Testfall | TC-NV1: My Projects tar användaren till root |
| [#133](133.md) | Testfall | TC-NV2: Navbaren matchar appens design |
| [#134](134.md) | Testfall | TC-NV3: Navbaren påverkar inte editorflödet |
| [#135](135.md) | Issue | USER STORY: Som användare vill jag hantera mina projekt från startsidan |
| #136 | Nummerplats | [Nummerplats #136] Ingen arbetsuppgift i källunderlaget |
| [#137](137.md) | Testfall | TC-PM1: Användaren kan öppna projekt från startsidan |
| [#138](138.md) | Testfall | TC-PM2: Användaren kan byta projektnamn |
| [#139](139.md) | Testfall | TC-PM3: Ändrat projektnamn följer med till editorn |
| [#140](140.md) | Testfall | TC-PM4: Användaren kan ta bort eller avbryta radering av projekt |
| #141 | Nummerplats | [Nummerplats #141] Ingen arbetsuppgift i källunderlaget |
| [#142](142.md) | Issue | REFACTOR: Dela upp startsidans projektöversikt i mindre delar |
| [#143](143.md) | Issue | TC-PR1: Projektöversikten fungerar efter refaktorering |
| [#144](144.md) | Issue | TC-PR2: Rename fungerar efter refaktorering |
| [#145](145.md) | Issue | TC-PR3: Delete fungerar efter refaktorering |
| [#146](146.md) | Issue | TC-PR4: Importflödet fungerar efter refaktorering |
| [#147](147.md) | Issue | FIX: Separera download och open i exportflödet |
| [#148](148.md) | Testfall | TC-EX1: Download startar nedladdning på webben |
| [#149](149.md) | Testfall | TC-EX2: Open öppnar färdig video |
| [#150](150.md) | Testfall | TC-EX3: Save på mobil hanterar behörighet och sparande |
| [#151](151.md) | Testfall | TC-EX4: Trasig videoreferens hanteras säkert |
| #152 | Nummerplats | [Nummerplats #152] Ingen arbetsuppgift i källunderlaget |
| [#153](153.md) | Issue | USER STORY: Som användare vill jag läsa mer om template-innehåll så att jag förstår hur appen fungerar |
| [#154](154.md) | Testfall | TC-TG1: Användaren kan öppna template-guiden |
| [#155](155.md) | Testfall | TC-TG2: Informationssidan förklarar template-innehåll |
| [#156](156.md) | Testfall | TC-TG3: AI-prompten visas och kan kopieras |
| [#157](157.md) | Testfall | TC-TG4: Tillbaka-navigering fungerar |
| [#158](158.md) | Issue | DOCS: Uppdatera ai-context och GEMINI.md med aktuell kurs- och projektkontext |
| [#159](159.md) | Issue | REFACTOR: Ta bort oanvänd preview-route |
| [#160](160.md) | Issue | FIX: Utöka CI/CD-pipeline med compile-server och förbättrad verifiering |
| [#161](161.md) | Testfall | TC-SR1: Editorn hanterar gammal session efter omstart |
| [#162](162.md) | Testfall | TC-SR2: Användaren kan återställa scenmedia utan att rensa webbplatsdata |
| [#163](163.md) | Testfall | TC-SR3: Compile blockeras när scenvideor inte längre är användbara |
| [#164](164.md) | Testfall | TC-SR4: Nya sessioner påverkas inte negativt |
| [#165](165.md) | Testfall | TC-CICD1: Verifieringssteget körs i separata jobb för app och compile-server |
| [#166](166.md) | Testfall | TC-CICD2: Deployment-pipelinen bygger och rullar ut hela stacken via SSH |
| [#167](167.md) | Issue | FIX: Compile misslyckas i deployed miljö trots godkända scenvideor |
| [#168](168.md) | Testfall | TC-CF1: Compile fungerar i deployed miljö efter godkända scenvideor |
| [#169](169.md) | Issue | FIX: Editorn återställer inte otillgängliga scenvideor från tidigare session |
| [#170](170.md) | Testfall | TC-CF2: Compile-server loggar felkällan vid avsiktligt trasig mediareferens |
| [#171](171.md) | Testfall | TC-CF3: Appen hanterar kontrollerat compile-fel utan krasch |
| [#172](172.md) | Issue | DOCS: Uppdatera ai-context, README och projektguide |
| [#173](173.md) | Krav | REQ-01: Projekt och templates |
| [#174](174.md) | Krav | REQ-02: Template-guide och AI-prompt |
| [#175](175.md) | Krav | REQ-03: Editor och scenöversikt |
| [#176](176.md) | Krav | REQ-04: Textöverlägg |
| [#177](177.md) | Krav | REQ-05: Effekter och övergångar |
| [#178](178.md) | Krav | REQ-06: Ljudkontroll |
| [#179](179.md) | Krav | REQ-07: Egna scenvideor |
| [#180](180.md) | Krav | REQ-08: Compile-payload |
| [#181](181.md) | Krav | REQ-09: Serverrendering |
| [#182](182.md) | Krav | REQ-10: Export |
| [#183](183.md) | Krav | REQ-11: Robust felhantering |
| [#184](184.md) | Krav | REQ-12: Verifiering och leverans |
| [#185](185.md) | Testfall | TC-E2E-FINAL: Komplett MVP-flöde från template till renderad video |
