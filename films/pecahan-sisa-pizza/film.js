// HAWREIREI — "Sisa pizza" (penjumlahan pecahan ½ + ⅓). 9:16, one continuous paper world (see hawreirei-style/STYLE.md).
// Two leftover pizzas (same size) are moved into ONE box: the box shows the sum. The trap ½ + ⅓ = 2⁄5 is refuted on the
// same box (2⁄5 does not even fill half of it, Ani's half alone does), then the box is cut into sixths: 3⁄6 + 2⁄6 = 5⁄6, ⅙ empty.
const DUR = 73.5;
window.DUR = DUR;
// silent draft: beats on the estimated narration; retimed from vo/el/align.json once the creator's voice arrives
const T = {   // film seconds, set from vo/el/align.json (voice segment + VO_OFF 0.3)
  hA: 1.1, hB: 3.5, ask: 7.9, pull0: 9.7, toTrap: 9.8, trap1: 12.4, trap2: 13.6, trap3: 16.25,
  toBox: 17.3, five: 18.4, half: 19.9, aniFly: 21.9, imp: 25.75, clear: 26.9, budFly: 27.2, beda: 30.8,
  knife: 35.3, aS: 38.6, eqA: 39.7, bS: 42.0, eqB: 42.9, count: 43.9, five6: 47.0, empty: 48.1,
  toRule: 49.6, rule: 50.6, kpk: 52.6, step1: 54.7, step2: 56.15,
  toBonus: 57.5, bonus: 57.9, cta: 67.1, out: 70.0, end: 72.4,
};
const FLY = 0.9;   // a leftover's flight from its tray to the box
// captions = the narration as spoken, in display spelling (digits, stacked fractions F{a}{b})
let VO_OFF = 0.3;
const SAY = {
  v01: { p: ['Sisa pizza Ani tinggal F{1}{2}. Sisa pizza Budi tinggal F{1}{3}.', 'Dua sisa itu digabung ke satu kotak. Kotaknya terisi berapa bagian?'], s: [2] },
  v02: { p: ['Jangan jawab dulu.', 'Banyak yang langsung menjumlahkan:', '1 + 1, 2 + 3… F{2}{5}.'], s: [1, 2] },
  v03: { p: ['Coba lihat. F{2}{5} itu kurang dari setengah kotak.', 'Padahal sisa pizza Ani saja sudah mengisi setengah kotak.', 'Jadi, tidak mungkin.'], s: [3, 5] },
  v04: { p: ['Kita masukkan dua-duanya. Muat…', 'tapi potongannya beda ukuran.', 'Yang beda ukuran tidak bisa langsung dihitung.'], s: [2, 4] },
  v05: { p: ['Jadi kotaknya kita bagi 6, sama besar.'] },
  v06: { p: ['Sisa Ani mengisi 3 bagian: F{3}{6}.', 'Sisa Budi mengisi 2 bagian: F{2}{6}.'], s: [2] },
  v07: { p: ['3 + 2… 5! Kotaknya terisi F{5}{6}.', 'Tinggal 1 bagian yang kosong.'], s: [3] },
  v08: { p: ['Kenapa 6? Karena 6 adalah KPK dari 2 dan 3.', 'Samakan dulu penyebutnya, baru jumlahkan pembilangnya.'], s: [2] },
  v09: { p: ['Sekarang giliranmu. Sisa pizza Ani F{1}{3}, sisa pizza Cici F{1}{4}.', 'Digabung ke satu kotak, terisi berapa bagian? Jawab di komentar!'], s: [3] },
  v10: { p: ['Mau dibahas soal apa lagi? Tulis di komentar, ya!'] },
  v11: { p: ['Sampai jumpa di soal berikutnya!'] },
};
// draft timing (film seconds): [start, end, [split times between the parts]]
const DRAFT = {
  v01: [.3, 8.0, [4.4]], v02: [8.6, 15.1, [10.0, 11.9]], v03: [15.5, 23.4, [18.6, 22.2]], v04: [23.8, 30.2, [25.9, 27.4]],
  v05: [30.6, 33.3, []], v06: [33.7, 40.2, [37.0]], v07: [40.5, 46.4, [43.6]], v08: [46.8, 53.6, [49.9]],
  v09: [54.0, 62.0, [58.3]], v10: [62.4, 65.1, []], v11: [65.5, 67.5, []],
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
const SHEET = { x0: -140, y0: -140, x1: 2400, y1: 4900 };
const YEL = '#F2B632', COLA = '#E2A93B', COLB = '#4F86B5', COLC = '#5E9A5A', RED = '#C8463A';
const TRAY = { ani: [210, 1130], bud: [560, 1130] };
const BOX = { x: 1100, y: 2000, s: 190, r: 160 }, PR_ = 150;          // the box (half side s, bed radius r); a pizza's radius
const PIECE = { ani: [90, 270], bud: [270, 390] };                    // degrees, canvas convention (0 = right, 90 = down)
const SLOTS = [[210, 270], [150, 210], [90, 150], [270, 330], [330, 390]];   // counting order 1..5; the empty slot is [30, 90]
const TRAP = [1760, 980], RULE = [1100, 2900], BONUS = [1100, 3700], CTA = [1100, 4450];
const PAT = {};

// ---------------------------------------------------------------- camera
const CAM = [
  [0, 540, 960, 1.0], [T.pull0, 540, 960, 1.0], [T.toTrap + 1.1, TRAP[0], 980, .9, 'io'], [T.toBox, TRAP[0], 980, .9],
  [T.toBox + 1.0, 1100, 2040, 1.7, 'io'], [T.knife - .3, 1100, 2040, 1.7], [T.knife + .5, 1100, 2030, 1.78, 'io'], [T.toRule, 1100, 2030, 1.78],
  [T.toRule + .8, RULE[0], RULE[1], .9, 'io'], [T.toBonus, RULE[0], RULE[1], .9], [T.toBonus + .8, BONUS[0], BONUS[1] + 60, .9, 'io'],
  [T.cta - .6, BONUS[0], BONUS[1] + 60, .9], [T.cta + .2, CTA[0], CTA[1], .9, 'io'], [T.out, CTA[0], CTA[1], .9], [T.end, 1130, 2380, .37, 'io'], [DUR, 1130, 2380, .36, 'lin'],
];
function camAt(t) {
  let i = 1; while (i < CAM.length - 1 && t > CAM[i][0]) i++;
  const a = CAM[i - 1], b = CAM[i], u = EASE[b[4] || 'io'](clamp((t - a[0]) / (b[0] - a[0]), 0, 1));
  const f = [lerp(a[1], b[1], u), lerp(a[2], b[2], u)], z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), u));
  let sx = 0, sy = 0, sr = 0;
  for (const [t0, am] of [[T.imp, 7], [T.five6, 9], [T.aniFly + FLY, 3], [T.budFly + FLY, 3]]) { const s = shake(t, t0, am); sx += s[0]; sy += s[1]; sr += s[2]; }
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
  let cx = align === 'center' ? x - tw / 2 : x;
  parts.forEach(([s, col], i) => {
    g.font = `${size}px Lilita`;
    if (isF(s)) fracL(g, s, cx, y, size, col || C.ink, true);
    else { if (col && col !== C.ink) { g.lineJoin = 'round'; g.lineWidth = size * .14; g.strokeStyle = C.ink; g.strokeText(s, cx, y); } g.fillStyle = col || C.ink; g.fillText(s, cx, y); }
    cx += ws[i];
  });
  const top = parts.some(([s]) => isF(s)) ? size * .95 : size * .8;
  noteText(g, id, parts.map(p => isF(p[0]) ? p[0].replace(/F\{(.*?)\}\{(.*?)\}/, '$1⁄$2') : p[0]).join(''), (align === 'center' ? x - tw / 2 : x), y - top, (align === 'center' ? x + tw / 2 : x + tw), y + size * .3);
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

