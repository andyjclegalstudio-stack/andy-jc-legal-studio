import planes from '../data/planes.json';

export type Plan = (typeof planes.planes)[number];

/** «S/ 1,000»: separador de miles con coma, como se escribe en el Perú. */
export function soles(monto: number): string {
  return `${planes.moneda} ${monto.toLocaleString('en-US')}`;
}

/**
 * El plan anual cobra diez meses y cubre doce. El equivalente mensual se
 * redondea hacia abajo para no prometer un centavo de más.
 * Un plan sin precio (a medida) no tiene anual.
 */
export function precioAnual(p: Plan) {
  if (p.precio == null) return null;
  const total = p.precio * planes.mesesQuePagasAlAnio;
  return { total, mensual: Math.floor(total / 12) };
}

export const MENSAJE_PLAN = (nombre: string) =>
  `Hola, vengo de la web. Me interesa el plan mensual ${nombre}.`;

/** Solo los planes con monto publicado, para el rango de precios y los datos estructurados. */
export const conPrecio = planes.planes.filter((p): p is Plan & { precio: number } => p.precio != null);
