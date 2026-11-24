// Nusa Wacana EP 2/30 — "Tawaran Bu Sekar" · gaya Sci-Fi Sitcom Toon · 1080×1920
import { clamp, lerp, seg, ss, eo, eio, back, hash } from './lib.js';
import { W, H, INK, init, frame, g, push, pop, translate, rotate, scale, shape, fillOnly, stroke, ell, rr, rect, dot, text, screenRect, reset } from './toon.js';
import { dimas, ibu, bambang, sekar, PAL, WHO_COL } from './chars.js';
import * as Wd from './worlds.js';
import { ballot, stampB, drone, holo } from './props2.js';
import { DUR, q, LINES, SHOTS, shotAt, shotNamed, WIPES, TAGS, T, CUES, CUTS, SILENCES, BEAT } from './story.js';

init(document.getElementById('c'));
const J = async f => { try { const r = await fetch(f); if (r.ok) return await r.json(); } catch (e) { } return null; };
const DURS = (await J('voices/dur.json')) || {}, LIPS = (await J('voices/lips.json')) || {};
const LINE = Object.fromEntries(LINES.map(([id, who, sub, raw, t0, d, mouth]) => [id, { id, who, sub, raw, t0, d: DURS[id] ?? d, mouth }]));
const TER = Wd.TER;

// —— gerak mulut: hanya pada bagian kutipan tokoh itu ——
function talk(who, t) {
  const tq = q(t);
  for (const L of Object.values(LINE)) {
    const rel = tq - L.t0;
    if (rel < 0 || rel >= L.d) continue;
    const part = L.mouth.find(([a, b, w]) => w === who && rel >= a && rel < b);
    if (!part) continue;
    const lp = LIPS[L.id], k = Math.floor(rel * 24);
    if (lp) return { o: lp.o[k] ?? 0, w: .8 + .45 * (lp.b[k] ?? .5), talking: true };
    const n = Math.max(1, Math.round((part[1] - part[0]) * 5.5)), ph = (rel - part[0]) / (part[1] - part[0]) * n, i = Math.floor(ph), u = ph - i;
    return { o: Math.pow(Math.max(0, Math.sin(Math.PI * u)), .8) * (.45 + .45 * hash(i * 3.7 + L.t0)), w: .85 + .3 * hash(i * 1.3), talking: true };
  }
  return { o: 0, w: 1, talking: false };
}
const blinks = (t, seed) => { const k = Math.floor(t * 12), b = Math.floor(k / 30); return hash(b * 7.1 + seed) > .35 && (k % 30 === Math.floor(hash(b + seed) * 20)); };
const popOpen = x => x <= 0 ? 0 : back(clamp(x / .32), 1.7);
function cam(cx, cy, z, shake = 0, t = 0) {
  reset(); translate(W / 2, H / 2);
  if (shake) { const f = Math.floor(t * 24); translate((hash(f) - .5) * shake * 2, (hash(f + 77) - .5) * shake * 2); }
  scale(z); translate(-cx, -cy);
}
const span = t => shotAt(t).slice(0, 2);