// ---------------------------------------------------------------- pizza, tray, box
const PEP = [[20, .55], [75, .3], [112, .64], [160, .4], [198, .68], [245, .32], [292, .6], [330, .3], [5, .12], [138, .14], [352, .74], [228, .72], [262, .66], [52, .74]];
function sectorPath(cx, cy, r, a0, a1) { const p = new Path2D(); p.moveTo(cx, cy); p.arc(cx, cy, r, a0 * D2R, a1 * D2R); p.closePath(); return p; }
function pizzaPiece(g, cx, cy, r, a0, a1, owner, glow = 0) {
  const P = sectorPath(cx, cy, r, a0, a1), Pi = sectorPath(cx, cy, r * .84, a0, a1);
  g.save(); g.fillStyle = '#D9984B'; g.fill(P);
  g.save(); g.clip(P); g.fillStyle = 'rgba(150,80,30,.35)'; for (let k = 0; k < 18; k++) { const an = (k * 41) * D2R, rr = r * (.9 + (k % 3) * .03); g.beginPath(); g.arc(cx + Math.cos(an) * rr, cy + Math.sin(an) * rr, r * .018, 0, 7); g.fill(); } g.restore();
  g.fillStyle = '#C9472F'; g.fill(Pi);
  const Pc = sectorPath(cx, cy, r * .8, a0, a1); g.fillStyle = '#F3C858'; g.fill(Pc);
  g.save(); g.clip(Pc);
  for (const [an, rf] of PEP) { const x = cx + Math.cos(an * D2R) * rf * r, y = cy + Math.sin(an * D2R) * rf * r; g.beginPath(); g.arc(x, y, r * .1, 0, 7); g.fillStyle = '#A8332A'; g.fill(); g.lineWidth = r * .015; g.strokeStyle = '#7C2219'; g.stroke(); g.fillStyle = 'rgba(255,200,170,.35)'; g.beginPath(); g.arc(x - r * .03, y - r * .03, r * .03, 0, 7); g.fill(); }
  for (let k = 0; k < 10; k++) { const an = (k * 67 + 13) * D2R, rf = .2 + (k * 37 % 60) / 100; g.fillStyle = 'rgba(255,240,190,.55)'; g.beginPath(); g.ellipse(cx + Math.cos(an) * rf * r, cy + Math.sin(an) * rf * r, r * .04, r * .025, an, 0, 7); g.fill(); }
  g.restore();
  if (owner) { g.save(); g.clip(P); g.lineJoin = 'round'; g.lineWidth = r * .1 + glow * r * .08; g.strokeStyle = owner; g.globalAlpha *= .85; g.stroke(P); g.restore(); }
  g.lineJoin = 'round'; g.lineWidth = Math.max(3, r * .028); g.strokeStyle = C.ink; g.stroke(P);
  g.restore();
}
function tray(g, cx, cy, r, crumbs) {
  g.save(); g.shadowColor = 'rgba(30,20,10,.4)'; g.shadowBlur = 10; g.shadowOffsetX = 5; g.shadowOffsetY = 8;
  g.beginPath(); g.arc(cx, cy, r + 16, 0, 7); g.fillStyle = '#6F6A63'; g.fill(); g.shadowColor = 'transparent';
  g.lineWidth = 4; g.strokeStyle = C.ink; g.stroke(); g.beginPath(); g.arc(cx, cy, r + 4, 0, 7); g.fillStyle = '#8D877E'; g.fill(); g.strokeStyle = 'rgba(43,34,25,.5)'; g.lineWidth = 3; g.stroke();
  g.fillStyle = '#C98B45'; for (let k = 0; k < crumbs; k++) { const an = (k * 97 + 11) * D2R, rf = .2 + (k * 53 % 70) / 100; g.beginPath(); g.arc(cx + Math.cos(an) * rf * r, cy + Math.sin(an) * rf * r, 3 + k % 3, 0, 7); g.fill(); }
  g.restore();
}
function boxShell(g, cx, cy, s, r) {   // an open pizza box seen from above
  g.save(); g.shadowColor = 'rgba(30,20,10,.45)'; g.shadowBlur = 16; g.shadowOffsetX = 8; g.shadowOffsetY = 12;
  g.fillStyle = '#C99F68'; g.beginPath(); g.roundRect(cx - s, cy - s, 2 * s, 2 * s, s * .06); g.fill(); g.shadowColor = 'transparent';
  g.lineWidth = Math.max(3, s * .025); g.strokeStyle = C.ink; g.stroke();
  g.fillStyle = '#DDBA86'; g.beginPath(); g.roundRect(cx - s * .9, cy - s * .9, 1.8 * s, 1.8 * s, s * .04); g.fill(); g.lineWidth = Math.max(2, s * .012); g.strokeStyle = 'rgba(43,34,25,.5)'; g.stroke();
  g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fillStyle = '#EEDDB8'; g.fill(); g.setLineDash([s * .05, s * .04]); g.strokeStyle = 'rgba(43,34,25,.45)'; g.lineWidth = Math.max(2, s * .012); g.stroke(); g.setLineDash([]);
  g.restore();
}
function radial(g, cx, cy, r, an, u, w = 4, dash) {   // a line from the centre out to the rim, drawn to fraction u
  if (u <= 0) return; g.save(); if (dash) g.setLineDash(dash); g.strokeStyle = C.ink; g.lineWidth = w; g.lineCap = 'round';
  g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(an * D2R) * r * u, cy + Math.sin(an * D2R) * r * u); g.stroke(); g.restore();
}
function pieceAt(key, t) {   // where a leftover is: on its tray, flying, or in the box
  const t0 = key === 'ani' ? T.aniFly : T.budFly, [x0, y0] = TRAY[key];
  if (t < t0) return { x: x0, y: y0, k: 1, h: 0, onTray: true };
  const u = clamp((t - t0) / FLY, 0, 1), e = EASE.io(u);
  return { x: lerp(x0, BOX.x, e), y: lerp(y0, BOX.y, e) - Math.sin(Math.PI * u) * 340, k: 1 + .12 * Math.sin(Math.PI * u), h: Math.sin(Math.PI * u), onTray: false, landed: u >= 1 };
}
function drawPiece(g, key, t) {
  const p = pieceAt(key, t), [a0, a1] = PIECE[key];
  let glow = 0; const hl = key === 'ani' ? T.hA : T.hB; if (t > hl && t < hl + 1.2) glow = Math.sin(Math.PI * (t - hl) / 1.2);
  if (t > T.beda && t < T.knife) glow = Math.max(glow, .5 + .5 * Math.sin((t - T.beda) * 7));
  g.save(); if (p.h > 0) { g.shadowColor = 'rgba(30,20,10,.35)'; g.shadowBlur = 30 * p.h; g.shadowOffsetX = 30 * p.h; g.shadowOffsetY = 50 * p.h; }
  g.translate(p.x, p.y); g.scale(p.k, p.k); g.translate(-p.x, -p.y);
  pizzaPiece(g, p.x, p.y, PR_, a0, a1, key === 'ani' ? COLA : COLB, glow); g.restore();
}
function trays(g, t) {
  for (const key of ['ani', 'bud']) {
    const [x, y] = TRAY[key]; tray(g, x, y, PR_ + 6, t < (key === 'ani' ? T.aniFly : T.budFly) ? 6 : 14);
    if (t < (key === 'ani' ? T.aniFly : T.budFly) + .01) drawPiece(g, key, t);
    nameTag(g, key, key === 'ani' ? 'Ani' : 'Budi', x, y + 205, key === 'ani' ? COLA : COLB);
  }
}
function nameTag(g, id, text, x, y, col) {
  g.save(); g.font = '44px Lilita'; const w = g.measureText(text).width + 38; g.translate(x, y);
  g.shadowColor = 'rgba(30,20,10,.3)'; g.shadowBlur = 6; g.shadowOffsetY = 4; g.fillStyle = col; g.beginPath(); g.roundRect(-w / 2, -28, w, 56, 28); g.fill(); g.shadowColor = 'transparent';
  g.lineWidth = 4; g.strokeStyle = C.ink; g.stroke(); g.fillStyle = '#FBF3DF'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 0, 3);
  noteText(g, 'tag-' + id, text, -w / 2, -28, w / 2, 28); TXT[TXT.length - 1].pass = true; g.restore();
}

