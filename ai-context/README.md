# ai-context

## Syfte

Denna katalog ger AI korrekt, kompakt och projektspecifik kontext för Abbas 1DV613-projekt.

## Läsordning

1. `../AI_PROJECT_GUIDE.md`
2. `00_project_rules.md`
3. `01_abbas_project_context.md`
4. `04_architecture.md`
5. `05_gitlab_workflow.md`
6. `13_cicd_deployment_context.md` vid CI/CD, Docker, Cumulus eller deployment
7. `08_study_guide_context.md` vid kurskrav, G/VG, examination eller slutleverans
8. `12_wiki_context.md` vid Wiki, rapport, reflektion eller dokumentation
9. relevant weekly-fil i katalogen `weekly\`
10. relevant theory-fil i katalogen `theory\`
11. relevant transcript-fil i katalogen `transcripts\`
12. originalkälla endast vid behov

## Viktiga filer

* `00_project_rules.md`: arbetsregler, Git-flöde och verifiering.
* `01_abbas_project_context.md`: produkt, målgrupp, MVP och scope.
* `02_testing_rules.md`: teststil och testdisciplin.
* `03_definition_of_done.md`: vad som krävs innan något räknas som klart.
* `04_architecture.md`: lager och systemflöde.
* `05_gitlab_workflow.md`: GitLab, brancher, MR, issues och spårbarhet.
* `06_course_requirements.md`: kurskrav, veckoteman, QA, CI/CD, etik och slutleverans.
* `07_reference_projects_ida_wasim.md`: jämförelsekällor, inte teknisk kravkälla.
* `08_study_guide_context.md`: G- och VG-krav från studieguiden.
* `09_theory_index.md`: teoriindex.
* `10_source_map.md`: källkarta.
* `11_mvp_requirements.md`: MVP-krav.
* `12_wiki_context.md`: Wiki-stil, dokumentationsmönster och rapportlogik.
* `13_cicd_deployment_context.md`: faktisk CI/CD- och Cumulusmodell.
* `wiki/wiki_source_summary.md`: sammanfattning av befintlig Wiki.

## Viktig deploymentregel

Cumulus kör containrar. GitLab CI/CD bygger och deployar dem via Docker context över SSH. Cumulus ska inte användas som arbetskatalog för koden.

## Användning

* Kodarbete: läs AI-guiden, regler, arkitektur och aktuell kod.
* Dokumentation: läs Wiki-kontext, betygskrav och relevant weekly-fil.
* Betyg/VG: läs `08_study_guide_context.md` först.
* Testning: läs testing rules, definition of done och kapitel 8.
* CI/CD: läs `13_cicd_deployment_context.md`, vecka 7 och kapitel 25.
* Slutleverans: läs vecka 9 till 10, betygskraven och Wiki-kontext.
