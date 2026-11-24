// chars.js — pemeran orisinal Nusa Wacana: Dimas, Ibu, Pak Bambang, Bu Sekar, Si Oyen
// Koordinat lokal: titik asal di kaki (Dimas, Ibu) atau di pinggang (Bambang, Sekar yang menjulur dari portal), y ke bawah.
// face = 1 menghadap kanan (tampak 3/4), -1 dicerminkan.
// eye(), mouth(), hand() diadaptasi dari demo scifi-toon Lemo-Opuscar (MIT).
import { clamp, lerp, hash, TAU } from './lib.js';
import { INK, g, push, pop, translate, rotate, scale, shape, fillOnly, stroke, ell, arc, spline, rr, rect, noodle, quad, dot, text, S } from './toon.js';

export const PAL = {
  white: '#ffffff', mouthIn: '#4a1a2a', tongue: '#e8637a',
  // Dimas
  skinD: '#c98f62', skinDs: '#a8714a', hairD: '#231a26', shirt: '#f4f1ea', shirtS: '#d3ccbf', pants: '#3b3f4a', pantsS: '#2b2e37',
  shoe: '#ece6da', shoeS: '#c9c1b1', shoeStripe: '#c2603f', lanyard: '#2f6fb5', card: '#f7f3e8', jacket: '#c2603f', jacketS: '#94452b',
  helm: '#cfd6dc', helmS: '#a3adb5', visor: '#3d4a57', watch: '#2b2e37',
  // Ibu
  skinI: '#b97a52', skinIs: '#93603e', daster: '#2f6f73', dasterS: '#21514f', batik: '#e3b23c', kerudung: '#e3b23c', kerudungS: '#c39223', sandal: '#7a4a2a',
  // Bambang
  skinB: '#d6a077', skinBs: '#b47f58', silk: '#5b2a86', silkS: '#431d65', gold: '#e8b84a', goldS: '#b8892a', hairB: '#3b3540', gem: '#c0213a',
  // Sekar
  skinS: '#e0b48e', skinSs: '#be916b', blazer: '#9aa3ad', blazerS: '#747d88', blouse: '#f2f4f7', hairS: '#2a2230', lips: '#7a2d4a', pearl: '#f3efe6',
  // Oyen
  oyen: '#f08a24', oyenS: '#c96a12',
  // perangkat (satu-satunya yang menyala)
  glow: '#ff3fa4', glowL: '#ff9ad2', glowD: '#c4126f', glowCore: '#ffe3f2',
};
export const WHO_COL = { DIMAS: '#c2603f', BATIN: '#c2603f', IBU: '#d9a227', BAMBANG: '#5b2a86', SEKAR: '#7d8792', WARGA: '#2fa3a0' };

