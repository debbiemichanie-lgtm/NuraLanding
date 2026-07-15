/* 
   MENÚ MOBILE
 */

const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    menuButton.classList.toggle("active", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.classList.remove("active");
      menuButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      nav.classList.remove("open");
      menuButton.classList.remove("active");
      menuButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }
  });
}

/* 
   AÑO AUTOMÁTICO
 */

const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

/* 
   LINK ACTIVE SEGÚN LA SECCIÓN VISIBLE
 */

const sectionLinks = Array.from(
  document.querySelectorAll('.nav a[href^="#"]')
);

const observedSections = sectionLinks
  .map((link) => {
    const selector = link.getAttribute("href");

    if (!selector) return null;

    return document.querySelector(selector);
  })
  .filter(Boolean);

function setActiveLink(sectionId) {
  sectionLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;

    link.classList.toggle("active", isActive);
  });
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleEntries.length > 0) {
        setActiveLink(visibleEntries[0].target.id);
      }
    },
    {
      rootMargin: "-25% 0px -60% 0px",
      threshold: [0.05, 0.15, 0.3, 0.5],
    }
  );

  observedSections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

/* Marcar Inicio al cargar la página */
setActiveLink("inicio");

/* 
   CARRUSEL DE PROFESIONALES
 */

const carouselTrack = document.querySelector(".carousel-track");

const carouselItems = Array.from(
  document.querySelectorAll(".professional-item")
);

const previousButton = document.querySelector(
  ".carousel-arrow--prev"
);

const nextButton = document.querySelector(
  ".carousel-arrow--next"
);

const dotsContainer = document.querySelector(".carousel-dots");

let carouselIndex = 0;

function visibleProfessionalCards() {
  if (window.innerWidth <= 760) {
    return 1;
  }

  if (window.innerWidth <= 980) {
    return 2;
  }

  return 3;
}

function maxCarouselIndex() {
  return Math.max(
    0,
    carouselItems.length - visibleProfessionalCards()
  );
}

function createCarouselDots() {
  if (!dotsContainer) return;

  dotsContainer.innerHTML = "";

  const totalPositions = maxCarouselIndex() + 1;

  for (let index = 0; index < totalPositions; index += 1) {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.className = "carousel-dot";

    dot.setAttribute(
      "aria-label",
      `Mostrar grupo ${index + 1} de profesionales`
    );

    dot.addEventListener("click", () => {
      carouselIndex = index;
      updateCarousel();
    });

    dotsContainer.appendChild(dot);
  }
}

function updateCarousel() {
  if (!carouselTrack || carouselItems.length === 0) return;

  carouselIndex = Math.min(
    carouselIndex,
    maxCarouselIndex()
  );

  const firstCard = carouselItems[0];

  const cardWidth =
    firstCard.getBoundingClientRect().width;

  const trackStyles =
    window.getComputedStyle(carouselTrack);

  const gap =
    Number.parseFloat(
      trackStyles.columnGap || trackStyles.gap
    ) || 0;

  const movement = carouselIndex * (cardWidth + gap);

  carouselTrack.style.transform =
    `translateX(-${movement}px)`;

  if (previousButton) {
    previousButton.disabled = carouselIndex === 0;
  }

  if (nextButton) {
    nextButton.disabled =
      carouselIndex >= maxCarouselIndex();
  }

  document
    .querySelectorAll(".carousel-dot")
    .forEach((dot, index) => {
      dot.classList.toggle(
        "active",
        index === carouselIndex
      );
    });
}

if (previousButton) {
  previousButton.addEventListener("click", () => {
    carouselIndex = Math.max(
      0,
      carouselIndex - 1
    );

    updateCarousel();
  });
}

if (nextButton) {
  nextButton.addEventListener("click", () => {
    carouselIndex = Math.min(
      maxCarouselIndex(),
      carouselIndex + 1
    );

    updateCarousel();
  });
}

/* 
   RECALCULAR RESPONSIVE
 */

let resizeTimer;

window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);

  resizeTimer = window.setTimeout(() => {
    createCarouselDots();
    updateCarousel();
  }, 150);
});

/* 
   INICIALIZACIÓN
 */

createCarouselDots();
updateCarousel();