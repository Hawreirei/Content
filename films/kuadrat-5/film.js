// HAWREIREI — Trik 2 Detik #2: kuadrat berakhiran 5. 9:16, one continuous paper world (see hawreirei-style/STYLE.md).
// Story: a quick-maths contest — Budi scribbles, Ani answers 35² = 1225 in two seconds. The trick (3 × 4 = 12, stick 25),
// a second try (65²), the trap (3 × 3 → 925 ✗), the proof with a 35 × 35 grid square cut into 30 × 40 + 5 × 5,
// a big one (105²), back to Ani's win, challenge 95² (= 9025, pinned later).
const DUR = 88.0;
window.DUR = DUR;
const T = {   // film seconds, set from vo/el/align.json (voice segment + VO_OFF 0.3)
  pull0: 3.55, toLomba: 3.65, scribble: 5.14, aniHand: 8.2, aniAns: 9.47,
  toR1: 11.3, r1Head: 11.8, r1Ha: 14.45, r1Mul: 16.9, r1Eq: 18.16, r1FlipA: 19.2, r1FlipB: 21.0, r1Res: 23.0,
  toR2: 24.9, r2Head: 26.1, r2Mul: 27.7, r2Eq: 28.6, r2FlipA: 28.7, r2FlipB: 30.5, r2Res: 31.5,
  toTrap: 33.6, tpHead: 34.3, tpMul: 37.4, tpFlipA: 38.0, tpFlipB: 38.6, wrong: 40.33, fix: 40.9,
  toWhy: 43.1, sq: 44.6, cut: 48.1, lbl: 48.6, move: 53.5, join: 55.4, r1200: 58.45, c25: 61.4, why3: 62.63, why4: 64.0,
  toFlex: 65.3, fxHead: 66.9, fxMul: 68.5, fxEq: 69.6, fxFlipA: 69.7, fxFlipB: 70.5, fxRes: 71.0,
  toBack: 72.6, win: 74.0,
  toBonus: 75.4, bonus: 76.0, cta: 81.3, out: 83.9, end: 86.8,
};
let VO_OFF = 0.3;
const SAY = {
  v01: { p: ['35^{2}. Bisa jawab dalam 2 detik?'] },
  v02: { s: [2], p: ['Di lomba hitung cepat, Budi masih sibuk mencoret-coret.', 'Tapi Ani langsung angkat tangan: 1225!'] },
  v03: { s: [3], p: ['Rahasianya begini. Ambil angka depannya: 3.', 'Kalikan dengan angka sesudahnya: 4. 3 × 4, 12.'] },
  v04: { p: ['Lalu tempelkan 25 di belakangnya… 1225!'] },
  v05: { s: [3], p: ['Coba lagi. 65^{2}: 6 × 7, 42.', 'Tempel 25: 4225!'] },
  v06: { s: [2, 3], p: ['Tapi hati-hati. Jangan dikali dirinya sendiri.', '3 × 3, 925?', 'Salah! Harus dengan angka sesudahnya.'] },
  v07: { s: [2], p: ['Kenapa bisa? Bayangkan persegi 35 × 35.', 'Potong jadi persegi 30, dua pita, dan satu kotak kecil 5 × 5.'] },
  v08: { s: [1, 3], p: ['Pindahkan satu pita ke samping…', 'jadilah persegi panjang 30 × 40: 1200.', 'Ditambah kotak kecilnya: 25.'] },
  v09: { s: [1, 4], p: ['Itulah 3 × 4, lalu 25.', 'Angka besar juga bisa: 105^{2}, 10 × 11, 110.', '11025!'] },
  v10: { p: ['Dan begitulah Ani menang, dalam 2 detik.'] },
  v11: { s: [2], p: ['Sekarang giliranmu. 95^{2}.', 'Jawab di komentar, maksimal 2 detik!'] },
  v12: { p: ['Mau trik apa lagi? Tulis di komentar, ya!'] },
  v13: { p: ['Sampai jumpa di trik berikutnya!'] },
};
const DRAFT = {
  v01: [.3, 3.9, []], v02: [4.3, 10.8, [7.6]], v03: [11.2, 17.7, [14.3]], v04: [18.1, 23.1, []], v05: [23.5, 31.0, [28.4]],
  v06: [31.4, 38.9, [33.8, 36.9]], v07: [39.3, 47.3, [43.4]], v08: [47.7, 55.7, [49.6, 53.6]], v09: [56.1, 64.6, [58.6, 63.6]],
  v10: [65.0, 67.8, []], v11: [68.2, 73.2, [70.6]], v12: [73.6, 76.6, []], v13: [77.0, 79.0, []],
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
const SHEET = { x0: -140, y0: -1000, x1: 2400, y1: 7600 };
const YEL = '#F2B632', COLA = '#E2A93B', COLB = '#4F86B5', COLC = '#5E9A5A', RED = '#C8463A', PEN = '#2D5F8A', GRN = '#2D7A3E';
const P = { hook: [540, 1600], lomba: [1700, 1600], r1: [540, 3150], r2: [540, 4650], trap: [1700, 4650], why: [540, 6200], flex: [1700, 6200], bonus: [540, 150], cta: [1700, 150] };
const PAT = {};
const CAMP = { lomba: [1700, 1640, .85], r1: [540, 3210, 1.3], r2: [540, 4710, 1.3], trap: [1700, 4710, 1.3], why: [540, 6240, .85], flex: [1700, 6260, 1.1], bonus: [540, 190, .85], cta: [1700, 190, .85] };

// ---------------------------------------------------------------- camera
const CAM = [
  [0, 540, 960 + 1040, 1.0], [T.pull0, 540, 2000, 1.0], [T.toLomba + .9, ...CAMP.lomba, 'io'], [T.toR1, ...CAMP.lomba], [T.toR1 + .9, ...CAMP.r1, 'io'],
  [T.toR2, ...CAMP.r1], [T.toR2 + .8, ...CAMP.r2, 'io'], [T.toTrap, ...CAMP.r2], [T.toTrap + .9, ...CAMP.trap, 'io'],
  [T.toWhy, ...CAMP.trap], [T.toWhy + 1.0, ...CAMP.why, 'io'], [T.toFlex, ...CAMP.why], [T.toFlex + .9, ...CAMP.flex, 'io'],
  [T.toBack, ...CAMP.flex], [T.toBack + .7, 1400, 3950, .28, 'io'], [T.toBack + 1.4, ...CAMP.lomba, 'io'],
  [T.toBonus, ...CAMP.lomba], [T.toBonus + 1.0, ...CAMP.bonus, 'io'], [T.cta - .5, ...CAMP.bonus], [T.cta + .4, ...CAMP.cta, 'io'],
  [T.out, ...CAMP.cta], [T.end, 1130, 3300, .24, 'io'], [DUR, 1130, 3300, .235, 'lin'],
];
function camAt(t) {
  let i = 1; while (i < CAM.length - 1 && t > CAM[i][0]) i++;
  const a = CAM[i - 1], b = CAM[i], u = EASE[b[4] || 'io'](clamp((t - a[0]) / (b[0] - a[0]), 0, 1));
  const f = [lerp(a[1], b[1], u), lerp(a[2], b[2], u)], z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), u));
  let sx = 0, sy = 0, sr = 0;
  for (const [t0, am] of [[T.r1Res, 6], [T.r2Res, 4], [T.wrong, 7], [T.join, 4], [T.fxRes, 6], [T.win, 5], [T.aniAns, 4]]) { const s = shake(t, t0, am); sx += s[0]; sy += s[1]; sr += s[2]; }
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

