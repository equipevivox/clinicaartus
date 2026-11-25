/* eslint-disable @next/next/no-img-element -- Reuse the optimized local photos and responsive picture sources. */
import Script from "next/script";
import { ArtigosSecao } from "@/components/artigos-secao";
import { Activity, Building2, MapPin, PhoneCall, Users } from "lucide-react";
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
import { WhatsappFlutuante } from "@/components/whatsapp-flutuante";

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
            {/* Ícones iguais aos do index.html (lucide, traço fino e discreto). */}
            <a href="#especialidades"><Activity className="nav-icone" aria-hidden="true" />Especialidades</a>
            <a href="#clinica"><Building2 className="nav-icone" aria-hidden="true" />A clínica</a>
            <a href="#equipe"><Users className="nav-icone" aria-hidden="true" />Equipe médica</a>
            <a href="#contato"><MapPin className="nav-icone" aria-hidden="true" />Contato</a>
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
      <WhatsappFlutuante />

      <main id="conteudo">
        <HeroPerspective>
          <section className="hero" aria-labelledby="titulo">
            <video className="hero-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true" tabIndex={-1}><source media="(max-width: 760px)" src="/assets/video/hero-clinica-mobile.mp4" type="video/mp4" /><source src="/assets/video/hero-clinica.mp4" type="video/mp4" /></video>
            <button className="hero-pausa" type="button" aria-pressed="false" aria-label="Pausar o vídeo de fundo" hidden><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path className="hero-pausa-pausar" d="M8 5h3v14H8zM13 5h3v14h-3z" /><path className="hero-pausa-tocar" d="M8 5.5v13l10.5-6.5z" /></svg></button>
            <div className="container hero-copy">
              <p className="hero-location">Clínica Artus Ortopedia · Santa Rosa</p>
              <h1 id="titulo" tabIndex={-1}>Ortopedia especializada<br className="hero-break" /> em Cuiabá</h1>
              <p className="hero-description">Na Clínica Artus, sete especialistas em Ortopedia e Traumatologia atendem em seis áreas. A recepção ajuda você a encontrar o especialista e marcar a consulta.</p>
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
          <div className="filme" data-filme="">
            <div className="filme-quadro">
              <video preload="metadata" playsInline poster="/assets/video/artus-institucional-capa.webp" aria-label="Vídeo institucional da Clínica Artus, com legendas">
                <source src="/assets/video/artus-institucional-720.mp4" type="video/mp4" media="(max-width: 760px)" />
                <source src="/assets/video/artus-institucional.mp4" type="video/mp4" />
              </video>
              <video className="filme-previa" muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} poster="/assets/video/artus-institucional-capa.webp"><source src="/assets/video/artus-previa.mp4" type="video/mp4" /></video>
              <button className="filme-capa" type="button" aria-label="Assistir ao vídeo da Clínica Artus">
                <span className="filme-capa-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8.7 7v10l8.2-5z" /></svg></span>
              </button>
              <span className="filme-espera" aria-hidden="true"></span>
              <div className="filme-controles">
                <button className="filme-botao filme-tocar" type="button" aria-label="Reproduzir">
                  <svg className="i-play" viewBox="0 0 24 24" aria-hidden="true"><path className="cheio" d="M7 4.5v15l12.5-7.5z"/></svg>
                  <svg className="i-pausa" viewBox="0 0 24 24" aria-hidden="true"><rect className="cheio" x="6" y="4.5" width="4" height="15" rx="1.2"/><rect className="cheio" x="14" y="4.5" width="4" height="15" rx="1.2"/></svg>
                </button>
                <div className="filme-linha" role="slider" tabIndex={0} aria-label="Linha do tempo do vídeo" aria-valuemin={0} aria-valuemax={31} aria-valuenow={0} aria-valuetext="0:00 de 0:31">
                  <span className="filme-trilho"><span className="filme-carregado"></span><span className="filme-progresso"></span></span>
                  <span className="filme-cabeca"></span>
                  <span className="filme-dica" aria-hidden="true">0:00</span>
                </div>
                <span className="filme-tempo" aria-hidden="true"><span data-atual="">0:00</span> / <span data-total="">0:31</span></span>
                <button className="filme-botao filme-som" type="button" aria-label="Desativar som">
                  <svg className="i-som" viewBox="0 0 24 24" aria-hidden="true"><path className="cheio" d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.8 5.2a9.5 9.5 0 0 1 0 13.6"/></svg>
                  <svg className="i-mudo" viewBox="0 0 24 24" aria-hidden="true"><path className="cheio" d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 6 6M22 9l-6 6"/></svg>
                </button>
                <button className="filme-botao filme-tela" type="button" aria-label="Tela cheia">
                  <svg className="i-cheia" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>
                  <svg className="i-sair" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>
                </button>
              </div>
            </div>
          </div>
            <div className="clinic-gallery">
              <figure className="gallery-lead"><img src="/assets/fachada.webp" loading="lazy" alt="Jardim e fachada da Clínica Artus" /><figcaption>Fachada e jardim</figcaption></figure>
              <figure><img src="/assets/recepcao.webp" loading="lazy" alt="Poltronas junto à parede de vidro, com vista para o jardim interno" /><figcaption>Espera junto ao jardim</figcaption></figure>
              <figure><img src="/assets/consultorio.webp" loading="lazy" alt="Balcão de mármore da recepção, com cadeiras verde-petróleo" /><figcaption>Recepção</figcaption></figure>
              <figure><img src="/assets/consultorio-sala.webp" loading="lazy" alt="Consultório com mesa de tampo claro, cadeira do médico e poltrona azul para o paciente" /><figcaption>Consultório</figcaption></figure>
              <figure><img src="/assets/espera.webp" loading="lazy" alt="Poltronas da sala de espera" /><figcaption>Sala de espera</figcaption></figure>
            </div>
            <a className="inline-link" href="#contato">Endereço e como chegar <span aria-hidden="true">↓</span></a>
          </div>
        </section>

        <section className="section team-section" id="equipe" aria-labelledby="team-title">
          <div className="team-hero">
            <picture className="team-hero-foto">
              <source media="(max-width: 760px)" srcSet="/assets/equipe-mobile.webp" width={980} height={1100} />
              <img src="/assets/equipe-desktop.webp" srcSet="/assets/equipe-desktop-1280.webp 1280w, /assets/equipe-desktop.webp 1920w" sizes="(max-width: 760px) 100vw, 64vw" width={1920} height={900} loading="lazy" alt="Os sete especialistas da Clínica Artus reunidos em pé" />
            </picture>
            <div className="team-hero-texto">
              <h2 id="team-title" tabIndex={-1}>Os especialistas da Clínica Artus</h2>
              <p>Conheça a formação e a área de atuação de cada médico. Para agendar uma consulta, fale com a recepção da Artus.</p>
            </div>
          </div>
          <div className="container team-cards">
            <TeamGallery />
          </div>
        </section>

        <ArtigosSecao />

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
                <span className="card-arrow" aria-hidden="true"><MapPin strokeWidth={1.8} /></span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter mapa />
      <Script src="/home.js" strategy="afterInteractive" />
      <Script src="/artigos.js" strategy="afterInteractive" />
      <Script src="/video-player.js" strategy="afterInteractive" />
    </>
  );
}
