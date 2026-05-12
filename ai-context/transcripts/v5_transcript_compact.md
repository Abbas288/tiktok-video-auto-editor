# Kompakt transkript, vecka 5

## MÅSTE FÖLJAS
* Vecka 5 fokuserar på versionshantering, software evolution och configuration management.
* Projektets kod, dokumentation, testfall och egenproducerade resurser ska versionshanteras i GitLab.
* Hemligheter, API-nycklar, lösenord, `.env`, externa bibliotek, `node_modules`, cache och byggartefakter ska inte versionshanteras.
* `git status` ska användas ofta för att kontrollera vad som är ändrat, staged, untracked eller borttaget.
* Lägg hellre till filer explicit med `git add <fil>` än att slentrianmässigt köra `git add .`.
* GitLab ska visa kedjan från krav till implementation: krav, issue, branch, MR, commit och testresultat.
* Praktisk partnerövning ska genomföras: ge en partner tillgång till repo, gör en liten ändring i varandras kodbas och håll arbetet tidsboxat.
* Partnerövningen ska inte bli en stor feature. Syftet är att öva Git, kodförståelse, branching och bidrag i någon annans repo.
* Måndagens presentation vecka 6 ska redovisa krav och iterationsrapporter, partnerövningen, branching strategies och vad som kan automatiseras i GitLab.

## BRA FÖR RAPPORT
* Versionshantering är en del av professionell mjukvaruutveckling, inte bara backup.
* GitLab kan användas för spårbarhet: användarkrav kan ligga på epic-nivå, systemkrav som issues, tid som milestones och implementation som branch eller MR.
* Branching strategies ska väljas utifrån projektets storlek. För ett litet studentprojekt är short-lived feature branches ofta rimligare än tung Git Flow.
* Software evolution är viktigt eftersom projektets krav, API-format, Template-JSON, compile-payload och deploymentmiljö kan ändras.
* Configuration management gör det möjligt att veta vilken version som testades, vilka filer som hör till en ändring och varför ändringen gjordes.
* En liten, granskad och testad ändring är bättre än en stor otydlig commit.
* AI-genererad kod kräver extra tydlig versionshantering eftersom många filer kan ändras snabbt.

## BRA FÖR MUNTLIG REDOVISNING
* Förklara att Git inte är en enkel spara-knapp. Flödet är working directory, staging area, local repository och remote repository.
* Förklara skillnaden mellan `git add`, `git commit` och `git push`.
* Förklara att `git commit -a` inte tar med nya filer, bara redan spårade filer.
* Beskriv partnerövningen som programförståelse: först förstå någon annans kod, sedan göra en liten spårbar ändring.
* Motivera vald branching strategy. För Abbas projekt passar kortlivade feature branches eftersom main bör hållas stabil men projektet inte har flera parallella produktreleaser.
* Lyft att GitLab automation senare kan köra lint, tester, build, MR-kontroller och issue-kopplingar, men att analys och prioritering fortfarande måste göras av utvecklaren.

## BAKGRUND
* Vecka 5 läser kapitel 9 och 25.
* Kapitel 9 handlar om software evolution: mjukvara förändras över tid och måste kunna underhållas.
* Kapitel 25 handlar om configuration management: versioner, ändringar, byggning, releases och spårbarhet.
* Kursmaterialet betonar att allt egenproducerat som behövs för projektet ska versionshanteras.
* Kursmaterialet betonar också att genererade filer och hemligheter ska hållas utanför Git.
* GitLab-modellen i kursen rekommenderar en kedja från användarkrav till issue, branch och merge request.
* Veckan saknar schemalagt fredagsgrupparbete på grund av helgdag, men gruppen ska ändå genomföra partnerövningen självständigt.

## Risker och krav som påverkar Abbas projekt
* Risk: AI ändrar många filer och gör diffen svår att granska.
* Risk: stora commits blandar routing, parser, UI, test och dokumentation i samma ändring.
* Risk: `.env`, GCS-länkar, tokens eller andra secrets råkar hamna i repo.
* Risk: Template-JSON eller compile-payload ändras utan att tester och dokumentation följer med.
* Risk: main blir instabil om feature branches inte testas innan merge.
* Krav: varje feature ska kunna kopplas till issue, testfall och commit.
* Krav: `git status`, `git diff`, lint, TypeScript och relevanta tester ska köras före commit.
* Krav: partnerövningen ska visa kodförståelse, liten ändring och reflektion över branching.

## Saker Gemini ska komma ihåg vid kodarbete
* Börja alltid med aktuell issue och acceptanskriterier.
* Föreslå en liten branch per feature eller fix.
* Kontrollera att ändringen inte blandar flera orelaterade features.
* Påminn om `git status`, `git diff`, `git diff --staged`, `npm run lint`, `npx tsc --noEmit` och relevanta tester.
* Varna om användaren försöker committa untracked files utan granskning.
* Föreslå commit-meddelande med tydligt prefix, till exempel `fix: handle missing template id`.
* Koppla ändringar i Abbas projekt till Template-JSON, EditSession, editor-route, preview-route, timeline eller compile-payload.
* Använd short-lived feature branches som standard för Abbas projekt om inget annat anges.
* Behandla hagen-auto-edit som teknisk inspiration, inte som kravkälla.
