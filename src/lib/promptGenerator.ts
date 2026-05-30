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
      `Aufgabe: Formuliere oder ueberarbeite den folgenden Text.`,
      `Kontext: ${concern}`,
      `Zielgruppe/Persona: ${persona}`,
      `Format: ${format}`,
      `Tonfall: ${tone}`,
      `Pruefung/Rueckfragen: Falls der Auftrag unklar ist, frage zuerst nach dem gewuenschten Stil und Zweck. Weise auf Stellen hin, die fachlich geprueft werden muessen.`
    ].join("\n");
  }

  if (type === "pruefen") {
    return [
      `Aufgabe: Pruefe den folgenden Entwurf fachlich und inhaltlich.`,
      `Kontext: ${concern}`,
      `Zielgruppe/Persona: ${persona}`,
      `Format: ${format} — benenne Schwachstellen klar und uebersichtlich.`,
      `Tonfall: ${tone}`,
      `Pruefung/Rueckfragen: Benenne konkret unklare Aussagen, fehlende Pruefschritte und Punkte, die eine Fachkraft selbst entscheiden muss. Keine echten Kundendaten verwenden.`
    ].join("\n");
  }

  if (type === "erklaeren") {
    return [
      `Aufgabe: Erklaere das folgende Thema verstaendlich.`,
      `Kontext: ${concern}`,
      `Zielgruppe/Persona: ${persona}`,
      `Format: ${format}`,
      `Tonfall: ${tone}`,
      `Pruefung/Rueckfragen: Falls das Thema unklar ist, frage zuerst nach dem Wissensstand. Weise darauf hin, wenn Inhalte fachlich geprueft werden sollten.`
    ].join("\n");
  }

  if (type === "recherche") {
    return [
      `Aufgabe: Recherchiere und fasse das folgende Thema zusammen.`,
      `Kontext: ${concern}`,
      `Zielgruppe/Persona: Arbeitsmarktexpertin — ${persona}`,
      `Format: ${format}`,
      `Tonfall: ${tone}`,
      `Pruefung/Rueckfragen: Weise auf Datenuecken und unsichere Angaben hin. Ergebnisse muessen gegen aktuelle Fachinformationen geprueft werden.`
    ].join("\n");
  }

  // fallback: allgemeiner strukturierter Aufgabenprompt
  return [
    `Aufgabe: Bearbeite folgendes Anliegen.`,
    `Kontext: ${concern}`,
    `Zielgruppe/Persona: ${persona}`,
    `Format: ${format}`,
    `Tonfall: ${tone}`,
    `Pruefung/Rueckfragen: Falls der Auftrag unklar ist, stelle zuerst Rueckfragen. Weise auf fachliche Pruefpflichten hin.`
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
