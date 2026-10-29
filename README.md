# BELENTANI // OMG Software Atlas

Portal de acceso al software de Pedro Belentani. No es un índice plano: es una capa frontend sobre cinco repos madres, engines externos clonados y un catálogo curado.

- **Portal:** https://www.belentani.es/belentani-omg-portal/
- **GitHub:** https://github.com/belentani7/belentani-omg-portal
- **Inventario navegable (29-10-2026):** 94 repositorios **públicos** (79 activos, 15 archivados). El resto de proyectos de la cuenta no se incluye en archivos estáticos públicos. Las cinco madres y los 25 destacados son una curaduría distinta.
- **Regla:** no publicar nombres, descripciones ni URLs de repositorios privados; preservar su historial y acceso restringido.

## Índice completo de repositorios

Además del atlas curado, el portal incluye un buscador de los **repositorios públicos** de `belentani7`. No es una lista de proyectos privados:

- **URL:** https://www.belentani.es/belentani-omg-portal/repos.html
- **Datos:** `data/repos.js` / `data/repos.json` (94 registros públicos, 15 archivados y 24 con URL web declarada; disponibilidad web no verificada).
- **Generación:** `node scripts/generate-repos.mjs` (usa `gh repo list`, filtra los registros privados **antes** de escribir archivos públicos y no infiere disponibilidad web).
- **Filtros:** texto, categoría, lenguaje, web declarada/archivado/fork y orden. No existe búsqueda pública de privados.
- **Actualización progresiva:** al abrir `repos.html`, el navegador puede consultar de forma **anónima** `https://api.github.com/users/belentani7/repos?type=owner&per_page=100&sort=updated`. Solo se aceptan respuestas completas de repositorios públicos propiedad de `belentani7`; las respuestas privadas, parciales o no válidas se descartan. La instantánea estática sigue disponible sin red y no requiere tokens.
- **Privacidad del visitante:** esta consulta opcional contacta directamente a GitHub y está sujeta a sus límites de API y políticas de privacidad; no se envían credenciales ni ficheros del visitante. El campo «web declarada» refleja la URL indicada por el propietario del repositorio y **no** constituye una prueba de disponibilidad.
- **Regresión:** `node --test tests/catalog-public-only.test.mjs` y el workflow `atlas-public-catalog.yml` verifican que las salidas estáticas no incluyan repositorios privados, que la API pública se trate con validación estricta y que el navegador conserve un modo sin conexión.
- **Enlace compartido:** la URL guarda `q`, `cat`, `lang`, `state` y `sort`.

## Estructura

```text
belentani-omg-portal/
├─ index.html
├─ assets/
│  ├─ style.css
│  ├─ app.js
│  ├─ icon.svg
│  └─ og.png
├─ data/
│  ├─ catalog.js
│  └─ catalog.json
├─ graph/
│  ├─ index.html
│  ├─ graph.json
│  └─ GRAPH_REPORT.md
├─ vendor/
│  ├─ manifest.json
│  ├─ graphify/
│  ├─ superpowers/
│  ├─ openchatx-mcp/
│  ├─ codex-free/
│  └─ swarm/
├─ .nojekyll
├─ PLAN.md
├─ DEDUPE.md
└─ README.md
```

`data/catalog.js` es la fuente de verdad del catálogo. `data/catalog.json` es la exportación para consumo externo.

## Las cinco madres

| # | Repo | Familia | Antes |
|---|---|---|---|
| 00 | `belentani-omg-portal` | Frontend / acceso | nuevo |
| 01 | `backend_aportaciones_software01` | AI Systems & Orchestration | NOIACORE |
| 02 | `backend_aportaciones_software02` | Devtools & Skills | agent-toolkit |
| 03 | `backend_aportaciones_software03` | Creative & Music OS | music-os |
| 04 | `backend_aportaciones_software04` | Business & Automation | negocio-automatizacion |

Las cuatro madres ya eran repos unificados: 57 repos aplanados en 02, 7 proyectos en 03 y 16 en 04. No se duplicó código dentro del portal; el portal es la capa de acceso y las madres conservan la implementación.

## Engines clonados

