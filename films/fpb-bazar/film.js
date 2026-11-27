// HAWREIREI — FPB: bagi rata ke kantong. 9:16, one continuous paper world (see hawreirei-style/STYLE.md).
// Story: Ani and Budi pack 24 donuts and 36 cakes for the school bazaar, as many bags as possible, nothing left over.
// Budi tries 10 bags (donuts: 2 each, 4 left) and 8 bags (cakes: 4 each, 4 left). Ani: the number of bags must divide both → common factors.
// Factors of 24 and 36 laid out in value columns so the shared ones line up: 1, 2, 3, 4, 6, 12 → FPB 12 → 12 bags of 2 donuts + 3 cakes.
// Don't swap it with KPK: share out evenly → FPB, meet again → KPK. Callback: sold out. Challenge FPB(18, 30) = 6 (pinned later).
// Safe space for Instagram Reels: all text inside x 60–1020, y 220–1560, and x ≤ 940 below y 1000.
const DUR = 98.0;
window.DUR = DUR;
const T = {   // film seconds, set from vo/el/align.json (voice segment + VO_OFF 0.3)
  pull0: 8.0, toBazar: 8.05, try10: 13.3, fill10: 15.5, fail1: 18.8,
  try8: 19.3, fill8d: 20.7, fill8k: 23.25, fail2: 25.0, smile: 26.3,
  toFak: 27.5, rule: 28.0, persek: 34.0, f24: 37.6, f36: 44.9, common: 52.6, big: 58.25, fpb: 60.2, fname: 61.7,
  toHasil: 62.75, bags12: 63.77, fillH: 65.6, pas: 68.55,
  toBeda: 70.3, colFPB: 72.7, colKPK: 76.7,
  toBack: 79.6, habis: 81.4,
  toBonus: 82.75, bonus: 83.3, comment: 91.5, cta: 93.2, out: 96.1, end: 97.3,
};
const C24 = [38.76, 39.17, 39.7, 40.33, 41.02, 41.71, 42.75, 43.8];          // when each factor of 24 is said
const C36 = [45.96, 46.35, 46.8, 47.42, 48.06, 48.7, 49.25, 50.0, 51.6];     // factors of 36
const CC = [54.45, 54.9, 55.53, 56.16, 56.78, 57.4];                        // "yang ada di keduanya: 1, 2, 3, 4, 6, 12"
let VO_OFF = 0.3;
const SAY = {
  v01: { s: [4], p: ['24 donat, 36 kue. Dibagi rata ke kantong, tanpa sisa.', 'Paling banyak, berapa kantong?'] },
  v02: { s: [1, 2, 3], p: ['Ani dan Budi mau jualan di bazar sekolah,', 'dan ingin kantong sebanyak mungkin.', 'Budi langsung coba 10 kantong.', 'Donatnya 2 per kantong, tapi sisa 4. Gagal!'] },
  v03: { s: [3], p: ['Coba 8 kantong. Donatnya pas, 3 per kantong.', 'Tapi kuenya sisa 4. Gagal lagi!'] },
  v04: { s: [1, 2], p: ['Ani tersenyum.', 'Jumlah kantongnya harus bisa membagi habis 24,', 'dan juga 36. Itulah faktor persekutuan.'] },
  v05: { s: [1], p: ['Kita tulis faktornya.', '24: 1, 2, 3, 4, 6, 8, 12, 24.'] },
  v06: { p: ['36: 1, 2, 3, 4, 6, 9, 12, 18, 36.'] },
  v07: { s: [2, 3], p: ['Yang ada di keduanya: 1, 2, 3, 4, 6, 12.', 'Yang terbesar, 12!', 'Inilah FPB: Faktor Persekutuan Terbesar.'] },
  v08: { s: [2, 3], p: ['Jadi, 12 kantong.', 'Tiap kantong berisi 2 donat dan 3 kue.', 'Pas, tidak ada sisa!'] },
  v09: { s: [1, 2, 3], p: ['Tapi jangan tertukar dengan KPK.', 'Kalau membagi rata ke kelompok', 'sebanyak-banyaknya, pakai FPB.', 'Kalau mencari kapan bertemu lagi, pakai KPK.'] },
  v10: { p: ['12 kantong itu pun ludes terjual di bazar.'] },
  v11: { s: [1, 2, 4, 5], p: ['Sekarang giliranmu.', '18 pensil dan 30 penghapus,', 'dibagi rata ke beberapa anak, tanpa sisa.', 'Paling banyak berapa anak?', 'Tulis angkanya saja di komentar!'] },
  v12: { p: ['Follow untuk matematika sehari-hari lainnya!'] },
};
const DRAFT = {
  v01: [.3, 7.3, [5.0]], v02: [7.7, 19.7, [10.2, 12.2, 14.6]], v03: [20.1, 26.1, [23.5]], v04: [26.5, 34.5, [27.8, 31.0]],
  v05: [34.9, 42.4, [36.4]], v06: [42.8, 49.3, []], v07: [49.7, 58.2, [54.0, 55.6]], v08: [58.6, 64.4, [60.0, 63.2]],
  v09: [64.8, 73.6, [67.2, 69.0, 70.6]], v10: [74.0, 77.0, []], v11: [77.4, 87.6, [78.8, 81.4, 83.6, 85.6]], v12: [88.0, 90.6, []],
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
const SHEET = { x0: -140, y0: -1000, x1: 2400, y1: 6300 };
const YEL = '#F2B632', COLA = '#E2A93B', COLB = '#4F86B5', COLC = '#5E9A5A', RED = '#C8463A', PEN = '#2D5F8A', GRN = '#2D7A3E';
const P = { hook: [540, 1600], bazar: [1700, 1600], fak: [540, 3350], hasil: [540, 4950], beda: [1700, 4950], bonus: [540, 150], cta: [1700, 150] };
const PAT = {};
const CAMP = { bazar: [1700, 1540, 1.0], fak: [540, 3310, .95], hasil: [540, 4990, .95], beda: [1700, 4990, .85], bonus: [540, 190, .85], cta: [1700, 190, .85] };

// ---------------------------------------------------------------- camera
const CAM = [
  [0, 540, 2000, 1.0], [T.pull0, 540, 2000, 1.0], [T.toBazar + .9, ...CAMP.bazar, 'io'], [T.toFak, ...CAMP.bazar], [T.toFak + 1.0, ...CAMP.fak, 'io'],
  [T.toHasil, ...CAMP.fak], [T.toHasil + .9, ...CAMP.hasil, 'io'], [T.toBeda, ...CAMP.hasil], [T.toBeda + .9, ...CAMP.beda, 'io'],
  [T.toBack, ...CAMP.beda], [T.toBack + .7, 1450, 3200, .3, 'io'], [T.toBack + 1.4, ...CAMP.bazar, 'io'],
  [T.toBonus, ...CAMP.bazar], [T.toBonus + 1.0, ...CAMP.bonus, 'io'], [T.cta - .5, ...CAMP.bonus], [T.cta + .4, ...CAMP.cta, 'io'],
  [T.out, ...CAMP.cta], [T.end, 1130, 2300, .29, 'io'], [DUR, 1130, 2300, .285, 'lin'],
];
function camAt(t) {
  let i = 1; while (i < CAM.length - 1 && t > CAM[i][0]) i++;
  const a = CAM[i - 1], b = CAM[i], u = EASE[b[4] || 'io'](clamp((t - a[0]) / (b[0] - a[0]), 0, 1));
  const f = [lerp(a[1], b[1], u), lerp(a[2], b[2], u)], z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), u));
  let sx = 0, sy = 0, sr = 0;
  for (const [t0, am] of [[T.fail1, 6], [T.fail2, 7], [T.fpb, 6], [T.pas, 5], [T.habis, 4]]) { const s = shake(t, t0, am); sx += s[0]; sy += s[1]; sr += s[2]; }
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

