// Artigos dos especialistas: textos tirados dos posts e vídeos que cada médico já publicou no
// Instagram da clínica em 2026, ampliados pela equipe para leitura no site (ver conteudo-por-medico.md e conteudo-por-especialidade.md).
// Nada de promessa de resultado. `confirmar` marca o que ainda precisa do aval da clínica
// (atribuição pelo tema, sem o médico dizer o nome no vídeo).
// A versão estática (index.html, artigos.html e artigo-*.html) é gerada daqui:
//   node scripts/gerar-artigos.mjs   (dentro de artus-react/)
import { doctors } from "./doctors.ts";

export type AreaArtigo = "mao" | "joelho" | "quadril" | "coluna" | "ombro" | "pe";

export const AREAS_ARTIGOS: { id: AreaArtigo; rotulo: string }[] = [
  { id: "mao", rotulo: "Mão e punho" },
  { id: "joelho", rotulo: "Joelho" },
  { id: "quadril", rotulo: "Quadril" },
  { id: "coluna", rotulo: "Coluna" },
  { id: "ombro", rotulo: "Ombro e cotovelo" },
  { id: "pe", rotulo: "Pé e tornozelo" },
];

export type Artigo = {
  slug: string;
  area: AreaArtigo;
  titulo: string;
  resumo: string;
  corpo: string[];
  /** Mês da publicação original (1–12) e ano. */
  mes: number;
  ano: number;
  imagem: string;
  alt: string;
  autor: (typeof doctors)[number]["id"];
  confirmar?: string;
};

export const ARTIGOS_TITULO = "Artigos dos especialistas";
export const ARTIGOS_SOBRE = "Artigos sobre sintomas, avaliação e opções de cuidado em ortopedia. Leitura informativa. A avaliação individual orienta o tratamento.";
/** Quantos cartões cabem no carrossel da inicial e no máximo que a expansão mostra. */
export const ARTIGOS_POR_LINHA = 4;
export const ARTIGOS_MAX_INICIAL = 8;

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MESES_LONGOS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

