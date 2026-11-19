"use client";

import { useEffect, useRef, useState } from "react";
import { UsersRound } from "lucide-react";
import HoverCard from "@/components/ui/hover-card";
import { doctors } from "@/lib/doctors";

/** Scroll to the team section, then ask the gallery to open this doctor. */
function showResume(id: string) {
  // Aim at the gallery itself (below the section intro), clear of the fixed header.
  const team = document.querySelector(".hxs-gsap-flip-card") ?? document.querySelector("#equipe");
  if (!team) return;
  const top = team.getBoundingClientRect().top + window.scrollY - 100;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let sent = false;
  const send = () => {
    if (sent) return;
    sent = true;
    window.dispatchEvent(new CustomEvent("artus:doctor", { detail: id }));
  };
  if (reduced) {
    window.scrollTo({ top, behavior: "instant" });
    send();
    return;
  }
  // Open after the scroll lands so the flip is seen.
  if (window.artusLenis) {
    window.artusLenis.scrollTo(top, { duration: 1.1, onComplete: send });
    window.setTimeout(send, 2000);
    return;
  }
  window.addEventListener("scrollend", send, { once: true });
  window.setTimeout(send, 1200);
  window.scrollTo({ top, behavior: "smooth" });
}

export function TeamQuickCard() {
  const [active, setActive] = useState<string | null>(null);
  const portraits = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsidePress(event: PointerEvent) {
      if (event.target instanceof Node && !portraits.current?.contains(event.target)) {
        setActive(null);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div className="team-quick-card">
      <a className="team-quick-link" href="#equipe">
        <span className="quick-icon" aria-hidden="true"><UsersRound strokeWidth={1.7} /></span>
        <strong>Equipe médica</strong>
        <span className="quick-arrow" aria-hidden="true">↗</span>
      </a>
      <div ref={portraits} className="team-portraits" role="group" aria-label="Ortopedistas da Clínica Artus">
        {doctors.map((doctor) => (
          <HoverCard
            key={doctor.id}
            label={doctor.name}
            trigger={
              // The same optimized local portrait is reused in the team section.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={doctor.photo} alt="" width={44} height={44} />
            }
            open={active === doctor.id}
            onOpenChange={(open) => {
              if (open) setActive(doctor.id);
              else setActive((previous) => previous === doctor.id ? null : previous);
            }}
            onActivate={() => {
              setActive(null);
              showResume(doctor.id);
            }}
          >
            <strong>{doctor.name}</strong>
            <p className="hover-card-specialty">{doctor.specialty}</p>
            <p>CRM-MT {doctor.crm} · RQE {doctor.rqe}</p>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
