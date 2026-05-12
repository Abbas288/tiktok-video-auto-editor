# MVP-krav för Abbas projekt

## Syfte
Denna fil samlar de faktiska MVP-kraven för LeTrend Mobile / The TikTok Catalyst. Den används för att säkerställa spårbarhet mellan kod, issues och testfall.

## Kravmodell
Kraven delas in i:
1. **Användarkrav (UR):** Behov ur användarens perspektiv.
2. **Systemkrav (SR):** Tekniska krav på systemnivå.
3. **Funktionella krav (FR):** Specifika funktioner i appen.
4. **Icke-funktionella krav (NFR):** Kvalitetskrav och begränsningar.

## MVP-krav

### Användarkrav

- **UR1:** Användaren ska kunna välja ett videoprojekt eller en template för att starta en redigeringssession.
  - **Prio:** Hög
  - **Acceptans:** Lista visas, klick startar editorflöde.
  - **Test:** TC1.1, TC1.2, TC1.3

- **UR2:** Användaren ska kunna förstå videons scenstruktur genom editorflödet.
  - **Prio:** Hög
  - **Acceptans:** Scener visas i editor med tydlig sceninformation.
  - **Test:** TC2.6, TC4.x

- **UR3:** Användaren ska kunna granska en preview-grund innan exportflödet byggs vidare.
  - **Prio:** Medel
  - **Acceptans:** Preview-route kan öppnas med template-id utan krasch.
  - **Test:** TC1.4, TC-E1

### Systemkrav

- **SR1:** Systemet ska kunna läsa ett Template-JSON-liknande objekt.
  - **Prio:** Hög
  - **Acceptans:** Giltig template-data kan valideras och returneras som typad Template.
  - **Test:** TC2.1, TC2.2, TC2.3, TC2.4, TC2.5

- **SR2:** Systemet ska kunna bygga en intern EditSession från en template.
  - **Prio:** Hög
  - **Acceptans:** State i Zustand populeras korrekt från vald template.
  - **Test:** TC1.2, TC2.6

- **SR3:** Systemet ska kunna hålla vald template och aktiv scen i Zustand.
  - **Prio:** Hög
  - **Acceptans:** Aktiv template och aktiv scen finns i store efter laddning.
  - **Test:** TC2.6

- **SR4:** Systemet ska senare kunna skapa compile-payload från EditSession.
  - **Prio:** Hög
  - **Acceptans:** Korrekt formaterad JSON för backend kan byggas från EditSession.
  - **Test:** TC9.x
  - **Status:** Planerad

- **SR5:** Systemet ska kunna driftsättas som Expo Web via Docker Compose.
  - **Prio:** Hög
  - **Acceptans:** Appen byggs som statisk webb, paketeras i Docker och kan köras lokalt samt på Cumulus.
  - **Test:** TC-D1, TC-D2, TC-D3, TC-D4

- **SR6:** Systemet ska kunna nås via HTTPS på Cumulus när användaren är ansluten till eduVPN.
  - **Prio:** Medel
  - **Acceptans:** Caddy hanterar HTTPS och proxyar trafik till web-containern.
  - **Test:** TC-D5

### Funktionella krav

- **FR1:** Appen ska visa en startsida med minst ett template eller projekt.
  - **Prio:** Hög
  - **Acceptans:** Template-lista renderas med mockdata.
  - **Test:** TC1.1

- **FR2:** Appen ska kunna navigera till editor-route med template id.
  - **Prio:** Hög
  - **Acceptans:** URL-parametern `id` normaliseras och används för att ladda rätt template.
  - **Test:** TC1.2, TC1.3, TC-E1

- **FR3:** Appen ska kunna navigera till preview-route med template id.
  - **Prio:** Medel
  - **Acceptans:** Route `/preview/[id]` renderas och hanterar normaliserat template-id.
  - **Test:** TC1.4, TC-E1

- **FR4:** Appen ska kunna visa scener från mockTemplate.
  - **Prio:** Hög
  - **Acceptans:** Sceninstruktioner och timing renderas i UI.
  - **Test:** TC2.6, TC4.1

