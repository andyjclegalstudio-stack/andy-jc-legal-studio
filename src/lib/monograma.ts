/**
 * Geometría única del monograma DIADA.
 * El logo de cabecera y el diagrama de portada son EL MISMO dibujo con dos
 * tratamientos distintos. Si cambias algo acá, cambia en los dos.
 *
 * «Diada» es un par. La letra D ya es un par: un asta recta y una curva. Eso es
 * exactamente lo que hace el estudio — Derecho Empresarial (la norma codificada,
 * de aristas fijas) y Derecho Digital (el terreno que se mueve) — así que el
 * monograma es una D cuyas dos mitades se cruzan de verdad en vez de solo tocarse.
 *
 * La curva sobrepasa el asta por arriba y por abajo: ahí nacen las dos zonas de
 * cruce que se rellenan en jade. Si la curva solo apoyara en el asta, no habría
 * intersección y el diagrama no contaría nada.
 */

// El asta recta. Un solo rectángulo; es la mitad «empresarial».
const ASTA_X = 130;
const ASTA_ANCHO = 70;
const ASTA_ARRIBA = 55;
const ASTA_ABAJO = 475;

export const D_ASTA = `M${ASTA_X} ${ASTA_ARRIBA} L${ASTA_X + ASTA_ANCHO} ${ASTA_ARRIBA} L${ASTA_X + ASTA_ANCHO} ${ASTA_ABAJO} L${ASTA_X} ${ASTA_ABAJO} Z`;
export const D_PARTES = [D_ASTA];

// La panza curva. Mismo grosor que el asta: 70 unidades. Es la mitad «digital».
const CX = 220;
const CY = 265;
const R_EXT = 200;
const R_INT = 130;
const APERTURA = 112; // grados a cada lado del eje horizontal derecho

const rad = (g: number) => (g * Math.PI) / 180;
const pt = (r: number, g: number) =>
  `${(CX + r * Math.cos(rad(g))).toFixed(2)} ${(CY + r * Math.sin(rad(g))).toFixed(2)}`;

export const D_CURVA = [
  `M${pt(R_EXT, -APERTURA)}`,
  `A${R_EXT} ${R_EXT} 0 1 1 ${pt(R_EXT, APERTURA)}`,
  `L${pt(R_INT, APERTURA)}`,
  `A${R_INT} ${R_INT} 0 1 0 ${pt(R_INT, -APERTURA)}`,
  'Z',
].join(' ');

/** Encuadre del diagrama de portada: apaisado, con sitio a la derecha para las etiquetas. */
export const VIEWBOX = '106 31 620 468';

/** Encuadre ajustado del logotipo: sin aire, para que rinda a 40px de alto. */
export const VIEWBOX_LOGO = '125 50 300 430';
