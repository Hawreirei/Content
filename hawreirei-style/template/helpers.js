// Helpers adapted from the Sejarah Angka comic engine (Lemo-Opuscar comic-history demo, MIT): maths, paper, printed map, cards, IK, camera, props, bubbles, tags, slips.
const clamp = (x, a, b) => Math.max(a, Math.min(b, x)), lerp = (a, b, u) => a + (b - a) * u;
const EASE = {
  lin: u => u, io: u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2,
  o: u => 1 - Math.pow(1 - u, 3), i: u => u * u * u,
  back: u => { const c = 1.7; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); },
  el: u => u >= 1 ? 1 : 1 - Math.exp(-5.5 * u) * Math.cos(u * Math.PI * 3.1),
};
function K(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, e] = keys[i];
    if (t <= t1) {
      const [t0, v0] = keys[i - 1], u = EASE[e || 'io'](clamp((t - t0) / Math.max(t1 - t0, 1e-6), 0, 1));
      return Array.isArray(v0) ? v0.map((a, j) => lerp(a, v1[j], u)) : lerp(v0, v1, u);
    }
  }
  return keys[keys.length - 1][1];
}
const wob = (t, t0, amp, f = 5, d = 7) => t < t0 ? 0 : amp * Math.exp(-(t - t0) * d) * Math.sin(2 * Math.PI * f * (t - t0));
const popIn = (t, t0, d = 0.17) => t < t0 ? 0 : t - t0 < d ? EASE.el((t - t0) / d) : 1;
function hash(n) { n = (n ^ 61) ^ (n >>> 16); n = (n + (n << 3)) | 0; n ^= n >>> 4; n = Math.imul(n, 0x27d4eb2d); n ^= n >>> 15; return (n >>> 0) / 4294967296; }
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const D2R = Math.PI / 180;
const twos = t => Math.floor(t * 12 + 1e-6) / 12;
function canvas(w, h) { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return c; }
const len = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const angOf = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
// a hop: [dy, squash] for a jump from t0 lasting d
const hopY = (t, t0, d, h) => t > t0 && t < t0 + d ? -h * Math.sin(Math.PI * (t - t0) / d) : 0;

// ---------------------------------------------------------------- the timeline (film seconds)

function region(lon0, lat0, latSpan) {
  const KS = H / latSpan, KX = KS * Math.cos(lat0 * D2R);
  return { lon0, lat0, KS, KX, P: (lon, lat) => [W / 2 + (lon - lon0) * KX, H / 2 - (lat - lat0) * KS] };
}
// portrait crops; India stops at 26.5°N so China stays out of frame

let LAND, idx, img = {}, paperTex, pagePat, tablePat, LAYER;
const MAPS = {}, MS = 1.25, PR = 2;

// ---------------------------------------------------------------- paper texture (generated)
function makePaper(w, h, seed) {
  const c = canvas(w, h), g = c.getContext('2d'), r = rng(seed);
  g.fillStyle = '#808080'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 900 * w * h / (W * H); i++) {
    const x = r() * w, y = r() * h, rad = 20 + r() * 150, v = r() < .5 ? 0 : 255;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, `rgba(${v},${v},${v},${0.03 + r() * 0.03})`); gr.addColorStop(1, `rgba(${v},${v},${v},0)`);
    g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  for (let i = 0; i < 6000 * w * h / (W * H); i++) {
    const x = r() * w, y = r() * h, a = r() * Math.PI * 2, l = 4 + r() * 20, v = r() < .55 ? 40 : 230;
    g.strokeStyle = `rgba(${v},${v},${v},${0.04 + r() * 0.07})`; g.lineWidth = 0.6 + r() * 0.9;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + 1) * l * .5, y + Math.sin(a + 1) * l * .5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
  }
  const d = g.getImageData(0, 0, w, h), p = d.data;
  for (let i = 0; i < p.length; i += 4) { const n = (r() - .5) * 22; p[i] += n; p[i + 1] += n; p[i + 2] += n; }
  g.putImageData(d, 0, 0);
  return c;
}
// Numbers: IM FELL has old-style figures, so every run of digits is set in Old Standard TT (lining figures)
const NUM_RE = /\d+(?:[.,–]\d+)*/g;
function numFont(base) {
  const m = base.match(/(\d+(?:\.\d+)?)px\s+(\S+)/); if (!m) return base;
  const size = +m[1], fam = m[2], face = /It/.test(fam) ? 'OldStdIt' : /Lilita/.test(fam) ? 'OldStdB' : 'OldStd';
  return `${Math.round(size * (face === 'OldStdB' ? 0.92 : 0.9))}px ${face}`;
}
function textRuns(text) { const out = []; let i = 0; for (const m of text.matchAll(NUM_RE)) { if (m.index > i) out.push([text.slice(i, m.index), 0]); out.push([m[0], 1]); i = m.index + m[0].length; } if (i < text.length) out.push([text.slice(i), 0]); return out; }
function measureMixed(g, text, base) { const nf = numFont(base); let w = 0; for (const [t, n] of textRuns(text)) { g.font = n ? nf : base; w += g.measureText(t).width; } g.font = base; return w; }
function fillMixed(g, text, x, y, base, align = 'left') {
  const nf = numFont(base), w = measureMixed(g, text, base), a0 = g.textAlign;
  let cx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  g.textAlign = 'left';
  for (const [t, n] of textRuns(text)) { g.font = n ? nf : base; g.fillText(t, cx, y); cx += g.measureText(t).width; }
  g.font = base; g.textAlign = a0; return w;
}
function spacedLeft(g, text, x, y, sp) { const a = g.textAlign; g.textAlign = 'left'; let cx = x; for (const c of text) { g.fillText(c, cx, y); cx += g.measureText(c).width + sp; } g.textAlign = a; }
function spaced(g, text, x, y, sp) {
  const ch = [...text], w = ch.map(c => g.measureText(c).width), tot = w.reduce((a, b) => a + b, 0) + sp * (ch.length - 1);
  let cx = x - tot / 2; ch.forEach((c, i) => { g.fillText(c, cx, y); cx += w[i] + sp; });
  return tot;
}

