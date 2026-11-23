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