// ---------------------------------------------------------------- places
function hookCard(g) {   // fully there on frame 1 (it is the thumbnail)
  drawCard(g, PAT.hook, { c: [540, 560], rot: -1.2, h: 0 });
  g.save(); g.translate(540, 560); g.rotate(-1.2 * D2R);
  pill(g, 'h-pill', 'PECAHAN', 0, -285, 44);
  rich(g, 'h-1', [['Sisa pizza ', C.ink], ['Ani', COLA], ['  ', C.ink], ['F{1}{2}', YEL]], 0, -160, 68);
  rich(g, 'h-2', [['Sisa pizza ', C.ink], ['Budi', COLB], ['  ', C.ink], ['F{1}{3}', YEL]], 0, -50, 68);
  rich(g, 'h-3', [['Digabung ke ', C.ink], ['1', YEL], [' kotak,', C.ink]], 0, 50, 56);
  rich(g, 'h-4', [['terisi ', C.ink], ['berapa bagian?', RED]], 0, 135, 64);
  mathLine(g, 'h-5', 'F{1}{2} + F{1}{3} = F{2}{5} ?', 0, 262, 84, RED);
  g.restore();
}
function trapCard(g, t) {
  const [x, y] = TRAP; card(g, PAT.trap, x, y, 1, t, T.toTrap + .5);
  onCard(g, x, y, 1, t, T.toTrap + .5, () => {
    pill(g, 'tr-pill', 'JEBAKAN', 0, -300, 44, RED);
    mathLine(g, 'tr-1', 'F{1}{2} + F{1}{3}', 0, -110, 104, C.ink, t, T.trap1);
    mathLine(g, 'tr-2', '= F{1 + 1}{2 + 3}', 0, 90, 104, C.ink, t, T.trap2);
    mathLine(g, 'tr-3', '= F{2}{5} ?', 0, 290, 104, RED, t, T.trap3);
  });
}
function theBox(g, t, tq) {
  const { x, y, s, r } = BOX; boxShell(g, x, y, s, r);
  // proof: five equal slots, two of them red; the half line
  const pf = fade(tq, T.clear);
  if (tq > T.five && pf > 0) {
    g.save(); g.globalAlpha = pf;
    const u = clamp((tq - T.five) / .6, 0, 1);
    if (tq > T.five + .5) { const v = clamp((tq - T.five - .5) / .4, 0, 1); g.save(); g.globalAlpha *= .55 * v; g.fillStyle = RED; g.fill(sectorPath(x, y, r - 4, 270, 414)); g.restore();
      g.save(); g.clip(sectorPath(x, y, r - 4, 270, 414)); g.strokeStyle = 'rgba(120,30,20,.5)'; g.lineWidth = 3; for (let k = -12; k < 12; k++) { g.beginPath(); g.moveTo(x + k * 22 - 200, y - 200); g.lineTo(x + k * 22 + 200, y + 200); g.stroke(); } g.restore(); }
    for (let k = 0; k < 5; k++) radial(g, x, y, r, 270 + 72 * k, clamp(u * 5 - k * .8, 0, 1), 4);
    if (tq > T.half) { const v = clamp((tq - T.half) / .4, 0, 1); radial(g, x, y, r + 22, 90, v, 5, [14, 10]); radial(g, x, y, r + 22, 270, v, 5, [14, 10]); }
    g.restore();
  }
  // the leftovers in the box
  for (const key of ['ani', 'bud']) { const t0 = key === 'ani' ? T.aniFly : T.budFly; if (t > t0 + FLY) drawPiece(g, key, t); }
  // sixths
  if (tq > T.knife) {
    [90, 30, 150].forEach((an, k) => { const u = clamp((tq - T.knife - k * .55) / .45, 0, 1); radial(g, x, y, r, an, u, 5); radial(g, x, y, r, an + 180, u, 5); });
  }
  const tint = (a0, a1, col, t0) => { const k = clamp((tq - t0) / .2, 0, 1); if (k <= 0) return; g.save(); g.globalAlpha = .38 * k; g.fillStyle = col; g.fill(sectorPath(x, y, PR_ - 2, a0, a1)); g.restore(); };
  SLOTS.slice(0, 3).forEach(([a0, a1], i) => tint(a0, a1, '#FFF1C2', T.aS + i * .4));
  SLOTS.slice(3).forEach(([a0, a1], i) => tint(a0, a1, '#CFE3F5', T.bS + i * .4));
  // counting 1..5
  SLOTS.forEach(([a0, a1], i) => {
    const tc = T.count + (i < 3 ? i * .25 : .95 + (i - 3) * .25), k = popIn(tq, tc, .2); if (k <= 0) return;
    const an = (a0 + a1) / 2 * D2R, cx = x + Math.cos(an) * PR_ * .58, cy = y + Math.sin(an) * PR_ * .58;
    g.save(); g.translate(cx, cy); g.scale(k, k); g.beginPath(); g.arc(0, 0, 22, 0, 7); g.fillStyle = i < 3 ? COLA : COLB; g.fill(); g.lineWidth = 3.5; g.strokeStyle = C.ink; g.stroke();
    g.fillStyle = '#FBF3DF'; g.font = '30px Lilita'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(i + 1), 0, 2); noteText(g, 'n' + i, String(i + 1), -18, -18, 18, 18); TXT[TXT.length - 1].pass = true; g.restore();
  });
  // the empty sixth
  if (tq > T.empty) { const p = .5 + .5 * Math.sin((t - T.empty) * 6); g.save(); g.globalAlpha = .25 + .35 * p; g.fillStyle = '#FFFFFF'; g.fill(sectorPath(x, y, r - 4, 30, 90)); g.restore();
    g.save(); g.setLineDash([8, 6]); g.strokeStyle = RED; g.lineWidth = 4; g.stroke(sectorPath(x, y, r - 4, 30, 90)); g.restore(); }
}
function boxLabels(g, t, tq) {
  const { x, y } = BOX, a = fade(tq, T.clear);
  g.save(); g.globalAlpha = a;
  if (tq > T.five + .5) mathSlip(g, 'l-25', 'F{2}{5}', x + 80, y - 55, 3, tq, T.five + .6, { size: 46, bg: '#FBE3DC', color: RED, dy: 60 });
  if (tq > T.half) mathSlip(g, 'l-half', 'F{1}{2} kotak', x + 150, y - 280, -2, tq, T.half + .2, { size: 36, dy: 60 });
  stampWord(g, x - 40, y - 330, -6, tq, T.imp, 'MUSTAHIL!', 40);
  g.restore();
  if (tq > T.beda && tq < T.knife + .6) { g.save(); g.globalAlpha = fade(tq, T.knife); slip(g, 'beda', 'potongannya beda ukuran', x, y - 300, -2, tq, T.beda, { font: '40px Lilita', h: 72, dy: 60 }); g.restore(); }
  g.save(); g.globalAlpha = fade(tq, T.five6 - .25);
  if (tq > T.eqA) mathSlip(g, 'eqA', 'F{1}{2} = F{3}{6}', x - 135, y - 275, -2, tq, T.eqA, { size: 38, bg: '#FBEFC9', dy: 60 });
  if (tq > T.eqB) mathSlip(g, 'eqB', 'F{1}{3} = F{2}{6}', x + 135, y - 275, 2, tq, T.eqB, { size: 38, bg: '#DCEAF5', dy: 60 });
  g.restore();
  stampMath(g, x, y - 285, -4, tq, T.five6, 'F{5}{6}', 58);
  if (tq > T.empty) mathSlip(g, 'kosong', 'F{1}{6} kosong', x + 105, y + 222, -3, tq, T.empty + .2, { size: 32, dy: 60 });
}
function ruleCard(g, t) {
  const [x, y] = RULE; card(g, PAT.rule, x, y, -1, t, T.toRule + .3);
  onCard(g, x, y, -1, t, T.toRule + .3, () => {
    pill(g, 'r-pill', 'CARANYA', 0, -275, 44);
    mathLine(g, 'r-1', 'F{1}{2} + F{1}{3} = F{3}{6} + F{2}{6} = F{5}{6}', 0, -95, 96, C.ink, t, T.rule);
    mathLine(g, 'r-2', '6 = KPK(2, 3)', 0, 45, 62, '#2D5F8A', t, T.kpk);
    if (t > T.step1) rich(g, 'r-3', [['1. Samakan ', C.ink], ['penyebut', RED]], 0, 160, 60);
    if (t > T.step2) rich(g, 'r-4', [['2. Jumlahkan ', C.ink], ['pembilang', COLB]], 0, 255, 60);
  });
}
function bonusCard(g, t) {   // the same kind of problem with new numbers: ⅓ + ¼ (answer 7⁄12, pinned later)
  const [x, y] = BONUS; card(g, PAT.bonus, x, y, -1.5, t, T.bonus - .2);
  onCard(g, x, y, -1.5, t, T.bonus - .2, () => {
    pill(g, 'b-pill', 'TANTANGAN', 0, -320, 44, RED);
    rich(g, 'b-1', [['Sisa pizza ', C.ink], ['Ani', COLA], ['  ', C.ink], ['F{1}{3}', YEL]], 0, -205, 62);
    rich(g, 'b-2', [['Sisa pizza ', C.ink], ['Cici', COLC], ['  ', C.ink], ['F{1}{4}', YEL]], 0, -105, 62);
    // two trays → one empty box
    const k = .5, by = 55;
    for (const [tx, a0, a1, col] of [[-235, 270, 390, COLA], [-25, 270, 360, COLC]]) {
      g.save(); g.translate(tx, by); g.scale(k, k); tray(g, 0, 0, PR_ + 6, 6); pizzaPiece(g, 0, 0, PR_, a0, a1, col); g.restore();
    }
    rich(g, 'b-plus', [['+', C.ink]], -130, by + 22, 70);
    g.save(); g.strokeStyle = C.ink; g.lineWidth = 7; g.lineCap = 'round'; const ax0 = 85, ax1 = 165, w = Math.sin((t - T.bonus) * 5) * 6;
    g.beginPath(); g.moveTo(ax0 + w, by); g.lineTo(ax1 + w, by); g.moveTo(ax1 - 22 + w, by - 20); g.lineTo(ax1 + w, by); g.lineTo(ax1 - 22 + w, by + 20); g.stroke(); g.restore();
    g.save(); g.translate(300, by); g.scale(k, k); boxShell(g, 0, 0, BOX.s, BOX.r); g.restore();
    rich(g, 'b-q', [['?', RED]], 302, by + 30, 90);
    rich(g, 'b-3x', [['Terisi ', C.ink], ['berapa bagian?', RED]], 0, 225, 60);
    rich(g, 'b-3', [['jawab di komentar ↓', C.ink]], 0, 325, 46);
  });
}
function ctaCard(g, t) {
  const [x, y] = CTA; card(g, PAT.cta, x, y, 1.2, t, T.cta);
  onCard(g, x, y, 1.2, t, T.cta, () => {
    pill(g, 'c-pill', 'KOMENTAR', 0, -200, 44, '#2D5F8A');
    rich(g, 'c-1', [['Mau dibahas', C.ink]], 0, -75, 76);
    rich(g, 'c-2', [['soal ', C.ink], ['apa lagi?', RED]], 0, 20, 76);
    rich(g, 'c-3', [['tulis di komentar ↓', C.ink]], 0, 130, 54);
  });
}
// the bottom block (fixed screen layout): caption ends at CAP_BOTTOM, watermark under it, below y 1560 left to the app UI
const CAP_BOTTOM = 1480, WM_Y = 1530;
function watermark(g, t) {
  const a = clamp((t - T.pull0 + .3) / .6, 0, 1); if (a <= 0) return;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = .4 * a; g.font = '40px Lilita'; g.letterSpacing = '10px'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineJoin = 'round'; g.lineWidth = 7; g.strokeStyle = '#FBF3DF'; g.strokeText('HAWREIREI', W / 2 + 5, WM_Y); g.fillStyle = C.ink; g.fillText('HAWREIREI', W / 2 + 5, WM_Y);
  g.letterSpacing = '0px'; noteText(g, 'wm', 'HAWREIREI', W / 2 - 180, WM_Y - 24, W / 2 + 190, WM_Y + 24); TXT[TXT.length - 1].pass = true; g.restore();
}

