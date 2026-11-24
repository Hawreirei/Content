// node tools/render.mjs [--workers 4] [--fps 24] → out/video.mp4 (tanpa suara)
import { createRequire } from 'node:module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'node:fs'; import path from 'node:path'; import { spawnSync } from 'node:child_process'; import { serve } from './serve.mjs';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const NW = +arg('--workers', 4), FPS = +arg('--fps', 24);
const FR = path.join(ROOT, 'out', 'frames'); fs.rmSync(FR, { recursive: true, force: true }); fs.mkdirSync(FR, { recursive: true });
const srv = await serve(ROOT); const port = srv.address().port;
const br = await chromium.launch();
async function worker(w, N) {
  const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.error('pageerror', String(e)));
  await pg.goto(`http://127.0.0.1:${port}/index.html?t=0`); await pg.waitForFunction('window.READY === true', null, { timeout: 60000 });
  for (let i = w; i < N; i += NW) {
    const b64 = await pg.evaluate(t => { window.render(t); return document.getElementById('c').toDataURL('image/jpeg', .93).split(',')[1]; }, i / FPS);
    fs.writeFileSync(path.join(FR, String(i).padStart(5, '0') + '.jpg'), Buffer.from(b64, 'base64'));
    if (w === 0 && i % (NW * 120) === 0) console.log('frame', i, '/', N);
  }
}
const p0 = await br.newPage(); await p0.goto(`http://127.0.0.1:${port}/index.html?t=0`); await p0.waitForFunction('window.READY === true');
const DUR = await p0.evaluate(() => window.DUR); await p0.close();
const N = Math.round(DUR * FPS); const t0 = Date.now();
await Promise.all([...Array(NW)].map((_, w) => worker(w, N)));
await br.close(); srv.close();
console.log('frames', N, 'in', ((Date.now() - t0) / 1000).toFixed(1), 's');
const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(FR, '%05d.jpg'), '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(ROOT, 'out', 'video.mp4')], { stdio: 'inherit' });
process.exit(r.status);
