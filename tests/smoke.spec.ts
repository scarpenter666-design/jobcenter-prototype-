import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

// Wizard now: Step 1 Vorname, Step 2 Abteilung, Steps 3-8: 6 scale questions (WIZARD_TOTAL=8)
async function doOnboardingWizard(page: Page, score = "2") {
  // Step 1: Vorname
  await page.getByLabel("Vorname").fill("Sven");
  await page.getByRole("button", { name: "Weiter" }).click();
  // Step 2: Abteilung
  await page.getByRole("button", { name: /Leistungsbereich/ }).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  // Steps 3-7: five scale questions + Weiter each
  for (let i = 0; i < 5; i++) {
    await page.getByRole("group").getByRole("button", { name: score }).click();
    await page.getByRole("button", { name: "Weiter" }).click();
  }
  // Step 8: last scale question + App starten
  await page.getByRole("group").getByRole("button", { name: score }).click();
  await page.getByRole("button", { name: /App starten/ }).click();
}

async function completeOnboarding(page: Page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await doOnboardingWizard(page);
}

async function completeOnboardingHighScore(page: Page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await doOnboardingWizard(page, "4");
}

// ── Onboarding ────────────────────────────────────────────────────────────────

test.describe("Onboarding — first visit", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("first visit shows Willkommen, Vorname input, and step indicator Schritt 1 von 8", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Willkommen/ })).toBeVisible();
    await expect(page.getByLabel("Vorname")).toBeVisible();
    await expect(page.getByText(/Schritt 1 von 8/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Weiter" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Lernen" })).toHaveCount(0);
  });

  test("step 1 shows BA-portal welcome phrase and BAKIRA name but no service chips", async ({ page }) => {
    await expect(page.getByText(/Willkommen, wie können wir dich weiterbringen/)).toBeVisible();
    await expect(page.getByText(/BAKIRA begleitet dich/)).toBeVisible();
    await expect(page.locator(".wizard-service-chips")).toHaveCount(0);
  });

  test("onboarding header is red and shows logo and brand text", async ({ page }) => {
    const header = page.locator(".onboarding-portal-header");
    await expect(header).toBeVisible();
    await expect(header.getByText(/Digital souverän im Jobcenter/)).toBeVisible();
    await expect(header.locator(".logo-placeholder")).toHaveText("Jobcenter Logo");
    const bg = await header.evaluate((el) => getComputedStyle(el).backgroundColor);
    // red background: rgb(192, 0, 26)
    expect(bg).toMatch(/192|rgb/i);
  });

  test("wizard footer shows visual progress segments alongside step indicator", async ({ page }) => {
    await expect(page.getByText(/Schritt 1 von 8/)).toBeVisible();
    await expect(page.locator(".wizard-progress-segments")).toBeVisible();
  });

  test("Weiter is enabled after entering name and navigates to step 2", async ({ page }) => {
    await page.getByLabel("Vorname").fill("Sven");
    await expect(page.getByRole("button", { name: "Weiter" })).toBeEnabled();
    await page.getByRole("button", { name: "Weiter" }).click();
    await expect(page.getByText(/Schritt 2 von 8/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Zurück" })).toBeVisible();
  });

  test("wizard has no KI-Erfahrung step — after Abteilung step 3 is a scale question", async ({ page }) => {
    await page.getByLabel("Vorname").fill("Sven");
    await page.getByRole("button", { name: "Weiter" }).click();
    await page.getByRole("button", { name: /Leistungsbereich/ }).click();
    await page.getByRole("button", { name: "Weiter" }).click();
    await expect(page.getByText(/Schritt 3 von 8/)).toBeVisible();
    await expect(page.getByRole("group")).toBeVisible();
    // No KI-Erfahrung buttons (Einsteiger/Grundkenntnisse/Fortgeschritten)
    await expect(page.getByRole("button", { name: /Einsteiger/ })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Grundkenntnisse/ })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Fortgeschritten/ })).toHaveCount(0);
  });

  test("wizard runs through all 6 scale questions (steps 3-8)", async ({ page }) => {
    await page.getByLabel("Vorname").fill("Sven");
    await page.getByRole("button", { name: "Weiter" }).click();
    await page.getByRole("button", { name: /Leistungsbereich/ }).click();
    await page.getByRole("button", { name: "Weiter" }).click();
    for (let i = 3; i <= 7; i++) {
      await expect(page.getByText(new RegExp(`Schritt ${i} von 8`))).toBeVisible();
      await page.getByRole("group").getByRole("button", { name: "2" }).click();
      await page.getByRole("button", { name: "Weiter" }).click();
    }
    await expect(page.getByText(/Schritt 8 von 8/)).toBeVisible();
    await page.getByRole("group").getByRole("button", { name: "2" }).click();
    await expect(page.getByRole("button", { name: /App starten/ })).toBeEnabled();
  });

  test("completed wizard saves profile and opens personalized app", async ({ page }) => {
    await doOnboardingWizard(page);
    await expect(page.getByText(/Hallo Sven/)).toBeVisible();
    await page.reload();
    await expect(page.getByText(/Hallo Sven/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Lernen", exact: true })).toBeVisible();
  });
});

// ── Learning flow ─────────────────────────────────────────────────────────────

