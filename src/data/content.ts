export type RoleId = "leistung" | "integration" | "service" | "leitung" | "allgemein";
export type ModuleId =
  | "ki-einfach-erklaert"
  | "sicherer-ki-umgang"
  | "mythos-realitaet"
  | "nachforderung-pruefen"
  | "service-lotsen"
  | "sgbii-leistung-grundlagen"
  | "mitwirkung-nachweise"
  | "potenzialanalyse-kooperationsplan"
  | "foerderinstrumente-integration"
  | "online-services-lotsen"
  | "anliegen-klaeren"
  | "ki-governance-team"
  | "qualitaet-datenschutz-standards";

export type Role = {
  id: RoleId;
  name: string;
  context: string;
  recommendedModules: ModuleId[];
};

export type Module = {
  id: ModuleId;
  title: string;
  duration: string;
  summary: string;
  targetRoles: Array<RoleId | "alle">;
  sourceRefs?: string[];
  warning?: string;
  cards: string[];
};

export type PracticeCase = {
  title: string;
  situation: string;
  options: Array<{
    id: string;
    label: string;
    feedback: string;
    recommended: boolean;
  }>;
  takeaway: string;
};

export const roles: Role[] = [
  {
    id: "leistung",
    name: "Leistungsbereich",
    context: "Bescheide, Nachforderungen und rechtssichere Formulierungen pruefen.",
    recommendedModules: [
      "ki-einfach-erklaert",
      "sicherer-ki-umgang",
      "mythos-realitaet",
      "nachforderung-pruefen",
      "sgbii-leistung-grundlagen",
      "mitwirkung-nachweise"
    ]
  },
  {
    id: "integration",
    name: "Markt & Integration",
    context: "Beratung, Vermittlungsvorschlaege und individuelle Situationen einordnen.",
    recommendedModules: [
      "ki-einfach-erklaert",
      "sicherer-ki-umgang",
      "mythos-realitaet",
      "potenzialanalyse-kooperationsplan",
      "foerderinstrumente-integration"
    ]
  },
  {
    id: "service",
    name: "Eingangszone & Service",
    context: "Digitale Kanaele lotsen, Anliegen sortieren und einfache Orientierung geben.",
    recommendedModules: [
      "ki-einfach-erklaert",
      "sicherer-ki-umgang",
      "mythos-realitaet",
      "service-lotsen",
      "online-services-lotsen",
      "anliegen-klaeren"
    ]
  },
  {
    id: "leitung",
    name: "Teamleitung",
    context: "Sicherheit, Akzeptanz und gemeinsame Standards im Team begleiten.",
    recommendedModules: [
      "ki-einfach-erklaert",
      "sicherer-ki-umgang",
      "mythos-realitaet",
      "ki-governance-team",
      "qualitaet-datenschutz-standards"
    ]
  },
  {
    id: "allgemein",
    name: "Allgemeiner Einstieg",
    context: "Grundlagen verstehen, Unsicherheit sortieren und erste Regeln ueben.",
    recommendedModules: ["ki-einfach-erklaert", "mythos-realitaet", "sicherer-ki-umgang"]
  }
];

