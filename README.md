# Díada Legal Studio

Sitio estático del estudio. Su único trabajo es convertir visitas en conversaciones por
WhatsApp: **todo botón de acción abre `wa.me` con un mensaje ya escrito**, distinto según
dónde se haya hecho clic. No hay backend, ni base de datos, ni pasarela de pago, ni un
solo formulario que envíe datos a un servidor.

---

## Las dos cosas que vas a hacer seguido

### Agregar un evento a Academy

1. Crea **un solo archivo** `.md` en `src/content/academy/`. El nombre del archivo es la
   URL: `datos-personales-startups.md` → `/academy/datos-personales-startups`.
2. Copia el bloque de metadatos de abajo al inicio del archivo, entre las dos líneas `---`.
3. Debajo del segundo `---`, escribe la descripción larga en Markdown (`##` para
   subtítulos, `-` para viñetas).
4. Guarda. El evento aparece solo en la portada y en `/academy`, se ordena por fecha, se
   mueve a "ediciones anteriores" cuando pasa, y genera su propia página con el botón de
   reserva y el marcado `schema.org/Event`.
5. No toques ningún otro archivo. Nunca.

```yaml
---
titulo: "Datos personales para startups"
tipo: "taller"          # taller | charla | seminario | curso
fecha: 2026-10-14
hora: "19:00"
duracion: "2 horas"
modalidad: "virtual"    # virtual | presencial | híbrido
lugar: "Zoom"
precio: "S/ 90"         # o "Gratuito", o "Por anunciar"
cupos: 25               # opcional: si lo borras, no se muestra
estado: "abierto"       # abierto | por-anunciar | cerrado | grabado
resumen: "Qué exige la Ley 29733 a una empresa que recién empieza."
dirigido: "Fundadores, equipos de producto, áreas legales in house"
---
```

El campo `estado` cambia la etiqueta de color y también el texto del botón: `abierto`
dice "Reservar cupo", `por-anunciar` dice "Avisarme cuando abran los cupos", `grabado`
dice "Pedir la grabación". No hay que escribir esos textos.

Si el archivo tiene un error (falta un campo, `tipo` mal escrito), **el build falla y te
dice exactamente qué línea está mal**. Es a propósito: es mejor que se rompa acá y no en
producción.

### Cambiar el número de WhatsApp

Edita **una sola línea** en `src/data/site.json`:

```json
"whatsapp": "51922163731",
"whatsappVisible": "+51 922 163 731",
```

`whatsapp` es el número que va en el enlace: código de país sin `+`, sin espacios y sin
guiones. `whatsappVisible` es solo lo que lee la persona. Los 21 enlaces del sitio salen
de ahí; no hay ningún número escrito a mano en ningún componente.

---

## Otros datos que se editan sin tocar código

| Archivo | Qué contiene |
|---|---|
| `src/data/site.json` | Nombre, WhatsApp, correo, colegiatura, ciudad, redes sociales, y la bandera del retrato |
| `src/data/planes.json` | Los tres planes mensuales: nombre, precio, para quién es y qué incluye |
| `src/data/faq.json` | Las preguntas frecuentes (aparecen en inicio y en contacto, y alimentan el `schema.org/FAQPage`) |
| `src/content/servicios/*.md` | Los seis servicios: nombre, qué incluye, plazo, precio y el texto largo |
| `src/content/academy/*.md` | Los eventos |

### Cambiar los precios de los planes

> **Los montos actuales son una propuesta, no están confirmados.** Se pusieron como
> referencia de mercado para que los revises. Ajústalos antes de darlos por definitivos.

Edita `precio` en `src/data/planes.json`. Es un número sin símbolo ni separador de miles
(`1890`, no `"S/ 1,890"`): el formato se aplica solo al mostrarlo. Lo que cambies ahí
aparece en la portada, en la página de planes, en la tabla comparativa y en el marcado
de datos estructurados, sin tocar nada más.

Para cambiar qué incluye un plan, edita su lista `incluye` en el mismo archivo. Si
agregas o quitas una fila de la tabla comparativa, esa sí vive en `src/pages/planes.astro`,
en la constante `comparativa`.

### Activar la foto del abogado

Hoy la sección "Quién está detrás" sale sin foto. Para encenderla:

1. Guarda la imagen como `public/retrato.jpg` (cuadrada, mínimo 640×640, en WebP o AVIF
   si puedes, pesa menos).
2. En `src/data/site.json`, cambia `"mostrarRetrato": false` por `true`.

### Publicar precios

Los seis servicios dicen hoy `precio: "Según alcance"`. Cuando quieras publicar rangos,
cambia ese campo en el `.md` del servicio, por ejemplo `precio: "Desde S/ 1,200"`.
Publicar un rango en al menos dos servicios suele mejorar bastante la conversión, porque
filtra a quien no tiene presupuesto antes de que escriba.

---

## Trabajar en el proyecto

```bash
npm install
```

```bash
npm run dev
```

Abre http://localhost:4321. Los cambios se ven al instante.

```bash
npm run build
```

