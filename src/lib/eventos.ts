export const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre',
];

/** Las fechas del frontmatter se leen como UTC. Se formatea en UTC para no correr un día. */
export function fechaLarga(d: Date): string {
  return `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

export function esProximo(d: Date): boolean {
  const finDelDia = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59);
  return finDelDia >= Date.now();
}

export type Estado = 'abierto' | 'por-anunciar' | 'cerrado' | 'grabado';

/**
 * El ámbar nunca es texto sobre fondo claro: no llega a AA (2.2:1 sobre blanco).
 * Va siempre como fondo de chip con texto tinta encima (6.8:1).
 * Cada estado necesita su par claro/oscuro: sobre tinta, el jade como texto cae
 * a 2.3:1 y el tinta desaparece, así que no se reutilizan las clases claras.
 */
export const ESTADOS: Record<Estado, { etiqueta: string; chip: string; chipOscuro: string }> = {
  abierto: {
    etiqueta: 'Inscripciones abiertas',
    chip: 'bg-ambar text-tinta',
    chipOscuro: 'bg-ambar text-tinta',
  },
  'por-anunciar': {
    etiqueta: 'Por anunciar',
    chip: 'border border-tinta/30 text-tenue',
    chipOscuro: 'border border-white/35 text-white/85',
  },
  cerrado: {
    etiqueta: 'Cupos cerrados',
    chip: 'border border-tinta/30 text-tenue',
    chipOscuro: 'border border-white/25 text-white/65',
  },
  grabado: {
    etiqueta: 'Grabación disponible',
    chip: 'bg-jade text-white',
    chipOscuro: 'bg-jade text-white ring-1 ring-white/30',
  },
};

export const TIPOS: Record<string, string> = {
  taller: 'Taller',
  charla: 'Charla',
  seminario: 'Seminario',
  curso: 'Curso',
};