export const modules: Module[] = [
  {
    id: "ki-einfach-erklaert",
    title: "KI einfach erklaert",
    duration: "8 Min.",
    summary: "Was KI kann, was sie nicht kann und warum menschliche Pruefung bleibt.",
    targetRoles: ["alle"],
    sourceRefs: ["EU AI Act: KI-Kompetenz nach Art. 4", "DSK: KI und Datenschutz"],
    warning: "Lerninhalt: KI-Vorschlaege ersetzen keine fachliche Entscheidung.",
    cards: [
      "KI erkennt Muster in vorhandenen Texten und Daten. Sie versteht aber keinen Einzelfall wie eine Fachkraft.",
      "Eine KI-Antwort ist ein Vorschlag. Sie ersetzt keine Rechtspruefung, kein Ermessen und keine Dokumentation.",
      "Gute Nutzung beginnt mit klaren Aufgaben, fiktiven Beispielen und kritischer Kontrolle."
    ]
  },
  {
    id: "sicherer-ki-umgang",
    title: "Sicherer KI-Umgang",
    duration: "10 Min.",
    summary: "Datenschutz, Prompt-Regeln und Pruefschritte fuer Vorschlaege.",
    targetRoles: ["alle"],
    sourceRefs: ["DSK: Orientierungshilfe KI und Datenschutz", "BA: lokale Fachregel pruefen"],
    warning: "Keine echten Kundendaten in Demo-, Lern- oder KI-Systeme eingeben.",
    cards: [
      "Keine echten Kundendaten in Lern- oder Testsysteme eingeben.",
      "KI-Vorschlaege immer gegen Fachregel, Kontext und Tonalitaet pruefen.",
      "Unsichere Faelle markieren und mit Kolleginnen, Kollegen oder Leitung klaeren."
    ]
  },
  {
    id: "mythos-realitaet",
    title: "Mythos oder Realitaet?",
    duration: "6 Min.",
    summary: "Typische Aussagen zu KI einordnen und mit sicheren Handlungsregeln verbinden.",
    targetRoles: ["alle"],
    sourceRefs: ["EU AI Act: KI-Kompetenz", "BA: interne Pruef- und Verantwortungswege"],
    warning: "Orientierung fuer den sicheren Einstieg, keine technische oder rechtliche Vollschulung.",
    cards: [
      "Mythos: KI entscheidet bald allein. Realitaet: Fachliche Verantwortung bleibt beim Menschen.",
      "Mythos: Wer KI nutzt, braucht keine Fachkenntnis. Realitaet: Fachkenntnis wird wichtiger.",
      "Mythos: KI ist immer objektiv. Realitaet: Antworten koennen unvollstaendig oder verzerrt sein."
    ]
  },
  {
    id: "nachforderung-pruefen",
    title: "Nachforderung pruefen",
    duration: "7 Min.",
    summary: "Ein KI-Textentwurf wird fachlich, sprachlich und datenschutzbezogen geprueft.",
    targetRoles: ["leistung"],
    sourceRefs: ["BA SGB II: Fachliche Weisungen zu Mitwirkung, Anspruch und Leistungen"],
    warning: "Nur mit fiktiven Beispielen ueben. Konkrete Rechtsfolgen immer fachlich pruefen.",
    cards: [
      "Ist der Anlass klar und korrekt benannt?",
      "Sind Frist, Rechtsbezug und Ton angemessen?",
      "Wurden keine sensiblen Details unnoetig wiederholt?"
    ]
  },
  {
    id: "service-lotsen",
    title: "Digitalen Kanal lotsen",
    duration: "5 Min.",
    summary: "Anliegen einordnen und passende digitale oder persoenliche Wege empfehlen.",
    targetRoles: ["service"],
    sourceRefs: ["BA: Jobcenter-App und Online-Services"],
    warning: "Digitale Lotsung ersetzt keine persoenliche Klaerung bei komplexen oder sensiblen Anliegen.",
    cards: [
      "Nicht jedes Anliegen gehoert in den digitalen Kanal.",
      "Orientierungshilfe soll entlasten, nicht abwimmeln.",
      "Bei Unsicherheit bleibt persoenliche Beratung der sichere Weg."
    ]
  },
  {
    id: "sgbii-leistung-grundlagen",
    title: "Bürgergeld und Anspruch einordnen",
    duration: "9 Min.",
    summary: "Zentrale Leistungsbegriffe aus den SGB-II-Weisungen als Lernlandkarte.",
    targetRoles: ["leistung"],
    sourceRefs: ["BA SGB II: §§ 7-12 Anspruch, Hilfebeduerftigkeit, Einkommen und Vermoegen"],
    warning: "Lernlandkarte, keine Einzelfallbewertung. Immer aktuelle Fachliche Weisung pruefen.",
    cards: [
      "Im Leistungsbereich geht es oft um Anspruchsvoraussetzungen, Bedarf, Hilfebeduerftigkeit und anzurechnende Mittel.",
      "KI kann helfen, Pruefpunkte zu sortieren oder einen Entwurf sprachlich zu verbessern, darf aber keine Anspruchsentscheidung treffen.",
      "Sichere Nutzung bedeutet: Rechtsgrundlage, Sachverhalt, Nachweise und Entscheidung getrennt pruefen."
    ]
  },
  {
    id: "mitwirkung-nachweise",
    title: "Mitwirkung und Nachweise klar anfordern",
    duration: "8 Min.",
    summary: "Nachforderungen, Fristen und Datensparsamkeit in verstaendliche Texte uebersetzen.",
    targetRoles: ["leistung"],
    sourceRefs: ["BA SGB II: Mitwirkung, Nachweise, Leistungsminderungen"],
    warning: "Keine echten Fall- oder Sozialdaten in Prompt-Beispiele uebernehmen.",
    cards: [
      "Eine gute Nachforderung nennt Anlass, konkreten Nachweis, Frist und naechsten Schritt.",
      "KI-Entwuerfe muessen auf Ton, Datenumfang und fachliche Eindeutigkeit geprueft werden.",
      "Unklare oder belastende Formulierungen sollten vor Versand fachlich gegengelesen werden."
    ]
  },
  {
    id: "potenzialanalyse-kooperationsplan",
    title: "Potenzialanalyse und Kooperationsplan",
    duration: "9 Min.",
    summary: "Beratung strukturiert vorbereiten, ohne individuelle Verantwortung abzugeben.",
    targetRoles: ["integration"],
    sourceRefs: ["BA SGB II: § 15 Potenzialanalyse und Kooperationsplan", "BA: 4-Phasen-Modell"],
    warning: "KI darf Beratung vorbereiten, aber keine personenbezogene Integrationsstrategie entscheiden.",
    cards: [
      "Potenzialanalyse ordnet Staerken, Hemmnisse, Ziele und Unterstuetzungsbedarf.",
      "Ein Kooperationsplan braucht verstaendliche Ziele und realistische Schritte.",
      "KI kann Formulierungen und Gespraechsleitfaeden vorbereiten; Bewertung und Vereinbarung bleiben Aufgabe der Fachkraft."
    ]
  },
  {
    id: "foerderinstrumente-integration",
    title: "Förderinstrumente sicher vorsortieren",
    duration: "8 Min.",
    summary: "Weiterbildung, Vermittlungsbudget und Massnahmen als Pruefpunkte statt KI-Entscheidung.",
    targetRoles: ["integration"],
    sourceRefs: ["BA SGB II: § 16 Eingliederungsleistungen und angrenzende Weisungen"],
    warning: "Nur Orientierung: Foerderfaehigkeit und Ermessen muessen fachlich geprueft werden.",
    cards: [
      "KI kann bekannte Foerderarten als Checkliste sichtbar machen.",
      "Ob ein Instrument passt, haengt von Ziel, Eignung, Arbeitsmarktbezug und rechtlichen Voraussetzungen ab.",
      "Gute Prompts fragen nach Pruefpunkten und Rueckfragen, nicht nach einer fertigen Entscheidung."
    ]
  },
  {
    id: "online-services-lotsen",
    title: "Online-Services sicher lotsen",
    duration: "7 Min.",
    summary: "Jobcenter-App, Online-Antrag, Postfach und Upload-Funktionen passend erklaeren.",
    targetRoles: ["service"],
    sourceRefs: ["BA: Jobcenter-App", "BA: Online-Services im Ueberblick"],
    warning: "Bei komplexen Anliegen nicht in digitale Kanaele draengen.",
    cards: [
      "Service kann Anliegen vorsortieren: Antrag, Veraenderung, Nachweis, Termin oder Rueckfrage.",
      "KI kann eine kurze Erklaerung des passenden digitalen Wegs entwerfen.",
      "Der Entwurf muss respektvoll bleiben und darf persoenliche Hilfe nicht ersetzen."
    ]
  },
  {
    id: "anliegen-klaeren",
    title: "Anliegen schnell und respektvoll klären",
    duration: "6 Min.",
    summary: "Erstkontakt strukturieren: Was ist dringend, was fehlt, wohin gehoert das Anliegen?",
    targetRoles: ["service"],
    sourceRefs: ["BA: Jobcenter-Aufgaben und lokale Serviceprozesse"],
    warning: "Sensible oder eskalierende Situationen brauchen persoenliche Bearbeitung.",
    cards: [
      "Eine gute Erstklaerung trennt Anliegen, Dringlichkeit, fehlende Unterlagen und naechsten Kontaktweg.",
      "KI kann neutrale Rueckfragen vorschlagen, die ohne echte Kundendaten funktionieren.",
      "Bei Unsicherheit ist Weitergabe an die passende Fachstelle besser als scheinbar schnelle KI-Antworten."
    ]
  },
  {
    id: "ki-governance-team",
    title: "KI-Governance im Team verankern",
    duration: "10 Min.",
    summary: "Regeln, Rollen und Lernnachweise fuer sichere KI-Nutzung im Team klaeren.",
    targetRoles: ["leitung"],
    sourceRefs: ["EU AI Act: KI-Kompetenz", "DSK: KI und Datenschutz"],
    warning: "Teamstandards muessen zu lokalen Vorgaben, Datenschutz und Personalvertretung passen.",
    cards: [
      "Teamleitungen brauchen klare Leitplanken: erlaubte Zwecke, verbotene Daten, Pruefpflicht und Eskalationsweg.",
      "KI-Kompetenz ist kontextbezogen: Aufgaben, Risiken und Erfahrung des Teams muessen beruecksichtigt werden.",
      "Regelmaessige Reflexion hilft, Nutzen und Risiken sichtbar zu halten."
    ]
  },
  {
    id: "qualitaet-datenschutz-standards",
    title: "Qualitäts- und Datenschutzstandards prüfen",
    duration: "9 Min.",
    summary: "Review-Routinen fuer KI-Entwuerfe, Prompts und sensible Arbeitsablaeufe.",
    targetRoles: ["leitung"],
    sourceRefs: ["DSK: Rechtsgrundlage, Datenschutz-Folgenabschaetzung, menschliche Letztentscheidung"],
    warning: "Automatisierte Letztentscheidungen und echte Sozialdaten sind fuer den Prototyp tabu.",
    cards: [
      "Ein guter Standard beschreibt, welche KI-Nutzung erlaubt ist und welche Daten ausgeschlossen sind.",
      "Qualitaetspruefung braucht Stichproben, fachliche Gegenpruefung und klare Verantwortlichkeit.",
      "Datenschutzrisiken muessen vor Ausweitung einer Nutzung bewertet werden."
    ]
  }
];

