// HAWREIREI — "4 × 5 itu 4+4+4+4+4 atau 5+5+5+5?" 9:16, one continuous paper world (see hawreirei-style/STYLE.md).
// Story: Budi's homework is crossed out in red → a 2014 viral case → which reading? → the symbol: front = number of groups,
// back = what is in each group (Kemendikbud grade-2 book) → reversed picture → the word "tiap" → only a convention (Japan
// writes it the other way) → the array turns: still 20 → key line → algebra 3a → back to Budi's homework, fixed → challenge.
const DUR = 115.5;
window.DUR = DUR;
const T = {   // film seconds, set from vo/el/align.json (voice segment + VO_OFF 0.3)
  pull0: 11.3, twenty: 13.0, why: 15.3,
  toViral: 16.5, phone: 17.0, cm: 19.4, prof: 22.8,
  toQ: 25.3, optA: 28.0, optB: 29.6, qmark: 30.9,
  toSym: 32.0, sym: 32.5, lblA: 35.2, lblB: 37.4, boxes: 40.9, cookies: 41.9, strip: 43.4,
  toRev: 46.2, rev: 47.3, revBox: 48.2, rev20: 49.9, revNote: 50.9,
  toTiap: 52.6, sent: 53.3, tiap: 54.5, fly5: 57.3, fly4: 58.0,
  toJp: 58.8, idn: 59.6, kes: 61.4, jp: 62.8,
  toArr: 65.5, grid: 68.4, rot: 70.9, tetap: 73.5,
  toKey: 74.4, scope: 75.8, key1: 79.6, key2: 80.5,
  toAlg: 81.6, alg: 83.0, split: 86.3, algLbl: 87.6,
  toBack: 88.6, unmark: 90.4, rewrite: 91.2, check: 93.0,
  toBonus: 95.8, bonus: 96.9, cta: 101.6, out: 111.2, end: 114.2,
};
let VO_OFF = 0.3;
const SAY = {
  v01: { p: ['PR Budi dicoret merah.', 'Soalnya: tulis 4 × 5 sebagai penjumlahan berulang.', 'Budi menulis 4 + 4 + 4 + 4 + 4.'], s: [1, 3] },
  v02: { p: ['Kalau dihitung, hasilnya 20. Benar!', 'Lalu… kenapa disalahkan?'], s: [2] },
  v03: { p: ['Ternyata Budi tidak sendirian.', 'Tahun 2014, kasus serupa viral di media sosial.', 'Bahkan dua profesor ikut berbeda pendapat.'], s: [1, 2] },
  v04: { p: ['Jadi, 4 × 5 itu yang mana?', '4 diulang 5 kali, atau 5 diulang 4 kali?'], s: [1] },
  v05: { p: ['Lihat simbolnya. Di buku kelas 2 dari Kemendikbud,', 'angka di depan adalah banyaknya kelompok,', 'angka di belakang adalah isinya.', 'Jadi 4 × 5: 4 kotak, tiap kotak 5 kue.', '5 + 5 + 5 + 5.'], s: [2, 3, 4, 7] },
  v06: { p: ['Kalau dibalik, 5 × 4: 5 kotak, tiap kotak 4 kue.', 'Hasilnya sama, gambarnya beda.'], s: [4] },
  v07: { p: ['Di soal cerita, cari kata "tiap".', 'Angka setelah "tiap" itu isinya, taruh di belakang.'], s: [1] },
  v08: { p: ['Apakah ini aturan mutlak? Ternyata bukan.', 'Ini kesepakatan. Di Jepang, urutan artinya justru kebalikannya.'], s: [2] },
  v09: { p: ['Kabar baiknya, hasilnya tidak pernah berubah.', 'Susun kuenya 4 baris isi 5, lalu putar…', 'jadi 5 baris isi 4. Tetap 20.'], s: [1, 2] },
  v10: { p: ['Jadi untuk soal cerita, gambar, atau penjumlahan berulang,', 'ingat ini: depan itu kelompok, belakang itu isi.'], s: [1] },
  v11: { p: ['Kesepakatan ini terpakai sampai SMP.', 'Di aljabar, 3a artinya a + a + a.'], s: [1] },
  v12: { p: ['Jadi coretan merahnya ada dasarnya.', 'Budi tidak salah hitung,', 'dia hanya belum memakai arti simbol yang sama dengan bukunya.'], s: [1, 2] },
  v13: { p: ['Sekarang giliranmu. Ada 3 piring, tiap piring berisi 6 kue.', 'Tulis perkaliannya di komentar!'], s: [2] },
  v14: { p: ['Dan dulu kamu diajari yang mana:', '4 + 4 + 4 + 4 + 4, atau 5 + 5 + 5 + 5?', 'Tulis juga, ya!'], s: [1, 3] },
  v15: { p: ['Sampai jumpa di soal berikutnya!'] },
};
const DRAFT = {
  v01: [.3, 7.5, [2.2, 5.0]], v02: [7.9, 11.5, [10.0]], v03: [11.9, 19.1, [13.8, 16.9]], v04: [19.5, 25.0, [21.4]],
  v05: [25.4, 36.9, [28.0, 29.9, 31.6, 35.0]], v06: [37.3, 42.5, [41.2]], v07: [42.9, 47.7, [45.0]], v08: [48.1, 53.1, [50.0]],
  v09: [53.5, 61.0, [55.6, 58.6]], v10: [61.4, 67.2, [64.4]], v11: [67.6, 72.4, [69.8]], v12: [72.8, 79.3, [75.0, 76.6]],
  v13: [79.7, 84.7, [83.0]], v14: [85.1, 93.2, [87.2, 91.6]], v15: [93.6, 95.4, []],
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


// ---------------------------------------------------------------- the world: two columns of places on one long sheet
const SHEET = { x0: -140, y0: -1000, x1: 2400, y1: 8250 };
const YEL = '#F2B632', COLA = '#E2A93B', COLB = '#4F86B5', COLC = '#5E9A5A', RED = '#C8463A', PEN = '#2D5F8A', GRN = '#2D7A3E';
const L = 540, R = 1700;
const P = { hook: [L, 1600], viral: [R, 1600], q: [L, 3250], sym: [R, 3250], rev: [L, 4700], tiap: [R, 4700], jp: [L, 6150], arr: [R, 6150], key: [L, 7600], alg: [R, 7600], bonus: [L, 120], cta: [R, 120] };
const PAT = {};
const at = (k, z = .85) => [P[k][0], P[k][1] + 40, z];

// ---------------------------------------------------------------- camera
const CAM = [
  [0, L, 2000, 1.0], [T.pull0, L, 2000, 1.0], [T.toViral, L, 2000, 1.0], [T.toViral + 1.0, ...at('viral'), 'io'],
  [T.toQ, ...at('viral')], [T.toQ + 1.0, ...at('q'), 'io'], [T.toSym, ...at('q')], [T.toSym + .9, ...at('sym'), 'io'],
  [T.toRev, ...at('sym')], [T.toRev + 1.0, ...at('rev'), 'io'], [T.toTiap, ...at('rev')], [T.toTiap + .9, ...at('tiap'), 'io'],
  [T.toJp, ...at('tiap')], [T.toJp + 1.0, ...at('jp'), 'io'], [T.toArr, ...at('jp')], [T.toArr + .9, ...at('arr'), 'io'],
  [T.toKey, ...at('arr')], [T.toKey + 1.0, ...at('key'), 'io'], [T.toAlg, ...at('key')], [T.toAlg + .9, ...at('alg'), 'io'],
  [T.toBack, ...at('alg')], [T.toBack + .8, 1120, 4600, .28, 'io'], [T.toBack + 1.6, L, 2000, 1.0, 'io'],
  [T.toBonus, L, 2000, 1.0], [T.toBonus + 1.0, ...at('bonus'), 'io'], [T.cta - .5, ...at('bonus')], [T.cta + .4, ...at('cta'), 'io'],
  [T.out, ...at('cta')], [T.end, 1130, 3625, .21, 'io'], [DUR, 1130, 3625, .205, 'lin'],
];
function camAt(t) {
  let i = 1; while (i < CAM.length - 1 && t > CAM[i][0]) i++;
  const a = CAM[i - 1], b = CAM[i], u = EASE[b[4] || 'io'](clamp((t - a[0]) / (b[0] - a[0]), 0, 1));
  const f = [lerp(a[1], b[1], u), lerp(a[2], b[2], u)], z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), u));
  let sx = 0, sy = 0, sr = 0;
  for (const [t0, am] of [[T.kes, 6], [T.tetap, 6], [T.check, 7], [T.qmark, 3]]) { const s = shake(t, t0, am); sx += s[0]; sy += s[1]; sr += s[2]; }
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

