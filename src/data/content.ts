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

// Local, dependency-free level key (kept compatible with AiLevel in lib/appState
// to avoid a circular import between content.ts and appState.ts).
export type AiLevelKey = "einsteiger" | "grundkenntnisse" | "fortgeschritten";

export type MythQuestion = {
  statement: string;
  answer: boolean;
  explanation: string;
};

// Real knowledge questions for "KI-Grundlagen für alle" — deliberately NOT
// myth/reality statements, so this area stays distinct from "Mythos oder Realität?".
export type BasicsQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const roles: Role[] = [
  {
    id: "leistung",
    name: "Leistungsbereich",
    context: "Bescheide, Nachforderungen und rechtssichere Formulierungen prüfen.",
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
    context: "Beratung, Vermittlungsvorschläge und individuelle Situationen einordnen.",
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
    context: "Digitale Kanäle lotsen, Anliegen sortieren und einfache Orientierung geben.",
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
    context: "Grundlagen verstehen, Unsicherheit sortieren und erste Regeln üben.",
    recommendedModules: ["ki-einfach-erklaert", "mythos-realitaet", "sicherer-ki-umgang"]
  }
];

export const modules: Module[] = [
  {
    id: "ki-einfach-erklaert",
    title: "KI einfach erklärt",
    duration: "8 Min.",
    summary: "Was KI kann, was sie nicht kann und warum menschliche Prüfung bleibt.",
    targetRoles: ["alle"],
    sourceRefs: ["EU AI Act: KI-Kompetenz nach Art. 4", "DSK: KI und Datenschutz"],
    warning: "Lerninhalt: KI-Vorschläge ersetzen keine fachliche Entscheidung.",
    cards: [
      "KI erkennt Muster in vorhandenen Texten und Daten. Sie versteht aber keinen Einzelfall wie eine Fachkraft.",
      "Eine KI-Antwort ist ein Vorschlag. Sie ersetzt keine Rechtsprüfung, kein Ermessen und keine Dokumentation.",
      "Gute Nutzung beginnt mit klaren Aufgaben, fiktiven Beispielen und kritischer Kontrolle."
    ]
  },
  {
    id: "sicherer-ki-umgang",
    title: "Sicherer KI-Umgang",
    duration: "10 Min.",
    summary: "Datenschutz, Prompt-Regeln und Prüfschritte für Vorschläge.",
    targetRoles: ["alle"],
    sourceRefs: ["DSK: Orientierungshilfe KI und Datenschutz", "BA: lokale Fachregel prüfen"],
    warning: "Keine echten Kundendaten in Demo-, Lern- oder KI-Systeme eingeben.",
    cards: [
      "Keine echten Kundendaten in Lern- oder Testsysteme eingeben.",
      "KI-Vorschläge immer gegen Fachregel, Kontext und Tonalität prüfen.",
      "Unsichere Fälle markieren und mit Kolleginnen, Kollegen oder Leitung klären."
    ]
  },
  {
    id: "mythos-realitaet",
    title: "Mythos oder Realität?",
    duration: "6 Min.",
    summary: "Typische Aussagen zu KI einordnen und mit sicheren Handlungsregeln verbinden.",
    targetRoles: ["alle"],
    sourceRefs: ["EU AI Act: KI-Kompetenz", "BA: interne Prüf- und Verantwortungswege"],
    warning: "Orientierung für den sicheren Einstieg, keine technische oder rechtliche Vollschulung.",
    cards: [
      "Mythos: KI entscheidet bald allein. Realität: Fachliche Verantwortung bleibt beim Menschen.",
      "Mythos: Wer KI nutzt, braucht keine Fachkenntnis. Realität: Fachkenntnis wird wichtiger.",
      "Mythos: KI ist immer objektiv. Realität: Antworten können unvollständig oder verzerrt sein."
    ]
  },
  {
    id: "nachforderung-pruefen",
    title: "Nachforderung prüfen",
    duration: "7 Min.",
    summary: "Ein KI-Textentwurf wird fachlich, sprachlich und datenschutzbezogen geprüft.",
    targetRoles: ["leistung"],
    sourceRefs: ["BA SGB II: Fachliche Weisungen zu Mitwirkung, Anspruch und Leistungen"],
    warning: "Nur mit fiktiven Beispielen üben. Konkrete Rechtsfolgen immer fachlich prüfen.",
    cards: [
      "Ist der Anlass klar und korrekt benannt?",
      "Sind Frist, Rechtsbezug und Ton angemessen?",
      "Wurden keine sensiblen Details unnötig wiederholt?"
    ]
  },
  {
    id: "service-lotsen",
    title: "Digitalen Kanal lotsen",
    duration: "5 Min.",
    summary: "Anliegen einordnen und passende digitale oder persönliche Wege empfehlen.",
    targetRoles: ["service"],
    sourceRefs: ["BA: Jobcenter-App und Online-Services"],
    warning: "Digitale Lotsung ersetzt keine persönliche Klärung bei komplexen oder sensiblen Anliegen.",
    cards: [
      "Nicht jedes Anliegen gehört in den digitalen Kanal.",
      "Orientierungshilfe soll entlasten, nicht abwimmeln.",
      "Bei Unsicherheit bleibt persönliche Beratung der sichere Weg."
    ]
  },
  {
    id: "sgbii-leistung-grundlagen",
    title: "Bürgergeld und Anspruch einordnen",
    duration: "9 Min.",
    summary: "Zentrale Leistungsbegriffe aus den SGB-II-Weisungen als Lernlandkarte.",
    targetRoles: ["leistung"],
    sourceRefs: ["BA SGB II: §§ 7-12 Anspruch, Hilfebedürftigkeit, Einkommen und Vermögen"],
    warning: "Lernlandkarte, keine Einzelfallbewertung. Immer aktuelle Fachliche Weisung prüfen.",
    cards: [
      "Im Leistungsbereich geht es oft um Anspruchsvoraussetzungen, Bedarf, Hilfebedürftigkeit und anzurechnende Mittel.",
      "KI kann helfen, Prüfpunkte zu sortieren oder einen Entwurf sprachlich zu verbessern, darf aber keine Anspruchsentscheidung treffen.",
      "Sichere Nutzung bedeutet: Rechtsgrundlage, Sachverhalt, Nachweise und Entscheidung getrennt prüfen."
    ]
  },
  {
    id: "mitwirkung-nachweise",
    title: "Mitwirkung und Nachweise klar anfordern",
    duration: "8 Min.",
    summary: "Nachforderungen, Fristen und Datensparsamkeit in verständliche Texte übersetzen.",
    targetRoles: ["leistung"],
    sourceRefs: ["BA SGB II: Mitwirkung, Nachweise, Leistungsminderungen"],
    warning: "Keine echten Fall- oder Sozialdaten in Prompt-Beispiele übernehmen.",
    cards: [
      "Eine gute Nachforderung nennt Anlass, konkreten Nachweis, Frist und nächsten Schritt.",
      "KI-Entwürfe müssen auf Ton, Datenumfang und fachliche Eindeutigkeit geprüft werden.",
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
      "Potenzialanalyse ordnet Stärken, Hemmnisse, Ziele und Unterstützungsbedarf.",
      "Ein Kooperationsplan braucht verständliche Ziele und realistische Schritte.",
      "KI kann Formulierungen und Gesprächsleitfäden vorbereiten; Bewertung und Vereinbarung bleiben Aufgabe der Fachkraft."
    ]
  },
  {
    id: "foerderinstrumente-integration",
    title: "Förderinstrumente sicher vorsortieren",
    duration: "8 Min.",
    summary: "Weiterbildung, Vermittlungsbudget und Massnahmen als Prüfpunkte statt KI-Entscheidung.",
    targetRoles: ["integration"],
    sourceRefs: ["BA SGB II: § 16 Eingliederungsleistungen und angrenzende Weisungen"],
    warning: "Nur Orientierung: Förderfähigkeit und Ermessen müssen fachlich geprüft werden.",
    cards: [
      "KI kann bekannte Förderarten als Checkliste sichtbar machen.",
      "Ob ein Instrument passt, hängt von Ziel, Eignung, Arbeitsmarktbezug und rechtlichen Voraussetzungen ab.",
      "Gute Prompts fragen nach Prüfpunkten und Rückfragen, nicht nach einer fertigen Entscheidung."
    ]
  },
  {
    id: "online-services-lotsen",
    title: "Online-Services sicher lotsen",
    duration: "7 Min.",
    summary: "Jobcenter-App, Online-Antrag, Postfach und Upload-Funktionen passend erklären.",
    targetRoles: ["service"],
    sourceRefs: ["BA: Jobcenter-App", "BA: Online-Services im Überblick"],
    warning: "Bei komplexen Anliegen nicht in digitale Kanäle drängen.",
    cards: [
      "Service kann Anliegen vorsortieren: Antrag, Veränderung, Nachweis, Termin oder Rückfrage.",
      "KI kann eine kurze Erklärung des passenden digitalen Wegs entwerfen.",
      "Der Entwurf muss respektvoll bleiben und darf persönliche Hilfe nicht ersetzen."
    ]
  },
  {
    id: "anliegen-klaeren",
    title: "Anliegen schnell und respektvoll klären",
    duration: "6 Min.",
    summary: "Erstkontakt strukturieren: Was ist dringend, was fehlt, wohin gehört das Anliegen?",
    targetRoles: ["service"],
    sourceRefs: ["BA: Jobcenter-Aufgaben und lokale Serviceprozesse"],
    warning: "Sensible oder eskalierende Situationen brauchen persönliche Bearbeitung.",
    cards: [
      "Eine gute Erstklärung trennt Anliegen, Dringlichkeit, fehlende Unterlagen und nächsten Kontaktweg.",
      "KI kann neutrale Rückfragen vorschlagen, die ohne echte Kundendaten funktionieren.",
      "Bei Unsicherheit ist Weitergabe an die passende Fachstelle besser als scheinbar schnelle KI-Antworten."
    ]
  },
  {
    id: "ki-governance-team",
    title: "KI-Governance im Team verankern",
    duration: "10 Min.",
    summary: "Regeln, Rollen und Lernnachweise für sichere KI-Nutzung im Team klären.",
    targetRoles: ["leitung"],
    sourceRefs: ["EU AI Act: KI-Kompetenz", "DSK: KI und Datenschutz"],
    warning: "Teamstandards müssen zu lokalen Vorgaben, Datenschutz und Personalvertretung passen.",
    cards: [
      "Teamleitungen brauchen klare Leitplanken: erlaubte Zwecke, verbotene Daten, Prüfpflicht und Eskalationsweg.",
      "KI-Kompetenz ist kontextbezogen: Aufgaben, Risiken und Erfahrung des Teams müssen berücksichtigt werden.",
      "Regelmässige Reflexion hilft, Nutzen und Risiken sichtbar zu halten."
    ]
  },
  {
    id: "qualitaet-datenschutz-standards",
    title: "Qualitäts- und Datenschutzstandards prüfen",
    duration: "9 Min.",
    summary: "Review-Routinen für KI-Entwürfe, Prompts und sensible Arbeitsabläufe.",
    targetRoles: ["leitung"],
    sourceRefs: ["DSK: Rechtsgrundlage, Datenschutz-Folgenabschätzung, menschliche Letztentscheidung"],
    warning: "Automatisierte Letztentscheidungen und echte Sozialdaten sind für den Prototyp tabu.",
    cards: [
      "Ein guter Standard beschreibt, welche KI-Nutzung erlaubt ist und welche Daten ausgeschlossen sind.",
      "Qualitätsprüfung braucht Stichproben, fachliche Gegenprüfung und klare Verantwortlichkeit.",
      "Datenschutzrisiken müssen vor Ausweitung einer Nutzung bewertet werden."
    ]
  }
];

