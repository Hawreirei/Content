// HAWREIREI — Trik 2 Detik #1: kali 11. 9:16, one continuous paper world (see hawreirei-style/STYLE.md).
// Number cards split, the digit sum drops into the gap (43 × 11 → 4|7|3), a column board shows why (430 + 43),
// then the carry case 87 × 11 (8+7 = 15: the 5 stays, the 1 climbs onto the 8 → 957). Challenge 68 × 11 (= 748, pinned later).
const DUR = 61.5;
window.DUR = DUR;
const T = {   // film seconds, set from vo/el/align.json (voice segment + VO_OFF 0.3)
  pull0: 3.8, toTrick: 3.9,
  r1Head: 4.6, r1Split: 5.5, r1Ha: 6.84, r1Hb: 7.6, r1Sum: 9.45, r1Drop: 12.1, r1Res: 12.65,
  toEx2: 14.3, r2Head: 15.7, r2Split: 17.4, r2Sum: 17.6, r2Drop: 18.85, r2Res: 19.6,
  toWhy: 21.2, eq: 23.5, row1: 27.0, row2: 28.9, mid: 30.5, sum: 31.55, that: 33.0,
  toCare: 34.9, cHead: 36.5, cSplit: 38.3, cDrop: 39.9, wrong: 40.8, fix: 43.3, hop: 44.4, plus: 45.6, nine: 46.85, cRes: 48.3,
  toBonus: 49.8, bonus: 50.6, cta: 55.5, out: 57.9, end: 60.3,
};
let VO_OFF = 0.3;
const SAY = {
  v01: { p: ['43 × 11. Bisa jawab dalam 2 detik?'] },
  v02: { p: ['Caranya begini.', 'Pisahkan dua angkanya: 4… dan 3.'], s: [1] },
  v03: { p: ['Jumlahkan: 4 + 3, 7.', 'Selipkan di tengah… 473!'], s: [3] },
  v04: { p: ['Coba sekali lagi. 52 × 11:', '5 + 2, 7. 572!'], s: [2] },
  v05: { p: ['Kenapa bisa? Karena 11 itu 10 + 1.', '43 × 10, 430. Ditambah 43.'], s: [2] },
  v06: { p: ['Lihat kolom tengahnya: 3 + 4.', 'Itulah 7 yang tadi kita selipkan.'], s: [2] },
  v07: { p: ['Tapi hati-hati.', '87 × 11: 8 + 7, 15.'], s: [1] },
  v08: { p: ['Jangan ditulis 8, 15, 7.', '5 di tengah, satunya naik ke depan: 8 + 1, 9.', 'Jadi, 957!'], s: [1, 3] },
  v09: { p: ['Sekarang giliranmu. 68 × 11.', 'Jawab di komentar, maksimal 2 detik!'], s: [2] },
  v10: { p: ['Mau trik apa lagi? Tulis di komentar, ya!'] },
  v11: { p: ['Sampai jumpa di trik berikutnya!'] },
};
const DRAFT = {
  v01: [.3, 4.1, []], v02: [4.5, 8.6, [6.0]], v03: [8.9, 14.9, [11.7]], v04: [15.3, 21.8, [17.4]], v05: [22.2, 30.7, [25.6]],
  v06: [31.1, 36.3, [34.2]], v07: [36.7, 41.9, [38.0]], v08: [42.3, 51.8, [45.2, 50.0]], v09: [52.2, 57.7, [55.0]],
  v10: [58.1, 60.6, []], v11: [61.0, 62.8, []],
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
const SHEET = { x0: -140, y0: -140, x1: 2400, y1: 4500 };
const YEL = '#F2B632', COLA = '#E2A93B', COLB = '#4F86B5', COLC = '#5E9A5A', RED = '#C8463A';
const ROW1 = [1700, 900], ROW2 = [1700, 1500], WHY = [1700, 2500], CARE = [540, 2420], BONUS = [540, 3380], CTA = [1700, 3380];
const PAT = {};

// ---------------------------------------------------------------- camera
const CAM = [
  [0, 540, 960, 1.0], [T.pull0, 540, 960, 1.0], [T.toTrick + 1.0, 1700, 960, 1.4, 'io'], [T.toEx2, 1700, 960, 1.4], [T.toEx2 + .8, 1700, 1560, 1.4, 'io'],
  [T.toWhy, 1700, 1560, 1.4], [T.toWhy + .9, WHY[0], WHY[1] + 40, .9, 'io'], [T.toCare, WHY[0], WHY[1] + 40, .9], [T.toCare + .9, CARE[0], CARE[1] + 60, 1.4, 'io'],
  [T.toBonus, CARE[0], CARE[1] + 60, 1.4], [T.toBonus + .8, BONUS[0], BONUS[1] + 30, .9, 'io'], [T.cta - .5, BONUS[0], BONUS[1] + 30, .9],
  [T.cta + .3, CTA[0], CTA[1] + 30, .9, 'io'], [T.out, CTA[0], CTA[1] + 30, .9], [T.end, 1130, 2180, .4, 'io'], [DUR, 1130, 2180, .39, 'lin'],
];
function camAt(t) {
  let i = 1; while (i < CAM.length - 1 && t > CAM[i][0]) i++;
  const a = CAM[i - 1], b = CAM[i], u = EASE[b[4] || 'io'](clamp((t - a[0]) / (b[0] - a[0]), 0, 1));
  const f = [lerp(a[1], b[1], u), lerp(a[2], b[2], u)], z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), u));
  let sx = 0, sy = 0, sr = 0;
  for (const [t0, am] of [[T.r1Res, 6], [T.r2Res, 4], [T.wrong, 7], [T.cRes, 8], [T.r1Drop + .35, 3], [T.r2Drop + .35, 3], [T.cDrop + .35, 3]]) { const s = shake(t, t0, am); sx += s[0]; sy += s[1]; sr += s[2]; }
  return { z, f, sx, sy, sr };
}
function viewOf(cam) { const hw = W / 2 / cam.z, hh = H / 2 / cam.z; return { x0: cam.f[0] - hw, x1: cam.f[0] + hw, y0: cam.f[1] - hh, y1: cam.f[1] + hh }; }

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
  g.save(); g.font = `${size}px Lilita`; g.textBaseline = 'alphabetic';
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



