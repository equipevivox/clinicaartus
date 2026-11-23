/**
 * Textos das páginas de privacidade, cookies e termos de uso. Fonte única para as duas versões:
 * o Next.js lê este arquivo e a versão estática é gerada dele por scripts/gerar-paginas-legais.mjs
 * (rode `node scripts/gerar-paginas-legais.mjs` dentro de artus-react/ depois de mudar um texto).
 *
 * Os textos descrevem o que o site faz hoje: sem formulários, sem ferramentas de análise ou
 * publicidade; armazena só a escolha sobre cookies e a marca da abertura em vídeo; o único conteúdo
 * de terceiros é o mapa do Google, que só carrega com permissão. Se isso mudar, atualize aqui.
 *
 * Links no texto: [texto](/caminho). Os caminhos são os do Next; o gerador troca pelos .html.
 *
 * Textos provisórios da revisão 13 do Codex. Antes de publicar, a clínica precisa confirmar:
 * razão social e CNPJ; nome e contato do encarregado (LGPD, art. 41) ou a dispensa e o canal para
 * titulares; que a recepção recebe pedidos de privacidade; prazos de guarda das mensagens e dos
 * registros de acesso; fornecedores (hospedagem, WhatsApp) e eventual transferência internacional.
 */

export type Bloco =
  | string
  | { lista: string[] }
  | { tabela: { cabecalho: string[]; linhas: string[][] } }
  | { preferencias: string };

export type Secao = { id: string; titulo: string; blocos: Bloco[] };

export type PaginaLegal = {
  slug: "privacidade" | "cookies" | "termos";
  titulo: string;
  /** Título curto, usado no seletor entre os documentos. */
  curto: string;
  descricao: string;
  resumo: string[];
  secoes: Secao[];
};

/** Data da última atualização, em ISO; a forma por extenso sai daqui (B2). */
export const ATUALIZADO_ISO = "2026-11-22";
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
export const ATUALIZADO_EM = (() => {
  const [ano, mes, dia] = ATUALIZADO_ISO.split("-").map(Number);
  return `${dia} de ${MESES[mes - 1]} de ${ano}`;
})();

const contato =
  "Fale com a recepção pelo telefone (65) 3322-6689, pelo WhatsApp no mesmo número ou pessoalmente na Av. Egito, 95, Santa Rosa, Cuiabá, MT.";

