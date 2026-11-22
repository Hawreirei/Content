// worlds.js — dunia-dunia Nusa Wacana (koordinat dunia potret 1080×1920), portal panggilan, properti
import { clamp, lerp, hash, vnoise, TAU } from './lib.js';
import { INK, g, push, pop, translate, rotate, scale, shape, fillOnly, stroke, ell, arc, spline, rr, rect, noodle, quad, dot, text, bands, wob } from './toon.js';
import { PAL, eye, mouth, hand, tempe, oyen } from './chars.js';

const X0 = -1200, X1 = 2300;

// ———————————————————— portal panggilan (satu-satunya yang menyala, magenta) ————————————————————
// inner: fungsi yang menggambar dunia di balik portal (di-clip ke cakram); tanpa inner = pusaran
export function portal(cx, cy, r, t, { open = 1, sx = .8, spin = 1, inner = null, wash = true } = {}) {
  if (open <= .001) return;
  const R = r * open;
  push(); translate(cx, cy); scale(sx, 1);
  if (wash) { fillOnly(ell(0, 0, R * 1.6, R * 1.5, 48), 'rgba(255,63,164,.12)', { boil: .6 }); fillOnly(ell(0, 0, R * 1.3, R * 1.24, 48), 'rgba(255,63,164,.16)', { boil: .6 }); }
  const rim = [], N = 22;
  for (let i = 0; i < N; i++) { const a = i / N * TAU, k = 1 + .09 * (vnoise(i * 1.7 + t * 3) - .5) * 2 + .05 * Math.sin(a * 5 + t * 6); rim.push([Math.cos(a) * R * k, Math.sin(a) * R * k]); }
  shape(spline(rim), {
    fill: PAL.glow, lw: 8, shade: () => {
      fillOnly(ell(0, 0, R * .9, R * .9, 40), PAL.glowL, { boil: .3 });
      if (inner) {
        // jendela ke dunia lain: clip cakram dalam, gambar dunianya
        const Pin = shape(ell(0, 0, R * .84, R * .84, 44), { fill: '#000', lw: 6 });
        g.save(); g.clip(Pin); inner(R); g.restore();
        shape(ell(0, 0, R * .84, R * .84, 44), { lw: 6 });
      } else {
        for (let k = 0; k < 5; k++) {
          const pts = [], pts2 = [];
          for (let j = 0; j <= 22; j++) {
            const u = j / 22, rr_ = R * (1 - u) * .95, a = k / 5 * TAU + u * 3.6 + t * 2.6 * spin;
            pts.push([Math.cos(a) * rr_, Math.sin(a) * rr_]); const a2 = a + .55 * (1 - u * .7); pts2.push([Math.cos(a2) * rr_, Math.sin(a2) * rr_]);
          }
          fillOnly([...pts, ...pts2.reverse()], k % 2 ? PAL.glowL : PAL.glowD, { boil: .4 });
        }
        fillOnly(ell(0, 0, R * .3, R * .3, 24), PAL.glowCore, { boil: .5 });
        fillOnly(ell(0, 0, R * .14, R * .14, 16), '#ffffff', { boil: .5 });
      }
    }
  });
  for (let i = 0; i < 12; i++) {
    const a = hash(i) * TAU + t * (1.5 + hash(i + 4) * 2), d = R * (1.05 + .25 * ((t * .8 + hash(i + 9)) % 1));
    dot(Math.cos(a) * d, Math.sin(a) * d, 5 + hash(i + 2) * 4, i % 3 ? PAL.glowL : '#ffffff');
  }
  if (open > .6) for (let i = 0; i < 3; i++) {
    const u = (t * .9 + i / 3) % 1, x = (-.4 + i * .4) * R, y0 = R * .92;
    shape(spline([[x - 10, y0], [x + 10, y0], [x + 7, y0 + 20 + u * 40], [x, y0 + 32 + u * 50], [x - 7, y0 + 20 + u * 40]]), { fill: PAL.glow, lw: 6 });
  }
  pop();
}
// isi portal: dunia Bambang (ultraviolet + emas) dan dunia Sekar (perak, biru es, hitam); koordinat lokal portal
export function innerBambang(R) {
  bands(['#2a0f4a', '#3d1a6b', '#5a2a90'], -R, R, -R * 1.5, R * 1.5);
  for (let i = -2; i <= 2; i++) shape(rr(i * R * .42 - 18, -R * .2, 36, R * 1.2, 8), { fill: '#e8b84a', lw: 5, shade: () => fillOnly(rect(i * R * .42 + 4, -R, 30, R * 2), '#b8892a', { boil: .2 }) });
  // lampu gantung
  stroke([[0, -R], [0, -R * .62]], 5);
  shape(spline([[-R * .3, -R * .6], [R * .3, -R * .6], [R * .18, -R * .42], [-R * .18, -R * .42]]), { fill: '#e8b84a', lw: 5 });
  for (let k = -2; k <= 2; k++) shape(spline([[k * R * .12 - 6, -R * .42], [k * R * .12 + 6, -R * .42], [k * R * .12, -R * .3]]), { fill: '#fff3c4', lw: 4 });
}
export function innerSekar(R) {
  bands(['#0e1116', '#1f2a36', '#9fb4c8', '#d9e4ee'], -R, R, -R * 1.5, R * 1.5);
  for (let i = 0; i < 6; i++) { const x = -R + i * R * .4; shape(rect(x, -R * .2 - hash(i) * R * .6, R * .28, R * 1.6), { fill: i % 2 ? '#2b3644' : '#3c4a5b', lw: 5, shade: () => { for (let k = 0; k < 8; k++) fillOnly(rect(x + 8, -R * .1 - hash(i) * R * .5 + k * 34, R * .1, 12), '#cfe3f5', { boil: .2 }); } }); }
}

