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

/* Mobile menu */
if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("show");
    menuToggle.textContent = siteNav.classList.contains("show") ? "✕" : "☰";
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("show");
      menuToggle.textContent = "☰";
    });
  });
}

/* Hero autoplay slider */
let currentSlide = 0;

function showSlide(index) {
  if (!slides.length) return;

  slides.forEach((slide) => slide.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));

  slides[index].classList.add("active");
  if (dots[index]) dots[index].classList.add("active");

  currentSlide = index;
}

if (slides.length) {
  setInterval(() => {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }, 4000);
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const index = Number(dot.dataset.slide);
    showSlide(index);
  });
});

/* Scroll top button */
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollTopBtn?.classList.add("show");
  } else {
    scrollTopBtn?.classList.remove("show");
  }
});

scrollTopBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* Reveal on scroll */
if (revealEls.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.15 },
  );

  revealEls.forEach((el) => revealObserver.observe(el));
}

/* Counter animation */
if (counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const target = Number(counter.dataset.count);
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 60));

        const updateCounter = () => {
          current += increment;

          if (current >= target) {
            counter.textContent = target + (target === 100 ? "%" : "+");
          } else {
            counter.textContent = current;
            requestAnimationFrame(updateCounter);
          }
        };

        updateCounter();
        counterObserver.unobserve(counter);
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

/* Tilt hover effect */
tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    if (window.innerWidth <= 768) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y / rect.height - 0.5) * -8;
    const rotateY = (x / rect.width - 0.5) * 8;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

/* Contact form submit */
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById("name")?.value.trim(),
      email: document.getElementById("email")?.value.trim(),
      phone: document.getElementById("phone")?.value.trim(),
      service: document.getElementById("service")?.value,
      message: document.getElementById("message")?.value.trim(),
    };

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.service ||
      !formData.message
    ) {
      if (formStatus) {
        formStatus.textContent = "Please fill in all fields.";
        formStatus.style.color = "red";
      }
      return;
    }

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      if (formStatus) {
        formStatus.textContent = "Sending message...";
        formStatus.style.color = "#555";
      }

      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        if (formStatus) {
          formStatus.textContent = "Message sent successfully.";
          formStatus.style.color = "green";
        }

        contactForm.reset();

        setTimeout(() => {
          window.location.href = "thank-you.html";
        }, 1000);
      } else {
        if (formStatus) {
          formStatus.textContent = data.message || "Failed to send message.";
          formStatus.style.color = "red";
        }
      }
    } catch (error) {
      console.error("Submit error:", error);

      if (formStatus) {
        formStatus.textContent = "Something went wrong. Please try again.";
        formStatus.style.color = "red";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    }
  });
}

/* FAQ accordion */
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;

    document.querySelectorAll(".faq-item").forEach((faq) => {
      if (faq !== item) faq.classList.remove("active");
    });

    item.classList.toggle("active");
  });
});

/* Mobile horizontal card rails with dots */
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

      if (window.innerWidth > 768) {
        rail.classList.remove("mobile-card-rail");
        rail.dataset.railReady = "false";

        if (
          existingDots &&
          existingDots.classList.contains("mobile-rail-dots")
        ) {
          existingDots.remove();
        }
        return;
      }

      if (rail.dataset.railReady === "true") return;

      const cards = Array.from(rail.children).filter(
        (child) => child.nodeType === 1,
      );

      if (cards.length <= 1) return;

      rail.classList.add("mobile-card-rail");
      rail.dataset.railReady = "true";

      const dotsWrap = document.createElement("div");
      dotsWrap.className = "mobile-rail-dots";

      const getCardLeft = (card) => {
        const left =
          card.offsetLeft -
          rail.offsetLeft -
          (rail.clientWidth - card.clientWidth) / 2;

        const maxLeft = rail.scrollWidth - rail.clientWidth;
        return Math.max(0, Math.min(left, maxLeft));
      };

      cards.forEach((card, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = `mobile-rail-dot ${index === 0 ? "active" : ""}`;
        dot.setAttribute("aria-label", `Go to card ${index + 1}`);

        dot.addEventListener("click", () => {
          rail.scrollTo({
            left: getCardLeft(card),
            behavior: "smooth",
          });
        });

        dotsWrap.appendChild(dot);
      });

      rail.insertAdjacentElement("afterend", dotsWrap);

      const updateDots = () => {
        const railCenter = rail.scrollLeft + rail.clientWidth / 2;
        let activeIndex = 0;
        let smallestDistance = Infinity;

        cards.forEach((card, index) => {
          const cardCenter =
            card.offsetLeft - rail.offsetLeft + card.clientWidth / 2;
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
