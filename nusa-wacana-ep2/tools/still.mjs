// node tools/still.mjs 1.5 12 30 ...  → review/t_<t>.jpg (+ review/sheet.jpg bila --sheet)
import { createRequire } from 'node:module'; const { chromium } = createRequire(import.meta.url)('playwright'); import fs from 'node:fs'; import path from 'node:path'; import { serve } from './serve.mjs';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ts = process.argv.slice(2).filter(a => !a.startsWith('--'));
fs.mkdirSync(path.join(ROOT, 'review'), { recursive: true });
const srv = await serve(ROOT); const port = srv.address().port;
const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
const errs = []; pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await pg.goto(`http://127.0.0.1:${port}/index.html?t=0`); await pg.waitForFunction('window.READY === true', null, { timeout: 30000 }).catch(() => {});
if (errs.length) { console.error(errs.join('\n')); }
for (const t of ts) { await pg.evaluate(t => window.render(t), parseFloat(t)); await pg.locator('canvas').screenshot({ path: path.join(ROOT, 'review', `t_${t}.jpg`), type: 'jpeg', quality: 85 }); }
if (process.argv.includes('--events')) fs.writeFileSync(path.join(ROOT, 'out', 'events.json'), JSON.stringify(await pg.evaluate(() => ({ dur: window.DUR, ev: window.EV, subs: window.SUBS, lines: window.LINES_OUT })), null, 1));
await br.close(); srv.close(); console.log('ok', ts.length, errs.length ? 'ERRORS' : '');
