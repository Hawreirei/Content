// HAWREIREI house style — demo film "Ani & Budi ke perpustakaan" (KPK). 9:16, one continuous paper world.
// No panels: everything lies on one big sheet of graph paper on a desk; the camera glides, pushes in, pulls out and whips
// between places. The host is the creator's own paper puppet (chars.js); Ani and Budi are two generic schoolchildren.
const DUR = 63.0;   // voiced edition: every beat sits on the narration (vo/el/full.wav at +0.3 s)
window.DUR = DUR;
const T = {
  pull0: 5.6, pull1: 6.6, push: 7.6, open: 8.2, palmsEnd: 10.1, dep: 10.3, whip: 10.5,
  t0: 11.5, t1: 22.0, meet: 22.1, stampMeet: 23.1, ruleOut: 25.0, span: 25.0, kpk: 27.6,
  toTree: 29.5, tree: 30.3, m3: 33.85, m4: 36.95, kpk2: 39.1, date: 45.3, not12: 49.0,
  toBonus: 50.0, bonus: 50.6, cta: 57.2, out: 59.9, end: 61.9,
};
// the calendar's "today" follows the spoken dates; each child lands when its name is said
const DAYK = [[T.t0, 1], [12.3, 4], [14.25, 5], [15.9, 7], [17.95, 9], [19.7, 10], [T.t1, 13]];
const LANDT = { ani: { 4: 12.9, 7: 16.45, 10: 20.35, 13: T.meet }, bud: { 5: 14.75, 9: 18.4, 13: T.meet } };
// captions = the narration as spoken, in display spelling; [text] or [[part, part], split] (split: segment index)
const VO_OFF = 0.3;
const SAY = {
  v01: [['Ani ke perpustakaan setiap 3 hari sekali. Budi setiap 4 hari sekali.', 'Tanggal 1, mereka bertemu di sana. Tanggal berapa bertemu lagi?'], 2],
  v02: 'Kita ikuti kalendernya.',
  v03: [['Tanggal 4, Ani datang. Tanggal 5, Budi.', 'Tanggal 7, Ani lagi. Tanggal 9, Budi. Tanggal 10, Ani…'], 4],
  v04: 'Dan tanggal 13… mereka bertemu lagi!',
  v05: 'Jaraknya 12 hari. 12 itu KPK dari 3 dan 4.',
  v06: [['Cara cepatnya: tulis kelipatannya.', 'Kelipatan 3: 3, 6, 9, 12. Kelipatan 4: 4, 8, 12.'], 2],
  v07: [['KPK-nya 12. Tapi hati-hati! Mereka bertemu 12 hari setelah tanggal 1.', 'Jadi tanggal 1 + 12… tanggal 13. Bukan 12!'], 3],
  v08: [['Sekarang giliranmu. Cici datang setiap 6 hari sekali.', 'Tanggal berapa ketiganya bertemu lagi? Jawab di komentar!'], 2],
  v09: 'Mau dibahas soal apa lagi? Tulis di komentar, ya!',
  v10: 'Sampai jumpa di soal berikutnya!',
};
let CAPS = [], ALIGN = [];
function buildCaps() {
  CAPS = [];
  ALIGN.forEach((v, i) => {
    const txt = SAY[v.id]; if (!txt) return;
    const next = ALIGN[i + 1] ? ALIGN[i + 1].a + VO_OFF - .08 : DUR - .3, end = Math.min(next, v.b + VO_OFF + 1.0);
    if (Array.isArray(txt)) { const cut = v.segs[txt[1]][0] + VO_OFF - .05; CAPS.push([v.a + VO_OFF - .1, cut, txt[0][0]], [cut, end, txt[0][1]]); }
    else CAPS.push([v.a + VO_OFF - .1, end, txt]);
  });
  window.SUBS = CAPS;
}

// ---------------------------------------------------------------- the world (one sheet of graph paper on a desk)
const SHEET = { x0: -140, y0: -140, x1: 4240, y1: 5000 };
const YEL = '#F2B632', COLA = '#E2A93B', COLB = '#4F86B5', COLC = '#5E9A5A';
const ROWY = 1520, TX0 = 1400, TW = 190;                              // calendar: tile for date d at x = TX0 + 190 (d − 1)
const dX = d => TX0 + TW * (d - 1);
const LANE = { ani: 1255, bud: 1800 };
function dayAt(t) { if (t <= DAYK[0][0]) return 1; for (let i = 1; i < DAYK.length; i++) if (t <= DAYK[i][0]) { const [a0, b0] = DAYK[i - 1], [a1, b1] = DAYK[i]; return b0 + (b1 - b0) * (t - a0) / (a1 - a0); } return 13; }
function tOfDay(d) { for (let i = 1; i < DAYK.length; i++) if (d <= DAYK[i][1]) { const [a0, b0] = DAYK[i - 1], [a1, b1] = DAYK[i]; return a0 + (a1 - a0) * (d - b0) / (b1 - b0); } return T.t1; }
const landT = (key, d) => LANDT[key][d] ?? tOfDay(d);
const VISITS = { ani: [1, 4, 7, 10, 13], bud: [1, 5, 9, 13] };
const PAT = {};

