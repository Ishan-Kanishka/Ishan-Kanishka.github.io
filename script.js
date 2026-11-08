const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("open");
    hamburger?.setAttribute("aria-expanded", "false");
    hamburger?.setAttribute("aria-label", "Open menu");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    navMenu?.classList.remove("open");
    hamburger?.setAttribute("aria-expanded", "false");
    hamburger?.setAttribute("aria-label", "Open menu");
  }
});

const navTargets = [...navLinks]
  .map((link) => link.getAttribute("href"))
  .filter((href) => href && href.startsWith("#"))
  .map((href) => document.querySelector(href))
  .filter(Boolean);

const setActiveLink = () => {
  let current = "home";
  navTargets.forEach((section) => {
    if (section.getBoundingClientRect().top <= 120) current = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
};

window.addEventListener("scroll", setActiveLink, { passive: true });
setActiveLink();

const animateCount = (el) => {
  const target = Number(el.dataset.target);
  if (reducedMotion) {
    el.textContent = target.toLocaleString();
    return;
  }
  const duration = 1100;
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(target * progress).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const counters = document.querySelectorAll(".count");
if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45 });
  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach(animateCount);
}

const worldMap = document.getElementById("world-map");
if (worldMap && "IntersectionObserver" in window) {
  const mapObserver = new IntersectionObserver((entries) => {
    worldMap.classList.toggle("paused", !entries[0].isIntersecting);
  }, { threshold: 0.12 });
  mapObserver.observe(worldMap);
  if (reducedMotion) worldMap.classList.add("paused");
}

// Inline SVG keeps these icons available without external icon fonts or image hosts.
const iconPaths = {
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
  pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  laptop: '<rect x="4" y="4" width="16" height="12" rx="2"/><path d="M2 20h20l-2-4H4l-2 4Z"/>',
};

const makeIcon = (name) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "22");
  svg.setAttribute("height", "22");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.8");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = iconPaths[name];
  return svg;
};

document.querySelectorAll(".ready-icon").forEach((icon, index) => {
  icon.replaceChildren(makeIcon(["globe", "pin", "laptop"][index] || "globe"));
});

const experienceSection = document.querySelector("#experience .container");
const existingInternCard = experienceSection?.querySelector(".intern-card");
if (experienceSection && existingInternCard && !experienceSection.querySelector(".raks-experience")) {
  const card = document.createElement("article");
  card.className = "intern-card raks-experience";

  const role = document.createElement("p");
  role.className = "role";
  role.textContent = "Maritime Operations";

  const organization = document.createElement("p");
  organization.className = "org";
  organization.textContent = "RAKS INTERNATIONAL PTE LTD";

  const dates = document.createElement("p");
  dates.className = "dates";
  dates.textContent = "October 2026 — Present · Singapore";

  const description = document.createElement("p");
  description.className = "exp-copy";
  description.textContent = "Maritime operations in Singapore.";

  card.append(role, organization, dates, description);
  experienceSection.insertBefore(card, existingInternCard);
}

const revealTargets = document.querySelectorAll(
  ".ready-card, .experience-feature, .intern-card, .featured-project, .secondary-project, .edu-card, .skill-group"
);
if (!reducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((el) => revealObserver.observe(el));
}