export const checkQuestions = [
  { id: "confidence", label: "Ich kann gut einschaetzen, wofuer KI im Jobcenter nuetzlich sein kann." },
  { id: "rules", label: "Ich kenne die wichtigsten Regeln fuer sicheren KI-Einsatz." },
  { id: "dataSafety", label: "Ich erkenne, wann Daten zu sensibel fuer eine KI-Uebung sind." },
  { id: "reviewSkill", label: "Ich kann einen KI-Vorschlag kritisch pruefen, bevor ich ihn nutze." },
  { id: "textStruktur", label: "Ich habe KI schon genutzt, um Texte oder Ideen zu strukturieren." },
  { id: "vorsichtWissen", label: "Ich weiss, wann ich bei KI-Ergebnissen fachlich oder datenschutzrechtlich besonders vorsichtig sein muss." }
] as const;

export const mythQuestions = [
  {
    statement: "KI kann Fachentscheidungen automatisch rechtssicher treffen.",
    answer: false,
    explanation: "KI kann vorbereiten und strukturieren. Entscheiden, pruefen und verantworten muss weiterhin der Mensch."
  },
  {
    statement: "Gute Prompts enthalten klare Aufgabe, Kontext und Pruefkriterien.",
    answer: true,
    explanation: "Je klarer die Aufgabe, desto besser laesst sich der Vorschlag anschliessend kontrollieren."
  },
  {
    statement: "Fiktive Beispiele sind im Training sicherer als echte Kundendaten.",
    answer: true,
    explanation: "Training und Uebung sollen ohne reale personenbezogene Daten funktionieren."
  }
];