// ---------------------------------------------------------------- camera: [t, x, y, z, ease]
const CAM = [
  [0, 540, 960, 1.0], [T.pull0, 540, 960, 1.0], [T.pull1, 540, 1150, 0.62, 'io'], [T.push, 560, 1420, 0.9, 'io'], [T.whip, 600, 1430, 0.9, 'io'],
  [T.t0, 1560, 1680, 0.85, 'io'],
];
function camAt(t) {
  let f, z;
  if (t >= T.t0 && t < T.t1 + .4) { const x = clamp(dX(dayAt(t)) + 140, 1560, 3560); f = [x, 1680]; z = .85; }
  else if (t >= T.t1 + .4) {
    const k = [[T.t1 + .4, 3560, 1680, .85], [T.ruleOut, 2620, 1640, .4, 'io'], [T.toTree, 2620, 1640, .4], [T.tree, 2620, 2960, .85, 'io'],
      [T.toBonus, 2620, 2960, .85], [T.bonus, 2620, 3800, .85, 'io'], [T.cta - .6, 2620, 3800, .85], [T.cta + .2, 2620, 4560, .85, 'io'], [T.out, 2620, 4560, .85], [T.end, 2050, 2430, .225, 'io'], [DUR, 2050, 2430, .218, 'lin']];
    let i = 1; while (i < k.length - 1 && t > k[i][0]) i++;
    const a = k[i - 1], b = k[i], u = EASE[b[4] || 'io'](clamp((t - a[0]) / (b[0] - a[0]), 0, 1));
    f = [lerp(a[1], b[1], u), lerp(a[2], b[2], u)]; z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), u));
  } else {
    let i = 1; while (i < CAM.length - 1 && t > CAM[i][0]) i++;
    const a = CAM[i - 1], b = CAM[i], u = EASE[b[4] || 'io'](clamp((t - a[0]) / (b[0] - a[0]), 0, 1));
    f = [lerp(a[1], b[1], u), lerp(a[2], b[2], u)]; z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), u));
  }
  let sx = 0, sy = 0, sr = 0;
  for (const [t0, a] of [[T.meet, 12], [T.not12, 8], [T.dep, 3]]) { const s = shake(t, t0, a); sx += s[0]; sy += s[1]; sr += s[2]; }
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

