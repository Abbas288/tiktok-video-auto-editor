# Vecka 4: Implementation, arkitektur och Docker-grund

## Tema
Första tydliga implementationen, design, systemmodellering, arkitektur, Definition of Done, testplan och introduktion till Docker/containers.

## Kursens fokus
- Läsa kapitel 5, 6 och 7.
- Börja implementera mer konkret.
- Dokumentera arkitektur i wiki.
- Skapa Definition of Done.
- Skapa testplan.
- Läsa in sig på containers och Docker som förberedelse för senare drift.
- Arbeta med risker genom spikes.

## Abbas projektfokus
Abbas behöver bygga en stabil grund för editorflödet:
- Expo Router-route groups
- Home route
- Editor route med template-id
- Preview route med template-id
- theme-konstanter
- Template-typer
- mockTemplate
- useEditSession store

## Arkitektur som ska användas
- Presentation: screens, routes och UI-komponenter.
- Application: Zustand store och flödeslogik.
- Domain: Template, Scene, TextOverlay, Transition, Effect, EditSession.
- Infrastructure: API-klienter och kommunikation med GCS/Supabase/compile-server när det behövs.

## Vad Gemini ska prioritera
- Små implementationer.
- Testbar struktur.
- Ingen tung logik i UI.
- Ingen FFmpeg i mobilappen.
- Dokumentera risker och arkitektur.
- Testa foundation innan commit.

## Definition of Done denna vecka
En feature är inte klar förrän:
- den är testad manuellt eller automatiskt
- den har kravkoppling
- den har acceptanskriterier
- TypeScript/lint är kontrollerade där möjligt
- wiki eller AI-kontext är uppdaterad vid behov

## Docker-koppling
Docker är relevant för:
- compile-server
- lokal backendmiljö
- framtida drift
- miljöreproducerbarhet

Docker är inte relevant som lösning för att köra FFmpeg i mobilappen.

## Risker
- Expo-video installeras men antas fungera utan test.
- Router fungerar men store-data saknas.
- AI skapar för mycket kod på en gång.
- Arkitekturen dokumenteras inte och blir svår att förklara.
- Appen blir svår att testa eftersom logik blandas in i UI.

## Praktisk koppling till kod
Gemini ska föreslå foundation-commit först när följande testats:
- Home route renderas.
- Template kan laddas till EditSession.
- Editor route öppnas med id.
- Preview route öppnas med id.
- Theme och Template-typer kompilerar.