// ---------------------------------------------------------------- one "a5²" row: the front card turns into a·(a+1), the 5 into 25
function trickRow(g, id, t, [x, y], o) {
  if (t < o.head - .3) return;
  mathSlip(g, id + '-h', o.head_txt, x, y - 300, -2, t, o.head, { size: 60, dy: 60 });
  const fa = clamp((t - o.flipA + .12) / .24, 0, 1), fb = clamp((t - o.flipB + .12) / .24, 0, 1);
  const aTxt = fa > .5 ? o.prod : o.a, bTxt = fb > .5 ? '25' : '5';
  const wa = lerp(tw(o.a), tw(o.prod), EASE.io(fa)), wb = lerp(tw('5'), tw('25'), EASE.io(fb)), tot = wa + wb + 10;
  const ax = x - tot / 2 + wa / 2, bx = x + tot / 2 - wb / 2;
  const pulse = t0 => t > t0 && t < t0 + .7 ? Math.sin(Math.PI * (t - t0) / .7) : 0;
  const k0 = popIn(t, o.head + .2, .22);
  tile(g, id + '-a', aTxt, ax, y, { w: wa, col: fa > .5 ? (o.wrongProd ? RED : YEL) : C.ink, flip: Math.max(.04, Math.abs(Math.cos(Math.PI * fa))), glow: pulse(o.ha ?? -9), k: k0 });
  tile(g, id + '-b', bTxt, bx, y, { w: wb, col: fb > .5 ? COLB : C.ink, flip: Math.max(.04, Math.abs(Math.cos(Math.PI * fb))), k: k0 });
  if (t > o.mul) mathSlip(g, id + '-m', t > o.eq ? o.mulEq : o.mulTxt, x, y - 175, 2, t, o.mul, { size: 48, bg: o.wrongProd ? '#FBE3DC' : '#FBEFC9', dy: 50 });
  if (o.res) stampWord(g, x, y + 200, -4, t, o.res, o.res_txt, 66, GRN);
  if (o.wrong) { stampWord(g, x, y + 190, -6, t, o.wrong, 'SALAH!', 70);
    if (t > o.fix) popRich(g, id + '-fix', [['angka ', C.ink], ['SESUDAHNYA', RED], [': 3 × 4', C.ink]], x, y + 305, 44, t, o.fix); }
}

