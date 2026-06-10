# Handoff: Lernbereich-Auswahl und KI-Level-Fragen umbauen

Date: 2026-06-10
From: Codex
To: Claude Code
App: `jobcenter-prototype/`

## Anlass

Sven wuenscht eine gezielte UX-Aenderung im Tab `Lernen`. Es geht nicht um neue Inhalte, sondern um die sichtbare Struktur:

- Der Einstieg `KI-Grundlagen fuer alle` soll in `Dein Lernbereich` umbenannt werden.
- Die KI-Level-Fragen sollen erst nach einem weiteren Klick erscheinen.
- Der darunter stehende Modulbereich `KI-Grundlagen fuer alle` soll komplett entfernt werden.
- Der Bereich `Dein Bereich: <Abteilung>` soll darunter bestehen bleiben.

Bitte die bestehende App-Struktur respektieren und keine neuen Packages einfuehren.

## Vor Start Pruefen

1. `git status --short` pruefen und keine fremden Aenderungen zuruecksetzen.
2. Projektregeln/Memory beachten:
   - Antwort an Sven auf Deutsch.
   - Bei Dev-Server/Ports zuerst `C:\Users\Administrator\.agent-memory\Port-Regel.md` lesen.
3. Relevante Dateien zuerst lesen:
   - `src/App.tsx`
   - `src/lib/progress.ts`
   - `tests/smoke.spec.ts`
   - `src/styles.css`, falls neue/angepasste Klassen noetig sind
   - `notes/test-log.md`

## Aktueller Ist-Stand

In `src/App.tsx` gibt es im Tab `Lernen` aktuell die Startauswahl mit drei Karten:

- `KI-Grundlagen fuer alle`
- `Mythos oder Realitaet?`
- `Praxisfallbeispiele`

Beim Klick auf `KI-Grundlagen fuer alle` wird `activeArea === "modules"` geoeffnet. Diese Ansicht zeigt derzeit:

1. Zurueck-Button `Zurueck zum Lernbereich`
2. Block `Lernfragen fuer dein Level`
3. `LevelBadge` mit Text `Angepasst an dein KI-Level: <Level>`
4. Multiple-Choice-Lernfragen aus `basicsQuestionsByLevel[aiLevel]`
5. Danach zwei Modulbereiche aus `getLearningPathSections(...)`:
   - `KI-Grundlagen fuer alle`
   - `Dein Bereich: <Abteilung>`

Der zweite Punkt ist der von Sven gemeinte Klickbereich `Angepasst an dein KI-Level:`. Dieser soll als Auswahlfeld wirken: Erst beim Klick darauf sollen die Lernfragen sichtbar werden.

## Gewuenschtes Verhalten

### 1. Startauswahl im Tab `Lernen`

Die erste Karte in der Lern-Startauswahl umbenennen:

- Alt: `KI-Grundlagen fuer alle`
- Neu: `Dein Lernbereich`

Auch die Accessibility-Beschriftung anpassen:

- z. B. `aria-label="Dein Lernbereich oeffnen"`

Die Beschreibung kann sinngemaess bleiben, sollte aber nicht mehr so wirken, als sei der Bereich nur allgemeine KI-Grundlagen. Vorschlag:

> Starte mit Fragen passend zu deinem KI-Level und deinem Arbeitsbereich.

Die anderen zwei Karten bleiben:

- `Mythos oder Realitaet?`
- `Praxisfallbeispiele`

### 2. Ansicht nach Klick auf `Dein Lernbereich`

Nach Klick auf `Dein Lernbereich` soll nicht sofort die ganze Fragenliste erscheinen.

Stattdessen soll oben in der Ansicht ein klickbares Auswahlfeld/Karte erscheinen:

- Titel/Text: `Angepasst an dein KI-Level: <Level>`
- Es soll als Button/Karte erkennbar sein.
- Erst wenn man darauf klickt, werden die Lernfragen aus `basicsQuestionsByLevel[aiLevel]` sichtbar.

Moegliche Umsetzung:

- In `LernpfadScreen` einen lokalen State einfuehren, z. B. `const [showLevelQuestions, setShowLevelQuestions] = useState(false);`
- Beim Oeffnen/Wechsel in `activeArea === "modules"` initial `false`.
- Das bisherige `LevelBadge` entweder durch einen Button ersetzen oder in eine klickbare Karte integrieren.
- Die `.basics-quiz`-Liste nur rendern, wenn `showLevelQuestions === true`.

