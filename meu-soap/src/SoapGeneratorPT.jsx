import { useMemo, useState } from "react";

const CONDITIONS = [
  { key: "IVAS", label: "IVAS - Infeccao de vias aereas superiores" },
  { key: "FARINGO", label: "Faringoamigdalite bacteriana" },
  { key: "GECA", label: "GECA - Gastroenterite aguda" },
  { key: "ITU", label: "ITU baixa nao complicada" },
  { key: "DOR_LOMBAR", label: "Dor lombar mecanica" },
  { key: "ENXAQUECA", label: "Enxaqueca - quadro tipico" },
  { key: "SINUSITE", label: "Sinusite bacteriana" },
  { key: "CONJUNTIVITE", label: "Conjuntivite viral" },
  { key: "ADMIN", label: "Administrativo" },
];

const ADMIN_OPTIONS = [
  { key: "renovacao_receita", label: "Renovacao de receita controlada" },
  { key: "solicitacao_exames", label: "Solicitacao de exames eletivos" },
  { key: "encaminhamento_eletivo", label: "Encaminhamento eletivo" },
];

const CONJ_DEFAULT_ANTIBIOTIC =
  "ANTIBIOTICO: TOBRADEX COLIRIO - UMA GOTA NO(S) OLHO(S) ACOMETIDO(S) A CADA 6H POR 5 DIAS.";

const CID_OPTIONS = {
  IVAS: [
    { code: "J06.9", label: "J06.9 - Infecao vias superiores NE" },
    { code: "J00", label: "J00 - Nasofaringite aguda" },
  ],
  FARINGO: [
    { code: "J02.9", label: "J02.9 - Faringite aguda NE" },
    { code: "J03.9", label: "J03.9 - Amigdalite aguda NE" },
  ],
  GECA: [
    { code: "A09", label: "A09 - Gastroenterite infecciosa" },
    { code: "K52.9", label: "K52.9 - Gastroenterite nao infecciosa NE" },
  ],
  ITU: [
    { code: "N30.0", label: "N30.0 - Cistite aguda" },
    { code: "N39.0", label: "N39.0 - Infeccao do trato urinario NE" },
  ],
  DOR_LOMBAR: [
    { code: "M54.5", label: "M54.5 - Dor lombar baixa" },
    { code: "M54.4", label: "M54.4 - Lumbago com ciatalgia" },
  ],
  ENXAQUECA: [
    { code: "G43.0", label: "G43.0 - Enxaqueca sem aura" },
    { code: "G43.9", label: "G43.9 - Enxaqueca nao especificada" },
  ],
  SINUSITE: [
    { code: "J01.9", label: "J01.9 - Sinusite aguda NE" },
    { code: "J01.0", label: "J01.0 - Sinusite maxilar aguda" },
  ],
  CONJUNTIVITE: [
    { code: "B30.9", label: "B30.9 - Conjuntivite viral, NE" },
    { code: "H10.1", label: "H10.1 - Conjuntivite aguda atopica" },
  ],
};

const SYMPTOM_OPTIONS = {
  IVAS: [
    { key: "congestao", label: "Congestao nasal" },
    { key: "odinofagia", label: "Odinofagia" },
    { key: "tosse", label: "Tosse" },
    { key: "febre", label: "Febre" },
    { key: "mialgia", label: "Mialgia" },
    { key: "coriza", label: "Coriza" },
    { key: "otalgia", label: "Otalgia" },
    { key: "diarreia", label: "Diarreia" },
    { key: "cefaleia", label: "Cefaleia" },
  ],
  FARINGO: [
    { key: "odinofagia", label: "Odinofagia" },
    { key: "febre", label: "Febre" },
    { key: "tosse", label: "Tosse" },
    { key: "adenomegalia", label: "Adenomegalia cervical" },
  ],
  GECA: [
    { key: "dor_abdominal", label: "Dor abdominal" },
    { key: "diarreia", label: "Diarreia" },
    { key: "nauseas", label: "Nauseas" },
    { key: "vomitos", label: "Vomitos" },
  ],
  ITU: [
    { key: "disuria", label: "Disuria" },
    { key: "polaciuria", label: "Polaciúria" },
    { key: "urgencia", label: "Urgencia miccional" },
    { key: "dor_baixo_ventre", label: "Dor em baixo ventre" },
  ],
  DOR_LOMBAR: [
    { key: "dor_lombar", label: "Dor lombar" },
    { key: "irradiacao", label: "Irradiacao para MMII" },
  ],
  ENXAQUECA: [
    { key: "cefaleia", label: "Cefaleia pulsatil" },
    { key: "fonofobia", label: "Fonofobia" },
    { key: "fotofobia", label: "Fotofobia" },
    { key: "nauseas", label: "Nauseas" },
    { key: "vomitos", label: "Vomitos" },
    { key: "aura", label: "Aura visual" },
  ],
  SINUSITE: [
    { key: "dor_face", label: "Dor ou pressao facial" },
    { key: "obstrucao", label: "Congestao nasal" },
    { key: "rinorreia_purulenta", label: "Rinorreia purulenta" },
    { key: "febre", label: "Febre" },
    { key: "hiposmia", label: "Hiposmia" },
    { key: "halitose", label: "Halitose" },
  ],
  CONJUNTIVITE: [
    { key: "hiperemia", label: "Hiperemia ocular" },
    { key: "prurido", label: "Prurido ocular" },
    { key: "lacrimejamento", label: "Lacrimejamento" },
    { key: "secrecao", label: "Secrecao serosa" },
  ],
  ADMIN: [],
};