// ———————————————————— tanggul (sekarang, senja) ————————————————————
export function dam(t, { angkot = 0 } = {}) {
  bands(['#1f7f86', '#2fa3a0', '#5fc0b0', '#f6a04d', '#ffc979', '#ffe2a6'], -400, 1250);
  shape(ell(760, 1020, 150, 150, 44), { fill: '#ffd86b', lw: 6 });   // matahari (datar, tanpa glow)
  // kota kering di kejauhan
  for (let i = 0; i < 12; i++) { const x = -240 + i * 130, h = 180 + hash(i * 2.3) * 260; shape(rect(x, 1240 - h, 110, h + 20), { fill: i % 2 ? '#2b6d73' : '#357e80', lw: 5, shade: () => { for (let k = 0; k < 5; k++) fillOnly(rect(x + 18, 1260 - h + k * 46, 22, 14), '#ffd36e', { boil: .2 }); } }); }
  // sungai tenang
  shape(rect(X0, 1240, X1 - X0, 200), { fill: '#2f8f8f', lw: 6, shade: () => { for (let k = 0; k < 6; k++) stroke([[100 + k * 160 + wob(t, .3, k) * 20, 1290 + (k % 3) * 40], [180 + k * 160 + wob(t, .3, k) * 20, 1290 + (k % 3) * 40]], 4, { line: '#7fd6c8' }); } });
  // tanggul raksasa sci-fi
  shape(spline([[-300, 1400], [-300, 1330], [1380, 1330], [1380, 1400], [1380, 2400], [-300, 2400]]), { fill: '#c8c2b4', lw: 8, shade: () => { fillOnly(rect(-400, 1400, 1900, 40), '#a69f90', { boil: .3 }); for (let k = 0; k < 6; k++) fillOnly(rr(-140 + k * 260, 1480, 200, 120, 14), '#b2ab9c', { boil: .3 }); } });
  for (let k = 0; k < 6; k++) { shape(rr(-110 + k * 260, 1505, 140, 70, 10), { fill: '#7fd6c8', lw: 5 }); text('ANTI-BANJIR', -40 + k * 260, 1540, { font: '400 26px VT323', fill: '#0f3a3a' }); }
  // angkot terbang
  if (angkot) flyingAngkot(-200 + ((t * 160) % 1600), 520 + wob(t, .6) * 16, .9, t);
}
export function flyingAngkot(x, y, s, t, col = '#5fb3e0') {
  push(); translate(x, y); scale(s);
  shape(rr(-130, -70, 260, 100, 26), { fill: col, lw: 7, shade: () => { fillOnly(rect(-140, 0, 300, 40), '#3f8fbd', { boil: .3 }); } });
  for (let k = 0; k < 3; k++) shape(rr(-100 + k * 72, -54, 58, 40, 8), { fill: '#e8f6ff', lw: 5 });
  text('RAWA SUMPEK', 0, 14, { font: '800 22px "Baloo 2"', fill: '#0f2a3a' });
  for (const sx of [-80, 80]) { shape(rr(sx - 26, 30, 52, 22, 8), { fill: '#8d96a3', lw: 5 }); const fl = 20 + 8 * Math.sin(t * 30 + sx); shape([[sx - 14, 52], [sx + 14, 52], [sx, 52 + fl]], { fill: '#ffd36e', lw: 4 }); }
  pop();
}