export const checkQuestions = [
  { id: "confidence", label: "Ich kann gut einschätzen, wofür KI im Jobcenter nützlich sein kann." },
  { id: "rules", label: "Ich kenne die wichtigsten Regeln für sicheren KI-Einsatz." },
  { id: "dataSafety", label: "Ich erkenne, wann Daten zu sensibel für eine KI-Übung sind." },
  { id: "reviewSkill", label: "Ich kann einen KI-Vorschlag kritisch prüfen, bevor ich ihn nutze." },
  { id: "textStruktur", label: "Ich habe KI schon genutzt, um Texte oder Ideen zu strukturieren." },
  { id: "vorsichtWissen", label: "Ich weiss, wann ich bei KI-Ergebnissen fachlich oder datenschutzrechtlich besonders vorsichtig sein muss." }
] as const;

export const mythQuestions = [
  {
    statement: "KI kann Fachentscheidungen automatisch rechtssicher treffen.",
    answer: false,
    explanation: "KI kann vorbereiten und strukturieren. Entscheiden, prüfen und verantworten muss weiterhin der Mensch."
  },
  {
    statement: "Gute Prompts enthalten klare Aufgabe, Kontext und Prüfkriterien.",
    answer: true,
    explanation: "Je klarer die Aufgabe, desto besser lässt sich der Vorschlag anschliessend kontrollieren."
  },
  {
    statement: "Fiktive Beispiele sind im Training sicherer als echte Kundendaten.",
    answer: true,
    explanation: "Training und Übung sollen ohne reale personenbezogene Daten funktionieren."
  }
];