// —— pose bawaan (sama dengan Ep 1) ——
function D(t, o = {}) {
  const m = talk('DIMAS', t), tq = q(t);
  return { x: TER.dimX, y: TER.floor - 15, sit: 1, s: 1, face: 1, t, look: [.2, 0], lid: .1, brow: 0, blink: blinks(t, 1),
    mouth: { o: m.o, w: m.w, sm: m.talking ? .1 : -.2 }, sq: 1 + .01 * Math.sin(tq * 3.1), headTilt: m.talking ? (m.o - .3) * .08 : Math.sin(tq * 1.4) * .02,
    holdR: 'tempe', armR: { h: [60, 80], bend: 40 }, armL: { h: [40, 150], bend: -10 }, ...o };
}
function I(t, o = {}) {
  const m = talk('IBU', t), tq = q(t);
  return { x: TER.ibuX, y: TER.floor - 20, s: 1, face: 1, look: [.4, .3], lid: .56, blink: blinks(t, 2), mouth: { o: m.o * .9, w: m.w, sm: -.1 },
    sq: 1 + .008 * Math.sin(tq * 2.3), headTilt: m.talking ? (m.o - .3) * .05 : 0,
    armR: { h: [86 + Math.sin(tq * 5) * 14, 60], bend: 30 }, holdR: 'sutil', stir: Math.sin(tq * 5) * .25, armL: { h: [-10, 150], bend: -20 }, ...o };
}
function B(t, o = {}) {
  const m = talk('BAMBANG', t), tq = q(t);
  return { x: TER.p1[0] + 20, y: TER.p1[1] + 120, s: .78, face: 1, lean: .32, look: [.5, .4], lid: .2, blink: blinks(t, 3), brow: .9,
    mouth: { o: m.o * 1.1, w: m.w * 1.1, sm: m.talking ? -.3 : -.6 }, sq: 1 + .01 * Math.sin(tq * 2), headTilt: m.talking ? (m.o - .3) * .08 : 0,
    holdR: 'tempe', armR: { h: [70, -20], bend: 20 }, armL: { h: [-40, 170], bend: -20 }, ...o };
}
function Sk(t, o = {}) {
  const m = talk('SEKAR', t), tq = q(t);
  return { x: TER.p2[0] - 10, y: TER.p2[1] + 130, s: .78, face: -1, lean: .26, look: [.6, .3], lid: .52, blink: blinks(t, 4), mouth: { o: m.o * .8, w: m.w, sm: .45 },
    sq: 1 + .008 * Math.sin(tq * 2.4), headTilt: m.talking ? (m.o - .3) * .05 : -.04, armR: { h: [60, 110], bend: 30 }, armL: { h: [-10, 180], bend: -14 }, ...o };
}
const emerge = (t, t0) => back(clamp((t - t0) / .45), 1.4);
const close1 = t => 1 - ss(seg(t, T.close1, T.close1 + .45));
const close2 = t => 1 - ss(seg(t, T.close2, T.close2 + .45));
const wide2 = t => 1 + .22 * eo(seg(t, T.offerA, T.offerA + .6)) * close2(t);
const tempeLeft = t => t > T.grab ? 2 : 3;

// drone: posisi menurut waktu
function droneState(t) {
  if (t < T.droneOut) return null;
  if (t >= T.swat) {
    const u = clamp((t - T.swat) / .35);
    return { x: lerp(470, 395, u), y: lerp(560, 955, u * u), s: lerp(.55, .42, u), tilt: lerp(0, 1.1, u), dead: u >= 1 ? 1 : 0, flash: 0 };
  }
  const u = eo(clamp((t - T.droneOut) / .9));
  const x = lerp(TER.p2[0], 470, u), y = lerp(TER.p2[1], 560, u) - Math.sin(u * Math.PI) * 120 + Math.sin(t * 5) * 8;
  const fl = t > T.nope && t < T.nope + 1.5 ? 1 : 0;
  return { x: x + (fl ? (hash(Math.floor(t * 24)) - .5) * 10 : 0), y, s: .55, tilt: Math.sin(t * 3) * .06, flash: fl, dead: 0,
    lines: t > LINE.e10.t0 ? ['NASKAH #1:', '"TERIMA KASIH', ' IBU SEKAR..."'] : ['MEMUAT', 'NASKAH...'] };
}

function terraceScene(t, o = {}) {
  const smoke = o.smoke ?? (t < 6 ? .35 * (1 - t / 6) : (t > T.swat ? .6 * clamp((t - T.swat) / .5) : 0));
  Wd.terrace(t, { egg: o.egg, clockSec: Math.floor(t), burnt: 1, smoke, tempeN: tempeLeft(t), oyenMunch: 0, oyenLook: o.oyenLook ?? [-.5, -.3], fry: 1 });
  const p1 = o.p1 ?? close1(t), p2 = o.p2 ?? (close2(t) * wide2(t));
  if (p1 > .01) Wd.portal(TER.p1[0], TER.p1[1], 230, t, { open: p1, inner: Wd.innerBambang });
  if (p2 > .01) Wd.portal(TER.p2[0], TER.p2[1], 220, t, { open: p2, inner: Wd.innerSekar });
  if (p1 > .05) bambang({ ...(o.bam || B(t)), s: (o.bam?.s ?? .78) * Math.min(1, p1) });
  if (p2 > .05) sekar({ ...(o.sek || Sk(t)), s: (o.sek?.s ?? .78) * Math.min(1, close2(t)) });
  const ds = droneState(t);
  if (ds && ds.dead) drone(ds.x, ds.y, ds.s, t, ds);
  ibu(o.ibu || I(t));
  dimas(o.dim || D(t));
  if (ds && !ds.dead) drone(ds.x, ds.y, ds.s, t, ds);
  if (o.holo) {
    const [a1, a2, a3] = T.holo.map(x => seg(t, x, x + .25));
    holo(300, 190, 420, 170, 'ANGGARAN ×10', 'RAWA SUMPEK', a1, t, 0);
    holo(300, 390, 420, 170, 'KERETA GANTUNG', null, a2, t, 1);
    holo(300, 590, 420, 170, 'TAMAN', 'DI ATAS TANGGUL', a3, t, 2);
  }
}

