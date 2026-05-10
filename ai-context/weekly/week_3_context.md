# Vecka 3: Krav, testning och planering

## Tema
Kravhantering, testning, testplan, GitLab issues, iterations och projektplanering.

## Kursens fokus
- Läsa kapitel 4, 8 och 23.
- Skapa eller förbättra krav.
- Förstå användarkrav, systemkrav, funktionella krav och icke-funktionella krav.
- Börja skriva testfall utifrån krav.
- Använda GitLab för issues, planering och tidrapportering.
- Bygga struktur i wiki för krav, planering och testning.

## Abbas projektfokus
Denna vecka ska Abbas kunna omvandla visionen till krav och issues.

Viktiga kravområden:
- Template-JSON ska kunna läsas och valideras.
- Template-JSON ska omvandlas till EditSession.
- Editor ska kunna visa scener.
- Timeline ska senare visa scenstruktur.
- Preview ska kopplas till scener och video.
- Compile-payload ska senare byggas från EditSession.

## Vad Gemini ska prioritera
- Skapa små, testbara issues.
- Formulera acceptanskriterier.
- Skriva TC-fall direkt från krav.
- Föreslå testplan och testrapport.
- Vara skeptisk mot otydliga krav.

## GitLab-arbete
Gemini ska hjälpa Abbas att använda:
- issues som krav och tasks
- iterations för sprintliknande planering
- milestones för större faser
- `/estimate` och `/spend`
- labels för typ av arbete
- wiki för sammanfattning och reflektion

## Testning
För denna fas räcker manuella tester för nya UI-flöden, men domänlogik bör göras testbar från början.

Viktiga testfall:
- Template kan laddas.
- Invalid Template-JSON hanteras.
- Editor-route öppnas med rätt id.
- Store håller korrekt aktiv session.
- Edge cases dokumenteras.

## Risker
- Krav blir för breda eller otestbara.
- Testfall skrivs efteråt och missar kravet.
- AI-genererad kod börjar styra kraven i stället för tvärtom.
- Tidsrapportering glöms bort.

## Praktisk koppling till kod
När Gemini skriver kod i denna fas ska den alltid skriva eller föreslå testfall i samma svar. Kod utan testplan räknas inte som färdig.