// Level-dependent myth questions for "Mythos oder Realität?".
// einsteiger reuses the base set above; the other levels go deeper.
export const mythQuestionsByLevel: Record<AiLevelKey, MythQuestion[]> = {
  einsteiger: mythQuestions,
  grundkenntnisse: [
    {
      statement: "Ein KI-Entwurf darf ohne weitere Prüfung an Bürger versendet werden.",
      answer: false,
      explanation: "Ein Entwurf muss vor dem Versand auf Ton, Datenumfang, Frist und fachliche Richtigkeit geprüft werden."
    },
    {
      statement: "Vor dem Versand sollte ein KI-Text auf Ton, Datenumfang und Frist geprüft werden.",
      answer: true,
      explanation: "Diese Prüfschritte sichern Qualität und Datenschutz, bevor etwas nach aussen geht."
    },
    {
      statement: "Eine klare Aufgabenbeschreibung im Prompt macht die spätere Kontrolle einfacher.",
      answer: true,
      explanation: "Je klarer Aufgabe und Prüfkriterien, desto leichter lässt sich der Vorschlag bewerten."
    },
    {
      statement: "KI erkennt zuverlässig, welche Daten im Einzelfall sensibel sind.",
      answer: false,
      explanation: "Die Einschätzung sensibler Daten bleibt Aufgabe der Fachkraft. KI kann das nicht zuverlässig leisten."
    }
  ],
  fortgeschritten: [
    {
      statement: "Die fachliche und rechtliche Letztverantwortung bleibt auch bei KI-Nutzung beim Menschen.",
      answer: true,
      explanation: "KI bereitet vor und strukturiert. Entscheidung, Prüfung und Verantwortung liegen bei der Fachkraft."
    },
    {
      statement: "Teamstandards für KI-Nutzung müssen Datenschutz, Eskalationswege und Prüfpflichten regeln.",
      answer: true,
      explanation: "Klare Leitplanken zu erlaubten Zwecken, verbotenen Daten und Prüfpflicht machen Nutzung sicher."
    },
    {
      statement: "Wenn ein KI-Tool als DSGVO-konform beworben wird, sind eigene Datenschutzprüfungen überflüssig.",
      answer: false,
      explanation: "Werbeaussagen ersetzen keine eigene Bewertung von Rechtsgrundlage, Datenfluss und Risiko."
    },
    {
      statement: "Automatisierte Letztentscheidungen über Leistungen sind im Jobcenter unproblematisch.",
      answer: false,
      explanation: "Letztentscheidungen über Leistungen brauchen menschliche Prüfung und Dokumentation."
    }
  ]
};

