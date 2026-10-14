# Portal de clientes: propuesta técnica

Estado: propuesta para aprobar. No hay código todavía.

## Qué resuelve

Cada empresa cliente entra con su correo y ve, solo de su empresa, cuatro cosas:

1. **Documentos entregados**, con versión y fecha, para descargar.
2. **Pendientes**, lo que el estudio está haciendo y lo que la empresa debe mandar.
3. **Vencimientos**, fechas que no pueden pasarse: renovación de marca, actualización
   anual de política, plazo de respuesta a un requerimiento.
4. **Cupo del plan**, cuántas consultas y documentos lleva usados en el mes.

Nada más en la primera versión. Mensajería, firma electrónica y pagos quedan fuera
hasta que el uso lo pida.

## Dónde vive

Separado del sitio público, en un subdominio propio (por ejemplo
`clientes.diadalegal.pe`). Razones:

- El sitio público es estático, sin cookies ni servidor, y esa es una promesa que
  hace en su aviso legal. El portal necesita las dos cosas.
- Un fallo del portal no puede tumbar la página que capta clientes.
- Los datos de clientes viven en un lugar con acceso restringido, no mezclados con
  un proyecto que cualquier cambio de diseño toca.

## Con qué se construye

| Pieza | Herramienta | Por qué |
|---|---|---|
| Base de datos y acceso | Supabase (Postgres, Auth, Storage) | Seguridad por fila: una empresa solo lee sus filas, y eso lo garantiza la base de datos, no el código de la página. Plan gratuito hasta 500 MB y 50 000 usuarios; el siguiente cuesta 25 USD al mes. |
| Acceso | Enlace mágico al correo (sin contraseña) | Elimina contraseñas olvidadas y el soporte que generan. Opcional: código por WhatsApp más adelante. |
| Aplicación | Astro en modo servidor, desplegada en Vercel | Mismo lenguaje y mismo sistema de diseño que el sitio, así se ve igual y se mantiene con el mismo conocimiento. |
| Archivos | Supabase Storage, con enlaces firmados que caducan | Un documento no se puede compartir con una URL pública. |
| Panel del estudio | La misma aplicación, con un rol «estudio» | Andy sube documentos, marca pendientes y vencimientos desde el portal, sin tocar la base de datos a mano. |

## Modelo de datos (primera versión)

```
empresas        id, razon_social, ruc, plan, inicio_plan, estado
usuarios        id (de Auth), empresa_id, nombre, correo, rol (cliente | estudio)
documentos      id, empresa_id, titulo, categoria, version, archivo, entregado_el
pendientes      id, empresa_id, titulo, responsable (estudio | empresa), vence_el, hecho
vencimientos    id, empresa_id, titulo, fecha, aviso_dias
consumo_mes     empresa_id, mes, consultas_usadas, documentos_usados
```

Cada tabla lleva `empresa_id` y una política de seguridad por fila que solo deja ver
las filas de la empresa del usuario que entró. El rol «estudio» ve todo.

## Lo que exige la Ley 29733

El portal guarda datos personales (nombre y correo de las personas de contacto) y
documentos de las empresas. Eso obliga a:

- Inscribir el banco de datos «Clientes del portal» ante la Autoridad Nacional de
  Protección de Datos Personales, igual que recomendamos a los clientes.
- Una política de privacidad propia del portal, con finalidad, plazo de conservación
  y cómo ejercer los derechos ARCO.
- Contrato de encargo de tratamiento con Supabase y Vercel (ambos lo ofrecen por
  escrito en sus condiciones de servicio; hay que guardarlos).
- Elegir la región de la base de datos. Supabase permite São Paulo; es lo más cercano
  al Perú y evita transferencia a Estados Unidos.

Un estudio que vende cumplimiento de datos personales no puede tener un portal que
no lo cumpla. Esto va en la primera versión, no después.

## Etapas y esfuerzo

| Etapa | Qué queda | Esfuerzo estimado |
|---|---|---|
| 1 | Base de datos, acceso por enlace mágico, lista de documentos por empresa, descarga con enlace firmado | 3 a 4 días de trabajo |
| 2 | Pendientes y vencimientos, con aviso por correo 7 días antes | 2 días |
| 3 | Panel del estudio para subir documentos y marcar pendientes | 2 días |
| 4 | Cupo del plan y consumo del mes | 1 día |

Costo de operación al inicio: 0 USD al mes (Supabase gratuito, Vercel Hobby no sirve
porque es uso comercial, así que el proyecto va en el mismo plan Pro del sitio).

## Lo que conviene hacer antes de escribir código

1. Comprar el dominio, porque el subdominio y los correos de acceso dependen de él.
2. Definir el documento de privacidad del portal y registrar el banco de datos.
3. Cargar los cuatro clientes actuales en Notion con la misma estructura (documentos,
   pendientes, vencimientos) durante dos semanas. Lo que no uses en Notion tampoco lo
   vas a usar en el portal, y eso recorta la primera versión.

## Decisión que se pide

Aprobar la arquitectura y el alcance de la primera versión (etapas 1 a 4). Con eso se
abre un repositorio aparte, `diada-portal`, y se construye en una sesión propia.
