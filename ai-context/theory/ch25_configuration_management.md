# Kapitel 25: Configuration Management

## Kärna

Configuration management handlar om att veta vad som ändrats, varför, i vilken version och hur ändringen kan byggas eller återställas.

## Viktiga begrepp

* configuration item
* version control
* branch
* commit
* merge
* baseline
* system building
* release management
* change management
* traceability

## Relevans för 1DV613

GitLab, issues, branches, commits, MR, testfall, Wiki och CI/CD är bevis på process.

## Relevans för Abbas projekt

Configuration items:

* appkod
* compile-server
* package-lock
* testfall
* ai-context
* AI_PROJECT_GUIDE.md
* Wiki
* CI/CD-filer
* Dockerfiler när deployment används

## Fast regel

Nytt arbete ska börja från uppdaterad main:

```bash
git status
git switch main
git pull
git switch -c <issue-number-short-branch-name>
```

## CI/CD-koppling

CI/CD ska ses som automatiserad configuration management. Pipeline verifierar att rätt filer och beroenden fungerar tillsammans.

## Praktisk regel för AI

När AI föreslår commit ska den först be om:

* `git status`
* `git diff`
* relevant verifiering

AI ska inte föreslå att dokumentation, kod och deploy blandas i samma MR om de inte hör till samma issue.
