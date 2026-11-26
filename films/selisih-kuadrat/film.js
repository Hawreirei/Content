// HAWREIREI — Trik 2 Detik #3: selisih kuadrat. 9:16, one continuous paper world (see hawreirei-style/STYLE.md).
// Story: 67² − 33². Budi squares both the long way (too slow); the SMP rule a² − b² = (a + b)(a − b): sum 100, difference 34 → 3400.
// Second try 75² − 25² = 100 × 50 = 5000. Trap: (67 − 33)² = 34² = 1156 ✗. Challenge 58² − 42² (= 1600, pinned later).
// Safe space for Instagram Reels: all text inside x 60–1020, y 220–1560, and x ≤ 940 below y 1000 (the like/comment column).
const DUR = 84.5;
window.DUR = DUR;
const T = {   // film seconds, set from vo/el/align.json (voice segment + VO_OFF 0.3)
  pull0: 5.75, toBudi: 5.85, sq1: 7.7, sq2: 8.5, sub: 9.4, slow: 10.9,
  toR1: 14.0, formula: 15.2, js: 25.4, r1Head: 27.0, sumOp: 27.4, sum: 29.6, difOp: 30.55, dif: 32.75, mul: 33.9, res: 36.35, save: 37.9,
  toR2: 39.45, r2Head: 40.6, r2Sum: 44.7, r2Dif: 45.9, r2Mul: 46.76, r2Res: 48.39,
  toTrap: 49.2, tpHead: 50.7, tpSq: 53.53, tpVal: 54.79, wrong: 56.55, right: 57.5,
  toWhy: 59.75, wsq: 60.95, cut: 63.1, split: 65.4, move: 66.0, join: 67.3, wres: 68.0,
  toBack: 69.7, win: 70.8,
  toBonus: 72.6, bonus: 73.1, comment: 77.6, cta: 79.3, out: 81.6, end: 83.2,
};
let VO_OFF = 0.3;
const SAY = {
  v01: { s: [2], p: ['67^{2} dikurangi 33^{2}.', 'Bisa jawab dalam 2 detik?'] },
  v02: { s: [1, 3], p: ['Budi pakai cara biasa:', 'kuadratkan satu per satu, lalu dikurangkan.', '30 detik, belum selesai juga!'] },
  v03: { s: [1], p: ['Padahal ada rumus SMP yang bisa jadi jalan pintas:', 'a^{2} − b^{2} = (a + b)(a − b).'] },
  v04: { s: [2, 3], p: ['Artinya, cukup jumlahkan dan kurangkan.', '67 + 33 = 100.', '67 − 33 = 34.'] },
  v05: { s: [2], p: ['100 × 34… 3400!', 'Simpan dulu, biar nggak lupa.'] },
  v06: { s: [3, 4], p: ['Coba lagi: 75^{2} − 25^{2}.', 'Jumlahnya 100, selisihnya 50.', '100 × 50 = 5000!'] },
  v07: { s: [1, 2, 4], p: ['Tapi hati-hati.', 'Jangan dikurangkan dulu, lalu dikuadratkan.', '34^{2} = 1156. Salah!', 'Yang benar tetap 3400.'] },
  v08: { s: [2, 3], p: ['Kenapa bisa? Dari persegi sisi 67,', 'potong persegi sisi 33.', 'Sisanya dipindah… jadi persegi panjang 100 × 34.'] },
  v09: { p: ['Dan kini, Budi juga bisa dalam 2 detik.'] },
  v10: { s: [3], p: ['Sekarang giliranmu: 58^{2} − 42^{2}.', 'Tulis angkanya saja di komentar!'] },
  v11: { p: ['Follow untuk trik hitung cepat lainnya!'] },
};
const DRAFT = {
  v01: [.3, 5.8, [2.9]], v02: [6.2, 12.7, [8.0, 11.0]], v03: [13.1, 20.9, [17.0]], v04: [21.3, 30.3, [23.0, 26.6]], v05: [30.7, 35.9, [34.2]],
  v06: [36.3, 45.3, [40.2, 43.0]], v07: [45.7, 55.7, [47.2, 49.7, 54.0]], v08: [56.1, 65.6, [58.8, 61.6]], v09: [66.0, 69.0, []],
  v10: [69.4, 76.7, [74.6]], v11: [77.1, 79.6, []],
};
let CAPS = [], ALIGN = null;
function buildCaps() {
  CAPS = [];
  const ids = Object.keys(SAY);
  ids.forEach((id, i) => {
    const P = SAY[id].p; let a, b, cuts;
    if (ALIGN) {   // voiced: part boundaries at the given segment indices
      const v = ALIGN.find(x => x.id === id); if (!v) return; const nx = ALIGN.find(x => x.id === ids[i + 1]);
      a = v.a + VO_OFF - .1; b = Math.min(nx ? nx.a + VO_OFF - .08 : DUR - .3, v.b + VO_OFF + 1.0); cuts = (SAY[id].s || []).map(k => v.segs[k][0] + VO_OFF - .05);
    } else { [a, b, cuts] = DRAFT[id]; }
    const edges = [a, ...cuts, b]; P.forEach((txt, k) => CAPS.push([edges[k], edges[k + 1], txt]));
  });
  window.SUBS = CAPS;
}


// ---------------------------------------------------------------- the world
const SHEET = { x0: -140, y0: -1000, x1: 2400, y1: 5600 };
const YEL = '#F2B632', COLA = '#E2A93B', COLB = '#4F86B5', COLC = '#5E9A5A', RED = '#C8463A', PEN = '#2D5F8A', GRN = '#2D7A3E';
const P = { hook: [540, 1600], budi: [1700, 1600], r1: [540, 3150], r2: [540, 4650], trap: [1700, 4650], why: [1700, 3150], bonus: [540, 150], cta: [1700, 150] };
const PAT = {};
const CAMP = { budi: [1700, 1640, .85], r1: [540, 3210, 1.2], r2: [540, 4710, 1.2], trap: [1700, 4710, 1.2], why: [1700, 3190, .85], bonus: [540, 190, .85], cta: [1700, 190, .85] };

