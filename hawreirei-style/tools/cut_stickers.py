"""Cut a sticker sheet (stickers with a white outline on a flat light background) into PNG sprites.

Usage: python3 tools/cut_stickers.py SHEET.png OUTDIR [--prefix p] [--scale 2] [--min-area 4000] [--tol 26]
Writes OUTDIR/<prefix>01.png ... numbered row by row, left to right, plus OUTDIR/_index.jpg (numbered preview).
Check _index.jpg: a pose cut at the image edge or two poses merged means the sheet needs more spacing.
"""
import argparse, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi

ap = argparse.ArgumentParser()
ap.add_argument('sheet'); ap.add_argument('out')
ap.add_argument('--prefix', default='p'); ap.add_argument('--scale', type=float, default=2)
ap.add_argument('--min-area', type=int, default=4000); ap.add_argument('--tol', type=float, default=26)
a = ap.parse_args()

im = Image.open(a.sheet).convert('RGBA'); A = np.array(im).astype(np.float32)
rgb, alpha = A[..., :3], A[..., 3]
if alpha.min() < 250:                       # sheet already transparent
    fg = alpha > 40
else:                                       # background = median of the border, foreground = anything far from it
    border = np.concatenate([rgb[:8].reshape(-1, 3), rgb[-8:].reshape(-1, 3), rgb[:, :8].reshape(-1, 3), rgb[:, -8:].reshape(-1, 3)])
    bg = np.median(border, 0)
    fg = np.sqrt(((rgb - bg) ** 2).sum(-1)) > a.tol
fg = ndi.binary_closing(fg, iterations=3)
fg = ndi.binary_fill_holes(fg)
fg = ndi.binary_opening(fg, iterations=1)
lab, n = ndi.label(fg)
objs = ndi.find_objects(lab)
items = []
for i, sl in enumerate(objs):
    area = (lab[sl] == i + 1).sum()
    if area < a.min_area: continue
    y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
    items.append(dict(i=i + 1, y0=y0, y1=y1, x0=x0, x1=x1, cy=(y0 + y1) / 2, edge=y0 == 0 or x0 == 0 or y1 == fg.shape[0] or x1 == fg.shape[1]))
# rows: cluster by vertical centre
items.sort(key=lambda o: o['cy']); rows = []
for o in items:
    if rows and abs(o['cy'] - np.mean([r['cy'] for r in rows[-1]])) < 0.35 * (o['y1'] - o['y0']): rows[-1].append(o)
    else: rows.append([o])
order = [o for r in rows for o in sorted(r, key=lambda o: o['x0'])]
os.makedirs(a.out, exist_ok=True)
prev = im.convert('RGB').copy(); d = ImageDraw.Draw(prev)
for k, o in enumerate(order, 1):
    pad = 4; y0, y1, x0, x1 = max(0, o['y0'] - pad), o['y1'] + pad, max(0, o['x0'] - pad), o['x1'] + pad
    crop = A[y0:y1, x0:x1].copy(); m = (lab[y0:y1, x0:x1] == o['i'])
    m = ndi.binary_dilation(m, iterations=1)
    crop[..., 3] = np.minimum(crop[..., 3], m * 255)
    sp = Image.fromarray(crop.astype(np.uint8), 'RGBA')
    if a.scale != 1:
        sp = sp.resize((round(sp.width * a.scale), round(sp.height * a.scale)), Image.LANCZOS)
        r, g, b, al = sp.split(); sh = Image.merge('RGB', (r, g, b)).filter(ImageFilter.UnsharpMask(2, 60, 2))
        sp = Image.merge('RGBA', (*sh.split(), al))
    sp.save(os.path.join(a.out, f"{a.prefix}{k:02}.png"))
    d.rectangle([x0, y0, x1, y1], outline=(220, 40, 40) if o['edge'] else (40, 140, 60), width=3)
    d.text((x0 + 6, y0 + 4), str(k), fill=(220, 40, 40))
prev.save(os.path.join(a.out, '_index.jpg'), quality=85)
print(f"{len(order)} stickers -> {a.out}" + ("; RED boxes touch the image edge (cropped poses)" if any(o['edge'] for o in order) else ''))