// ---------------------------------------------------------------- cookies, boxes, plates
const DICE = { 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [0, -1], [1, -1], [-1, 1], [0, 1], [1, 1]] };
function cookie(g, x, y, r, k = 1, seed = 0) {
  if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); g.rotate(seed * 1.7);
  g.beginPath(); g.arc(0, 0, r, 0, 7); g.fillStyle = '#D9A15B'; g.fill(); g.lineWidth = Math.max(2, r * .12); g.strokeStyle = C.ink; g.stroke();
  g.beginPath(); g.arc(0, 0, r * .72, 0, 7); g.strokeStyle = 'rgba(150,90,40,.45)'; g.lineWidth = r * .1; g.stroke();
  g.fillStyle = '#4A2F1E'; for (const [a, d] of [[.3, .45], [2.2, .5], [3.9, .35], [5.1, .55], [1.2, .1]]) { g.beginPath(); g.arc(Math.cos(a) * r * d, Math.sin(a) * r * d, r * .13, 0, 7); g.fill(); }
  g.restore();
}
function cookieBox(g, x, y, s, n, t, t0, tc, col) {   // a box (half side s) pops in at t0; its n cookies at tc
  const k = popIn(t, t0, .22); if (k <= 0) return;
  g.save(); g.translate(x, y); g.scale(k, k);
  g.shadowColor = 'rgba(30,20,10,.3)'; g.shadowBlur = 8; g.shadowOffsetX = 4; g.shadowOffsetY = 6;
  g.fillStyle = '#C99F68'; g.beginPath(); g.roundRect(-s, -s, 2 * s, 2 * s, s * .12); g.fill(); g.shadowColor = 'transparent';
  g.lineWidth = Math.max(3, s * .05); g.strokeStyle = col || C.ink; g.stroke();
  g.fillStyle = '#E3C796'; g.beginPath(); g.roundRect(-s * .84, -s * .84, s * 1.68, s * 1.68, s * .08); g.fill();
  (DICE[n] || []).forEach(([dx, dy], i) => cookie(g, dx * s * .48, dy * s * .48, s * .26, popIn(t, tc + i * .08, .18), i));
  g.restore();
}
function plate(g, x, y, r, n, t, t0) {
  const k = popIn(t, t0, .22); if (k <= 0) return;
  g.save(); g.translate(x, y); g.scale(k, k);
  g.shadowColor = 'rgba(30,20,10,.3)'; g.shadowBlur = 8; g.shadowOffsetY = 6; g.beginPath(); g.ellipse(0, 0, r, r * .8, 0, 0, 7); g.fillStyle = '#FBF8F0'; g.fill(); g.shadowColor = 'transparent';
  g.lineWidth = 4; g.strokeStyle = C.ink; g.stroke(); g.beginPath(); g.ellipse(0, 0, r * .74, r * .58, 0, 0, 7); g.strokeStyle = 'rgba(79,134,181,.5)'; g.lineWidth = 3; g.stroke();
  (DICE[n] || []).forEach(([dx, dy], i) => cookie(g, dx * r * .42, dy * r * .3, r * .2, 1, i));
  g.restore();
}
function flag(g, x, y, kind) {
  g.save(); g.translate(x, y); g.lineWidth = 3; g.strokeStyle = C.ink;
  if (kind === 'id') { g.fillStyle = '#CE2B2B'; g.fillRect(-45, -30, 90, 30); g.fillStyle = '#FFFFFF'; g.fillRect(-45, 0, 90, 30); }
  else { g.fillStyle = '#FFFFFF'; g.fillRect(-45, -30, 90, 60); g.fillStyle = '#BC002D'; g.beginPath(); g.arc(0, 0, 17, 0, 7); g.fill(); }
  g.strokeRect(-45, -30, 90, 60); g.restore();
}
function arrowDown(g, x, y0, y1, col, u = 1) {
  if (u <= 0) return; const y = lerp(y0, y1, u); g.save(); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 7; g.lineCap = 'round';
  g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y); g.stroke(); if (u > .9) { g.beginPath(); g.moveTo(x - 16, y - 18); g.lineTo(x, y + 4); g.lineTo(x + 16, y - 18); g.fill(); } g.restore();
}
function popRich(g, id, parts, x, y, size, t, t0) { const k = popIn(t, t0, .22); if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); rich(g, id, parts, 0, 0, size); g.restore(); }

