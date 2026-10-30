#!/usr/bin/env node
/**
 * Export del catálogo OMG (protocolo 11 del ecosistema Belentani).
 *
 * Genera data/catalog.json a partir de data/catalog.js (fuente de verdad del
 * catálogo curado). Es el equivalente en archivo del comando documentado en el
 * README; el índice público de repos (data/repos.json) se genera aparte con
 * `node scripts/generate-repos.mjs`, que requiere `gh` autenticado.
 *
 * Uso: node scripts/export.js
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

global.window = {};
require(path.join(root, "data", "catalog.js"));

const catalog = global.window.OMG_CATALOG;
if (!catalog || typeof catalog !== "object") {
  console.error("data/catalog.js no expone window.OMG_CATALOG");
  process.exit(1);
}
if (catalog.scope !== "public-only") {
  console.error(`scope inesperado: ${JSON.stringify(catalog.scope)}; se esperaba "public-only"`);
  process.exit(1);
}

const outPath = path.join(root, "data", "catalog.json");
fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2), "utf8");

const totals = catalog.totals || {};
console.log(
  `catalog: ${totals.repos ?? "?"} repos · ${totals.active ?? "?"} activos · ` +
    `${totals.archived ?? "?"} archivados · exportado a data/catalog.json (scope ${catalog.scope})`,
);
