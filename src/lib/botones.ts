/**
 * Las clases de todo botón del sitio salen de acá, así los enlaces normales y
 * los de WhatsApp se ven idénticos sin repetir cadenas en cada componente.
 */
export type Variante = 'primario' | 'secundario' | 'acento' | 'claro' | 'sobrio';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 text-base font-semibold no-underline transition-colors duration-150';

const VARIANTES: Record<Variante, string> = {
  /* Tinta sobre claro. El botón por defecto. */
  primario: 'bg-tinta text-white hover:bg-tinta-oscura',
  /* Contorno, para la acción secundaria al lado de un primario. */
  secundario: 'border-[1.5px] border-tinta text-tinta hover:bg-niebla',
  /* Ámbar. Solo sobre tinta: ámbar con texto claro no cumple contraste. */
  acento: 'bg-acento text-tinta font-bold hover:bg-white',
  /* Blanco sobre tinta. */
  claro: 'bg-white text-tinta hover:bg-acento',
  /* Contorno sobre tinta. */
  sobrio: 'border-[1.5px] border-white/40 text-white hover:bg-white hover:text-tinta',
};

export function clasesBoton(variante: Variante = 'primario', compacto = false): string {
  return `${BASE} ${VARIANTES[variante]} ${compacto ? 'min-h-[44px] px-5 text-[15px]' : 'min-h-[52px]'}`;
}
