/** Canais da clínica, usados na página inicial, no rodapé e nas páginas internas. */
export const TELEFONE = "tel:+556533226689";
export const TELEFONE_TEXTO = "(65) 3322-6689";
export const MAPA = "https://www.google.com/maps/search/?api=1&query=Clinica%20Artus%20Ortopedia%20Cuiaba&query_place_id=ChIJpUtfAgCznZMRXrrjG1MNmHU";
export const MAPA_EMBED = "https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sCl%C3%ADnica+Artus+Ortopedia,+Av.+Egito+95,+Cuiab%C3%A1+MT!6i16";

/** Cada região leva ao perfil do especialista (o mesmo mapeamento da grade, dos chips e do rodapé). */
export const regioes = [
  { label: "Mão e punho", target: "cassio" },
  { label: "Joelho", target: "lucio" },
  { label: "Quadril", target: "renam" },
  { label: "Coluna", target: "andre" },
  { label: "Ombro e cotovelo", target: "valmir" },
  { label: "Pé e tornozelo", target: "ricardo" },
] as const;
