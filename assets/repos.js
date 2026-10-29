(function () {
  "use strict";

  const DATA = window.OMG_REPOS;
  if (!DATA) return;

  const CATEGORY_LABELS = {
    all: "Todas",
    agents: "Agentes / IA",
    devtools: "Devtools",
    creative: "Creative / music",
    impact: "Educación / impacto",
    protocols: "Evidencia / seguridad",
    products: "Productos / web",
    archive: "Archivo",
  };

  const state = {
    query: "",
    category: "all",
    language: "all",
    visibility: "all",
    sort: "updated",
    shown: 80,
  };

  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));

  const esc = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));

  const safeUrl = (value) => {
    if (!value) return "";
    try {
      const url = new URL(value, window.location.href);
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
    } catch {
      return "";
    }
  };

  const formatDate = (value) => {
    if (!value) return "Fecha no verificada";
    try {
      return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(new Date(value));
    } catch {
      return value;
    }
  };

  const countBy = (items, key) => items.reduce((acc, repo) => {
    const name = repo[key] || (key === "language" ? "Sin lenguaje" : "products");
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const applyStats = () => {
    $$("[data-total]").forEach((node) => { node.textContent = String(DATA.totals.total); });
    $$("[data-public]").forEach((node) => { node.textContent = String(DATA.totals.public); });
    $$("[data-live]").forEach((node) => { node.textContent = String(DATA.totals.live); });
    $$("[data-archived]").forEach((node) => { node.textContent = String(DATA.totals.archived); });
    $$("[data-generated]").forEach((node) => { node.textContent = DATA.generated; });
  };

  const applyFilters = () => {
    const category = $("#repo-category");
    const language = $("#repo-language");
    if (!category || !language) return;
    // Rebuild options when anonymous public GitHub metadata refreshes the snapshot.
    category.replaceChildren(category.querySelector('option[value="all"]'));
    language.replaceChildren(language.querySelector('option[value="all"]'));
    const categoryCounts = countBy(DATA.repos, "category");
    const languageCounts = countBy(DATA.repos, "language");

    Object.entries(CATEGORY_LABELS)
      .filter(([key]) => key === "all" || categoryCounts[key])
      .forEach(([key, label]) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = `${label} (${categoryCounts[key] || 0})`;
        category.append(option);
      });

    Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([key, count]) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = `${key} (${count})`;
        language.append(option);
      });
    if (![...category.options].some(option => option.value === state.category)) state.category = "all";
    if (![...language.options].some(option => option.value === state.language)) state.language = "all";
    category.value = state.category;
    language.value = state.language;
  };

  const matches = (repo) => {
    if (state.category !== "all" && repo.category !== state.category) return false;
    if (state.language !== "all" && (repo.language || "Sin lenguaje") !== state.language) return false;
    if (state.visibility === "public" && repo.private) return false;
    if (state.visibility === "live" && !repo.live) return false;
    if (state.visibility === "archived" && !repo.archived) return false;
    if (state.visibility === "fork" && !repo.fork) return false;
    if (!state.query) return true;
    const haystack = [
      repo.name,
      repo.desc,
      repo.category,
      CATEGORY_LABELS[repo.category] || "",
      repo.language || "",
      ...(repo.topics || []),
    ].join(" ").toLowerCase();
    return haystack.includes(state.query);
  };

  const sortRepos = (repos) => {
    const sorted = [...repos];
    switch (state.sort) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "stars":
        return sorted.sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
      case "language":
        return sorted.sort((a, b) => (a.language || "zz").localeCompare(b.language || "zz") || a.name.localeCompare(b.name));
      default:
        return sorted.sort((a, b) => b.updated.localeCompare(a.updated));
    }
  };

  const badge = (label, className) => `<span class="badge ${className}">${esc(label)}</span>`;

  const render = () => {
    const list = $("#repo-list");
    const empty = $("#repo-empty");
    const count = $("#repo-count");
    const more = $("#repo-more");
    if (!list) return;

    const filtered = sortRepos(DATA.repos.filter(matches));
    const visible = filtered.slice(0, state.shown);
    list.innerHTML = visible.map((repo) => {
      const repoUrl = safeUrl(repo.url);
      const live = safeUrl(repo.homepage);
      const topics = (repo.topics || []).slice(0, 5);
      return `
        <article class="repo-row">
          <div>
            <a class="repo-name" href="${esc(repoUrl)}" target="_blank" rel="noreferrer">
              ${esc(repo.name)}
              <span class="repo-badges">
                                ${repo.live ? badge("Web declarada", "badge-live") : ""}
                ${repo.archived ? badge("Archivado", "badge-archived") : ""}
                ${repo.fork ? badge("Fork", "badge-fork") : ""}
              </span>
            </a>
            ${repo.desc ? `<p class="repo-desc">${esc(repo.desc)}</p>` : ""}
            ${topics.length ? `<div class="repo-topics">${topics.map((topic) => `<span>#${esc(topic)}</span>`).join("")}</div>` : ""}
          </div>
          <div class="repo-meta">
            <span><strong>${esc(repo.language || "Sin lenguaje")}</strong></span>
            <span>${esc(formatDate(repo.updated))}</span>
            <span>${Number.isFinite(repo.stars) ? `${repo.stars} ★` : "★ sin dato"}</span>
            <span>${esc(CATEGORY_LABELS[repo.category] || repo.category)}</span>
          </div>
          <div class="repo-links">
            ${repoUrl ? `<a href="${esc(repoUrl)}" target="_blank" rel="noreferrer">GitHub ↗</a>` : ""}
            ${live ? `<a class="is-live" href="${esc(live)}" target="_blank" rel="noreferrer" title="URL declarada en GitHub; disponibilidad no verificada">Web declarada ↗</a>` : ""}
                      </div>
        </article>
      `;
    }).join("");

    if (empty) empty.hidden = filtered.length !== 0;
    if (count) {
      count.textContent = filtered.length === DATA.repos.length
        ? `${DATA.repos.length} repositorios`
        : `${filtered.length} de ${DATA.repos.length} repositorios`;
    }
    if (more) more.hidden = state.shown >= filtered.length;
  };

  const persist = () => {
    const params = new URLSearchParams();
    if (state.query) params.set("q", state.query);
    if (state.category !== "all") params.set("cat", state.category);
    if (state.language !== "all") params.set("lang", state.language);
    if (state.visibility !== "all") params.set("state", state.visibility);
    if (state.sort !== "updated") params.set("sort", state.sort);
    const url = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`;
    window.history.replaceState(null, "", url);
  };

  const restore = () => {
    const params = new URLSearchParams(window.location.search);
    state.query = params.get("q") || "";
    state.category = params.get("cat") || "all";
    state.language = params.get("lang") || "all";
    state.visibility = params.get("state") || "all";
    state.sort = params.get("sort") || "updated";
  };

  const bind = () => {
    const search = $("#repo-search");
    const category = $("#repo-category");
    const language = $("#repo-language");
    const visibility = $("#repo-visibility");
    const sort = $("#repo-sort");
    const more = $("#repo-more");
    const reset = $("#repo-reset");
    const emptyReset = $("#repo-empty-reset");

    if (search) {
      search.value = state.query;
      let timer;
      search.addEventListener("input", () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          state.query = search.value.trim().toLowerCase();
          state.shown = 80;
          persist();
          render();
        }, 120);
      });
    }

    const wire = (element, key, parse) => {
      if (!element) return;
      element.value = state[key];
      element.addEventListener("change", () => {
        state[key] = parse ? parse(element.value) : element.value;
        state.shown = 80;
        persist();
        render();
      });
    };

    wire(category, "category");
    wire(language, "language");
    wire(visibility, "visibility");
    wire(sort, "sort");

    if (more) {
      more.addEventListener("click", () => {
        state.shown += 80;
        render();
      });
    }

    const clear = () => {
      state.query = "";
      state.category = "all";
      state.language = "all";
      state.visibility = "all";
      state.sort = "updated";
      state.shown = 80;
      if (search) search.value = "";
      if (category) category.value = "all";
      if (language) language.value = "all";
      if (visibility) visibility.value = "all";
      if (sort) sort.value = "updated";
      persist();
      render();
      search?.focus();
    };
    reset?.addEventListener("click", clear);
    emptyReset?.addEventListener("click", clear);
  };

  // Optional anonymous refresh: the complete, public GitHub API listing can
  // enrich the published snapshot. Network errors, rate limits and partial pages
  // must never hide the offline-friendly fallback.
  const refreshPublic = async () => {
    const core = window.OMG_PUBLIC_REPOS_CORE;
    if (!core || typeof window.fetch !== "function") return;
    const status = $("#repo-source");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 6500);
    try {
      const response = await window.fetch(
        "https://api.github.com/users/belentani7/repos?type=owner&per_page=100&sort=updated",
        {
          method: "GET",
          headers: { Accept: "application/vnd.github+json" },
          credentials: "omit",
          mode: "cors",
          cache: "no-store",
          signal: controller.signal
        }
      );
      if (!response.ok) return;
      const payload = await response.json();
      const refreshed = core.fromGitHub(payload, DATA);
      if (!refreshed) return;
      DATA.repos = refreshed.repos;
      DATA.totals = refreshed.totals;
      applyStats();
      applyFilters();
      render();
      if (status) status.textContent = "Datos públicos actualizados desde GitHub. Sin claves ni acceso a repositorios privados.";
    } catch {
      // Keep the verified static catalog usable when network/API access fails.
    } finally {
      window.clearTimeout(timeout);
    }
  };

  restore();
  applyStats();
  applyFilters();
  bind();
  render();
  void refreshPublic();
})();
