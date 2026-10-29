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