// ---------------------------------------------------------------- printed type in Lilita, numbers in yellow with an ink edge
function rich(g, id, parts, x, y, size, align = 'center') {
  g.save(); g.font = `${size}px Lilita`; g.textBaseline = 'alphabetic';
  const ws = parts.map(([s]) => g.measureText(s).width), tw = ws.reduce((a, b) => a + b, 0);
  let cx = align === 'center' ? x - tw / 2 : x;
  parts.forEach(([s, col], i) => {
    if (col && col !== C.ink) { g.lineJoin = 'round'; g.lineWidth = size * .14; g.strokeStyle = C.ink; g.strokeText(s, cx, y); }
    g.fillStyle = col || C.ink; g.fillText(s, cx, y); cx += ws[i];
  });
  noteText(g, id, parts.map(p => p[0]).join(''), (align === 'center' ? x - tw / 2 : x), y - size * .8, (align === 'center' ? x + tw / 2 : x + tw), y + size * .15);
  g.restore(); return tw;
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
function stampPrint(g, x, y, rot, t, t0, word, col = '#B8392C', size = 90) {
  const u = t - t0; if (u < -0.3) return;
  if (u < 0) { const k = 1 + (-u / .3) * .5; g.save(); g.translate(x, y - 300 * (-u / .3)); g.rotate(rot * D2R); g.scale(k, k);
    g.shadowColor = 'rgba(30,20,10,.4)'; g.shadowBlur = 30; g.shadowOffsetX = 30; g.shadowOffsetY = 40; g.fillStyle = '#7A4E2C'; g.fillRect(-60, -230, 120, 150);
    g.beginPath(); g.ellipse(0, -250, 90, 40, 0, 0, Math.PI * 2); g.fill(); g.shadowColor = 'transparent'; g.fillStyle = '#3A2A20'; g.fillRect(-260, -80, 520, 80); g.restore(); return; }
  const a = clamp(u / .08, 0, 1);
  g.save(); g.translate(x, y); g.rotate(rot * D2R); g.globalAlpha = .9 * a; g.strokeStyle = col; g.fillStyle = col;
  g.font = `${size}px Lilita`; g.letterSpacing = '6px'; const w = g.measureText(word).width + 80, hh = size * 1.55;
  g.lineWidth = 10; g.beginPath(); g.roundRect(-w / 2, -hh / 2, w, hh, 18); g.stroke(); g.lineWidth = 3; g.beginPath(); g.roundRect(-w / 2 + 14, -hh / 2 + 14, w - 28, hh - 28, 10); g.stroke();
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(word, 4, 6); g.letterSpacing = '0px';
  noteText(g, 'stamp-' + word, word, -w / 2 + 20, -hh / 2 + 16, w / 2 - 20, hh / 2 - 16); g.restore();
}

// ---------------------------------------------------------------- places on the sheet
function hookCard(g, t) {   // fully there on frame 1 (it is the thumbnail)
  drawCard(g, PAT.hook, { c: [540, 560], rot: -1.2, h: 0 });
  g.save(); g.translate(540, 560); g.rotate(-1.2 * D2R);
  pill(g, 'h-pill', 'KELIPATAN', 0, -285, 44);
  rich(g, 'h-1', [['Ani', COLA], [' ke perpustakaan', C.ink]], 0, -175, 70);
  rich(g, 'h-1b', [['tiap ', C.ink], ['3', YEL], [' hari sekali', C.ink]], 0, -95, 70);
  rich(g, 'h-2', [['Budi', COLB], [' tiap ', C.ink], ['4', YEL], [' hari sekali', C.ink]], 0, 0, 70);
  rich(g, 'h-3', [['Tanggal ', C.ink], ['1', YEL], [' mereka bertemu di sana.', C.ink]], 0, 105, 52);
  rich(g, 'h-4', [['Tanggal berapa ', C.ink], ['bertemu lagi?', '#C8463A']], 0, 220, 66);
  g.restore();
}
function library(g, tq) {
  drawCard(g, PAT.library, { c: [560, 1120], h: 0 });
  g.save(); g.translate(560, 1120); rich(g, 'lib', [['PERPUSTAKAAN', '#FBF3DF']], 0, -120, 44); g.restore();
}
function calendar(g, t, tq) {
  // a row of tear-off date tiles; the day ahead of "today" is still blank-ish
  const today = dayAt(tq);
  for (let d = 1; d <= 15; d++) {
    const x = dX(d), past = tq > T.dep + 1.2 && d <= Math.floor(today + 1e-6);
    drawCard(g, PAT.tile, { c: [x, ROWY], rot: ((d * 37) % 7 - 3) * .4, h: 0 });
    g.save(); g.translate(x, ROWY); g.fillStyle = past ? C.ink : 'rgba(43,34,25,.45)'; g.font = '84px Lilita'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(String(d), 0, 18); noteText(g, 'day' + d, String(d), -50, -26, 50, 60); g.restore();
  }
  // the visits: a coloured disc on each tile when the child lands there
  for (const key of ['ani', 'bud']) for (const d of VISITS[key]) {
    const tm = d === 1 ? T.dep + 1.2 : landT(key, d); if (tq < tm) continue;
    const k = popIn(tq, tm, .22), x = dX(d) + (key === 'ani' ? -50 : 50), y = ROWY + (key === 'ani' ? -62 : -62);
    g.save(); g.translate(x, y); g.scale(k, k); g.beginPath(); g.arc(0, 0, 30, 0, Math.PI * 2); g.fillStyle = key === 'ani' ? COLA : COLB; g.fill(); g.lineWidth = 4; g.strokeStyle = C.ink; g.stroke();
    g.fillStyle = '#FBF3DF'; g.font = '36px Lilita'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(key === 'ani' ? 'A' : 'B', 0, 3); g.restore();
  }
  // "today" marker
  if (tq > T.t0 - .3 && tq < T.ruleOut + .4) { const x = dX(Math.floor(today + 1e-6)); g.save(); g.globalAlpha = clamp((T.ruleOut + .4 - tq) / .4, 0, 1) * clamp((tq - T.t0 + .3) / .3, 0, 1);
    g.strokeStyle = C.red; g.lineWidth = 7; g.beginPath(); g.roundRect(x - 88, ROWY - 108, 176, 216, 14); g.stroke(); g.restore(); }
  // 13: together
  stampPrint(g, dX(13), ROWY - 330, -6, tq, T.stampMeet, 'BERTEMU!', '#B8392C', 80);
  // the span, once we pull back: 12 days
  if (tq > T.span) { const u = EASE.o(clamp((tq - T.span) / .6, 0, 1)), y = ROWY + 520; g.save(); g.strokeStyle = C.ink; g.lineWidth = 8;
    g.beginPath(); g.moveTo(dX(1), y); g.lineTo(lerp(dX(1), dX(13), u), y); g.stroke(); for (const x of [dX(1), lerp(dX(1), dX(13), u)]) { g.beginPath(); g.moveTo(x, y - 34); g.lineTo(x, y + 34); g.stroke(); } g.restore();
    if (u > .9) rich(g, 'span', [['12 hari kemudian', C.ink]], dX(7), y + 150, 120); }
  if (tq > T.kpk) mathSlip(g, 'kpk', 'KPK(3, 4) = 12', dX(7), ROWY - 620, -1.5, tq, T.kpk, { size: 130, bg: '#FBEFC9' });
}
function kidAt(key, t) {   // stands at the library, hops to tile 1, then jumps from visit to visit
  const home = key === 'ani' ? [330, 1330] : [600, 1330];
  if (t < T.dep) return [...home, 0];
  if (t < T.dep + 1.2) { const u = EASE.io((t - T.dep) / 1.2); return [lerp(home[0], dX(1), u), lerp(home[1], LANE[key], u) - Math.sin(Math.PI * u) * 240, 1]; }
  const V = VISITS[key]; let i = 0; while (i < V.length - 1 && t >= landT(key, V[i + 1])) i++;
  const cur = V[i], nxt = V[i + 1];
  if (nxt != null) { const ta = landT(key, nxt) - .55; if (t > ta) { const u = EASE.io(clamp((t - ta) / .55, 0, 1)); return [lerp(dX(cur), dX(nxt), u), LANE[key] - Math.sin(Math.PI * u) * 200, 1]; } }
  return [dX(cur), LANE[key], 0];
}
function kidPose(key, t) {
  const [x, y, air] = kidAt(key, t), s = .46;
  if (t > T.meet && t < T.meet + 3.4) return stand(key, x, y, { s, head: 'shout', hL: [x - 110, y - 120], hR: [x + 110, y - 120], bL: -1, bR: 1, flip: key === 'bud' });
  if (air) return stand(key, x, y, { s, head: 'wow', hL: [x - 120, y - 40], hR: [x + 120, y - 40], bL: -1, bR: 1, legL: 120, legR: 60 });
  return stand(key, x, y, { s, head: 'n', flip: key === 'bud' && t > T.dep });
}
function nameTag(g, id, text, x, y, col) {   // a small coloured label riding above a child's head
  g.save(); g.font = '40px Lilita'; const w = g.measureText(text).width + 34; g.translate(x, y);
  g.shadowColor = 'rgba(30,20,10,.3)'; g.shadowBlur = 6; g.shadowOffsetY = 4; g.fillStyle = col; g.beginPath(); g.roundRect(-w / 2, -26, w, 52, 26); g.fill(); g.shadowColor = 'transparent';
  g.lineWidth = 4; g.strokeStyle = C.ink; g.stroke(); g.fillStyle = '#FBF3DF'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 0, 3);
  noteText(g, 'tag-' + id, text, -w / 2, -26, w / 2, 26); TXT[TXT.length - 1].pass = true; g.restore();
}
function chip(g, id, n, x, y, t, t0, hot) {
  const k = popIn(t, t0, .2); if (k <= 0) return;
  g.save(); g.translate(x, y); g.scale(k, k); g.beginPath(); g.roundRect(-62, -52, 124, 104, 18); g.fillStyle = hot ? '#FBEFC9' : '#FBF3DF'; g.fill(); g.lineWidth = 5; g.strokeStyle = C.ink; g.stroke();
  g.fillStyle = C.ink; g.font = '64px Lilita'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(n), 0, 6); noteText(g, id, String(n), -44, -36, 44, 40);
  if (hot && t > T.kpk2 - .4) { const u = EASE.o(clamp((t - T.kpk2 + .4) / .4, 0, 1)); g.strokeStyle = C.red; g.lineWidth = 8; g.beginPath(); g.ellipse(0, 4, 86, 74, -.1, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * u); g.stroke(); }
  g.restore();
}
function multiples(g, tq) {
  slip(g, 'cara', 'cara cepat: daftar kelipatan', 2620, 2290, -2, tq, T.toTree + .3, { font: '56px Lilita', h: 96 });
  if (tq > T.m3 - .4) rich(g, 'm3l', [['Kelipatan ', C.ink], ['3', COLA], [':', C.ink]], 2080, 2560, 60, 'left');
  [3, 6, 9, 12, 15].forEach((n, i) => chip(g, 'k3' + n, n, 2490 + i * 150, 2540, tq, T.m3 + i * .45, n === 12));
  if (tq > T.m4 - .4) rich(g, 'm4l', [['Kelipatan ', C.ink], ['4', COLB], [':', C.ink]], 2080, 2760, 60, 'left');
  [4, 8, 12, 16].forEach((n, i) => chip(g, 'k4' + n, n, 2490 + i * 150, 2740, tq, T.m4 + i * .62, n === 12));
  mathSlip(g, 'kpk2', 'KPK = 12', 2620, 2990, -1, tq, T.kpk2, { size: 80, bg: '#FBEFC9' });
  mathSlip(g, 'date', 'tanggal 1 + 12 = tanggal 13', 2620, 3180, 1, tq, T.date, { size: 66 });
  stampPrint(g, 2218, 3035, -8, tq, T.not12, 'BUKAN 12!', '#B8392C', 54);
}
function bonusCard(g, tq) {
  card(g, PAT.bonus, 2620, 3800, -1.5, tq, T.bonus - .2);
  if (tq < T.bonus - .2) return;
  const u = tq - T.bonus + .2, a = clamp(u / .22, 0, 1), h = 1 - EASE.i(a);
  g.save(); g.translate(2620, 3800 - 200 * h); g.rotate((-1.5 - 10 * h) * D2R);
  pill(g, 'b-pill', 'TANTANGAN', 0, -230, 44, C.red);
  rich(g, 'b-1', [['Cici', COLC], [' datang tiap ', C.ink], ['6', YEL], [' hari sekali', C.ink]], 0, -100, 64);
  rich(g, 'b-2', [['Tanggal berapa ketiganya', C.ink]], 0, -5, 60);
  rich(g, 'b-3x', [['bertemu ', C.ink], ['lagi?', '#C8463A']], 0, 80, 66);
  rich(g, 'b-3', [['jawab di komentar ↓', C.ink]], 0, 185, 50);
  g.restore();
}
function ctaCard(g, tq) {   // after the challenge: ask what to explain next
  card(g, PAT.cta, 2620, 4560, 1.2, tq, T.cta);
  if (tq < T.cta) return;
  const u = tq - T.cta, a = clamp(u / .22, 0, 1), h = 1 - EASE.i(a);
  g.save(); g.translate(2620, 4560 - 200 * h); g.rotate((1.2 - 10 * h) * D2R);
  pill(g, 'c-pill', 'KOMENTAR', 0, -200, 44, '#2D5F8A');
  rich(g, 'c-1', [['Mau dibahas', C.ink]], 0, -75, 76);
  rich(g, 'c-2', [['soal ', C.ink], ['apa lagi?', '#C8463A']], 0, 20, 76);
  rich(g, 'c-3', [['tulis di komentar ↓', C.ink]], 0, 130, 54);
  g.restore();
}
// the bottom block (fixed screen layout): caption box ends at CAP_BOTTOM, the channel watermark sits right under it,
// and everything below y 1560 is left to the app UI (TikTok / Shorts / Reels name + description). Story content stays in y 160–1380.
const CAP_BOTTOM = 1480, WM_Y = 1530;
function watermark(g, t) {   // stays off the hook card (the thumbnail), fades in when the camera first pulls back
  const a = clamp((t - 5.2) / .6, 0, 1); if (a <= 0) return;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = .4 * a; g.font = '40px Lilita'; g.letterSpacing = '10px'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineJoin = 'round'; g.lineWidth = 7; g.strokeStyle = '#FBF3DF'; g.strokeText('HAWREIREI', W / 2 + 5, WM_Y); g.fillStyle = C.ink; g.fillText('HAWREIREI', W / 2 + 5, WM_Y);
  g.letterSpacing = '0px'; noteText(g, 'wm', 'HAWREIREI', W / 2 - 180, WM_Y - 24, W / 2 + 190, WM_Y + 24); TXT[TXT.length - 1].pass = true; g.restore();
}