// ---------------------------------------------------------------- props: donut, cake, paper bag
function donut(g, x, y, r) {
  g.save(); g.translate(x, y);
  g.beginPath(); g.arc(0, 0, r, 0, 7); g.arc(0, 0, r * .34, 0, 7, true); g.fillStyle = '#C98A4B'; g.fill('evenodd');
  g.beginPath(); for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI * 2, rr = r * (.86 + .06 * Math.sin(i * 2.7)); g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  g.closePath(); g.arc(0, 0, r * .42, 0, 7, true); g.fillStyle = '#F08FB0'; g.fill('evenodd');
  const cols = ['#FBF3DF', '#4F86B5', '#F2B632', '#5E9A5A']; for (let i = 0; i < 9; i++) { const a = i * 2.3, rr = r * (.55 + .22 * ((i * 37) % 10) / 10);
    g.save(); g.translate(Math.cos(a) * rr, Math.sin(a) * rr); g.rotate(a * 3); g.fillStyle = cols[i % 4]; g.fillRect(-r * .1, -r * .03, r * .2, r * .06); g.restore(); }
  g.lineWidth = Math.max(2, r * .08); g.strokeStyle = C.ink; g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke(); g.beginPath(); g.arc(0, 0, r * .34, 0, 7); g.stroke();
  g.restore();
}
function cake(g, x, y, r) {
  g.save(); g.translate(x, y); g.lineJoin = 'round'; g.lineWidth = Math.max(2, r * .08); g.strokeStyle = C.ink;
  g.beginPath(); g.moveTo(-r * .78, -r * .05); g.lineTo(r * .78, -r * .05); g.lineTo(r * .58, r * .95); g.lineTo(-r * .58, r * .95); g.closePath(); g.fillStyle = '#7FB3DA'; g.fill(); g.stroke();
  g.strokeStyle = 'rgba(43,34,25,.35)'; for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(i * r * .3, -r * .05); g.lineTo(i * r * .23, r * .95); g.stroke(); }
  g.strokeStyle = C.ink; g.beginPath(); g.moveTo(-r * .9, 0); g.bezierCurveTo(-r * .95, -r * .75, -r * .3, -r * 1.05, 0, -r * .95); g.bezierCurveTo(r * .3, -r * 1.05, r * .95, -r * .75, r * .9, 0); g.closePath();
  g.fillStyle = '#FBE3EC'; g.fill(); g.stroke();
  g.beginPath(); g.arc(r * .05, -r * 1.05, r * .2, 0, 7); g.fillStyle = RED; g.fill(); g.stroke();
  g.restore();
}
function bag(g, x, y, w, h, o = {}) {
  const k = o.k ?? 1; if (k <= 0) return;
  g.save(); g.translate(x, y); g.scale(k, k); g.rotate((o.rot || 0) * D2R);
  g.shadowColor = 'rgba(30,20,10,.3)'; g.shadowBlur = 8; g.shadowOffsetX = 4; g.shadowOffsetY = 6;
  g.fillStyle = '#D9B27C'; g.fillRect(-w / 2, -h / 2, w, h); g.shadowColor = 'transparent';
  g.fillStyle = '#C79A5E'; g.beginPath(); g.moveTo(-w / 2, -h / 2); g.lineTo(w / 2, -h / 2); g.lineTo(w / 2 - 8, -h / 2 + 14); g.lineTo(-w / 2 + 8, -h / 2 + 14); g.closePath(); g.fill();
  g.lineWidth = 4; g.strokeStyle = C.ink; g.strokeRect(-w / 2, -h / 2, w, h);
  if (o.glow) { g.lineWidth = 8; g.strokeStyle = o.glow; g.strokeRect(-w / 2 - 6, -h / 2 - 6, w + 12, h + 12); }
  const d = o.d || 0, c = o.c || 0, rows = (d ? 1 : 0) + (c ? 1 : 0); let ry = rows === 2 ? -h * .2 : 0;
  g.font = `${Math.round(w * .4)}px Lilita`; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.lineJoin = 'round';
  const line = (n, ico, col) => { ico(g, -w * .2, ry + (ico === cake ? 2 : 0), w * .17); g.lineWidth = 8; g.strokeStyle = '#FBF3DF'; g.strokeText('' + n, w * .22, ry + w * .14); g.fillStyle = col; g.fillText('' + n, w * .22, ry + w * .14); ry += h * .42; };
  if (d) line(d, donut, '#B0523A'); if (c) line(c, cake, '#2D5F8A');
  g.restore();
}