test.describe("Learning flow", () => {
  test.beforeEach(async ({ page }) => {
    await completeOnboarding(page);
  });

  test("after onboarding home shows department as context and no selection cards", async ({
    page
  }) => {
    await expect(page.locator(".role-grid")).toHaveCount(0);
    await expect(page.getByText(/Abteilung:.*Leistungsbereich/)).toBeVisible();
  });

  test("settings shows Abteilung as read-only text (no select)", async ({ page }) => {
    await page.getByRole("button", { name: /Benutzermenue|Einstellungen/ }).click();
    await expect(page.locator(".settings-readonly-value")).toBeVisible();
    // only theme + color selects remain — no Abteilung select
    await expect(page.locator(".settings-panel select")).toHaveCount(2);
  });

  test("home shows orientation summary and no self-assessment questions after onboarding", async ({ page }) => {
    await expect(page.getByRole("group")).toHaveCount(0);
    await expect(page.getByText(/Dein Startpunkt/)).toBeVisible();
  });

  test("Lernen tab shows 3 area entry cards in overview", async ({ page }) => {
    await page.getByRole("button", { name: "Lernen", exact: true }).click();
    await expect(page.getByRole("button", { name: /Dein Lernbereich öffnen/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Mythos oder Realität öffnen/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Praxisfallbeispiele öffnen/ })).toBeVisible();
  });

  test("Lernen overview area card navigates to modules and back", async ({ page }) => {
    await page.getByRole("button", { name: "Lernen", exact: true }).click();
    await page.getByRole("button", { name: /Dein Lernbereich öffnen/ }).click();
    await expect(page.getByRole("button", { name: /Angepasst an dein KI-Level/ })).toBeVisible();
    await page.getByRole("button", { name: /Zurück zum Lernbereich/ }).click();
    await expect(page.getByRole("button", { name: /Dein Lernbereich öffnen/ })).toBeVisible();
  });

  test("module card flow completes and toggles done badge", async ({ page }) => {
    await page.getByRole("button", { name: "Lernen", exact: true }).click();
    await page.getByRole("button", { name: /Dein Lernbereich öffnen/ }).click();
    // The module lives in the "Dein Bereich" section (general section was removed here).
    await page.getByRole("button", { name: /Nachforderung prüfen/ }).click();
    await expect(page.getByRole("button", { name: /Weiter/ })).toBeVisible();
    await page.getByRole("button", { name: /Weiter/ }).click();
    await page.getByRole("button", { name: /Weiter/ }).click();
    await expect(page.getByRole("button", { name: /Modul abschlie/ })).toBeVisible();
    await page.getByRole("button", { name: /Modul abschlie/ }).click();
    await page.getByRole("button", { name: "Zurück zum Lernpfad" }).click();
    await expect(page.getByText("Fertig").first()).toBeVisible();
  });

  test("learning area shows only the department section, not the general KI basics section", async ({
    page
  }) => {
    await page.getByRole("button", { name: "Lernen", exact: true }).click();
    await page.getByRole("button", { name: /Dein Lernbereich öffnen/ }).click();
    // Department section stays, the general "KI-Grundlagen für alle" section is gone.
    await expect(page.getByRole("heading", { name: "Dein Bereich: Leistungsbereich" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "KI-Grundlagen für alle" })).toHaveCount(0);
    await expect(page.getByText("Bürgergeld und Anspruch einordnen")).toBeVisible();
    await expect(page.getByText("KI einfach erklärt")).toHaveCount(0);
  });

  test("myth quiz opens from Lernen overview and shows correct feedback after answer", async ({ page }) => {
    await page.getByRole("button", { name: "Lernen", exact: true }).click();
    await page.getByRole("button", { name: /Mythos oder Realität öffnen/ }).click();
    await expect(page.getByText("Mythos oder Realität?")).toBeVisible();
    await page.locator(".myth-card").first().getByRole("button", { name: "Mythos" }).click();
    await expect(page.locator(".myth-feedback").first()).toBeVisible();
  });

  test("praxisfall opens from Lernen overview, shows hint and gives feedback after answer", async ({ page }) => {
    await page.getByRole("button", { name: "Lernen", exact: true }).click();
    await page.getByRole("button", { name: /Praxisfallbeispiele öffnen/ }).click();
    await expect(page.locator(".case-action-hint")).toBeVisible();
    await page.getByRole("button", { name: /Fachregel, Datenumfang/ }).click();
    await expect(page.getByText("Sicherer Weg")).toBeVisible();
    await expect(page.getByText("KI-Texte sind Arbeitsentwürfe")).toBeVisible();
  });

  test("Prüfen tab shows case input and generates Prüfweg with sources", async ({ page }) => {
    await page.getByRole("button", { name: "Prüfen" }).click();
    await expect(page.getByLabel("Fall oder Thema eingeben")).toBeVisible();
    await expect(page.getByText("Quelle oder Fachregel gegenprüfen")).toHaveCount(0);
    await page.getByLabel("Fall oder Thema eingeben").fill("Bürgergeld, Einkommen und fehlende Unterlagen");
    await page.getByRole("button", { name: "Prüfweg anzeigen" }).click();
    await expect(page.locator(".pruef-result")).toBeVisible();
    await expect(page.locator(".pruef-mandatory")).toBeVisible();
  });
});

// ── Praxis ────────────────────────────────────────────────────────────────────

test("Praxis tab shows example cards after topic selection and no Mythos/Realität buttons", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Praxis" }).click();
  await page.getByRole("button", { name: "Leistungsbereich" }).click();
  await expect(page.locator(".praxis-example-card").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Mythos" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Realität" })).toHaveCount(0);
});

test("Praxis tab input shows KI help response after submitting a case", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Praxis" }).click();
  await page.getByLabel("Dein Anliegen oder Fall").fill("Ich möchte eine E-Mail an einen Bürger formulieren");
  await page.getByRole("button", { name: "Praxishinweis anzeigen" }).click();
  await expect(page.locator(".praxis-response")).toBeVisible();
});

// ── Responsive layout ─────────────────────────────────────────────────────────

test("desktop viewport uses a desktop app layout without horizontal overflow", async ({ page }) => {
  await completeOnboarding(page);
  await page.setViewportSize({ width: 1366, height: 768 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(overflow).toBe(false);
  await expect(page.locator(".desktop-nav")).toBeVisible();
});

test("small viewport under 900px shows desktop hint and no bottom navigation", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByText(/Dienst-PC/)).toBeVisible();
  await expect(page.locator(".bottom-nav")).toHaveCount(0);
});