export const practiceCase: PracticeCase = {
  title: "Praxisfall: KI-Entwurf fuer eine Nachforderung",
  situation:
    "Eine KI formuliert einen Entwurf fuer eine Nachforderung. Der Text klingt fluessig, nennt aber viele Details aus dem Fall und bleibt beim konkreten Nachweis unklar.",
  options: [
    {
      id: "send",
      label: "Direkt senden, weil der Text professionell klingt.",
      feedback: "Nicht sicher. Fluessige Sprache ersetzt keine fachliche und datenschutzbezogene Pruefung.",
      recommended: false
    },
    {
      id: "review",
      label: "Fachregel, Datenumfang, Frist und Ton pruefen und den Text kuerzen.",
      feedback: "Sicherer Weg. Der Vorschlag wird als Entwurf behandelt und fachlich nachgearbeitet.",
      recommended: true
    },
    {
      id: "ignore",
      label: "KI grundsaetzlich nicht nutzen.",
      feedback: "Verstaendlich, aber die Lern-App soll helfen, Nutzen und Grenzen kontrolliert kennenzulernen.",
      recommended: false
    }
  ],
  takeaway: "KI-Texte sind Arbeitsentwuerfe. Erst Pruefung, dann Nutzung."
};

export const checklistItems = [
  { id: "source-check", label: "Quelle oder Fachregel gegenpruefen" },
  { id: "privacy-check", label: "Keine unnoetigen personenbezogenen Details" },
  { id: "tone-check", label: "Ton klar, respektvoll und verstaendlich" },
  { id: "decision-check", label: "Keine Entscheidung an KI delegieren" }
];

