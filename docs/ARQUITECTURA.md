# Arquitectura del sitio de Díada Legal Studio

Este documento explica cómo está armado el sitio para que cualquier persona o
asistente de IA pueda seguir el trabajo sin necesitar la conversación en la que se
construyó. Si algo de aquí contradice al código, manda el código y hay que corregir
este archivo.

## 1. Qué es y qué no es

- Sitio **estático** hecho con **Astro 7**, **Tailwind CSS 4** y **TypeScript**, desplegado
  en **Vercel** desde la rama `main` del repositorio
  `andyjclegalstudio-stack/andy-jc-legal-studio` (el nombre antiguo `andy-coder10/...`
  redirige al mismo repositorio).
- Producción: `https://andy-jc-legal-studio.vercel.app`. Cada push a `main` publica solo.
  Cada rama abre una vista previa automática que Vercel comenta en el pull request.
- **No hay servidor, base de datos, cookies, analítica ni formularios que envíen datos.**
  Toda conversión termina en WhatsApp con un mensaje prellenado. Las cabeceras de
  `vercel.json` (`connect-src 'none'`, `form-action 'none'`) lo imponen: un `fetch` o un
  `<form action>` agregado por descuido lo bloquea el navegador.
- El portal de clientes en `/portal` es una **demostración estática** con datos
  inventados. El portal real está propuesto en `docs/portal-clientes.md` y vive en otro
  proyecto cuando se construya.

## 2. Comandos

```bash
npm install          # instala dependencias (Node 22, ver .nvmrc)
npm run dev          # http://localhost:4321, recarga en caliente
npm run build        # genera dist/ (lo que Vercel publica)
npm run preview      # sirve dist/ para revisar
npx astro check      # tipos y plantillas; debe terminar en 0 errores
```

Antes de dar por terminado un cambio: `npm run build` y `npx astro check` limpios.

## 3. Estructura

```
src/
  pages/              una página por archivo (ruta = nombre)
    index.astro       portada
    planes.astro      planes, comparación, kit, catálogo, comparativa, FAQ de planes
    servicios.astro   los encargos sueltos (lee src/content/servicios)
    diagnostico.astro la reunión gratuita: formulario que arma el mensaje de WhatsApp
    portal.astro      demostración del portal del cliente (datos de ejemplo)
    referidos.astro   programa de referidos (formulario que arma mensaje de WhatsApp)
    contacto.astro    datos de contacto y FAQ
    aviso-legal.astro titular, alcance informativo, datos personales
    academy/index.astro   agenda, formatos, cursos y recursos (si hay), in company
    academy/[slug].astro  ficha de cada evento (lee src/content/academy)
    404.astro
    robots.txt.ts     robots con la línea Content-Signal
    llms.txt.ts       índice para asistentes de IA, generado de los mismos datos
  layouts/Base.astro  <head>, metadatos, Open Graph, JSON-LD de sitio, cabecera y pie
  components/         piezas de interfaz (ver §5)
  content/
    servicios/*.md    un servicio por archivo
    academy/*.md      un evento por archivo
  content.config.ts   esquema (Zod) de los .md; un campo mal escrito rompe el build a propósito
  data/*.json         todo lo editable sin tocar código (ver §4)
  lib/
    whatsapp.ts       único lugar donde se arma un enlace wa.me y los mensajes base
    botones.ts        las clases de todo botón (variantes primario, secundario, acento, claro, sobrio)
    planes.ts         formato de soles, precio anual, planes con precio
    eventos.ts        fechas en español, estados y tipos de evento, texto del botón de reserva
  styles/global.css   tokens de color y tipografía, modo oscuro, utilidades, animaciones
public/               favicons, imagen social, archivos de marca
docs/                 este archivo y la propuesta del portal
scripts/generar-marca.mjs  exporta el logotipo ANTERIOR; pendiente de rehacer
vercel.json           cabeceras de seguridad y caché
```

## 4. Datos editables (sin tocar código)

| Archivo | Qué contiene | Quién lo lee |
|---|---|---|
| `data/site.json` | Nombre, WhatsApp, correo, ciudad, redes, retrato, lista `clientes` de la marquesina, descripción. `abogado` y `colegiatura` solo se usan en el aviso legal | Base, Cabecera, Pie, Marquesina, aviso legal, llms.txt |
| `data/planes.json` | Los tres planes (`precio: null` = propuesta a medida), `base` común, `comparacion` (por qué un área legal externa), `notas`, `comparativa` (tabla) y `faq` de planes | planes.astro, index.astro, TarjetaPlan, llms.txt |
| `data/kit.json` | Kit de despegue: precio, plazo, pasos, qué incluye | planes.astro, index.astro |
| `data/catalogo.json` | Documentos a precio fijo con categoría y plazo (`precio: null` = «Consultar») | planes.astro |
| `data/frentes.json` | Los dos frentes de «Qué resolvemos» con sus temas; `servicio` enlaza al .md si existe | index.astro |
| `data/faq.json` | Preguntas frecuentes generales (portada, contacto y JSON-LD FAQPage) | Faq.astro |
| `data/testimonios.json` | Testimonios reales. La sección aparece sola cuando `lista` tiene algo | Testimonios.astro |
| `data/academy.json` | Cursos a tu ritmo y recursos descargables. Sus secciones aparecen solas cuando hay algo | academy/index.astro |
| `data/portal-demo.json` | Datos de EJEMPLO del portal. Nunca datos de clientes reales | portal.astro |