// ---------------------------------------------------------------- the host (creator's stickers): [t, feet x, feet y, scale]
const HOSTK = [[0, 880, 1300, 1], [T.pull0, 880, 1300, 1], [T.toTrap + 1.1, 1270, 1345, .9], [T.toBox, 1270, 1345, .9], [T.toBox + 1.0, 847, 2240, .5],
  [T.toRule, 847, 2240, .5], [T.toRule + .8, 650, 3270, .8], [T.toBonus, 650, 3270, .8], [T.toBonus + .8, 640, 4075, .8], [T.cta - .5, 640, 4075, .8], [T.cta + .4, 650, 4830, .8], [DUR, 650, 4830, .8]];
function hostAt(t) {
  let i = 1; while (i < HOSTK.length - 1 && t > HOSTK[i][0]) i++;
  const a = HOSTK[i - 1], b = HOSTK[i], u = EASE.io(clamp((t - a[0]) / (b[0] - a[0]), 0, 1)), k = lerp(a[3], b[3], u);
  return [lerp(a[1], b[1], u), lerp(a[2], b[2], u) - (u > 0 && u < 1 && (a[1] !== b[1] || a[2] !== b[2]) ? Math.sin(Math.PI * u) * 260 * k : 0), k];
}
const SPR = {}; let VOENV = [];
const BODY_H = 380, SHEET_BODY = { a: 361, b: 510 };
const POSE = { neutral: ['a', 0], palms: ['a', 1], cheer: ['a', 2], cheeks: ['a', 3], armsup: ['a', 4], present: ['a', 5],
  think: ['b', 1], idea: ['b', 2], pointyou: ['b', 3], confused: ['b', 4], wrong: ['b', 5], thumbs: ['b', 6], write: ['b', 7], wave: ['b', 14],
  walkA: ['b', 15], walkB: ['b', 16], shrug: ['b', 17], clap: ['b', 18], pointer: ['b', 21], crossed: ['b', 24] };
