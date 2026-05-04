# Studentspec för Abbas Faeq Hadi — Automatisk videoredigering (CapCut-stil) — Utarbetad i samarbete med LeTrend

> **För:** Mjukvaruutvecklingsstudent, 8 veckors projekt
> **Kurs:** Mjukvaruutvecklingsprojekt, Linnéuniversitetet
> **Referensrepo:** `hagen-auto-edit` (GitHub: modikhw1/hagen-auto-edit)
> **Senast uppdaterad:** April 2026

---

## 1. Vad är det här projektet?

Det du ska bygga är en mobilapp för automatisk videoredigering — liknande hur **CapCut:s template- och auto-edit-funktion** fungerar, men anpassad för ett specifikt affärsflöde.

Kortversionen av det ekosystemet du arbetar i:

En AI-tjänst (kallad **hagen**) analyserar virala TikTok-videor och identifierar vad som gör dem effektiva — scenlängder, timing, vad som sägs och visas. Resultatet sparas som en strukturerad JSON-fil och en råvideofil i **Google Cloud Storage (GCS)**. Din app läser den JSON-filen, hämtar videon, och låter användaren se, finjustera och exportera en färdig redigerad version.

Databasdelen (hur data hamnar i Supabase och GCS) hanteras av projektägaren — det är _inte_ din uppgift. Ditt jobb är att bygga redigeringsappen.

---

## 2. Det centrala konceptet: Template-JSON

Allt i appen styrs av ett **template-JSON-dokument**. Tänk på det som ett manuskript för en video — det beskriver exakt vad som ska hända, när, och hur länge. Appen läser detta dokument och renderar en interaktiv redigeringssession från det.

Här är ett exempel på hur ett sådant dokument ser ut:

```json
{
  "id": "pizza-launch-2026",
  "title": "Nya pizzan på 20 sekunder",
  "sourceVideoUrl": "gs://hagen-video-analysis/videos/clip-abc123.mp4",
  "orientation": "portrait",
  "music": {
    "url": "gs://template-assets/music/upbeat-pop.mp3",
    "volume": 0.6,
    "beatSync": true
  },
  "scenes": [
    {
      "id": "scene-1",
      "orderIndex": 0,
      "startSeconds": 0.0,
      "durationSeconds": 3.0,
      "instruction": "Pizzan lyfts ur ugnen",
      "transition": {
        "type": "fade",
        "durationSeconds": 0.3
      },
      "textOverlays": [
        {
          "id": "text-1",
          "text": "Ny pizza!",
          "positionX": 0.5,
          "positionY": 0.8,
          "fontSizePt": 28,
          "color": "#FFFFFF",
          "style": "bold",
          "animationIn": "fadeUp",
          "startSeconds": 0.5,
          "durationSeconds": 2.0
        }
      ],
      "effects": [{ "type": "zoom", "intensity": 1.15 }]
    },
    {
      "id": "scene-2",
      "orderIndex": 1,
      "startSeconds": 3.0,
      "durationSeconds": 4.5,
      "instruction": "Close-up på topping",
      "transition": {
        "type": "slide",
        "direction": "left",
        "durationSeconds": 0.4
      },
      "textOverlays": [],
      "effects": [{ "type": "brightness", "value": 1.1 }]
    }
  ]
}
```

**Viktigt att förstå:** Appen splittrar _inte_ videofilen. Källvideon ligger hel i GCS. Det är JSON-filen som talar om för appen (och FFmpeg) var varje scen börjar och slutar, hur länge den varar, och vad som ska läggas ovanpå den — text, effekter, övergångar. Tänk på det som en redigeringsbeskrivning, inte en förstörd fil.

Scheman för detta JSON-format är din första stora uppgift att definiera och implementera.

---

## 3. Vad ska du bygga?

En React Native-app (Expo) med följande kärnfunktioner, inspirerade av CapCut:s auto-redigeringsflöde:

### Kärnfunktioner