// ── Praxis Examples ────────────────────────────────────────────────────────────

export type PraxisExample = {
  id: string;
  title: string;
  situation: string;
  kiHelp: string;
  examplePrompt: string;
  kiLimits: string;
  humanCheck: string;
};

export const praxisExamples: PraxisExample[] = [
  {
    id: "nachforderung",
    title: "Nachforderung formulieren",
    situation: "Eine Fachkraft muss einem fiktiven Musterbuerger Unterlagen nachfordern. Der Brief soll klar, freundlich und fristgebunden sein.",
    kiHelp: "KI kann einen Briefentwurf erstellen: Anlass, benoedigte Unterlagen, Frist und Hinweis auf moegliche Folgen.",
    examplePrompt: "Formuliere eine hoefliche Nachforderung fuer fehlende Einkommensnachweise. Frist 14 Tage. Nur fiktive Angaben verwenden.",
    kiLimits: "KI setzt keine Fristen rechtssicher und kennt keinen echten Einzelfall.",
    humanCheck: "Rechtsgrundlage, korrekte Frist, Ton und Vollstaendigkeit muessen die Fachkraft pruefen."
  },
  {
    id: "digital-erklaeren",
    title: "Digitalen Weg erklaeren",
    situation: "Eine ratsuchende Person moechte wissen, wie sie einen Nachweis in der Jobcenter-App hochlaedt. Die Fachkraft braucht eine verstaendliche Kurzanleitung.",
    kiHelp: "KI kann eine Schritt-fuer-Schritt-Anleitung in einfacher Sprache ohne Fachjargon erstellen.",
    examplePrompt: "Erklaere in drei Schritten, wie man in der Jobcenter-App einen Nachweis hochlaedt. Zielgruppe: Person ohne digitale Vorkenntnisse.",
    kiLimits: "KI kennt keine App-Updates und kann Menuepfade falsch benennen.",
    humanCheck: "Schritte auf Aktualitaet pruefen. Keine Zusagen ueber Bearbeitungszeiten machen."
  },
  {
    id: "kooperationsplan-vorbereiten",
    title: "Beratungsgespraech vorbereiten",
    situation: "Vor einem Gespraech soll ein Entwurf fuer Ziele und naechste Schritte im Kooperationsplan vorbereitet werden. Keine echten Personendaten.",
    kiHelp: "KI kann typische Zielfelder und Formulierungsbausteine fuer einen Kooperationsplan vorschlagen.",
    examplePrompt: "Erstelle Formulierungsbausteine fuer einen Kooperationsplan: Ziel, Zwischenschritte, Unterstuetzungsbedarf. Fiktives Beispiel.",
    kiLimits: "KI kennt weder die Person noch ihre Situation. Inhalte brauchen persoenliche Abstimmung im Gespraech.",
    humanCheck: "Alle Inhalte im Gespraech abstimmen. Nichts ohne Zustimmung uebernehmen."
  }
];

