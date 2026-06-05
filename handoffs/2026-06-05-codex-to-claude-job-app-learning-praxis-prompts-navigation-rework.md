# Handoff: Lern-, Praxis- und Prompt-Navigation bereinigen

Date: 2026-06-05  
From: Codex  
To: Claude Code  
App: `jobcenter-prototype/`

## Anlass

Sven meldet mehrere sichtbare UX- und Inhaltskorrekturen in der Jobcenter-Prototyp-App. Ziel ist kein Architekturumbau, sondern ein klar sichtbarer Rework der Bereiche `Lernen`, `Praxis`, `Prompts` und `BAKIRA`.

Bitte Svens Begriffe ernst nehmen: Es geht vor allem darum, dass Nutzende beim Öffnen eines Hauptbereichs zuerst eine Auswahl sehen und erst danach auf Detailseiten/Inhalte wechseln.

## Vor Start Prüfen

1. Projektregeln lesen, insbesondere AGENTS.md-Kontext:
   - Immer auf Deutsch antworten.
   - Bei Dev-Server/Ports zuerst `C:\Users\Administrator\.agent-memory\Port-Regel.md` prüfen.
2. `git status --short` prüfen und keine fremden Änderungen zurücksetzen.
3. Relevante Dateien zuerst lesen:
   - `src/App.tsx`
   - `src/data/content.ts`
   - `src/data/prompts.ts`
   - `src/styles.css`
   - `tests/smoke.spec.ts`
4. Bestehende Tests laufen lassen, bevor Verhalten geändert wird:
   - `npm test`
   - später zusätzlich `npm run build`
   - E2E/visuelle Prüfung mit frischem Browserzustand.

## Scope

Wahrscheinlich relevant:

- `src/App.tsx`
- `src/data/content.ts`
- `src/data/prompts.ts`, falls Prompt-Kategorien/Inhalte angepasst werden müssen
- `src/styles.css`
- `tests/smoke.spec.ts`
- `notes/test-log.md`

Keine neuen Packages einführen.

## Gewünschtes Verhalten

### 1. `KI-Grundlagen für alle`: keine Mythos-/Realität-Fragen mehr

Im Lernbereich gibt es bereits einen eigenen Bereich `Mythos oder Realität?`. Deshalb dürfen im Bereich `KI-Grundlagen für alle` keine Mythos-/Realität-Fragen oder gleichartigen Aussagen mehr auftauchen.

Stattdessen soll `KI-Grundlagen für alle` echte Grundlagenfragen enthalten, angepasst an das erkannte KI-Level:

- `einsteiger`: leichte Grundbegriffe und sichere Einstiegsregeln.
- `grundkenntnisse`: mittleres Niveau, z. B. Prüfschritte, gute Aufgabenformulierung, Grenzen von KI-Antworten.
- `fortgeschritten`: schwere Themen, z. B. Datenschutz/Governance, Verantwortungsgrenzen, Anbieterzusagen, Prozessstandards.

Wichtig:

- Fortgeschrittene dürfen keine Anfängerfragen bekommen.
- Anfänger dürfen nicht mit schweren Governance-Fragen starten.
- Die abteilungsspezifischen Fragen/Inhalte können unverändert bleiben.
- Vermutlich relevant: `basicsQuestionsByLevel` und `mythQuestionsByLevel` in `src/data/content.ts`.

### 2. Lernbereich beim Sidebar-Klick immer auf Startauswahl zurücksetzen

Aktuelles Problem: Wenn man in der Seitenleiste z. B. `Prüfen` anklickt und danach wieder `Lernen`, bleibt im Lernbereich die vorher geöffnete Unterseite aktiv. Stattdessen muss beim Klick auf den Sidebar-Reiter `Lernen` immer zuerst die Startauswahl mit den drei Auswahlfeldern erscheinen:

- `KI-Grundlagen für alle`
- `Mythos oder Realität?`
- `Praxisfallbeispiele`

Technischer Hinweis:

- Es gibt in `src/App.tsx` aktuell State rund um `LearningArea`/`lernenReturnArea`.
- Beim Tab-Wechsel auf `lernen` muss der interne Lern-Unterbereich auf `overview` zurückgesetzt werden.
- Bitte prüfen, ob Desktop-Sidebar und mobile Navigation denselben Tab-Handler nutzen. Falls nicht, beide abdecken.

### 3. Lern-Unterseiten: Zurück-Text ändern

In den Lern-Unterseiten soll die Zurück-Schaltfläche nicht mehr `Zurück zur Übersicht` heißen, sondern `Zurück zum Lernbereich`.

Betroffene Unterbereiche:

- `KI-Grundlagen für alle`
- `Mythos oder Realität?`
- `Praxisfallbeispiele`

Auch `aria-label` entsprechend anpassen.

### 4. Praxis-Auswahlfelder öffnen eigene Themenseiten

Im Bereich `Praxis` soll ein Klick auf ein Auswahlfeld nicht nur inline Inhalte darunter anzeigen. Stattdessen soll sich eine eigene Seite/Detailansicht mit den passenden Themeninhalten öffnen, analog zum Verhalten im Lernbereich.