// ── Settings ──────────────────────────────────────────────────────────────────

test("settings update name, theme and color template persistently", async ({
  page
}) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: /Benutzermenue|Einstellungen/ }).click();
  await page.getByLabel("Vorname").fill("Mara");
  await page.getByLabel("Darstellung").selectOption("dark");
  await page.getByLabel("Farbtemplate").selectOption("gruen");
  await page.getByRole("button", { name: /Speichern/ }).click();
  await expect(page.getByText(/Hallo Mara/)).toBeVisible();
  await expect(page.locator(".app-shell")).toHaveAttribute("data-color", "gruen");
  await page.reload();
  await expect(page.getByText(/Hallo Mara/)).toBeVisible();
  await expect(page.locator(".app-shell")).toHaveAttribute("data-color", "gruen");
});

test("settings panel has no KI-Erfahrung field", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: /Benutzermenue|Einstellungen/ }).click();
  await expect(page.getByLabel("KI-Erfahrung")).toHaveCount(0);
});

// ── TopBar and Home layout ────────────────────────────────────────────────────

test("app header shows logo placeholder and no progress bar", async ({ page }) => {
  await completeOnboarding(page);
  await expect(page.locator(".top-bar .logo-placeholder")).toHaveText("Jobcenter Logo");
  await expect(page.locator(".top-progress")).toHaveCount(0);
  await expect(page.locator(".top-progress-track")).toHaveCount(0);
});

test("home shows no Fortschritt block and no Zum Lernpfad button", async ({ page }) => {
  await completeOnboarding(page);
  await expect(page.getByText(/^Fortschritt$/).first()).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Zum Lernpfad/ })).toHaveCount(0);
  await expect(page.locator(".progress-card")).toHaveCount(0);
});

// ── Prompt editor back button ─────────────────────────────────────────────────

test("prompt editor has Zurück zur Prompt-Bibliothek button that works without any input", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Prompts" }).click();
  await page.getByRole("button", { name: /Neuer Prompt/ }).click();
  await expect(page.getByRole("button", { name: /Zurück zur Prompt-Bibliothek/ })).toBeVisible();
  await page.getByRole("button", { name: /Zurück zur Prompt-Bibliothek/ }).click();
  await expect(page.getByRole("heading", { name: /Prompt-Bibliothek/ })).toBeVisible();
});

// ── Settings — JOB-APP-11 ─────────────────────────────────────────────────────

test("settings theme select has no System option and has Hell and Dunkel", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: /Benutzermenue|Einstellungen/ }).click();
  const themeSelect = page.getByLabel("Darstellung");
  await expect(themeSelect.locator("option[value='system']")).toHaveCount(0);
  await expect(themeSelect.locator("option[value='light']")).toHaveCount(1);
  await expect(themeSelect.locator("option[value='dark']")).toHaveCount(1);
});

test("settings color select has Rot option and no Neutral option", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: /Benutzermenue|Einstellungen/ }).click();
  const colorSelect = page.getByLabel("Farbtemplate");
  await expect(colorSelect.locator("option[value='rot']")).toHaveCount(1);
  await expect(colorSelect.locator("option[value='neutral']")).toHaveCount(0);
});

test("rot color template applies red primary color to app shell", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: /Benutzermenue|Einstellungen/ }).click();
  await page.getByLabel("Farbtemplate").selectOption("rot");
  await page.getByRole("button", { name: /Speichern/ }).click();
  await expect(page.locator(".app-shell")).toHaveAttribute("data-color", "rot");
});

// ── BAKIRA workspace ──────────────────────────────────────────────────────────

test("BAKIRA fragen on home navigates to BAKIRA workspace tab", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: /BAKIRA fragen/ }).click();
  await expect(page.getByText(/BAKIRA Workspace/)).toBeVisible();
  await expect(page.getByText(/Schnellaktionen/)).toBeVisible();
});

test("BAKIRA workspace shows all four action cards", async ({ page }) => {
  await completeOnboarding(page);
  await page.locator(".desktop-nav-item", { hasText: "BAKIRA" }).click();
  await expect(page.getByRole("button", { name: /Dokument zusammenfassen/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Text vereinfachen/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Antwortentwurf erstellen/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Datenschutz prüfen/ })).toBeVisible();
});

test("BAKIRA workspace action card appends a response in chat", async ({ page }) => {
  await completeOnboarding(page);
  await page.locator(".desktop-nav-item", { hasText: "BAKIRA" }).click();
  await page.getByRole("button", { name: /Text vereinfachen/ }).click();
  await expect(page.locator(".bkira-msg--bkira").first()).toBeVisible();
});

test("BAKIRA workspace chat input sends and receives a message", async ({ page }) => {
  await completeOnboarding(page);
  await page.locator(".desktop-nav-item", { hasText: "BAKIRA" }).click();
  await page.getByLabel("Nachricht an BAKIRA Workspace").fill("Wie schreibe ich einen guten Prompt?");
  await page.getByRole("button", { name: "Senden" }).click();
  await expect(page.locator(".bkira-msg--user").first()).toBeVisible();
  await expect(page.locator(".bkira-msg--bkira").first()).toBeVisible();
});

test("BAKIRA workspace has document upload demo area", async ({ page }) => {
  await completeOnboarding(page);
  await page.locator(".desktop-nav-item", { hasText: "BAKIRA" }).click();
  await expect(page.getByText(/Dokument hochladen/)).toBeVisible();
  await expect(page.locator("#bakira-ws-file")).toBeAttached();
  await expect(page.getByText(/Keine echten Dateien/)).toBeVisible();
});

