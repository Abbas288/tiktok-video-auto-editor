# Vecka 6: Docker Compose, produktion och driftsättning

## Tema
Arkitektur, containers, Docker Compose, produktion, deployment och fortsatt featureutveckling.

## Kursens fokus
* Läsa kapitel 15, 16 och 18.
* Arbeta med arkitektur, komponenter, återanvändning och serviceorienterad mjukvara.
* Genomföra Just Task It Docker Compose.
* Genomföra Just Task It Production.
* Fortsätta implementation av features med tillhörande testkod.
* Driftsätta applikationen med Docker Compose eller skapa motsvarande leveransform.
* Uppdatera sprint backlog, product backlog och testspecifikation.
* Demonstrera en levererad och testad applikation för gruppen.
* Planera kommande grupppresentation.
* Besvara veckans examinationsfrågor.

## Abbas projektfokus
För Abbas projekt ska vecka 6 kopplas till driftsättning utan att ändra mobilappens huvudansvar.

Abbas app:
* är en React Native och Expo-app
* kan exporteras som Expo Web för webbdeployment
* kan serveras som statiska filer via Nginx
* kan ligga bakom Caddy eller annan reverse proxy för HTTPS
* ska inte köra FFmpeg i mobilen
* ska inte göra TikTok-analys i frontend
* ska fortsätta prioritera Template-JSON -> EditSession -> Editor UI -> Preview/Timeline -> Compile-payload

Docker för Abbas är främst relevant för:
* containeriserad Expo Web-deployment
* framtida backend/compile-server
* reproducerbar demonstrationsmiljö
* dokumenterad leverans och testning

## Docker Compose i kursen
Docker Compose används för att beskriva flera services i en YAML-fil.

Exempel på services:
* appserver eller statisk webbserver
* databas
* reverse proxy

Fördelar:
* startar flera containers med ett kommando
* skapar internt nätverk automatiskt
* gör miljön reproducerbar
* minskar manuella installationssteg
* låter services kommunicera via servicenamn
* ger bättre grund för deployment och CI/CD

Vanliga begrepp:
* image: paketet som används för att skapa container
* container: körande instans
* service: tjänst i docker-compose
* volume: bevarar eller delar data
* network: intern kommunikation mellan services
* expose: gör port synlig internt
* ports: publicerar port utåt
* depends_on: anger startordning mellan services

## Development kontra production
Development:
* kan använda dev dependencies
* kan använda hot reload
* kan montera lokal kod via volumes
* kan vara enklare att felsöka
* kan exponera portar lokalt

Production:
* ska vara mindre och renare
* ska inte montera lokal källkod
* ska inte innehålla `.env` eller secrets i imagen
* bör använda låsta beroenden
* bör undvika `latest`
* ska ha stabilt startkommando
* ska vara reproducerbar

## Rekommenderade deploymentfiler för Abbas
För Expo Web-deployment kan Abbas ha:
```text
tiktok-video-editor-app/
  Dockerfile
  docker-compose.yml
  nginx.conf
  .dockerignore
```

Om HTTPS används med Caddy:
```text
tiktok-video-editor-app/
  Caddyfile
  docker-compose.yml
```

Princip:
* Expo bygger statiska filer med `expo export --platform web`.
* Nginx serverar filerna.
* Caddy kan ligga framför Nginx och hantera HTTPS.
* `web`-containern bör exponeras internt med `expose`.
* `caddy`-servicen publicerar port 80 och 443.

## Testfall för deployment
Använd dessa när deployment påverkas:

### TC-D1 Lokal Docker-build
Förutsättning: Docker Desktop är igång.
Steg:
1. Gå till `tiktok-video-editor-app`.
2. Kör `docker compose build`.
3. Kontrollera att imagen byggs utan fel.
Förväntat resultat: Docker-imagen byggs utan att krascha.

### TC-D2 Lokal körning via Docker Compose
Förutsättning: Docker-imagen kan byggas.
Steg:
1. Kör `WEB_PORT=8080 docker compose up --build -d`.
2. Öppna `http://localhost:8080`.
Förväntat resultat: Appens Expo Web-version visas i webbläsaren.

### TC-D3 Deployment till Cumulus
Förutsättning: eduVPN är anslutet och SSH fungerar.
Steg:
1. Sätt `DOCKER_HOST=ssh://cumulus-1dv613`.
2. Sätt `WEB_PORT=80`.
3. Kör `docker compose up --build -d`.
4. Öppna Cumulus-domänen.
Förväntat resultat: Applikationen är nåbar från Cumulus.

### TC-D4 Säkerhetskontroll före commit
Steg:
1. Kör `git status`.
2. Kontrollera att inga privata nycklar, `.env`-filer eller secrets finns med.
3. Kontrollera att endast deploymentrelaterade filer läggs till.
Förväntat resultat: Endast relevanta Docker- och konfigurationsfiler versionshanteras.

### TC-D5 HTTPS och certifikat fungerar på Cumulus
Förutsättning: Caddy är konfigurerad och eduVPN är anslutet.
Steg:
1. Kör `docker compose up --build -d`.
2. Kör `docker compose ps`.
3. Kör `docker compose logs caddy`.
4. Kontrollera HTTP redirect.
5. Kontrollera HTTPS response.
6. Öppna appen i webbläsaren via HTTPS.
Förväntat resultat: HTTP omdirigerar till HTTPS och appen visas via HTTPS.

## Dokumentation som ska uppdateras
Vid deployment bör Abbas uppdatera:
* relevant ai-context eller Wiki vid behov
* testspecifikation
* testrapport
* MVP-krav om deployment räknas som feature
* Architecture-sidan i Wiki
* README om körning och deployment
* risklista om Cumulus, HTTPS eller Docker gav problem

## Risker
* Dockerdeployment blir för stor och tar tid från editor-MVP.
* Expo Web misstas för native mobilrelease.
* `.env`, certifikat eller secrets följer med i Git eller image.
* `dist`, cache eller andra genererade filer committas utan beslut.
* Portar exponeras fel.
* Caddy eller Nginx konfigureras utan att testas.
* Appen fungerar lokalt men inte på Cumulus.
* Deployment dokumenteras inte, vilket gör den svår att upprepa.
* Fokus hamnar på infrastruktur i stället för krav, testning och editorflöde.

## Praktisk koppling till Abbas arkitektur
Koppla Docker till huvudflödet så här:

`Template-JSON -> EditSession -> Editor UI -> Expo Web build -> Nginx/Caddy -> Cumulus demo`

För framtida backend:
`Compile-payload -> backend/compile-server -> FFmpeg -> rendered video`

Viktigt:
* Mobilappen är klient.
* Backend eller compile-server är separat.
* Docker kan användas för webbdeployment eller backend, men inte som skäl att lägga FFmpeg i mobilappen.

## Kommandon att komma ihåg

Standard appkontroll:

```bash
npm run lint
npx tsc --noEmit
npm start
git status
git diff
```

När aktuell issue eller testfall kräver automatiska tester, eller när testkod ändras:

```bash
npm test
```

Vid Expo Web eller deployment:

```bash
npx expo export --platform web
docker compose build
docker compose up --build -d
docker compose ps
docker compose logs
docker compose down
```

## Standup och presentation
Abbas bör kunna säga:
* vad som har levererats
* hur appen har testats
* om appen har driftsatts lokalt eller på Cumulus
* vilka Dockerfiler som ingår
* varför Docker Compose passar eller inte passar just denna del
* vilka risker som finns kvar
* hur deployment kopplas till arkitekturen
* vad som flyttas vidare till nästa iteration