// ---------------------------------------------------------------- hook (frame 1 = thumbnail)
function hookCard(g, t) {
  drawCard(g, PAT.hook, { c: P.hook, rot: -1.2, h: 0 });
  g.save(); g.translate(...P.hook); g.rotate(-1.2 * D2R);
  pill(g, 'h-pill', 'FAKTOR', 0, -285, 44, RED);
  const k = 1 + .05 * Math.sin(Math.max(0, t) * 7) * Math.exp(-Math.max(0, t) * .6);
  g.save(); g.translate(0, -105); g.scale(k, k);
  donut(g, -405, -20, 48); rich(g, 'h-1', [['24', YEL], [' donat', C.ink]], -190, 8, 78);
  cake(g, 85, -12, 44); rich(g, 'h-2', [['36', COLB], [' kue', C.ink]], 260, 8, 78);
  g.restore();
  rich(g, 'h-3', [['dibagi rata, tanpa sisa', C.ink]], 0, 45, 56);
  rich(g, 'h-4', [['paling banyak', C.ink]], 0, 150, 60);
  rich(g, 'h-5', [['berapa kantong?', RED]], 0, 250, 78);
  g.restore();
  bag(g, 300, 2240, 170, 200, { rot: -4 });
  g.save(); g.font = '120px Lilita'; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillStyle = RED; g.lineWidth = 12; g.strokeStyle = '#FBF3DF'; g.lineJoin = 'round';
  g.strokeText('?', 300, 2285); g.fillText('?', 300, 2285); g.restore();
}

