# Handoff: JOB-APP-18 — Sichtbarer Rework zu adaptiven Lernfragen, Übersicht, Kategorien und Dark-Nav

Date: 2026-06-03  
From: Codex  
To: Claude Code  
App: `jobcenter-prototype/`

## Anlass

Sven meldet, dass die folgenden gewünschten Änderungen in der sichtbaren App nicht umgesetzt wirken:

- In `KI-Grundlagen für alle` und `Mythos oder Realität?` erscheinen weiterhin dieselben sehr einfachen Fragen, unabhängig davon, ob das Onboarding `einsteiger` oder `fortgeschritten` ergibt.
- In den Bereichen `Lernen`, `Praxis`, `Prüfen` und `Prompts` fehlt ein sichtbarer Button `Übersicht`, wie er im BAKIRA-Bereich vorhanden ist.
- Die Prompt-Bibliothek ist nicht sichtbar in Bereiche gegliedert; Prompt-Kacheln sollen erst nach einer Bereichsauswahl erscheinen.
- Feldpraxis/Praxis ist nicht sichtbar in Themen gegliedert; Praxisbeispiele sollen erst nach einer Themenauswahl erscheinen.
- Im dunklen Theme mit Farbtemplate `rot`, `gruen` oder `blau` ist die Schrift in farbig hinterlegten Navigationsfeldern schlecht lesbar; dort soll die Schrift weiß sein. Diese Änderung darf nur im dunklen Theme greifen.

Wichtig: Behandle Svens Rückmeldung als maßgeblich. Nicht nur Tests grün machen. Bitte die tatsächlich gerenderte App mit frischem Dev-Server und leerem/localStorage-bereinigtem Browserzustand prüfen.

## Vor Start Prüfen

1. Lies `AGENTS.md`/Projektregeln, falls vorhanden.
2. Prüfe `git status --short`.
3. JOB-APP-17/Vitest-4-Upgrade ist der erwartete Basiszustand:
   - `package.json` soll `devDependencies.vitest: ^4.1.8` enthalten.
   - `npm ls vitest` soll `vitest@4.1.8` oder höher zeigen.
   - `npm audit --audit-level=moderate` soll nicht mehr wegen `GHSA-5xrq-8626-4rwp` scheitern.
   - Diese Dependency-Änderung ist nicht Teil dieses Reworks. Nicht zurücksetzen, nicht downgraden und nicht inhaltlich mit JOB-APP-18 vermischen.
4. Prüfe, ob JOB-APP-16-Code wirklich im aktuellen Arbeitsstand enthalten ist. Falls nicht, implementiere die unten beschriebenen Punkte direkt im aktuellen Stand.
5. Starte die App frisch, nicht auf einen alten Dev-Server vertrauen:
   - Wenn ein alter `vite`/`npm run dev` Prozess läuft, beenden oder einen anderen freien Port nach Port-Regel nutzen.
   - Browser hart neu laden.
   - `localStorage` für die App löschen, damit Onboarding-Level neu geprüft werden kann.

## Scope

Erlaubt für diesen Rework:

- `src/App.tsx`
- `src/data/content.ts`
- `src/data/prompts.ts`, falls eine saubere Prompt-Kategorisierung dort besser liegt
- `src/styles.css`
- `tests/smoke.spec.ts`
- `notes/test-log.md`

Nicht anfassen:

- `package.json`
- `package-lock.json`
- `.github/**`
- `public/**`
- Build-/Vite-/Playwright-Konfiguration

Keine neuen Packages.

## Gewünschtes Sichtbares Verhalten

### 1. Onboarding-Level muss Inhalte sichtbar verändern

Nach Onboarding mit niedrigen Antworten (`1` oder `2`) soll die App als Anfänger/Einsteiger wirken.

Nach Onboarding mit hohen Antworten (`4`) soll die App als Fortgeschritten wirken.

Sichtbar zu prüfen in `Lernen`:

- `KI-Grundlagen für alle`
- `Mythos oder Realität?`

Anforderung:

- Beide Bereiche müssen je Level andere Fragen/Aussagen und andere Antwortmöglichkeiten oder Auswahlfälle zeigen.
- Nicht nur ein unsichtbarer Datensatz oder anderer Testtext: Die tatsächlich sichtbaren Karten/Quizfragen müssen sich klar unterscheiden.
- Die Fortgeschrittenen-Fragen dürfen nicht wie einfache Einsteigerfragen formuliert sein.

Konkrete Inhaltserwartung:

- `einsteiger`: Begriffe und Grundregeln, z. B. KI als Vorschlag, keine echten Kundendaten, Mensch prüft.
- `grundkenntnisse`: Anwendungssicherheit, Prüfschritte, Datenumfang, Prompt-Qualität.
- `fortgeschritten`: Datenschutz-/Governance-Fragen, Grenzen von Anbieterzusagen, fachliche Verantwortung, Team-/Prozessstandards.