// ———————————————————— kilas balik banjir: framing sama ×3 ————————————————————
const MUD = ['#5e5a48', '#77725a', '#8f8a70', '#a39d82'];
export function floodBg(t) {
  bands(MUD, -300, 1100);
  for (let i = 0; i < 40; i++) { const x = (hash(i) * 1400 - 150 + t * 60 * (1 + hash(i + 3))) % 1300 - 100, y = (hash(i + 7) * 1500 + t * 900) % 1500 - 200; stroke([[x, y], [x - 10, y + 44]], 4, { line: 'rgba(220,220,200,.55)', boil: 0 }); }
}
export function floodWater(t, y = 1150) {
  shape(spline([[X0, y + wob(t, .5) * 6], [0, y + 10], [540, y - 6 + wob(t, .7) * 8], [1080, y + 8], [X1, y]], false).concat([[X1, 2400], [X0, 2400]]), { fill: '#6f6a48', lw: 7, shade: () => { for (let k = 0; k < 8; k++) stroke([[40 + k * 140 + wob(t, .4, k) * 20, y + 60 + (k % 3) * 70], [120 + k * 140 + wob(t, .4, k) * 20, y + 60 + (k % 3) * 70]], 4, { line: '#8f8a62' }); } });
}
export function house(x, y, s, col = '#9a8466', roof = '#6a4a3a') {
  push(); translate(x, y); scale(s);
  shape(rect(-140, -220, 280, 240), { fill: col, lw: 7, shade: () => fillOnly(rect(60, -230, 100, 260), 'rgba(40,30,20,.25)', { boil: .3 }) });
  shape([[-170, -210], [0, -340], [170, -210]], { fill: roof, lw: 7 });
  shape(rect(-90, -160, 70, 60), { fill: '#3e3a30', lw: 5 });
  pop();
}
export function floodScene(t, kind) {
  floodBg(t);
  if (kind === 'flood') {
    house(260, 1180, 1, '#9a8466'); house(780, 1210, .9, '#8a7a62', '#5a3a30');
    floodWater(t, 1080);
    // robot rumah tangga mengapung di ban
    const by = 1120 + wob(t, .6) * 14;
    shape(ell(540, by + 40, 110, 34, 30), { fill: '#3b3f4a', lw: 7, shade: () => fillOnly(ell(540, by + 30, 70, 16, 20), '#6f6a48', { boil: .3 }) });
    shape(rr(480, by - 110, 120, 130, 20), { fill: '#c8ccd2', lw: 7 });
    eye(515, by - 60, 18, 20, { look: [0, -.6], pupil: 4, skin: '#c8ccd2' }); eye(565, by - 60, 18, 20, { look: [0, -.6], pupil: 4, skin: '#c8ccd2' });
    mouth(540, by - 18, 28, { o: .4, sm: -.6, lw: 5, teeth: false });
    stroke([[600, by - 80], [660, by - 170]], 6); hand(660, by - 175, -1.2, 18, '#c8ccd2');
  } else if (kind === 'trash') {
    floodWater(t, 1260);
    const M = spline([[60, 1300], [160, 900], [320, 760], [540, 620], [760, 760], [920, 920], [1020, 1300]]);
    shape(M, { fill: '#7a7458', lw: 8, shade: () => { for (let i = 0; i < 28; i++) { const x = 140 + hash(i * 3.1) * 800, y = 760 + hash(i * 5.3) * 500; fillOnly(rr(x, y, 40 + hash(i) * 50, 26 + hash(i + 1) * 30, 6), ['#5e7a8a', '#a8584a', '#c9c09a', '#4f5f3a'][i % 4], { boil: .3 }); } } });
    // makhluk sampah: menjijikkan tapi lucu
    const by = 640 + wob(t, .8) * 8;
    shape(spline([[460, by + 60], [450, by - 20], [500, by - 80], [580, by - 80], [630, by - 20], [620, by + 60]]), { fill: '#8aa04a', lw: 7, shade: () => fillOnly(ell(600, by, 30, 60, 14), '#6a7f32', { boil: .3 }) });
    eye(520, by - 30, 20, 24, { look: [.2, 0], pupil: 4, skin: '#8aa04a' }); eye(566, by - 34, 16, 20, { look: [.2, 0], pupil: 4, skin: '#8aa04a' });
    mouth(544, by + 20, 34, { o: .25 + .15 * Math.sin(t * 9), sm: .6, lw: 5, teeth: false });
    shape(spline([[470, by - 70], [480, by - 120], [496, by - 76]]), { fill: '#c9c09a', lw: 5 });  // kaleng di kepala
  } else {
    // pungli: robot preman menagih karcis ke pedagang
    floodWater(t, 1380);
    shape(rect(-100, 1100, 1300, 300), { fill: '#6a6450', lw: 7 });
    shape(rr(600, 820, 360, 300, 16), { fill: '#a8584a', lw: 7, shade: () => fillOnly(rect(600, 820, 360, 50), '#c9c09a', { boil: .3 }) });
    text('SAYUR', 780, 950, { font: '800 50px "Baloo 2"', fill: '#f2ead0', outlineW: 8 });
    // pedagang kecil yang ketakutan
    shape(ell(780, 760, 60, 66, 30), { fill: '#b97a52', lw: 7 });
    eye(760, 750, 16, 20, { look: [-.7, 0], pupil: 4, skin: '#b97a52' }); eye(800, 752, 15, 19, { look: [-.7, 0], pupil: 4, skin: '#b97a52' });
    mouth(780, 792, 26, { o: .3, sm: -.8, lw: 5, teeth: false });
    // robot preman
    const rx = 300, ry = 1100;
    shape(rr(rx - 120, ry - 420, 240, 300, 30), { fill: '#4a4f5a', lw: 8, shade: () => fillOnly(rect(rx + 40, ry - 430, 100, 320), '#353943', { boil: .3 }) });
    shape(rr(rx - 90, ry - 560, 180, 150, 24), { fill: '#5f6672', lw: 8 });
    shape(rr(rx - 70, ry - 520, 140, 44, 12), { fill: '#1b1422', lw: 6, shade: () => fillOnly(rect(rx - 60 + (Math.floor(t * 6) % 3) * 40, ry - 512, 30, 28), '#ff8a3a', { boil: .2 }) });
    shape(noodle([rx + 110, ry - 380], [rx + 260, ry - 470], -20, 40, 32), { fill: '#4a4f5a', lw: 7 });
    hand(rx + 266, ry - 476, -.4, 24, '#5f6672');
    push(); translate(rx + 300, ry - 520); rotate(-.2);
    shape(rr(-50, -30, 100, 60, 6), { fill: '#f2ead0', lw: 5 }); text('KARCIS', 0, -6, { font: '400 26px VT323', fill: INK }); text('Rp 50RB', 0, 16, { font: '400 24px VT323', fill: '#a8584a' });
    pop();
    for (const sx of [-60, 60]) shape(rr(rx + sx - 34, ry - 130, 68, 150, 14), { fill: '#353943', lw: 7 });
  }
}

