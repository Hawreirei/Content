// static server kecil untuk folder film (modul ES butuh http, bukan file://)
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg' };
export function serve(root, port = 0) {
  return new Promise(res => {
    const s = http.createServer((req, rsp) => {
      const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
      if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { rsp.writeHead(404); rsp.end(); return; }
      rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(rsp);
    });
    s.listen(port, '127.0.0.1', () => res(s));
  });
}
