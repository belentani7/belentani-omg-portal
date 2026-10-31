import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { generatedFiles, SERIES_COUNT, SERIES_FAMILIES } from '../scripts/generate-art-series.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const series = join(root, 'series');
const expected = generatedFiles();

test('publishes exactly 300 distinct, complete, static studies from the generator', () => {
  const pages = readdirSync(series).filter((name) => /^\d{3}\.html$/.test(name)).sort();
  assert.equal(pages.length, SERIES_COUNT);
  assert.equal(new Set(pages).size, SERIES_COUNT);
  const titles = new Set();
  const studiesPerFamily = new Map(SERIES_FAMILIES.map((family) => [family.id, 0]));
  for (const page of pages) {
    const path = join(series, page);
    const html = readFileSync(path, 'utf8');
    assert.equal(html, expected.get('series/' + page), page + ' must be reproducible from the generator');
    assert.match(html, /<html lang="es">/);
    assert.match(html, /<a class="skip-link" href="#main">/);
    assert.match(html, /<main id="main"/);
    assert.match(html, /<svg class="study-svg"[^>]+role="img" aria-labelledby=/);
    assert.match(html, /<title id="art-title-\d{3}">/);
    assert.match(html, /<desc id="art-desc-\d{3}">/);
    assert.match(html, /class="study-pagination"|class="series-pagination"/);
    assert.doesNotMatch(html, /<script\b/i, 'individual studies must remain static and make no external requests');
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    assert.ok(title);
    assert.ok(!titles.has(title), 'Every study must have a distinct document title');
    titles.add(title);
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = match[1];
      if (/^(?:https?:|mailto:|tel:|#)/i.test(href)) continue;
      const local = resolve(dirname(path), decodeURIComponent(href.split('#', 1)[0]));
      assert.ok(local.startsWith(root), page + ' contains a link outside the repository: ' + href);
      assert.ok(existsSync(local), page + ' has a missing local target: ' + href);
    }
    const familyMatch = html.match(/<p class="series-breadcrumb"><a href="\.\/index\.html">Serie generativa<\/a><span aria-hidden="true"> \/ <\/span>([^<]+)<\/p>/);
    assert.ok(familyMatch);
    const family = SERIES_FAMILIES.find((entry) => entry.name === familyMatch[1]);
    assert.ok(family);
    studiesPerFamily.set(family.id, studiesPerFamily.get(family.id) + 1);
    assert.ok(html.length > 3000, page + ' is too small to contain a complete study');
  }
  assert.equal(titles.size, SERIES_COUNT);
  for (const [family, count] of studiesPerFamily) assert.equal(count, 60, family + ' must contain 60 studies');
});

test('collection index exposes every study with keyboard-usable search and filters', () => {
  const path = join(series, 'index.html');
  const html = readFileSync(path, 'utf8');
  assert.equal(html, expected.get('series/index.html'));
  assert.equal((html.match(/href="\d{3}\.html"/g) ?? []).length, SERIES_COUNT);
  assert.match(html, /<form class="series-controls" role="search"/);
  assert.match(html, /<label for="series-search">/);
  assert.match(html, /<label for="series-filter">/);
  assert.match(html, /aria-live="polite"/);
  assert.match(readFileSync(join(root, 'assets/series-index.js'), 'utf8'), /addEventListener\('input'/);
});

test('sitemap links the public landing, atlas and all 300 generated studies', () => {
  const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
  assert.equal(sitemap, expected.get('sitemap.xml'));
  assert.equal((sitemap.match(/\/series\/\d{3}\.html/g) ?? []).length, SERIES_COUNT);
  assert.match(sitemap, /\/belentani-omg-portal\/series\/<\/loc>/);
});
