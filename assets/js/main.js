/* =========================================================
       JS: loading, header, menu mobile, reveal, counters e cursor
       ========================================================= */
    const body = document.body;
    const header = document.querySelector(".site-header");
    const navToggle = document.querySelector(".nav-toggle");
    const navPanel = document.querySelector(".nav-panel");
    const navBackdrop = document.querySelector(".nav-backdrop");
    const revealElements = document.querySelectorAll(".reveal");
    const counters = document.querySelectorAll(".counter");
    const buttons = document.querySelectorAll(".btn");
    const form = document.querySelector(".contact-form");
    const formSuccess = document.querySelector(".form-success");

    window.addEventListener("load", () => {
      window.setTimeout(() => body.classList.add("loaded"), 450);
    });

    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 72);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    const closeMenu = () => {
      body.classList.remove("menu-open");
      navToggle.classList.remove("is-open");
      navPanel.classList.remove("is-open");
      navBackdrop.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menu");
    };

    const toggleMenu = () => {
      const isOpen = navPanel.classList.toggle("is-open");
      body.classList.toggle("menu-open", isOpen);
      navToggle.classList.toggle("is-open", isOpen);
      navBackdrop.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    };

    navToggle.addEventListener("click", toggleMenu);
    navBackdrop.addEventListener("click", closeMenu);
    navPanel.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

    const animateCounter = (counter) => {
      const target = Number(counter.dataset.target || 0);
      const decimals = Number(counter.dataset.decimals || 0);
      const duration = 1500;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        counter.textContent = decimals ? value.toFixed(decimals) : String(Math.floor(value));

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = decimals ? target.toFixed(decimals) : String(target);
        }
      };

      requestAnimationFrame(step);
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          entry.target.querySelectorAll(".counter").forEach((counter) => {
            if (counter.dataset.animated) return;
            counter.dataset.animated = "true";
            animateCounter(counter);
          });

          if (entry.target.classList.contains("counter") && !entry.target.dataset.animated) {
            entry.target.dataset.animated = "true";
            animateCounter(entry.target);
          }

          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
    counters.forEach((counter) => {
      const parentReveal = counter.closest(".reveal");
      if (!parentReveal) revealObserver.observe(counter);
    });

    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const rect = button.getBoundingClientRect();
        button.style.setProperty("--ripple-x", `${event.clientX - rect.left}px`);
        button.style.setProperty("--ripple-y", `${event.clientY - rect.top}px`);
        button.classList.remove("ripple");
        void button.offsetWidth;
        button.classList.add("ripple");
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      formSuccess.classList.add("is-visible");
      form.querySelector("button[type='submit']").textContent = "Mensagem enviada";

      window.setTimeout(() => {
        form.reset();
        form.querySelector("button[type='submit']").textContent = "Enviar mensagem";
      }, 1800);
    });

    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      });

      const animateCursor = () => {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
      };

      animateCursor();

      document.querySelectorAll("a, button, input, select, textarea, .menu-card, .gallery-card, .testimonial-card").forEach((item) => {
        item.addEventListener("mouseenter", () => ring.classList.add("is-hovering"));
        item.addEventListener("mouseleave", () => ring.classList.remove("is-hovering"));
      });
    }