function hostPoseName(t) {
  if (t < T.ask) return 'think';
  if (t < T.pull0) return 'palms';                       // "Kotaknya terisi berapa bagian?"
  if (t < T.toTrap + 1.1) return 'armsup';
  if (t < T.trap2) return 'pointyou';                    // "Jangan jawab dulu."
  if (t < T.trap3) return 'think';
  if (t < T.toBox) return 'shrug';                       // "… dua per lima."
  if (t < T.toBox + 1.0) return 'neutral';
  if (t < T.aniFly) return 'think';
  if (t < T.imp) return 'pointer';
  if (t < T.clear) return 'wrong';                       // "Jadi, tidak mungkin."
  if (t < T.beda) return 'think';
  if (t < T.knife - .4) return 'confused';               // "beda ukuran"
  if (t < T.aS) return 'idea';                           // "kita bagi enam"
  if (t < T.count) return 'pointer';
  if (t < T.five6) return 'clap';
  if (t < T.empty) return 'cheer';                       // "lima per enam!"
  if (t < T.toRule + .8) return 'present';
  if (t < T.kpk) return 'think';
  if (t < T.step1) return 'idea';                        // "ka-pé-ka dari dua dan tiga"
  if (t < T.toBonus + .8) return 'pointer';
  if (t < T.cta - .5) return 'crossed';
  if (t < T.out) return 'present';
  return 'wave';
}
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

