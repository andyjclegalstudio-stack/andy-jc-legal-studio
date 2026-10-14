# Díada Legal Studio · sitio web

Lee primero `docs/ARQUITECTURA.md`: explica el stack (Astro 7, Tailwind 4, Vercel), la
estructura, los archivos de datos editables, el sistema de color con modo oscuro y las
convenciones. `README.md` cubre las tareas frecuentes (agregar eventos, cambiar precios,
WhatsApp). `docs/portal-clientes.md` es la propuesta del portal real, aún no construida.

Reglas que no se rompen:
- Sitio estático sin servidor ni formularios que envíen datos; todo termina en WhatsApp.
- Ningún color suelto: tokens de `src/styles/global.css`, con valor en claro y en oscuro.
- Nada inventado en producción (testimonios, clientes, cursos, recursos).
- Antes de terminar: `npm run build` y `npx astro check` sin errores.
- Español en código, comentarios y commits.