// —— bagian wajah ——
export function eye(cx, cy, rx, ry, { lid = 0, look = [0, 0], pupil = 4.5, skin = PAL.skinD, closed = false, lw = 6, jitter = 0, lower = 0, bag = false } = {}) {
  if (closed) { stroke(arc(cx, cy + ry * .15, rx * .8, ry * .45, Math.PI * .1, Math.PI * .9, 14), lw); return; }
  shape(ell(cx, cy, rx, ry, 36), {
    fill: PAL.white, lw, shade: () => {
      const px = cx + look[0] * rx * .55 + jitter, py = cy + look[1] * ry * .5;
      dot(px, py, pupil);
      if (lid > 0) {
        const yl = cy - ry + lid * 2 * ry;
        fillOnly([[cx - rx * 1.3, cy - ry * 1.4], [cx + rx * 1.3, cy - ry * 1.4], [cx + rx * 1.3, yl], [cx - rx * 1.3, yl + ry * .08]], skin, { boil: .5 });
        stroke([[cx - rx * 1.2, yl + ry * .08], [cx + rx * 1.2, yl]], lw);
      }
      if (lower > 0) { const yb = cy + ry - lower * 2 * ry; fillOnly([[cx - rx * 1.3, yb], [cx + rx * 1.3, yb], [cx + rx * 1.3, cy + ry * 1.4], [cx - rx * 1.3, cy + ry * 1.4]], skin, { boil: .5 }); stroke([[cx - rx * 1.2, yb], [cx + rx * 1.2, yb]], lw * .8); }
    }
  });
  if (bag) stroke(arc(cx, cy + ry * .9, rx * .7, ry * .3, Math.PI * .15, Math.PI * .85, 10), lw * .6);
}
export function mouth(cx, cy, mw, { o = 0, w = 1, sm = 0, skew = 0, lw = 6, teeth = true, tongue = true, inner = PAL.mouthIn } = {}) {
  const hw = mw * w / 2, k = mw * .22, lc = [cx - hw, cy - sm * k + skew * k], rc = [cx + hw, cy - sm * k - skew * k];
  if (o < .07) {
    stroke(quad(lc, [cx, cy + sm * k * 1.2], rc, 12), lw);
    stroke([[lc[0] - 4, lc[1] - 5 * Math.sign(sm || 1)], [lc[0] + 3, lc[1] + 3]], lw * .7);
    return;
  }
  const h = o * mw * .62;
  const up = quad(lc, [cx, cy - h * .25 + sm * k * .4], rc, 12), dn = quad(rc, [cx, cy + h + sm * k * .6], lc, 14);
  shape([...up, ...dn], {
    fill: inner, lw, shade: () => {
      if (teeth && o > .22) fillOnly(rect(cx - hw * 1.2, cy - h, hw * 2.4, h * .32 + (cy - Math.min(lc[1], rc[1])) * .2 + 6), PAL.white, { boil: .3 });
      if (tongue) fillOnly(ell(cx + hw * .15, cy + h * .95, hw * .6, h * .45, 20), PAL.tongue, { boil: .3 });
    }
  });
}
// alis: b > 0 marah (ujung dalam turun), b < 0 cemas (ujung dalam naik)
export function brow(cx, cy, w, b = 0, lw = 8, inner = 1) {
  const d = b * 9;
  stroke([[cx - w / 2, cy - (inner < 0 ? -d : d) * .4 - 4], [cx, cy - 7], [cx + w / 2, cy + (inner > 0 ? d : -d)]], lw);
}
export function hand(x, y, ang, r = 21, col = PAL.skinD, { fist = false, lw = 6, point = false } = {}) {
  push(); translate(x, y); rotate(ang);
  let pts;
  if (point) pts = spline([[-r * .6, -r * .8], [r * .6, -r * .75], [r * 2.1, -r * .55], [r * 2.15, -r * .1], [r * .9, -r * .05], [r * .9, r * .75], [-r * .5, r * .9], [-r * .9, 0]]);
  else if (fist) pts = spline([[-r * .6, -r * .8], [r * .7, -r * .9], [r * 1.1, -r * .1], [r * .8, r * .8], [-r * .5, r * .9], [-r * .9, 0]]);
  else pts = spline([[-r * .5, -r * .85], [r * .5, -r * 1.05], [r * 1.35, -r * .75], [r * 1.05, -r * .3], [r * 1.5, -r * .1], [r * 1.1, r * .3], [r * 1.35, r * .7], [r * .6, r * .95], [-r * .6, r * .8], [-r * .95, 0]]);
  shape(pts, { fill: col, lw });
  stroke([[r * .2, -r * .15], [r * .75, -r * .45]], lw * .6);
  pop();
}
export const sweat = (x, y, s = 1) => shape(spline([[x, y - 16 * s], [x + 9 * s, y + 4 * s], [x, y + 12 * s], [x - 9 * s, y + 4 * s]]), { fill: '#bfe9ff', lw: 5 });

// —— properti kecil ——
export function tempe(x, y, a = 0, s = 1, { burnt = 0, bite = 0 } = {}) {
  push(); translate(x, y); rotate(a); scale(s);
  const col = burnt > .5 ? '#3a2416' : '#d79a3c', sh = burnt > .5 ? '#21140c' : '#b5782a';
  const P = bite ? spline([[-34, -16], [34, -16], [38, 14], [8, 18], [2, 6], [-8, 18], [-36, 14]]) : rr(-36, -17, 72, 34, 8);
  shape(P, { fill: col, lw: 5, shade: () => { fillOnly(rect(-40, 4, 80, 20), sh, { boil: .3 }); for (let i = 0; i < 7; i++) dot(-24 + (i % 4) * 16 + (i > 3 ? 8 : 0), -6 + (i > 3 ? 10 : 0), 3, burnt > .5 ? '#5a3a24' : '#f3d48a'); } });
  pop();
}
export function watch(x, y, a, { ring = 0, t = 0 } = {}) {
  push(); translate(x, y); rotate(a);
  if (ring > 0) { const k = 1 + .25 * ((t * 3) % 1); fillOnly(ell(0, 0, 34 * k, 30 * k, 24), 'rgba(255,63,164,.25)', { boil: .4 }); }
  shape(rr(-20, -16, 40, 32, 8), { fill: PAL.watch, lw: 5, shade: () => fillOnly(rr(-13, -10, 26, 20, 4), ring > 0 && Math.floor(t * 8) % 2 ? PAL.glow : '#4b5363', { boil: .2 }) });
  pop();
}

