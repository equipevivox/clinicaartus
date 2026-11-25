/* eslint-disable @next/next/no-img-element -- Logos em SVG, já otimizados. */
/* eslint-disable @next/next/no-html-link-for-pages -- /artigos com carga completa, para o artigos.js rodar. */
import { MapPin, PhoneCall } from "lucide-react";
import { MAPA, MAPA_EMBED, TELEFONE, regioes } from "@/lib/contato";

/**
 * Rodapé de todas as páginas. Na página inicial os links apontam para as seções (#equipe); nas
 * internas, para a inicial (/#equipe). O mapa do Google só existe na inicial e só carrega com
 * permissão: até lá fica o aviso, e quem liga o iframe é o public/site.js.
 */
export function SiteFooter({ inicio = "", mapa = false }: { inicio?: string; mapa?: boolean }) {
  const ir = (ancora: string) => `${inicio}#${ancora}`;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-layout">
          <div className="footer-brand">
            <a className="brand" href={inicio || "#inicio"} aria-label="Clínica Artus Ortopedia, início"><img src="/assets/logo.svg" alt="" width="445" height="163" /></a>
            <p>Ortopedia em Cuiabá, com sete médicos e seis áreas de atuação.</p>
          </div>
          <nav className="footer-group" aria-labelledby="footer-nav-title">
            <h2 id="footer-nav-title">A clínica</h2>
            <ul>
              <li><a href={ir("clinica")}>Estrutura</a></li>
              <li><a href={ir("equipe")}>Equipe médica</a></li>
              <li><a href={ir("especialidades")}>Especialidades</a></li>
              <li><a href="/artigos">Artigos</a></li>
              <li><a href={ir("perguntas")}>Perguntas frequentes</a></li>
              <li><a href={ir("contato")}>Agendamento e endereço</a></li>
            </ul>
          </nav>
          <nav className="footer-group" aria-labelledby="footer-areas-title">
            <h2 id="footer-areas-title">Áreas de atuação</h2>
            <ul>
              {regioes.map(({ label, target }) => (
                <li key={target}><a href={ir(`cuidado-${target}`)}>{label}</a></li>
              ))}
            </ul>
          </nav>
          <div className="footer-group">
            <h2>Central de atendimento</h2>
            <address>
              Av. Egito, 95 · Santa Rosa<br />
              Cuiabá, MT
            </address>
            <a className="footer-phone" href={TELEFONE}>
              <PhoneCall className="footer-phone-icone" strokeWidth={1.8} aria-hidden="true" />
              <span>Ligar para a recepção <strong>(65) 3322-6689</strong></span>
            </a>
            <a className="footer-map" href={MAPA} target="_blank" rel="noopener">Abrir no Google Maps<span className="sr-only"> (abre em nova aba)</span> <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        {mapa && (
          <div className="footer-map-panel" data-mapa>
            <iframe title="Google Maps — localização da Clínica Artus" data-src={MAPA_EMBED} width="1152" height="248" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen hidden></iframe>
            <div className="mapa-aviso">
              <span className="mapa-pino" aria-hidden="true"><MapPin strokeWidth={1.8} /></span>
              <p><strong>Mapa do Google</strong>O Google pode usar cookies quando o mapa é carregado. Se você permitir, o site guarda essa escolha neste navegador.</p>
              <div className="mapa-acoes">
                <button type="button" className="mapa-permitir" data-permitir-mapa>Permitir e mostrar mapa</button>
                <a className="mapa-externo" href={MAPA} target="_blank" rel="noopener">Abrir no Google Maps<span className="sr-only"> (abre em nova aba)</span> <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </div>
        )}
        <div className="footer-bottom">
          <div className="footer-legal">
            <p>© 2026 Clínica Artus Ortopedia</p>
            <nav className="footer-docs" aria-label="Privacidade e termos">
              <a href="/privacidade" data-doc="privacidade">Política de privacidade</a>
              <a href="/cookies" data-doc="cookies">Política de cookies</a>
              <a href="/termos" data-doc="termos">Termos de uso</a>
              <button type="button" data-abrir-cookies>Preferências de cookies</button>
            </nav>
          </div>
          <div className="footer-assinatura">
            <a className="inline-link" href="#inicio">Voltar ao topo <span aria-hidden="true">↑</span></a>
            <p className="feito-por">Feita pela <img src="/assets/vivox.svg" alt="VIVOX" width="472" height="117" /></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
