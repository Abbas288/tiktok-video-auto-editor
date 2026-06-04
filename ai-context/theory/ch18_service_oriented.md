# Kapitel 18: Service-Oriented Software Engineering

## 1. Kärna i kapitlet

Kapitel 18 handlar om service-oriented software engineering, där system byggs genom att kommunicera med fristående tjänster via tydliga gränssnitt. Tjänster kan ägas av olika system, köras på olika servrar och användas av flera klienter.

Kapitlet är viktigt när ett system inte gör allt själv, utan fungerar som klient i ett större ekosystem.

## 2. Viktiga begrepp

- Service: fristående funktion som nås via nätverk.
- Service provider: den som erbjuder tjänsten.
- Service consumer: den som använder tjänsten.
- Service interface: kontrakt för hur tjänsten anropas.
- REST API: vanligt sätt att exponera tjänster via HTTP.
- Loose coupling: klient och tjänst är inte hårt bundna till varandras interna implementation.
- Service composition: flera tjänster kombineras till ett flöde.
- External dependency: systemdel som appen är beroende av men inte kontrollerar.
- API contract: överenskommelse om request och response.

## 3. Relevans för 1DV613

Kursen berör integrationer, drift, Docker, CI/CD och externa system. Service-oriented tänk hjälper Abbas förklara hur mobilappen passar in i ett större system med AI/API, Supabase, GCS och compile-server.

Det hjälper också till att tydligt avgränsa scope.

## 4. Relevans för Abbas projekt

Abbas app är serviceorienterad i praktiken eftersom den är beroende av externa tjänster:

- AI/API video analysis är upstream.
- Supabase kan lagra metadata och templates.
- GCS kan lagra video och assets.
- backend/compile-server tar emot compile-payload.
- FFmpeg körs på backend, inte i mobilappen.

Mobilappen är service consumer.

Den ska konsumera:

- Template-JSON
- media-URL:er
- compile-resultat

Den ska skicka:

- compile-payload
- eventuellt redigerad session eller metadata

## 5. När AI ska använda kapitlet

Använd detta kapitel när AI ska:

- skriva om AI/API-flödet
- skapa RenderApiClient
- skapa TemplateApiClient
- diskutera Supabase och GCS
- förklara compile-servern
- skriva servicekontrakt
- testa API-anrop med mocks
- hantera fel från externa tjänster
- beskriva frontend/backend-ansvar i rapporten

## 6. Vad som måste synas i wiki, rapport, testning eller presentation

Wiki ska visa:

- vilka tjänster som finns upstream och downstream
- vilka data som skickas mellan dem
- vad mobilappen ansvarar för
- vad mobilappen inte ansvarar för
- API-risker
- felhantering vid tjänstefel

Presentation bör tydligt säga:

- AI/API analyserar specifik TikTok-URL upstream.
- Mobilappen analyserar inte videon själv.
- Mobilappen konsumerar Template-JSON.
- Compile-server kör FFmpeg downstream.
- Mobilappen skapar bara redigeringsbeskrivningen.

## 7. Praktisk koppling till projektet

När AI kodar mot tjänster ska den:

- kapsla API-anrop i infrastructure
- skapa tydliga request/response-typer
- hantera loading, success och error
- mocka tjänster i tester
- inte hårdkoda backendlogik i UI
- dokumentera antaganden om API-format

Exempel på framtida servicegränser:

```ts
TemplateApiClient.getTemplate(templateId: string): Promise<Template>
RenderApiClient.compile(payload: CompilePayload): Promise<RenderResult>
```

Viktiga edge cases:

- AI/API returnerar felaktig JSON.
- GCS URL saknas eller är utgången.
- compile-server svarar 500.
- nätverket är nere.
- response-formatet ändras.

Service-oriented design gör att dessa fel kan hanteras kontrollerat i infrastructure i stället för att spridas i hela appen.