// ———————————————————— DIMAS ————————————————————
// P: {x,y,s,face,sit,lean,sq,look,lid,blink,brow,mouth,armR,armL,sweat,jitter,young,helmet,ring,t,headTilt,pupil,holdR,holdL,legs}
export function dimas(P) {
  const f = P.face ?? 1, sit = P.sit ?? 0, young = !!P.young;
  push(); translate(P.x + (P.jitter || 0) * (hash(Math.floor((P.t || 0) * 12) * 3.3) - .5) * 2, P.y); scale((P.s ?? 1) * f, (P.s ?? 1) * (P.sq ?? 1));
  const hipY = sit ? -235 : -285;
  const legCol = young ? PAL.pants : PAL.pants;
  // kaki
  const legs = P.legs || [[0, 0], [0, 0]];
  for (const [sx, lg, k] of [[-1, legs[0], 0], [1, legs[1], 1]]) {
    const hip = [sx * 30, hipY];
    if (sit) {
      const knee = [sx * 22 + 120, hipY + 10], ank = [sx * 18 + 128 + lg[0], -24 + lg[1]];
      shape(noodle(hip, knee, 0, 52, 46), { fill: k ? legCol : PAL.pantsS, lw: 7 });
      shape(noodle(knee, ank, -4, 46, 38), { fill: k ? legCol : PAL.pantsS, lw: 7 });
      shoeAt(ank, k);
    } else {
      const ank = [sx * 34 + lg[0], -26 + lg[1]];
      shape(noodle(hip, ank, sx * -5, 50, 38), { fill: legCol, lw: 7, shade: () => fillOnly(rect(sx < 0 ? -200 : 30, hipY - 20, 170, 400), PAL.pantsS, { boil: .3 }) });
      shoeAt(ank, k);
    }
  }
  push(); rotate(P.lean ?? 0);
  const shB = [-66, -505], shF = [60, -500];
  const armB = P.armL || { h: [-16, 190], bend: -16 }, armF = P.armR || { h: [18, 188], bend: 16 };
  drawArmD(shB, armB, P, true);
  // badan
  const torso = spline([[-34, -540], [-82, -515], [-96, -420], [-88, hipY + 10], [0, hipY + 22], [86, hipY + 8], [94, -420], [82, -515], [34, -540]]);
  shape(torso, {
    fill: young ? PAL.jacket : PAL.shirt, lw: 7, shade: () => {
      fillOnly(spline([[-130, -560], [-40, -540], [-60, -420], [-50, hipY + 40], [-140, hipY + 40]]), young ? PAL.jacketS : PAL.shirtS, { boil: .4 });
      if (!young) fillOnly(rect(-120, hipY - 30, 240, 60), PAL.pants, { boil: .3 });   // kemeja dimasukkan
    }
  });
  if (young) { stroke([[6, -535], [2, hipY + 16]], 5); shape(rr(-10, -470, 26, 14, 4), { fill: '#e8e1d4', lw: 4 }); }
  else {
    stroke([[4, -520], [2, hipY - 30]], 4);
    for (let k = 0; k < 4; k++) dot(10, -490 + k * 52, 4.5);
    stroke(spline([[-30, -540], [-8, -505], [6, -522]], false), 5); stroke(spline([[34, -540], [16, -505], [6, -522]], false), 5);  // kerah
    stroke([[-80, hipY - 28], [84, hipY - 30]], 6);  // ikat pinggang
    // lanyard + kartu
    stroke(spline([[-26, -535], [-18, -470], [-4, -430]], false), 7, { line: PAL.lanyard });
    stroke(spline([[30, -535], [20, -470], [6, -430]], false), 7, { line: PAL.lanyard });
    push(); translate(2, -392); rotate(.04 + (P.lean ?? 0) * -.5);
    shape(rr(-30, -40, 60, 78, 7), { fill: PAL.card, lw: 5, shade: () => { fillOnly(rr(-18, -28, 36, 30, 4), '#9fb7c9', { boil: .2 }); fillOnly(rect(-40, 14, 80, 30), PAL.lanyard, { boil: .2 }); } });
    pop();
  }
  // leher + kepala
  shape(noodle([4, -536], [12, -566], 3, 40, 40), { fill: PAL.skinD, lw: 6 });
  push(); translate(22, -650); rotate(P.headTilt ?? 0);
  headD(P);
  pop();
  drawArmD(shF, armF, P, false);
  pop();
  if (P.sweat != null) { sweat(150, -760 + (P.sweat % 1) * 30, 1.3); sweat(-70, -700 + ((P.sweat + .5) % 1) * 30, 1); }
  pop();
}
function shoeAt(a, k) {
  shape(spline([[a[0] - 28, a[1] + 26], [a[0] - 26, a[1] - 2], [a[0] + 14, a[1] - 6], [a[0] + 50, a[1] + 10], [a[0] + 46, a[1] + 28]]), { fill: PAL.shoe, lw: 7, shade: () => { fillOnly(rect(a[0] - 40, a[1] + 18, 110, 20), PAL.shoeS, { boil: .3 }); fillOnly(rect(a[0] - 6, a[1] - 2, 12, 24), PAL.shoeStripe, { boil: .3 }); } });
}
function drawArmD(sh, arm, P, back) {
  const young = !!P.young;
  const hp = [sh[0] + arm.h[0], sh[1] + arm.h[1]];
  const sleeve = young ? (back ? PAL.jacketS : PAL.jacket) : (back ? PAL.shirtS : PAL.shirt);
  shape(noodle(sh, hp, arm.bend ?? 0, 40, 30), { fill: young ? sleeve : PAL.skinD, lw: 7 });
  if (!young) {   // lengan digulung: setengah atas putih
    const m = [(sh[0] + hp[0]) / 2, (sh[1] + hp[1]) / 2];
    const dx = hp[0] - sh[0], dy = hp[1] - sh[1], L = Math.hypot(dx, dy) || 1;
    const mm = [m[0] + (-dy / L) * (arm.bend ?? 0) * .5, m[1] + (dx / L) * (arm.bend ?? 0) * .5];
    shape(noodle(sh, mm, (arm.bend ?? 0) * .3, 46, 42), { fill: sleeve, lw: 7 });
    shape(ell(mm[0], mm[1], 24, 14, 16), { fill: sleeve, lw: 5 });
  }
  const ang = Math.atan2(hp[1] - sh[1], hp[0] - sh[0]);
  if (back) watch(hp[0] - Math.cos(ang) * 26, hp[1] - Math.sin(ang) * 26, ang + Math.PI / 2, { ring: P.ring || 0, t: P.t || 0 });
  const hold = back ? P.holdL : P.holdR;
  if (hold === 'tempe') { hand(hp[0], hp[1], ang, 20, PAL.skinD, { fist: true }); tempe(hp[0] + 18, hp[1] - 22, -.3, .8, { bite: 1 }); return; }
  if (hold === 'phone') { hand(hp[0], hp[1], ang, 20, PAL.skinD, { fist: true }); push(); translate(hp[0] + 6, hp[1] - 40); rotate(-.15); shape(rr(-24, -42, 48, 84, 8), { fill: '#2b2e37', lw: 5, shade: () => fillOnly(rr(-17, -34, 34, 62, 4), '#8fd3e8', { boil: .2 }) }); stroke([[-10, -20], [8, 6]], 3, { line: '#ffffff' }); pop(); return; }
  hand(hp[0], hp[1], ang, 20, PAL.skinD, { fist: !!hold, point: hold === 'point' });
}
function headD(P) {
  const young = !!P.young;
  shape(ell(-72, 10, 16, 24, 18), { fill: PAL.skinD, lw: 6, shade: () => fillOnly(ell(-68, 12, 7, 12, 12), PAL.skinDs, { boil: .3 }) });
  const HD = spline([[-6, -104], [52, -98], [84, -54], [90, 10], [80, 66], [48, 100], [4, 106], [-44, 88], [-76, 40], [-82, -30], [-56, -86]]);
  shape(HD, { fill: PAL.skinD, lw: 7, shade: () => fillOnly(spline([[-90, -20], [-60, -100], [-110, -110], [-120, 80]]), PAL.skinDs, { boil: .3 }) });
  // rambut jabrik ke depan
  if (P.helmet) {
    shape(spline([[-92, -6], [-86, -84], [-20, -134], [60, -126], [104, -60], [104, -14], [10, -30]]), { fill: PAL.helm, lw: 7, shade: () => fillOnly(spline([[-100, -10], [-90, -90], [-40, -130], [-60, 0]]), PAL.helmS, { boil: .3 }) });
    shape(spline([[40, -40], [104, -46], [108, -10], [46, -8]]), { fill: PAL.visor, lw: 6 });
  } else {
    shape(spline([[-88, -20], [-96, -70], [-70, -118], [-30, -138], [-10, -158], [10, -128], [40, -150], [56, -116], [92, -126], [88, -86], [118, -82], [94, -50], [70, -64], [40, -76], [0, -70], [-40, -52], [-60, -10]]), { fill: PAL.hairD, lw: 7 });
  }
  // mata
  const lid = P.blink ? 1 : clamp(P.lid ?? .12, 0, 1), look = P.look || [0, 0];
  const jit = P.panic ? (hash(Math.floor((P.t || 0) * 12) * 1.7) - .5) * 5 * P.panic : 0;
  const ey = -8, pu = P.pupil ?? 5;
  eye(14, ey, 26, 32, { lid, look, pupil: pu, skin: PAL.skinD, jitter: jit, lower: P.lower || 0 });
  eye(64, ey + 2, 24, 30, { lid, look, pupil: pu, skin: PAL.skinD, jitter: jit, lower: P.lower || 0 });
  const b = P.brow ?? 0;
  brow(14, ey - 46 - (b < 0 ? 8 : 0), 40, b, 8, 1);
  brow(66, ey - 44 - (b < 0 ? 8 : 0), 36, b, 8, -1);
  stroke(spline([[90, 12], [104, 32], [86, 38]], false), 6);   // hidung
  const m = P.mouth || {};
  mouth(50, 62, 50, { o: m.o || 0, w: m.w ?? 1, sm: m.sm ?? 0, skew: m.skew || 0 });
}

