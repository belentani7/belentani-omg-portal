# Dedupe aplicado — 29 archivos

Fecha: 2026-10-26. Método: GitHub API `PATCH /repos/{owner}/{repo}` con `archived: true`. No se borró ningún repositorio.

| Repo | Motivo |
|---|---|
| `03-DUCK-WEB-build-everything` | Duplicado privado de la línea DUCK. |
| `duck-2026` | Iteración anual reemplazada por `heyduck` + `duck-hub`. |
| `duck-belentani-os` | Snapshot privado absorbido por el ecosistema DUCK. |
| `Duck-Omega` | Iteración antigua; la versión canónica es `omega-max-duck`. |
| `belentaniexperience` | Portfolio duplicado; `belentani.es` es el canónico. |
| `3d-portfolio` | Portfolio 3D absorbido por `belentani.es`. |
| `20-demos` | Demos sueltas sin producto. |
| `desktop` | Prototipo de escritorio sin señal. |
| `win11-workspace` | Prototipo de workspace sin producto. |
| `one` | Hub personal duplicado por el portal. |
| `notebook-lite` | Editor/scratchpad genérico. |
| `meta-skill` | Duplicado de `MetaSkill`. |
| `premium-effects` | Duplicado de `premium-effects-registry`. |
| `mimo-cli-auditoria` | Auditoría/prototipo, no producto. |
| `mimo_patch` | Parche experimental absorbido por Mimo. |
| `music-os-pedro-belentani` | Duplicado conceptual de `backend_aportaciones_software03`. |
| `MusicAI_Production` | Experimento absorbido por la madre 03. |
| `ai-music-production-lab-commerce-os` | Experimento absorbido por la madre 03. |
| `Belentanislide` | Experimento de app; no es el producto. |
| `nataliamarinho` | Cliente educativo sin señal OMG. |
| `automations` | Workspace genérico absorbido por la madre 04. |
| `n8n-instagram-automation` | Automatización puntual. |
| `money-machine-24h` | Experimento de revenue; absorbido por la madre 04. |
| `LEGACY-REVENUE-OS-2026` | Legacy de revenue; absorbido por la madre 04. |
| `harmonia-hub` | Incluido en `backend_aportaciones_software04`. |
| `fashion-stylist-ai` | Incluido en `ia-creativa-lab`. |
| `circuit-ai-support` | Soporte genérico sin producto. |
| `customer-agent` | Agente genérico sin producto. |
| `platform3-engine` | Prototipo sin señal. |

## Conservados con homepage

`belentani7-profile`, `arte-que-veste`, `aprende-brasil` y todos los flagships con demo activa se conservaron para no romper sitios.

## Rollback

```powershell
'{"archived":false}' | gh api --method PATCH /repos/belentani7/REPO --input -
```