// ---------------------------------------------------------------- the bazaar: two failed tries
function leftovers(g, id, x, y, kind, t, t0) {
  const k = popIn(t, t0, .25); if (k <= 0) return;
  g.save(); g.translate(x, y); g.scale(k, k);
  g.fillStyle = 'rgba(251,227,220,.9)'; g.beginPath(); g.roundRect(-205, -55, 410, 110, 22); g.fill(); g.setLineDash([12, 8]); g.lineWidth = 5; g.strokeStyle = RED; g.stroke(); g.setLineDash([]);
  for (let i = 0; i < 4; i++) (kind === 'd' ? donut : cake)(g, -165 + i * 52, kind === 'd' ? 0 : 6, 22);
  rich(g, id, [['sisa 4', RED]], 115, 18, 50);
  g.restore();
}
function bazarScene(g, t, cam) {
  const [cx, cy] = P.bazar, ky = cy + 150, S = .7, m = S / .5, bx = cx - 290, ax = cx + 320;
  const sold = t > T.habis, tryN = t < T.try8 ? 10 : 8, back = t > T.toBack;
  pill(g, 'z-ban', 'BAZAR SEKOLAH', cx, cy - 755, 50, '#2D5F8A');
  // kids
  const budi = sold ? { s: S, head: 'wow', hL: [bx - 110 * m, ky - 120 * m], hR: [bx + 110 * m, ky - 120 * m], bL: -1, bR: 1 }
    : (t > T.fail1 && t < T.try8) || (t > T.fail2 && t < T.toFak) ? { s: S, head: 'worried', hL: [bx - 60 * m, ky - 40 * m], hR: [bx + 60 * m, ky - 40 * m] }
    : { s: S, head: t > T.try10 && !back ? 'shout' : 'n', hR: [bx + 95 * m, ky + 120 * m] };
  const ani = sold ? { s: S, head: 'wow', hL: [ax - 110 * m, ky - 120 * m], hR: [ax + 110 * m, ky - 120 * m], bL: -1, bR: 1 }
    : t > T.smile && t < T.toFak + 1 ? { s: S, head: 'n', hL: [ax - 95 * m, ky - 140 * m], bL: -1 } : { s: S, head: 'n' };
  drawLayer(g, cam, q => { drawPuppet(q, 'bud', stand('bud', bx, ky, budi)); drawPuppet(q, 'ani', stand('ani', ax, ky, ani)); });
  nameTag(g, 'budi', 'Budi', bx, ky - 300, COLB); nameTag(g, 'ani', 'Ani', ax, ky - 300, COLA);
  // the stall table, with the goods (or the sign, at the end)
  g.save(); g.shadowColor = 'rgba(30,20,10,.35)'; g.shadowBlur = 12; g.shadowOffsetY = 8; g.fillStyle = '#9C6B3E'; g.beginPath(); g.roundRect(cx - 480, ky + 150, 960, 190, 16); g.fill();
  g.shadowColor = 'transparent'; g.lineWidth = 5; g.strokeStyle = C.ink; g.stroke();
  g.fillStyle = '#E8DCC4'; g.fillRect(cx - 480, ky + 150, 960, 38); for (let i = 0; i < 12; i++) { g.fillStyle = i % 2 ? '#C8463A' : '#FBF3DF'; g.fillRect(cx - 480 + i * 80, ky + 150, 80, 38); }
  g.strokeRect(cx - 480, ky + 150, 960, 38); g.restore();
  if (!sold && t < T.toFak) { for (let i = 0; i < 5; i++) donut(g, cx - 420 + i * 46, ky + 128 - (i % 2) * 14, 26); for (let i = 0; i < 5; i++) cake(g, cx + 240 + i * 44, ky + 112 - (i % 2) * 12, 24); }
  if (sold) { const k = popIn(t, T.habis, .3); g.save(); g.translate(cx, cy - 330); g.rotate(-4 * D2R); g.scale(k, k); pill(g, 'z-sold', 'HABIS TERJUAL!', 0, 0, 64, RED); g.restore(); }
  if (back || t < T.try10) return;
  // tries
  if (t < T.try8) {
    mathSlip(g, 'z-e1', t > T.fill10 ? '24 ÷ 10 = 2, sisa 4' : '10 kantong?', cx, cy - 635, -1.5, t, T.try10, { size: 52, dy: 60, bg: t > T.fill10 ? '#FBE3DC' : undefined });
  } else {
    mathSlip(g, 'z-e2', t > T.fill8d ? '24 ÷ 8 = 3' : '8 kantong?', cx - (t > T.fill8d ? 235 : 0), cy - 635, -1.5, t, T.try8, { size: 52, dy: 60, check: t > T.fill8d, bg: t > T.fill8d ? '#E3F0DC' : undefined });
    if (t > T.fill8k) mathSlip(g, 'z-e3', '36 ÷ 8 = 4, sisa 4', cx + 205, cy - 635, 1.5, t, T.fill8k, { size: 52, dy: 60, bg: '#FBE3DC' });
  }
  const t0 = t < T.try8 ? T.try10 : T.try8, cols = tryN / 2;
  for (let i = 0; i < tryN; i++) { const r = Math.floor(i / cols), c = i % cols;
    bag(g, cx + (c - (cols - 1) / 2) * 150, cy - 475 + r * 175, 130, 155, { k: popIn(t, t0 + .3 + i * .06, .2),
      d: tryN === 10 ? (t > T.fill10 + i * .05 ? 2 : 0) : (t > T.fill8d + i * .05 ? 3 : 0), c: tryN === 8 && t > T.fill8k + i * .05 ? 4 : 0 }); }
  if (tryN === 10 && t > T.fill10 + .6) leftovers(g, 'z-s1', cx, cy - 145, 'd', t, T.fill10 + .6);
  if (tryN === 8 && t > T.fill8k + .6) leftovers(g, 'z-s2', cx, cy - 145, 'c', t, T.fill8k + .6);
  if (tryN === 10 && t > T.fail1) stampWord(g, cx, cy + 20, -6, t, T.fail1, 'GAGAL!', 66);
  if (tryN === 8 && t > T.fail2) stampWord(g, cx, cy + 20, 5, t, T.fail2, 'GAGAL LAGI!', 60);
}