// ---------------------------------------------------------------- frame
function renderFilm(t) {
  TXT = [];
  const g = MAIN, tq = twos(t), cam = camAt(t), v = viewOf(cam);
  g.setTransform(1, 0, 0, 1, 0, 0); g.shadowColor = 'transparent'; g.globalAlpha = 1;
  g.fillStyle = tablePat; g.fillRect(0, 0, W, H);
  applyCam(g, cam);
  drawSheet(g, v);
  if (v.y0 < 950 && v.x0 < 1100) hookCard(g);
  if (v.x1 > 1250 && v.y0 < 1450) trapCard(g, tq);
  if (v.y1 > 1600 && v.y0 < 2500) { theBox(g, t, tq); boxLabels(g, t, tq); }
  if (v.y1 > 2500) ruleCard(g, tq);
  if (v.y1 > 3300) bonusCard(g, tq);
  if (v.y1 > 4100) ctaCard(g, tq);
  trays(g, t);
  for (const key of ['ani', 'bud']) { const t0 = key === 'ani' ? T.aniFly : T.budFly; if (t > t0 && t <= t0 + FLY) drawPiece(g, key, t); }   // in flight: above everything
  drawHost(g, t);
  g.setTransform(1, 0, 0, 1, 0, 0);
  vignette(g, .14);
  watermark(g, t);
  caption(t);
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
  [[0, 'intro'], [T.toTrap, 'go'], [T.toBox, 'run'], [T.five6 - .2, 'meet'], [T.toRule, 'tree'], [T.kpk, 'answer'], [T.bonus, 'bonus'], [T.cta, 'cta'], [T.out, 'end']].forEach(([t, name]) => E(t, 'sec', { name }));
  E(0, 'room', { d: DUR }); if (ALIGN) E(VO_OFF, 'vo', { id: 'full' });
  E(T.hA, 'pop', { pan: -.5 }); E(T.hB, 'pop', { pan: -.1 });
  E(T.pull0, 'swish', { d: 1.0 }); E(T.toTrap + .3, 'hop', { pan: .3 }); E(T.toTrap + .5, 'slap');
  E(T.trap1, 'slapS', { pan: -.2 }); E(T.trap2, 'slapS'); E(T.trap2 + .3, 'scribble', { d: .5 }); E(T.trap3, 'slapS', { pan: .2 });
  E(T.toBox, 'swish', { d: 1.0 }); E(T.toBox + .2, 'hop', { pan: -.3 });
  E(T.five, 'scribble', { d: .6 }); E(T.five + .6, 'slapS', { pan: .3 }); E(T.half, 'scribble', { d: .4 }); E(T.half + .2, 'slapS', { pan: .4 });
  E(T.aniFly, 'swish', { d: FLY }); E(T.aniFly + FLY, 'dep', { key: 'A', m: 1, pan: -.3 });
  E(T.imp - .3, 'swish', { d: .3 }); E(T.imp, 'stamp');
  E(T.clear, 'pageout', { d: .6 }); E(T.budFly, 'swish', { d: FLY }); E(T.budFly + FLY, 'dep', { key: 'B', m: 5, pan: .3 });
  E(T.beda, 'slap'); for (let k = 0; k < 3; k++) E(T.knife + k * .55, 'scribble', { d: .45, pan: -.3 + k * .3 });
  for (let i = 0; i < 3; i++) E(T.aS + i * .4, 'pop', { pan: -.4 }); E(T.eqA, 'slapS', { pan: -.3 });
  for (let i = 0; i < 2; i++) E(T.bS + i * .4, 'pop', { pan: .4 }); E(T.eqB, 'slapS', { pan: .3 });
  [1, 4, 7, 10, 13].forEach((m, i) => E(T.count + (i < 3 ? i * .25 : .95 + (i - 3) * .25), 'dep', { key: i < 3 ? 'A' : 'B', m: i < 3 ? m : (i === 3 ? 5 : 9), pan: i < 3 ? -.3 : .3 }));
  E(T.five6 - .3, 'swish', { d: .3 }); E(T.five6, 'stamp'); E(T.empty, 'chime');
  E(T.toRule, 'swish', { d: .9 }); E(T.toRule + .1, 'hop', { pan: -.3 }); E(T.toRule + .3, 'slap');
  E(T.rule, 'slapS'); E(T.kpk, 'chime'); E(T.step1, 'pop', { pan: -.2 }); E(T.step2, 'pop', { pan: .2 });
  E(T.toBonus, 'swish', { d: .8 }); E(T.toBonus + .3, 'hop', { pan: -.3 }); E(T.bonus, 'slap');
  E(T.cta - .6, 'swish', { d: .8 }); E(T.cta - .5, 'hop', { pan: -.3 }); E(T.cta + .2, 'slap');
  E(T.out, 'pageout', { d: 2.0 });
  return ev.sort((a, b) => a.t - b.t);
}

