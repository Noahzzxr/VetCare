(() => {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const yearEl = document.getElementById("year");
  const form = document.getElementById("appointmentForm");
  const formStatus = document.getElementById("formStatus");

  // Footer year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu toggle
  function setMenu(open) {
    if (!navMenu || !navToggle) return;
    navMenu.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
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
  const header = document.querySelector(".header");
  function getHeaderOffset() {
    return header ? header.getBoundingClientRect().height + 10 : 80;
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#!") return;

      const el = document.querySelector(href);
      if (!el) return;

      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
      window.scrollTo({ top, behavior: "smooth" });

      // Optional: focus form if CTA requested
      if (a.dataset.focusForm === "true") {
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
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
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
    input.style.borderColor = ok ? "rgba(255,255,255,.14)" : "rgba(255,140,140,.45)";
    input.style.boxShadow = ok ? "none" : "0 0 0 4px rgba(255,140,140,.14)";
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
      const date = String(data.get("date") || "").trim();
      const time = String(data.get("time") || "").trim();

      const fields = {
        name: form.querySelector('input[name="name"]'),
        phone: form.querySelector('input[name="phone"]'),
        pet: form.querySelector('input[name="pet"]'),
        service: form.querySelector('select[name="service"]'),
        date: form.querySelector('input[name="date"]'),
        time: form.querySelector('input[name="time"]')
      };

      let ok = true;

      if (!name) { ok = false; setFieldState(fields.name, false); }
      if (!pet)  { ok = false; setFieldState(fields.pet, false); }
      if (!service) { ok = false; setFieldState(fields.service, false); }
      if (!date) { ok = false; setFieldState(fields.date, false); }
      if (!time) { ok = false; setFieldState(fields.time, false); }

      if (!phone || !isValidPhone(phone)) {
        ok = false;
        setFieldState(fields.phone, false);
      }

      if (!ok) {
        showStatus("Confira os campos obrigatórios e tente novamente.", "error");
        return;
      }

      // Simulated success (sem backend)
      showStatus("Pedido enviado! ✅ Nossa equipe entrará em contato para confirmar o horário.", "success");
      form.reset();
    });

    form.addEventListener("reset", () => {
      clearStatus();
      // reset inline styles
      form.querySelectorAll("input, select, textarea").forEach((el) => {
        el.style.borderColor = "";
        el.style.boxShadow = "";
      });
    });
  }
})();