Reglas:
- Precios en número sin símbolo (`1000`, no `"S/ 1,000"`); el formato lo pone `soles()`.
- El precio anual se calcula: se pagan `mesesQuePagasAlAnio` meses (10) y se usan 12.
- Cada JSON con `_como` o `_revisar` lleva ahí sus propias instrucciones.

### Agregar un evento a Academy

Crear `src/content/academy/<slug>.md` con el frontmatter del README (`titulo`, `tipo`,
`fecha`, `hora`, `duracion`, `modalidad`, `lugar`, `precio`, `cupos`, `estado`, `resumen`,
`dirigido`; opcionales `programa`, `entregables`, `ponente`). El evento aparece en portada
(si es el próximo), en `/academy`, en `llms.txt` y genera su ficha con JSON-LD `Event`.

### Agregar un servicio

Crear `src/content/servicios/<slug>.md` con `nombre`, `orden`, `incluye`, `plazo`, `precio`,
`area`. Para que aparezca enlazado en «Qué resolvemos», poner ese `slug` en
`data/frentes.json`.

## 5. Componentes

| Componente | Función |
|---|---|
| `Cabecera.astro` | Fija arriba. Logo, 4 enlaces (Inicio, Planes, Academy, Nosotros), interruptor de tema, botón «Agendar reunión». En celular, menú en `<details>` sin JavaScript |
| `Pie.astro` | Enlaces a todas las páginas, contacto en `<address>`, línea legal |
| `WhatsAppFijo.astro` | Barra inferior fija solo en celular: ícono de WhatsApp y botón a `/diagnostico` |
| `Marca.astro` | El logotipo (texto, no imagen): «Díada», filete y «Legal Studio» |
| `CambioTema.astro` | Botón claro/oscuro; guarda la elección en `localStorage` (`tema`) |
| `Boton.astro` / `BotonWhatsApp.astro` | Enlaces con forma de botón; comparten clases de `lib/botones.ts` |
| `Chip.astro` | Etiqueta píldora en versalitas |
| `EncabezadoSeccion.astro` | Etiqueta mono, título y entrada de sección; variante `sobreTinta` |
| `Faq.astro` | Acordeón `<details>`; recibe `items` o usa `faq.json` |
| `Marquesina.astro` | Empresas en movimiento; monograma de iniciales y nombre; un estilo fijo por empresa |
| `TarjetaPlan.astro` | Tarjeta de plan; soporta `precio: null`; expone `data-mensual`/`data-anual` para el interruptor |
| `TarjetaEvento.astro` | Fila de la agenda con día y mes, tipo, título, precio y estado |
| `Testimonios.astro` | Carrusel; solo se dibuja si hay testimonios |
| `FormularioDiagnostico.astro` / `FormularioReferidos.astro` | Formularios que solo componen el mensaje de WhatsApp en el navegador |

## 6. Sistema de diseño

Todo color es un token en `@theme` de `src/styles/global.css`. No hay hexadecimales
sueltos en componentes (salvo máscaras y sombras).

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `tinta` | `#16283A` | `#F4F5F3` | texto, botón primario, fondos fuertes |
| `white` / `blanco` | `#FFFFFF` | `#0F1A26` | fondo de página y tarjetas |
| `niebla` | `#F4F5F3` | `#16233A` | superficie alterna de sección |
| `linea`, `linea-fuerte`, `borde` | grises claros | grises oscuros | reglas de 1 px y bordes |
| `tenue`, `gris` | `#3E4B57`, `#5B6670` | `#C9D3DC`, `#93A0AC` | texto secundario y etiquetas |
| `linea-oscura`, `claro` | sobre tinta | invertidos | reglas y texto en secciones «sobre tinta» |
| `acento`, `acento-claro` | `#E3A92B` | igual | ámbar: botones sobre tinta, «Más elegido», subrayado del titular |
| `jade` | `#146B54` | igual | solo la etiqueta «Grabación disponible» |
| `fijo-oscuro`, `fijo-claro` | `#16283A`, `#FFF` | igual | texto encima de ámbar y jade (no cambian con el modo) |

Reglas:
- **El ámbar nunca va como texto sobre fondo claro** (no cumple contraste). Va como
  fondo con `text-fijo-oscuro` encima, o como línea.
