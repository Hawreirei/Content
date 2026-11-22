// The Hawreirei house puppet: the channel's own host, drawn from the creator's photo as a paper caricature.
//   hw = short black crop, thin rose-gold glasses, black Malay baju (stand collar, diagonal front panel),
//        a gold brooch with hanging chains, a black-and-silver songket sampin to the knee, black trousers.
const HC = [0, -128], HR = 116;
const SH = { L: [-82, 30], R: [82, 30] }, HIP = { L: [-44, 236], R: [44, 236] };
const UA = 112, FA = 104, LEG = 150;
const PARTS = {};
const CHAR = {
  hw: { skin: '#C58D63', hair: '#1D1917', main: '#25242A', trim: '#D9B158', leg: '#1F1E23', shoe: '#141316', hatTop: [0, -232],
        silver: '#BFC3CB', rim: '#5E3B2E' },
};
const KEYS = ['hw'];
function songket(g, x0, y0, x1, y1) {   // black songket with a silver lattice and a border band
  g.save(); const cl = P2(p => p.rect(x0, y0, x1 - x0, y1 - y0)); g.clip(cl);
  g.strokeStyle = 'rgba(191,195,203,.75)'; g.lineWidth = 2;
  for (let x = x0 - 200; x < x1 + 200; x += 26) { g.beginPath(); g.moveTo(x, y0); g.lineTo(x + (y1 - y0), y1); g.stroke(); g.beginPath(); g.moveTo(x, y1); g.lineTo(x + (y1 - y0), y0); g.stroke(); }
  for (let x = x0 + 13; x < x1; x += 26) for (let y = y0 + 13; y < y1 - 34; y += 26) { g.beginPath(); g.arc(x, y, 3.2, 0, Math.PI * 2); g.fillStyle = '#D6D9DF'; g.fill(); }
  g.fillStyle = '#2E2D34'; g.fillRect(x0, y1 - 36, x1 - x0, 36);
  g.strokeStyle = '#C9CCD3'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(x0, y1 - 34); g.lineTo(x1, y1 - 34); g.moveTo(x0, y1 - 4); g.lineTo(x1, y1 - 4); g.stroke();
  for (let x = x0; x < x1; x += 16) { g.beginPath(); g.moveTo(x, y1 - 30); g.lineTo(x + 8, y1 - 19); g.lineTo(x, y1 - 8); g.lineWidth = 2; g.stroke(); }
  g.restore();
}
function buildPuppets() {
  const key = 'hw', c = CHAR.hw, P = PARTS[key] = { heads: {} };
  const sk = { box: [-60, -60, 60, 160] };
  // legs: black trousers, black shoes
  for (const side of ['L', 'R']) P['leg' + side] = bakePart(110, LEG + 40, [40, 6], g => {
    ink(g, roundedLimb(LEG - 12, 44, 40), c.leg, { box: [-22, 0, 22, LEG], hi: .12 });
    inkLine(g, [[-6, 20], [-4, LEG - 26]], 2, 'rgba(255,255,255,.12)');
    const shoe = P2(p => { p.moveTo(-22, LEG - 10); p.quadraticCurveTo(-26, LEG + 16, 4, LEG + 16); p.lineTo(52, LEG + 16); p.quadraticCurveTo(66, LEG + 4, 44, LEG - 6); p.quadraticCurveTo(18, LEG - 12, 18, LEG - 22); p.closePath(); });
    ink(g, shoe, c.shoe, { box: [-20, LEG - 20, 60, LEG + 16], hi: .3 });
  }, 11 + (side === 'L' ? 0 : 1));
  // sleeves
  for (const side of ['L', 'R']) P['ua' + side] = bakePart(84, UA + 40, [42, 22], g => {
    ink(g, roundedLimb(UA, 52, 46), c.main, { box: [-30, -10, 30, UA], hi: .14 });
    inkLine(g, [[-8, 12], [-10, UA - 12]], 2.5, 'rgba(255,255,255,.12)');
  }, 21 + (side === 'L' ? 0 : 1));
  for (const side of ['L', 'R']) P['fa' + side] = bakePart(96, FA + 60, [48, 20], g => {
    ink(g, roundedLimb(FA - 14, 44, 40), c.main, { box: [-22, 0, 22, FA], hi: .12 });
    const hand = P2(p => p.ellipse(0, FA + 8, 26, 29, 0, 0, Math.PI * 2)); ink(g, hand, c.skin, sk);
    const th = P2(p => p.ellipse(side === 'L' ? -21 : 21, FA - 2, 10, 15, side === 'L' ? .5 : -.5, 0, Math.PI * 2)); ink(g, th, c.skin, sk);
    inkLine(g, [[-12, FA + 22], [-4, FA + 28]], 2.5); inkLine(g, [[2, FA + 24], [10, FA + 28]], 2.5);
  }, 31 + (side === 'L' ? 0 : 1));
  // open palms (the 'kok bisa?' gesture): a wide palm with spread fingers
  for (const side of ['L', 'R']) P['fa' + side + 'o'] = bakePart(110, FA + 90, [55, 20], g => {
    ink(g, roundedLimb(FA - 14, 44, 40), c.main, { box: [-22, 0, 22, FA] });
    const sd = side === 'L' ? -1 : 1;
    for (const [a, l] of [[-.55, 30], [-.18, 36], [.16, 34], [.48, 28]]) { const fx = Math.sin(a) * l, fy = Math.cos(a) * l; const f = P2(p => { p.moveTo(-6 + fx * .3, FA + 14); p.lineTo(fx - 6, FA + 18 + fy); p.quadraticCurveTo(fx, FA + 26 + fy, fx + 6, FA + 18 + fy); p.lineTo(6 + fx * .3, FA + 14); p.closePath(); }); ink(g, f, c.skin, sk); }
    const palm = P2(p => p.ellipse(0, FA + 10, 28, 24, 0, 0, Math.PI * 2)); ink(g, palm, c.skin, sk);
    const th = P2(p => p.ellipse(sd * 30, FA + 2, 9, 18, sd * -.9, 0, Math.PI * 2)); ink(g, th, c.skin, sk);
    inkLine(g, [[-14, FA + 8], [12, FA + 14]], 2, 'rgba(120,60,30,.45)');
  }, 35 + (side === 'L' ? 0 : 1));
  // torso: the baju to the hip with a diagonal front panel, the songket sampin below it
  P.torso = bakePart(260, 340, [130, 26], g => {
    const neck = P2(p => p.rect(-24, -24, 48, 40)); ink(g, neck, c.skin, sk);
    const samp = P2(p => { p.moveTo(-96, 150); p.quadraticCurveTo(0, 162, 96, 150); p.lineTo(108, 302); p.quadraticCurveTo(0, 314, -108, 302); p.closePath(); });
    ink(g, samp, '#25242B', { box: [-108, 150, 108, 310], hi: .12 });
    g.save(); g.clip(samp); songket(g, -112, 150, 112, 312); g.restore(); g.lineWidth = 4; g.strokeStyle = INK; g.stroke(samp);
    const baju = P2(p => { p.moveTo(-86, 8); p.quadraticCurveTo(0, -6, 86, 8); p.lineTo(96, 196); p.lineTo(0, 216); p.lineTo(-96, 196); p.closePath(); });
    ink(g, baju, c.main, { box: [-96, 0, 96, 216], hi: .16 });
    // the diagonal front panel, from the left shoulder down across the body
    const flap = P2(p => { p.moveTo(-40, 6); p.lineTo(-22, 6); p.quadraticCurveTo(30, 110, 60, 206); p.lineTo(0, 216); p.quadraticCurveTo(-20, 120, -40, 6); p.closePath(); });
    ink(g, flap, '#2E2D34', { box: [-40, 6, 60, 216], hi: .2, lw: 3 });
    inkLine(g, [[-22, 8], [8, 90], [58, 204]], 2.5, 'rgba(255,255,255,.16)');
    // the stand collar
    const col = P2(p => { p.moveTo(-30, -2); p.quadraticCurveTo(0, 8, 30, -2); p.lineTo(28, -22); p.quadraticCurveTo(0, -14, -28, -22); p.closePath(); }); ink(g, col, c.main, { box: [-30, -22, 30, 8], lw: 3 });
    // a small pin on the shoulder, the gold brooch with chains on the chest
    g.beginPath(); g.arc(-36, 26, 5, 0, Math.PI * 2); g.fillStyle = c.silver; g.fill();
    const br = P2(p => { p.moveTo(30, 60); p.quadraticCurveTo(40, 40, 50, 60); p.quadraticCurveTo(58, 48, 64, 60); p.quadraticCurveTo(50, 74, 30, 60); p.closePath(); });
    ink(g, br, c.trim, { box: [30, 40, 64, 74], lw: 2.5, hi: .3 });
    g.beginPath(); g.arc(47, 60, 4, 0, Math.PI * 2); g.fillStyle = C.red; g.fill();
    const br2 = P2(p => { p.moveTo(72, 64); p.quadraticCurveTo(80, 52, 86, 64); p.quadraticCurveTo(80, 72, 72, 64); p.closePath(); }); ink(g, br2, c.trim, { box: [72, 52, 86, 72], lw: 2 });
    for (const [d, w] of [[14, 2.2], [26, 2.2], [38, 2.2]]) { g.beginPath(); g.moveTo(42, 68); g.quadraticCurveTo(58, 68 + d, 78, 68); g.lineWidth = w; g.setLineDash([3, 3]); g.strokeStyle = '#E8C772'; g.stroke(); g.setLineDash([]); }
  }, 41);
  // heads: short black crop, thin rose-gold glasses, clean-shaven
  for (const mood of ['n', 'shout', 'worried', 'wow']) P.heads[mood] = bakePart(320, 340, [160, 300], g => {
    const [cx, cy] = HC, r = HR;
    for (const s of [-1, 1]) { const ear = P2(p => p.ellipse(cx + s * r * .97, cy + 10, 20, 28, 0, 0, Math.PI * 2)); ink(g, ear, c.skin, { box: [-130, -150, 130, -100] }); }
    const head = P2(p => { p.moveTo(cx - r, cy - r * .1); p.quadraticCurveTo(cx - r, cy - r, cx, cy - r); p.quadraticCurveTo(cx + r, cy - r, cx + r, cy - r * .1); p.quadraticCurveTo(cx + r * .98, cy + r * .72, cx, cy + r * .98); p.quadraticCurveTo(cx - r * .98, cy + r * .72, cx - r, cy - r * .1); p.closePath(); });
    ink(g, head, c.skin, { box: [cx - r, cy - r, cx + r * .6, cy + r] });
    const hair = P2(p => { p.moveTo(cx - r * .97, cy - r * .3); p.quadraticCurveTo(cx - r * 1.03, cy - r * .92, cx - r * .4, cy - r * 1.06); p.quadraticCurveTo(cx, cy - r * 1.12, cx + r * .45, cy - r * 1.04); p.quadraticCurveTo(cx + r * 1.03, cy - r * .9, cx + r * .97, cy - r * .3);
      p.lineTo(cx + r * .9, cy - r * .34); p.quadraticCurveTo(cx + r * .86, cy - r * .62, cx + r * .6, cy - r * .7); p.quadraticCurveTo(cx, cy - r * .76, cx - r * .6, cy - r * .7); p.quadraticCurveTo(cx - r * .86, cy - r * .62, cx - r * .9, cy - r * .34); p.closePath(); });
    ink(g, hair, c.hair, { box: [cx - r, cy - r * 1.1, cx + r, cy - r * .1], hi: .12 });
    g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = 2; for (let i = -4; i <= 4; i++) { g.beginPath(); g.moveTo(cx + i * r * .18, cy - r * .66); g.lineTo(cx + i * r * .2, cy - r * 1.0); g.stroke(); }
    face(g, { cx, cy, r, brow: c.hair }, mood);
    // glasses: thin rims around both eyes, a bridge, arms to the ears
    const ex = r * .34, ey = cy - r * .08;
    g.lineWidth = 5; g.strokeStyle = c.rim;
    for (const s of [-1, 1]) { g.beginPath(); g.roundRect(cx + s * ex - r * .25, ey - r * .21, r * .5, r * .4, r * .14); g.stroke();
      g.save(); g.globalAlpha = .18; g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(cx + s * ex - r * .16, ey - r * .17); g.lineTo(cx + s * ex - r * .04, ey - r * .17); g.lineTo(cx + s * ex - r * .2, ey + r * .1); g.closePath(); g.fill(); g.restore(); }
    g.beginPath(); g.moveTo(cx - ex + r * .25, ey - r * .06); g.quadraticCurveTo(cx, ey - r * .14, cx + ex - r * .25, ey - r * .06); g.stroke();
    for (const s of [-1, 1]) { g.beginPath(); g.moveTo(cx + s * (ex + r * .25), ey - r * .1); g.lineTo(cx + s * r * .95, ey - r * .02); g.stroke(); }
  }, 51 + ['n', 'shout', 'worried', 'wow'].indexOf(mood));
  P.hat = bakePart(20, 20, [10, 10], g => {}, 71);   // no headgear
  PARTS.props = {
    marker: bakePart(80, 200, [40, 60], g => {   // a whiteboard marker
      const b = P2(p => p.roundRect(-14, -40, 28, 150, 8)); ink(g, b, '#F4F1EA', { box: [-14, -40, 14, 110], lw: 3.5 });
      const cap = P2(p => p.roundRect(-16, -70, 32, 44, 8)); ink(g, cap, '#C8463A', { box: [-16, -70, 16, -26], lw: 3.5 });
      inkLine(g, [[-8, 20], [-8, 90]], 3, 'rgba(43,34,25,.25)');
    }, 81),
  };
}