const ALERT_OPTIONS = {
  IVAS: [
    { key: "dispneia_intensa", label: "Dispneia intensa" },
    { key: "dor_toracica", label: "Dor toracica" },
    { key: "alteracao_neuro", label: "Alteracao neurologica" },
  ],
  FARINGO: [
    { key: "disfagia_progressiva", label: "Disfagia progressiva" },
    { key: "sialorreia", label: "Sialorreia" },
    { key: "trismo", label: "Trismo" },
  ],
  GECA: [
    { key: "desidratacao", label: "Sinais de desidratacao" },
    { key: "sangue_fezes", label: "Sangue nas fezes" },
    { key: "oliguria", label: "Oliguria" },
    { key: "febre", label: "Febre persistente" },
  ],
  ITU: [
    { key: "febre", label: "Febre" },
    { key: "dor_flancos", label: "Dor em flancos" },
    { key: "dor_lombar", label: "Dor lombar" },
    { key: "nauseas_vomitos", label: "Nauseas ou vomitos persistentes" },
  ],
  DOR_LOMBAR: [
    { key: "disfuncao_esfincteriana", label: "Disfuncao esfincteriana" },
    { key: "deficit_motor", label: "Deficit motor" },
    { key: "trauma_importante", label: "Trauma importante" },
    { key: "parestesia", label: "Parestesias persistentes" },
    { key: "febre_associada", label: "Febre associada" },
  ],
  ENXAQUECA: [
    { key: "cefaleia_trovoada", label: "Cefaleia trovoada" },
    { key: "neurologico", label: "Deficit neurologico" },
    { key: "febre", label: "Febre" },
  ],
  SINUSITE: [
    { key: "edema_orbita", label: "Edema periorbitario" },
    { key: "alteracao_visual", label: "Alteracao visual" },
    { key: "febre_alta", label: "Febre alta persistente" },
  ],
  CONJUNTIVITE: [
    { key: "dor_intensa", label: "Dor intensa" },
    { key: "alteracao_visual", label: "Alteracao visual" },
    { key: "fotofobia_importante", label: "Fotofobia importante" },
    { key: "dor_ocular", label: "Dor ocular" },
  ],
  ADMIN: [],
};

const buildSymptomState = (cond) => {
  const options = SYMPTOM_OPTIONS[cond] ?? [];
  const base = options.reduce((acc, item) => {
    acc[item.key] = "present";
    return acc;
  }, {});
  if (cond === "IVAS") {
    ["diarreia", "otalgia", "cefaleia"].forEach((key) => {
      if (base[key]) {
        base[key] = "absent";
      }
    });
  }
  return base;
};

const buildAlertState = (cond) => {
  const options = ALERT_OPTIONS[cond] ?? [];
  return options.reduce((acc, item) => {
    acc[item.key] = "absent";
    return acc;
  }, {});
};

const buildDefaultParams = () => {
  const cond = CONDITIONS[0].key;
  const cid = CID_OPTIONS[cond]?.[0]?.code ?? "";
  return {
    cond,
    duracaoDias: "3",
    telemed: true,
    isChild: false,
    pesoInfantil: "",
    semAlergias: true,
    alergiasTexto: "",
    semComorb: true,
    comorbTexto: "",
    atestadoDias: "1",
    cid,
    includeCid: false,
    observacoes: "",
    sintomaticosTexto: "- SINTOMATICOS DOMICILIARES CONFORME NECESSIDADE.",
    orientacoesTexto:
      "ORIENTADO A PROCURAR PRONTO SOCORRO PRESENCIAL IMEDIATAMENTE SE SINAIS DE ALERTA OU PIORA CLINICA.",
    includeAntibiotico: false,
    antibioticoTexto: "",
    includeDeclaracao: false,
    symptomStates: buildSymptomState(cond),
    alertStates: buildAlertState(cond),
    administrativoTipo: ADMIN_OPTIONS[0].key,
    conjEye: "ambos",
    enxaquecaLateralidade: "unilateral",
    adminMedicacao: "",
    adminRenova: true,
  };
};

const numberFrom = (value) => {
  const num = parseInt(value, 10);
  return Number.isFinite(num) && num > 0 ? num : 0;
};

const describeDuration = (value) => {
  const days = numberFrom(value);
  if (!days) {
    return "INICIO DOS SINTOMAS NAS ULTIMAS 24H";
  }
  if (days === 1) {
    return "QUADRO HA 1 DIA";
  }
  return `QUADRO HA ${days} DIAS`;
};

const formatTelemed = (p) =>
  p.telemed ? "ATENDIMENTO VIA TELEMEDICINA." : "ATENDIMENTO PRESENCIAL.";

const formatAllergies = (p) => {
  if (p.semAlergias) {
    return "NEGA ALERGIAS MEDICAMENTOSAS CONHECIDAS.";
  }
  if (p.alergiasTexto?.trim()) {
    return `ALERGIAS: ${p.alergiasTexto.trim().toUpperCase()}.`;
  }
  return "ALERGIAS INFORMADAS PELO PACIENTE.";
};

const formatComorbidities = (p) => {
  if (p.semComorb) {
    return "NEGA COMORBIDADES CRONICAS RELEVANTES.";
  }
  if (p.comorbTexto?.trim()) {
    return `COMORBIDADES: ${p.comorbTexto.trim().toUpperCase()}.`;
  }
  return "COMORBIDADES INFORMADAS PELO PACIENTE.";
};

const formatChildWeight = (p) => {
  if (!p.isChild) {
    return "";
  }
  const raw = `${p.pesoInfantil ?? ""}`.trim();
  if (!raw) {
    return "";
  }
  const normalized = raw.replace(",", ".");
  const parsed = parseFloat(normalized);
  if (Number.isFinite(parsed) && parsed > 0) {
    const display = Number.isInteger(parsed)
      ? parsed.toFixed(0)
      : parsed.toFixed(1);
    return `PESO REFERIDO: ${display.replace(".", ",")} KG.`;
  }
  return `PESO REFERIDO: ${raw.toUpperCase()} KG.`;
};

const formatAtestado = (p) => {
  const dias = numberFrom(p.atestadoDias);
  if (dias === 1) {
    return "ATESTADO: 1 DIA.";
  }
  if (dias > 1) {
    return `ATESTADO: ${dias} DIAS.`;
  }
  if (p.includeDeclaracao) {
    return "DECLARACAO DE COMPARECIMENTO FORNECIDA.";
  }
  return "";
};

