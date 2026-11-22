"""Potong rekaman VO utuh (voices/raw.wav) menjadi satu file per baris (voices/<id>.wav)
berdasarkan rentang mentah di story.js (diekspor ke out/events.json). Jalankan setelah still.mjs --events."""
import json, numpy as np, soundfile as sf
x, sr = sf.read('voices/raw.wav'); x = x.mean(1) if x.ndim > 1 else x
ev = json.load(open('out/events.json'))['ev']
for e in ev:
    if e['type'] != 'vo': continue
    a, b = e['raw']; i0, i1 = int(a * sr), min(len(x), int((b + .08) * sr))
    y = x[i0:i1].copy(); f = int(.005 * sr); y[:f] *= np.linspace(0, 1, f); f2 = int(.04 * sr); y[-f2:] *= np.linspace(1, 0, f2)
    sf.write(f"voices/{e['id']}.wav", y, sr)
print('ok', sum(1 for e in ev if e['type'] == 'vo'), 'baris')
