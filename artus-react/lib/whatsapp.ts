/** WhatsApp da recepção: o mesmo número do telefone, (65) 3322-6689. */
export const WHATSAPP_NUMERO = "556533226689";

/** Mensagem que já chega escrita quando a pessoa abre a conversa pelo site. */
export const MENSAGEM_PADRAO = "Olá! Gostaria de agendar uma consulta na Clínica Artus.";

/** Para os convites de dúvida (FAQ, ajuda dos documentos, topo das páginas internas). */
export const MENSAGEM_DUVIDA = "Olá! Gostaria de tirar uma dúvida com a recepção da Clínica Artus.";

export function linkWhatsApp(mensagem: string = MENSAGEM_PADRAO) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

/** Mensagem para agendar com um médico específico; a área fica de fora (vai na URL para o WhatsApp). */
export function mensagemPara(nome: string) {
  return `Olá! Gostaria de agendar uma consulta com o ${nome}.`;
}

/**
 * Atalho flutuante do WhatsApp: uma opção por área. Ao escolher, a mini-janela vira uma conversa:
 * o atendimento pergunta onde é a dor, a pessoa toca numa resposta rápida ou escreve, e o envio abre
 * o WhatsApp da recepção com a área e o que ela escreveu, sem o nome do médico. Ombro e cotovelo junta
 * os dois especialistas numa conversa só (Luiz Augusto e depois Valmir).
 * A versão estática (index.html, bloco gerado por scripts/gerar-whatsapp.mjs) usa estes mesmos dados.
 */
export const ATALHOS_WHATSAPP = [
  {
    area: "mao", fotos: ["cassio"], nomes: "Dr. Cássio Cocate", especialidade: "Mão e punho",
    pergunta: "A dor é no punho ou na mão?",
    opcoes: [{ rotulo: "Punho", texto: "Dor no punho" }, { rotulo: "Mão", texto: "Dor na mão" }, { rotulo: "Nos dois", texto: "Dor na mão e no punho" }],
    exemplo: "Ex.: dor no punho ao digitar",
  },
  {
    area: "joelho", fotos: ["lucio"], nomes: "Dr. Lúcio Nuno", especialidade: "Joelho",
    pergunta: "A dor é no joelho direito, no esquerdo ou nos dois?",
    opcoes: [{ rotulo: "Direito", texto: "Dor no joelho direito" }, { rotulo: "Esquerdo", texto: "Dor no joelho esquerdo" }, { rotulo: "Nos dois", texto: "Dor nos dois joelhos" }],
    exemplo: "Ex.: dor no joelho ao subir escadas",
  },
  {
    area: "quadril", fotos: ["renam"], nomes: "Dr. Renam Bumlai", especialidade: "Quadril e trauma ortopédico",
    pergunta: "É uma dor no quadril ou uma lesão depois de queda ou pancada?",
    opcoes: [{ rotulo: "Quadril", texto: "Dor no quadril" }, { rotulo: "Queda ou pancada", texto: "Lesão depois de uma queda ou pancada" }],
    exemplo: "Ex.: dor no quadril ao caminhar",
  },
  {
    area: "coluna", fotos: ["andre"], nomes: "Dr. André Nunes Machado", especialidade: "Coluna",
    pergunta: "Em que parte da coluna é a dor?",
    opcoes: [{ rotulo: "Pescoço", texto: "Dor no pescoço" }, { rotulo: "Meio das costas", texto: "Dor no meio das costas" }, { rotulo: "Lombar", texto: "Dor na lombar" }],
    exemplo: "Ex.: dor na lombar que desce pela perna",
  },
  {
    area: "ombro", fotos: ["luiz", "valmir"], nomes: "Dr. Luiz Augusto e Dr. Valmir Pagliaro", especialidade: "Ombro e cotovelo",
    pergunta: "A dor é no ombro ou no cotovelo?",
    opcoes: [{ rotulo: "Ombro", texto: "Dor no ombro" }, { rotulo: "Cotovelo", texto: "Dor no cotovelo" }, { rotulo: "Os dois", texto: "Dor no ombro e no cotovelo" }],
    exemplo: "Ex.: dor no ombro ao levantar o braço",
  },
  {
    area: "pe", fotos: ["ricardo"], nomes: "Dr. Ricardo Issaka", especialidade: "Pé e tornozelo",
    pergunta: "A dor é no pé ou no tornozelo?",
    opcoes: [{ rotulo: "Pé", texto: "Dor no pé" }, { rotulo: "Tornozelo", texto: "Dor no tornozelo" }, { rotulo: "Os dois", texto: "Dor no pé e no tornozelo" }],
    exemplo: "Ex.: dor no calcanhar ao acordar",
  },
] as const;

/** Segundo balão da conversa, igual para todas as áreas. */
export const DICA_CONVERSA = "Toque numa opção ou escreva com suas palavras. Você revisa a mensagem no WhatsApp antes de enviar.";

/** Início da mensagem do atalho; o relato da pessoa vem logo depois (ver mensagemAtalho). */
export function inicioMensagemAtalho(especialidade: string) {
  return `Olá! Gostaria de agendar uma consulta de ${especialidade.toLowerCase()}.`;
}

/** Relato com inicial maiúscula e ponto final. O home.js (versão estática) repete esta regra. */
export function fraseRelato(relato: string) {
  const t = relato.trim().replace(/\s+/g, " ");
  if (!t) return "";
  const frase = t.charAt(0).toUpperCase() + t.slice(1);
  return /[.!?]$/.test(frase) ? frase : `${frase}.`;
}

export function mensagemAtalho(especialidade: string, relato: string) {
  return `${inicioMensagemAtalho(especialidade)} ${fraseRelato(relato)}`.trim();
}

/**
 * Resposta rápida no campo sem apagar o que a pessoa já escreveu: troca só a resposta rápida do
 * começo (se houver) e mantém o resto. O home.js (versão estática) repete esta regra.
 */
export function juntarSugestao(atual: string, texto: string, textos: readonly string[]) {
  let resto = atual.trim();
  const inicio = [...textos].sort((a, b) => b.length - a.length).find((t) => resto.toLowerCase().startsWith(t.toLowerCase()));
  if (inicio) resto = resto.slice(inicio.length).trim();
  return resto ? `${texto} ${resto}` : `${texto} `;
}

/** Número do selo do atalho: um por especialista. */
export const TOTAL_ESPECIALISTAS = 7;