// ---------------------------------------------------------------- hook (frame 1 = thumbnail)
function hookCard(g, t) {
  drawCard(g, PAT.hook, { c: P.hook, rot: -1.2, h: 0 });
  g.save(); g.translate(...P.hook); g.rotate(-1.2 * D2R);
  pill(g, 'h-pill', 'TRIK 2 DETIK', 0, -285, 44, RED);
  rich(g, 'h-1', [['35²', YEL], [' = ', C.ink], ['?', RED]], 0, -45, 170);
  rich(g, 'h-2', [['tanpa kalkulator', C.ink]], 0, 105, 60);
  rich(g, 'h-3', [['bisa dalam ', C.ink], ['2 detik?', RED]], 0, 215, 66);
  g.restore();
  stopwatch(g, 300, 2235, 125, t % 2.6, null);
}

// ---------------------------------------------------------------- the contest
const BUDI_LINES = ['   35', '× 35', '  175', '105  ', '1....?'];
function lombaScene(g, t, cam) {
  const [cx, cy] = P.lomba;
  pill(g, 'l-ban', 'LOMBA HITUNG CEPAT', cx, cy - 590, 50, '#2D5F8A');
  mathSlip(g, 'l-q', '35^{2} = ?', cx, cy - 450, -1.5, t, T.toLomba + .4, { size: 74, dy: 60 });
  const won = t > T.win, ax = cx + 260, bxx = cx - 260, ky = cy + 30, S = .7, m = S / .5;
  // kids behind their desks
  drawLayer(g, cam, q => drawPuppet(q, 'bud', stand('bud', bxx, ky, { s: S, head: won ? 'wow' : 'worried', hR: [bxx + 90 * m, ky + 150 * m], hL: [bxx - 80 * m, ky + 170 * m] })));
  const handUp = t > T.aniHand;
  drawLayer(g, cam, q => drawPuppet(q, 'ani', stand('ani', ax, ky, won ? { s: S, head: 'wow', hL: [ax - 110 * m, ky - 120 * m], hR: [ax + 110 * m, ky - 120 * m], bL: -1, bR: 1 }
    : handUp ? { s: S, head: 'shout', hR: [ax + 95 * m, ky - 140 * m], bR: 1 } : { s: S, head: 'n' })));
  for (const dx of [bxx, ax]) { g.save(); g.shadowColor = 'rgba(30,20,10,.35)'; g.shadowBlur = 10; g.shadowOffsetY = 8; g.fillStyle = '#9C6B3E'; g.beginPath(); g.roundRect(dx - 210, ky + 150, 420, 170, 14); g.fill(); g.shadowColor = 'transparent'; g.lineWidth = 5; g.strokeStyle = C.ink; g.stroke();
    g.fillStyle = '#FBF8F0'; g.save(); g.translate(dx, ky + 220); g.rotate(-3 * D2R); g.fillRect(-120, -60, 240, 125); g.lineWidth = 2; g.strokeStyle = 'rgba(43,34,25,.4)'; g.strokeRect(-120, -60, 240, 125); g.restore(); g.restore(); }
  // Budi's scribbles grow
  g.save(); g.translate(bxx, ky + 220); g.rotate(-3 * D2R); g.font = 'italic 24px OldStdIt'; g.fillStyle = PEN;
  const nL = clamp(Math.floor((t - T.scribble) / .7) + 1, 0, BUDI_LINES.length); BUDI_LINES.slice(0, nL).forEach((s, i) => g.fillText(s, -50, -34 + i * 24)); g.restore();
  nameTag(g, 'budi', 'Budi', bxx, ky - 290, COLB); nameTag(g, 'ani', 'Ani', ax - 130, ky - 290, COLA);
  // Ani's answer, and the stopwatch that stopped at 2 seconds
  if (t > T.aniAns) slip(g, 'l-ans', '1225!', ax + 90, cy - 300, 3, t, T.aniAns, { font: '92px Lilita', h: 130, dy: 60 });
  const sw = clamp(t - (T.aniAns - 2), 0, 2); stopwatch(g, cx - 380, cy - 440, 80, sw, t > T.aniAns ? '2 dtk' : null);
  if (won) { const k = popIn(t, T.win, .3); g.save(); g.translate(cx, ky + 40); g.scale(k * 1.3, k * 1.3);   // trophy
    g.fillStyle = '#E8B93A'; g.strokeStyle = C.ink; g.lineWidth = 4; g.beginPath(); g.moveTo(-45, -70); g.lineTo(45, -70); g.quadraticCurveTo(45, 10, 0, 18); g.quadraticCurveTo(-45, 10, -45, -70); g.fill(); g.stroke();
    g.beginPath(); g.arc(-48, -40, 18, Math.PI * .5, Math.PI * 1.5); g.stroke(); g.beginPath(); g.arc(48, -40, 18, -Math.PI * .5, Math.PI * .5); g.stroke();
    g.fillRect(-8, 18, 16, 30); g.strokeRect(-8, 18, 16, 30); g.fillStyle = '#9C6B3E'; g.fillRect(-35, 48, 70, 20); g.strokeRect(-35, 48, 70, 20); g.restore(); }
}

