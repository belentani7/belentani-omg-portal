# Plan de ejecución — OMG Software Atlas

**Objetivo:** reducir 419 repos a una arquitectura de 1 portal + 4 madres, clonar los engines que aportan capacidad real, deduplicar por API y publicar un HTML que sea la puerta de entrada a todo.

**Principio:** archivar antes que borrar. Renombrar antes que duplicar. Un enlace directo antes que una copia muerta.

## Inventario de partida

| Métrica | Valor |
|---|---:|
| Repos totales | 419 |
| Públicos | 92 |
| Privados | 327 |
| Activos | 160 |
| Archivados | 259 |
| Madres objetivo | 5 |
| Engines externos | 5 |

## Fase 0 — Inventario y criterio

- [x] Leer auditoría, repos y metadatos.
- [x] Separar flagships, duplicados, clientes, experimentos y archivo.
- [x] Definir criterio OMG: capacidad única, demo/código real, historia técnica, uso claro, señal/ruido.
- [x] Detectar nombres libres para las madres y el portal.

## Fase 1 — Engines

- [x] Clonar `Graphify-Labs/graphify` en `vendor/graphify` (`dac0634`).
- [x] Clonar `obra/superpowers` en `vendor/superpowers` (`2ce8aa1`).
- [x] Clonar `XiaoPuOuO/openchatx-mcp` en `vendor/openchatx-mcp` (`8e401ef`), el "turn ChatGPT into local agent".
- [x] Clonar `hypnguyen1209/codex-free` en `vendor/codex-free` (`3085b91`), el "turn ChatGPT into Codex".
- [x] Clonar `belentani7/swarm` en `vendor/swarm` (`69b1a11`), el prototipo.
- [x] Fijar commits, licencias y URLs en `vendor/manifest.json`.
- [x] Ejecutar Graphify sobre el workspace con Python 3.12/uv y guardar `graph/` (35 nodos, 29 edges, 6 comunidades).

## Fase 2 — Portal

- [x] Crear `index.html` con hero, manifiesto, madres, atlas, engines y dedupe.
- [x] Crear `assets/style.css` con estética OMG, responsive y reduced-motion.
- [x] Crear `assets/app.js` con búsqueda, filtros, tilt, reveal, contadores y canvas.
- [x] Crear `data/catalog.js` con 25 proyectos curados y 5 engines.
- [x] Exportar `data/catalog.json`.
- [x] Añadir metadatos, Open Graph, favicon y JSON-LD.
- [x] Crear repo `belentani-omg-portal`.
- [x] Publicar en GitHub Pages en `main` raíz `/`.
- [x] Verificar en móvil (390px) y desktop (1440px) con Puppeteer, sin overflow ni errores de consola.

## Fase 3 — Madres

- [x] Renombrar `NOIACORE` → `backend_aportaciones_software01`.
- [x] Renombrar `agent-toolkit` → `backend_aportaciones_software02`.
- [x] Renombrar `music-os` → `backend_aportaciones_software03`.
- [x] Renombrar `negocio-automatizacion` → `backend_aportaciones_software04`.
- [x] Añadir `MOTHER.md` a cada madre con familia, portal y política.
- [x] Actualizar descripción, homepage y topics de cada madre.
- [x] Marcar relaciones: 01 agentes, 02 devtools, 03 creative, 04 negocio.
- [ ] Evaluar mover submodules o paquetes compartidos a las madres en una segunda pasada.

## Fase 4 — Dedupe

- [x] Archivar 29 repos duplicados o sin señal.
- [x] Conservar repos con homepage activa.
- [x] Conservar flagships con demo: CARQUIDEC, belentani.es, heyduck, ManosAbiertas, WILLIAMSCHOOL, lingua, nexus, CV.
- [x] Documentar rollback por repo.
- [ ] Revisar 131 activos restantes y proponer segunda tanda solo con evidencia.
- [ ] Añadir topics de archivo/estado donde aporte.

## Fase 5 — Publicación

- [x] Crear repo público `belentani-omg-portal`.
- [x] Push de `index.html`, `assets/`, `data/`, `README.md`, `PLAN.md`, `vendor/manifest.json`.
- [x] Activar Pages desde `main` `/`.
- [x] Verificar `https://www.belentani.es/belentani-omg-portal/`.
- [x] Añadir homepage del portal a las cuatro madres.
- [x] Verificar redirecciones de los nombres antiguos.

## Fase 6 — Seguridad y cierre

- [x] Confirmar que el portal no contiene secretos.
- [x] Confirmar que los engines no se publicaron dentro del repo del portal.
- [x] Confirmar que no se rompió ninguna homepage.
- [x] Reportar rotaciones pendientes (PrestaShop, Google antigua, OpenRouter/Groq).
- [x] Reportar estado final: 420 repos, 132 activos, 288 archivados, 5 madres.

## API aplicada

```powershell
# Renombrar
gh api --method PATCH /repos/belentani7/NOIACORE -f name=backend_aportaciones_software01

# Archivar
'{"archived":true}' | gh api --method PATCH /repos/belentani7/REPO --input -

# Restaurar
'{"archived":false}' | gh api --method PATCH /repos/belentani7/REPO --input -

# Topics
gh api --method PUT /repos/belentani7/REPO/topics -f names[]=omg -f names[]=belentani
```

## Rollback

1. **Archivo:** `archived:false` por repo; no se pierde historia.
2. **Renombre:** PATCH con el nombre anterior; GitHub mantiene redirect temporal.
3. **Portal:** desactivar Pages o revertir el commit; el catálogo es un solo archivo.
4. **Engines:** `vendor/` se puede borrar y reclonar desde `vendor/manifest.json`.

## Criterio de aceptación

- Portal accesible y navegable en desktop y móvil.
- 5 madres con nombre canónico y enlace al portal.
- 25 proyectos curados con enlaces válidos.
- 29 repos archivados sin romper homepages.
- Cero secretos en el repo del portal.
- Un comando documentado para preview, deploy y rollback.
