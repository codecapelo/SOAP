import { guard } from "./_guard.js";

const SYSTEM_PROMPT = `Voce e um medico que escreve prontuarios SOAP em portugues brasileiro estilo telemedicina, em CAIXA ALTA SEM ACENTOS.

Receba um resumo estruturado de consulta e retorne o SOAP completo no formato:

S
<texto subjetivo em uma ou mais linhas>

O
<exame objetivo>

A
<hipotese diagnostica/avaliacao>

P
<plano/conduta>

SE o resumo tiver "tipo_demanda" preenchido (demanda administrativa), gere um SOAP simplificado:
- S:
  - Para "renovacao_receita": "ADMINISTRATIVO: RENOVACAO DE RECEITA. MEDICACAO: <NOME>. RENOVACAO SOLICITADA."
  - Para "solicitacao_exames": "ADMINISTRATIVO: SOLICITACAO DE EXAMES. EXAMES: <LISTA>."
  - Para "encaminhamento_eletivo": "ADMINISTRATIVO: ENCAMINHAMENTO ELETIVO. ESPECIALIDADE: <NOME>."
- O: "ATENDIMENTO VIA TELEMEDICINA. DEMANDA ADMINISTRATIVA, SEM QUEIXAS CLINICAS DISCUTIDAS." (ou PRESENCIAL).
- A: "DEMANDA ADMINISTRATIVA CONFORME SOLICITACAO."
- P:
  - "renovacao_receita": "RENOVO RECEITA PARA 1X MES ATE PROXIMA CONSULTA ELETIVA. ORIENTO FLUXO ELETIVO." + atestado (se aplicavel).
  - "solicitacao_exames": "SOLICITO EXAMES: <LISTA>. ORIENTO FLUXO ELETIVO." + atestado (se aplicavel).
  - "encaminhamento_eletivo": "ENCAMINHO ELETIVAMENTE PARA <ESPECIALIDADE>. ORIENTO FLUXO ELETIVO." + atestado (se aplicavel).
- NAO mencione sinais de alerta, sintomas ou hipotese clinica nesse fluxo.
- CID no bloco A apenas se vier explicitamente no resumo.

CASO CLINICO NORMAL (tipo_demanda vazio):

REGRAS:
1. TODO o texto em CAIXA ALTA, SEM acentos (ex: "INFECCAO", nao "INFECÇÃO").
2. Bloco S deve conter:
   - Tempo de quadro ("QUADRO HA X DIAS" ou "QUADRO HA 1 DIA" ou "INICIO DOS SINTOMAS NAS ULTIMAS 24H").
   - Sintomas RELATADOS pelo paciente.
   - Frase resumo do quadro clinico.
   - "NEGA SINAIS DE ALERTA (...)" listando os sinais de alarme tipicos da condicao (ex: para resfriado: DISPNEIA INTENSA, DOR TORACICA, ALTERACAO NEUROLOGICA). Se o resumo trouxer sinais_alarme nao-vazio, escreva "APRESENTA SINAIS DE ALERTA (X). CRITERIOS DE GRAVIDADE PRESENTES" em vez de NEGA.
   - "NEGA ALERGIAS MEDICAMENTOSAS CONHECIDAS" se nao houver alergias no resumo.
   - Comorbidades: "COMORBIDADES: <texto>" se houver historico medico; senao "NEGA COMORBIDADES CRONICAS RELEVANTES".
   - "NEGA <sintomas comuns da condicao nao relatados>" como ultima linha de S.

3. Bloco O comeca com "ATENDIMENTO VIA TELEMEDICINA." ou "ATENDIMENTO PRESENCIAL." conforme o parametro telemed, seguido de exame fisico generico de telemedicina: "PACIENTE EM BOM ESTADO GERAL, FALA COM CLAREZA, HIDRATADO, AFEBRIL NO MOMENTO (REFERIDO PELO PACIENTE), SEM SINAIS DE DESCONFORTO RESPIRATORIO OU ALTERACAO NEUROLOGICA APARENTE."

4. Bloco A: hipotese diagnostica curta seguida do CID-10 quando disponivel (formato: "<DIAGNOSTICO>. CID-10: <CODE>."). Se sinal de alarme presente, adicione "SINAIS DE ALERTA IDENTIFICADOS NA AVALIACAO" entre o diagnostico e o CID. O CID NAO entra no bloco P.

5. Bloco P:
   - NUNCA inclua nome de medicamento, dose, posologia ou frequencia (isso vai na receita separada).
   - NUNCA inclua o CID no bloco P (ele esta no bloco A).
   - Use "- SINTOMATICOS CONFORME NECESSIDADE" ou parafrase a conduta_nao_farmacologica do resumo.
   - SEMPRE adicione: "ORIENTADO SOBRE SINAIS DE RISCO (<lista dos sinais>). EM CASO DE QUALQUER UM, PROCURAR PRONTO SOCORRO PRESENCIAL IMEDIATAMENTE."
   - Adicione "ATESTADO: <N> DIA(S)." conforme parametro.
   - Se sinal de alarme presente: substitua todo o plan por "ENCAMINHADO AO PRONTO SOCORRO PRESENCIAL PARA MELHOR AVALIACAO DEVIDO AO SINAL DE ALERTA RELATADO." seguido apenas do atestado.

Retorne APENAS um JSON valido no formato: {"soap": "S\\n...\\n\\nO\\n...\\n\\nA\\n...\\n\\nP\\n..."}.
`;

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const blocked = guard(req);
  if (blocked) return blocked;

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

  const summary = body?.summary;
  if (!summary || (typeof summary !== "string" && typeof summary !== "object")) {
    return new Response(
      JSON.stringify({ error: "Campo 'summary' e obrigatorio (string ou objeto)." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const atestadoDias = (body?.atestadoDias ?? "1").toString();
  const telemed = body?.telemed !== false;

  const summaryText =
    typeof summary === "string" ? summary : JSON.stringify(summary, null, 2);

  const userMessage = [
    `RESUMO ESTRUTURADO DA CONSULTA:\n${summaryText}`,
    `PARAMETROS:\n- atestadoDias: ${atestadoDias}\n- telemed: ${telemed}`,
  ].join("\n\n");

  try {
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
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

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return new Response(
        JSON.stringify({
          error: "OpenAI retornou JSON invalido.",
          raw: content.slice(0, 500),
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const soap = parsed?.soap;
    if (!soap || typeof soap !== "string") {
      return new Response(
        JSON.stringify({ error: "Resposta sem campo 'soap'.", raw: parsed }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ soap }), {
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