const lista: Artigo[] = [
  {
    slug: "joelho-tratamento-direto",
    area: "joelho",
    titulo: "E se o joelho recebesse o tratamento direto onde precisa?",
    resumo: "Na infiltração, a substância é aplicada dentro da articulação. Entenda por que nenhuma infiltração é igual à outra.",
    corpo: [
      "A infiltração intra-articular é a aplicação de uma substância com uma agulha dentro da articulação do joelho. Ela pode entrar na conversa sobre tratamento quando a avaliação indica que a origem dos sintomas está na articulação. O local da aplicação e o produto escolhido dependem do problema identificado e do objetivo do procedimento.",
      "Joelhos com queixas parecidas podem precisar de cuidados diferentes. Na consulta, o médico pergunta quando a dor começou, em que parte do joelho aparece e quais movimentos a provocam. Também avalia se há inchaço, rigidez ou dificuldade para dobrar e estender a perna. Esses dados ajudam a entender se uma aplicação na articulação faria sentido.",
      "Uma das possibilidades é o corticoide, um medicamento que reduz a inflamação. Em alguns casos de artrose, ele pode ser considerado para aliviar os sintomas por um período limitado. A duração do efeito varia. A decisão também leva em conta condições de saúde, como diabetes, porque o corticoide pode elevar temporariamente a glicose.",
      "O ácido hialurônico é outra substância usada em algumas infiltrações. Quando ele é aplicado dentro da articulação, o procedimento se chama viscossuplementação. O benefício para dor e movimento é incerto e varia entre pacientes. Diretrizes como a da Academia Americana de Cirurgiões Ortopédicos desaconselham o uso rotineiro na artrose do joelho.",
      "## Como a aplicação é escolhida",
      "Antes de escolher um procedimento, vale entender por que ele está sendo considerado e quais alternativas existem. Dependendo da avaliação, o plano pode envolver exercícios orientados, fisioterapia, ajuste das atividades ou medicamentos. Se houver indicação de infiltração, ela pode fazer parte desse plano. As outras medidas podem continuar tendo um papel no cuidado.",
      "Embora dispense uma incisão cirúrgica, a infiltração é um procedimento e envolve riscos. Pode haver dor ou inchaço temporários no local. Existe também risco de infecção. A conversa sobre segurança inclui os medicamentos que você usa, tratamentos anteriores e o que observar após a aplicação. O médico define as orientações de acompanhamento de acordo com o caso.",
      "Se a dor no joelho limita sua caminhada, seu trabalho ou suas atividades, procure avaliação. Conte o que já tentou e diga qual tarefa mais gostaria de voltar a fazer com menos dificuldade. Perguntar o que a infiltração pode oferecer no seu caso e como o efeito será avaliado ajuda a decidir os próximos passos.",
    ],
    mes: 11,
    ano: 2026,
    imagem: "artigos/joelho-tratamento-direto.webp",
    alt: "Mãos de um médico examinam o joelho de um paciente sentado na maca",
    autor: "lucio",
  },
  {
    slug: "bolinha-no-punho",
    area: "mao",
    titulo: "Apareceu uma bolinha no punho ou na mão?",
    resumo: "A causa mais comum é o cisto sinovial, geralmente benigno. Nem toda bolinha precisa ser operada.",
    corpo: [
      "Perceber uma bolinha na mão ou no punho pode deixar você em dúvida, especialmente quando ela aparece sem uma queda ou pancada. Uma causa comum é o cisto sinovial, uma bolsa cheia de líquido que surge perto de uma articulação ou de um tendão. Em geral, ele é benigno e pode ser indolor.",
      "O cisto pode aparecer no dorso do punho, na região próxima à palma ou junto a um dedo. O tamanho às vezes varia com o tempo. Algumas pessoas só percebem o volume ao dobrar o punho. Outras sentem incômodo em tarefas como apoiar a mão na mesa, segurar uma sacola ou girar uma maçaneta.",
      "Quando pressiona estruturas próximas, o cisto pode provocar dor, formigamento ou sensação de fraqueza. A aparência da bolinha, sozinha, é insuficiente para identificar sua causa. Outras alterações podem produzir um volume parecido. A consulta ajuda a distinguir entre essas possibilidades e a entender se o caroço tem relação com alguma dificuldade no uso da mão.",
      "O médico costuma perguntar quando a bolinha apareceu, se mudou de tamanho e em quais situações incomoda. No exame, observa a localização, a consistência e o movimento dos dedos e do punho. Se a avaliação deixar dúvidas, um exame como o ultrassom pode ajudar a verificar se há líquido dentro do volume.",
      "## Quando acompanhar ou tratar",
      "Depois de confirmar que se trata de um cisto, o especialista pode orientar acompanhamento quando ele for indolor e a mão funcionar bem. Alguns cistos diminuem ou desaparecem com o tempo. Se o volume voltar a aumentar ou a mão passar a incomodar, esses detalhes ajudam a decidir se o plano precisa mudar.",
      "Quando há dor ou limitação, o médico pode discutir a retirada do líquido com uma agulha ou a remoção cirúrgica do cisto, conforme o local e os sintomas. O cisto pode reaparecer depois do tratamento. Espremer ou tentar furar a bolinha em casa pode machucar a região. A escolha da conduta é feita depois de identificar o tipo de caroço.",
      "Procure avaliação ao notar uma bolinha nova ou de causa desconhecida na mão ou no punho, mesmo sem dor. Informe se ela está crescendo, se começou a doer ou se atrapalha tarefas. Se você percebeu uma mudança no volume ao longo dos dias, conte isso na consulta. Esses detalhes ajudam a decidir entre acompanhar e tratar.",
    ],
    mes: 11,
    ano: 2026,
    imagem: "artigos/bolinha-no-punho.webp",
    alt: "Mãos de um médico examinam o punho de um paciente",
    autor: "cassio",
  },
  {
    slug: "joelho-subir-escada",
    area: "joelho",
    titulo: "É só uma dorzinha no joelho, até ficar difícil subir a escada",
    resumo: "Escada que virou esforço e dor ao caminhar algumas quadras são sinais para avaliar o joelho.",
    corpo: [
      "A dor no joelho pode começar como um incômodo ao subir alguns degraus. Com o tempo, você pode notar que passou a usar o corrimão, diminuir o ritmo da caminhada ou trocar um passeio por um caminho mais curto. Essas mudanças na rotina dizem ao médico quanto a dor está interferindo no movimento.",
      "Subir e descer escadas exige que o joelho se dobre enquanto sustenta parte do peso do corpo. Dor nessa atividade pode aparecer em quadros diferentes, como problemas na região da patela, o osso da frente do joelho, ou artrose. O local exato da dor e as outras situações em que ela surge ajudam a orientar a avaliação.",
      "Outros detalhes também importam. O joelho pode doer depois de algumas quadras, durante atividade física ou ao levantar de uma cadeira. Às vezes, aparece inchaço ou dificuldade para dobrar a perna. Quando há excesso de líquido dentro da articulação, o médico usa o termo derrame articular. A avaliação investiga o que está associado a esse acúmulo.",
      "Na consulta, vale contar se houve uma torção ou pancada, se o joelho prende durante algum movimento e se a perna parece falhar ao apoiar o peso. O exame físico ajuda a verificar os movimentos, a estabilidade e os pontos doloridos. O médico pode pedir imagem quando o resultado ajudar a esclarecer a causa ou mudar a conduta.",
      "## O que costuma ser avaliado",
      "O plano depende do que está provocando a dor. Em casos de artrose, exercícios orientados para força e mobilidade e ajustes nas atividades são opções que podem ser discutidas. A escolha dos exercícios considera o que você consegue fazer, quais tarefas quer retomar e se há condições de saúde que mudam o planejamento.",
      "A viscossuplementação é a aplicação de ácido hialurônico dentro da articulação. O médico pode usar anestesia local conforme o procedimento. Algumas pessoas relatam alívio, mas a resposta varia e o benefício geral é incerto. Por isso, a aplicação não é uma medida de rotina para artrose do joelho. Vale discutir objetivos, riscos e alternativas antes de decidir.",
      "Se subir escadas, caminhar ou praticar atividade física ficou difícil por causa da dor, procure avaliação do joelho. Diga em que momento o problema aparece, como ao descer escadas do trabalho ou ao se levantar depois de ficar sentado. Essa informação ajuda a orientar o exame e a decidir os próximos passos.",
    ],
    mes: 11,
    ano: 2026,
    imagem: "artigos/joelho-subir-escada.webp",
    alt: "Pessoa sobe um degrau com a mão apoiada no joelho",
    autor: "lucio",
  },
  {
    slug: "dor-no-ombro-nao-e-tudo-igual",
    area: "ombro",
    titulo: "Dor no ombro não é tudo igual",
    resumo: "Alterações no manguito rotador, bursite e ombro congelado podem causar dor parecida. Veja o que ajuda a diferenciar as causas.",
    corpo: [
      "Dor para colocar uma blusa, alcançar uma prateleira ou dormir de lado pode surgir por vários motivos. O ombro reúne ossos, músculos, tendões e outras estruturas que trabalham juntas para mover o braço. Entender o que mudou na sua rotina costuma ajudar mais na avaliação do que tentar dar um nome à dor antes da consulta.",
      "Uma queixa comum é sentir dor ao elevar o braço. Esse padrão pode estar relacionado à região abaixo do acrômio, uma parte da escápula que fica sobre o ombro. A região também abriga tendões e uma bolsa chamada bursa. É nessa área que se discute o chamado impacto subacromial, entre outras possibilidades.",
      "O manguito rotador é o conjunto de músculos e tendões que ajuda a levantar e girar o braço. Quando esses tendões estão lesionados, pode haver dor na lateral do ombro e dificuldade para sustentar o braço em algumas posições. O médico distingue perda de força de um movimento interrompido porque dói, pois as duas queixas podem parecer iguais.",
      "A bursite é a irritação da bursa, uma bolsa que reduz o atrito entre as estruturas. Deitar sobre o ombro pode incomodar, mas esse sinal também aparece em alterações dos tendões. Já o ombro congelado costuma provocar perda progressiva de movimento. Alcançar as costas para vestir uma roupa ou girar o braço pode ficar mais difícil.",
      "## Como a causa é investigada",
      "Durante a avaliação, o médico pergunta quando o problema começou, se houve queda ou esforço e em quais direções o movimento está limitado. Também compara o quanto você consegue mover por conta própria com o movimento feito com ajuda durante o exame. De acordo com o caso, radiografia, ultrassom ou ressonância podem complementar a investigação.",
      "A conduta varia conforme a causa, a intensidade dos sintomas e a limitação nas atividades. Fisioterapia e ajustes temporários nas tarefas podem fazer parte do plano. Medicamentos, infiltrações ou cirurgia entram na conversa em situações específicas. O diagnóstico ajuda a definir se a prioridade é recuperar movimentos, trabalhar força ou avaliar uma lesão que exige outro cuidado.",
      "Se a dor volta, atrapalha seu sono ou dificulta usar o braço, procure avaliação. Conte se a maior dificuldade é levantar, girar ou sustentar o braço e se a dor começou de repente ou aos poucos. Esse relato dá ao especialista um ponto de partida para examinar o ombro e conversar com você sobre as opções.",
    ],
    mes: 10,
    ano: 2026,
    imagem: "artigos/dor-no-ombro-nao-e-tudo-igual.webp",
    alt: "Médico avalia o movimento do ombro de um paciente sentado de costas",
    autor: "luiz",
  },
  {
    slug: "ondas-de-choque",
    area: "pe",
    titulo: "Ondas de choque não são choques elétricos",
    resumo: "São ondas mecânicas aplicadas sobre a pele. Saiba quando o procedimento pode ser discutido e por que a indicação depende da causa da dor.",
    corpo: [
      "O nome pode causar estranheza, mas a terapia por ondas de choque usa pulsos de energia mecânica. Um aparelho transmite esses pulsos à região tratada por meio de um aplicador que encosta na pele. A técnica é estudada para estimular respostas locais do tecido. A indicação depende da condição avaliada.",
      "Entre as situações em que o procedimento pode entrar na conversa está a fascite plantar persistente, que provoca dor na região da sola do pé próxima ao calcanhar. Também há estudos em problemas de tendões. A evidência varia conforme a condição. Uma indicação considerada para o pé, por exemplo, não se aplica automaticamente a qualquer dor em outro local.",
      "Antes de discutir o aparelho, o especialista procura entender de onde vem a dor. Pergunta em quais atividades ela aparece, quando começou, onde se concentra e quais cuidados já foram tentados. No exame do pé, pode observar o movimento do tornozelo e a região mais sensível. Outras causas de dor no calcanhar podem exigir uma abordagem diferente.",
      "O procedimento costuma ser discutido quando os sintomas continuam apesar das medidas iniciais adequadas ao diagnóstico. Para fascite plantar, essas medidas podem incluir fisioterapia, mudanças nas atividades e ajustes no calçado. O que já foi feito e a resposta aos cuidados ajudam a avaliar se vale manter o plano, modificá-lo ou conversar sobre outro recurso.",
      "## Quando considerar o procedimento",
      "Os estudos sobre ondas de choque para fascite plantar persistente apresentam resultados diferentes entre si. O alívio pode variar, e algumas pessoas continuam com sintomas após o procedimento. Por isso, vale conversar sobre quais objetivos são razoáveis para a sua rotina e como seria avaliado o efeito, como pela facilidade para caminhar ou pelo incômodo ao começar o dia.",
      "Pode haver desconforto durante a aplicação ou sensibilidade na área depois dela. A avaliação considera o diagnóstico, seu histórico de saúde e os cuidados necessários. O número de sessões e a forma de aplicação dependem da condição e do equipamento. O profissional pode explicar como o procedimento se encaixa no restante do plano de tratamento.",
      "Se a dor persiste ao caminhar, ficar em pé ou praticar suas atividades, procure avaliação. Leve, se tiver, registros de tratamentos anteriores e conte o que mudou desde que a queixa começou. Assim, você pode discutir com o especialista quais opções fazem sentido para a causa da dor e se as ondas de choque são uma delas.",
    ],
    mes: 10,
    ano: 2026,
    imagem: "artigos/ondas-de-choque.webp",
    alt: "Aplicador de ondas de choque encostado no calcanhar de um paciente deitado na maca",
    autor: "ricardo",
  },
  {
    slug: "estenose-de-canal-lombar",
    area: "coluna",
    titulo: "Estenose de canal lombar sempre precisa de cirurgia?",
    resumo: "Os sintomas, o exame e o impacto na rotina orientam a escolha entre cuidados sem cirurgia e outras opções.",
    corpo: [
      "Na estenose do canal lombar, diminui o espaço por onde passam os nervos na parte inferior da coluna. Isso pode acontecer quando discos, ossos e ligamentos mudam ao longo do tempo. Algumas pessoas têm sinais de estreitamento em exames e sentem pouco ou nenhum incômodo. Para entender o que a imagem significa, é preciso relacioná-la às queixas e ao exame físico.",
      "Um padrão frequente é sentir peso, dor ou formigamento nas pernas depois de caminhar ou de ficar em pé por algum tempo. Algumas pessoas sentem alívio ao sentar ou ao se inclinar para a frente. A distância que você consegue percorrer até precisar parar é um detalhe que ajuda o especialista a entender o impacto dos sintomas.",
      "Também pode haver dor lombar. A forma como ela aparece depende de cada caso. Dor ao ficar sentado ou de pé, por si só, pode ter outras causas. Na consulta, vale descrever se o incômodo fica nas costas ou chega à perna, se é de um lado ou dos dois e em que posição costuma aliviar.",
      "O exame pode incluir a observação da caminhada e testes de força, sensibilidade e reflexos. O médico pode pedir uma ressonância para observar o canal e as estruturas próximas quando houver indicação. Sintomas semelhantes às vezes vêm de outras regiões, inclusive do quadril ou da circulação das pernas. Por isso, é importante contar o que acontece antes, durante e depois da caminhada.",
      "## O que orienta o tratamento",
      "Em muitos casos, é possível discutir inicialmente medidas sem cirurgia. Elas podem incluir fisioterapia, exercícios orientados e medicamentos, conforme a avaliação. Em situações específicas, pode-se considerar uma infiltração para tentar aliviar sintomas. O procedimento não aumenta o espaço dentro do canal e seu benefício pode ser limitado. O acompanhamento ajuda a decidir se a conduta está atendendo às suas necessidades.",
      "A cirurgia pode ser discutida quando a limitação continua importante apesar dos cuidados iniciais ou quando a avaliação mostra alterações neurológicas que mudam a conduta. O objetivo pode ser liberar espaço para os nervos. A decisão leva em conta os sintomas, o exame, a imagem, a saúde geral e o que você espera recuperar na rotina.",
      "Se o peso nas pernas, a dor ou o formigamento estão encurtando suas caminhadas, procure avaliação. Conte em que situações você precisa parar, se sentar ajuda e se percebeu alguma mudança na força. Esse relato ajuda o especialista a investigar a causa e a conversar com você sobre as opções de cuidado.",
    ],
    mes: 10,
    ano: 2026,
    imagem: "artigos/estenose-de-canal-lombar.webp",
    alt: "Médico aponta a região lombar em um modelo anatômico da coluna",
    autor: "andre",
  },
  {
    slug: "dor-no-calcanhar",
    area: "pe",
    titulo: "Dor no calcanhar ou esporão?",
    resumo: "Fascite plantar e alterações nos tendões estão entre as causas de dor no calcanhar. O esporão na radiografia pode ser apenas um achado.",
    corpo: [
      "Dor no calcanhar pode aparecer nos primeiros passos depois de levantar da cama ou depois de um dia inteiro em pé. A região tem ossos, tendões e tecidos que recebem carga ao caminhar. A origem da dor pode estar na sola do pé, atrás do calcanhar ou em outra estrutura próxima. O lugar exato do incômodo ajuda a entender o que investigar.",
      "Na fascite plantar, a dor costuma ficar na parte de baixo do calcanhar. A fáscia plantar é uma faixa de tecido que liga o calcanhar à parte da frente do pé e ajuda a sustentar o arco. Quando essa região está irritada, os primeiros passos depois de um período de repouso podem ser particularmente incômodos.",
      "O esporão é uma pequena saliência óssea que pode aparecer na radiografia do calcanhar. Algumas pessoas têm esporão e nunca sentem dor. O achado, sozinho, é insuficiente para explicar o sintoma. Em muitos casos, é possível tratar a dor relacionada à fáscia sem retirar o esporão. O médico interpreta a imagem junto do exame do pé.",
      "Quando a dor aparece atrás do calcanhar, perto da região em que o tendão de Aquiles se liga ao osso, o tendão é uma das estruturas que podem ser avaliadas. O médico também pode perguntar sobre mudanças no treino, períodos prolongados em pé, o tipo de calçado e o que você sente ao apoiar o pé.",
      "## O que a avaliação procura",
      "Na consulta, o exame busca o ponto de maior sensibilidade e observa o movimento do tornozelo. O especialista pode verificar como o pé se apoia ao caminhar. Dependendo da hipótese, uma radiografia pode ajudar a avaliar outras causas. Para a fascite plantar, o relato e o exame físico costumam dar informações importantes antes de se pensar em outros exames.",
      "O tratamento geralmente começa com opções que dispensam cirurgia. Conforme a causa, o plano pode incluir ajustes nas atividades, mudanças no calçado, palmilhas ou fisioterapia. A escolha considera o que agrava os sintomas e o quanto a dor interfere no trabalho, em casa ou no exercício. A evolução ajuda a decidir se algum outro cuidado precisa ser discutido.",
      "Se o incômodo se repete, limita sua caminhada ou faz você mudar a forma de apoiar o pé, procure avaliação. Indique se a dor é embaixo ou atrás do calcanhar e se é pior ao acordar, depois do exercício ou após muito tempo em pé. Com essas informações, fica mais fácil investigar a causa e planejar o cuidado.",
    ],
    mes: 9,
    ano: 2026,
    imagem: "artigos/dor-no-calcanhar.webp",
    alt: "Mãos de um médico examinam a sola do pé e o calcanhar de um paciente",
    autor: "ricardo",
  },
  {
    slug: "cinco-sinais-ombro",
    area: "ombro",
    titulo: "Cinco sinais de que o ombro precisa de avaliação",
    resumo: "Dor ao levantar o braço e dificuldade para dormir sobre o ombro estão entre eles.",
    corpo: [
      "Alguns sinais do ombro ficam mais claros olhando para as tarefas do dia. Pode ser a dificuldade de tirar uma camiseta, pegar algo no alto ou dormir na posição de sempre. Contar o que mudou ajuda o especialista a investigar a queixa. Os cinco sinais a seguir podem orientar essa conversa, principalmente quando voltam com frequência.",
      "O primeiro é a dor ao levantar o braço. Você pode senti-la ao guardar uma caixa na prateleira ou pentear o cabelo. Vale perceber se ela aparece no começo do movimento, com o braço mais alto ou quando você o abaixa. Também é útil dizer se há diferença entre levantar o braço vazio e segurar um objeto.",
      "O segundo é o incômodo ao dormir sobre o ombro. Algumas pessoas precisam trocar de lado ou acordam ao mudar de posição. Conte se a dor aparece somente quando você se apoia naquele ombro ou se também sente incômodo durante o dia. O padrão ajuda a orientar o exame, pois diferentes estruturas podem provocar dor à noite.",
      "O terceiro é a fraqueza ao girar o braço. Ela pode ficar mais clara ao vestir um casaco ou manter o braço numa posição. O quarto é a dor depois de atividades repetitivas, como trabalhar com o braço levantado ou repetir um gesto no esporte. Diga se houve mudança recente na intensidade, na frequência ou no tipo de esforço.",
      "## O exame do ombro",
      "O quinto são os estalos ou a sensação de travamento. Um ruído isolado pode ocorrer sem dor e sem limitar o movimento. Quando a articulação parece prender, quando o estalo dói ou quando você passa a evitar certos gestos, vale descrever as circunstâncias. O médico pode perguntar se o movimento volta sozinho e se houve uma lesão antes.",
      "Na consulta, o especialista avalia a mobilidade, a força e os movimentos que reproduzem o incômodo. Se houver indicação, um exame de imagem pode complementar a avaliação. Conforme a causa, o plano pode incluir fisioterapia e ajustes nas atividades. Em alguns casos, podem ser discutidos medicamentos ou outros procedimentos, considerando seu histórico e suas prioridades.",
      "Se algum desses sinais se repete, interrompe seu sono ou muda o jeito como você usa o braço, procure avaliação. Escolha um exemplo concreto da sua rotina para contar na consulta. Dizer que ficou difícil fechar um zíper nas costas ou sustentar uma panela ajuda a explicar a limitação com mais clareza.",
    ],
    mes: 7,
    ano: 2026,
    imagem: "artigos/cinco-sinais-ombro.webp",
    alt: "Médico aponta a articulação em um modelo anatômico do ombro",
    autor: "luiz",
  },
  {
    slug: "dedo-em-gatilho",
    area: "mao",
    titulo: "Dedo em gatilho: quando o dedo trava",
    resumo: "Acordar com um dedo travado, que só endireita com a ajuda da outra mão, é o sinal mais conhecido.",
    corpo: [
      "Acordar com um dedo dobrado e precisar da outra mão para endireitá-lo é uma queixa comum no dedo em gatilho. Algumas pessoas percebem primeiro um clique ao abrir e fechar a mão. Outras sentem dor perto da base do dedo, do lado da palma, antes de notar dificuldade para estendê-lo.",
      "Os tendões que dobram os dedos deslizam por pequenos túneis. Partes desses túneis chamadas polias mantêm o tendão próximo ao osso durante o movimento. Quando o tendão ou a região da polia engrossa, a passagem fica mais apertada. O tendão pode prender no caminho e soltar de repente, dando a sensação de gatilho.",
      "A rigidez pode aparecer ao acordar ou depois de um período de repouso. Com o uso da mão, ela pode diminuir por algum tempo. Se o dedo trava, vale observar em que posição isso acontece e se ele volta sozinho ou precisa de ajuda. Essas diferenças dão pistas sobre como o movimento está sendo afetado.",
      "O dedo em gatilho pode ocorrer em pessoas com diabetes, gota ou artrite reumatoide. Essas condições são informações úteis para a consulta. O travamento também aparece em pessoas sem essas condições, e a associação, sozinha, é insuficiente para explicar a queixa de alguém. Conte ao especialista sobre seu histórico e sobre os medicamentos em uso.",
      "## Como o dedo é avaliado",
      "O diagnóstico costuma ser feito com a conversa e o exame da mão. O médico observa o movimento dos dedos e pode apalpar a região dolorida na palma. Exames de imagem geralmente ficam para situações em que há dúvida sobre a causa. Contar como está para segurar objetos, escrever ou manusear ferramentas ajuda a dimensionar a limitação.",
      "O tratamento depende de quanto o problema incomoda e de como o dedo se movimenta. Entre as opções sem cirurgia, podem ser discutidos ajustes nas atividades, uma tala e infiltração de corticoide. Se o travamento persistir ou o dedo ficar preso, o especialista pode conversar sobre cirurgia para liberar a região por onde o tendão desliza.",
      "Se o dedo volta a travar, dói ou interfere no uso da mão, procure avaliação. Diga quais dedos estão envolvidos, em que momento do dia a dificuldade aparece e se você precisa usar a outra mão para estendê-los. Essas informações ajudam a identificar o problema e a escolher o cuidado de acordo com sua rotina.",
    ],
    mes: 7,
    ano: 2026,
    imagem: "artigos/dedo-em-gatilho.webp",
    alt: "Mãos de um médico examinam a base do dedo de um paciente",
    autor: "cassio",
  },
  {
    slug: "erros-que-prejudicam-o-quadril",
    area: "quadril",
    titulo: "Quatro erros que prejudicam o quadril",
    resumo: "Ficar sentado por horas e demorar para procurar o especialista estão na lista.",
    corpo: [
      "A dor no quadril às vezes muda a rotina aos poucos. Você pode começar a apoiar as mãos para levantar da cadeira, encurtar a caminhada ou evitar se abaixar para calçar um sapato. Quatro situações valem atenção quando essas mudanças aparecem, porque ajudam a reconhecer limitações que passaram a fazer parte do dia.",
      "A primeira é passar muitas horas sentado. Se o quadril fica rígido ao levantar, observe quanto tempo o incômodo dura e se melhora ao andar. A relação com o tempo sentado é uma informação para a avaliação. O médico considera o conjunto dos sintomas antes de atribuir a dor a um hábito ou a um problema na articulação.",
      "A segunda envolve o peso corporal. Em pessoas com artrose e excesso de peso, o médico pode discutir o peso como um dos fatores que influenciam a carga sobre o quadril. Há outros fatores envolvidos na dor e na função da articulação. Quando esse assunto entra na consulta, as possibilidades de cuidado devem fazer sentido para a saúde e a rotina da pessoa.",
      "A terceira é perceber que você está mancando, às vezes depois que alguém comenta. Mudar o jeito de pisar pode ser uma adaptação à dor, à rigidez ou à fraqueza. Vale contar quando começou, se acontece desde o primeiro passo ou só depois de andar, e se você também passou a ter dificuldade em outras tarefas.",
      "## O que acontece na consulta",
      "A quarta situação é adiar a avaliação quando a dor já muda sua rotina. Na consulta, o especialista pode observar sua caminhada, avaliar a mobilidade do quadril e perguntar se o incômodo fica na virilha, na lateral ou em outra região. Em alguns casos, exames de imagem ajudam a esclarecer o que o exame físico sugere.",
      "O plano depende da causa e da limitação. Em quadros como artrose, podem entrar na conversa exercícios orientados, fisioterapia, ajustes nas atividades e medicamentos, de acordo com o caso. A avaliação ajuda a escolher atividades compatíveis com o que você consegue fazer e com o que gostaria de voltar a fazer no dia a dia.",
      "Se a dor ou a rigidez faz você mancar, evitar caminhadas ou levar mais tempo para se vestir, procure avaliação. Conte quais tarefas ficaram difíceis e se o incômodo mudou desde o início. Essas informações ajudam o especialista a entender o impacto do problema e discutir com você os próximos passos.",
    ],
    mes: 7,
    ano: 2026,
    imagem: "artigos/erros-que-prejudicam-o-quadril.webp",
    alt: "Médico aponta a articulação do quadril em um modelo anatômico da bacia",
    autor: "renam",
  },
  {
    slug: "dor-no-cotovelo",
    area: "ombro",
    titulo: "Abrir uma porta ou apertar a mão dói no cotovelo?",
    resumo: "Pode ser epicondilite, uma alteração dos tendões do antebraço perto do cotovelo. A avaliação ajuda a identificar a causa da dor.",
    corpo: [
      "Sentir dor no cotovelo ao abrir uma porta, apertar uma mão ou carregar uma sacola pode deixar tarefas simples mais difíceis. Um dos problemas que podem causar esse incômodo é a epicondilite, uma alteração dos tendões do antebraço perto do cotovelo. O tipo de esforço que provoca a dor ajuda a orientar a avaliação.",
      "Os músculos do antebraço participam dos movimentos dos dedos e do punho. Seus tendões se prendem a saliências ósseas do cotovelo. Quando o problema afeta os tendões do lado de fora, fala-se em epicondilite lateral. Ela pode ocorrer em quem faz movimentos repetidos no trabalho ou em atividades do dia a dia, inclusive em pessoas que não praticam esporte.",
      "O incômodo pode se espalhar pelo antebraço até perto do punho. Às vezes, fica difícil segurar uma ferramenta ou levantar um objeto com a mão. Dor no lado de dentro do cotovelo pode envolver outro grupo de tendões. O ponto de dor mais forte e a presença de outros sinais ajudam a diferenciar as possibilidades.",
      "Na consulta, vale dizer se houve pancada, se você começou uma atividade nova ou se passou a repetir mais um movimento. Formigamento ou dormência também são informações importantes, pois podem levar o médico a avaliar os nervos da região. O exame costuma observar os pontos doloridos e o que acontece quando você mexe o punho contra resistência.",
      "## O exame do cotovelo",
      "A avaliação costuma começar pelo relato e pelo exame físico. Se houver dúvida sobre a origem da dor ou suspeita de outro problema, o médico pode pedir exames. A situação de quem sente dor só ao fazer força pode ser diferente da de quem também tem dificuldade para mexer o cotovelo ou sente dormência na mão.",
      "O tratamento pode começar com adaptações temporárias na atividade e fisioterapia, conforme a causa e o quanto o braço está limitado. Em alguns casos, podem ser discutidos um apoio para o antebraço ou medicamentos. Outros procedimentos ficam para situações específicas. O acompanhamento ajuda a entender como o cotovelo responde e a planejar a retomada das tarefas.",
      "Se abrir uma porta, cumprimentar alguém ou usar um objeto no trabalho está provocando dor com frequência, procure avaliação. Diga onde o incômodo começa, se ele se espalha e que tipo de esforço piora a queixa. Com essas informações, o especialista pode investigar a causa e orientar as opções de cuidado para o seu caso.",
    ],
    mes: 7,
    ano: 2026,
    imagem: "artigos/dor-no-cotovelo.webp",
    alt: "Mãos de um médico examinam o cotovelo de um paciente",
    autor: "valmir",
  },
  {
    slug: "coluna-fora-do-lugar",
    area: "coluna",
    titulo: "Sentir a coluna “fora do lugar” não é normal",
    resumo: "A sensação pode estar ligada à espondilolistese, quando uma vértebra escorrega sobre a outra.",
    corpo: [
      "Algumas pessoas descrevem a dor lombar como uma sensação de que a coluna está fora do lugar. Essa expressão diz como o incômodo é percebido. O que está acontecendo nas vértebras precisa ser avaliado. Uma possibilidade é a espondilolistese, nome dado ao deslocamento de uma vértebra em relação à que está logo abaixo.",
      "Na região lombar, certas formas de espondilolistese aparecem à medida que discos e articulações da coluna mudam com o tempo. Há também formas relacionadas a uma alteração em uma parte do osso da vértebra. O tipo e a localização do deslocamento ajudam o especialista a interpretar os exames e a entender se o achado explica a queixa.",
      "Algumas pessoas descobrem o deslocamento em um exame e sentem pouco ou nenhum incômodo. Outras têm dor nas costas ou percebem dor, formigamento e cãibras que se estendem para a perna. Quando há compressão de nervos da região lombar, os sintomas podem mudar com a postura ou com o tempo que a pessoa permanece em pé.",
      "Na consulta, o médico pergunta onde o sintoma começa, quais posições o pioram e se você percebeu mudança na força ou na caminhada. O exame pode incluir testes de movimento, sensibilidade e força. Radiografias ajudam a mostrar o alinhamento da coluna. Uma ressonância pode ser útil quando há interesse em observar os nervos e os tecidos próximos.",
      "## Como é feita a avaliação",
      "Quando há indicação de cuidado sem cirurgia, podem ser discutidos exercícios orientados, fisioterapia e medicamentos. Em alguns casos, também se considera infiltração para sintomas associados à irritação ou compressão dos nervos. A escolha depende de como a dor interfere nas atividades, do resultado do exame e da resposta aos cuidados anteriores.",
      "A cirurgia pode entrar na conversa quando os sintomas continuam muito limitantes apesar do tratamento, ou quando o exame mostra alterações que mudam a decisão. Existem diferentes técnicas. A possibilidade de uma abordagem minimamente invasiva depende da anatomia, do tipo de alteração e do objetivo da cirurgia. A escolha precisa ser discutida na avaliação individual.",
      "Se você sente dor lombar que volta com frequência, chega à perna ou faz você interromper tarefas e caminhadas, procure avaliação. Conte o que sente e em que posição a sensação muda. Esses detalhes ajudam a distinguir o que é percebido no dia a dia do que aparece nos exames e a escolher os próximos cuidados.",
    ],
    mes: 5,
    ano: 2026,
    imagem: "artigos/coluna-fora-do-lugar.webp",
    alt: "Médico examina a parte de baixo das costas de um paciente sentado na maca",
    autor: "andre",
  },
  {
    slug: "protese-de-quadril",
    area: "quadril",
    titulo: "Na prótese de quadril, a articulação inteira é retirada?",
    resumo: "A prótese total substitui a cabeça do fêmur e a superfície do encaixe na bacia. A reabilitação segue um plano individual.",
    corpo: [
      "Na prótese total de quadril, o cirurgião substitui as duas superfícies que se encontram na articulação. Uma delas é a cabeça do fêmur, a parte arredondada no alto do osso da coxa. A outra é o encaixe na bacia, chamado acetábulo. A bacia e o restante do fêmur permanecem, com os componentes da prótese fixados nos ossos.",
      "No lado do fêmur, a cabeça é retirada e substituída por uma peça arredondada ligada a uma haste que fica no interior do osso. No lado da bacia, o encaixe recebe um componente próprio. Juntas, essas peças formam as novas superfícies de contato. O tipo de implante e a fixação dependem das características de cada pessoa.",
      "A cirurgia pode ser considerada em casos como artrose do quadril, quando a dor e a rigidez dificultam tarefas importantes. Antes de decidir, o especialista avalia como você caminha, onde sente dor e quais movimentos ficaram limitados. Radiografias ajudam a caracterizar a alteração, e o impacto na rotina também pesa na decisão.",
      "Em muitos casos, a conversa começa por opções sem cirurgia, como fisioterapia, ajustes nas atividades e medicamentos quando indicados. Se a limitação continua apesar dessas medidas, a prótese pode entrar na discussão. A decisão leva em conta as alternativas, os benefícios esperados, os riscos e o que você gostaria de melhorar na sua rotina.",
      "## Como se decide pela cirurgia",
      "Quando a cirurgia é indicada, a consulta pré-operatória também serve para conversar sobre recuperação e dúvidas práticas. É um momento para informar condições de saúde e os medicamentos em uso. A equipe orienta sobre preparo e explica riscos, como infecção e trombose, de acordo com o procedimento e o histórico da pessoa.",
      "A reabilitação costuma começar após a cirurgia, quando a equipe libera a movimentação. A fisioterapia pode ajudar no treino da caminhada e das tarefas do dia a dia. O uso de apoio, o momento de voltar a dirigir ou ao trabalho e o avanço dos exercícios variam conforme o procedimento e a evolução. O acompanhamento orienta essas etapas.",
      "Se a dor no quadril já limita sua caminhada, seu sono ou tarefas como se calçar, procure avaliação. Conte o que já tentou e quais atividades gostaria de retomar. O especialista pode explicar as opções do seu caso e, se a prótese for considerada, conversar sobre a cirurgia, os riscos e o planejamento da recuperação.",
    ],
    mes: 11,
    ano: 2026,
    imagem: "artigos/protese-de-quadril.webp",
    alt: "Médico segura um modelo de prótese de quadril ao lado de um modelo da bacia",
    autor: "renam",
    confirmar: "Vídeo atribuído ao Dr. Renam pelo tema; confirmar com a clínica.",
  },
];

