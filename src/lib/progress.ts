import { modules, roles, type ModuleId, type RoleId } from "../data/content";

export type AiLevelResult = "einsteiger" | "grundkenntnisse" | "fortgeschritten";

export function calculateAiLevel(answers: Record<string, number>): AiLevelResult {
  const total = Object.values(answers).reduce((sum, v) => sum + v, 0);
  if (total <= 12) return "einsteiger";
  if (total <= 19) return "grundkenntnisse";
  return "fortgeschritten";
}

export type CheckAnswers = {
  confidence: number;
  rules: number;
  dataSafety: number;
  reviewSkill: number;
};

export type ConfidenceProfile = {
  level: "Orientierung aufbauen" | "Sicherheit festigen" | "Praxis vertiefen";
  message: string;
  nextStepId: ModuleId;
};

export type AppProgress = {
  selectedRole: RoleId | null;
  answers: Partial<CheckAnswers>;
  completedModules: ModuleId[];
  completedChecklistItems: string[];
};

export type LearningPathSections = {
  general: {
    title: string;
    moduleIds: ModuleId[];
  };
  roleSpecific: {
    title: string;
    moduleIds: ModuleId[];
  };
};

function uniqueModuleIds(ids: ModuleId[]): ModuleId[] {
  return Array.from(new Set(ids));
}

export function getRecommendedModules(roleId: RoleId): ModuleId[] {
  const role = roles.find((r) => r.id === roleId);
  return role?.recommendedModules ?? roles[roles.length - 1].recommendedModules;
}

export function getLearningPathSections(roleId: RoleId): LearningPathSections {
  const role = roles.find((r) => r.id === roleId) ?? roles[roles.length - 1];
  const recommended = uniqueModuleIds(role.recommendedModules);
  const general = recommended.filter((id) => {
    const mod = modules.find((m) => m.id === id);
    return mod?.targetRoles.includes("alle");
  });
  const roleSpecific = recommended.filter((id) => {
    const mod = modules.find((m) => m.id === id);
    return mod?.targetRoles.includes(role.id);
  });

  return {
    general: {
      title: "KI-Grundlagen für alle",
      moduleIds: general
    },
    roleSpecific: {
      title: `Dein Bereich: ${role.name}`,
      moduleIds: roleSpecific
    }
  };
}

export function calculateConfidenceProfile(answers: CheckAnswers): ConfidenceProfile {
  const score = answers.confidence + answers.rules + answers.dataSafety + answers.reviewSkill;

  if (score <= 7) {
    return {
      level: "Orientierung aufbauen",
      message:
        "Unsicherheit ist normal. Starte mit Grundlagen und klaren Sicherheitsregeln, bevor du Praxisfaelle bearbeitest.",
      nextStepId: "ki-einfach-erklaert"
    };
  }

  if (score <= 12) {
    return {
      level: "Sicherheit festigen",
      message:
        "Du hast erste Orientierung. Als naechstes helfen Pruefroutinen und typische KI-Mythen.",
      nextStepId: "sicherer-ki-umgang"
    };
  }

  return {
    level: "Praxis vertiefen",
    message:
      "Du wirkst sicher im Einstieg. Vertiefe das Wissen mit Praxisfaellen und Checklisten.",
    nextStepId: "nachforderung-pruefen"
  };
}

export function getCompletionSummary(progress: AppProgress) {
  const completedSteps =
    Number(Boolean(progress.selectedRole)) +
    Number(Object.keys(progress.answers).length >= 4) +
    progress.completedModules.length;
  const totalSteps = 1 + 1 + modules.length; // role + answers + modules

  return {
    completedSteps,
    totalSteps,
    percent: Math.round((completedSteps / totalSteps) * 100)
  };
}