const formatCid = (p) =>
  p.includeCid && p.cid ? `CID-10: ${p.cid.toUpperCase()}.` : "";

const formatObservacoes = (p) =>
  p.observacoes?.trim()
    ? `OBS.: ${p.observacoes.trim().replace(/\s+/g, " ")}`
    : "";

const hasAlertPositive = (p) => {
  const options = ALERT_OPTIONS[p.cond] ?? [];
  return options.some((item) => p.alertStates?.[item.key] === "present");
};

const formatList = (list) => {
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  const head = list.slice(0, -1);
  const tail = list[list.length - 1];
  return `${head.join(", ")} E ${tail}`;
};

const formatSymptoms = (p) => {
  const options = SYMPTOM_OPTIONS[p.cond] ?? [];
  const positives = [];
  const negatives = [];
  options.forEach((item) => {
    const state = p.symptomStates?.[item.key];
    if (state === "present") {
      positives.push(item.label.toUpperCase());
    } else if (state === "absent") {
      negatives.push(item.label.toUpperCase());
    }
  });
  const positivesLine = positives.length
    ? `RELATA ${formatList(positives)}.`
    : "";
  const negativesLine = negatives.length
    ? `NEGA ${formatList(negatives)}.`
    : "";
  return { positivesLine, negativesLine };
};

const formatRisk = (p) => {
  const options = ALERT_OPTIONS[p.cond] ?? [];
  const positives = [];
  const negatives = [];
  options.forEach((item) => {
    const state = p.alertStates?.[item.key];
    if (state === "present") {
      positives.push(item.label.toUpperCase());
    } else if (state === "absent") {
      negatives.push(item.label.toUpperCase());
    }
  });

  if (positives.length > 0) {
    return `APRESENTA SINAIS DE ALERTA (${formatList(positives)}). CRITERIOS DE GRAVIDADE PRESENTES.`;
  }

  if (negatives.length > 0) {
    return `NEGA SINAIS DE ALERTA (${formatList(negatives)}).`;
  }

  if (options.length > 0) {
    const allLabels = options.map((item) => item.label.toUpperCase());
    return `NEGA SINAIS DE ALERTA (${formatList(allLabels)}).`;
  }

  return "";
};

const composeSoap = (sections) => {
  const { S, O, A, P } = sections;
  return `S\n${S}\n\nO\n${O}\n\nA\n${A}\n\nP\n${P}`;
};

const baseCommon = (p) => ({
  duration: describeDuration(p.duracaoDias),
  telemed: formatTelemed(p),
  alergias: formatAllergies(p),
  comorb: formatComorbidities(p),
  atestado: formatAtestado(p),
  cid: formatCid(p),
  observacoes: formatObservacoes(p),
  risk: formatRisk(p),
  hasAlert: hasAlertPositive(p),
});

const appendAlertToAssessment = (baseText, common) =>
  common.hasAlert
    ? `${baseText} SINAIS DE ALERTA IDENTIFICADOS NA AVALIACAO.`
    : baseText;

const buildSubjective = (p, common, detailLines = []) => {
  const symptoms = formatSymptoms(p);
  const lines = [];

  if (symptoms.positivesLine) {
    lines.push(`${common.duration}, ${symptoms.positivesLine}`);
  } else {
    lines.push(`${common.duration}.`);
  }

  lines.push(...detailLines);

  if (common.risk) {
    lines.push(common.risk);
  }

  lines.push(common.alergias, common.comorb, symptoms.negativesLine);

  return lines.filter(Boolean).join(" \n");
};

const buildObjective = (p, common, extraLines = []) => {
  const baseline =
    "PACIENTE EM BOM ESTADO GERAL, FALA COM CLAREZA, HIDRATADO, AFEBRIL NO MOMENTO (REFERIDO PELO PACIENTE), SEM SINAIS DE DESCONFORTO RESPIRATORIO OU ALTERACAO NEUROLOGICA APARENTE.";
  const childWeightLine = formatChildWeight(p);
  return [common.telemed, baseline, childWeightLine, ...extraLines]
    .filter(Boolean)
    .join(" \n");
};

const normalizePlanText = (value, fallback) =>
  value?.trim() ? value.trim().replace(/\s+/g, " ") : fallback;

const buildPlan = (p, common, extraLines = []) => {
  const adjustedAtestado = common.hasAlert ? "" : common.atestado;
  if (common.hasAlert) {
    return [
      "ENCAMINHADO AO PRONTO SOCORRO PRESENCIAL PARA MELHOR AVALIACAO DEVIDO AO SINAL DE ALERTA RELATADO.",
      adjustedAtestado,
      common.cid,
      common.observacoes,
    ]
      .filter(Boolean)
      .join(" \n");
  }

  const lines = [...extraLines];
  lines.push(
    normalizePlanText(
      p.sintomaticosTexto,
      "- SINTOMATICOS DOMICILIARES CONFORME NECESSIDADE."
    )
  );

  if (p.includeAntibiotico) {
    lines.push(
      normalizePlanText(
        p.antibioticoTexto,
        "AVALIAR ANTIBIOTICOTERAPIA CONFORME CRITERIOS CLINICOS E PROTOCOLOS VIGENTES."
      )
    );
  }

  lines.push(
    normalizePlanText(
      p.orientacoesTexto,
      "ORIENTADO A PROCURAR PRONTO SOCORRO PRESENCIAL IMEDIATAMENTE SE SINAIS DE ALERTA OU PIORA CLINICA."
    )
  );

  lines.push(adjustedAtestado, common.cid, common.observacoes);

  return lines.filter(Boolean).join(" \n");
};

