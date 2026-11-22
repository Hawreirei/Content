import { createRequire } from 'node:module'; const { chromium } = createRequire(import.meta.url)('playwright');
import path from 'node:path'; import { serve } from './serve.mjs';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const srv = await serve(ROOT); const port = srv.address().port;
const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
pg.on('pageerror', e => console.error(String(e)));
for (const v of ['a', 'b']) {
  await pg.goto(`http://127.0.0.1:${port}/profile.html?v=${v}`); await pg.waitForFunction('window.READY === true');
  await pg.screenshot({ path: path.join(ROOT, `profil-dimas-${v}.png`), clip: { x: 0, y: 420, width: 1080, height: 1080 } });
}
await br.close(); srv.close(); console.log('ok');