test("BAKIRA workspace translation demo shows translated text on language click", async ({ page }) => {
  await completeOnboarding(page);
  await page.locator(".desktop-nav-item", { hasText: "BAKIRA" }).click();
  await expect(page.getByText(/Übersetzungs-Demo/)).toBeVisible();
  await page.getByRole("button", { name: "Arabisch" }).click();
  await expect(page.getByText(/مستندك/)).toBeVisible();
});

test("BAKIRA workspace back button returns to home tab", async ({ page }) => {
  await completeOnboarding(page);
  await page.locator(".desktop-nav-item", { hasText: "BAKIRA" }).click();
  await page.getByRole("button", { name: /Zurück zur Übersicht/ }).click();
  await expect(page.getByText(/Hallo Sven/)).toBeVisible();
});

// ── BAKIRA naming ─────────────────────────────────────────────────────────────

test("visible BAKIRA name is used throughout the UI", async ({ page }) => {
  await completeOnboarding(page);
  await expect(page.getByRole("button", { name: /BAKIRA fragen/ })).toBeVisible();
  // No floating BAKIRA button — workspace is reached via navigation
  await expect(page.getByRole("button", { name: /BAKIRA öffnen|BAKIRA oeffnen/ })).toHaveCount(0);
});

// ── Prompt library ────────────────────────────────────────────────────────────

test("prompt library searches built-in prompts", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Prompts" }).click();
  await expect(page.getByRole("heading", { name: /Prompt-Bibliothek/ })).toBeVisible();
  await page.getByRole("button", { name: "Alle Prompts" }).click();
  await page.getByLabel("Prompts suchen").fill("Datenschutz");
  await expect(page.getByText("Datenschutz-Check für einen Entwurf")).toBeVisible();
  await expect(page.getByText("Bürgerfreundlich umformulieren")).toHaveCount(0);
});

test("custom prompt can be created, edited, deleted and persists locally", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Prompts" }).click();
  await page.getByRole("button", { name: /Neuer Prompt/ }).click();
  await page.getByLabel("Titel").fill("Mein Testprompt");
  await page.getByLabel("Prompttext").fill("Erstelle eine sichere Checkliste fuer fiktive Beispiele.");
  await page.getByRole("button", { name: /Speichern/ }).click();
  await expect(page.getByText("Mein Testprompt")).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Prompts" }).click();
  await page.getByRole("button", { name: "Alle Prompts" }).click();
  await expect(page.getByText("Mein Testprompt")).toBeVisible();
  await page.getByRole("button", { name: /Mein Testprompt bearbeiten/ }).click();
  await page.getByLabel("Titel").fill("Mein geaenderter Prompt");
  await page.getByRole("button", { name: /Speichern/ }).click();
  await expect(page.getByText("Mein geaenderter Prompt")).toBeVisible();
  await page.getByRole("button", { name: /Mein geaenderter Prompt loeschen/ }).click();
  await expect(page.getByText("Mein geaenderter Prompt")).toHaveCount(0);
});

// ── Prompt Generator ──────────────────────────────────────────────────────────

test("prompt generator shows BAKIRA Promptgenerator heading in Prompts tab", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Prompts" }).click();
  await expect(page.getByText(/BAKIRA Promptgenerator/)).toBeVisible();
  await expect(page.getByLabel("Dein Anliegen")).toBeVisible();
});

test("prompt generator creates a structured prompt from an Anliegen", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Prompts" }).click();
  await page.locator("#gen-concern").fill(
    "Ich moechte eine email an einen Buerger formulieren"
  );
  await page.getByRole("button", { name: /Prompt generieren/ }).click();
  await expect(page.locator(".gen-result")).toBeVisible();
  await expect(page.locator(".gen-preview")).toContainText("Aufgabe:");
  await expect(page.locator(".gen-preview")).toContainText("Prüfung/Rückfragen:");
});

test("generated prompt can be saved and appears in library after reload", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Prompts" }).click();
  await page.locator("#gen-concern").fill(
    "Ich moechte eine email an einen Buerger formulieren"
  );
  await page.getByRole("button", { name: /Prompt generieren/ }).click();
  await expect(page.locator(".gen-result")).toBeVisible();
  await page.getByRole("button", { name: /In Bibliothek speichern/ }).click();
  await expect(page.getByText(/Generierter Prompt:/)).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Prompts" }).click();
  await page.getByRole("button", { name: "Alle Prompts" }).click();
  await expect(page.getByText(/Generierter Prompt:/)).toBeVisible();
});

test("prompt generator shows validation hint when Anliegen is too short", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Prompts" }).click();
  await page.locator("#gen-concern").fill("kurz");
  await page.getByRole("button", { name: /Prompt generieren/ }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("BAKIRA");
});

test("prompt generator handles natural German input with umlauts correctly", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Prompts" }).click();
  await page.locator("#gen-concern").fill("Erkläre mir bitte Bürgergeld auf einfache Weise");
  await page.getByRole("button", { name: /Prompt generieren/ }).click();
  await expect(page.locator(".gen-result")).toBeVisible();
  // Should produce Erklaer-Prompt, not generic fallback
  await expect(page.locator(".gen-preview")).toContainText("Erkläre das folgende Thema");
  await expect(page.locator(".gen-preview")).toContainText("Prüfung/Rückfragen:");
});

// ── Reset functions ───────────────────────────────────────────────────────────

test("Grundeingaben neu einrichten resets profile but keeps custom prompt", async ({ page }) => {
  await completeOnboarding(page);

  // Add a custom prompt before reset
  await page.getByRole("button", { name: "Prompts" }).click();
  await page.getByRole("button", { name: /Neuer Prompt/ }).click();
  await page.getByLabel("Titel").fill("Behaltener Prompt");
  await page.getByLabel("Prompttext").fill("Dieser Prompt soll nach Reset erhalten bleiben.");
  await page.getByRole("button", { name: /Speichern/ }).click();
  await expect(page.getByText("Behaltener Prompt")).toBeVisible();

  // Open settings and reset profile
  await page.getByRole("button", { name: /Benutzermenue|Einstellungen/ }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: /Grundeingaben neu einrichten/ }).click();

  // App should show onboarding
  await expect(page.getByRole("heading", { name: /Willkommen/ })).toBeVisible();

  // Complete onboarding again via wizard
  await doOnboardingWizard(page);

  // Custom prompt should still be there (tab persists on "prompts" after re-onboarding)
  await page.getByRole("button", { name: "Prompts", exact: true }).click();
  await page.getByRole("button", { name: "Alle Prompts" }).click();
  await expect(page.getByText("Behaltener Prompt")).toBeVisible();
});

