// Printed formulas with drawn radicals and superscripts: R{...} square root, C{...} cube root, ^{...} superscript (nestable).
function mParse(s) {
  const out = []; let i = 0, buf = '';
  const flush = () => { if (buf) { out.push({ t: 'txt', s: buf }); buf = ''; } };
  while (i < s.length) {
    const sup = s[i] === '^' && s[i + 1] === '{', root = (s[i] === 'R' || s[i] === 'C') && s[i + 1] === '{';
    if (sup || root) {
      flush(); let d = 0, j = i + 1;
      for (; j < s.length; j++) { if (s[j] === '{') d++; else if (s[j] === '}' && --d === 0) break; }
      const kids = mParse(s.slice(i + 2, j));
      out.push(sup ? { t: 'sup', kids } : { t: 'root', n: s[i] === 'C' ? 3 : 2, kids }); i = j + 1;
    } else buf += s[i++];
  }
  flush(); return out;
}
const SUPMAP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '−': '⁻', '-': '⁻', '+': '⁺', 'n': 'ⁿ' };
function mPlain(s) { return s.replace(/\^\{([^}]*)\}/g, (m, a) => [...a].map(c => SUPMAP[c] || c).join('')).replace(/R\{/g, '√(').replace(/C\{/g, '∛(').replace(/\}/g, ')'); }
function mWidth(g, nodes, size, fam) {
  let w = 0;
  for (const n of nodes) {
    if (n.t === 'txt') w += measureMixed(g, n.s, `${size}px ${fam}`);
    else if (n.t === 'sup') w += mWidth(g, n.kids, size * .62, fam) + size * .04;
    else w += size * .66 + mWidth(g, n.kids, size, fam) + size * .08;
  }
  return w;
}
function mDraw(g, nodes, x, y, size, fam) {   // y = baseline; returns the end x
  for (const n of nodes) {
    if (n.t === 'txt') { x += fillMixed(g, n.s, x, y, `${size}px ${fam}`, 'left'); continue; }
    if (n.t === 'sup') { x = mDraw(g, n.kids, x + size * .02, y - size * .42, size * .62, fam) + size * .02; continue; }
    const kw = mWidth(g, n.kids, size, fam), top = y - size * .86, s = size;
    g.save(); g.strokeStyle = g.fillStyle; g.lineWidth = Math.max(2, s * .065); g.lineJoin = 'round'; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x + s * .02, y - s * .34); g.lineTo(x + s * .13, y - s * .41); g.lineTo(x + s * .3, y + s * .06); g.lineTo(x + s * .58, top); g.lineTo(x + s * .66 + kw + s * .06, top); g.stroke();
    if (n.n === 3) { g.font = `${Math.round(s * .42)}px ${fam}`; g.fillText('3', x + s * .02, y - s * .48); }
    g.restore();
    mDraw(g, n.kids, x + s * .66, y, size, fam);
    x += s * .66 + kw + s * .08;
  }
  return x;
}
// a formula on a slip of paper, slapped down like slip()
function mathSlip(g, id, expr, x, y, rot, t, t0, o = {}) {
  const u = t - t0; if (u < 0) return;
  const d = o.d || 0.22, a = clamp(u / d, 0, 1), h = 1 - EASE.i(a), size = o.size || 60, fam = o.fam || 'OldStdB', nodes = mParse(expr);
  g.save(); const tw = mWidth(g, nodes, size, fam), cw = o.check ? size * .85 : 0, w = tw + cw + (o.pad || 56), hh = o.h || size * 1.75, x0 = -(tw + cw) / 2;
  g.translate(x + (o.dx || 0) * h, y - (o.dy ?? 160) * h); g.rotate((rot + (o.rr || -10) * h) * D2R);
  const k = (1 + 0.12 * h + (a >= 1 ? wob(u, d, 0.05, 6, 10) : 0)) * (o.k || 1); g.scale(k, k);
  if (o.alpha != null) g.globalAlpha = o.alpha;
  g.shadowColor = `rgba(30,20,10,${0.4 - 0.15 * h})`; g.shadowBlur = 5 + 26 * h; g.shadowOffsetX = 3 + 26 * h; g.shadowOffsetY = 4 + 36 * h;
  g.fillStyle = o.bg || '#F3EAD6'; g.fillRect(-w / 2, -hh / 2, w, hh); g.shadowColor = 'transparent';
  g.strokeStyle = C.ink; g.lineWidth = 2; g.strokeRect(-w / 2 + 7, -hh / 2 + 7, w - 14, hh - 14);
  g.fillStyle = o.color || C.ink; g.textBaseline = 'alphabetic';
  mDraw(g, nodes, x0, size * .36, size, fam);
  if (o.check) { g.strokeStyle = '#3E7A3A'; g.lineWidth = size * .1; g.lineCap = 'round'; g.beginPath(); g.moveTo(w / 2 - 22 - size * .5, 0); g.lineTo(w / 2 - 22 - size * .32, size * .2); g.lineTo(w / 2 - 22, -size * .3); g.stroke(); }
  noteText(g, id, o.plain || mPlain(expr), x0, -hh / 2 + 8, x0 + tw, hh / 2 - 8);
  g.restore();
  return { w, h: hh };
}
