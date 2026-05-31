# Projektregler

## Syfte

Denna fil styr hur Gemini ska arbeta i Abbas 1DV613-projekt. Den gäller kod, dokumentation, GitLab, testning, verifiering och MR.

## Grundregel

Kod eller dokumentation är inte klar förrän den är kopplad till issue, verifierad och möjlig att förklara.

## Obligatoriskt Git-flöde

Innan nytt arbete:

```bash
git status
git switch main
git pull
git switch -c <issue-number-short-branch-name>
```

Efter arbete:

```bash
git status
git diff
```

Föreslå commit först efter relevant verifiering.

## Issue-regler

* USER STORY används för användarnytta.
* SYSTEM används för teknisk systemförmåga.
* FIX används för buggar.
* REFACTOR används för beteendebevarande kodförbättring.
* DOCS används för dokumentation och ai-context.
* Testfall krävs för features, systemändringar, fixes och refactors.
* Testfall behövs normalt inte för rena markdown-uppdateringar.

## Arbetskedja

1. Läs relevant ai-context.
2. Skapa eller kontrollera issue.
3. Kontrollera acceptanskriterier.
4. Skapa eller kontrollera testfall om ändringen kräver det.
5. Starta från `main` och ny branch.
6. Implementera minsta rimliga ändring.
7. Kör verifiering.
8. Kontrollera diff.
9. Commit.
10. Push.
11. MR mot `main`.

## Verifiering

För Expo-appen:

```bash
cd tiktok-video-editor-app
npm run lint:fix
npm run verify
```

För compile-server:

```bash
cd compile-server
npm run lint:fix
npm run verify
```

För dokumentationsändringar:

```bash
git status
git diff
```

Om markdown ändrar projektinstruktioner ska Gemini kontrollera att:

* filerna hamnar på rätt path
* inga secrets finns
* instruktioner inte motsäger `GEMINI.md`
* innehåll är projektspecifikt
* stora originalkällor inte kopieras in i onödan

## Kodregler

* Kompletta ersättningsfiler när Abbas ber om kod.
* Inga terminalbaserade filersättningar om Abbas vill copy-pastea kod.
* Bevara befintliga kontrakt och exports.
* Bevara tester om möjligt.
* Lägg inte ny feature i refactor-issue.
* Lägg inte refaktorisering i feature-MR om det inte behövs.
* Undvik stora screen-filer. Flytta stateful logik till application hooks och UI till komponenter.

## Arkitekturregler

Projektet använder lager:

* Presentation: routes, screens, React Native UI-komponenter.
* Application: controllers, hooks och orchestration.
* Domain: ren logik, typer, parsing, timeline, transitions, readiness.
* Infrastructure: repositories, file/media APIs, compile service, network/storage.

Fel tecken:

* UI-komponent som gör för mycket affärslogik.
* Infrastructure som läcker in i Domain.
* Compile-server-detaljer hårdkodas i UI.
* Flera features blandas i samma issue.

## Kursregler

Kursen bedömer process, inte bara kod. Gemini ska därför hjälpa Abbas visa:

* kravspårbarhet
* testbarhet
* versionhantering
* CI/CD-förståelse
* dokumentation
* kvalitetssäkring
* etik och ansvar
* överlämningsbarhet

## AI-regler

AI får hjälpa, men Abbas måste kunna försvara resultatet. Gemini ska därför:

* markera osäkerhet
* föreslå verifiering
* undvika dolda antaganden
* inte hitta på kurskrav
* inte överimplementera
* tydligt och kortfattat redovisa utfallet när information och kodförslag har verifierats mot nätet.
