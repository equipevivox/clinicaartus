// Texto aprovado em conteudo-site-medicos.md. O nome de cada médico vem de lib/doctors.ts (um nome só no site).
export const careProfiles = [
  {
    id: "cassio",
    area: "mao",
    specialty: "Mão e punho",
    width: 1200,
    height: 945,
    quote: "“Em muitos casos, só o exame clínico já dá uma boa ideia do diagnóstico.”",
    signs: [
      "Dedo que trava e precisa da outra mão para endireitar.",
      "Formigamento ou perda de força nas mãos.",
      "Dor no punho que continua dias depois de uma queda."
    ],
    treatment: "A avaliação define se basta acompanhar, imobilizar ou tratar. A cirurgia fica para os casos que limitam o movimento.",
    question: "Toda bolinha no punho precisa ser operada?",
    answer: "Não. A causa mais comum é o cisto sinovial, geralmente benigno. Quando não incomoda, muitas vezes só se acompanha."
  },
  {
    id: "lucio",
    area: "joelho",
    specialty: "Joelho",
    width: 1100,
    height: 1100,
    quote: "“Existe uma forma de tratar a articulação sem precisar de cirurgia.”",
    signs: [
      "Subir escadas virou um esforço.",
      "Dor ao caminhar algumas quadras ou ao praticar atividade física.",
      "Joelho inchado, com líquido na articulação."
    ],
    treatment: "Viscossuplementação (ácido hialurônico na articulação, com anestesia local), infiltração, ondas de choque e laser, conforme o caso.",
    question: "Toda infiltração é igual?",
    answer: "Não. A avaliação define qual estrutura tratar e qual substância usar."
  },
  {
    id: "renam",
    area: "quadril",
    specialty: "Quadril",
    width: 1000,
    height: 1310,
    quote: "“No começo, são pequenas adaptações. Quando elas se repetem, é sinal de que precisa de ajuda.”",
    signs: [
      "Você muda de posição ou evita movimentos para não sentir dor.",
      "Rigidez e perda de movimento no quadril.",
      "Alguém já disse que você está mancando."
    ],
    treatment: "Primeiro medicamento, fisioterapia e mudanças de hábito. Quando isso já não controla a dor, a prótese total de quadril passa a ser uma possibilidade.",
    question: "Na prótese, a articulação inteira é retirada?",
    answer: "Não. Só as partes desgastadas da cabeça do fêmur e do acetábulo são substituídas. A recuperação começa logo depois, com fisioterapia."
  },
  {
    id: "andre",
    area: "coluna",
    specialty: "Coluna",
    width: 1100,
    height: 1100,
    quote: "“O tratamento sempre parte de uma análise criteriosa da doença.”",
    signs: [
      "Dor nas costas ao ficar sentado ou de pé.",
      "Choque ou cãibra que desce para o braço ou a perna.",
      "Pernas pesadas ou formigando depois de alguns minutos de caminhada."
    ],
    treatment: "Exercícios, fisioterapia, medicação, bloqueios e infiltrações. Quando a cirurgia é indicada, por técnica minimamente invasiva.",
    question: "Estenose do canal lombar sempre precisa de cirurgia?",
    answer: "Não. Depende do grau de compressão. Muitos casos se tratam com medicamento, fisioterapia e infiltração."
  },
  {
    id: "valmir",
    area: "ombro",
    specialty: "Ombro e cotovelo",
    width: 945,
    height: 744,
    quote: "“Talvez o problema não seja a pomada. Talvez seja chamar toda dor no ombro de bursite.”",
    signs: [
      "Dor no ombro que melhora com pomada ou anti-inflamatório e volta.",
      "Dor no cotovelo ao abrir uma porta, carregar peso ou treinar.",
      "Dor e limitação no ombro ou no cotovelo que atrapalham a rotina."
    ],
    treatment: "Quando possível, tratamento conservador: infiltração guiada por ultrassom, ondas de choque, laser de alta potência e, em casos selecionados, medicina regenerativa. Quando a cirurgia é necessária, por artroscopia, com pequenos acessos.",
    question: "Dor no ombro é tudo igual?",
    answer: "Não. Lesões diferentes dão sintomas parecidos: impacto, lesão do manguito rotador, bursite, ombro congelado. A primeira pergunta é qual é a causa da dor."
  },
  {
    id: "luiz",
    area: "ombro",
    specialty: "Ombro e cotovelo",
    width: 782,
    height: 661,
    quote: "“Se você sente essas dores no ombro, deveria ficar atento.”",
    signs: [
      "Dor ao levantar o braço ou dificuldade para dormir sobre o ombro.",
      "Fraqueza ao girar o braço, travamentos ou estalos.",
      "Dor na lateral do cotovelo e menos força para segurar objetos."
    ],
    treatment: "Depende da intensidade dos sintomas: controle da dor e da inflamação, fisioterapia, órteses e, em casos selecionados, infiltração. A cirurgia fica para quando o tratamento conservador não resolve.",
    question: "Epicondilite sempre precisa de cirurgia?",
    answer: "Não. O tratamento começa pelo conservador. A cirurgia é considerada só quando ele não resolve."
  },
  {
    id: "ricardo",
    area: "pe",
    specialty: "Pé e tornozelo",
    width: 1200,
    height: 1200,
    quote: "“É um erro comum ignorar isso. Pode piorar e tirar você das atividades de que mais gosta.”",
    signs: [
      "Dor ao apoiar o pé.",
      "Rigidez pela manhã, nos primeiros passos.",
      "O tornozelo já não se movimenta como antes."
    ],
    treatment: "A escolha depende do grau do problema. Muitos casos começam com tratamento conservador e ondas de choque (fascite, esporão). Cirurgia reconstrutiva quando indicada.",
    question: "Todo pé com deformidade precisa de cirurgia?",
    answer: "Não. Muitos casos começam com tratamento conservador."
  }
] as const;
