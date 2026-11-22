"""Verify where the narration sits in the final mix.

Usage: $LIB/.venv/bin/python tools/check_sync.py FILM_DIR [--off 0.3]
Cross-correlates three 4-second windows of vo/el/full.wav against out/mix.wav. Every window must report the same
offset, equal to VO_OFF (0.300). A drifting offset means a sample-rate mismatch (re-run voice_prep.py).
"""
import sys, numpy as np, soundfile as sf
from scipy.signal import fftconvolve
film = sys.argv[1]; off = float(sys.argv[sys.argv.index('--off') + 1]) if '--off' in sys.argv else 0.3
v, sr = sf.read(f'{film}/vo/el/full.wav', dtype='float32'); m, sr2 = sf.read(f'{film}/out/mix.wav', dtype='float32')
if m.ndim > 1: m = m.mean(1)
assert sr == sr2, f'sample rates differ: voice {sr}, mix {sr2}'
dur = len(v) / sr; ok = True
for t in [dur * .1, dur * .5, dur * .85]:
    a = v[int(t * sr):int((t + 4) * sr)]; lo = int((t + off - 1) * sr); seg = m[max(0, lo):int((t + off + 5) * sr)]
    c = fftconvolve(seg, a[::-1], 'valid'); k = int(np.argmax(np.abs(c)))
    found = (max(0, lo) + k) / sr - t; ok &= abs(found - off) < 0.02
    print(f'voice {t:6.2f} s -> mix {t + found:6.2f} s  (offset {found:+.3f})')
print('OK' if ok else 'MISMATCH: offset is not constant / not VO_OFF')
