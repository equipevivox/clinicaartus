/* eslint-disable @next/next/no-img-element -- Reuse the optimized local photos and responsive picture sources. */
import Script from "next/script";
import { Building2, MapPin, PhoneCall } from "lucide-react";
import { TeamQuickCard } from "@/components/team-quick-card";
import { HeroPerspective } from "@/components/ui/container-scroll-animation";
import { TeamGallery } from "@/components/team-gallery";
import { CareProfiles } from "@/components/care-profiles";
import { AreaIcon } from "@/components/traco";
import VerticalMarqueeDemo from "@/components/ui/marquee-03";
import { avaliacoes } from "@/lib/avaliacoes";
import { SiteFooter } from "@/components/site-footer";
import { FAQ } from "@/components/ui/faq-tabs";
import { FAQ_SOBRE, FAQ_TITULO, temasFaq } from "@/lib/faq";
import { MAPA, TELEFONE, regioes } from "@/lib/contato";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { MENSAGEM_DUVIDA, linkWhatsApp } from "@/lib/whatsapp";

/** Abre direto o painel de avaliações da clínica na busca do Google. */
const AVALIACOES_GOOGLE = "https://www.google.com/search?q=clinica+artus#lrd=0x939db300025f4ba5:0x75980d531be3ba5e,1,,,,";

const specialties = [
  { area: "mao", title: "Mão e punho", description: "Atendimento para mão, dedos e punho.", portraits: ["cassio"], target: "cassio" },
  { area: "joelho", title: "Joelho", description: "Articulação do joelho.", portraits: ["lucio"], target: "lucio" },
  { area: "quadril", title: "Quadril", description: "Articulação do quadril e trauma ortopédico.", portraits: ["renam"], target: "renam" },
  { area: "coluna", title: "Coluna", description: "Coluna cervical, torácica e lombar.", portraits: ["andre"], target: "andre" },
  { area: "ombro", title: "Ombro e cotovelo", description: "Articulações do ombro e do cotovelo.", portraits: ["valmir", "luiz"], target: "valmir" },
  { area: "pe", title: "Pé e tornozelo", description: "Estruturas do pé e do tornozelo.", portraits: ["ricardo"], target: "ricardo" },
] as const;