// ── Praxis Input Response ──────────────────────────────────────────────────────

export type PraxisInputResponse = {
  kiHelp: string;
  kiCannotHelp: string;
  prompt: string;
  humanCheck: string;
};

function normalizePraxisInput(text: string): string {
  return text
    .toLowerCase()
    .replace(/ü/g, "ue")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ß/g, "ss")
    .replace(/-/g, "")
    .replace(/\be\s+mail\b/g, "email");
}

export function detectPraxisResponse(input: string): PraxisInputResponse {
  const lower = normalizePraxisInput(input);
  if (/brief|email|formulier|nachforder|anschreiben|schreiben|text|umschreiben/.test(lower)) {
    return {
      kiHelp: "KI kann einen Briefentwurf oder eine Nachricht formulieren: Anlass klar benennen, Ton anpassen, strukturiert aufbauen.",
      kiCannotHelp: "KI setzt keine rechtsgueltige Frist und kennt keinen echten Einzelfall.",
      prompt: "Formuliere einen freundlichen Brief mit Anlass, Frist und naechstem Schritt. Nur fiktive Angaben verwenden.",
      humanCheck: "Ton, Frist, Rechtsgrundlage und Vollstaendigkeit muessen die Fachkraft pruefen."
    };
  }
  if (/erklaer|versteh|einfach|buerger|digital|app|online|upload|anleitung/.test(lower)) {
    return {
      kiHelp: "KI kann Themen in einfacher Sprache erklaeren oder eine Schritt-fuer-Schritt-Anleitung erstellen.",
      kiCannotHelp: "KI kennt keine aktuellen App-Versionen und kann Verfahrensdetails falsch wiedergeben.",
      prompt: "Erklaere in drei einfachen Schritten, wie [Thema] funktioniert. Zielgruppe: Person ohne Vorkenntnisse.",
      humanCheck: "Inhalt auf Aktualitaet pruefen. Keine Zusagen ueber Bearbeitungszeiten oder Rechtsfolgen."
    };
  }
  if (/pruefen|kontroll|qualitaet|fehler|checken|sicherheit/.test(lower)) {
    return {
      kiHelp: "KI kann einen Text auf Vollstaendigkeit, Klarheit und Ton pruefen und Schwachstellen benennen.",
      kiCannotHelp: "KI kann keine fachliche oder rechtliche Richtigkeit garantieren.",
      prompt: "Pruefe den folgenden Textentwurf auf Klarheit, Ton und moegliche Luecken. Benenne konkrete Verbesserungsvorschlaege. Nur fiktive Daten.",
      humanCheck: "Fachliche Korrektheit und Rechtsgrundlage muss die Fachkraft bestaetigen."
    };
  }
  if (/kooperationsplan|vermittlung|beratung|ziel|foerderung|massnahme|integration|plan/.test(lower)) {
    return {
      kiHelp: "KI kann Formulierungsbausteine fuer Ziele, Zwischenschritte und Unterstuetzungsbedarf vorschlagen.",
      kiCannotHelp: "KI kennt weder Person noch Situation. Keine Inhalte ohne persoenliche Abstimmung uebernehmen.",
      prompt: "Erstelle Formulierungsbausteine fuer [Thema]: Ziel, Schritte, Unterstuetzungsbedarf. Fiktives Beispiel ohne Personendaten.",
      humanCheck: "Inhalte muessen im Gespraech abgestimmt werden. Nichts ohne Zustimmung uebernehmen."
    };
  }
  if (/entscheid|ermessen|rechtlich|rechtsfrag|anspruch|berechtigung/.test(lower)) {
    return {
      kiHelp: "KI kann Informationen zusammenfassen und Pruefpunkte zu einem Thema nennen.",
      kiCannotHelp: "KI trifft keine Ermessensentscheidungen und gibt keine rechtsverbindlichen Auskuenfte. Das ist Aufgabe der Fachkraft.",
      prompt: "Fasse die wichtigsten Pruefpunkte zu [Thema] zusammen. Keine Entscheidung — nur Orientierung. Fiktives Beispiel.",
      humanCheck: "Alle rechtlichen Fragen und Ermessensentscheidungen liegen ausschliesslich bei der Fachkraft."
    };
  }
  return {
    kiHelp: "KI kann bei diesem Anliegen helfen, einen Text zu strukturieren, Informationen zusammenzufassen oder Formulierungsvorschlaege zu machen.",
    kiCannotHelp: "KI kann keine Fachentscheidungen treffen, keine Rechtsverbindlichkeit herstellen und keinen echten Einzelfall einschaetzen.",
    prompt: "Beschreibe die Aufgabe klar: Was soll entstehen? Fuer wen? Welche Einschraenkungen gelten? Nur fiktive Daten verwenden.",
    humanCheck: "Fachliche Pruefung und Verantwortung bleiben bei der Fachkraft. KI liefert nur einen Entwurf."
  };
}

