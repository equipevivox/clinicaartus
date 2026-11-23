/* eslint-disable @next/next/no-img-element -- The photographs are optimized local WebPs. */
import { PhoneCall } from "lucide-react";
import { CareSelector } from "@/components/care-selector";
import { AreaIcon } from "@/components/traco";
import { careProfiles } from "@/lib/care-profiles";
import { doctors } from "@/lib/doctors";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { linkWhatsApp, mensagemPara } from "@/lib/whatsapp";

/** Um nome por médico no site inteiro: o mesmo da equipe (lib/doctors.ts). */
const nomeDe = (id: string) => doctors.find((d) => d.id === id)?.name ?? id;

/** Radiografia ilustrativa de cada perfil (geradas pelo Codex; textos dele, como ilustração, CFM). */
const raioX: Record<string, { arquivo: string; alt: string }> = {
  cassio: { arquivo: "mao", alt: "Radiografia ilustrativa da mão e do punho, vista de frente" },
  lucio: { arquivo: "joelho", alt: "Radiografia ilustrativa do joelho, vista de frente" },
  renam: { arquivo: "quadril", alt: "Radiografia ilustrativa da pelve com os dois quadris, vista de frente" },
  andre: { arquivo: "coluna", alt: "Radiografia ilustrativa da coluna lombar, vista de lado" },
  valmir: { arquivo: "ombro", alt: "Radiografia ilustrativa do ombro, vista de frente" },
  luiz: { arquivo: "cotovelo", alt: "Radiografia ilustrativa do cotovelo dobrado, vista de lado" },
  ricardo: { arquivo: "pe", alt: "Radiografia ilustrativa do pé e do tornozelo, vista de lado" },
};

/*
 * Roda logo depois da seção, antes da pintura e da hidratação: escolhe o perfil inicial
 * (o do #cuidado-x da URL, ou o primeiro) e esconde os outros. Sem JavaScript, nada disso
 * acontece e os sete perfis aparecem em sequência, sem nenhum marcado como atual. Os elementos
 * que este script altera aceitam a diferença na hidratação (suppressHydrationWarning).
 *
 * Se os arquivos do Next não carregarem, este script segura sozinho a escolha por hash
 * (links do índice, chips, rodapé, voltar/avançar) até o CareSelector assumir; quando ele
 * monta, marca window.__artusSeletor e este ouvinte para de agir.
 */
const PERFIL_INICIAL = `(function () {
  var secao = document.getElementById("cuidados");
  if (!secao) return;
  var perfis = secao.querySelectorAll(".care-profile");
  var links = secao.querySelectorAll(".care-index a[data-perfil]");
  var ids = [];
  perfis.forEach(function (p) { ids.push(p.getAttribute("data-perfil")); });
  function pedido() { return location.hash.indexOf("#cuidado-") === 0 ? location.hash.slice(9) : ""; }
  function aplicar(ativo) {
    secao.setAttribute("data-ativo", ativo);
    perfis.forEach(function (p) { p.hidden = p.getAttribute("data-perfil") !== ativo; });
    links.forEach(function (a) {
      if (a.getAttribute("data-perfil") === ativo) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  // Sem o home.js o menu não recolhe e o cabeçalho fixo fica alto: desconta a altura real.
  function alinhar(id) {
    var alvo = document.getElementById("cuidado-" + id);
    if (!alvo) return;
    var cab = document.querySelector(".site-header");
    var pos = cab ? getComputedStyle(cab).position : "";
    var fim = pos === "fixed" || pos === "sticky" ? Math.max(0, cab.getBoundingClientRect().bottom) + 8 : 0;
    window.scrollTo(0, Math.max(0, alvo.getBoundingClientRect().top + window.scrollY - fim));
  }
  var inicial = pedido();
  aplicar(ids.indexOf(inicial) >= 0 ? inicial : ids[0]);
  // Chegada direta por #cuidado-x: se o seletor não assumir até a carga, alinha aqui (depois do
  // posicionamento nativo), a menos que a pessoa já tenha começado a rolar.
  if (ids.indexOf(inicial) >= 0) {
    window.addEventListener("load", function () {
      requestAnimationFrame(function () {
        if (!window.__artusSeletor && !window.__artusInteragiu && pedido() === inicial) alinhar(inicial);
      });
    }, { once: true });
  }
  window.addEventListener("hashchange", function () {
    if (window.__artusSeletor) return;
    var id = pedido();
    if (ids.indexOf(id) >= 0) {
      aplicar(id);
      alinhar(id);
    } else if (!location.hash) {
      aplicar(ids[0]);
    }
  });
})();`;

