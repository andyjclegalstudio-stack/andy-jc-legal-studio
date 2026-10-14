# Díada Legal Studio · Guía de marca

Versión de octubre de 2026. Todo lo que hay en este kit sale de la misma geometría y los mismos colores que usa el sitio www.diadalegalstudio.com. Si el sitio cambia, el kit se regenera con un comando (`node scripts/generar-marca.mjs --kit carpeta`) y nada queda desincronizado.

## 1. Qué hay en el kit

| Carpeta | Contenido | Para qué |
|---|---|---|
| `01-logotipo` | Logotipo horizontal en tinta, blanco y negro (SVG, PNG de 2400 px con fondo transparente, PDF vectorial) y el monograma «D» (tinta, claro y sin fondo) | Documentos, presentaciones, imprenta, proveedores de diseño |
| `02-perfil` | Fotos de perfil cuadradas por plataforma, en dos versiones: monograma y logotipo | WhatsApp Business, LinkedIn, Facebook, Instagram, Gmail, X |
| `03-portadas` | Portadas en las medidas exactas de LinkedIn (empresa y personal), Facebook, X y YouTube, en versión oscura y clara | Banners de cada perfil |
| `04-publicaciones` | Plantilla de publicación cuadrada, plantilla de historia y la imagen que aparece al compartir el enlace del sitio | Redes sociales |
| `05-fuentes` | Las tipografías instalables (TTF), con licencia libre para uso comercial | Word, PowerPoint, Canva, Illustrator |
| `06-firma-de-correo` | Firma HTML para Gmail con instrucciones dentro | Correo |

## 2. El logotipo

Tres piezas: la palabra **Díada** en Newsreader (peso medio), un **filete vertical** y **LEGAL STUDIO** en DM Sans, versalitas con mucho espacio entre letras. El filete separa el nombre de la descripción y le da al conjunto su proporción; no se quita.

**Versiones.**
1. `logotipo-tinta`: la principal. Va sobre blanco o sobre el gris claro.
2. `logotipo-blanco`: sobre tinta o sobre fotos oscuras y parejas.
3. `logotipo-negro`: sellos, fotocopias, una sola tinta.
4. `monograma-tinta`: la «D» en un cuadrado de esquinas redondeadas. Es la foto de perfil y el ícono de la web. No reemplaza al logotipo donde cabe el logotipo.

**Reglas.**
1. No estirar. Si cambia el ancho, cambia el alto en la misma proporción. En Word, PowerPoint y Canva se arrastra desde una esquina, nunca desde un lado.
2. Aire alrededor, como mínimo la altura de la «D» en los cuatro lados. Los archivos ya traen ese margen.
3. Tamaño mínimo: 24 px de alto en pantalla, 10 mm impreso. Más chico que eso, «LEGAL STUDIO» deja de leerse y se usa el monograma.
4. Nunca sobre una foto con detalle. Si no hay más remedio, versión blanca sobre una zona oscura y uniforme.
5. No recolorear. Tinta, blanco o negro. El ámbar es para subrayar y señalar, nunca para el logotipo.
6. Sin sombras, degradados, contornos ni efectos.

## 3. Colores

| Color | HEX | RGB | CMYK aproximado | Uso |
|---|---|---|---|---|
| Tinta | `#16283A` | 22, 40, 58 | 88, 70, 45, 45 | Texto, logotipo, fondos fuertes, botón principal |
| Blanco | `#FFFFFF` | 255, 255, 255 | 0, 0, 0, 0 | Fondo principal |
| Niebla | `#F4F5F3` | 244, 245, 243 | 3, 1, 3, 0 | Fondo alterno, tarjetas |
| Ámbar | `#E3A92B` | 227, 169, 43 | 10, 35, 95, 0 | Acento: subrayado, etiqueta «Más elegido», botón sobre tinta |
| Tenue | `#3E4B57` | 62, 75, 87 | 75, 60, 45, 25 | Texto secundario |
| Gris | `#5B6670` | 91, 102, 112 | 65, 50, 40, 15 | Etiquetas, notas |
| Tinta oscura | `#0F1A26` | 15, 26, 38 | 90, 75, 50, 60 | Fondo del modo oscuro |

Regla de contraste. **El ámbar nunca va como texto sobre fondo claro**; no se lee. Va como línea, como fondo de etiqueta con texto tinta encima, o como botón sobre tinta. Proporción recomendada en cualquier pieza: 70 % blanco o niebla, 25 % tinta, 5 % ámbar.

## 4. Tipografías

| Uso | Fuente | Peso | Dónde conseguirla |
|---|---|---|---|
| Nombre de marca, titulares | **Newsreader** | 400 titulares, 500 marca y títulos de tarjeta | Carpeta `05-fuentes` o Google Fonts |
| Texto, botones, «LEGAL STUDIO» | **DM Sans** | 400 texto, 500 notas, 600 botones y versalitas | Carpeta `05-fuentes` o Google Fonts |
| Etiquetas pequeñas en versalitas | **IBM Plex Mono** | 400 | Carpeta `05-fuentes` o Google Fonts |

Las tres tienen licencia SIL Open Font License: uso comercial libre, se pueden instalar en cualquier computadora y subir a Canva (Marca → Tipografías de marca → Subir). Titulares en Newsreader, siempre regulares, sin negrita. Las versalitas espaciadas llevan entre 0.14 y 0.24 em de espacio entre letras. Los precios en DM Sans semibold.

## 5. Medidas por plataforma y qué archivo usar

