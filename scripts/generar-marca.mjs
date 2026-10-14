/**
 * Genera los archivos de marca con la misma tipografía y la misma geometría que
 * usa el sitio, así que no hay ningún dibujo duplicado que pueda desincronizarse.
 *
 *   node scripts/generar-marca.mjs
 *
 * Produce:
 *   logotipo-*          «Díada Legal Studio» con el acento en jade (PNG + PDF)
 *   isotipo-*           la «Dí» en cuadro, para avatares y favicon (PNG)
 *   favicon-*.png       32 y 180 px, rasterizados con la tipografía real
 *   diagrama-areas.svg  la D abierta en asta y curva — ilustración, no logotipo
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { D_PARTES, D_CURVA, VIEWBOX_LOGO } from '../src/lib/monograma.ts';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const salida = path.join(raiz, 'marca');
const tmp = path.join(salida, '.tmp');
fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp, { recursive: true });

const CHROME =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const TINTA = '#16283A';
const JADE = '#146B54';
const TENUE = '#4C5F70';

const woff2 = fs
  .readFileSync(
    path.join(raiz, 'node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2')
  )
  .toString('base64');
const woff2Sans = fs
  .readFileSync(
    path.join(raiz, 'node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2')
  )
  .toString('base64');

const tipografias = `
@font-face{font-family:Newsreader;src:url(data:font/woff2;base64,${woff2}) format('woff2');font-weight:200 800;font-display:block}
@font-face{font-family:'Public Sans';src:url(data:font/woff2;base64,${woff2Sans}) format('woff2');font-weight:100 1000;font-display:block}`;

/** La «í» se compone a mano: ı sin punto más el acento en jade. */
const palabra = (acento) =>
  `D<span class="i">ı<i style="background:${acento}"></i></span>ada`;

const captura = (html, archivo, w, h, escala = 3) => {
  const f = path.join(tmp, archivo + '.html');
  fs.writeFileSync(f, html);
  const url = 'file:///' + f.replace(/\\/g, '/');
  const png = path.join(tmp, archivo + '.png');
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--default-background-color=00000000',
    `--window-size=${w},${h}`, `--force-device-scale-factor=${escala}`,
    '--screenshot=' + png, url,
  ], { stdio: 'ignore' });
  return { png, url };
};

// --- 1. Logotipo horizontal -----------------------------------------------
const paginaLogo = (cTexto, cBajada, cAcento) => `<!doctype html><meta charset="utf-8"><style>
${tipografias}
html,body{margin:0;padding:0;background:transparent}
.marca{display:inline-flex;align-items:baseline;gap:26px;padding:48px}
.nombre{font-family:Newsreader,serif;font-weight:500;font-size:150px;line-height:1;letter-spacing:-0.02em;color:${cTexto}}
.i{position:relative}
.i i{position:absolute;left:50%;top:0.07em;width:0.07em;height:0.22em;transform:translateX(-50%) rotate(36deg);border-radius:1px}
.bajada{font-family:'Public Sans',sans-serif;font-weight:600;font-size:26px;letter-spacing:0.26em;text-transform:uppercase;color:${cBajada}}
</style><div class="marca"><span class="nombre">${palabra(cAcento)}</span><span class="bajada">Legal Studio</span></div>`;

const variantes = [
  { id: 'logotipo-color',  texto: TINTA,     bajada: TENUE,                 acento: JADE },
  { id: 'logotipo-blanco', texto: '#FFFFFF', bajada: 'rgba(255,255,255,.72)', acento: '#FFFFFF' },
  { id: 'logotipo-negro',  texto: TINTA,     bajada: TINTA,                 acento: TINTA },
];

for (const v of variantes) {
  const html = paginaLogo(v.texto, v.bajada, v.acento);
  const { png, url } = captura(html, v.id, 1400, 400);
  await sharp(png)
    .trim({ threshold: 1 })
    .extend({ top: 40, bottom: 40, left: 40, right: 40, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(salida, v.id + '.png'));
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer',
    '--print-to-pdf=' + path.join(salida, v.id + '.pdf'), url,
  ], { stdio: 'ignore' });
}

// --- 2. Isotipo «Dí»: avatares, favicon, foto de perfil --------------------
const paginaIsotipo = (fondo, cTexto, cAcento) => `<!doctype html><meta charset="utf-8"><style>
${tipografias}
html,body{margin:0;padding:0;background:transparent}
.tile{width:512px;height:512px;background:${fondo};display:flex;align-items:center;justify-content:center}
.n{font-family:Newsreader,serif;font-weight:500;font-size:300px;line-height:1;letter-spacing:-0.02em;color:${cTexto};transform:translateY(-0.04em)}
.i{position:relative}
.i i{position:absolute;left:50%;top:0.07em;width:0.07em;height:0.22em;transform:translateX(-50%) rotate(36deg);border-radius:1px;background:${cAcento}}
</style><div class="tile"><span class="n">D<span class="i">ı<i></i></span></span></div>`;