| Funktion                 | Beskrivning                                                             |
| ------------------------ | ----------------------------------------------------------------------- |
| **Template-laddning**    | Läs JSON från URL/Supabase → bygg redigeringssession                    |
| **Videouppspelning**     | Spela upp GCS-video med exakt sökning till scenstartpunkter             |
| **Scenbaserad timeline** | Horisontell CapCut-liknande tidslinje med scener och durations          |
| **Text overlay-editor**  | Lägg till/redigera text direkt på videon, med positionering och stilval |
| **Övergångar**           | Fade, cut, slide mellan scener — visuellt valbar i UI                   |
| **Effekter**             | Enkla visuella filter: ljusstyrka, kontrast, zoom, blur                 |
| **Bakgrundsmusik**       | Välj och blanda musik, volymkontroll per scen                           |
| **FFmpeg-kompilering**   | Skicka redigeringsbeskrivning till en kompileringsserver → MP4          |
| **Export**               | Spara till kamerarulle i TikTok-kompatibelt format (9:16, H.264)        |

### Vad som _inte_ ingår i ditt scope

- Hur Supabase-data genereras och synkas (projektägarens ansvar)
- Hagen AI-backend och Vertex AI-pipeline
- TikTok-delning eller direktpublicering
- Avancerade AI-funktioner som auto-undertextning eller beat-detection (sträckmål)

---

## 4. Referensrepo — Vad finns redan

Repot `hagen-auto-edit` (som du fått tillgång till) är **inte** startpunkten för din app — du bygger din app från grunden. Men repot innehåller funktionalitet och mönster som är direkt användbara:

| Vad som finns i repot                         | Hur du kan använda det                                                                                               |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `apps/compile-server/`                        | Klar FFmpeg-server du kan köra lokalt eller deploya. Tar emot videofiler + template-JSON → returnerar kompilerad MP4 |
| `src/editor/managers/FormatterManager.ts`     | Visar hur textfilter och fontfilter byggs inför FFmpeg-kommandon                                                     |
| `src/director/TemplateDirector.ts`            | Visar den övergripande kompileringsflöde (section → render → concat)                                                 |
| `packages/server/templates/portrait.json`     | Exempelmall — visar hur ett template-JSON kan struktureras                                                           |
| `apps/le-clap/src/types/domain.ts`            | Typ-definitioner för ConceptTask och scener — referens för ditt eget schema                                          |
| `apps/le-clap/src/store/leTrendStore.ts`      | Exempel på Zustand-store för redigeringssessionsstate                                                                |
| `apps/le-clap/app/(fullscreen)/edit/[id].tsx` | Exempel på redigeringsskärm med trim, volym och text overlays                                                        |

---

## 5. Teknikstack (rekommendation)

Dessa val speglar vad som finns i referensrepot och vad som fungerar för React Native-videoredigering:

- **Expo** (managed workflow) + **Expo Router** — filbaserad navigation
- **expo-video** — videouppspelning med exakt seek-stöd
- **react-native-vision-camera** — om kamerafunktionalitet behövs
- **Zustand** — state management för redigeringssessionen
- **TanStack Query** — datahämtning (templates, GCS-URLs)
- **expo-file-system** — filhantering och nedladdning
- **expo-media-library** — sparar exporterad video till kamerarulle

För kompilering används **compile-servern** från referensrepot (Node.js + FFmpeg). Du behöver inte bygga FFmpeg-logiken själv — servern tar emot en redigeringsbeskrivning och returnerar en fil.

---

## 6. Veckosschema med specifika uppgifter

### Vecka 1 — Projektstart och teknisk grund

**Mål:** Fungerade dev-miljö, ny Expo-app som kan spela en GCS-video.

**Uppgifter:**

- [ ] Skapa nytt Expo-projekt med TypeScript och Expo Router
- [ ] Sätt upp grundläggande navigationsstruktur: `/(home)`, `/(editor)/[id]`, `/(preview)/[id]`
- [ ] Definiera ett enkelt designsystem — färgpalett, typsnitt, spacing-konstanter (se `apps/le-clap/app/styles/theme.ts` som referens)
- [ ] Integrera `expo-video` och bekräfta att en publik video-URL kan spelas upp
- [ ] Testa att hämta en fil via en `gs://`-URL (kräver signerad URL från backend — be projektägaren om en testlänk)
- [ ] Läs igenom `packages/server/templates/portrait.json` och förstå template-formatet
- [ ] Dokumentera ditt föreslagna TypeScript-schema för TemplateJSON och stäm av med projektägaren