// ---------------------------------------------------------------- number cards, stopwatch
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
function stopwatch(g, x, y, r, secs, label) {
  g.save(); g.translate(x, y);
  g.shadowColor = 'rgba(30,20,10,.35)'; g.shadowBlur = 10; g.shadowOffsetX = 6; g.shadowOffsetY = 9;
  g.fillStyle = '#5E5A55'; g.fillRect(-r * .16, -r * 1.28, r * .32, r * .22); g.beginPath(); g.arc(0, 0, r, 0, 7); g.fillStyle = '#FBF3DF'; g.fill(); g.shadowColor = 'transparent';
  g.lineWidth = r * .1; g.strokeStyle = C.ink; g.stroke(); g.fillStyle = C.ink; g.fillRect(-r * .2, -r * 1.36, r * .4, r * .12);
  for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2 - Math.PI / 2; g.lineWidth = r * .045; g.beginPath(); g.moveTo(Math.cos(a) * r * .72, Math.sin(a) * r * .72); g.lineTo(Math.cos(a) * r * .86, Math.sin(a) * r * .86); g.stroke(); }
  const s = Math.min(secs, 2); g.fillStyle = 'rgba(200,70,58,.25)'; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r * .68, -Math.PI / 2, -Math.PI / 2 + s / 10 * Math.PI * 2); g.closePath(); g.fill();
  const a = -Math.PI / 2 + secs / 10 * Math.PI * 2; g.strokeStyle = RED; g.lineWidth = r * .07; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * r * .74, Math.sin(a) * r * .74); g.stroke();
  g.fillStyle = C.ink; g.beginPath(); g.arc(0, 0, r * .09, 0, 7); g.fill();
  if (label) { g.font = `${r * .42}px Lilita`; g.textAlign = 'center'; g.fillStyle = C.ink; g.fillText(label, 0, r * 1.5); noteText(g, 'sw-' + label, label, -r, r * 1.15, r, r * 1.6); TXT[TXT.length - 1].pass = true; }
  g.restore();
}
// one "a b × 11" row: the two cards split, the sum drops in; o.carry = the 87 case
function trickRow(g, id, t, [x, y], o) {
  if (t < o.head - .3) return;
  mathSlip(g, id + '-h', o.head_txt, x, y - 300, -2, t, o.head, { size: 56, dy: 60 });
  if (o.warn && t > o.warn) { const k = popIn(t, o.warn, .25); g.save(); g.translate(x, y - 405); g.rotate(-3 * D2R); g.scale(k, k); pill(g, id + '-w', 'HATI-HATI!', 0, 0, 46, RED); g.restore(); }
  const sp = EASE.io(clamp((t - o.split) / .45, 0, 1)), gap = lerp(80, o.carry ? 205 : 170, sp);
  const pulse = (t0) => t > t0 && t < t0 + .6 ? Math.sin(Math.PI * (t - t0) / .6) : 0;
  // the left card (becomes 9 in the carry case)
  let aTxt = o.a, aFlip = 1, aGlow = pulse(o.ha ?? -9);
  if (o.carry && t > o.nine - .12) { const u = clamp((t - o.nine + .12) / .24, 0, 1); aFlip = Math.abs(Math.cos(Math.PI * u)); if (u > .5) aTxt = String(+o.a + 1); }
  if (o.carry && t > o.nine && t < o.nine + .7) aGlow = Math.max(aGlow, Math.sin(Math.PI * (t - o.nine) / .7));
  tile(g, id + '-a', aTxt, x - gap, y, { col: o.carry && t > o.nine ? YEL : C.ink, flip: Math.max(.04, aFlip), glow: aGlow });
  tile(g, id + '-b', o.b, x + gap, y, { glow: pulse(o.hb ?? -9) });
  if (t > o.sum) { g.save(); if (o.carry) g.globalAlpha = fade(t, o.plus - .2, .3); mathSlip(g, id + '-s', o.sum_txt, x, y - 175, 2, t, o.sum, { size: 44, bg: '#FBEFC9', dy: 50 }); g.restore(); }
  if (o.carry && t > o.plus) mathSlip(g, id + '-s9', String(o.a) + ' + 1 = ' + String(+o.a + 1), x - gap + 40, y - 175, -2, t, o.plus, { size: 44, bg: '#FBEFC9', dy: 50 });
  // the middle card drops into the gap
  if (t > o.drop - .35) {
    const u = clamp((t - o.drop + .35) / .35, 0, 1), e = EASE.i(u), land = u >= 1 ? wob(t - o.drop, .01, .06, 6, 12) : 0;
    if (!o.carry || t < o.fix) tile(g, id + '-m', o.mid, x, lerp(y - 420, y, e), { col: YEL, w: o.mid.length > 1 ? 210 : 150, lift: 1 - e, k: 1 + land });
    else {   // 15 → the 5 stays, the 1 climbs onto the left card
      tile(g, id + '-m5', o.mid[1], x, y, { col: YEL, k: 1 + wob(t - o.fix, .01, .05, 6, 12) });
      if (t < o.nine) {
        const v = clamp((t - o.hop) / .7, 0, 1), ev = EASE.io(v), hx = lerp(x - 30, x - gap, ev), hy = lerp(y - 60, y - 40, ev) - Math.sin(Math.PI * v) * 110 - (t < o.hop ? (t - o.fix) / (o.hop - o.fix) * 60 : 60 * (1 - v));
        tile(g, id + '-m1', o.mid[0], hx, hy, { col: RED, k: .62, lift: .6, rot: -8 * Math.sin(Math.PI * v) });
      }
    }
  }
  if (o.wrong && t > o.wrong - .3) { g.save(); g.globalAlpha = fade(t, o.fix - .2); stampWord(g, x, y + 10, -8, t, o.wrong, 'SALAH!', 66); g.restore(); }
  stampWord(g, x, y + 205, -4, t, o.res, o.res_txt, 64, '#2D7A3E');
}
function hookCard(g, t) {   // fully there on frame 1 (the thumbnail)
  drawCard(g, PAT.hook, { c: [540, 560], rot: -1.2, h: 0 });
  g.save(); g.translate(540, 560); g.rotate(-1.2 * D2R);
  pill(g, 'h-pill', 'TRIK 2 DETIK', 0, -285, 44, RED);
  rich(g, 'h-1', [['43', YEL], [' × ', C.ink], ['11', YEL], [' = ', C.ink], ['?', RED]], 0, -45, 160);
  rich(g, 'h-2', [['tanpa kalkulator', C.ink]], 0, 105, 60);
  rich(g, 'h-3', [['bisa dalam ', C.ink], ['2 detik?', RED]], 0, 215, 66);
  g.restore();
  stopwatch(g, 300, 1135, 125, (t % 2.6), null);
}
function whyCard(g, t) {
  const [x, y] = WHY; card(g, PAT.why, x, y, 1, t, T.toWhy + .4);
  onCard(g, x, y, 1, t, T.toWhy + .4, () => {
    pill(g, 'w-pill', 'KENAPA BISA?', 0, -385, 44);
    if (t > T.eq) { const k = popIn(t, T.eq, .22); g.save(); g.translate(0, -275); g.scale(k, k); rich(g, 'w-eq', [['11', YEL], [' = ', C.ink], ['10', YEL], [' + ', C.ink], ['1', YEL]], 0, 22, 70); g.restore(); }
    const X = [40, 190, 340], dg = (id, s, cx, cy, t0, col = C.ink) => { const k = popIn(t, t0, .2); if (k <= 0) return; g.save(); g.translate(cx, cy); g.scale(k, k); rich(g, id, [[s, col]], 0, 40, 118); g.restore(); };
    if (t > T.row1 - 1.2) { g.save(); g.globalAlpha = .55; g.font = '36px Lilita'; g.textAlign = 'center'; g.fillStyle = C.ink; ['ratus', 'puluh', 'satu'].forEach((s, i) => { g.fillText(s, X[i], -160); noteText(g, 'col' + i, s, X[i] - 50, -185, X[i] + 50, -150); TXT[TXT.length - 1].pass = true; }); g.restore(); }
    if (t > T.row1 - 1.2) rich(g, 'w-l1', [['43 × 10', '#2D5F8A']], -110, -52, 58, 'right');
    dg('w-11', '4', X[0], -70, T.row1); dg('w-12', '3', X[1], -70, T.row1 + .12); dg('w-13', '0', X[2], -70, T.row1 + .24);
    if (t > T.row2 - .8) rich(g, 'w-l2', [['43 × 1', '#2D5F8A']], -110, 78, 58, 'right');
    if (t > T.row2) rich(g, 'w-plus', [['+', C.ink]], -55, 80, 70);
    dg('w-22', '4', X[1], 60, T.row2); dg('w-23', '3', X[2], 60, T.row2 + .12);
    if (t > T.mid) {   // the middle column lights up
      const u = clamp((t - T.mid) / .35, 0, 1), p = .6 + .4 * Math.sin((t - T.mid) * 6);
      g.save(); g.strokeStyle = RED; g.lineWidth = 7; g.globalAlpha = u * p; g.setLineDash([18, 10]); g.beginPath(); g.roundRect(X[1] - 72, -150, 144, 410, 26); g.stroke(); g.restore();
    }
    if (t > T.sum - .2) { g.save(); g.strokeStyle = C.ink; g.lineWidth = 6; g.lineCap = 'round'; const u = clamp((t - T.sum + .2) / .3, 0, 1); g.beginPath(); g.moveTo(-40, 120); g.lineTo(lerp(-40, 420, u), 120); g.stroke(); g.restore(); }
    dg('w-31', '4', X[0], 195, T.sum); dg('w-32', '7', X[1], 195, T.sum + .15, YEL); dg('w-33', '3', X[2], 195, T.sum + .3);
    if (t > T.that) { const k = popIn(t, T.that, .22); g.save(); g.translate(0, 340); g.scale(k, k); rich(g, 'w-that', [['3 + 4 = ', C.ink], ['7', YEL], [' → yang diselipkan!', C.ink]], 0, 18, 54); g.restore(); }
  });
}
function bonusCard(g, t) {
  const [x, y] = BONUS; card(g, PAT.bonus, x, y, -1.5, t, T.bonus - .2);
  onCard(g, x, y, -1.5, t, T.bonus - .2, () => {
    pill(g, 'b-pill', 'TANTANGAN', 0, -300, 44, RED);
    rich(g, 'b-1', [['68', YEL], [' × ', C.ink], ['11', YEL], [' = ', C.ink], ['?', RED]], 0, -80, 150);
    rich(g, 'b-2', [['maksimal ', C.ink], ['2 detik', RED]], 70, 70, 62);
    stopwatch(g, -250, 50, 62, ((t - T.bonus) % 2.6), null);
    rich(g, 'b-3', [['jawab di komentar ↓', C.ink]], 0, 215, 52);
  });
}
function ctaCard(g, t) {
  const [x, y] = CTA; card(g, PAT.cta, x, y, 1.2, t, T.cta);
  onCard(g, x, y, 1.2, t, T.cta, () => {
    pill(g, 'c-pill', 'KOMENTAR', 0, -200, 44, '#2D5F8A');
    rich(g, 'c-1', [['Mau trik', C.ink]], 0, -75, 76);
    rich(g, 'c-2', [['apa ', C.ink], ['lagi?', RED]], 0, 20, 76);
    rich(g, 'c-3', [['tulis di komentar ↓', C.ink]], 0, 130, 54);
  });
}

