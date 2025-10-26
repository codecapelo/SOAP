# Gerador de Prontuário SOAP – Clínico (PT‑BR)

Aplicativo em **React (JSX puro)** para gerar textos de **prontuário no formato SOAP** (S, O, A, P) de forma rápida, com foco em telemedicina e casos clínicos comuns.

> **Padrões atuais do app**
> - O texto **não** começa com o nome da condição (inicia direto em `S`).
> - O **CID‑10** **não** aparece por padrão; há um toggle "**Incluir CID‑10 no texto**".
> - Alergias e comorbidades possuem **campos detalháveis** quando as opções "Sem…" são desmarcadas.

---

## 📦 Estrutura do projeto
- **Componente único:** `SoapGeneratorPT` (JSX) — tudo em 1 arquivo (estado, UI e templates).
- **Listas:**
  - `CONDITIONS`: opções do seletor de condições.
  - `CID_OPTIONS`: CIDs sugeridos por condição na UI.
- **Estado:**
  - `defaultParams`: valores padrão (inclui `includeCid` = `false`).
  - Parâmetros: `cond`, `duracaoDias`, `telemed`, `semRisco`, `semAlergias`/`alergiasTexto`, `semComorb`/`comorbTexto`, `atestadoDias`, `cid`, `includeCid`, `observacoes`.
- **Templates:** `TEMPLATES.<CHAVE_DA_CONDIÇÃO>` — geram as seções `S`, `O`, `A`, `P` como *strings*.
- **Testes internos:** `runTests()` — valida comportamento de geração sem depender do DOM.

Estrutura do **retorno** dos templates:
```text
S
...

O
...

A
...

P
...
```

---

## 🚀 Como executar (Vite + React)

### 1) Criar projeto
```bash
npm create vite@latest meu-soap -- --template react
cd meu-soap
npm install
```

### 2) Adicionar o componente
Crie `src/SoapGeneratorPT.jsx` e **cole o código do componente**.

### 3) Renderizar o componente
```jsx
// src/App.jsx
import SoapGeneratorPT from "./SoapGeneratorPT";
export default function App() {
  return <SoapGeneratorPT />;
}
```

### 4) Rodar
```bash
npm run dev
```
Abra a URL exibida (geralmente `http://localhost:5173`).

> **Tailwind opcional**: as classes já estão no JSX; sem Tailwind o app funciona (com visual simples).

---

## 🎨 (Opcional) Habilitar Tailwind
1. Instale dependências e gere config:
```bash
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
2. Configure `tailwind.config.js`:
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
```
3. Em `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
4. Importe `index.css` no seu entry (ex.: `main.jsx`).

---

## 🧩 Como usar (na interface)
1. Escolha a **Condição** (IVAS, FARINGO, **GECA**, ITU, ASMA, CEF_TENS, DOR_LOMBAR, HAS_LEVE, COVID_SUS).
2. Ajuste os **Parâmetros**: duração, telemedicina, sinais de risco, alergias/comorbidades (e seus textos), atestado, CID, observações.
3. Clique **Gerar SOAP** → o texto aparece ao lado.
4. Use **Copiar** ou **Baixar .txt**.

---

## 🛠️ Como editar/expandir

### Adicionar uma nova condição
1) **Adicionar ao seletor** em `CONDITIONS`:
```js
{ key: "OTITE", label: "Otite média aguda" }
```
2) **Sugerir CIDs** (opcional) em `CID_OPTIONS.OTITE`:
```js
CID_OPTIONS.OTITE = [
  { code: "H66.9", label: "H66.9 – Otite média NE" },
];
```
3) **Criar template**:
```js
TEMPLATES.OTITE = (p) => {
  const S = [
    // Linhas de S…
  ].join(" \n");
  const O = [
    p.telemed ? "ATENDIMENTO VIA TELEMEDICINA." : "ATENDIMENTO PRESENCIAL.",
    // Outras linhas de O…
  ].join(" \n");
  const A = "HIPÓTESE DIAGNÓSTICA/IMPRESSÃO CLÍNICA";
  const P = [
    // Plano…
    p.atestadoDias ? `ATESTADO: ${p.atestadoDias} DIA(S).` : "",
    p.includeCid ? `CID‑10: ${p.cid}.` : "",
    p.observacoes ? `OBS.: ${p.observacoes}` : "",
  ].filter(Boolean).join(" \n");
  return `S\n${S}\n\nO\n${O}\n\nA\n${A}\n\nP\n${P}`;
};
```

### Regras de Alergias/Comorbidades
- Se "Sem alergias" estiver **marcado** → imprime **NEGA ALERGIAS …**.
- Se **desmarcado** → imprime **ALERGIAS: …** (ou **INFORMADAS PELO PACIENTE.** se o texto ficar vazio).
- Mesma lógica para **comorbidades**.

### CID‑10
- Controlado por `includeCid` (toggle na UI). Nos templates, use:
```js
p.includeCid ? `CID‑10: ${p.cid}.` : ""
```

### Telemedicina
- `p.telemed` alterna automaticamente entre:
  - `ATENDIMENTO VIA TELEMEDICINA.`
  - `ATENDIMENTO PRESENCIAL.`

---

## 🧪 Testes internos (`runTests()`)
Clique **Executar testes** para validar:
- Integridade de `CONDITIONS` (sem `>` nas labels).
- IVAS: inclui alergias/comorbidades detalhadas quando presentes; negativas padrão quando ausentes.
- Telemedicina impressa em `O` quando marcada.
- **CID‑10**: não aparece por padrão; aparece quando `includeCid=true`.
- **GECA**: começa por `S\n` (sem título), tem bullet de sintomáticos, fallbacks de alergia/comorb e menciona **diurese presente**.

> Você pode criar novos *asserts* adicionando casos e checando trechos com `includes()`.

---

## 🧯 Troubleshooting
- **Erro JSX: “The character `>` is not valid inside a JSX element”**
  - Verifique `<option>…</option>` dentro dos `map()` — não deixe caracteres após `</option>`.
- **SyntaxError: Unterminated string constant**
  - Não quebre `" \n"` em várias linhas. Use `].join(" \n")` na **mesma linha**.
- **Aspas tipográficas**
  - Corrija `“ ”` para `"` caso o editor tenha convertido automaticamente.
- **Tailwind**
  - Totalmente opcional; sem ele o app ainda funciona.

---

## 📦 Build & Deploy
```bash
npm run build
```
Saída em `dist/`. Publique em Vercel/Netlify/GitHub Pages ou outro host estático.

---

## 🔭 Roadmap sugerido
- Presets de um clique por condição (ex.: "IVAS 2d sem risco + atestado 1d").
- Exportar PDF.
- Footer com assinatura/CRM do médico.
- Compartilhar via *mailto* / WhatsApp.
- Persistir preferências no `localStorage`.
- Internacionalização (i18n).

---

## ⚖️ Aviso
Ferramenta de **documentação**; **não** substitui avaliação clínica. Valide **condutas, posologias** e **CIDs** conforme protocolos e recursos da sua instituição.