const TEMPLATES = {
  IVAS: (p) => {
    const common = baseCommon(p);
    const detail = common.hasAlert
      ? "RELATA SINAIS RESPIRATORIOS DE ALERTA."
      : "QUADRO COMPATIVEL COM INFECCAO VIRAL DE VIAS AEREAS SUPERIORES LEVE, SEM CRITERIOS DE GRAVIDADE REFERIDOS.";
    const S = buildSubjective(p, common, [detail]);
    const O = buildObjective(p, common);
    const baseA = common.hasAlert
      ? "INFECCAO VIRAL DE VIAS AEREAS SUPERIORES (IVAS)."
      : "INFECCAO VIRAL DE VIAS AEREAS SUPERIORES (IVAS) SEM CRITERIOS DE GRAVIDADE.";
    const A = appendAlertToAssessment(baseA, common);
    const P = buildPlan(p, common, [
      "ORIENTADA HIDRATACAO, ALIMENTACAO LEVE E LAVAGEM NASAL COM SOLUCAO SALINA.",
    ]);
    return composeSoap({ S, O, A, P });
  },
  FARINGO: (p) => {
    const common = baseCommon(p);
    const detail = common.hasAlert
      ? null
      : "REFERE ODINOFAGIA INTENSA COM PLACAS TONSILARES, SEM DISFAGIA PROGRESSIVA OU TRISMO.";
    const S = buildSubjective(p, common, [detail]);
    const O = buildObjective(p, common, [
      "SEM DISFAGIA IMPORTANTE OU TRISMO REFERIDOS DURANTE A CONSULTA.",
    ]);
    const A = appendAlertToAssessment(
      "FARINGOAMIGDALITE BACTERIANA (CRITERIOS CLINICOS).",
      common
    );
    const P = buildPlan(p, common, [
      "RECOMENDADO REPOUSO VOCAL, HIDRATACAO MORNA E HIGIENE OROFARINGEA.",
      "ATB."
    ]);
    return composeSoap({ S, O, A, P });
  },
  GECA: (p) => {
    const common = baseCommon(p);
    const detail = common.hasAlert
      ? null
      : "ACEITA HIDRATACAO ORAL E MANTEM DIURESE, SEM SINAIS DE DESIDRATACAO GRAVE NO RELATO.";
    const S = buildSubjective(p, common, [detail]);
    const O = buildObjective(p, common, [
      "SEM INDICIOS DE DESIDRATACAO SEVERA OU ALTERACOES HEMODINAMICAS REFERIDAS.",
    ]);
    const baseA = common.hasAlert
      ? "GASTROENTERITE AGUDA."
      : "QUADRO DE DIARREIA AGUDA, AUTOLIMITADA, COM CARACTERISTICAS COMPATIVEIS COM PROVAVEL GASTROENTERITE VIRAL.";
    const A = appendAlertToAssessment(baseA, common);
    const P = buildPlan(p, common, [
      "INCENTIVADA HIDRATACAO ORAL FRACIONADA E DIETA LEVE.",
    ]);
    return composeSoap({ S, O, A, P });
  },
  ITU: (p) => {
    const common = baseCommon(p);
    const detail = common.hasAlert
      ? null
      : "QUADRO COMPATIVEL COM CISTITE BAIXA, SEM FEBRE OU DOR EM FLANCOS REFERIDOS.";
    const S = buildSubjective(p, common, [detail]);
    const O = buildObjective(p, common, [
      "SEM INDICIOS DE PIELONEFRITE OU ALTERACOES SISTEMICAS REFERIDOS.",
    ]);
    const A = appendAlertToAssessment("ITU BAIXA NAO COMPLICADA.", common);
    const P = buildPlan(p, common, [
      "ORIENTADA HIDRATACAO ABUNDANTE E ESVAZIAMENTO REGULAR DA BEXIGA.",
    ]);
    return composeSoap({ S, O, A, P });
  },
  DOR_LOMBAR: (p) => {
    const common = baseCommon(p);
    const detail = common.hasAlert
      ? null
      : "RELATA DOR LOMBAR APOS ESFORCO MECANICO RECENTE.";
    const S = buildSubjective(p, common, [detail]);
    const O = buildObjective(p, common, [
      "DEAMBULA SEM AUXILIO SEGUNDO O RELATO E SEM SINAIS DE BANDEIRA VERMELHA.",
    ]);
    const baseA = common.hasAlert
      ? "LOMBALGIA MECANICA AGUDA COM CRITERIOS DE ALERTA CLINICOS."
      : "LOMBALGIA MECANICA AGUDA SEM SINAIS DE ALERTA.";
    const A = appendAlertToAssessment(baseA, common);
    const P = buildPlan(p, common, [
      "SUGERIDOS ALONGAMENTOS PROGRESSIVOS, MEDIDAS POSTURAIS E COMPRESSAS MORNAS.",
    ]);
    return composeSoap({ S, O, A, P });
  },
  ENXAQUECA: (p) => {
    const common = baseCommon(p);
    const detail = common.hasAlert
      ? null
      : "RELATA CEFALEIA PULSATIL HABITUAL, SEM NOVOS FATORES DE ALERTA.";
    const lateralityMap = {
      unilateral: "CEFALEIA PREDOMINANTEMENTE UNILATERAL HABITUAL.",
      bilateral: "CEFALEIA QUE ENVOLVE AMBOS OS HEMICRANIOS HABITUALMENTE.",
    };
    const lateralityLine = common.hasAlert
      ? null
      : lateralityMap[p.enxaquecaLateralidade] ?? null;
    const S = buildSubjective(p, common, [detail, lateralityLine]);
    const O = buildObjective(p, common, [
      "EXAME NEUROLOGICO REMOTO SEM ALTERACOES AGUDAS REFERIDAS.",
    ]);
    const A = appendAlertToAssessment(
      "ENXAQUECA EPISODICA EM QUADRO TIPICO.",
      common
    );
    const P = buildPlan(p, common, [
      "SUGERIDO DIARIO DE CEFALEIA, IDENTIFICACAO DE GATILHOS E HIGIENE DO SONO.",
    ]);
    return composeSoap({ S, O, A, P });
  },
  SINUSITE: (p) => {
    const common = baseCommon(p);
    const detail = common.hasAlert
      ? null
      : null;
    const S = buildSubjective(p, common, [detail]);
    const O = buildObjective(p, common, [
      "SEM EDEMA FACIAL IMPORTANTE OU SINAIS DE COMPLICACAO REFERIDOS.",
    ]);
    const A = appendAlertToAssessment("SINUSITE BACTERIANA AGUDA.", common);
    const P = buildPlan(p, common, [
      "ORIENTADA HIGIENE NASAL COM SOLUCAO SALINA E COMPRESSAS MORNAS SOBRE SEIOS PARANASAIS.",
    ]);
    return composeSoap({ S, O, A, P });
  },
  CONJUNTIVITE: (p) => {
    const common = baseCommon(p);
    const detail = common.hasAlert
      ? null
      : "QUADRO AGUDO COM PRURIDO E SECRECAO SEROSA, SEM COMPROMETIMENTO VISUAL IMPORTANTE.";
    const eyeMap = {
      esquerdo: "OLHO ESQUERDO ACOMETIDO SEGUNDO O PACIENTE.",
      direito: "OLHO DIREITO ACOMETIDO SEGUNDO O PACIENTE.",
      ambos: "AMBOS OS OLHOS ACOMETIDOS SEGUNDO O PACIENTE.",
    };
    const eyeLine = eyeMap[p.conjEye] ?? "OLHOS ACOMETIDOS REFERIDOS PELO PACIENTE.";
    const S = buildSubjective(p, common, [detail, eyeLine]);
    const O = buildObjective(p, common, [
      "SEM DOR OCULAR INTENSA OU ALTERACOES VISUAIS SIGNIFICATIVAS REFERIDAS.",
    ]);
    const A = appendAlertToAssessment("CONJUNTIVITE VIRAL AGUDA.", common);
    const P = buildPlan(p, common, [
      "ORIENTADA HIGIENE OCULAR, USO DE LENCOS DESCARTAVEIS E EVITAR COMPARTILHAR TOALHAS.",
    ]);
    return composeSoap({ S, O, A, P });
  },
  ADMIN: (p) => {
    const option =
      ADMIN_OPTIONS.find((item) => item.key === p.administrativoTipo) ?? null;
    const label = option
      ? option.label.toUpperCase()
      : "DEMANDA ADMINISTRATIVA";
    const common = baseCommon(p);
    const adminLines = [`ADMINISTRATIVO: ${label}.`];
    if (option?.key === "renovacao_receita") {
      const med =
        p.adminMedicacao?.trim().toUpperCase() || "MEDICACAO NAO INFORMADA";
      const status = p.adminRenova ? "RENOVACAO SOLICITADA" : "RENOVACAO NAO REALIZADA";
      adminLines.push(`MEDICACAO: ${med}.`);
      adminLines.push(`${status}.`);
    }
    const S = adminLines.join(" \n");
    const O = [
      common.telemed,
      "DEMANDA ADMINISTRATIVA, SEM QUEIXAS CLINICAS DISCUTIDAS.",
    ].filter(Boolean)
      .join(" \n");
    const A = "DEMANDA ADMINISTRATIVA CONFORME SOLICITACAO.";
    const planLines = ["ORIENTO FLUXO ELETIVO."];
    if (option?.key === "renovacao_receita" && p.adminRenova) {
      planLines.unshift(
        "RENOVO RECEITA PARA 1X MES ATE PROXIMA CONSULTA ELETIVA."
      );
    }
    const P = [
      ...planLines,
      common.atestado,
      common.cid,
      common.observacoes,
    ]
      .filter(Boolean)
      .join(" \n");
    return composeSoap({ S, O, A, P });
  },
};

