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
  - **Prio:** Hög | **Acceptans:** Lista visas, klick startar session. | **Test:** TC1.1
- **UR2:** Användaren ska kunna förstå videons scenstruktur genom editorflödet.
  - **Prio:** Hög | **Acceptans:** Scenlista/tidslinje visas korrekt. | **Test:** TC4.x
- **UR3:** Användaren ska kunna granska en preview-grund innan exportflödet byggs vidare.
  - **Prio:** Medel | **Acceptans:** Videospelare visar vald scen. | **Test:** TC5.x

### Systemkrav
- **SR1:** Systemet ska kunna läsa ett Template-JSON-liknande objekt.
  - **Prio:** Hög | **Acceptans:** Validering av JSON-fält lyckas. | **Test:** TC2.x
- **SR2:** Systemet ska kunna bygga en intern EditSession från en template.
  - **Prio:** Hög | **Acceptans:** State i Zustand populeras korrekt. | **Test:** TC3.x
- **SR3:** Systemet ska kunna hålla vald template och aktiv scen i Zustand.
  - **Prio:** Hög | **Acceptans:** State ändras vid val av ny scen. | **Test:** TC1.2
- **SR4:** Systemet ska senare kunna skapa compile-payload från EditSession.
  - **Prio:** Hög | **Acceptans:** Korrekt formaterad JSON för backend skapas. | **Test:** TC9.x

### Funktionella krav
- **FR1:** Appen ska visa en startsida med minst ett template eller projekt.
  - **Prio:** Hög | **Acceptans:** Listkomponent renderas med mockdata. | **Test:** TC1.1
- **FR2:** Appen ska kunna navigera till editor-route med template id.
  - **Prio:** Hög | **Acceptans:** URL-parameter `id` läses korrekt. | **Test:** TC1.3
- **FR3:** Appen ska kunna navigera till preview-route med template id.
  - **Prio:** Medel | **Acceptans:** Route `(preview)/[id]` renderas. | **Test:** TC1.4
- **FR4:** Appen ska kunna visa scener från mockTemplate.
  - **Prio:** Hög | **Acceptans:** Sceninstruktioner renderas i UI. | **Test:** TC4.1
- **FR5:** Appen ska kunna hantera ogiltigt eller saknat template id utan krasch.
  - **Prio:** Medel | **Acceptans:** Error state eller fallback visas. | **Test:** TC1.6

### Icke-funktionella krav
- **NFR1:** Koden ska vara typad med TypeScript och undvika any.
  - **Prio:** Hög | **Acceptans:** `npx tsc` passerar utan varningar. | **Test:** TC1.5
- **NFR2:** UI och logik ska separeras enligt lagerarkitekturen.
  - **Prio:** Hög | **Acceptans:** Ingen affärslogik direkt i komponentfiler.
- **NFR3:** Appen ska inte anta att mockTemplate är samma sak som riktig API-data.
  - **Prio:** Hög | **Acceptans:** Hantering av `unknown` input i parser.
- **NFR4:** Mobilappen ska inte analysera TikTok-video själv och ska inte köra FFmpeg lokalt.
  - **Prio:** Kritisk | **Acceptans:** Analys och rendering sker upstream/downstream.
- **NFR5:** Features ska verifieras med testfall innan de räknas som klara.
  - **Prio:** Hög | **Acceptans:** TC-dokumentation finns för varje feature.
