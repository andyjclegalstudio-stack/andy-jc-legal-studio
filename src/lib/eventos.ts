export const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre',
];
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/** Las fechas del frontmatter se leen como UTC. Se formatea en UTC para no correr un día. */
export function fechaLarga(d: Date): string {
  return `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

/** «Jueves 12 de noviembre», para la ficha del evento. */
export function fechaConDia(d: Date): string {
  const dia = DIAS[d.getUTCDay()];
  return `${dia[0].toUpperCase()}${dia.slice(1)} ${d.getUTCDate()} de ${MESES[d.getUTCMonth()]}`;
}

/** El bloque de calendario: «12» y «nov». */
export function diaYMes(d: Date): { dia: string; mes: string } {
  return { dia: String(d.getUTCDate()).padStart(2, '0'), mes: MESES_CORTOS[d.getUTCMonth()] };
}

export function esProximo(d: Date): boolean {
  const finDelDia = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59);
  return finDelDia >= Date.now();
}

export type Estado = 'abierto' | 'por-anunciar' | 'cerrado' | 'grabado';

/**
 * El ámbar nunca es texto sobre fondo claro: no llega a AA. Va siempre como
 * fondo de etiqueta con texto tinta encima.
 */
export const ESTADOS: Record<Estado, { etiqueta: string; chip: string }> = {
  abierto: { etiqueta: 'Inscripciones abiertas', chip: 'bg-acento text-fijo-oscuro' },
  'por-anunciar': { etiqueta: 'Por anunciar', chip: 'border border-linea-fuerte text-gris' },
  cerrado: { etiqueta: 'Cupos cerrados', chip: 'border border-linea-fuerte text-gris' },
  grabado: { etiqueta: 'Grabación disponible', chip: 'bg-jade text-fijo-claro' },
};

export const TIPOS: Record<string, string> = {
  taller: 'Taller',
  charla: 'Charla',
  seminario: 'Seminario',
  curso: 'Curso',
};

export const TIPOS_PLURAL: Record<string, string> = {
  taller: 'Talleres',
  charla: 'Charlas',
  seminario: 'Seminarios',
  curso: 'Cursos',
};

/** El texto y el mensaje del botón de reserva, según el estado del evento. */
export function ctaEvento(titulo: string, fecha: Date, estado: Estado) {
  const cuando = fechaLarga(fecha);
  return {
    abierto: {
      etiqueta: 'Reservar cupo',
      mensaje: `Hola, vengo de la web. Quiero reservar un cupo en "${titulo}" del ${cuando}.`,
    },
    'por-anunciar': {
      etiqueta: 'Avisarme cuando abran los cupos',
      mensaje: `Hola, vengo de la web. Avísame cuando abran las inscripciones de "${titulo}" del ${cuando}.`,
    },
    cerrado: {
      etiqueta: 'Avisarme de la próxima edición',
      mensaje: `Hola, vengo de la web. Los cupos de "${titulo}" ya cerraron. Avísame de la próxima edición.`,
    },
    grabado: {
      etiqueta: 'Pedir la grabación',
      mensaje: `Hola, vengo de la web. Quisiera la grabación de "${titulo}" del ${cuando}.`,
    },
  }[estado];
}