- **FR5:** Appen ska kunna hantera ogiltigt eller saknat template id utan krasch.
  - **Prio:** Hög
  - **Acceptans:** Saknat eller ogiltigt template-id ger error state och rensar gammal session.
  - **Test:** TC1.6, TC-E1

- **FR6:** Home ska visa ett tomt läge om inga templates finns.
  - **Prio:** Medel
  - **Acceptans:** Tom template-lista ger empty state i stället för krasch eller blank sida.
  - **Test:** TC-E1

### Icke-funktionella krav

- **NFR1:** Koden ska vara typad med TypeScript och undvika `any`.
  - **Prio:** Hög
  - **Acceptans:** `npx tsc --noEmit` passerar.
  - **Test:** TC1.5, TC-E1

- **NFR2:** UI och logik ska separeras enligt lagerarkitekturen.
  - **Prio:** Hög
  - **Acceptans:** Screens hanterar presentation, application/domain/infrastructure hanterar state, validering och datahämtning.
  - **Test:** Kodgranskning, TC2.x, TC-E1

- **NFR3:** Appen ska inte anta att mockTemplate är samma sak som riktig API-data.
  - **Prio:** Hög
  - **Acceptans:** Okänd input hanteras med `unknown` och valideras i parser.
  - **Test:** TC2.1, TC2.2, TC2.3, TC2.4, TC2.5

- **NFR4:** Mobilappen ska inte analysera TikTok-video själv och ska inte köra FFmpeg lokalt.
  - **Prio:** Kritisk
  - **Acceptans:** Analys sker upstream och rendering sker downstream i backend/compile-server.
  - **Test:** Scope-granskning, arkitekturgranskning

- **NFR5:** Features ska verifieras med testfall innan de räknas som klara.
  - **Prio:** Hög
  - **Acceptans:** Relevanta TC-fall finns och faktisk teststatus dokumenteras.
  - **Test:** TC1.x, TC2.x, TC-Dx, TC-E1

- **NFR6:** Repo och deployment ska inte innehålla secrets, `.env`-filer, privata nycklar eller genererade beroendemappar.
  - **Prio:** Hög
  - **Acceptans:** Säkerhetskontroll före commit och deployment.
  - **Test:** TC-D4, TC-D5

- **NFR7:** Route-parametrar och editorstate ska hanteras stabilt.
  - **Prio:** Hög
  - **Acceptans:** Saknat eller ogiltigt id fastnar inte i loading och gammal session rensas.
  - **Test:** TC1.6, TC-E1

## Spårbarhetsöversikt

| Krav | Issue | Testfall |
|---|---|---|
| UR1 | #1, #15 | TC1.1, TC1.2, TC1.3 |
| UR2 | #1 | TC2.6, TC4.x |
| UR3 | #15, #42, #43 | TC1.4, TC-E1 |
| SR1 | #1 | TC2.1, TC2.2, TC2.3, TC2.4, TC2.5 |
| SR2 | #1 | TC1.2, TC2.6 |
| SR3 | #1 | TC2.6 |
| SR4 | #9 | TC9.x |
| SR5 | #35 | TC-D1, TC-D2, TC-D3, TC-D4 |
| SR6 | #40 | TC-D5 |
| FR1 | #1, #15 | TC1.1 |
| FR2 | #15, #42, #43 | TC1.2, TC1.3, TC-E1 |
| FR3 | #15, #42, #43 | TC1.4, TC-E1 |
| FR4 | #1 | TC2.6, TC4.1 |
| FR5 | #1, #42, #43 | TC1.6, TC-E1 |
| FR6 | #42, #43 | TC-E1 |
| NFR1 | #13, #14, #15, #42, #43 | TC1.5, TC-E1 |
| NFR2 | Alla implementationer | Kodgranskning, TC2.x |
| NFR3 | #1 | TC2.1, TC2.2, TC2.3, TC2.4, TC2.5 |
| NFR4 | Arkitektur/scope | Scope-granskning |
| NFR5 | Alla issues | TC1.x, TC2.x, TC-Dx, TC-E1 |
| NFR6 | #35, #40 | TC-D4, TC-D5 |
| NFR7 | #42, #43 | TC1.6, TC-E1 |