// ———————————————————— shot ————————————————————
const SH = {};
SH.hook = (t) => {
  reset(); screenRect('#171437');
  for (let i = 0; i < 40; i++) dot(hash(i) * W, hash(i + 3) * H, 3 + hash(i + 1) * 4, '#f7f3e8');
  const z = 1 + .05 * ss(seg(t, 0, T.hookEnd));
  reset(); translate(540, 760); scale(.95 * z);
  ballot(t, { wob: Math.sin(t * 1.3) * .01 });
  push(); translate(300, -100); scale(.62); stampB(t < .02 ? 1 : 1 + .25 * Math.exp(-(t - .02) * 9) * Math.cos((t - .02) * 30) * (t < .5 ? 1 : 0)); pop();
  reset(); translate(540, 1260);
  shape(rr(-400, -50, 800, 100, 16), { fill: '#1b1422', lw: 7 });
  text('EP 2/30 · TAWARAN BU SEKAR', 0, 2, { font: '400 50px VT323', fill: '#ffd36e' });
};
SH.wipeIn = () => { reset(); screenRect('#1b1422'); };
SH.bamAngry = (t) => {
  const [a, b] = span(t);
  cam(TER.p1[0] + 40, TER.p1[1] - 120, 2.0 + .1 * ss(seg(t, a, b)));
  terraceScene(t, { bam: B(t, { look: [.9, .2], lid: 0, brow: 1, armR: { h: [120, -40], bend: -10 } }) });
};
SH.grab = (t) => {
  cam(330, 860, 1.4);
  const reach = ss(seg(t, T.grab - .5, T.grab)) * (1 - ss(seg(t, T.grab + .15, T.grab + .6)));
  const has = t > T.grab;
  terraceScene(t, {
    bam: B(t, { look: [.2, .8], holdR: has ? 'tempe' : null, armR: { h: [lerp(70, 210, reach), lerp(-20, 330, reach)], bend: 20 } }),
    ibu: I(t, { look: [-.2, -.7], stir: 0 }),
  });
};
SH.ibuAsk = (t) => { cam(320, 880, 1.5); terraceScene(t, { ibu: I(t, { look: [-.3, -.7] }) }); };
SH.close1 = (t) => {
  cam(540, 900, 1.0);
  terraceScene(t, { bam: B(t, { look: [.4, .3], armR: { h: [40, -180], bend: 10 } }), dim: D(t, { look: [-.6, -.5], lid: 0, brow: -.5 }) });
};
SH.sekarOffer = (t) => {
  const [a, b] = span(t);
  cam(lerp(640, 520, ss(seg(t, a, T.holo[0]))), lerp(760, 660, ss(seg(t, a, T.holo[0]))), lerp(1.2, 1.1, ss(seg(t, a, T.holo[0]))));
  terraceScene(t, { holo: 1, sek: Sk(t, { holdR: 'point', armR: { h: [140, 20], bend: -20 } }), dim: D(t, { look: [-.7, -.6], lid: 0, brow: .2, mouth: { o: .25, sm: .3 } }) });
};
SH.dazzled = (t) => {
  cam(640, 760, 2.5);
  terraceScene(t, { holo: 1, dim: D(t, { look: [-.6, -.5], lid: 0, pupil: 6.5, brow: .4, mouth: { o: .35, w: .9, sm: 1 }, headTilt: 0 }) });
  // kilau di mata (koordinat dunia, di atas pupil)
  for (const [x, y] of [[629, 606], [680, 609]]) { const r = 7 + 2.5 * Math.sin(t * 9); shape([[x, y - r], [x + r * .3, y - r * .3], [x + r, y], [x + r * .3, y + r * .3], [x, y + r], [x - r * .3, y + r * .3], [x - r, y], [x - r * .3, y - r * .3]], { fill: '#ffffff', lw: 4 }); }
  reset(); screenRect('rgba(255,63,164,.08)');
};
SH.drone = (t) => {
  cam(620, 760, 1.25);
  terraceScene(t, { dim: D(t, { look: t > T.droneOut ? [-.5, -.6] : [.6, -.4], lid: 0, brow: -.4, mouth: { o: .1, sm: -.3 } }) });
};
SH.nope = (t) => {
  cam(560, 640, 2.0);
  const fl = t > T.nope;
  terraceScene(t, { dim: D(t, { look: [-.8, -.3], lid: 0, pupil: fl ? 3.5 : 5, brow: fl ? -1 : -.3, panic: fl ? .8 : 0, sweat: fl ? t : null, lean: fl ? -.06 : 0 }) });
};
SH.swat = (t) => {
  cam(420, 860, 1.25);
  const up = ss(seg(t, T.swat - .9, T.swat - .25)) * (1 - ss(seg(t, T.swat + .4, T.swat + .9))), hit = t > T.swat - .25 && t < T.swat + .4;
  const arm = hit ? { h: [150, -60 + 120 * ss(seg(t, T.swat - .25, T.swat))], bend: 10 } : { h: [lerp(86, 120, up), lerp(60, -200, up)], bend: 20 };
  terraceScene(t, {
    ibu: I(t, { armR: arm, stir: hit ? 1.6 : (up > .1 ? .9 : 0), look: [.6, -.6] }),
    dim: D(t, { look: t > T.swat ? [-.8, .6] : [-.7, -.4], lid: 0, brow: -.6 }),
    oyenLook: t > T.swat ? [-.9, -.2] : [-.5, -.3],
  });
};
SH.threat = (t) => {
  const u = ss(seg(t, LINE.e13.t0, T.whisper));
  cam(lerp(720, TER.p2[0] - 40, u), lerp(760, TER.p2[1] - 130, u), lerp(1.2, 2.2, u));
  terraceScene(t, { sek: Sk(t, { lid: t > T.whisper ? .66 : .52, look: [.8, .2] }), dim: D(t, { look: [.8, -.5], lid: 0, brow: -.8 }) });
};
SH.quiet = (t) => {
  const [a, b] = span(t);
  cam(470, 900, 1.15 + .06 * ss(seg(t, a, b)));
  terraceScene(t, { dim: D(t, { look: [-.9, .5], lid: .2, brow: -.3, mouth: { o: 0, sm: -.4 } }), ibu: I(t, { stir: 0, armR: { h: [86, 60], bend: 30 }, look: [.6, .4] }) });
};
const METERS = [['pop', 'POPULARITAS', 40, 46, '#ffd36e'], ['kota', 'KONDISI KOTA', 85, 85, '#7fd6c8'], ['elite', 'RESTU ELITE', 20, 32, '#e8b84a'], ['nurani', 'HATI NURANI', 90, 84, '#f2ead0']];
SH.meters = (t) => {
  cam(640, 880, 2.4);
  terraceScene(T.metA, { dim: D(T.metA, { look: [0, 0], lid: .1, pupil: 4, brow: -.6, mouth: { o: 0, sm: -.5 } }) });
  reset(); screenRect('#171437', .25);
  METERS.forEach(([ic, label, v0, v1, col], i) => {
    const a = T.metA + .15 + i * .18, u = eo(seg(t, a, a + .35)); if (u <= 0) return;
    const f0 = ss(seg(t, a + .3, a + .8)), f1 = ss(seg(t, a + 1.4, a + 2.0)), v = lerp(0, v0, f0) + (v1 - v0) * f1;
    reset(); translate(lerp(-700, 0, u), 0); push(); translate(60, 760 + i * 118);
    shape(rr(0, -46, 880, 92, 20), { fill: '#1b1422', lw: 6 });
    Wd.icon(ic, 56, 0, 1);
    text(label, 120, -14, { font: '400 40px VT323', fill: col, align: 'left' });
    shape(rr(120, 10, 560, 24, 10), { fill: '#3b3550', lw: 4 });
    if (v > .5) fillOnly(rr(122, 12, 556 * v / 100, 20, 8), col, { boil: .2 });
    text(Math.round(v) + '%', 750, 4, { font: '400 56px VT323', fill: '#fff' });
    if (f1 > .5 && v1 !== v0) text((v1 > v0 ? '▲' : '▼') + Math.abs(v1 - v0), 862, 4, { font: '400 42px VT323', fill: v1 > v0 ? '#7fd6c8' : '#ff8a8a', align: 'right' });
    pop();
  });
};
const CH = [['A', 'Terima tawaran Bu Sekar (pakai naskahnya)', '#7d8792'], ['B', 'Tolak, kembali ke Pak Bambang', '#5b2a86'], ['C', 'Tawar balik: bicara pakai kata-kataku sendiri', '#d9a227']];
SH.choices = (t) => {
  reset(); screenRect('#171437');
  for (let i = 0; i < 40; i++) dot(hash(i) * W, hash(i + 3) * H, 3 + hash(i + 1) * 4, '#f7f3e8');
  reset(); const hs = back(seg(t, T.chA + .3, T.chA + .6), 2);
  push(); translate(540, 300); scale(hs);
  text('AKU HARUS', 0, -50, { font: '400 96px "Titan One"', fill: '#ffd36e', outlineW: 16, outlineCol: INK });
  text('GIMANA?', 0, 64, { font: '400 96px "Titan One"', fill: '#ffd36e', outlineW: 16, outlineCol: INK });
  pop();
  [T.choiceA, T.choiceB, T.choiceC].forEach((t0, i) => {
    const [k, txt, col] = CH[i], s = back(seg(q(t), t0, t0 + .22), 2.2); if (s <= 0) return;
    const bump = 1 + .04 * Math.max(0, Math.sin((t - T.cta) * Math.PI / BEAT)) * (t > T.cta && Math.floor((t - T.cta) / BEAT) % 3 === i ? 1 : 0);
    reset(); push(); translate(540, 600 + i * 230); rotate((i - 1) * .02); scale(s * bump);
    shape(rect(-470, -95, 940, 190), { fill: '#f2ead0', lw: 8, shade: () => { for (let x = -470; x < 470; x += 60) stroke([[x, -95], [x, 95]], 3, { line: '#d6c9a6' }); } });
    shape(ell(-370, 0, 70, 70, 30), { fill: col, lw: 7 });
    text(k, -370, 6, { font: '400 92px "Titan One"', fill: '#fff', outlineW: 12, outlineCol: INK });
    g.setTransform(1, 0, 0, 1, 0, 0); g.font = '800 46px "Baloo 2"';
    const words = txt.split(' '); let l1 = '', l2 = '';
    for (const w of words) { if (!l2 && g.measureText((l1 ? l1 + ' ' : '') + w).width < 640) l1 = l1 ? l1 + ' ' + w : w; else l2 = l2 ? l2 + ' ' + w : w; }
    text(l1, -270, l2 ? -28 : 4, { font: '800 46px "Baloo 2"', fill: INK, align: 'left' });
    if (l2) text(l2, -270, 34, { font: '800 46px "Baloo 2"', fill: INK, align: 'left' });
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
SH.egg = (t) => {
  const u = eio(seg(t, T.egg, T.egg + 1.35));
  cam(lerp(480, TER.tv[0] - 20, u), lerp(900, TER.tv[1] - 12, u), lerp(1.0, 4.2, u));
  terraceScene(t, { egg: T.egg, dim: D(t, { look: [0, -.2], lid: .2, brow: -.4, mouth: { o: 0, sm: -.4 } }) });
  if (t > T.egg + 1.85) { reset(); screenRect('#000'); }
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
    reset(); const p = back(seg(t, a, a + .18), 2.2);
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
  const nm = shotAt(t)[2]; if (['hook', 'wipeIn', 'choices', 'egg'].includes(nm)) return;
  reset(); translate(905, 205);
  shape(rr(-95, -34, 190, 68, 16), { fill: '#1b1422', lw: 6 });
  text('EP 2/30', 0, 2, { font: '400 50px VT323', fill: '#ffd36e' });
}
export const SUBS = Object.values(LINE).map(L => {
  let t1 = L.t0 + Math.max(L.d + .35, .9 + L.sub.length / 17, L.d + .6);
  const cut = CUTS.find(c => c > L.t0 + .1); if (cut && t1 > cut) t1 = Math.max(cut - .02, L.t0 + L.d + .2);
  const nxt = Object.values(LINE).filter(M => M.t0 > L.t0 + .05).sort((a, b) => a.t0 - b.t0)[0];
  if (nxt && t1 > nxt.t0 - .02) t1 = nxt.t0 - .02;
  return { id: L.id, t0: L.t0, t1: +t1.toFixed(3), who: L.who, text: L.sub };
});
function wrapSub(str) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.font = '800 54px "Baloo 2"';
  const out = []; let cur = '';
  for (const w of str.split(' ')) { const nx = cur ? cur + ' ' + w : w; if (g.measureText(nx).width > 920 && cur) { out.push(cur); cur = w; } else cur = nx; }
  if (cur) out.push(cur);
  return out;
}
const WHO_LABEL = { BATIN: 'DIMAS · BATIN' };
function subs(t) {
  const act = SUBS.filter(s => t >= s.t0 && t < s.t1).slice(-1);
  for (const s of act) {
    const lines = wrapSub(s.text), p = back(seg(t, s.t0, s.t0 + .12), 2);
    const y0 = 1460 - (lines.length - 1) * 68;
    reset();
    lines.forEach((l, k) => text(l, 540, y0 + k * 68, { font: '800 54px "Baloo 2"', fill: '#fff', outlineW: 12 }));
    const lab = WHO_LABEL[s.who] || s.who;
    g.setTransform(1, 0, 0, 1, 0, 0); g.font = '800 28px "Baloo 2"'; const nw = g.measureText(lab).width + 36;
    push(); translate(540, y0 - 64); scale(p);
    shape(rr(-nw / 2, -22, nw, 44, 14), { fill: WHO_COL[s.who], lw: 5 });
    text(lab, 0, 2, { font: '800 28px "Baloo 2"', fill: '#fff' });
    pop();
  }
}

function render(t) {
  frame(t);
  screenRect('#000');
  SH[shotAt(t)[2]](t);
  wipe(t);
  tag(t);
  badge(t);
  if (!['choices', 'egg'].includes(shotAt(t)[2])) subs(t);
}

function events() {
  const ev = [], add = (type, t, o = {}) => ev.push({ type, t: +t.toFixed(3), ...o });
  for (const L of Object.values(LINE)) add('vo', L.t0, { id: L.id, who: L.who, d: L.d, raw: L.raw });
  for (const [a, b, name] of CUES) add('cue', a, { name, d: +(b - a).toFixed(3) });
  for (const [a, b, name] of SILENCES) add('silence', a, { d: +(b - a).toFixed(3), name });
  let cur = null;
  for (const [a, b, , w] of SHOTS) { if (cur && cur.w === w) cur.b = b; else { if (cur) add('amb', cur.a, { w: cur.w, d: +(cur.b - cur.a).toFixed(3) }); cur = { a, b, w }; } }
  add('amb', cur.a, { w: cur.w, d: +(cur.b - cur.a).toFixed(3) });
  add('stamp', 0.02); add('slam', 0.02, { v: .6 });
  for (const [tc] of WIPES) add('portalWhoosh', tc - .2);
  add('portalHum', T.hookEnd + .2, { d: T.close2 - T.hookEnd, v: .45 });
  add('type', TAGS[0][0], { d: .9 });
  add('pop', T.grab - .05, { v: .6 }); add('chomp', T.grab + .7, { v: .8 });
  add('portalClose', T.close1);
  add('portalOpen', T.offerA, { v: .45 });
  T.holo.forEach((x, n) => add('blip', x, { n: n * 2 }));
  add('blip', shotNamed('dazzled')[0] + .2, { n: 9 }); add('blip', shotNamed('dazzled')[0] + .45, { n: 11 });
  add('portalWhoosh', T.droneOut - .1, { v: .6 }); add('drone', T.droneOut, { d: T.swat - T.droneOut });
  add('robot', T.nope);
  add('whoosh', T.swat - .3, { v: .6 }); add('swat', T.swat); add('sizzleBurst', T.swat + .35);
  add('portalClose', T.close2);
  for (let x = Math.ceil(T.silence[0]); x < LINE.e14.t0 + .5; x++) add('tick', x);
  for (let i = 0; i < 4; i++) add('blip', T.metA + .15 + i * .18, { n: i });
  add('pop', T.chA + .3); add('pop', T.choiceA); add('pop', T.choiceB); add('pop', T.choiceC); add('boing', T.cta);
  add('blip', T.egg + 1.85, { n: 7 });
  return ev.sort((a, b) => a.t - b.t);
}

window.render = render; window.DUR = DUR; window.EV = events(); window.SUBS = SUBS; window.LINES_OUT = Object.values(LINE);
for (const f of ['800 54px "Baloo 2"', '400 60px "Titan One"', '400 40px VT323']) await document.fonts.load(f);
const qt = new URLSearchParams(location.search).get('t');
render(parseFloat(qt ?? '1'));
window.READY = true;
