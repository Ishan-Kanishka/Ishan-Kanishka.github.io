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
    navMenu.classList.remove("open");
    hamburger?.setAttribute("aria-expanded", "false");
    hamburger?.setAttribute("aria-label", "Open menu");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    navMenu.classList.remove("open");
    hamburger?.setAttribute("aria-expanded", "false");
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
    const top = section.getBoundingClientRect().top;
    if (top <= 120) current = section.id;
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${current}`);
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
  const duration = 1200;
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
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach(animateCount);
}

const revealTargets = document.querySelectorAll(
  ".ready-card, .plain-card, .stat-card, .skill-group, .featured-project, .secondary-project, .edu-card, .lens-card"
);

if (!reducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));
}
