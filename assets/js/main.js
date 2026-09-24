document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ---------- Scroll progress bar ----------
const progressBar = document.getElementById("scrollProgress");

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + "%";
}

// ---------- Header shrink/blur on scroll ----------
const siteHeader = document.getElementById("siteHeader");

function updateHeader() {
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateProgress();
      updateHeader();
      ticking = false;
    });
    ticking = true;
  }
});
updateProgress();
updateHeader();

// ---------- Reveal-on-scroll ----------
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal, .stagger").forEach((el) => {
  if (reduceMotion) {
    el.classList.add("is-visible");
    return;
  }
  revealObserver.observe(el);
});

document.querySelectorAll(".stagger").forEach((group) => {
  Array.from(group.children).forEach((child, i) => {
    child.style.transitionDelay = reduceMotion ? "0ms" : `${Math.min(i * 60, 480)}ms`;
  });
});

// ---------- Scrollspy nav ----------
const sections = ["about", "career", "skills", "projects", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);
const navLinkMap = new Map(
  Array.from(navLinks.querySelectorAll("a[data-nav]")).map((a) => [a.dataset.nav, a])
);

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = navLinkMap.get(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinkMap.forEach((l) => l.classList.remove("is-active"));
        link.classList.add("is-active");
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
);

sections.forEach((section) => spyObserver.observe(section));
