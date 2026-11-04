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
- Producción: `https://www.diadalegalstudio.com` (la dirección `andy-jc-legal-studio.vercel.app` redirige ahí por `vercel.json`). Cada push a `main` publica solo.
  Cada rama abre una vista previa automática que Vercel comenta en el pull request.
- **No hay servidor, base de datos, cookies, analítica ni formularios que envíen datos.**
  Toda conversión termina en WhatsApp con un mensaje prellenado. Las cabeceras de
  `vercel.json` (`connect-src 'none'`, `form-action 'none'`) lo imponen: un `fetch` o un
  `<form action>` agregado por descuido lo bloquea el navegador.
- El portal de clientes en `/portal` es una **maqueta navegable** con datos de ejemplo:
  inicio y una pantalla por área. Las páginas leen todo a través de `src/lib/portal.ts`,
  así que los componentes pasan al portal real sin cambios. El portal real (acceso,
  base de datos, archivos) está propuesto en `docs/portal-clientes.md` y vive en otro
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
    portal/index.astro    portal del cliente, inicio (maqueta con datos de ejemplo)
    portal/[area].astro   una pantalla por área: societario, contratos, consumidor, casos especiales
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
    portal.ts         capa de datos del portal: tipos, lectura y cálculos de plazos; lo único
                      que se reemplaza cuando entre la base de datos
  styles/global.css   tokens de color y tipografía, modo oscuro, utilidades, animaciones
public/               favicons, imagen social, archivos de marca
docs/                 este archivo y la propuesta del portal
scripts/generar-marca.mjs  genera marca/, favicons, og-image y, con --kit, el kit completo
vercel.json           cabeceras de seguridad y caché
```

## 4. Datos editables (sin tocar código)

| Archivo | Qué contiene | Quién lo lee |
|---|---|---|
| `data/site.json` | Nombre, WhatsApp, correo, ciudad, redes, retrato, lista `clientes` de la marquesina, descripción. `abogado` y `colegiatura` solo se usan en el aviso legal | Base, Cabecera, Pie, Marquesina, aviso legal, llms.txt |
| `data/planes.json` | Los tres planes (`precio: null` = propuesta a medida), `base` común, `negociable`, `comparacion` (por qué un área legal externa), `notas`, `reglas`, `comparativa` (tabla) y `faq` de planes | planes.astro, index.astro, TarjetaPlan, llms.txt |
| `data/kit.json` | Kit de despegue: precio, plazo, pasos, qué incluye | planes.astro, index.astro |
| `data/catalogo.json` | Documentos a precio fijo con categoría y plazo (`precio: null` = «Consultar») | planes.astro |
| `data/frentes.json` | Los dos frentes de «Qué resolvemos» con sus temas; `servicio` enlaza al .md si existe | index.astro |
| `data/faq.json` | Preguntas frecuentes generales (portada, contacto y JSON-LD FAQPage) | Faq.astro |
| `data/testimonios.json` | Testimonios reales. La sección aparece sola cuando `lista` tiene algo | Testimonios.astro |
| `data/academy.json` | Cursos a tu ritmo y recursos descargables. Sus secciones aparecen solas cuando hay algo | academy/index.astro |
| `data/portal-demo.json` | Datos de EJEMPLO del portal, por área (encargos, documentos, pendientes, plazos), cupo y `fechaDemo`. Nunca datos de clientes reales: el repositorio es público | `lib/portal.ts`, FragmentoPortal |

Reglas:
- Precios en número sin símbolo (`1000`, no `"S/ 1,000"`); el formato lo pone `soles()`.
- El precio anual se calcula con `descuentoAnualPct` (20 %) sobre doce meses.
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
| `Cabecera.astro` | Fija arriba. Logo, 5 enlaces (Inicio, Planes, Academy, Referidos, Nosotros), interruptor de tema, botón «Agendar reunión». En celular, menú en `<details>` sin JavaScript |
| `Pie.astro` | Enlaces a todas las páginas, contacto en `<address>`, línea legal |
| `WhatsAppFijo.astro` | Barra inferior fija solo en celular: ícono de WhatsApp y botón a `/diagnostico` |
| `Marca.astro` | El logotipo (texto, no imagen): «Díada», filete y «Legal Studio», con sus propias fuentes (`font-marca`) |
| `CambioTema.astro` | Botón claro/oscuro; guarda la elección en `localStorage` (`tema`) |
| `Boton.astro` / `BotonWhatsApp.astro` | Enlaces con forma de botón; comparten clases de `lib/botones.ts` |
| `Chip.astro` | Etiqueta píldora en versalitas |
| `EncabezadoSeccion.astro` | Etiqueta mono, título y entrada de sección; variante `sobreTinta` |
| `Faq.astro` | Acordeón `<details>`; recibe `items` o usa `faq.json` |
| `Marquesina.astro` | Empresas en movimiento; monograma de iniciales y nombre; un estilo fijo por empresa |
| `portal/MarcoPortal.astro` | Marco de toda pantalla del portal: aviso de demostración, empresa y menú de áreas (lateral en escritorio, pestañas en celular) |
| `portal/TarjetaEncargo.astro`, `portal/ChipEstado.astro` | Tarjeta de encargo con estado y avance; píldora de estado ok, pendiente o neutro |
| `FragmentoPortal.astro` | El portal del cliente en acción en la portada: réplica HTML de la demo con datos de `portal-demo.json` (`encargos`, `cupo`), rotulada «Demostración» |
| `TarjetaPlan.astro` | Tarjeta de plan; soporta `precio: null`; expone `data-mensual`/`data-anual` para el interruptor |
| `TarjetaEvento.astro` | Fila de la agenda con día y mes, tipo, título, precio y estado |
| `Testimonios.astro` | Carrusel; solo se dibuja si hay testimonios |
| `FormularioDiagnostico.astro` / `FormularioReferidos.astro` | Formularios que solo componen el mensaje de WhatsApp en el navegador |

## 6. Sistema de diseño

La dirección visual completa está en `docs/DESIGN.md` (aprobado en noviembre de
2026): startup que muestra su servicio funcionando, paleta lima, Geist. Este
apartado resume lo que vive en el código.

Todo color es un token en `@theme` de `src/styles/global.css`. No hay hexadecimales
sueltos en componentes (salvo la meta `theme-color` y máscaras).

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `tinta` | `#0E0F12` | `#F4F5F2` | texto, botón primario, fondos fuertes |
| `white` / `blanco` | `#FFFFFF` | `#0E0F12` | fondo de página y tarjetas |
| `niebla` | `#F4F5F2` | `#191B20` | superficie alterna, tarjetas sobre blanco |
| `acento`, `acento-claro` | `#C8F169`, `#D6F58A` | igual | lima: resaltado, chips, botón sobre tinta |
| `acento-fuerte` | `#2F5D0E` | `#C8F169` | texto o punto de acento sobre claro |
| `ok`, `pendiente` | `#1F8A4C`, `#B45309` | `#4ADE80`, `#FBBF24` | estados del portal |
| `linea`, `linea-fuerte`, `borde` | grises claros | grises oscuros | reglas de 1 px y bordes |
| `tenue`, `gris` | `#3B3F46`, `#5D626B` | `#C9CCD2`, `#9AA0A9` | texto secundario |
| `lienzo` | `#F3F4F1` | igual | marco de las ilustraciones |
| `fijo-oscuro`, `fijo-claro` | `#0E0F12`, `#FFF` | igual | texto encima del lima y del jade |
| `jade`, `ambar` | `#146B54`, `#E3A92B` | igual | solo Academy |

