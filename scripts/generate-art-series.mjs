import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SERIES_COUNT = 300;
export const SERIES_FAMILIES = Object.freeze([
  { id: 'agents', name: 'Sistemas agénticos', short: 'AGENTES', desc: 'Señal, decisión y coordinación: geometrías para pensar sistemas que cooperan con límites explícitos.', primary: '#c8ff00', secondary: '#7b2cff' },
  { id: 'devtools', name: 'Herramientas y oficio', short: 'DEVTOOLS', desc: 'Método, interfaz y ejecución: estructuras visuales para el trabajo técnico bien delimitado.', primary: '#9be7ff', secondary: '#c8ff00' },
  { id: 'creative', name: 'Creative tech', short: 'CREATIVE', desc: 'Código, sonido y espacio: variaciones para una práctica tecnológica que también compone.', primary: '#7b2cff', secondary: '#ff3b5c' },
  { id: 'impact', name: 'Aprendizaje e impacto', short: 'IMPACTO', desc: 'Acceso, cuidado y autonomía: señales visuales alrededor de herramientas que deben servir a personas reales.', primary: '#f4b942', secondary: '#9be7ff' },
  { id: 'protocols', name: 'Protocolos y evidencia', short: 'PROTOCOLOS', desc: 'Confianza, límites y trazabilidad: mapas para distinguir intención, dato y resultado verificable.', primary: '#ff3b5c', secondary: '#f4b942' }
]);
const MOTIFS = ['Campo de señales', 'Órbita de criterio', 'Topología de rutas', 'Trama de decisión', 'Prisma de contexto', 'Líneas en latencia', 'Núcleo y periferia', 'Cartografía del umbral', 'Interfaz de ecos', 'Ritmo y restricción', 'Materia de protocolo', 'Jardín de variables', 'Conjunto de posibilidades', 'Mapa de dependencias', 'Constelación de eventos', 'Campo de tensión', 'Frontera permeable', 'Arquitectura de ruido', 'Plano de confianza', 'Sistema en pausa'];
const READINGS = [
  'El vacío no está sin usar: separa una señal de otra y deja espacio para elegir.',
  'Una ruta puede ser legible sin ser recta; sus desvíos también forman parte del sistema.',
  'El centro cambia de lugar para mostrar que una interfaz depende de quien la recorre.',
  'Las capas comparten el campo, pero cada una conserva su propio límite.',
  'El patrón se repite con pequeñas desviaciones; la diferencia mantiene viva la lectura.',
  'Una línea termina antes de cerrar el circuito. La pausa también es una decisión.',
  'Las conexiones aparecen como relaciones posibles, no como promesas de funcionamiento.',
  'El contraste ordena la mirada sin convertir el color en la única clave.',
  'Los nodos se acercan, se separan y dejan una huella que puede seguirse.',
  'Cada forma respeta el borde: el sistema no necesita ocupar todo el espacio.'
];
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = 'https://www.belentani.es/belentani-omg-portal';
const pad = (id) => String(id).padStart(3, '0');
const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

function getStudy(id) {
  const family = SERIES_FAMILIES[Math.floor((id - 1) / 60)];
  const motif = MOTIFS[((id - 1) * 7) % MOTIFS.length];
  return { id, key: pad(id), family, motif, title: motif + ' · ' + pad(id), reading: READINGS[((id - 1) * 11) % READINGS.length] };
}