Erwartetes Verhalten:

- Beim Öffnen von `Praxis`: Startansicht mit Auswahlfeldern.
- Klick auf ein Thema: Detailseite mit den entsprechenden Praxisinhalten.
- Oben auf der Detailseite: Schaltfläche `Zurück zum Praxisbereich`.
- Klick auf diese Schaltfläche führt zurück zur Praxis-Startauswahl.

Bestehende abteilungsspezifische Praxisinhalte können bleiben.

Mindestthemen laut aktueller Struktur vermutlich:

- `Leistungsbereich`
- `Markt und Integration`
- `Eingangszone und Service`
- `Teamleitung`
- `Schreiben und Kommunikation`

Relevante Stellen:

- `PraxisScreen` in `src/App.tsx`
- `praxisTopics`, `praxisExamples` in `src/data/content.ts`

### 5. Prompt-Bibliothek-Auswahlfelder öffnen eigene Themenseiten

Im Bereich `Prompts` soll dasselbe Muster gelten:

- In der Prompt-Bibliothek zuerst Auswahlfelder/Bereiche anzeigen.
- Klick auf einen Bereich öffnet eine eigene Detailseite mit passenden Prompts.
- Oben auf der Detailseite: Schaltfläche `Zurück zur Prompt-Bibliothek`.
- Klick führt zurück zur Prompt-Bibliotheks-Auswahl.

Wichtig:

- Promptgenerator darf weiter funktionieren.
- Eigene Prompts dürfen nicht verschwinden.
- Suche/Bearbeiten/Kopieren/Löschen müssen weiter funktionieren.
- Falls es bereits eine Kategorieauswahl gibt, diese nicht nur inline filtern lassen, sondern als eigene Detailansicht mit Backbutton modellieren.

Relevante Stellen:

- `PromptWorkspaceScreen` in `src/App.tsx`
- `builtinPrompts` in `src/data/prompts.ts`

### 6. BAKIRA-Übersichtsschaltfläche angleichen

Im Bereich `BAKIRA` soll die Schaltfläche `Übersicht` optisch/inhaltlich den anderen Bereichen angepasst werden.

Konkrete Änderung:

- Das `<`/Chevron-Zeichen durch das Haus-Symbol ersetzen.
- Lucide-Icon `House` ist bereits in `src/App.tsx` importiert.
- Text bleibt `Übersicht`.

Relevante Stelle:

- `BakiraWorkspaceScreen` in `src/App.tsx`.

## QA / Akzeptanzkriterien

Bitte mit frischem Browserzustand prüfen:

1. Onboarding als Einsteiger durchlaufen:
   - `Lernen` öffnen.
   - Startauswahl mit drei Karten ist sichtbar.
   - `KI-Grundlagen für alle` öffnen: leichte Grundlagenfragen, keine Mythos-/Realität-Fragen.
   - Backbutton heißt `Zurück zum Lernbereich`.
2. Onboarding/State zurücksetzen oder High-Score herstellen:
   - Als Fortgeschrittener `KI-Grundlagen für alle` öffnen.
   - Fragen sind sichtbar anspruchsvoller als bei Einsteigern.
3. `Lernen -> Mythos oder Realität?`:
   - Mythos-/Realität-Fragen bleiben dort erhalten.
   - Backbutton heißt `Zurück zum Lernbereich`.
4. Sidebar-Verhalten:
   - `Lernen` öffnen, Unterseite auswählen.
   - In Sidebar auf `Prüfen` wechseln.
   - Danach Sidebar `Lernen` klicken.
   - Erwartung: wieder die drei Lern-Auswahlfelder, nicht die vorherige Unterseite.
5. `Praxis`:
   - Startansicht zeigt Themenauswahl.
   - Klick auf ein Thema öffnet Detailseite.
   - Detailseite hat `Zurück zum Praxisbereich`.
6. `Prompts`:
   - Prompt-Bibliothek zeigt Auswahlfelder.
   - Klick auf Bereich öffnet Detailseite mit passenden Prompts.
   - Detailseite hat `Zurück zur Prompt-Bibliothek`.
7. `BAKIRA`:
   - `Übersicht`-Button nutzt Haus-Symbol, nicht Chevron/`<`.

## Tests

Bitte Tests anpassen oder ergänzen, sodass mindestens abgesichert ist:

- Levelabhängige Grundlagenfragen unterscheiden sich zwischen `einsteiger` und `fortgeschritten`.
- `KI-Grundlagen für alle` enthält keine Mythos-/Realität-Fragetexte.
- Sidebar-Klick auf `Lernen` setzt auf Lern-Overview zurück.
- Praxis- und Prompt-Kategorieauswahl öffnen Detailansichten mit passenden Zurück-Buttons.

Am Ende ausführen:

```powershell
npm test
npm run build
```

Wenn E2E verfügbar/stabil:

```powershell
npm run test:e2e
```

Bitte Ergebnis und ggf. visuelle Prüfnotizen in `notes/test-log.md` ergänzen.