Reglas:
- **El lima nunca va como texto sobre fondo claro.** Va como fondo con
  `text-fijo-oscuro` encima, o como banda (`resaltado`). Para texto de acento sobre
  claro está `acento-fuerte`.
- `resaltado` es la frase marcada en lima de un titular; una por sección como máximo.
- Si agregas un color, dale valor en las dos tablas (`@theme` y el bloque oscuro).

Tipografía: **Geist Variable** para todo el sitio (titulares en 600 con tracking
negativo, texto en 400, etiquetas en 500). Las clases `font-mono` que quedan toman
Geist con cifras tabulares. El logotipo es la excepción: Newsreader y DM Sans
(`font-marca`, `font-marca-sans`), iguales al kit de marca. Todas autohospedadas vía
`@fontsource-variable`; la CSP (`font-src 'self'`) bloquea Google Fonts.

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

Todas en `global.css`: la marquesina (`.marquesina-pista`, 28 s por vuelta, pausa al
pasar el cursor), las palabras de la portada (`.rotar`, 12 s), la entrada escalonada
(`.entra`) y el portal en acción de la portada (`FragmentoPortal.astro`: chips que
cambian de estado, barras que se llenan y avisos que flotan, ciclo de 9 s). Con
«reducir movimiento» activo, la marquesina va cuatro veces más lento, las palabras
cambian sin deslizar y la entrada y el portal quedan quietos.

## 7. JavaScript en el navegador

Mínimo y con degradación: sin JavaScript, el interruptor mensual/anual queda en
mensual, los filtros muestran todo, el menú del celular funciona (es `<details>`) y los
formularios abren WhatsApp con el mensaje base. Dónde hay script:

- `planes.astro`: interruptor mensual/anual (lee `data-mensual`/`data-anual`) y filtro del
  catálogo por categoría.
- `academy/index.astro`: filtro de la agenda por tipo.
- `CambioTema.astro` y `Base.astro`: tema.
- `Testimonios.astro`: flechas del carrusel.
- `portal/MarcoPortal.astro`: lee `?empresa=`, lo escribe con `textContent` (nunca como
  HTML) y lo agrega a los enlaces del menú para conservarlo entre áreas.
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

## 11. Marca

`scripts/generar-marca.mjs` convierte el logotipo a trazos (fontkit) y rasteriza con
Chromium (playwright-core; ruta en `CHROME_PATH` o las usuales). Sin argumentos rehace
`marca/`, `public/marca/`, los favicons y `og-image.png`. Con `--kit DIR` arma el kit
completo (perfiles, portadas, plantillas, fuentes). La guía de uso vive en el kit.

## 12. Pendientes conocidos

- Correo con el dominio propio; al tenerlo, cambiar `correo` en `site.json` y en la
  firma del kit.
- Razón social y RUC en `site.json` y aviso legal cuando exista la sociedad.
- Portal real de clientes (`docs/portal-clientes.md`).