export const privacidade: PaginaLegal = {
  slug: "privacidade",
  titulo: "Política de privacidade",
  curto: "Privacidade",
  descricao: "Como a Clínica Artus trata dados pessoais no site e nos canais de agendamento.",
  resumo: [
    "O site não tem formulários e não pede informações sobre a sua saúde.",
    "O agendamento acontece por telefone ou WhatsApp, direto com a recepção.",
    "O mapa do Google só é carregado se você permitir.",
  ],
  secoes: [
    {
      id: "quem-somos",
      titulo: "Quem somos",
      blocos: [
        "Esta política explica o tratamento de dados no site da Clínica Artus Ortopedia e nos canais de agendamento divulgados aqui. A Clínica Artus Ortopedia é responsável pelo tratamento de dados nesses canais. Seu endereço é Av. Egito, 95, Santa Rosa, Cuiabá, MT.",
      ],
    },
    {
      id: "dados",
      titulo: "Quais dados tratamos",
      blocos: [
        "O site é informativo: não tem cadastro, formulário nem área do paciente. Os dados que podem ser tratados são estes:",
        {
          lista: [
            "Dados técnicos de acesso. Ao abrir o site, o navegador envia informações necessárias para entregar a página, como o endereço IP.",
            "Registros no seu navegador. Seu navegador guarda a escolha sobre o mapa e uma marca para evitar repetir a abertura em vídeo na mesma sessão da aba. Esses registros não contêm nome nem telefone.",
            "Contato por telefone ou WhatsApp. Ao abrir o WhatsApp pelo site, o serviço recebe a mensagem sugerida no link. Você pode editá-la antes de enviar. A recepção recebe as informações que você fornecer na ligação ou na conversa.",
            "Dados do mapa. Se você permitir o mapa do Google no rodapé, o Google recebe dados da sua navegação, conforme a política dele.",
          ],
        },
        "O site não tem formulário para receber informações sobre a sua saúde. Para agendar, evite incluir sintomas, exames e laudos na primeira mensagem.",
      ],
    },
    {
      id: "finalidades",
      titulo: "Para que usamos",
      blocos: [
        {
          lista: [
            "Agendar, confirmar e remarcar consultas.",
            "Responder às suas dúvidas sobre a clínica, a equipe e o atendimento.",
            "Manter o site seguro e funcionando.",
            "Cumprir obrigações previstas em lei.",
          ],
        },
        "O site não usa ferramentas próprias de análise de audiência ou publicidade.",
      ],
    },
    {
      id: "bases-legais",
      titulo: "Bases legais",
      blocos: [
        "O mapa incorporado é carregado com a sua permissão. Você pode retirar essa permissão em “Preferências de cookies”. A recepção usa os dados fornecidos para dar andamento ao agendamento que você solicitou.",
      ],
    },
    {
      id: "compartilhamento",
      titulo: "Com quem compartilhamos",
      blocos: [
        "A empresa de hospedagem entrega as páginas do site. Ao abrir o WhatsApp ou os links do Google, você acessa serviços com políticas próprias. Ao ativar o mapa incorporado, o navegador se conecta ao Google para exibir a localização. Informações podem ser fornecidas a autoridades nas hipóteses previstas em lei.",
      ],
    },
    {
      id: "prazos",
      titulo: "Por quanto tempo guardamos",
      blocos: [
        "A preferência do mapa vale por 365 dias. Ao vencer, ela deixa de ser aplicada. A marca do vídeo fica no armazenamento da sessão da aba.",
      ],
    },
    {
      id: "seguranca",
      titulo: "Segurança",
      blocos: [
        "Para agendar, use os canais oficiais da recepção indicados neste site.",
      ],
    },
    {
      id: "direitos",
      titulo: "Seus direitos",
      blocos: [
        "Pelo artigo 18 da LGPD, você pode pedir à clínica:",
        {
          lista: [
            "Confirmação de que tratamos dados seus e acesso a eles.",
            "Correção de dados incompletos, inexatos ou desatualizados.",
            "Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desacordo com a LGPD.",
            "Eliminação dos dados tratados com consentimento, nas hipóteses previstas em lei.",
            "Portabilidade dos dados a outro fornecedor.",
            "Informação sobre com quem os dados foram compartilhados.",
            "Informação sobre a possibilidade de recusar o consentimento e o que acontece se você recusar.",
            "Revogação do consentimento, como a permissão do mapa. Se você recusar o mapa, o restante do site continua disponível.",
          ],
        },
        "Você também pode se opor a um tratamento feito sem consentimento se ele estiver em desacordo com a LGPD, e apresentar uma petição à Autoridade Nacional de Proteção de Dados (ANPD).",
      ],
    },
    {
      id: "contato",
      titulo: "Como falar com a clínica",
      blocos: [
        "Para fazer um pedido sobre seus dados pessoais, ligue para (65) 3322-6689 e informe à recepção que o assunto é privacidade.",
      ],
    },
    {
      id: "alteracoes",
      titulo: "Alterações nesta política",
      blocos: [
        "Esta política pode mudar quando o site, os canais de atendimento ou a lei mudarem. A data da última atualização fica no topo da página. Se uma mudança afetar a permissão do mapa, o site avisa com destaque e pede a sua escolha de novo. Veja também a [Política de cookies](/cookies) e os [Termos de uso](/termos).",
      ],
    },
  ],
};

export const cookies: PaginaLegal = {
  slug: "cookies",
  titulo: "Política de cookies",
  curto: "Cookies",
  descricao: "Quais cookies e registros no navegador o site usa e como você controla cada um.",
  resumo: [
    "O site não usa ferramentas próprias de análise de audiência nem de publicidade.",
    "O único conteúdo de terceiros é o mapa do Google, e ele só carrega com a sua permissão.",
    "Você pode mudar a sua escolha a qualquer momento.",
  ],
  secoes: [
    {
      id: "o-que-sao",
      titulo: "O que são cookies",
      blocos: [
        "Cookies são pequenos arquivos que um site guarda no seu navegador. O armazenamento local é um recurso parecido, que guarda informações no próprio aparelho. Os dois servem para lembrar escolhas e fazer o site funcionar.",
      ],
    },
    {
      id: "quais-usamos",
      titulo: "O que este site usa",
      blocos: [
        {
          tabela: {
            cabecalho: ["Nome", "Tipo", "Para que serve", "Duração"],
            linhas: [
              ["artus-cookies", "Essencial · armazenamento local", "Guarda a sua escolha sobre o mapa.", "Escolha válida por 365 dias."],
              ["artus-abertura", "Preferência de exibição · armazenamento da sessão", "Evita repetir a abertura em vídeo na mesma aba.", "Sessão da aba"],
              ["Cookies do Google", "Opcional · terceiros", "O Google pode usar cookies ao carregar o mapa incorporado.", "Definida pelo Google"],
            ],
          },
        },
        "As chaves da tabela ficam no seu navegador. Você pode apagá-las nas configurações do navegador.",
      ],
    },
    {
      id: "mapa",
      titulo: "O mapa do Google",
      blocos: [
        "O mapa incorporado no rodapé da página inicial só se conecta ao Google depois que você permite. Se preferir, use “Abrir no Google Maps” para consultar a localização no site do Google. Ao desligar o mapa aqui, o site para de carregá-lo. Para apagar cookies que o Google já gravou, use as configurações do navegador.",
      ],
    },
    {
      id: "escolha",
      titulo: "Como mudar a sua escolha",
      blocos: [
        "Abra “Preferências de cookies” no rodapé ou use o botão abaixo. Desative “Mapa do Google” e salve. Se apagar os registros deste site nas configurações do navegador, o aviso pode voltar na próxima visita.",
        { preferencias: "Abrir preferências de cookies" },
      ],
    },
    {
      id: "outros-sites",
      titulo: "Links para outros sites",
      blocos: [
        "Os botões de WhatsApp, Google Maps e avaliações levam a serviços de terceiros, que têm políticas próprias de cookies e privacidade. Mais detalhes sobre dados pessoais estão na [Política de privacidade](/privacidade).",
      ],
    },
  ],
};

