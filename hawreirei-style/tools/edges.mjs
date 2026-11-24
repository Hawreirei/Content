// List text boxes that are cut by the left/right/top edge: node core/render/edges.mjs <film> [--step 0.25] [--size 1080x1920] [--margin 0]
import { openDemo, closeServer, requireDemo, takeSize } from './page.mjs';
const args = process.argv.slice(2); const take = k => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : null; };
const { w, h } = takeSize(args), step = +(take('--step') || .25), m = +(take('--margin') || 0); const [dir] = args; requireDemo(dir);
const { browser, page } = await openDemo(dir, { w, h, q: '', warnings: false });
const dur = await page.evaluate(() => window.DUR); const seen = new Map();
for (let t = 0; t <= dur; t += step) {
  const boxes = await page.evaluate(t => { if (window.__MOVING && window.__MOVING(t)) return []; window.render(t); return (window.__ALLTXT ? window.__ALLTXT() : []); }, t);
  for (const b of boxes) { const cut = (b.x0 < m && b.x1 > 0) || (b.x1 > w - m && b.x0 < w) || (b.y0 < 0 && b.y1 > 0); if (!cut) continue;
    const k = b.id; if (!seen.has(k)) seen.set(k, { t0: t, t1: t, text: b.text, x0: b.x0, x1: b.x1 }); else seen.get(k).t1 = t; }
}
for (const [k, v] of seen) console.log(`${k.padEnd(14)} ${v.t0.toFixed(2)}–${v.t1.toFixed(2)}s  x ${Math.round(v.x0)}..${Math.round(v.x1)}  "${v.text}"`);
await browser.close(); closeServer();
