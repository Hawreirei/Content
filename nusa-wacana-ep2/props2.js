// props2.js — properti baru EP 2: kartu suara hasil voting, drone teleprompter, panel hologram
import { clamp, lerp, hash, back, seg, TAU } from './lib.js';
import { INK, g, push, pop, translate, rotate, scale, shape, fillOnly, stroke, ell, arc, spline, rr, rect, dot, text } from './toon.js';
import { PAL, eye } from './chars.js';

// kartu suara raksasa dengan cap "B" (sudah terlihat di frame 1)
export function ballot(t, { wob = 0 } = {}) {
  push(); rotate(-.05 + wob);
  shape(rect(-440, -560, 880, 1120), { fill: '#f2ead0', lw: 9, shade: () => { for (let k = 0; k < 9; k++) stroke([[-440 + k * 110, -560], [-440 + k * 110, 560]], 3, { line: '#d6c9a6' }); for (let k = 0; k < 11; k++) stroke([[-440, -560 + k * 110], [440, -560 + k * 110]], 3, { line: '#d6c9a6' }); } });
  text('HASIL VOTING EP 1', 0, -470, { font: '400 64px VT323', fill: '#c0213a' });
  const rows = [['A', 'Terima Pak Bambang', '#5b2a86'], ['B', 'Dengar Bu Sekar', '#7d8792'], ['C', 'Tanya Ibu dulu', '#d9a227']];
  rows.forEach(([k, txt, col], i) => {
    const y = -300 + i * 200;
    shape(ell(-320, y, 62, 62, 28), { fill: col, lw: 7 });
    text(k, -320, y + 6, { font: '400 84px "Titan One"', fill: '#fff', outlineW: 11, outlineCol: INK });
    text(txt, -230, y + 4, { font: '800 52px "Baloo 2"', fill: INK, align: 'left' });
  });
  pop();
}
// cap merah "B" yang menghantam kartu
export function stampB(s) {
  if (s <= 0) return;
  push(); rotate(-.18); scale(s);
  shape(rr(-170, -150, 340, 300, 40), { lw: 14, line: '#c0213a' });
  text('B', 0, 14, { font: '400 230px "Titan One"', fill: '#c0213a' });
  text('PILIHAN KALIAN', 0, 118, { font: '400 40px VT323', fill: '#c0213a' });
  pop();
}

// drone teleprompter: badan bulat, dua baling-baling, layar teks
export function drone(x, y, s, t, { flash = 0, lines = [], tilt = 0, dead = 0 } = {}) {
  push(); translate(x, y); rotate(tilt); scale(s);
  for (const sx of [-1, 1]) {
    stroke([[sx * 70, -60], [sx * 130, -90]], 7);
    const sp = dead ? .2 : 1, a = t * 40 * sp * sx;
    push(); translate(sx * 140, -96); scale(1, .25);
    for (let k = 0; k < 2; k++) shape(spline([[0, 0], [Math.cos(a + k * Math.PI) * 70, Math.sin(a + k * Math.PI) * 70 - 10], [Math.cos(a + k * Math.PI) * 80, Math.sin(a + k * Math.PI) * 80 + 10]]), { fill: '#c8ccd2', lw: 5 });
    pop();
  }
  shape(ell(0, 0, 120, 100, 36), { fill: '#5f6672', lw: 8, shade: () => fillOnly(ell(40, 20, 90, 90, 30), '#4a4f5a', { boil: .3 }) });
  const red = flash > 0 && Math.floor(t * 8) % 2 === 0;
  shape(rr(-86, -56, 172, 100, 16), { fill: red ? '#c0213a' : (dead ? '#2b2e37' : '#0f2a2a'), lw: 6 });
  if (!dead) {
    if (flash > 0) text('!!!', 0, -4, { font: '400 72px VT323', fill: '#fff' });
    else lines.forEach((l, i) => text(l, -72, -28 + i * 28, { font: '400 26px VT323', fill: '#7ff0e6', align: 'left' }));
  } else { stroke([[-40, -30], [-10, 0]], 6, { line: '#7f8794' }); stroke([[-10, -30], [-40, 0]], 6, { line: '#7f8794' }); stroke([[10, -30], [40, 0]], 6, { line: '#7f8794' }); stroke([[40, -30], [10, 0]], 6, { line: '#7f8794' }); }
  // antena
  stroke([[0, -100], [0, -140]], 6); dot(0, -146, 9, red ? '#c0213a' : PAL.glow);
  pop();
}

// panel hologram (proyeksi dari portal → warna perangkat, magenta transparan)
export function holo(x, y, w, h, title, sub, a, t, kind = 0) {
  if (a <= 0) return;
  const s = back(clamp(a), 2.2);
  push(); translate(x, y); scale(s);
  shape(rr(-w / 2, -h / 2, w, h, 18), { fill: 'rgba(255,63,164,.22)', lw: 6, line: PAL.glow });
  for (let k = 0; k < 4; k++) stroke([[-w / 2 + 10, -h / 2 + 30 + k * (h - 40) / 4 + ((t * 40) % ((h - 40) / 4))], [w / 2 - 10, -h / 2 + 30 + k * (h - 40) / 4 + ((t * 40) % ((h - 40) / 4))]], 2, { line: 'rgba(255,154,210,.35)', boil: 0 });
  // ikon sederhana
  if (kind === 0) { for (let i = 0; i < 4; i++) shape(rect(-w / 2 + 40 + i * 50, h / 2 - 40 - (i + 1) * 26, 36, (i + 1) * 26), { fill: PAL.glowL, lw: 4 }); }
  else if (kind === 1) { stroke([[-w / 2 + 30, -10], [w / 2 - 30, -40]], 5, { line: PAL.glowL }); shape(rr(-30, -20, 60, 44, 8), { fill: PAL.glowL, lw: 4 }); stroke([[0, -20], [0, -32]], 4); }
  else { for (let i = 0; i < 3; i++) { shape(ell(-w / 2 + 60 + i * 70, 10, 26, 30, 14), { fill: PAL.glowL, lw: 4 }); stroke([[-w / 2 + 60 + i * 70, 40], [-w / 2 + 60 + i * 70, 64]], 4); } }
  text(title, kind === 0 ? 60 : 0, -h / 2 + 44, { font: '400 50px VT323', fill: '#ffe3f2', outlineW: 6, outlineCol: '#5a0a32' });
  if (sub) text(sub, kind === 0 ? 60 : 0, -h / 2 + 88, { font: '400 36px VT323', fill: '#ffe3f2', outlineW: 5, outlineCol: '#5a0a32' });
  pop();
}
