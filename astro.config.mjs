import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Cambia `site` por tu dominio final cuando lo tengas.
// Hoy apunta al dominio que asigna Vercel al proyecto.
// De ese valor dependen sitemap.xml, robots.txt y las URLs de Open Graph.
export default defineConfig({
  site: 'https://www.diadalegalstudio.com',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