// ———————————————————— IBU ————————————————————
export function ibu(P) {
  const f = P.face ?? 1;
  push(); translate(P.x, P.y + (P.bob || 0)); scale((P.s ?? 1) * f, (P.s ?? 1) * (P.sq ?? 1));
  // kaki + sandal
  for (const sx of [-1, 1]) { shape(noodle([sx * 34, -60], [sx * 38, -18], 0, 30, 28), { fill: PAL.skinI, lw: 6 }); shape(rr(sx * 38 - 30, -18, 66, 20, 8), { fill: PAL.sandal, lw: 6 }); }
  push(); rotate(P.lean ?? 0);
  const shB = [-70, -372], shF = [66, -370];
  armI(shB, P.armL || { h: [-10, 150], bend: -20 }, P, true);
  const D = spline([[-40, -400], [-84, -378], [-104, -240], [-118, -70], [0, -52], [116, -66], [104, -240], [84, -378], [40, -400]]);
  shape(D, {
    fill: PAL.daster, lw: 7, shade: () => {
      fillOnly(spline([[-140, -420], [-50, -400], [-70, -240], [-60, -40], [-150, -40]]), PAL.dasterS, { boil: .4 });
      for (let i = 0; i < 18; i++) { const x = -90 + (i % 5) * 46 + (Math.floor(i / 5) % 2) * 22, y = -330 + Math.floor(i / 5) * 74; batikMotif(x, y, 12); }
    }
  });
  // kerudung (bentuk segitiga membulat yang membingkai wajah)
  push(); translate(14, -470); rotate(P.headTilt ?? 0);
  shape(spline([[-110, 40], [-20, 90], [110, 50], [140, 150], [60, 250], [-40, 260], [-130, 170]]), { fill: PAL.kerudung, lw: 7, shade: () => fillOnly(spline([[-160, 60], [-60, 120], [-80, 280], [-170, 260]]), PAL.kerudungS, { boil: .4 }) });
  shape(spline([[0, -110], [70, -92], [104, -20], [126, 70], [60, 104], [-10, 112], [-96, 96], [-118, 30], [-88, -70]]), { fill: PAL.kerudung, lw: 7, shade: () => fillOnly(spline([[-130, -40], [-80, -110], [-30, 0], [-60, 130], [-140, 120]]), PAL.kerudungS, { boil: .4 }) });
  const F = spline([[10, -70], [56, -60], [74, -14], [70, 36], [40, 66], [4, 70], [-28, 44], [-38, -8], [-22, -56]]);
  shape(F, { fill: PAL.skinI, lw: 6, shade: () => fillOnly(ell(-40, 20, 30, 80, 16), PAL.skinIs, { boil: .3 }) });
  shape(spline([[-34, -64], [10, -86], [70, -70], [96, -54], [60, -52], [10, -62], [-26, -48]]), { fill: PAL.kerudungS, lw: 6 });
  const lid = P.blink ? 1 : clamp(P.lid ?? .56, 0, 1), look = P.look || [.3, 0];
  eye(6, -12, 20, 24, { lid, look, pupil: 4.2, skin: PAL.skinI, bag: true, lw: 5 });
  eye(46, -10, 18, 22, { lid, look, pupil: 4.2, skin: PAL.skinI, bag: true, lw: 5 });
  brow(6, -46, 28, P.brow ?? 0, 6, 1); brow(48, -44, 26, P.brow ?? 0, 6, -1);
  stroke(spline([[66, 4], [78, 20], [64, 24]], false), 5);
  const m = P.mouth || {};
  mouth(36, 44, 34, { o: m.o || 0, w: m.w ?? 1, sm: m.sm ?? -.1, lw: 5 });
  pop();
  armI(shF, P.armR || { h: [40, 120], bend: 20 }, P, false);
  pop();
  pop();
}
function batikMotif(x, y, r) {
  for (let k = 0; k < 4; k++) { const a = k / 4 * TAU + .785; fillOnly(ell(x + Math.cos(a) * r * .7, y + Math.sin(a) * r * .7, r * .55, r * .3, 10, a), PAL.batik, { boil: .2 }); }
  dot(x, y, r * .22, '#f6e2a8');
}
function armI(sh, arm, P, back) {
  const hp = [sh[0] + arm.h[0], sh[1] + arm.h[1]];
  shape(noodle(sh, hp, arm.bend ?? 0, 34, 28), { fill: PAL.skinI, lw: 7 });
  const m = [lerp(sh[0], hp[0], .38), lerp(sh[1], hp[1], .38)];
  shape(noodle(sh, m, (arm.bend ?? 0) * .3, 48, 44), { fill: back ? PAL.dasterS : PAL.daster, lw: 7 });
  const ang = Math.atan2(hp[1] - sh[1], hp[0] - sh[0]);
  const hold = back ? P.holdL : P.holdR;
  if (hold === 'sutil') {
    push(); translate(hp[0], hp[1]); rotate(Math.PI * .82 + (P.stir || 0));
    shape(rr(-6, -110, 12, 110, 5), { fill: '#7a4a2a', lw: 5 });
    shape(rr(-24, -150, 48, 44, 8), { fill: '#b8c0c8', lw: 5, shade: () => fillOnly(rect(4, -160, 30, 60), '#8f98a2', { boil: .2 }) });
    pop();
    hand(hp[0], hp[1], ang, 18, PAL.skinI, { fist: true, lw: 5 });
    return;
  }
  if (hold === 'tempe') { hand(hp[0], hp[1], ang, 18, PAL.skinI, { fist: false, lw: 5 }); tempe(hp[0] + 20, hp[1] - 16, -.15, .85); return; }
  hand(hp[0], hp[1], ang, 18, PAL.skinI, { fist: !!hold, lw: 5 });
}

