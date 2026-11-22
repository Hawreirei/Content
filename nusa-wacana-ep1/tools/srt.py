# python3 tools/srt.py → subtitles_id.srt (subtitle sudah tertanam di gambar, jadi namanya bukan <film>.srt)
import json
d = json.load(open('out/events.json'))
def ts(x): h, r = divmod(x, 3600); m, s = divmod(r, 60); return f'{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}'
lab = {'BATIN': 'DIMAS (batin)'}
with open('subtitles_id.srt', 'w') as f:
    for i, s in enumerate(sorted(d['subs'], key=lambda s: s['t0']), 1):
        f.write(f"{i}\n{ts(s['t0'])} --> {ts(s['t1'])}\n{lab.get(s['who'], s['who'])}: {s['text']}\n\n")
print('ok')
