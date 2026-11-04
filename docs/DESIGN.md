# DESIGN.md · Díada Legal Studio

> **Estado: aprobado (versión 1.0, noviembre de 2026).** Decisiones de Andy: paleta A
> (lima), cómo funciona en tres pasos y respuesta el mismo día. Este archivo manda
> sobre el estilo; `docs/ARQUITECTURA.md` §6 lo resume.

## 1. Quiénes somos, visualmente

Díada es una **startup que presta servicios jurídicos a empresas**, no un estudio
tradicional. La web debe sentirse como la de un producto que funciona hoy, no
como la tarjeta de presentación de un despacho.

Tres ideas guían todo:

1. **Mostrar el servicio funcionando.** El visitante ve cómo se verá su empresa
   dentro de Díada: documentos entregados, pendientes, vencimientos, cupo del
   plan. Es lo que hacen Lexgo, Juro, Attio y Pilot, y es lo que ningún estudio
   tradicional puede copiar.
2. **Concreto y ordenado.** Servicios con nombre, pasos numerados de cómo
   trabajamos, precios a la vista. Como Sprintlaw.
3. **Minimalista, no simplista.** Mucho aire, pocas tipografías, un solo color de
   acción, pero cada sección carga contenido real. Como Attio y Juro.

## 2. Referencias y qué tomamos de cada una