// ———————————————————— jalan bolong (dulu) ————————————————————
export function street(t) {
  bands(['#7c8a8c', '#9aa6a2', '#b9bfb2'], -300, 1000);
  for (let i = 0; i < 6; i++) { const x = -120 + i * 230, h = 300 + hash(i * 1.9) * 300; shape(rect(x, 1000 - h, 200, h + 20), { fill: i % 2 ? '#8a8270' : '#9a9280', lw: 6, shade: () => { for (let k = 0; k < 4; k++) fillOnly(rect(x + 30, 1040 - h + k * 70, 40, 30), '#5e6668', { boil: .2 }); } }); }
  shape(rect(X0, 1000, X1 - X0, 1400), { fill: '#55575a', lw: 7 });
  for (let k = 0; k < 5; k++) fillOnly(rect(-60 + k * 280, 1180, 140, 18), '#d8d2b0', { boil: .2 });
  // lubang raksasa dengan genangan
  shape(spline([[300, 1320], [420, 1260], [640, 1266], [760, 1320], [640, 1400], [400, 1396]]), { fill: '#2e2f31', lw: 8, shade: () => fillOnly(ell(530, 1350, 160, 34, 30), '#6f7a86', { boil: .3 }) });
  stroke([[260, 1300], [300, 1320]], 5); stroke([[780, 1300], [760, 1320]], 5);
}
export function hoverScooter(x, y, s, t) {
  push(); translate(x, y); scale(s);
  shape(spline([[-150, -40], [-120, -90], [100, -90], [160, -60], [150, -20], [-140, -10]]), { fill: '#c2603f', lw: 7, shade: () => fillOnly(rect(-160, -40, 330, 40), '#94452b', { boil: .3 }) });
  shape(rr(-110, -20, 220, 26, 10), { fill: '#8d96a3', lw: 6 });
  const fl = 16 + 6 * Math.sin(t * 28);
  for (const sx of [-70, 70]) shape([[sx - 16, 6], [sx + 16, 6], [sx, 6 + fl]], { fill: '#ffd36e', lw: 4 });
  pop();
}

