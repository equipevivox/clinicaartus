const portraits = document.querySelector(".team-portraits");
const portraitTemplate = document.querySelector("#team-portrait-template");
let activePortrait = null;

function setPortraitOpen(portrait, open) {
  const button = portrait.querySelector("button");
  const panel = portrait.querySelector("[role='tooltip']");
  portrait.dataset.open = String(open);
  button.setAttribute("aria-expanded", String(open));
  panel.setAttribute("aria-hidden", String(!open));
  if (open) button.setAttribute("aria-describedby", panel.id);
  else button.removeAttribute("aria-describedby");
}

function selectPortrait(portrait) {
  if (portrait === activePortrait) return;
  if (activePortrait) setPortraitOpen(activePortrait, false);
  activePortrait = portrait;
  if (activePortrait) setPortraitOpen(activePortrait, true);
}

document.querySelectorAll(".doctor").forEach((doctor, index) => {
  const portrait = portraitTemplate.content.firstElementChild.cloneNode(true);
  const button = portrait.querySelector("button");
  const panel = portrait.querySelector("[role='tooltip']");
  const name = doctor.querySelector("h3").textContent;
  panel.id = "team-portrait-" + (index + 1);
  button.setAttribute("aria-label", name);
  portrait.querySelector("img").src = doctor.querySelector("img").src;
  panel.querySelector("strong").textContent = name;
  panel.querySelector(".hover-card-specialty").textContent = doctor.querySelector("p").textContent;
  panel.querySelector(".hover-card-credentials").textContent = doctor.querySelector("small").textContent;

  function closePortrait() {
    if (activePortrait === portrait) selectPortrait(null);
  }

  portrait.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") selectPortrait(portrait);
  });
  portrait.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse" && !button.matches(":focus-visible")) closePortrait();
  });
  button.addEventListener("focus", () => {
    if (button.matches(":focus-visible")) selectPortrait(portrait);
  });
  button.addEventListener("blur", closePortrait);
  button.addEventListener("click", (event) => {
    const isTouch = event.pointerType === "touch";
    selectPortrait(isTouch && activePortrait === portrait ? null : portrait);
  });
  portraits.append(portrait);
});

portraits.hidden = false;
document.addEventListener("pointerdown", (event) => {
  if (activePortrait && !portraits.contains(event.target)) selectPortrait(null);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") selectPortrait(null);
});
