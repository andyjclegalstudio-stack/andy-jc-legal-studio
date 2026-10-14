/**
 * Genera todos los archivos de marca desde la misma geometría que usa la
 * cabecera del sitio (Marca.astro): «Díada» en Newsreader 500, un filete
 * vertical y «LEGAL STUDIO» en DM Sans 600 con versalitas espaciadas.
 *
 *   node scripts/generar-marca.mjs            → actualiza marca/ y public/
 *   node scripts/generar-marca.mjs --kit DIR  → además arma el kit completo en DIR
 *
 * El texto se convierte a trazos (fontkit), así los SVG y PDF no dependen de
 * que quien los abra tenga las fuentes. Los PNG y PDF se rasterizan con un
 * Chromium: se busca playwright-core y la ruta en CHROME_PATH o las usuales.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as fontkit from 'fontkit';
import { createRequire } from 'node:module';
const wawoff2 = createRequire(import.meta.url)('wawoff2');

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(raiz, 'src/data/site.json'), 'utf8'));
const argKit = process.argv.indexOf('--kit');
const KIT = argKit > -1 ? path.resolve(process.argv[argKit + 1]) : null;

/* Los mismos valores que src/styles/global.css. */
const C = {
  tinta: '#16283A', blanco: '#FFFFFF', niebla: '#F4F5F3', acento: '#E3A92B',
  tenue: '#3E4B57', gris: '#5B6670', claro: '#C9D3DC', oscuro: '#0F1A26', negro: '#000000',
};
const WEB = 'www.diadalegalstudio.com';

// ---------- Fuentes ----------
const fuentesDir = path.join(raiz, 'marca/fuentes');
fs.mkdirSync(fuentesDir, { recursive: true });
const fuente = async (nombre, woff2) => {
  const destino = path.join(fuentesDir, nombre + '.ttf');
  const ttf = await wawoff2.decompress(fs.readFileSync(path.join(raiz, 'node_modules', woff2)));
  fs.writeFileSync(destino, ttf);
  return fontkit.openSync(destino);
};
const newsreader = await fuente('Newsreader-Variable', '@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2');
await fuente('Newsreader-Variable-Italic', '@fontsource-variable/newsreader/files/newsreader-latin-opsz-italic.woff2');
const dmsans = await fuente('DMSans-Variable', '@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2');
await fuente('IBMPlexMono-Regular', '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2');
const serif = (opsz = 24) => newsreader.getVariation({ wght: 500, opsz });
const serifLigera = (opsz = 72) => newsreader.getVariation({ wght: 400, opsz });
const sans = (wght = 600) => dmsans.getVariation({ wght });

/** Convierte un texto a un trazo SVG con la línea base en y=0 y el inicio en x=0. */
function trazo(font, texto, size, tracking = 0) {
  const run = font.layout(texto);
  const s = size / font.unitsPerEm;
  let x = 0;
  const partes = [];
  run.glyphs.forEach((g, i) => {
    const p = run.positions[i];
    const d = g.path.scale(s, -s).translate(x + p.xOffset * s, -p.yOffset * s).toSVG();
    if (d) partes.push(d);
    x += p.xAdvance * s + tracking * size;
  });
  return { d: partes.join(' '), ancho: x - tracking * size, cap: (font.capHeight / font.unitsPerEm) * size };
}

