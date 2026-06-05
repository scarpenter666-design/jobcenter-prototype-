import React, { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  BookOpen,
  Bot,
  CheckCircle2,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Circle,
  House,
  Library,
  MessageSquare,
  Send,
  User,
  X,
  Zap
} from "lucide-react";
import {
  basicsQuestionsByLevel,
  checkQuestions,
  detectPraxisResponse,
  detectPruefResult,
  modules,
  mythQuestionsByLevel,
  practiceCaseByLevel,
  praxisExamples,
  praxisTopics,
  roles,
  type ModuleId,
  type PraxisInputResponse,
  type PraxisTopicId,
  type PruefResult,
  type RoleId
} from "./data/content";
import {
  calculateAiLevel,
  calculateConfidenceProfile,
  getLearningPathSections,
  getRecommendedModules,
  type AppProgress,
  type CheckAnswers
} from "./lib/progress";
import {
  createDefaultAppState,
  loadAppState,
  needsReOnboarding,
  saveAppState,
  type AiLevel,
  type AppState,
  type ColorTemplate,
  type SavedPrompt,
  type ThemeMode,
  type UserProfile
} from "./lib/appState";
import { generatePrompt, type PromptResult } from "./lib/promptGenerator";

type Tab = "home" | "lernen" | "praxis" | "pruefen" | "prompts" | "bakira";

// ── Narrow viewport detection ──────────────────────────────────────────────────

function useIsNarrowViewport(): boolean {
  const [isNarrow, setIsNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 899px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 899px)");
    const handler = (e: MediaQueryListEvent) => setIsNarrow(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isNarrow;
}

// ── BAKIRA response helper ─────────────────────────────────────────────────────

function createBkiraResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("prompt")) {
    return "Strukturiere den Prompt nach Aufgabe, Kontext, gewuenschtem Ergebnis und Pruefkriterien. So kannst du die Antwort besser kontrollieren.";
  }
  if (lower.includes("daten") || lower.includes("datenschutz")) {
    return "Nutze fuer Uebungen nur fiktive oder anonymisierte Beispiele. Echte Kundendaten gehoeren nicht in diesen lokalen Demo-Chat.";
  }
  return "Starte mit einer klaren Frage und pruefe die Antwort danach fachlich. Ich kann dir helfen, Aufgabe, Grenzen und Pruefschritte zu schaerfen.";
}

// ── Prompt filter ──────────────────────────────────────────────────────────────

function matchesPrompt(prompt: SavedPrompt, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [prompt.title, prompt.department, prompt.prompt, prompt.tags.join(" ")].some((v) =>
    v.toLowerCase().includes(q)
  );
}

// ── Overview button (back to home) ─────────────────────────────────────────────

function OverviewButton({ onOverview }: { onOverview: () => void }) {
  return (
    <div className="screen-overview-row">
      <button
        type="button"
        className="btn-secondary screen-overview-btn"
        onClick={onOverview}
        aria-label="Übersicht öffnen"
      >
        <House size={16} aria-hidden="true" />
        Übersicht
      </button>
    </div>
  );
}

// ── Onboarding Portal Header ───────────────────────────────────────────────────

function OnboardingPortalHeader() {
  return (
    <div className="onboarding-portal-header">
      <div className="portal-header-logo-wrap">
        <span className="logo-pill">
          <span className="logo-placeholder">Jobcenter Logo</span>
        </span>
        <span className="portal-header-brand">Digital souverän im Jobcenter</span>
      </div>
      <div className="portal-header-links">
        <span>Leichte Sprache</span>
        <span>Hilfe</span>
        <span>Demo</span>
      </div>
    </div>
  );
}

// ── Onboarding Wizard ──────────────────────────────────────────────────────────

const WIZARD_TOTAL = 8; // Step 1: Vorname, Step 2: Abteilung, Steps 3-8: 6 Skalenfragen

const SCALE_LABELS: Record<number, string> = {
  1: "1 – trifft nicht zu",
  2: "2 – trifft eher nicht zu",
  3: "3 – trifft eher zu",
  4: "4 – trifft voll zu"
};