// ———————————————————— PAK BAMBANG (badan atas, asal di pinggang) ————————————————————
export function bambang(P) {
  const f = P.face ?? 1;
  push(); translate(P.x, P.y); scale((P.s ?? 1) * f, (P.s ?? 1) * (P.sq ?? 1)); rotate(P.lean ?? 0);
  const shB = [-118, -300], shF = [112, -296];
  armB(shB, P.armL || { h: [-20, 170], bend: -20 }, P, true);
  const B = spline([[-50, -340], [-130, -310], [-170, -200], [-176, -60], [-150, 20], [0, 34], [150, 18], [174, -70], [166, -200], [126, -312], [50, -340]]);
  shape(B, {
    fill: PAL.silk, lw: 7, shade: () => {
      for (let i = 0; i < 24; i++) { const x = -150 + (i % 6) * 60 + (Math.floor(i / 6) % 2) * 30, y = -290 + Math.floor(i / 6) * 80; kawung(x, y, 16); }
      fillOnly(spline([[-200, -340], [-80, -330], [-110, -150], [-90, 40], [-210, 40]]), 'rgba(40,10,60,.45)', { boil: .4 });
    }
  });
  stroke([[0, -330], [0, 20]], 5); for (let k = 0; k < 4; k++) dot(8, -280 + k * 70, 6, PAL.gold);
  stroke(spline([[-46, -338], [-10, -300], [0, -330]], false), 5); stroke(spline([[46, -338], [10, -300], [0, -330]], false), 5);
  shape(noodle([0, -334], [4, -362], 2, 56, 56), { fill: PAL.skinB, lw: 6 });
  push(); translate(10, -440); rotate(P.headTilt ?? 0);
  // kepala kecil di badan besar
  shape(ell(-62, 8, 13, 20, 14), { fill: PAL.skinB, lw: 6 });
  shape(spline([[-4, -84], [44, -78], [70, -40], [74, 14], [64, 56], [32, 82], [-6, 84], [-44, 66], [-64, 24], [-66, -30], [-44, -72]]), { fill: PAL.skinB, lw: 7, shade: () => fillOnly(spline([[-80, -10], [-50, -90], [-90, -100], [-100, 70]]), PAL.skinBs, { boil: .3 }) });
  // rambut disisir rapi ke samping + kilap
  shape(spline([[-70, -20], [-66, -70], [-30, -98], [30, -100], [70, -70], [76, -40], [30, -64], [-20, -60], [-50, -30]]), { fill: PAL.hairB, lw: 7 });
  stroke(spline([[-10, -86], [20, -90], [44, -80]], false), 4, { line: '#7a7280' });
  const lid = P.blink ? 1 : clamp(P.lid ?? .3, 0, 1), look = P.look || [.2, .1];
  eye(10, -14, 18, 20, { lid, look, pupil: 4, skin: PAL.skinB, lw: 5 });
  eye(46, -12, 16, 19, { lid, look, pupil: 4, skin: PAL.skinB, lw: 5 });
  for (const [ex, er] of [[10, 24], [46, 22]]) shape(ell(ex, -13, er, er * .9, 22), { lw: 5, line: PAL.goldS });
  stroke([[28, -16], [32, -16]], 4, { line: PAL.goldS });
  brow(10, -44, 30, P.brow ?? .2, 7, 1); brow(48, -42, 26, P.brow ?? .2, 7, -1);
  stroke(spline([[66, -4], [82, 14], [64, 18]], false), 5);
  // kumis
  shape(spline([[8, 24], [40, 18], [72, 26], [64, 34], [40, 30], [14, 34]]), { fill: PAL.hairB, lw: 5 });
  const m = P.mouth || {};
  mouth(40, 48, 42, { o: m.o || 0, w: m.w ?? 1.1, sm: m.sm ?? .6, lw: 5 });
  if (P.cheek) shape(ell(52, 50, 20, 16, 14), { fill: PAL.skinB, lw: 5 });   // pipi menggembung (mulut penuh tempe)
  pop();
  armB(shF, P.armR || { h: [30, 160], bend: 24 }, P, false);
  pop();
}
function kawung(x, y, r) {
  for (let k = 0; k < 4; k++) { const a = k / 4 * TAU + .785; fillOnly(ell(x + Math.cos(a) * r * .75, y + Math.sin(a) * r * .75, r * .62, r * .34, 10, a), PAL.gold, { boil: .2 }); }
  dot(x, y, r * .2, PAL.silkS);
}
function armB(sh, arm, P, back) {
  const hp = [sh[0] + arm.h[0], sh[1] + arm.h[1]];
  shape(noodle(sh, hp, arm.bend ?? 0, 64, 52), { fill: back ? PAL.silkS : PAL.silk, lw: 7, shade: () => { if (!back) for (let i = 0; i < 4; i++) kawung(lerp(sh[0], hp[0], .2 + i * .2), lerp(sh[1], hp[1], .2 + i * .2), 12); } });
  const ang = Math.atan2(hp[1] - sh[1], hp[0] - sh[0]);
  const hold = back ? P.holdL : P.holdR;
  if (hold === 'tempe') { hand(hp[0], hp[1], ang, 24, PAL.skinB, { fist: true }); tempe(hp[0] + 22, hp[1] - 26, -.4, .85, { bite: P.bite ? 1 : 0 }); }
  else hand(hp[0], hp[1], ang, 24, PAL.skinB, { point: hold === 'point', fist: hold === 'fist' });
  if (!back) { const ra = ang; shape(ell(hp[0] + Math.cos(ra) * 18 - Math.sin(ra) * 12, hp[1] + Math.sin(ra) * 18 + Math.cos(ra) * 12, 11, 9, 12), { fill: PAL.gem, lw: 4 }); }
}

