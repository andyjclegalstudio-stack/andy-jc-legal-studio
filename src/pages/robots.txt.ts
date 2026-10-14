import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const cuerpo = [
    'User-agent: *',
    'Allow: /',
    /* Cómo pueden usar el contenido los sistemas de IA: aparecer en búsquedas y
       respuestas sí; entrenar modelos con él, no. Ver contentsignals.org. */
    'Content-Signal: search=yes, ai-input=yes, ai-train=no',
    '',
    `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
    '',
  ].join('\n');

  return new Response(cuerpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
