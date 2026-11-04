/**
 * Capa de datos del portal del cliente.
 *
 * Hoy lee los datos de EJEMPLO de src/data/portal-demo.json. Las páginas y los
 * componentes del portal solo hablan con este archivo: cuando exista la base de
 * datos (docs/portal-clientes.md), se reemplazan estas funciones por consultas
 * y la interfaz no cambia. Por eso los tipos están escritos acá y no se infieren
 * del JSON.
 */
import demo from '../data/portal-demo.json';

export type Tono = 'ok' | 'pendiente' | 'neutro';
export type Responsable = 'estudio' | 'empresa';

export interface Encargo {
  titulo: string;
  estado: string;
  tono: Tono;
  /** De 0 a 100. */
  avance: number;
  /** Fecha ISO de la última actividad. */
  actividad: string;
}

export interface Documento {
  titulo: string;
  version: string;
  fecha: string;
}

export interface Pendiente {
  titulo: string;
  responsable: Responsable;
  vence: string;
}

export interface Plazo {
  titulo: string;
  fecha: string;
}

export interface Area {
  slug: string;
  nombre: string;
  icono: string;
  descripcion: string;
  encargos: Encargo[];
  documentos: Documento[];
  pendientes: Pendiente[];
  plazos: Plazo[];
}

export interface MovimientoPuntos {
  fecha: string;
  concepto: string;
  /** Positivo suma; negativo es un canje. */
  puntos: number;
}

export interface FormaPuntos {
  titulo: string;
  texto: string;
  icono?: string;
}

export interface Puntos {
  saldo: number;
  /** «1 punto = S/ 1». */
  equivalencia: string;
  movimientos: MovimientoPuntos[];
  ganar: FormaPuntos[];
  canjear: FormaPuntos[];
}

export interface Pago {
  concepto: string;
  /** Soles, sin símbolo. */
  monto: number;
  vence: string;
  estado: 'pendiente' | 'pagado';
  pagadoEl?: string;
}

export interface Empresa {
  nombre: string;
  plan: string;
  mes: string;
}

/* --- Lectura. Lo único que cambia cuando entre la base de datos. --- */

export function empresa(): Empresa {
  return { nombre: demo.empresa, plan: demo.plan, mes: demo.mes };
}

export function areas(): Area[] {
  return demo.areas as Area[];
}

export function area(slug: string): Area | undefined {
  return areas().find((a) => a.slug === slug);
}

export function puntos(): Puntos {
  return demo.puntos as Puntos;
}

export function pagos(): Pago[] {
  return demo.pagos as Pago[];
}

/** El «hoy» del portal. En la demostración es fijo para que los plazos no envejezcan. */
export function hoy(): Date {
  return new Date(`${demo.fechaDemo}T00:00:00`);
}

/* --- Cálculos sobre los datos, iguales con demo o con base de datos. --- */

export function diasHasta(iso: string): number {
  return Math.round((new Date(`${iso}T00:00:00`).getTime() - hoy().getTime()) / 86_400_000);
}

/** «Hoy», «Mañana», «En 5 días», «Vencido hace 2 días», «En 3 meses». */
export function etiquetaPlazo(iso: string): string {
  const n = diasHasta(iso);
  if (n < 0) return `Vencido hace ${-n} ${-n === 1 ? 'día' : 'días'}`;
  if (n === 0) return 'Hoy';
  if (n === 1) return 'Mañana';
  if (n <= 60) return `En ${n} días`;
  return `En ${Math.round(n / 30)} meses`;
}

/** Un plazo es urgente si vence en siete días o menos (o ya venció). */
export function urgente(iso: string): boolean {
  return diasHasta(iso) <= 7;
}

/** «Hoy», «Ayer», «Hace 3 días» para la última actividad. */
export function haceCuanto(iso: string): string {
  const n = -diasHasta(iso);
  if (n <= 0) return 'Hoy';
  if (n === 1) return 'Ayer';
  return `Hace ${n} días`;
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];

/** «12 oct 2026». Corto, para listas. */
export function fechaCorta(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

export interface ResumenArea {
  area: Area;
  activos: number;
  proximoPlazo: Plazo | undefined;
}

/** Para la pantalla de inicio: encargos activos y el plazo más cercano de cada área. */
export function resumen(): ResumenArea[] {
  return areas().map((a) => ({
    area: a,
    activos: a.encargos.filter((e) => e.avance < 100).length,
    proximoPlazo: [...a.plazos]
      .filter((p) => diasHasta(p.fecha) >= 0)
      .sort((x, y) => x.fecha.localeCompare(y.fecha))[0],
  }));
}

/** Lo que la empresa debe hoy: la suma de los pagos pendientes. */
export function deudaPendiente(): number {
  return pagos()
    .filter((p) => p.estado === 'pendiente')
    .reduce((t, p) => t + p.monto, 0);
}

/** Todos los pendientes, con su área, ordenados por fecha. */
export function pendientesTodos(): (Pendiente & { area: Area })[] {
  return areas()
    .flatMap((a) => a.pendientes.map((p) => ({ ...p, area: a })))
    .sort((x, y) => x.vence.localeCompare(y.vence));
}

/* --- Íconos de línea (24 × 24, trazo). Solo el contenido del <svg>. --- */

export const ICONOS: Record<string, string> = {
  inicio: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  societario: '<path d="M3 21h18"/><path d="M5 21V10M19 21V10M9.5 21V10M14.5 21V10"/><path d="M12 3l9 5H3z"/>',
  contratos: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
  consumidor: '<path d="M4 7h16l-1.5 11a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2z"/><path d="M9 7a3 3 0 0 1 6 0"/><path d="M9.5 13.5l2 2 3.5-3.5"/>',
  casos: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M12 8v5"/><path d="M12 16h.01"/>',
  descargar: '<path d="M12 4v12M6 10l6 6 6-6M5 20h14"/>',
  tributario: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8"/><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01"/>',
  laboral: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>',
  marca: '<circle cx="12" cy="12" r="9"/><path d="M10 16V8h3a2.5 2.5 0 0 1 0 5h-3M13 13l2.5 3"/>',
  puntos: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
  pagos: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><path d="M7 15h3"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>',
};
