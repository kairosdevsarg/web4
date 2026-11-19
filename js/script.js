// ANIMACIÓN DE LA GALERÍA

document.addEventListener("DOMContentLoaded", () => {
  const projectCards = document.querySelectorAll(".project-card");

  if (!("IntersectionObserver" in window)) {
    projectCards.forEach(card => {
      card.classList.add("visible");
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  projectCards.forEach(card => observer.observe(card));
});

document.addEventListener("DOMContentLoaded", () => {

  const galleries = document.querySelectorAll(".project-gallery");

  // Crear ventana ampliada
  const lightbox = document.createElement("div");
  lightbox.className = "gallery-lightbox";

  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close"
              aria-label="Cerrar">&times;</button>

      <button class="lightbox-arrow lightbox-prev"
              aria-label="Imagen anterior">‹</button>

      <img class="lightbox-image" src="" alt="">

      <button class="lightbox-arrow lightbox-next"
              aria-label="Imagen siguiente">›</button>

      <p class="lightbox-caption"></p>
    </div>
  `;

  document.body.appendChild(lightbox);

  const bigImage = lightbox.querySelector(".lightbox-image");
  const caption = lightbox.querySelector(".lightbox-caption");

  let currentGallery = null;
  let currentIndex = 0;

  galleries.forEach(gallery => {

    const slides = [...gallery.querySelectorAll(".gallery-slide")];
    const prev = gallery.querySelector(".prev");
    const next = gallery.querySelector(".next");
    const counter = gallery.querySelector(".gallery-counter");
    const expand = gallery.querySelector(".gallery-expand");
    const dots = gallery.querySelector(".gallery-dots");

    let index = 0;
    let touchStart = 0;

    // Crear indicadores
    slides.forEach((slide, i) => {
      const dot = document.createElement("button");

      dot.className = "gallery-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Ver imagen ${i + 1}`);

      dot.addEventListener("click", () => showSlide(i));

      dots.appendChild(dot);
    });

    const indicators = [...dots.children];

    function showSlide(newIndex) {
      index = (newIndex + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });

      indicators.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });

      counter.textContent = `${index + 1} / ${slides.length}`;
    }

    prev.addEventListener("click", () => {
      showSlide(index - 1);
    });

    next.addEventListener("click", () => {
      showSlide(index + 1);
    });

    function openLightbox() {
      currentGallery = gallery;
      currentIndex = index;
      updateLightbox();
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
      lightbox.querySelector(".lightbox-close").focus();
    }

    slides.forEach(slide => {
      slide.addEventListener("click", openLightbox);
    });

    expand.addEventListener("click", openLightbox);

    // Deslizar en pantallas táctiles
    gallery.addEventListener("touchstart", event => {
      touchStart = event.changedTouches[0].clientX;
    }, { passive: true });

    gallery.addEventListener("touchend", event => {
      const difference =
        event.changedTouches[0].clientX - touchStart;

      if (Math.abs(difference) > 45) {
        showSlide(index + (difference < 0 ? 1 : -1));
      }
    }, { passive: true });

    showSlide(0);
  });

  function updateLightbox() {
    const slides =
      currentGallery.querySelectorAll(".gallery-slide");

    const slide = slides[currentIndex];

    bigImage.src = slide.src;
    bigImage.alt = slide.alt;

    caption.textContent =
      `${slide.alt} — ${currentIndex + 1} de ${slides.length}`;
  }

  function navigateLightbox(direction) {
    if (!currentGallery) return;

    const slides =
      currentGallery.querySelectorAll(".gallery-slide");

    currentIndex =
      (currentIndex + direction + slides.length) % slides.length;

    // Sincronizar el carrusel original
    const buttons = currentGallery.querySelectorAll(".gallery-dot");

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentIndex);
    });

    buttons.forEach((button, i) => {
      button.classList.toggle("active", i === currentIndex);
    });

    currentGallery.querySelector(".gallery-counter").textContent =
      `${currentIndex + 1} / ${slides.length}`;

    updateLightbox();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    currentGallery = null;
  }

  lightbox.querySelector(".lightbox-close")
    .addEventListener("click", closeLightbox);

  lightbox.querySelector(".lightbox-prev")
    .addEventListener("click", () => navigateLightbox(-1));

  lightbox.querySelector(".lightbox-next")
    .addEventListener("click", () => navigateLightbox(1));

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  // Navegación con teclado
  document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") navigateLightbox(1);
    if (event.key === "ArrowLeft") navigateLightbox(-1);
  });

});