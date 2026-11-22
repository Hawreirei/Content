// Nusa Wacana EP 1/30 — "Dua Telepon, Satu Malam" · gaya Sci-Fi Sitcom Toon · 1080×1920
import { clamp, lerp, seg, ss, eo, ei, eio, back, hash, TAU } from './lib.js';
import { W, H, INK, init, frame, g, push, pop, translate, rotate, scale, shape, fillOnly, stroke, ell, arc, rr, rect, spline, dot, text, screenRect, S, reset, bands } from './toon.js';
import { dimas, ibu, bambang, sekar, oyen, tempe, PAL, WHO_COL, sweat } from './chars.js';
import * as Wd from './worlds.js';
import { DUR, q, LINES, SHOTS, shotAt, WIPES, TAGS, T, CUES, BEAT } from './story.js';

init(document.getElementById('c'));
const J = async f => { try { const r = await fetch(f); if (r.ok) return await r.json(); } catch (e) { } return null; };
const DURS = (await J('voices/dur.json')) || {}, LIPS = (await J('voices/lips.json')) || {};
const LINE = Object.fromEntries(LINES.map(([id, who, sub, tts, t0, d]) => [id, { id, who, sub, tts: tts || sub, t0, d: DURS[id] ?? d }]));
const TER = Wd.TER;

// —— gerak mulut: dari rekaman bila ada (voices/lips.json), kalau belum ada pakai amplop suku kata sementara ——
const sylls = s => (s.toLowerCase().match(/[aiueo]+/g) || ['a']).length;
function talk(who, t) {
  const tq = q(t);
  for (const L of Object.values(LINE)) {
    if (L.who !== who) continue;
    if (tq >= L.t0 && tq < L.t0 + L.d) {
      const lp = LIPS[L.id], k = Math.floor((tq - L.t0) * 24);
      if (lp) return { o: lp.o[k] ?? 0, w: .8 + .45 * (lp.b[k] ?? .5), talking: true };
      const n = sylls(L.sub), ph = (tq - L.t0) / L.d * n, i = Math.floor(ph), u = ph - i;
      const o = Math.pow(Math.max(0, Math.sin(Math.PI * u)), .8) * (.45 + .45 * hash(i * 3.7 + L.t0));
      return { o, w: .85 + .3 * hash(i * 1.3), talking: true };
    }
  }
  return { o: 0, w: 1, talking: false };
}
const blinks = (t, seed) => { const k = Math.floor(t * 12), b = Math.floor(k / 30); return hash(b * 7.1 + seed) > .35 && (k % 30 === Math.floor(hash(b + seed) * 20)); };
const popOpen = x => x <= 0 ? 0 : back(clamp(x / .32), 1.7);
function cam(cx, cy, z, rot = 0, shake = 0, t = 0) {
  reset(); translate(W / 2, H / 2);
  if (shake) { const f = Math.floor(t * 24); translate((hash(f) - .5) * shake * 2, (hash(f + 77) - .5) * shake * 2); }
  scale(z); if (rot) rotate(rot); translate(-cx, -cy);
}
const pan = (t, a, b, A, B) => lerp(A, B, ss(seg(t, a, b)));

// —— pose bawaan ——
function D(t, o = {}) {
  const m = talk('DIMAS', t), tq = q(t);
  return { x: TER.dimX, y: TER.floor - 15, sit: 1, s: 1, face: 1, t, look: [.2, 0], lid: .1, brow: 0, blink: blinks(t, 1),
    mouth: { o: m.o, w: m.w, sm: .2 }, sq: 1 + .01 * Math.sin(tq * 3.1), headTilt: m.talking ? (m.o - .3) * .08 : Math.sin(tq * 1.4) * .02,
    armR: { h: [70, 130], bend: 30 }, armL: { h: [40, 150], bend: -10 }, ...o };
}
function I(t, o = {}) {
  const m = talk('IBU', t), tq = q(t);
  return { x: TER.ibuX, y: TER.floor - 20, s: 1, face: 1, look: [.4, .3], lid: .56, blink: blinks(t, 2), mouth: { o: m.o * .9, w: m.w, sm: -.1 },
    sq: 1 + .008 * Math.sin(tq * 2.3), headTilt: m.talking ? (m.o - .3) * .05 : 0,
    armR: { h: [86 + Math.sin(tq * 5) * 14, 60], bend: 30 }, holdR: 'sutil', stir: Math.sin(tq * 5) * .25, armL: { h: [-10, 150], bend: -20 }, ...o };
}
function B(t, o = {}) {
  const m = talk('BAMBANG', t), tq = q(t);
  return { x: TER.p1[0] + 20, y: TER.p1[1] + 120, s: .78, face: 1, lean: .32, look: [.5, .4], lid: .28, blink: blinks(t, 3), mouth: { o: m.o * 1.1, w: m.w * 1.1, sm: .6 },
    sq: 1 + .01 * Math.sin(tq * 2), headTilt: m.talking ? (m.o - .3) * .08 : 0, armR: { h: [120, 60], bend: -30 }, holdR: 'point', armL: { h: [-40, 170], bend: -20 }, ...o };
}
function Sk(t, o = {}) {
  const m = talk('SEKAR', t), tq = q(t);
  return { x: TER.p2[0] - 10, y: TER.p2[1] + 130, s: .78, face: -1, lean: .26, look: [.5, .4], lid: .52, blink: blinks(t, 4), mouth: { o: m.o * .8, w: m.w, sm: .35 },
    sq: 1 + .008 * Math.sin(tq * 2.4), headTilt: m.talking ? (m.o - .3) * .05 : -.04, armR: { h: [60, 110], bend: 30 }, armL: { h: [-10, 180], bend: -14 }, ...o };
}
const emerge = (t, t0) => back(clamp((t - t0) / .45), 1.4);