test("Demo komplett zuruecksetzen removes custom prompts and progress", async ({ page }) => {
  await completeOnboarding(page);

  // Add a custom prompt
  await page.getByRole("button", { name: "Prompts" }).click();
  await page.getByRole("button", { name: /Neuer Prompt/ }).click();
  await page.getByLabel("Titel").fill("Zu loeschender Prompt");
  await page.getByLabel("Prompttext").fill("Dieser Prompt soll nach Demo-Reset verschwinden.");
  await page.getByRole("button", { name: /Speichern/ }).click();
  await expect(page.getByText("Zu loeschender Prompt")).toBeVisible();

  // Open settings and full reset
  await page.getByRole("button", { name: /Benutzermenue|Einstellungen/ }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: /Demo komplett zurücksetzen/ }).click();

  // App should show onboarding
  await expect(page.getByRole("heading", { name: /Willkommen/ })).toBeVisible();

  // Complete onboarding fresh via wizard
  await doOnboardingWizard(page);

  // Custom prompt should be gone (tab persists on "prompts" after re-onboarding)
  await page.getByRole("button", { name: "Prompts", exact: true }).click();
  await page.getByRole("button", { name: "Alle Prompts" }).click();
  await expect(page.getByText("Zu loeschender Prompt")).toHaveCount(0);
});

// ── Home recommendation blocker ───────────────────────────────────────────────

// ── Re-onboarding: old v2 profile migration (JOB-APP-11) ─────────────────────

test.describe("Re-onboarding for old v2 profile with 4 checkAnswers (JOB-APP-11)", () => {
  async function seedOldV2State(page: Page) {
    await page.evaluate(() => {
      const oldState = {
        schemaVersion: 2,
        profile: {
          firstName: "Alt",
          selectedRole: "leistung",
          aiLevel: "einsteiger",
          onboardingCompleted: true
        },
        preferences: { themeMode: "light", colorTemplate: "blau" },
        progress: {
          completedModules: [],
          completedChecklistItems: [],
          checkAnswers: { confidence: 4, rules: 4, dataSafety: 4, reviewSkill: 4 }
        },
        savedPrompts: []
      };
      localStorage.setItem("jc-lernapp-claude-v2", JSON.stringify(oldState));
    });
    await page.reload();
  }

  test("old v2 profile with only 4 checkAnswers triggers re-onboarding wizard", async ({ page }) => {
    await page.goto("/");
    await seedOldV2State(page);

    await expect(page.getByRole("heading", { name: /Willkommen/ })).toBeVisible();
    await expect(page.getByLabel("Vorname")).toHaveValue("Alt");
  });

  test("re-onboarding pre-selects role and after completion aiLevel is recalculated", async ({ page }) => {
    await page.goto("/");
    await seedOldV2State(page);

    // Step 1: Vorname is pre-filled — just proceed
    await page.getByRole("button", { name: "Weiter" }).click();
    // Step 2: Leistungsbereich is pre-selected from old profile — just proceed
    await page.getByRole("button", { name: "Weiter" }).click();
    // Steps 3-7: five scale questions with score 3
    for (let i = 0; i < 5; i++) {
      await page.getByRole("group").getByRole("button", { name: "3" }).click();
      await page.getByRole("button", { name: "Weiter" }).click();
    }
    // Step 8: last scale question
    await page.getByRole("group").getByRole("button", { name: "3" }).click();
    await page.getByRole("button", { name: /App starten/ }).click();

    // App opens with correct name and recalculated aiLevel (6×3=18 → grundkenntnisse)
    await expect(page.getByText(/Hallo Alt/)).toBeVisible();
    await expect(page.getByText(/KI-Level: Grundkenntnisse/)).toBeVisible();
    // "Dein Startpunkt" must now appear because all 6 answers are present
    await expect(page.getByText(/Dein Startpunkt/)).toBeVisible();
  });
});

test("high self-assessment score shows Praxis vertiefen and recommends nachforderung module", async ({
  page
}) => {
  await completeOnboardingHighScore(page);

  // Confidence profile level should be shown
  await expect(page.getByText(/Dein Startpunkt: Praxis vertiefen/)).toBeVisible();

  // The "Empfohlener naechster Schritt" section should show Nachforderung prüfen
  const nextStepSection = page.locator("section").filter({ hasText: "Empfohlener nächster Schritt" });
  await expect(nextStepSection.getByText(/Nachforderung prüfen/)).toBeVisible();

  // And must NOT show "KI einfach erklärt" as the recommended next step
  await expect(nextStepSection.getByText(/KI einfach erklärt/)).toHaveCount(0);
});

// ── Visual polish: dark+rot praxis readability (JOB-APP-12) ─────────────────

// WCAG contrast helpers
function parseRgb(cssColor: string): [number, number, number] | null {
  const m = cssColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!m) return null;
  return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(fg: [number, number, number], bg: [number, number, number]): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