// ---------------------------------------------------------------- why: the 35 × 35 square becomes 30 × 40 + 5 × 5
const U = 15;   // grid unit
function gridRect(g, x, y, w, h, fill) {
  g.save(); g.fillStyle = fill; g.fillRect(x, y, w, h);
  g.beginPath(); g.rect(x, y, w, h); g.clip(); g.strokeStyle = 'rgba(43,34,25,.14)'; g.lineWidth = 1.2;
  for (let i = U; i < w; i += U) { g.beginPath(); g.moveTo(x + i, y); g.lineTo(x + i, y + h); g.stroke(); }
  for (let i = U; i < h; i += U) { g.beginPath(); g.moveTo(x, y + i); g.lineTo(x + w, y + i); g.stroke(); }
  g.strokeStyle = 'rgba(43,34,25,.35)'; g.lineWidth = 2;
  for (let i = 5 * U; i < w; i += 5 * U) { g.beginPath(); g.moveTo(x + i, y); g.lineTo(x + i, y + h); g.stroke(); }
  for (let i = 5 * U; i < h; i += 5 * U) { g.beginPath(); g.moveTo(x, y + i); g.lineTo(x + w, y + i); g.stroke(); }
  g.restore(); g.save(); g.lineWidth = 5; g.strokeStyle = C.ink; g.strokeRect(x, y, w, h); g.restore();
}
function whyCard(g, t) {
  const [x, y] = P.why; card(g, PAT.why, x, y, 1, t, T.toWhy + .4);
  onCard(g, x, y, 1, t, T.toWhy + .4, () => {
    pill(g, 'w-pill', 'KENAPA BISA?', 0, -400, 44);
    if (t < T.sq) return;
    const k = popIn(t, T.sq, .3); g.save(); g.scale(k, k);
    const X0 = -300, Y0 = -310, B = 30 * U, S = 5 * U;   // 450, 75
    const e = 20 * EASE.io(clamp((t - T.cut) / .5, 0, 1)) * (1 - EASE.io(clamp((t - T.join) / .4, 0, 1)));
    const mv = EASE.io(clamp((t - T.move) / 1.2, 0, 1)), cm = EASE.io(clamp((t - T.move - .5) / .8, 0, 1));
    gridRect(g, X0, Y0, B, B, '#F6E7B0');                                  // 30 × 30
    gridRect(g, X0 + B + e, Y0, S, B, '#CFE3F5');                           // right strip 5 × 30
    { const c0 = [X0 + B / 2, Y0 + B + e + S / 2], c1 = [X0 + B + S + 2 * e + S / 2, Y0 + B / 2];   // bottom strip: turns and slides to the right
      const ccx = lerp(c0[0], c1[0], mv), ccy = lerp(c0[1], c1[1], mv) - Math.sin(Math.PI * mv) * 120;
      g.save(); g.translate(ccx, ccy); g.rotate(mv * Math.PI / 2); gridRect(g, -B / 2, -S / 2, B, S, '#CFE3F5'); g.restore(); }
    { const p0 = [X0 + B + e, Y0 + B + e], p1 = [X0 + B + S, Y0 + B + 40];   // the 5 × 5 corner steps aside
      gridRect(g, lerp(p0[0], p1[0], cm), lerp(p0[1], p1[1], cm), S, S, '#F7C9C0');
      if (t > T.c25) popRich(g, 'w-25', [['25', RED]], lerp(p0[0], p1[0], cm) + S / 2, lerp(p0[1], p1[1], cm) + S / 2 + 16, 46, t, T.c25); }
    // sizes along the edges
    if (t < T.move) { g.save(); g.globalAlpha = clamp((t - T.sq - .4) / .3, 0, 1);
      rich(g, 'w-d30t', [['30', C.ink]], X0 + B / 2, Y0 - 18, 40); rich(g, 'w-d5t', [['5', C.ink]], X0 + B + e + S / 2, Y0 - 18, 40);
      rich(g, 'w-d30l', [['30', C.ink]], X0 - 40, Y0 + B / 2 + 14, 40); rich(g, 'w-d5l', [['5', C.ink]], X0 - 30, Y0 + B + e + S / 2 + 14, 40); g.restore(); }
    if (t > T.lbl && t < T.move) { g.save(); g.globalAlpha = clamp((t - T.lbl) / .3, 0, 1); rich(g, 'w-l30', [['30 × 30', '#7B6A57']], X0 + B / 2, Y0 + B / 2 + 14, 44); g.restore(); }
    if (t > T.join) { const u = clamp((t - T.join) / .3, 0, 1); g.save(); g.globalAlpha = u; g.strokeStyle = RED; g.lineWidth = 7; g.setLineDash([16, 10]); g.strokeRect(X0 - 8, Y0 - 8, B + 2 * S + 16, B + 16); g.restore();
      rich(g, 'w-d40', [['40', RED]], X0 + (B + 2 * S) / 2, Y0 - 22, 44); rich(g, 'w-d30', [['30', RED]], X0 - 42, Y0 + B / 2 + 14, 44); }
    if (t > T.r1200) { const kk = popIn(t, T.r1200, .25); g.save(); g.translate(X0 + (B + 2 * S) / 2, Y0 + B / 2); g.scale(kk, kk);
      g.fillStyle = 'rgba(251,243,223,.92)'; g.beginPath(); g.roundRect(-210, -62, 420, 100, 18); g.fill(); g.lineWidth = 4; g.strokeStyle = C.ink; g.stroke();
      rich(g, 'w-1200', [['30 × 40 = ', C.ink], ['1200', YEL]], 0, 12, 58); g.restore(); }
    g.restore();
    if (t > T.why3) popRich(g, 'w-3', [['3 × 4 = 12', COLA], ['  →  ', C.ink], ['1200', YEL]], 0, 300, 52, t, T.why3);
    if (t > T.why4) popRich(g, 'w-4', [['1200 + ', C.ink], ['25', RED], [' = ', C.ink], ['1225', GRN]], 0, 375, 58, t, T.why4);
  });
}
// ---------------------------------------------------------------- challenge and CTA
function bonusCard(g, t) {
  const [x, y] = P.bonus; card(g, PAT.bonus, x, y, -1.5, t, T.bonus - .2);
  onCard(g, x, y, -1.5, t, T.bonus - .2, () => {
    pill(g, 'b-pill', 'TANTANGAN', 0, -300, 44, RED);
    rich(g, 'b-1', [['95²', YEL], [' = ', C.ink], ['?', RED]], 0, -60, 160);
    rich(g, 'b-2', [['maksimal ', C.ink], ['2 detik', RED]], 70, 95, 62);
    stopwatch(g, -250, 75, 62, ((t - T.bonus) % 2.6), null);
    rich(g, 'b-3', [['jawab di komentar ↓', C.ink]], 0, 235, 52);
  });
}
function ctaCard(g, t) {
  const [x, y] = P.cta; card(g, PAT.cta, x, y, 1.2, t, T.cta);
  onCard(g, x, y, 1.2, t, T.cta, () => {
    pill(g, 'c-pill', 'KOMENTAR', 0, -200, 44, '#2D5F8A');
    rich(g, 'c-1', [['Mau trik', C.ink]], 0, -75, 76);
    rich(g, 'c-2', [['apa ', C.ink], ['lagi?', RED]], 0, 20, 76);
    rich(g, 'c-3', [['tulis di komentar ↓', C.ink]], 0, 130, 54);
  });
}
function nameTag(g, id, text, x, y, col) {
  g.save(); g.font = '40px Lilita'; const w = g.measureText(text).width + 36; g.translate(x, y);
  g.fillStyle = col; g.beginPath(); g.roundRect(-w / 2, -26, w, 52, 26); g.fill(); g.lineWidth = 4; g.strokeStyle = C.ink; g.stroke();
  g.fillStyle = '#FBF3DF'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 0, 3);
  noteText(g, 'tag-' + id, text, -w / 2, -26, w / 2, 26); TXT[TXT.length - 1].pass = true; g.restore();
}
const CAP_BOTTOM = 1480, WM_Y = 1530;
function watermark(g, t) {
  const a = clamp((t - T.pull0 + .3) / .6, 0, 1); if (a <= 0) return;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = .4 * a; g.font = '40px Lilita'; g.letterSpacing = '10px'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineJoin = 'round'; g.lineWidth = 7; g.strokeStyle = '#FBF3DF'; g.strokeText('HAWREIREI', W / 2 + 5, WM_Y); g.fillStyle = C.ink; g.fillText('HAWREIREI', W / 2 + 5, WM_Y);
  g.letterSpacing = '0px'; noteText(g, 'wm', 'HAWREIREI', W / 2 - 180, WM_Y - 24, W / 2 + 190, WM_Y + 24); TXT[TXT.length - 1].pass = true; g.restore();
}