// ---------- Logotipo horizontal ----------
/** Devuelve el contenido SVG del logotipo con el nombre a tamaño N. */
function logotipo(N, color, margen = 0) {
  const nombre = trazo(serif(24), 'Díada', N, -0.015);
  const bajada = trazo(sans(600), 'LEGAL STUDIO', N * 0.367, 0.24);
  const hueco = N * 0.467, filete = N / 30, alto = N * 0.8;
  const cy = -nombre.cap / 2;                      // centro óptico del nombre
  const xFilete = nombre.ancho + hueco;
  const xBajada = xFilete + filete + hueco;
  const ancho = xBajada + bajada.ancho;
  const arriba = -N * 0.95, abajo = N * 0.25;      // caja vertical del nombre (ascendentes y descendentes)
  const contenido = `
  <g fill="${color}">
    <path d="${nombre.d}"/>
    <rect x="${xFilete.toFixed(2)}" y="${(cy - alto / 2).toFixed(2)}" width="${filete.toFixed(2)}" height="${alto.toFixed(2)}"/>
    <path transform="translate(${xBajada.toFixed(2)} ${(cy + bajada.cap / 2).toFixed(2)})" d="${bajada.d}"/>
  </g>`;
  return { contenido, ancho, arriba, abajo, viewBox: `${-margen} ${arriba - margen} ${ancho + margen * 2} ${abajo - arriba + margen * 2}` };
}
const svgLogotipo = (color, fondo = null) => {
  const l = logotipo(100, color, 40);
  const [, , w, h] = l.viewBox.split(' ').map(Number);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${l.viewBox}" width="${w}" height="${h}">${fondo ? `<rect x="-40" y="${l.arriba - 40}" width="${w}" height="${h}" fill="${fondo}"/>` : ''}${l.contenido}</svg>`;
};

