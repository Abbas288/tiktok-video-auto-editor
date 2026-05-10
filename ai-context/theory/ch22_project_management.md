# Kapitel 22: Project Management

## 1. Kärna i kapitlet

Kapitel 22 handlar om projektledning inom mjukvaruutveckling. Projektledning behövs eftersom mjukvaruprojekt är osäkra, föränderliga och beroende av människor, teknik, tid, budget och risker.

Projektledaren eller studenten i ett individuellt projekt behöver planera arbete, följa upp progress, hantera risker, kommunicera status och justera planen när ny information uppstår.

## 2. Viktiga begrepp

- Project management: planera, styra och följa upp projekt.
- Risk management: identifiera, analysera och hantera risker.
- People management: förstå människor, motivation och arbetssätt.
- Project planning: bryta ner arbete och skapa plan.
- Monitoring: följa upp framdrift.
- Reporting: kommunicera status.
- Risk: något som kan påverka projektet negativt.
- Risk mitigation: åtgärd för att minska sannolikhet eller konsekvens.
- Stakeholders: personer eller grupper som påverkar eller påverkas av projektet.

## 3. Relevans för 1DV613

Kursen examinerar inte bara slutprodukten. Den examinerar också hur Abbas leder sitt eget projekt:

- planering
- riskhantering
- standups
- Wiki
- issues
- tidsloggning
- presentationer
- reflektioner

Eftersom Abbas arbetar individuellt blir självledning extra viktig.

## 4. Relevans för Abbas projekt

Abbas projekt har tydliga risker:

- videouppspelning från GCS
- signerade URL:er
- Template-JSON-format från AI/API
- compile-payload matchar inte backend
- Expo-video fungerar inte som tänkt
- timeline och preview blir för omfattande
- AI-genererad kod skapar falsk trygghet
- scope creep i UI
- för lite testning innan commit

Projektledning innebär att Abbas inte bara noterar riskerna, utan gör spikes eller tidiga tester.

Exempel:

- Testa `expo-video` tidigt.
- Testa mockTemplate till EditSession tidigt.
- Testa compile-payload mot backend tidigt.
- Begränsa UI till MVP innan avancerade effects byggs.

## 5. När Gemini ska använda kapitlet

Använd detta kapitel när Gemini ska:

- skriva riskanalys
- skriva projektplan
- hjälpa med iterationsrapport
- prioritera backlog
- föreslå spikes
- förklara tidsloggning
- förbereda standup
- analysera varför något tog längre tid än planerat
- hjälpa Abbas hålla scope

## 6. Vad som måste synas i wiki, rapport, testning eller presentation

Wiki ska visa:

- risklista
- sannolikhet och konsekvens
- riskåtgärder
- iteration goals
- estimate och spend
- vad som flyttas vidare
- vad som blockerar arbetet

Rapport och presentation ska kunna visa:

- vilka risker som var störst
- hur Abbas hanterade dem
- varför MVP prioriterades
- hur AI förändrade arbetsrollen från kodare till arkitekt och kvalitetssäkrare

## 7. Praktisk koppling till projektet

När Gemini hjälper Abbas planera ska det alltid fråga:

- Vad är största risken just nu?
- Vilket test minskar risken snabbast?
- Vilken feature ger mest kursvärde och produktvärde?
- Vad kan skjutas upp utan att kärnflödet faller?

Bra riskåtgärd:

"Gör en spike där appen spelar upp en signerad GCS-video med expo-video."

Dålig riskåtgärd:

"Bygg hela videoeditorn först och testa senare."

Projektledning i Abbas projekt betyder: minska osäkerhet innan du bygger stort.
