import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const index = JSON.parse(read("data/repos.json"));
const curated = JSON.parse(read("data/catalog.json"));
const script = read("data/repos.js");
const html = read("repos.html");
const generator = read("scripts/generate-repos.mjs");

test("public index does not publish private repository metadata", () => {
  assert.equal(index.scope, "public-only");
  assert.equal(index.totals.private, 0);
  assert.equal(index.totals.total, index.repos.length);
  assert.equal(index.totals.public, index.repos.length);
  assert.equal(index.totals.archived, index.repos.filter(r => r.archived).length);
  assert.equal(new Set(index.repos.map(r => r.name)).size, index.repos.length);
  for (const r of index.repos) {
    assert.equal(r.private, false, "Private entry in public export");
    assert.match(r.url, /^https:\/\/github\.com\/belentani7\/[A-Za-z0-9_.-]+$/);
  }
});

test("browser JavaScript serves the same privacy-safe data as JSON", () => {
  const prefix = "window.OMG_REPOS = ";
  const start = script.indexOf(prefix);
  assert.notEqual(start, -1);
  const payload = JSON.parse(script.slice(start + prefix.length).trim().replace(/;$/, ""));
  assert.deepEqual(payload, index);
});

test("regeneration filters private repositories before any export", () => {
  assert.match(generator, /\.filter\(repo => !repo\.isPrivate\)/);
  assert.match(generator, /scope:\s*["']public-only["']/);
});

test("curated navigation is consistent with the public source catalog", () => {
  assert.equal(curated.scope, "public-only");
  assert.equal(curated.totals.repos, index.totals.total);
  assert.equal(curated.totals.active, index.repos.filter(r => !r.archived).length);
  assert.equal(curated.totals.archived, index.totals.archived);
  for (const group of [curated.mothers, curated.projects, curated.engines]) {
    for (const entry of group) {
      if (!entry.repo || !entry.repo.startsWith("https://github.com/belentani7/")) continue;
      const name = entry.repo.split("/").pop();
      assert.ok(index.repos.some(r => r.name === name), "Curated link must be public");
    }
  }
});

test("public HTML does not misrepresent private repositories or live demos", () => {
  assert.match(html, /repositorios p[uú]blicos/i);
  assert.doesNotMatch(html, /Los repos privados aparecen/i);
  assert.match(html, /URL declarada|web declarada/i);
});

test("anonymous metadata enrichment accepts only public owner repositories", async () => {
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);
  const core = require("../assets/public-repos-core.js");
  const publicEntry = (name, extra = {}) => ({
    name,
    owner: { login: "belentani7" },
    html_url: "https://github.com/belentani7/" + name,
    private: false,
    archived: false,
    fork: false,
    language: "TypeScript",
    stargazers_count: 0,
    description: "Real public project",
    homepage: "https://example.com",
    updated_at: "2026-10-29T08:00:00Z",
    topics: ["open-source"],
    size: 24,
    ...extra
  });
  const sample = [publicEntry("ManosAbiertas"), publicEntry("Belentani.cv-ai", { archived: true })];
  const result = core.fromGitHub(sample, index);
  assert.ok(result);
  assert.equal(result.totals.total, 2);
  assert.equal(result.totals.public, 2);
  assert.equal(result.totals.private, 0);
  assert.equal(result.totals.archived, 1);
  assert.equal(result.totals.live, 2);
  assert.equal(result.repos[0].category, "impact");
  assert.deepEqual(result.repos[0].topics, ["open-source"]);
  assert.equal(result.repos[0].desc, "Real public project");
  assert.equal(result.repos[0].private, false);
  assert.deepEqual(result.repos[0].url, "https://github.com/belentani7/ManosAbiertas");

  assert.equal(core.fromGitHub([publicEntry("Private", { private: true })], index), null);
  assert.equal(core.fromGitHub([publicEntry("Other", { owner: { login: "another-account" } })], index), null);
  assert.equal(core.fromGitHub([publicEntry("Wrong", { html_url: "https://example.com/wrong" })], index), null);
  assert.equal(core.fromGitHub([publicEntry("Bad", { name: "<script>" })], index), null);
  assert.equal(core.fromGitHub([publicEntry("Duplicate"), publicEntry("Duplicate")], index), null);
  assert.equal(core.fromGitHub(Array.from({ length: 100 }, (_, i) => publicEntry("p" + i)), index), null);
  assert.equal(core.fromGitHub([], index), null);
});

test("live refresh has privacy-safe scripts and a visible, accessible offline fallback", () => {
  const browser = read("assets/repos.js");
  const page = read("repos.html");
  assert.match(page, /src="\.\/assets\/public-repos-core\.js"/);
  assert.match(page, /id="repo-source" role="status" aria-live="polite"/);
  assert.match(browser, /core\.fromGitHub\(payload, DATA\)/);
  assert.match(browser, /credentials: "omit"/);
  assert.match(browser, /if \(!response\.ok\) return/);
  assert.match(browser, /if \(!refreshed\) return/);
  assert.match(browser, /catch \{/);
  assert.doesNotMatch(browser, /Authorization|Bearer |api[_-]?key/i);
});

test("dynamic filter options cannot duplicate All or resurrect private filters", () => {
  const browser = read("assets/repos.js");
  const page = read("repos.html");
  assert.match(browser, /key !== "all" && categoryCounts\[key\]/);
  assert.match(browser, /\["all", "public", "live", "archived", "fork"\]\.includes\(requestedState\)/);
  assert.doesNotMatch(page, /<option value="private">/);
});
