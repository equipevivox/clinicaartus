/* eslint-disable @next/next/no-img-element -- Reuse the optimized local photos and responsive picture sources. */
import Script from "next/script";
import { Building2, MapPin, PhoneCall } from "lucide-react";
import { TeamQuickCard } from "@/components/team-quick-card";
import { ContainerScroll, HeroPerspective } from "@/components/ui/container-scroll-animation";
import { TeamGallery } from "@/components/team-gallery";
import { CareProfiles } from "@/components/care-profiles";
import { AreaIcon } from "@/components/area-icon";
import TestimonialMarquee from "@/components/ui/marquee-01";
import { googleReviews } from "@/lib/google-reviews";

const specialties = [
  { area: "mao", title: "Mão", description: "Mão, dedos e punho.", portraits: ["cassio"], target: "cassio" },
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
          <a className="button button-header" href="tel:+556533226689">Agendar consulta <span aria-hidden="true">↗</span></a>
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
              <h1 id="titulo">Ortopedia especializada<br className="hero-break" /> em Cuiabá</h1>
              <p className="hero-description">Sete ortopedistas atendem em seis áreas. A recepção ajuda você a escolher o especialista e marcar a consulta.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="tel:+556533226689">Agendar consulta <span aria-hidden="true">↗</span></a>
                <a className="button button-secondary" href="#especialidades">Explorar especialidades <span aria-hidden="true">↓</span></a>
              </div>
            </div>
          </section>

          <div className="container quick-info">
            <div className="quick-inner">
              <TeamQuickCard />
              <a href="#clinica">
                <span className="quick-icon" aria-hidden="true"><Building2 strokeWidth={1.7} /></span>
                <strong>Conheça a clínica</strong><span className="quick-arrow" aria-hidden="true">↗</span>
              </a>
              <a href="#contato">
                <span className="quick-icon" aria-hidden="true"><MapPin strokeWidth={1.7} /></span>
                <span><strong>Onde estamos</strong><small>Av. Egito, 95</small></span><span className="quick-arrow" aria-hidden="true">↗</span>
              </a>
              <a className="quick-phone" href="tel:+556533226689">
                <span className="quick-icon" aria-hidden="true"><PhoneCall strokeWidth={1.7} /></span>
                <span><strong>Fale com a recepção</strong><small>(65) 3322-6689</small></span>
                <span className="quick-arrow" aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </HeroPerspective>

        <section className="section container" id="especialidades" aria-labelledby="areas-title">
          <div className="section-heading" data-reveal>
            <div><h2 id="areas-title">Especialidades</h2></div>
            <p>Encontre o ortopedista pela região do corpo que você precisa avaliar.</p>
          </div>
          <div className="area-grid">
            {specialties.map(({ area, title, description, portraits, target }) => (
              <a key={area} className="area-card" data-reveal href={`#cuidado-${target}`}>
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

        <section className="clinic" id="clinica" aria-labelledby="clinic-title">
          <div className="container">
            <ContainerScroll
              titleComponent={(
                <div className="section-heading" data-reveal>
                  <div><p className="eyebrow">A estrutura</p><h2 id="clinic-title">Por dentro da Artus</h2></div>
                  <p>A Clínica Artus reúne diferentes áreas da ortopedia no mesmo endereço, no bairro Santa Rosa, em Cuiabá.</p>
                </div>
              )}
            >
              <div className="clinic-gallery-stage">
                <div className="clinic-gallery">
                  <figure className="gallery-lead" data-reveal="gallery"><img src="/assets/fachada.webp" loading="lazy" alt="Jardim e fachada da Clínica Artus" /><figcaption>Fachada e jardim</figcaption></figure>
                  <figure data-reveal="gallery"><img src="/assets/recepcao.webp" loading="lazy" alt="Poltronas da recepção ao lado do jardim" /><figcaption>Recepção</figcaption></figure>
                  <figure data-reveal="gallery"><img src="/assets/consultorio.webp" loading="lazy" alt="Consultório com bancada e cadeiras azuis" /><figcaption>Consultório</figcaption></figure>
                  <figure data-reveal="gallery"><img src="/assets/corredor.webp" loading="lazy" alt="Corredor iluminado por janelas que dão para o jardim" /><figcaption>Corredor interno</figcaption></figure>
                  <figure data-reveal="gallery"><img src="/assets/espera.webp" loading="lazy" alt="Poltronas da sala de espera" /><figcaption>Sala de espera</figcaption></figure>
                </div>
              </div>
            </ContainerScroll>
            <a className="inline-link" href="#contato">Endereço e como chegar <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="section container" id="equipe" aria-labelledby="team-title">
          <div className="team-intro">
            <div data-reveal>
              <p className="eyebrow">Equipe médica</p>
              <h2 id="team-title" tabIndex={-1}>Conheça os ortopedistas</h2>
              <p>Agende com a equipe pela central da Artus. Se tiver dúvidas sobre qual área procurar, a recepção pode orientar você.</p>
            </div>
            <img data-reveal src="/assets/equipe-em-pe.webp" width={1440} height={851} loading="lazy" alt="Os sete ortopedistas da Clínica Artus reunidos em pé" />
          </div>
          <TeamGallery />
        </section>

        <TestimonialMarquee reviews={googleReviews} />

        <section className="contact" id="contato" aria-labelledby="contact-title">
          <div className="contact-background" aria-hidden="true"></div>
          <div className="container contact-layout">
            <div data-reveal>
              <h2 id="contact-title">Agende sua consulta</h2>
              <p>Entre em contato com a recepção da Clínica Artus.</p>
            </div>
            <div className="contact-details">
              <a data-reveal href="tel:+556533226689"><span><small>Central de atendimento</small><strong>(65) 3322-6689</strong></span><span className="card-arrow" aria-hidden="true">↗</span></a>
              <a data-reveal href="https://www.google.com/maps/search/?api=1&amp;query=Clinica%20Artus%20Ortopedia%20Cuiaba&amp;query_place_id=ChIJpUtfAgCznZMRXrrjG1MNmHU"><span><small>Ver no mapa</small><strong>Av. Egito, 95</strong><span>Santa Rosa · Cuiabá, MT</span></span><span className="card-arrow" aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-layout">
            <div className="footer-brand" data-reveal>
              <a className="brand" href="#inicio" aria-label="Clínica Artus Ortopedia, início"><img src="/assets/logo.svg" alt="" width="445" height="163" /></a>
              <p>Ortopedia em Cuiabá, com sete médicos e seis áreas de atuação.</p>
            </div>
            <nav className="footer-group" aria-labelledby="footer-nav-title" data-reveal>
              <h2 id="footer-nav-title">A clínica</h2>
              <ul>
                <li><a href="#clinica">Estrutura</a></li>
                <li><a href="#equipe">Equipe médica</a></li>
                <li><a href="#especialidades">Especialidades</a></li>
                <li><a href="#contato">Contato e localização</a></li>
              </ul>
            </nav>
            <nav className="footer-group" aria-labelledby="footer-areas-title" data-reveal>
              <h2 id="footer-areas-title">Áreas de atuação</h2>
              <ul>
                <li><a href="#equipe" data-area="mao">Mão</a></li>
                <li><a href="#equipe" data-area="joelho">Joelho</a></li>
                <li><a href="#equipe" data-area="quadril">Quadril</a></li>
                <li><a href="#equipe" data-area="coluna">Coluna</a></li>
                <li><a href="#equipe" data-area="ombro">Ombro e cotovelo</a></li>
                <li><a href="#equipe" data-area="pe">Pé e tornozelo</a></li>
              </ul>
            </nav>
            <div className="footer-group" data-reveal>
              <h2>Central de atendimento</h2>
              <address>
                Av. Egito, 95 · Santa Rosa<br />
                Cuiabá, MT
              </address>
              <a className="footer-phone" href="tel:+556533226689">(65) 3322-6689</a>
              <a className="footer-map" href="https://www.google.com/maps/search/?api=1&amp;query=Clinica%20Artus%20Ortopedia%20Cuiaba&amp;query_place_id=ChIJpUtfAgCznZMRXrrjG1MNmHU">Traçar rota <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="footer-map-panel" data-reveal>
            <iframe title="Google Maps — localização da Clínica Artus" src="https://www.google.com/maps/embed?origin=mfe&amp;pb=!1m3!2m1!1sCl%C3%ADnica+Artus+Ortopedia,+Av.+Egito+95,+Cuiab%C3%A1+MT!6i16" width="1152" height="248" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          </div>
          <div className="footer-bottom">
            <p>Clínica Artus Ortopedia</p>
            <a className="inline-link" href="#inicio">Voltar ao topo <span aria-hidden="true">↑</span></a>
          </div>
        </div>
      </footer>
      <Script src="/home.js" strategy="afterInteractive" />
    </>
  );
}
