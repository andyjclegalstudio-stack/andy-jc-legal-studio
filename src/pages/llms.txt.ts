import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import site from '../data/site.json';
import planes from '../data/planes.json';

/**
 * llms.txt: el índice del sitio para los asistentes de IA (llmstxt.org).
 * Se genera en cada build a partir de los mismos datos que las páginas.
 */
export const GET: APIRoute = async ({ site: base }) => {
  const u = (ruta: string) => new URL(ruta, base).href;
  const eventos = (await getCollection('academy')).sort((a, b) => b.data.fecha.getTime() - a.data.fecha.getTime());
  const servicios = (await getCollection('servicios')).sort((a, b) => a.data.orden - b.data.orden);

  const lineas = [
    `# ${site.nombre}`,
    '',
    `> ${site.descripcion} Base en ${site.ciudad}, con atención remota a todo el país. A cargo de ${site.abogado}, abogado, ${site.colegiatura} del ${site.colegio}.`,
    '',
    'No compras horas, compras documentos terminados: precio cerrado y plazo por escrito antes de empezar. Tres planes mensuales sin permanencia y un catálogo de documentos a precio fijo. Todo contacto se hace por WhatsApp.',
    '',
    '## Páginas principales',
    `- [Inicio](${u('/')}): qué resolvemos, principios de trabajo, planes y preguntas frecuentes`,
    `- [Planes para empresas](${u('/planes/')}): ${planes.planes.map((p) => `${p.nombre} (${p.desde ? 'desde ' : ''}S/ ${p.precio} al mes)`).join(', ')}; catálogo por documento y comparativa`,
    `- [Servicios](${u('/servicios/')}): los encargos sueltos con alcance definido`,
    `- [Diagnóstico gratuito](${u('/diagnostico/')}): reunión de 30 minutos sin costo`,
    `- [Academy](${u('/academy/')}): charlas, talleres y cursos de derecho práctico para empresas`,
    `- [Programa de referidos](${u('/referidos/')})`,
    `- [Contacto](${u('/contacto/')}): WhatsApp ${site.whatsappVisible}, ${site.correo}`,
    `- [Aviso legal](${u('/aviso-legal/')}): titular, alcance informativo del contenido y datos personales`,
    '',
    '## Servicios',
    ...servicios.map((s) => `- [${s.data.nombre}](${u(`/servicios/#${s.id}`)}): ${s.data.incluye}`),
    '',
    '## Academy',
    ...eventos.map((e) => `- [${e.data.titulo}](${u(`/academy/${e.id}/`)}): ${e.data.resumen}`),
    '',
  ];
  return new Response(lineas.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