// ── Prüfen Result ──────────────────────────────────────────────────────────────

export type PruefResult = {
  type: string;
  pruefpfad: string[];
  quellenarten: string[];
  stichworte: string[];
  hinweise: string[];
};

function normalizePruefInput(text: string): string {
  return text
    .toLowerCase()
    .replace(/ü/g, "ue")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ß/g, "ss");
}

export function detectPruefResult(input: string): PruefResult {
  const lower = normalizePruefInput(input);
  if (/buergergeld|bedarf|einkommen|vermoegen|miete|mehrbedarf|leistung|hilfebeduerft/.test(lower)) {
    return {
      type: "Leistung",
      pruefpfad: [
        "Anspruchsvoraussetzungen pruefen (Bedarf, Hilfebeduerftigkeit, Alter, Aufenthalt)",
        "Einkommens- und Vermoegensanrechnung klaeren",
        "Miet- und Nebenkostenuebernnahme bewerten",
        "Bedarfsgemeinschaft und Haushaltszusammensetzung pruefen",
        "Aktuelle Fachliche Weisungen gegen den Sachverhalt halten"
      ],
      quellenarten: [
        "BA SGB II Fachliche Weisungen",
        "§§ 7-12 SGB II (Anspruch, Bedarf, Einkommen, Vermoegen)",
        "Lokale Arbeitshilfen des Jobcenters"
      ],
      stichworte: ["Buergergeld", "Hilfebeduerftigkeit", "Bedarfsgemeinschaft", "Einkommensanrechnung", "Vermoegensfreibetrag"],
      hinweise: [
        "BA Fachliche Weisungen zu Einkommen/Vermoegen nach SGB II pruefen",
        "Lokale Bescheidvorlagen und Rechtsbehelfsbelehrung pruefen",
        "Fachliche Letztentscheidung und Dokumentation liegen bei der Fachkraft"
      ]
    };
  }
  if (/nachweis|unterlagen|mitwirkung|frist|vorlegen|nichtvorlage/.test(lower)) {
    return {
      type: "Mitwirkung",
      pruefpfad: [
        "Mitwirkungspflicht pruefen (§§ 60 ff. SGB I)",
        "Konkrete Unterlagen benennen, die fehlen",
        "Angemessene Frist setzen und dokumentieren",
        "Auf moegliche Folgen bei Nichtvorlage hinweisen",
        "Erinnerungs- und Nachweisstufen klaeren"
      ],
      quellenarten: [
        "§§ 60-65 SGB I (Mitwirkungspflichten)",
        "BA SGB II Fachliche Weisungen zu Mitwirkung und Leistungsminderung",
        "Lokale Bescheid- und Nachforderungsvorlagen"
      ],
      stichworte: ["Mitwirkung", "Nachweise", "Frist", "Nichtvorlage", "Leistungsminderung"],
      hinweise: [
        "Nachforderungsschreiben-Vorlagen des Jobcenters pruefen",
        "Fristen muessen angemessen sein; fachliche Vorgaben beachten",
        "Fachliche Entscheidung ueber Folgen liegt bei der Fachkraft"
      ]
    };
  }
  if (/kooperationsplan|vermittlung|weiterbildung|massnahme|foerderung|integration|eingliederung/.test(lower)) {
    return {
      type: "Integration",
      pruefpfad: [
        "Potenzialanalyse und Integrationsziele klaeren (§ 15 SGB II)",
        "Passende Foerderinstrumente pruefen (FbW, Vermittlungsbudget, Massnahmen)",
        "Kooperationsplan abstimmen und dokumentieren",
        "Foerderfaehigkeit und rechtliche Voraussetzungen pruefen",
        "Arbeitsmarktbezug und Eignung beruecksichtigen"
      ],
      quellenarten: [
        "§§ 15-16 SGB II (Kooperationsplan, Eingliederungsleistungen)",
        "BA SGB II Fachliche Weisungen zu Foerderinstrumenten",
        "Lokale Kooperationsplan-Vorlagen"
      ],
      stichworte: ["Kooperationsplan", "Foerderinstrumente", "Weiterbildung", "Vermittlungsbudget", "Integrationsziel"],
      hinweise: [
        "BA Fachliche Weisungen zu Eingliederungsleistungen nach SGB II pruefen",
        "Foerderfaehigkeit muss fachlich bewertet werden",
        "Keine KI-gestuetzte Ermessensentscheidung ohne menschliche Pruefung"
      ]
    };
  }
  if (/online|app|postfach|antrag|upload|termin|digital|selbstservice/.test(lower)) {
    return {
      type: "Service und Digital",
      pruefpfad: [
        "Art des Anliegens klaeren (Antrag, Nachweis, Aenderung, Rueckfrage)",
        "Passenden digitalen Kanal pruefen (Jobcenter-App, Online-Antrag, Postfach)",
        "Zugangshindernisse klaeren (Technik, Sprachbarriere, Barrierefreiheit)",
        "Persoenlichen Bearbeitungsweg als Alternative benennen"
      ],
      quellenarten: [
        "BA Online-Services-Dokumentation",
        "BA Jobcenter-App (aktueller Funktionsumfang)",
        "Lokale Service-Prozesse"
      ],
      stichworte: ["Jobcenter-App", "Online-Antrag", "Postfach", "Upload", "Termin"],
      hinweise: [
        "App-Funktionsumfang regelmaessig pruefen — KI kann veraltete Informationen liefern",
        "Bei komplexen Anliegen persoenlichen Kontakt bevorzugen",
        "Keine Bearbeitungszeiten oder Erfolgsversprechen zusagen"
      ]
    };
  }
  return {
    type: "Allgemeiner Pruefpfad",
    pruefpfad: [
      "Art des Falls klaeren: Leistung, Mitwirkung, Integration oder Service?",
      "Rechtliche Grundlage identifizieren (SGB II/III/I, BA-Weisungen)",
      "Relevante Unterlagen und Nachweise benennen",
      "Fachliche Pruefschritte aus den Weisungen ableiten",
      "Entscheidung dokumentieren und Verantwortung klaeren"
    ],
    quellenarten: [
      "BA SGB II Fachliche Weisungen (nach Thema suchen)",
      "Lokale Arbeitshilfen des Jobcenters",
      "Gesetzestexte (SGB I, II, III) ueber bundesrecht.juris.de"
    ],
    stichworte: ["SGB II", "BA Fachliche Weisungen", "Einzelfallpruefung", "Dokumentation"],
    hinweise: [
      "Erst Falltyp klaeren — dann gezielt in Fachlichen Weisungen nachschlagen",
      "Keine rechtliche Entscheidung ohne vollstaendige Sachverhaltsaufklaerung",
      "Fachliche und rechtliche Letztentscheidung liegt beim Menschen"
    ]
  };
}