// ———————————————————— kaleng patungan + formulir (insert) ————————————————————
export function canInsert(t, nCoins) {
  bands(['#3b3530', '#4a433c'], -400, 2400);
  shape(rect(-200, 1180, 1500, 900), { fill: '#7a5a3a', lw: 7, shade: () => { for (let k = 0; k < 5; k++) stroke([[-200, 1220 + k * 80], [1300, 1240 + k * 80]], 4, { line: '#5e4430' }); } });
  // formulir
  push(); translate(330, 1060); rotate(-.08);
  shape(rect(-230, -330, 460, 600), { fill: '#f2ead0', lw: 7 });
  text('FORMULIR', 0, -270, { font: '800 44px "Baloo 2"', fill: INK });
  text('CALON INDEPENDEN', 0, -220, { font: '800 36px "Baloo 2"', fill: '#c2603f' });
  for (let k = 0; k < 6; k++) stroke([[-180, -150 + k * 60], [180, -150 + k * 60]], 4, { line: '#a89f86' });
  text('Nama: DIMAS NGAREP', -170, -165, { font: '400 34px VT323', fill: INK, align: 'left' });
  text('Dana: patungan warga', -170, -105, { font: '400 34px VT323', fill: INK, align: 'left' });
  pop();
  // kaleng
  push(); translate(760, 1160);
  shape(spline([[-130, -260], [130, -260], [124, 0], [-124, 0]]), { fill: '#c9cdd2', lw: 7, shade: () => { fillOnly(rect(40, -270, 110, 280), '#a2a8ae', { boil: .3 }); fillOnly(rect(-140, -190, 280, 100), '#c2603f', { boil: .3 }); } });
  text('PATUNGAN', 0, -150, { font: '800 40px "Baloo 2"', fill: '#fff', outlineW: 7 });
  text('DIMAS', 0, -108, { font: '800 30px "Baloo 2"', fill: '#fff', outlineW: 6 });
  shape(ell(0, -260, 130, 26, 30), { fill: '#a2a8ae', lw: 7, shade: () => fillOnly(rr(-50, -268, 100, 16, 6), INK, { boil: .2 }) });
  pop();
  // koin jatuh
  for (let i = 0; i < nCoins.length; i++) {
    const u = clamp((t - nCoins[i]) / .35); if (t < nCoins[i] - .05) continue;
    if (u < 1) { const y = lerp(560, 890, u * u); push(); translate(760 + (i - 1.5) * 14, y); rotate(u * 6 + i); shape(ell(0, 0, 30, 30 * Math.abs(Math.cos(u * 9 + i)) + 6, 20), { fill: '#e8b84a', lw: 5 }); pop(); }
  }
  // tumpukan koin di meja
  for (let i = 0; i < 5; i++) shape(ell(560 + i * 34, 1236 - i * 2, 26, 9, 16), { fill: '#e8b84a', lw: 4 });
}

