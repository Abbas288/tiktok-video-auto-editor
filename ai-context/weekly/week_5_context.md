# Vecka 5: Versionshantering och vidareutveckling

## Tema
Versionshantering, Git-arbetsflöden, GitLab från krav till implementation, software evolution och configuration management.

## Kursens fokus
- Läsa kapitel 9 och 25.
- Förstå hur mjukvara förändras över tid.
- Arbeta med Git, branches, commits, merge och remote repository.
- Koppla krav, issues och implementation i GitLab.
- Förbereda mer avancerad versionshantering och kvalitetssäkring.

## Abbas projektfokus
Abbas projekt börjar nu gå från grundstruktur till vidareutveckling. Därför blir versionshantering extra viktig.

Viktigt:
- varje commit ska vara begriplig
- varje issue ska ha tydlig koppling till krav och test
- varje större ändring ska kunna förklaras i wiki
- gamla fungerande flöden ska regressionstestas när nya läggs till

## Git-arbetsflöde
Gemini ska använda denna mentala modell:

`working directory -> staging area -> local repository -> remote repository`

Praktiskt:
- `git status` före varje commit
- `git diff` innan staging
- `git add` för nya filer
- `git commit` lokalt
- `git push` till GitLab

Kom ihåg: `git commit -a` tar inte med nya filer.

## Branches
Branches är användbara även när Abbas arbetar ensam.

Rekommenderat:
- `main` ska vara stabil
- större feature byggs på feature branch
- merge efter test och DoD
- radera branch när arbetet är sammanfört

## Configuration management
Gemini ska tänka på:
- vilka filer hör till koden
- vilka filer är miljö, cache eller byggartefakter
- vilka konfigurationsfiler behövs
- vilka miljövariabler ska aldrig committas
- hur ändringar kan spåras över tid

För Abbas projekt gäller:
- `.env` ska inte committas
- `.env.example` bör finnas när miljövariabler införs
- GCS/Supabase/compile-server URLs ska hanteras som konfiguration
- package-lock ska committas om npm används

## Software evolution
Abbas app kommer förändras när Template-JSON, AI/API och compile-servern utvecklas.

Gemini ska därför:
- undvika hårdkodade antaganden om JSON som kan ändras
- isolera API-format och parsning
- föreslå adapters eller repositories när externa format ändras
- skydda EditSession som intern modell
- låta Template-JSON vara bryggan mellan upstream AI/API och appens editorflöde

## Risker
- ändringar i Template-JSON bryter appen
- snabb AI-kod gör Git-historiken svår att följa
- för stora commits gör felsökning svårare
- miljövariabler eller hemligheter råkar committas
- appen saknar regressionstest när foundation ändras

## Praktisk koppling till kod
När Gemini föreslår ändring ska den också föreslå:
- vilken issue ändringen hör till
- vilka filer som påverkas
- vilka tester som ska köras
- vilken commit-typ som passar
- om `.gitignore`, `.env.example` eller dokumentation behöver ändras
