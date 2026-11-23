/**
 * Perguntas frequentes da página inicial, divididas em abas para mostrar poucas de cada vez.
 * Fonte única: o Next lê este arquivo e a versão estática é gerada dele por
 * scripts/gerar-faq.mjs (rode `node scripts/gerar-faq.mjs` dentro de artus-react/ depois de mudar).
 *
 * Regras (AGENTS.md e CFM 2.336/2023): sem promessa de resultado, sem superlativo e sem dado que a
 * clínica não confirmou. Convênios, valores e horários ficam com a recepção.
 */
export type PerguntaFaq = { pergunta: string; resposta: string };
export type TemaFaq = { id: string; rotulo: string; perguntas: PerguntaFaq[] };

export const FAQ_SOBRE = "Dúvidas sobre a clínica e as especialidades";
export const FAQ_TITULO = "Perguntas frequentes";

export const temasFaq: TemaFaq[] = [
  {
    id: "agendamento",
    rotulo: "Agendamento",
    perguntas: [
      {
        pergunta: "Como marco uma consulta?",
        resposta: "Pela recepção, por telefone ou WhatsApp no (65) 3322-6689. A equipe ajuda a escolher o especialista e informa os horários disponíveis.",
      },
      {
        pergunta: "Não sei qual especialista procurar. O que faço?",
        resposta: "Fale com a recepção para saber quais áreas a equipe atende e como marcar uma consulta. Informações sobre sintomas e exames podem ser conversadas com o médico na avaliação.",
      },
      {
        pergunta: "A clínica atende convênios?",
        resposta: "Os convênios aceitos e os valores das consultas são informados pela recepção, por telefone ou WhatsApp.",
      },
    ],
  },
  {
    id: "consulta",
    rotulo: "Primeira consulta",
    perguntas: [
      {
        pergunta: "O que devo levar na primeira consulta?",
        resposta: "Um documento com foto e, se tiver, exames e laudos anteriores sobre o problema, como radiografias e ressonâncias. A lista dos remédios que você usa também ajuda.",
      },
      {
        pergunta: "Preciso fazer exames antes da consulta?",
        resposta: "Se você já tiver exames relacionados ao motivo da consulta, leve os resultados. Durante a avaliação, o ortopedista orienta se é preciso fazer novos exames.",
      },
      {
        pergunta: "Toda dor ortopédica termina em cirurgia?",
        resposta: "A indicação de cirurgia depende da causa da dor, dos sintomas e da avaliação médica. Conforme o caso, o tratamento pode incluir acompanhamento, medicação, fisioterapia ou imobilização.",
      },
    ],
  },
  {
    id: "especialidades",
    rotulo: "Especialidades",
    perguntas: [
      {
        pergunta: "Quais áreas a clínica atende?",
        resposta: "A equipe atende mão e punho, joelho, quadril e trauma ortopédico, coluna, ombro e cotovelo, e pé e tornozelo.",
      },
      {
        pergunta: "Quando devo procurar um ortopedista?",
        resposta: "Procure avaliação se a dor persistir, atrapalhar seus movimentos ou vier com inchaço, formigamento ou perda de força. Se houver suspeita de fratura recente, procure um pronto-socorro.",
      },
      {
        pergunta: "A clínica atende fraturas e outros traumas?",
        resposta: "O Dr. Renam Urt Mansur Bumlai atua em quadril e trauma ortopédico. Para saber que atendimentos podem ser agendados, fale com a recepção. Em caso de suspeita de fratura recente, procure um pronto-socorro.",
      },
    ],
  },
  {
    id: "clinica",
    rotulo: "A clínica",
    perguntas: [
      {
        pergunta: "Onde fica a clínica?",
        resposta: "Na Av. Egito, 95, Santa Rosa, em Cuiabá, MT. O endereço e o link para o Google Maps estão em “Agendamento e endereço”, logo abaixo.",
      },
      {
        pergunta: "Onde encontro o CRM e o RQE dos médicos?",
        resposta: "Os números de CRM e RQE estão nos cartões da seção Equipe médica.",
      },
      {
        pergunta: "O que é o RQE que aparece no perfil dos médicos?",
        resposta: "É o Registro de Qualificação de Especialista, concedido pelo Conselho Regional de Medicina. Ele mostra que o médico tem o título de especialista registrado no conselho.",
      },
    ],
  },
];
