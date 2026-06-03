# JOB-APP-16 — Adaptive Lernfragen, Übersicht-Buttons und Kategorieauswahl

Status: Ready for Claude implementation  
Date: 2026-06-03  
Owner: Codex planning/review, Claude Code implementation

## Ziel

Die bestehende Jobcenter-Lernapp soll in vier Bereichen angepasst werden:

- Lernfragen in `KI-Grundlagen für alle` und `Mythos oder Realität?` sollen zum im Onboarding ermittelten KI-Level passen.
- Die Hauptbereiche `Lernen`, `Praxis`, `Prüfen` und `Prompts` sollen jeweils einen gut sichtbaren Button `Übersicht` erhalten, der zurück zur App-Übersicht führt.
- Die Prompt-Bibliothek und Feldpraxis/Praxis sollen zuerst eine Themenauswahl anzeigen; Kacheln erscheinen erst nach Auswahl.
- Im dunklen Theme sollen aktive/rot-, grün- oder blau-hinterlegte Navigationsfelder weiße Schrift verwenden, damit die Lesbarkeit stimmt.

Keine API-Anbindung, keine externen Dienste, keine echten Kundendaten.

## Aktueller Zustand

Relevante Stellen:

- `src/App.tsx`
  - `LernpfadScreen` nutzt aktuell dieselben Fragen/Inhalte unabhängig vom `profile.aiLevel`.
  - `PraxisScreen` zeigt Praxisbeispiele sofort komplett.
  - `PromptLibrary` zeigt Bibliothekskacheln sofort und filtert nur per Suche.
  - `PruefenScreen` hat keinen eigenen Rücksprung zur Übersicht.
- `src/data/content.ts`
  - `mythQuestions` und `practiceCase` sind statisch.
  - `praxisExamples` sind statisch und nicht thematisch gruppiert.
- `src/data/prompts.ts`
  - Built-in-Prompts haben Tags/Department, aber keine sichtbare vorgeschaltete Kategorienavigation.
- `src/styles.css`
  - Im dunklen Theme mit Farbtemplate `rot`, `gruen` oder `blau` können aktive Navigationsflächen farbig sein, während die Schrift ebenfalls in der Akzentfarbe bleibt.

## Gewünschter Zustand

### 1. Lernfragen nach KI-Level

Das im Onboarding berechnete `profile.aiLevel` steuert die angezeigten Fragen/Aufgaben für:

- `KI-Grundlagen für alle`
- `Mythos oder Realität?`

Level:

- `einsteiger`: einfache Einstiegsfragen, klare Begriffe, kurze Auswahlmöglichkeiten.
- `grundkenntnisse`: mittlere Schwierigkeit, stärker auf sichere Anwendung und Prüfung ausgerichtet.
- `fortgeschritten`: anspruchsvollere Fragen, z. B. Grenzen, Verantwortung, Datenschutz, Prüfroutinen, Team-/Prozessbezug.

Wichtig:

- Bestehende Navigation und Lernpfad-Struktur bleiben erhalten.
- Keine Fachentscheidungen oder Rechtsberatung erzeugen.
- Die Inhalte bleiben lokal und statisch/regeldeterminiert.
- Bereits gespeicherte Profile sollen funktionieren; keine Migration erzwingen, wenn nicht nötig.
- Mythos-Antwortstatus darf weiterhin lokal im Komponenten-State liegen. Falls dieselben Indexe je Level genutzt werden, beim Levelwechsel keine Abstürze verursachen.

### 2. Übersicht-Button in Hauptbereichen

In den Tabs `Lernen`, `Praxis`, `Prüfen` und `Prompts` soll ein Button `Übersicht` vorhanden sein.

Verhalten:

- Klick setzt den aktiven Tab auf `home`.
- Stil orientiert sich am bestehenden BAKIRA-Workspace-Backbutton bzw. an vorhandenen `btn-secondary`/Backbutton-Mustern.
- Keine Änderung an Desktop- oder Bottom-Navigation.
- In Unteransichten wie Prompt-Editor darf der vorhandene Zurück-zur-Bibliothek-Button bestehen bleiben; der neue Übersicht-Button soll trotzdem im Prompts-Hauptbereich erreichbar sein.

### 3. Prompt-Bibliothek nach Bereichen gliedern

Die Prompt-Bibliothek soll erst eine Kategorienauswahl anzeigen.

Gewünschte Kategorien, pragmatisch ableitbar aus bestehenden Daten:

- `Alle Prompts`
- `Schreiben und Umformulieren`
- `Prüfen und Qualität`
- `Datenschutz und Sicherheit`
- `Lernen und Erklären`
- `Prompting und Struktur`
- `Teamleitung`

Verhalten:

- Beim Öffnen des Prompts-Tabs werden noch keine Prompt-Kacheln angezeigt.
- Nach Auswahl einer Kategorie erscheinen nur passende Prompt-Kacheln.
- Die Suche filtert innerhalb der gewählten Kategorie.
- Der Promptgenerator bleibt nutzbar.
- Eigene Prompts sollen mindestens über `Alle Prompts` erreichbar sein; wenn Tags passen, zusätzlich in passenden Kategorien.
- Erstellung, Bearbeitung, Löschen, Kopieren und Persistenz bleiben unverändert funktionsfähig.

