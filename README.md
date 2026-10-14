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
# Los dos de abajo son opcionales. Si existen, la ficha dibuja el programa por
# horas y la cuadrícula «Qué te llevas»; si no, muestra solo el texto del .md.
programa:
  - { hora: "19:00", tema: "Por qué fallan los contratos con proveedores" }
  - { hora: "19:25", tema: "Cláusulas críticas: alcance, niveles de servicio, datos" }
entregables:
  - "Checklist de revisión de contratos"
  - "Grabación disponible por 30 días"
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
| `src/data/site.json` | Nombre, WhatsApp, correo, colegiatura, ciudad, redes sociales, la bandera del retrato y la lista `clientes` de la marquesina |
| `src/data/planes.json` | Los tres planes: nombre, precio, qué incluye, la tabla comparativa, las notas al pie y las preguntas «Sobre los planes» |
| `src/data/catalogo.json` | El catálogo «Precio fijo por documento» de `/planes`, con sus categorías |
| `src/data/areas.json` | Las cinco pestañas «Qué resolvemos» de la portada |
| `src/data/faq.json` | Las preguntas frecuentes (aparecen en inicio y en contacto, y alimentan el `schema.org/FAQPage`) |
| `src/data/testimonios.json` | Testimonios de clientes. La sección de la portada aparece sola cuando hay al menos uno |
| `src/data/academy.json` | Cursos a tu ritmo y recursos descargables. Sus secciones aparecen solas cuando hay algo |
| `src/content/servicios/*.md` | Los seis servicios: nombre, qué incluye, plazo, precio y el texto largo |
| `src/content/academy/*.md` | Los eventos |

### Cambiar los precios de los planes

> **Los montos actuales son una propuesta, no están confirmados.** Se pusieron como
> referencia de mercado para que los revises. Ajústalos antes de darlos por definitivos.

Edita `precio` en `src/data/planes.json`. Es un número sin símbolo ni separador de miles
(`890`, no `"S/ 890"`): el formato se aplica solo al mostrarlo. Lo que cambies ahí
aparece en la portada, en la página de planes, en la tabla comparativa y en el marcado
de datos estructurados, sin tocar nada más.

El precio anual se calcula solo: el cliente paga `mesesQuePagasAlAnio` meses (hoy 10) y
usa 12. El equivalente mensual que muestra el interruptor «Anual» sale de ahí.

Para cambiar qué incluye un plan, edita su lista `incluye`. La tabla comparativa
(`comparativa`), las notas al pie (`notas`) y las preguntas «Sobre los planes» (`faq`)
viven en el mismo archivo.

### Las empresas en movimiento

La marquesina de la portada lee la lista `clientes` de `src/data/site.json`. Son nombres,
no imágenes: cada uno sale compuesto en texto con un estilo distinto. Publica solo
empresas que de verdad sean clientes y que hayan aceptado ser nombradas. Si la lista
queda vacía, la sección desaparece.

### Testimonios, cursos y recursos

Las tres secciones están construidas pero vacías, a propósito: el diseño traía textos
de relleno y no se publican. Cada archivo (`testimonios.json`, `academy.json`) explica
en su campo `_como` qué llenar. En cuanto hay un elemento, la sección aparece sola.

### Activar la foto del abogado

Hoy la sección "Quién está detrás" sale sin foto. Para encenderla:

1. Guarda la imagen como `public/retrato.jpg` (vertical 4:5, mínimo 720×900; en la ficha
   de cada evento se recorta en círculo).
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
  data/*.json           datos del estudio, planes, catálogo, áreas, FAQ, testimonios
  lib/whatsapp.ts       único lugar donde se arma un enlace de wa.me
  lib/botones.ts        las clases de todo botón del sitio
  lib/planes.ts         formato de soles y cálculo del precio anual
  lib/eventos.ts        fechas en español y estilos de estado de Academy
  components/Marca.astro  el logotipo: «Díada», filete y «Legal Studio»
  components/           piezas de interfaz
  layouts/Base.astro    <head>, metadatos, JSON-LD, cabecera y pie
  pages/                una página por archivo
  pages/diagnostico.astro  el formulario que arma el mensaje de WhatsApp del diagnóstico
scripts/generar-marca.mjs  exporta el logotipo ANTERIOR (acento en jade); pendiente de rehacer
vercel.json             cabeceras de seguridad y caché en producción
public/
  favicon-*.png         el isotipo anterior «Dí»; pendiente de rehacer con la marca nueva
  og-image.png          imagen social 1200×630
```

**Astro + Tailwind CSS + TypeScript.** Astro genera HTML puro. El JavaScript que llega
al navegador es mínimo y cada pieza degrada bien: sin él, las pestañas muestran el primer
frente, los filtros muestran todo, el interruptor queda en «Mensual» y los formularios
siguen abriendo WhatsApp con el mensaje base. Nada carga de un dominio ajeno.

### Sistema de diseño

Los colores y la tipografía se declaran una sola vez, en el bloque `@theme` de
`src/styles/global.css`. No hay ningún código hexadecimal suelto en un componente.

| Token | Valor | Uso |
|---|---|---|
| `tinta` | `#16283A` | Texto, botón primario y fondos fuertes |
| `acento` | `#E3A92B` | El ámbar: botones sobre tinta, etiqueta «Recomendado», subrayado de la portada |
| `niebla` | `#F4F5F3` | Superficie alterna de sección |
| `tenue` / `gris` | `#3E4B57` / `#5B6670` | Texto secundario y etiquetas |
| `jade` | `#146B54` | Solo la etiqueta «Grabación disponible» de Academy |

Una regla que conviene no romper: **el ámbar nunca va como texto sobre fondo claro.**
No cumple accesibilidad. Va siempre como fondo con texto encima, o como línea.

### Modo oscuro

Como todo color es un token, el modo oscuro es otra tabla de valores en `global.css`
(bloque `:root[data-theme="dark"]`). Se aplica solo si el sistema de la persona lo
pide, y el interruptor de la cabecera (`CambioTema.astro`) lo fija a mano y lo recuerda
en el navegador. Las secciones «sobre tinta» se invierten y quedan claras. El ámbar y
el jade no cambian; el texto que va encima de ellos usa `fijo-oscuro` y `fijo-claro`,
que tampoco cambian. Si agregas un color nuevo, dale valor en las dos tablas.

No toques `--spacing` en `global.css`: en Tailwind v4 todas las utilidades de espaciado
se calculan a partir de esa variable, y cambiarla reescala el sitio entero.

---

## Lo que este sitio no hace, a propósito

- No envía datos a ningún servidor. Los campos del diagnóstico y del programa de
  referidos solo arman el mensaje de WhatsApp que se abre en el teléfono de quien lo
  escribe. Por lo mismo no hay boletín por correo ni inscripción con formulario: el
  aviso de fechas y la reserva de cupos van por WhatsApp.
- No usa cookies, ni analítica, ni rastreadores. Por eso tampoco necesita banner de
  cookies.
- No carga nada desde un dominio de terceros. Las tipografías van autohospedadas, así que
  no hay conexión a Google Fonts.

Las cabeceras de `vercel.json` incluyen `connect-src 'none'` y `form-action 'none'`:
si alguien agrega un `fetch` o un formulario con `action` por descuido, el navegador lo
bloquea. La promesa no depende de que nadie se olvide.