// ---------------------------------------------------------------- camera
const CAM = [
  [0, 540, 2000, 1.0], [T.pull0, 540, 2000, 1.0], [T.toBudi + .9, ...CAMP.budi, 'io'], [T.toR1, ...CAMP.budi], [T.toR1 + .9, ...CAMP.r1, 'io'],
  [T.toR2, ...CAMP.r1], [T.toR2 + .8, ...CAMP.r2, 'io'], [T.toTrap, ...CAMP.r2], [T.toTrap + .8, ...CAMP.trap, 'io'],
  [T.toWhy, ...CAMP.trap], [T.toWhy + .9, ...CAMP.why, 'io'], [T.toBack, ...CAMP.why], [T.toBack + 1.0, ...CAMP.budi, 'io'],
  [T.toBonus, ...CAMP.budi], [T.toBonus + 1.0, ...CAMP.bonus, 'io'], [T.cta - .5, ...CAMP.bonus], [T.cta + .4, ...CAMP.cta, 'io'],
  [T.out, ...CAMP.cta], [T.end, 1130, 2300, .29, 'io'], [DUR, 1130, 2300, .285, 'lin'],
];
function camAt(t) {
  let i = 1; while (i < CAM.length - 1 && t > CAM[i][0]) i++;
  const a = CAM[i - 1], b = CAM[i], u = EASE[b[4] || 'io'](clamp((t - a[0]) / (b[0] - a[0]), 0, 1));
  const f = [lerp(a[1], b[1], u), lerp(a[2], b[2], u)], z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), u));
  let sx = 0, sy = 0, sr = 0;
  for (const [t0, am] of [[T.slow, 6], [T.res, 6], [T.r2Res, 4], [T.wrong, 7], [T.join, 4], [T.win, 5]]) { const s = shake(t, t0, am); sx += s[0]; sy += s[1]; sr += s[2]; }
  return { z, f, sx, sy, sr };
}
function viewOf(cam) { const hw = W / 2 / cam.z, hh = H / 2 / cam.z; return { x0: cam.f[0] - hw, x1: cam.f[0] + hw, y0: cam.f[1] - hh, y1: cam.f[1] + hh }; }
function near(v, k, r = 900) { const [x, y] = P[k]; return x + r > v.x0 && x - r < v.x1 && y + r > v.y0 && y - r < v.y1; }
// ---------------------------------------------------------------- the sheet
function drawSheet(g, v) {
  g.save(); g.shadowColor = 'rgba(20,12,4,.5)'; g.shadowBlur = 40; g.shadowOffsetX = 18; g.shadowOffsetY = 26;
  g.fillStyle = '#F1E9D6'; g.fillRect(SHEET.x0, SHEET.y0, SHEET.x1 - SHEET.x0, SHEET.y1 - SHEET.y0); g.restore();
  g.save(); g.beginPath(); g.rect(SHEET.x0, SHEET.y0, SHEET.x1 - SHEET.x0, SHEET.y1 - SHEET.y0); g.clip();
  g.globalCompositeOperation = 'overlay'; g.globalAlpha = .5; g.fillStyle = PAT.paper; g.fillRect(Math.max(SHEET.x0, v.x0), Math.max(SHEET.y0, v.y0), Math.min(SHEET.x1, v.x1) - Math.max(SHEET.x0, v.x0), Math.min(SHEET.y1, v.y1) - Math.max(SHEET.y0, v.y0));
  g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  const step = 60, gx0 = Math.floor(Math.max(SHEET.x0, v.x0) / step) * step, gy0 = Math.floor(Math.max(SHEET.y0, v.y0) / step) * step;
  for (let x = gx0; x < Math.min(SHEET.x1, v.x1); x += step) { g.strokeStyle = x % 300 === 0 ? 'rgba(95,147,166,.36)' : 'rgba(95,147,166,.18)'; g.lineWidth = x % 300 === 0 ? 2.4 : 1.4; g.beginPath(); g.moveTo(x, Math.max(SHEET.y0, v.y0)); g.lineTo(x, Math.min(SHEET.y1, v.y1)); g.stroke(); }
  for (let y = gy0; y < Math.min(SHEET.y1, v.y1); y += step) { g.strokeStyle = y % 300 === 0 ? 'rgba(95,147,166,.36)' : 'rgba(95,147,166,.18)'; g.lineWidth = y % 300 === 0 ? 2.4 : 1.4; g.beginPath(); g.moveTo(Math.max(SHEET.x0, v.x0), y); g.lineTo(Math.min(SHEET.x1, v.x1), y); g.stroke(); }
  g.restore();
}

