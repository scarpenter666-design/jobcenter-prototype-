# JOB-APP-17 — Vitest-4-Upgrade (Sicherheitslücke GHSA-5xrq-8626-4rwp schließen)

Status: Ready for Claude implementation
Date: 2026-06-03
Owner: Planung auf Svens Wunsch (Claude), Implementierung Claude Code, Review Codex

## Ziel

`npm audit --audit-level=moderate` meldet eine kritische Lücke in der DevDependency `vitest`:

- Advisory: `GHSA-5xrq-8626-4rwp`
- Wirkung: Wenn der Vitest-UI-/API-Server lauscht, kann eine bösartige Webseite über eine fehlende Origin-Prüfung beliebige Dateien lesen und Code ausführen (arbitrary file read + code execution).
- Betroffen: `vitest < 4.1.0`. Installiert ist aktuell `vitest@3.2.4`.
- Fix: Upgrade auf `vitest@^4.1.8` (erste 4.x-Linie mit Patch).

Diese Lücke betrifft nur die lokale Entwicklungs-/Testumgebung, nicht die ausgelieferte App (Vitest landet nicht im `vite build` und nicht im Deployment). Sie soll dennoch sauber geschlossen werden.

## Aktueller Zustand

- `package.json`: `devDependencies.vitest: "^3.0.0"` (installiert: 3.2.4).
- Test-Runner-Config liegt in `vite.config.ts` unter `test: { environment: "jsdom" }`.
- Unit-Tests: `src/lib/*.test.ts` (promptGenerator, progress, appState, assets), 46 Tests, nutzen nur Basis-API (`test`, `describe`, `expect`) und `localStorage` (daher jsdom-Environment).
- `jsdom@^29.1.1` ist als DevDependency vorhanden.
- E2E (Playwright) ist davon unabhängig.

## Gewünschter Zustand

- `vitest` auf eine 4.x-Version `>= 4.1.8` angehoben.
- `npm audit --audit-level=moderate` meldet `GHSA-5xrq-8626-4rwp` nicht mehr.
- Alle bestehenden Tests laufen unverändert grün; kein App-Verhalten und keine App-Code-Datei geändert.

## Hinweise zum Upgrade (Vitest 3 → 4)

- Vitest 4 setzt Vite 6+ voraus — erfüllt (`vite@^7`).
- Test-Config in `vite.config.ts` (`test.environment: "jsdom"`) bleibt voraussichtlich gültig; nur falls ein Breaking Change es erzwingt, anpassen.
- Mögliche Stolpersteine prüfen: entfernte/umbenannte APIs, geänderte Defaults (Pool), Snapshot-/Mock-Verhalten. Die vorhandenen Tests nutzen keine Mocks/Spies/Snapshots, daher geringes Risiko.
- Falls `jsdom` von Vitest 4 in einer neueren Major erwartet wird und Tests dadurch brechen, jsdom minimal nachziehen und im Testlog begründen.

## Dateien im Scope

Claude Code darf ändern:

- `package.json` (nur `vitest`-Version, ggf. `jsdom`, wenn zwingend erforderlich)
- `package-lock.json` (durch `npm install` regeneriert)
- `vite.config.ts` nur, falls ein Vitest-4-Breaking-Change die Test-Config zwingend erfordert
- `src/**/*.test.ts` nur, falls eine geänderte Vitest-API einen Testfix erzwingt
- `notes/test-log.md`

## Dateien vermeiden

- `src/App.tsx`, `src/data/**`, `src/lib/*.ts` (Nicht-Test-Code), `src/styles.css`
- `.github/**`
- `public/**`
- `playwright.config.ts` (außer ein E2E-Bruch erzwingt es)

Keine weiteren Paket-Upgrades „nebenbei". Nur das, was für das Schließen der Lücke und grüne Tests nötig ist.

## Akzeptanzkriterien

- `npm ls vitest` zeigt eine Version `>= 4.1.8`.
- `npm audit --audit-level=moderate` meldet `GHSA-5xrq-8626-4rwp` nicht mehr (idealerweise exit 0; verbleibende, unabhängige Hinweise dokumentieren).
- `npm test` → 46/46 Unit-Tests grün (oder mehr, falls Tests nötig wurden — keine entfernen ohne Begründung).
- `npm run build` grün.
- `npm run test:e2e` → 67/67 E2E-Tests grün.
- Keine App-Code-Datei (App.tsx, data, lib-Nicht-Tests, styles.css) geändert.

## Tests / Kommandos

```powershell
npm install
npm ls vitest
npm test
npm run build
npm run test:e2e
npm audit --audit-level=moderate
git status --short
```

`notes/test-log.md` knapp ergänzen: geänderte Dateien, Kommandos mit Exitcodes, ob/welche Breaking-Change-Anpassungen nötig waren, Rest-Audit-Status, Review-Fokus.

## Nicht tun

- Keine funktionalen App-Änderungen.
- Keine unrelated Dependency-Bumps.
- Keine Änderung an Build-/CI-/Deploy-Konfiguration außer der zwingend nötigen Test-Config.
- `npm audit fix --force` nicht blind ausführen; gezielt die `vitest`-Version setzen.
