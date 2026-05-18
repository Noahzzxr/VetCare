(() => {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const yearEl = document.getElementById("year");
  const form = document.getElementById("appointmentForm");
  const formStatus = document.getElementById("formStatus");
  const header = document.querySelector(".header");

  // Footer year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header scroll effect
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // init

  // Mobile menu toggle
  function setMenu(open) {
    if (!navMenu || !navToggle) return;
    if (open) {
      navMenu.classList.add("is-open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Fechar menu");
    } else {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menu");
    }
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("is-open");
      setMenu(!isOpen);
    });

    // Close on link click (mobile)
    navMenu.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      setMenu(false);
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      const target = e.target;
      const clickedInside = navMenu.contains(target) || navToggle.contains(target);
      if (!clickedInside) setMenu(false);
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
  }

  // Smooth scroll offset for fixed header
  function getHeaderOffset() {
    return header ? header.getBoundingClientRect().height : 80;
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#" || href === "#!") return;

      const el = document.querySelector(href);
      if (!el) return;

      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
      window.scrollTo({ top, behavior: "smooth" });

      // Focus on form if #contato
      if (href === "#contato") {
        setTimeout(() => {
          const firstInput = document.querySelector('#appointmentForm input[name="name"]');
          if (firstInput) firstInput.focus({ preventScroll: true });
        }, 450);
      }
    });
  });

  // Reveal on scroll (IntersectionObserver)
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target); // Run once
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    // fallback
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Form validation (visual)
  function showStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = "form-status is-visible " + (type ? `is-${type}` : "");
  }

  function clearStatus() {
    if (!formStatus) return;
    formStatus.className = "form-status";
    formStatus.textContent = "";
  }

  function isValidPhone(value) {
    const digits = (value || "").replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 13;
  }

  function setFieldState(input, ok) {
    if (!input) return;
    if (ok) {
      input.style.borderColor = "";
      input.style.boxShadow = "";
    } else {
      input.style.borderColor = "#ef4444";
      input.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.2)";
    }
  }

  if (form) {
    form.addEventListener("input", (e) => {
      const el = e.target;
      if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement)) return;
      setFieldState(el, true);
      clearStatus();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearStatus();

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const pet = String(data.get("pet") || "").trim();
      const service = String(data.get("service") || "").trim();

      const fields = {
        name: form.querySelector('input[name="name"]'),
        phone: form.querySelector('input[name="phone"]'),
        pet: form.querySelector('input[name="pet"]'),
        service: form.querySelector('select[name="service"]'),
      };

      let ok = true;

      if (!name) { ok = false; setFieldState(fields.name, false); }
      if (!pet)  { ok = false; setFieldState(fields.pet, false); }
      if (!service) { ok = false; setFieldState(fields.service, false); }

      if (!phone || !isValidPhone(phone)) {
        ok = false;
        setFieldState(fields.phone, false);
      }

      if (!ok) {
        showStatus("Por favor, preencha todos os campos obrigatórios corretamente.", "error");
        return;
      }

      // Simulated success (sem backend)
      showStatus("Solicitação enviada com sucesso! ✅ Em breve nossa equipe entrará em contato via WhatsApp.", "success");
      form.reset();
    });

    form.addEventListener("reset", () => {
      clearStatus();
      form.querySelectorAll("input, select, textarea").forEach((el) => {
        setFieldState(el, true);
      });
    });
  }
})();