export function CareProfiles() {
  return (
    <section className="care-profiles" id="cuidados" aria-labelledby="perfis-titulo" suppressHydrationWarning>
      <CareSelector />
      <div className="container care-layout">
        <h2 className="care-titulo" id="perfis-titulo" tabIndex={-1}>Perfis dos ortopedistas</h2>
        <aside className="care-aside">
          <nav className="care-index" aria-label="Escolher ortopedista" data-lenis-prevent>
            <ol>
              {careProfiles.map((profile) => (
                <li key={profile.id}>
                  <a
                    href={`#cuidado-${profile.id}`}
                    data-perfil={profile.id}
                    suppressHydrationWarning
                  >
                    <span className="care-index-area">{profile.specialty}</span>
                    <span className="care-index-nome">{nomeDe(profile.id)}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <a className="care-saida" href="#contato">Agendamento e endereço <span aria-hidden="true">↓</span></a>
        </aside>
        <div className="care-zone">
          {careProfiles.map((profile) => {
            const nome = nomeDe(profile.id);
            return (
              <article
                className="care-profile"
                id={`cuidado-${profile.id}`}
                data-perfil={profile.id}
                key={profile.id}
                aria-labelledby={`nome-${profile.id}`}
                suppressHydrationWarning
              >
                <div className="care-panel">
                  <header className="care-heading">
                    <p className="care-area"><span className="area-icon"><AreaIcon area={profile.area} /></span>{profile.specialty}</p>
                    <h3 id={`nome-${profile.id}`} tabIndex={-1}>{nome}</h3>
                  </header>
                  <div className="care-media">
                    <img className="care-photo" src={`/assets/acao-${profile.id}.webp`} alt={nome} width={profile.width} height={profile.height} loading="lazy" decoding="async" />
                    <figure className="care-xray">
                      <img src={`/assets/raio-x/raio-x-${raioX[profile.id].arquivo}.webp`} alt={raioX[profile.id].alt} width={960} height={720} loading="lazy" decoding="async" />
                    </figure>
                  </div>
                  <div className="care-copy">
                    <blockquote>{profile.quote}</blockquote>
                    <h4>Sinais para procurar avaliação</h4>
                    <ul>{profile.signs.map((sign) => <li key={sign}>{sign}</li>)}</ul>
                    <h4>Como ele trata</h4>
                    <p>{profile.treatment}</p>
                    <details><summary>{profile.question}</summary><p>{profile.answer}</p></details>
                    <div className="care-acoes">
                      <a className="botao-whatsapp" href={linkWhatsApp(mensagemPara(nome))} target="_blank" rel="noopener" aria-label={`Agendar pelo WhatsApp com ${nome} (abre em nova aba)`}>
                        <IconeWhatsApp className="icone-whatsapp" />
                        <span>Agendar pelo WhatsApp</span>
                      </a>
                      <a className="care-agendar" href="tel:+556533226689" aria-label={`Ligar para agendar consulta com ${nome} pelo (65) 3322-6689`}>
                        <PhoneCall className="care-agendar-icone" strokeWidth={1.8} aria-hidden="true" />
                        <span>Ligar para agendar</span>
                        <span className="care-agendar-numero">(65) 3322-6689</span>
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: PERFIL_INICIAL }} />
    </section>
  );
}