// ---------------------------------------------------------------- the host: the creator's puppet, hopping along with the camera
const HOST = [[0, 880, 1330], [T.whip - .1, 880, 1330], [T.t0, 1560, 1980, 'io']];
function hostAt(t) {
  let x, y, hopping = false;
  if (t >= T.t0 && t < T.t1 + .3) { x = Math.max(1560, dX(dayAt(t)) - 330); y = 1980; hopping = true; }
  else if (t >= T.t1 + .3) {
    const k = [[T.t1 + .3, dX(13) - 330, 1980], [T.toTree, dX(13) - 330, 1980], [T.tree + .2, 3150, 3080, 'io'], [T.toBonus, 3150, 3080], [T.bonus + .4, 2120, 4060, 'io'], [T.cta - .5, 2120, 4060], [T.cta + .4, 2130, 4850, 'io'], [DUR, 2130, 4850]];
    let i = 1; while (i < k.length - 1 && t > k[i][0]) i++;
    const a = k[i - 1], b = k[i], u = EASE[b[3] || 'io'](clamp((t - a[0]) / (b[0] - a[0]), 0, 1)); x = lerp(a[1], b[1], u); y = lerp(a[2], b[2], u) - Math.sin(Math.PI * u) * (u > 0 && u < 1 ? 260 : 0);
  } else {
    let i = 1; while (i < HOST.length - 1 && t > HOST[i][0]) i++;
    const a = HOST[i - 1], b = HOST[i], u = EASE[b[3] || 'io'](clamp((t - a[0]) / (b[0] - a[0]), 0, 1)); x = lerp(a[1], b[1], u); y = lerp(a[2], b[2], u) - Math.sin(Math.PI * u) * (u > 0 && u < 1 ? 220 : 0);
  }
  if (hopping) y -= Math.abs(Math.sin(t * Math.PI * 4)) * 8;
  return [x, y];
}
// the host is the creator's own sticker set. Sheet 1 (sprites/hw_0..5, larger): neutral, open palms, cheering, hands on cheeks, arms up, presenting.
// Sheet 2 (sprites30/p01..p30): 1 thinking, 2 idea, 3 point at viewer, 4 confused, 5 wrong (X), 6 thumbs up, 7 writing, 8 talking, 9 blink,
// 10 present left, 11 laughing, 12 disappointed, 13 worksheet, 14 waving, 15/16 walking, 17 shrug, 18 clapping, 19 magnifier, 20 scroll,
// 21 pointer stick, 22 phone, 23 point down, 24 arms crossed, 25–30 heads (smile, laugh, shocked, thinking, confused, proud).
const SPR = {}; let VOENV = [];
const BODY_H = 380;   // world height of a standing figure; each sheet has its own pixels-per-body scale
const SHEET_BODY = { a: 361, b: 510 };   // body height in px of a plain standing pose on each sheet
const POSE = { neutral: ['a', 0], palms: ['a', 1], cheer: ['a', 2], cheeks: ['a', 3], armsup: ['a', 4], present: ['a', 5],
  think: ['b', 1], idea: ['b', 2], pointyou: ['b', 3], confused: ['b', 4], wrong: ['b', 5], thumbs: ['b', 6], write: ['b', 7], wave: ['b', 14],
  walkA: ['b', 15], walkB: ['b', 16], shrug: ['b', 17], clap: ['b', 18], pointer: ['b', 21], crossed: ['b', 24] };