// ---------------------------------------------------------------- factors, laid out by value so the shared ones line up
const VALS = [1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36], F24 = [1, 2, 3, 4, 6, 8, 12, 24], F36 = [1, 2, 3, 4, 6, 9, 12, 18, 36], COMMON = [1, 2, 3, 4, 6, 12];
function chip(g, id, txt, x, y, k, col, hi, head) {
  if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); const w = head ? 96 : 70;
  g.shadowColor = 'rgba(30,20,10,.3)'; g.shadowBlur = 6; g.shadowOffsetX = 3; g.shadowOffsetY = 5; g.fillStyle = head ? col : hi ? '#FFF4CF' : '#FBF8F0'; g.beginPath(); g.roundRect(-w / 2, -36, w, 72, 12); g.fill();
  g.shadowColor = 'transparent'; g.lineWidth = hi ? 6 : 4; g.strokeStyle = hi ? RED : C.ink; g.stroke();
  g.font = `${txt.length > 1 ? 44 : 50}px Lilita`; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillStyle = head ? '#FBF3DF' : col; g.fillText(txt, 0, 17);
  noteText(g, id, txt, -w / 2 + 6, -24, w / 2 - 6, 22); g.restore();
}
function fakScene(g, t) {
  const [x, Y] = P.fak; if (t < T.toFak) return;
  const colX = v => x - 355 + VALS.indexOf(v) * 80, ya = Y - 330, yb = Y - 120;
  if (t > T.persek) pill(g, 'f-pill', 'FAKTOR PERSEKUTUAN', x, Y - 720, 44, '#2D5F8A');
  popRich(g, 'f-r1', [['jumlah kantong harus membagi habis', C.ink]], x, Y - 615, 52, t, T.rule);
  if (t > T.rule + .8) popRich(g, 'f-r2', [['24', COLA], [' dan ', C.ink], ['36', COLB]], x, Y - 520, 76, t, T.rule + .8);
  COMMON.forEach((v, j) => { const t0 = CC[j]; if (t < t0) return; const u = clamp((t - t0) / .25, 0, 1), big = v === 12 && t > T.big;
    g.save(); g.globalAlpha = u; g.fillStyle = big ? 'rgba(200,70,58,.18)' : 'rgba(94,154,90,.2)'; g.strokeStyle = big ? RED : COLC; g.lineWidth = big ? 6 : 4;
    g.beginPath(); g.roundRect(colX(v) - 40, ya - 46, 80, yb - ya + 92, 14); g.fill(); g.stroke(); g.restore(); });
  if (t > T.f24) chip(g, 'f-h24', '24', x - 455, ya, popIn(t, T.f24, .2), COLA, false, true);
  if (t > T.f36) chip(g, 'f-h36', '36', x - 455, yb, popIn(t, T.f36, .2), COLB, false, true);
  F24.forEach((v, i) => chip(g, 'f-a' + v, '' + v, colX(v), ya, popIn(t, C24[i], .2), COLA, v === 12 && t > T.big));
  F36.forEach((v, i) => chip(g, 'f-b' + v, '' + v, colX(v), yb, popIn(t, C36[i], .2), COLB, v === 12 && t > T.big));
  if (t > T.big) popRich(g, 'f-big', [['terbesar!', RED]], colX(12), yb + 95, 42, t, T.big);
  if (t > T.fpb) { stampWord(g, x, Y + 125, -3, t, T.fpb, 'FPB = 12', 72, GRN);
    popRich(g, 'f-name', [['F', RED], ['aktor ', C.ink], ['P', RED], ['ersekutuan Ter', C.ink], ['B', RED], ['esar', C.ink]], x, Y + 255, 48, t, T.fname); }
}

