const menu = document.querySelector("#menu");
const menuToggle = document.querySelector(".menu-toggle");
const mobile = matchMedia("(max-width: 760px)");

function setMenu(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  menu.classList.toggle("is-open", open);
  menu.inert = mobile.matches && !open;
}

function syncMenu() {
  menuToggle.hidden = !mobile.matches;
  setMenu(false);
}

const header = document.querySelector(".site-header");
const navShell = header.querySelector(".nav-shell");
const hero = document.querySelector(".hero");
header.classList.add("menu-ready");
syncMenu();
mobile.addEventListener("change", syncMenu);
menuToggle.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") === "false");
});
menu.addEventListener("click", (event) => {
  if (mobile.matches && event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuToggle.focus();
  }
});

function hasDarkBackground(x, y) {
  for (const element of document.elementsFromPoint(x, y)) {
    if (header.contains(element)) continue;
    if (hero.contains(element)) return false;

    const color = getComputedStyle(element).backgroundColor;
    const channels = color.match(/[\d.]+/g)?.map(Number);
    if (!channels || channels.length < 3) continue;
    const [red, green, blue, opacity = 1] = channels;
    if (opacity < .7) continue;

    return red * .2126 + green * .7152 + blue * .0722 < 140;
  }
  return false;
}

let navFrame = 0;
const navSamplePositions = [.2, .5, .8];
const navToneThreshold = 6;

function scheduleNavTone() {
  if (navFrame) return;
  navFrame = requestAnimationFrame(() => {
    navFrame = 0;
    const { left, top, width, height } = navShell.getBoundingClientRect();
    let darkCount = 0;
    for (const row of navSamplePositions) {
      for (const column of navSamplePositions) {
        if (hasDarkBackground(left + width * column, top + height * row)) darkCount += 1;
      }
    }

    // Hold the current tone when neither background covers two thirds of the samples.
    const lightCount = navSamplePositions.length ** 2 - darkCount;
    let tone = header.dataset.tone || "light";
    if (darkCount >= navToneThreshold) tone = "dark";
    if (lightCount >= navToneThreshold) tone = "light";
    if (header.dataset.tone !== tone) header.dataset.tone = tone;
  });
}

window.addEventListener("scroll", scheduleNavTone, { passive: true });
window.addEventListener("resize", scheduleNavTone);
window.addEventListener("pageshow", scheduleNavTone);
scheduleNavTone();

const team = document.querySelector("#equipe");
const motion = matchMedia("(prefers-reduced-motion: reduce)");

// Specialty links open the team gallery on a doctor of that area (TeamGallery listens).
document.querySelectorAll("[data-area]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (window.artusLenis) window.artusLenis.scrollTo(team, { duration: 1.1 });
    else team.scrollIntoView({ behavior: motion.matches ? "instant" : "smooth", block: "start" });
    window.dispatchEvent(new CustomEvent("artus:area", { detail: link.dataset.area }));
  });
});

function revealOnEntry(entries, observer) {
  let delay = 0;
  for (const { target, isIntersecting } of entries) {
    if (!isIntersecting) continue;
    observer.unobserve(target);
    if (motion.matches) continue;

    target.style.setProperty("--reveal-delay", delay + "ms");
    target.classList.add("has-entered");
    delay = Math.min(delay + 65, 195);
  }
}

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(revealOnEntry, { threshold: .1 })
  : null;

if (revealObserver) {
  document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));
}

// Keep the specialty portrait near the pointer and within the viewport.
const finePointer = matchMedia("(hover: hover) and (min-width: 761px)");
document.querySelectorAll(".area-card").forEach((card) => {
  const preview = card.querySelector(".area-preview");
  const paired = preview.classList.contains("area-preview-pair");
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  function place() {
    frame = 0;
    const rect = card.getBoundingClientRect();
    const maxX = document.documentElement.clientWidth - preview.offsetWidth - 12;
    const maxY = window.innerHeight - preview.offsetHeight - 12;
    const anchored = paired && (motion.matches || card.matches(":focus-visible"));
    const preferredX = anchored ? rect.right - preview.offsetWidth - 14 : pointerX + 26;
    const preferredY = anchored ? rect.top - preview.offsetHeight + 14 : pointerY - preview.offsetHeight * .72;
    const x = Math.max(12, Math.min(preferredX, maxX));
    const minY = paired ? Math.max(12, header.getBoundingClientRect().bottom + 8) : 12;
    const y = Math.max(12, Math.min(Math.max(minY, preferredY), maxY));
    preview.style.setProperty("--preview-x", (x - rect.left - card.clientLeft) + "px");
    preview.style.setProperty("--preview-y", (y - rect.top - card.clientTop) + "px");
  }
  if (paired) {
    const updateVisiblePair = () => {
      if (finePointer.matches && card.matches(":hover, :focus-visible") && !frame) frame = requestAnimationFrame(place);
    };
    card.addEventListener("focus", updateVisiblePair);
    window.addEventListener("scroll", updateVisiblePair, { passive: true });
    window.addEventListener("resize", updateVisiblePair);
  }
  card.addEventListener("pointerenter", (event) => {
    if (!finePointer.matches || (motion.matches && !paired) || event.pointerType === "touch") return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    preview.style.removeProperty("--preview-follow-duration");
    place();
    card.classList.add("is-following");
    void getComputedStyle(preview).translate;
  });
  card.addEventListener("pointermove", (event) => {
    if (!finePointer.matches || motion.matches || !card.classList.contains("is-following")) return;
    if (event.clientX === pointerX && event.clientY === pointerY) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    preview.style.setProperty("--preview-follow-duration", "90ms");
    if (!frame) frame = requestAnimationFrame(place);
  });
  card.addEventListener("pointerleave", () => {
    cancelAnimationFrame(frame);
    frame = 0;
  });
});