const CAP_BOTTOM = 1480, WM_Y = 1530;
function watermark(g, t) {
  const a = clamp((t - T.pull0 + .3) / .6, 0, 1); if (a <= 0) return;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = .4 * a; g.font = '40px Lilita'; g.letterSpacing = '10px'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineJoin = 'round'; g.lineWidth = 7; g.strokeStyle = '#FBF3DF'; g.strokeText('HAWREIREI', W / 2 + 5, WM_Y); g.fillStyle = C.ink; g.fillText('HAWREIREI', W / 2 + 5, WM_Y);
  g.letterSpacing = '0px'; noteText(g, 'wm', 'HAWREIREI', W / 2 - 180, WM_Y - 24, W / 2 + 190, WM_Y + 24); TXT[TXT.length - 1].pass = true; g.restore();
}



// ---------------------------------------------------------------- the host (creator's stickers): [t, feet x, feet y, scale]
const HOSTK = [[0, 850, 1300, 1], [T.pull0, 850, 1300, 1], [T.toTrick + 1.0, 1386, 1203, .65], [T.toEx2, 1386, 1203, .65], [T.toEx2 + .8, 1386, 1803, .65],
  [T.toWhy, 1386, 1803, .65], [T.toWhy + .9, 1215, 2915, .8], [T.toCare, 1215, 2915, .8], [T.toCare + .9, 226, 2723, .65], [T.toBonus, 226, 2723, .65],
  [T.toBonus + .8, 95, 3740, .8], [T.cta - .5, 95, 3740, .8], [T.cta + .4, 1215, 3740, .8], [DUR, 1215, 3740, .8]];