test("Praxis tab example cards are visible in dark+rot theme", async ({ page }) => {
  await completeOnboarding(page);

  // Switch to dark theme + rot color template via settings
  await page.getByRole("button", { name: /Benutzermenue|Einstellungen/ }).click();
  await page.getByLabel("Darstellung").selectOption("dark");
  await page.getByLabel("Farbtemplate").selectOption("rot");
  await page.getByRole("button", { name: /Speichern/ }).click();

  await expect(page.locator(".app-shell")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator(".app-shell")).toHaveAttribute("data-color", "rot");

  await page.getByRole("button", { name: "Praxis" }).click();
  await page.getByRole("button", { name: "Leistungsbereich" }).click();
  const firstCard = page.locator(".praxis-example-card").first();
  await expect(firstCard).toBeVisible();

  // Title and situation text must be in the DOM and not empty
  const title = firstCard.locator(".praxis-example-title").first();
  await expect(title).toBeVisible();
  const titleText = await title.textContent();
  expect((titleText ?? "").trim().length).toBeGreaterThan(0);

  // Contrast check: .praxis-example-section and .praxis-example-prompt must meet WCAG AA (>=4.5)
  const contrastResults = await page.evaluate(() => {
    function getStyles(sel: string) {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { color: cs.color, bg: cs.backgroundColor };
    }
    return {
      section: getStyles(".praxis-example-section"),
      prompt: getStyles(".praxis-example-prompt")
    };
  });

  for (const [label, styles] of Object.entries(contrastResults)) {
    if (!styles) continue;
    const fg = parseRgb(styles.color);
    const bg = parseRgb(styles.bg);
    if (!fg || !bg) continue;
    const ratio = contrastRatio(fg, bg);
    expect(ratio, `${label} contrast ratio ${ratio.toFixed(2)} must be >= 4.5`).toBeGreaterThanOrEqual(4.5);
  }
});

// ── Accessibility (JOB-APP-13) ────────────────────────────────────────────────

test("onboarding scale buttons have descriptive accessible names", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // Navigate to first scale question (step 3)
  await page.getByLabel("Vorname").fill("Test");
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByRole("button", { name: /Leistungsbereich/ }).click();
  await page.getByRole("button", { name: "Weiter" }).click();

  // Scale buttons must have descriptive aria-labels, not just "1"/"2"/"3"/"4"
  await expect(page.getByRole("button", { name: "1 – trifft nicht zu" })).toBeVisible();
  await expect(page.getByRole("button", { name: "2 – trifft eher nicht zu" })).toBeVisible();
  await expect(page.getByRole("button", { name: "3 – trifft eher zu" })).toBeVisible();
  await expect(page.getByRole("button", { name: "4 – trifft voll zu" })).toBeVisible();
});

test("settings dialog opens with focus inside, Escape closes it, focus returns to trigger", async ({ page }) => {
  await completeOnboarding(page);

  const settingsBtn = page.getByRole("button", { name: /Benutzermenue|Einstellungen/ });
  await settingsBtn.click();

  // Dialog should be visible and have a focusable element inside
  const dialog = page.locator('[role="dialog"][aria-label="Einstellungen"]');
  await expect(dialog).toBeVisible();

  // A focusable element inside dialog should have focus
  const focused = page.locator(':focus');
  const isInsideDialog = await dialog.locator(':focus').count();
  expect(isInsideDialog).toBeGreaterThan(0);

  // Escape should close the dialog
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);

  // Focus should return to the settings trigger button
  const isFocused = await settingsBtn.evaluate((el) => el === document.activeElement);
  expect(isFocused).toBe(true);
});

test("no floating BAKIRA button is present after onboarding", async ({ page }) => {
  await completeOnboarding(page);
  // Floating FAB was removed — workspace is accessed via the BAKIRA nav tab
  await expect(page.locator(".bkira-fab")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /BAKIRA öffnen|BAKIRA oeffnen/ })).toHaveCount(0);
});

test("BAKIRA workspace chat messages appear inside an aria-live region", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "BAKIRA", exact: true }).click();

  // .bakira-ws-messages has aria-live="polite"
  await expect(page.locator(".bakira-ws-messages[aria-live]")).toBeAttached();

  await page.getByLabel("Nachricht an BAKIRA Workspace").fill("Wie schreibe ich einen guten Prompt?");
  await page.getByRole("button", { name: "Senden" }).click();
  await expect(page.locator(".bkira-msg--bkira").first()).toBeVisible();
});

test("prompt generator result area has role=status for screen reader announcement", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Prompts" }).click();

  await page.locator("#gen-concern").fill("Ich möchte einen Antrag formulieren");
  await page.getByRole("button", { name: /Prompt generieren/ }).click();

  // .gen-result itself has role="status" applied directly
  await expect(page.locator('.gen-result[role="status"]')).toBeAttached();
});

test("prefers-reduced-motion: transition durations are negligible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await completeOnboarding(page);

  // Navigate to prompts tab where btn-primary buttons are always rendered
  await page.getByRole("button", { name: "Prompts" }).click();

  const transitionDuration = await page.evaluate(() => {
    const btn = document.querySelector<HTMLElement>(".btn-primary");
    if (!btn) return null;
    return getComputedStyle(btn).transitionDuration;
  });

  expect(transitionDuration).not.toBeNull();
  // Under prefers-reduced-motion: reduce the duration should be 0.01ms
  const raw = transitionDuration ?? "1s";
  const durationMs = parseFloat(raw) * (raw.endsWith("ms") ? 1 : 1000);
  expect(durationMs).toBeLessThanOrEqual(0.02);
});

test("prompt editor opens with title input focused, Escape closes it and returns focus to new button", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Prompts" }).click();

  const newBtn = page.getByRole("button", { name: "+ Neuer Prompt" });
  await newBtn.click();

  // Title input should be focused after editor opens
  const titleInput = page.locator("#edit-title");
  await expect(titleInput).toBeFocused();

  // Escape closes the editor
  await page.keyboard.press("Escape");
  await expect(titleInput).not.toBeAttached();

  // Focus returns to the "+ Neuer Prompt" button
  await expect(newBtn).toBeFocused();
});