// ---------------------------------------------------------------- A: Budi's homework (frame 1 = thumbnail)
function hookCard(g, t) {
  drawCard(g, PAT.hook, { c: P.hook, rot: -1.2, h: 0 });
  g.save(); g.translate(...P.hook); g.rotate(-1.2 * D2R);
  pill(g, 'h-pill', 'PR MATEMATIKA', -40, -285, 42);
  rich(g, 'h-name', [['Nama: ', C.ink], ['Budi', COLB]], 455, -273, 38, 'right');
  rich(g, 'h-q1', [['Tulis ', C.ink], ['4 × 5', YEL], [' sebagai', C.ink]], 0, -160, 64);
  rich(g, 'h-q2', [['penjumlahan berulang.', C.ink]], 0, -78, 60);
  // Budi's answer (blue pen), crossed out in red; later rewritten
  const gone = clamp((t - T.unmark) / .5, 0, 1);
  g.save(); g.globalAlpha = 1 - gone; g.font = 'italic 84px OldStdIt'; g.textAlign = 'center'; g.fillStyle = PEN; g.fillText('4 + 4 + 4 + 4 + 4', -70, 95);
  noteText(g, 'h-ans', '4 + 4 + 4 + 4 + 4', -360, 20, 280, 110);
  g.strokeStyle = 'rgba(200,70,58,.85)'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(-370, 68); g.quadraticCurveTo(-70, 56, 230, 72); g.stroke();
  g.lineWidth = 12; g.beginPath(); g.moveTo(330, 10); g.lineTo(440, 110); g.moveTo(440, 10); g.lineTo(330, 110); g.stroke();
  g.restore();
  if (t > T.rewrite) {   // the new answer is written left to right
    const u = clamp((t - T.rewrite) / 1.3, 0, 1); g.save(); g.beginPath(); g.rect(-400, 0, 740 * u, 140); g.clip();
    g.font = 'italic 84px OldStdIt'; g.textAlign = 'center'; g.fillStyle = PEN; g.fillText('5 + 5 + 5 + 5', -70, 95); g.restore();
    if (u > .5) noteText(g, 'h-ans2', '5 + 5 + 5 + 5', -330, 20, 250, 110);
  }
  if (t > T.check) { const u = clamp((t - T.check) / .35, 0, 1); g.save(); g.strokeStyle = GRN; g.lineWidth = 14; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(320, 60); g.lineTo(320 + 40 * Math.min(1, u * 2), 60 + 45 * Math.min(1, u * 2)); if (u > .5) g.lineTo(360 + 90 * (u - .5) * 2, 105 - 120 * (u - .5) * 2); g.stroke(); g.restore(); }
  if (t > T.twenty && t < T.toBack + 1) popRich(g, 'h-20', [['hasilnya ', C.ink], ['20', YEL], ['  benar!', GRN]], -40, 225, 56, t, T.twenty);
  if (t > T.why && t < T.toBack + 1) { const p = 1 + .08 * Math.sin((t - T.why) * 7); g.save(); g.translate(395, 210); g.scale(p, p); rich(g, 'h-why', [['?', RED]], 0, 30, 110); g.restore(); }
  if (t > T.check + .3) popRich(g, 'h-ok', [['sesuai kesepakatan buku', GRN]], -40, 225, 46, t, T.check + .3);
  g.restore();
}
// Budi himself, standing by his homework
function budiPose(t) {
  const x = 245, y = 2165, s = .5;
  if (t > T.check && t < T.check + 2.5) return stand('bud', x, y, { s, head: 'wow', hL: [x - 110, y - 110], hR: [x + 110, y - 110], bL: -1, bR: 1 });
  if (t > T.rewrite - .5 && t < T.check) return stand('bud', x, y, { s, head: 'n', hR: [x + 120, y + 30] });
  if (t > T.why && t < T.why + 1.6) return stand('bud', x, y, { s, head: 'shout', hL: [x - 100, y - 60], hR: [x + 100, y - 60], bL: -1, bR: 1 });
  return stand('bud', x, y, { s, head: t > T.check ? 'n' : 'worried' });
}

