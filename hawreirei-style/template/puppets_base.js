// Paper puppets drawn in code (no generated sheets): each part is painted flat with an ink line, given a cream card edge
// (the art dilated in cream, as if cut from card with a margin) and a paper texture, then pinned with brass.
// Rig: neck at (0,0) in puppet units; parts rotate about their pins (FK) and arms reach targets with two-bone IK.
const INK = '#2B2219', CREAM = '#F3EAD6';
const PART_PR = 2;   // parts are baked at 2× for a crisp edge when the camera pushes in

function bakePart(w, h, pv, art, seed = 1) {
  // w,h: art box in units; pv: pivot inside that box; art(g) draws with the origin at the pivot (units)
  const m = 14, cw = Math.ceil((w + m * 2) * PART_PR), ch = Math.ceil((h + m * 2) * PART_PR);
  const A = canvas(cw, ch), a = A.getContext('2d');
  a.setTransform(PART_PR, 0, 0, PART_PR, (pv[0] + m) * PART_PR, (pv[1] + m) * PART_PR);
  a.lineJoin = 'round'; a.lineCap = 'round'; art(a);
  // cream card edge: the art's silhouette, tinted cream, stamped around a ring (a dilation)
  const S = canvas(cw, ch), s = S.getContext('2d'); s.drawImage(A, 0, 0); s.globalCompositeOperation = 'source-in'; s.fillStyle = CREAM; s.fillRect(0, 0, cw, ch);
  const R = canvas(cw, ch), r = R.getContext('2d'), rad = 5.5 * PART_PR;
  r.shadowColor = 'rgba(40,28,15,.35)'; r.shadowBlur = 2 * PART_PR;
  for (let i = 0; i < 20; i++) { const an = i / 20 * Math.PI * 2; r.drawImage(S, Math.cos(an) * rad, Math.sin(an) * rad); }
  r.shadowColor = 'transparent';
  r.drawImage(A, 0, 0);
  // paper grain over everything (card edge included), kept inside the shape
  const T = canvas(cw, ch), t = T.getContext('2d'); t.drawImage(makePaper(cw, ch, seed), 0, 0); t.globalCompositeOperation = 'destination-in'; t.drawImage(R, 0, 0);
  r.globalCompositeOperation = 'overlay'; r.globalAlpha = .5; r.drawImage(T, 0, 0); r.globalAlpha = 1; r.globalCompositeOperation = 'source-over';
  return { cv: R, pv: [pv[0] + m, pv[1] + m] };
}
// fill a path with a soft printed shade (lighter top-left), then ink it
function ink(g, p, col, o = {}) {
  const b = o.box || [-100, -100, 100, 100];
  const gr = g.createLinearGradient(b[0], b[1], b[2], b[3]); gr.addColorStop(0, shadeC(col, o.hi ?? .12)); gr.addColorStop(1, shadeC(col, -(o.lo ?? .1)));
  g.fillStyle = gr; g.fill(p);
  if (o.noLine) return; g.lineWidth = o.lw || 5; g.strokeStyle = INK; g.stroke(p);
}
function shadeC(hex, k) {
  const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k)));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
function inkLine(g, pts, lw = 3, col = INK) { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.lineWidth = lw; g.strokeStyle = col; g.stroke(); }
function P2(f) { const p = new Path2D(); f(p); return p; }
function roundedLimb(len, w0, w1) {   // a limb along +y from the pivot: rounded at both ends
  return P2(p => { p.moveTo(-w0 / 2, 0); p.arc(0, 0, w0 / 2, Math.PI, 0); p.lineTo(w1 / 2, len); p.arc(0, len, w1 / 2, 0, Math.PI); p.closePath(); });
}