---

### Vecka 2 — Template-motor och scenparser

**Mål:** Appen kan läsa ett JSON-dokument och visa scenerna i en lista.

**Uppgifter:**

- [ ] Definiera TypeScript-typer: `Template`, `Scene`, `TextOverlay`, `Effect`, `Transition`
- [ ] Bygg `parseTemplate(json: unknown): Template` — validerar och normaliserar JSON-input
- [ ] Implementera `buildEditSession(template: Template): EditSession` — skapar det interna state som appen arbetar med
- [ ] Bygg en enkel hemskärm som visar en lista av tillgängliga templates (från en hårdkodad array i dev-läge)
- [ ] Navigera till editor-skärmen när man väljer ett template
- [ ] På editor-skärmen: visa en scrollbar lista av scener med titel, duration och instruktion
- [ ] Bekräfta att rätt del av källvideon spelas upp för varje scen (seek till `startSeconds`)

---

### Vecka 3 — Timeline-UI

**Mål:** En horisontell CapCut-liknande tidslinje med scener och en playhead.

**Uppgifter:**

- [ ] Bygg en horisontell scrollbar komponent `<SceneTimeline />` med miniatyrrepresentationer av varje scen
- [ ] Bredden på varje scen-block ska vara proportionerlig mot dess duration
- [ ] Implementera en rörlig playhead (vertikal linje) som följer videouppspelningens position
- [ ] Tryck på ett scen-block → videospelaren hoppar till den scenens `startSeconds`
- [ ] Visa en visuell separator/ikon mellan scener för övergångspunkter
- [ ] Play/pause-knapp, hoppa till start, hoppa till slut
- [ ] Visa aktuell tid och total tid i videon

---

### Vecka 4 — Text overlay-editor

**Mål:** Användaren kan se, lägga till och redigera textöverlays direkt på videon.

**Uppgifter:**

- [ ] Rendera textöverlays från JSON ovanpå videospelaren vid rätt tidpunkter (`startSeconds` → `startSeconds + durationSeconds`)
- [ ] Tryck länge på videon → öppna en texteditor (bottom sheet eller modal)
- [ ] Texteditorn: ändra text, välj färg (färgpicker), välj storlek (slider)
- [ ] Drag & drop för att flytta en textoverlay till ny position på skärmen
- [ ] Grundläggande in-animationer: none / fadeIn / slideUp (väljas i editorn)
- [ ] Spara ändringar till EditSession-state
- [ ] Förhandsgranskning med alla textöverlays aktiverade

---

### Vecka 5 — Övergångar och visuella effekter

**Mål:** Användaren kan välja övergångar mellan scener och applicera enkla effekter.

**Uppgifter:**

- [ ] Implementera minst tre övergångstyper i UI: **Cut** (ingen övergång), **Fade** (tonar ut/in), **Slide** (scenen glider in från sidan)
- [ ] Tryck på övergångsikonen i timeline → välj övergångstyp och duration via en picker
- [ ] Implementera visning av valda övergångar i förhandsgranskning (simulera visuellt med React Native-animationer)
- [ ] Bygg en effektpanel för varje scen: brightness, contrast, zoom (Ken Burns-stil), blur
- [ ] Effekterna sparas till scen-state och skickas senare med i kompileringsanropet
- [ ] Se till att alla ändringar reflekteras live i timeline-UI

---

### Vecka 6 — Musik och ljud

**Mål:** Användaren kan lägga till bakgrundsmusik och kontrollera volym.

**Uppgifter:**

- [ ] Läs in musikspår från template-JSON (URL till GCS-fil) och spela upp det parallellt med videon
- [ ] Volymkontroll för originalljud (0–100%)
- [ ] Volymkontroll för bakgrundsmusik (0–100%)
- [ ] Möjlighet att byta musikspår (välj från en lista med fördefinierade spår)
- [ ] Mute/unmute-knapp för originalljud och musik separat
- [ ] (Sträckmål) Visa beats som markeringar på tidslinjen baserat på musikens takt — låt användaren se var naturliga klippunkter är

---

### Vecka 7 — Kompilering och export

**Mål:** En fullständig flöde från redigerad session till exporterad MP4-fil.

