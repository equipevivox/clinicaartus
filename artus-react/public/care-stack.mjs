// One pinned section. The timeline uses one unit per profile, including its reading pause.
export function mountCareStack(section, gsap, ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const cards = Array.from(section.querySelectorAll(".care-profile"));
  const panels = cards.map(card => card.querySelector(".care-panel"));
  const header = document.querySelector(".site-header");
  const media = gsap.matchMedia();

  media.add("(prefers-reduced-motion: no-preference) and ((min-width: 761px) or (min-height: 700px))", () => {
    section.classList.add("care-deck");
    // Give native hash navigation a stable destination on the scroll track.
    const markers = cards.map((card, index) => {
      const marker = document.createElement("span");
      marker.className = "care-hash";
      marker.style.top = "calc(" + (index + .16) + " * 100svh + var(--care-anchor-inset))";
      marker.setAttribute("aria-hidden", "true");
      marker.id = card.id;
      card.removeAttribute("id");
      section.appendChild(marker);
      return marker;
    });
    const viewport = section.querySelector(".care-window");
    section.style.setProperty("--care-screens", cards.length + 1);
    function measure() {
      const inset = Math.max(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0,
        header.querySelector(".nav-shell").offsetHeight + parseFloat(getComputedStyle(header).top) + 16);
      section.style.setProperty("--care-inset", inset + "px");
      section.style.setProperty("--care-anchor-inset", getComputedStyle(document.documentElement).scrollPaddingTop);
      section.classList.add("care-measuring");
      const tallest = Math.max(...panels.map(panel => panel.offsetHeight));
      section.style.setProperty("--care-height", tallest + "px");
      section.classList.remove("care-measuring");
    }
    measure();

    const transition = .60;
    let previousActive = -1;
    function showCards(time) {
      const settled = Math.min(cards.length - 1, Math.floor(time));
      const progress = time - settled;
      const incoming = progress > 1 - transition ? settled + 1 : -1;
      const active = incoming < cards.length && progress > 1 - transition / 2 ? incoming : settled;
      cards.forEach((card, index) => {
        const visible = index === settled || index === incoming;
        card.style.visibility = visible ? "visible" : "hidden";
        card.inert = !visible;
      });
      if (previousActive !== active && section.contains(document.activeElement)) {
        cards[active].focus({ preventScroll: true });
      }
      previousActive = active;
    }
    gsap.set(cards.slice(1), { yPercent: 100 });
    const timeline = gsap.timeline({ paused: true, onUpdate() { showCards(this.time()); } });
    cards.slice(1).forEach((card, index) => {
      timeline.to(card, { yPercent: 0, duration: transition, ease: "none" }, index + 1 - transition);
    });
    // Hold the final card before normal page scrolling resumes.
    timeline.to({}, { duration: 1 }, cards.length - 1);
    showCards(0);
    const trigger = ScrollTrigger.create({
      trigger: section,
      pin: viewport,
      pinSpacing: false,
      animation: timeline,
      scrub: true,
      start: "top top",
      end: "bottom bottom",
      onRefreshInit: measure,
    });

    function goToCard(index, focus = false) {
      const time = index + .16;
      const top = trigger.start + (trigger.end - trigger.start) * time / cards.length;
      if (window.artusLenis) {
        window.artusLenis.resize();
        window.artusLenis.scrollTo(top, { immediate: true, force: true });
      }
      else window.scrollTo({ top, behavior: "instant" });
      ScrollTrigger.update();
      if (focus) cards[index].focus({ preventScroll: true });
    }
    function hashIndex() {
      return markers.findIndex(marker => "#" + marker.id === location.hash);
    }
    const navigateHash = () => {
      const index = hashIndex();
      if (index >= 0) goToCard(index);
    };
    function jumpFromLink(event) {
      const link = event.target.closest?.("a[href^='#cuidado-']");
      if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      const index = markers.findIndex(marker => "#" + marker.id === link.hash);
      if (index < 0) return;
      event.preventDefault();
      event.stopPropagation();
      if (location.hash !== link.hash) history.pushState(null, "", link.hash);
      goToCard(index, true);
    }
    function tabBetweenCards(event) {
      if (event.key !== "Tab") return;
      const index = cards.findIndex(card => card.contains(event.target));
      if (index < 0) return;
      const links = cards[index].querySelectorAll("summary, a[href]");
      if (!event.shiftKey && event.target === links[links.length - 1] && index < cards.length - 1) {
        event.preventDefault();
        goToCard(index + 1, true);
      } else if (event.shiftKey && (event.target === links[0] || event.target === cards[index]) && index > 0) {
        event.preventDefault();
        goToCard(index - 1);
        cards[index - 1].querySelector("a[href]").focus({ preventScroll: true });
      }
    }

    let pending = 0;
    function resizeCards() {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(measure);
    }
    const headerObserver = new ResizeObserver(resizeCards);
    headerObserver.observe(header.querySelector(".nav-shell"));
    const loadEvents = new AbortController();
    const initialHash = location.hash;
    if (hashIndex() >= 0) {
      const alignOnLoad = () => document.fonts.ready.then(() => {
        if (loadEvents.signal.aborted || location.hash !== initialHash) return;
        ScrollTrigger.refresh();
        navigateHash();
        loadEvents.abort();
      });
      for (const type of ["pointerdown", "wheel", "touchstart", "keydown"]) {
        window.addEventListener(type, () => loadEvents.abort(), { once: true, passive: true, signal: loadEvents.signal });
      }
      if (document.readyState === "complete") alignOnLoad();
      else window.addEventListener("load", alignOnLoad, { once: true, signal: loadEvents.signal });
    }
    document.addEventListener("click", jumpFromLink);
    window.addEventListener("hashchange", navigateHash);
    section.addEventListener("keydown", tabBetweenCards);
    section.addEventListener("toggle", resizeCards, true);
    document.fonts.addEventListener("loadingdone", resizeCards);
    return () => {
      loadEvents.abort();
      cancelAnimationFrame(pending);
      headerObserver.disconnect();
      document.removeEventListener("click", jumpFromLink);
      window.removeEventListener("hashchange", navigateHash);
      section.removeEventListener("keydown", tabBetweenCards);
      section.removeEventListener("toggle", resizeCards, true);
      document.fonts.removeEventListener("loadingdone", resizeCards);
      section.classList.remove("care-deck", "care-measuring");
      markers.forEach((marker, index) => {
        const id = marker.id;
        marker.remove();
        cards[index].id = id;
      });
      section.style.removeProperty("--care-anchor-inset");
      section.style.removeProperty("--care-screens");
      section.style.removeProperty("--care-inset");
      section.style.removeProperty("--care-height");
      cards.forEach(card => {
        card.inert = false;
        card.style.removeProperty("visibility");
      });
    };
  });
  return () => media.revert();
}