// —— faces ——
function face(g, o, mood) {
  // o: { cx, cy, r, skin, kohl, beard }
  const { cx, cy, r } = o, ex = r * .34, ey = cy - r * .08;
  const surprised = mood === 'wow', worried = mood === 'worried', shout = mood === 'shout';
  // eyes
  for (const s of [-1, 1]) {
    const x = cx + s * ex, ew = r * .15, eh = surprised ? r * .2 : r * .17;
    g.beginPath(); g.ellipse(x, ey, ew, eh, 0, 0, Math.PI * 2); g.fillStyle = '#FBF6EA'; g.fill(); g.lineWidth = 3.5; g.strokeStyle = INK; g.stroke();
    const pr = surprised ? r * .055 : r * .08, lookX = shout ? s * -1 : 1.5, lookY = worried ? 3 : 0;
    g.beginPath(); g.arc(x + lookX, ey + lookY + 2, pr, 0, Math.PI * 2); g.fillStyle = INK; g.fill();
    g.beginPath(); g.arc(x + lookX - pr * .35, ey + lookY + 2 - pr * .35, pr * .3, 0, Math.PI * 2); g.fillStyle = '#FBF6EA'; g.fill();
    if (o.kohl) { g.lineWidth = 4.5; g.strokeStyle = INK; g.beginPath(); g.moveTo(x - ew * s * -1 * 0 + s * ew * .9, ey); g.lineTo(x + s * ew * 1.7, ey - 3); g.stroke(); }
    // brows
    const by = ey - eh - r * .12 - (surprised ? r * .1 : 0), tilt = worried ? s * -9 : shout ? s * 10 : 0;
    g.lineWidth = 7; g.strokeStyle = o.brow || INK; g.beginPath(); g.moveTo(x - ew * 1.1, by + tilt * .5); g.quadraticCurveTo(x, by - 6, x + ew * 1.1, by - tilt * .5); g.stroke();
  }
  // nose
  g.lineWidth = 3.5; g.strokeStyle = INK; g.beginPath(); g.moveTo(cx + 4, cy + r * .02); g.quadraticCurveTo(cx + r * .16, cy + r * .2, cx - 2, cy + r * .24); g.stroke();
  // cheeks
  for (const s of [-1, 1]) { g.beginPath(); g.ellipse(cx + s * r * .5, cy + r * .28, r * .12, r * .07, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(200,90,70,.28)'; g.fill(); }
  // mouth
  const my = cy + r * .48;
  g.lineWidth = 4; g.strokeStyle = INK;
  if (shout || surprised) {
    const mw = shout ? r * .3 : r * .14, mh = shout ? r * .24 : r * .16;
    g.beginPath(); g.ellipse(cx, my + (shout ? 4 : 2), mw, mh, 0, 0, Math.PI * 2); g.fillStyle = '#5A1E1A'; g.fill(); g.stroke();
    if (shout) { g.beginPath(); g.ellipse(cx, my + mh * .55, mw * .6, mh * .38, 0, 0, Math.PI * 2); g.fillStyle = '#C8584A'; g.fill(); g.beginPath(); g.rect(cx - mw * .7, my + 4 - mh + 2, mw * 1.4, mh * .3); g.fillStyle = '#FBF6EA'; g.fill(); }
  } else if (worried) {
    g.beginPath(); g.moveTo(cx - r * .2, my + 4); g.bezierCurveTo(cx - r * .08, my - 6, cx + r * .06, my + 12, cx + r * .2, my); g.stroke();
  } else {
    g.beginPath(); g.moveTo(cx - r * .22, my - 4); g.quadraticCurveTo(cx, my + r * .16, cx + r * .22, my - 4); g.stroke();
  }
}
function curls(g, pts, rr, col, lw = 3.5) {   // a row of curls (hair, beard)
  for (const [x, y, k] of pts) { g.beginPath(); g.arc(x, y, rr * (k || 1), 0, Math.PI * 2); g.fillStyle = col; g.fill(); g.lineWidth = lw; g.strokeStyle = INK; g.stroke(); }
  for (const [x, y, k] of pts) { g.beginPath(); g.arc(x - 2, y - 1, rr * (k || 1) * .45, Math.PI * .9, Math.PI * 2.2); g.lineWidth = 2.2; g.strokeStyle = 'rgba(43,34,25,.55)'; g.stroke(); }
}

// draw a part so that its pivot lands at `at`, rotated by rot (rad), scale s
function putP(g, part, at, rot, s) {
  g.save(); g.translate(at[0], at[1]); g.rotate(rot); g.scale(s / PART_PR, s / PART_PR);
  g.drawImage(part.cv, -part.pv[0] * PART_PR, -part.pv[1] * PART_PR); g.restore();
}
function pinBrass(g, x, y, s) { brass(g, x, y, 8 * s / .72); }
// pose: { at, rot, head, headRot, pop, hat:[dx,dy,rot], leg:{L,R} deg, hand:{L,R}, bend:{L,R}, s, prop:{side,name,rot,k,dx,dy}, flip, noHat }
function drawPuppet(g, key, pose) {
  const P = PARTS[key], s = pose.s || .72, at = pose.at, tr = (pose.rot || 0) * D2R, fl = pose.flip ? -1 : 1;
  g.save(); g.translate(at[0], at[1]); g.scale(fl, 1);
  const loc = q => [(q[0] - at[0]) * fl, q[1] - at[1]];              // world target → puppet-local (mirrored)
  const T = q => { const c = Math.cos(tr), sn = Math.sin(tr); return [(q[0] * c - q[1] * sn) * s, (q[0] * sn + q[1] * c) * s]; };
  for (const side of ['L', 'R']) { const hp = T(HIP[side]); putP(g, P['leg' + side], hp, (pose.leg[side] - 90) * D2R + tr * .3, s); }
  const arms = {};
  for (const side of ['L', 'R']) { const S = T(SH[side]); arms[side] = { S, sol: ik(S, loc(pose.hand[side]), UA * s, FA * s, pose.bend[side]) }; }
  for (const side of ['L', 'R']) { const a = arms[side]; putP(g, P['ua' + side], a.S, a.sol.ua - Math.PI / 2, s); }
  putP(g, P.torso, [0, 0], tr, s);
  const hr = tr + (pose.headRot || 0) * D2R, hs = s * (pose.pop || 1), hp = T([0, 6]);
  putP(g, P.heads[pose.head || 'n'], hp, hr, hs);
  const c = Math.cos(hr), sn = Math.sin(hr), topL = CHAR[key].hatTop;
  const top = [hp[0] + (topL[0] * c - topL[1] * sn) * hs, hp[1] + (topL[0] * sn + topL[1] * c) * hs];
  const hat = pose.hat || [0, 0, 0];
  if (!pose.noHat) putP(g, P.hat, [top[0] + hat[0] * fl, top[1] + hat[1]], hr + hat[2] * D2R, hs);
  if (pose.prop) { const pr = PARTS.props[pose.prop.name], H = arms[pose.prop.side].sol.H; putP(g, pr, [H[0] + (pose.prop.dx || 0), H[1] + (pose.prop.dy || 0)], (pose.prop.rot || 0) * D2R, s * (pose.prop.k || 1)); }
  for (const side of ['L', 'R']) { const a = arms[side]; putP(g, (pose.open && pose.open[side] && P['fa' + side + 'o']) || P['fa' + side], a.sol.E, a.sol.fa - Math.PI / 2, s); }
  for (const side of ['L', 'R']) { const a = arms[side]; pinBrass(g, a.S[0], a.S[1], s); pinBrass(g, a.sol.E[0], a.sol.E[1], s); }
  g.restore();
  const w = q => [at[0] + q[0] * fl, at[1] + q[1]];
  return { hand: { L: w(arms.L.sol.H), R: w(arms.R.sol.H) }, head: w(hp), top: w(top), mouth: w([hp[0], hp[1] + (HC[1] + HR * .5) * hs]) };
}
function stand(key, x, y, o = {}) {
  const k = (o.s || .72) / .72;
  return { at: [x, y], rot: o.rot || 0, head: o.head || 'n', headRot: o.headRot || 0, pop: o.pop || 1, hat: o.hat || [0, 0, 0],
    leg: { L: o.legL ?? 97, R: o.legR ?? 83 }, hand: { L: o.hL || [x - 100 * k * (o.flip ? -1 : 1), y + 190 * k], R: o.hR || [x + 100 * k * (o.flip ? -1 : 1), y + 190 * k] },
    bend: { L: o.bL ?? 1, R: o.bR ?? -1 }, s: o.s, prop: o.prop, noHat: o.noHat, flip: o.flip, open: o.open };
}