const isotipos = [
  { id: 'isotipo-tinta',  fondo: TINTA,     texto: '#FFFFFF', acento: '#E0A32E' },
  { id: 'isotipo-claro',  fondo: '#FFFFFF', texto: TINTA,     acento: JADE },
];
for (const i of isotipos) {
  const { png } = captura(paginaIsotipo(i.fondo, i.texto, i.acento), i.id, 512, 512, 2);
  await sharp(png).resize(1024, 1024, { fit: 'cover' }).png({ compressionLevel: 9 })
    .toFile(path.join(salida, i.id + '.png'));
}

// --- 3. Favicon: el isotipo claro, rasterizado a los tamaños que usa el navegador
const faviconFuente = path.join(salida, 'isotipo-claro.png');
for (const tam of [32, 180, 512]) {
  await sharp(faviconFuente).resize(tam, tam).png({ compressionLevel: 9 })
    .toFile(path.join(raiz, 'public', `favicon-${tam}.png`));
}

// --- 4. Imagen social 1200x630 -------------------------------------------
const og = `<!doctype html><meta charset="utf-8"><style>
${tipografias}
html,body{margin:0;padding:0}
.lienzo{width:1200px;height:630px;background:#fff;position:relative;box-sizing:border-box;padding:72px}
.filete{position:absolute;inset:0 0 auto 0;height:8px;background:${JADE}}
.marca{display:flex;align-items:baseline;gap:18px}
.nombre{font-family:Newsreader,serif;font-weight:500;font-size:86px;line-height:1;letter-spacing:-0.02em;color:${TINTA}}
.i{position:relative}
.i i{position:absolute;left:50%;top:0.07em;width:0.07em;height:0.22em;transform:translateX(-50%) rotate(36deg);border-radius:1px;background:${JADE}}
.bajada{font-family:'Public Sans',sans-serif;font-weight:600;font-size:17px;letter-spacing:0.26em;text-transform:uppercase;color:${TENUE}}
h1{font-family:Newsreader,serif;font-weight:500;font-size:52px;line-height:1.12;letter-spacing:-0.015em;color:${TINTA};margin:54px 0 0;max-width:22ch}
.pie{position:absolute;left:72px;right:72px;bottom:64px;border-top:2px solid #D7DCD9;padding-top:26px;
     font-family:'Public Sans',sans-serif;font-size:23px;color:${TENUE}}
.pie b{color:${JADE};font-weight:600}
</style><div class="lienzo"><div class="filete"></div>
<div class="marca"><span class="nombre">${palabra(JADE)}</span><span class="bajada">Legal Studio</span></div>
<h1>Contratos, datos personales y cumplimiento para empresas que operan en digital.</h1>
<div class="pie">Planes mensuales desde S/ 790 · Huánuco, Perú &nbsp;·&nbsp; <b>WhatsApp +51 922 163 731</b></div>
</div>`;
{
  const { png } = captura(og, 'og', 1200, 630, 2);
  await sharp(png).resize(1200, 630).png({ compressionLevel: 9, palette: true })
    .toFile(path.join(raiz, 'public', 'og-image.png'));
}

// --- 5. El diagrama de áreas: ilustración, ya no logotipo ------------------
const diagrama =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX_LOGO}" role="img" ` +
  `aria-label="Diagrama de las dos áreas de práctica">` +
  `<defs><clipPath id="c">${D_PARTES.map((d) => `<path d="${d}"/>`).join('')}</clipPath></defs>` +
  `<g fill="none" stroke="${TINTA}" stroke-width="3" opacity="0.38">` +
  `${D_PARTES.map((d) => `<path d="${d}"/>`).join('')}<path d="${D_CURVA}"/></g>` +
  `<g clip-path="url(#c)"><path d="${D_CURVA}" fill="${JADE}"/></g></svg>`;
fs.writeFileSync(path.join(salida, 'diagrama-areas.svg'), diagrama);

fs.rmSync(tmp, { recursive: true, force: true });

console.log('Archivos en /marca:');
for (const f of fs.readdirSync(salida).sort()) {
  const st = fs.statSync(path.join(salida, f));
  if (st.isFile()) console.log('  ' + f.padEnd(30) + (st.size / 1024).toFixed(1) + ' KB');
}
console.log('Favicons en /public: favicon-32.png, favicon-180.png, favicon-512.png');