// ---------------------------------------------------------------- the host walks with the camera (screen x ~95, same screen size at every zoom)
const hostAtPlace = k => { const [cx, cy, z] = k === 'home' ? [540, 2000, 1] : CAMP[k]; return [cx - 445 / z, cy + 340 / z, .72 * .85 / z]; };
const HOME = [870, 2330, 1];
const HOSTK = [[0, ...HOME], [T.toLomba, ...HOME], [T.toLomba + .9, ...hostAtPlace('lomba')],
  [T.toR1, ...hostAtPlace('lomba')], [T.toR1 + .9, ...hostAtPlace('r1')], [T.toR2, ...hostAtPlace('r1')], [T.toR2 + .8, ...hostAtPlace('r2')],
  [T.toTrap, ...hostAtPlace('r2')], [T.toTrap + .9, ...hostAtPlace('trap')], [T.toWhy, ...hostAtPlace('trap')], [T.toWhy + 1.0, ...hostAtPlace('why')],
  [T.toFlex, ...hostAtPlace('why')], [T.toFlex + .9, ...hostAtPlace('flex')], [T.toBack, ...hostAtPlace('flex')], [T.toBack + 1.4, ...hostAtPlace('lomba')],
  [T.toBonus, ...hostAtPlace('lomba')], [T.toBonus + 1.0, ...hostAtPlace('bonus')], [T.cta - .5, ...hostAtPlace('bonus')], [T.cta + .4, ...hostAtPlace('cta')], [DUR, ...hostAtPlace('cta')]];