/** Do mais recente para o mais antigo. */
export const artigos = [...lista].sort((a, b) => b.ano - a.ano || b.mes - a.mes);

export const autorDe = (a: Artigo) => doctors.find((d) => d.id === a.autor)!;
export const rotuloArea = (area: AreaArtigo) => AREAS_ARTIGOS.find((x) => x.id === area)!.rotulo;
export const mesCurto = (a: Artigo) => MESES[a.mes - 1];
export const dataLonga = (a: Artigo) => `${MESES_LONGOS[a.mes - 1]} de ${a.ano}`;
export const dataIso = (a: Artigo) => `${a.ano}-${String(a.mes).padStart(2, "0")}`;
/** Nome curto no cartão, o mesmo que o site já usa (WhatsApp, perguntas frequentes). */
const NOMES_CURTOS: Record<string, string> = {
  cassio: "Dr. Cássio Cocate", lucio: "Dr. Lúcio Nuno", renam: "Dr. Renam Bumlai", andre: "Dr. André Nunes Machado",
  valmir: "Dr. Valmir Pagliaro", luiz: "Dr. Luiz Augusto", ricardo: "Dr. Ricardo Issaka",
};
export const nomeCurto = (a: Artigo) => NOMES_CURTOS[a.autor] ?? autorDe(a).name;

/** Coluna ao lado do artigo: primeiro os da mesma área, depois os mais recentes, até cinco. */
export function outrosArtigos(artigo: Artigo) {
  const resto = artigos.filter((a) => a.slug !== artigo.slug);
  return [...resto.filter((a) => a.area === artigo.area), ...resto.filter((a) => a.area !== artigo.area)].slice(0, 5);
}