// ———————————————————— kota sekarang (cerah) ————————————————————
export function city(t, { angkot = true } = {}) {
  bands(['#2fa3a0', '#56bdb4', '#8fd6c8', '#ffe2a6'], -900, 1000);
  for (let i = 0; i < 9; i++) { const x = -400 + i * 230, h = 380 + hash(i * 3.7) * 420; shape(rr(x, 1000 - h, 190, h + 40, 18), { fill: ['#f6a04d', '#ffd36e', '#f2ead0', '#7fd6c8'][i % 4], lw: 6, shade: () => { fillOnly(rect(x + 130, 980 - h, 80, h + 80), 'rgba(30,60,60,.18)', { boil: .3 }); for (let k = 0; k < 5; k++) fillOnly(rr(x + 26, 1040 - h + k * 70, 50, 34, 6), '#2b6d73', { boil: .2 }); } }); }
  if (angkot) { flyingAngkot(-300 + ((t * 140) % 1800), 300 + wob(t, .5) * 12, .8, t); flyingAngkot(1500 - ((t * 110 + 600) % 1900), 120 + wob(t, .4, 2) * 10, .6, t, '#f6a04d'); }
  shape(rect(X0, 1000, X1 - X0, 1400), { fill: '#e6d7b4', lw: 7, shade: () => { for (let k = 0; k < 10; k++) stroke([[-400 + k * 220, 1000], [-600 + k * 260, 2400]], 4, { line: '#cdbd98' }); } });
  // lapak pasar rapi
  for (let i = 0; i < 3; i++) stall(-160 + i * 520, 1180, ['#2fa3a0', '#f6a04d', '#c2603f'][i], ['IKAN', 'BUAH', 'GORENGAN'][i], t, i);
  // taman tepi sungai
  shape(rect(X0, 1560, X1 - X0, 120), { fill: '#2f8f8f', lw: 6 });
}
function stall(x, y, col, label, t, i) {
  shape(rect(x - 180, y - 260, 360, 280), { fill: '#f2ead0', lw: 7 });
  for (let k = 0; k < 6; k++) shape([[x - 200 + k * 66, y - 360], [x - 134 + k * 66, y - 360], [x - 134 + k * 66, y - 290], [x - 167 + k * 66, y - 270], [x - 200 + k * 66, y - 290]], { fill: k % 2 ? col : '#fff6dc', lw: 5 });
  text(label, x, y - 190, { font: '800 44px "Baloo 2"', fill: col, outlineW: 7, outlineCol: INK });
  // pedagang yang melambai (warga generik)
  warga(x + 40, y - 40, .8, ['#7fd6c8', '#ffd36e', '#f6a04d'][i], t, i, Math.sin(t * 9 + i) > -.2);
}
export function warga(x, y, s, col, t, seed = 0, wave = false) {
  push(); translate(x, y); scale(s);
  shape(spline([[-60, 0], [-70, -120], [-40, -170], [40, -170], [70, -120], [60, 0]]), { fill: col, lw: 7 });
  const skin = ['#c98f62', '#8a5a3a', '#e0b48e'][seed % 3];
  shape(ell(0, -240, 64, 70, 30), { fill: skin, lw: 7 });
  shape(spline([[-64, -260], [-50, -310], [0, -322], [50, -310], [66, -262], [0, -284]]), { fill: ['#231a26', '#e8e1d4', '#3b3540'][seed % 3], lw: 6 });
  eye(-20, -248, 15, 18, { look: [0, 0], pupil: 4, skin, lw: 5 }); eye(20, -248, 14, 17, { look: [0, 0], pupil: 4, skin, lw: 5 });
  mouth(0, -204, 30, { o: wave ? .45 : .1, sm: .8, lw: 5 });
  const a = wave ? -2.3 + Math.sin(t * 14 + seed) * .3 : -1.3;
  const sh = [56, -150], hp = [sh[0] + Math.cos(a) * 120, sh[1] + Math.sin(a) * 120];
  shape(noodle(sh, hp, 10, 30, 24), { fill: col, lw: 6 }); hand(hp[0], hp[1], a, 16, skin, { lw: 5 });
  pop();
}