// ---------------------------------------------------------------- boot
async function boot() {
  await Promise.all([document.fonts.load('92px Lilita', 'Sisa pizza 1 2'), document.fonts.load('40px Fell', 'Angka'), document.fonts.load('62px OldStdB', '0123456789±–×=°/−+…?'),
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
  PAT.trap = bakeCard({ path: rectPath(880, 760), bw: 880, bh: 760, col: '#FBF3DF', seed: 64, dashed: false, rim: 9, print: g => { g.strokeStyle = 'rgba(184,57,44,.8)'; g.lineWidth = 5; g.setLineDash([22, 12]); g.strokeRect(-420, -360, 840, 720); } });
  PAT.rule = plain(960, 680, 66, 'rgba(43,34,25,.8)');
  PAT.bonus = bakeCard({ path: rectPath(1000, 780), bw: 1000, bh: 780, col: '#FBF3DF', seed: 62, dashed: false, rim: 9, print: g => { g.strokeStyle = 'rgba(184,57,44,.8)'; g.lineWidth = 5; g.setLineDash([22, 12]); g.strokeRect(-480, -370, 960, 740); } });
  PAT.cta = plain(900, 520, 83, 'rgba(45,95,138,.8)');
  window.render = t => renderFilm(t);
  window.READY = true;
}
boot();