function renderSvg(study) {
  const id = study.id;
  const key = study.key;
  const family = study.family;
  const cx = 500 + ((id * 67) % 241) - 120;
  const cy = 360 + ((id * 47) % 181) - 90;
  const rings = [];
  for (let i = 0; i < 11; i += 1) {
    const x = 120 + ((id * 31 + i * 97) % 760);
    const y = 80 + ((id * 53 + i * 61) % 560);
    const rx = 55 + ((id * 29 + i * 53) % 350);
    const ry = 32 + ((id * 17 + i * 31) % 220);
    const rot = ((id * 13 + i * 17) % 150) - 75;
    const color = i % 3 === 0 ? family.primary : family.secondary;
    const opacity = (0.18 + ((id + i * 7) % 6) * 0.09).toFixed(2);
    rings.push('<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" transform="rotate(' + rot + ' ' + x + ' ' + y + ')" fill="none" stroke="' + color + '" stroke-width="' + (1 + (i % 3)) + '" opacity="' + opacity + '"/>');
  }
  const paths = [];
  for (let i = 0; i < 12; i += 1) {
    const x1 = (id * 29 + i * 83) % 1000;
    const y1 = (id * 41 + i * 57) % 720;
    const c1x = (id * 37 + i * 47) % 1000;
    const c1y = (id * 23 + i * 71) % 720;
    const c2x = (id * 61 + i * 31) % 1000;
    const c2y = (id * 43 + i * 89) % 720;
    const x2 = (id * 73 + i * 19) % 1000;
    const y2 = (id * 67 + i * 37) % 720;
    const color = i % 2 === 0 ? family.primary : family.secondary;
    paths.push('<path d="M ' + x1 + ' ' + y1 + ' C ' + c1x + ' ' + c1y + ' ' + c2x + ' ' + c2y + ' ' + x2 + ' ' + y2 + '" fill="none" stroke="' + color + '" stroke-width="' + (1 + (i % 2)) + '" opacity="' + (0.2 + (i % 5) * 0.12).toFixed(2) + '"/>');
  }
  const nodes = [];
  for (let i = 0; i < 18; i += 1) {
    const x = (id * 43 + i * 79) % 940 + 30;
    const y = (id * 31 + i * 59) % 660 + 30;
    const r = 2 + (i % 4);
    const color = i % 2 ? family.secondary : family.primary;
    nodes.push('<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + color + '" opacity="' + (0.45 + (i % 4) * 0.12).toFixed(2) + '"/>');
  }
  return '<svg class="study-svg" viewBox="0 0 1000 720" role="img" aria-labelledby="art-title-' + key + ' art-desc-' + key + '" xmlns="http://www.w3.org/2000/svg"><title id="art-title-' + key + '">Estudio ' + key + ': ' + escapeHtml(study.motif) + '</title><desc id="art-desc-' + key + '">Composición generativa estática de curvas, órbitas y nodos para la familia ' + escapeHtml(family.name) + '.</desc><defs><linearGradient id="wash-' + key + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + family.primary + '" stop-opacity=".18"/><stop offset="1" stop-color="' + family.secondary + '" stop-opacity=".05"/></linearGradient><pattern id="grid-' + key + '" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" stroke-opacity=".045" stroke-width="1"/></pattern></defs><rect width="1000" height="720" fill="#08080a"/><rect width="1000" height="720" fill="url(#grid-' + key + ')"/><ellipse cx="' + cx + '" cy="' + cy + '" rx="390" ry="250" fill="url(#wash-' + key + ')"/>' + rings.join('') + paths.join('') + '<circle cx="' + cx + '" cy="' + cy + '" r="' + (30 + (id % 90)) + '" fill="none" stroke="' + family.primary + '" stroke-width="2" opacity=".75"/><circle cx="' + cx + '" cy="' + cy + '" r="5" fill="' + family.secondary + '"/>' + nodes.join('') + '</svg>';
}

export function renderStudy(id) {
  if (!Number.isInteger(id) || id < 1 || id > SERIES_COUNT) throw new RangeError('Study id must be between 1 and 300.');
  const study = getStudy(id);
  const key = study.key;
  const previous = id > 1 ? '<a rel="prev" href="' + pad(id - 1) + '.html">← Estudio anterior</a>' : '<span aria-disabled="true">Inicio de la serie</span>';
  const next = id < SERIES_COUNT ? '<a rel="next" href="' + pad(id + 1) + '.html">Estudio siguiente →</a>' : '<span aria-disabled="true">Final de la serie</span>';
  const description = 'Estudio generativo ' + key + ' de la serie BELENTANI OMG. ' + study.motif + ' · ' + study.family.name + '.';
  return [
    '<!doctype html>',
    '<html lang="es">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<meta name="color-scheme" content="dark">',
    '<meta name="theme-color" content="#050505">',
    '<meta name="description" content="' + escapeHtml(description) + '">',
    '<meta property="og:type" content="article">',
    '<meta property="og:title" content="Estudio ' + key + ' — ' + escapeHtml(study.motif) + ' | BELENTANI OMG">',
    '<meta property="og:description" content="' + escapeHtml(description) + '">',
    '<meta property="og:image" content="../assets/og.png">',
    '<link rel="canonical" href="' + BASE_URL + '/series/' + key + '.html">',
    '<link rel="icon" type="image/svg+xml" href="../assets/icon.svg">',
    '<link rel="stylesheet" href="../assets/style.css">',
    '<link rel="stylesheet" href="../assets/series.css">',
    '<title>Estudio ' + key + ' — ' + escapeHtml(study.motif) + ' | BELENTANI OMG</title>',
    '</head>',
    '<body>',
    '<div class="grain" aria-hidden="true"></div>',
    '<a class="skip-link" href="#main">Saltar al contenido</a>',
    '<header class="site-header series-header"><a class="brand" href="../index.html" aria-label="Volver al atlas BELENTANI OMG"><span class="brand-mark">B//</span><span class="brand-text">OMG ATLAS</span></a><nav class="nav" aria-label="Navegación principal"><a href="../index.html#atlas">ATLAS</a><a href="./index.html" aria-current="page">SERIE</a><a href="../repos.html">REPOS</a><a href="../graph/">GRAFO</a></nav><a class="header-cta" href="https://github.com/belentani7/belentani-omg-portal" target="_blank" rel="noopener noreferrer">CÓDIGO ↗</a></header>',
    '<main id="main" class="series-shell">',
    '<p class="eyebrow"><span class="pulse"></span> ESTUDIOS GENERATIVOS / ' + key + ' / 300</p>',
    '<p class="series-breadcrumb"><a href="./index.html">Serie generativa</a><span aria-hidden="true"> / </span>' + escapeHtml(study.family.name) + '</p>',
    '<h1>' + escapeHtml(study.motif) + ' <span class="series-number">' + key + '</span></h1>',
    '<p class="lede">' + escapeHtml(study.family.desc) + '</p>',
    '<figure class="study-frame">' + renderSvg(study) + '<figcaption><span>' + escapeHtml(study.family.short) + '</span><span>VARIACIÓN ' + key + ' / HTML ESTÁTICO</span></figcaption></figure>',
    '<section class="study-reading" aria-labelledby="reading-title"><div><p class="section-index">LECTURA / ' + key + '</p><h2 id="reading-title">Una forma de mirar el sistema.</h2><p>' + escapeHtml(study.reading) + '</p></div><dl><div><dt>Familia</dt><dd>' + escapeHtml(study.family.name) + '</dd></div><div><dt>Motivo</dt><dd>' + escapeHtml(study.motif) + '</dd></div><div><dt>Regla</dt><dd>Geometría determinista · semilla ' + key + '</dd></div><div><dt>Estado</dt><dd>Estudio generativo; no representa un producto funcional.</dd></div></dl></section>',
    '<nav class="series-pagination" aria-label="Navegación entre estudios">' + previous + '<a href="./index.html">Índice de 300</a>' + next + '</nav>',
    '</main>',
    '<footer class="footer series-footer"><div class="footer-brand"><span class="brand-mark">B//</span><p>BELENTANI<br>GENERATIVE STUDIES</p></div><p class="footer-note">Pieza estática, reproducible y accesible. Sin seguimiento ni llamadas externas.</p><div class="footer-links"><a href="../index.html">Volver al atlas ↑</a><a href="./index.html">Índice de la serie</a></div></footer>',
    '</body>',
    '</html>',
    ''
  ].join('\n');
}

export function renderSeriesIndex() {
  const groups = SERIES_FAMILIES.map((family, familyIndex) => {
    const start = familyIndex * 60 + 1;
    const items = Array.from({ length: 60 }, (_, offset) => {
      const study = getStudy(start + offset);
      const search = escapeHtml((study.title + ' ' + family.name + ' ' + family.short).toLowerCase());
      return '<li data-entry data-family="' + family.id + '" data-search="' + search + '"><a href="' + study.key + '.html"><span class="series-card-number">' + study.key + '</span><span class="series-card-title"><strong>' + escapeHtml(study.title) + '</strong><small>' + escapeHtml(family.name) + '</small></span><span class="series-card-arrow" aria-hidden="true">↗</span></a></li>';
    }).join('\n');
    return '<section class="series-group" data-series-group="' + family.id + '" aria-labelledby="group-' + family.id + '"><header><p class="section-index">' + String(familyIndex + 1).padStart(2, '0') + ' / 05 · 60 ESTUDIOS</p><h2 id="group-' + family.id + '">' + escapeHtml(family.name) + '</h2><p>' + escapeHtml(family.desc) + '</p></header><ol class="series-grid">' + items + '</ol></section>';
  }).join('\n');
  const options = SERIES_FAMILIES.map((family) => '<option value="' + family.id + '">' + escapeHtml(family.name) + '</option>').join('');
  return [
    '<!doctype html>',
    '<html lang="es">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<meta name="color-scheme" content="dark">',
    '<meta name="theme-color" content="#050505">',
    '<meta name="description" content="Índice de 300 estudios generativos estáticos del BELENTANI OMG Software Atlas, organizados en cinco familias creativas.">',
    '<meta property="og:type" content="CollectionPage">',
    '<meta property="og:title" content="300 estudios generativos — BELENTANI OMG Atlas">',
    '<meta property="og:description" content="Cinco familias. Trescientas variaciones visuales reproducibles.">',
    '<link rel="canonical" href="' + BASE_URL + '/series/">',
    '<link rel="icon" type="image/svg+xml" href="../assets/icon.svg">',
    '<link rel="stylesheet" href="../assets/style.css">',
    '<link rel="stylesheet" href="../assets/series.css">',
    '<title>300 estudios generativos — BELENTANI OMG Atlas</title>',
    '</head>',
    '<body>',
    '<div class="grain" aria-hidden="true"></div>',
    '<a class="skip-link" href="#main">Saltar al contenido</a>',
    '<header class="site-header series-header"><a class="brand" href="../index.html" aria-label="Volver al atlas BELENTANI OMG"><span class="brand-mark">B//</span><span class="brand-text">OMG ATLAS</span></a><nav class="nav" aria-label="Navegación principal"><a href="../index.html#atlas">ATLAS</a><a href="./index.html" aria-current="page">SERIE</a><a href="../repos.html">REPOS</a><a href="../graph/">GRAFO</a></nav><a class="header-cta" href="https://github.com/belentani7/belentani-omg-portal" target="_blank" rel="noopener noreferrer">CÓDIGO ↗</a></header>',
    '<main id="main" class="series-shell collection-shell">',
    '<p class="eyebrow"><span class="pulse"></span> BELENTANI // OMG / SERIE GENERATIVA</p>',
    '<h1>300 estudios.<br><span class="series-accent">Un atlas visual.</span></h1>',
    '<p class="lede">Una colección de variaciones geométricas deterministas que traduce las cinco familias públicas del atlas a formas, rutas y relaciones visuales. Son estudios artísticos; no son proyectos de software, demos ni afirmaciones de producto.</p>',
    '<div class="series-summary"><strong>300</strong><span>piezas estáticas</span><strong>05</strong><span>familias</span><strong>0</strong><span>llamadas externas</span></div>',
    '<form class="series-controls" role="search" onsubmit="return false"><label for="series-search">Buscar estudios</label><input id="series-search" type="search" placeholder="Número, motivo o familia" autocomplete="off"><label for="series-filter">Familia</label><select id="series-filter"><option value="">Todas las familias</option>' + options + '</select><p id="series-status" role="status" aria-live="polite">300 estudios disponibles.</p></form>',
    groups,
    '</main>',
    '<footer class="footer series-footer"><div class="footer-brand"><span class="brand-mark">B//</span><p>BELENTANI<br>GENERATIVE STUDIES</p></div><p class="footer-note">Contenido generado desde scripts/generate-art-series.mjs. Las piezas mantienen el lenguaje visual del atlas.</p><div class="footer-links"><a href="../index.html">Volver al atlas ↑</a><a href="../repos.html">Repos públicos</a></div></footer>',
    '<script src="../assets/series-index.js" defer></script>',
    '</body>',
    '</html>',
    ''
  ].join('\n');
}

export function renderSitemap() {
  const urls = [BASE_URL + '/', BASE_URL + '/repos.html', BASE_URL + '/graph/', BASE_URL + '/series/'];
  for (let id = 1; id <= SERIES_COUNT; id += 1) urls.push(BASE_URL + '/series/' + pad(id) + '.html');
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map((url) => '  <url><loc>' + url + '</loc><lastmod>2026-10-31</lastmod></url>').join('\n') + '\n</urlset>\n';
}

export function generatedFiles() {
  const files = new Map();
  for (let id = 1; id <= SERIES_COUNT; id += 1) files.set('series/' + pad(id) + '.html', renderStudy(id));
  files.set('series/index.html', renderSeriesIndex());
  files.set('sitemap.xml', renderSitemap());
  return files;
}

function run() {
  const check = process.argv.includes('--check');
  const files = generatedFiles();
  const differences = [];
  for (const [relativePath, content] of files) {
    const path = join(ROOT, relativePath);
    if (check) {
      if (!existsSync(path) || readFileSync(path, 'utf8') !== content) differences.push(relativePath);
    } else {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content, 'utf8');
    }
  }
  if (differences.length) throw new Error('Generated art series is out of date: ' + differences.join(', '));
  console.log(check ? 'Art series verified: 300 studies.' : 'Generated art series: 300 studies.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    run();
  } catch (error) {
    console.error('Art series generation failed: ' + error.message);
    process.exitCode = 1;
  }
}