const templateParams = (overrides = {}) => {
  const base = buildDefaultParams();
  const merged = { ...base, ...overrides };
  const defaultSymptoms = buildSymptomState(merged.cond);
  const defaultAlerts = buildAlertState(merged.cond);
  merged.symptomStates = {
    ...defaultSymptoms,
    ...(merged.symptomStates ?? {}),
  };
  merged.alertStates = {
    ...defaultAlerts,
    ...(merged.alertStates ?? {}),
  };
  if (!merged.administrativoTipo) {
    merged.administrativoTipo = ADMIN_OPTIONS[0].key;
  }
  if (!merged.conjEye) {
    merged.conjEye = "ambos";
  }
  if (!merged.enxaquecaLateralidade) {
    merged.enxaquecaLateralidade = "unilateral";
  }
  if (merged.isChild === undefined) {
    merged.isChild = false;
  }
  if (merged.pesoInfantil === undefined) {
    merged.pesoInfantil = "";
  }
  if (merged.cond === "CONJUNTIVITE") {
    if (merged.includeAntibiotico === undefined) {
      merged.includeAntibiotico = true;
    }
    if (!merged.antibioticoTexto) {
      merged.antibioticoTexto = CONJ_DEFAULT_ANTIBIOTIC;
    }
  }
  if (merged.cond === "ADMIN" && merged.adminRenova === undefined) {
    merged.adminRenova = true;
  }
  if (!merged.cid) {
    const suggestion = CID_OPTIONS[merged.cond]?.[0]?.code ?? "";
    merged.cid = suggestion;
  }
  return merged;
};

