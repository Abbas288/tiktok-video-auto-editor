# Kapitel 8: Software Testing

## 1. Kärna i kapitlet

Kapitel 8 handlar om testning som en systematisk process för att både hitta fel och kontrollera att systemet uppfyller krav. Testning kan visa att fel finns, men aldrig bevisa att fel inte finns.

Kapitlet skiljer mellan:

- validation: bygger vi rätt system för användaren?
- verification: bygger vi systemet rätt enligt specifikationen?
- defect testing: försöker vi avslöja fel?

Testning ska ske på flera nivåer, från små enheter till hela systemflöden och användaracceptans.

## 2. Viktiga begrepp

- Development testing: testning under utveckling.
- Release testing: testning av en komplett version innan leverans.
- User testing: testning med riktiga eller potentiella användare.
- Acceptance testing: kunden avgör om systemet är acceptabelt.
- Unit testing: testar små enheter som funktioner eller metoder.
- Component testing: testar samverkan mellan komponenter.
- System testing: testar hela systemets beteende.
- Regression testing: gamla tester körs om efter ändringar.
- Requirements-based testing: testfall härleds från krav.
- Scenario testing: realistiska användarflöden testas från början till slut.
- Partition testing: testa representativa inputgrupper.
- Guideline-based testing: testa kända riskfall och tidigare felmönster.
- Test-first development: skriv test före kod.

## 3. Relevans för 1DV613

Kursen kräver testplan, testfall, testsviter och testrapport. Testning är inte en extra sak efteråt, utan en del av projektets bevisföring.

Abbas måste kunna visa:

- vilka krav som testas
- hur testfall är strukturerade
- vilka tester som är manuella
- vilka tester som är automatiserade eller planerade
- vilka edge cases som kontrolleras
- vilka risker som finns kvar

## 4. Relevans för Abbas projekt

Abbas app har flera testkritiska delar:

- Template-JSON parsing
- Template-validering
- EditSession builder
- Zustand store
- scene selection
- timeline och preview
- video seek till startSeconds
- text overlays
- transitions och effects
- audio settings
- compile-payload
- RenderApiClient mot backend/compile-server

Eftersom AI används för kodstöd blir testning extra viktig. AI kan skapa kod som ser rätt ut men bara fungerar i normalfallet.

## 5. När AI ska använda kapitlet

Använd detta kapitel när AI ska:

- skriva testplan
- skriva testfall i TC-format
- koppla testfall till krav
- skapa edge cases
- föreslå automatiska tester
- skriva testrapport
- avgöra om en feature är klar
- granska AI-genererad kod
- planera regressionstestning före commit

## 6. Vad som måste synas i wiki, rapport, testning eller presentation

Wiki ska innehålla:

- teststrategi
- testplan
- testsviter
- manuella testfall
- testrapport
- kravspårbarhet
- testade versioner
- kvarstående risker

Presentation bör visa:

- Development testing: JSON-parser, Template-validering, session builder, payload factory.
- Component testing: timeline + preview, UI + session state.
- Release testing: kravbaserade testfall och scenario testing.
- Black-box testing: appens funktionalitet och användarflöde.

## 7. Praktisk koppling till projektet

AI ska använda följande teststruktur:

```md
### TCx.y Titel

**Kravkoppling:** användarkrav/systemkrav/funktionellt krav/icke-funktionellt krav  
**Förutsättning:** Startläge  
**Testdata:** Konkret data  
**Steg:**  
1. Steg ett  
2. Steg två  
3. Steg tre  

**Förväntat resultat:** Vad som ska hända  
**Faktiskt resultat:** Vad som hände  
**Status:** Pass/Fail  
**Kommentar:** Kort analys
```

Viktiga testfall för Abbas:

- TC1.1 Home route renders project list.
- TC1.2 Template can be loaded into EditSession.
- TC1.3 Navigation opens editor route with template id.
- TC1.4 Preview route opens with template id.
- TC1.5 Theme and template types compile without TypeScript errors.
- TC2.1 Invalid Template-JSON is rejected.
- TC2.2 Empty scenes array is handled.
- TC3.1 Scene click updates selected scene.
- TC4.1 Preview seeks to scene startSeconds.
- TC5.1 Compile-payload contains edited scene data.

AI ska inte skriva generiska teststeg som "ange ett namn" eller "välj ett projekt". Testdata ska vara konkret, exempelvis `pizza-launch-2026` eller `missing-template-id`.

Minimikontroll före commit:

```bash
npm run lint
npx tsc --noEmit
npx expo start
```
