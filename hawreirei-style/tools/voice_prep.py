"""Prepare the creator's own narration for a film.

Usage (from anywhere): $LIB/.venv/bin/python tools/voice_prep.py NARASI.mp3 FILM_DIR
Writes FILM_DIR/vo/el/full.wav (48 kHz mono, the mixer's rate) and FILM_DIR/vo/el/env.json
(voice loudness per video frame at 24 fps, 0..1, used for the host's talking lift).
48 kHz is mandatory: a 44.1 kHz file mixed sample-for-sample plays ~9 % fast and the voice runs ahead of the picture.
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf

src, film = sys.argv[1], sys.argv[2]
d = os.path.join(film, 'vo', 'el'); os.makedirs(d, exist_ok=True)
wav = os.path.join(d, 'full.wav')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-ac', '1', '-ar', '48000', '-c:a', 'pcm_s16le', wav], check=True)
x, sr = sf.read(wav, dtype='float32'); assert sr == 48000, sr
h = sr // 24
r = np.array([np.sqrt((x[i * h:(i + 1) * h] ** 2).mean()) for i in range(len(x) // h)])
env = np.clip(r / np.percentile(r, 95), 0, 1)
json.dump([round(float(v), 3) for v in env], open(os.path.join(d, 'env.json'), 'w'))
print(f"{wav}: {len(x) / sr:.2f} s at {sr} Hz; env.json {len(env)} frames")
