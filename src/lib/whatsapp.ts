import site from '../data/site.json';

/**
 * Único punto del sitio donde se arma un enlace de WhatsApp.
 * Para cambiar el número, edita `whatsapp` en src/data/site.json. Nada más.
 */
export function wa(mensaje: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

export const MENSAJE_GENERAL =
  'Hola, vengo de la web. Quisiera hacer una consulta al estudio.';

export const MENSAJE_REUNION =
  'Hola, vengo de la web. Quisiera coordinar una reunión de 30 minutos para conocer el servicio.';