function hostAt(t) {
  let i = 1; while (i < HOSTK.length - 1 && t > HOSTK[i][0]) i++;
  const a = HOSTK[i - 1], b = HOSTK[i], u = EASE.io(clamp((t - a[0]) / (b[0] - a[0]), 0, 1)), k = lerp(a[3], b[3], u);
  return [lerp(a[1], b[1], u), lerp(a[2], b[2], u) - (u > 0 && u < 1 && (a[1] !== b[1] || a[2] !== b[2]) ? Math.sin(Math.PI * u) * 260 * k : 0), k];
}
function hostPoseName(t) {
  if (t < T.pull0) return 'think';                      // "Bisa jawab dalam dua detik?"
  if (t < T.toTrick + 1.0) return 'armsup';
  if (t < T.r1Split) return 'idea';                     // "Caranya begini."
  if (t < T.r1Sum) return 'pointer';
  if (t < T.r1Res) return 'think';
  if (t < T.toEx2) return 'cheer';                      // "473!"
  if (t < T.r2Res) return 'thumbs';
  if (t < T.toWhy) return 'clap';
  if (t < T.row1) return 'think';                       // "Kenapa bisa?"
  if (t < T.mid) return 'pointer';
  if (t < T.that) return 'idea';
  if (t < T.toCare) return 'present';                   // "Itulah tujuh yang tadi kita selipkan."
  if (t < T.wrong) return 'pointyou';                   // "Tapi hati-hati."
  if (t < T.fix) return 'wrong';                        // "Jangan ditulis 8, 15, 7."
  if (t < T.cRes) return 'idea';
  if (t < T.toBonus) return 'cheer';                    // "957!"
  if (t < T.cta - .5) return 'crossed';
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
  if (v.y0 < 1300 && v.x0 < 1100) hookCard(g, t);
  if (v.x1 > 1300 && v.y0 < 1800) { trickRow(g, 'r1', tq, ROW1, { head: T.r1Head, head_txt: '43 × 11 =', a: '4', b: '3', mid: '7', split: T.r1Split, ha: T.r1Ha, hb: T.r1Hb, sum: T.r1Sum, sum_txt: '4 + 3 = 7', drop: T.r1Drop, res: T.r1Res, res_txt: '473' });
    trickRow(g, 'r2', tq, ROW2, { head: T.r2Head, head_txt: '52 × 11 =', a: '5', b: '2', mid: '7', split: T.r2Split, sum: T.r2Sum, sum_txt: '5 + 2 = 7', drop: T.r2Drop, res: T.r2Res, res_txt: '572' }); }
  if (v.y1 > 1900 && v.x1 > 1200) whyCard(g, tq);
  if (v.y1 > 1900 && v.x0 < 1100) trickRow(g, 'c', tq, CARE, { head: T.cHead, head_txt: '87 × 11 =', a: '8', b: '7', mid: '15', split: T.cSplit, sum: T.cSplit + .5, sum_txt: '8 + 7 = 15', drop: T.cDrop, res: T.cRes, res_txt: '957', carry: true, warn: T.toCare + .7, wrong: T.wrong, fix: T.fix, hop: T.hop, plus: T.plus, nine: T.nine });
  if (v.y1 > 2900 && v.x0 < 1100) bonusCard(g, tq);
  if (v.y1 > 2900 && v.x1 > 1200) ctaCard(g, tq);
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
  const i = CAPS.findIndex(([a, b]) => t >= a && t < b); if (i < 0 || t < T.pull0 || CAPS[i][0] < 2) return;   // the hook card is the opening caption
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


// ---------------------------------------------------------------- sound events
function buildEvents() {
  const ev = [], E = (t, type, o = {}) => ev.push({ t: +t.toFixed(3), type, pan: 0, ...o });
  [[0, 'intro'], [T.pull0, 'go'], [T.toEx2, 'run'], [T.cRes - .2, 'meet'], [T.toBonus - .6, 'tree'], [T.toBonus, 'answer'], [T.bonus, 'bonus'], [T.cta, 'cta'], [T.out, 'end']].forEach(([t, name]) => E(t, 'sec', { name }));
  E(0, 'room', { d: DUR }); if (ALIGN) E(VO_OFF, 'vo', { id: 'full' });
  for (let k = 0; k < 4; k++) E(.4 + k * .65, 'tick', { pan: -.4 });
  const row = (o, pan) => {
    E(o.head - .1, 'slapS', { pan }); E(o.split, 'swish', { d: .4, pan }); if (o.ha) E(o.ha, 'pop', { pan: pan - .2 }); if (o.hb) E(o.hb, 'pop', { pan: pan + .2 });
    E(o.sum, 'slapS', { pan }); E(o.drop - .35, 'swish', { d: .35, pan }); E(o.drop, 'dep', { key: 'A', m: 7, pan }); E(o.res - .3, 'swish', { d: .3 }); E(o.res, 'stamp');
  };
  E(T.pull0, 'swish', { d: 1.0 }); E(T.toTrick + .2, 'hop', { pan: .3 });
  row({ head: T.r1Head, split: T.r1Split, ha: T.r1Ha, hb: T.r1Hb, sum: T.r1Sum, drop: T.r1Drop, res: T.r1Res }, .1);
  E(T.toEx2, 'swish', { d: .8 }); E(T.toEx2 + .1, 'hop', { pan: -.2 });
  row({ head: T.r2Head, split: T.r2Split, sum: T.r2Sum, drop: T.r2Drop, res: T.r2Res }, .1);
  E(T.toWhy, 'swish', { d: .9 }); E(T.toWhy + .1, 'hop', { pan: -.3 }); E(T.toWhy + .4, 'slap');
  E(T.eq, 'pop'); E(T.row1, 'scribble', { d: .5 }); E(T.row2, 'scribble', { d: .4 }); E(T.mid, 'scribble', { d: .5 }); E(T.sum, 'dep', { key: 'B', m: 5 }); E(T.sum + .15, 'dep', { key: 'B', m: 9 }); E(T.that, 'chime');
  E(T.toCare, 'swish', { d: .9 }); E(T.toCare + .1, 'hop', { pan: -.4 });
  E(T.cHead - .1, 'slapS', { pan: -.2 }); E(T.cSplit, 'swish', { d: .4 }); E(T.cSplit + .5, 'slapS'); E(T.cDrop - .35, 'swish', { d: .35 }); E(T.cDrop, 'dep', { key: 'A', m: 4 });
  E(T.wrong - .3, 'swish', { d: .3 }); E(T.wrong, 'stamp'); E(T.fix, 'pop'); E(T.hop, 'hop', { pan: -.2 }); E(T.nine, 'dep', { key: 'A', m: 13, pan: -.2 }); E(T.cRes - .3, 'swish', { d: .3 }); E(T.cRes, 'stamp');
  E(T.toBonus, 'swish', { d: .8 }); E(T.toBonus + .2, 'hop', { pan: -.3 }); E(T.bonus, 'slap'); for (let k = 0; k < 4; k++) E(T.bonus + .5 + k * .65, 'tick', { pan: -.4 });
  E(T.cta - .5, 'swish', { d: .8 }); E(T.cta - .4, 'hop', { pan: .3 }); E(T.cta + .2, 'slap');
  E(T.out, 'pageout', { d: 2.0 });
  return ev.sort((a, b) => a.t - b.t);
}

// ---------------------------------------------------------------- boot
async function boot() {
  await Promise.all([document.fonts.load('92px Lilita', 'TRIK 0123456789'), document.fonts.load('40px Fell', 'Angka'), document.fonts.load('62px OldStdB', '0123456789±–×=°/−+…?'),
    document.fonts.load('62px OldStd', '0123456789'), document.fonts.load('italic 28px OldStdIt', '×2'), document.fonts.load('52px FellSC', 'A')]);
  paperTex = makePaper(W * MS, H * MS, 7);
  { const pc = canvas(1024, 1024), pg = pc.getContext('2d'); pg.drawImage(makePaper(1024, 1024, 11), 0, 0); PAT.paper = MAIN.createPattern(pc, 'repeat');
    const tb = canvas(1024, 1024), bg = tb.getContext('2d'); bg.fillStyle = C.table; bg.fillRect(0, 0, 1024, 1024); bg.globalCompositeOperation = 'overlay'; bg.globalAlpha = .7; bg.drawImage(makePaper(1024, 1024, 33), 0, 0);
    tablePat = MAIN.createPattern(tb, 'repeat'); }
  try { ALIGN = await fetch('vo/el/align.json').then(r => { if (!r.ok) throw 0; return r.json(); }); VOENV = await fetch('vo/el/env.json').then(r => r.json()); }
  catch (e) { ALIGN = null; VOENV = []; VO_OFF = 0; }
  buildCaps(); window.EV = buildEvents();
  const load = async (key, src) => { const im = new Image(); im.src = src; await im.decode(); SPR[key] = im; };
  await Promise.all([...[0, 1, 2, 3, 4, 5].map(i => load('a' + i, `sprites/hw_${i}.png`)), ...Array.from({ length: 30 }, (_, i) => load('b' + (i + 1), `sprites30/p${String(i + 1).padStart(2, '0')}.png`))]);
  const plain = (w, h, seed, col) => bakeCard({ path: rectPath(w, h), bw: w, bh: h, col: '#FBF3DF', seed, dashed: false, rim: 9, print: g => { g.strokeStyle = col; g.lineWidth = 5; g.strokeRect(-w / 2 + 20, -h / 2 + 20, w - 40, h - 40); } });
  PAT.hook = plain(1000, 720, 61, 'rgba(43,34,25,.8)');
  PAT.why = plain(960, 900, 66, 'rgba(43,34,25,.8)');
  PAT.bonus = bakeCard({ path: rectPath(1000, 720), bw: 1000, bh: 720, col: '#FBF3DF', seed: 62, dashed: false, rim: 9, print: g => { g.strokeStyle = 'rgba(184,57,44,.8)'; g.lineWidth = 5; g.setLineDash([22, 12]); g.strokeRect(-480, -340, 960, 680); } });
  PAT.cta = plain(900, 520, 83, 'rgba(45,95,138,.8)');
  window.render = t => renderFilm(t);
  window.READY = true;
}
boot();