test("BAKIRA workspace upload button is keyboard focusable with visible outline", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "BAKIRA", exact: true }).click();

  const uploadBtn = page.getByRole("button", { name: "Datei auswählen (Demo)" });
  await expect(uploadBtn).toBeVisible();

  // Focus the button programmatically and verify it receives focus
  await uploadBtn.focus();
  await expect(uploadBtn).toBeFocused();

  // Verify the global focus-visible CSS rule covers this button (outline ≠ "none" when keyboard-focused)
  const hasFocusVisibleRule = await page.evaluate(() => {
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules)) {
          if (rule.cssText.includes("focus-visible") && rule.cssText.includes("outline")) {
            return true;
          }
        }
      } catch { /* cross-origin sheet */ }
    }
    return false;
  });
  expect(hasFocusVisibleRule).toBe(true);
});

// ── Adaptive learning, overview buttons, category filters (JOB-APP-16) ─────────

test("einsteiger and fortgeschritten onboarding show different Mythos questions", async ({ page }) => {
  // Low score → einsteiger
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Lernen", exact: true }).click();
  await page.getByRole("button", { name: /Mythos oder Realität öffnen/ }).click();
  await expect(
    page.getByText("KI kann Fachentscheidungen automatisch rechtssicher treffen.")
  ).toBeVisible();
  await expect(page.getByText(/DSGVO-konform beworben/)).toHaveCount(0);

  // High score → fortgeschritten
  await completeOnboardingHighScore(page);
  await page.getByRole("button", { name: "Lernen", exact: true }).click();
  await page.getByRole("button", { name: /Mythos oder Realität öffnen/ }).click();
  await expect(page.getByText(/DSGVO-konform beworben/)).toBeVisible();
  await expect(
    page.getByText("KI kann Fachentscheidungen automatisch rechtssicher treffen.")
  ).toHaveCount(0);
});

test("Dein Lernbereich shows level-adaptive Lernfragen after clicking the KI-Level card", async ({ page }) => {
  await completeOnboardingHighScore(page);
  await page.getByRole("button", { name: "Lernen", exact: true }).click();
  await page.getByRole("button", { name: /Dein Lernbereich öffnen/ }).click();
  await expect(page.getByText(/Lernfragen für dein Level/)).toBeVisible();
  await page.getByRole("button", { name: /Angepasst an dein KI-Level/ }).click();
  await expect(
    page.getByText(/KI-Kompetenz heisst, Nutzen und Grenzen im konkreten Arbeitskontext/)
  ).toBeVisible();
});

test("Lernen shows a KI-Level badge that reflects the onboarding result", async ({ page }) => {
  // Low score → Einsteiger
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Lernen", exact: true }).click();
  await page.getByRole("button", { name: /Mythos oder Realität öffnen/ }).click();
  await expect(page.locator(".level-badge")).toHaveText(/Einsteiger/);

  // High score → Fortgeschritten
  await completeOnboardingHighScore(page);
  await page.getByRole("button", { name: "Lernen", exact: true }).click();
  await page.getByRole("button", { name: /Mythos oder Realität öffnen/ }).click();
  await expect(page.locator(".level-badge")).toHaveText(/Fortgeschritten/);
});

test("Lernen tab has an Übersicht button that returns to home", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Lernen", exact: true }).click();
  await page.locator(".screen-overview-btn").click();
  await expect(page.getByText(/Hallo Sven/)).toBeVisible();
});

test("Praxis tab has Übersicht button, topic selection and no cards until a topic is chosen", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Praxis" }).click();
  await expect(page.locator(".screen-overview-btn")).toBeVisible();
  await expect(page.locator(".praxis-topic-bar")).toBeVisible();
  await expect(page.locator(".praxis-example-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Eingangszone und Service" }).click();
  await expect(page.locator(".praxis-example-card").first()).toBeVisible();
  // Übersicht button returns to home
  await page.locator(".screen-overview-btn").click();
  await expect(page.getByText(/Hallo Sven/)).toBeVisible();
});

test("Prüfen tab has an Übersicht button and Prüfweg still works", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Prüfen" }).click();
  await expect(page.locator(".screen-overview-btn")).toBeVisible();
  await page.getByLabel("Fall oder Thema eingeben").fill("Bürgergeld, Einkommen und fehlende Unterlagen");
  await page.getByRole("button", { name: "Prüfweg anzeigen" }).click();
  await expect(page.locator(".pruef-result")).toBeVisible();
  await page.locator(".screen-overview-btn").click();
  await expect(page.getByText(/Hallo Sven/)).toBeVisible();
});

test("Prompts tab has Übersicht button, category selection and no cards until a category is chosen", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Prompts" }).click();
  await expect(page.locator(".screen-overview-btn")).toBeVisible();
  await expect(page.locator(".prompt-category-bar")).toBeVisible();
  await expect(page.locator(".prompt-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Alle Prompts" }).click();
  await expect(page.locator(".prompt-card").first()).toBeVisible();
});

test("prompt search works within the selected category", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Prompts" }).click();
  await page.getByRole("button", { name: "Datenschutz und Sicherheit" }).click();
  await expect(page.getByText("Datenschutz-Check für einen Entwurf")).toBeVisible();
  await page.getByLabel("Prompts suchen").fill("Datenschutz");
  await expect(page.getByText("Datenschutz-Check für einen Entwurf")).toBeVisible();
  // A non-datenschutz prompt is not in this category
  await expect(page.getByText("Bürgerfreundlich umformulieren")).toHaveCount(0);
});

