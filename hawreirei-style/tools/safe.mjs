// Instagram Reels safe space + legibility check: node core/render/safe.mjs <film> [--step 0.25] [--size 1080x1920]
// Flags, on frames where the camera is still: text outside x 60–1020 / y 220–1560, text right of x 940 below y 1000 (the like/comment column),
// text under the host sticker (window.__HOST()), and two text boxes overlapping each other (more than 8% of the smaller one).
import { openDemo, closeServer, requireDemo, takeSize } from './page.mjs';
const args = process.argv.slice(2); const take = k => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : null; };
const { w, h } = takeSize(args), step = +(take('--step') || .25); const [dir] = args; requireDemo(dir);
const { browser, page } = await openDemo(dir, { w, h, q: '', warnings: false });
const dur = await page.evaluate(() => window.DUR); const seen = new Map();
const note = (k, t, msg) => { if (!seen.has(k)) seen.set(k, { t0: t, t1: t, msg }); else seen.get(k).t1 = t; };
const inter = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
const area = a => Math.max(1, (a.x1 - a.x0) * (a.y1 - a.y0));
for (let t = 0; t <= dur; t += step) {
  const r = await page.evaluate(t => { if (window.__MOVING && window.__MOVING(t)) return null; window.render(t); return { b: window.__ALLTXT(), host: window.__HOST ? window.__HOST() : null }; }, t);
  if (!r) continue;
  const B = r.b.filter(b => b.x1 > 0 && b.x0 < w && b.y1 > 0 && b.y0 < h && b.id !== 'wm');
  for (const b of B) {
    if (b.y0 > 1560 || b.y1 < 220) continue;   // another scene peeking in under the app's own bars: not meant to be read
    const out = b.x0 < 60 || b.x1 > 1020 || b.y0 < 220 || b.y1 > 1560 || (b.y1 > 1000 && b.x1 > 940);
    if (out) note('safe:' + b.id, t, `outside safe space x ${Math.round(b.x0)}..${Math.round(b.x1)} y ${Math.round(b.y0)}..${Math.round(b.y1)} "${b.text}"`);
    if (r.host && inter(b, r.host) > .05 * area(b)) note('host:' + b.id, t, `under the host sticker "${b.text}"`);
  }
  for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) { const a = B[i], c = B[j]; if (a.id === c.id) continue;
    if (inter(a, c) > .08 * Math.min(area(a), area(c))) note('over:' + a.id + '|' + c.id, t, `"${a.text}" overlaps "${c.text}"`); }
}
for (const [k, v] of seen) console.log(`${v.t0.toFixed(2)}–${v.t1.toFixed(2)}s  ${k.split(':')[0].padEnd(5)} ${v.msg}`);
if (!seen.size) console.log('safe space OK');
await browser.close(); closeServer();