// ---------------------------------------------------------------- printed type: Lilita, numbers yellow with an ink edge, F{a}{b} stacked
function fracL(g, s, x, y, size, col, draw) {   // a stacked fraction in Lilita; returns its width
  const [, n, d] = s.match(/F\{(.*?)\}\{(.*?)\}/), fs = size * .64;
  g.font = `${fs}px Lilita`; const wn = g.measureText(n).width, wd = g.measureText(d).width, fw = Math.max(wn, wd) + size * .16;
  if (draw) {
    const ax = y - size * .3, ink = (txt, tx, ty) => { if (col !== C.ink) { g.lineJoin = 'round'; g.lineWidth = fs * .16; g.strokeStyle = C.ink; g.strokeText(txt, tx, ty); } g.fillStyle = col; g.fillText(txt, tx, ty); };
    ink(n, x + (fw - wn) / 2, ax - size * .09); ink(d, x + (fw - wd) / 2, ax + size * .09 + fs * .74);
    g.lineCap = 'round'; g.strokeStyle = C.ink; g.lineWidth = size * .1; g.beginPath(); g.moveTo(x, ax); g.lineTo(x + fw, ax); g.stroke();
    if (col !== C.ink) { g.strokeStyle = col; g.lineWidth = size * .045; g.beginPath(); g.moveTo(x + size * .03, ax); g.lineTo(x + fw - size * .03, ax); g.stroke(); }
    g.font = `${size}px Lilita`;
  }
  g.font = `${size}px Lilita`; return fw;
}
function rich(g, id, parts, x, y, size, align = 'center') {
  g.save(); g.font = `${size}px Lilita`; g.textBaseline = 'alphabetic'; g.textAlign = 'left';
  const isF = s => s.startsWith('F{');
  const ws = parts.map(([s]) => isF(s) ? fracL(g, s, 0, 0, size, C.ink, false) : (g.font = `${size}px Lilita`, g.measureText(s).width)), tw = ws.reduce((a, b) => a + b, 0);
  const lx = align === 'center' ? x - tw / 2 : align === 'right' ? x - tw : x; let cx = lx;
  parts.forEach(([s, col], i) => {
    g.font = `${size}px Lilita`;
    if (isF(s)) fracL(g, s, cx, y, size, col || C.ink, true);
    else { if (col && col !== C.ink) { g.lineJoin = 'round'; g.lineWidth = size * .14; g.strokeStyle = C.ink; g.strokeText(s, cx, y); } g.fillStyle = col || C.ink; g.fillText(s, cx, y); }
    cx += ws[i];
  });
  const top = parts.some(([s]) => isF(s)) ? size * .95 : size * .8;
  noteText(g, id, parts.map(p => isF(p[0]) ? p[0].replace(/F\{(.*?)\}\{(.*?)\}/, '$1⁄$2') : p[0]).join(''), lx, y - top, lx + tw, y + size * .3);
  g.restore(); return tw;
}
function mathLine(g, id, expr, x, y, size, col = C.ink, t = 1, t0 = 0) {   // a printed formula (OldStd) that pops in at t0
  const k = popIn(t, t0, .22); if (k <= 0) return;
  g.save(); g.translate(x, y); g.scale(k, k); g.font = `${size}px OldStdB`; const nodes = mParse(expr), w = mWidth(g, nodes, size, 'OldStdB');
  g.fillStyle = col; g.textBaseline = 'alphabetic'; mDraw(g, nodes, -w / 2, 0, size, 'OldStdB');
  noteText(g, id, mPlain(expr), -w / 2, -size * .9, w / 2, size * .45); g.restore();
}
function pill(g, id, text, x, y, size = 44, col = C.ink) {
  g.save(); g.font = `${size}px Lilita`; g.letterSpacing = '4px'; const w = g.measureText(text).width + size * 1.4, h = size * 1.5;
  g.fillStyle = col; g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, h / 2); g.fill();
  g.fillStyle = '#FBF3DF'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, x + 2, y + size * .06); g.letterSpacing = '0px';
  noteText(g, id, text, x - w / 2 + 10, y - h / 2, x + w / 2 - 10, y + h / 2); g.restore();
}
function card(g, P, x, y, rot, t, t0, o = {}) {
  const u = t - t0; if (u < 0) return;
  const d = o.d || .22, a = clamp(u / d, 0, 1), h = 1 - EASE.i(a), k = (o.k || 1) * (1 + (a >= 1 ? wob(u, d, .05, 6, 10) : 0));
  drawCard(g, P, { c: [x, y - (o.dy ?? 200) * h], rot: rot + (o.rr ?? -10) * h, h, k });
}
function onCard(g, x, y, rot, t, t0, fn) {   // print on a card that was slapped down at t0 (follows its fall)
  if (t < t0) return; const a = clamp((t - t0) / .22, 0, 1), h = 1 - EASE.i(a);
  g.save(); g.translate(x, y - 200 * h); g.rotate((rot - 10 * h) * D2R); fn(); g.restore();
}
function stampFrame(g, x, y, rot, t, t0, size, col, label, drawIn) {   // a rubber stamp: falls, prints, stays
  const u = t - t0; if (u < -0.3) return;
  if (u < 0) { const k = 1 + (-u / .3) * .5; g.save(); g.translate(x, y - 300 * (-u / .3)); g.rotate(rot * D2R); g.scale(k * size / 90, k * size / 90);
    g.shadowColor = 'rgba(30,20,10,.4)'; g.shadowBlur = 30; g.shadowOffsetX = 30; g.shadowOffsetY = 40; g.fillStyle = '#7A4E2C'; g.fillRect(-60, -230, 120, 150);
    g.beginPath(); g.ellipse(0, -250, 90, 40, 0, 0, Math.PI * 2); g.fill(); g.shadowColor = 'transparent'; g.fillStyle = '#3A2A20'; g.fillRect(-260, -80, 520, 80); g.restore(); return; }
  const a = clamp(u / .08, 0, 1);
  g.save(); g.translate(x, y); g.rotate(rot * D2R); g.globalAlpha *= .9 * a; g.strokeStyle = col; g.fillStyle = col;
  const { w, hh } = drawIn(g, true);
  g.lineWidth = size * .11; g.beginPath(); g.roundRect(-w / 2, -hh / 2, w, hh, size * .2); g.stroke(); g.lineWidth = size * .035; g.beginPath(); g.roundRect(-w / 2 + size * .16, -hh / 2 + size * .16, w - size * .32, hh - size * .32, size * .11); g.stroke();
  drawIn(g, false); noteText(g, 'stamp-' + label, label, -w / 2 + 20, -hh / 2 + 16, w / 2 - 20, hh / 2 - 16); g.restore();
}
function stampWord(g, x, y, rot, t, t0, word, size, col = '#B8392C') {
  stampFrame(g, x, y, rot, t, t0, size, col, word, (g, measure) => {
    g.font = `${size}px Lilita`; g.letterSpacing = '6px'; const w = g.measureText(word).width + size * .9, hh = size * 1.55;
    if (!measure) { g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(word, size * .04, size * .07); } g.letterSpacing = '0px'; return { w, hh };
  });
}
function stampMath(g, x, y, rot, t, t0, expr, size, col = '#B8392C') {
  stampFrame(g, x, y, rot, t, t0, size, col, mPlain(expr), (g, measure) => {
    const nodes = mParse(expr), w0 = mWidth(g, nodes, size, 'OldStdB'), w = w0 + size * 1.0, hh = size * 2.0;
    if (!measure) { g.textBaseline = 'alphabetic'; mDraw(g, nodes, -w0 / 2, size * .3, size, 'OldStdB'); } return { w, hh };
  });
}
function fade(t, t1, d = .45) { return clamp(1 - (t - t1) / d, 0, 1); }

function tile(g, id, txt, x, y, o = {}) {   // a paper number card; o: col, k (scale), rot, flip (0..1 squash), glow, w
  const k = o.k ?? 1; if (k <= 0) return; const w = (o.w || 150), h = 180, col = o.col || C.ink;
  g.save(); g.translate(x, y); g.rotate((o.rot || 0) * D2R); g.scale(k * (o.flip ?? 1), k);
  g.shadowColor = 'rgba(30,20,10,.35)'; g.shadowBlur = 10 + (o.lift || 0) * 30; g.shadowOffsetX = 6 + (o.lift || 0) * 20; g.shadowOffsetY = 9 + (o.lift || 0) * 30;
  g.fillStyle = o.bg || '#FBF3DF'; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 16); g.fill(); g.shadowColor = 'transparent';
  if (o.glow) { g.save(); g.globalAlpha = o.glow; g.strokeStyle = o.glowCol || YEL; g.lineWidth = 16; g.beginPath(); g.roundRect(-w / 2 - 6, -h / 2 - 6, w + 12, h + 12, 20); g.stroke(); g.restore(); }
  g.lineWidth = 5; g.strokeStyle = C.ink; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 16); g.stroke();
  g.font = '124px Lilita'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  if (col !== C.ink) { g.lineJoin = 'round'; g.lineWidth = 16; g.strokeStyle = C.ink; g.strokeText(txt, 0, 46); }
  g.fillStyle = col; g.fillText(txt, 0, 46);
  noteText(g, id, txt, -w / 2 + 8, -h / 2 + 10, w / 2 - 8, h / 2 - 10); TXT[TXT.length - 1].pass = true;
  g.restore();
}

// ---------------------------------------------------------------- small helpers
function popRich(g, id, parts, x, y, size, t, t0) { const k = popIn(t, t0, .22); if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); rich(g, id, parts, 0, 0, size); g.restore(); }
function stopwatch(g, x, y, r, secs, label) {
  g.save(); g.translate(x, y);
  g.shadowColor = 'rgba(30,20,10,.35)'; g.shadowBlur = 10; g.shadowOffsetX = 6; g.shadowOffsetY = 9;
  g.fillStyle = '#5E5A55'; g.fillRect(-r * .16, -r * 1.28, r * .32, r * .22); g.beginPath(); g.arc(0, 0, r, 0, 7); g.fillStyle = '#FBF3DF'; g.fill(); g.shadowColor = 'transparent';
  g.lineWidth = r * .1; g.strokeStyle = C.ink; g.stroke(); g.fillStyle = C.ink; g.fillRect(-r * .2, -r * 1.36, r * .4, r * .12);
  for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2 - Math.PI / 2; g.lineWidth = r * .045; g.beginPath(); g.moveTo(Math.cos(a) * r * .72, Math.sin(a) * r * .72); g.lineTo(Math.cos(a) * r * .86, Math.sin(a) * r * .86); g.stroke(); }
  const s = Math.min(secs, 2); g.fillStyle = 'rgba(200,70,58,.25)'; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r * .68, -Math.PI / 2, -Math.PI / 2 + s / 10 * Math.PI * 2); g.closePath(); g.fill();
  const a = -Math.PI / 2 + secs / 10 * Math.PI * 2; g.strokeStyle = RED; g.lineWidth = r * .07; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * r * .74, Math.sin(a) * r * .74); g.stroke();
  g.fillStyle = C.ink; g.beginPath(); g.arc(0, 0, r * .09, 0, 7); g.fill();
  if (label) { g.font = `${r * .5}px Lilita`; g.textAlign = 'center'; g.fillStyle = RED; g.fillText(label, 0, r * 1.62); noteText(g, 'sw-' + label, label, -r, r * 1.2, r, r * 1.7); TXT[TXT.length - 1].pass = true; }
  g.restore();
}
const tw = s => 80 + 70 * s.length;   // card width for a number string

