# Serie generativa del OMG Software Atlas

## Definición

La colección contiene 300 estudios visuales deterministas, organizados en cinco familias del atlas. Son piezas artísticas estáticas y reproducibles; no son 300 productos, repositorios, demos ni funciones de software. Cada página incorpora una composición SVG accesible, lectura breve, navegación anterior/siguiente y una ficha de estado que evita presentar arte como producto funcional.

## Continuidad visual

Las piezas reutilizan la paleta, el grano, la tipografía y la navegación del atlas existente. El índice conserva las cinco familias y permite buscar por número, motivo o familia. Las páginas individuales no ejecutan JavaScript, no cargan CDNs y no envían datos.

## Fuente y regeneración

La fuente de verdad está en scripts/generate-art-series.mjs. Regenera los 300 HTML individuales, series/index.html y sitemap.xml:

~~~bash
node scripts/generate-art-series.mjs
node scripts/generate-art-series.mjs --check
node --test tests/art-series.test.mjs
~~~

La comprobación compara los archivos públicos con la salida exacta del generador. El CI analiza todos los HTML y verifica sus enlaces locales, títulos, estructura accesible y reparto de 60 piezas por familia.

## Accesibilidad

Cada pieza declara idioma, título y descripción del SVG; incluye enlace para saltar al contenido, landmarks, foco visible, navegación por teclado y texto que no depende solo del color. Las páginas no animan el contenido y respetan el ajuste de movimiento reducido en la hoja compartida.

## Privacidad y alcance

El contenido se limita al vocabulario público del atlas. No se incorpora información de repositorios privados ni se consulta GitHub desde estas páginas. La colección no afirma disponibilidad, ventas, uso o adopción de ninguno de los sistemas.
