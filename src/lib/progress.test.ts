import { describe, it, expect } from "vitest";
import {
  calculateAiLevel,
  calculateConfidenceProfile,
  getLearningPathSections,
  getRecommendedModules,
  getCompletionSummary
} from "./progress";
import { modules } from "../data/content";

describe("calculateAiLevel", () => {
  it("returns einsteiger for low total score (6–12)", () => {
    // 6 questions × 1 = 6 → einsteiger
    expect(calculateAiLevel({ confidence: 1, rules: 1, dataSafety: 1, reviewSkill: 1, textStruktur: 1, vorsichtWissen: 1 })).toBe("einsteiger");
    // 6 questions averaging 2 = 12 → einsteiger
    expect(calculateAiLevel({ confidence: 2, rules: 2, dataSafety: 2, reviewSkill: 2, textStruktur: 2, vorsichtWissen: 2 })).toBe("einsteiger");
  });

  it("returns grundkenntnisse for medium total score (13–19)", () => {
    // 6 questions × 3 = 18 → grundkenntnisse
    expect(calculateAiLevel({ confidence: 3, rules: 3, dataSafety: 3, reviewSkill: 3, textStruktur: 3, vorsichtWissen: 3 })).toBe("grundkenntnisse");
    // score = 13 → grundkenntnisse
    expect(calculateAiLevel({ confidence: 3, rules: 2, dataSafety: 2, reviewSkill: 2, textStruktur: 2, vorsichtWissen: 2 })).toBe("grundkenntnisse");
    // score = 19 → grundkenntnisse
    expect(calculateAiLevel({ confidence: 4, rules: 4, dataSafety: 4, reviewSkill: 4, textStruktur: 2, vorsichtWissen: 1 })).toBe("grundkenntnisse");
  });

  it("returns fortgeschritten for high total score (20–24)", () => {
    // 6 questions × 4 = 24 → fortgeschritten
    expect(calculateAiLevel({ confidence: 4, rules: 4, dataSafety: 4, reviewSkill: 4, textStruktur: 4, vorsichtWissen: 4 })).toBe("fortgeschritten");
    // score = 20 → fortgeschritten
    expect(calculateAiLevel({ confidence: 4, rules: 4, dataSafety: 4, reviewSkill: 4, textStruktur: 2, vorsichtWissen: 2 })).toBe("fortgeschritten");
  });
});

describe("getRecommendedModules", () => {
  it("returns general modules followed by role-specific modules for Leistungsbereich", () => {
    expect(getRecommendedModules("leistung")).toEqual(expect.arrayContaining([
      "ki-einfach-erklaert",
      "sicherer-ki-umgang",
      "mythos-realitaet",
      "nachforderung-pruefen"
    ]));
    expect(getRecommendedModules("leistung").indexOf("ki-einfach-erklaert")).toBeLessThan(
      getRecommendedModules("leistung").indexOf("nachforderung-pruefen")
    );
  });

  it("returns role-specific modules for Teamleitung after the shared KI basics", () => {
    expect(getRecommendedModules("leitung")).toEqual(expect.arrayContaining([
      "ki-einfach-erklaert",
      "sicherer-ki-umgang",
      "mythos-realitaet",
      "ki-governance-team"
    ]));
    expect(getRecommendedModules("leitung").indexOf("sicherer-ki-umgang")).toBeLessThan(
      getRecommendedModules("leitung").indexOf("ki-governance-team")
    );
  });

  it("falls back to allgemein modules for unknown role id", () => {
    // @ts-expect-error testing invalid input
    expect(getRecommendedModules("unknown")).toEqual(getRecommendedModules("allgemein"));
  });
});

