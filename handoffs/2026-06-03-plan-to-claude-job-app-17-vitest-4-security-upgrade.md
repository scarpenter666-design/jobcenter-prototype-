# Handoff: JOB-APP-17 — Vitest-4-Upgrade (GHSA-5xrq-8626-4rwp)

Date: 2026-06-03
From: Planung auf Svens Wunsch (Claude)
To: Claude Code (Implementierung) → danach Codex Review
App: `jobcenter-prototype/`
Feature brief: `features/JOB-APP-17-vitest-4-security-upgrade.md`

## Goal

Schließe die kritische DevDependency-Lücke `GHSA-5xrq-8626-4rwp`, indem `vitest` von `3.2.4` auf `>= 4.1.8` (4.x) angehoben wird. Keine App-Code-Änderungen.

## Kontext

- `npm audit --audit-level=moderate` meldet exit 1 wegen `vitest < 4.1.0` (UI-/API-Server: arbitrary file read + code execution bei fehlender Origin-Prüfung).
- Dev-only: Vitest ist nicht Teil von `vite build`/Deployment. Die App selbst ist nicht verwundbar.
- Test-Config liegt in `vite.config.ts` (`test: { environment: "jsdom" }`).
- Unit-Tests (`src/lib/*.test.ts`, 46 Tests) nutzen nur Basis-API + `localStorage`; keine Mocks/Spies/Snapshots → geringes Bruchrisiko.

## Scope

1. In `package.json` `devDependencies.vitest` von `^3.0.0` auf `^4.1.8` setzen.
2. `npm install` ausführen, damit `package-lock.json` aktualisiert wird.
3. `npm test` laufen lassen.
   - Bei Breaking Changes: minimal anpassen (bevorzugt Test-Config in `vite.config.ts` oder `src/**/*.test.ts`), jede Anpassung im Testlog begründen.
4. `npm audit --audit-level=moderate` erneut prüfen → Advisory muss weg sein.
5. `npm run build` und `npm run test:e2e` zur Regressionsabsicherung.

## Files To Touch

Erlaubt:

- `package.json` (nur `vitest`, ggf. `jsdom` falls zwingend)
- `package-lock.json` (über `npm install`)
- `vite.config.ts` nur bei zwingendem Vitest-4-Breaking-Change an der Test-Config
- `src/**/*.test.ts` nur bei zwingendem API-Bruch
- `notes/test-log.md`

## Files To Avoid

- `src/App.tsx`, `src/data/**`, `src/lib/*.ts` (Nicht-Test-Code), `src/styles.css`
- `.github/**`, `public/**`
- `playwright.config.ts` (außer E2E bricht zwingend)

## Acceptance Criteria

- `npm ls vitest` → Version `>= 4.1.8`.
- `npm audit --audit-level=moderate` meldet `GHSA-5xrq-8626-4rwp` nicht mehr.
- `npm test` 46/46 grün (oder mehr; keine Tests ohne Begründung entfernen).
- `npm run build` grün.
- `npm run test:e2e` 67/67 grün.
- Keine App-Code-Datei geändert.

## Commands To Run

```powershell
npm install
npm ls vitest
npm test
npm run build
npm run test:e2e
npm audit --audit-level=moderate
git status --short
```

## Notes For Review

`notes/test-log.md` mit Builder-Log aktualisieren:

- geänderte Dateien
- Kommandos mit Exitcodes und kurzen Ergebnissen
- ob/welche Vitest-4-Breaking-Change-Anpassungen nötig waren
- verbleibender `npm audit`-Status
- offene Risiken / Review-Fokus

Codex-Review-Fokus:

- Nur Test-/Dependency-Dateien geändert, kein App-Code?
- `vitest >= 4.1.8` und Advisory `GHSA-5xrq-8626-4rwp` verschwunden?
- Alle Tests (Unit, Build, E2E) grün und unverändert in Aussagekraft?
- Keine ungewollten Begleit-Bumps in `package-lock.json`?