| Plataforma | Foto de perfil | Archivo | Portada | Archivo |
|---|---|---|---|---|
| WhatsApp Business | 640 × 640, se ve en círculo | `02-perfil/whatsapp-business-640-monograma.png` | no tiene | |
| LinkedIn, página de empresa | 300 × 300 mínimo | `02-perfil/linkedin-empresa-400-monograma.png` | 1128 × 191 | `03-portadas/linkedin-empresa-1128x191-oscura.png` |
| LinkedIn, perfil personal | tu foto | | 1584 × 396 | `03-portadas/linkedin-personal-1584x396-oscura.png` |
| Facebook, página | 1080 × 1080, se ve en círculo | `02-perfil/facebook-instagram-1080-monograma.png` | 1640 × 624, en celular se ve el centro | `03-portadas/facebook-1640x624-oscura.png` |
| Instagram | 1080 × 1080 | `02-perfil/facebook-instagram-1080-monograma.png` | no tiene | |
| Gmail y cuenta de Google | 500 × 500 | `02-perfil/gmail-google-500-monograma.png` | | |
| X | 400 × 400 | `02-perfil/linkedin-personal-o-x-400-monograma.png` | 1500 × 500 | `03-portadas/x-twitter-1500x500-oscura.png` |
| YouTube | 800 × 800 | `02-perfil/facebook-instagram-1080-monograma.png` | 2560 × 1440, en celular se ve el centro | `03-portadas/youtube-2560x1440-oscura.png` |

Por qué el monograma y no el logotipo en la foto de perfil. Las plataformas recortan en círculo y muestran la foto a 40 px en el celular; a ese tamaño el logotipo completo es una mancha y la «D» sigue siendo una «D». La versión con logotipo (`...-logotipo.png`) queda para donde la foto se muestra cuadrada y grande. La versión clara de cada portada es para perfiles donde se quiera contraste con una foto de perfil oscura, o para impresión.

## 6. Textos listos para pegar

**Descripción corta (LinkedIn «eslogan», 120 caracteres; Facebook «intro», 101).**
> Tu área legal externa. Abogados especialistas para micro y pequeñas empresas del Perú, por una cuota mensual.

**Descripción de WhatsApp Business (hasta 256 caracteres).**
> Área legal externa para empresas. Contratos, marcas, laboral, tributario, datos personales y cumplimiento, con un equipo de abogados especialistas y visión de negocio. Planes mensuales sin permanencia. Escríbenos y agendamos una reunión gratuita de 30 minutos.

**Mensaje de bienvenida de WhatsApp Business.**
> Hola, gracias por escribir a Díada Legal Studio. Cuéntanos en dos líneas qué necesita tu empresa y te respondemos el mismo día hábil. Si prefieres, agenda una reunión gratuita de 30 minutos aquí: www.diadalegalstudio.com/diagnostico

**Mensaje de ausencia de WhatsApp Business.**
> Gracias por escribir a Díada Legal Studio. Atendemos de lunes a viernes de 9:00 a 19:00. Te respondemos a primera hora del siguiente día hábil. Si es urgente por un requerimiento o una notificación, indícalo en tu mensaje.

**Acerca de (LinkedIn, hasta 2 000 caracteres; también sirve para Facebook).**
> Díada Legal Studio es el área legal externa de micro y pequeñas empresas del Perú.
>
> No contratas un abogado, contratas un equipo de abogados especialistas en Derecho Empresarial y Derecho Digital, con formación en dirección de empresas y una red de contadores e ingenieros que entra cuando tu rubro lo pide. Trabajamos por una cuota mensual, sin permanencia, con la base legal de tu negocio armada según tu giro y mantenida cada mes.
>
> Resolvemos contratos, marcas, sociedades, cumplimiento y prevención penal, tributario y laboral; y en lo digital, protección de datos personales, términos para plataformas y protección al consumidor.
>
> Tres planes (Arranque, Operación y Cumplimiento) y un kit de despegue de pago único para empezar sin cuota. Díada Academy dicta charlas abiertas, talleres y entrenamiento in company.
>
> Base en Huánuco, atención a todo el país. Servicio solo para empresas. www.diadalegalstudio.com

**Especialidades (LinkedIn, hasta 20).**
> Derecho empresarial, Derecho digital, Contratos comerciales, Protección de datos personales, Registro de marcas, Constitución de empresas, Cumplimiento, Derecho laboral, Derecho tributario, Protección al consumidor, Asesoría legal por suscripción, MYPE

**Hashtags base.**
> #DerechoEmpresarial #DerechoDigital #MYPE #Perú #AsesoríaLegal #Emprendedores #ProtecciónDeDatos #Contratos

## 7. Voz

Directa, concreta y sin latín. Se habla de tú a la empresa. Frases cortas. Se nombra el problema del cliente antes que la norma. No se promete lo que no se puede cumplir, y nunca se publica un testimonio, un cliente o un resultado que no sea real.

Frases que ya son de la marca.
1. Tu área legal para tu empresa.
2. No contratas un abogado, contratas un área legal de especialistas que se preocupa por tu negocio.
3. Que un contrato no frene el negocio.

## 8. Lo que no se hace

1. No se usa el logotipo anterior (el del acento en verde jade). Si aparece en algún lado, se reemplaza.
2. No se mezclan otras tipografías.
3. No se usan fotos de archivo de gente con corbata estrechándose la mano.
4. No se publica un precio tachado que nunca se cobró.
5. No se usa el nombre de un cliente sin su autorización.
