import { builtinPrompts } from "../data/prompts";
import { checkQuestions, type ModuleId, type RoleId } from "../data/content";

export const STORAGE_KEY_V2 = "jc-lernapp-claude-v2";
export const STORAGE_KEY_V1 = "jc-lernapp-claude-v1";

export type AiLevel = "einsteiger" | "grundkenntnisse" | "fortgeschritten";
export type ThemeMode = "light" | "dark";
export type ColorTemplate = "blau" | "gruen" | "rot";

export type UserProfile = {
  firstName: string;
  selectedRole: RoleId;
  aiLevel: AiLevel;
  onboardingCompleted: boolean;
};

export type UserPreferences = {
  themeMode: ThemeMode;
  colorTemplate: ColorTemplate;
};

export type SavedPrompt = {
  id: string;
  title: string;
  department: RoleId | "alle" | "allgemein";
  tags: string[];
  prompt: string;
  isBuiltin: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AppState = {
  schemaVersion: 2;
  profile: UserProfile | null;
  preferences: UserPreferences;
  progress: {
    completedModules: ModuleId[];
    completedChecklistItems: string[];
    checkAnswers: Record<string, number>;
  };
  savedPrompts: SavedPrompt[];
};

type LegacyProgress = {
  selectedRole?: RoleId | null;
  completedModules?: ModuleId[];
  completedChecklistItems?: string[];
};

export function createDefaultAppState(): AppState {
  return {
    schemaVersion: 2,
    profile: null,
    preferences: {
      themeMode: "light",
      colorTemplate: "blau"
    },
    progress: {
      completedModules: [],
      completedChecklistItems: [],
      checkAnswers: {}
    },
    savedPrompts: builtinPrompts
  };
}

export function migrateLegacyProgress(raw: unknown): AppState {
  const base = createDefaultAppState();
  const legacy = raw as LegacyProgress;
  return {
    ...base,
    profile: legacy?.selectedRole
      ? {
          firstName: "",
          selectedRole: legacy.selectedRole,
          aiLevel: "einsteiger",
          onboardingCompleted: false
        }
      : null,
    progress: {
      completedModules: Array.isArray(legacy?.completedModules) ? legacy.completedModules : [],
      completedChecklistItems: Array.isArray(legacy?.completedChecklistItems)
        ? legacy.completedChecklistItems
        : [],
      checkAnswers: {}
    }
  };
}

function mergeWithDefaults(value: Partial<AppState>): AppState {
  const defaults = createDefaultAppState();
  const rawTheme = value.preferences?.themeMode as string | undefined;
  const rawColor = value.preferences?.colorTemplate as string | undefined;
  const themeMode: ThemeMode = rawTheme === "system" || rawTheme == null ? "light" : rawTheme as ThemeMode;
  const colorTemplate: ColorTemplate = rawColor === "neutral" || rawColor == null
    ? defaults.preferences.colorTemplate
    : rawColor as ColorTemplate;
  return {
    ...defaults,
    ...value,
    schemaVersion: 2,
    preferences: { themeMode, colorTemplate },
    progress: { ...defaults.progress, ...(value.progress ?? {}) },
    savedPrompts:
      Array.isArray(value.savedPrompts) && value.savedPrompts.length > 0
        ? value.savedPrompts
        : defaults.savedPrompts
  };
}

export function loadAppState(): AppState {
  try {
    const v2 = localStorage.getItem(STORAGE_KEY_V2);
    if (v2) return mergeWithDefaults(JSON.parse(v2));

    const v1 = localStorage.getItem(STORAGE_KEY_V1);
    if (v1) return migrateLegacyProgress(JSON.parse(v1));

    return createDefaultAppState();
  } catch {
    return createDefaultAppState();
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(state));
  } catch {
    // Local demo app: ignore quota/security errors so UI remains usable.
  }
}

export function needsReOnboarding(state: AppState): boolean {
  if (!state.profile?.onboardingCompleted) return false;
  return !checkQuestions.every((q) => q.id in state.progress.checkAnswers);
}
