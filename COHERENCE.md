# Chequeo de coherencia — 2026-10-26

Alcance: 25 proyectos públicos del portal, 12 demos en vivo y los repos madre. Comprobación con navegador real (Puppeteer), HTTP, metadatos y API de GitHub. Sin clones masivos.

## Resultado

| Proyecto | Estado | Hallazgo | Acción |
|---|---|---|---|
| `ManosAbiertas` | **Roto** | `manosabiertas.vercel.app` entrega **“Manos Abiertas \| Comercio Internacional”**, otro producto. El README dice que la demo educativa está pendiente. | Demo retirada del portal; queda código y estado `demo pendiente`. |
| `linguaforge` | **Inestable** | Producto correcto, pero la web devuelve **402** y texto negro sobre fondo oscuro. | Demo retirada; queda código y estado `demo en revisión`. |
| `keyrotor` | **Inestable** | Error JS `Unexpected token '<'`; la plataforma no entrega la app. | Demo retirada; queda código y estado `demo en revisión`. |
| `WILLIAMSCHOOL` | **Corregido** | El portal usaba `williamschool-livid.vercel.app`; el repo declara `williamschool.vercel.app`. | Enlace actualizado al dominio oficial. |
| `lingua-aberta` | Parcial | Varias llamadas API devuelven 404; la página principal carga. | Se mantiene; incidencia anotada. |
| `judas-experience` | Parcial | `assets/artist-skin.css` se sirve como `text/plain` y una navegación agota el timeout. El hub y el OS cargan. | Se mantiene; incidencia anotada. |
| `nexus-os` | Parcial | Un recurso local devuelve 404; el OS carga. | Se mantiene. |
| `nexus-machine-ops` | Privado | La entrada es un login; no hay demo pública directa. | Se mantiene como sistema privado. |
| `CARQUIDEC`, `belentani.es`, `heyduck`, `Belentani.cv-ai` | OK | 200, producto correcto, sin errores de consola relevantes. | Sin cambios. |

## Educación y neón

- `ManosAbiertas`: diseño claro, neutro, sin neón; patrón educativo correcto. No se publica porque no hay despliegue educativo válido.
- `WILLIAMSCHOOL`: interfaz clara y estructura escolar; sin neón.
- `lingua-aberta`: interfaz clara, progresión CEFR; sin neón.
- `linguaforge`: dark UI con contraste insuficiente; no cumple patrón educativo. Retirado de demos hasta rediseño.
- El portal mantiene su identidad oscura para el atlas, pero los sistemas educativos no se presentan como neón.

## Judas / comics

No existe un repositorio ni una rama llamada `comics` en `belentani7`. El corpus real es:

- `judas-experience@main`: **59 archivos, 427 KB**, hub WebGL, `os.html`, música, tests y key art. Es la versión más completa.
- Ramas `release/*`, `build/static*`, `consolidate/*`: 45–47 archivos, 305–306 KB; son versiones anteriores o de build, no superiores.
- `feat/instagram-spotify-integration-audit`: mismo tamaño que `main`; `main` ya integra el portal musical.
- `belentani.es@main`: seis capítulos inmersivos, escenas y canon `judas-canon`.
- `judas-experience-expanded`: archivado; no añade archivos de comic utilizables.
- `judas-omega-versiones`: backup vacío/incompleto.
- `backend_aportaciones_software02/.../judas-storyboard`: storyboard de videoclip (15 escenas), no páginas de comic.

**Mejor base para una versión completa:** `judas-experience@main` + los seis capítulos de `belentani.es@main`. No hay que fusionar ramas antiguas: main ya contiene la versión superior.

## CI Judas

Los workflows de `judas-experience` están en **failure** por una causa externa:

> “The job was not started because recent account payments have failed or your spending limit needs to be increased.”

No es un fallo de código ni de tests. Los jobs ni siquiera arrancan. Para volver a “push verde” hay que resolver **Billing & plans** de GitHub Actions o usar un runner local. `belentani.es@main` sí tiene CI verde.

## Google Drive

No hay credencial utilizable:

- `gcloud` está instalado, pero **sin cuenta autenticada**; el token devuelve 401.
- Solo existen `client_secret*.json` en `Documents\03_SEGURIDAD\google-credentials`; no hay `token.json` ni refresh token.
- No hay `rclone`, ni unidad Drive montada, ni servidor MCP de Drive accesible desde Kilo.
- El conector “claude.ai Google Drive” figura como usado, pero no es invocable desde esta CLI.

Para continuar con los assets/comics de Drive hace falta un archivo de acceso. Formato recomendado, guardado fuera del chat:

```json
{
  "client_id": "...apps.googleusercontent.com",
  "client_secret": "...",
  "refresh_token": "...",
  "scopes": ["https://www.googleapis.com/auth/drive.readonly"]
}
```

Ruta sugerida: `C:\Users\USER\Documents\03_SEGURIDAD\google-credentials\drive-token.json`.

Alternativa CLI:

```powershell
gcloud auth login --enable-gdrive-access
```

Después se puede leer Drive por API y comparar versiones sin clonar repos.