// ---------- Monograma ----------
function monograma(S, fondo, color, radio = 10 / 48) {
  const d = trazo(serif(24), 'D', S * 0.66);
  const x = (S - d.ancho) / 2, y = S / 2 + d.cap / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">
  ${fondo ? `<rect width="${S}" height="${S}" rx="${(S * radio).toFixed(1)}" fill="${fondo}"/>` : ''}
  <path transform="translate(${x.toFixed(2)} ${y.toFixed(2)})" fill="${color}" d="${d.d}"/>
</svg>`;
}

// ---------- Piezas compuestas (perfiles, portadas, social) ----------
/** Logotipo colocado en un lienzo: devuelve <g> con transform. */
function logoEn(N, color, x, y) {
  const l = logotipo(N, color);
  return { g: `<g transform="translate(${x} ${y})">${l.contenido}</g>`, ancho: l.ancho, alto: l.abajo - l.arriba, arriba: l.arriba };
}
function textoEn(font, texto, size, color, x, y, tracking = 0, ancla = 'start') {
  const t = trazo(font, texto, size, tracking);
  const dx = ancla === 'middle' ? -t.ancho / 2 : ancla === 'end' ? -t.ancho : 0;
  return { g: `<path transform="translate(${(x + dx).toFixed(2)} ${y.toFixed(2)})" fill="${color}" d="${t.d}"/>`, ancho: t.ancho };
}
const lienzo = (w, h, fondo, cuerpo) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${fondo}"/>${cuerpo}</svg>`;

/** Perfil cuadrado: monograma grande centrado (lo que se ve en un círculo). */
function perfil(S, oscuro = true) {
  const fondo = oscuro ? C.tinta : C.niebla, color = oscuro ? C.blanco : C.tinta;
  const d = trazo(serif(24), 'D', S * 0.56);
  return lienzo(S, S, fondo, `<path transform="translate(${((S - d.ancho) / 2).toFixed(2)} ${(S / 2 + d.cap / 2).toFixed(2)})" fill="${color}" d="${d.d}"/>`);
}
/** Perfil con el logotipo completo, dentro del círculo seguro. */
function perfilLogotipo(S) {
  const l = logotipo(S * 0.22, C.tinta);
  const esc = (S * 0.62) / l.ancho; // que quepa en el círculo
  const N = S * 0.22 * esc;
  const L = logoEn(N, C.tinta, 0, 0);
  const x = (S - L.ancho) / 2, y = S / 2 - (L.arriba + L.alto / 2);
  return lienzo(S, S, C.blanco, `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)})">${logotipo(N, C.tinta).contenido}</g>`);
}
/** Portada: fondo tinta, logotipo blanco, frase y datos. `seguro` es el ancho visible en celular. */
function portada(w, h, { oscuro = true, seguro = w, pad = null } = {}) {
  const fondo = oscuro ? C.tinta : C.blanco, color = oscuro ? C.blanco : C.tinta, sec = oscuro ? C.claro : C.tenue;
  const P = pad ?? Math.round(h * 0.16);
  const izq = (w - seguro) / 2 + P;
  /* Logotipo y frase se escalan para caber en el área segura, con tope por altura. */
  const disponible = seguro - 2 * P;
  const N = Math.min(Math.round(h * 0.17), (disponible * 0.6) / logotipo(1, color).ancho);
  const L = logoEn(N, color, izq, P - (logotipo(N, color).arriba));
  const anchoA1 = trazo(serifLigera(72), 'Tu área legal para', 1).ancho + trazo(serifLigera(72), 'tu empresa.', 1).ancho + 0.28;
  const T = Math.min(h * 0.19, disponible / anchoA1);
  const frase1 = textoEn(serifLigera(72), 'Tu área legal para', T, color, izq, h * 0.6);
  const frase2 = textoEn(serifLigera(72), 'tu empresa.', T, color, izq + frase1.ancho + T * 0.28, h * 0.6);
  const sub = T * 0.06;
  const linea = `<rect x="${(izq + frase1.ancho + T * 0.28).toFixed(1)}" y="${(h * 0.6 + sub * 2.2).toFixed(1)}" width="${frase2.ancho.toFixed(1)}" height="${sub.toFixed(1)}" fill="${C.acento}"/>`;
  const pie = textoEn(sans(500), `${WEB}   ·   WhatsApp ${site.whatsappVisible}`, Math.min(h * 0.055, disponible / 32), sec, izq, h - P * 0.9);
  return lienzo(w, h, fondo, L.g + frase1.g + frase2.g + linea + pie.g);
}
/** Imagen social 1200×630 del sitio. */
function og() {
  const w = 1200, h = 630, P = 72;
  const L = logoEn(96, C.blanco, P, P - logotipo(96, C.blanco).arriba);
  const f1 = textoEn(serifLigera(72), 'Tu área legal para', 92, C.blanco, P, 330);
  const f2 = textoEn(newsreader.getVariation({ wght: 400, opsz: 72 }), 'tu empresa.', 92, C.blanco, P, 440);
  const linea = `<rect x="${P}" y="458" width="${f2.ancho.toFixed(1)}" height="7" fill="${C.acento}"/>`;
  const sub = textoEn(sans(500), 'Área legal externa para micro y pequeñas empresas · Perú', 26, C.claro, P, 540);
  return lienzo(w, h, C.tinta, L.g + f1.g + f2.g + linea + sub.g);
}
/** Plantilla de publicación cuadrada (1080). */
function post() {
  const S = 1080, P = 88;
  const L = logoEn(64, C.tinta, P, P - logotipo(64, C.tinta).arriba);
  const lineas = ['No contratas', 'un abogado,', 'contratas un', 'área legal.'];
  const cuerpo = lineas.map((t, i) => textoEn(serifLigera(72), t, 118, C.tinta, P, 430 + i * 130).g).join('');
  const sub = `<rect x="${P}" y="${430 + 3 * 130 + 22}" width="${trazo(serifLigera(72), 'área legal.', 118).ancho.toFixed(1)}" height="9" fill="${C.acento}"/>`;
  const pie = textoEn(sans(500), `${WEB}`, 30, C.gris, P, S - P);
  const tag = textoEn(sans(600), 'DERECHO PARA EMPRESAS', 22, C.gris, S - P, P, 0.14, 'end');
  return lienzo(S, S, C.niebla, L.g + cuerpo + sub + pie.g + tag.g);
}
/** Plantilla de historia (1080×1920). */
function historia() {
  const w = 1080, h = 1920, P = 96;
  const L = logoEn(72, C.blanco, P, 260 - logotipo(72, C.blanco).arriba);
  const lineas = ['Tu área legal', 'para tu', 'empresa.'];
  const cuerpo = lineas.map((t, i) => textoEn(serifLigera(72), t, 150, C.blanco, P, 820 + i * 165).g).join('');
  const sub = `<rect x="${P}" y="${820 + 2 * 165 + 28}" width="${trazo(serifLigera(72), 'empresa.', 150).ancho.toFixed(1)}" height="11" fill="${C.acento}"/>`;
  const pie1 = textoEn(sans(500), 'Planes mensuales sin permanencia', 36, C.claro, P, 1500);
  const pie2 = textoEn(sans(500), `${WEB}`, 36, C.claro, P, h - 260);
  return lienzo(w, h, C.tinta, L.g + cuerpo + sub + pie1.g + pie2.g);
}

// ---------- Rasterizado ----------
async function abrirChromium() {
  let pw;
  try { pw = await import('playwright-core'); } catch { return null; }
  const candidatos = [process.env.CHROME_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
  const exe = candidatos.find((c) => fs.existsSync(c));
  if (!exe) return null;
  return pw.chromium.launch({ executablePath: exe });
}
const escribir = (destino, contenido) => { fs.mkdirSync(path.dirname(destino), { recursive: true }); fs.writeFileSync(destino, contenido); };

const navegador = await abrirChromium();
if (!navegador) console.warn('Sin Chromium: se generan solo los SVG. Instala playwright-core y define CHROME_PATH para PNG y PDF.');
const pagina = navegador ? await navegador.newPage() : null;

/** Guarda un SVG y, si hay Chromium, su PNG (a `anchos` px) y opcionalmente PDF. */
async function guardar(base, svg, { anchos = [], pdf = false, transparente = false } = {}) {
  escribir(base + '.svg', svg);
  if (!pagina) return;
  const [vw, vh] = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number).slice(2);
  for (const ancho of anchos) {
    const alto = Math.round((ancho * vh) / vw);
    await pagina.setViewportSize({ width: ancho, height: alto });
    await pagina.setContent(`<!doctype html><html><body style="margin:0;background:${transparente ? 'transparent' : '#fff'}">${svg.replace(/width="[^"]+" height="[^"]+"/, `width="${ancho}" height="${alto}"`)}</body></html>`);
    const sufijo = anchos.length > 1 ? `-${ancho}` : '';
    await pagina.screenshot({ path: `${base}${sufijo}.png`, omitBackground: transparente, clip: { x: 0, y: 0, width: ancho, height: alto } });
  }
  if (pdf) {
    await pagina.setContent(`<!doctype html><html><head><style>@page{size:${vw}px ${vh}px;margin:0}body{margin:0}</style></head><body>${svg}</body></html>`);
    await pagina.pdf({ path: base + '.pdf', width: `${vw}px`, height: `${vh}px`, printBackground: true, pageRanges: '1' });
  }
}

// ---------- 1. Archivos de marca del repositorio ----------
const marca = path.join(raiz, 'marca');
for (const f of fs.readdirSync(marca)) if (/\.(png|pdf|svg)$/.test(f)) fs.rmSync(path.join(marca, f));
await guardar(path.join(marca, 'logotipo-tinta'), svgLogotipo(C.tinta), { anchos: [2400], pdf: true, transparente: true });
await guardar(path.join(marca, 'logotipo-blanco'), svgLogotipo(C.blanco), { anchos: [2400], pdf: true, transparente: true });
await guardar(path.join(marca, 'logotipo-negro'), svgLogotipo(C.negro), { anchos: [2400], pdf: true, transparente: true });
await guardar(path.join(marca, 'monograma-tinta'), monograma(512, C.tinta, C.blanco), { anchos: [1024], pdf: true, transparente: true });
await guardar(path.join(marca, 'monograma-claro'), monograma(512, C.niebla, C.tinta), { anchos: [1024], transparente: true });
await guardar(path.join(marca, 'monograma-sin-fondo'), monograma(512, null, C.tinta), { anchos: [1024], transparente: true });

// Favicons y social del sitio: el monograma sin esquinas (el navegador las pone).
const pub = path.join(raiz, 'public');
for (const t of [32, 180, 512]) {
  await guardar(path.join(pub, `favicon-${t}`), monograma(512, C.tinta, C.blanco, t === 32 ? 0.18 : 0.2), { anchos: [t] });
  fs.rmSync(path.join(pub, `favicon-${t}.svg`));
}
await guardar(path.join(pub, 'og-image'), og(), { anchos: [1200] });
fs.rmSync(path.join(pub, 'og-image.svg'));
// Copia pública de los archivos de marca (los usa la firma de correo).
const pubMarca = path.join(pub, 'marca');
fs.rmSync(pubMarca, { recursive: true, force: true });
fs.mkdirSync(pubMarca);
for (const f of fs.readdirSync(marca)) if (/\.(png|pdf|svg)$/.test(f)) fs.copyFileSync(path.join(marca, f), path.join(pubMarca, f));

// ---------- 2. Kit completo ----------
if (KIT) {
  fs.rmSync(KIT, { recursive: true, force: true });
  const k = (...p) => { const d = path.join(KIT, ...p); fs.mkdirSync(path.dirname(d), { recursive: true }); return d; };
  // 01 Logotipos
  for (const f of fs.readdirSync(marca)) if (/^(logotipo|monograma)/.test(f)) fs.copyFileSync(path.join(marca, f), k('01-logotipo', f));
  await guardar(k('01-logotipo', 'logotipo-tinta-sobre-blanco'), svgLogotipo(C.tinta, C.blanco), { anchos: [2400] });
  await guardar(k('01-logotipo', 'logotipo-blanco-sobre-tinta'), svgLogotipo(C.blanco, C.tinta), { anchos: [2400] });
  // 02 Fotos de perfil
  const perfiles = [['whatsapp-business', 640], ['linkedin-empresa', 400], ['facebook-instagram', 1080], ['gmail-google', 500], ['linkedin-personal-o-x', 400]];
  for (const [n, S] of perfiles) {
    await guardar(k('02-perfil', `${n}-${S}-monograma`), perfil(S, true), { anchos: [S] });
    await guardar(k('02-perfil', `${n}-${S}-logotipo`), perfilLogotipo(S), { anchos: [S] });
    fs.rmSync(k('02-perfil', `${n}-${S}-monograma.svg`)); fs.rmSync(k('02-perfil', `${n}-${S}-logotipo.svg`));
  }
  // 03 Portadas
  const portadas = [
    ['linkedin-empresa-1128x191', 1128, 191, { seguro: 1128, pad: 28 }],
    ['linkedin-personal-1584x396', 1584, 396, { seguro: 1584, pad: 56 }],
    ['facebook-1640x624', 1640, 624, { seguro: 1250, pad: 80 }],
    ['x-twitter-1500x500', 1500, 500, { seguro: 1500, pad: 72 }],
    ['youtube-2560x1440', 2560, 1440, { seguro: 1546, pad: 420 }],
  ];
  for (const [n, w, h, o] of portadas) {
    await guardar(k('03-portadas', n + '-oscura'), portada(w, h, { ...o, oscuro: true }), { anchos: [w] });
    await guardar(k('03-portadas', n + '-clara'), portada(w, h, { ...o, oscuro: false }), { anchos: [w] });
  }
  // 04 Publicaciones
  await guardar(k('04-publicaciones', 'post-1080x1080'), post(), { anchos: [1080] });
  await guardar(k('04-publicaciones', 'historia-1080x1920'), historia(), { anchos: [1080] });
  await guardar(k('04-publicaciones', 'imagen-para-compartir-enlaces-1200x630'), og(), { anchos: [1200] });
  // 05 Fuentes
  for (const f of fs.readdirSync(fuentesDir)) if (f.endsWith('.ttf')) fs.copyFileSync(path.join(fuentesDir, f), k('05-fuentes', f));
  console.log('Kit en', KIT);
}

if (navegador) await navegador.close();
console.log('Marca generada en marca/ y public/.');
