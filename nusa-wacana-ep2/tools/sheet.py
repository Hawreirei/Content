# python3 tools/sheet.py out.jpg t1 t2 ...  (dari review/t_<t>.jpg) — 4 per baris, label waktu
import sys; from PIL import Image, ImageDraw
out, ts = sys.argv[1], sys.argv[2:]
ims = [Image.open(f'review/t_{t}.jpg').resize((270, 480)) for t in ts]
cols = min(6, len(ims)); rows = (len(ims) + cols - 1) // cols
S = Image.new('RGB', (270 * cols, 500 * rows), (20, 20, 20)); d = ImageDraw.Draw(S)
for i, (im, t) in enumerate(zip(ims, ts)):
    x, y = (i % cols) * 270, (i // cols) * 500; S.paste(im, (x, y)); d.text((x + 6, y + 482), f't={t}', fill=(255, 255, 0))
S.save(out, quality=88)
