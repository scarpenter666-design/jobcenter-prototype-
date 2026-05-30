import { describe, it, expect } from "vitest";
import { generatePrompt } from "./promptGenerator";

describe("generatePrompt", () => {
  it("returns validation message when concern is too short", () => {
    const result = generatePrompt({ concern: "kurz" });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.message).toContain("BAKIRA");
    }
  });

  it("returns validation message for empty concern", () => {
    const result = generatePrompt({ concern: "" });
    expect(result.valid).toBe(false);
  });

  it("creates Schreib-/Umformulierungs-Prompt for email concern", () => {
    const result = generatePrompt({
      concern: "Ich moechte eine email an einen Buerger formulieren"
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.prompt).toContain("Formuliere oder ueberarbeite");
      expect(result.prompt).toContain("Aufgabe:");
      expect(result.prompt).toContain("Pruefung/Rueckfragen:");
    }
  });

  it("creates Schreib-Prompt for brief/umschreiben concern", () => {
    const result = generatePrompt({ concern: "Diesen text bitte umschreiben fuer Buerger" });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.prompt).toContain("Formuliere oder ueberarbeite");
    }
  });

  it("creates Pruefprompt for pruefen/fehler concern", () => {
    const result = generatePrompt({
      concern: "Diesen Entwurf bitte pruefen auf Fehler und Qualitaet"
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.prompt).toContain("Pruefe den folgenden Entwurf");
      expect(result.prompt).toContain("Aufgabe:");
      expect(result.prompt).toContain("Pruefung/Rueckfragen:");
    }
  });

  it("creates Erklaerprompt for erklaeren concern", () => {
    const result = generatePrompt({
      concern: "Bitte erklaeren wie KI im Jobcenter funktioniert und was sie kann"
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.prompt).toContain("Erklaere das folgende Thema");
      expect(result.prompt).toContain("Aufgabe:");
      expect(result.prompt).toContain("Pruefung/Rueckfragen:");
    }
  });

  it("creates Rechercheprompt for arbeitsmarkt/beruf concern", () => {
    const result = generatePrompt({
      concern: "Recherche zu aktuellen Berufsfeldern und Arbeitsmarkt in der Region"
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.prompt).toContain("Recherchiere und fasse");
      expect(result.prompt).toContain("Arbeitsmarktexpertin");
    }
  });

  it("uses fallback structured prompt for unrecognized concern", () => {
    const result = generatePrompt({
      concern: "Ich brauche Hilfe bei meiner taeglichen Bueroarbeit im Jobcenter"
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.prompt).toContain("Aufgabe:");
      expect(result.prompt).toContain("Kontext:");
      expect(result.prompt).toContain("Zielgruppe/Persona:");
      expect(result.prompt).toContain("Format:");
      expect(result.prompt).toContain("Tonfall:");
      expect(result.prompt).toContain("Pruefung/Rueckfragen:");
    }
  });

  it("incorporates custom format and tone options", () => {
    const result = generatePrompt({
      concern: "Ich brauche Hilfe bei meiner taeglichen Bueroarbeit im Jobcenter",
      format: "Liste",
      tone: "professionell",
      persona: "Teamleitung"
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.prompt).toContain("Liste");
      expect(result.prompt).toContain("professionell");
      expect(result.prompt).toContain("Teamleitung");
    }
  });

  it("derives title from first words of concern", () => {
    const result = generatePrompt({
      concern: "email an Buerger formulieren fuer wichtigen Bescheid"
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.title).toMatch(/^Generierter Prompt:/);
    }
  });

  // ── Umlaut / natural German input ────────────────────────────────────────────

  it("detects pruefen type from input with German umlaut ü", () => {
    const result = generatePrompt({
      concern: "Bitte prüfe diesen Entwurf auf Fehler und Vollständigkeit"
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.prompt).toContain("Pruefe den folgenden Entwurf");
    }
  });

  it("detects erklaeren type from input with umlaut ä", () => {
    const result = generatePrompt({
      concern: "Erkläre mir bitte Bürgergeld auf einfache Weise"
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.prompt).toContain("Erklaere das folgende Thema");
    }
  });

  it("detects pruefen type from Qualität with umlaut ä", () => {
    const result = generatePrompt({
      concern: "Bitte bewerte die Qualität dieses Entwurfs genau"
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.prompt).toContain("Pruefe den folgenden Entwurf");
    }
  });

  it("detects schreiben type from E-Mail with hyphen", () => {
    const result = generatePrompt({
      concern: "Ich brauche eine E-Mail an einen Bürger zu schreiben"
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.prompt).toContain("Formuliere oder ueberarbeite");
    }
  });

  it("detects schreiben type from e mail with space (no other schreiben keyword)", () => {
    const result = generatePrompt({
      concern: "Ich brauche eine e mail an einen Bürger"
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.prompt).toContain("Formuliere oder ueberarbeite");
    }
  });
});
