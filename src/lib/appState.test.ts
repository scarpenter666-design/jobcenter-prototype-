import { beforeEach, describe, expect, it } from "vitest";
import {
  createDefaultAppState,
  loadAppState,
  migrateLegacyProgress,
  needsReOnboarding,
  saveAppState,
  STORAGE_KEY_V2,
  type AppState
} from "./appState";
import { builtinPrompts } from "../data/prompts";

const legacy = {
  selectedRole: "leistung",
  answers: { confidence: 3 },
  completedModules: ["ki-einfach-erklaert"],
  completedChecklistItems: ["source-check"]
};

describe("appState", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates a valid default state", () => {
    const state = createDefaultAppState();
    expect(state.schemaVersion).toBe(2);
    expect(state.profile).toBeNull();
    expect(state.preferences.themeMode).toBe("light");
    expect(state.preferences.colorTemplate).toBe("blau");
    expect(state.progress.completedModules).toEqual([]);
    expect(state.progress.checkAnswers).toEqual({});
    expect(state.savedPrompts.length).toBeGreaterThanOrEqual(6);
  });

  it("loads default state when storage is corrupt", () => {
    localStorage.setItem(STORAGE_KEY_V2, "{not valid json");
    expect(loadAppState()).toEqual(createDefaultAppState());
  });

  it("saves and loads v2 state", () => {
    const state: AppState = {
      ...createDefaultAppState(),
      profile: {
        firstName: "Sven",
        selectedRole: "leistung",
        aiLevel: "grundkenntnisse",
        onboardingCompleted: true
      }
    };
    saveAppState(state);
    expect(loadAppState().profile?.firstName).toBe("Sven");
  });

  it("migrates useful v1 progress into v2 state", () => {
    const migrated = migrateLegacyProgress(legacy);
    expect(migrated.profile?.selectedRole).toBe("leistung");
    expect(migrated.profile?.onboardingCompleted).toBe(false);
    expect(migrated.progress.completedModules).toEqual(["ki-einfach-erklaert"]);
    expect(migrated.progress.completedChecklistItems).toEqual(["source-check"]);
  });

  it("default state includes all built-in prompts", () => {
    const state = createDefaultAppState();
    const builtinIds = builtinPrompts.map((p) => p.id);
    for (const id of builtinIds) {
      expect(state.savedPrompts.some((p) => p.id === id)).toBe(true);
    }
  });

  it("full demo reset equals createDefaultAppState with only built-in prompts", () => {
    const resetState = createDefaultAppState();
    expect(resetState.profile).toBeNull();
    expect(resetState.progress.completedModules).toEqual([]);
    expect(resetState.progress.completedChecklistItems).toEqual([]);
    expect(resetState.progress.checkAnswers).toEqual({});
    expect(resetState.savedPrompts.every((p) => p.isBuiltin)).toBe(true);
  });

  it("migrates saved themeMode 'system' to 'light' on load", () => {
    const raw = { ...createDefaultAppState(), preferences: { themeMode: "system", colorTemplate: "blau" } };
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(raw));
    expect(loadAppState().preferences.themeMode).toBe("light");
  });

  it("migrates saved colorTemplate 'neutral' to default blau on load", () => {
    const raw = { ...createDefaultAppState(), preferences: { themeMode: "light", colorTemplate: "neutral" } };
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(raw));
    const loaded = loadAppState();
    expect(loaded.preferences.colorTemplate).not.toBe("neutral");
  });

  it("profile reset preserves saved prompts and module progress", () => {
    const state: AppState = {
      ...createDefaultAppState(),
      profile: {
        firstName: "Sven",
        selectedRole: "leistung",
        aiLevel: "fortgeschritten",
        onboardingCompleted: true
      },
      progress: {
        completedModules: ["ki-einfach-erklaert"],
        completedChecklistItems: ["source-check"],
        checkAnswers: { confidence: 4, rules: 4, dataSafety: 4, reviewSkill: 4 }
      },
      savedPrompts: [
        ...createDefaultAppState().savedPrompts,
        {
          id: "custom-1",
          title: "Mein Prompt",
          department: "alle",
          tags: [],
          prompt: "Beispiel",
          isBuiltin: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };

    const afterReset: AppState = {
      ...state,
      profile: null,
      progress: { ...state.progress, checkAnswers: {} }
    };

    expect(afterReset.profile).toBeNull();
    expect(afterReset.progress.checkAnswers).toEqual({});
    expect(afterReset.progress.completedModules).toEqual(["ki-einfach-erklaert"]);
    expect(afterReset.savedPrompts.some((p) => p.id === "custom-1")).toBe(true);
  });
});

describe("needsReOnboarding", () => {
  it("returns false for fresh install (profile null)", () => {
    expect(needsReOnboarding(createDefaultAppState())).toBe(false);
  });

  it("returns false when onboardingCompleted is false (normal first run)", () => {
    const state: AppState = {
      ...createDefaultAppState(),
      profile: {
        firstName: "Test",
        selectedRole: "leistung",
        aiLevel: "einsteiger",
        onboardingCompleted: false
      }
    };
    expect(needsReOnboarding(state)).toBe(false);
  });

  it("returns true for old v2 profile with only 4 checkAnswers (pre-JOB-APP-10)", () => {
    const state: AppState = {
      ...createDefaultAppState(),
      profile: {
        firstName: "Alt",
        selectedRole: "leistung",
        aiLevel: "einsteiger",
        onboardingCompleted: true
      },
      progress: {
        completedModules: [],
        completedChecklistItems: [],
        checkAnswers: { confidence: 4, rules: 4, dataSafety: 4, reviewSkill: 4 }
      }
    };
    expect(needsReOnboarding(state)).toBe(true);
  });

  it("returns false when all 6 current checkQuestions are answered", () => {
    const state: AppState = {
      ...createDefaultAppState(),
      profile: {
        firstName: "Neu",
        selectedRole: "leistung",
        aiLevel: "grundkenntnisse",
        onboardingCompleted: true
      },
      progress: {
        completedModules: [],
        completedChecklistItems: [],
        checkAnswers: {
          confidence: 3,
          rules: 3,
          dataSafety: 3,
          reviewSkill: 3,
          textStruktur: 2,
          vorsichtWissen: 2
        }
      }
    };
    expect(needsReOnboarding(state)).toBe(false);
  });

  it("returns true when only the two new questions are missing", () => {
    const state: AppState = {
      ...createDefaultAppState(),
      profile: {
        firstName: "Partial",
        selectedRole: "service",
        aiLevel: "einsteiger",
        onboardingCompleted: true
      },
      progress: {
        completedModules: [],
        completedChecklistItems: [],
        checkAnswers: { confidence: 2, rules: 2, dataSafety: 2, reviewSkill: 2 }
      }
    };
    expect(needsReOnboarding(state)).toBe(true);
  });
});