test("dark theme active desktop navigation uses white text for rot, gruen and blau", async ({ page }) => {
  await completeOnboarding(page);
  for (const color of ["rot", "gruen", "blau"]) {
    await page.getByRole("button", { name: /Benutzermenue|Einstellungen/ }).click();
    await page.getByLabel("Darstellung").selectOption("dark");
    await page.getByLabel("Farbtemplate").selectOption(color);
    await page.getByRole("button", { name: /Speichern/ }).click();
    await expect(page.locator(".app-shell")).toHaveAttribute("data-color", color);
    // toHaveCSS auto-retries, so it waits out the 0.1s color transition.
    await expect(
      page.locator(".desktop-nav-item.active"),
      `${color} active desktop nav text color`
    ).toHaveCSS("color", "rgb(255, 255, 255)");
  }
});

// ── Lern-, Praxis-, Prompt-Navigation Rework (2026-06-05) ──────────────────────

test("Dein Lernbereich shows real basics questions and no Mythos/Realität buttons", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Lernen", exact: true }).click();
  await page.getByRole("button", { name: /Dein Lernbereich öffnen/ }).click();
  await expect(page.getByText(/Lernfragen für dein Level/)).toBeVisible();
  // Questions are hidden until the KI-Level card is clicked.
  await expect(page.locator(".basics-card")).toHaveCount(0);
  await page.getByRole("button", { name: /Angepasst an dein KI-Level/ }).click();
  await expect(page.locator(".basics-card").first()).toBeVisible();
  // The myth/reality answer buttons must not appear in the basics quiz anymore.
  await expect(page.locator(".basics-quiz").getByRole("button", { name: "Mythos", exact: true })).toHaveCount(0);
  await expect(page.locator(".basics-quiz").getByRole("button", { name: "Realität", exact: true })).toHaveCount(0);
});

test("Lernbereich questions differ between einsteiger and fortgeschritten", async ({ page }) => {
  // Low score → einsteiger: easy basics, no advanced governance question.
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Lernen", exact: true }).click();
  await page.getByRole("button", { name: /Dein Lernbereich öffnen/ }).click();
  await page.getByRole("button", { name: /Angepasst an dein KI-Level/ }).click();
  await expect(page.getByText(/Was ist eine KI-Antwort im Arbeitsalltag/)).toBeVisible();
  await expect(page.getByText(/KI-Kompetenz heisst, Nutzen und Grenzen/)).toHaveCount(0);

  // High score → fortgeschritten: advanced basics, no einsteiger question.
  await completeOnboardingHighScore(page);
  await page.getByRole("button", { name: "Lernen", exact: true }).click();
  await page.getByRole("button", { name: /Dein Lernbereich öffnen/ }).click();
  await page.getByRole("button", { name: /Angepasst an dein KI-Level/ }).click();
  await expect(page.getByText(/KI-Kompetenz heisst, Nutzen und Grenzen/)).toBeVisible();
  await expect(page.getByText(/Was ist eine KI-Antwort im Arbeitsalltag/)).toHaveCount(0);
});

test("clicking Lernen in the nav always returns to the start selection", async ({ page }) => {
  await completeOnboarding(page);
  // Open Lernen → Dein Lernbereich → a department module → back: now in the modules sub-page.
  await page.getByRole("button", { name: "Lernen", exact: true }).click();
  await page.getByRole("button", { name: /Dein Lernbereich öffnen/ }).click();
  await page.getByRole("button", { name: /Nachforderung prüfen/ }).click();
  await page.getByRole("button", { name: "Zurück zum Lernpfad" }).click();
  await expect(page.getByRole("button", { name: /Angepasst an dein KI-Level/ })).toBeVisible();
  // Navigate away and back via the sidebar — must reset to the three-card start.
  // exact: true so the nav tab is not confused with the "Nachforderung prüfen" module button.
  await page.getByRole("button", { name: "Prüfen", exact: true }).click();
  await page.getByRole("button", { name: "Lernen", exact: true }).click();
  await expect(page.getByRole("button", { name: /Dein Lernbereich öffnen/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Mythos oder Realität öffnen/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Angepasst an dein KI-Level/ })).toHaveCount(0);
});

test("Lern sub-pages use 'Zurück zum Lernbereich' back button", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Lernen", exact: true }).click();
  await page.getByRole("button", { name: /Mythos oder Realität öffnen/ }).click();
  await expect(page.getByRole("button", { name: "Zurück zum Lernbereich" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Zurück zur Übersicht/ })).toHaveCount(0);
});

test("Praxis topic opens a detail page with a back button to the Praxisbereich", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Praxis" }).click();
  await expect(page.locator(".praxis-example-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Leistungsbereich" }).click();
  await expect(page.locator(".praxis-example-card").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Zurück zum Praxisbereich" })).toBeVisible();
  await page.getByRole("button", { name: "Zurück zum Praxisbereich" }).click();
  await expect(page.locator(".praxis-topic-bar")).toBeVisible();
  await expect(page.locator(".praxis-example-card")).toHaveCount(0);
});

test("Prompt area opens a detail page with a back button to the Prompt-Bibliothek", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "Prompts" }).click();
  await expect(page.locator(".prompt-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Datenschutz und Sicherheit" }).click();
  await expect(page.locator(".prompt-card").first()).toBeVisible();
  await expect(page.getByText("Datenschutz-Check für einen Entwurf")).toBeVisible();
  await page.getByRole("button", { name: "Zurück zur Prompt-Bibliothek" }).click();
  await expect(page.locator(".prompt-category-bar")).toBeVisible();
  await expect(page.locator(".prompt-card")).toHaveCount(0);
});

test("BAKIRA Übersicht button uses the house icon, not a chevron", async ({ page }) => {
  await completeOnboarding(page);
  await page.getByRole("button", { name: "BAKIRA", exact: true }).click();
  const backBtn = page.locator(".bakira-ws-back");
  await expect(backBtn).toBeVisible();
  await expect(backBtn).toContainText("Übersicht");
  await expect(backBtn.locator("svg.lucide-house")).toBeAttached();
  await expect(backBtn.locator("svg.lucide-chevron-left")).toHaveCount(0);
});