const runTests = () => {
  const results = [];

  const hasInvalidLabel = CONDITIONS.some((cond) => cond.label.includes(">"));
  results.push({
    name: "Labels das condicoes nao contem '>'",
    passed: !hasInvalidLabel,
    details: hasInvalidLabel ? "Remover '>' das labels." : "",
  });

  const ivasWithDetails = TEMPLATES.IVAS(
    templateParams({
      semAlergias: false,
      alergiasTexto: "penicilina",
      semComorb: false,
      comorbTexto: "dm2",
      symptomStates: {
        ...buildSymptomState("IVAS"),
        congestao: "present",
        odinofagia: "present",
      },
    })
  );
  results.push({
    name: "IVAS inclui sintomas relatados e alergias/comorb",
    passed:
      ivasWithDetails.includes("CONGESTAO NASAL") &&
      ivasWithDetails.includes("ODINOFAGIA") &&
      ivasWithDetails.includes("ALERGIAS: PENICILINA.") &&
      ivasWithDetails.includes("COMORBIDADES: DM2."),
    details: "",
  });

  const riskTrigger = TEMPLATES.IVAS(
    templateParams({
      alertStates: {
        ...buildAlertState("IVAS"),
        dispneia_intensa: "present",
      },
    })
  );
  results.push({
    name: "Sinais de alerta geram criterios de gravidade",
    passed:
      riskTrigger.includes("CRITERIOS DE GRAVIDADE PRESENTES") &&
      !riskTrigger.includes("NEGA SINAIS DE ALERTA") &&
      riskTrigger.includes(
        "ENCAMINHADO AO PRONTO SOCORRO PRESENCIAL PARA MELHOR AVALIACAO"
      ) &&
      !riskTrigger.includes("SINTOMATICOS DOMICILIARES"),
    details: "",
  });

  const declaracao = TEMPLATES.FARINGO(
    templateParams({
      cond: "FARINGO",
      atestadoDias: "0",
      includeDeclaracao: true,
    })
  );
  results.push({
    name: "Declaracao emitida quando sem atestado",
    passed: declaracao.includes("DECLARACAO DE COMPARECIMENTO FORNECIDA."),
    details: "",
  });

  const adminDemanda = TEMPLATES.ADMIN(
    templateParams({
      cond: "ADMIN",
      administrativoTipo: "renovacao_receita",
      adminMedicacao: "ZOLPIDEM 10MG",
      adminRenova: true,
    })
  );
  results.push({
    name: "Demanda administrativa gera texto e conduta adequados",
    passed:
      adminDemanda.includes(
      "ADMINISTRATIVO: RENOVACAO DE RECEITA CONTROLADA."
      ) &&
      adminDemanda.includes("MEDICACAO: ZOLPIDEM 10MG.") &&
      adminDemanda.includes(
        "RENOVO RECEITA PARA 1X MES ATE PROXIMA CONSULTA ELETIVA."
      ),
    details: "",
  });

  const conjuntivitePlan = TEMPLATES.CONJUNTIVITE(
    templateParams({
      cond: "CONJUNTIVITE",
      includeAntibiotico: true,
      antibioticoTexto: CONJ_DEFAULT_ANTIBIOTIC,
    })
  );
  results.push({
    name: "Conjuntivite inclui tobradex na conduta",
    passed: conjuntivitePlan.includes("TOBRADEX COLIRIO"),
    details: "",
  });

  return results;
};

