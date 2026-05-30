# Jobcenter Lern-App (Claude-Variante)

Lokaler Browser-Prototyp für Mitarbeitende des Jobcenters. Kein Login, kein Backend, keine echten Kundendaten.

## Starten

```bash
npm install
npm run dev       # http://127.0.0.1:3013
```

## Prototype Features

- First-use onboarding with local profile (Vorname, Abteilung, KI-Level, Selbsteinschätzung)
- Personalisierte Home-Ansicht mit Self-Assessment-Empfehlung
- Responsive mobile and desktop app shell
- Local settings for profile, theme, and color template
- **BAKIRA** local mock chat (KI-Assistent Demo)
- Local prompt library with built-in and custom prompts
- **BAKIRA Promptgenerator**: regelbasierter lokaler Prompt-Generator ohne API
- Bereichsspezifischer Lernpfad: gemeinsame KI-Grundlagen plus Fachbereich nach gewaehlter Abteilung
- Reset-Funktionen: Grundeingaben neu einrichten / Demo komplett zurücksetzen
- Learning modules, myth quiz, practice case, and checklist

## Lernpfad und Fachbereiche

Der Tab **Lernen** trennt Inhalte in **KI-Grundlagen für alle** und **Dein Bereich**. Die Fachbereichsinhalte richten sich nach der im Onboarding oder in den Einstellungen gewaehlten Abteilung: Leistungsbereich, Markt & Integration, Eingangszone & Service oder Teamleitung.

Die fachlichen Karten sind Lern- und Orientierungsmaterial auf Basis oeffentlicher BA-/SGB-II-Informationen und enthalten Quellen-/Pruefhinweise. Sie ersetzen keine Rechtspruefung und keine produktive Einzelfallentscheidung.

## Promptgenerator

Im Tab **Prompts** gibt es einen lokalen BAKIRA Promptgenerator. Er erkennt Keywords im Anliegen und erzeugt einen strukturierten Prompt mit Bausteinen: Aufgabe, Kontext, Zielgruppe/Persona, Format, Tonfall, Prüfung/Rückfragen. Keine API-Anbindung.

## Reset-Funktionen (Einstellungen → Erprobung und Daten)

- **Grundeingaben neu einrichten**: Setzt Profil und Selbsteinschätzung zurück. Fortschritt und eigene Prompts bleiben erhalten.
- **Demo komplett zurücksetzen**: Setzt die gesamte App auf den Ausgangszustand zurück. Alle eigenen Daten werden gelöscht.

## Tests

```bash
npm test           # Vitest unit tests
npm run build      # TypeScript + Vite build
npm run test:e2e   # Playwright e2e (mobile + desktop)
npm audit --audit-level=moderate
```

## GitHub Pages Deployment

Die App kann als statische Seite über GitHub Pages öffentlich erreichbar gemacht werden. Kein Login, kein Backend erforderlich.

### Einmalige Einrichtung

1. **GitHub Repository erstellen** und den Code pushen (Branch `main`).
2. In den **Repository Settings → Pages** folgendes setzen:
   - **Source:** `GitHub Actions`
3. Beim nächsten Push auf `main` läuft der Workflow automatisch und veröffentlicht die App.

### Base-Pfad setzen

GitHub Pages liefert die App unter `https://<user>.github.io/<repo-name>/`. Der Workflow setzt `VITE_BASE_PATH` automatisch auf `/<repo-name>/` — kein manueller Schritt nötig.

Für einen lokalen Test mit Base-Pfad (optional):

```bash
# Linux / macOS
VITE_BASE_PATH=/mein-repo-name/ npm run build:pages

# Windows PowerShell
$env:VITE_BASE_PATH="/mein-repo-name/"; npm run build:pages

# Windows CMD
set VITE_BASE_PATH=/mein-repo-name/ && npm run build:pages
```

Ohne gesetzte Variable bleibt `base = "/"` — lokal über `npm run dev` funktioniert die App unverändert.

### Datenschutz-Hinweis

- Die App ist öffentlich erreichbar, wenn das GitHub-Repository öffentlich ist.
- Wer den Link kennt, kann die App im Browser testen — kein Login erforderlich.
- Es werden **keine echten Kundendaten** verwendet. Alle Inhalte sind Demo-Daten.
- Nutzerdaten (Profil, Fortschritt, Prompts) werden ausschließlich im **lokalen Browser-Speicher** gespeichert. Kein Sync, kein Server.

## Daten

Alle Daten werden im Browser-localStorage gespeichert (`jc-lernapp-claude-v2`).  
Kein Sync zwischen Geräten. Demo-Fortschritt bleibt beim Browser-Reset erhalten.