function OnboardingScreen({
  initialRole,
  initialFirstName = "",
  onComplete
}: {
  initialRole: RoleId | null;
  initialFirstName?: string;
  onComplete: (profile: UserProfile, checkAnswers: Record<string, number>) => void;
}) {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(initialRole);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const canProceed = (() => {
    if (step === 1) return firstName.trim().length > 0;
    if (step === 2) return selectedRole !== null;
    const q = (checkQuestions as readonly { id: string; label: string }[])[step - 3];
    return q !== undefined && q.id in answers;
  })();

  function handleNext() {
    if (step < WIZARD_TOTAL) {
      setStep(step + 1);
    } else if (selectedRole) {
      const aiLevel = calculateAiLevel(answers);
      onComplete(
        { firstName: firstName.trim(), selectedRole, aiLevel, onboardingCompleted: true },
        answers
      );
    }
  }

  function renderStep() {
    if (step === 1) {
      return (
        <div className="wizard-step">
          <div className="wizard-bakira-block">
            <div className="wizard-bakira-figure" aria-hidden="true">
              <MessageSquare size={28} />
            </div>
            <div className="wizard-bakira-bubble-wrap">
              <span className="wizard-bakira-name">BAKIRA begleitet dich</span>
              <p className="wizard-bakira-bubble">
                Schön, dass du dabei bist. Ich helfe dir, die App in wenigen Schritten auf
                deinen Arbeitsbereich einzurichten.
              </p>
            </div>
          </div>
          <h1 className="wizard-title">Willkommen, wie können wir dich weiterbringen?</h1>
          <p className="wizard-desc">
            Beantworte ein paar kurze Fragen — BAKIRA richtet deinen persönlichen Einstieg
            passend zu deiner Arbeit ein. Ganz ohne Bewertung.
          </p>
          <div className="form-field">
            <label htmlFor="onboarding-firstname">Vorname</label>
            <input
              id="onboarding-firstname"
              type="text"
              className="text-input"
              placeholder="Dein Vorname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              aria-label="Vorname"
              autoComplete="off"
              autoFocus
            />
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="wizard-step">
          <h2 className="wizard-step-heading">Deine Abteilung</h2>
          <p className="wizard-desc">In welchem Bereich arbeitest du?</p>
          <div className="choice-grid">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                className={`choice-card${selectedRole === role.id ? " selected" : ""}`}
                onClick={() => setSelectedRole(role.id)}
                aria-pressed={selectedRole === role.id}
              >
                {role.name}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Steps 3–8: one check question each (6 questions)
    const q = (checkQuestions as readonly { id: string; label: string }[])[step - 3];
    return (
      <div className="wizard-step">
        <h2 className="wizard-step-heading">Kurze Einschätzung</h2>
        <p className="wizard-desc">
          Von 1 (trifft nicht zu) bis 4 (trifft voll zu). Kein Test — nur Orientierung für deine
          persönliche Startempfehlung.
        </p>
        <div className="check-question">
          <p className="check-label">{q.label}</p>
          <div className="scale-row" role="group" aria-label={q.label}>
            {([1, 2, 3, 4] as const).map((v) => (
              <button
                key={v}
                type="button"
                className={`scale-btn${answers[q.id] === v ? " selected" : ""}`}
                onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
                aria-pressed={answers[q.id] === v}
                aria-label={SCALE_LABELS[v]}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-screen">
      <OnboardingPortalHeader />
      <div className="onboarding-bg-decoration" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="deco-icon deco-icon--euro"><path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-1.83 8-6.76 8-11.5C20 5.81 16.19 2 11.5 2zm1.5 14.08v1.92h-2v-1.92A5.01 5.01 0 0 1 7.08 12H9.1c.22 1.8 1.4 3.08 3.4 3.08 1.34 0 2.5-.72 2.5-2.08 0-1.22-.78-1.86-2.46-2.6l-1.1-.48C9.78 9.13 8.5 8.13 8.5 6.17c0-2.1 1.9-3.52 4-3.98V.5h2v1.69c1.5.42 3 1.63 3 3.31h-1.96c0-1.24-.94-2-2.04-2-1.14 0-2 .68-2 1.8 0 1.1.84 1.62 2.22 2.22l1.1.5c1.92.86 3.18 1.98 3.18 3.96 0 1.82-1.44 3.08-3 3.6z"/></svg>
        <svg viewBox="0 0 24 24" className="deco-icon deco-icon--brief"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
        <svg viewBox="0 0 24 24" className="deco-icon deco-icon--pin"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <svg viewBox="0 0 24 24" className="deco-icon deco-icon--screen"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
        <svg viewBox="0 0 24 24" className="deco-icon deco-icon--shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
      </div>
      <div className="onboarding-body">
        <div className="onboarding-panel">
          {renderStep()}
          <div className="wizard-footer">
            <div className="wizard-progress-segments" aria-hidden="true">
              {Array.from({ length: WIZARD_TOTAL }, (_, i) => (
                <div
                  key={i}
                  className={`wizard-segment${i < step ? " wizard-segment--filled" : ""}`}
                />
              ))}
            </div>
            <div className="wizard-footer-row">
              <span className="wizard-indicator">Schritt {step} von {WIZARD_TOTAL}</span>
              <div className="wizard-nav">
                {step > 1 && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setStep(step - 1)}
                  >
                    Zurück
                  </button>
                )}
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNext}
                  disabled={!canProceed}
                >
                  {step === WIZARD_TOTAL ? "App starten" : "Weiter"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Top Bar ────────────────────────────────────────────────────────────────────

function TopBar({
  firstName,
  onLogoClick,
  onSettingsOpen,
  settingsBtnRef
}: {
  firstName: string;
  onLogoClick: () => void;
  onSettingsOpen: () => void;
  settingsBtnRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <header className="top-bar" aria-label="App-Kopfzeile">
      <button className="app-logo-btn" onClick={onLogoClick} aria-label="Zur Übersicht">
        <span className="logo-pill">
          <span className="logo-placeholder">Jobcenter Logo</span>
        </span>
        <span className="app-wordmark-text">Digital souverän</span>
      </button>
      <button
        ref={settingsBtnRef}
        className="profile-button"
        onClick={onSettingsOpen}
        aria-label="Benutzermenue und Einstellungen"
      >
        <User size={18} aria-hidden="true" />
        <span className="profile-name">{firstName}</span>
      </button>
    </header>
  );
}

// ── Desktop Nav ────────────────────────────────────────────────────────────────

function DesktopNav({ activeTab, onTab }: { activeTab: Tab; onTab: (tab: Tab) => void }) {
  const items: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Übersicht", icon: <House size={19} /> },
    { id: "lernen", label: "Lernen", icon: <BookOpen size={19} /> },
    { id: "praxis", label: "Praxis", icon: <Zap size={19} /> },
    { id: "pruefen", label: "Prüfen", icon: <CheckSquare size={19} /> },
    { id: "prompts", label: "Prompts", icon: <Library size={19} /> },
    { id: "bakira", label: "BAKIRA", icon: <Bot size={19} /> }
  ];
  return (
    <nav className="desktop-nav" aria-label="Hauptnavigation Desktop">
      {items.map((item) => (
        <button
          key={item.id}
          className={`desktop-nav-item${activeTab === item.id ? " active" : ""}`}
          onClick={() => onTab(item.id)}
          aria-current={activeTab === item.id ? "page" : undefined}
        >
          <span aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ── Bottom Nav ─────────────────────────────────────────────────────────────────

function BottomNav({
  activeTab,
  doneCount,
  onTab
}: {
  activeTab: Tab;
  doneCount: number;
  onTab: (t: Tab) => void;
}) {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Übersicht", icon: <House size={20} /> },
    { id: "lernen", label: "Lernen", icon: <BookOpen size={20} /> },
    { id: "praxis", label: "Praxis", icon: <Zap size={20} /> },
    { id: "pruefen", label: "Prüfen", icon: <CheckSquare size={20} /> },
    { id: "prompts", label: "Prompts", icon: <Library size={20} /> },
    { id: "bakira", label: "BAKIRA", icon: <Bot size={20} /> }
  ];

  return (
    <nav className="bottom-nav" aria-label="Hauptnavigation">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={`nav-tab${activeTab === t.id ? " active" : ""}`}
          onClick={() => onTab(t.id)}
          aria-current={activeTab === t.id ? "page" : undefined}
        >
          <span className="nav-tab-icon" aria-hidden="true">
            {t.icon}
          </span>
          <span className="nav-tab-label">{t.label}</span>
          {t.id === "lernen" && doneCount > 0 && (
            <span className="nav-badge" aria-label={`${doneCount} abgeschlossen`}>
              {doneCount}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}

// ── Settings Panel ─────────────────────────────────────────────────────────────

function SettingsPanel({
  state,
  onSave,
  onClose,
  onResetProfile,
  onResetDemo
}: {
  state: AppState;
  onSave: (next: AppState) => void;
  onClose: () => void;
  onResetProfile: () => void;
  onResetDemo: () => void;
}) {
  const profile = state.profile!;
  const [firstName, setFirstName] = useState(profile.firstName);
  const [themeMode, setThemeMode] = useState<ThemeMode>(state.preferences.themeMode);
  const [colorTemplate, setColorTemplate] = useState<ColorTemplate>(
    state.preferences.colorTemplate
  );
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const first = panelRef.current?.querySelector<HTMLElement>(
      'input:not([disabled]), button:not([disabled]), select:not([disabled])'
    );
    first?.focus();
  }, []);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [onClose]);

  function handleSave() {
    onSave({
      ...state,
      profile: {
        ...profile,
        firstName: firstName.trim() || profile.firstName,
        onboardingCompleted: true
      },
      preferences: { themeMode, colorTemplate }
    });
    onClose();
  }

  return (
    <div className="settings-overlay" role="dialog" aria-label="Einstellungen" aria-modal="true">
      <div className="settings-panel" ref={panelRef}>
        <div className="settings-header">
          <h2>Einstellungen</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Einstellungen schließen">
            <X size={20} />
          </button>
        </div>
        <div className="settings-body">
          <section className="settings-section">
            <p className="section-label">Profil</p>
            <div className="form-field">
              <label htmlFor="settings-firstname">Vorname</label>
              <input
                id="settings-firstname"
                type="text"
                className="text-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                aria-label="Vorname"
              />
            </div>
            <div className="form-field">
              <label>Abteilung</label>
              <p className="settings-readonly-value" aria-label="Abteilung">
                {roles.find((r) => r.id === profile.selectedRole)?.name ?? profile.selectedRole}
              </p>
            </div>
          </section>
          <section className="settings-section settings-section--danger">
            <p className="section-label">Erprobung und Daten</p>
            <div className="form-field">
              <button
                className="btn-secondary btn-reset"
                onClick={onResetProfile}
                aria-label="Grundeingaben neu einrichten"
              >
                Grundeingaben neu einrichten
              </button>
              <p className="settings-reset-hint">
                Setzt Profil und Selbsteinschätzung zurück. Fortschritt und eigene Prompts bleiben
                erhalten.
              </p>
            </div>
            <div className="form-field">
              <button
                className="btn-secondary btn-reset btn-reset--full"
                onClick={onResetDemo}
                aria-label="Demo komplett zurücksetzen"
              >
                Demo komplett zurücksetzen
              </button>
              <p className="settings-reset-hint">
                Setzt die gesamte App zurück. Alle eigenen Daten werden gelöscht.
              </p>
            </div>
          </section>
          <section className="settings-section">
            <p className="section-label">Darstellung</p>
            <div className="form-field">
              <label htmlFor="settings-theme">Darstellung</label>
              <select
                id="settings-theme"
                className="select-input"
                value={themeMode}
                onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
                aria-label="Darstellung"
              >
                <option value="light">Hell</option>
                <option value="dark">Dunkel</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="settings-color">Farbtemplate</label>
              <select
                id="settings-color"
                className="select-input"
                value={colorTemplate}
                onChange={(e) => setColorTemplate(e.target.value as ColorTemplate)}
                aria-label="Farbtemplate"
              >
                <option value="blau">Blau</option>
                <option value="gruen">Grün</option>
                <option value="rot">Rot</option>
              </select>
            </div>
          </section>
        </div>
        <div className="settings-footer">
          <button className="btn-secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}

// ── BAKIRA Chat ─────────────────────────────────────────────────────────────────

type ChatMessage = { role: "user" | "bkira"; text: string };

// ── Prompt Generator ───────────────────────────────────────────────────────────

function PromptGenerator({
  onSavePrompt
}: {
  onSavePrompt: (prompt: SavedPrompt) => void;
}) {
  const [concern, setConcern] = useState("");
  const [format, setFormat] = useState("Fliesstext");
  const [tone, setTone] = useState("sachlich");
  const [persona, setPersona] = useState("Fachkraft im Jobcenter");
  const [result, setResult] = useState<PromptResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleGenerate() {
    const r = generatePrompt({ concern, format, tone, persona });
    setResult(r);
    setCopied(false);
    setSaved(false);
  }

  async function handleCopy() {
    if (!result || !result.valid) return;
    try {
      await navigator.clipboard.writeText(result.prompt);
      setCopied(true);
    } catch {
      // clipboard not available in test env — silent fail
    }
  }

  function handleSave() {
    if (!result || !result.valid) return;
    const newPrompt: SavedPrompt = {
      id: `generated-${Date.now()}`,
      title: result.title,
      department: "alle",
      tags: ["Generator"],
      prompt: result.prompt,
      isBuiltin: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSavePrompt(newPrompt);
    setSaved(true);
  }

  return (
    <section className="screen-section" aria-labelledby="generator-heading">
      <p className="section-label" id="generator-heading">
        BAKIRA Promptgenerator
      </p>
      <div className="prompt-generator">
        <div className="form-field">
          <label htmlFor="gen-concern">Dein Anliegen</label>
          <textarea
            id="gen-concern"
            className="text-input textarea-input"
            rows={3}
            placeholder="Beschreibe kurz, wobei BAKIRA helfen soll…"
            value={concern}
            onChange={(e) => {
              setConcern(e.target.value);
              setResult(null);
              setSaved(false);
              setCopied(false);
            }}
            aria-label="Dein Anliegen"
          />
        </div>
        <div className="gen-options">
          <div className="form-field">
            <label htmlFor="gen-format">Ausgabeformat</label>
            <select
              id="gen-format"
              className="select-input"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              aria-label="Ausgabeformat"
            >
              <option value="Fliesstext">Fließtext</option>
              <option value="Liste">Liste</option>
              <option value="E-Mail">E-Mail</option>
              <option value="Tabelle">Tabelle</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="gen-tone">Tonfall</label>
            <select
              id="gen-tone"
              className="select-input"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              aria-label="Tonfall"
            >
              <option value="sachlich">Sachlich</option>
              <option value="professionell">Professionell</option>
              <option value="buergerfreundlich">Bürgerfreundlich</option>
              <option value="persoenlich">Persönlich</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="gen-persona">Zielgruppe / Persona</label>
            <select
              id="gen-persona"
              className="select-input"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              aria-label="Zielgruppe oder Persona"
            >
              <option value="Fachkraft im Jobcenter">Fachkraft im Jobcenter</option>
              <option value="Teamleitung">Teamleitung</option>
              <option value="Buerger/in">Bürger/in</option>
              <option value="Auszubildende/r">Auszubildende/r</option>
            </select>
          </div>
        </div>
        <button className="btn-primary gen-btn" onClick={handleGenerate} aria-label="Prompt generieren">
          Prompt generieren
        </button>

        {result && !result.valid && (
          <p className="gen-validation" role="alert" aria-live="assertive">
            {result.message}
          </p>
        )}

        {result?.valid && (
          <div className="gen-result" role="status" aria-live="polite" aria-atomic="true">
            <p className="section-label">Generierter Prompt</p>
            <pre className="gen-preview" aria-label="Generierter Prompt Vorschau">
              {result.prompt}
            </pre>
            <div className="gen-actions">
              <button className="btn-secondary gen-action-btn" onClick={handleCopy}>
                {copied ? "Kopiert!" : "Kopieren"}
              </button>
              <button
                className="btn-secondary gen-action-btn"
                onClick={handleSave}
                disabled={saved}
              >
                {saved ? "Gespeichert" : "In Bibliothek speichern"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Prompt Library ─────────────────────────────────────────────────────────────

type PromptCategory = { id: string; label: string };

const PROMPT_CATEGORIES: PromptCategory[] = [
  { id: "alle", label: "Alle Prompts" },
  { id: "schreiben", label: "Schreiben und Umformulieren" },
  { id: "pruefen", label: "Prüfen und Qualität" },
  { id: "datenschutz", label: "Datenschutz und Sicherheit" },
  { id: "lernen", label: "Lernen und Erklären" },
  { id: "prompting", label: "Prompting und Struktur" },
  { id: "teamleitung", label: "Teamleitung" }
];

// Pragmatic category mapping derived from existing tags/department.
const CATEGORY_TAG_KEYWORDS: Record<string, string[]> = {
  schreiben: ["schreiben", "stil", "umformulierung", "sprache", "ton", "verstaendlichkeit"],
  pruefen: ["pruefung", "qualitaet", "check", "tabelle"],
  datenschutz: ["datenschutz", "kundendaten", "sicherheit"],
  lernen: ["lernen", "grundlagen", "quiz", "erklaerung", "recherche", "fachpersona"],
  prompting: ["prompting", "struktur", "vorlage", "verbesserung", "rueckfragen", "praezision", "generator"],
  teamleitung: ["teamleitung", "standard"]
};

function promptInCategory(prompt: SavedPrompt, categoryId: string): boolean {
  if (categoryId === "alle") return true;
  if (categoryId === "teamleitung" && prompt.department === "leitung") return true;
  const keywords = CATEGORY_TAG_KEYWORDS[categoryId] ?? [];
  const haystack = prompt.tags.join(" ").toLowerCase();
  return keywords.some((kw) => haystack.includes(kw));
}

function PromptLibrary({
  prompts,
  onPromptsChange,
  onOverview
}: {
  prompts: SavedPrompt[];
  onPromptsChange: (prompts: SavedPrompt[]) => void;
  onOverview: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editing, setEditing] = useState<SavedPrompt | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editPromptText, setEditPromptText] = useState("");
  const [editTags, setEditTags] = useState("");

  const newPromptBtnRef = useRef<HTMLButtonElement>(null);
  const editorTitleRef = useRef<HTMLInputElement>(null);
  // Tracks which trigger opened the editor: "new" or a prompt id
  const lastTriggerIdRef = useRef<"new" | string | null>(null);
  const restoreFocusOnCloseRef = useRef(false);

  const filtered = selectedCategory
    ? prompts.filter((p) => promptInCategory(p, selectedCategory) && matchesPrompt(p, query))
    : [];

  function closeEditor() {
    restoreFocusOnCloseRef.current = true;
    setEditing(null);
    setIsNew(false);
  }

  useEffect(() => {
    if (editing) {
      editorTitleRef.current?.focus();
    } else if (restoreFocusOnCloseRef.current) {
      restoreFocusOnCloseRef.current = false;
      if (lastTriggerIdRef.current === "new") {
        newPromptBtnRef.current?.focus();
      } else if (lastTriggerIdRef.current) {
        const btn = document.querySelector<HTMLButtonElement>(
          `[data-prompt-edit-id="${lastTriggerIdRef.current}"]`
        );
        btn?.focus();
      }
    }
  }, [editing]);

  useEffect(() => {
    if (!editing) return;
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") closeEditor(); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [editing]);

  function openNew() {
    lastTriggerIdRef.current = "new";
    setEditing({
      id: "",
      title: "",
      department: "alle",
      tags: [],
      prompt: "",
      isBuiltin: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setEditTitle("");
    setEditPromptText("");
    setEditTags("");
    setIsNew(true);
  }

  function openEdit(p: SavedPrompt, e: React.MouseEvent<HTMLButtonElement>) {
    lastTriggerIdRef.current = p.id;
    setEditing(p);
    setEditTitle(p.title);
    setEditPromptText(p.prompt);
    setEditTags(p.tags.join(", "));
    setIsNew(false);
  }

  function saveEdit() {
    if (!editing) return;
    const tags = editTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (isNew) {
      const newPrompt: SavedPrompt = {
        id: `custom-${Date.now()}`,
        title: editTitle.trim(),
        department: "alle",
        tags,
        prompt: editPromptText.trim(),
        isBuiltin: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      onPromptsChange([...prompts, newPrompt]);
    } else {
      onPromptsChange(
        prompts.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                title: editTitle.trim(),
                prompt: editPromptText.trim(),
                tags,
                updatedAt: new Date().toISOString()
              }
            : p
        )
      );
    }
    // Make the saved prompt visible right away (custom prompts always live under "Alle Prompts").
    setSelectedCategory("alle");
    closeEditor();
  }

  function deletePrompt(id: string) {
    onPromptsChange(prompts.filter((p) => p.id !== id));
  }

  async function copyPrompt(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard unavailable — silent fail
    }
  }

  function onSaveGeneratedPrompt(newPrompt: SavedPrompt) {
    onPromptsChange([...prompts, newPrompt]);
    setSelectedCategory("alle");
  }

  if (editing) {
    return (
      <div className="screen-scroll">
        <section className="screen-section">
          <div className="prompt-editor-back-row">
            <button
              className="btn-secondary prompt-back-btn"
              onClick={closeEditor}
              aria-label="Zurück zur Prompt-Bibliothek"
            >
              <ChevronLeft size={16} aria-hidden="true" />
              Zurück zur Prompt-Bibliothek
            </button>
          </div>
          <p className="section-label">{isNew ? "Neuer Prompt" : "Prompt bearbeiten"}</p>
          <div className="prompt-editor">
            <div className="form-field">
              <label htmlFor="edit-title">Titel</label>
              <input
                ref={editorTitleRef}
                id="edit-title"
                className="text-input"
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                aria-label="Titel"
              />
            </div>
            <div className="form-field">
              <label htmlFor="edit-prompt">Prompttext</label>
              <textarea
                id="edit-prompt"
                className="text-input textarea-input"
                value={editPromptText}
                onChange={(e) => setEditPromptText(e.target.value)}
                rows={5}
                aria-label="Prompttext"
              />
            </div>
            <div className="form-field">
              <label htmlFor="edit-tags">Tags (kommagetrennt)</label>
              <input
                id="edit-tags"
                className="text-input"
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                aria-label="Tags"
              />
            </div>
            <div className="prompt-editor-actions">
              <button className="btn-secondary" onClick={closeEditor}>
                Abbrechen
              </button>
              <button
                className="btn-primary"
                onClick={saveEdit}
                disabled={!editTitle.trim() || !editPromptText.trim()}
              >
                Speichern
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const selectedCategoryLabel =
    PROMPT_CATEGORIES.find((c) => c.id === selectedCategory)?.label ?? "";

  // Detail page for a selected prompt area — opened from the library start view,
  // with its own back button and the search/grid for that area.
  if (selectedCategory !== null) {
    return (
      <div className="screen-scroll">
        <OverviewButton onOverview={onOverview} />
        <section className="screen-section" aria-labelledby="prompts-detail-heading">
          <div className="prompt-editor-back-row">
            <button
              className="btn-secondary prompt-back-btn"
              onClick={() => setSelectedCategory(null)}
              aria-label="Zurück zur Prompt-Bibliothek"
            >
              <ChevronLeft size={16} aria-hidden="true" />
              Zurück zur Prompt-Bibliothek
            </button>
          </div>
          <div className="prompt-toolbar">
            <h2 id="prompts-detail-heading" className="screen-title">
              {selectedCategoryLabel}
            </h2>
            <button ref={newPromptBtnRef} className="btn-primary prompt-new-btn" onClick={openNew}>
              + Neuer Prompt
            </button>
          </div>
          <label htmlFor="prompt-search" className="sr-only">
            Prompts suchen
          </label>
          <input
            id="prompt-search"
            className="text-input prompt-search"
            type="search"
            placeholder="Suchen nach Titel, Tag, Abteilung…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Prompts suchen"
          />
          <div className="prompt-grid">
            {filtered.length === 0 && <p className="prompt-empty">Keine Prompts gefunden.</p>}
            {filtered.map((p) => (
              <div key={p.id} className="prompt-card">
                <div className="prompt-card-header">
                  <span className="prompt-card-title">{p.title}</span>
                  {p.isBuiltin && <span className="chip-rec">Eingebaut</span>}
                </div>
                <p className="prompt-card-text">{p.prompt}</p>
                {p.tags.length > 0 && (
                  <div className="tag-row">
                    {p.tags.map((t) => (
                      <span key={t} className="tag-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="prompt-card-actions">
                  <button
                    className="btn-secondary prompt-action-btn"
                    onClick={() => copyPrompt(p.prompt)}
                    aria-label={`${p.title} kopieren`}
                  >
                    Nutzen
                  </button>
                  {!p.isBuiltin && (
                    <>
                      <button
                        className="btn-secondary prompt-action-btn"
                        data-prompt-edit-id={p.id}
                        onClick={(e) => openEdit(p, e)}
                        aria-label={`${p.title} bearbeiten`}
                      >
                        Bearbeiten
                      </button>
                      <button
                        className="btn-secondary prompt-action-btn prompt-action-btn--danger"
                        onClick={() => deletePrompt(p.id)}
                        aria-label={`${p.title} loeschen`}
                      >
                        Löschen
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="screen-scroll">
      <OverviewButton onOverview={onOverview} />
      <PromptGenerator onSavePrompt={onSaveGeneratedPrompt} />
      <section className="screen-section" aria-labelledby="prompts-heading">
        <div className="prompt-toolbar">
          <h2 id="prompts-heading" className="screen-title">
            Prompt-Bibliothek
          </h2>
          <button ref={newPromptBtnRef} className="btn-primary prompt-new-btn" onClick={openNew}>
            + Neuer Prompt
          </button>
        </div>
        <p className="lernen-area-intro">
          Wähle einen Bereich, um die passenden Prompts auf einer eigenen Seite zu öffnen.
        </p>
        <div className="prompt-category-bar" role="group" aria-label="Prompt-Bereiche">
          {PROMPT_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className="prompt-category-btn"
              onClick={() => {
                setQuery("");
                setSelectedCategory(c.id);
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── BAKIRA Workspace ────────────────────────────────────────────────────────────

const BAKIRA_LANGS = [
  { code: "en", label: "Englisch", text: "Your document has been reviewed. Please verify content before use." },
  { code: "ar", label: "Arabisch", text: "تمت مراجعة مستندك. يرجى التحقق من المحتوى قبل الاستخدام." },
  { code: "uk", label: "Ukrainisch", text: "Ваш документ перевірено. Будь ласка, перевірте вміст перед використанням." },
  { code: "tr", label: "Türkisch", text: "Belgeniz incelendi. Kullanmadan önce içeriği doğrulayın." }
];

const BAKIRA_ACTIONS = [
  { id: "summarize", label: "Dokument zusammenfassen", text: "Zusammenfassung (Demo): Dieses Dokument enthält allgemeine Informationen. Eine fachliche Prüfung bleibt beim Menschen." },
  { id: "simplify",  label: "Text vereinfachen",       text: "Vereinfacht (Demo): Der Text wurde in einfachere Sprache übertragen. Inhalt bitte fachlich prüfen." },
  { id: "draft",     label: "Antwortentwurf erstellen", text: "Entwurf (Demo): Sehr geehrte Damen und Herren, hiermit bestätige ich den Eingang Ihrer Anfrage. Mit freundlichen Grüßen." },
  { id: "privacy",   label: "Datenschutz prüfen",      text: "Datenschutz (Demo): Keine offensichtlich personenbezogenen Daten erkannt. Fachliche Prüfung erforderlich." }
];

function BakiraWorkspaceScreen({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [uploadName, setUploadName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedLang, setSelectedLang] = useState("en");
  const [showTranslation, setShowTranslation] = useState(false);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "bkira", text: createBkiraResponse(text) }
    ]);
    setDraft("");
  }

  return (
    <div className="screen-scroll">
      <section className="screen-section">
        <div className="bakira-ws-header">
          <button
            className="btn-secondary bakira-ws-back"
            onClick={onBack}
            aria-label="Zurück zur Übersicht"
          >
            <House size={16} aria-hidden="true" />
            Übersicht
          </button>
          <div className="bakira-ws-title-row">
            <Bot size={18} aria-hidden="true" />
            <span className="bakira-ws-title">BAKIRA Workspace</span>
            <span className="bakira-ws-badge">Demo</span>
          </div>
          <div className="bkira-hint bakira-ws-hint">
            <AlertCircle size={14} aria-hidden="true" />
            Keine echten Kundendaten eingeben. Demo ohne KI-Anbindung.
          </div>
        </div>
      </section>

      <section className="screen-section">
        <p className="section-label">Schnellaktionen</p>
        <div className="bakira-ws-actions">
          {BAKIRA_ACTIONS.map((a) => (
            <button
              key={a.id}
              className="bakira-ws-action-btn"
              onClick={() => setMessages((prev) => [...prev, { role: "bkira", text: a.text }])}
            >
              {a.label}
            </button>
          ))}
        </div>
      </section>

      <section className="screen-section">
        <p className="section-label">Chat mit BAKIRA</p>
        <div className="bakira-ws-chat">
          <div className="bakira-ws-messages" aria-live="polite">
            {messages.length === 0 && (
              <p className="bkira-empty">
                Wähle eine Schnellaktion oder stelle BAKIRA direkt eine Frage.
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`bkira-msg bkira-msg--${m.role}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="bkira-input-row">
            <label htmlFor="bakira-ws-input" className="sr-only">
              Nachricht an BAKIRA
            </label>
            <input
              id="bakira-ws-input"
              className="text-input bkira-input"
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Nachricht an BAKIRA…"
              aria-label="Nachricht an BAKIRA Workspace"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              className="btn-primary bkira-send"
              onClick={sendMessage}
              disabled={!draft.trim()}
              aria-label="Senden"
            >
              <Send size={16} />
              <span>Senden</span>
            </button>
          </div>
        </div>
      </section>

      <section className="screen-section">
        <p className="section-label">Dokument hochladen (Demo)</p>
        <div className="bakira-ws-upload">
          <button
            type="button"
            className="btn-secondary bakira-ws-upload-label"
            onClick={() => fileInputRef.current?.click()}
            aria-label={uploadName ? `Datei: ${uploadName}` : "Datei auswählen (Demo)"}
          >
            {uploadName ? `Datei: ${uploadName}` : "Datei auswählen (Demo)"}
          </button>
          <input
            ref={fileInputRef}
            id="bakira-ws-file"
            type="file"
            accept=".pdf,.docx,.txt"
            className="sr-only"
            aria-label="Dokument hochladen Demo"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setUploadName(f.name);
                e.target.value = "";
              }
            }}
          />
          <p className="bakira-ws-upload-note">
            Keine echten Dateien werden gespeichert oder übertragen — nur Demo.
          </p>
        </div>
      </section>

      <section className="screen-section">
        <p className="section-label">Übersetzungs-Demo</p>
        <div className="bakira-ws-lang-row">
          {BAKIRA_LANGS.map((l) => (
            <button
              key={l.code}
              className={`bakira-ws-lang-btn${selectedLang === l.code ? " active" : ""}`}
              onClick={() => {
                setSelectedLang(l.code);
                setShowTranslation(true);
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
        {showTranslation && (
          <div className="bakira-ws-translation">
            <p className="bakira-ws-translation-lang">
              {BAKIRA_LANGS.find((l) => l.code === selectedLang)?.label}
            </p>
            <p className="bakira-ws-translation-text">
              {BAKIRA_LANGS.find((l) => l.code === selectedLang)?.text}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

// ── Home Screen ────────────────────────────────────────────────────────────────

const AI_LEVEL_LABEL: Record<AiLevel, string> = {
  einsteiger: "Einsteiger",
  grundkenntnisse: "Grundkenntnisse",
  fortgeschritten: "Fortgeschritten"
};

// Makes the level-adaptive content visible: the questions below adjust to this level.
function LevelBadge({ aiLevel }: { aiLevel: AiLevel }) {
  return (
    <span className="level-badge" aria-label={`Angepasst an dein KI-Level: ${AI_LEVEL_LABEL[aiLevel]}`}>
      Angepasst an dein KI-Level: {AI_LEVEL_LABEL[aiLevel]}
    </span>
  );
}

const SUPPORT_MSG: Record<AiLevel, string> = {
  einsteiger:
    "Du musst nicht alles auf einmal können. Starte mit dem nächsten sicheren Schritt.",
  grundkenntnisse:
    "Gutes Vorwissen. BAKIRA hilft dir, Prompts für deinen konkreten Arbeitsfall zu schärfen.",
  fortgeschritten:
    "Dein Wissen ist gefragt. Vertiefe es mit Praxisfällen und der Prompt-Bibliothek."
};

function HomeScreen({
  progress,
  firstName,
  aiLevel,
  onNavigate
}: {
  progress: AppProgress;
  firstName: string;
  aiLevel: AiLevel;
  onNavigate: (t: Tab) => void;
}) {
  const allAnswered = checkQuestions.every((q) => q.id in progress.answers);
  const confidenceProfile = allAnswered
    ? calculateConfidenceProfile(progress.answers as CheckAnswers)
    : null;

  const currentRole = roles.find((r) => r.id === progress.selectedRole);
  const recommended = getRecommendedModules(progress.selectedRole ?? "allgemein");

  let nextModule: (typeof modules)[0] | null = null;
  if (
    confidenceProfile?.nextStepId &&
    !progress.completedModules.includes(confidenceProfile.nextStepId)
  ) {
    nextModule = modules.find((m) => m.id === confidenceProfile.nextStepId) ?? null;
  } else {
    const nextUndoneId = recommended.find((id) => !progress.completedModules.includes(id));
    nextModule = nextUndoneId ? (modules.find((m) => m.id === nextUndoneId) ?? null) : null;
  }

  return (
    <div className="screen-scroll">
      <section className="screen-section">
        <div className="greeting-card">
          <p className="greeting-text">Hallo {firstName}</p>
          <p className="greeting-sub">
            Abteilung: {currentRole?.name ?? "Allgemeiner Einstieg"} · KI-Level:{" "}
            {AI_LEVEL_LABEL[aiLevel]}
          </p>
        </div>
      </section>

      <section className="screen-section">
        <div className="dashboard-support-msg" aria-label="Unterstützungshinweis">
          {SUPPORT_MSG[aiLevel]}
        </div>
      </section>

      {confidenceProfile && (
        <section className="screen-section">
          <div className="dashboard-orientation">
            <p className="orientation-level">Dein Startpunkt: {confidenceProfile.level}</p>
          </div>
        </section>
      )}

      <section className="screen-section" aria-labelledby="nextstep-heading">
        <p className="section-label" id="nextstep-heading">
          Empfohlener nächster Schritt
        </p>
        <div className="dashboard-next-step">
          {nextModule ? (
            <div>
              <p className="next-step-label">{nextModule.title}</p>
              <p className="next-step-meta">
                {nextModule.duration} · {nextModule.summary.substring(0, 55)}…
              </p>
            </div>
          ) : (
            <div>
              <p className="next-step-label">Praxisfall erkunden</p>
              <p className="next-step-meta">Wende dein Wissen in einem realen Szenario an.</p>
            </div>
          )}
        </div>
      </section>

      <section className="screen-section" aria-labelledby="quickactions-heading">
        <p className="section-label" id="quickactions-heading">
          Schnellzugriff
        </p>
        <div className="quick-actions">
          <button className="quick-action-btn" onClick={() => onNavigate("lernen")}>
            <BookOpen size={20} aria-hidden="true" />
            <span>Weiterlernen</span>
          </button>
          <button className="quick-action-btn" onClick={() => onNavigate("bakira")}>
            <Bot size={20} aria-hidden="true" />
            <span>BAKIRA fragen</span>
          </button>
          <button className="quick-action-btn" onClick={() => onNavigate("prompts")}>
            <Library size={20} aria-hidden="true" />
            <span>Prompt finden</span>
          </button>
          <button className="quick-action-btn" onClick={() => onNavigate("pruefen")}>
            <CheckSquare size={20} aria-hidden="true" />
            <span>Prüfweg</span>
          </button>
        </div>
      </section>

    </div>
  );
}

// ── Lernpfad ──────────────────────────────────────────────────────────────────

type LearningArea = "overview" | "modules" | "mythos" | "praxisfall";

function LernpfadScreen({
  progress,
  aiLevel,
  onOpenModule,
  mythAnswers,
  caseChoice,
  basicsAnswers,
  onMythAnswer,
  onCaseChoice,
  onBasicsAnswer,
  onOverview,
  initialArea = "overview"
}: {
  progress: AppProgress;
  aiLevel: AiLevel;
  onOpenModule: (id: ModuleId) => void;
  mythAnswers: Record<number, boolean>;
  caseChoice: string | null;
  basicsAnswers: Record<number, number>;
  onMythAnswer: (idx: number, val: boolean) => void;
  onCaseChoice: (id: string) => void;
  onBasicsAnswer: (idx: number, val: number) => void;
  onOverview: () => void;
  initialArea?: LearningArea;
}) {
  const [activeArea, setActiveArea] = useState<LearningArea>(initialArea);

  const sections = getLearningPathSections(progress.selectedRole ?? "allgemein");
  const recommended = new Set(getRecommendedModules(progress.selectedRole ?? "allgemein"));
  const sectionData = [sections.general, sections.roleSpecific];

  // Level-dependent interactive content (driven by profile.aiLevel)
  const mythList = mythQuestionsByLevel[aiLevel];
  const basicsList = basicsQuestionsByLevel[aiLevel];
  const practiceCase = practiceCaseByLevel[aiLevel];
  const chosen = caseChoice ? practiceCase.options.find((o) => o.id === caseChoice) : null;

  if (activeArea === "overview") {
    return (
      <div className="screen-scroll">
        <OverviewButton onOverview={onOverview} />
        <section className="screen-section" aria-label="Lernbereiche">
          <p className="section-label">Lernbereiche</p>
          <div className="lernen-area-grid">
            <button className="lernen-area-card" onClick={() => setActiveArea("modules")} aria-label="KI-Grundlagen für alle öffnen">
              <span className="lernen-area-icon" aria-hidden="true"><BookOpen size={22} /></span>
              <span className="lernen-area-content">
                <p className="lernen-area-title">KI-Grundlagen für alle</p>
                <p className="lernen-area-desc">Starte mit kurzen Lernkarten zu sicherem KI-Einsatz und deinem Arbeitsbereich.</p>
              </span>
              <ChevronRight size={17} className="module-chevron" aria-hidden="true" />
            </button>
            <button className="lernen-area-card" onClick={() => setActiveArea("mythos")} aria-label="Mythos oder Realität öffnen">
              <span className="lernen-area-icon" aria-hidden="true"><AlertCircle size={22} /></span>
              <span className="lernen-area-content">
                <p className="lernen-area-title">Mythos oder Realität?</p>
                <p className="lernen-area-desc">Ordne typische KI-Aussagen ein und erhalte direkt Feedback.</p>
              </span>
              <ChevronRight size={17} className="module-chevron" aria-hidden="true" />
            </button>
            <button className="lernen-area-card" onClick={() => setActiveArea("praxisfall")} aria-label="Praxisfallbeispiele öffnen">
              <span className="lernen-area-icon" aria-hidden="true"><CheckSquare size={22} /></span>
              <span className="lernen-area-content">
                <p className="lernen-area-title">Praxisfallbeispiele</p>
                <p className="lernen-area-desc">Wähle eine Antwortmöglichkeit aus und sieh, welcher Umgang mit KI sicher ist.</p>
              </span>
              <ChevronRight size={17} className="module-chevron" aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (activeArea === "modules") {
    return (
      <div className="screen-scroll">
        <div className="lernen-area-back-row">
          <button className="lernen-back-btn" onClick={() => setActiveArea("overview")} aria-label="Zurück zum Lernbereich">
            <ChevronLeft size={16} aria-hidden="true" />
            Zurück zum Lernbereich
          </button>
        </div>
        <section className="screen-section" aria-labelledby="lernen-basics-quiz-heading">
          <p className="section-label" id="lernen-basics-quiz-heading">Lernfragen für dein Level</p>
          <LevelBadge aiLevel={aiLevel} />
          <p className="lernen-area-intro">
            Kurze Fragen passend zu deinem KI-Level. Ordne die Aussagen ein und erhalte direkt Feedback.
          </p>
          <div className="basics-quiz" aria-live="polite" aria-relevant="additions">
            {basicsList.map((q, idx) => {
              const answered = idx in basicsAnswers;
              const chosen = basicsAnswers[idx];
              const correct = answered && chosen === q.correctIndex;
              return (
                <div
                  key={q.question}
                  className={`basics-card${answered ? (correct ? " basics-ok" : " basics-miss") : ""}`}
                >
                  <p className="basics-question">{q.question}</p>
                  <div className="basics-options">
                    {q.options.map((opt, oi) => (
                      <button
                        key={opt}
                        className={`basics-option${answered && oi === q.correctIndex ? " basics-correct-answer" : ""}${answered && chosen === oi ? " basics-chosen" : ""}`}
                        onClick={() => !answered && onBasicsAnswer(idx, oi)}
                        disabled={answered}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {answered && (
                    <p className={`basics-feedback${correct ? " fb-ok" : " fb-miss"}`}>
                      <strong>{correct ? "Richtig. " : "Nicht ganz. "}</strong>
                      {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
        {sectionData.map((section) => (
          <section className="screen-section" aria-labelledby={`${section.title}-heading`} key={section.title}>
            <h2 className="section-label" id={`${section.title}-heading`}>
              {section.title}
            </h2>
            <div className="module-list">
              {section.moduleIds.map((id) => {
                const mod = modules.find((m) => m.id === id)!;
                const done = progress.completedModules.includes(mod.id);
                const isRec = recommended.has(mod.id);
                return (
                  <button
                    key={mod.id}
                    className="module-item"
                    onClick={() => onOpenModule(mod.id)}
                    aria-label={`${mod.title}, ${mod.duration}${done ? ", abgeschlossen" : ""}`}
                  >
                    <span className={`module-status-icon${done ? " done" : ""}`} aria-hidden="true">
                      {done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </span>
                    <span className="module-info">
                      <span className="module-title-row">
                        <span className="module-title">{mod.title}</span>
                        {isRec && <span className="chip-rec">Empfohlen</span>}
                        {done && <span className="chip-done">Fertig</span>}
                      </span>
                      <span className="module-meta">
                        {mod.duration} · {mod.summary.substring(0, 52)}…
                      </span>
                      {mod.warning && <span className="module-warning">{mod.warning}</span>}
                    </span>
                    <ChevronRight size={17} className="module-chevron" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    );
  }

  if (activeArea === "mythos") {
    return (
      <div className="screen-scroll">
        <div className="lernen-area-back-row">
          <button className="lernen-back-btn" onClick={() => setActiveArea("overview")} aria-label="Zurück zum Lernbereich">
            <ChevronLeft size={16} aria-hidden="true" />
            Zurück zum Lernbereich
          </button>
        </div>
        <section className="screen-section" aria-labelledby="lernen-quiz-heading">
          <p className="section-label" id="lernen-quiz-heading">Mythos oder Realität?</p>
          <LevelBadge aiLevel={aiLevel} />
          <p className="lernen-area-intro">Ordne typische KI-Aussagen ein und erhalte direkt Feedback.</p>
          <div className="myth-list" aria-live="polite" aria-relevant="additions">
            {mythList.map((q, idx) => {
              const answered = idx in mythAnswers;
              const correct = answered && mythAnswers[idx] === q.answer;
              return (
                <div
                  key={q.statement}
                  className={`myth-card${answered ? (correct ? " myth-ok" : " myth-miss") : ""}`}
                >
                  <p className="myth-statement">{q.statement}</p>
                  <div className="myth-btns">
                    <button
                      className={`myth-btn${answered && q.answer === true ? " myth-correct-answer" : ""}${answered && mythAnswers[idx] === true ? " myth-chosen" : ""}`}
                      onClick={() => !answered && onMythAnswer(idx, true)}
                      disabled={answered}
                    >
                      Realität
                    </button>
                    <button
                      className={`myth-btn${answered && q.answer === false ? " myth-correct-answer" : ""}${answered && mythAnswers[idx] === false ? " myth-chosen" : ""}`}
                      onClick={() => !answered && onMythAnswer(idx, false)}
                      disabled={answered}
                    >
                      Mythos
                    </button>
                  </div>
                  {answered && (
                    <p className={`myth-feedback${correct ? " fb-ok" : " fb-miss"}`}>
                      <strong>{correct ? "Richtig. " : "Nicht ganz. "}</strong>
                      {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="screen-scroll">
      <div className="lernen-area-back-row">
        <button className="lernen-back-btn" onClick={() => setActiveArea("overview")} aria-label="Zurück zum Lernbereich">
          <ChevronLeft size={16} aria-hidden="true" />
          Zurück zum Lernbereich
        </button>
      </div>
      <section className="screen-section" aria-labelledby="lernen-case-heading">
        <p className="section-label" id="lernen-case-heading">Praxisfall — Lernübung</p>
        <p className="lernen-area-intro">Wähle eine Antwortmöglichkeit aus und sieh, welcher Umgang mit KI sicher ist.</p>
        <div className="case-card">
          <h3 className="case-title">{practiceCase.title}</h3>
          <blockquote className="case-situation">{practiceCase.situation}</blockquote>
          <p className="case-action-hint">Wähle eine der Antwortmöglichkeiten. Danach bekommst du eine kurze Rückmeldung.</p>
          <div className="case-options" role="group" aria-label="Wähle eine Handlungsoption">
            {practiceCase.options.map((opt) => {
              const isChosen = caseChoice === opt.id;
              return (
                <button
                  key={opt.id}
                  className={`case-option${isChosen ? (opt.recommended ? " case-good" : " case-neutral") : ""}${caseChoice && !isChosen ? " case-dim" : ""}`}
                  onClick={() => !caseChoice && onCaseChoice(opt.id)}
                  disabled={!!caseChoice && !isChosen}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {chosen && (
            <div className={`case-feedback${chosen.recommended ? " fb-ok" : " fb-miss"}`}>
              <p>{chosen.feedback}</p>
              <strong className="case-takeaway">{practiceCase.takeaway}</strong>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ── Module Detail ──────────────────────────────────────────────────────────────

function ModuleDetailScreen({
  moduleId,
  progress,
  onToggleComplete,
  onBack
}: {
  moduleId: ModuleId;
  progress: AppProgress;
  onToggleComplete: () => void;
  onBack: () => void;
}) {
  const [cardIdx, setCardIdx] = useState(0);
  const mod = modules.find((m) => m.id === moduleId)!;
  const done = progress.completedModules.includes(moduleId);
  const isLast = cardIdx === mod.cards.length - 1;

  return (
    <div className="module-detail" role="main" aria-label={mod.title}>
      <div className="detail-top">
        <button className="detail-back-btn" onClick={onBack} aria-label="Zurück zum Lernpfad">
          <ChevronLeft size={20} aria-hidden="true" />
          <span>Zurück</span>
        </button>
        <span
          className="detail-card-pos"
          aria-label={`Karte ${cardIdx + 1} von ${mod.cards.length}`}
        >
          {cardIdx + 1}/{mod.cards.length}
        </span>
      </div>
      <div className="detail-header">
        <p className="section-label">{mod.duration}</p>
        <h2 className="detail-title">{mod.title}</h2>
        <p className="detail-summary">{mod.summary}</p>
        {mod.warning && <p className="detail-warning">{mod.warning}</p>}
        {mod.sourceRefs && (
          <p className="detail-source">Quelle/Pruefung: {mod.sourceRefs.join(" · ")}</p>
        )}
      </div>
      <div className="card-stage" aria-live="polite" aria-atomic="true">
        <div className="learning-card">{mod.cards[cardIdx]}</div>
        <div className="card-dots" role="tablist" aria-label="Kartennavigation">
          {mod.cards.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === cardIdx}
              className={`card-dot${i === cardIdx ? " active" : ""}`}
              onClick={() => setCardIdx(i)}
              aria-label={`Karte ${i + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="detail-actions">
        <button
          className="btn-secondary"
          onClick={() => setCardIdx((i) => Math.max(0, i - 1))}
          disabled={cardIdx === 0}
          aria-label="Vorherige Karte"
        >
          <ChevronLeft size={17} aria-hidden="true" /> Zurück
        </button>
        {!isLast ? (
          <button className="btn-primary" onClick={() => setCardIdx((i) => i + 1)}>
            Weiter <ChevronRight size={17} aria-hidden="true" />
          </button>
        ) : (
          <button
            className={`btn-primary${done ? " btn-done" : ""}`}
            onClick={onToggleComplete}
          >
            {done ? "Als offen markieren" : "Modul abschließen"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Praxis ─────────────────────────────────────────────────────────────────────

function PraxisScreen({ onOverview }: { onOverview: () => void }) {
  const [praxisInput, setPraxisInput] = useState("");
  const [praxisResponse, setPraxisResponse] = useState<PraxisInputResponse | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<PraxisTopicId | null>(null);

  const visibleExamples = selectedTopic
    ? praxisExamples.filter((ex) => ex.topics.includes(selectedTopic))
    : [];
  const selectedTopicLabel = selectedTopic
    ? praxisTopics.find((t) => t.id === selectedTopic)?.label ?? ""
    : "";

  // Detail page for a selected topic — opened from the start selection, with its
  // own back button, analogous to the learning area.
  if (selectedTopic !== null) {
    return (
      <div className="screen-scroll">
        <OverviewButton onOverview={onOverview} />
        <section className="screen-section" aria-labelledby="praxis-detail-heading">
          <div className="lernen-area-back-row">
            <button
              className="lernen-back-btn"
              onClick={() => setSelectedTopic(null)}
              aria-label="Zurück zum Praxisbereich"
            >
              <ChevronLeft size={16} aria-hidden="true" />
              Zurück zum Praxisbereich
            </button>
          </div>
          <h2 className="section-label" id="praxis-detail-heading">
            {selectedTopicLabel}
          </h2>
          <div className="praxis-examples-list">
            {visibleExamples.map((ex) => (
              <div key={ex.id} className="praxis-example-card">
                <h3 className="praxis-example-title">{ex.title}</h3>
                <p className="praxis-example-situation">{ex.situation}</p>
                <div className="praxis-example-section">
                  <span className="praxis-example-label">So kann KI helfen:</span>
                  <p>{ex.kiHelp}</p>
                </div>
                <div className="praxis-example-section">
                  <span className="praxis-example-label">Möglicher Prompt:</span>
                  <p className="praxis-example-prompt">{ex.examplePrompt}</p>
                </div>
                <div className="praxis-example-section">
                  <span className="praxis-example-label">Grenzen:</span>
                  <p>{ex.kiLimits}</p>
                </div>
                <div className="praxis-example-section praxis-example-section--check">
                  <span className="praxis-example-label">Menschliche Prüfung:</span>
                  <p>{ex.humanCheck}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="screen-scroll">
      <OverviewButton onOverview={onOverview} />
      <section className="screen-section" aria-labelledby="praxis-examples-heading">
        <p className="section-label" id="praxis-examples-heading">
          Praxisbeispiele
        </p>
        <p className="lernen-area-intro">Wähle ein Thema, um die passenden Praxisbeispiele auf einer eigenen Seite zu öffnen.</p>
        <div className="praxis-topic-bar" role="group" aria-label="Praxisthemen">
          {praxisTopics.map((t) => (
            <button
              key={t.id}
              type="button"
              className="praxis-topic-btn"
              onClick={() => setSelectedTopic(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section className="screen-section" aria-labelledby="praxis-input-heading">
        <p className="section-label" id="praxis-input-heading">
          Eigene Frage oder Fall eingeben
        </p>
        <div className="praxis-input-block">
          <div className="form-field">
            <label htmlFor="praxis-input">Dein Anliegen oder Fall</label>
            <textarea
              id="praxis-input"
              className="text-input textarea-input"
              rows={3}
              placeholder="Beschreibe kurz, wobei KI helfen soll — nur fiktive Angaben…"
              value={praxisInput}
              onChange={(e) => {
                setPraxisInput(e.target.value);
                setPraxisResponse(null);
              }}
              aria-label="Dein Anliegen oder Fall"
            />
          </div>
          <button
            className="btn-primary"
            onClick={() => setPraxisResponse(detectPraxisResponse(praxisInput))}
            disabled={praxisInput.trim().length < 5}
          >
            Praxishinweis anzeigen
          </button>
        </div>

        {praxisResponse && (
          <div className="praxis-response" role="status" aria-live="polite" aria-atomic="true">
            <div className="praxis-response-section">
              <strong>So kann KI helfen:</strong>
              <p>{praxisResponse.kiHelp}</p>
            </div>
            <div className="praxis-response-section praxis-response-section--warn">
              <strong>Da kann KI eher nicht helfen:</strong>
              <p>{praxisResponse.kiCannotHelp}</p>
            </div>
            <div className="praxis-response-section">
              <strong>Möglicher Prompt:</strong>
              <p className="praxis-example-prompt">{praxisResponse.prompt}</p>
            </div>
            <div className="praxis-response-section praxis-response-section--check">
              <strong>Menschliche Prüfung:</strong>
              <p>{praxisResponse.humanCheck}</p>
            </div>
            <p className="info-note">Keine echten Kundendaten verwenden. KI liefert nur Orientierung.</p>
          </div>
        )}
      </section>
    </div>
  );
}

// ── Prüfen ─────────────────────────────────────────────────────────────────────

function PruefenScreen({ onOverview }: { onOverview: () => void }) {
  const [pruefInput, setPruefInput] = useState("");
  const [pruefResult, setPruefResult] = useState<PruefResult | null>(null);

  return (
    <div className="screen-scroll">
      <OverviewButton onOverview={onOverview} />
      <section className="screen-section" aria-labelledby="pruefen-heading">
        <p className="section-label" id="pruefen-heading">
          Fallbezogener Prüfweg
        </p>
        <p className="info-note">
          Gib einen fiktiven oder anonymisierten Fall ein. Die App zeigt mögliche Prüfschritte,
          Quellenarten und Nachlese-Hinweise. Fachliche und rechtliche Prüfung bleibt beim Menschen.
        </p>
        <div className="pruef-input-block">
          <div className="form-field">
            <label htmlFor="pruefen-input">Fall oder Thema eingeben</label>
            <textarea
              id="pruefen-input"
              className="text-input textarea-input"
              rows={3}
              placeholder="z. B. Bürgergeld, Einkommen und fehlende Unterlagen — nur fiktive Angaben…"
              value={pruefInput}
              onChange={(e) => {
                setPruefInput(e.target.value);
                setPruefResult(null);
              }}
              aria-label="Fall oder Thema eingeben"
            />
          </div>
          <button
            className="btn-primary"
            onClick={() => setPruefResult(detectPruefResult(pruefInput))}
            disabled={pruefInput.trim().length < 5}
          >
            Prüfweg anzeigen
          </button>
        </div>

        {pruefResult && (
          <div className="pruef-result" role="status" aria-live="polite" aria-atomic="true">
            <p className="section-label">Prüfweg: {pruefResult.type}</p>

            <div className="pruef-section">
              <strong>Möglicher Prüfpfad</strong>
              <ol className="pruef-list">
                {pruefResult.pruefpfad.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="pruef-section">
              <strong>Quellenarten</strong>
              <ul className="pruef-list">
                {pruefResult.quellenarten.map((src, i) => (
                  <li key={i}>{src}</li>
                ))}
              </ul>
            </div>

            <div className="pruef-section">
              <strong>Stichworte</strong>
              <div className="pruef-tags">
                {pruefResult.stichworte.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pruef-section">
              <strong>Hinweise und Nachlese</strong>
              <ul className="pruef-list">
                {pruefResult.hinweise.map((hint, i) => (
                  <li key={i}>{hint}</li>
                ))}
              </ul>
            </div>

            <div className="pruef-mandatory">
              KI zeigt nur Weg und Quellen. Fachliche und rechtliche Prüfung bleibt beim Menschen.
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────

export function App() {
  const isNarrow = useIsNarrowViewport();
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [tab, setTab] = useState<Tab>("home");
  const [openModuleId, setOpenModuleId] = useState<ModuleId | null>(null);
  const [lernenReturnArea, setLernenReturnArea] = useState<LearningArea>("overview");
  const [mythAnswers, setMythAnswers] = useState<Record<number, boolean>>({});
  const [caseChoice, setCaseChoice] = useState<string | null>(null);
  const [basicsAnswers, setBasicsAnswers] = useState<Record<number, number>>({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  const settingsWasOpenRef = useRef(false);

  useEffect(() => {
    if (!settingsOpen && settingsWasOpenRef.current) {
      settingsBtnRef.current?.focus();
    }
    settingsWasOpenRef.current = settingsOpen;
  }, [settingsOpen]);

  function updateState(next: AppState) {
    setState(next);
    saveAppState(next);
  }

  // Navigating to a main tab via the sidebar / bottom nav always starts at that
  // area's entry view. For "lernen" that means the three-card start selection,
  // never a previously opened sub-page.
  function navigateTab(next: Tab) {
    if (next === "lernen") setLernenReturnArea("overview");
    setTab(next);
  }

  const progress: AppProgress = {
    selectedRole: state.profile?.selectedRole ?? null,
    answers: state.progress.checkAnswers as Partial<CheckAnswers>,
    completedModules: state.progress.completedModules,
    completedChecklistItems: state.progress.completedChecklistItems
  };

  if (isNarrow) {
    return (
      <div className="desktop-notice">
        <div className="desktop-notice-box">
          <p>
            Diese Anwendung ist für die Nutzung am Dienst-PC gedacht. Bitte öffne sie in einem
            größeren Browserfenster.
          </p>
        </div>
      </div>
    );
  }

  if (!state.profile?.onboardingCompleted || needsReOnboarding(state)) {
    return (
      <div className="app-shell" data-theme="light" data-color="blau">
        <OnboardingScreen
          initialRole={state.profile?.selectedRole ?? null}
          initialFirstName={state.profile?.firstName ?? ""}
          onComplete={(profile, checkAnswers) =>
            updateState({ ...state, profile, progress: { ...state.progress, checkAnswers } })
          }
        />
      </div>
    );
  }

  if (openModuleId) {
    return (
      <div
        className="app-shell"
        data-theme={state.preferences.themeMode}
        data-color={state.preferences.colorTemplate}
      >
        <ModuleDetailScreen
          moduleId={openModuleId}
          progress={progress}
          onToggleComplete={() => {
            const already = state.progress.completedModules.includes(openModuleId);
            const next = already
              ? state.progress.completedModules.filter((id) => id !== openModuleId)
              : [...state.progress.completedModules, openModuleId];
            updateState({ ...state, progress: { ...state.progress, completedModules: next } });
          }}
          onBack={() => setOpenModuleId(null)}
        />
      </div>
    );
  }

  const profile = state.profile;

  return (
    <div
      className="app-shell"
      data-theme={state.preferences.themeMode}
      data-color={state.preferences.colorTemplate}
    >
      {settingsOpen && (
        <SettingsPanel
          state={state}
          onSave={updateState}
          onClose={() => setSettingsOpen(false)}
          onResetProfile={() => {
            if (
              !window.confirm(
                "Grundeingaben zurücksetzen? Vorname, Abteilung und Selbsteinschätzung werden gelöscht. Fortschritt und eigene Prompts bleiben erhalten."
              )
            )
              return;
            updateState({
              ...state,
              profile: null,
              progress: { ...state.progress, checkAnswers: {} }
            });
            setSettingsOpen(false);
          }}
          onResetDemo={() => {
            if (
              !window.confirm(
                "Demo komplett zurücksetzen? Alle Daten (Profil, Fortschritt, eigene Prompts) werden gelöscht und durch den Ausgangszustand ersetzt."
              )
            )
              return;
            updateState(createDefaultAppState());
            setSettingsOpen(false);
          }}
        />
      )}

      <TopBar
        firstName={profile.firstName}
        onLogoClick={() => setTab("home")}
        onSettingsOpen={() => setSettingsOpen(true)}
        settingsBtnRef={settingsBtnRef}
      />

      <div className="app-body">
        <DesktopNav activeTab={tab} onTab={navigateTab} />

        <main className="screen-main" id="main-content">
          {tab === "home" && (
            <HomeScreen
              progress={progress}
              firstName={profile.firstName}
              aiLevel={profile.aiLevel}
              onNavigate={navigateTab}
            />
          )}
          {tab === "lernen" && (
            <LernpfadScreen
              progress={progress}
              aiLevel={profile.aiLevel}
              onOpenModule={(id) => { setLernenReturnArea("modules"); setOpenModuleId(id); }}
              mythAnswers={mythAnswers}
              caseChoice={caseChoice}
              basicsAnswers={basicsAnswers}
              onMythAnswer={(idx, val) => setMythAnswers({ ...mythAnswers, [idx]: val })}
              onCaseChoice={setCaseChoice}
              onBasicsAnswer={(idx, val) => setBasicsAnswers({ ...basicsAnswers, [idx]: val })}
              onOverview={() => setTab("home")}
              initialArea={lernenReturnArea}
            />
          )}
          {tab === "praxis" && <PraxisScreen onOverview={() => setTab("home")} />}
          {tab === "pruefen" && <PruefenScreen onOverview={() => setTab("home")} />}
          {tab === "prompts" && (
            <PromptLibrary
              prompts={state.savedPrompts}
              onPromptsChange={(prompts) => updateState({ ...state, savedPrompts: prompts })}
              onOverview={() => setTab("home")}
            />
          )}
          {tab === "bakira" && (
            <BakiraWorkspaceScreen onBack={() => setTab("home")} />
          )}
        </main>
      </div>

      <BottomNav
        activeTab={tab}
        doneCount={state.progress.completedModules.length}
        onTab={navigateTab}
      />

    </div>
  );
}
