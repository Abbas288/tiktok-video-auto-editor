# Kapitel 25: Configuration Management

## 1. Kärna i kapitlet

Kapitel 25 handlar om configuration management, alltså hur man hanterar ändringar, versioner, konfigurationer och releases i mjukvaruprojekt. När ett system växer måste det gå att veta vad som ändrats, varför det ändrats, vilken version som testats och vilka filer som hör ihop.

Configuration management är extra viktigt när flera filer, beroenden, dokumentation och testfall förändras samtidigt.

## 2. Viktiga begrepp

- Configuration item: något som versionshanteras, till exempel kod, dokumentation, testfall eller konfiguration.
- Version control: hantera historik av ändringar.
- Baseline: känd version som används som referens.
- Change management: hantera föreslagna och genomförda ändringar.
- System building: bygga systemet från rätt filer och beroenden.
- Release management: paketera och leverera versioner.
- Branch: separat utvecklingslinje.
- Merge: föra samman ändringar.
- Commit: sparad ändring med historik.
- Traceability: kunna följa ändring från krav till kod och test.

## 3. Relevans för 1DV613

Kursen använder GitLab, issues, Wiki, milestones, iterations och commits som bevis på utvecklingsprocess. Abbas måste kunna visa vad som ändrats över tid och varför.

Configuration management kopplar ihop:

- Git
- GitLab issues
- branches
- merge requests
- commits
- Wiki
- testfall
- releases
- tidsloggning

## 4. Relevans för Abbas projekt

Abbas projekt har många configuration items:

- appkod
- Template-JSON-typer
- mockTemplate
- Zustand store
- routes
- theme
- testfall
- ai-context
- Wiki
- README
- package.json
- package-lock.json
- `.gitignore`

Eftersom Gemini kan skapa många filer snabbt måste Abbas vara extra noga med `git status`, `git diff` och små commits.

## 5. När Gemini ska använda kapitlet

Använd detta kapitel när Gemini ska:

- hjälpa med git status och diff
- föreslå commit
- skapa branch-namn
- förklara staged och unstaged changes
- bedöma om filer ska committas
- skriva release notes
- koppla ändring till issue
- hantera package-lock och package.json
- undvika att skräpfiler kommer med

## 6. Vad som måste synas i wiki, rapport, testning eller presentation

Wiki och rapport ska visa:

- hur Abbas använder GitLab
- hur issues kopplas till commits
- hur testad version identifieras
- hur ändringar spåras
- hur branches eller commits används
- hur tidsloggning används

Presentation kan säga:

"Jag använder GitLab och Git för spårbarhet. Varje större ändring ska kopplas till issue, testfall och commit, så att det går att följa projektets utveckling från krav till verifierad kod."

## 7. Praktisk koppling till projektet

Gemini ska alltid föreslå dessa kontroller före commit:

```bash
git status
git diff
npm run lint
npx tsc --noEmit
```

Om filer är staged:

```bash
git diff --staged
```

Rekommenderad commit-disciplin:

- en feature per commit
- tydligt prefix
- inget blandat scope
- inga debug-filer
- inga miljövariabler
- inga otestade stora ändringar

Bra commit:

```bash
git commit -m "feat: setup Expo Router foundation"
```

Dålig commit:

```bash
git commit -m "fix stuff"
```

Configuration management för Abbas betyder att projektet ska gå att förstå i efterhand: vad byggdes, varför byggdes det, hur testades det och vilken version gäller?