// —— teras dengan semua isi, dipakai beberapa shot ——
function terraceScene(t, o = {}) {
  const tq = q(t);
  const burnt = t > 65.6 ? 1 : 0, smoke = clamp((t - 65.0) / 1.2) * (t < 81.25 || t > 0 ? 1 : 0);
  Wd.terrace(t, { egg: o.egg, clockSec: Math.floor(t), burnt: o.burnt ?? burnt, smoke: o.smoke ?? (t > 64 ? smoke : 0), tempeN: o.tempeN ?? (t > 55.6 ? 3 : 4), oyenMunch: o.oyenMunch ?? 0, oyenLook: o.oyenLook ?? [-.5, -.3], fry: 1 });
  const p1 = o.p1 ?? 0, p2 = o.p2 ?? 0;
  if (p1 > 0) Wd.portal(TER.p1[0], TER.p1[1], 230, t, { open: p1, inner: Wd.innerBambang });
  if (p2 > 0) Wd.portal(TER.p2[0], TER.p2[1], 220, t, { open: p2, inner: Wd.innerSekar });
  if (o.bam) bambang(o.bam);
  if (o.sek) sekar(o.sek);
  ibu(o.ibu || I(t));
  dimas(o.dim || D(t));
}

// ———————————————————— shot ————————————————————
const SH = {};
// HOOK: puncak cerita, lalu membeku
SH.hook = (t) => {
  const tf = Math.min(t, T.freeze), fr = t >= T.freeze;
  const sh = fr ? 0 : 9;
  cam(540, 830, 1.12 + .04 * ss(seg(t, 0, 2.6)), 0, sh, t);
  const bam = B(tf, { s: .8, lean: .38, mouth: { o: tf > .15 && tf < 1 ? .9 : .5, w: 1.2, sm: .2 }, brow: .6, holdR: 'point', armR: { h: [140, 40], bend: -20 } });
  const sek = Sk(tf, { s: .8, lean: .3, mouth: { o: tf > .5 && tf < 1.3 ? .7 : .3, w: 1, sm: .2 }, holdR: 'point', armR: { h: [130, 60], bend: 20 } });
  const dim = D(tf, { panic: fr ? 0 : 1, look: [hash(Math.floor(tf * 6)) > .5 ? -.7 : .7, -.4], lid: 0, pupil: 4, brow: -1, mouth: { o: tf > 1.2 && tf < 2.45 ? .95 : .55, w: .9, sm: -.6 }, sweat: tf * 2,
    armR: { h: [40, -150], bend: 40 }, armL: { h: [-60, -150], bend: -40 }, lean: -.06 });
  terraceScene(tf, { p1: 1, p2: 1, bam, sek, dim, smoke: 0, burnt: 0 });
  if (fr) { reset(); screenRect('#1b1422', .18); }
};
SH.wipeIn = (t) => { reset(); screenRect('#1b1422'); };
// TANGGUL sekarang
SH.dam = (t) => {
  const z = lerp(1.0, 1.12, ss(seg(t, 4.375, 8.75)));
  cam(540, 1060, z);
  Wd.dam(t, { angkot: 1 });
  const tq = q(t);
  dimas({ x: 420, y: 1345, s: .95, face: 1, t, look: [.6, -.1], lid: .2, brow: .1, blink: blinks(t, 5), mouth: { o: 0, sm: .5 }, sq: 1 + .01 * Math.sin(tq * 2),
    armR: { h: [64, 170], bend: -50 }, armL: { h: [-60, 170], bend: 50 }, headTilt: -.04 });
};
// KILAS BALIK: framing sama ×3
SH.flood = (t) => { cam(540, 900, 1.18); Wd.floodScene(t, 'flood'); };
SH.trash = (t) => { cam(540, 900, 1.18); Wd.floodScene(t, 'trash'); };
SH.pungli = (t) => { cam(540, 900, 1.18); Wd.floodScene(t, 'pungli'); };
SH.youngCU = (t) => {
  cam(540, 960, 1);
  Wd.floodBg(t); Wd.floodWater(t, 1080);
  const tq = q(t);
  dimas({ x: 470, y: 2100, s: 1.75, face: 1, young: 1, helmet: 1, t, look: [.4, -.5], lid: .15, brow: -.8, blink: blinks(t, 6), mouth: { o: 0, sm: -.7 }, sq: 1 + .01 * Math.sin(tq * 3),
    armR: { h: [40, 180], bend: 10 }, armL: { h: [-40, 180], bend: -10 }, sweat: t * 1.2 });
  for (let i = 0; i < 30; i++) { const x = (hash(i) * 1300 + t * 80) % 1200 - 60, y = (hash(i + 7) * 1900 + t * 1300) % 1900; reset(); stroke([[x, y], [x - 12, y + 60]], 4, { line: 'rgba(230,230,210,.6)', boil: 0 }); }
};
// JALAN BOLONG + layar laporan
SH.pothole = (t) => {
  const tq = q(t);
  if (t < 18.0) {
    cam(540, 1060, lerp(1.0, 1.08, ss(seg(t, 15, 18))));
    Wd.street(t);
    Wd.hoverScooter(860, 1250, 1, t);
    const snap = t > T.photo - .3 && t < T.photo + .2;
    dimas({ x: 260, y: 1300, s: .9, face: 1, young: 1, t, look: [.7, .4], lid: .2, brow: .3, blink: blinks(t, 7), mouth: { o: 0, sm: .1, skew: .3 },
      armR: { h: [130, -10], bend: -20 }, holdR: 'phone', armL: { h: [80, 60], bend: -30 }, lean: .1 + (snap ? .02 : 0) });
    if (t > T.photo && t < T.photo + .12) { reset(); screenRect('#ffffff', .7); }
  } else {
    // over-the-shoulder: bahu Dimas + layar ponsel
    cam(540, 960, 1);
    bands(['#7c8a8c', '#9aa6a2'], -300, 2400);
    shape(rr(250, 360, 600, 1120, 60), { fill: '#2b2e37', lw: 9 });
    shape(rr(290, 420, 520, 960, 30), { fill: '#0f2a2a', lw: 7 });
    const n = Math.floor((t - 18.0) * 34);
    const L1 = 'LAPORAN #4.117', L2 = 'JALAN BOLONG JL. RAWA 3', L3 = 'STATUS: TERKIRIM';
    text(L1.slice(0, n), 330, 520, { font: '400 54px VT323', fill: '#7ff0e6', align: 'left' });
    text(L2.slice(0, Math.max(0, n - L1.length)), 330, 590, { font: '400 40px VT323', fill: '#7ff0e6', align: 'left' });
    text(L3.slice(0, Math.max(0, n - L1.length - L2.length)), 330, 660, { font: '400 44px VT323', fill: '#ffd36e', align: 'left' });
    if (t > T.zero) {
      const s = back(seg(t, T.zero, T.zero + .2), 2.4);
      push(); translate(550, 950); rotate(-.12); scale(s);
      shape(rr(-220, -110, 440, 220, 20), { fill: '#c0213a', lw: 8 });
      text('DIBALAS: 0', 0, 4, { font: '400 96px VT323', fill: '#fff' });
      pop();
    }
    // bahu jaket di depan (bingkai)
    shape(spline([[-200, 1920], [-100, 1300], [140, 1180], [380, 1300], [460, 1920]]), { fill: PAL.jacket, lw: 9, shade: () => fillOnly(rect(-300, 1500, 900, 500), PAL.jacketS, { boil: .3 }) });
    shape(ell(130, 1050, 180, 200, 30), { fill: PAL.helm, lw: 9 });
  }
};
SH.can = (t) => { cam(540, 980, lerp(1.0, 1.12, ss(seg(t, 21.25, 24.375)))); Wd.canInsert(t, T.coins); };
// KOTA sekarang: pull-back
SH.city = (t) => {
  const u = ss(seg(t, 24.375, 27.2)), z = lerp(2.3, 1.0, u);
  cam(lerp(560, 540, u), lerp(900, 1100, u), z);
  Wd.city(t);
  const tq = q(t);
  const wave = t < 27.5;
  dimas({ x: 560, y: 1640, s: 1.0, face: 1, t, look: [-.2, 0], lid: .1, brow: .2, blink: blinks(t, 8), mouth: talk('DIMAS', t).talking ? { o: talk('DIMAS', t).o } : { o: wave ? .45 : 0, sm: 1 },
    armR: wave ? { h: [70 + Math.sin(tq * 12) * 16, -170], bend: 30 } : { h: [40, 180], bend: 20 }, armL: { h: [-50, 180], bend: -10 } });
};
// JUDUL: kartu suara raksasa
SH.title = (t) => {
  reset(); screenRect('#171437');
  for (let i = 0; i < 40; i++) dot(hash(i) * W, hash(i + 3) * H, 3 + hash(i + 1) * 4, '#f7f3e8');
  const u = seg(q(t), 32.6, 32.85), s = u < 1 ? back(u, 2.4) : 1;
  reset(); translate(540, 900); rotate(-.06 + Math.sin(t * 1.3) * .01); scale(s);
  shape(rect(-430, -380, 860, 700), { fill: '#f2ead0', lw: 9, shade: () => { for (let k = 0; k < 9; k++) stroke([[-430 + k * 108, -380], [-430 + k * 108, 320]], 3, { line: '#d6c9a6' }); for (let k = 0; k < 7; k++) stroke([[-430, -380 + k * 108], [430, -380 + k * 108]], 3, { line: '#d6c9a6' }); } });
  text('KARTU SUARA', 0, -300, { font: '400 52px VT323', fill: '#c0213a' });
  text('NUSA', 10, -150, { font: '400 200px "Titan One"', fill: '#c2603f', outlineW: 22, outlineCol: INK });
  text('NUSA', 0, -160, { font: '400 200px "Titan One"', fill: '#ffd36e', outlineW: 22, outlineCol: INK });
  text('WACANA', 10, 50, { font: '400 170px "Titan One"', fill: '#c2603f', outlineW: 20, outlineCol: INK });
  text('WACANA', 0, 40, { font: '400 170px "Titan One"', fill: '#ffd36e', outlineW: 20, outlineCol: INK });
  // lubang coblosan di pojok
  const h = seg(t, 33.4, 33.5);
  if (h > 0) { shape(ell(330, 230, 26 * h, 22 * h, 16), { fill: '#171437', lw: 6 }); }
  reset();
  const b = ss(seg(t, 33.0, 33.4));
  g.globalAlpha = b;
  translate(540, 1330);
  shape(rr(-400, -60, 800, 120, 16), { fill: '#1b1422', lw: 7 });
  text('EP 1/30 · DUA TELEPON, SATU MALAM', 0, 2, { font: '400 50px VT323', fill: '#ffd36e' });
  g.globalAlpha = 1;
};
// TERAS: two-shot
SH.terrace2 = (t) => {
  const tq = q(t);
  cam(430, 960, 1.3 + .03 * ss(seg(t, 36.875, 41.875)));
  const ring = t > T.buzz1 ? 1 : 0;
  terraceScene(t, { oyenMunch: 1, dim: D(t, { holdR: 'tempe', armR: { h: [60 + (Math.floor(tq * 2) % 2) * 4, -40 - Math.max(0, Math.sin(tq * 3)) * 40], bend: 40 }, look: ring ? [-.6, .6] : [-.4, 0], ring, mouth: talk('DIMAS', t).talking ? undefined : { o: Math.max(0, Math.sin(tq * 9)) * .3, sm: .4 } }) });
};
SH.watch1 = (t) => { reset(); cam(540, 960, 1); Wd.watchInsert(t, 41.875, 'BAMBANG TEGAR', 'CAPRES'); };
SH.terrace2b = (t) => {
  cam(430, 960, 1.34);
  terraceScene(t, { dim: D(t, { holdR: 'tempe', armR: { h: [60, 80], bend: 40 }, look: [-.6, .7], lid: 0, brow: -.6, ring: 1, mouth: { o: 0, sm: -.3 } }) });
};
SH.dimasCU = (t) => {
  const tq = q(t);
  cam(640, 820, 2.5 + .06 * ss(seg(t, 45, 47.5)));
  terraceScene(t, { dim: D(t, { ring: 1, look: [-.5, -.1], lid: 0, pupil: 4, brow: -1, sweat: t * 1.5, lower: t > T.gulp && t < T.gulp + .3 ? .2 : 0, sq: t > T.gulp && t < T.gulp + .3 ? .98 : 1, panic: .35, holdR: 'tempe', armR: { h: [60, 80], bend: 40 } }) });
};
SH.bambang = (t) => {
  const tq = q(t);
  cam(430, 800, 1.22 + .05 * ss(seg(t, 47.5, 54.3)));
  const p1 = popOpen(t - T.open1), e = emerge(t, T.open1 + .25);
  const bam = e > 0 ? B(t, { s: .78 * e, holdR: t > 48.6 ? 'point' : null, armR: t > 48.6 ? { h: [130, 40], bend: -20 } : { h: [60, 130], bend: 20 }, look: [.6, .4] }) : null;
  const dim = D(t, { lean: -.08 * ss(seg(t, 47.6, 48.0)), look: [-.7, -.6], lid: 0, pupil: 4, brow: -.8, sweat: t, panic: .3, ring: 0, mouth: { o: .15, sm: -.6 }, holdR: 'tempe', armR: { h: [60, 80], bend: 40 } });
  terraceScene(t, { p1, bam, dim, ibu: I(t, { look: [.5, .3] }) });
};
SH.tempe = (t) => {
  const tq = q(t);
  cam(330, 860, 1.4);
  const give = ss(seg(t, 54.9, 55.3)), took = t > T.take;
  const bam = B(t, { holdR: took ? 'tempe' : null, bite: t > T.chomp, cheek: t > T.chomp, armR: took ? { h: lerp(130, 70, ss(seg(t, T.take, T.take + .3))) > 0 ? [lerp(160, 70, ss(seg(t, T.take, 56.0))), lerp(150, -20, ss(seg(t, T.take, 56.0)))] : [70, 0], bend: 20 } : { h: [lerp(60, 160, ss(seg(t, 54.5, 55.4))), lerp(130, 150, ss(seg(t, 54.5, 55.4)))], bend: 20 }, look: [.2, .5], lid: took ? .1 : .3, mouth: t > T.chomp ? { o: (Math.floor(tq * 8) % 2) * .2, sm: .8 } : undefined });
  const ib = I(t, { armR: { h: [lerp(86, 110, give), lerp(60, -230, give)], bend: 20 }, holdR: took ? null : (give > .2 ? 'tempe' : 'sutil'), look: [.2, -.6] });
  terraceScene(t, { p1: 1, bam, ibu: ib });
};
SH.watch2 = (t) => { reset(); cam(540, 960, 1); Wd.watchInsert(t, 56.25, 'SEKAR KENCANA', 'CAPRES'); };
SH.sekar = (t) => {
  cam(700, 800, 1.22 + .04 * ss(seg(t, 58.125, 61)));
  const p2 = popOpen(t - T.open2), e = emerge(t, T.open2 + .25);
  const sek = e > 0 ? Sk(t, { s: .78 * e }) : null;
  const dim = D(t, { look: [.7, -.6], lid: 0, pupil: 4, brow: -.8, sweat: t, panic: .2, mouth: { o: .1, sm: -.5 }, holdR: 'tempe', armR: { h: [60, 80], bend: 40 } });
  terraceScene(t, { p1: 1, p2, bam: B(t, { cheek: 1, holdR: 'tempe', armR: { h: [70, -20], bend: 20 }, look: [.8, 0] }), sek, dim });
};
function whipStreak(t, t0, dir) {
  const u = seg(t, t0, t0 + .18); if (u <= 0 || u >= 1) return;
  reset(); for (let i = 0; i < 16; i++) { const y = hash(i) * H, x = (hash(i + 4) * W + dir * u * 2400) % (W + 400) - 200; stroke([[x, y], [x + dir * 500, y]], 10, { line: 'rgba(27,20,34,.5)', boil: 0 }); }
}
SH.whipB = (t) => {
  const u = ss(seg(t, 61.0, 61.18));
  const bx = TER.p1[0] + 40, by = TER.p1[1] - 140;
  cam(lerp(TER.p2[0] - 40, bx, u), lerp(TER.p2[1] - 130, by, u), 2.1);
  terraceScene(t, { p1: 1, p2: 1, bam: B(t, { cheek: 1, holdR: 'tempe', armR: { h: [70, -20], bend: 20 }, look: [1, -.1], lid: 0, brow: .8, mouth: talk('BAMBANG', t).talking ? { o: talk('BAMBANG', t).o * .7, w: .8, sm: -.6 } : { o: 0, sm: -.4 } }), sek: Sk(t) });
  whipStreak(t, 61.0, -1);
};
SH.whipS = (t) => {
  const u = ss(seg(t, 62.2, 62.38));
  const sx = TER.p2[0] - 40, sy = TER.p2[1] - 120;
  cam(lerp(TER.p1[0] + 40, sx, u), lerp(TER.p1[1] - 140, sy, u), 2.1);
  terraceScene(t, { p1: 1, p2: 1, bam: B(t, { cheek: 1, holdR: 'tempe', armR: { h: [70, -20], bend: 20 }, look: [1, -.1], lid: .1, brow: .8, mouth: { o: 0, sm: -.4 } }), sek: Sk(t, { look: [-1, -.2], lid: .58, mouth: talk('SEKAR', t).talking ? undefined : { o: 0, sm: .7 } }) });
  whipStreak(t, 62.2, 1);
};
// HENING: wide simetris, dorong sangat lambat
SH.standoff = (t) => {
  cam(540, 900, 1.0 + .07 * ss(seg(t, 64.375, 68.75)));
  const lookWajan = t > 67.6;
  terraceScene(t, {
    p1: 1, p2: 1,
    bam: B(t, { cheek: 1, holdR: 'tempe', armR: { h: [70, -20], bend: 20 }, look: [1, -.1], lid: .1, brow: .9, mouth: { o: 0, sm: -.5 } }),
    sek: Sk(t, { look: [-1, -.1], lid: .6, mouth: { o: 0, sm: .6 } }),
    dim: D(t, { look: lookWajan ? [-.9, .6] : [0, -.2], lid: 0, pupil: 3.6, brow: -1, sweat: t * .8, mouth: { o: 0, sm: -.6 }, holdR: 'tempe', armR: { h: [60, 80], bend: 40 } }),
    ibu: I(t, { look: [.6, .5], armR: { h: [86, 60], bend: 30 }, stir: 0 }),
  });
};
// METER: CU membeku + HUD
SH.meters = (t) => {
  cam(640, 880, 2.4);
  const tf = 68.75;
  terraceScene(tf, { p1: 1, p2: 1, burnt: 1, smoke: .5,
    dim: D(tf, { look: [0, 0], lid: 0, pupil: 4, brow: -.9, sweat: 0, mouth: { o: 0, sm: -.7 }, holdR: 'tempe', armR: { h: [60, 80], bend: 40 } }),
    bam: B(tf, { cheek: 1, holdR: 'tempe', armR: { h: [70, -20], bend: 20 }, look: [1, -.1] }), sek: Sk(tf) });
  reset(); screenRect('#171437', .25);
  meterHUD(t, 68.9);
};
const METERS = [['pop', 'POPULARITAS', 40, '#ffd36e'], ['kota', 'KONDISI KOTA', 85, '#7fd6c8'], ['elite', 'RESTU ELITE', 20, '#e8b84a'], ['nurani', 'HATI NURANI', 90, '#f2ead0']];
function meterHUD(t, t0) {
  METERS.forEach(([ic, label, v, col], i) => {
    const a = t0 + i * .18, u = eo(seg(t, a, a + .35)); if (u <= 0) return;
    reset(); translate(lerp(-700, 0, u), 0);
    const y = 900 + i * 118;
    push(); translate(60, y);
    shape(rr(0, -46, 880, 92, 20), { fill: '#1b1422', lw: 6 });
    Wd.icon(ic, 56, 0, 1);
    text(label, 120, -14, { font: '400 40px VT323', fill: col, align: 'left' });
    shape(rr(120, 10, 560, 24, 10), { fill: '#3b3550', lw: 4 });
    const f = v / 100 * ss(seg(t, a + .3, a + 1.0));
    if (f > .01) fillOnly(rr(122, 12, 556 * f, 20, 8), col, { boil: .2 });
    text(Math.round(v * ss(seg(t, a + .3, a + 1.0))) + '%', 820, 4, { font: '400 56px VT323', fill: '#fff' });
    pop();
  });
}
// PILIHAN: kartu suara A/B/C
const CH = [['A', 'Terima tawaran Pak Bambang sekarang juga', '#5b2a86'], ['B', 'Dengarkan dulu tawaran Bu Sekar', '#7d8792'], ['C', 'Matikan HP, tanya Ibu dulu', '#d9a227']];
SH.choices = (t) => {
  reset(); screenRect('#171437');
  for (let i = 0; i < 40; i++) dot(hash(i) * W, hash(i + 3) * H, 3 + hash(i + 1) * 4, '#f7f3e8');
  reset();
  const hs = back(seg(t, 72.8, 73.1), 2);
  push(); translate(540, 300); scale(hs);
  text('MALAM INI AKU', 0, -50, { font: '400 92px "Titan One"', fill: '#ffd36e', outlineW: 16, outlineCol: INK });
  text('HARUS JAWAB APA?', 0, 60, { font: '400 88px "Titan One"', fill: '#ffd36e', outlineW: 16, outlineCol: INK });
  pop();
  const ts = [T.choiceA, T.choiceB, T.choiceC];
  CH.forEach(([k, txt, col], i) => {
    const s = back(seg(q(t), ts[i], ts[i] + .22), 2.2); if (s <= 0) return;
    const bump = 1 + .04 * Math.max(0, Math.sin((t - 76.25) * Math.PI / BEAT)) * (t > 76.25 && Math.floor((t - 76.25) / BEAT) % 3 === i ? 1 : 0);
    reset(); push(); translate(540, 600 + i * 230); rotate((i - 1) * .02); scale(s * bump);
    shape(rect(-470, -95, 940, 190), { fill: '#f2ead0', lw: 8, shade: () => { for (let x = -470; x < 470; x += 60) stroke([[x, -95], [x, 95]], 3, { line: '#d6c9a6' }); } });
    shape(ell(-370, 0, 70, 70, 30), { fill: col, lw: 7 });
    text(k, -370, 6, { font: '400 92px "Titan One"', fill: '#fff', outlineW: 12, outlineCol: INK });
    const words = txt.split(' '), half = Math.ceil(words.length / 2), l1 = words.slice(0, half).join(' '), l2 = words.slice(half).join(' ');
    text(l1, -270, -30, { font: '800 50px "Baloo 2"', fill: INK, align: 'left' });
    text(l2, -270, 36, { font: '800 50px "Baloo 2"', fill: INK, align: 'left' });
    pop();
  });
  const c = back(seg(t, T.cta, T.cta + .25), 2);
  if (c > 0) {
    reset(); push(); translate(540, 1330); scale(c);
    shape(rr(-440, -90, 880, 180, 26), { fill: PAL.glow, lw: 8 });
    text('KOMEN A, B, ATAU C', 0, -22, { font: '400 72px "Titan One"', fill: '#fff', outlineW: 12, outlineCol: INK });
    text('VOTING TUTUP BESOK 19.00', 0, 50, { font: '400 46px VT323', fill: '#1b1422' });
    pop();
  }
};
// TELUR PASKAH: dorong ke teks berjalan di TV
SH.egg = (t) => {
  const u = eio(seg(t, 81.25, 82.6));
  cam(lerp(540, TER.tv[0] - 20, u), lerp(900, TER.tv[1] - 12, u), lerp(1.0, 4.2, u));
  terraceScene(t, { p1: 1, p2: 1, egg: 1,
    bam: B(t, { cheek: 1, holdR: 'tempe', armR: { h: [70, -20], bend: 20 }, look: [1, -.1], lid: .1, brow: .9, mouth: { o: 0, sm: -.5 } }), sek: Sk(t, { look: [-1, -.1], lid: .6 }),
    dim: D(t, { look: [0, -.2], lid: 0, pupil: 3.6, brow: -1, mouth: { o: 0, sm: -.6 }, holdR: 'tempe', armR: { h: [60, 80], bend: 40 } }) });
  if (t > 83.1) { reset(); screenRect('#000'); }
};