### 4. Praxis/Feldpraxis nach Themen gliedern

Der Praxisbereich soll zuerst Themenauswahl anzeigen.

Vorgeschlagene Themen:

- `Leistungsbereich`
- `Markt und Integration`
- `Eingangszone und Service`
- `Teamleitung`
- `Schreiben und Kommunikation`

Verhalten:

- Beim Öffnen von `Praxis` erscheinen noch keine Praxisbeispiel-Kacheln.
- Nach Auswahl eines Themas erscheinen passende Praxisbeispiele.
- Das vorhandene Eingabefeld für eigene fiktive Fälle bleibt vorhanden und funktionsfähig.
- Die Beispiele können durch zusätzliche Kategorie-Metadaten in `src/data/content.ts` gruppiert werden.
- Bestehende Inhalte dürfen erweitert werden, damit jede Kategorie sinnvoll gefüllt ist.

### 5. Dunkles Theme: aktive farbige Navigation lesbar machen

Nur für `data-theme="dark"`:

- Aktive Desktop-Navigation (`.desktop-nav-item.active`) soll bei farbigem Hintergrund weiße Schrift/Icon-Farbe haben.
- Aktive Bottom-Navigation (`.nav-tab.active`) soll ebenfalls weiße Schrift/Icon-Farbe bekommen, falls sie farbig hinterlegt oder durch Akzentfläche schlecht lesbar ist.
- Betroffene Farbtemplates: `blau`, `gruen`, `rot`.
- Hell-Theme soll nicht verändert werden.

## Dateien im Scope

Claude Code darf ändern:

- `src/App.tsx`
- `src/data/content.ts`
- `src/data/prompts.ts` nur falls Kategorien für Built-ins dort sauberer liegen
- `src/styles.css`
- `tests/smoke.spec.ts`
- Unit-Tests unter `src/**/*.test.ts`, falls Daten-/Helperlogik ausgelagert wird
- `notes/test-log.md`

## Dateien vermeiden

Nicht ändern, außer ein direkter Buildfehler zwingt dazu:

- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `playwright.config.ts`
- `.github/**`
- `public/**`

Keine neuen npm-Pakete ohne Svens ausdrückliche Zustimmung.

## Akzeptanzkriterien

- Ein Onboarding mit niedrigem Score zeigt in Lernen/Mythos andere Fragen als ein Onboarding mit hohem Score.
- `KI-Grundlagen für alle` und `Mythos oder Realität?` nutzen das gespeicherte `profile.aiLevel`.
- Die Tabs `Lernen`, `Praxis`, `Prüfen` und `Prompts` haben einen Button `Übersicht`, der zur Home-Übersicht führt.
- Prompt-Bibliothek zeigt beim Öffnen noch keine Prompt-Kacheln, sondern verlangt erst eine Kategorieauswahl.
- Nach Prompt-Kategorieauswahl erscheinen passende Kacheln; Suche filtert weiter.
- Praxis zeigt beim Öffnen noch keine Praxisbeispiel-Kacheln, sondern verlangt erst eine Themenauswahl.
- Nach Praxisthemenauswahl erscheinen passende Praxisbeispiele.
- Praxis-Eingabefeld und Prüfen-Eingabefeld funktionieren weiter.
- In dunklem Theme mit `rot`, `gruen` und `blau` sind aktive Navigationslabels weiß und gut lesbar.
- Bestehende Features bleiben funktionsfähig: Onboarding, Home, Lernmodule, BAKIRA, Promptgenerator, Prompt-Erstellung/-Bearbeitung/-Löschen, Settings, Reset.

## Tests

Tests zuerst anpassen/ergänzen, dann implementieren.

Neue oder angepasste E2E-Erwartungen:

- `einsteiger`-Onboarding und `fortgeschritten`-Onboarding zeigen unterschiedliche Mythos-Fragen.
- Lernen enthält einen `Übersicht`-Button, der zur Home-Übersicht zurückführt.
- Praxis enthält einen `Übersicht`-Button, Themenauswahl und zunächst keine `.praxis-example-card`.
- Nach Auswahl eines Praxisthemas ist mindestens eine `.praxis-example-card` sichtbar.
- Prüfen enthält einen `Übersicht`-Button und der bestehende Prüfweg-Test bleibt grün.
- Prompts enthält einen `Übersicht`-Button, Kategorieauswahl und zunächst keine `.prompt-card`.
- Nach Auswahl einer Prompt-Kategorie sind passende `.prompt-card` sichtbar.
- Prompt-Suche funktioniert innerhalb der gewählten Kategorie.
- Dark+rot, dark+gruen und dark+blau: aktive Desktop-Navigation hat weiße Schrift.

Danach ausführen:

```powershell
npm test
npm run build
npm audit --audit-level=moderate
npm run test:e2e
git status --short
```

`notes/test-log.md` knapp aktualisieren: geänderte Dateien, Kommandos mit Exitcodes, offene Risiken, Review-Fokus.

## Nicht tun

- Keine echte KI/API anbinden.
- Keine echten Kundendaten oder realen Fallbeispiele einbauen.
- Keine Navigation neu erfinden.
- Keine neue Persistenzmigration erzwingen, wenn nicht unbedingt nötig.
- Keine unrelated Refactors an App-Shell, Settings, BAKIRA oder Build-Konfiguration.