export const termos: PaginaLegal = {
  slug: "termos",
  titulo: "Termos de uso",
  curto: "Termos",
  descricao: "As condições para usar o site da Clínica Artus e as informações publicadas nele.",
  resumo: [
    "O conteúdo do site é informativo e não substitui a consulta médica.",
    "Uma consulta só está marcada depois da confirmação da recepção.",
    "Em urgência ou emergência, procure um pronto-socorro ou ligue 192.",
  ],
  secoes: [
    {
      id: "sobre",
      titulo: "Sobre estes termos",
      blocos: [
        "Estes termos explicam como usar o site. A [Política de privacidade](/privacidade) explica como os dados pessoais são tratados.",
      ],
    },
    {
      id: "finalidade",
      titulo: "Para que serve o site",
      blocos: [
        "O site apresenta a Clínica Artus Ortopedia, a equipe médica, as áreas de atuação, a estrutura da clínica e os canais de agendamento.",
      ],
    },
    {
      id: "informacao-medica",
      titulo: "Informação não substitui consulta",
      blocos: [
        "Os sinais, as formas de tratamento e as respostas às perguntas publicadas aqui têm caráter educativo. Só a consulta permite um diagnóstico e a indicação de um tratamento para o seu caso.",
        "Em caso de urgência ou emergência, procure um pronto-socorro ou ligue 192 (SAMU).",
      ],
    },
    {
      id: "agendamento",
      titulo: "Agendamento",
      blocos: [
        "O agendamento é feito pela recepção, por telefone ou WhatsApp, e depende dos horários disponíveis. Uma consulta só está marcada depois da confirmação da recepção. Valores, convênios e documentos necessários são informados no contato.",
      ],
    },
    {
      id: "avaliacoes",
      titulo: "Avaliações de pacientes",
      blocos: [
        "As avaliações exibidas foram publicadas por pacientes no perfil público da clínica no Google e aparecem na íntegra. Elas contam a experiência de cada pessoa e não indicam resultado de tratamento.",
      ],
    },
    {
      id: "propriedade",
      titulo: "Propriedade intelectual",
      blocos: [
        "O uso dos textos, fotos, ilustrações e marcas do site está sujeito à legislação de direitos autorais e de propriedade industrial.",
      ],
    },
    {
      id: "links",
      titulo: "Links para outros sites",
      blocos: [
        "O site tem links para serviços de terceiros, como WhatsApp e Google. A clínica não controla o conteúdo nem as práticas desses serviços.",
      ],
    },
    {
      id: "disponibilidade",
      titulo: "Disponibilidade e atualização",
      blocos: [
        "A clínica procura manter o site no ar e as informações atualizadas, mas o site pode ficar fora do ar ou ter alguma informação desatualizada. Na dúvida, confirme com a recepção.",
      ],
    },
    {
      id: "alteracoes",
      titulo: "Alterações e legislação",
      blocos: [
        "A data da última atualização aparece no topo desta página. Estes termos seguem a legislação brasileira.",
      ],
    },
    {
      id: "contato",
      titulo: "Contato",
      blocos: [contato],
    },
  ],
};

export const paginasLegais = [privacidade, cookies, termos] as const;