// ———————————————————— lapisan layar ————————————————————
function wipe(t) {
  for (const [tc, hw] of WIPES) {
    const d = Math.abs(t - tc); if (d > hw) continue;
    const u = 1 - d / hw, R = 1500 * Math.pow(u, .6);
    reset(); Wd.portal(540, 900, R, t, { open: 1, sx: 1, spin: 2.2 });
    if (d < .03) screenRect(PAL.glowCore, .7);
  }
}
function tag(t) {
  for (const [a, b, l1, l2, bg, fg] of TAGS) {
    if (t < a || t >= b) continue;
    const n = Math.floor((t - a) * 40), s1 = l1.slice(0, n), s2 = l2.slice(0, Math.max(0, n - l1.length));
    reset();
    const p = back(seg(t, a, a + .18), 2.2);
    push(); translate(56, 170); scale(p);
    g.setTransform(1, 0, 0, 1, 0, 0); g.font = '400 50px VT323';
    const w = Math.max(g.measureText('▶ ' + l1).width, g.measureText(l2).width * 44 / 50) + 60;
    shape(rr(0, 0, Math.min(960, Math.max(380, w)), 116, 12), { fill: bg, lw: 7 });
    text('▶ ' + s1 + (n < l1.length && Math.floor(t * 6) % 2 ? '█' : ''), 24, 38, { font: '400 50px VT323', fill: fg, align: 'left' });
    text(s2, 26, 84, { font: '400 44px VT323', fill: fg, align: 'left' });
    pop();
  }
}
function badge(t) {
  if (t < 4.4 || t >= 72.5 || (t >= 32.5 && t < 36.875) || shotAt(t)[2].startsWith('watch')) return;
  reset(); translate(905, 205);
  shape(rr(-95, -34, 190, 68, 16), { fill: '#1b1422', lw: 6 });
  text('EP 1/30', 0, 2, { font: '400 50px VT323', fill: '#ffd36e' });
}
// subtitle: Baloo 2 ExtraBold putih bertepi hitam + pill penutur; dinaikkan di atas UI Reels
const CUTS = [3.75, 8.75, 15.0, 24.375, 32.5, 64.375, 68.75, 72.5];
export const SUBS = Object.values(LINE).map(L => {
  let t1 = L.t0 + Math.max(L.d + .35, .9 + L.sub.length / 17, L.d + .6);
  if (L.sub.length <= 8) t1 = L.t0 + Math.max(L.d + .35, 1.15);
  const cut = CUTS.find(c => c > L.t0 + .1); if (cut && t1 > cut) t1 = Math.max(cut - .02, L.t0 + L.d + .2);
  const nxt = Object.values(LINE).filter(M => M.t0 > L.t0 + .05 && M.who === L.who).sort((a, b) => a.t0 - b.t0)[0];
  if (nxt && t1 > nxt.t0 - .02) t1 = nxt.t0 - .02;
  return { id: L.id, t0: L.t0, t1: +t1.toFixed(3), who: L.who, text: L.sub };
});
function wrapSub(str) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.font = '800 54px "Baloo 2"';
  if (g.measureText(str).width < 900) return [str];
  const mid = str.length / 2; let best = -1;
  for (let i = 0; i < str.length; i++) if (str[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  return [str.slice(0, best), str.slice(best + 1)];
}
const WHO_LABEL = { BATIN: 'DIMAS · BATIN' };
function subs(t) {
  const act = SUBS.filter(s => t >= s.t0 && t < s.t1).slice(-2);
  let y = 1460;
  for (let i = act.length - 1; i >= 0; i--) {
    const s = act[i], a = i === act.length - 1 ? 1 : .7, lines = wrapSub(s.text);
    const p = back(seg(t, s.t0, s.t0 + .12), 2);
    const y0 = y - (lines.length - 1) * 68;
    reset(); g.globalAlpha = a;
    lines.forEach((l, k) => text(l, 540, y0 + k * 68, { font: '800 54px "Baloo 2"', fill: '#fff', outlineW: 12 }));
    const lab = WHO_LABEL[s.who] || s.who;
    g.setTransform(1, 0, 0, 1, 0, 0); g.font = '800 28px "Baloo 2"'; const nw = g.measureText(lab).width + 36;
    push(); translate(540, y0 - 64); scale(p);
    shape(rr(-nw / 2, -22, nw, 44, 14), { fill: WHO_COL[s.who], lw: 5 });
    text(lab, 0, 2, { font: '800 28px "Baloo 2"', fill: '#fff' });
    pop();
    g.globalAlpha = 1;
    y = y0 - 140;
  }
}

function render(t) {
  frame(t);
  screenRect('#000');
  const [, , name] = shotAt(t);
  SH[name](t, q(t));
  wipe(t);
  tag(t);
  badge(t);
  if (!(t >= 72.5 && t < 81.25) && !(t >= 32.5 && t < 36.875)) subs(t);
}

// —— event suara untuk mix.py / score.py ——
function events() {
  const ev = [], add = (type, t, o = {}) => ev.push({ type, t: +t.toFixed(3), ...o });
  for (const L of Object.values(LINE)) add('vo', L.t0, { id: L.id, who: L.who, d: L.d });
  for (const [a, b, name] of CUES) add('cue', a, { name, d: +(b - a).toFixed(3) });
  let cur = null;
  for (const [a, b, , w] of SHOTS) { if (cur && cur.w === w) cur.b = b; else { if (cur) add('amb', cur.a, { w: cur.w, d: +(cur.b - cur.a).toFixed(3) }); cur = { a, b, w }; } }
  add('amb', cur.a, { w: cur.w, d: +(cur.b - cur.a).toFixed(3) });
  // hook
  add('portalHum', 0, { d: 2.6, v: .7 }); add('jitter', 0.1, { d: 2.4 });
  add('scratch', T.freeze); add('portalWhoosh', 3.55); add('suck', 3.6);
  for (const [tc] of WIPES) add('portalWhoosh', tc - .2);
  // tanggul
  add('whoosh', 5.2, { v: .5 }); add('whoosh', 7.4, { v: .4 });
  // banjir ×3 + reaksi
  add('stinger', 8.75, { n: 0 }); add('stinger', 10.0, { n: 1 }); add('stinger', 11.25, { n: 2 });
  add('blub', 9.1); add('glorp', 10.3); add('ticket', 11.5);
  // asal-usul
  add('hover', 15.0, { d: 3.0 }); add('click', T.photo); add('beep', T.sent); add('beep', T.sent + .9, { v: .6 }); add('stamp', T.zero);
  T.coins.forEach((c, i) => add('coin', c + .33, { n: i }));
  // kota
  add('boing', 24.55, { v: .6 }); add('whoosh', 26.0, { v: .4 });
  add('type', 28.6, { d: 1.1 });
  // judul
  add('slam', 32.6); add('punch', 33.4); add('type', 33.0, { d: .8 });
  // teras
  add('type', 37.0, { d: .9 });
  add('buzz', T.buzz1, { d: 2.2 }); add('gulp', T.gulp);
  add('portalOpen', T.open1); add('portalHum', T.open1 + .1, { d: 83.0 - T.open1 - .1, v: .45 }); add('boing', T.open1 + .3, { v: .5 });
  add('pop', 54.95); add('pop', T.take, { v: .7 }); add('chomp', T.chomp); add('chomp', T.chomp + .3, { v: .7 });
  add('buzz', T.buzz2, { d: 2.1 });
  add('portalOpen', T.open2, { v: .8 }); add('boing', T.open2 + .3, { v: .5 });
  add('whip', 61.0); add('whip', 62.2);
  // hening
  for (let s = 65; s <= 68; s++) add('tick', s);
  add('sizzleBurn', 65.4, { d: 3.3 });
  // meter, pilihan
  for (let i = 0; i < 4; i++) add('blip', 68.9 + i * .18, { n: i });
  add('pop', 72.8); add('pop', T.choiceA); add('pop', T.choiceB); add('pop', T.choiceC); add('boing', T.cta);
  // telur paskah
  add('blip', 83.1, { n: 7 });
  return ev.sort((a, b) => a.t - b.t);
}

window.render = render; window.DUR = DUR; window.EV = events(); window.SUBS = SUBS; window.LINES_OUT = Object.values(LINE);
for (const f of ['800 54px "Baloo 2"', '400 60px "Titan One"', '400 40px VT323']) await document.fonts.load(f);
const qt = new URLSearchParams(location.search).get('t');
render(parseFloat(qt ?? '50'));
window.READY = true;
