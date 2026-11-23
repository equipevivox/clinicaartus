/* eslint-disable @next/next/no-img-element -- The same optimized local portraits are reused in the team section. */
import { UsersRound } from "lucide-react";
import { doctors } from "@/lib/doctors";

/**
 * Atalho "Equipe médica" da barra do hero. Os retratos são só uma prévia (decorativa, fora do
 * Tab): o único alvo é o link inteiro, com 44px ou mais. Com o mouse, cada retrato cresce e mostra
 * nome e área (só visual, no CSS).
 */
export function TeamQuickCard() {
  return (
    <div className="team-quick-card">
      <a className="team-quick-link" href="#equipe">
        <span className="team-quick-linha">
          <span className="quick-icon" aria-hidden="true"><UsersRound strokeWidth={1.7} /></span>
          <strong>Equipe médica</strong>
          <span className="quick-arrow" aria-hidden="true">↓</span>
        </span>
        <span className="team-portraits" aria-hidden="true">
          {doctors.map((doctor) => (
            <span className="team-avatar" key={doctor.id}>
              <img src={doctor.photo} alt="" width={44} height={44} />
              <span className="team-avatar-dica"><strong>{doctor.name}</strong><span>{doctor.specialty}</span></span>
            </span>
          ))}
        </span>
      </a>
    </div>
  );
}
