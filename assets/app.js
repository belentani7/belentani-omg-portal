(function () {
  "use strict";

  const DATA = window.OMG_CATALOG;
  if (!DATA) return;

  const labels = {
    all: "TODO",
    agents: "AGENTES",
    devtools: "DEVTOOLS",
    creative: "CREATIVE",
    impact: "IMPACT",
    protocols: "PROTOCOLOS"
  };

  const state = {
    filter: "all",
    query: ""
  };

  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));

  const esc = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));

  const safeUrl = (value) => {
    if (!value) return "";
    try {
      const url = new URL(value, window.location.href);
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
    } catch (error) {
      return "";
    }
  };

  const stackMarkup = (items) => `<div class="stack">${items.map((item) => `<span>${esc(item)}</span>`).join("")}</div>`;

  const renderMothers = () => {
    const grid = $("#mother-grid");
    if (!grid) return;
    grid.innerHTML = DATA.mothers.map((mother) => `
      <article class="mother-card reveal" data-tone="${esc(mother.tone)}">
        <div class="mother-top">
          <span class="mother-id">${esc(mother.id)}</span>
          <span class="mother-role">${esc(mother.role)}</span>
        </div>
        <div class="mother-body">
          <h3 class="mother-title">${esc(mother.title)}</h3>
          <span class="mother-name">${esc(mother.name)}</span>
          <p class="mother-desc">${esc(mother.desc)}</p>
          <div class="mother-foot">
            ${stackMarkup(mother.stack)}
            <a class="arrow-link" href="${esc(safeUrl(mother.repo))}" target="_blank" rel="noreferrer">ABRIR â†—</a>
          </div>
        </div>
      </article>
    `).join("");
  };

  const renderFilters = () => {
    const filters = $("#filters");
    if (!filters) return;
    const counts = DATA.projects.reduce((acc, project) => {
      acc.all += 1;
      acc[project.cat] = (acc[project.cat] || 0) + 1;
      return acc;
    }, { all: 0 });
    filters.innerHTML = Object.keys(labels).map((key) => `
      <button class="filter" type="button" data-filter="${key}" aria-pressed="${state.filter === key}">
        ${labels[key]} <span>${counts[key] || 0}</span>
      </button>
    `).join("");
  };

  const matches = (project) => {
    if (state.filter !== "all" && project.cat !== state.filter) return false;
    if (!state.query) return true;
    const haystack = [
      project.name,
      project.cat,
      project.desc,
      project.stack.join(" "),
      project.tier
    ].join(" ").toLowerCase();
    return haystack.includes(state.query);
  };

  const renderProjects = () => {
    const grid = $("#project-grid");
    const empty = $("#empty");
    if (!grid) return;
    const filtered = DATA.projects.filter(matches);
    grid.innerHTML = filtered.map((project) => {
      const repo = safeUrl(project.repo);
      const live = safeUrl(project.live);
      const number = String(DATA.projects.indexOf(project) + 1).padStart(2, "0");
      return `
        <article class="project-card reveal" data-tier="${esc(project.tier)}">
          <div class="project-top">
            <span class="project-index">${number} / ${String(DATA.projects.length).padStart(2, "0")}</span>
            <span class="tier tier-${esc(project.tier)}">${esc(project.tier)}</span>
          </div>
          <h3 class="project-name">${esc(project.name)}</h3>
          <p class="project-cat">${esc(labels[project.cat] || project.cat)}${project.private ? ' <span class="private-mark">/ PRIVADO</span>' : ""}</p>
          <p class="project-desc">${esc(project.desc)}</p>
          <div class="project-foot">
            ${stackMarkup(project.stack)}
            <div class="project-links">
              ${live ? `<a class="project-link" href="${esc(live)}" target="_blank" rel="noreferrer">DEMO â†—</a>` : ""}
              ${repo ? `<a class="project-link${live ? " project-link-muted" : ""}" href="${esc(repo)}" target="_blank" rel="noreferrer">CÃ“DIGO â†—</a>` : ""}
            </div>
          </div>
        </article>
      `;
    }).join("");
    if (empty) empty.hidden = filtered.length !== 0;
    observeReveals();
    attachTilt();
  };

  const renderEngines = () => {
    const grid = $("#engine-grid");
    if (!grid) return;
    grid.innerHTML = DATA.engines.map((engine) => `
      <article class="engine-card reveal">
        <span class="engine-tag">${esc(engine.tag)}</span>
        <h3 class="engine-name">${esc(engine.name)}</h3>
        <p class="engine-desc">${esc(engine.desc)}</p>
        <div class="engine-meta">
          <span>â˜… ${esc(engine.stars)}</span>
          <a href="${esc(safeUrl(engine.repo))}" target="_blank" rel="noreferrer">${esc(engine.commit)} â†—</a>
        </div>
      </article>
    `).join("");
  };

  const wireFilters = () => {
    const filters = $("#filters");
    if (!filters) return;
    filters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      state.filter = button.dataset.filter;
      $$("[data-filter]", filters).forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      renderProjects();
    });
  };

  const wireSearch = () => {
    const input = $("#search");
    if (!input) return;
    input.addEventListener("input", () => {
      state.query = input.value.trim().toLowerCase();
      renderProjects();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "/" && document.activeElement !== input) {
        event.preventDefault();
        input.focus();
      }
    });
  };

  const observeReveals = () => {
    const items = $$(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    items.forEach((item) => observer.observe(item));
  };

  const attachTilt = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    $$(".project-card").forEach((card) => {
      if (card.dataset.tiltReady) return;
      card.dataset.tiltReady = "true";
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rx = ((y / rect.height) - 0.5) * -4;
        const ry = ((x / rect.width) - 0.5) * 4;
        card.style.setProperty("--rx", `${rx}deg`);
        card.style.setProperty("--ry", `${ry}deg`);
        card.style.setProperty("--mx", `${x}px`);
        card.style.setProperty("--my", `${y}px`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  };

  const animateCounts = () => {
    const items = $$("[data-count]");
    if (!items.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const run = (node) => {
      const target = Number(node.dataset.count);
      const start = performance.now();
      const duration = 900;
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    items.forEach(run);
  };

  const canvasField = () => {
    const canvas = $("#field");
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let points = [];
    let pointer = { x: 0, y: 0 };
    let raf = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(28, Math.min(78, Math.floor((width * height) / 28000)));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.2 + 0.4
      }));
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const max = 132;
      for (let i = 0; i < points.length; i += 1) {
        const a = points[i];
        if (!reduced) {
          a.x += a.vx;
          a.y += a.vy;
        }
        if (a.x < -20) a.x = width + 20;
        if (a.x > width + 20) a.x = -20;
        if (a.y < -20) a.y = height + 20;
        if (a.y > height + 20) a.y = -20;
      }
      for (let i = 0; i < points.length; i += 1) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j += 1) {
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);
          if (distance > max) continue;
          const alpha = (1 - distance / max) * 0.14;
          context.strokeStyle = `rgba(200, 255, 0, ${alpha})`;
          context.lineWidth = 0.6;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
        const px = (pointer.x - width / 2) * 0.0008;
        const py = (pointer.y - height / 2) * 0.0008;
        context.fillStyle = "rgba(244, 240, 232, 0.55)";
        context.beginPath();
        context.arc(a.x + px * 10, a.y + py * 10, a.r, 0, Math.PI * 2);
        context.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", (event) => {
      pointer = { x: event.clientX, y: event.clientY };
    }, { passive: true });
    resize();
    draw();
    window.addEventListener("pagehide", () => cancelAnimationFrame(raf), { once: true });
  };

  renderMothers();
  renderFilters();
  renderProjects();
  renderEngines();
  wireFilters();
  wireSearch();
  observeReveals();
  animateCounts();
  canvasField();
})();