| Referencia | Qué tomamos | Qué NO tomamos |
|---|---|---|
| [Lexgo](https://lexgo.cl) | La vista del portal del cliente con tarjetas de cada encargo y su estado; el botón «hablar con un abogado» siempre visible | Su paleta violeta: es competidor directo en LatAm |
| [Sprintlaw](https://sprintlaw.com.au) | Cuadrícula concreta de servicios (ícono, nombre, una línea); «cómo funciona» en cuatro pasos; cierre con varias formas de contacto | Sello de premios y reseñas que no tenemos |
| [Lawpath](https://lawpath.com.au) | Pestañas «¿cómo te ayudamos hoy?» por etapa de la empresa; animaciones de producto; barra superior de promoción | Fotos de stock de personas |
| [Juro](https://juro.com) | Filas alternadas texto + fragmento de la plataforma; texto con frases resaltadas en color; banda oscura de confianza | Afirmaciones de IA y cifras que no tenemos |
| [Attio](https://attio.com) | Fragmentos de interfaz minimalistas pero densos; flujos de trabajo dibujados como diagrama | El tono técnico para desarrolladores |
| [Pilot](https://pilot.com) | Servicio humano vendido como producto; tarjetas de «escenarios» por tipo de cliente | Su violeta |
| [Lawhive](https://lawhive.co.uk) | Fondo cálido, tipografía grande y limpia, mucho aire; equipo con rostro | Ventanas emergentes |
| [Legalario](https://legalario.com) | Pestañas de productos con su flujo de trabajo | Degradados |

## 3. Reglas que siguen vigentes (CLAUDE.md)

- Sitio estático, sin servidor. Toda conversión termina en WhatsApp.
- Ningún color suelto: todo es token de `src/styles/global.css`, con valor en claro
  y en oscuro.
- **Nada inventado.** Ni clientes, ni testimonios, ni cifras, ni funciones de la
  plataforma que no existan. El portal se muestra como **demostración**, con datos
  de ejemplo de `src/data/portal-demo.json`, y se rotula como tal.

### Lo que queda fuera por ahora, y por qué

- **Ingreso con Google al portal.** Requiere servidor y base de datos. El portal real
  vive en otro proyecto (`docs/portal-clientes.md`). La web enlaza a la demo.
- **Logos de empresas clientes.** Vuelven cuando haya logos de calidad y
  autorización escrita de cada una (`site.json` → `clientes`).
- **Promesas de tiempo de respuesta.** El compromiso real es **respuesta el mismo
  día**. Nada más rápido que eso se promete en la web.

## 4. Color

Base clara y limpia, tinta casi negra, **un solo color de acción** y una banda oscura
para el contraste. Las secciones se separan por campos de color completos, no por
líneas.

Se eligió la opción A. La B queda documentada como alternativa descartada.

### Opción A · Lima (aprobada)

Fresca, poco vista en servicios jurídicos de la región y lejos del violeta de Lexgo.

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `tinta` | `#0E0F12` | `#F4F5F2` | texto y botón principal |
| `fondo` | `#FFFFFF` | `#0E0F12` | página |
| `superficie` | `#F4F5F2` | `#191B20` | secciones alternas, tarjetas |
| `acento` | `#C8F169` | `#C8F169` | resaltado de frases, chips de estado, botón sobre oscuro |
| `acento-fuerte` | `#2F5D0E` | `#C8F169` | texto de acento sobre claro (el lima no tiene contraste como texto) |
| `ok` | `#1F8A4C` | `#4ADE80` | «Entregado», «Firmado» |
| `pendiente` | `#B45309` | `#FBBF24` | «Pendiente de firma», «Por vencer» |

En el código, `fondo` es `blanco` y `superficie` es `niebla`: se conservaron los
nombres de token que ya usaban todos los componentes.

### Opción B · Violeta eléctrico (descartada)

Más cercana a Lexgo, Lawpath y Pilot, las referencias que más te gustaron. Riesgo:
parecerse al competidor directo.

| Token | Claro | Oscuro |
|---|---|---|
| `tinta` | `#100E1A` | `#F3F1FA` |
| `acento` | `#5B3DF5` | `#8B74FF` |
| `superficie` | `#F3F0FF` | `#1A1630` |
| `resaltado` | `#FFE066` | `#FFE066` |

## 5. Tipografía

Una sola familia sans moderna para todo, sin cursivas decorativas. **Geist
Variable** (autohospedada vía `@fontsource-variable/geist`, la CSP solo permite
fuentes propias). Cifras tabulares en precios y fechas.

| Rol | Tamaño | Peso | Tracking |
|---|---|---|---|
| Portada | `clamp(40px, 5.6vw, 80px)` | 600 | -0.03em |
| Sección | `clamp(30px, 3.6vw, 52px)` | 600 | -0.025em |
| Tarjeta | 20 px | 600 | -0.01em |
| Texto | 17 px, interlineado 1.6 | 400 | 0 |
| Pequeño | 14 px | 500 | 0 |

Cinco tamaños como máximo. Sale IBM Plex Mono (las etiquetas pasan a la misma
familia, en tamaño pequeño y peso 500, sin mayúsculas espaciadas).

**Excepción: el logotipo.** «Díada» sigue en Newsreader y «Legal Studio» en DM Sans
(`font-marca` y `font-marca-sans`), porque el logotipo es el mismo del kit de marca,
el favicon y la imagen social.

## 6. Componentes

- **Botones.** Píldora. Principal en `tinta` con texto claro; sobre fondo oscuro, en
  `acento` con texto `tinta`. Uno solo principal por grupo.
- **Tarjeta de servicio.** Fondo `superficie`, radio 16 px, ícono de línea arriba,
  nombre y una línea. Al pasar el cursor sube 2 px y el ícono toma el acento.
- **Fragmento de portal.** Réplica en HTML (no imagen) de la demo del portal:
  tarjetas de encargo con nombre, estado en chip de color, última actividad y barra
  de avance. Lleva `data-ui` y un rótulo pequeño «Demostración».
- **Chip de estado.** Píldora pequeña con punto de color: Entregado, En revisión,
  Pendiente de firma, Por vencer.
- **Frase resaltada.** Dentro de un párrafo grande, una o dos frases con fondo
  `acento` como marcador (Juro). Máximo una vez por sección.
- **Pasos.** Lista ordenada real (`<ol>`) con número grande, título y una línea.
- **Barra de anuncio.** Franja superior opcional para promociones reales; se activa
  desde un JSON y desaparece sola cuando está vacío.

## 7. Movimiento

Vivo pero sobrio. Solo `transform` y `opacity`, y todo se apaga con «reducir
movimiento».

- Entrada escalonada de cada sección.
- **El portal en acción:** en el hero, los chips cambian de estado y las barras de
  avance se llenan en bucle lento («Pendiente de firma» → «Firmado»). Es la
  respuesta a los videos de Lawpath sin pesar megas.
- Elevación suave al pasar el cursor por tarjetas y botones.

## 8. La portada, sección por sección

1. **Barra de anuncio** (solo si hay promoción real).
2. **Cabecera.** Marca, cinco enlaces, «Ver demo del portal» y el botón principal
   «Hablar con un abogado» (WhatsApp).
3. **Hero.** Titular corto, una línea de apoyo, dos botones. A la derecha, el
   fragmento del portal con las tarjetas de encargos rodeadas de chips flotantes
   (idea de Lexgo + Sprintlaw).
4. **Qué resolvemos.** Cuadrícula concreta de servicios (Sprintlaw), desde
   `frentes.json` y `src/content/servicios`.
5. **Cómo funciona.** Tres pasos reales: reunión gratuita → eliges un plan (de los
   actuales o a medida) → ejecutamos todo en tu portal.
6. **El portal.** Filas alternadas texto + fragmento (Juro, Attio): documentos,
   pendientes, vencimientos, cupo del plan. Datos de `portal-demo.json`.
7. **¿Qué necesita tu empresa?** Selector de tres preguntas que recomienda un plan y
   arma el mensaje de WhatsApp (Deel, Lawpath).
8. **Planes.** Los tres planes actuales con el nuevo estilo.
9. **Quiénes somos.** La ilustración del par abogado y fundador, y el equipo cuando
   haya fotos reales.
10. **Academy.** Próximo evento.
11. **Preguntas frecuentes.**
12. **Cierre** en banda oscura con todas las formas de contacto (Sprintlaw).

## 9. Lo que no se hace

- Degradados de fondo, vidrio esmerilado, 3D brillante, avatares de dibujos.
- Más de un color de acción.
- Texto gris claro en párrafos (el texto corrido va en `tinta`).
- Cifras, logos, reseñas o funciones inventadas.
- Imágenes de stock genéricas de «abogado con martillo» o balanzas.

## 10. Cómo se verifica

- `npm run build` y `npx astro check` sin errores.
- Capturas con Playwright en 1440, 768 y 390 px, en claro y oscuro, en cada cambio.
- El inspector de `design-taste-frontend` se usa solo para lo medible (contraste,
  desbordes, titulares de más de dos líneas, texto pegado al borde). Sus reglas de
  gusto (sin tarjetas, sin chips, sin etiquetas) **no aplican** a este proyecto: las
  referencias elegidas las usan a propósito.