describe("getLearningPathSections", () => {
  it("splits shared KI basics and Leistungsbereich content", () => {
    const sections = getLearningPathSections("leistung");
    expect(sections.general.title).toBe("KI-Grundlagen für alle");
    expect(sections.roleSpecific.title).toBe("Dein Bereich: Leistungsbereich");
    expect(sections.general.moduleIds).toEqual([
      "ki-einfach-erklaert",
      "sicherer-ki-umgang",
      "mythos-realitaet"
    ]);
    expect(sections.roleSpecific.moduleIds).toEqual(expect.arrayContaining([
      "nachforderung-pruefen",
      "sgbii-leistung-grundlagen",
      "mitwirkung-nachweise"
    ]));
    expect(sections.roleSpecific.moduleIds).not.toContain("service-lotsen");
  });

  it("switches the role-specific section for Eingangszone and Service", () => {
    const sections = getLearningPathSections("service");
    expect(sections.roleSpecific.title).toBe("Dein Bereich: Eingangszone & Service");
    expect(sections.roleSpecific.moduleIds).toEqual(expect.arrayContaining([
      "service-lotsen",
      "online-services-lotsen",
      "anliegen-klaeren"
    ]));
    expect(sections.roleSpecific.moduleIds).not.toContain("ki-governance-team");
  });
});

describe("calculateConfidenceProfile", () => {
  it("returns Orientierung aufbauen for low scores (total <= 7)", () => {
    const profile = calculateConfidenceProfile({
      confidence: 1,
      rules: 1,
      dataSafety: 2,
      reviewSkill: 1
    });
    expect(profile.level).toBe("Orientierung aufbauen");
    expect(profile.message).toContain("normal");
    expect(profile.nextStepId).toBe("ki-einfach-erklaert");
  });

  it("returns Sicherheit festigen for mid scores (total 8–12)", () => {
    const profile = calculateConfidenceProfile({
      confidence: 3,
      rules: 2,
      dataSafety: 3,
      reviewSkill: 3
    });
    expect(profile.level).toBe("Sicherheit festigen");
    expect(profile.nextStepId).toBe("sicherer-ki-umgang");
  });

  it("returns Praxis vertiefen for high scores (total > 12)", () => {
    const profile = calculateConfidenceProfile({
      confidence: 4,
      rules: 4,
      dataSafety: 4,
      reviewSkill: 4
    });
    expect(profile.level).toBe("Praxis vertiefen");
    expect(profile.nextStepId).toBe("nachforderung-pruefen");
  });
});

describe("getCompletionSummary", () => {
  it("returns 0 percent for empty progress", () => {
    const summary = getCompletionSummary({
      selectedRole: null,
      answers: {},
      completedModules: [],
      completedChecklistItems: []
    });
    expect(summary.percent).toBe(0);
    expect(summary.completedSteps).toBe(0);
  });

  it("calculates partial completion correctly", () => {
    const summary = getCompletionSummary({
      selectedRole: "service",
      answers: { confidence: 3, rules: 3, dataSafety: 2, reviewSkill: 2 },
      completedModules: ["ki-einfach-erklaert", "mythos-realitaet"],
      completedChecklistItems: ["source-check"]
    });
    expect(summary.completedSteps).toBe(4);
    expect(summary.totalSteps).toBe(1 + 1 + modules.length);
    expect(summary.percent).toBe(Math.round((4 / summary.totalSteps) * 100));
  });

  it("ignores legacy checklist completion because the checklist UI no longer exists", () => {
    const summary = getCompletionSummary({
      selectedRole: null,
      answers: {},
      completedModules: [],
      completedChecklistItems: ["source-check"]
    });
    expect(summary.completedSteps).toBe(0);
    expect(summary.totalSteps).toBe(1 + 1 + modules.length);
    expect(summary.percent).toBe(0);
  });

  it("returns exactly 100 percent when profile, self-assessment and all modules are done", () => {
    const summary = getCompletionSummary({
      selectedRole: "leistung",
      answers: { confidence: 4, rules: 4, dataSafety: 4, reviewSkill: 4 },
      completedModules: modules.map((m) => m.id),
      completedChecklistItems: []
    });
    expect(summary.completedSteps).toBe(1 + 1 + modules.length);
    expect(summary.totalSteps).toBe(1 + 1 + modules.length);
    expect(summary.percent).toBe(100);
  });
});
