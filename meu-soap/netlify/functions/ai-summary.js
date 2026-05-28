const SYSTEM_PROMPT = `Voce e um assistente clinico que organiza informacoes de telemedicina em JSON estruturado para um prontuario SOAP em portugues brasileiro.

Receba o motivo da consulta (texto livre do paciente) e o historico medico (opcional). Retorne EXCLUSIVAMENTE um JSON valido com este schema:

{
  "historico_medico": string,
  "resumo_queixa": string,
  "sintomas": string[],
  "inicio_duracao": string,
  "sinais_alarme": string[],
  "cid_sugerido": { "code": string, "label": string },
  "conduta_farmacologica": string,
  "conduta_nao_farmacologica": string,
  "tipo_demanda": "" | "renovacao_receita" | "solicitacao_exames" | "encaminhamento_eletivo",
  "medicacao": string,
  "exames_solicitados": string[],
  "encaminhamento_especialidade": string
}

Regras:
- Use portugues brasileiro sem acentos no campo "sintomas" (ex: "tosse", "febre", "dor de cabeca", "odinofagia", "cefaleia").
- NAO invente sintomas, sinais de alarme ou diagnostico que o paciente nao mencionou.
- "sinais_alarme" deve listar apenas sinais de alerta que o paciente mencionou claramente. Vazio [] se nenhum.
- "cid_sugerido" deve ser o CID-10 mais provavel para o quadro descrito (ex: J00, J06.9, A09, M54.5, G43.9, N30.0). Se for demanda administrativa pura sem queixa clinica, deixe vazio.
- "inicio_duracao" exemplos: "2 dias", "1 semana", "hoje", "12 horas".

DEMANDA ADMINISTRATIVA:
- Se o motivo for puramente administrativo (sem queixa clinica), preencha "tipo_demanda" com um dos 3 valores: "renovacao_receita", "solicitacao_exames", "encaminhamento_eletivo".
- Para "renovacao_receita": preencha "medicacao" com o nome + dose se mencionada (ex: "losartana 50mg").
- Para "solicitacao_exames": preencha "exames_solicitados" com a lista (ex: ["hemograma", "TSH"]).
- Para "encaminhamento_eletivo": preencha "encaminhamento_especialidade" com a especialidade (ex: "cardiologia").
- Quando "tipo_demanda" estiver preenchido, deixe sintomas, sinais_alarme, condutas e CID vazios - nao invente quadro clinico.

- Se um campo nao tem informacao, retorne string vazia ou array vazio (nao omita o campo).
- Resposta DEVE ser JSON puro, sem markdown fence.`;

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY nao configurada no Netlify." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Body invalido." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const motivo = (body?.motivo || "").toString().trim();
  const historico = (body?.historico || "").toString().trim();
  const idade = (body?.idade || "").toString().trim();
  const sexo = (body?.sexo || "").toString().trim();

  if (!motivo) {
    return new Response(
      JSON.stringify({ error: "Campo 'motivo' e obrigatorio." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const userParts = [`MOTIVO DA CONSULTA:\n${motivo}`];
  if (historico) userParts.push(`HISTORICO MEDICO:\n${historico}`);
  if (idade) userParts.push(`IDADE: ${idade}`);
  if (sexo) userParts.push(`SEXO: ${sexo}`);

  try {
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userParts.join("\n\n") },
        ],
      }),
    });

    if (!openaiResp.ok) {
      const errText = await openaiResp.text();
      return new Response(
        JSON.stringify({
          error: "Falha na chamada OpenAI.",
          status: openaiResp.status,
          detail: errText.slice(0, 500),
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await openaiResp.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      return new Response(
        JSON.stringify({ error: "Resposta vazia da OpenAI." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    let summary;
    try {
      summary = JSON.parse(content);
    } catch {
      return new Response(
        JSON.stringify({
          error: "OpenAI retornou JSON invalido.",
          raw: content.slice(0, 500),
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ summary }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Erro inesperado.", detail: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
