"""Setelah suara direkam: taruh satu file per baris di voices/<id>.wav (id ada di VO_SCRIPT.md), lalu
python3 tools/voice_prep.py  → voices/dur.json (durasi asli) + voices/lips.json (amplop gerak mulut 24 Hz).
Mulut tokoh langsung mengikuti rekaman; audio.py memasukkan suara dan menurunkan musik di bawahnya."""
import glob, json, os
import numpy as np, soundfile as sf
dur, lips = {}, {}
for p in sorted(glob.glob('voices/*.wav')):
    i = os.path.basename(p)[:-4]; x, sr = sf.read(p); x = x.mean(1) if x.ndim > 1 else x
    dur[i] = round(len(x) / sr, 3); hop = sr // 24; o, b = [], []
    for k in range(0, len(x), hop):
        w = x[k:k + hop]
        if len(w) < 16: break
        o.append(float(np.sqrt(np.mean(w ** 2)))); S = np.abs(np.fft.rfft(w)); f = np.fft.rfftfreq(len(w), 1 / sr)
        b.append(float(np.sum(S * f) / (np.sum(S) + 1e-9)))
    o = np.array(o); o = np.clip(o / (np.percentile(o, 95) + 1e-9), 0, 1) ** .7
    b = np.clip((np.array(b) - 500) / 2500, 0, 1)
    lips[i] = {'o': [round(v, 3) for v in o], 'b': [round(v, 3) for v in b]}
json.dump(dur, open('voices/dur.json', 'w'), indent=1); json.dump(lips, open('voices/lips.json', 'w'))
print('ok', len(dur), 'baris'); [print(f'  {k}: {v:.2f} dtk') for k, v in dur.items()]
