/**
 * Genera los archivos de marca a partir de la misma geometría que usa el sitio.
 * No hay ningún dibujo duplicado: si cambias src/lib/monograma.ts y vuelves a
 * correr esto, los archivos de /marca se regeneran iguales al sitio.
 *
 *   node scripts/generar-marca.mjs
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const salida = path.join(raiz, 'marca');
const tmp = path.join(salida, '.tmp');
fs.mkdirSync(tmp, { recursive: true });

const CHROME =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// --- Geometría, leída del mismo archivo que usa el sitio -------------------
const geo = fs.readFileSync(path.join(raiz, 'src/lib/monograma.ts'), 'utf8');
const captura = (nombre) => geo.match(new RegExp(nombre + " = '([^']+)'"))[1];
const A = [captura('A_IZQ'), captura('A_DER'), captura('A_BARRA')];
const num = (n) => Number(geo.match(new RegExp('const ' + n + ' = (\\d+)'))[1]);
const [CX, CY, RE, RI, AP] = ['CX', 'CY', 'R_EXT', 'R_INT', 'APERTURA'].map(num);
const rad = (g) => (g * Math.PI) / 180;
const pt = (r, g) =>
  `${(CX + r * Math.cos(rad(g))).toFixed(2)} ${(CY + r * Math.sin(rad(g))).toFixed(2)}`;
const C = `M${pt(RE, AP)} A${RE} ${RE} 0 1 1 ${pt(RE, 360 - AP)} L${pt(RI, 360 - AP)} A${RI} ${RI} 0 1 0 ${pt(RI, AP)} Z`;
const VB = geo.match(/VIEWBOX_LOGO = '([^']+)'/)[1];

const TINTA = '#16283A';
const JADE = '#146B54';
const TENUE = '#4C5F70';

// --- 1. Monograma suelto, vector puro sin dependencia de tipografía --------
const monograma = (colorA, colorC) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" role="img" aria-label="Andy J.C. Legal Studio">` +
  `<path d="${C}" fill="${colorC}"/>` +
  `<g fill="${colorA}">${A.map((d) => `<path d="${d}"/>`).join('')}</g></svg>`;

fs.writeFileSync(path.join(salida, 'monograma-color.svg'), monograma(TINTA, JADE));
fs.writeFileSync(path.join(salida, 'monograma-blanco.svg'), monograma('#FFFFFF', '#FFFFFF'));
fs.writeFileSync(path.join(salida, 'monograma-negro.svg'), monograma(TINTA, TINTA));

// --- 2. Marca horizontal: monograma + texto -------------------------------
const woff2 = fs.readFileSync(
  path.join(raiz, 'node_modules/@fontsource/newsreader/files/newsreader-latin-400-normal.woff2')
).toString('base64');

const paginaHTML = (colorA, colorC, colorTexto1, colorTexto2, fondo) => `<!doctype html>
<meta charset="utf-8">
<style>
  @font-face{font-family:Newsreader;src:url(data:font/woff2;base64,${woff2}) format('woff2');font-weight:400;font-display:block}
  html,body{margin:0;padding:0;background:${fondo}}
  .marca{display:inline-flex;align-items:center;gap:72px;padding:48px}
  .marca svg{height:240px;width:auto;display:block}
  .texto{font-family:Newsreader,serif;font-size:90px;line-height:1.25;color:${colorTexto1};white-space:nowrap}
  .texto .segunda{color:${colorTexto2}}
</style>
<div class="marca">
  ${monograma(colorA, colorC)}
  <div class="texto">Andy J.C.<br><span class="segunda">Legal Studio</span></div>
</div>`;

const variantes = [
  { id: 'marca-horizontal-color',  a: TINTA, c: JADE, t1: TINTA, t2: TENUE, fondo: 'transparent' },
  { id: 'marca-horizontal-blanco', a: '#fff', c: '#fff', t1: '#fff', t2: 'rgba(255,255,255,.72)', fondo: 'transparent' },
  { id: 'marca-horizontal-negro',  a: TINTA, c: TINTA, t1: TINTA, t2: TINTA, fondo: 'transparent' },
];

for (const v of variantes) {
  const html = path.join(tmp, v.id + '.html');
  fs.writeFileSync(html, paginaHTML(v.a, v.c, v.t1, v.t2, v.fondo));

  // PNG a alta resolución, fondo transparente
  const png = path.join(tmp, v.id + '.png');
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--default-background-color=00000000',
    '--window-size=1400,400', '--force-device-scale-factor=3',
    '--screenshot=' + png,
    'file:///' + html.replace(/\\/g, '/'),
  ], { stdio: 'ignore' });

  // Recorta el aire sobrante y deja un margen parejo
  await sharp(png).trim({ threshold: 1 })
    .extend({ top: 40, bottom: 40, left: 40, right: 40, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(salida, v.id + '.png'));

  // PDF vectorial: el texto va como curvas reales, sirve para imprenta
  const pdf = path.join(salida, v.id + '.pdf');
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--no-pdf-header-footer',
    '--print-to-pdf=' + pdf,
    'file:///' + html.replace(/\\/g, '/'),
  ], { stdio: 'ignore' });
}

// Monograma en PNG, cuadrado y transparente
for (const [id, svg] of [
  ['monograma-color', monograma(TINTA, JADE)],
  ['monograma-blanco', monograma('#FFFFFF', '#FFFFFF')],
]) {
  await sharp(Buffer.from(svg), { density: 600 })
    .resize({ height: 1024 })
    .png({ compressionLevel: 9 })
    .toFile(path.join(salida, id + '.png'));
}

fs.rmSync(tmp, { recursive: true, force: true });

console.log('Archivos generados en /marca:');
for (const f of fs.readdirSync(salida).sort()) {
  console.log('  ' + f.padEnd(32) + (fs.statSync(path.join(salida, f)).size / 1024).toFixed(1) + ' KB');
}
