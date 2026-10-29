(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.OMG_PUBLIC_REPOS_CORE = api;
})(typeof window === "object" ? window : null, function () {
  "use strict";

  const OWNER = "belentani7";
  const VALID_NAME = /^[A-Za-z0-9_.-]{1,100}$/;

  function fromGitHub(raw, snapshot) {
    // Reject partial, malformed, mixed-owner or private API replies. Never print their contents.
    if (!Array.isArray(raw) || raw.length === 0 || raw.length >= 100 ||
        !snapshot || !Array.isArray(snapshot.repos)) return null;
    const baseline = new Map(snapshot.repos.map((repo) => [repo.name, repo]));
    const seen = new Set();
    const repos = [];

    for (const item of raw) {
      if (!item || item.private !== false ||
          item.owner?.login?.toLowerCase() !== OWNER ||
          typeof item.name !== "string" || !VALID_NAME.test(item.name) ||
          seen.has(item.name) || !item.html_url ||
          item.html_url !== "https://github.com/" + OWNER + "/" + item.name) {
        return null;
      }
      seen.add(item.name);
      const previous = baseline.get(item.name) || {};
      const homepage = typeof item.homepage === "string" &&
        /^https?:\/\//i.test(item.homepage) ? item.homepage : "";
      repos.push({
        name: item.name,
        desc: typeof item.description === "string" ? item.description : "",
        url: item.html_url,
        homepage,
        private: false,
        fork: Boolean(item.fork),
        archived: Boolean(item.archived),
        empty: Boolean(item.size === 0),
        language: typeof item.language === "string" ? item.language : null,
        stars: Number.isSafeInteger(item.stargazers_count) && item.stargazers_count >= 0
          ? item.stargazers_count : null,
        updated: typeof item.updated_at === "string" ? item.updated_at : "",
        topics: Array.isArray(item.topics) ? item.topics.filter(x => typeof x === "string").slice(0, 20) : [],
        category: typeof previous.category === "string" ? previous.category : "products",
        // A URL is metadata, not an uptime check.
        live: Boolean(homepage)
      });
    }
    const byLanguage = {};
    for (const repo of repos) {
      const language = repo.language || "Sin lenguaje";
      byLanguage[language] = (byLanguage[language] || 0) + 1;
    }
    const totals = {
      total: repos.length,
      public: repos.length,
      private: 0,
      live: repos.filter(repo => repo.live).length,
      archived: repos.filter(repo => repo.archived).length,
      forks: repos.filter(repo => repo.fork).length,
      languages: Object.keys(byLanguage).length,
      byLanguage
    };
    return { repos, totals };
  }

  return { fromGitHub };
});