// ———————————————————— teras Ibu (malam) ————————————————————
// tata letak: lantai y 1290; Ibu x 250; Dimas duduk di bangku x 600; portal 1 kiri atas, portal 2 kanan atas; TV kanan bawah
export const TER = { floor: 1290, ibuX: 250, dimX: 600, p1: [270, 560], p2: [820, 600], tv: [930, 1060], clock: [560, 300] };
export function terrace(t, { egg = 0, ticker = true, clockSec = 0, burnt = 0, smoke = 0, tempeN = 4, oyenMunch = 0, oyenLook = [0, 0], fry = 1 } = {}) {
  bands(['#171437', '#221d4f', '#2b2e6b'], -900, 260);
  for (let i = 0; i < 18; i++) dot(hash(i) * 1600 - 260, -600 + hash(i + 5) * 820, 3 + hash(i + 2) * 3, '#f7f3e8');
  // dinding bata
  shape(rect(X0, 240, X1 - X0, 1100), { fill: '#b5603f', lw: 7, shade: () => { for (let r = 0; r < 14; r++) for (let c = 0; c < 22; c++) stroke([[-400 + c * 120 + (r % 2) * 60, 260 + r * 74], [-400 + c * 120 + (r % 2) * 60, 260 + r * 74 + 70]], 3, { line: '#94452b', boil: .2 }); for (let r = 0; r < 14; r++) stroke([[X0, 260 + r * 74], [X1, 260 + r * 74]], 3, { line: '#94452b', boil: .2 }); } });
  // lampu teras (kuning datar)
  stroke([[560, 240], [560, 150]], 5);
  fillOnly(ell(560, 330, 300, 220, 36), 'rgba(255,211,107,.16)', { boil: .5 });
  shape(spline([[510, 150], [610, 150], [590, 200], [530, 200]]), { fill: '#ffd36b', lw: 6 });
  // jam dinding
  const [cx, cy] = TER.clock;
  shape(ell(cx, cy + 80, 56, 56, 30), { fill: '#f7f3e8', lw: 6 });
  const sa = clockSec / 60 * TAU - Math.PI / 2;
  stroke([[cx, cy + 80], [cx + Math.cos(sa) * 40, cy + 80 + Math.sin(sa) * 40]], 4, { line: '#c0213a' });
  stroke([[cx, cy + 80], [cx + 22, cy + 66]], 6); stroke([[cx, cy + 80], [cx - 4, cy + 44]], 6);
  // jendela
  shape(rr(-80, 520, 220, 280, 10), { fill: '#3d3a7a', lw: 7, shade: () => fillOnly(rect(-80, 520, 110, 280), '#4a478f', { boil: .2 }) });
  stroke([[30, 520], [30, 800]], 6); stroke([[-80, 660], [140, 660]], 6);
  // lantai keramik
  shape(rect(X0, TER.floor - 40, X1 - X0, 900), { fill: '#d8c9a8', lw: 7, shade: () => { for (let k = 0; k < 14; k++) stroke([[-400 + k * 150, TER.floor - 40], [-700 + k * 190, TER.floor + 800]], 4, { line: '#bfae8a' }); stroke([[X0, TER.floor + 60], [X1, TER.floor + 60]], 4, { line: '#bfae8a' }); } });
  // TV tabung di meja kecil
  tv(TER.tv[0], TER.tv[1], 1, t, ticker, egg);
  // bangku Dimas
  shape(rr(440, 1040, 360, 40, 10), { fill: '#7a4a2a', lw: 7 });
  for (const lx of [470, 760]) shape(rect(lx - 12, 1076, 24, TER.floor - 1076 - 30), { fill: '#5e3a20', lw: 6 });
  // kompor fusi + wajan
  komporFusi(TER.ibuX + 150, 1070, t, { burnt, smoke, tempeN, fry });
  oyen(840, TER.floor - 30, .9, t, { look: oyenLook, munch: oyenMunch, blink: Math.floor(t * 12) % 40 === 0 });
}
export function tv(x, y, s, t, ticker = true, egg = 0) {
  push(); translate(x, y); scale(s);
  shape(rect(-120, 40, 240, 30), { fill: '#7a4a2a', lw: 6 }); for (const lx of [-100, 100]) shape(rect(lx - 10, 70, 20, 150), { fill: '#5e3a20', lw: 6 });
  shape(rr(-130, -170, 260, 210, 24), { fill: '#5b5f6a', lw: 7, shade: () => fillOnly(rect(60, -180, 90, 230), '#444852', { boil: .3 }) });
  shape(rr(-110, -150, 180, 160, 18), { fill: '#7fd6c8', lw: 6, shade: () => {
    fillOnly(rect(-120, -40, 200, 60), '#0f2a3a', { boil: .1 });
    if (ticker) {
      const msg = 'AUDIT PROYEK BENDUNGAN TEGAR GROUP DILANJUTKAN  •  ';
      g.font = '400 30px VT323'; const lead = g.measureText('AUDIT PROYEK BENDUNGAN ').width, unit = g.measureText(msg).width;
      const off = egg ? lead - 18 + (t - 81.25) * 6 : (t * 70) % unit;
      text(msg + msg, -110 - off, -10, { font: '400 30px VT323', fill: '#ffd36e', align: 'left' });
    }
    fillOnly(ell(-20, -100, 40, 30, 18), '#c2603f', { boil: .2 });   // penyiar (gumpal)
  } });
  shape(ell(100, -100, 12, 12, 12), { fill: '#e8b84a', lw: 4 }); shape(ell(100, -60, 12, 12, 12), { fill: '#e8b84a', lw: 4 });
  stroke([[-40, -170], [-90, -240]], 5); stroke([[0, -170], [40, -250]], 5);
  pop();
}
export function komporFusi(x, y, t, { burnt = 0, smoke = 0, tempeN = 4, fry = 1 } = {}) {
  push(); translate(x, y);
  // meja kompor
  shape(rect(-200, 40, 400, 30), { fill: '#7a4a2a', lw: 6 }); for (const lx of [-180, 180]) shape(rect(lx - 12, 70, 24, TER.floor - y - 100), { fill: '#5e3a20', lw: 6 });
  // reaktor mini (biru datar, bukan glow)
  shape(rr(-130, -60, 260, 100, 18), { fill: '#8d96a3', lw: 7, shade: () => fillOnly(rect(50, -70, 100, 120), '#6c7482', { boil: .3 }) });
  shape(ell(-70, -10, 30, 30, 20), { fill: '#5fd0e8', lw: 5, shade: () => { const a = t * 6; for (let k = 0; k < 3; k++) fillOnly(ell(-70 + Math.cos(a + k * 2.1) * 14, -10 + Math.sin(a + k * 2.1) * 14, 6, 6, 8), '#e8fbff', { boil: .2 }); } });
  text('FUSI', 30, -26, { font: '400 30px VT323', fill: '#1b1422' }); text('SUBSIDI', 30, 2, { font: '400 26px VT323', fill: '#c0213a' });
  // wajan
  shape(spline([[-170, -90], [170, -90], [130, -40], [-130, -40]]), { fill: '#3b3f4a', lw: 7 });
  stroke([[170, -84], [250, -110]], 9);
  shape(ell(0, -92, 168, 22, 36), { fill: burnt > .5 ? '#3a2416' : '#c98f32', lw: 6 });
  for (let i = 0; i < tempeN; i++) tempe(-100 + i * 62, -98 + (i % 2) * 6, (i - 1.5) * .1, .7, { burnt });
  if (fry) for (let i = 0; i < 6; i++) { const u = (t * 2 + hash(i)) % 1; dot(-140 + hash(i + 3) * 280, -100 - u * 30, 4 * (1 - u) + 1, '#fff3c4'); }
  if (smoke > 0) for (let k = 0; k < 4; k++) { const u = (t * .6 + k / 4) % 1; shape(ell(-60 + k * 40 + Math.sin(t + k) * 20, -130 - u * 300, 40 + u * 50, 30 + u * 40, 20), { fill: `rgba(60,55,70,${.75 * smoke * (1 - u)})`, lw: 5, line: `rgba(27,20,34,${smoke * (1 - u)})` }); }
  pop();
}

