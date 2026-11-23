/**
 * Avaliações públicas da Clínica Artus no Google, escolhidas a dedo e reproduzidas sem edição
 * (só nomes em caixa alta passaram para caixa normal). Critério (CFM 2.336/2023): falam de
 * atendimento, equipe e estrutura; nenhuma promete cura ou resultado nem usa superlativo sobre
 * tratamento. Fotos de perfil públicas do Google, salvas em public/assets/avaliacoes/.
 */
export type Avaliacao = { nome: string; texto: string; estrelas: number; foto: string };

export const avaliacoes: Avaliacao[] = [
  { nome: "Rita De Cassia Franca", texto: "Estamos muito satisfeitos com a Clinica. Bons médicos, o atendimento é ágil e eficaz, bem estruturada e confortável.", estrelas: 5, foto: "/assets/avaliacoes/avatar-01.webp" },
  { nome: "Matheus Ribeiro", texto: "Excelente profissionais, com excelente atendimento no local. Clínica bem localizada e com estacionamento próprio.", estrelas: 5, foto: "/assets/avaliacoes/avatar-02.webp" },
  { nome: "Claudia Regina Marciniak Ferreira", texto: "Uma clínica aonde tem uma equipe com um excelente atendimento e profissionais muito atenciosos e competentes. Estão de parabéns em todos aspectos.", estrelas: 5, foto: "/assets/avaliacoes/avatar-03.webp" },
  { nome: "Juliana Caram Guimaraes", texto: "Excelente atendimento, com equipe atenciosa e muito profissional. Ambiente organizado e acolhedor. Fui muito bem atendida do início ao fim. Recomendo!", estrelas: 5, foto: "/assets/avaliacoes/avatar-04.webp" },
  { nome: "Edny Damasceno", texto: "Excelente equipe, muito atenciosos.", estrelas: 5, foto: "/assets/avaliacoes/avatar-05.webp" },
  { nome: "Suzi Pompeu", texto: "Ótimo, desde a portaria muito bem atendida, vale a pena conferir! Médico muito atencioso e de grande competência.", estrelas: 5, foto: "/assets/avaliacoes/avatar-06.webp" },
  { nome: "Paulo Toshio Kato", texto: "Atendimento excepcional desde a recepção até a clinica Médica. Estacionamento amplo e seguro.", estrelas: 5, foto: "/assets/avaliacoes/avatar-07.webp" },
  { nome: "Luiz Bertin", texto: "Olá, ambiente humanizado, aonde fica mais leve os protocolos determinados aos pacientes, obrigado a todos.", estrelas: 5, foto: "/assets/avaliacoes/avatar-08.webp" },
  { nome: "Hideaki", texto: "Clínica bem estruturada, com ambiente limpo e agradável. A equipe médica é ótima.", estrelas: 5, foto: "/assets/avaliacoes/avatar-09.webp" },
  { nome: "Jose Miranda", texto: "Agendamento muito preciso célere e objetivo. Muita agilidade, recomendo", estrelas: 5, foto: "/assets/avaliacoes/avatar-10.webp" },
  { nome: "Damien Puertas", texto: "Atendimento humano e bem administrado, recomendo", estrelas: 5, foto: "/assets/avaliacoes/avatar-11.webp" },
  { nome: "Roberto Souto", texto: "Ágil, gentil e eficiente no agendamento.", estrelas: 5, foto: "/assets/avaliacoes/avatar-12.webp" },
];
