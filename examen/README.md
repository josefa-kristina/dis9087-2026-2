# Portafolio — Josefa Araya

Sitio estático (HTML + CSS + JS, sin dependencias) basado en el diseño de Figma "portafolio".

## Ver el sitio
Abre `index.html` con doble clic en tu navegador.

## Estructura
- `index.html` — página principal (header con menú, hero, proyectos, sobre mí, contacto)
- `css/styles.css` — estilos y tokens del diseño (colores, tipografías MuseoModerno / Asap)
- `js/projects.js` — **textos, imágenes y enlaces de cada proyecto (edita aquí)**
- `js/main.js` — menú, tarjetas, filtros, detalle de proyecto y visor de imágenes
- `assets/img/` — imágenes optimizadas (JPG, máx. 1800 px + miniaturas)
- `assets/figma/` — recursos exportados del Figma (fondo metálico, íconos)
- `assets/docs/` — PDF de fichas técnicas de Atrabilis
- Videos (fashion film de Atrabilis y demo de MAREA): insertados desde YouTube, enlaces en `js/projects.js`

Las carpetas originales `Proyecto0X_...` no se usan en el sitio; puedes dejarlas fuera al publicarlo.

> Nota: YouTube puede no reproducir videos insertados si abres el archivo con doble clic (`file://`).
> Publicado en GitHub Pages (o con un servidor local) se ven sin problema.

## Pendientes
1. Revisa las descripciones de *I'm Greatful Grapefruit* y *Atrabilis* (escritas a partir de las fotos).

## Publicar gratis (GitHub Pages)
Sube `index.html`, `css/`, `js/` y `assets/` a un repositorio y activa *Settings → Pages*.
Cada proyecto tiene un enlace directo, p. ej. `index.html#proyecto-abisal`.