**Uppgifter:**

- [ ] Bygg `buildCompileRequest(session: EditSession): CompilePayload` — serialiserar hela redigeringssessionen till det format compile-servern förväntar sig
- [ ] Kör compile-servern lokalt och bekräfta att en enkel kompilering fungerar end-to-end
- [ ] Implementera ett API-anrop till `POST /compile` med multipart form (video + template-JSON)
- [ ] Bygg en kompileringsskärm med progress-indikator och stegtext ("Laddar upp…", "Kompilerar…", "Klart!")
- [ ] När kompilering är klar: visa förhandsgranskning av den färdiga videon
- [ ] Implementera "Spara till kamerarulle" via `expo-media-library`
- [ ] Verifiera att den exporterade filen är i 9:16-format och H.264-kodad (TikTok-kompatibelt)

---

### Vecka 8 — Stabilitet, polish och rapport

**Mål:** Stabil demo-redo app och inlämnad rapport.

**Uppgifter:**

- [ ] Felhantering: vad händer om GCS-videon inte kan nås? Compile-servern svarar inte? JSON-formatet är felaktigt?
- [ ] Laddningstillstånd för alla async-operationer (skeleton-loaders, spinners)
- [ ] Tomma tillstånd: inga templates tillgängliga, inga textöverlays lagda
- [ ] Genomkör ett komplett flöde med ett riktigt template-JSON och en riktig GCS-video
- [ ] Åtgärda de vanligaste krashar/buggarna som hittats under testning
- [ ] Skriv projektrapport: arkitektur, tekniska val, vad som fungerade/inte fungerade, vad du skulle gjort annorlunda
- [ ] Förbered en 5-10 minuters demo av flödet: template-laddning → redigering → export

---

## 7. Vad som är ett lyckat resultat

Projektet anses klart när följande flöde fungerar utan kraschar på en riktig enhet:

1. Appen laddar ett template-JSON (med `sourceVideoUrl`, scener, text overlays)
2. Källvideon hämtas från GCS och spelas upp i rätt segment per scen
3. Tidslinjen visar scenerna och playheaden rör sig korrekt
4. Användaren kan redigera en textoverlay (text, färg, position)
5. Användaren kan byta övergång mellan två scener
6. Kompileringen skickas till FFmpeg-servern och en MP4 returneras
7. Den kompilerade videon visas i förhandsgranskning och kan sparas till kamerarulle

---

## 8. Dev-miljö: komma igång

### Vad du behöver

- Node.js 22+, npm eller pnpm
- Expo Go-appen på din telefon (iOS eller Android)
- FFmpeg installerat lokalt (för compile-servern)
- Supabase-URL och anon-nyckel — be projektägaren
- En signerad GCS-URL till en testvideo — be projektägaren

### Starta compile-servern (från referensrepot)

```bash
cd apps/compile-server
npm install
npm run dev
# → http://localhost:3000
# Testa: curl http://localhost:3000/health
```

### Skapa din app (från grunden)

```bash
npx create-expo-app@latest min-editor-app --template blank-typescript
cd min-editor-app
npx expo install expo-router expo-video expo-file-system expo-media-library
```

### Viktiga miljövariabler

```
EXPO_PUBLIC_COMPILE_SERVER_URL=http://DIN_LOKALA_IP:3000
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

**Notera:** På Android emulator, använd `10.0.2.2` istället för `localhost` för att nå din dator.

---

## 9. Frågor och kontakt

- **"Jag förstår inte JSON-formatet"** → Läs `packages/server/templates/portrait.json` i referensrepot, och TypeScript-typerna i `apps/le-clap/src/types/domain.ts`
- **"Compile-servern returnerar fel"** → Kontrollera att FFmpeg är installerat och att template-JSON:et har rätt struktur
- **"GCS-videon laddas inte"** → Du behöver en signerad URL — `gs://`-adresser är inte direkt tillgängliga. Be projektägaren generera en
- **"Vad ska template-JSON:et innehålla exakt?"** → Stäm av schemat med projektägaren i vecka 1 — det är ett levande dokument som kan justeras
- **Allt som rör hagen AI, Vertex eller Supabase-datasynk** → Fråga projektägaren, det är inte ditt ansvar att sätta upp
