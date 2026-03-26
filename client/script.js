
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const scrollTopBtn = document.getElementById("scrollTopBtn");
const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".dot");
const counters = document.querySelectorAll("[data-count]");
const revealEls = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll(".tilt-card");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

if (menuToggle && siteNav) {
  const syncMenuState = () => {
    const isOpen = siteNav.classList.contains("show");
    document.body.classList.toggle("menu-open", isOpen && window.innerWidth <= 820);
    menuToggle.innerHTML = isOpen ? "&#10005;" : "&#9776;";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  };

  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("show");
    syncMenuState();
  });

  document.querySelectorAll(".nav-link, .nav-cta").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("show");
      syncMenuState();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      siteNav.classList.remove("show");
      syncMenuState();
    }
  });

  syncMenuState();
}

let currentSlide = 0;
let slideTimer;

function showSlide(index) {
  if (!slides.length) return;

  const safeIndex = ((index % slides.length) + slides.length) % slides.length;

  slides.forEach((slide, i) => slide.classList.toggle("active", i === safeIndex));
  dots.forEach((dot, i) => dot.classList.toggle("active", i === safeIndex));
  currentSlide = safeIndex;
}

function startSlider() {
  if (!slides.length || slides.length < 2) return;
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide(currentSlide + 1), 4500);
}

if (slides.length) {
  showSlide(0);
  startSlider();
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const index = Number(dot.dataset.slide || 0);
    showSlide(index);
    startSlider();
  });
});

function toggleScrollTopVisibility() {
  if (!scrollTopBtn) return;

  const scrollTop = window.scrollY || window.pageYOffset;
  const viewportHeight = window.innerHeight;
  const fullHeight = document.documentElement.scrollHeight;
  const reachedPageEnd = scrollTop + viewportHeight >= fullHeight - 80;

  scrollTopBtn.classList.toggle("show", reachedPageEnd);
}

window.addEventListener("scroll", toggleScrollTopVisibility, { passive: true });
window.addEventListener("load", toggleScrollTopVisibility);
window.addEventListener("resize", toggleScrollTopVisibility);

scrollTopBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

if (revealEls.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
  );

  revealEls.forEach((el) => revealObserver.observe(el));
}

if (counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const target = Number(counter.dataset.count || 0);
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 70));

        const updateCounter = () => {
          current += increment;

          if (current >= target) {
            counter.textContent = `${target}${target === 100 ? "%" : "+"}`;
            return;
          }

          counter.textContent = String(current);
          requestAnimationFrame(updateCounter);
        };

        updateCounter();
        counterObserver.unobserve(counter);
      });
    },
    { threshold: 0.45 },
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    if (window.innerWidth <= 1024) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -7;
    const rotateY = ((x / rect.width) - 0.5) * 7;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      name: document.getElementById("name")?.value.trim(),
      email: document.getElementById("email")?.value.trim(),
      phone: document.getElementById("phone")?.value.trim(),
      service: document.getElementById("service")?.value,
      message: document.getElementById("message")?.value.trim(),
    };

    if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.message) {
      if (formStatus) {
        formStatus.textContent = "Please fill in all fields.";
        formStatus.style.color = "#dc2626";
      }
      return;
    }

    const endpoint = contactForm.getAttribute("data-endpoint") || "http://localhost:5000/api/contact";

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      if (formStatus) {
        formStatus.textContent = "Sending message...";
        formStatus.style.color = "#64748b";
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (formStatus) {
          formStatus.textContent = "Message sent successfully.";
          formStatus.style.color = "#16a34a";
        }

        contactForm.reset();
        setTimeout(() => {
          window.location.href = "thank-you.html";
        }, 900);
      } else {
        if (formStatus) {
          formStatus.textContent = data.message || "Failed to send message.";
          formStatus.style.color = "#dc2626";
        }
      }
    } catch (error) {
      console.error("Submit error:", error);

      if (formStatus) {
        formStatus.textContent = "Something went wrong. Please try again.";
        formStatus.style.color = "#dc2626";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    }
  });
}

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");

    document.querySelectorAll(".faq-item").forEach((faq) => {
      if (faq !== item) faq.classList.remove("active");
    });

    item?.classList.toggle("active");
  });
});

function initMobileCardRails() {
  const railSelectors = [
    ".grid-3",
    ".hero-stats",
    ".gallery-grid",
    ".pricing-highlight-grid",
    ".pricing-grid",
    ".pricing-extra-grid",
    ".pricing-insights",
  ];

  railSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((rail) => {
      const existingDots = rail.nextElementSibling;

      if (window.innerWidth > 640) {
        rail.classList.remove("mobile-card-rail");
        rail.dataset.railReady = "false";

        if (existingDots && existingDots.classList.contains("mobile-rail-dots")) {
          existingDots.remove();
        }

        return;
      }

      if (rail.dataset.railReady === "true") return;

      const cards = Array.from(rail.children).filter((child) => child.nodeType === 1);
      if (cards.length <= 1) return;

      rail.classList.add("mobile-card-rail");
      rail.dataset.railReady = "true";

      const dotsWrap = document.createElement("div");
      dotsWrap.className = "mobile-rail-dots";

      const getCardLeft = (card) => {
        const left = card.offsetLeft - rail.offsetLeft - ((rail.clientWidth - card.clientWidth) / 2);
        const maxLeft = rail.scrollWidth - rail.clientWidth;
        return Math.max(0, Math.min(left, maxLeft));
      };

      cards.forEach((card, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = `mobile-rail-dot ${index === 0 ? "active" : ""}`;
        dot.setAttribute("aria-label", `Go to card ${index + 1}`);

        dot.addEventListener("click", () => {
          rail.scrollTo({ left: getCardLeft(card), behavior: "smooth" });
        });

        dotsWrap.appendChild(dot);
      });

      rail.insertAdjacentElement("afterend", dotsWrap);

      const updateDots = () => {
        const railCenter = rail.scrollLeft + (rail.clientWidth / 2);
        let activeIndex = 0;
        let smallestDistance = Infinity;

        cards.forEach((card, index) => {
          const cardCenter = card.offsetLeft - rail.offsetLeft + (card.clientWidth / 2);
          const distance = Math.abs(cardCenter - railCenter);

          if (distance < smallestDistance) {
            smallestDistance = distance;
            activeIndex = index;
          }
        });

        dotsWrap.querySelectorAll(".mobile-rail-dot").forEach((dot, index) => {
          dot.classList.toggle("active", index === activeIndex);
        });
      };

      rail.addEventListener("scroll", updateDots, { passive: true });
      updateDots();
    });
  });
}

window.addEventListener("load", initMobileCardRails);
window.addEventListener("resize", initMobileCardRails);
