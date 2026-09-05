/**
 * Geometría única del monograma AC.
 * El logo de cabecera y el diagrama de portada son EL MISMO dibujo con dos
 * tratamientos distintos. Si cambias algo acá, cambia en los dos.
 *
 * La A va a la izquierda y la C a la derecha, como en la marca. El centro y el
 * radio de la C están calibrados para que el arco corte el asta derecha de la A
 * en dos puntos claros —arriba y abajo— en vez de correr paralelo a ella: si
 * ambas figuras se rozan de largo, el cruce se lee como una sola mancha y el
 * diagrama deja de contar nada.
 */

// La A: tres trazos rectos de 62 unidades de ancho. Con fill-rule nonzero se unen solos.
export const A_IZQ = 'M230 60 L270 60 L162 470 L100 470 Z';
export const A_DER = 'M230 60 L270 60 L400 470 L338 470 Z';
export const A_BARRA = 'M165 352 L335 352 L335 394 L165 394 Z';
export const A_PARTES = [A_IZQ, A_DER, A_BARRA];

// La C: anillo de 62 unidades, abierto a la derecha.
const CX = 420;
const CY = 330;
const R_EXT = 200;
const R_INT = 138;
const APERTURA = 33; // grados a cada lado del eje horizontal derecho

const rad = (g: number) => (g * Math.PI) / 180;
const pt = (r: number, g: number) =>
  `${(CX + r * Math.cos(rad(g))).toFixed(2)} ${(CY + r * Math.sin(rad(g))).toFixed(2)}`;

export const C_PATH = [
  `M${pt(R_EXT, APERTURA)}`,
  `A${R_EXT} ${R_EXT} 0 1 1 ${pt(R_EXT, 360 - APERTURA)}`,
  `L${pt(R_INT, 360 - APERTURA)}`,
  `A${R_INT} ${R_INT} 0 1 0 ${pt(R_INT, APERTURA)}`,
  'Z',
].join(' ');

/** Encuadre del diagrama de portada: deja aire para las etiquetas ancladas. */
export const VIEWBOX = '60 20 600 570';

/** Encuadre ajustado del logotipo: sin aire, para que rinda a 40px de alto. */
export const VIEWBOX_LOGO = '95 55 530 480';
