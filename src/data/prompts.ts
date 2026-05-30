import type { SavedPrompt } from "../lib/appState";

const now = "2026-05-25T00:00:00.000Z";

export const builtinPrompts: SavedPrompt[] = [
  {
    id: "builtin-fachlich-pruefen",
    title: "KI-Antwort fachlich pruefen",
    department: "alle",
    tags: ["Pruefung", "Qualitaet", "Sicherheit"],
    prompt:
      "Pruefe den folgenden KI-Entwurf fachlich. Achte auf unklare Aussagen, fehlende Pruefschritte, riskante Formulierungen und Punkte, die eine Fachkraft selbst entscheiden muss. Nutze nur fiktive oder anonymisierte Beispiele.",
    isBuiltin: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "builtin-buergerfreundlich",
    title: "Buergerfreundlich umformulieren",
    department: "alle",
    tags: ["Sprache", "Verstaendlichkeit", "Ton"],
    prompt:
      "Formuliere den folgenden Text klarer und buergerfreundlicher. Erhalte die fachliche Aussage, vermeide Fachjargon wo moeglich und markiere Stellen, die fachlich geprueft werden muessen.",
    isBuiltin: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "builtin-datenschutz-check",
    title: "Datenschutz-Check fuer einen Entwurf",
    department: "alle",
    tags: ["Datenschutz", "Kundendaten", "Check"],
    prompt:
      "Pruefe den folgenden fiktiven Entwurf darauf, ob unnoetige personenbezogene Daten, sensible Details oder identifizierende Informationen enthalten sind. Schlage datensparsame Alternativen vor.",
    isBuiltin: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "builtin-lernfrage",
    title: "Lernfrage zu KI-Grundlagen erstellen",
    department: "allgemein",
    tags: ["Lernen", "Grundlagen", "Quiz"],
    prompt:
      "Erstelle eine kurze Lernfrage zu KI-Grundlagen im Jobcenter-Kontext. Gib eine richtige Antwort, zwei plausible falsche Antworten und eine kurze Erklaerung.",
    isBuiltin: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "builtin-teamleitung",
    title: "Teamleitungs-Check fuer sichere KI-Nutzung",
    department: "leitung",
    tags: ["Teamleitung", "Standard", "Sicherheit"],
    prompt:
      "Erstelle eine kompakte Checkliste fuer Teamleitungen, mit der ein Team sichere KI-Nutzung im Arbeitsalltag besprechen kann. Fokus: Datenschutz, fachliche Verantwortung, Transparenz und Lernbedarf.",
    isBuiltin: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "builtin-prompt-verbessern",
    title: "Prompt verbessern mit Aufgabe, Kontext und Pruefkriterien",
    department: "alle",
    tags: ["Prompting", "Struktur", "Verbesserung"],
    prompt:
      "Verbessere meinen Prompt. Strukturiere ihn nach Aufgabe, Kontext, gewuenschtem Ergebnis, Grenzen und Pruefkriterien. Weise auf fehlende Informationen hin, statt sie zu erfinden.",
    isBuiltin: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "builtin-prompt-baustein",
    title: "Prompt nach Baustein-Vorlage strukturieren",
    department: "alle",
    tags: ["Prompting", "Vorlage", "Struktur"],
    prompt:
      "Erstelle einen strukturierten Prompt nach dieser Vorlage:\nAufgabe: [Was soll getan werden? Klares Aktionsverb: generieren, pruefen, erklaeren, umschreiben]\nKontext: [Fiktiver oder anonymisierter Arbeitsfall]\nZielgruppe/Persona: [Fuer wen ist die Ausgabe? z. B. Buergerin, Fachkraft, Auszubildende]\nFormat: [Wie soll die Ausgabe aussehen? z. B. E-Mail, Liste, Tabelle, Fliesstext]\nTonfall: [professionell, sachlich, buergerfreundlich, persoenlich]\nPruefkriterien: [Woran erkennst du, dass die Ausgabe gut ist?]\nNutze nur fiktive Beispieldaten.",
    isBuiltin: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "builtin-rueckfragen-zuerst",
    title: "BAKIRA fragt zuerst Rueckfragen",
    department: "alle",
    tags: ["Prompting", "Rueckfragen", "Praezision"],
    prompt:
      "Bevor du eine Antwort oder einen Entwurf erstellst, stelle mir drei gezielte Rueckfragen, um den Auftrag besser zu verstehen. Frage nach: Zielgruppe, gewuenschtem Format und konkretem Ziel. Erst nach meiner Antwort erstellst du das Ergebnis.",
    isBuiltin: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "builtin-grammatik-tabelle",
    title: "Grammatik und Rechtschreibung pruefen (Tabelle)",
    department: "alle",
    tags: ["Sprache", "Qualitaet", "Tabelle"],
    prompt:
      "Pruefe den folgenden fiktiven Text auf Grammatik- und Rechtschreibfehler. Gib das Ergebnis als Tabelle aus mit drei Spalten: Fundstelle (zitierter Textausschnitt), Fehlerart (Grammatik oder Rechtschreibung), Korrekturvorschlag. Weise am Ende auf Stellen hin, bei denen du unsicher bist.",
    isBuiltin: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "builtin-text-umschreiben",
    title: "Text oder E-Mail im eigenen Stil umschreiben",
    department: "alle",
    tags: ["Schreiben", "Stil", "Umformulierung"],
    prompt:
      "Schreibe den folgenden fiktiven Text oder die folgende Muster-E-Mail in einem klar vorgegebenen Stil um. Stil: [z. B. sachlich-freundlich, formell, buergerfreundlich]. Zielgruppe: [Buergerin oder Buerger, Fachkraft, Teamkollegin]. Erhalte den fachlichen Inhalt vollstaendig. Markiere Stellen, die fachlich geprueft werden muessen.",
    isBuiltin: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "builtin-erklaer-fachpersona",
    title: "Recherche und Erklaerung mit Fachpersona",
    department: "alle",
    tags: ["Erklaerung", "Recherche", "Fachpersona"],
    prompt:
      "Du bist eine erfahrene Arbeitsmarktexpertin. Erklaere das folgende Thema verstaendlich fuer Mitarbeitende im Jobcenter, die noch wenig Erfahrung damit haben. Thema: [Thema eintragen]. Format: kurze Erklaerung, dann drei Praxisbeispiele mit fiktiven Daten. Weise am Ende auf Punkte hin, die fachlich validiert werden muessen.",
    isBuiltin: true,
    createdAt: now,
    updatedAt: now
  }
];
