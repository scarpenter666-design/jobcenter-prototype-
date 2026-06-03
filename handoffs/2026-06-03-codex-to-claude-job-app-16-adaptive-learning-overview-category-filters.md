# Handoff: JOB-APP-16 — Adaptive Lernfragen, Übersicht-Buttons und Kategorieauswahl

Date: 2026-06-03  
From: Codex  
To: Claude Code  
App: `jobcenter-prototype/`  
Feature brief: `features/JOB-APP-16-adaptive-learning-overview-category-filters.md`

## Goal

Bitte setze Svens aktuelle Änderungswünsche um:

- Lernfragen in `KI-Grundlagen für alle` und `Mythos oder Realität?` sollen je nach Onboarding-Ergebnis (`einsteiger`, `grundkenntnisse`, `fortgeschritten`) unterschiedlich sein.
- Die Tabs `Lernen`, `Praxis`, `Prüfen` und `Prompts` bekommen einen Button `Übersicht`, der zur Home-Übersicht führt.
- Die Prompt-Bibliothek wird nach Bereichen gegliedert; Prompt-Kacheln erscheinen erst nach Auswahl.
- Praxis/Feldpraxis wird nach Themen gegliedert; Praxisbeispiele erscheinen erst nach Auswahl.
- Im dunklen Theme müssen aktive farbige Navigationsfelder für `rot`, `gruen` und `blau` weiße Schrift/Icon-Farbe haben.

Keine App-Code-Änderungen außerhalb dieses Scopes.

## Scope

### Adaptive Lerninhalte

Führe lokale statische Varianten für Lern-/Quizfragen ein, z. B. in `src/data/content.ts`.

Empfohlene Umsetzung:

- Typ für Level importieren oder lokal kompatibel halten: `einsteiger | grundkenntnisse | fortgeschritten`.
- Für Mythos:
  - `mythQuestionsByLevel[level]`
  - `einsteiger` mit einfachen Aussagen.
  - `grundkenntnisse` mit sicheren Anwendungs-/Prüfregeln.
  - `fortgeschritten` mit Verantwortung, Datenschutz, Grenzen, Prozess-/Teambezug.
- Für Praxisfall/Lernübung oder KI-Grundlagen:
  - entweder `practiceCaseByLevel[level]`
  - oder eine zusätzliche Frage-/Übungsliste für den Bereich `KI-Grundlagen für alle`.
- `LernpfadScreen` bekommt `aiLevel` aus `profile.aiLevel` und wählt die passenden Inhalte.

Wichtig: Die Lernmodule selbst dürfen bestehen bleiben. Es reicht, die interaktiven Fragen/Auswahlmöglichkeiten levelabhängig zu machen.

### Übersicht-Button

Gib `onBackToOverview`/`onOverview` von `App` in diese Screens:

- `LernpfadScreen`
- `PraxisScreen`
- `PruefenScreen`
- `PromptLibrary`

Buttontext: `Übersicht`  
Verhalten: `setTab("home")`

Nutze vorhandene Button-Stile (`btn-secondary`, BAKIRA-Back-Muster, ggf. kleine Utility-Klasse).

### Prompt-Kategorien

Ergänze eine Kategorieauswahl in `PromptLibrary`.

Akzeptiertes Verhalten:

- Initial: keine Prompt-Kacheln.
- Nach Kategorieauswahl: passende Kacheln.
- Suche filtert nur innerhalb der Auswahl.
- `Alle Prompts` zeigt Built-ins und eigene Prompts.
- Eigene Prompts bleiben erstellbar, bearbeitbar, löschbar und nach Reload sichtbar.

Pragmatische Kategoriezuordnung über Tags/Titel/Department ist okay. Keine Persistenzänderung erzwingen.

### Praxis-Themen

Ergänze Kategorie-/Themenauswahl in `PraxisScreen`.

Akzeptiertes Verhalten:

- Initial: keine Praxisbeispiel-Karten.
- Nach Themenauswahl: passende Karten.
- Eingabefeld für eigene Fälle bleibt sichtbar und funktionsfähig.
- Bestehende Beispiele dürfen um `category`/`topics` erweitert und zusätzliche fiktive Beispiele ergänzt werden.

### Dark Theme Lesbarkeit

Passe nur dunkle Theme-Regeln an:

- `.app-shell[data-theme="dark"] .desktop-nav-item.active`
- ggf. `.app-shell[data-theme="dark"] .nav-tab.active`
- Farbtemplates `rot`, `gruen`, `blau`

Ziel: aktive farbige Navigation mit weißer Schrift/Icon-Farbe. Hell-Theme unverändert.

## Files To Touch

Erlaubt:

- `src/App.tsx`
- `src/data/content.ts`
- `src/data/prompts.ts` falls nötig
- `src/styles.css`
- `tests/smoke.spec.ts`
- passende Unit-Tests, wenn Helper ausgelagert werden
- `notes/test-log.md`

## Files To Avoid

- `package.json`
- `package-lock.json`
- `.github/**`
- `public/**`
- Build-/Vite-/Playwright-Konfiguration

Keine neuen Packages ohne ausdrückliche Freigabe.

## Acceptance Criteria

- Low-Score-Onboarding und High-Score-Onboarding zeigen unterschiedliche Fragen/Auswahlmöglichkeiten in Lernen/Mythos.
- `Lernen`, `Praxis`, `Prüfen`, `Prompts` haben jeweils `Übersicht` und der Button führt zu Home.
- Prompt-Bibliothek zeigt initial keine Prompt-Karten; nach Kategorieauswahl passende Karten.
- Prompt-Suche funktioniert nach Kategorieauswahl.
- Praxis zeigt initial keine Praxisbeispiel-Karten; nach Themenauswahl passende Karten.
- Praxis- und Prüfen-Eingabefelder funktionieren weiter.
- Dark+rot, Dark+gruen und Dark+blau: aktive Navigationsschrift ist weiß.
- Bestehende Kernfeatures laufen weiter.

## Commands To Run

Bitte nach der Implementierung ausführen:

```powershell
npm test
npm run build
npm audit --audit-level=moderate
npm run test:e2e
git status --short
```

Wenn `npm audit` nur bekannte moderate Hinweise ohne neuen direkten Bezug meldet, im Testlog dokumentieren.

## Notes For Review

Bitte `notes/test-log.md` mit Builder-Log aktualisieren:

- geänderte Dateien
- Kommandos mit Exitcodes und kurzen Ergebnissen
- offene Risiken
- Review-Fokus für Codex

Codex-Review-Fokus:

- Scope eingehalten?
- Levelabhängigkeit wirklich aus `profile.aiLevel`?
- Initialzustände für Kategorien korrekt?
- Keine Kacheln vor Auswahl?
- Bestehende Prompt-/Praxis-/Prüfen-Flows nicht beschädigt?
- Dark-Theme-Farbkontrast in Navigation sichtbar verbessert?