// ---------------------------------------------------------------- 12 bags, 2 donuts + 3 cakes each
function hasilScene(g, t) {
  const [x, Y] = P.hasil; if (t < T.toHasil) return;
  if (t > T.bags12) pill(g, 'h12', '12 KANTONG', x, Y - 530, 48, GRN);
  for (let i = 0; i < 12; i++) { const r = Math.floor(i / 6), c = i % 6, f = t > T.fillH + i * .08;
    bag(g, x + (c - 2.5) * 145, Y - 370 + r * 180, 125, 155, { k: popIn(t, T.bags12 + i * .07, .2), d: f ? 2 : 0, c: f ? 3 : 0 }); }
  if (t > T.fillH + .5) popRich(g, 'h-per', [['2 ', COLA], ['donat', C.ink], [' + ', C.ink], ['3 ', COLB], ['kue', C.ink], [' per kantong', '#7B6A57']], x, Y - 40, 52, t, T.fillH + .5);
  if (t > T.fillH + 1.6) mathSlip(g, 'h-c1', '12 × 2 = 24', x - 210, Y + 75, -1.5, t, T.fillH + 1.6, { size: 44, dy: 60, check: true, bg: '#E3F0DC' });
  if (t > T.fillH + 2.2) mathSlip(g, 'h-c2', '12 × 3 = 36', x + 210, Y + 75, 1.5, t, T.fillH + 2.2, { size: 44, dy: 60, check: true, bg: '#E3F0DC' });
  if (t > T.pas) stampWord(g, x, Y + 215, -3, t, T.pas, 'PAS, TANPA SISA!', 56, GRN);
}

// ---------------------------------------------------------------- FPB or KPK?
function calendar(g, x, y, w, h) {
  g.save(); g.translate(x, y); g.shadowColor = 'rgba(30,20,10,.3)'; g.shadowBlur = 8; g.shadowOffsetX = 4; g.shadowOffsetY = 6;
  g.fillStyle = '#FBF8F0'; g.fillRect(-w / 2, -h / 2, w, h); g.shadowColor = 'transparent'; g.fillStyle = COLB; g.fillRect(-w / 2, -h / 2, w, h * .24);
  g.lineWidth = 4; g.strokeStyle = C.ink; g.strokeRect(-w / 2, -h / 2, w, h); g.strokeStyle = 'rgba(43,34,25,.35)'; g.lineWidth = 2;
  for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(-w / 2 + i * w / 4, -h / 2 + h * .24); g.lineTo(-w / 2 + i * w / 4, h / 2); g.stroke(); }
  for (let j = 1; j < 3; j++) { g.beginPath(); g.moveTo(-w / 2, -h / 2 + h * .24 + j * h * .76 / 3); g.lineTo(w / 2, -h / 2 + h * .24 + j * h * .76 / 3); g.stroke(); }
  g.strokeStyle = RED; g.lineWidth = 6; g.beginPath(); g.arc(w / 8, h * .26, w * .13, 0, 7); g.stroke(); g.restore();
}
function bedaCard(g, t) {
  const [x, y] = P.beda; card(g, PAT.beda, x, y, 1, t, T.toBeda + .4);
  onCard(g, x, y, 1, t, T.toBeda + .4, () => {
    pill(g, 'd-pill', 'JANGAN TERTUKAR!', 0, -390, 44, RED);
    g.save(); g.strokeStyle = 'rgba(43,34,25,.35)'; g.lineWidth = 3; g.setLineDash([12, 10]); g.beginPath(); g.moveTo(0, -310); g.lineTo(0, 390); g.stroke(); g.restore();
    rich(g, 'd-fpb', [['FPB', COLA]], -250, -235, 96); rich(g, 'd-kpk', [['KPK', COLB]], 250, -235, 96);
    if (t > T.colFPB) { const k = popIn(t, T.colFPB, .25); g.save(); g.translate(-250, -90); g.scale(k, k); bag(g, -68, 0, 120, 140, { d: 2, c: 3 }); bag(g, 68, 0, 120, 140, { d: 2, c: 3 }); g.restore();
      popRich(g, 'd-f1', [['membagi rata', C.ink]], -250, 75, 48, t, T.colFPB + .2);
      popRich(g, 'd-f2', [['ke kelompok', C.ink]], -250, 145, 44, t, T.colFPB + .5); popRich(g, 'd-f3', [['sebanyak-banyaknya', C.ink]], -250, 205, 44, t, T.colFPB + .8); }
    if (t > T.colKPK) { const k = popIn(t, T.colKPK, .25); g.save(); g.translate(250, -90); g.scale(k, k); calendar(g, 0, 0, 170, 140); g.restore();
      popRich(g, 'd-k1', [['bertemu lagi', C.ink]], 250, 75, 48, t, T.colKPK + .2);
      popRich(g, 'd-k2', [['kapan bersamaan', C.ink]], 250, 145, 44, t, T.colKPK + .5); popRich(g, 'd-k3', [['lagi?', C.ink]], 250, 205, 44, t, T.colKPK + .8); }
  });
}