function nameTag(g, id, text, x, y, col) {
  g.save(); g.font = '40px Lilita'; const w = g.measureText(text).width + 36; g.translate(x, y);
  g.fillStyle = col; g.beginPath(); g.roundRect(-w / 2, -26, w, 52, 26); g.fill(); g.lineWidth = 4; g.strokeStyle = C.ink; g.stroke();
  g.fillStyle = '#FBF3DF'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 0, 3);
  noteText(g, 'tag-' + id, text, -w / 2, -26, w / 2, 26); TXT[TXT.length - 1].pass = true; g.restore();
}

// ---------------------------------------------------------------- hook (frame 1 = thumbnail)
function hookCard(g, t) {
  drawCard(g, PAT.hook, { c: P.hook, rot: -1.2, h: 0 });
  g.save(); g.translate(...P.hook); g.rotate(-1.2 * D2R);
  pill(g, 'h-pill', 'TRIK 2 DETIK', 0, -285, 44, RED);
  const k = 1 + .05 * Math.sin(Math.max(0, t) * 7) * Math.exp(-Math.max(0, t) * .6);   // the sum breathes in the first second
  g.save(); g.translate(0, -60); g.scale(k, k); rich(g, 'h-1', [['67²', YEL], [' − ', C.ink], ['33²', COLB], [' = ', C.ink], ['?', RED]], 0, 15, 128); g.restore();
  rich(g, 'h-2', [['tanpa kalkulator', C.ink]], 0, 105, 60);
  rich(g, 'h-3', [['bisa dalam ', C.ink], ['2 detik?', RED]], 0, 215, 66);
  g.restore();
  stopwatch(g, 300, 2235, 125, t % 2.6, null);
}

// ---------------------------------------------------------------- Budi does it the long way
const LONG = [['67 × 67 = 4489', 'sq1'], ['33 × 33 = 1089', 'sq2'], ['4489 − 1089 = …', 'sub']];
function budiScene(g, t, cam) {
  const [cx, cy] = P.budi, bx = cx - 250, ky = cy + 80, S = .7, m = S / .5, won = t > T.win, slow = t > T.slow && !won;
  drawLayer(g, cam, q => drawPuppet(q, 'bud', stand('bud', bx, ky, won ? { s: S, head: 'wow', hL: [bx - 110 * m, ky - 120 * m], hR: [bx + 110 * m, ky - 120 * m], bL: -1, bR: 1 } : slow ? { s: S, head: 'shout', hL: [bx - 100 * m, ky - 70 * m], hR: [bx + 100 * m, ky - 70 * m], bL: -1, bR: 1 }
    : { s: S, head: 'worried', hR: [bx + 90 * m, ky + 150 * m], hL: [bx - 80 * m, ky + 170 * m] })));
  g.save(); g.shadowColor = 'rgba(30,20,10,.35)'; g.shadowBlur = 10; g.shadowOffsetY = 8; g.fillStyle = '#9C6B3E'; g.beginPath(); g.roundRect(bx - 210, ky + 150, 420, 170, 14); g.fill();
  g.shadowColor = 'transparent'; g.lineWidth = 5; g.strokeStyle = C.ink; g.stroke(); g.restore();
  nameTag(g, 'budi', 'Budi', bx, ky - 290, COLB);
  // the long way, on a sheet of scrap paper
  const px = cx + 200, py = cy - 190;
  if (t > T.toBudi + .3) { const k = popIn(t, T.toBudi + .3, .25); g.save(); g.translate(px, py); g.rotate(2 * D2R); g.scale(k, k);
    g.shadowColor = 'rgba(30,20,10,.3)'; g.shadowBlur = 12; g.shadowOffsetX = 6; g.shadowOffsetY = 9; g.fillStyle = '#FBF8F0'; g.fillRect(-260, -185, 520, 370); g.shadowColor = 'transparent';
    g.strokeStyle = 'rgba(95,147,166,.45)'; g.lineWidth = 2; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-250, i * 78 + 2); g.lineTo(250, i * 78 + 2); g.stroke(); }
    rich(g, 'b-head', [['cara biasa', '#7B6A57']], 0, -118, 48);
    LONG.forEach(([s, key], i) => { if (t < T[key]) return; const u = clamp((t - T[key]) / .5, 0, 1);
      g.save(); g.beginPath(); g.rect(-230, i * 78 - 85, 470 * u, 90); g.clip(); g.font = 'italic 50px OldStdIt'; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillStyle = PEN;
      g.fillText(s, -215, i * 78 - 10); g.restore(); noteText(g, 'b-l' + i, s, -215, i * 78 - 48, 225, i * 78 - 6); });
    g.restore(); }
  // a stopwatch that runs and runs
  const secs = t > T.toBack ? clamp(t - T.win + 2, 0, 2) : clamp(t - T.toBudi - .3, 0, 9) * 3.6;
  stopwatch(g, cx - 330, cy - 390, 80, secs, won ? '2 dtk' : t > T.slow && t < T.toBack ? '30 dtk' : null);
  if (slow && t < T.toBack) stampWord(g, px, cy + 60, -5, t, T.slow, 'KELAMAAN!', 62);
  if (won) mathSlip(g, 'b-win', '100 × 34 = 3400', px, cy + 70, -3, t, T.win, { size: 54, dy: 60, check: true, bg: '#E3F0DC' });
}