// two schoolchildren for story problems (generic figures, SD uniform: white shirt, red bottoms)
CHAR.ani = { skin: '#C99467', hair: '#231C18', main: '#F4F1EA', trim: '#B23A2E', leg: '#C99467', shoe: '#1E1C1F', hatTop: [0, -232], girl: true };
CHAR.bud = { skin: '#B98055', hair: '#1D1917', main: '#F4F1EA', trim: '#B23A2E', leg: '#B98055', shoe: '#1E1C1F', hatTop: [0, -232], girl: false };
function buildKid(key) {
  const c = CHAR[key], P = PARTS[key] = { heads: {} }, sk = { box: [-60, -60, 60, 160] }, seed = key === 'ani' ? 100 : 120;
  for (const side of ['L', 'R']) P['leg' + side] = bakePart(110, LEG + 40, [40, 6], g => {
    ink(g, roundedLimb(LEG - 12, 40, 36), c.skin, sk);
    const sock = P2(p => p.roundRect(-20, LEG - 52, 40, 34, 6)); ink(g, sock, '#FBF8F0', { box: [-20, LEG - 52, 20, LEG - 18], lw: 3 });
    const shoe = P2(p => { p.moveTo(-22, LEG - 14); p.quadraticCurveTo(-26, LEG + 16, 4, LEG + 16); p.lineTo(50, LEG + 16); p.quadraticCurveTo(62, LEG + 4, 42, LEG - 6); p.quadraticCurveTo(18, LEG - 14, 18, LEG - 24); p.closePath(); });
    ink(g, shoe, c.shoe, { box: [-20, LEG - 20, 60, LEG + 16], hi: .3 });
  }, seed + (side === 'L' ? 1 : 2));
  for (const side of ['L', 'R']) P['ua' + side] = bakePart(84, UA + 40, [42, 22], g => { ink(g, roundedLimb(UA * .55, 52, 48), c.main, { box: [-30, -10, 30, UA], hi: .1 }); const arm = P2(p => p.roundRect(-18, UA * .5, 36, UA * .52, 16)); ink(g, arm, c.skin, sk); }, seed + 3 + (side === 'L' ? 0 : 1));
  for (const side of ['L', 'R']) P['fa' + side] = bakePart(96, FA + 60, [48, 20], g => {
    ink(g, roundedLimb(FA - 14, 38, 34), c.skin, sk);
    const hand = P2(p => p.ellipse(0, FA + 8, 25, 28, 0, 0, Math.PI * 2)); ink(g, hand, c.skin, sk);
    const th = P2(p => p.ellipse(side === 'L' ? -20 : 20, FA - 2, 9, 14, side === 'L' ? .5 : -.5, 0, Math.PI * 2)); ink(g, th, c.skin, sk);
  }, seed + 5 + (side === 'L' ? 0 : 1));
  P.torso = bakePart(260, 340, [130, 26], g => {
    const neck = P2(p => p.rect(-22, -24, 44, 40)); ink(g, neck, c.skin, sk);
    const bottom = c.girl ? P2(p => { p.moveTo(-84, 140); p.lineTo(84, 140); p.lineTo(112, 262); p.quadraticCurveTo(0, 276, -112, 262); p.closePath(); })
                          : P2(p => { p.moveTo(-82, 140); p.lineTo(82, 140); p.lineTo(88, 236); p.lineTo(6, 240); p.lineTo(0, 200); p.lineTo(-6, 240); p.lineTo(-88, 236); p.closePath(); });
    ink(g, bottom, c.trim, { box: [-110, 140, 110, 270], hi: .15 });
    if (c.girl) for (const x of [-60, -20, 20, 60]) inkLine(g, [[x * .9, 150], [x * 1.25, 258]], 2.5, 'rgba(60,10,10,.4)');
    const shirt = P2(p => { p.moveTo(-82, 8); p.quadraticCurveTo(0, -6, 82, 8); p.lineTo(88, 156); p.quadraticCurveTo(0, 166, -88, 156); p.closePath(); }); ink(g, shirt, c.main, { box: [-88, 0, 88, 160], hi: .12 });
    const col = P2(p => { p.moveTo(-34, -2); p.lineTo(0, 30); p.lineTo(34, -2); p.lineTo(22, -14); p.lineTo(0, 10); p.lineTo(-22, -14); p.closePath(); }); ink(g, col, '#FFFFFF', { box: [-34, -14, 34, 30], lw: 3 });
    for (const y of [46, 78, 110]) { g.beginPath(); g.arc(0, y, 4.5, 0, Math.PI * 2); g.fillStyle = '#C9C2B0'; g.fill(); }
    const badge = P2(p => p.roundRect(36, 40, 30, 36, 6)); ink(g, badge, '#C8463A', { box: [36, 40, 66, 76], lw: 2.5 });
    inkLine(g, [[-80, 150], [80, 150]], 4, 'rgba(43,34,25,.5)');
  }, seed + 8);
  for (const mood of ['n', 'shout', 'worried', 'wow']) P.heads[mood] = bakePart(320, 360, [160, 300], g => {
    const [cx, cy] = HC, r = HR;
    if (c.girl) { const tail = P2(p => { p.moveTo(cx + r * .7, cy - r * .7); p.quadraticCurveTo(cx + r * 1.6, cy - r * .5, cx + r * 1.35, cy + r * .6); p.quadraticCurveTo(cx + r * 1.2, cy - r * .1, cx + r * .8, cy - r * .3); p.closePath(); }); ink(g, tail, c.hair, { box: [cx, cy - r, cx + r * 1.6, cy + r * .6], hi: .12 });
      g.beginPath(); g.arc(cx + r * .9, cy - r * .62, 13, 0, Math.PI * 2); g.fillStyle = C.red; g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke(); }
    for (const s of [-1, 1]) { const ear = P2(p => p.ellipse(cx + s * r * .97, cy + 10, 19, 26, 0, 0, Math.PI * 2)); ink(g, ear, c.skin, { box: [-130, -150, 130, -100] }); }
    const head = P2(p => p.arc(cx, cy, r, 0, Math.PI * 2)); ink(g, head, c.skin, { box: [cx - r, cy - r, cx + r * .6, cy + r] });
    const hair = c.girl
      ? P2(p => { p.moveTo(cx - r * 1.02, cy + r * .1); p.quadraticCurveTo(cx - r * 1.08, cy - r * 1.0, cx, cy - r * 1.08); p.quadraticCurveTo(cx + r * 1.08, cy - r * 1.0, cx + r * 1.02, cy + r * .1); p.lineTo(cx + r * .86, cy - r * .2); p.quadraticCurveTo(cx + r * .5, cy - r * .55, cx - r * .1, cy - r * .5); p.quadraticCurveTo(cx - r * .7, cy - r * .5, cx - r * .86, cy - r * .2); p.closePath(); })
      : P2(p => { p.moveTo(cx - r * .98, cy - r * .3); p.quadraticCurveTo(cx - r * 1.02, cy - r * 1.0, cx, cy - r * 1.1); p.quadraticCurveTo(cx + r * 1.02, cy - r * 1.0, cx + r * .98, cy - r * .3); p.lineTo(cx + r * .88, cy - r * .4); p.quadraticCurveTo(cx + r * .3, cy - r * .5, cx + r * .1, cy - r * .74); p.quadraticCurveTo(cx - r * .3, cy - r * .56, cx - r * .88, cy - r * .4); p.closePath(); });
    ink(g, hair, c.hair, { box: [cx - r, cy - r * 1.1, cx + r, cy], hi: .12 });
    face(g, { cx, cy, r, brow: c.hair }, mood);
  }, seed + 10 + ['n', 'shout', 'worried', 'wow'].indexOf(mood));
  P.hat = bakePart(20, 20, [10, 10], g => {}, seed + 20);
}
const _buildHw = buildPuppets;
buildPuppets = function () { _buildHw(); buildKid('ani'); buildKid('bud'); };
