# Kapitel 1: Introduction

## 1. Kärna i kapitlet

Kapitel 1 förklarar varför software engineering behövs. Poängen är att professionell mjukvara inte bara är kod som råkar fungera på utvecklarens dator. Professionell mjukvara består av kod, dokumentation, konfiguration, testning, processer, beslut och vidareutveckling.

Mjukvara är abstrakt och därför lätt att ändra i teorin, men stora system blir snabbt komplexa eftersom logik, beroenden, användare, krav och externa system påverkar varandra. Därför behövs ett organiserat arbetssätt.

Kapitlet lyfter fyra återkommande aktiviteter i alla mjukvaruprocesser:

- specification: förstå och beskriva vad som ska byggas
- development: designa och implementera systemet
- validation: kontrollera att systemet motsvarar kundens behov
- evolution: ändra systemet när krav och miljö förändras

## 2. Viktiga begrepp

- Software engineering: ingenjörsdisciplin för alla delar av mjukvaruproduktion.
- Professional software development: utveckling för andra användare, kunder eller marknad.
- Software product: kod plus dokumentation, konfiguration, data och stödmaterial.
- Generic product: produkt för bred marknad.
- Customized software: system byggt för specifik kund.
- Acceptability: systemet måste passa användaren och miljön.
- Dependability and security: systemet ska vara pålitligt och skyddat.
- Efficiency: systemet ska inte slösa resurser.
- Maintainability: systemet ska kunna ändras över tid.
- Heterogeneity: system måste fungera med många tekniker, enheter och miljöer.
- Scale: mjukvara finns i många storlekar, från appar till globala system.

## 3. Relevans för 1DV613

Kursen handlar inte bara om att få fram kod. Den examinerar om studenten arbetar som en mjukvaruutvecklare: planerar, dokumenterar, testar, versionhanterar, reflekterar och kan förklara sina beslut.

AI ska därför inte bara hjälpa med implementation. AI ska hjälpa Abbas visa ett professionellt arbetssätt i GitLab, Wiki, issues, testfall, rapporter och presentationer.

## 4. Relevans för Abbas projekt

Abbas app är en professionell mjukvaruprototyp, inte bara en demo. Den måste kunna förklaras genom krav, arkitektur, testning och riskhantering.

Projektets kärnflöde är:

TikTok URL → AI/API video analysis → Template-JSON → EditSession → Editor UI → Preview/Timeline → Compile-payload → backend/compile-server → Rendered video via FFmpeg

Kapitel 1 stödjer att detta ska behandlas som ett system, inte som en isolerad UI-app. Appen är beroende av upstream AI/API, JSON-format, GCS/Supabase, video, state och backend-rendering.

## 5. När AI ska använda kapitlet

Använd detta kapitel när AI ska:

- förklara varför dokumentation, testning och krav behövs
- skriva introduktion till rapport eller Wiki
- motivera varför projektet behöver process och struktur
- diskutera kvalitetsegenskaper som maintainability, usability och dependability
- hjälpa Abbas formulera professionell ansvarskänsla kring AI-genererad kod
- förklara att hagen-auto-edit, GitLab, Wiki och testfall är delar av software, inte sidospår

## 6. Vad som måste synas i wiki, rapport, testning eller presentation

I Wiki och rapport ska det synas att Abbas:

- skiljer på kod och professionell mjukvaruleverans
- förstår att dokumentation och testning är del av systemet
- kopplar kvalitet till användbarhet, pålitlighet, effektivitet och vidareutveckling
- ser AI-genererad kod som något som måste verifieras
- kan förklara varför en liten verifierad MVP är bättre än en stor osäker prototyp

I presentationen kan detta formuleras som:

"Projektet handlar inte bara om att skapa en mobilvy. Det handlar om att bygga ett testbart editorflöde där Template-JSON, EditSession, timeline, preview och compile-payload hänger ihop som ett mjukvarusystem."

## 7. Praktisk koppling till projektet

När AI kodar ska kapitel 1 påverka arbetet så här:

- Dokumentera centrala typer och stores.
- Skriv kod som någon annan kan förstå.
- Undvik att lägga all logik i screens.
- Behandla Template-JSON som ett kontrakt, inte som slumpmässig data.
- Testa kritiska risker tidigt: GCS-video, JSON-validering, EditSession och compile-payload.
- Kom ihåg att software engineering handlar om att leverera användbar kvalitet inom begränsad tid.