// ---------------------------------------------------------------- a² − b² row: the two numbers become their sum and their difference
function opDisc(g, x, y, sym, col, k) {
  if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); g.beginPath(); g.arc(0, 0, 44, 0, 7); g.fillStyle = col; g.fill(); g.lineWidth = 5; g.strokeStyle = C.ink; g.stroke();
  g.font = '76px Lilita'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#FBF3DF'; g.lineWidth = 10; g.lineJoin = 'round'; g.strokeText(sym, 0, 4); g.fillText(sym, 0, 4); g.restore();
}
function sqRow(g, id, t, [x, y], o) {
  if (t < Math.min(o.head, o.formula ?? 1e9) - .3) return;
  if (o.formula && t > o.formula) { const u = EASE.io(clamp((t - o.head + .7) / .6, 0, 1)), fy = lerp(y - 170, y - 425, u), fk = lerp(1.22, 1, u);
    pill(g, id + '-fp', 'RUMUS SMP', x, fy - 87 * fk, 38 * fk, '#2D5F8A'); mathSlip(g, id + '-f', 'a^{2} − b^{2} = (a + b)(a − b)', x, fy, -1, t, o.formula, { size: 50, dy: 60, k: fk }); 
    if (t > o.js && u < 1) { g.save(); g.globalAlpha = 1 - u; popRich(g, id + '-js', [['jumlah', COLA], [' × ', C.ink], ['selisih', COLB]], x, fy + 175, 72, t, o.js); g.restore(); } }
  if (t < o.head - .3) return;
  mathSlip(g, id + '-h', o.head_txt + ' = ?', x, y - 300, 1.5, t, o.head, { size: 60, dy: 60 });
  const k0 = popIn(t, o.head + .2, .22), ya = y - 150, yb = y + 70, dx = 190;
  const hiA = t > o.sumOp && t < o.mul, hiOp = t > o.difOp ? 'dif' : t > o.sumOp ? 'sum' : null;
  tile(g, id + '-a', o.a, x - dx, ya, { w: tw(o.a), k: k0, glow: hiA ? .8 : 0, glowCol: hiOp === 'dif' ? COLB : YEL });
  tile(g, id + '-b', o.b, x + dx, ya, { w: tw(o.b), k: k0, glow: hiA ? .8 : 0, glowCol: hiOp === 'dif' ? COLB : YEL });
  if (hiOp && t < o.mul) opDisc(g, x, ya, hiOp === 'dif' ? '−' : '+', hiOp === 'dif' ? COLB : YEL, popIn(t, hiOp === 'dif' ? o.difOp : o.sumOp, .2));
  if (t > o.sum) { tile(g, id + '-s', o.sumTxt, x - dx, yb, { w: tw(o.sumTxt), col: YEL, k: popIn(t, o.sum, .25) }); popRich(g, id + '-ls', [['jumlah', '#7B6A57']], x - dx, yb + 140, 38, t, o.sum + .1); }
  if (t > o.dif) { tile(g, id + '-d', o.difTxt, x + dx, yb, { w: tw(o.difTxt), col: COLB, k: popIn(t, o.dif, .25) }); popRich(g, id + '-ld', [['selisih', '#7B6A57']], x + dx, yb + 140, 38, t, o.dif + .1); }
  if (t > o.mul) popRich(g, id + '-x', [['×', C.ink]], x, yb + 30, 90, t, o.mul);
  if (t > o.res) stampWord(g, x, y + 320, -3, t, o.res, '= ' + o.res_txt, 66, GRN);
  if (o.save && t > o.save) { const k = popIn(t, o.save, .3); g.save(); g.translate(x - 330, y - 305); g.rotate(-6 * D2R); g.scale(k * .8, k * .8);   // "simpan" sticker
    g.shadowColor = 'rgba(30,20,10,.35)'; g.shadowBlur = 10; g.shadowOffsetX = 5; g.shadowOffsetY = 8; g.fillStyle = '#FBF3DF'; g.beginPath(); g.roundRect(-78, -82, 156, 164, 18); g.fill(); g.shadowColor = 'transparent';
    g.lineWidth = 5; g.strokeStyle = C.ink; g.stroke(); g.fillStyle = RED; g.beginPath(); g.moveTo(-26, -58); g.lineTo(26, -58); g.lineTo(26, 18); g.lineTo(0, -2); g.lineTo(-26, 18); g.closePath(); g.fill(); g.lineWidth = 4; g.stroke();
    g.font = '34px Lilita'; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillStyle = C.ink; g.fillText('SIMPAN', 0, 62); noteText(g, id + '-save', 'SIMPAN', -60, 34, 60, 70); g.restore(); }
}

// ---------------------------------------------------------------- the trap: subtract first, then square
function trapRow(g, t) {
  const [x, y] = P.trap; if (t < T.toTrap) return;
  pill(g, 't-pill', 'HATI-HATI!', x, y - 430, 44, RED);
  if (t > T.tpHead) mathSlip(g, 't-1', '(67 − 33)^{2}', x, y - 290, -1.5, t, T.tpHead, { size: 62, dy: 60, bg: '#FBE3DC' });
  if (t > T.tpSq) mathSlip(g, 't-2', '= 34^{2}', x, y - 140, 1.5, t, T.tpSq, { size: 62, dy: 60, bg: '#FBE3DC' });
  if (t > T.tpVal) mathSlip(g, 't-3', '= 1156', x, y + 10, -1, t, T.tpVal, { size: 62, dy: 60, bg: '#FBE3DC' });
  if (t > T.wrong) stampWord(g, x, y + 145, -6, t, T.wrong, 'SALAH!', 64);
  if (t > T.right) mathSlip(g, 't-ok', '67^{2} − 33^{2} = 3400', x, y + 305, 1, t, T.right, { size: 50, dy: 60, check: true, bg: '#E3F0DC' });
}

// ---------------------------------------------------------------- why: 67² − 33² is an L, and the L becomes a 100 × 34 strip
function block(g, x, y, w, h, fill, dash) {
  g.save(); g.fillStyle = fill; g.fillRect(x, y, w, h); g.lineWidth = 5; g.strokeStyle = C.ink; if (dash) g.setLineDash([14, 10]); g.strokeRect(x, y, w, h); g.restore();
}
function whyCard(g, t) {
  const [x, y] = P.why; card(g, PAT.why, x, y, 1, t, T.toWhy + .4);
  onCard(g, x, y, 1, t, T.toWhy + .4, () => {
    pill(g, 'w-pill', 'KENAPA BISA?', 0, -400, 44);
    if (t < T.wsq) return;
    const k = popIn(t, T.wsq, .3); g.save(); g.scale(k, k);
    const X0 = -300, Y0 = -285, A = 402, Bs = 198, D = 204;   // 6 px per unit: 67, 33, 34
    const lift = EASE.io(clamp((t - T.cut - .6) / .9, 0, 1)), mv = EASE.io(clamp((t - T.move) / 1.3, 0, 1)), split = t > T.split;
    block(g, X0, Y0, A, D, '#F6E7B0');                                        // top strip 67 × 34
    if (!split) block(g, X0, Y0 + D, D, Bs, '#F6E7B0');                          // lower-left piece, same colour until the split
    else { const c0 = [X0 + D / 2, Y0 + D + Bs / 2], c1 = [X0 + A + Bs / 2, Y0 + D / 2];
      const px = lerp(c0[0], c1[0], mv), py = lerp(c0[1], c1[1], mv) - Math.sin(Math.PI * mv) * 140;
      g.save(); g.translate(px, py); g.rotate(-mv * Math.PI / 2); block(g, -D / 2, -Bs / 2, D, Bs, '#CFE3F5'); g.restore(); }
    if (lift < 1) { g.save(); g.globalAlpha = 1 - lift; g.translate(lift * 160, -lift * 60);   // the cut square, lifted away
      block(g, X0 + D, Y0 + D, Bs, Bs, t > T.cut ? '#F7C9C0' : '#F6E7B0', t > T.cut);
      if (t > T.cut) rich(g, 'w-33', [['33²', RED]], X0 + D + Bs / 2, Y0 + D + Bs / 2 + 22, 62); g.restore(); }
    if (t < T.move) { const a = clamp((t - T.wsq - .3) / .3, 0, 1); g.save(); g.globalAlpha = a;
      rich(g, 'w-67t', [['67', C.ink]], X0 + A / 2, Y0 - 20, 54); rich(g, 'w-67l', [['67', C.ink]], X0 - 50, Y0 + A / 2 + 18, 54); g.restore();
      if (t > T.split) { rich(g, 'w-34l', [['34', COLB]], X0 + D / 2, Y0 + D + Bs + 54, 54); } }
    if (t > T.join) { const u = clamp((t - T.join) / .3, 0, 1); g.save(); g.globalAlpha = u; g.strokeStyle = RED; g.lineWidth = 7; g.setLineDash([16, 10]); g.strokeRect(X0 - 8, Y0 - 8, A + Bs + 16, D + 16); g.restore();
      rich(g, 'w-100', [['100', RED]], X0 + (A + Bs) / 2, Y0 - 22, 48); rich(g, 'w-34', [['34', RED]], X0 - 44, Y0 + D / 2 + 16, 48); }
    g.restore();
    if (t > T.wres) popRich(g, 'w-res', [['100 × 34 = ', C.ink], ['3400', GRN]], 0, 150, 64, t, T.wres);
    if (t > T.wres + .5) popRich(g, 'w-res2', [['= 67² − 33²', '#7B6A57']], 0, 250, 52, t, T.wres + .5);
  });
}