export default function Home() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <header className="site-header">
        <div className="nav-shell">
          <a className="brand" href="#inicio" aria-label="Clínica Artus Ortopedia, início">
            <img src="/assets/logo-color.svg" alt="" width="445" height="163" />
            <img className="brand-light" src="/assets/logo.svg" alt="" width="445" height="163" />
          </a>
          <button className="menu-toggle" type="button" aria-controls="menu" aria-expanded="false" hidden>Menu <span className="menu-lines" aria-hidden="true"></span></button>
          <nav id="menu" aria-label="Navegação principal">
            <a href="#especialidades">Especialidades</a>
            <a href="#clinica">A clínica</a>
            <a href="#equipe">Equipe médica</a>
            <a href="#contato">Contato</a>
          </nav>
          {/* Celular: "Ligar" (nome acessível "Ligar para agendar"). Computador: "Ligar (65) 3322-6689". */}
          <a className="button button-header" href={TELEFONE}>
            <PhoneCall className="button-header-icon" strokeWidth={1.8} aria-hidden="true" />
            <span>
              Ligar<span className="sr-only"> para agendar</span>
              <span className="ligar-numero"><span className="sr-only">:</span> (65) 3322-6689</span>
            </span>
          </a>
        </div>
      </header>

      <main id="conteudo">
        <HeroPerspective>
          <section className="hero" aria-labelledby="titulo">
            <picture className="hero-image">
              <source media="(max-width: 760px)" srcSet="/assets/hero-clinica-mobile.webp" />
              <img src="/assets/hero-clinica.webp" alt="" fetchPriority="high" />
            </picture>
            <div className="container hero-copy">
              <p className="hero-location">Clínica Artus · Santa Rosa</p>
              <h1 id="titulo" tabIndex={-1}>Ortopedia especializada<br className="hero-break" /> em Cuiabá</h1>
              <p className="hero-description">Sete ortopedistas atendem em seis áreas. A recepção ajuda você a escolher o especialista e marcar a consulta.</p>
              <div className="hero-actions">
                <a className="button botao-whatsapp" href={linkWhatsApp()} target="_blank" rel="noopener">
                  <IconeWhatsApp className="icone-whatsapp" />
                  <span>Agendar pelo WhatsApp</span>
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
                <a className="button button-secondary button-ligar" href={TELEFONE}>
                  <PhoneCall className="button-icon" strokeWidth={1.8} aria-hidden="true" />
                  <span>Ligar para agendar</span>
                  <span className="ligar-numero-sec">(65) 3322-6689</span>
                </a>
              </div>
              <nav className="hero-regioes" aria-labelledby="regioes-titulo">
                <p className="hero-regioes-titulo" id="regioes-titulo">Onde dói ou incomoda?</p>
                <ul>
                  {regioes.map(({ label, target }) => (
                    <li key={target}><a href={`#cuidado-${target}`}>{label}</a></li>
                  ))}
                </ul>
              </nav>
            </div>
          </section>

          <div className="container quick-info">
            <div className="quick-inner">
              <TeamQuickCard />
              <a href="#clinica">
                <span className="quick-icon" aria-hidden="true"><Building2 strokeWidth={1.7} /></span>
                <strong>Conheça a clínica</strong><span className="quick-arrow" aria-hidden="true">↓</span>
              </a>
              <a href="#contato">
                <span className="quick-icon" aria-hidden="true"><MapPin strokeWidth={1.7} /></span>
                <span><strong>Onde estamos</strong><small>Av. Egito, 95</small></span><span className="quick-arrow" aria-hidden="true">↓</span>
              </a>
              <a className="quick-phone" href={TELEFONE}>
                <span className="quick-icon" aria-hidden="true"><PhoneCall strokeWidth={1.7} /></span>
                <span><strong>Ligar para a recepção</strong><small>(65) 3322-6689</small></span>
              </a>
            </div>
          </div>
        </HeroPerspective>

        <section className="section container" id="especialidades" aria-labelledby="areas-title">
          <div className="section-heading">
            <div><h2 id="areas-title" tabIndex={-1}>Especialidades</h2></div>
            <p>Encontre o ortopedista pela região do corpo que você precisa avaliar.</p>
          </div>
          <div className="area-grid">
            {specialties.map(({ area, title, description, portraits, target }) => (
              <a key={area} className="area-card" href={`#cuidado-${target}`}>
                <span className="area-icon"><AreaIcon area={area} /></span>
                <div className="area-copy"><h3>{title}</h3><p>{description}</p></div>
                <span className={portraits.length > 1 ? "area-preview area-preview-pair" : "area-preview"} aria-hidden="true">
                  {portraits.map(portrait => (
                    <img key={portrait} src={`/assets/${portrait}.webp`} alt="" loading="lazy" decoding="async" />
                  ))}
                </span>
              </a>
            ))}
          </div>
        </section>

        <CareProfiles />

        <section className="clinic section" id="clinica" aria-labelledby="clinic-title">
          <div className="container">
            <div className="section-heading">
              <div><h2 id="clinic-title" tabIndex={-1}>Por dentro da Artus</h2></div>
              <p>A Clínica Artus reúne diferentes áreas da ortopedia no mesmo endereço, no bairro Santa Rosa, em Cuiabá.</p>
            </div>
            <div className="clinic-gallery">
              <figure className="gallery-lead"><img src="/assets/fachada.webp" loading="lazy" alt="Jardim e fachada da Clínica Artus" /><figcaption>Fachada e jardim</figcaption></figure>
              <figure><img src="/assets/recepcao.webp" loading="lazy" alt="Poltronas da recepção ao lado do jardim" /><figcaption>Recepção</figcaption></figure>
              <figure><img src="/assets/consultorio.webp" loading="lazy" alt="Consultório com bancada e cadeiras azuis" /><figcaption>Consultório</figcaption></figure>
              <figure><img src="/assets/corredor.webp" loading="lazy" alt="Corredor iluminado por janelas que dão para o jardim" /><figcaption>Corredor interno</figcaption></figure>
              <figure><img src="/assets/espera.webp" loading="lazy" alt="Poltronas da sala de espera" /><figcaption>Sala de espera</figcaption></figure>
            </div>
            <a className="inline-link" href="#contato">Endereço e como chegar <span aria-hidden="true">↓</span></a>
          </div>
        </section>

        <section className="section container" id="equipe" aria-labelledby="team-title">
          <div className="team-intro">
            <div>
              <h2 id="team-title" tabIndex={-1}>Conheça os ortopedistas</h2>
              <p>Agende com a equipe pela central da Artus. Se tiver dúvidas sobre qual área procurar, a recepção pode orientar você.</p>
            </div>
            <img src="/assets/equipe-em-pe.webp" width={1440} height={851} loading="lazy" alt="Os sete ortopedistas da Clínica Artus reunidos em pé" />
          </div>
          <TeamGallery />
        </section>

        <section className="section reviews-section" id="avaliacoes" aria-labelledby="reviews-title">
          <div className="container">
            <div className="reviews-head">
              <div>
                <h2 id="reviews-title" tabIndex={-1}>Avaliações de pacientes</h2>
                <p>Relatos publicados por pacientes no perfil da Clínica Artus no Google, reproduzidos na íntegra.</p>
              </div>
              <a className="inline-link reviews-link" href={AVALIACOES_GOOGLE} target="_blank" rel="noopener">
                Ver todas as avaliações no Google<span className="sr-only"> (abre em nova aba)</span> <span aria-hidden="true">↗</span>
              </a>
            </div>
            <VerticalMarqueeDemo reviews={avaliacoes} />
          </div>
        </section>

        <FAQ
          title={FAQ_TITULO}
          subtitle={FAQ_SOBRE}
          temas={temasFaq}
          rodape={
            <p className="faq-ajuda">
              Não encontrou a sua dúvida?{" "}
              <a href={linkWhatsApp(MENSAGEM_DUVIDA)} target="_blank" rel="noopener">Fale com a recepção pelo WhatsApp<span className="sr-only"> (abre em nova aba)</span></a>
            </p>
          }
        />

        <section className="contact" id="contato" aria-labelledby="contact-title">
          <div className="contact-background" aria-hidden="true"></div>
          <div className="container contact-layout">
            <div className="contact-texto">
              <h2 id="contact-title" tabIndex={-1}>Agendamento e endereço</h2>
              <p>Ligue ou envie uma mensagem pelo WhatsApp para marcar uma consulta.</p>
            </div>
            <div className="contact-details">
              <a className="contato-whatsapp" href={linkWhatsApp()} target="_blank" rel="noopener">
                <span><small>WhatsApp · (65) 3322-6689<span className="sr-only"> (abre em nova aba)</span></small><strong>Agendar por mensagem</strong></span>
                <span className="card-arrow" aria-hidden="true"><IconeWhatsApp className="icone-whatsapp" /></span>
              </a>
              <a href={TELEFONE}>
                <span><small>Ligar para a recepção</small><strong>(65) 3322-6689</strong></span>
                <span className="card-arrow" aria-hidden="true"><PhoneCall strokeWidth={1.8} /></span>
              </a>
              <a href={MAPA} target="_blank" rel="noopener">
                <span><small>Abrir no Google Maps<span className="sr-only"> (abre em nova aba)</span></small><strong>Av. Egito, 95</strong><span>Santa Rosa · Cuiabá, MT</span></span>
                <span className="card-arrow" aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter mapa />
      <Script src="/home.js" strategy="afterInteractive" />
    </>
  );
}