function hostAt(t) {
  let i = 1; while (i < HOSTK.length - 1 && t > HOSTK[i][0]) i++;
  const a = HOSTK[i - 1], b = HOSTK[i], u = EASE.io(clamp((t - a[0]) / (b[0] - a[0]), 0, 1)), k = lerp(a[3], b[3], u);
  return [lerp(a[1], b[1], u), lerp(a[2], b[2], u) - (u > 0 && u < 1 && (a[1] !== b[1] || a[2] !== b[2]) ? Math.sin(Math.PI * u) * 260 * k : 0), k];
}
function hostPoseName(t) {
  if (t < 2.0) return 'think';                            // "35 kuadrat."
  if (t < T.pull0) return 'pointyou';                     // "Bisa jawab dalam dua detik?"
  if (t < T.aniHand) return 'confused';                   // Budi scribbles
  if (t < T.toR1) return 'cheer';                         // Ani: 1225!
  if (t < T.r1Ha) return 'idea';                          // "Rahasianya begini."
  if (t < T.r1FlipB) return 'pointer';
  if (t < T.toR2) return 'thumbs';
  if (t < T.r2Res) return 'present';
  if (t < T.toTrap) return 'clap';
  if (t < T.wrong) return 'think';                        // "hati-hati"
  if (t < T.fix) return 'wrong';
  if (t < T.toWhy) return 'pointer';
  if (t < T.sq) return 'think';                           // "Kenapa bisa?"
  if (t < T.move) return 'present';
  if (t < T.r1200) return 'pointer';
  if (t < T.why3) return 'thumbs';
  if (t < T.toFlex) return 'idea';
  if (t < T.fxRes) return 'present';
  if (t < T.toBack) return 'armsup';
  if (t < T.toBonus) return 'cheer';                      // Ani wins
  if (t < T.cta - .5) return 'pointyou';
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
  if (near(v, 'lomba')) lombaScene(g, tq, cam);
  if (near(v, 'r1')) trickRow(g, 'r1', tq, P.r1, { head: T.r1Head, head_txt: '35^{2}', a: '3', prod: '12', ha: T.r1Ha, mul: T.r1Mul, mulTxt: '3 × 4', mulEq: '3 × 4 = 12', eq: T.r1Eq, flipA: T.r1FlipA, flipB: T.r1FlipB, res: T.r1Res, res_txt: '35² = 1225' });
  if (near(v, 'r2')) trickRow(g, 'r2', tq, P.r2, { head: T.r2Head, head_txt: '65^{2}', a: '6', prod: '42', mul: T.r2Mul, mulTxt: '6 × 7', mulEq: '6 × 7 = 42', eq: T.r2Eq, flipA: T.r2FlipA, flipB: T.r2FlipB, res: T.r2Res, res_txt: '65² = 4225' });
  if (near(v, 'trap')) trickRow(g, 'tp', tq, P.trap, { head: T.tpHead, head_txt: '35^{2}', a: '3', prod: '9', wrongProd: true, mul: T.tpMul, mulTxt: '3 × 3', mulEq: '3 × 3 = 9', eq: T.tpMul + .5, flipA: T.tpFlipA, flipB: T.tpFlipB, wrong: T.wrong, fix: T.fix });
  if (near(v, 'why')) whyCard(g, tq);
  if (near(v, 'flex')) trickRow(g, 'fx', tq, P.flex, { head: T.fxHead, head_txt: '105^{2}', a: '10', prod: '110', mul: T.fxMul, mulTxt: '10 × 11', mulEq: '10 × 11 = 110', eq: T.fxEq, flipA: T.fxFlipA, flipB: T.fxFlipB, res: T.fxRes, res_txt: '105² = 11025' });
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
  g.drawImage(im, -w / 2, -h, w, h); g.restore();
}