// Level-dependent real knowledge questions shown in "KI-Grundlagen für alle".
// These are genuine multiple-choice basics — NOT myth/reality statements — so the
// area is clearly different from "Mythos oder Realität?".
export const basicsQuestionsByLevel: Record<AiLevelKey, BasicsQuestion[]> = {
  einsteiger: [
    {
      question: "Was ist eine KI-Antwort im Arbeitsalltag am ehesten?",
      options: [
        "Eine endgültige Entscheidung",
        "Ein Vorschlag, den du fachlich prüfst",
        "Eine rechtsverbindliche Auskunft"
      ],
      correctIndex: 1,
      explanation: "Eine KI-Antwort ist ein Entwurf. Prüfung, Ermessen und Verantwortung bleiben bei der Fachkraft."
    },
    {
      question: "Welche Daten darfst du in eine KI-Übung eingeben?",
      options: [
        "Echte Kundendaten aus der Akte",
        "Nur fiktive oder anonymisierte Beispiele",
        "Beliebige interne Vermerke"
      ],
      correctIndex: 1,
      explanation: "In Lern- und Demo-Systemen gehören keine echten personenbezogenen Daten. Nutze fiktive Beispiele."
    }
  ],
  grundkenntnisse: [
    {
      question: "Ein KI-Text klingt flüssig und professionell. Was folgt daraus für den Inhalt?",
      options: [
        "Der Inhalt ist damit sicher korrekt",
        "Über die fachliche Richtigkeit sagt das nichts aus",
        "Eine fachliche Prüfung ist überflüssig"
      ],
      correctIndex: 1,
      explanation: "Form und Inhalt sind zwei Dinge. Auch ein guter Stil ersetzt keine inhaltliche Prüfung."
    },
    {
      question: "Was macht eine gute Aufgabenstellung an die KI aus?",
      options: [
        "Möglichst knapp und vage formulieren",
        "Klare Aufgabe, Kontext und Prüfkriterien angeben",
        "Keine Vorgaben machen, damit die KI frei arbeitet"
      ],
      correctIndex: 1,
      explanation: "Je klarer Aufgabe, Kontext und Prüfkriterien, desto besser lässt sich das Ergebnis kontrollieren."
    }
  ],
  fortgeschritten: [
    {
      question: "Welche Aussage zur KI-Kompetenz trifft am ehesten zu?",
      options: [
        "KI-Kompetenz heisst vor allem, jedes Tool technisch bedienen zu können.",
        "KI-Kompetenz heisst, Nutzen und Grenzen im konkreten Arbeitskontext einschätzen zu können.",
        "KI-Kompetenz ist nur für die IT-Abteilung relevant."
      ],
      correctIndex: 1,
      explanation: "Kompetenz ist kontextbezogen: Aufgabe, Risiko und Erfahrung bestimmen den sicheren Einsatz."
    },
    {
      question: "Wann müssen Datenschutzrisiken eines neuen KI-Tools bewertet werden?",
      options: [
        "Erst nach der Einführung im Echtbetrieb",
        "Vor der Nutzung, bevor Daten verarbeitet werden",
        "Nur wenn es bereits einen Vorfall gab"
      ],
      correctIndex: 1,
      explanation: "Risiken werden vor der Nutzung bewertet, nicht erst, wenn bereits Daten verarbeitet wurden."
    },
    {
      question: "Ein Anbieter bewirbt sein KI-Tool als 'DSGVO-konform'. Was gilt im Jobcenter?",
      options: [
        "Eine eigene Datenschutzprüfung ist damit überflüssig.",
        "Eine eigene Bewertung von Rechtsgrundlage, Datenfluss und Risiko bleibt nötig.",
        "Das Tool darf sofort mit echten Sozialdaten genutzt werden."
      ],
      correctIndex: 1,
      explanation: "Werbeaussagen ersetzen keine eigene Bewertung von Rechtsgrundlage, Datenfluss und Risiko."
    }
  ]
};

export const practiceCase: PracticeCase = {
  title: "Praxisfall: KI-Entwurf für eine Nachforderung",
  situation:
    "Eine KI formuliert einen Entwurf für eine Nachforderung. Der Text klingt flüssig, nennt aber viele Details aus dem Fall und bleibt beim konkreten Nachweis unklar.",
  options: [
    {
      id: "send",
      label: "Direkt senden, weil der Text professionell klingt.",
      feedback: "Nicht sicher. Flüssige Sprache ersetzt keine fachliche und datenschutzbezogene Prüfung.",
      recommended: false
    },
    {
      id: "review",
      label: "Fachregel, Datenumfang, Frist und Ton prüfen und den Text kürzen.",
      feedback: "Sicherer Weg. Der Vorschlag wird als Entwurf behandelt und fachlich nachgearbeitet.",
      recommended: true
    },
    {
      id: "ignore",
      label: "KI grundsätzlich nicht nutzen.",
      feedback: "Verständlich, aber die Lern-App soll helfen, Nutzen und Grenzen kontrolliert kennenzulernen.",
      recommended: false
    }
  ],
  takeaway: "KI-Texte sind Arbeitsentwürfe. Erst Prüfung, dann Nutzung."
};

