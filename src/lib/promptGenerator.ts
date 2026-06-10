export type PromptInput = {
  concern: string;
  format?: string;
  tone?: string;
  persona?: string;
};

export type PromptResult =
  | { valid: true; prompt: string; title: string }
  | { valid: false; message: string };

const MIN_CONCERN_LENGTH = 10;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ü/g, "ue")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ß/g, "ss")
    .replace(/-/g, "")
    .replace(/\be\s+mail\b/g, "email");
}

function detectType(
  concern: string
): "schreiben" | "pruefen" | "erklaeren" | "recherche" | "fallback" {
  const lower = normalize(concern);
  if (/email|brief|text|formulieren|umschreiben/.test(lower)) return "schreiben";
  if (/pruefen|kontrollieren|fehler|qualitaet/.test(lower)) return "pruefen";
  if (/erklaeren|verstehen|einfach/.test(lower)) return "erklaeren";
  if (/recherche|arbeitsmarkt|jobprofil|beruf/.test(lower)) return "recherche";
  return "fallback";
}

function buildPromptBlocks(
  type: "schreiben" | "pruefen" | "erklaeren" | "recherche" | "fallback",
  concern: string,
  format: string,
  tone: string,
  persona: string
): string {
  if (type === "schreiben") {
    return [
      `Aufgabe: Formuliere oder überarbeite den folgenden Text.`,
      `Kontext: ${concern}`,
      `Zielgruppe/Persona: ${persona}`,
      `Format: ${format}`,
      `Tonfall: ${tone}`,
      `Prüfung/Rückfragen: Falls der Auftrag unklar ist, frage zuerst nach dem gewünschten Stil und Zweck. Weise auf Stellen hin, die fachlich geprüft werden müssen.`
    ].join("\n");
  }

  if (type === "pruefen") {
    return [
      `Aufgabe: Prüfe den folgenden Entwurf fachlich und inhaltlich.`,
      `Kontext: ${concern}`,
      `Zielgruppe/Persona: ${persona}`,
      `Format: ${format} — benenne Schwachstellen klar und übersichtlich.`,
      `Tonfall: ${tone}`,
      `Prüfung/Rückfragen: Benenne konkret unklare Aussagen, fehlende Prüfschritte und Punkte, die eine Fachkraft selbst entscheiden muss. Keine echten Kundendaten verwenden.`
    ].join("\n");
  }

  if (type === "erklaeren") {
    return [
      `Aufgabe: Erkläre das folgende Thema verständlich.`,
      `Kontext: ${concern}`,
      `Zielgruppe/Persona: ${persona}`,
      `Format: ${format}`,
      `Tonfall: ${tone}`,
      `Prüfung/Rückfragen: Falls das Thema unklar ist, frage zuerst nach dem Wissensstand. Weise darauf hin, wenn Inhalte fachlich geprüft werden sollten.`
    ].join("\n");
  }

  if (type === "recherche") {
    return [
      `Aufgabe: Recherchiere und fasse das folgende Thema zusammen.`,
      `Kontext: ${concern}`,
      `Zielgruppe/Persona: Arbeitsmarktexpertin — ${persona}`,
      `Format: ${format}`,
      `Tonfall: ${tone}`,
      `Prüfung/Rückfragen: Weise auf Datenlücken und unsichere Angaben hin. Ergebnisse müssen gegen aktuelle Fachinformationen geprüft werden.`
    ].join("\n");
  }

  // fallback: allgemeiner strukturierter Aufgabenprompt
  return [
    `Aufgabe: Bearbeite folgendes Anliegen.`,
    `Kontext: ${concern}`,
    `Zielgruppe/Persona: ${persona}`,
    `Format: ${format}`,
    `Tonfall: ${tone}`,
    `Prüfung/Rückfragen: Falls der Auftrag unklar ist, stelle zuerst Rückfragen. Weise auf fachliche Prüfpflichten hin.`
  ].join("\n");
}

export function generatePrompt(input: PromptInput): PromptResult {
  const {
    concern,
    format = "Fliesstext",
    tone = "sachlich",
    persona = "Fachkraft im Jobcenter"
  } = input;

  if (concern.trim().length < MIN_CONCERN_LENGTH) {
    return { valid: false, message: "Beschreibe kurz, wobei BAKIRA helfen soll." };
  }

  const type = detectType(concern);
  const prompt = buildPromptBlocks(type, concern, format, tone, persona);
  const titleWords = concern.trim().split(/\s+/).slice(0, 4).join(" ");

  return {
    valid: true,
    prompt,
    title: `Generierter Prompt: ${titleWords}`
  };
}