| Engine | Repo | Commit | Licencia | Rol |
|---|---|---|---|---|
| Graphify | `Graphify-Labs/graphify` | `dac0634` | Apache-2.0 | Knowledge graph / AST local |
| Superpowers | `obra/superpowers` | `2ce8aa1` | MIT | Metodología y skills de agentes |
| OpenChatX | `XiaoPuOuO/openchatx-mcp` | `8e401ef` | MIT | ChatGPT como agente local |
| Codex-Free | `hypnguyen1209/codex-free` | `3085b91` | MIT | Puente ChatGPT → Codex |
| Swarm | `belentani7/swarm` | `69b1a11` | MIT | Prototipo de enjambre |

Los clones viven en `vendor/` y están excluidos del repo del portal. `vendor/manifest.json` fija URLs, commits, licencias y rol para reproducirlos.

```powershell
git clone --depth 1 https://github.com/Graphify-Labs/graphify.git vendor/graphify
git clone --depth 1 https://github.com/obra/superpowers.git vendor/superpowers
git clone --depth 1 https://github.com/XiaoPuOuO/openchatx-mcp.git vendor/openchatx-mcp
git clone --depth 1 https://github.com/hypnguyen1209/codex-free.git vendor/codex-free
git clone --depth 1 https://github.com/belentani7/swarm.git vendor/swarm
```

## Knowledge graph

El portal incluye una visualización interactiva generada con Graphify sobre su propio código.

- **URL:** https://www.belentani.es/belentani-omg-portal/graph/
- **Grafo:** 35 nodos, 29 edges, 6 comunidades.
- **Fuente:** `graph/index.html`, `graph/graph.json`, `graph/GRAPH_REPORT.md`.
- **Reproducir:** `graphify update . --no-cluster` y `graphify cluster-only . --no-label` con el runtime fijado en `vendor/manifest.json`.

## Preview local

```powershell
npx --yes serve . -l 4173
```

Abre `http://localhost:4173`.

También funciona abriendo `index.html`, porque el catálogo se carga como JS y no depende de `fetch`.

## Deploy

El portal se publica con GitHub Pages desde `main`, carpeta raíz `/`.

```powershell
gh api --method POST /repos/belentani7/belentani-omg-portal/pages `
  -f "source[branch]=main" -f "source[path]=/"
```

Si Pages ya existe, se actualiza con `PUT` en lugar de `POST`.

## Añadir o quitar un proyecto

1. Edita `data/catalog.js`.
2. Exporta el JSON:

```powershell
node -e "global.window={};require('./data/catalog.js');require('fs').writeFileSync('./data/catalog.json',JSON.stringify(window.OMG_CATALOG,null,2))"
```

3. Revisa que el repo sea único, tenga demo o código real y no duplique una madre.
4. Commit y push. Pages reconstruye.

## Dedupe aplicado

Se archivaron 29 repos de bajo valor o duplicados, sin borrar historia. El detalle está en `DEDUPE.md`.

- Iteraciones DUCK antiguas y snapshots privados.
- Portfolios y demos duplicados.
- Routers/skills duplicados (`meta-skill`, `premium-effects`).
- Prototipos Mimo antiguos.
- Experimentos musicales absorbidos por `music-os` o `ia-creativa-lab`.
- Sitios de cliente sin señal OMG.
- Automatizaciones absorbidas por `backend_aportaciones_software04`.

Los repos con homepage activa se conservaron. Los archivados quedan en solo lectura y pueden restaurarse:

```powershell
'{"archived":false}' | gh api --method PATCH /repos/belentani7/REPO --input -
```

## Coherencia

El chequeo de enlaces, demos y diseño educativo está en [COHERENCE.md](./COHERENCE.md). Incluye el caso de `ManosAbiertas`, que apuntaba a otro producto, y las demos retiradas hasta que vuelvan a estar verdes.

## Seguridad

- No hay claves, tokens ni contraseñas en el portal.
- Los repos privados no se listan en el catálogo público; se acceden desde GitHub con permisos.
- No se tocaron los secretos de los repos; las alertas de DEV-TOOLKIT siguen requiriendo rotación manual.
- Los engines externos se clonaron por HTTPS y se fijaron por commit.
- No se publican binarios, `node_modules` ni artefactos de build.

## Criterio OMG

Un proyecto entra si cumple al menos tres:

1. Capacidad única o difícil de replicar.
2. Código o demo real, no solo una landing.
3. Historia técnica propia.
4. Uso claro: agentes, música, educación, negocio o protocolo.
5. Buena relación señal/ruido.

Lo que no cumple se queda fuera del atlas y, si duplica, se archiva.