// ---------------------------------------------------------------- the printed map (baked per region)
function landPath(g, R) {
  g.beginPath();
  for (const r of LAND) {
    let any = false; for (const [lo, la] of r) { const [x, y] = R.P(lo, la); if (x > -700 && x < (R.cw || W) + 700 && y > -700 && y < H + 700) { any = true; break; } }
    if (!any) continue;
    r.forEach(([lo, la], i) => { const [x, y] = R.P(lo, la); i ? g.lineTo(x, y) : g.moveTo(x, y); });
    g.closePath();
  }
}
function line(g, R, pts) { g.beginPath(); pts.forEach(([lo, la], i) => { const [x, y] = R.P(lo, la); i ? g.lineTo(x, y) : g.moveTo(x, y); }); }
function drawMap(g, R, o) {
  g.fillStyle = C.sea; g.fillRect(-2000, -2000, W + 4000, H + 4000);
  g.save(); g.lineJoin = 'round';
  for (let i = 6; i >= 1; i--) { landPath(g, R); g.lineWidth = i * 9; g.strokeStyle = i % 2 ? '#97BEC6' : '#AACED4'; g.stroke(); }
  g.restore();
  g.save(); g.strokeStyle = 'rgba(40,70,90,.22)'; g.lineWidth = 1; g.setLineDash([2, 5]);
  for (let lon = -20; lon <= 110; lon += 5) { const [x0, y0] = R.P(lon, 60), [x1, y1] = R.P(lon, -5); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
  for (let lat = 0; lat <= 60; lat += 5) { const [x0, y0] = R.P(-20, lat), [x1, y1] = R.P(110, lat); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
  g.restore();
  landPath(g, R); g.fillStyle = C.land; g.fill('evenodd');
  g.save(); landPath(g, R); g.clip('evenodd'); landPath(g, R); g.lineWidth = 26; g.strokeStyle = 'rgba(255,248,230,.28)'; g.stroke(); g.restore();
  g.save(); g.lineJoin = 'round'; landPath(g, R); g.lineWidth = 2.2; g.strokeStyle = 'rgba(40,55,70,.72)'; g.stroke(); g.restore();
  // rivers: printed blue ink
  g.save(); g.lineJoin = 'round'; g.lineCap = 'round'; g.strokeStyle = '#5F93A6';
  for (const rv of o.rivers || []) { line(g, R, rv); g.lineWidth = 4; g.stroke(); }
  g.restore();
  // engraved names: small caps, ink only
  g.textBaseline = 'middle'; g.textAlign = 'left';
  for (const [t, lon, lat, size, sp, rot, it] of o.labels || []) {
    const [x, y] = R.P(lon, lat); g.save(); g.translate(x, y); g.rotate((rot || 0) * D2R);
    if (it) { g.font = `italic ${size}px FellIt`; g.fillStyle = 'rgba(30,60,75,.62)'; } else { g.font = `${size}px FellSC`; g.fillStyle = 'rgba(43,34,25,.86)'; }
    spaced(g, t, 0, 0, sp); g.restore();
  }
  for (const [t, lon, lat, dx, dy] of o.towns || []) {
    const [x, y] = R.P(lon, lat); g.fillStyle = C.ink; g.beginPath(); g.arc(x, y, 6, 0, Math.PI * 2); g.fill();
    g.strokeStyle = C.ink; g.lineWidth = 1.5; g.beginPath(); g.arc(x, y, 10, 0, Math.PI * 2); g.stroke();
    g.font = '26px FellSC'; g.fillStyle = 'rgba(43,34,25,.9)'; g.textAlign = dx < 0 ? 'right' : 'left'; spacedLeft(g, t, x + dx - (dx < 0 ? g.measureText(t).width + t.length * 2 : 0), y + dy, 2); g.textAlign = 'left';
  }
  if (o.deco === false) return;
  // compass rose and a kilometre scale bar (right side, clear of the caption band)
  { const cx = 975, cy = 250; g.save(); g.translate(cx, cy); g.strokeStyle = C.ink; g.fillStyle = C.ink; g.lineWidth = 1.5;
    g.beginPath(); g.arc(0, 0, 34, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(0, 0, 29, 0, Math.PI * 2); g.lineWidth = .8; g.stroke(); g.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) { g.rotate(Math.PI / 2); g.beginPath(); g.moveTo(0, -48); g.lineTo(7, 0); g.lineTo(-7, 0); g.closePath(); i === 3 ? g.fill() : g.stroke(); }
    g.font = '22px FellSC'; g.textAlign = 'center'; g.fillText('u', 0, -62); g.restore(); }
  { const km = R.KS / 111.2, unit = o.km || 200, L = unit * km, x0 = 960 - 2 * L - 60, y0 = 360; g.save(); g.fillStyle = C.ink; g.strokeStyle = C.ink; g.lineWidth = 1.2;
    for (let i = 0; i < 4; i++) { const xa = x0 + i * L / 2; i % 2 ? g.strokeRect(xa, y0, L / 2, 7) : g.fillRect(xa, y0, L / 2, 7); }
    g.font = '17px OldStd'; g.textAlign = 'center'; g.textBaseline = 'bottom';
    [0, unit, unit * 2].forEach((k, i) => g.fillText(String(k), x0 + i * L, y0 - 5)); g.font = '18px Fell'; g.textAlign = 'left'; g.fillText('km', x0 + 2 * L + 14, y0 - 5); g.restore(); }
}
function bakeMap(R, o) {
  const c = canvas(W * MS, H * MS), g = c.getContext('2d');
  g.scale(MS, MS); drawMap(g, R, o);
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = 'overlay'; g.globalAlpha = 0.55; g.drawImage(paperTex, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  return c;
}

// ---------------------------------------------------------------- paper cards and patches (baked at PR, centred on (0,0))
function blobPath(rx, ry, seed, n = 30) {
  const r = rng(seed), p = new Path2D(), k = [];
  for (let i = 0; i < n; i++) k.push(0.9 + r() * 0.16);
  for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, f = (k[i % n] + k[(i + 1) % n] + k[(i + n - 1) % n]) / 3; const x = Math.cos(a) * rx * f, y = Math.sin(a) * ry * f; i ? p.lineTo(x, y) : p.moveTo(x, y); }
  p.closePath(); return p;
}
function rectPath(w, h) { const p = new Path2D(); p.rect(-w / 2, -h / 2, w, h); return p; }
function circlePath(r) { const p = new Path2D(); p.arc(0, 0, r, 0, Math.PI * 2); return p; }
// card: {path, bw, bh (bounds), col, seed, print(g), dashed, rim}
function bakeCard(o) {
  const m = 24, w = (o.bw + m * 2) * PR, h = (o.bh + m * 2) * PR;
  const c = canvas(w, h), g = c.getContext('2d');
  const toL = () => g.setTransform(PR, 0, 0, PR, w / 2, h / 2);
  toL(); g.save();
  g.shadowColor = 'rgba(40,28,15,.35)'; g.shadowBlur = 2 * PR; g.lineJoin = 'round';
  g.lineWidth = o.rim ?? 12; g.strokeStyle = C.paper; g.stroke(o.path); g.shadowColor = 'transparent';
  g.fillStyle = o.col; g.fill(o.path); g.restore();
  // paper texture on the fill only
  { const tex = makePaper(Math.ceil(w), Math.ceil(h), o.seed), t2 = canvas(w, h), q = t2.getContext('2d');
    q.setTransform(PR, 0, 0, PR, w / 2, h / 2); q.fillStyle = '#000'; q.fill(o.path); q.setTransform(1, 0, 0, 1, 0, 0);
    q.globalCompositeOperation = 'source-in'; q.drawImage(tex, 0, 0);
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'overlay'; g.globalAlpha = .55; g.drawImage(t2, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; }
  toL();
  // the plate inks thin at the edge: a lighter rim inside the shape
  g.save(); g.clip(o.path); g.lineWidth = Math.min(o.bw, o.bh) * 0.16; g.strokeStyle = 'rgba(255,248,230,.20)'; g.stroke(o.path); g.restore();
  if (o.dashed !== false) { g.save(); g.scale(o.inset || 0.9, o.inset || 0.9); g.setLineDash([7, 6]); g.lineWidth = 3; g.strokeStyle = 'rgba(43,34,25,.45)'; g.stroke(o.path); g.restore(); }
  if (o.print) { g.save(); o.print(g); g.restore(); }
  return { cv: c, w: w / PR, h: h / PR };
}
// draw a card centred at c, rotation rot (deg), lift h (0 glued: thin shadow; 1 held up: big soft shadow), scale k
function drawCard(g, P, o = {}) {
  const c = o.c, h = o.h || 0, k = (o.k || 1) * (1 + 0.08 * h);
  g.save();
  g.shadowColor = `rgba(30,20,10,${(o.shadowA ?? 0.5) - 0.18 * h})`; g.shadowBlur = 3 + 30 * h; g.shadowOffsetX = 3 + 30 * h; g.shadowOffsetY = 4 + 42 * h;
  g.translate(c[0], c[1]); g.rotate((o.rot || 0) * D2R); g.scale(k, k);
  if (o.fold) {   // a peeled corner: the flap beyond the line x+y = d (card-local, top-right) turned back by fold (0..1)
    const d = o.fold.d, s = o.fold.s;
    // keep the side where x - y < d (below-left of the diagonal x - y = d)
    g.save(); g.beginPath(); g.moveTo(-4000, -4000 - d); g.lineTo(4000, 4000 - d); g.lineTo(-4000, 4000 - d); g.closePath(); g.clip();
    g.drawImage(P.cv, -P.w / 2, -P.h / 2, P.w, P.h); g.restore();
    // the flap's back: mirrored over the fold line, cream paper
    g.save(); g.shadowColor = 'rgba(30,20,10,.35)'; g.shadowBlur = 10 * s + 2; g.shadowOffsetX = 5; g.shadowOffsetY = 8 * s + 2;
    // reflection across the line y = x - d, scaled toward the line by (1 - 2s) for a partial turn
    const f = 1 - 2 * s;   // 1 flat, -1 fully turned back
    // transform: move to line frame (u along the line, v across it)
    const a = Math.PI / 4; g.translate(d / 2, -d / 2); g.rotate(a); g.scale(1, f); g.rotate(-a); g.translate(-d / 2, d / 2);
    g.beginPath(); g.moveTo(-4000, -4000 - d); g.lineTo(4000, 4000 - d); g.lineTo(4000, -4000 - d); g.closePath(); g.clip();
    if (f < 0) { g.fillStyle = '#E6DCC4'; g.fillRect(-P.w / 2, -P.h / 2, P.w, P.h); g.strokeStyle = 'rgba(43,34,25,.35)'; g.lineWidth = 2; g.strokeRect(-P.w / 2 + 8, -P.h / 2 + 8, P.w - 16, P.h - 16); }
    else g.drawImage(P.cv, -P.w / 2, -P.h / 2, P.w, P.h);
    g.restore();
  } else g.drawImage(P.cv, -P.w / 2, -P.h / 2, P.w, P.h);
  g.restore();
}

// ---------------------------------------------------------------- printed signs on the patches

function ik(S, Tg, L1, L2, bend) {
  const d = clamp(len(S, Tg), Math.abs(L1 - L2) + 1, L1 + L2 - 0.5), a = angOf(S, Tg);
  const th = a + bend * Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  const E = [S[0] + L1 * Math.cos(th), S[1] + L1 * Math.sin(th)], Hh = [S[0] + d * Math.cos(a), S[1] + d * Math.sin(a)];
  return { E, H: Hh, ua: th, fa: angOf(E, Hh) };
}
function layerShadow(g, on) {
  if (on) { g.shadowColor = 'rgba(35,22,8,0.40)'; g.shadowBlur = 6; g.shadowOffsetX = 3; g.shadowOffsetY = 4; }
  else { g.shadowColor = 'transparent'; g.shadowBlur = 0; g.shadowOffsetX = 0; g.shadowOffsetY = 0; }
}
// pose: { at:[x,y] neck, rot, head, headRot, pop, hat:[dx,dy,rot], leg:{L,R} (deg), hand:{L,R} targets, bend:{L,R}, s, prop:{side,name,rot} }
function drawPuppet(g, key, pose) {
  const R = RIG[key], s = pose.s || R.s, tr = pose.rot * D2R, at = pose.at;
  const Tf = q => follow(R.neck, q, at, tr, s);
  for (const side of ['L', 'R']) { const Lg = R.leg[side], hp = Tf(R.hip[side]); put(g, key, Lg.id, Lg.p, hp, pose.leg[side] * D2R - angOf(Lg.p, Lg.f), s); }
  const arms = {};
  for (const side of ['L', 'R']) {
    const U = R.uarm[side], S = Tf(R.sh[side]), F = R.farmLR[side];
    arms[side] = { U, F, S, sol: ik(S, pose.hand[side], len(U.p, U.e) * s, len(F.p, F.h) * s, pose.bend[side]) };
  }
  const drawUpper = side => { const a = arms[side]; put(g, key, a.U.id, a.U.p, a.S, a.sol.ua - angOf(a.U.p, a.U.e), s); };
  const drawFore = side => { const a = arms[side]; put(g, key, a.F.id, a.F.p, a.sol.E, a.sol.fa - angOf(a.F.p, a.F.h), s); };
  for (const side of ['L', 'R']) drawUpper(side);
  put(g, key, R.torso, R.neck, at, tr, s);
  const hd = R.heads[pose.head], hid = hd[0], hx = hd[1], hy = hd[2], hr = (pose.rot + pose.headRot) * D2R, hs = s * pose.pop;
  const ha = [at[0] + R.headOff[0] * s, at[1] + R.headOff[1] * s];
  put(g, key, hid, [hx, hy], ha, hr, hs);
  const top = follow([hx, hy], [hx, R.headTop], ha, hr, hs);
  if (!pose.noHat) put(g, key, R.hat.id, R.hat.p, [top[0] + pose.hat[0], top[1] + pose.hat[1]], hr + (R.hat.rot + pose.hat[2]) * D2R, s * R.hat.k * pose.pop);
  // a held prop sits under the fingers: drawn before the forearm of the hand that holds it
  if (pose.prop) { const pr = R.props[pose.prop.name], H = arms[pose.prop.side].sol.H; put(g, key, pr.id, pr.p, [H[0] + (pose.prop.dx || 0), H[1] + (pose.prop.dy || 0)], (pose.prop.rot || 0) * D2R, s * (pose.prop.k || 1)); }
  for (const side of ['L', 'R']) drawFore(side);
  return { hand: { L: arms.L.sol.H, R: arms.R.sol.H }, head: ha, top };
}
function drawLayer(dst, cam, fn) {   // a puppet is assembled on its own layer, then dropped onto the scene with one big shadow
  const g = LAYER.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
  applyCam(g, cam); layerShadow(g, true);
  const r = fn(g);
  dst.save(); dst.setTransform(1, 0, 0, 1, 0, 0);
  dst.shadowColor = 'rgba(30,18,6,.42)'; dst.shadowBlur = 18 * cam.z; dst.shadowOffsetX = 13 * cam.z; dst.shadowOffsetY = 17 * cam.z;
  dst.drawImage(LAYER, 0, 0); dst.restore();
  return r;
}
// a standing pose, with the hands hanging relaxed unless given
function stand(key, x, y, o = {}) {
  const k = (o.s || RIG[key].s) / 0.72;
  return { at: [x, y], rot: o.rot || 0, head: o.head || 'n', headRot: o.headRot || 0, pop: o.pop || 1, hat: o.hat || [0, 0, 0],
    leg: { L: o.legL ?? 97, R: o.legR ?? 83 }, hand: { L: o.hL || [x - 92 * k, y + 160 * k], R: o.hR || [x + 92 * k, y + 160 * k] },
    bend: { L: o.bL ?? 1, R: o.bR ?? -1 }, s: o.s, prop: o.prop, noHat: o.noHat };
}
// scene camera (inside a panel)
function applyCam(g, cam) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.translate(W / 2 + cam.sx, H / 2 + cam.sy); g.rotate(cam.sr * D2R); g.scale(cam.z, cam.z); g.translate(-cam.f[0], -cam.f[1]);
}
function shake(t, t0, amp, f = 15, d = 11) {
  if (t < t0) return [0, 0, 0];
  const u = t - t0, e = Math.exp(-u * d);
  return [-amp * .45 * e * Math.sin(2 * Math.PI * (f - 4) * u + 1), amp * e * Math.sin(2 * Math.PI * f * u), amp * .022 * e * Math.sin(2 * Math.PI * 9 * u)];
}
function camOf(t, zk, fk, shakes) {
  const z = K(t, zk), f = K(t, fk).slice(); let sx = 0, sy = 0, sr = 0;
  if (z >= 1) { f[0] = clamp(f[0], W / 2 / z, W - W / 2 / z); f[1] = clamp(f[1], H / 2 / z, H - H / 2 / z); }   // never show past the panel's edge
  for (const [t0, a] of shakes) { const s = shake(t, t0, a); sx += s[0]; sy += s[1]; sr += s[2]; }
  return { z, f, sx, sy, sr };
}

// ---------------------------------------------------------------- props drawn in code

function cardStroke(g, path, fill, w = 7) { g.lineJoin = 'round'; g.lineWidth = w; g.strokeStyle = C.paper; g.stroke(path); g.fillStyle = fill; g.fill(path); }
function brass(g, x, y, r) {
  const gr = g.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r);
  gr.addColorStop(0, '#FFF1BF'); gr.addColorStop(.35, C.brass); gr.addColorStop(1, '#7A5A1E');
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  g.strokeStyle = 'rgba(60,40,10,.55)'; g.lineWidth = 1; g.stroke();
}
function scissors(g, x, y, ang, open) {
  g.save(); g.translate(x, y); g.rotate(ang);
  for (const sgn of [-1, 1]) {
    g.save(); g.rotate(sgn * open / 2);
    g.shadowColor = 'rgba(30,20,10,.45)'; g.shadowBlur = 10; g.shadowOffsetX = 8; g.shadowOffsetY = 12;
    const blade = new Path2D(); blade.moveTo(-8, -9 * sgn); blade.quadraticCurveTo(70, -10 * sgn, 132, 0); blade.quadraticCurveTo(70, 4 * sgn, -8, 7 * sgn); blade.closePath();
    cardStroke(g, blade, '#B8C0C7');
    g.shadowColor = 'transparent';
    g.strokeStyle = 'rgba(70,80,90,.55)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(4, 0); g.quadraticCurveTo(70, -3 * sgn, 126, 0); g.stroke();
    const ring = new Path2D(); ring.ellipse(-46, 22 * sgn, 30, 20, -0.35 * sgn, 0, Math.PI * 2); ring.moveTo(-28, 22 * sgn); ring.ellipse(-46, 22 * sgn, 17, 10, -0.35 * sgn, 0, Math.PI * 2, true);
    const arm = new Path2D(); arm.moveTo(-8, -8 * sgn); arm.lineTo(-30, 10 * sgn); arm.lineTo(-22, 18 * sgn); arm.lineTo(2, 4 * sgn); arm.closePath();
    g.shadowColor = 'rgba(30,20,10,.45)'; g.shadowBlur = 10; g.shadowOffsetX = 8; g.shadowOffsetY = 12;
    cardStroke(g, arm, C.red); cardStroke(g, ring, C.red);
    g.restore();
  }
  brass(g, 0, 0, 8);
  g.restore();
}
function ticks(g, t, t0, c, sc = 1) {   // ink strokes around a slap, three drawings on twos
  const u = (twos(t) - t0) / 0.25; if (u < 0 || u > 1) return;
  const r = rng(5);
  g.save(); g.strokeStyle = C.ink; g.lineCap = 'round'; g.lineWidth = 6;
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI * 0.95 + i / 8 * Math.PI * 1.9 + (r() - .5) * .2, l = 34 * (1 - u * .5), ex = 150 * sc * (1 + u * .35), ey = 185 * sc * (1 + u * .35);
    g.beginPath(); g.moveTo(c[0] + Math.cos(a) * ex, c[1] + Math.sin(a) * ey); g.lineTo(c[0] + Math.cos(a) * (ex + l), c[1] + Math.sin(a) * (ey + l)); g.stroke();
  }
  g.restore();
}
function flecks(g, t, t0, c, cols, n = 14, sc = 1) {
  const tt = t - t0; if (tt < 0 || tt > 0.75) return;
  const r = rng(19 + Math.round(t0 * 10));
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, v = (260 + r() * 320) * sc, spin = (r() - .5) * 18, sz = (7 + r() * 9) * sc, col = cols[Math.floor(r() * cols.length)];
    const x = c[0] + Math.cos(a) * (95 * sc + v * tt), y = c[1] + Math.sin(a) * (130 * sc + v * tt) + 700 * tt * tt;
    const k = 1 - clamp((tt - 0.5) / 0.25, 0, 1);
    g.save(); g.translate(x, y); g.rotate(spin * tt); g.scale(k, k);
    g.fillStyle = col; g.shadowColor = 'rgba(30,20,10,.35)'; g.shadowBlur = 3; g.shadowOffsetX = 2; g.shadowOffsetY = 3;
    g.beginPath(); g.moveTo(-sz, -sz * .4); g.lineTo(sz * .8, -sz * .6); g.lineTo(sz * .2, sz * .7); g.closePath(); g.fill(); g.restore();
  }
}
function smear(g, from, to) {   // ink motion arcs for the one in-between drawing of a strike
  g.save(); g.strokeStyle = C.ink; g.lineCap = 'round'; g.lineWidth = 5;
  const a = angOf(from, to), nx = -Math.sin(a), ny = Math.cos(a);
  for (let i = -2; i <= 2; i++) { const o = i * 36; g.beginPath(); g.moveTo(from[0] + nx * o, from[1] + ny * o); g.quadraticCurveTo((from[0] + to[0]) / 2 + nx * (o + 40), (from[1] + to[1]) / 2 + ny * (o + 40), to[0] + nx * o * .5 - Math.cos(a) * 120, to[1] + ny * o * .5 - Math.sin(a) * 120); g.stroke(); }
  g.restore();
}
let TXT = [];
function noteText(g, id, text, x0, y0, x1, y1) {
  const m = g.getTransform(), pts = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
  TXT.push({ id, text, x0: Math.min(...pts.map(p => p[0])), y0: Math.min(...pts.map(p => p[1])), x1: Math.max(...pts.map(p => p[0])), y1: Math.max(...pts.map(p => p[1])), cv: g.canvas });
}
// speech balloons: one short line in Lilita; spiky = a shout
function bubble(g, id, text, x, y, tail, k, spiky) {
  if (k <= 0.001) return;
  g.save();
  g.font = '64px Lilita'; const tw = measureMixed(g, text, '64px Lilita');
  const w = tw + 84, h = 108;
  g.translate(x, y); g.rotate(-1.5 * D2R); g.scale(k, k);
  const b = new Path2D(), tx = (tail[0] - x) / k, ty = (tail[1] - y) / k;
  if (spiky) {
    const n = 18, r = rng(3);
    for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, rr = (i % 2 ? 1.0 : 1.18) + (r() - .5) * .04; const px = Math.cos(a) * w * .56 * rr, py = Math.sin(a) * h * .64 * rr; i ? b.lineTo(px, py) : b.moveTo(px, py); }
    b.closePath();
    const base = Math.atan2(ty, tx), bx = Math.cos(base) * w * .45, by = Math.sin(base) * h * .5;
    const wd = new Path2D(); wd.moveTo(bx - 18 * Math.sin(base), by + 18 * Math.cos(base)); wd.lineTo(tx, ty); wd.lineTo(bx + 18 * Math.sin(base), by - 18 * Math.cos(base)); wd.closePath(); b.addPath(wd);
  } else {
    const rr = 50, side = tx > 0 ? 1 : -1, tx0 = side > 0 ? w / 2 - 130 : -w / 2 + 60, tx1 = tx0 + 70;
    b.moveTo(-w / 2 + rr, -h / 2); b.lineTo(w / 2 - rr, -h / 2); b.quadraticCurveTo(w / 2, -h / 2, w / 2, 0); b.quadraticCurveTo(w / 2, h / 2, w / 2 - rr, h / 2);
    b.lineTo(tx1, h / 2); b.lineTo(tx, ty); b.lineTo(tx0, h / 2);
    b.lineTo(-w / 2 + rr, h / 2); b.quadraticCurveTo(-w / 2, h / 2, -w / 2, 0); b.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + rr, -h / 2); b.closePath();
  }
  g.shadowColor = 'rgba(30,20,10,.38)'; g.shadowBlur = 12; g.shadowOffsetX = 6; g.shadowOffsetY = 9;
  g.fillStyle = '#FBF6EA'; g.fill(b); g.shadowColor = 'transparent';
  g.lineWidth = 4; g.strokeStyle = C.ink; g.lineJoin = 'round'; g.stroke(b);
  g.fillStyle = C.ink; g.textBaseline = 'middle';
  fillMixed(g, text, 0, 3, '64px Lilita', 'center');
  noteText(g, id, text, -w / 2, -h / 2, w / 2, h / 2);
  g.restore();
}
function puff(g, x, y, k) {
  if (k <= 0.001) return;
  g.save(); g.translate(x, y); g.scale(k, k);
  const b = new Path2D(); [[-18, 4, 16], [0, -8, 20], [20, 2, 15], [4, 10, 15]].forEach(([cx, cy, r]) => { b.moveTo(cx + r, cy); b.arc(cx, cy, r, 0, Math.PI * 2); });
  g.shadowColor = 'rgba(30,20,10,.35)'; g.shadowBlur = 6; g.shadowOffsetX = 3; g.shadowOffsetY = 5;
  g.fillStyle = '#FBF6EA'; g.fill(b); g.restore();
}
// the year tag: a printed slip pasted at the panel's top left. Big year, one line under it; extra facts on slips below.
function yearTag(g, t, t0, x, y, year, line, id, strips = []) {
  const u = clamp((t - t0) / 0.22, 0, 1); if (u <= 0) return;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  g.font = '62px OldStdB'; const yw = measureMixed(g, year, '62px OldStdB');
  g.font = '26px FellIt'; const lw = measureMixed(g, line, 'italic 26px FellIt'), w = Math.max(250, lw + 56, yw + 58);
  g.translate(x, lerp(y - 220, y, EASE.back(u))); g.rotate(lerp(-9, -1.4, EASE.o(u)) * D2R);
  g.shadowColor = 'rgba(30,20,10,.32)'; g.shadowBlur = 8; g.shadowOffsetX = 3; g.shadowOffsetY = 5;
  g.fillStyle = '#F3EAD6'; g.fillRect(0, 0, w, 136); g.shadowColor = 'transparent';
  g.strokeStyle = C.ink; g.lineWidth = 2; g.strokeRect(9, 9, w - 18, 118); g.lineWidth = 1; g.strokeRect(14, 14, w - 28, 108);
  g.fillStyle = C.ink; g.textBaseline = 'alphabetic'; g.textAlign = 'left';
  // the year: bold lining figures (letters such as "SM" in the same bold, a size down)
  { let cx = 28; for (const [tx, n] of textRuns(year)) { g.font = n ? '62px OldStdB' : '44px OldStdB'; g.fillText(tx, cx, 80); cx += g.measureText(tx).width; } }
  noteText(g, id, year, 28, 30, 28 + yw, 82);
  g.strokeStyle = 'rgba(43,34,25,.55)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(30, 90); g.lineTo(28 + yw, 90); g.stroke();
  g.fillStyle = '#5A4A3A'; fillMixed(g, line, 30, 114, 'italic 26px FellIt'); noteText(g, id + '-l', line, 30, 92, 30 + lw, 120);
  g.restore();
  strips.forEach(([ts, text], i) => {
    const v = clamp((t - ts) / 0.25, 0, 1); if (v <= 0) return;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    const sw = measureMixed(g, text, 'italic 30px FellIt') + 44;
    g.translate(lerp(x - 520, x + 22, EASE.back(v)), y + 148 + i * 64); g.rotate(lerp(-4, 0.8 - i * 1.2, EASE.o(v)) * D2R);
    g.shadowColor = 'rgba(30,20,10,.32)'; g.shadowBlur = 7; g.shadowOffsetX = 3; g.shadowOffsetY = 4;
    g.fillStyle = '#F3EAD6'; g.fillRect(0, 0, sw, 54); g.shadowColor = 'transparent';
    g.fillStyle = C.ink; g.textBaseline = 'middle'; fillMixed(g, text, 22, 28, 'italic 30px FellIt');
    noteText(g, id + '-s' + i, text, 22, 10, sw - 22, 46);
    g.fillStyle = 'rgba(222,205,165,.96)';
    [[-14, 4, -12], [sw - 20, 0, 10]].forEach(([tx, ty, ta]) => { g.save(); g.translate(tx + 17, ty + 10); g.rotate(ta * D2R); g.fillRect(-20, -11, 40, 22); g.restore(); });
    g.restore();
  });
}
function vignette(g, a = .22) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  const v = g.createRadialGradient(W * .5, H * .46, H * .38, W * .5, H * .5, H * 1.05);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(40,25,10,${a})`);
  g.fillStyle = v; g.fillRect(0, 0, W, H);
}
// a map pin: brass head, a paper flag with the place name
function pin(g, id, x, y, name, t, t0) {
  const u = t - t0; if (u < 0) return;
  const drop = u < 0.25 ? EASE.i(u / 0.25) : 1, yy = y - (1 - drop) * 380, k = u < 0.25 ? 1 : 1 + wob(u, 0.25, 0.06, 5, 9);
  g.save(); g.translate(x, yy); g.scale(k, k);
  g.shadowColor = 'rgba(30,20,10,.4)'; g.shadowBlur = 4 + (1 - drop) * 20; g.shadowOffsetX = 3 + (1 - drop) * 20; g.shadowOffsetY = 4 + (1 - drop) * 30;
  g.strokeStyle = '#6E6658'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -64); g.stroke(); g.shadowColor = 'transparent';
  g.font = '30px FellSC'; const w = g.measureText(name).width + name.length * 3 + 36;
  g.shadowColor = 'rgba(30,20,10,.35)'; g.shadowBlur = 6; g.shadowOffsetX = 3; g.shadowOffsetY = 5;
  g.fillStyle = '#F7F0DE'; g.beginPath(); g.moveTo(2, -96); g.lineTo(w, -96); g.lineTo(w - 14, -78); g.lineTo(w, -60); g.lineTo(2, -60); g.closePath(); g.fill(); g.shadowColor = 'transparent';
  g.strokeStyle = C.ink; g.lineWidth = 2; g.stroke();
  g.fillStyle = C.ink; g.textBaseline = 'middle'; spacedLeft(g, name, 14, -78, 3); noteText(g, id, name, 14, -94, w - 16, -62);
  brass(g, 0, -64, 11);
  g.restore();
}
// a slip of printed paper with text, slapped down (lift h → 0)
function slip(g, id, text, x, y, rot, t, t0, o = {}) {
  const u = t - t0; if (u < 0) return;
  const d = o.d || 0.22, a = clamp(u / d, 0, 1), h = 1 - EASE.i(a);
  const font = o.font || 'italic 34px FellIt';
  g.save(); g.font = font; const tw = measureMixed(g, text, font), w = tw + (o.pad || 48), hh = o.h || 64;
  g.translate(x + (o.dx || 0) * h, y - (o.dy ?? 160) * h); g.rotate((rot + (o.rr || -10) * h) * D2R); const k = 1 + 0.12 * h + (a >= 1 ? wob(u, d, 0.05, 6, 10) : 0); g.scale(k, k);
  g.shadowColor = `rgba(30,20,10,${0.4 - 0.15 * h})`; g.shadowBlur = 5 + 26 * h; g.shadowOffsetX = 3 + 26 * h; g.shadowOffsetY = 4 + 36 * h;
  g.fillStyle = o.bg || '#F3EAD6'; g.fillRect(-w / 2, -hh / 2, w, hh); g.shadowColor = 'transparent';
  g.strokeStyle = C.ink; g.lineWidth = 2; g.strokeRect(-w / 2 + 7, -hh / 2 + 7, w - 14, hh - 14);
  g.fillStyle = o.color || C.ink; g.textBaseline = 'middle'; fillMixed(g, text, 0, 3, font, 'center');
  noteText(g, id, text, -tw / 2, -hh / 2 + 8, tw / 2, hh / 2 - 8);
  g.restore();
}