function hostPoseName(t) {
  if (t < T.open) return 'think';
  if (t < T.palmsEnd) return 'palms';                                   // "Tanggal berapa mereka bertemu lagi?"
  if (t >= T.palmsEnd && t < T.t0) return 'armsup';
  if (t >= T.t0 && t < T.t1) return Math.floor(t * 4) % 2 ? 'walkA' : 'walkB';
  if (t >= T.t1 && t < T.meet + 3.2) return 'cheer';
  if (t > T.ruleOut - .6 && t < T.toTree) return 'pointer';
  if (t > T.tree && t < T.kpk2) return 'think';
  if (t >= T.kpk2 && t < 41.0) return 'idea';                            // "Ka-pé-ka-nya dua belas"
  if (t >= 41.0 && t < T.date) return 'pointyou';                        // "Tapi hati-hati!"
  if (t >= T.date && t < T.not12 - .1) return 'think';
  if (t >= T.not12 - .1 && t < T.toBonus) return 'wrong';                // "Bukan dua belas!"
  if (t > T.bonus + .4 && t < T.cta - .5) return 'pointyou';
  if (t > T.cta + .4 && t < T.out) return 'present';
  if (t > T.out) return 'wave';
  return 'neutral';
}
function drawHost(g, t) {
  const [x, y] = hostAt(t), name = hostPoseName(t), [sh, i] = POSE[name], im = SPR[sh + i]; if (!im) return;
  let t0 = t; for (let k = 0; k < 40; k++) { if (hostPoseName(t0 - .05) !== name) break; t0 -= .05; }
  const walking = name.startsWith('walk'), pop = walking ? 1 : 1 + .12 * Math.exp(-(t - t0) * 9) * Math.cos((t - t0) * 26);
  const fi = Math.floor((t - VO_OFF) * 24), talk = walking || !VOENV.length || fi < 0 || fi >= VOENV.length ? 0 : VOENV[fi];   // a small lift while the voice speaks
  const k = BODY_H / SHEET_BODY[sh], w = im.width * k, h = im.height * k, feet = y + 195, breathe = walking ? 1 : 1 + .012 * Math.sin(t * 3.1) + .03 * talk;
  g.save(); g.translate(x, feet); g.scale(pop, pop * breathe);
  g.shadowColor = 'rgba(30,18,6,.4)'; g.shadowBlur = 16; g.shadowOffsetX = 10; g.shadowOffsetY = 12;
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
  if (v.y0 < 1000 && v.x0 < 1100) hookCard(g, tq);
  if (v.x0 < 1100) library(g, tq);
  calendar(g, t, tq);
  if (v.y1 > 2100) multiples(g, tq);
  if (v.y1 > 3300) bonusCard(g, tq);
  if (v.y1 > 4200) ctaCard(g, tq);
  drawLayer(g, cam, q => { drawPuppet(q, 'ani', kidPose('ani', t)); drawPuppet(q, 'bud', kidPose('bud', t)); });
  for (const key of ['ani', 'bud']) { const [x, y] = kidAt(key, t); nameTag(g, key, key === 'ani' ? 'Ani' : 'Budi', x, y - 150, key === 'ani' ? COLA : COLB); }
  drawHost(g, t);
  g.setTransform(1, 0, 0, 1, 0, 0);
  vignette(g, .14);
  watermark(g, t);
  caption(t);
}
// a caption box at the bottom (≤ 2 balanced lines)
function caption(t) {
  const i = CAPS.findIndex(([a, b]) => t >= a && t < b); if (i < 0 || t < T.pull0 || CAPS[i][0] < 2) return;   // hook card = caption (the first caption is the card itself)
  const [a, b, tx] = CAPS[i], g = MAIN, size = 56, fam = 'Fell';
  const wOf = s => mWidth(g, mParse(s), size, fam);
  let lines = [tx];
  if (wOf(tx) > 900) { const ws = tx.split(' '); let best = null; for (let k = 1; k < ws.length; k++) { const A = ws.slice(0, k).join(' '), B = ws.slice(k).join(' '), m = Math.max(wOf(A), wOf(B)); if (!best || m < best.m) best = { m, L: [A, B] }; } lines = best.L; }
  const u = EASE.o(clamp((t - a) / 0.14, 0, 1)), v = clamp((b - t) / 0.1, 0, 1);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  const lh = 72, w = Math.max(...lines.map(wOf)) + 84, h = lines.length * lh + 48, x = W / 2 - w / 2, y = CAP_BOTTOM - h + (1 - u) * 18 + (1 - v) * 10;
  g.globalAlpha = Math.min(u, v);
  g.shadowColor = 'rgba(30,20,10,.38)'; g.shadowBlur = 12; g.shadowOffsetX = 5; g.shadowOffsetY = 8;
  g.fillStyle = C.caption; g.fillRect(x, y, w, h); g.shadowColor = 'transparent';
  g.strokeStyle = C.ink; g.lineWidth = 4; g.strokeRect(x + 2, y + 2, w - 4, h - 4);
  g.fillStyle = C.ink; g.textBaseline = 'alphabetic';
  lines.forEach((l, k) => mDraw(g, mParse(l), W / 2 - wOf(l) / 2, y + 24 + lh * (k + 0.74), size, fam));
  noteText(g, 'cap' + i, mPlain(tx), x + 30, y + 10, x + w - 30, y + h - 10);
  g.restore();
}
window.TEXTS = t => { renderFilm(t); return TXT.filter(x => x.x1 > 0 && x.x0 < W && x.y1 > 0 && x.y0 < H).map(e => ({ id: e.id, text: e.text, x0: e.x0, y0: e.y0, x1: e.x1, y1: e.y1, ...(e.pass ? { pass: true } : {}) })); };

