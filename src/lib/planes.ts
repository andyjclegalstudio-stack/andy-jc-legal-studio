import planes from '../data/planes.json';

export type Plan = (typeof planes.planes)[number];

/** «S/ 1,800»: separador de miles con coma, como se escribe en el Perú. */
export function soles(monto: number): string {
  return `${planes.moneda} ${monto.toLocaleString('en-US')}`;
}

/**
 * El plan anual cobra diez meses y cubre doce. El equivalente mensual se
 * redondea hacia abajo para no prometer un centavo de más.
 */
export function precioAnual(p: Plan) {
  const total = p.precio * planes.mesesQuePagasAlAnio;
  return { total, mensual: Math.floor(total / 12) };
}

export const MENSAJE_PLAN = (nombre: string) =>
  `Hola, vengo de la web. Me interesa el plan mensual ${nombre}.`;