Technischer Hinweis:

- Verwende `profile.aiLevel` aus dem gespeicherten App-State als Quelle.
- Wenn `LernpfadScreen` ein eigenes Untermenü hat, muss das Level dort als Prop ankommen.
- Falls Antwort-State indexbasiert ist, darf ein neues Onboarding/Reset nicht alte Antworten mit falschen Fragen mischen.

### 2. Button `Übersicht` in allen Hauptbereichen

In diesen Tabs muss oben oder gut sichtbar ein Button `Übersicht` stehen:

- `Lernen`
- `Praxis`
- `Prüfen`
- `Prompts`

Verhalten:

- Klick führt zur Home-Übersicht (`tab = "home"`).
- Button darf wie BAKIRA-Backbutton aussehen, aber Text muss sichtbar `Übersicht` sein.
- In `Lernen` reicht der Button nicht nur in Unterseiten; er muss auch auf der Lernen-Startansicht sichtbar sein.
- In `Prompts` muss der Button auf der Bibliotheks-/Generator-Hauptansicht sichtbar sein.

Nicht verwechseln:

- Der vorhandene `Zurück zur Übersicht` innerhalb des Lern-Unterbereichs ist nicht ausreichend für die Hauptanforderung.
- Der Desktop-Sidebar-Eintrag `Übersicht` zählt nicht als dieser Button.

### 3. Prompt-Bibliothek muss echte Bereichsauswahl haben

Beim Öffnen des Tabs `Prompts`:

- Der Promptgenerator darf sichtbar bleiben.
- Die Prompt-Bibliothek darf noch keine Prompt-Kacheln anzeigen.
- Stattdessen muss eine klare Auswahl erscheinen, z. B. Dropdown, Select, Segment-Buttons oder Auswahlfeld.

Erst nach Auswahl eines Bereichs:

- Prompt-Kacheln werden angezeigt.
- Die Kacheln passen zum Bereich.
- Suche filtert innerhalb des gewählten Bereichs.

Mindestbereiche:

- `Alle Prompts`
- `Schreiben und Umformulieren`
- `Prüfen und Qualität`
- `Datenschutz und Sicherheit`
- `Lernen und Erklären`
- `Prompting und Struktur`
- `Teamleitung`

Wichtig:

- Eigene Prompts müssen weiterhin über `Alle Prompts` erreichbar sein.
- Prompt erstellen, bearbeiten, löschen, kopieren und nach Reload wiederfinden muss weiter funktionieren.
- Wenn ein eigener Prompt keine passenden Tags hat, nicht aus der App verschwinden lassen.

### 4. Praxis/Feldpraxis muss echte Themenauswahl haben

Beim Öffnen des Tabs `Praxis`:

- Das Eingabefeld für eigene fiktive Fälle darf sichtbar bleiben.
- Praxisbeispiel-Kacheln dürfen noch nicht sichtbar sein.
- Eine klare Themenauswahl muss sichtbar sein.

Erst nach Themenauswahl:

- Passende Praxisbeispiel-Kacheln erscheinen.

Mindestthemen:

- `Leistungsbereich`
- `Markt und Integration`
- `Eingangszone und Service`
- `Teamleitung`
- `Schreiben und Kommunikation`

Wichtig:

- Jedes Thema braucht mindestens ein passendes fiktives Beispiel.
- Keine echten Kundendaten.
- Praxis-Eingabefeld und lokale Antwortlogik müssen weiter funktionieren.

### 5. Dunkles Theme: Navigation lesbar machen

Nur wenn `data-theme="dark"`:

- Aktive farbig hinterlegte Navigationseinträge in der Seitenleiste müssen weiße Schrift und weiße Icons haben.
- Gilt für Farbtemplate:
  - `rot`
  - `gruen`
  - `blau`

Hell-Theme:

- Nicht verändern.
- Keine weißen Labels auf hellem Hintergrund erzwingen.

Zu prüfen:

- Einstellungen öffnen.
- Darstellung: `Dunkel`.
- Farbtemplate: `Rot`, dann `Grün`, dann `Blau`.
- Nacheinander Sidebar-Einträge `Übersicht`, `Lernen`, `Praxis`, `Prüfen`, `Prompts` aktivieren.
- Aktiver Eintrag: Hintergrund farbig, Text/Icon weiß und gut lesbar.

## Visuelle QA ist Pflicht

Bitte nicht nur E2E-Tests verwenden. Zusätzlich manuell/mit Playwright prüfen:

1. Frischer Start mit leerem `localStorage`.
2. Onboarding Low-Score durchlaufen.
3. Screenshot oder klare Testlog-Notiz:
   - `Lernen -> KI-Grundlagen für alle`: sichtbare Einsteigerfrage.
   - `Lernen -> Mythos oder Realität?`: sichtbare Einsteigerfrage.