// ---------------------------------------------------------------- B: the 2014 viral case (a phone on the sheet)
const COMMENTS = [['Gurunya benar!', -1, -360], ['Hasilnya sama, kok salah?', 1, -270], ['Itu kesepakatan!', -1, -170], ['Matematika kan pasti?', 1, 40], ['Kasihan anaknya…', 1, 230]];
function viralScene(g, t) {
  const [x, y] = P.viral, k = popIn(t, T.phone, .25); if (k <= 0) return;
  g.save(); g.translate(x, y - 40); g.scale(k, k);
  g.shadowColor = 'rgba(30,20,10,.4)'; g.shadowBlur = 20; g.shadowOffsetX = 10; g.shadowOffsetY = 16;
  g.fillStyle = '#2B2219'; g.beginPath(); g.roundRect(-250, -430, 500, 860, 56); g.fill(); g.shadowColor = 'transparent';
  g.fillStyle = '#FBF8F0'; g.beginPath(); g.roundRect(-228, -400, 456, 800, 36); g.fill();
  g.fillStyle = COLB; g.beginPath(); g.arc(-170, -330, 32, 0, 7); g.fill();
  rich(g, 'v-h1', [['PR kelas 2 SD', C.ink]], -120, -322, 38, 'left'); rich(g, 'v-h2', [['2014', '#7B6A57']], -120, -282, 28, 'left');
  g.fillStyle = '#F1E9D6'; g.fillRect(-200, -240, 400, 330); g.strokeStyle = 'rgba(95,147,166,.5)'; g.lineWidth = 2; for (let yy = -200; yy < 90; yy += 44) { g.beginPath(); g.moveTo(-200, yy); g.lineTo(200, yy); g.stroke(); }
  g.font = 'italic 40px OldStdIt'; g.textAlign = 'center'; g.fillStyle = PEN; g.fillText('4+4+4+4+4+4', 0, -130); g.fillText('= 4 × 6', 0, -72);
  noteText(g, 'v-ws', '4+4+4+4+4+4 = 4 × 6', -150, -170, 150, -60); TXT[TXT.length - 1].pass = true;
  g.strokeStyle = RED; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(110, -110); g.lineTo(170, -50); g.moveTo(170, -110); g.lineTo(110, -50); g.stroke();
  g.font = 'italic 34px OldStdIt'; g.fillStyle = RED; g.fillText('6 × 4', 0, 30);
  pill(g, 'v-viral', 'VIRAL', 0, 160, 46, RED);
  // two professors, two opinions
  if (t > T.prof) { const kk = popIn(t, T.prof, .25); g.save(); g.translate(0, 265); g.scale(kk, kk);
    for (const sx of [-1, 1]) { g.save(); g.translate(sx * 110, 0); g.fillStyle = '#E7B98F'; g.beginPath(); g.arc(0, 0, 38, 0, 7); g.fill(); g.lineWidth = 4; g.strokeStyle = C.ink; g.stroke();
      g.fillStyle = C.ink; g.beginPath(); g.moveTo(-50, -34); g.lineTo(0, -56); g.lineTo(50, -34); g.lineTo(0, -14); g.closePath(); g.fill(); g.fillRect(-26, -34, 52, 14); g.restore(); }
    g.save(); g.strokeStyle = RED; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(-26, -8); g.lineTo(26, -8); g.moveTo(-26, 12); g.lineTo(26, 12); g.moveTo(14, -30); g.lineTo(-14, 34); g.stroke(); g.restore(); rich(g, 'v-prof', [['2 profesor, 2 pendapat', C.ink]], 0, 92, 30); g.restore(); }
  g.restore();
  COMMENTS.forEach(([txt, side, dy], i) => { const t0 = T.cm + i * .55; if (t < t0) return; const kk = popIn(t, t0, .2);
    g.save(); g.translate(x + side * 335, y + dy); g.rotate(side * -2 * D2R); g.scale(kk, kk); slip(g, 'cm' + i, txt, 0, 0, 0, t, t0 - 1, { font: '36px Lilita', h: 64, dy: 0 }); TXT[TXT.length - 1].pass = true; g.restore(); });
}

