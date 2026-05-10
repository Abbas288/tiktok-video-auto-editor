# Kapitel 16: Component-Based Software Engineering

## 1. Kärna i kapitlet

Kapitel 16 handlar om Component-Based Software Engineering, CBSE. Kärnan är att bygga system av separata komponenter med tydliga gränssnitt. En komponent ska ha ett avgränsat ansvar och kunna användas, testas och bytas ut utan att hela systemet behöver skrivas om.

CBSE passar särskilt när system behöver integrera flera externa tjänster eller när man vill isolera komplexitet bakom tydliga kontrakt.

## 2. Viktiga begrepp

- Component: självständig enhet med tydligt gränssnitt.
- Provided interface: vad komponenten erbjuder.
- Required interface: vad komponenten behöver från omgivningen.
- Component model: regler för hur komponenter definieras och samverkar.
- Composition: sättet komponenter kopplas ihop.
- Interface specification: formellt eller tydligt beskrivet kontrakt.
- Component reuse: återanvändning av komponenter.
- Adapter: lager som översätter mellan olika gränssnitt.
- Encapsulation: gömma intern komplexitet bakom ett enkelt interface.

## 3. Relevans för 1DV613

Kursen vill se att Abbas kan bygga testbar och begriplig mjukvara. Komponenttänk gör det lättare att visa ansvarsfördelning i Wiki, testplan och presentation.

CBSE är också relevant för att AI-genererad kod inte ska bli en enda stor klump. Tydliga komponenter minskar risken för falsk trygghet.

## 4. Relevans för Abbas projekt

Abbas app bör ses som en samling komponenter:

- TemplateParser
- TemplateValidator
- EditSessionStore
- SceneTimeline
- VideoPreview
- TextOverlayEditor
- TransitionSelector
- EffectPanel
- CompilePayloadFactory
- RenderApiClient
- GcsMediaResolver

Varje komponent bör ha tydligt ansvar och tydlig input/output.

Exempel:

- TemplateParser tar okänd JSON och returnerar Template eller fel.
- EditSessionStore håller state och exponerar actions.
- CompilePayloadFactory tar EditSession och returnerar payload.
- RenderApiClient skickar payload till backend.

## 5. När Gemini ska använda kapitlet

Använd detta kapitel när Gemini ska:

- dela upp kod i komponenter
- skapa tydliga interface
- kapsla API-anrop
- föreslå tester för varje komponent
- skriva arkitektur eller design-del
- refaktorera en stor fil
- skapa adapter mot hagen-auto-edit eller compile-server

## 6. Vad som måste synas i wiki, rapport, testning eller presentation

Wiki och rapport ska visa:

- vilka huvudkomponenter systemet har
- vad varje komponent ansvarar för
- hur komponenterna kommunicerar
- vilka komponenter som är testkritiska
- vilka externa beroenden som kapslas

Testplanen bör koppla testfall till komponenter:

- TemplateParser testas med giltig och ogiltig JSON.
- EditSessionStore testas med scene selection.
- SceneTimeline testas med olika antal scener.
- CompilePayloadFactory testas med redigerad session.
- RenderApiClient testas med mockad backend.

## 7. Praktisk koppling till projektet

När Gemini kodar ska kapitel 16 leda till:

- skapa komponenter med ett ansvar
- undvika att screens gör allt
- låta domain functions vara rena
- kapsla externa API:er
- skriva testbara interfaces
- skapa mocks för infrastructure

Exempel på komponentgräns:

```ts
buildCompilePayload(session: EditSession): CompilePayload
```

Detta är testbart eftersom input och output är tydliga.

Dålig komponentgräns:

```ts
function renderEverythingAndSendToServerAndUpdateUI()
```

Den blandar domain, infrastructure och presentation.
