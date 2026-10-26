# BELENTANI // OMG Software Atlas

Portal de acceso al software de Pedro Belentani. No es un índice plano: es una capa frontend sobre cinco repos madres, engines externos clonados y un catálogo curado.

- **Portal:** https://belentani7.github.io/belentani-omg-portal/
- **GitHub:** https://github.com/belentani7/belentani-omg-portal
- **Inventario:** 420 repos, 132 activos, 288 archivados, 5 madres, 27 seleccionados.
- **Regla:** si no aporta una capacidad única, se archiva. Nada se borra.

## Estructura

```text
omg-software-atlas/
├─ portal/
│  ├─ index.html
│  ├─ assets/
│  │  ├─ style.css
│  │  └─ app.js
│  └─ data/
│     ├─ catalog.js
│     └─ catalog.json
├─ vendor/
│  ├─ manifest.json
│  ├─ graphify/
│  ├─ superpowers/
│  ├─ openchatx-mcp/
│  ├─ codex-free/
│  └─ swarm/
├─ PLAN.md
└─ README.md
```

`portal/data/catalog.js` es la fuente de verdad del catálogo. `catalog.json` es la exportación para consumo externo.

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

## Preview local

```powershell
npx --yes serve portal -l 4173
```

Abre `http://localhost:4173`.

También funciona abriendo `portal/index.html`, porque el catálogo se carga como JS y no depende de `fetch`.

## Deploy

El portal se publica con GitHub Pages desde `main`, carpeta raíz `/`.

```powershell
gh api --method POST /repos/belentani7/belentani-omg-portal/pages `
  -f "source[branch]=main" -f "source[path]=/"
```

Si Pages ya existe, se actualiza con `PUT` en lugar de `POST`.

## Añadir o quitar un proyecto

1. Edita `portal/data/catalog.js`.
2. Exporta el JSON:

```powershell
node -e "global.window={};require('./portal/data/catalog.js');require('fs').writeFileSync('./portal/data/catalog.json',JSON.stringify(window.OMG_CATALOG,null,2))"
```

3. Revisa que el repo sea único, tenga demo o código real y no duplique una madre.
4. Commit y push. Pages reconstruye.

## Dedupe aplicado

Se archivaron 29 repos de bajo valor o duplicados, sin borrar historia:

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

## Seguridad

- No hay claves, tokens ni contraseñas en el portal.
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