Genera el sitio en `dist/`. Es lo que se publica.

```bash
npm run preview
```

Sirve `dist/` para revisar el resultado final antes de desplegar.

---

## Desplegar en Vercel

> **Nota sobre el plan.** Las condiciones de Vercel reservan el plan **Hobby (gratis)
> para proyectos personales no comerciales**. El sitio de un estudio jurídico es un uso
> comercial, así que corresponde el plan **Pro**. Si en algún momento quieres una
> alternativa gratuita que sí permite uso comercial y no limita ancho de banda,
> Cloudflare Pages lo hace: la configuración anterior está en el historial de git
> (`git log -- public/_headers`).

### Primera vez

1. Crea un repositorio **vacío** en GitHub: <https://github.com/new>. Sin README, sin
   .gitignore, sin licencia. Recomendado: **privado**.

2. Conecta y sube el código:

```bash
git remote add origin https://github.com/andy-coder10/andy-jc-legal-studio.git
git push -u origin main
```

3. Entra a <https://vercel.com/new>, autoriza el acceso a GitHub y elige el repositorio.

4. Vercel detecta Astro solo. Confirma que la configuración diga:

| Campo | Valor |
|---|---|
| Framework Preset | `Astro` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Root Directory | `./` |
| Node.js Version | `22` *(lo toma de `.nvmrc`)* |

5. **Deploy.** En un par de minutos el sitio queda en
   `https://<nombre-del-proyecto>.vercel.app`.

Desde ahí, **cada `git push` a `main` vuelve a publicar el sitio solo**. Agregar un
evento es: crear el `.md`, commit, push. Nada más.

### Cuando tengas dominio propio

1. En el proyecto de Vercel: **Settings → Domains → Add**, y escribe el dominio.
2. Cambia `site` en `astro.config.mjs` por ese dominio. De ese valor dependen el
   `sitemap.xml`, el `robots.txt`, las URLs canónicas y las de Open Graph. Si no lo
   cambias, Google indexa las URLs de `vercel.app`.

## Cómo está armado

```
src/
  content/servicios/    un .md por servicio
  content/academy/      un .md por evento
  content.config.ts     valida los .md al compilar (Zod)
  data/site.json        datos del estudio
  data/faq.json         preguntas frecuentes
  lib/whatsapp.ts       único lugar donde se arma un enlace de wa.me
  lib/monograma.ts      geometría del diagrama de áreas de la portada
  lib/eventos.ts        fechas en español y estilos de estado de Academy
  components/Marca.astro  el logotipo: «Díada» con el acento en jade
  components/           piezas de interfaz
  layouts/Base.astro    <head>, metadatos, JSON-LD, cabecera y pie
  pages/                una página por archivo
scripts/generar-marca.mjs  exporta el logo a SVG, PNG y PDF desde la misma geometría
vercel.json             cabeceras de seguridad y caché en producción
public/
  favicon-*.png         el isotipo «Dí», a 32, 180 y 512 px
  og-image.png          imagen social 1200×630
```

**Astro + Tailwind CSS + TypeScript.** Astro genera HTML puro y no envía runtime de
JavaScript al navegador: el sitio publicado tiene **cero archivos `.js` externos**. El
único script es el del formulario de referidos, va en línea y ocupa doce líneas.

### Sistema de diseño

Los colores y la tipografía se declaran una sola vez, en el bloque `@theme` de
`src/styles/global.css`. No hay ningún código hexadecimal suelto en un componente.

| Token | Valor | Uso |
|---|---|---|
| `tinta` | `#16283A` | Texto y fondos fuertes |
| `jade` | `#146B54` | Enlaces y botón primario |
| `niebla` | `#E9ECE9` | Superficie alterna de sección |
| `ambar` | `#E0A32E` | Solo estados de Academy |

Dos reglas que conviene no romper:

- **El ámbar nunca va como texto sobre fondo claro.** Da 2.2:1 y no cumple accesibilidad.
  Va siempre como fondo de etiqueta con texto tinta encima (6.8:1).
- **El jade nunca va como texto sobre tinta.** Da 2.3:1. Sobre fondo oscuro, los enlaces
  van en blanco. Por eso los componentes de Academy tienen una variante `sobreTinta`.

No toques `--spacing` en `global.css`: en Tailwind v4 todas las utilidades de espaciado
se calculan a partir de esa variable, y cambiarla reescala el sitio entero.

---

## Lo que este sitio no hace, a propósito

- No envía datos a ningún servidor. Los campos del programa de referidos solo arman el
  mensaje de WhatsApp que se abre en el teléfono de quien lo escribe.
- No usa cookies, ni analítica, ni rastreadores. Por eso tampoco necesita banner de
  cookies.
- No carga nada desde un dominio de terceros. Las tipografías van autohospedadas, así que
  no hay conexión a Google Fonts.

Las cabeceras de `vercel.json` incluyen `connect-src 'none'` y `form-action 'none'`:
si alguien agrega un `fetch` o un formulario con `action` por descuido, el navegador lo
bloquea. La promesa no depende de que nadie se olvide.
