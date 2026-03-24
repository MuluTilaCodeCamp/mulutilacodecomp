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

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("show");
    menuToggle.textContent = siteNav.classList.contains("show") ? "✕" : "☰";
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("show");
      if (menuToggle) menuToggle.textContent = "☰";
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

/* Counter animation */
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = +counter.dataset.count;
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

/* Tilt hover effect */
tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
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

/* Contact form validation */
if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const message = document.getElementById("message")?.value.trim();

    if (!name || !email || !phone || !message) {
      formStatus.textContent = "Fill all fields properly.";
      formStatus.style.color = "#dc2626";
      return;
    } else {
      formStatus.textContent = "Message sent successfully. Frontend demo only.";
      formStatus.style.color = "#0b63ce";
      contactForm.reset();
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

// var typed = new Typed(".auto-type", {
//   strings: ["Impossible Is Only The Word Impossible"],
//   typeSpeed: 130,
//   backSpeed: 130,
//   loop: true,
// });