// Level-dependent practice case for the "Praxisfall — Lernübung".
// einsteiger reuses the base case above; the other levels raise the stakes.
export const practiceCaseByLevel: Record<AiLevelKey, PracticeCase> = {
  einsteiger: practiceCase,
  grundkenntnisse: {
    title: "Praxisfall: KI-Antwort an eine ratsuchende Person",
    situation:
      "Eine KI hat eine freundliche Antwort auf eine Bürgeranfrage entworfen. Der Text nennt eine konkrete Bearbeitungsdauer und übernimmt viele persönliche Angaben aus der Anfrage.",
    options: [
      {
        id: "send",
        label: "Antwort unverändert senden, weil sie höflich klingt.",
        feedback: "Nicht sicher. Feste Bearbeitungszusagen und unnötige persönliche Angaben sind ein Risiko.",
        recommended: false
      },
      {
        id: "review",
        label: "Bearbeitungszusage und Datenumfang prüfen und überflüssige Details entfernen.",
        feedback: "Sicherer Weg. Keine festen Zusagen, nur notwendige Angaben und ein fachlich geprüfter Ton.",
        recommended: true
      },
      {
        id: "ignore",
        label: "KI gar nicht für Bürgerkontakt nutzen.",
        feedback: "Verständlich, aber kontrollierte Nutzung hilft, Entwürfe schneller und trotzdem sicher zu erstellen.",
        recommended: false
      }
    ],
    takeaway: "Prüfe Zusagen und Datensparsamkeit, bevor ein KI-Entwurf nach aussen geht."
  },
  fortgeschritten: {
    title: "Praxisfall: Neues KI-Tool im Team einführen",
    situation:
      "Ein Team möchte ein neues KI-Tool nutzen und überlegt, echte Fallnotizen einzugeben, um Zeit zu sparen. Eine klare Regelung dazu gibt es noch nicht.",
    options: [
      {
        id: "start",
        label: "Sofort mit echten Fallnotizen testen, um den Nutzen zu zeigen.",
        feedback: "Nicht sicher. Ohne Datenschutzprüfung und Regeln dürfen keine echten Sozialdaten eingegeben werden.",
        recommended: false
      },
      {
        id: "govern",
        label: "Erst Zweck, erlaubte Daten, Prüfpflicht und Eskalationsweg klären und nur mit fiktiven Daten testen.",
        feedback: "Sicherer Weg. Governance, Datenschutz und fiktive Testdaten schützen Team und Bürger.",
        recommended: true
      },
      {
        id: "ban",
        label: "Das Tool grundsätzlich verbieten.",
        feedback: "Verständlich, aber mit klaren Leitplanken lässt sich der Nutzen kontrolliert erschliessen.",
        recommended: false
      }
    ],
    takeaway: "Vor der Nutzung: Governance, Datenschutz und fiktive Testdaten klären."
  }
};

export const checklistItems = [
  { id: "source-check", label: "Quelle oder Fachregel gegenprüfen" },
  { id: "privacy-check", label: "Keine unnötigen personenbezogenen Details" },
  { id: "tone-check", label: "Ton klar, respektvoll und verständlich" },
  { id: "decision-check", label: "Keine Entscheidung an KI delegieren" }
];

// ── Praxis Examples ────────────────────────────────────────────────────────────

export type PraxisTopicId = "leistung" | "integration" | "service" | "leitung" | "kommunikation";

export type PraxisExample = {
  id: string;
  title: string;
  situation: string;
  kiHelp: string;
  examplePrompt: string;
  kiLimits: string;
  humanCheck: string;
  topics: PraxisTopicId[];
};

export const praxisTopics: { id: PraxisTopicId; label: string }[] = [
  { id: "leistung", label: "Leistungsbereich" },
  { id: "integration", label: "Markt und Integration" },
  { id: "service", label: "Eingangszone und Service" },
  { id: "leitung", label: "Teamleitung" },
  { id: "kommunikation", label: "Schreiben und Kommunikation" }
];

