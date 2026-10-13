# Archivos de marca

Lo que ves en la cabecera del sitio **no es una imagen**: es el monograma dibujado en
código más el nombre escrito como texto real.

El monograma es una **D**: «diada» es un par, y la letra D ya es un par — un asta recta
y una curva. El asta en tinta es el Derecho Empresarial; la curva en jade, el Derecho
Digital. La curva sobrepasa el asta por arriba y por abajo, y ahí es donde las dos se
cruzan de verdad. Esta carpeta lo entrega ya convertido en
archivos, para todo lo que no es la web.

Se generan con `node scripts/generar-marca.mjs`, que lee la misma geometría que usa el
sitio (`src/lib/monograma.ts`). Si algún día cambias el logo, corres ese comando y estos
archivos se rehacen iguales. No hay dos versiones del dibujo que puedan desincronizarse.

## Cuál usar

| Necesitas | Archivo |
|---|---|
| Membrete de un escrito, contrato o propuesta | `marca-horizontal-color.pdf` |
| Firma de correo, presentación, documento de Word | `marca-horizontal-color.png` |
| Foto de perfil de WhatsApp, LinkedIn, Instagram | `monograma-color.png` |
| Sello de agua, fotocopia, fax, sello de goma | `marca-horizontal-negro.pdf` |
| Sobre fondo oscuro (banner, diapositiva, video) | `marca-horizontal-blanco.png` |
| Imprenta, tarjetas, gigantografía | cualquiera de los `.pdf` |
| Diseñador que te pida el vector | los `.svg` y los `.pdf` |

## Qué es cada formato

- **`.svg`** — Vector puro del monograma solo, sin el texto. Escala a cualquier tamaño sin
  perder nitidez y pesa menos de 1 KB. No depende de que tengas la tipografía instalada.
- **`.pdf`** — La marca completa en vector, con la tipografía incrustada. Es el archivo
  que le das a una imprenta. Se abre igual en cualquier computadora.
- **`.png`** — Imagen de alta resolución (2504 px de ancho) con **fondo transparente**,
  así que se puede poner encima de cualquier color sin que aparezca un recuadro blanco.
  Es la que usarás el 90% de las veces.

## Reglas de uso

1. **No estires la marca.** Si cambias el ancho, cambia el alto en la misma proporción.
   En Word y PowerPoint, arrastra desde una esquina, nunca desde un lado.
2. **Deja aire alrededor.** Como mínimo, el ancho del monograma en los cuatro lados. Los
   archivos ya traen un margen incorporado.
3. **No la pongas sobre una foto.** Si no queda más remedio, usa la versión blanca sobre
   una zona oscura y pareja.
4. **No cambies los colores.** Para fondo claro, la versión `color`. Para fondo oscuro,
   la `blanco`. Para una sola tinta, la `negro`.
5. **Tamaño mínimo del monograma:** 24 px de alto en pantalla, 10 mm impreso. Más chico
   que eso, los cruces del asta con la curva se empastan.

## Los colores, por si te los piden

| Color | HEX | RGB | CMYK aproximado |
|---|---|---|---|
| Tinta | `#16283A` | 22, 40, 58 | 88, 70, 45, 45 |
| Jade | `#146B54` | 20, 107, 84 | 88, 35, 70, 25 |

La tipografía es **Newsreader** (Google Fonts, gratuita, uso comercial permitido) para el
nombre, y **Public Sans** para textos. Ambas se descargan de fonts.google.com.