// ———————————————————— BU SEKAR (badan atas, asal di pinggang) ————————————————————
export function sekar(P) {
  const f = P.face ?? 1;
  push(); translate(P.x, P.y); scale((P.s ?? 1) * f, (P.s ?? 1) * (P.sq ?? 1)); rotate(P.lean ?? 0);
  const shB = [-80, -300], shF = [76, -298];
  armS(shB, P.armL || { h: [-10, 180], bend: -14 }, P, true);
  const B = spline([[-34, -330], [-86, -306], [-100, -200], [-80, -60], [-90, 20], [0, 30], [88, 18], [78, -60], [96, -200], [82, -306], [34, -330]]);
  shape(B, { fill: PAL.blazer, lw: 7, shade: () => fillOnly(spline([[-130, -340], [-50, -320], [-70, -160], [-60, 40], [-140, 40]]), PAL.blazerS, { boil: .4 }) });
  shape([[-30, -326], [30, -326], [6, -200], [-6, -200]], { fill: PAL.blouse, lw: 5 });
  stroke(spline([[-34, -328], [-48, -260], [-6, -196]], false), 5); stroke(spline([[34, -328], [48, -260], [6, -196]], false), 5);  // kerah blazer
  dot(0, -150, 6, '#d6dbe2'); dot(0, -100, 6, '#d6dbe2');
  shape(noodle([0, -326], [2, -356], 2, 40, 38), { fill: PAL.skinS, lw: 6 });
  push(); translate(8, -430); rotate(P.headTilt ?? 0);
  // sanggul tinggi
  shape(ell(-6, -132, 52, 50, 26), { fill: PAL.hairS, lw: 7 });
  stroke(arc(-6, -132, 30, 26, Math.PI * 1.1, Math.PI * 1.9, 10), 4, { line: '#4a3e52' });
  shape(spline([[-56, -40], [-50, -86], [-10, -106], [36, -100], [62, -70], [66, -36], [30, -60], [-20, -66]]), { fill: PAL.hairS, lw: 7 });
  shape(spline([[0, -80], [40, -72], [58, -30], [60, 20], [48, 64], [18, 84], [-14, 80], [-40, 56], [-52, 10], [-50, -40], [-30, -72]]), { fill: PAL.skinS, lw: 7, shade: () => fillOnly(spline([[-64, -10], [-40, -80], [-80, -90], [-80, 90]]), PAL.skinSs, { boil: .3 }) });
  shape(spline([[-56, -36], [-48, -86], [-6, -104], [40, -96], [64, -66], [30, -72], [-10, -76], [-40, -50]]), { fill: PAL.hairS, lw: 6 });
  shape(ell(-46, 30, 9, 9, 12), { fill: PAL.pearl, lw: 4 });
  const lid = P.blink ? 1 : clamp(P.lid ?? .5, 0, 1), look = P.look || [.3, 0];
  eye(4, -14, 17, 20, { lid, look, pupil: 4, skin: PAL.skinS, lw: 5 });
  eye(38, -12, 15, 19, { lid, look, pupil: 4, skin: PAL.skinS, lw: 5 });
  stroke([[-14, -44], [6, -50], [24, -42]], 6); stroke([[30, -40], [44, -48], [56, -44]], 6);   // alis tipis tajam
  stroke(spline([[56, 0], [66, 16], [54, 20]], false), 5);
  const m = P.mouth || {};
  mouth(30, 46, 30, { o: m.o || 0, w: m.w ?? 1, sm: m.sm ?? .35, lw: 5, teeth: true, tongue: false, inner: '#3a1222' });
  if ((m.o || 0) < .07) stroke(quad([18, 46 - (m.sm ?? .35) * 7], [30, 50], [42, 46 - (m.sm ?? .35) * 7], 8), 5, { line: PAL.lips });
  pop();
  armS(shF, P.armR || { h: [10, 170], bend: 16 }, P, false);
  pop();
}
function armS(sh, arm, P, back) {
  const hp = [sh[0] + arm.h[0], sh[1] + arm.h[1]];
  shape(noodle(sh, hp, arm.bend ?? 0, 40, 32), { fill: back ? PAL.blazerS : PAL.blazer, lw: 7 });
  const ang = Math.atan2(hp[1] - sh[1], hp[0] - sh[0]);
  hand(hp[0], hp[1], ang, 18, PAL.skinS, { lw: 5, point: (back ? P.holdL : P.holdR) === 'point' });
}

