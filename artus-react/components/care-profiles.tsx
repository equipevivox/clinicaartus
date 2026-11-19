/* eslint-disable @next/next/no-img-element -- The photographs are optimized local WebPs. */
import { CareStackMotion } from "@/components/care-stack-motion";
import { AreaIcon } from "@/components/area-icon";
import { careProfiles } from "@/lib/care-profiles";

export function CareProfiles() {
  return (
    <section className="care-profiles" id="cuidados">
      <CareStackMotion />
      <div className="care-window">
        <div className="care-zone">
          <div className="container">
            {careProfiles.map((profile) => (
              <article className="care-profile" tabIndex={-1} id={`cuidado-${profile.id}`} key={profile.id} aria-labelledby={`nome-${profile.id}`}>
                <div className="care-panel">
                  <header className="care-heading" data-reveal>
                    <p className="care-area"><span className="area-icon"><AreaIcon area={profile.area} /></span>{profile.specialty}</p>
                    <h2 id={`nome-${profile.id}`}>{profile.name}</h2>
                  </header>
                  <img className="care-photo" src={`/assets/acao-${profile.id}.webp`} alt={profile.name} width={profile.width} height={profile.height} loading="lazy" decoding="async" />
                  <div className="care-copy">
                    <blockquote>{profile.quote}</blockquote>
                    <h3>Sinais para procurar avaliação</h3>
                    <ul>{profile.signs.map((sign) => <li key={sign}>{sign}</li>)}</ul>
                    <h3>Como ele trata</h3>
                    <p>{profile.treatment}</p>
                    <details><summary>{profile.question}</summary><p>{profile.answer}</p></details>
                    <a className="button button-primary" href="tel:+556533226689">Agendar consulta</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