// ---------------------------------------------------------------- challenge and CTA
function bonusCard(g, t) {
  const [x, y] = P.bonus; card(g, PAT.bonus, x, y, -1.5, t, T.bonus - .2);
  onCard(g, x, y, -1.5, t, T.bonus - .2, () => {
    pill(g, 'b-pill', 'TANTANGAN', 0, -300, 44, RED);
    rich(g, 'b-1', [['18', YEL], [' pensil', C.ink]], 0, -175, 70);
    rich(g, 'b-2', [['30', COLB], [' penghapus', C.ink]], 0, -80, 70);
    rich(g, 'b-3', [['dibagi rata, tanpa sisa', C.ink]], 0, 15, 50);
    rich(g, 'b-4', [['paling banyak ', C.ink], ['berapa anak?', RED]], 0, 115, 56);
    const k = t > T.comment ? 1 + .06 * Math.exp(-(t - T.comment) * 4) * Math.sin((t - T.comment) * 18) : 1;
    g.save(); g.translate(0, 220); g.scale(k, k); rich(g, 'b-5', [['tulis ', C.ink], ['angkanya saja', RED], [' di komentar ↓', C.ink]], 0, 0, 44); g.restore();
  });
}
function ctaCard(g, t) {
  const [x, y] = P.cta; card(g, PAT.cta, x, y, 1.2, t, T.cta);
  onCard(g, x, y, 1.2, t, T.cta, () => {
    pill(g, 'c-pill', 'FOLLOW', 0, -200, 44, '#2D5F8A');
    rich(g, 'c-1', [['Follow', RED]], 0, -70, 96);
    rich(g, 'c-2', [['untuk matematika', C.ink]], 0, 40, 56);
    rich(g, 'c-3', [['sehari-hari lainnya!', C.ink]], 0, 130, 56);
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
const HOSTK = [[0, ...HOME], [T.toBazar, ...HOME], [T.toBazar + .9, ...hostAtPlace('bazar')],
  [T.toFak, ...hostAtPlace('bazar')], [T.toFak + 1.0, ...hostAtPlace('fak')], [T.toHasil, ...hostAtPlace('fak')], [T.toHasil + .9, ...hostAtPlace('hasil')],
  [T.toBeda, ...hostAtPlace('hasil')], [T.toBeda + .9, ...hostAtPlace('beda')], [T.toBack, ...hostAtPlace('beda')], [T.toBack + 1.4, ...hostAtPlace('bazar')],
  [T.toBonus, ...hostAtPlace('bazar')], [T.toBonus + 1.0, ...hostAtPlace('bonus')], [T.cta - .5, ...hostAtPlace('bonus')], [T.cta + .4, ...hostAtPlace('cta')], [DUR, ...hostAtPlace('cta')]];
function hostAt(t) {
  let i = 1; while (i < HOSTK.length - 1 && t > HOSTK[i][0]) i++;
  const a = HOSTK[i - 1], b = HOSTK[i], u = EASE.io(clamp((t - a[0]) / (b[0] - a[0]), 0, 1)), k = lerp(a[3], b[3], u);
  return [lerp(a[1], b[1], u), lerp(a[2], b[2], u) - (u > 0 && u < 1 && (a[1] !== b[1] || a[2] !== b[2]) ? Math.sin(Math.PI * u) * 260 * k : 0), k];
}
function hostPoseName(t) {
  if (t < 4.0) return 'think';                            // the problem
  if (t < T.pull0) return 'pointyou';                     // "Paling banyak, berapa kantong?"
  if (t < T.try10) return 'present';                      // the bazaar
  if (t < T.fail1) return 'think';
  if (t < T.try8) return 'wrong';                         // "Gagal!"
  if (t < T.fail2) return 'confused';
  if (t < T.smile) return 'wrong';                        // "Gagal lagi!"
  if (t < T.persek) return 'idea';                        // Ani's idea
  if (t < T.common) return 'pointer';                     // writing the factors
  if (t < T.big) return 'present';
  if (t < T.toHasil) return 'cheer';                      // FPB = 12
  if (t < T.pas) return 'pointer';
  if (t < T.toBeda) return 'thumbs';                      // "Pas, tidak ada sisa!"
  if (t < T.colFPB) return 'wrong';                       // "jangan tertukar"
  if (t < T.toBack) return 'present';
  if (t < T.toBonus) return 'clap';                       // sold out
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
  if (near(v, 'bazar')) bazarScene(g, tq, cam);
  if (near(v, 'fak')) fakScene(g, tq);
  if (near(v, 'hasil')) hasilScene(g, tq);
  if (near(v, 'beda')) bedaCard(g, tq);
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
  [[0, 'intro'], [T.toBazar, 'go'], [T.toFak, 'run'], [T.common, 'meet'], [T.toHasil, 'tree'], [T.toBeda, 'answer'], [T.bonus, 'bonus'], [T.cta, 'cta'], [T.out, 'end']].forEach(([t, name]) => E(t, 'sec', { name }));
  E(0, 'room', { d: DUR }); if (ALIGN) E(VO_OFF, 'vo', { id: 'full' });
  const move = (t0, d = 1.0, pan = 0) => { E(t0, 'swish', { d, pan }); E(t0 + .1, 'hop', { pan }); };
  E(.4, 'pop', { pan: -.2 }); E(.8, 'pop', { pan: .2 });
  move(T.toBazar, .9, .3); E(T.toBazar + .4, 'slap');
  E(T.try10, 'slapS'); for (let i = 0; i < 10; i++) E(T.try10 + .3 + i * .06, 'tick', { pan: (i - 4.5) / 6 });
  E(T.fill10, 'scribble', { d: .6 }); E(T.fill10 + .6, 'pop', { pan: .2 }); E(T.fail1 - .3, 'swish', { d: .3 }); E(T.fail1, 'stamp');
  E(T.try8, 'slapS'); for (let i = 0; i < 8; i++) E(T.try8 + .3 + i * .06, 'tick', { pan: (i - 3.5) / 5 });
  E(T.fill8d, 'chime'); E(T.fill8k, 'slapS'); E(T.fill8k + .6, 'pop', { pan: .2 }); E(T.fail2 - .3, 'swish', { d: .3 }); E(T.fail2, 'stamp');
  move(T.toFak, 1.0, -.3); E(T.rule, 'slapS'); E(T.persek, 'slap');
  F24.forEach((v, i) => E(C24[i], 'tick', { pan: (VALS.indexOf(v) - 5) / 6 })); F36.forEach((v, i) => E(C36[i], 'tick', { pan: (VALS.indexOf(v) - 5) / 6 }));
  COMMON.forEach((v, j) => E(CC[j], 'pop', { pan: (VALS.indexOf(v) - 5) / 6 })); E(T.big, 'chime'); E(T.fpb - .3, 'swish', { d: .3 }); E(T.fpb, 'stamp');
  move(T.toHasil, .9, 0); for (let i = 0; i < 12; i++) E(T.bags12 + i * .07, 'tick', { pan: ((i % 6) - 2.5) / 4 }); E(T.fillH, 'scribble', { d: 1.0 });
  E(T.fillH + 1.6, 'slapS'); E(T.fillH + 2.2, 'slapS'); E(T.pas - .3, 'swish', { d: .3 }); E(T.pas, 'stamp'); E(T.pas + .1, 'chime');
  move(T.toBeda, .9, .3); E(T.toBeda + .4, 'slap'); E(T.colFPB, 'pop', { pan: -.3 }); E(T.colKPK, 'pop', { pan: .3 });
  E(T.toBack, 'swish', { d: 1.4 }); E(T.toBack + .1, 'hop'); E(T.habis, 'slapS'); E(T.habis + .05, 'chime');
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
    PAT.beda = plain(1000, 900, 64, 'rgba(43,34,25,.8)');
  PAT.bonus = bakeCard({ path: rectPath(1000, 760), bw: 1000, bh: 760, col: '#FBF3DF', seed: 62, dashed: false, rim: 9, print: g => { g.strokeStyle = 'rgba(184,57,44,.8)'; g.lineWidth = 5; g.setLineDash([22, 12]); g.strokeRect(-480, -360, 960, 720); } });
  PAT.cta = plain(900, 620, 83, 'rgba(45,95,138,.8)');
  window.render = t => renderFilm(t);
  window.READY = true;
}
boot();
window.__ALLTXT = () => TXT.map(e => ({ id: e.id, text: e.text, x0: e.x0, y0: e.y0, x1: e.x1, y1: e.y1 }));
window.__HOST = () => window.__HB;
window.__MOVING = t => { const a = camAt(t), b = camAt(t - .15); return Math.abs(a.f[0] - b.f[0]) + Math.abs(a.f[1] - b.f[1]) > 2 || Math.abs(a.z - b.z) > .005; };
