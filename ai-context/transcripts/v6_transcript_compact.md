# Kompakt transkript, vecka 6

## MÅSTE FÖLJAS
* Vecka 6 fokuserar på arkitektur, Docker Compose, produktion och fortsatt featureutveckling.
* Kurslitteraturen för veckan är kapitel 15, 16 och 18.
* Studenterna ska fortsätta implementera features med tillhörande testkod.
* Dokumentationen ska fortsätta uppdateras: sprint backlog, product backlog, testspecifikation, arkitektur och deploymentbeskrivning.
* Applikationen ska driftsättas eller få en tydlig leveransform med Docker Compose när det passar projektet.
* Grupparbetet handlar om att demonstrera en levererad och testad applikation för varandra.
* Demonstration ska visa inte bara att något syns, utan att det är testat och kopplat till projektets mål.
* Docker Compose ska användas för att beskriva flera services i en konfigurationsfil.
* Production och development ska hållas isär. Production ska vara stabil, reproducerbar och fri från lokala dev-volymer.
* Secrets, `.env`, privata nycklar och certifikat ska inte byggas in i imagen eller checkas in i Git.

## BRA FÖR RAPPORT
* Docker Compose gör miljön reproducerbar och minskar risken för "works on my machine".
* Containers är ett lättviktigt sätt att paketera, skeppa och köra applikationer.
* Compose passar när applikationen består av flera delar, till exempel appserver, databas och reverse proxy.
* Development kan använda volymer och hot reload. Production bör bygga in koden i imagen och köra med låsta beroenden.
* `.dockerignore` ska vara restriktiv för att minska risk att hemligheter, cache eller onödiga filer hamnar i imagen.
* Lockfiler som `package-lock.json` är viktiga eftersom de låser beroendeversioner.
* Undvik `latest` i produktion eftersom versionen kan ändras och skapa oförutsägbart beteende.
* Reverse proxy som Nginx eller Caddy kan ligga framför appen för routing, HTTPS och mer produktionslik drift.
* Driftsättning är ett arkitekturbeslut eftersom det påverkar byggning, testning, felsökning och underhåll.

## BRA FÖR MUNTLIG REDOVISNING
* Förklara Docker enkelt: image är paketet, container är körande instans.
* Förklara Docker Compose som en fil som startar flera containers och kopplar ihop dem via nätverk.
* Förklara att services i Compose kan prata med varandra via servicenamn, inte via `localhost`.
* Förklara varför databaser behöver volumes så att data inte försvinner när container tas bort.
* Förklara varför Abbas mobilapp inte ska köra FFmpeg lokalt. Deployment i Abbas projekt gäller webb-export eller backend/compile-server, inte native mobilrelease.
* Förklara att Cumulus-deploymenten är en containeriserad webb-deployment av Expo Web.
* Förklara att Caddy eller Nginx kan fungera som reverse proxy framför den statiska webben.
* Lyft att Docker är kursfärdighet, men att den måste anpassas till Abbas faktiska projektarkitektur.

## BAKGRUND
* Veckan bygger vidare på tidigare Docker-material.
* Demo 5 visar hur Docker Compose kan ersätta manuella steg för att bygga nätverk, starta containers och koppla services.
* Compose-filer använder YAML.
* En Compose-fil kan definiera services, volumes och networks.
* `depends_on` kan användas när en service behöver startas efter en annan, exempelvis app efter databas.
* Docker Compose skapar normalt ett internt nätverk automatiskt.
* För lokal utveckling kan en volume mappa lokal `src` till containerns `src`.
* För produktion ska koden ligga i imagen och köras med produktionsanpassad start.
* Just Task It-övningarna är kursens generella exempel. Abbas ska översätta principerna till sin egen app.

## Risker och krav som påverkar Abbas projekt
* Risk: Dockerarbete blir frikopplat från Abbas faktiska MVP.
* Risk: Expo Web-deployment blandas ihop med native mobilrelease.
* Risk: byggda filer, cache, `.env` eller secrets hamnar i Git eller Docker image.
* Risk: appen fungerar lokalt men inte i container på Cumulus.
* Risk: `latest`-taggar eller olåsta dependencyversioner gör produktionen instabil.
* Risk: reverse proxy och HTTPS tar tid från kärnflödet om det inte avgränsas.
* Krav: Docker Compose-filer ska vara begripliga och testade lokalt eller på Cumulus.
* Krav: deployment ska dokumenteras i ai-context eller wiki.
* Krav: testfall ska dokumentera lokal build, lokal körning, Cumulus-deployment och säkerhetskontroll.
* Krav: arkitektursidan ska förklara var deployment passar in i Abbas system.

## Saker Gemini ska komma ihåg vid kodarbete
* För Abbas app är Docker främst relevant för Expo Web-deployment och framtida compile-server, inte för FFmpeg i mobilen.
* När Docker skapas, föreslå `.dockerignore`, `Dockerfile`, `docker-compose.yml`, eventuell `nginx.conf` eller `Caddyfile`.
* Föreslå testfall som TC-D1, TC-D2, TC-D3, TC-D4 och TC-D5 när deployment påverkas.
* Vid Cumulus: skilj på lokal Docker-testning, HTTP-deployment och HTTPS via reverse proxy.
* Lägg aldrig secrets, `.env`, privata nycklar eller signerade privata länkar i repo.
* Om deployment ändras, uppdatera relevant ai-context, testdokumentation och MVP-krav vid behov.
* Påminn om `docker compose build`, `docker compose up --build -d`, `docker compose ps`, `docker compose logs` och säkerhetskontroll med `git status`.
* Håll deployment som egen feature eller fix, inte blandad med editorfunktioner.
