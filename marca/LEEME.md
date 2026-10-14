# Archivos de marca

El logotipo del sitio **no es una imagen**: es texto compuesto en código (`src/components/Marca.astro`). Esta carpeta lo entrega convertido a trazos vectoriales para todo lo que no es la web.

Se genera con `node scripts/generar-marca.mjs`, que lee las mismas fuentes y medidas que el sitio. Con `--kit carpeta` arma además el kit completo (perfiles, portadas, plantillas y fuentes) para redes y correo. Si el logotipo cambia, se corre el comando y todo se rehace; no hay dos versiones que puedan desincronizarse.

## Qué hay

| Archivo | Qué es |
|---|---|
| `logotipo-tinta.*` | El logotipo principal, sobre fondo transparente (SVG, PNG 2400 px, PDF vectorial) |
| `logotipo-blanco.*` | Para fondos oscuros |
| `logotipo-negro.*` | Una sola tinta: sellos, fotocopias |
| `monograma-tinta.*` | La «D» en cuadrado redondeado: foto de perfil y favicon |
| `monograma-claro.*`, `monograma-sin-fondo.*` | Variantes del monograma |
| `fuentes/` | Newsreader, DM Sans e IBM Plex Mono en TTF (licencia SIL OFL, uso comercial libre) |

Los mismos archivos se copian a `public/marca/` y quedan en `https://www.diadalegalstudio.com/marca/...`; de ahí los toma la firma de correo.

## Colores

| Color | HEX | Uso |
|---|---|---|
| Tinta | `#16283A` | Texto, logotipo, fondos fuertes |
| Niebla | `#F4F5F3` | Fondo alterno |
| Ámbar | `#E3A92B` | Acento: subrayados, etiquetas, botón sobre tinta. Nunca como texto sobre claro |

La guía completa de uso (reglas, medidas por plataforma, textos para perfiles) está en el kit, archivo `00-guia/GUIA-DE-MARCA.pdf`.