function caption(t) {
  const i = CAPS.findIndex(([a, b]) => t >= a && t < b); if (i < 0 || t < T.pull0 || CAPS[i][0] < T.pull0 - .05) return;   // the hook card is the opening caption
  const [a, b, tx] = CAPS[i], g = MAIN, size = 56, fam = 'Fell';
  const wOf = s => mWidth(g, mParse(s), size, fam);
  let lines = [tx];
  if (wOf(tx) > 900) { const ws = tx.split(' '); let best = null; for (let k = 1; k < ws.length; k++) { const A = ws.slice(0, k).join(' '), B = ws.slice(k).join(' '), m = Math.max(wOf(A), wOf(B)); if (!best || m < best.m) best = { m, L: [A, B] }; } lines = best.L; }
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
  [[0, 'intro'], [T.toLomba, 'go'], [T.toR1, 'run'], [T.toTrap, 'meet'], [T.toWhy, 'tree'], [T.toBack, 'answer'], [T.bonus, 'bonus'], [T.cta, 'cta'], [T.out, 'end']].forEach(([t, name]) => E(t, 'sec', { name }));
  E(0, 'room', { d: DUR }); if (ALIGN) E(VO_OFF, 'vo', { id: 'full' });
  const move = (t0, d = 1.0, pan = 0) => { E(t0, 'swish', { d, pan }); E(t0 + .1, 'hop', { pan }); };
  for (let i = 0; i < 4; i++) E(.4 + i * .5, 'tick', { pan: -.3 });
  move(T.toLomba, .9, .3); E(T.toLomba + .4, 'slap'); E(T.toLomba + .5, 'slapS'); E(T.scribble, 'scribble', { d: 2.8, pan: -.3 });
  for (let i = 0; i < 3; i++) E(T.aniAns - 2 + i * .7, 'tick', { pan: .4 }); E(T.aniHand, 'pop', { pan: .3 }); E(T.aniAns, 'slapS', { pan: .3 }); E(T.aniAns + .1, 'chime');
  const row = (head, mul, fa, fb, res, pan) => { E(head, 'slapS', { pan }); E(head + .2, 'pop', { pan: pan - .2 }); E(head + .3, 'pop', { pan: pan + .2 }); E(mul, 'slapS', { pan });
    E(fa - .1, 'swish', { d: .25, pan: pan - .2 }); E(fb - .1, 'swish', { d: .25, pan: pan + .2 }); if (res) { E(res, 'stamp', { pan }); E(res + .1, 'chime'); } };
  move(T.toR1, .9, -.3); E(T.r1Ha, 'tick'); row(T.r1Head, T.r1Mul, T.r1FlipA, T.r1FlipB, T.r1Res, 0);
  move(T.toR2, .8, 0); row(T.r2Head, T.r2Mul, T.r2FlipA, T.r2FlipB, T.r2Res, 0);
  move(T.toTrap, .9, .3); row(T.tpHead, T.tpMul, T.tpFlipA, T.tpFlipB, null, .2); E(T.wrong - .3, 'swish', { d: .3 }); E(T.wrong, 'stamp'); E(T.fix, 'slapS');
  move(T.toWhy, 1.0, -.3); E(T.toWhy + .4, 'slap'); E(T.sq, 'pop'); E(T.cut, 'tick', { pan: -.2 }); E(T.cut + .15, 'tick', { pan: .2 }); E(T.cut + .3, 'tick');
  E(T.move, 'swish', { d: 1.2 }); E(T.move + 1.2, 'dep', { key: 'A', m: 7 }); E(T.join, 'slapS'); E(T.r1200, 'pop'); E(T.c25, 'pop', { pan: .3 }); E(T.why3, 'slapS'); E(T.why4, 'slapS'); E(T.why4 + .1, 'chime');
  move(T.toFlex, .9, .3); row(T.fxHead, T.fxMul, T.fxFlipA, T.fxFlipB, T.fxRes, 0);
  E(T.toBack, 'swish', { d: 1.4 }); E(T.toBack + .1, 'hop'); E(T.win, 'pop', { pan: .2 }); E(T.win + .05, 'chime');
  move(T.toBonus, 1.0, -.3); E(T.bonus, 'slap'); for (let i = 0; i < 4; i++) E(T.bonus + .5 + i * .5, 'tick', { pan: -.3 });
  E(T.cta - .5, 'swish', { d: .8 }); E(T.cta - .4, 'hop', { pan: .3 }); E(T.cta + .2, 'slap');
  E(T.out, 'pageout', { d: 2.0 });
  return ev.sort((a, b) => a.t - b.t);
}

// ---------------------------------------------------------------- boot
async function boot() {
  await Promise.all([document.fonts.load('92px Lilita', 'TRIK 0123456789 ×→…²?!'), document.fonts.load('40px Fell', 'Angka'), document.fonts.load('62px OldStdB', '0123456789±–×=°/−+…?'),
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
window.__MOVING = t => { const a = camAt(t), b = camAt(t - .15); return Math.abs(a.f[0] - b.f[0]) + Math.abs(a.f[1] - b.f[1]) > 2 || Math.abs(a.z - b.z) > .005; };