export default function SoapGeneratorPT() {
  const [params, setParams] = useState(() => buildDefaultParams());
  const [output, setOutput] = useState("");
  const [tests, setTests] = useState([]);
  const [copyState, setCopyState] = useState("copiar");

  const cidOptions = useMemo(
    () => CID_OPTIONS[params.cond] ?? [],
    [params.cond]
  );
  const symptomOptions = useMemo(
    () => SYMPTOM_OPTIONS[params.cond] ?? [],
    [params.cond]
  );
  const alertOptions = useMemo(
    () => ALERT_OPTIONS[params.cond] ?? [],
    [params.cond]
  );

  const handleChange = (key, value) => {
    setParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCheckbox = (key) => {
    setParams((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCondChange = (value) => {
    const newCid = CID_OPTIONS[value]?.[0]?.code ?? "";
    setParams((prev) => {
      const wasConj = prev.cond === "CONJUNTIVITE";
      const isConj = value === "CONJUNTIVITE";
      const isEnxaqueca = value === "ENXAQUECA";
      const nextAtestadoDias =
        value === "ADMIN"
          ? "0"
          : prev.cond === "ADMIN" && prev.atestadoDias === "0"
          ? "1"
          : prev.atestadoDias;
      const shouldResetAntibiotic =
        wasConj && prev.antibioticoTexto === CONJ_DEFAULT_ANTIBIOTIC;
      const nextAntibioticoTexto = isConj
        ? prev.antibioticoTexto || CONJ_DEFAULT_ANTIBIOTIC
        : shouldResetAntibiotic
        ? ""
        : prev.antibioticoTexto;
      const nextIncludeAntibiotico = isConj
        ? true
        : shouldResetAntibiotic
        ? false
        : prev.includeAntibiotico;

      return {
        ...prev,
        cond: value,
        cid: newCid,
        symptomStates: buildSymptomState(value),
        alertStates: buildAlertState(value),
        administrativoTipo:
          value === "ADMIN"
            ? prev.administrativoTipo || ADMIN_OPTIONS[0].key
            : prev.administrativoTipo,
        antibioticoTexto: nextAntibioticoTexto,
        includeAntibiotico: nextIncludeAntibiotico,
        conjEye: isConj ? prev.conjEye || "ambos" : prev.conjEye || "ambos",
        enxaquecaLateralidade: isEnxaqueca
          ? prev.enxaquecaLateralidade || "unilateral"
          : prev.enxaquecaLateralidade,
        atestadoDias: nextAtestadoDias,
      };
    });
  };

  const normalizeParamsState = () => ({
    ...params,
    administrativoTipo:
      params.administrativoTipo || ADMIN_OPTIONS[0].key,
    conjEye: params.conjEye || "ambos",
    enxaquecaLateralidade: params.enxaquecaLateralidade || "unilateral",
    isChild: !!params.isChild,
    pesoInfantil: params.pesoInfantil ?? "",
    adminMedicacao: params.adminMedicacao ?? "",
    adminRenova: params.adminRenova ?? true,
    symptomStates: {
      ...buildSymptomState(params.cond),
      ...(params.symptomStates ?? {}),
    },
    alertStates: {
      ...buildAlertState(params.cond),
      ...(params.alertStates ?? {}),
    },
  });

  const handleSymptomToggle = (symptomKey, targetState) => {
    setParams((prev) => {
      const current = prev.symptomStates?.[symptomKey];
      const nextState = current === targetState ? "unset" : targetState;
      return {
        ...prev,
        symptomStates: {
          ...buildSymptomState(prev.cond),
          ...(prev.symptomStates ?? {}),
          [symptomKey]: nextState,
        },
      };
    });
  };

  const handleAlertToggle = (alertKey, targetState) => {
    setParams((prev) => {
      const current = prev.alertStates?.[alertKey];
      const nextState = current === targetState ? "unset" : targetState;
      return {
        ...prev,
        alertStates: {
          ...buildAlertState(prev.cond),
          ...(prev.alertStates ?? {}),
          [alertKey]: nextState,
        },
      };
    });
  };

  const handleGenerate = () => {
    const normalized = normalizeParamsState();
    const template = TEMPLATES[normalized.cond];
    if (!template) {
      setOutput("Condicao nao suportada.");
      return;
    }
    const text = template(normalized);
    setOutput(text);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopyState("copiado!");
      setTimeout(() => setCopyState("copiar"), 2000);
    } catch (err) {
      setCopyState("erro");
      setTimeout(() => setCopyState("copiar"), 2000);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `soap-${params.cond.toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const executeTests = () => {
    const result = runTests();
    setTests(result);
  };

  return (
    <div className="app-shell">
      <header className="page-header">
        <div className="page-title">
          <h1>Gerador de Prontuario SOAP (PT-BR)</h1>
          <p>
            Ajuste os parametros clinicos, selecione sintomas e sinais de risco de acordo
            com a condicao escolhida e gere o texto final do prontuario.
          </p>
          <p style={{ marginTop: "8px", fontWeight: 600 }}>
            Elaborado por Raul Lima Capelo
          </p>
        </div>
      </header>

      <div className="two-column">
        <section className="panel">
          <div className="panel-body">
            <div className="form-grid">
              <div className="field">
                <label>Condicao</label>
                <select
                  value={params.cond}
                  onChange={(event) => handleCondChange(event.target.value)}
                >
                  {CONDITIONS.map((cond) => (
                    <option key={cond.key} value={cond.key}>
                      {cond.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Duracao (dias)</label>
                <input
                  type="number"
                  min="0"
                  value={params.duracaoDias}
                  onChange={(event) => handleChange("duracaoDias", event.target.value)}
                />
              </div>

              <div className="field">
                <label>Atendimento</label>
                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id="telemed"
                    checked={params.telemed}
                    onChange={() => handleCheckbox("telemed")}
                  />
                  <label htmlFor="telemed">Via telemedicina</label>
                </div>
              </div>

              <div className="field">
                <label>Paciente pediatrico</label>
                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id="isChild"
                    checked={!!params.isChild}
                    onChange={() => handleCheckbox("isChild")}
                  />
                  <label htmlFor="isChild">Marcar se crianca</label>
                </div>
                {params.isChild && (
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Peso em kg"
                    value={params.pesoInfantil}
                    onChange={(event) => handleChange("pesoInfantil", event.target.value)}
                  />
                )}
              </div>

              {params.cond === "CONJUNTIVITE" && (
                <div className="field">
                  <label>Olho acometido</label>
                  <select
                    value={params.conjEye}
                    onChange={(event) => handleChange("conjEye", event.target.value)}
                  >
                    <option value="esquerdo">Esquerdo</option>
                    <option value="direito">Direito</option>
                    <option value="ambos">Ambos</option>
                  </select>
                </div>
              )}

              {params.cond === "ENXAQUECA" && (
                <div className="field">
                  <label>Lateralidade da cefaleia</label>
                  <select
                    value={params.enxaquecaLateralidade}
                    onChange={(event) =>
                      handleChange("enxaquecaLateralidade", event.target.value)
                    }
                  >
                    <option value="unilateral">Unilateral</option>
                    <option value="bilateral">Bilateral</option>
                  </select>
                </div>
              )}

              {params.cond === "ADMIN" && (
                <div className="field">
                  <label>Demanda administrativa</label>
                  <select
                    value={params.administrativoTipo}
                    onChange={(event) =>
                      handleChange("administrativoTipo", event.target.value)
                    }
                  >
                    {ADMIN_OPTIONS.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {params.cond === "ADMIN" && params.administrativoTipo === "renovacao_receita" && (
                <>
                  <div className="field">
                    <label>Medicacao</label>
                    <input
                      type="text"
                      placeholder="Ex.: Clonazepam 2mg"
                      value={params.adminMedicacao}
                      onChange={(event) => handleChange("adminMedicacao", event.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Renovar receita</label>
                    <div className="checkbox-row">
                      <input
                        type="checkbox"
                        id="adminRenova"
                        checked={!!params.adminRenova}
                        onChange={() => handleCheckbox("adminRenova")}
                      />
                      <label htmlFor="adminRenova">Renovar por 1 mes</label>
                    </div>
                  </div>
                </>
              )}

              <div className="field">
                <label>Alergias</label>
                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id="semAlergias"
                    checked={params.semAlergias}
                    onChange={() => handleCheckbox("semAlergias")}
                  />
                  <label htmlFor="semAlergias">Sem alergias relatadas</label>
                </div>
                {!params.semAlergias && (
                  <textarea
                    placeholder="Detalhar alergias"
                    value={params.alergiasTexto}
                    onChange={(event) =>
                      handleChange("alergiasTexto", event.target.value)
                    }
                  />
                )}
              </div>

              <div className="field">
                <label>Comorbidades</label>
                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id="semComorb"
                    checked={params.semComorb}
                    onChange={() => handleCheckbox("semComorb")}
                  />
                  <label htmlFor="semComorb">Sem comorbidades relevantes</label>
                </div>
                {!params.semComorb && (
                  <textarea
                    placeholder="Detalhar comorbidades"
                    value={params.comorbTexto}
                    onChange={(event) =>
                      handleChange("comorbTexto", event.target.value)
                    }
                  />
                )}
              </div>

              <div className="field">
                <label>Atestado (dias)</label>
                <input
                  type="number"
                  min="0"
                  value={params.atestadoDias}
                  onChange={(event) =>
                    handleChange("atestadoDias", event.target.value)
                  }
                />
                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id="includeDeclaracao"
                    checked={params.includeDeclaracao}
                    onChange={() => handleCheckbox("includeDeclaracao")}
                  />
                  <label htmlFor="includeDeclaracao">
                    Emitir declaracao de comparecimento se sem atestado
                  </label>
                </div>
              </div>

              <div className="field">
                <label>CID-10 sugerido</label>
                <select
                  value={params.cid}
                  onChange={(event) => handleChange("cid", event.target.value)}
                >
                  <option value="">Selecione</option>
                  {cidOptions.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.code} - {item.label}
                    </option>
                  ))}
                </select>
                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id="includeCid"
                    checked={params.includeCid}
                    onChange={() => handleCheckbox("includeCid")}
                  />
                  <label htmlFor="includeCid">Incluir CID-10 no texto</label>
                </div>
              </div>

              <div className="field field-wide">
                <label>Observacoes</label>
                <textarea
                  placeholder="Registrar orientacoes adicionais, exames solicitados, contatos..."
                  value={params.observacoes}
                  onChange={(event) =>
                    handleChange("observacoes", event.target.value)
                  }
                />
              </div>

              {symptomOptions.length > 0 && (
                <div className="field field-wide">
                  <label>Sintomas</label>
                  <div className="symptom-list">
                    {symptomOptions.map((item) => {
                      const state = params.symptomStates?.[item.key] ?? "unset";
                      return (
                        <div className="symptom-row" key={item.key}>
                          <span className="symptom-label">{item.label}</span>
                          <div className="symptom-actions">
                            <button
                              type="button"
                              className={`symptom-chip ${state === "present" ? "active present" : ""}`}
                              onClick={() => handleSymptomToggle(item.key, "present")}
                            >
                              Relata
                            </button>
                            <button
                              type="button"
                              className={`symptom-chip ${state === "absent" ? "active absent" : ""}`}
                              onClick={() => handleSymptomToggle(item.key, "absent")}
                            >
                              Nega
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {alertOptions.length > 0 && (
                <div className="field field-wide">
                  <label>Sinais de alerta / criterios de gravidade</label>
                  <div className="symptom-list">
                    {alertOptions.map((item) => {
                      const state = params.alertStates?.[item.key] ?? "unset";
                      return (
                        <div className="symptom-row" key={item.key}>
                          <span className="symptom-label">{item.label}</span>
                          <div className="symptom-actions">
                            <button
                              type="button"
                              className={`symptom-chip ${state === "present" ? "active absent" : ""}`}
                              onClick={() => handleAlertToggle(item.key, "present")}
                            >
                              Presente
                            </button>
                            <button
                              type="button"
                              className={`symptom-chip ${state === "absent" ? "active present" : ""}`}
                              onClick={() => handleAlertToggle(item.key, "absent")}
                            >
                              Ausente
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="field field-wide">
                <label>Conduta - Sintomaticos</label>
                <textarea
                  placeholder="Ex.: Analgesico simples, antitermico sob demanda."
                  value={params.sintomaticosTexto}
                  onChange={(event) =>
                    handleChange("sintomaticosTexto", event.target.value)
                  }
                />
              </div>

              <div className="field field-wide">
                <label>Conduta - Antibiotico</label>
                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id="includeAntibiotico"
                    checked={params.includeAntibiotico}
                    onChange={() => handleCheckbox("includeAntibiotico")}
                  />
                  <label htmlFor="includeAntibiotico">Adicionar conduta antibiotica</label>
                </div>
                {params.includeAntibiotico && (
                  <textarea
                    placeholder="Ex.: Iniciar amoxicilina 500mg 8/8h por 7 dias."
                    value={params.antibioticoTexto}
                    onChange={(event) =>
                      handleChange("antibioticoTexto", event.target.value)
                    }
                  />
                )}
              </div>

              <div className="field field-wide">
                <label>Conduta - Orientacoes de risco</label>
                <textarea
                  placeholder="Ex.: Retornar se febre persistir, dispneia ou piora clinica."
                  value={params.orientacoesTexto}
                  onChange={(event) =>
                    handleChange("orientacoesTexto", event.target.value)
                  }
                  disabled={hasAlertPositive(params)}
                />
                {hasAlertPositive(params) && (
                  <small>
                    <em>
                      Com sinal de alerta presente, o texto incluirá encaminhamento ao pronto
                      socorro automaticamente.
                    </em>
                  </small>
                )}
              </div>
            </div>

            <div className="actions">
              <button className="btn" type="button" onClick={handleGenerate}>
                Gerar SOAP
              </button>
              <button
                className="btn secondary"
                type="button"
                onClick={handleCopy}
                disabled={!output}
              >
                {copyState}
              </button>
              <button
                className="btn ghost"
                type="button"
                onClick={handleDownload}
                disabled={!output}
              >
                Baixar .txt
              </button>
              <button className="btn ghost" type="button" onClick={executeTests}>
                Executar testes
              </button>
            </div>

            {tests.length > 0 && (
              <ul className="test-results">
                {tests.map((test) => (
                  <li
                    key={test.name}
                    className={test.passed ? "test-pass" : "test-fail"}
                  >
                    {test.passed ? "OK" : "FALHOU"} - {test.name}
                    {test.details ? ` (${test.details})` : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-body">
            <div className="field field-heading">
              <label>Pre-visualizacao</label>
            </div>
            <div className={`output-card ${output ? "has-output" : ""}`}>
              <div className="output-header">
                <h2>Prontuario gerado</h2>
                {output ? <span className="status-chip">Disponivel</span> : null}
              </div>
              <div className="output-body">
                {output ? (
                  <pre>{output}</pre>
                ) : (
                  <p>O texto gerado aparecera aqui.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Export utilidades para facilitar testes via console se necessario.
export { CONDITIONS, CID_OPTIONS, TEMPLATES, runTests };
