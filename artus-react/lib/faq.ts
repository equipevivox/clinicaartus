/**
 * Perguntas frequentes da página inicial, divididas em abas para mostrar poucas de cada vez.
 * Fonte única: o Next lê este arquivo e a versão estática é gerada dele por
 * scripts/gerar-faq.mjs (rode `node scripts/gerar-faq.mjs` dentro de artus-react/ depois de mudar).
 *
 * Regras (AGENTS.md e CFM 2.336/2023): sem promessa de resultado, sem superlativo e sem dado que a
 * clínica não confirmou. Dados da clínica: documento de FAQ enviado pela clínica em 2026-11-23.
 * Horários, valores e a lista de convênios ficam com a recepção.
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
        resposta: "Pelo telefone ou WhatsApp (65) 3322-6689. A recepção informa os horários disponíveis e ajuda você a escolher a área mais adequada à sua queixa.",
      },
      {
        pergunta: "A clínica atende convênios ou só particular?",
        resposta: "A Artus atende por convênio e particular, com o mesmo tempo reservado para a consulta. Para saber se o seu plano é aceito, informe à recepção a operadora, o tipo de plano e o especialista que você quer consultar.",
      },
      {
        pergunta: "A clínica atende crianças?",
        resposta: "Não. A Artus não atua em ortopedia pediátrica. O atendimento é voltado a adultos e idosos, da medicina esportiva aos problemas degenerativos.",
      },
      {
        pergunta: "Tenho dor em mais de uma articulação. Preciso marcar várias consultas?",
        resposta: "Comece pela queixa que mais incomoda. Como os especialistas atendem no mesmo espaço, o médico pode encaminhar você diretamente a um colega da Artus para avaliar a outra articulação.",
      },
    ],
  },
  {
    id: "consulta",
    rotulo: "Primeira consulta",
    perguntas: [
      {
        pergunta: "O que devo levar na primeira consulta?",
        resposta: "Um documento com foto, a carteirinha do convênio, se for o caso, e a lista dos remédios que você usa. Se tiver exames sobre a queixa, leve os laudos e as imagens, em papel ou em formato digital.",
      },
      {
        pergunta: "O que vale a pena anotar antes da consulta?",
        resposta: "Anote quando o problema começou, o que costuma piorar a dor e quais tarefas ficaram mais difíceis. Informe também se já teve lesões ou cirurgias na região.",
      },
      {
        pergunta: "Preciso fazer raio-X ou ressonância antes da primeira consulta?",
        resposta: "Você pode marcar a primeira consulta sem fazer exames por conta própria. O especialista avalia se precisa pedir algum exame.",
      },
      {
        pergunta: "O que levo se quiser uma segunda opinião?",
        resposta: "Se tiver, leve os laudos, as imagens e o que recebeu sobre o tratamento proposto. Conte ao especialista o que você já tentou e quais dúvidas ainda tem sobre a decisão.",
      },
    ],
  },
  {
    id: "especialidades",
    rotulo: "Especialidades e tratamentos",
    perguntas: [
      {
        pergunta: "Quais especialistas atendem em cada área?",
        resposta: "Joelho: Dr. Lúcio Nuno e Dr. Renam Bumlai. Quadril e trauma ortopédico: Dr. Renam Bumlai. Ombro e cotovelo: Dr. Luiz Tavares e Dr. Valmir Pagliaro. Pé e tornozelo: Dr. Ricardo Issaka. Mão e punho: Dr. Cássio Cocate. Coluna: Dr. André Nunes Machado.",
      },
      {
        pergunta: "Quais tratamentos sem cirurgia a clínica oferece?",
        resposta: "Além das consultas, a Artus faz procedimentos ambulatoriais como infiltração guiada por ultrassom, terapia por ondas de choque e laserterapia. O especialista indica se algum deles faz sentido para o seu caso.",
      },
      {
        pergunta: "Toda dor ortopédica termina em cirurgia?",
        resposta: "Não. A indicação depende da causa da dor, dos sintomas e da avaliação médica. Conforme o caso, o tratamento pode incluir acompanhamento, medicação, fisioterapia, imobilização ou procedimentos ambulatoriais.",
      },
      {
        pergunta: "Se eu precisar de cirurgia, onde ela é feita?",
        resposta: "Todos os médicos sócios da Artus são cirurgiões ortopedistas. As cirurgias, como videoartroscopias e reconstruções articulares, são feitas em hospitais de Cuiabá. Antes de agendar, confirme com a recepção o hospital previsto e, se for usar convênio, verifique a cobertura com a operadora.",
      },
    ],
  },
  {
    id: "sintomas",
    rotulo: "Sintomas e urgências",
    perguntas: [
      {
        pergunta: "Meu joelho dói ao subir escadas. Quando vale marcar uma consulta?",
        resposta: "Se a dor volta com frequência ou faz você evitar escadas e outras tarefas, procure avaliação. Vale contar se também há inchaço ou se o joelho trava ou falha.",
      },
      {
        pergunta: "Minha mão formiga à noite. O que devo contar na consulta?",
        resposta: "Se o formigamento se repete ou atrapalha o sono, procure avaliação. Conte quais dedos formigam e se você percebe dificuldade para segurar objetos.",
      },
      {
        pergunta: "A dor lombar desce pela perna. Quando devo procurar ajuda?",
        resposta: "Procure avaliação se a dor persiste ou atrapalha sua rotina. Vá ao pronto-socorro se aparecer dificuldade nova para urinar, perda do controle da urina ou das fezes, dormência entre as pernas ou perda de força que está piorando.",
      },
      {
        pergunta: "Meu ombro dói quando levanto o braço. Vale marcar uma consulta?",
        resposta: "Procure avaliação se a dor persiste ou dificulta tarefas como se vestir ou alcançar uma prateleira. Conte se ela começou após uma pancada ou depois de repetir algum movimento.",
      },
      {
        pergunta: "Meu calcanhar dói nos primeiros passos do dia. Isso é relevante?",
        resposta: "Sim. Se a dor se repete, procure avaliação e conte quando ela aparece, se muda ao longo do dia e quanto limita sua caminhada.",
      },
      {
        pergunta: "Caí ou torci o tornozelo. Quando devo ir ao pronto-socorro?",
        resposta: "Procure um pronto-socorro se, depois de uma queda ou torção, houver deformidade, ferida profunda, dor intensa ou se você não conseguir apoiar o pé. Suspeita de fratura ou de articulação fora do lugar precisa de avaliação urgente.",
      },
      {
        pergunta: "Minha articulação ficou quente, inchada e dolorida. Posso esperar a consulta?",
        resposta: "Se o calor, o inchaço e a dor começaram de repente, procure um pronto-socorro. Isso é especialmente importante se houver febre ou calafrios.",
      },
    ],
  },
  {
    id: "clinica",
    rotulo: "A clínica",
    perguntas: [
      {
        pergunta: "Como a Clínica Artus funciona?",
        resposta: "A Artus é uma clínica de Ortopedia e Traumatologia em Cuiabá que reúne especialistas de várias articulações no mesmo lugar. Se a sua queixa for de outra área, o médico pode encaminhar você a um colega da própria clínica.",
      },
      {
        pergunta: "Como é a estrutura da clínica?",
        resposta: "A Artus tem sede própria de 900 m² na Av. Egito, 95, Santa Rosa, em Cuiabá (MT). São recepção ampla, salas para consultas e procedimentos ambulatoriais e estacionamento privativo.",
      },
      {
        pergunta: "A clínica tem acessibilidade?",
        resposta: "Sim, a estrutura é acessível. Se você usa cadeira de rodas ou tem dificuldade para caminhar, avise a recepção ao agendar para que a equipe possa ajudar na chegada.",
      },
      {
        pergunta: "Como os especialistas conduzem o tratamento?",
        resposta: "Os especialistas da Artus baseiam as condutas em evidências científicas e explicam ao paciente as opções de tratamento para cada caso, com e sem cirurgia.",
      },
    ],
  },
];