// ---------------------------------------------------------------- challenge and CTA
function bonusCard(g, t) {
  const [x, y] = P.bonus; card(g, PAT.bonus, x, y, -1.5, t, T.bonus - .2);
  onCard(g, x, y, -1.5, t, T.bonus - .2, () => {
    pill(g, 'b-pill', 'TANTANGAN', 0, -290, 44, RED);
    rich(g, 'b-1', [['58²', YEL], [' − ', C.ink], ['42²', COLB], [' = ', C.ink], ['?', RED]], 0, -80, 118);
    const k = t > T.comment ? 1 + .06 * Math.exp(-(t - T.comment) * 4) * Math.sin((t - T.comment) * 18) : 1;
    g.save(); g.translate(0, 80); g.scale(k, k); rich(g, 'b-2', [['tulis ', C.ink], ['angkanya saja', RED]], 0, 0, 62); g.restore();
    rich(g, 'b-3', [['di komentar ↓', C.ink]], 0, 185, 58);
  });
}
function ctaCard(g, t) {
  const [x, y] = P.cta; card(g, PAT.cta, x, y, 1.2, t, T.cta);
  onCard(g, x, y, 1.2, t, T.cta, () => {
    pill(g, 'c-pill', 'FOLLOW', 0, -200, 44, '#2D5F8A');
    rich(g, 'c-1', [['Follow', RED]], 0, -70, 96);
    rich(g, 'c-2', [['untuk trik hitung cepat', C.ink]], 0, 40, 56);
    rich(g, 'c-3', [['lainnya!', C.ink]], 0, 130, 56);
  });
}
const CAP_BOTTOM = 1480, WM_Y = 1530;
function watermark(g, t) {
  const a = clamp((t - T.pull0 + .3) / .6, 0, 1); if (a <= 0) return;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = .4 * a; g.font = '40px Lilita'; g.letterSpacing = '10px'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineJoin = 'round'; g.lineWidth = 7; g.strokeStyle = '#FBF3DF'; g.strokeText('HAWREIREI', W / 2 + 5, WM_Y); g.fillStyle = C.ink; g.fillText('HAWREIREI', W / 2 + 5, WM_Y);
  g.letterSpacing = '0px'; noteText(g, 'wm', 'HAWREIREI', W / 2 - 180, WM_Y - 24, W / 2 + 190, WM_Y + 24); TXT[TXT.length - 1].pass = true; g.restore();
}


// ---------------------------------------------------------------- the host walks with the camera (screen x ~95, same screen size at every zoom)
const hostAtPlace = k => { const [cx, cy, z] = k === 'home' ? [540, 2000, 1] : CAMP[k]; return [cx - 445 / z, cy + 330 / z, .72 * .85 / z]; };
const HOME = [870, 2330, 1];
const HOSTK = [[0, ...HOME], [T.toBudi, ...HOME], [T.toBudi + .9, ...hostAtPlace('budi')],
  [T.toR1, ...hostAtPlace('budi')], [T.toR1 + .9, ...hostAtPlace('r1')], [T.toR2, ...hostAtPlace('r1')], [T.toR2 + .8, ...hostAtPlace('r2')],
  [T.toTrap, ...hostAtPlace('r2')], [T.toTrap + .8, ...hostAtPlace('trap')], [T.toWhy, ...hostAtPlace('trap')], [T.toWhy + .9, ...hostAtPlace('why')],
  [T.toBack, ...hostAtPlace('why')], [T.toBack + 1.0, ...hostAtPlace('budi')], [T.toBonus, ...hostAtPlace('budi')], [T.toBonus + 1.0, ...hostAtPlace('bonus')],
  [T.cta - .5, ...hostAtPlace('bonus')], [T.cta + .4, ...hostAtPlace('cta')], [DUR, ...hostAtPlace('cta')]];
function hostAt(t) {
  let i = 1; while (i < HOSTK.length - 1 && t > HOSTK[i][0]) i++;
  const a = HOSTK[i - 1], b = HOSTK[i], u = EASE.io(clamp((t - a[0]) / (b[0] - a[0]), 0, 1)), k = lerp(a[3], b[3], u);
  return [lerp(a[1], b[1], u), lerp(a[2], b[2], u) - (u > 0 && u < 1 && (a[1] !== b[1] || a[2] !== b[2]) ? Math.sin(Math.PI * u) * 260 * k : 0), k];
}
function hostPoseName(t) {
  if (t < 2.5) return 'think';                            // "67 kuadrat dikurangi 33 kuadrat."
  if (t < T.pull0) return 'pointyou';                     // "Bisa dalam dua detik?"
  if (t < T.slow) return 'confused';                      // Budi squares the long way
  if (t < T.toR1) return 'wrong';                         // "Kelamaan!"
  if (t < T.r1Head) return 'idea';                        // "Pakai rumus SMP ini"
  if (t < T.res) return 'pointer';
  if (t < T.save) return 'thumbs';
  if (t < T.toR2) return 'clap';                          // "Simpan dulu"
  if (t < T.r2Res) return 'present';
  if (t < T.toTrap) return 'cheer';
  if (t < T.wrong) return 'think';                        // "Tapi hati-hati!"
  if (t < T.right) return 'wrong';
  if (t < T.toWhy) return 'thumbs';                       // "Yang benar tetap 3400."
  if (t < T.wsq) return 'think';                          // "Kenapa bisa?"
  if (t < T.move) return 'pointer';
  if (t < T.toBack) return 'idea';
  if (t < T.toBonus) return 'cheer';                      // Budi did it
  if (t < T.comment) return 'pointyou';                   // "Sekarang giliranmu"
  if (t < T.out) return 'present';
  return 'wave';
}