export const praxisExamples: PraxisExample[] = [
  {
    id: "nachforderung",
    title: "Nachforderung formulieren",
    situation: "Eine Fachkraft muss einem fiktiven Musterbürger Unterlagen nachfordern. Der Brief soll klar, freundlich und fristgebunden sein.",
    kiHelp: "KI kann einen Briefentwurf erstellen: Anlass, benötigte Unterlagen, Frist und Hinweis auf mögliche Folgen.",
    examplePrompt: "Formuliere eine höfliche Nachforderung für fehlende Einkommensnachweise. Frist 14 Tage. Nur fiktive Angaben verwenden.",
    kiLimits: "KI setzt keine Fristen rechtssicher und kennt keinen echten Einzelfall.",
    humanCheck: "Rechtsgrundlage, korrekte Frist, Ton und Vollständigkeit müssen die Fachkraft prüfen.",
    topics: ["leistung", "kommunikation"]
  },
  {
    id: "mitwirkung-pruefen",
    title: "Mitwirkungsschreiben prüfen",
    situation: "Ein fiktiver Entwurf für ein Mitwirkungsschreiben liegt vor. Frist und benötigte Nachweise sollen klar und datensparsam benannt sein.",
    kiHelp: "KI kann den Entwurf auf Vollständigkeit, klare Fristnennung und verständliche Sprache durchsehen.",
    examplePrompt: "Prüfe diesen fiktiven Entwurf für ein Mitwirkungsschreiben auf Klarheit, Frist und Datensparsamkeit. Benenne konkrete Verbesserungen.",
    kiLimits: "KI bewertet keine Rechtsfolgen und setzt keine rechtsgültige Frist.",
    humanCheck: "Rechtsgrundlage, Angemessenheit der Frist und Folgen bei Nichtvorlage bleiben bei der Fachkraft.",
    topics: ["leistung"]
  },
  {
    id: "digital-erklaeren",
    title: "Digitalen Weg erklären",
    situation: "Eine ratsuchende Person möchte wissen, wie sie einen Nachweis in der Jobcenter-App hochlädt. Die Fachkraft braucht eine verständliche Kurzanleitung.",
    kiHelp: "KI kann eine Schritt-für-Schritt-Anleitung in einfacher Sprache ohne Fachjargon erstellen.",
    examplePrompt: "Erkläre in drei Schritten, wie man in der Jobcenter-App einen Nachweis hochlädt. Zielgruppe: Person ohne digitale Vorkenntnisse.",
    kiLimits: "KI kennt keine App-Updates und kann Menüpfade falsch benennen.",
    humanCheck: "Schritte auf Aktualität prüfen. Keine Zusagen über Bearbeitungszeiten machen.",
    topics: ["service", "kommunikation"]
  },
  {
    id: "anliegen-einordnen",
    title: "Anliegen am Empfang einordnen",
    situation: "In der Eingangszone treffen viele unterschiedliche Anliegen ein. Eine Fachkraft möchte ein fiktives Anliegen schnell und respektvoll sortieren.",
    kiHelp: "KI kann neutrale Rückfragen und eine grobe Sortierung nach Antrag, Änderung, Nachweis oder Termin vorschlagen.",
    examplePrompt: "Schlage drei neutrale Rückfragen vor, um ein fiktives Anliegen in der Eingangszone einzuordnen. Keine echten Daten verwenden.",
    kiLimits: "KI kennt die konkrete Situation nicht und kann dringende oder sensible Fälle nicht erkennen.",
    humanCheck: "Dringlichkeit und sensible Anliegen muss die Fachkraft selbst einschätzen.",
    topics: ["service"]
  },
  {
    id: "kooperationsplan-vorbereiten",
    title: "Beratungsgespräch vorbereiten",
    situation: "Vor einem Gespräch soll ein Entwurf für Ziele und nächste Schritte im Kooperationsplan vorbereitet werden. Keine echten Personendaten.",
    kiHelp: "KI kann typische Zielfelder und Formulierungsbausteine für einen Kooperationsplan vorschlagen.",
    examplePrompt: "Erstelle Formulierungsbausteine für einen Kooperationsplan: Ziel, Zwischenschritte, Unterstützungsbedarf. Fiktives Beispiel.",
    kiLimits: "KI kennt weder die Person noch ihre Situation. Inhalte brauchen persönliche Abstimmung im Gespräch.",
    humanCheck: "Alle Inhalte im Gespräch abstimmen. Nichts ohne Zustimmung übernehmen.",
    topics: ["integration"]
  },
  {
    id: "foerder-vorsortieren",
    title: "Förderoptionen vorsortieren",
    situation: "Für ein fiktives Beratungsbeispiel sollen mögliche Förderinstrumente als Prüfpunkte sichtbar gemacht werden, ohne eine Entscheidung vorwegzunehmen.",
    kiHelp: "KI kann bekannte Förderarten als Checkliste auflisten und passende Prüfpunkte und Rückfragen vorschlagen.",
    examplePrompt: "Liste mögliche Förderinstrumente als Prüfpunkte für ein fiktives Integrationsbeispiel auf. Keine Entscheidung, nur Orientierung.",
    kiLimits: "KI bewertet keine Förderfähigkeit und kein Ermessen.",
    humanCheck: "Eignung, Arbeitsmarktbezug und rechtliche Voraussetzungen muss die Fachkraft prüfen.",
    topics: ["integration"]
  },
  {
    id: "team-ki-regeln",
    title: "Teambesprechung zu KI-Regeln vorbereiten",
    situation: "Eine Teamleitung will eine kurze Besprechung zu sicherer KI-Nutzung vorbereiten: erlaubte Zwecke, verbotene Daten und Prüfpflichten.",
    kiHelp: "KI kann eine Agenda und eine Diskussionscheckliste für Datenschutz, Verantwortung und Lernbedarf entwerfen.",
    examplePrompt: "Entwirf eine kurze Agenda für eine Teambesprechung zu sicherer KI-Nutzung: erlaubte Zwecke, verbotene Daten, Prüfpflicht, Eskalationsweg.",
    kiLimits: "KI kennt die lokalen Vorgaben, Personalvertretung und Datenschutzlage des Hauses nicht.",
    humanCheck: "Standards müssen zu lokalen Regeln, Datenschutz und Personalvertretung passen.",
    topics: ["leitung"]
  },
  {
    id: "absage-formulieren",
    title: "Verständliche Absage formulieren",
    situation: "Eine ablehnende Mitteilung soll für einen fiktiven Fall sachlich, respektvoll und verständlich formuliert werden.",
    kiHelp: "KI kann einen klaren, bürgerfreundlichen Entwurf mit Begründungsstruktur und Hinweis auf weitere Wege vorschlagen.",
    examplePrompt: "Formuliere eine sachliche, verständliche Absage für einen fiktiven Fall. Respektvoller Ton, klare Struktur, keine echten Daten.",
    kiLimits: "KI kennt die rechtliche Begründung des Einzelfalls nicht und kann sie nicht garantieren.",
    humanCheck: "Rechtliche Begründung, Rechtsbehelfsbelehrung und Ton muss die Fachkraft prüfen.",
    topics: ["kommunikation"]
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
      kiCannotHelp: "KI setzt keine rechtsgültige Frist und kennt keinen echten Einzelfall.",
      prompt: "Formuliere einen freundlichen Brief mit Anlass, Frist und nächstem Schritt. Nur fiktive Angaben verwenden.",
      humanCheck: "Ton, Frist, Rechtsgrundlage und Vollständigkeit müssen die Fachkraft prüfen."
    };
  }
  if (/erklaer|versteh|einfach|buerger|digital|app|online|upload|anleitung/.test(lower)) {
    return {
      kiHelp: "KI kann Themen in einfacher Sprache erklären oder eine Schritt-für-Schritt-Anleitung erstellen.",
      kiCannotHelp: "KI kennt keine aktuellen App-Versionen und kann Verfahrensdetails falsch wiedergeben.",
      prompt: "Erkläre in drei einfachen Schritten, wie [Thema] funktioniert. Zielgruppe: Person ohne Vorkenntnisse.",
      humanCheck: "Inhalt auf Aktualität prüfen. Keine Zusagen über Bearbeitungszeiten oder Rechtsfolgen."
    };
  }
  if (/pruefen|kontroll|qualitaet|fehler|checken|sicherheit/.test(lower)) {
    return {
      kiHelp: "KI kann einen Text auf Vollständigkeit, Klarheit und Ton prüfen und Schwachstellen benennen.",
      kiCannotHelp: "KI kann keine fachliche oder rechtliche Richtigkeit garantieren.",
      prompt: "Prüfe den folgenden Textentwurf auf Klarheit, Ton und mögliche Lücken. Benenne konkrete Verbesserungsvorschläge. Nur fiktive Daten.",
      humanCheck: "Fachliche Korrektheit und Rechtsgrundlage muss die Fachkraft bestätigen."
    };
  }
  if (/kooperationsplan|vermittlung|beratung|ziel|foerderung|massnahme|integration|plan/.test(lower)) {
    return {
      kiHelp: "KI kann Formulierungsbausteine für Ziele, Zwischenschritte und Unterstützungsbedarf vorschlagen.",
      kiCannotHelp: "KI kennt weder Person noch Situation. Keine Inhalte ohne persönliche Abstimmung übernehmen.",
      prompt: "Erstelle Formulierungsbausteine für [Thema]: Ziel, Schritte, Unterstützungsbedarf. Fiktives Beispiel ohne Personendaten.",
      humanCheck: "Inhalte müssen im Gespräch abgestimmt werden. Nichts ohne Zustimmung übernehmen."
    };
  }
  if (/entscheid|ermessen|rechtlich|rechtsfrag|anspruch|berechtigung/.test(lower)) {
    return {
      kiHelp: "KI kann Informationen zusammenfassen und Prüfpunkte zu einem Thema nennen.",
      kiCannotHelp: "KI trifft keine Ermessensentscheidungen und gibt keine rechtsverbindlichen Auskünfte. Das ist Aufgabe der Fachkraft.",
      prompt: "Fasse die wichtigsten Prüfpunkte zu [Thema] zusammen. Keine Entscheidung — nur Orientierung. Fiktives Beispiel.",
      humanCheck: "Alle rechtlichen Fragen und Ermessensentscheidungen liegen ausschliesslich bei der Fachkraft."
    };
  }
  return {
    kiHelp: "KI kann bei diesem Anliegen helfen, einen Text zu strukturieren, Informationen zusammenzufassen oder Formulierungsvorschläge zu machen.",
    kiCannotHelp: "KI kann keine Fachentscheidungen treffen, keine Rechtsverbindlichkeit herstellen und keinen echten Einzelfall einschätzen.",
    prompt: "Beschreibe die Aufgabe klar: Was soll entstehen? Für wen? Welche Einschränkungen gelten? Nur fiktive Daten verwenden.",
    humanCheck: "Fachliche Prüfung und Verantwortung bleiben bei der Fachkraft. KI liefert nur einen Entwurf."
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
        "Anspruchsvoraussetzungen prüfen (Bedarf, Hilfebedürftigkeit, Alter, Aufenthalt)",
        "Einkommens- und Vermögensanrechnung klären",
        "Miet- und Nebenkostenübernahme bewerten",
        "Bedarfsgemeinschaft und Haushaltszusammensetzung prüfen",
        "Aktuelle Fachliche Weisungen gegen den Sachverhalt halten"
      ],
      quellenarten: [
        "BA SGB II Fachliche Weisungen",
        "§§ 7-12 SGB II (Anspruch, Bedarf, Einkommen, Vermögen)",
        "Lokale Arbeitshilfen des Jobcenters"
      ],
      stichworte: ["Bürgergeld", "Hilfebedürftigkeit", "Bedarfsgemeinschaft", "Einkommensanrechnung", "Vermögensfreibetrag"],
      hinweise: [
        "BA Fachliche Weisungen zu Einkommen/Vermögen nach SGB II prüfen",
        "Lokale Bescheidvorlagen und Rechtsbehelfsbelehrung prüfen",
        "Fachliche Letztentscheidung und Dokumentation liegen bei der Fachkraft"
      ]
    };
  }
  if (/nachweis|unterlagen|mitwirkung|frist|vorlegen|nichtvorlage/.test(lower)) {
    return {
      type: "Mitwirkung",
      pruefpfad: [
        "Mitwirkungspflicht prüfen (§§ 60 ff. SGB I)",
        "Konkrete Unterlagen benennen, die fehlen",
        "Angemessene Frist setzen und dokumentieren",
        "Auf mögliche Folgen bei Nichtvorlage hinweisen",
        "Erinnerungs- und Nachweisstufen klären"
      ],
      quellenarten: [
        "§§ 60-65 SGB I (Mitwirkungspflichten)",
        "BA SGB II Fachliche Weisungen zu Mitwirkung und Leistungsminderung",
        "Lokale Bescheid- und Nachforderungsvorlagen"
      ],
      stichworte: ["Mitwirkung", "Nachweise", "Frist", "Nichtvorlage", "Leistungsminderung"],
      hinweise: [
        "Nachforderungsschreiben-Vorlagen des Jobcenters prüfen",
        "Fristen müssen angemessen sein; fachliche Vorgaben beachten",
        "Fachliche Entscheidung über Folgen liegt bei der Fachkraft"
      ]
    };
  }
  if (/kooperationsplan|vermittlung|weiterbildung|massnahme|foerderung|integration|eingliederung/.test(lower)) {
    return {
      type: "Integration",
      pruefpfad: [
        "Potenzialanalyse und Integrationsziele klären (§ 15 SGB II)",
        "Passende Förderinstrumente prüfen (FbW, Vermittlungsbudget, Massnahmen)",
        "Kooperationsplan abstimmen und dokumentieren",
        "Förderfähigkeit und rechtliche Voraussetzungen prüfen",
        "Arbeitsmarktbezug und Eignung berücksichtigen"
      ],
      quellenarten: [
        "§§ 15-16 SGB II (Kooperationsplan, Eingliederungsleistungen)",
        "BA SGB II Fachliche Weisungen zu Förderinstrumenten",
        "Lokale Kooperationsplan-Vorlagen"
      ],
      stichworte: ["Kooperationsplan", "Förderinstrumente", "Weiterbildung", "Vermittlungsbudget", "Integrationsziel"],
      hinweise: [
        "BA Fachliche Weisungen zu Eingliederungsleistungen nach SGB II prüfen",
        "Förderfähigkeit muss fachlich bewertet werden",
        "Keine KI-gestützte Ermessensentscheidung ohne menschliche Prüfung"
      ]
    };
  }
  if (/online|app|postfach|antrag|upload|termin|digital|selbstservice/.test(lower)) {
    return {
      type: "Service und Digital",
      pruefpfad: [
        "Art des Anliegens klären (Antrag, Nachweis, Änderung, Rückfrage)",
        "Passenden digitalen Kanal prüfen (Jobcenter-App, Online-Antrag, Postfach)",
        "Zugangshindernisse klären (Technik, Sprachbarriere, Barrierefreiheit)",
        "Persönlichen Bearbeitungsweg als Alternative benennen"
      ],
      quellenarten: [
        "BA Online-Services-Dokumentation",
        "BA Jobcenter-App (aktueller Funktionsumfang)",
        "Lokale Service-Prozesse"
      ],
      stichworte: ["Jobcenter-App", "Online-Antrag", "Postfach", "Upload", "Termin"],
      hinweise: [
        "App-Funktionsumfang regelmässig prüfen — KI kann veraltete Informationen liefern",
        "Bei komplexen Anliegen persönlichen Kontakt bevorzugen",
        "Keine Bearbeitungszeiten oder Erfolgsversprechen zusagen"
      ]
    };
  }
  return {
    type: "Allgemeiner Prüfpfad",
    pruefpfad: [
      "Art des Falls klären: Leistung, Mitwirkung, Integration oder Service?",
      "Rechtliche Grundlage identifizieren (SGB II/III/I, BA-Weisungen)",
      "Relevante Unterlagen und Nachweise benennen",
      "Fachliche Prüfschritte aus den Weisungen ableiten",
      "Entscheidung dokumentieren und Verantwortung klären"
    ],
    quellenarten: [
      "BA SGB II Fachliche Weisungen (nach Thema suchen)",
      "Lokale Arbeitshilfen des Jobcenters",
      "Gesetzestexte (SGB I, II, III) über bundesrecht.juris.de"
    ],
    stichworte: ["SGB II", "BA Fachliche Weisungen", "Einzelfallprüfung", "Dokumentation"],
    hinweise: [
      "Erst Falltyp klären — dann gezielt in Fachlichen Weisungen nachschlagen",
      "Keine rechtliche Entscheidung ohne vollständige Sachverhaltsaufklärung",
      "Fachliche und rechtliche Letztentscheidung liegt beim Menschen"
    ]
  };
}
