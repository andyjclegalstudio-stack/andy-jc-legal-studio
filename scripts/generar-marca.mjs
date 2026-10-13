/**
 * Genera los archivos de marca a partir de la misma geometría que usa el sitio.
 * Importa src/lib/monograma.ts directamente, así que no hay ningún dibujo duplicado:
 * si cambias el monograma y vuelves a correr esto, /marca se regenera igual al sitio.
 *
 *   node scripts/generar-marca.mjs
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
fs.mkdirSync(tmp, { recursive: true });

const CHROME =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const TINTA = '#16283A';
const JADE = '#146B54';
const TENUE = '#4C5F70';

// --- 1. Monograma suelto, vector puro sin dependencia de tipografía --------
const monograma = (colorAsta, colorCurva) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX_LOGO}" role="img" aria-label="DIADA Legal Studio">` +
  `<path d="${D_CURVA}" fill="${colorCurva}"/>` +
  `<g fill="${colorAsta}">${D_PARTES.map((d) => `<path d="${d}"/>`).join('')}</g></svg>`;

fs.writeFileSync(path.join(salida, 'monograma-color.svg'), monograma(TINTA, JADE));
fs.writeFileSync(path.join(salida, 'monograma-blanco.svg'), monograma('#FFFFFF', '#FFFFFF'));
fs.writeFileSync(path.join(salida, 'monograma-negro.svg'), monograma(TINTA, TINTA));

// --- 2. Marca horizontal: monograma + nombre ------------------------------
const woff2 = fs
  .readFileSync(
    path.join(raiz, 'node_modules/@fontsource/newsreader/files/newsreader-latin-400-normal.woff2')
  )
  .toString('base64');

const paginaHTML = (cAsta, cCurva, cTexto1, cTexto2, fondo) => `<!doctype html>
<meta charset="utf-8">
<style>
  @font-face{font-family:Newsreader;src:url(data:font/woff2;base64,${woff2}) format('woff2');font-weight:400;font-display:block}
  html,body{margin:0;padding:0;background:${fondo}}
  .marca{display:inline-flex;align-items:center;gap:60px;padding:48px}
  .marca svg{height:240px;width:auto;display:block}
  .texto{font-family:Newsreader,serif;font-size:90px;line-height:1.25;color:${cTexto1};white-space:nowrap}
  .texto .segunda{color:${cTexto2}}
</style>
<div class="marca">
  ${monograma(cAsta, cCurva)}
  <div class="texto">DIADA<br><span class="segunda">Legal Studio</span></div>
</div>`;

const variantes = [
  { id: 'marca-horizontal-color',  a: TINTA,   c: JADE,    t1: TINTA, t2: TENUE },
  { id: 'marca-horizontal-blanco', a: '#fff',  c: '#fff',  t1: '#fff', t2: 'rgba(255,255,255,.72)' },
  { id: 'marca-horizontal-negro',  a: TINTA,   c: TINTA,   t1: TINTA, t2: TINTA },
];

for (const v of variantes) {
  const html = path.join(tmp, v.id + '.html');
  fs.writeFileSync(html, paginaHTML(v.a, v.c, v.t1, v.t2, 'transparent'));
  const url = 'file:///' + html.replace(/\\/g, '/');

  // PNG a alta resolución, fondo transparente
  const png = path.join(tmp, v.id + '.png');
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--default-background-color=00000000',
    '--window-size=1400,400', '--force-device-scale-factor=3',
    '--screenshot=' + png, url,
  ], { stdio: 'ignore' });

  await sharp(png)
    .trim({ threshold: 1 })
    .extend({ top: 40, bottom: 40, left: 40, right: 40, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(salida, v.id + '.png'));

  // PDF vectorial, para imprenta
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer',
    '--print-to-pdf=' + path.join(salida, v.id + '.pdf'), url,
  ], { stdio: 'ignore' });
}

// Monograma en PNG, transparente
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
  const st = fs.statSync(path.join(salida, f));
  if (st.isFile()) console.log('  ' + f.padEnd(32) + (st.size / 1024).toFixed(1) + ' KB');
}
