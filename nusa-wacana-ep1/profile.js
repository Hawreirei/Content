// profile.js — foto profil Instagram Dimas (persegi 1080, aman untuk potongan lingkaran)
// ?v=a  wali kota ramah (utama) · ?v=b  panik, jam tangan berdering (alternatif)
import { hash, TAU } from './lib.js';
import { init, frame, S, reset, translate, scale, shape, fillOnly, stroke, ell, rect, rr, dot, bands, screenRect, push, pop } from './toon.js';
import { dimas, PAL } from './chars.js';
import * as Wd from './worlds.js';
init(document.getElementById('c'));
const v = new URLSearchParams(location.search).get('v') || 'a';
const Y0 = 420;   // area persegi: y 420..1500
function bg(t) {
  if (v === 'a') {
    screenRect('#1f7f86'); bands(['#1f7f86', '#2fa3a0', '#5fc0b0', '#f6a04d', '#ffc979'], Y0 + 120, Y0 + 1080, -100, 1200);
    shape(ell(820, Y0 + 640, 120, 120, 40), { fill: '#ffd86b', lw: 6 });
    for (let i = 0; i < 9; i++) { const x = -60 + i * 135, h = 220 + hash(i * 2.3) * 300; shape(rect(x, Y0 + 1080 - h, 112, h + 40), { fill: i % 2 ? '#2b6d73' : '#357e80', lw: 6, shade: () => { for (let k = 0; k < 6; k++) fillOnly(rect(x + 20, Y0 + 1100 - h + k * 50, 24, 16), '#ffd36e', { boil: .2 }); } }); }
  } else {
    screenRect('#171437');
    Wd.portal(540, Y0 + 520, 520, t, { open: 1, sx: 1, spin: 1, wash: false });
  }
}
function render(t) {
  frame(t); S.lwScale = 2.0; S.amp = 2.4;
  screenRect('#000'); reset();
  bg(t); reset();
  const A = v === 'a';
  dimas({ x: 474, y: Y0 + 2470, s: 2.9, face: 1, t,
    look: A ? [-.15, 0] : [-.7, -.4], lid: A ? .12 : 0, pupil: A ? 5 : 4, brow: A ? .15 : -1,
    mouth: A ? { o: .45, w: 1.05, sm: 1 } : { o: .6, w: .9, sm: -.7 },
    headTilt: A ? -.06 : .05, sweat: A ? null : .3, ring: A ? 0 : 1,
    armR: A ? { h: [120, -140], bend: 40 } : { h: [40, 180], bend: 16 }, armL: { h: [-16, 190], bend: -16 } });
}
window.render = render;
for (const f of ['800 54px "Baloo 2"', '400 40px VT323']) await document.fonts.load(f);
render(0.3); window.READY = true;
