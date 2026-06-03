# Test Log

## 2026-06-03 — Codex Planning: JOB-APP-16

Scope geplant, keine App-Implementierung durch Codex.

Erstellt:

- `features/JOB-APP-16-adaptive-learning-overview-category-filters.md`
- `handoffs/2026-06-03-codex-to-claude-job-app-16-adaptive-learning-overview-category-filters.md`

Nächster Schritt:

- Claude Code implementiert ausschließlich den Handoff-Scope.
- Danach führt Claude die dokumentierten Tests aus und ergänzt diesen Testlog.

## 2026-06-03 — Claude Builder-Log: JOB-APP-16

### Geänderte Dateien

- `src/data/content.ts`
  - Neue Typen `AiLevelKey`, `MythQuestion`, `PraxisTopicId`.
  - `mythQuestionsByLevel`, `basicsQuestionsByLevel`, `practiceCaseByLevel` (Record je Level; `einsteiger` reused bestehende Inhalte → bestehende Tests stabil).
  - `praxisTopics` + `topics`-Metadaten an allen `praxisExamples`; 5 zusätzliche fiktive Beispiele, damit jedes Thema gefüllt ist.
- `src/App.tsx`
  - Neue `OverviewButton`-Komponente (`btn-secondary`, Text „Übersicht“ → `setTab("home")`) in Lernen-Overview, Praxis, Prüfen, Prompts.
  - `LernpfadScreen` erhält `aiLevel` (aus `profile.aiLevel`) und wählt Myth-/Basics-/Praxisfall-Inhalte levelabhängig; neuer levelabhängiger Lernfragen-Block in „KI-Grundlagen für alle“ (gehobener State `basicsAnswers`).
  - `PromptLibrary`: vorgeschaltete Kategorieauswahl (`PROMPT_CATEGORIES`, tag-/department-basiertes Mapping); initial keine `.prompt-card`; Suche filtert innerhalb der Kategorie; eigene/generierte Prompts setzen automatisch „Alle Prompts“, bleiben erstell-/editier-/löschbar.
  - `PraxisScreen`: vorgeschaltete Themenauswahl; initial keine `.praxis-example-card`; Eingabefeld unverändert funktionsfähig.
- `src/styles.css`
  - Dark-Theme: aktive farbige Navigation (`.desktop-nav-item.active`, `.nav-tab.active`) erhält weiße Schrift/Icon-Farbe; Hell-Theme unverändert.
  - Styles für `screen-overview-btn`, `praxis-topic-bar/-btn/-hint`, `prompt-category-bar/-btn`.
- `tests/smoke.spec.ts`
  - Bestehende Praxis-/Prompt-Tests an Auswahl-Gating angepasst (Thema bzw. Kategorie vorher wählen; Reset-Tests nutzen `name:"Prompts", exact:true` wegen neuem „Alle Prompts“-Button).
  - Neue Tests: levelabhängige Mythos-/Lernfragen, Übersicht-Buttons (Lernen/Praxis/Prüfen/Prompts), Praxis-/Prompt-Gating, Suche in Kategorie, Dark-Nav-Weiß für rot/gruen/blau (`toHaveCSS` wartet die 0.1s-Transition aus).

### Kommandos

- `npm ci` → exit 0 (145 packages; node_modules fehlte initial).
- `npm run build` (`tsc -b && vite build`) → exit 0, Build erfolgreich.
- `npm test` (`vitest run src`) → exit 0, 46/46 Unit-Tests grün.
- `npm run test:e2e` (`playwright test`) → exit 0, 67/67 E2E-Tests grün.
- `npm audit --audit-level=moderate` → exit 1: 1 kritische Lücke in `vitest` (UI-Server, GHSA-5xrq-8626-4rwp). Vorbestehend, reine DevDependency, kein Bezug zu dieser Änderung; Fix nur via Breaking Change (`vitest@4`) → außerhalb Scope (keine package.json/lock-Änderung ohne Freigabe).
- `git status --short` → nur Scope-Dateien geändert (App.tsx, content.ts, styles.css, smoke.spec.ts) + Codex-Planungsartefakte/notes untracked.

### Offene Risiken / Hinweise

- `vitest`-Audit-Lücke bleibt offen (Freigabe für `vitest@4`-Upgrade nötig).
- Tab-Persistenz nach Re-Onboarding (Tab bleibt „prompts“) ist bestehendes App-Verhalten; nur Test-Selektoren angepasst, keine Verhaltensänderung.
- Antwort-State (`mythAnswers`/`basicsAnswers`) ist nach Index gehalten; Levelwechsel innerhalb einer Session tritt praktisch nur über Re-Onboarding auf (Remount setzt State zurück) → keine Index-Kollision.

### Review-Fokus für Codex