// ---------------------------------------------------------------- frame
function renderFilm(t) {
  TXT = [];
  const g = MAIN, tq = twos(t), cam = camAt(t), v = viewOf(cam);
  g.setTransform(1, 0, 0, 1, 0, 0); g.shadowColor = 'transparent'; g.globalAlpha = 1;
  g.fillStyle = tablePat; g.fillRect(0, 0, W, H);
  applyCam(g, cam);
  drawSheet(g, v);
  if (near(v, 'hook')) hookCard(g, tq);
  if (near(v, 'budi')) budiScene(g, tq, cam);
  if (near(v, 'r1')) sqRow(g, 'r1', tq, P.r1, { formula: T.formula, js: T.js, head: T.r1Head, head_txt: '67^{2} − 33^{2}', a: '67', b: '33', sumTxt: '100', difTxt: '34', sumOp: T.sumOp, sum: T.sum, difOp: T.difOp, dif: T.dif, mul: T.mul, res: T.res, res_txt: '3400', save: T.save });
  if (near(v, 'r2')) sqRow(g, 'r2', tq, P.r2, { head: T.r2Head, head_txt: '75^{2} − 25^{2}', a: '75', b: '25', sumTxt: '100', difTxt: '50', sumOp: T.r2Sum - .3, sum: T.r2Sum, difOp: T.r2Dif - .25, dif: T.r2Dif, mul: T.r2Mul, res: T.r2Res, res_txt: '5000' });
  if (near(v, 'trap')) trapRow(g, tq);
  if (near(v, 'why')) whyCard(g, tq);
  if (near(v, 'bonus')) bonusCard(g, tq);
  if (near(v, 'cta')) ctaCard(g, tq);
  drawHost(g, t);
  g.setTransform(1, 0, 0, 1, 0, 0);
  vignette(g, .14);
  watermark(g, t);
  caption(t);
}
const SPR = {}; let VOENV = [];
const BODY_H = 380, SHEET_BODY = { a: 361, b: 510 };
const POSE = { neutral: ['a', 0], palms: ['a', 1], cheer: ['a', 2], cheeks: ['a', 3], armsup: ['a', 4], present: ['a', 5],
  think: ['b', 1], idea: ['b', 2], pointyou: ['b', 3], confused: ['b', 4], wrong: ['b', 5], thumbs: ['b', 6], write: ['b', 7], wave: ['b', 14],
  walkA: ['b', 15], walkB: ['b', 16], shrug: ['b', 17], clap: ['b', 18], pointer: ['b', 21], crossed: ['b', 24] };
function drawHost(g, t) {
  const [x, fy, kk] = hostAt(t), name = hostPoseName(t), [sh, i] = POSE[name], im = SPR[sh + i]; if (!im) return;
  let t0 = t; for (let k = 0; k < 40; k++) { if (hostPoseName(t0 - .05) !== name) break; t0 -= .05; }
  const pop = 1 + .12 * Math.exp(-(t - t0) * 9) * Math.cos((t - t0) * 26);
  const fi = Math.floor((t - VO_OFF) * 24), talk = !VOENV.length || fi < 0 || fi >= VOENV.length ? 0 : VOENV[fi];
  const k = BODY_H * kk / SHEET_BODY[sh], w = im.width * k, h = im.height * k, breathe = 1 + .012 * Math.sin(t * 3.1) + .03 * talk;
  g.save(); g.translate(x, fy); g.scale(pop, pop * breathe);
  g.shadowColor = 'rgba(30,18,6,.4)'; g.shadowBlur = 16; g.shadowOffsetX = 10 * kk; g.shadowOffsetY = 12 * kk;
  g.drawImage(im, -w / 2, -h, w, h);
  { const M = g.getTransform(), p = [[-w * .4, -h * .96], [w * .4, 0]].map(([a, b]) => [M.a * a + M.c * b + M.e, M.b * a + M.d * b + M.f]); window.__HB = { x0: p[0][0], y0: p[0][1], x1: p[1][0], y1: p[1][1] }; }
  g.restore();
}

const CAP_MAXW = 716;
function caption(t) {
  const i = CAPS.findIndex(([a, b]) => t >= a && t < b); if (i < 0 || t < T.pull0 || CAPS[i][0] < T.pull0 - .05) return;   // the hook card is the opening caption
  const [a, b, tx] = CAPS[i], g = MAIN, size = 56, fam = 'Fell';
  const wOf = s => mWidth(g, mParse(s), size, fam);
  let lines = [tx];
  if (wOf(tx) > CAP_MAXW) { const ws = tx.split(' '); let best = null; for (let k = 1; k < ws.length; k++) { const A = ws.slice(0, k).join(' '), B = ws.slice(k).join(' '), m = Math.max(wOf(A), wOf(B)); if (!best || m < best.m) best = { m, L: [A, B] }; } lines = best.L; }   // safe space: box ≤ 800 wide (x 140–940)
  const u = EASE.o(clamp((t - a) / 0.14, 0, 1)), v = clamp((b - t) / 0.1, 0, 1);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  const lh = 74, w = Math.max(...lines.map(wOf)) + 84, h = lines.length * lh + 50, x = W / 2 - w / 2, y = CAP_BOTTOM - h + (1 - u) * 18 + (1 - v) * 10;
  g.globalAlpha = Math.min(u, v);
  g.shadowColor = 'rgba(30,20,10,.38)'; g.shadowBlur = 12; g.shadowOffsetX = 5; g.shadowOffsetY = 8;
  g.fillStyle = C.caption; g.fillRect(x, y, w, h); g.shadowColor = 'transparent';
  g.strokeStyle = C.ink; g.lineWidth = 4; g.strokeRect(x + 2, y + 2, w - 4, h - 4);
  g.fillStyle = C.ink; g.textBaseline = 'alphabetic';
  lines.forEach((l, k) => mDraw(g, mParse(l), W / 2 - wOf(l) / 2, y + 26 + lh * (k + 0.74), size, fam));
  noteText(g, 'cap' + i, mPlain(tx), x + 30, y + 10, x + w - 30, y + h - 10);
  g.restore();
}
window.TEXTS = t => { renderFilm(t); return TXT.filter(x => x.x1 > 0 && x.x0 < W && x.y1 > 0 && x.y0 < H).map(e => ({ id: e.id, text: e.text, x0: e.x0, y0: e.y0, x1: e.x1, y1: e.y1, ...(e.pass ? { pass: true } : {}) })); };