- Las secciones con clase `sobre-tinta` usan `bg-tinta text-white`; en modo oscuro se
  invierten y quedan claras. Es intencional.
- Si agregas un color, dale valor en las dos tablas (`@theme` y el bloque oscuro).

Tipografía: **Newsreader** (títulos, 400; marca y tarjetas, 500), **Public Sans** (texto),
**IBM Plex Mono** (etiquetas `etiqueta`). Autohospedadas vía `@fontsource`; no hay Google
Fonts porque la CSP (`font-src 'self'`) lo bloquea.

Tamaños nombrados: `text-meta` (13 px), `text-base`, `text-lead` (18 px), `text-card`,
`text-seccion`, `text-cierre`, `text-portada` (fluidos con `clamp`).

Geometría: botones píldora (`rounded-full`), tarjetas `rounded-tarjeta` (20 px), campos
`rounded-campo` (12 px). Contenedor de 1240 px con 24 px de margen.

### Modo oscuro

`global.css` define el bloque oscuro dos veces: bajo `@media (prefers-color-scheme: dark)`
para `:root:not([data-theme="light"])` y para `:root[data-theme="dark"]`. El interruptor
escribe `data-theme` en `<html>` y lo guarda en `localStorage`; un `<script is:inline>` en
`Base.astro` lo aplica antes de pintar para evitar el destello.

### Movimiento

Dos animaciones, ambas en `global.css`: la marquesina (`.marquesina-pista`, 28 s por
vuelta, pausa al pasar el cursor) y las palabras de la portada (`.rotar`, 12 s). Con
«reducir movimiento» activo en el sistema, la marquesina va cuatro veces más lento y las
palabras cambian sin deslizar.

## 7. JavaScript en el navegador

Mínimo y con degradación: sin JavaScript, el interruptor mensual/anual queda en
mensual, los filtros muestran todo, el menú del celular funciona (es `<details>`) y los
formularios abren WhatsApp con el mensaje base. Dónde hay script:

- `planes.astro`: interruptor mensual/anual (lee `data-mensual`/`data-anual`) y filtro del
  catálogo por categoría.
- `academy/index.astro`: filtro de la agenda por tipo.
- `CambioTema.astro` y `Base.astro`: tema.
- `Testimonios.astro`: flechas del carrusel.
- `portal.astro`: lee `?empresa=` y lo escribe con `textContent` (nunca como HTML).
- `FormularioDiagnostico.astro` y `FormularioReferidos.astro`: componen el enlace wa.me.

Los `<script>` de Astro se empaquetan como módulos propios; los `is:inline` quedan en el
HTML. La CSP permite ambos (`script-src 'self' 'unsafe-inline'`).

## 8. SEO y buscadores con IA

- Cada página tiene título de 50 a 60 caracteres, descripción, canónica, Open Graph y
  `meta author`.
- `Base.astro` inyecta JSON-LD en todas las páginas: `LegalService` (institucional) y
  `WebPage` con `dateModified` (fecha del build). Las páginas añaden `FAQPage`,
  `OfferCatalog` y `Event` donde corresponde.
- `robots.txt` lleva `Content-Signal: search=yes, ai-input=yes, ai-train=no` (buscadores y
  respuestas sí, entrenamiento no). Cambiar `ai-train` es una decisión de política.
- `llms.txt` se genera en cada build. Sitemap vía `@astrojs/sitemap`.
- Auditoría AEOTester (plugin): 91 %. Lo que falta son versiones Markdown por página.

## 9. Seguridad y privacidad

`vercel.json` fija `Content-Security-Policy`, `X-Frame-Options: DENY`, `Referrer-Policy`,
`Permissions-Policy` y caché larga para `/_astro/`. Al agregar un recurso externo hay que
tocar la CSP a propósito; de lo contrario el navegador lo bloquea. No hay cookies ni
rastreadores, por lo que no hay banner de cookies.

## 10. Convenciones

- Español en código, comentarios, nombres de archivos y commits.
- Mensajes de commit descriptivos, en presente, explicando el porqué.
- Trabajo en rama `claude/...` o `feature/...`, pull request a `main`, Vercel publica.
- Cada cambio visual se revisa con capturas en 1440 px y 390 px, en claro y oscuro.
- Nada de contenido inventado en producción: testimonios, clientes, cursos y recursos
  solo cuando sean reales.

## 11. Pendientes conocidos

- Favicons e imagen social (`public/`) siguen con la marca anterior («Dí» con acento jade);
  `scripts/generar-marca.mjs` también. Rehacer con el logotipo actual.
- Dominio propio y correo con ese dominio; al tenerlos, cambiar `site` en
  `astro.config.mjs` y `correo` en `site.json`.
- Razón social y RUC en `site.json` y aviso legal cuando exista la sociedad.
- Portal real de clientes (`docs/portal-clientes.md`).
