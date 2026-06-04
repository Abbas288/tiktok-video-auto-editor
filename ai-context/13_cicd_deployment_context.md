# CI/CD och Cumulus deployment

## Syfte

Den här filen beskriver projektets faktiska CI/CD- och deploymentmodell. Den finns för att AI inte ska göra fel antagande om att koden ska klonas eller redigeras manuellt på Cumulus.

## Grundregel

Cumulus kör containrar. GitLab CI/CD bygger och deployar dem. Cumulus är inte arbetskatalog för koden.

## Faktiskt flöde

```text
local branch -> MR -> main -> GitLab verify -> GitLab build -> manual deploy_production -> Cumulus containers
```

## Lokalt arbete

Nytt arbete börjar från `main`:

```bash
git status
git switch main
git pull
git switch -c <issue-number-short-branch-name>
```

Kod ändras lokalt. Cumulus ska inte användas som redigeringsmiljö.

## Verify-stage

Pipeline verifierar både app och compile-server.

Appjobs:

* `lint_app`
* `typecheck_app`
* `test_app`

Compile-serverjobs:

* `lint_compile_server`
* `typecheck_compile_server`
* `test_compile_server`

Lokalt motsvaras detta av:

```bash
cd tiktok-video-editor-app
npm run verify
```

```bash
cd compile-server
npm run verify
```

## Build-stage

På `main` bygger GitLab Docker-images för:

* `web`, alltså Expo Web-builden serverad via Nginx
* `compile-server`, alltså Node/Express/FFmpeg-servern
* `caddy`, alltså reverse proxy och HTTPS-ingång

Images taggas med commit SHA och branch slug i GitLab Container Registry.

## Deploy-stage

`deploy_production` är manuellt. Det ska köras först när verify och build är gröna.

Deploy-jobbet:

1. läser SSH-nyckel från GitLab CI/CD variables
2. skapar Docker context mot Cumulus via SSH
3. loggar in mot GitLab Container Registry
4. sätter image- och miljövariabler
5. kör Docker Compose mot Cumulus
6. startar `web`, `compile-server` och `caddy`

## Cumulus

Cumulus ska normalt bara användas för:

* att köra containrar
* att läsa logs
* att kontrollera `docker ps`
* att felsöka runtime-problem

Cumulus ska inte användas för:

* att klona repot manuellt
* att editera källkod
* att köra `git pull` som deploymentstrategi
* att lägga `.env` i repo

## Viktiga miljövariabler

| Variabel | Syfte |
|----------|------|
| `SERVER_HOST` | Cumulus-host för SSH och deployment |
| `SERVER_USER` | SSH-användare |
| `SSH_PRIVATE_KEY_B64` | SSH-nyckel i base64 för GitLab runner |
| `SITE_ADDRESS` | publik Cumulus-adress |
| `EXPO_PUBLIC_COMPILE_SERVER_URL` | publik klientkonfiguration för Expo Web, normalt `/api` |
| `COMPILE_PUBLIC_BASE_URL` | publik backend-bas, normalt `https://<site>/api` |
| `COMPILE_RENDERER` | `ffmpeg` i deployed miljö |
| `COMPILE_UPLOAD_DIR` | upload-volym i compile-servern |
| `COMPILE_OUTPUT_DIR` | compiled output-volym |
| `COMPILE_TEMP_DIR` | temporär renderingskatalog |

`EXPO_PUBLIC_` är synligt i klientbuilden och ska inte innehålla secrets.

## Docker Compose i projektet

`docker-compose.yml` ligger i `tiktok-video-editor-app/` och startar:

* `web`
* `compile-server`
* `caddy`

Caddy proxyar:

* `/api/*` till `compile-server:3030`
* övrig trafik till `web:80`

Compile-servern använder volymer för:

* uppladdade scenvideor
* renderade MP4-filer
* temporära FFmpeg-filer

## Manuell Cumulus-test före push

Vid svåra deploymentfel kan en isolerad test göras utan GitLab. Den ska vara liten, namngiven och rensas efteråt.

Exempelprincip:

* skapa Docker context mot `cumulus-1dv613`
* bygg bara den image som ska testas
* kör testcontainer på `127.0.0.1` med separat port
* testa `health`, `ffmpeg`, payload och output
* ta bort testcontainer, testvolymer, testimage och temporära payload-filer
* återgå till lokal Docker context

Detta är en felsökningsmetod, inte normal deployment.

## Vanliga misstag

* Att köra lokala `C:/Users/...`-kommandon inne i SSH-sessionen.
* Att skapa Docker context med fel SSH-alias.
* Att tro att Cumulus ska innehålla repo-koden.
* Att tolka grön pipeline som komplett systemtest.
* Att glömma att deployed compile också måste testas manuellt i appen.
* Att blanda deploymentfix med editorfeature i samma issue.

## Definition of Done för deployment

Deploymentrelaterad issue är klar först när:

* relevant lokal verify är grön
* GitLab pipeline är grön
* deploy-jobbet har körts om issue kräver det
* Cumulus-health eller appflöde har testats
* logs är kontrollerade vid fel
* temporära testresurser är bortstädade
* MR beskriver verifieringen kort
