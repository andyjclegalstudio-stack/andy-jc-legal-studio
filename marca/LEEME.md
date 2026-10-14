# Archivos de marca

El logotipo del sitio **no es una imagen**: es texto compuesto en código. Esta carpeta
lo entrega ya convertido en archivos, para todo lo que no es la web.

Se generan con `node scripts/generar-marca.mjs`, que usa la misma tipografía y las
mismas medidas que el sitio. Si algún día se ajusta el logotipo, se corre ese comando y
estos archivos se rehacen. No hay dos versiones que puedan desincronizarse.

## La idea del logotipo

**Díada** significa par. El logotipo convierte el acento de la í en la firma de la marca:
deja de ser ortografía y pasa a ser el segundo elemento del par.

El acento va en **jade**, no en ámbar. El ámbar está reservado en exclusiva a los estados
de Academy («inscripciones abiertas»); si fuera también color de marca, esa señal
dejaría de significar algo. Además, ámbar sobre blanco da 2.1:1 de contraste y el acento
desaparecería en tamaños pequeños; en jade da 6.4:1.

## Cuál usar

| Necesitas | Archivo |
|---|---|
| Membrete de un escrito, contrato o propuesta | `logotipo-color.pdf` |
| Firma de correo, presentación, documento de Word | `logotipo-color.png` |
| Foto de perfil de WhatsApp, LinkedIn, Instagram | `isotipo-tinta.png` |
| Sobre fondo oscuro (banner, diapositiva, video) | `logotipo-blanco.png` |
| Sello, fotocopia, una sola tinta | `logotipo-negro.pdf` |
| Imprenta, tarjetas, gigantografía | cualquiera de los `.pdf` |
| Explicar las dos áreas de práctica | `diagrama-areas.svg` |

## Qué es cada formato

- **`.pdf`** — El logotipo en vector, con la tipografía incrustada. Es el archivo que se
  le entrega a una imprenta. Se abre igual en cualquier computadora.
- **`.png`** — Alta resolución con **fondo transparente**, así que se puede poner encima
  de cualquier color sin que aparezca un recuadro blanco. Es la que se usa el 90% de las
  veces.
- **`isotipo-*.png`** — La «Dí» sola, cuadrada, para donde solo cabe un símbolo.
- **`diagrama-areas.svg`** — La D abierta en sus dos mitades: el asta recta es el Derecho
  Empresarial y la curva el Derecho Digital, con sus cruces resaltados. **No es un
  logotipo**: es una ilustración que explica el posicionamiento. No la uses como marca.

## Reglas de uso

1. **No estires el logotipo.** Si cambias el ancho, cambia el alto en la misma
   proporción. En Word y PowerPoint, arrastra desde una esquina, nunca desde un lado.
2. **No recolorees el acento.** Va en jade sobre fondo claro y en blanco sobre fondo
   oscuro. Nunca en ámbar.
3. **Deja aire alrededor.** Como mínimo, la altura de la D en los cuatro lados. Los
   archivos ya traen un margen incorporado.
4. **No lo pongas sobre una foto.** Si no queda más remedio, la versión blanca sobre una
   zona oscura y pareja.
5. **Tamaño mínimo:** 20 px de alto en pantalla, 8 mm impreso. Más chico que eso, el
   acento se empasta con la í.

## Los colores, por si te los piden

| Color | HEX | RGB | CMYK aproximado |
|---|---|---|---|
| Tinta | `#16283A` | 22, 40, 58 | 88, 70, 45, 45 |
| Jade | `#146B54` | 20, 107, 84 | 88, 35, 70, 25 |
| Ámbar (solo Academy) | `#E0A32E` | 224, 163, 46 | 12, 36, 94, 1 |

La tipografía es **Newsreader** para el nombre y **Public Sans** para «LEGAL STUDIO» y
los textos. Las dos son de Google Fonts, gratuitas y con uso comercial permitido.