// ---------------------------------------------------------------- sound events
function buildEvents() {
  const ev = [], E = (t, type, o = {}) => ev.push({ t: +t.toFixed(3), type, pan: 0, ...o });
  [[0, 'intro'], [T.dep - .2, 'go'], [T.t0, 'run'], [T.meet, 'meet'], [T.toTree, 'tree'], [T.not12, 'answer'], [T.bonus - .3, 'bonus'], [T.cta, 'cta'], [T.out, 'end']].forEach(([t, name]) => E(t, 'sec', { name }));
  E(0, 'room', { d: DUR }); E(VO_OFF, 'vo', { id: 'full' });
  E(T.open, 'pop', { pan: .5 });
  E(T.pull0, 'swish', { d: 1.0 }); E(T.pull1, 'swish', { d: 1.0 });
  E(T.dep, 'hop', { pan: -.4 }); E(T.dep + .05, 'hop', { pan: .2 }); E(T.dep + .3, 'swish', { d: 1.4 }); E(T.whip, 'hop', { pan: .4 });
  E(T.dep + 1.2, 'dep', { key: 'A', m: 1, pan: -.2 }); E(T.dep + 1.25, 'dep', { key: 'B', m: 1, pan: .2 });
  for (const [key, K2] of [['ani', 'A'], ['bud', 'B']]) for (const d of VISITS[key].slice(1)) { E(landT(key, d) - .55, 'hop', { pan: (d - 7) / 8 }); E(landT(key, d), 'dep', { key: K2, m: d, pan: (d - 7) / 8 }); }
  for (let d = 2; d <= 13; d++) E(tOfDay(d), 'tick', { pan: (d - 7) / 8 });
  E(T.stampMeet, 'stamp'); E(T.stampMeet + .05, 'bell');
  E(T.t1 + .4, 'swish', { d: 1.6 }); E(T.span, 'scribble', { d: .6 }); E(T.kpk + .2, 'slap');
  E(T.toTree, 'swish', { d: .9 }); E(T.toTree + .1, 'hop', { pan: -.3 }); E(T.toTree + .5, 'slapS');
  for (let i = 0; i < 5; i++) E(T.m3 + i * .45, 'pop', { pan: -.4 + i * .2 }); for (let i = 0; i < 4; i++) E(T.m4 + i * .62, 'pop', { pan: -.4 + i * .25 });
  E(T.kpk2 - .4, 'scribble', { d: .4 }); E(T.kpk2 + .2, 'slap'); E(T.kpk2 + .3, 'chime'); E(T.date + .2, 'slapS'); E(T.not12 - .3, 'swish', { d: .3 }); E(T.not12, 'stamp');
  E(T.toBonus, 'swish', { d: .8 }); E(T.toBonus + .3, 'hop', { pan: -.3 }); E(T.bonus, 'slap'); E(T.bonus + .5, 'pop', { pan: -.3 });
  E(T.cta - .6, 'swish', { d: .8 }); E(T.cta - .5, 'hop', { pan: -.3 }); E(T.cta + .2, 'slap'); E(T.cta + .5, 'pop', { pan: -.3 });
  E(T.out, 'pageout', { d: 2.0 });
  return ev.sort((a, b) => a.t - b.t);
}