function buildEvents() {
  const ev = [], E = (t, type, o = {}) => ev.push({ t: +t.toFixed(3), type, pan: 0, ...o });
  [[0, 'intro'], [T.toBudi, 'go'], [T.toR1, 'run'], [T.toR2, 'meet'], [T.toTrap, 'tree'], [T.toWhy, 'answer'], [T.bonus, 'bonus'], [T.cta, 'cta'], [T.out, 'end']].forEach(([t, name]) => E(t, 'sec', { name }));
  E(0, 'room', { d: DUR }); if (ALIGN) E(VO_OFF, 'vo', { id: 'full' });
  const move = (t0, d = 1.0, pan = 0) => { E(t0, 'swish', { d, pan }); E(t0 + .1, 'hop', { pan }); };
  for (let i = 0; i < 4; i++) E(.4 + i * .5, 'tick', { pan: -.3 });
  move(T.toBudi, .9, .3); E(T.toBudi + .3, 'slapS', { pan: .3 }); E(T.sq1, 'scribble', { d: .5, pan: .3 }); E(T.sq2, 'scribble', { d: .5, pan: .3 }); E(T.sub, 'scribble', { d: .5, pan: .3 });
  for (let i = 0; i < 6; i++) E(T.toBudi + .5 + i * .5, 'tick', { pan: -.4 }); E(T.slow - .3, 'swish', { d: .3 }); E(T.slow, 'stamp');
  const row = (head, sumOp, sum, difOp, dif, mul, res) => { E(head, 'slapS'); E(head + .2, 'pop', { pan: -.2 }); E(head + .3, 'pop', { pan: .2 });
    E(sumOp, 'tick'); E(sum, 'pop', { pan: -.2 }); E(difOp, 'tick'); E(dif, 'pop', { pan: .2 }); E(mul, 'slapS'); E(res - .3, 'swish', { d: .3 }); E(res, 'stamp'); E(res + .1, 'chime'); };
  move(T.toR1, .9, -.3); E(T.formula, 'slap'); row(T.r1Head, T.sumOp, T.sum, T.difOp, T.dif, T.mul, T.res); E(T.save, 'pop', { pan: -.3 });
  move(T.toR2, .8, 0); row(T.r2Head, T.r2Sum - .3, T.r2Sum, T.r2Dif - .25, T.r2Dif, T.r2Mul, T.r2Res);
  move(T.toTrap, .8, .3); E(T.toTrap + .4, 'slapS'); E(T.tpHead, 'slapS'); E(T.tpSq, 'slapS'); E(T.tpVal, 'slapS'); E(T.wrong - .3, 'swish', { d: .3 }); E(T.wrong, 'stamp'); E(T.right, 'chime');
  move(T.toWhy, .9, -.3); E(T.toWhy + .4, 'slap'); E(T.wsq, 'pop'); E(T.cut, 'tick'); E(T.cut + .6, 'swish', { d: .9, pan: .4 }); E(T.split, 'tick');
  E(T.move, 'swish', { d: 1.3 }); E(T.move + 1.3, 'dep', { key: 'A', m: 7 }); E(T.join, 'slapS'); E(T.wres, 'pop'); E(T.wres + .1, 'chime');
  E(T.toBack, 'swish', { d: 1.0 }); E(T.toBack + .1, 'hop'); for (let i = 0; i < 3; i++) E(T.win - 2 + i * .7, 'tick', { pan: -.4 }); E(T.win, 'slapS'); E(T.win + .05, 'chime');
  move(T.toBonus, 1.0, -.3); E(T.bonus, 'slap'); E(T.comment, 'pop');
  E(T.cta - .5, 'swish', { d: .8 }); E(T.cta - .4, 'hop', { pan: .3 }); E(T.cta + .2, 'slap');
  E(T.out, 'pageout', { d: 1.6 });
  return ev.sort((a, b) => a.t - b.t);
}

// ---------------------------------------------------------------- boot
async function boot() {
  await Promise.all([document.fonts.load('92px Lilita', 'TRIK 0123456789 ×→…²?!−'), document.fonts.load('40px Fell', 'Angka'), document.fonts.load('62px OldStdB', '0123456789±–×=°/−+…?'),
    document.fonts.load('62px OldStd', '0123456789'), document.fonts.load('italic 96px OldStdIt', '35 ×'), document.fonts.load('52px FellSC', 'A')]);
  paperTex = makePaper(W * MS, H * MS, 7);
  { const pc = canvas(1024, 1024), pg = pc.getContext('2d'); pg.drawImage(makePaper(1024, 1024, 11), 0, 0); PAT.paper = MAIN.createPattern(pc, 'repeat');
    const tb = canvas(1024, 1024), bg = tb.getContext('2d'); bg.fillStyle = C.table; bg.fillRect(0, 0, 1024, 1024); bg.globalCompositeOperation = 'overlay'; bg.globalAlpha = .7; bg.drawImage(makePaper(1024, 1024, 33), 0, 0);
    tablePat = MAIN.createPattern(tb, 'repeat'); }
  try { ALIGN = await fetch('vo/el/align.json').then(r => { if (!r.ok) throw 0; return r.json(); }); VOENV = await fetch('vo/el/env.json').then(r => r.json()); }
  catch (e) { ALIGN = null; VOENV = []; VO_OFF = 0; }
  buildCaps(); window.EV = buildEvents();
  buildPuppets(); LAYER = canvas(W, H);
  const load = async (key, src) => { const im = new Image(); im.src = src; await im.decode(); SPR[key] = im; };
  await Promise.all([...[0, 1, 2, 3, 4, 5].map(i => load('a' + i, `sprites/hw_${i}.png`)), ...Array.from({ length: 30 }, (_, i) => load('b' + (i + 1), `sprites30/p${String(i + 1).padStart(2, '0')}.png`))]);
  const plain = (w, h, seed, col) => bakeCard({ path: rectPath(w, h), bw: w, bh: h, col: '#FBF3DF', seed, dashed: false, rim: 9, print: g => { g.strokeStyle = col; g.lineWidth = 5; g.strokeRect(-w / 2 + 20, -h / 2 + 20, w - 40, h - 40); } });
  PAT.hook = bakeCard({ path: rectPath(1000, 720), bw: 1000, bh: 720, col: '#FBF8F0', seed: 61, dashed: false, rim: 9, print: g => {
    g.strokeStyle = 'rgba(95,147,166,.45)'; g.lineWidth = 2; for (let y = -230; y < 340; y += 64) { g.beginPath(); g.moveTo(-480, y); g.lineTo(480, y); g.stroke(); }
    g.strokeStyle = 'rgba(200,70,58,.5)'; g.beginPath(); g.moveTo(-420, -340); g.lineTo(-420, 340); g.stroke(); } });
    PAT.why = plain(1000, 900, 64, 'rgba(43,34,25,.8)');
  PAT.bonus = bakeCard({ path: rectPath(1000, 760), bw: 1000, bh: 760, col: '#FBF3DF', seed: 62, dashed: false, rim: 9, print: g => { g.strokeStyle = 'rgba(184,57,44,.8)'; g.lineWidth = 5; g.setLineDash([22, 12]); g.strokeRect(-480, -360, 960, 720); } });
  PAT.cta = plain(900, 620, 83, 'rgba(45,95,138,.8)');
  window.render = t => renderFilm(t);
  window.READY = true;
}
boot();
window.__ALLTXT = () => TXT.map(e => ({ id: e.id, text: e.text, x0: e.x0, y0: e.y0, x1: e.x1, y1: e.y1 }));
window.__HOST = () => window.__HB;
window.__MOVING = t => { const a = camAt(t), b = camAt(t - .15); return Math.abs(a.f[0] - b.f[0]) + Math.abs(a.f[1] - b.f[1]) > 2 || Math.abs(a.z - b.z) > .005; };