// ———————————————————— insert jam tangan berdering ————————————————————
export function watchInsert(t, t0, name, role) {
  bands(['#171437', '#221d4f'], -400, 2400);
  // lengan besar
  shape(noodle([-300, 1500], [1400, 700], 40, 320, 300), { fill: PAL.skinD, lw: 9, shade: () => fillOnly(rect(-400, 1200, 2000, 700), PAL.skinDs, { boil: .3 }) });
  const u = t - t0, k = 1 + .2 * ((u * 3) % 1);
  push(); translate(540, 1000); rotate(-.44);
  fillOnly(ell(0, 0, 420 * k, 360 * k, 40), 'rgba(255,63,164,.14)', { boil: .5 });
  fillOnly(ell(0, 0, 340 * k, 290 * k, 40), 'rgba(255,63,164,.18)', { boil: .5 });
  shape(rr(-110, -360, 220, 720, 40), { fill: '#2b2e37', lw: 9 });
  shape(rr(-280, -210, 560, 420, 70), { fill: '#3b3f4a', lw: 9 });
  shape(rr(-240, -170, 480, 340, 46), { fill: Math.floor(u * 8) % 2 ? PAL.glow : PAL.glowD, lw: 8 });
  pop();
  // teks panggilan (layar tegak agar terbaca)
  const n = Math.floor(u * 30);
  text('MEMANGGIL…', 540, 860, { font: '400 64px VT323', fill: '#ffe3f2', outlineW: 6 });
  text(name.slice(0, n), 540, 960, { font: '400 92px VT323', fill: '#ffffff', outlineW: 8 });
  text(role, 540, 1060, { font: '400 54px VT323', fill: '#ffe3f2', outlineW: 6 });
}

// ———————————————————— ikon meter (digambar, bukan emoji) ————————————————————
export function icon(kind, x, y, s = 1) {
  push(); translate(x, y); scale(s);
  if (kind === 'pop') { shape([[-30, -14], [10, -34], [10, 34], [-30, 14]], { fill: '#ffd36e', lw: 5 }); shape(rr(-44, -16, 18, 32, 4), { fill: '#ffd36e', lw: 5 }); stroke(arc(18, 0, 18, 26, -1, 1, 8), 5); stroke(arc(18, 0, 34, 40, -.9, .9, 8), 5); }
  else if (kind === 'kota') { for (const [bx, bh] of [[-34, 50], [-6, 72], [24, 40]]) shape(rect(bx, 34 - bh, 26, bh), { fill: '#7fd6c8', lw: 5 }); }
  else if (kind === 'elite') { shape(spline([[-40, 10], [-20, -14], [0, -6], [20, -16], [40, 8], [20, 26], [0, 20], [-20, 28]]), { fill: '#e8b84a', lw: 5 }); stroke([[-10, -2], [10, 10]], 4); }
  else { shape(ell(0, -30, 30, 10, 20), { lw: 5, line: '#ffe066' }); shape(ell(0, 10, 22, 26, 20), { fill: '#f2ead0', lw: 5 }); dot(-8, 6, 3); dot(8, 6, 3); stroke(arc(0, 16, 8, 6, .3, 2.8, 8), 3); }
  pop();
}