// ---------------------------------------------------------------- boot
async function boot() {
  await Promise.all([document.fonts.load('92px Lilita', 'Bus A tiap 15 menit?'), document.fonts.load('40px Fell', 'Angka'), document.fonts.load('62px OldStdB', '0123456789±–×=°/−+…'),
    document.fonts.load('italic 28px OldStdIt', '×2'), document.fonts.load('52px FellSC', 'A')]);
  paperTex = makePaper(W * MS, H * MS, 7);
  { const pc = canvas(1024, 1024), pg = pc.getContext('2d'); pg.drawImage(makePaper(1024, 1024, 11), 0, 0); PAT.paper = MAIN.createPattern(pc, 'repeat');
    const tb = canvas(1024, 1024), bg = tb.getContext('2d'); bg.fillStyle = C.table; bg.fillRect(0, 0, 1024, 1024); bg.globalCompositeOperation = 'overlay'; bg.globalAlpha = .7; bg.drawImage(makePaper(1024, 1024, 33), 0, 0);
    tablePat = MAIN.createPattern(tb, 'repeat'); }
  ALIGN = await fetch('vo/el/align.json').then(r => r.json()); VOENV = await fetch('vo/el/env.json').then(r => r.json()); buildCaps(); window.EV = buildEvents();
  buildPuppets();
  const load = async (key, src) => { const im = new Image(); im.src = src; await im.decode(); SPR[key] = im; };
  await Promise.all([...[0, 1, 2, 3, 4, 5].map(i => load('a' + i, `sprites/hw_${i}.png`)), ...Array.from({ length: 30 }, (_, i) => load('b' + (i + 1), `sprites30/p${String(i + 1).padStart(2, '0')}.png`))]);
  PAT.hook = bakeCard({ path: rectPath(1000, 720), bw: 1000, bh: 720, col: '#FBF3DF', seed: 61, dashed: false, rim: 9, print: g => { g.strokeStyle = 'rgba(43,34,25,.8)'; g.lineWidth = 4; g.strokeRect(-480, -340, 960, 680); } });
  PAT.bonus = bakeCard({ path: rectPath(1000, 620), bw: 1000, bh: 620, col: '#FBF3DF', seed: 62, dashed: false, rim: 9, print: g => { g.strokeStyle = 'rgba(184,57,44,.8)'; g.lineWidth = 5; g.setLineDash([22, 12]); g.strokeRect(-480, -290, 960, 580); } });
  PAT.library = bakeCard({ path: P2(p => { p.moveTo(-300, -110); p.lineTo(0, -260); p.lineTo(300, -110); p.lineTo(300, 210); p.lineTo(-300, 210); p.closePath(); }), bw: 640, bh: 500, col: '#C9A26B', seed: 81, dashed: false, rim: 9, print: g => {
    g.fillStyle = '#8E4A33'; g.beginPath(); g.moveTo(-320, -100); g.lineTo(0, -270); g.lineTo(320, -100); g.closePath(); g.fill(); g.strokeStyle = C.ink; g.lineWidth = 5; g.stroke();
    g.fillStyle = '#2D5F8A'; g.beginPath(); g.roundRect(-210, -160, 420, 74, 12); g.fill(); g.stroke();
    for (const x of [-200, 140]) { g.fillStyle = '#DCEBF0'; g.fillRect(x, -40, 80, 90); g.strokeRect(x, -40, 80, 90); g.beginPath(); g.moveTo(x + 40, -40); g.lineTo(x + 40, 50); g.moveTo(x, 5); g.lineTo(x + 80, 5); g.lineWidth = 3; g.stroke(); g.lineWidth = 5; }
    g.fillStyle = '#6B4A2E'; g.beginPath(); g.roundRect(-60, 30, 120, 180, [50, 50, 0, 0]); g.fill(); g.stroke();
    for (const [x, col] of [[-90, '#C8463A'], [-70, '#4F86B5'], [-50, '#E2A93B']]) { g.fillStyle = col; g.fillRect(x - 200, 70, 16, 60); g.strokeRect(x - 200, 70, 16, 60); } } });
  PAT.cta = bakeCard({ path: rectPath(900, 520), bw: 900, bh: 520, col: '#FBF3DF', seed: 83, dashed: false, rim: 9, print: g => { g.strokeStyle = 'rgba(45,95,138,.8)'; g.lineWidth = 5; g.strokeRect(-430, -240, 860, 480); } });
  PAT.tile = bakeCard({ path: rectPath(170, 200), bw: 170, bh: 200, col: '#FBF7EC', seed: 82, dashed: false, rim: 7, print: g => { g.fillStyle = '#C8463A'; g.fillRect(-85, -100, 170, 40); for (const x of [-50, 0, 50]) { g.beginPath(); g.arc(x, -100, 7, 0, Math.PI * 2); g.fillStyle = '#F1E9D6'; g.fill(); g.strokeStyle = C.ink; g.lineWidth = 2; g.stroke(); } } });
  LAYER = canvas(W, H);
  window.render = t => renderFilm(t);
  window.READY = true;
}
boot();