// ———————————————————— SI OYEN (makhluk kucing-gumpal bermata tiga) ————————————————————
export function oyen(x, y, s, t, { look = [0, 0], blink = false, o = 0, munch = 0 } = {}) {
  push(); translate(x, y); scale(s);
  const sw = Math.sin(t * 3) * 20;
  shape(noodle([60, -30], [120 + sw * .4, -110], -30 - sw, 22, 14), { fill: PAL.oyen, lw: 6 });
  const sq = 1 + .03 * Math.sin(t * 4);
  const body = spline([[-80, 0], [-86, -60], [-60, -120], [-30, -140], [30, -140], [64, -116], [84, -60], [80, 0]]);
  shape(body, { fill: PAL.oyen, lw: 7, shade: () => { fillOnly(spline([[30, -150], [100, -120], [100, 10], [40, 10], [60, -70]]), PAL.oyenS, { boil: .4 }); for (let k = 0; k < 3; k++) fillOnly(rect(-70 + k * 40, -136, 14, 30), PAL.oyenS, { boil: .3 }); } });
  shape([[-60, -112], [-50, -170], [-20, -132]], { fill: PAL.oyen, lw: 6 });
  shape([[24, -134], [52, -172], [62, -110]], { fill: PAL.oyen, lw: 6 });
  for (const [ex, ey, r] of [[-34, -84, 16], [0, -98, 13], [32, -84, 16]]) {
    if (blink) stroke([[ex - r, ey], [ex + r, ey]], 5); else eye(ex, ey, r, r * 1.1, { look, pupil: 3.5, skin: PAL.oyen, lw: 5 });
  }
  mouth(0, -44 + munch * 4, 30, { o: o + munch * .4 * (Math.floor(t * 12) % 2), sm: .4, lw: 5, teeth: false });
  pop();
}