// ---------------------------------------------------------------- C: which one?
function questionCard(g, t) {
  const [x, y] = P.q; card(g, PAT.q, x, y, 1, t, T.toQ + .5);
  onCard(g, x, y, 1, t, T.toQ + .5, () => {
    pill(g, 'q-pill', 'YANG MANA?', 0, -300, 44);
    for (const [side, n, rep, t0, col] of [[-1, '4', 5, T.optA, COLA], [1, '5', 4, T.optB, COLB]]) {
      if (t < t0) continue; const cx = side * 250;
      popRich(g, 'q-l' + n, [[n, YEL], [', diulang ' + rep + ' kali', C.ink]], cx, -180, 44, t, t0);
      for (let i = 0; i < rep; i++) { const yy = -95 + i * 82; tile(g, 'q-t' + n + i, n, cx, yy, { k: popIn(t, t0 + .25 + i * .12, .18) * .42, col: YEL }); }
      if (t > t0 + 1) popRich(g, 'q-s' + n, [[Array(rep).fill(n).join('+') + ' = 20', col]], cx, 330, 42, t, t0 + 1);
    }
    if (t > T.qmark) { const p = 1 + .06 * Math.sin((t - T.qmark) * 6); g.save(); g.translate(0, 40); g.scale(p * popIn(t, T.qmark, .25), p * popIn(t, T.qmark, .25)); rich(g, 'q-q', [['?', RED]], 0, 50, 190); g.restore(); }
  });
}
// ---------------------------------------------------------------- D: the symbol
function symbolCard(g, t) {
  const [x, y] = P.sym; card(g, PAT.sym, x, y, -1, t, T.toSym + .3);
  onCard(g, x, y, -1, t, T.toSym + .3, () => {
    tile(g, 's-4', '4', -170, -260, { k: .8 * popIn(t, T.sym, .2), col: COLA, glow: t > T.lblA && t < T.lblA + .8 ? Math.sin(Math.PI * (t - T.lblA) / .8) : 0 });
    if (t > T.sym) popRich(g, 's-x', [['×', C.ink]], 0, -228, 110, t, T.sym + .1);
    tile(g, 's-5', '5', 170, -260, { k: .8 * popIn(t, T.sym + .2, .2), col: COLB, glow: t > T.lblB && t < T.lblB + .8 ? Math.sin(Math.PI * (t - T.lblB) / .8) : 0 });
    arrowDown(g, -170, -165, -120, COLA, clamp((t - T.lblA) / .3, 0, 1)); if (t > T.lblA) popRich(g, 's-la', [['banyak kelompok', COLA]], -170, -70, 40, t, T.lblA + .2);
    arrowDown(g, 170, -165, -120, COLB, clamp((t - T.lblB) / .3, 0, 1)); if (t > T.lblB) popRich(g, 's-lb', [['isi tiap kelompok', COLB]], 170, -70, 40, t, T.lblB + .2);
    [-285, -95, 95, 285].forEach((bx, i) => cookieBox(g, bx, 85, 78, 5, t, T.boxes + i * .3, T.cookies + i * .35, COLA));
    if (t > T.strip) { const parts = []; for (let i = 0; i < 4; i++) { if (t > T.strip + i * .3) parts.push(['5', COLB]); if (i < 3 && t > T.strip + i * .3 + .15) parts.push([' + ', C.ink]); }
      if (t > T.strip + 1.2) parts.push([' = ', C.ink], ['20', YEL]); rich(g, 's-strip', parts, 0, 285, 66); }
  });
}
// ---------------------------------------------------------------- E: reversed
function reverseCard(g, t) {
  const [x, y] = P.rev; card(g, PAT.rev, x, y, 1.2, t, T.toRev + .4);
  onCard(g, x, y, 1.2, t, T.toRev + .4, () => {
    tile(g, 'r-5', '5', -150, -250, { k: .7 * popIn(t, T.rev, .2), col: COLA }); if (t > T.rev) popRich(g, 'r-x', [['×', C.ink]], 0, -222, 96, t, T.rev + .1);
    tile(g, 'r-4', '4', 150, -250, { k: .7 * popIn(t, T.rev + .2, .2), col: COLB });
    if (t > T.rev + .4) popRich(g, 'r-l', [['5', COLA], [' kotak, tiap kotak ', C.ink], ['4', COLB], [' kue', C.ink]], 0, -110, 46, t, T.rev + .4);
    [-360, -180, 0, 180, 360].forEach((bx, i) => cookieBox(g, bx, 40, 70, 4, t, T.revBox + i * .25, T.revBox + .3 + i * .25, COLA));
    if (t > T.rev20) popRich(g, 'r-20', [['4 + 4 + 4 + 4 + 4 = ', C.ink], ['20', YEL]], 0, 205, 56, t, T.rev20);
    if (t > T.revNote) popRich(g, 'r-n', [['hasil sama, ', GRN], ['gambar beda', RED]], 0, 295, 44, t, T.revNote);
  });
}
// ---------------------------------------------------------------- F: the word "tiap"
const SENT = [['4', YEL], [' kotak, ', C.ink], ['tiap', C.ink], [' kotak ', C.ink], ['5', YEL], [' kue', C.ink]];
function tiapCard(g, t) {
  const [x, y] = P.tiap; card(g, PAT.tiap, x, y, -1, t, T.toTiap + .3);
  onCard(g, x, y, -1, t, T.toTiap + .3, () => {
    pill(g, 't-pill', 'SOAL CERITA', 0, -290, 44);
    if (t < T.sent) return;
    g.save(); g.font = '68px Lilita'; const ws = SENT.map(([s]) => g.measureText(s).width), tw = ws.reduce((a, b) => a + b, 0); g.restore();
    const xs = []; let cx = -tw / 2; ws.forEach(w => { xs.push(cx + w / 2); cx += w; });
    if (t > T.tiap) { const u = clamp((t - T.tiap) / .35, 0, 1); g.save(); g.fillStyle = 'rgba(242,182,50,.55)'; g.fillRect(xs[2] - ws[2] / 2 - 8, -190, (ws[2] + 16) * u, 64); g.restore(); }
    const k = popIn(t, T.sent, .22); g.save(); g.scale(k, k);
    rich(g, 't-s', SENT.map(([s, c], i) => [((i === 0 && t > T.fly4) || (i === 4 && t > T.fly5)) ? ' '.repeat(s.length + 1) : s, c]), 0, -135, 68); g.restore();
    if (t > T.tiap) { arrowDown(g, xs[4], -210, -245, RED, 0); popRich(g, 't-after', [['angka setelah "tiap" = isi', RED]], 0, -40, 38, t, T.tiap + .3); }
    // the multiplication slots
    for (const [sx, lbl, col] of [[-170, 'kelompok', COLA], [170, 'isi', COLB]]) { g.save(); g.setLineDash([16, 10]); g.strokeStyle = col; g.lineWidth = 6; g.beginPath(); g.roundRect(sx - 80, 70, 160, 190, 18); g.stroke(); g.restore();
      rich(g, 't-lb' + lbl, [[lbl, col]], sx, 315, 38); }
    rich(g, 't-x', [['×', C.ink]], 0, 200, 96);
    for (const [ti, t0, tx] of [[4, T.fly5, 170], [0, T.fly4, -170]]) { if (t < t0) continue; const u = EASE.io(clamp((t - t0) / .6, 0, 1));
      tile(g, 't-f' + ti, SENT[ti][0], lerp(xs[ti], tx, u), lerp(-150, 165, u) - Math.sin(Math.PI * u) * 120, { k: lerp(.45, .85, u), col: ti === 4 ? COLB : COLA, lift: Math.sin(Math.PI * u) }); }
  });
}
// ---------------------------------------------------------------- G: only a convention
function japanCard(g, t) {
  const [x, y] = P.jp; card(g, PAT.jp, x, y, 1, t, T.toJp + .3);
  onCard(g, x, y, 1, t, T.toJp + .3, () => {
    for (const [side, kind, name, a, b, ca, cb, lbl, t0] of [[-1, 'id', 'Indonesia', '4', '5', COLA, COLB, 'kelompok × isi', T.idn], [1, 'jp', 'Jepang', '5', '4', COLB, COLA, 'isi × kelompok', T.jp]]) {
      if (t < t0) continue; const k = popIn(t, t0, .25), cx = side * 245; g.save(); g.translate(cx, 0); g.scale(k, k);
      flag(g, -120, -265, kind); rich(g, 'j-n' + kind, [[name, C.ink]], 60, -250, 44);
      [[-62, -100], [62, -100], [-62, 24], [62, 24]].forEach(([bx, by], i) => cookieBox(g, bx, by, 54, 5, t, t0 + .1, t0 + .2, COLA));
      rich(g, 'j-f' + kind, [[a, ca], [' × ', C.ink], [b, cb]], 0, 200, 92); rich(g, 'j-l' + kind, [[lbl, '#7B6A57']], 0, 270, 34);
      g.restore();
    }
    g.save(); g.strokeStyle = 'rgba(43,34,25,.25)'; g.lineWidth = 4; g.setLineDash([12, 10]); g.beginPath(); g.moveTo(0, -300); g.lineTo(0, 300); g.stroke(); g.restore();
    stampWord(g, 0, -355, -4, t, T.kes, 'KESEPAKATAN', 46);
  });
}
// ---------------------------------------------------------------- H: the array turns
function arrayScene(g, t) {
  const [x, y] = P.arr; if (t < T.grid - .2) return;
  const rotU = EASE.io(clamp((t - T.rot) / 1.0, 0, 1)), k = popIn(t, T.grid, .25);
  g.save(); g.translate(x, y - 40); g.scale(k, k); g.rotate(rotU * Math.PI / 2);
  g.shadowColor = 'rgba(30,20,10,.35)'; g.shadowBlur = 16; g.shadowOffsetX = 10; g.shadowOffsetY = 14;
  g.fillStyle = '#6F6A63'; g.beginPath(); g.roundRect(-300, -250, 600, 500, 30); g.fill(); g.shadowColor = 'transparent'; g.lineWidth = 5; g.strokeStyle = C.ink; g.stroke();
  g.fillStyle = '#8D877E'; g.beginPath(); g.roundRect(-276, -226, 552, 452, 20); g.fill();
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) cookie(g, -220 + c * 110, -165 + r * 110, 42, popIn(t, T.grid + .2 + r * .25 + c * .04, .18), r * 5 + c);
  g.restore();
  const before = t < T.rot + .5;
  g.save(); g.globalAlpha = before ? 1 : clamp((t - T.rot - .6) / .3, 0, 1);
  if (t > T.grid + 1.2) popRich(g, 'a-lbl' + (before ? 'a' : 'b'), before ? [['4', COLA], [' baris, isi ', C.ink], ['5', COLB]] : [['5', COLA], [' baris, isi ', C.ink], ['4', COLB]], x, y - 410, 58, t, before ? T.grid + 1.2 : T.rot + .6);
  g.restore();
  stampWord(g, x, y + 330, -5, t, T.tetap, 'TETAP 20', 58, GRN);
}
// ---------------------------------------------------------------- I: the key line
function keyCard(g, t) {
  const [x, y] = P.key; card(g, PAT.key, x, y, -1, t, T.toKey + .4);
  onCard(g, x, y, -1, t, T.toKey + .4, () => {
    ['cerita', 'gambar', 'penjumlahan berulang'].forEach((s, i) => { const t0 = T.scope + i * 1.0; if (t < t0) return; const k = popIn(t, t0, .2); g.save(); g.translate([-300, -80, 230][i], -280); g.scale(k, k); pill(g, 'k-s' + i, s, 0, 0, 34, '#7B6A57'); g.restore(); });
    if (t > T.key1) popRich(g, 'k-1', [['DEPAN', COLA], [' = kelompok', C.ink]], 0, -90, 92, t, T.key1);
    if (t > T.key2) popRich(g, 'k-2', [['BELAKANG', COLB], [' = isi', C.ink]], 0, 60, 92, t, T.key2);
    if (t > T.key2 + .6) popRich(g, 'k-3', [['4', COLA], [' × ', C.ink], ['5', COLB], [' → 4 kelompok, isi 5', C.ink]], 0, 220, 50, t, T.key2 + .6);
  });
}
// ---------------------------------------------------------------- J: algebra
function algCard(g, t) {
  const [x, y] = P.alg; card(g, PAT.alg, x, y, 1, t, T.toAlg + .3);
  onCard(g, x, y, 1, t, T.toAlg + .3, () => {
    pill(g, 'g-pill', 'DI SMP', 0, -250, 44, '#2D5F8A');
    const su = EASE.io(clamp((t - T.split) / .6, 0, 1));
    if (su < 1) tile(g, 'g-3a', '3a', 0, -60, { w: 260, k: popIn(t, T.alg, .22) * (1 - su * .3), col: YEL, bg: '#FBF3DF' });
    if (t > T.split) { g.save(); g.globalAlpha = su; [-260, 0, 260].forEach((ax, i) => tile(g, 'g-a' + i, 'a', lerp(0, ax, su), -60, { k: .8 }));
      rich(g, 'g-p1', [['+', C.ink]], -130, -25, 90); rich(g, 'g-p2', [['+', C.ink]], 130, -25, 90); g.restore(); }
    if (t > T.algLbl) popRich(g, 'g-l', [['3', COLA], [' = banyak kelompok', C.ink]], 0, 160, 54, t, T.algLbl);
  });
}
// ---------------------------------------------------------------- L, M: challenge and CTA
function bonusCard(g, t) {
  const [x, y] = P.bonus; card(g, PAT.bonus, x, y, -1.5, t, T.bonus - .2);
  onCard(g, x, y, -1.5, t, T.bonus - .2, () => {
    pill(g, 'b-pill', 'TANTANGAN', 0, -320, 44, RED);
    g.save(); g.font = '62px Lilita'; const pre = g.measureText('Ada 3 piring, ').width, tw = g.measureText('Ada 3 piring, tiap piring 6 kue').width, wt = g.measureText('tiap').width; g.restore();
    g.save(); g.fillStyle = 'rgba(242,182,50,.55)'; g.fillRect(-tw / 2 + pre - 6, -248, wt + 12, 60); g.restore();
    rich(g, 'b-1', [['Ada ', C.ink], ['3', YEL], [' piring, ', C.ink], ['tiap', C.ink], [' piring ', C.ink], ['6', YEL], [' kue', C.ink]], 0, -200, 62);
    [-300, 0, 300].forEach((px, i) => plate(g, px, -40, 120, 6, t, T.bonus + .4 + i * .25));
    for (const bx of [-200, 0]) { g.save(); g.setLineDash([14, 9]); g.strokeStyle = C.ink; g.lineWidth = 5; g.beginPath(); g.roundRect(bx - 55, 115, 110, 120, 14); g.stroke(); g.restore(); }
    rich(g, 'b-x', [['×', C.ink]], -100, 200, 76); rich(g, 'b-q', [['= ', C.ink], ['?', RED]], 150, 200, 76);
    rich(g, 'b-3', [['tulis di komentar ↓', C.ink]], 0, 300, 50);
  });
}
function ctaCard(g, t) {
  const [x, y] = P.cta; card(g, PAT.cta, x, y, 1.2, t, T.cta);
  onCard(g, x, y, 1.2, t, T.cta, () => {
    pill(g, 'c-pill', 'KOMENTAR', 0, -255, 44, '#2D5F8A');
    rich(g, 'c-1', [['Dulu kamu diajari', C.ink]], 0, -150, 64);
    rich(g, 'c-2', [['yang ', C.ink], ['mana?', RED]], 0, -62, 72);
    rich(g, 'c-3', [['4 + 4 + 4 + 4 + 4', COLA]], 0, 40, 58);
    rich(g, 'c-or', [['atau', '#7B6A57']], 0, 100, 38);
    rich(g, 'c-4', [['5 + 5 + 5 + 5', COLB]], 0, 168, 58);
    rich(g, 'c-5', [['tulis di komentar ↓', C.ink]], 0, 250, 44);
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
const hostAtPlace = k => [P[k][0] - 524, P[k][1] + 440, .72];
const HOSTK = [[0, 870, 2330, 1], [T.toViral, 870, 2330, 1], [T.toViral + 1.0, ...hostAtPlace('viral')], [T.toQ, ...hostAtPlace('viral')], [T.toQ + 1.0, ...hostAtPlace('q')],
  [T.toSym, ...hostAtPlace('q')], [T.toSym + .9, ...hostAtPlace('sym')], [T.toRev, ...hostAtPlace('sym')], [T.toRev + 1.0, ...hostAtPlace('rev')],
  [T.toTiap, ...hostAtPlace('rev')], [T.toTiap + .9, ...hostAtPlace('tiap')], [T.toJp, ...hostAtPlace('tiap')], [T.toJp + 1.0, ...hostAtPlace('jp')],
  [T.toArr, ...hostAtPlace('jp')], [T.toArr + .9, ...hostAtPlace('arr')], [T.toKey, ...hostAtPlace('arr')], [T.toKey + 1.0, ...hostAtPlace('key')],
  [T.toAlg, ...hostAtPlace('key')], [T.toAlg + .9, ...hostAtPlace('alg')], [T.toBack, ...hostAtPlace('alg')], [T.toBack + 1.6, 870, 2330, 1],
  [T.toBonus, 870, 2330, 1], [T.toBonus + 1.0, ...hostAtPlace('bonus')], [T.cta - .5, ...hostAtPlace('bonus')], [T.cta + .4, ...hostAtPlace('cta')], [DUR, ...hostAtPlace('cta')]];
function hostAt(t) {
  let i = 1; while (i < HOSTK.length - 1 && t > HOSTK[i][0]) i++;
  const a = HOSTK[i - 1], b = HOSTK[i], u = EASE.io(clamp((t - a[0]) / (b[0] - a[0]), 0, 1)), k = lerp(a[3], b[3], u);
  return [lerp(a[1], b[1], u), lerp(a[2], b[2], u) - (u > 0 && u < 1 && (a[1] !== b[1] || a[2] !== b[2]) ? Math.sin(Math.PI * u) * 260 * k : 0), k];
}
function hostPoseName(t) {
  if (t < 5.0) return 'confused';                         // "PR Budi dicoret merah."
  if (t < T.pull0) return 'think';
  if (t < T.why) return 'thumbs';                         // "hasilnya dua puluh. Benar!"
  if (t < T.toViral) return 'shrug';                      // "kenapa disalahkan?"
  if (t < T.toViral + 1.0) return 'armsup';
  if (t < T.prof) return 'cheeks';                        // the comments pile up
  if (t < T.toQ) return 'confused';
  if (t < T.qmark) return 'think';
  if (t < T.toSym + .9) return 'shrug';
  if (t < T.boxes) return 'pointer';                      // "angka di depan… angka di belakang…"
  if (t < T.strip) return 'present';
  if (t < T.toRev) return 'thumbs';
  if (t < T.revNote) return 'pointer';
  if (t < T.toTiap) return 'idea';                        // "gambarnya beda"
  if (t < T.fly5) return 'pointyou';                      // "cari kata tiap"
  if (t < T.toJp) return 'clap';
  if (t < T.kes) return 'think';                          // "Apakah ini aturan mutlak?"
  if (t < T.jp) return 'idea';                            // "Ini kesepakatan."
  if (t < T.toArr) return 'present';
  if (t < T.rot) return 'neutral';
  if (t < T.toKey) return 'cheer';                        // "Tetap dua puluh."
  if (t < T.key1) return 'pointyou';
  if (t < T.toAlg) return 'idea';                         // "depan itu kelompok, belakang itu isi"
  if (t < T.split) return 'think';
  if (t < T.toBack) return 'clap';
  if (t < T.toBack + 1.6) return 'armsup';
  if (t < T.check) return 'present';
  if (t < T.toBonus) return 'cheer';                      // Budi's homework is fixed
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
  if (near(v, 'hook')) { hookCard(g, tq); if (v.y0 < 1900) { drawLayer(g, cam, q => drawPuppet(q, 'bud', budiPose(t))); nameTag(g, 'budi', 'Budi', 245, 1975, COLB); } }
  if (near(v, 'viral')) viralScene(g, tq);
  if (near(v, 'q')) questionCard(g, tq);
  if (near(v, 'sym')) symbolCard(g, tq);
  if (near(v, 'rev')) reverseCard(g, tq);
  if (near(v, 'tiap')) tiapCard(g, tq);
  if (near(v, 'jp')) japanCard(g, tq);
  if (near(v, 'arr')) arrayScene(g, tq);
  if (near(v, 'key')) keyCard(g, tq);
  if (near(v, 'alg')) algCard(g, tq);
  if (near(v, 'bonus')) bonusCard(g, tq);
  if (near(v, 'cta')) ctaCard(g, tq);
  drawHost(g, t);
  g.setTransform(1, 0, 0, 1, 0, 0);
  vignette(g, .14);
  watermark(g, t);
  caption(t);
}
function nameTag(g, id, text, x, y, col) {
  g.save(); g.font = '40px Lilita'; const w = g.measureText(text).width + 36; g.translate(x, y);
  g.fillStyle = col; g.beginPath(); g.roundRect(-w / 2, -26, w, 52, 26); g.fill(); g.lineWidth = 4; g.strokeStyle = C.ink; g.stroke();
  g.fillStyle = '#FBF3DF'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 0, 3);
  noteText(g, 'tag-' + id, text, -w / 2, -26, w / 2, 26); TXT[TXT.length - 1].pass = true; g.restore();
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

// ---------------------------------------------------------------- sound events
function buildEvents() {
  const ev = [], E = (t, type, o = {}) => ev.push({ t: +t.toFixed(3), type, pan: 0, ...o });
  [[0, 'intro'], [T.toViral, 'go'], [T.toSym, 'run'], [T.strip + 1.2, 'meet'], [T.toKey, 'tree'], [T.toAlg, 'answer'], [T.bonus, 'bonus'], [T.cta, 'cta'], [T.out, 'end']].forEach(([t, name]) => E(t, 'sec', { name }));
  E(0, 'room', { d: DUR }); if (ALIGN) E(VO_OFF, 'vo', { id: 'full' });
  const move = (t0, d = 1.0, pan = 0) => { E(t0, 'swish', { d, pan }); E(t0 + .1, 'hop', { pan }); };
  E(T.twenty, 'pop', { pan: -.1 }); E(T.why, 'slapS', { pan: .3 });
  move(T.toViral, 1.0, .3); E(T.phone, 'slap'); for (let i = 0; i < 5; i++) E(T.cm + i * .55, 'pop', { pan: i % 2 ? .4 : -.4 }); E(T.prof, 'slapS');
  move(T.toQ, 1.0, -.3); E(T.toQ + .5, 'slap'); E(T.optA, 'slapS', { pan: -.3 }); for (let i = 0; i < 5; i++) E(T.optA + .25 + i * .12, 'tick', { pan: -.3 });
  E(T.optB, 'slapS', { pan: .3 }); for (let i = 0; i < 4; i++) E(T.optB + .25 + i * .12, 'tick', { pan: .3 }); E(T.qmark, 'chime');
  move(T.toSym, .9, .3); E(T.toSym + .3, 'slap'); E(T.sym, 'pop', { pan: -.2 }); E(T.sym + .2, 'pop', { pan: .2 }); E(T.lblA, 'scribble', { d: .4, pan: -.2 }); E(T.lblB, 'scribble', { d: .4, pan: .2 });
  for (let i = 0; i < 4; i++) { E(T.boxes + i * .3, 'pop', { pan: -.4 + i * .27 }); E(T.cookies + i * .35, 'dep', { key: 'A', m: [1, 4, 7, 10][i] }); }
  for (let i = 0; i < 4; i++) E(T.strip + i * .3, 'tick'); E(T.strip + 1.2, 'chime');
  move(T.toRev, 1.0, -.3); E(T.toRev + .4, 'slap'); E(T.rev, 'pop'); for (let i = 0; i < 5; i++) E(T.revBox + i * .25, 'pop', { pan: -.5 + i * .25 }); E(T.rev20, 'slapS'); E(T.revNote, 'slapS');
  move(T.toTiap, .9, .3); E(T.toTiap + .3, 'slap'); E(T.sent, 'slapS'); E(T.tiap, 'scribble', { d: .35 }); E(T.fly5, 'swish', { d: .6 }); E(T.fly5 + .6, 'dep', { key: 'B', m: 5 }); E(T.fly4, 'swish', { d: .6 }); E(T.fly4 + .6, 'dep', { key: 'A', m: 1 });
  move(T.toJp, 1.0, -.3); E(T.toJp + .3, 'slap'); E(T.idn, 'pop', { pan: -.3 }); E(T.kes - .3, 'swish', { d: .3 }); E(T.kes, 'stamp'); E(T.jp, 'pop', { pan: .3 });
  move(T.toArr, .9, .3); E(T.grid, 'pop'); for (let r = 0; r < 4; r++) E(T.grid + .2 + r * .25, 'tick'); E(T.rot, 'swish', { d: 1.0 }); E(T.rot + 1.0, 'dep', { key: 'B', m: 9 }); E(T.tetap - .3, 'swish', { d: .3 }); E(T.tetap, 'stamp');
  move(T.toKey, 1.0, -.3); E(T.toKey + .4, 'slap'); for (let i = 0; i < 3; i++) E(T.scope + i * 1.0, 'pop', { pan: -.3 + i * .3 }); E(T.key1, 'slapS'); E(T.key2, 'slapS'); E(T.key2 + .1, 'chime');
  move(T.toAlg, .9, .3); E(T.toAlg + .3, 'slap'); E(T.alg, 'pop'); E(T.split, 'swish', { d: .6 }); E(T.split + .6, 'dep', { key: 'A', m: 7 }); E(T.algLbl, 'slapS');
  E(T.toBack, 'swish', { d: 1.6 }); E(T.toBack + .1, 'hop'); E(T.unmark, 'pageout', { d: .5 }); E(T.rewrite, 'scribble', { d: 1.3 }); E(T.check, 'stamp'); E(T.check + .1, 'chime');
  move(T.toBonus, 1.0, -.3); E(T.bonus, 'slap'); for (let i = 0; i < 3; i++) E(T.bonus + .4 + i * .25, 'pop', { pan: -.4 + i * .4 });
  E(T.cta - .5, 'swish', { d: .8 }); E(T.cta - .4, 'hop', { pan: .3 }); E(T.cta + .2, 'slap');
  E(T.out, 'pageout', { d: 2.0 });
  return ev.sort((a, b) => a.t - b.t);
}

// ---------------------------------------------------------------- boot
async function boot() {
  await Promise.all([document.fonts.load('92px Lilita', 'PR 0123456789 ×→…'), document.fonts.load('40px Fell', 'Angka'), document.fonts.load('62px OldStdB', '0123456789±–×=°/−+…?'),
    document.fonts.load('62px OldStd', '0123456789'), document.fonts.load('italic 96px OldStdIt', '4 + 5 ×'), document.fonts.load('52px FellSC', 'A')]);
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
  PAT.q = plain(1000, 760, 63, 'rgba(43,34,25,.8)');
  PAT.sym = plain(1000, 820, 64, 'rgba(43,34,25,.8)');
  PAT.rev = plain(1000, 720, 65, 'rgba(43,34,25,.8)');
  PAT.tiap = plain(1000, 720, 66, 'rgba(43,34,25,.8)');
  PAT.jp = plain(1000, 780, 67, 'rgba(43,34,25,.8)');
  PAT.key = plain(1000, 700, 68, 'rgba(242,182,50,.9)');
  PAT.alg = plain(900, 640, 69, 'rgba(45,95,138,.8)');
  PAT.bonus = bakeCard({ path: rectPath(1000, 760), bw: 1000, bh: 760, col: '#FBF3DF', seed: 62, dashed: false, rim: 9, print: g => { g.strokeStyle = 'rgba(184,57,44,.8)'; g.lineWidth = 5; g.setLineDash([22, 12]); g.strokeRect(-480, -360, 960, 720); } });
  PAT.cta = plain(900, 620, 83, 'rgba(45,95,138,.8)');
  window.render = t => renderFilm(t);
  window.READY = true;
}
boot();
window.__ALLTXT = () => TXT.map(e => ({ id: e.id, text: e.text, x0: e.x0, y0: e.y0, x1: e.x1, y1: e.y1 }));
window.__MOVING = t => { const a = camAt(t), b = camAt(t - .15); return Math.abs(a.f[0] - b.f[0]) + Math.abs(a.f[1] - b.f[1]) > 2 || Math.abs(a.z - b.z) > .005; };