Wichtig: Die Fragen sollen nach dem Klick weiterhin wie bisher funktionieren:

- Antwortoptionen klickbar
- Feedback sichtbar
- Level-adaptiv fuer `einsteiger`, `grundkenntnisse`, `fortgeschritten`

### 3. Bereich `KI-Grundlagen fuer alle` darunter entfernen

In der `modules`-Ansicht wird aktuell `sectionData = [sections.general, sections.roleSpecific]` gerendert.

Der dortige Bereich `sections.general` mit Titel `KI-Grundlagen fuer alle` soll in dieser Ansicht komplett weg.

Erwartung nach der Aenderung:

- Keine zweite Ueberschrift/Section `KI-Grundlagen fuer alle` unter den Lernfragen.
- Der Bereich `Dein Bereich: <Abteilung>` bleibt sichtbar und funktioniert wie vorher.
- Die dazugehoerigen Modulbuttons bleiben klickbar und fuehren wie bisher in die Moduldetailseite.

Moegliche Umsetzung:

- In `LernpfadScreen` statt `sectionData = [sections.general, sections.roleSpecific]` nur `sections.roleSpecific` rendern.
- Alternativ den allgemeinen Abschnitt explizit herausfiltern.

Bitte pruefen, ob `src/lib/progress.ts` unveraendert bleiben kann. Wenn andere Tests oder Home-Logik `getLearningPathSections().general.title` erwarten, nicht global entfernen, sondern nur im Lernen-UI nicht mehr rendern.

### 4. Tests aktualisieren

Bestehende Tests in `tests/smoke.spec.ts` referenzieren mehrfach:

- `KI-Grundlagen fuer alle oeffnen`
- Heading `KI-Grundlagen fuer alle`
- Sichtbarkeit von `Lernfragen fuer dein Level` direkt nach dem Oeffnen
- Sichtbarkeit der allgemeinen Modulsection `KI-Grundlagen fuer alle`

Diese Tests muessen auf das neue Verhalten angepasst werden.

Mindestens abdecken:

1. `Lernen`-Startauswahl zeigt `Dein Lernbereich` statt `KI-Grundlagen fuer alle`.
2. Klick auf `Dein Lernbereich` oeffnet die Lernbereich-Detailansicht.
3. `Angepasst an dein KI-Level: <Level>` ist als Button/Karte sichtbar.
4. Vor Klick auf diese KI-Level-Karte sind keine `.basics-card`-Fragen sichtbar.
5. Nach Klick auf diese KI-Level-Karte sind die passenden `.basics-card`-Fragen sichtbar.
6. Die Section `KI-Grundlagen fuer alle` unterhalb der Fragen ist nicht mehr sichtbar.
7. `Dein Bereich: <Abteilung>` bleibt sichtbar.
8. Ein Modul aus `Dein Bereich` kann weiterhin geoeffnet werden.

## Manuelle Sichtpruefung

Nach Umsetzung bitte mit frischem App-Zustand pruefen:

1. Onboarding abschliessen.
2. Tab `Lernen` oeffnen.
3. Erste Karte heisst `Dein Lernbereich`.
4. Karte anklicken.
5. Es erscheint ein klickbares Feld `Angepasst an dein KI-Level: <Level>`.
6. Erst nach Klick darauf erscheinen die Lernfragen.
7. Der alte darunterliegende Bereich `KI-Grundlagen fuer alle` ist weg.
8. `Dein Bereich: <Abteilung>` steht weiter darunter und die Module lassen sich oeffnen.

## Verifikation

Bitte aus `jobcenter-prototype/` ausfuehren:

```powershell
npm test
npm run build
npm run test:e2e
```

Falls der Dev-Server fuer E2E/Browserpruefung manuell gestartet wird: vorher `C:\Users\Administrator\.agent-memory\Port-Regel.md` lesen.

## Dokumentation nach Abschluss

Nach erfolgreicher Umsetzung:

- `notes/test-log.md` mit kurzem Eintrag aktualisieren.
- Falls wiederverwendbares Wissen entsteht, `.agent-memory/working-memory.md` aktualisieren.
- Sven knapp auf Deutsch melden:
  - was geaendert wurde,
  - welche Tests gelaufen sind,
  - ob Deployment/Push noch offen ist.