4. App zurücksetzen oder `localStorage` löschen.
5. Onboarding High-Score durchlaufen.
6. Screenshot oder klare Testlog-Notiz:
   - `Lernen -> KI-Grundlagen für alle`: sichtbare Fortgeschrittenenfrage.
   - `Lernen -> Mythos oder Realität?`: sichtbare Fortgeschrittenenfrage.
7. Prüfen:
   - `Praxis`: initial keine Beispielkarten, nach Themenauswahl Karten sichtbar.
   - `Prompts`: initial keine Promptkarten, nach Bereichsauswahl Karten sichtbar.
   - `Übersicht`-Button funktioniert in Lernen/Praxis/Prüfen/Prompts.
   - Dunkel + Rot/Grün/Blau aktive Sidebar: Schrift weiß.

Wenn die App im Browser weiterhin alt aussieht, prüfe zuerst:

- Läuft ein alter Dev-Server?
- Wird die richtige Arbeitskopie geöffnet?
- Ist `dist`/Preview alt?
- Wurde der Browser hart neu geladen?
- Ist `localStorage` noch mit altem State gefüllt?

## Tests

Bitte Tests so schreiben/anpassen, dass sie die Nutzeranforderung absichern, nicht nur Implementierungsdetails.

Erwartete E2E-Tests:

- Low-Score und High-Score Onboarding zeigen sichtbar unterschiedliche Fragen in `KI-Grundlagen für alle`.
- Low-Score und High-Score Onboarding zeigen sichtbar unterschiedliche Fragen in `Mythos oder Realität?`.
- `Lernen`, `Praxis`, `Prüfen`, `Prompts` haben jeweils einen sichtbaren Button `Übersicht`, der Home öffnet.
- `Prompts`: initial keine `.prompt-card`, nach Auswahl `Alle Prompts` oder einer Kategorie mindestens eine `.prompt-card`.
- `Prompts`: Suche filtert innerhalb der Kategorie.
- `Praxis`: initial keine `.praxis-example-card`, nach Themenauswahl mindestens eine `.praxis-example-card`.
- `Praxis`: Eingabefeld erzeugt weiterhin Antwort.
- `Prüfen`: Prüfweg funktioniert weiterhin.
- Dark+rot, dark+gruen, dark+blau: aktiver Desktop-Nav-Eintrag hat `color: rgb(255, 255, 255)`.

Zusätzlich:

- Unit-Tests nur ergänzen, wenn neue Helper/Mapper entstehen.
- Bestehende Tests nicht abschwächen. Wenn ein Test angepasst wird, muss er weiterhin Nutzerverhalten prüfen.

## Commands To Run

```powershell
npm test
npm run build
npm run test:e2e
npm audit --audit-level=moderate
git diff --check
git status --short
```

Erwartung nach JOB-APP-17: `npm audit --audit-level=moderate` soll exit 0 liefern. Wenn Audit trotzdem rot ist, nicht als bekannte Vitest-Ausnahme abtun, sondern die konkrete neue/verbleibende Meldung im Testlog dokumentieren und Codex/Sven zur Scope-Entscheidung nennen.

## Testlog

Bitte `notes/test-log.md` ergänzen:

- Geänderte Dateien.
- Bestätigen, dass JOB-APP-17-Basis intakt ist (`npm ls vitest`, `npm audit`).
- Welche Punkte von Svens Rückmeldung sichtbar geprüft wurden.
- Commands mit Exitcodes.
- Ob ein alter Dev-Server/localStorage/Preview als Ursache ausgeschlossen wurde.
- Offene Risiken.
- Review-Fokus für Codex.

## Akzeptanzkriterien

Dieser Rework gilt erst als fertig, wenn alle folgenden Punkte sichtbar in der laufenden App stimmen:

- Anfänger und Fortgeschrittene sehen in `KI-Grundlagen für alle` unterschiedliche Fragen.
- Anfänger und Fortgeschrittene sehen in `Mythos oder Realität?` unterschiedliche Fragen.
- Die Fortgeschrittenenfragen sind erkennbar anspruchsvoller.
- `Übersicht`-Button ist in `Lernen`, `Praxis`, `Prüfen`, `Prompts` sichtbar und funktioniert.
- Prompt-Kacheln erscheinen erst nach Bereichsauswahl.
- Praxisbeispiel-Kacheln erscheinen erst nach Themenauswahl.
- Dunkel + Rot/Grün/Blau: aktive Sidebar-Felder haben weiße Schrift/Icon-Farbe.
- Keine Regression bei Onboarding, Home, BAKIRA, Settings, Reset, Promptgenerator, Prompt-CRUD, Praxis-Eingabe und Prüfen.