- Scope eingehalten (nur erlaubte Dateien; kein package.json/lock/CI/public/Build-Config).
- Levelabhängigkeit kommt aus `profile.aiLevel` (Prop an `LernpfadScreen`).
- Initialzustände korrekt: keine Prompt-/Praxis-Kacheln vor Auswahl.
- Bestehende Flows (Prompt CRUD/Persistenz, Prüfweg, Praxis-Eingabe, BAKIRA, Settings, Reset) unverändert grün.
- Dark-Theme-Kontrast in Navigation sichtbar verbessert (weiße Schrift auf farbigem Aktiv-Feld).

## 2026-06-03 — Codex Review: JOB-APP-16

Review-Ergebnis: keine Findings.

Geprüft:

- Diff/Scope: App-Codeänderungen nur in `src/App.tsx`, `src/data/content.ts`, `src/styles.css`, `tests/smoke.spec.ts`; Koordinationsdateien unter `features/`, `handoffs/`, `notes/`.
- Handoff-Kriterien: Levelabhängige Lern-/Mythos-Inhalte, Übersicht-Buttons, Prompt-Kategorien, Praxis-Themenauswahl und Dark-Theme-Navigation sind umgesetzt.
- `git diff --check` → exit 0.
- `npm test` → exit 0, 46/46 Tests grün.
- `npm run build` → exit 0, Build erfolgreich.
- `npm run test:e2e` → exit 0, 67/67 Tests grün.
- `npm audit --audit-level=moderate` → exit 1 wegen bekannter kritischer `vitest`-DevDependency-Lücke (`GHSA-5xrq-8626-4rwp`), Fix erfordert Breaking Upgrade auf Vitest 4 und liegt außerhalb JOB-APP-16-Scope.

Offen:

- Entscheidung von Sven, ob ein separater Dependency-Task für Vitest 4 angelegt werden soll.

## 2026-06-03 — Codex Planning: JOB-APP-18 Rework

Sven meldet, dass die JOB-APP-16-Punkte in der sichtbaren App nicht umgesetzt wirken. Codex hat keine App-Codeänderungen vorgenommen, sondern ein ausführliches Rework-Handoff für Claude erstellt:

- `handoffs/2026-06-03-codex-to-claude-job-app-18-visible-rework-adaptive-learning-overview-filters-dark-nav.md`

Schwerpunkt des Handoffs:

- Sichtbare Browser-QA statt nur Tests.
- Frischer Dev-Server, Hard Reload und leerer `localStorage`.
- Low-Score vs. High-Score Onboarding sichtbar vergleichen.
- Prompt-/Praxis-Kacheln dürfen erst nach Auswahl erscheinen.
- Übersicht-Buttons in `Lernen`, `Praxis`, `Prüfen`, `Prompts`.
- Dunkel + Rot/Grün/Blau aktive Sidebar mit weißer Schrift/Icon-Farbe.

Hinweis: Bereits vorhandene JOB-APP-17/Vitest-Dateien und `package.json`/`package-lock.json` sollen von diesem Rework getrennt bleiben.

## 2026-06-03 — Claude Builder-Log: JOB-APP-17 (Vitest-4-Upgrade)

### Geänderte Dateien

- `package.json` — `devDependencies.vitest`: `^3.0.0` → `^4.1.8`.
- `package-lock.json` — durch `npm install` regeneriert (added 2, removed 10, changed 13).
- `features/JOB-APP-17-vitest-4-security-upgrade.md`, `handoffs/2026-06-03-plan-to-claude-job-app-17-vitest-4-security-upgrade.md` — Planungsartefakte.
- Kein App-Code geändert. `vite.config.ts` und `src/**/*.test.ts` mussten NICHT angepasst werden (keine Breaking-Change-Anpassung nötig).

### Kommandos

- `npm install` → exit 0; danach „found 0 vulnerabilities".
- `npm ls vitest` → `vitest@4.1.8`.
- `npm test` (`vitest run src`) → exit 0, 46/46 Unit-Tests grün (Runner v4.1.8).
- `npm run build` → exit 0, Build erfolgreich.
- `npm run test:e2e` → exit 0, 67/67 E2E-Tests grün.
- `npm audit --audit-level=moderate` → exit 0, **0 vulnerabilities** (`GHSA-5xrq-8626-4rwp` geschlossen).

### Offene Risiken / Hinweise

- Keine. Vitest-4-Migration verlief ohne API-/Config-Brüche (Tests nutzen nur Basis-API + jsdom-`localStorage`).
- JOB-APP-18-Rework (sichtbare Browser-QA) bleibt bewusst getrennt; dieser Commit umfasst nur die Vitest-Dependency.

### Review-Fokus für Codex

- Nur Dependency-/Test-Infra-Dateien geändert, kein App-Code.
- `vitest >= 4.1.8` aktiv, Advisory `GHSA-5xrq-8626-4rwp` verschwunden (`npm audit` exit 0).
- Unit/Build/E2E unverändert grün und in Aussagekraft gleich.
- `package-lock.json`: nur erwartete Vitest-/Vite-Test-Abhängigkeiten geändert, keine ungewollten Begleit-Bumps.
