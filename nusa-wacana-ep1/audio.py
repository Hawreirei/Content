"""audio.py: skor orisinal + foley + ambience, disintesis dengan numpy (tanpa sampel, tanpa ElevenLabs).
Baca out/events.json (dari halaman), tulis out/music.wav, out/fx.wav, out/mix.wav.
Bila voices/<id>.wav ada (rekaman suara nanti), suara dimasukkan di t0 barisnya dan musik diturunkan di bawahnya.
python3 audio.py
"""
import json, os
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 48000
D = json.load(open(os.path.join(HERE, 'out', 'events.json')))
DUR = float(D['dur']); EV = D['ev']; N = int(DUR * SR) + SR
BEAT = 60 / 96
rng = np.random.default_rng(7)

def T(d): return np.arange(int(d * SR)) / SR
def filt(x, kind, f, order=2):
    f = np.atleast_1d(f) / (SR / 2); f = np.clip(f, 1e-4, .999)
    return sosfilt(butter(order, f if len(f) > 1 else f[0], btype=kind, output='sos'), x)
lp = lambda x, f: filt(x, 'low', f); hp = lambda x, f: filt(x, 'high', f); bp = lambda x, a, b: filt(x, 'band', [a, b])
def noise(d): return rng.standard_normal(int(d * SR))
def mtof(m): return 440 * 2 ** ((m - 69) / 12)
def adsr(n, a=.005, d=.1, s=.6, r=.08, sr=SR):
    e = np.ones(n) * s; A, Dd, R = int(a * sr), int(d * sr), int(r * sr)
    A = min(A, n); e[:A] = np.linspace(0, 1, A)
    D2 = min(Dd, max(0, n - A)); e[A:A + D2] = np.linspace(1, s, D2)
    if R > 0 and n > R: e[-R:] *= np.linspace(1, 0, R)
    return e
def add(buf, x, t, g=1.0, pan=0.0):
    i = int(t * SR)
    if i >= len(buf) or len(x) == 0: return
    x = x[:len(buf) - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:i + len(x), 0] += x * g * l * 1.41; buf[i:i + len(x), 1] += x * g * r * 1.41
def norm(x): m = np.max(np.abs(x)) or 1; return x / m

# ———————————————————— instrumen ————————————————————
def saw(f, d):
    tt = T(d); ph = (f * tt) % 1; return 2 * ph - 1
def square(f, d, duty=.5):
    tt = T(d); return np.where((f * tt) % 1 < duty, 1.0, -1.0)
def bass(m, d, v=1):
    f = mtof(m); tt = T(d)
    x = .6 * np.sin(2 * np.pi * f * tt) + .3 * np.sin(4 * np.pi * f * tt) + .15 * np.sin(6 * np.pi * f * tt) + .25 * lp(saw(f, d), 900)
    return x * adsr(len(tt), .004, .15, .55, .05) * v
def sq(m, d, v=1):
    x = lp(square(mtof(m), d, .3), 3200); return x * adsr(len(x), .002, .08, .25, .03) * v * .35
def kick(v=1):
    tt = T(.32); f = 45 + 95 * np.exp(-tt * 28); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)
    return (x + .3 * lp(noise(.32), 2000) * np.exp(-tt * 80)) * v
def snare(v=1):
    tt = T(.25); x = bp(noise(.25), 1200, 6000) * np.exp(-tt * 22) * .8 + np.sin(2 * np.pi * 185 * tt) * np.exp(-tt * 30) * .5
    return x * v
def hat(v=1):
    tt = T(.06); return bp(noise(.06), 6000, 11000) * np.exp(-tt * 70) * v * .5
def cymbal(v=1):
    tt = T(1.6); x = bp(noise(1.6), 3000, 12000) * np.exp(-tt * 2.6)
    fm = np.sin(2 * np.pi * 5400 * tt + 3 * np.sin(2 * np.pi * 7700 * tt)) * np.exp(-tt * 4) * .15
    return (x + fm) * v * .5
def ks(m, d, v=1, damp=.996, bright=1.0):   # Karplus–Strong
    f = mtof(m); n = int(d * SR); L = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, L) * bright; out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % L]; buf[i % L] = damp * .5 * (buf[i % L] + buf[(i + 1) % L])
    return lp(out, 5000) * v
def rhodes(m, d, v=1):
    f = mtof(m); tt = T(d); idx = 2.2 * np.exp(-tt * 3)
    x = np.sin(2 * np.pi * f * tt + idx * np.sin(2 * np.pi * f * tt)) * (1 + .15 * np.sin(2 * np.pi * 4.5 * tt))
    return x * adsr(len(tt), .004, 1.2, .3, .25) * v * .5
def celesta(m, d, v=1):
    f = mtof(m); tt = T(d)
    x = np.sin(2 * np.pi * f * tt) + .4 * np.sin(2 * np.pi * f * 4 * tt) * np.exp(-tt * 9) + .2 * np.sin(2 * np.pi * f * 2.01 * tt)
    return x * np.exp(-tt * 2.5) * v * .45
def tuba(m, d, v=1):
    f = mtof(m); tt = T(d); x = lp(saw(f, d), 700) + .4 * np.sin(2 * np.pi * f * tt)
    return x * adsr(len(tt), .04, .2, .7, .08) * v * .6
def brass(ms, d, v=1):
    x = sum(lp(saw(mtof(m) * (1 + .003 * k), d), 1800) for k, m in enumerate(ms))
    return x * adsr(len(x), .02, .15, .6, .1) * v * .25
def strings(ms, d, v=1, trem=0):
    tt = T(d); x = sum(lp(saw(mtof(m) * (1 + .004 * (k % 3 - 1)), d), 2600) for k, m in enumerate(ms))
    if trem: x *= .55 + .45 * np.abs(np.sin(2 * np.pi * trem / 2 * tt))
    return x * adsr(len(tt), .08, .2, .9, .12) * v * .18
def timpani(m, v=1):
    tt = T(1.2); f = mtof(m); x = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 3) + .5 * lp(noise(1.2), 300) * np.exp(-tt * 12)
    return x * v
def slide(f0, f1, d, v=1):
    tt = T(d); f = f0 * (f1 / f0) ** (tt / d); ph = np.cumsum(f) / SR * 2 * np.pi
    return (np.sin(ph) + .2 * np.sin(2 * ph)) * np.minimum(1, tt / .02) * np.minimum(1, (d - tt) / .05) * v * .4
def theremin(notes, v=1):
    """notes: [(t_rel, midi, dur)] legato; portamento 70 ms, vibrato muncul 150 ms setelah onset; kembali (len, sinyal)"""
    end = max(a + d for a, _, d in notes) + .3; n = int(end * SR); tt = np.arange(n) / SR
    f = np.zeros(n); amp = np.zeros(n); vib = np.zeros(n)
    for k, (a, m, d) in enumerate(notes):
        i0, i1 = int(a * SR), int((a + d) * SR); f[i0:] = mtof(m)
        e = np.ones(i1 - i0); r = min(len(e), int(.06 * SR)); e[-r:] = np.linspace(1, .6, r); amp[i0:i1] = np.maximum(amp[i0:i1], e)
        u = (tt[i0:i1] - a); vib[i0:i1] = np.clip((u - .15) / .2, 0, 1)
    f[f == 0] = mtof(notes[0][1])
    k = int(.07 * SR); f = np.convolve(f, np.ones(k) / k, mode='same')
    amp = np.convolve(amp, np.ones(int(.03 * SR)) / int(.03 * SR), mode='same')
    f = f * (1 + .012 * vib * np.sin(2 * np.pi * 5.8 * tt))
    ph = np.cumsum(f) / SR * 2 * np.pi
    x = np.sin(ph) + .12 * np.sin(2 * ph) + .05 * np.sin(3 * ph)
    return x * amp * v * .5

# ———————————————————— skor (dari daftar cue) ————————————————————
mus = np.zeros((N, 2))
cues = {e['name']: (e['t'], e['d']) for e in EV if e['type'] == 'cue'}
def beats(a, n): return [a + i * BEAT for i in range(n)]
Dm = [50, 53, 57]; Bb = [46, 50, 53]; C = [48, 52, 55]; A = [45, 49, 52]; DM = [50, 54, 57]; G = [43, 47, 50]

# panik (hook): tremolo string menanjak + hat cepat, terpotong di 2,6
a, d = cues['panic']
add(mus, strings([62, 65, 69, 73], d, .9, trem=12) * np.linspace(.4, 1.2, int(d * SR)), a)
for k in range(int(d / (BEAT / 4))): add(mus, hat(.8), a + k * BEAT / 4, 1, .3)
for k in range(4): add(mus, kick(.8), a + k * BEAT)

# tema (tanggul): bass 8-an, arpeggio, theremin
a, d = cues['theme']
prog = [Dm, Dm, Bb, A]
for k in range(int(d / (BEAT / 2))):
    ch = prog[min(3, int(k / 4))]; add(mus, bass(ch[0] - 12, BEAT / 2 * .9, .9), a + k * BEAT / 2)
    add(mus, sq(ch[k % 3] + 24, BEAT / 2 * .8, .9), a + k * BEAT / 2, 1, -.3)
for k in range(7): add(mus, kick(.7), a + k * BEAT); add(mus, hat(.6), a + k * BEAT + BEAT / 2, 1, .3)
for k in (1, 3, 5): add(mus, snare(.55), a + k * BEAT)
THEME = [(0, 74, .5), (.5, 69, .25), (.75, 72, .25), (1.0, 70, .75), (1.75, 69, .25), (2.0, 67, .5), (2.5, 69, .5), (3.0, 65, 1.0), (4.0, 64, .5), (4.5, 65, .25), (4.75, 67, .25), (5.0, 69, 1.5)]
add(mus, theremin([(b * BEAT, m, dd * BEAT) for b, m, dd in THEME], .9), a + .05, 1, -.1)

# tuba muram (banjir): 3 stinger + nada sedih
a, d = cues['tuba']
STING = [e['t'] for e in EV if e['type'] == 'stinger']
for k, (m1, m2) in enumerate([(41, 40), (40, 39), (39, 38)]):
    t0 = STING[k]
    add(mus, tuba(m1, .45, 1), t0); add(mus, tuba(m2, .7, .9), t0 + .45)
    add(mus, slide(900 - k * 100, 300, .5, .6), t0 + .1, 1, .4)
    add(mus, timpani(38, .5), t0)
add(mus, tuba(38, 2.2, .9), STING[2] + 1.25); add(mus, slide(500, 180, 1.4, .5), STING[2] + 1.7, 1, .3)

# surf (asal-usul): gitar KS tremolo + drum
a, d = cues['surf']
riff = [62, 62, 65, 62, 67, 65, 62, 60]
nb = int(d / BEAT)
for k in range(nb * 2):
    m = riff[k % 8] - (5 if (k // 16) % 2 else 0); t0 = a + k * BEAT / 2
    g_ = ks(m, BEAT / 2 + .05, .7, .993); tt = np.arange(len(g_)) / SR; g_ *= .6 + .4 * np.abs(np.sin(2 * np.pi * 7 * tt))
    add(mus, g_, t0, 1, -.25)
    if k % 2 == 0: add(mus, bass(m - 24, BEAT * .9, .8), t0)
for k in range(nb):
    add(mus, kick(.7), a + k * BEAT) if k % 2 == 0 else add(mus, snare(.6), a + k * BEAT)
    add(mus, hat(.5), a + k * BEAT + BEAT / 2, 1, .35)

# cerah (kota): D mayor, arpeggio 16-an, 4-on-the-floor, theremin riang
a, d = cues['bright']
prog = [DM, G, A, DM]
nb = int(d / BEAT)
for k in range(nb * 4):
    ch = prog[(k // 16) % 4]; add(mus, sq(ch[k % 3] + 24 + (12 if k % 8 > 5 else 0), BEAT / 4 * .9, .8), a + k * BEAT / 4, 1, .25)
for k in range(nb):
    ch = prog[(k // 4) % 4]; add(mus, bass(ch[0] - 12, BEAT * .8, .9), a + k * BEAT)
    add(mus, kick(.75), a + k * BEAT); add(mus, hat(.55), a + k * BEAT + BEAT / 2, 1, .3)
    if k % 2: add(mus, snare(.5), a + k * BEAT)
HAPPY = [(0, 74, .5), (.5, 76, .5), (1, 78, 1), (2, 81, .5), (2.5, 78, .5), (3, 76, 1), (4, 74, .5), (4.5, 76, .5), (5, 78, .5), (5.5, 79, .5), (6, 81, 2)]
for rep in range(2): add(mus, theremin([(b * BEAT, m, dd * BEAT) for b, m, dd in HAPPY], .7), a + rep * 8 * BEAT + .05, 1, -.1)

# hentakan judul
a, d = cues['titleHit']
add(mus, brass([50, 57, 62, 65, 69], 1.4, 1.2), a + .1); add(mus, kick(1.1), a + .1); add(mus, cymbal(.9), a + .1, 1, .2); add(mus, timpani(38, .9), a + .1)
add(mus, theremin([(0, 74, 1.0), (1.0, 69, .6), (1.6, 74, 2.2)], .8), a + .12)
add(mus, bass(38, 3.6, .7), a + .1)

# bossa Rhodes (teras): Dmaj7 – Bm7 – Em7 – A7
a, d = cues['rhodes']
chords = [[62, 66, 69, 73], [59, 62, 66, 69], [64, 67, 71, 74], [61, 64, 67, 69]]
roots = [38, 35, 40, 33]
nb = int(d / BEAT)
for bar in range(nb // 4 + 1):
    ci = bar % 4; t0 = a + bar * 4 * BEAT
    for off in (0, 1.5, 2.5):
        if t0 + off * BEAT < a + d: [add(mus, rhodes(m, BEAT * 1.2, .55), t0 + off * BEAT, 1, -.2 + .13 * j) for j, m in enumerate(chords[ci])]
    for off, dm in ((0, 0), (1.5, 7), (2, 12), (3.5, 7)):
        if t0 + off * BEAT < a + d: add(mus, ks(roots[ci] + dm + 12, BEAT, .55, .995, .6), t0 + off * BEAT, 1, .15)
for k in range(nb * 2):
    add(mus, bp(noise(.08), 4000, 9000) * np.exp(-T(.08) * 50) * .18, a + k * BEAT / 2, 1, .45)   # shaker
    if k % 3 == 0: add(mus, hp(noise(.03), 2500) * np.exp(-T(.03) * 120) * .3, a + k * BEAT / 2 + BEAT / 4, 1, -.3)   # rim

# mars Bambang: oom-pah tuba + stab brass + snare + timpani, Bb mayor
a, d = cues['march']
nb = int(d / BEAT)
for k in range(nb):
    root = [34, 41, 39, 41][(k // 4) % 4]
    add(mus, tuba(root if k % 2 == 0 else root + 7, BEAT * .5, .9), a + k * BEAT)
    if k % 2 == 1: add(mus, brass([root + 24, root + 28, root + 31], BEAT * .35, .8), a + k * BEAT)
    add(mus, snare(.35), a + k * BEAT + BEAT / 2, 1, .2)
    if k % 4 == 0: add(mus, timpani(root + 12, .7), a + k * BEAT)
add(mus, slide(300, 700, .4, .4), a + nb * BEAT - .5, 1, .3)

# celesta Sekar: dingin, E minor
a, d = cues['celesta']
arp = [76, 79, 83, 88, 83, 79, 76, 71]
for k in range(int(d / (BEAT / 2))): add(mus, celesta(arp[k % 8], .8, .7), a + k * BEAT / 2, 1, .35)
add(mus, strings([64, 71, 76], d, .5), a)

# tremolo adu mulut
a, d = cues['tremolo']
add(mus, strings([62, 65, 68, 71], d, 1.0, trem=13) * np.linspace(.5, 1.3, int(d * SR)), a)
add(mus, timpani(40, .9), a); add(mus, timpani(42, .9), a + 1.2)

# kuis (meter + pilihan): tema theremin kembali, arpeggio + drum mesin
a, d = cues['quiz']
prog = [Dm, Bb, C, A]
nb = int(d / BEAT)
for k in range(nb * 2):
    ch = prog[(k // 8) % 4]; add(mus, sq(ch[k % 3] + 24, BEAT / 2 * .7, .8), a + k * BEAT / 2, 1, .25)
for k in range(nb):
    ch = prog[(k // 4) % 4]; add(mus, bass(ch[0] - 12, BEAT * .85, .85), a + k * BEAT)
    add(mus, kick(.65), a + k * BEAT); add(mus, hat(.5), a + k * BEAT + BEAT / 2, 1, .3)
    if k % 2: add(mus, snare(.45), a + k * BEAT)
add(mus, theremin([(b * BEAT, m, dd * BEAT) for b, m, dd in THEME], .8), a + 6 * BEAT, 1, -.1)
add(mus, theremin([(b * BEAT, m - 12 + 12, dd * BEAT) for b, m, dd in THEME[:8]] + [(8 * BEAT, 62, 2.5 * BEAT)], .75), a + 14 * BEAT, 1, -.1)

# reverb pegas pendek pada musik
def reverb(x, dur=1.1, mix=.18):
    ir = rng.standard_normal((int(dur * SR), 2)) * np.exp(-np.arange(int(dur * SR)) / SR * 5.5)[:, None]
    ir[:, 0] = lp(ir[:, 0], 6000); ir[:, 1] = lp(ir[:, 1], 6000); ir /= np.sqrt(np.sum(ir ** 2, 0))
    wet = np.stack([fftconvolve(x[:, 0], ir[:, 0])[:len(x)], fftconvolve(x[:, 1], ir[:, 1])[:len(x)]], 1)
    return x + wet * mix
mus = reverb(mus)
# hening sungguhan: potong musik + ekor reverb
def gate(buf, a, b, f=.01):
    i0, i1 = int(a * SR), int(b * SR); F = int(f * SR)
    buf[i0:i1] = 0; buf[max(0, i0 - F):i0] *= np.linspace(1, 0, min(F, i0))[:, None]
SIL = [(e['t'], e['t'] + e['d']) for e in EV if e['type'] == 'silence']
for a, b in SIL: gate(mus, a, b)

# ———————————————————— foley ————————————————————
fx = np.zeros((N, 2))
def F_portalOpen(v=1):
    tt = T(1.0); sub = np.sin(2 * np.pi * np.cumsum(40 + 60 * np.exp(-tt * 6)) / SR) * np.exp(-tt * 3)
    sw = bp(noise(1.0), 300, 3000) * np.exp(-tt * 4) * .5
    tt2 = T(.8); rise = np.sin(2 * np.pi * np.cumsum(300 + 900 * tt2) / SR) * np.sin(np.pi * tt2 / .8) * .25
    x = sub + sw; x[:len(rise)] += rise; return x * v
def F_hum(d, v=1):
    tt = T(d); x = (np.sin(2 * np.pi * 62 * tt) + .5 * np.sin(2 * np.pi * 124 * tt) + .2 * np.sin(2 * np.pi * 186 * tt)) * (1 + .3 * np.sin(2 * np.pi * .7 * tt))
    x += bp(noise(d), 800, 2000) * .05
    f = np.minimum(1, np.minimum(tt / .3, (d - tt) / .3)); return x * f * v * .2
def F_whoosh(d=.45, v=1, lo=400, hi=4000):
    tt = T(d); x = bp(noise(d), lo, hi) * np.sin(np.pi * tt / d) ** 2; return x * v * .7
def F_suck(v=1):
    tt = T(.5); x = noise(.5); out = np.zeros_like(x)
    for k in range(5): out += bp(x, 300 + k * 400, 500 + k * 600) * (tt / .5) ** (1 + k * .3)
    return out * np.sin(np.pi * tt / .5) * v * .6
def F_scratch(v=1):
    tt = T(.35); f = 600 + 1800 * np.abs(np.sin(2 * np.pi * 5 * tt)); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * .4 + bp(noise(.35), 1000, 5000) * .5
    return x * np.exp(-tt * 3) * v
def F_blub(v=1):
    tt = T(.12); f = 300 + 1600 * tt / .12; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 25) * v
def F_glorp(v=1):
    tt = T(.6); x = lp(noise(.6), 500) * np.exp(-tt * 5) * 2 + np.sin(2 * np.pi * np.cumsum(220 - 140 * tt) / SR) * np.exp(-tt * 6) * .6
    return x * v
def F_ticket(v=1):
    tt = T(.35); x = hp(noise(.35), 2500) * (rng.random(len(tt)) < .08) * 4; return lp(x, 9000) * np.exp(-tt * 4) * v * .5
def F_click(v=1):
    x = np.zeros(int(.2 * SR)); x[:200] = hp(noise(200 / SR), 2000) * np.exp(-np.arange(200) / 30); x[4000:4200] = hp(noise(200 / SR), 2000) * np.exp(-np.arange(200) / 30) * .7
    return x * v
def F_beep(v=1, f=1250):
    tt = T(.12); return np.sin(2 * np.pi * f * tt) * adsr(len(tt), .003, .02, .8, .02) * v * .4
def F_stamp(v=1):
    tt = T(.4); return (np.sin(2 * np.pi * np.cumsum(90 * np.exp(-tt * 4) + 40) / SR) * np.exp(-tt * 12) + bp(noise(.4), 400, 3000) * np.exp(-tt * 30) * .6) * v
def F_coin(v=1, n=0):
    tt = T(.6); f = 2200 * (1 + .06 * n); x = sum(np.sin(2 * np.pi * f * r * tt) * np.exp(-tt * (8 + 4 * r)) / r for r in (1, 2.76, 5.4)); return x * v * .35
def F_boing(v=1):
    tt = T(.5); f = 220 * (1 + .25 * np.sin(2 * np.pi * 14 * tt) * np.exp(-tt * 4)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 5) * v * .6
def F_type(d, v=1):
    x = np.zeros(int(d * SR))
    for k in range(int(d * 22)):
        i = int(k / 22 * SR); c = hp(noise(.015), 1800) * np.exp(-T(.015) * 300) * (.7 + .3 * rng.random()); x[i:i + len(c)] += c[:len(x) - i]
    return x * v * .35
def F_slam(v=1):
    tt = T(.8); return (np.sin(2 * np.pi * np.cumsum(70 * np.exp(-tt * 3) + 30) / SR) * np.exp(-tt * 6) + lp(noise(.8), 2500) * np.exp(-tt * 14) * .7) * v
def F_pop(v=1):
    tt = T(.09); f = 900 * np.exp(-tt * 18) + 300; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 40) * v * .5
def F_buzz(d, v=1):
    tt = T(d); x = lp(square(150, d), 900) * .25 * (np.sin(2 * np.pi * 3 * tt) > 0)
    for k in range(int(d / .5)):   # melodi dering kecil
        for j, m in enumerate((84, 88, 91)): x[int((k * .5 + j * .09) * SR):][:int(.08 * SR)] += F_beep(.6, mtof(m))[:int(.08 * SR)][:len(x[int((k * .5 + j * .09) * SR):])]
    return x * v
def F_gulp(v=1):
    tt = T(.3); return np.sin(2 * np.pi * np.cumsum(260 - 180 * tt / .3) / SR) * np.sin(np.pi * tt / .3) * v * .6
def F_chomp(v=1):
    tt = T(.18); return bp(noise(.18), 600, 5000) * (rng.random(len(tt)) < .3) * np.exp(-tt * 20) * v * 1.5
def F_whip(v=1):
    tt = T(.25); return bp(noise(.25), 1500, 8000) * np.sin(np.pi * tt / .25) ** 3 * v
def F_tick(v=1):
    tt = T(.04); return (hp(noise(.04), 3000) * np.exp(-tt * 200) + np.sin(2 * np.pi * 3100 * tt) * np.exp(-tt * 150) * .5) * v * .5
def F_sizzle(d, v=1):
    n = int(d * SR); x = hp(noise(d), 3000) * .15 + (rng.random(n) < .004) * rng.standard_normal(n) * 1.5; return bp(x, 2500, 10000) * v * .5
def F_blip(v=1, n=0):
    tt = T(.08); return np.sin(2 * np.pi * mtof(76 + n * 2) * tt) * np.exp(-tt * 30) * v * .35
def F_hover(d, v=1):
    tt = T(d); return bp(noise(d), 200, 900) * .4 * (1 + .3 * np.sin(2 * np.pi * 9 * tt)) * np.minimum(1, np.minimum(tt / .3, (d - tt) / .3)) * v
def F_jitter(d, v=1):
    n = int(d * SR); x = (rng.random(n) < .002) * rng.standard_normal(n); return bp(x, 800, 4000) * v

for e in EV:
    t, k, v = e['t'], e['type'], e.get('v', 1)
    if k == 'portalOpen': add(fx, F_portalOpen(v), t)
    elif k == 'portalHum': add(fx, F_hum(e['d'], v), t)
    elif k == 'portalWhoosh': add(fx, F_whoosh(.5, v), t)
    elif k == 'whoosh': add(fx, F_whoosh(.6, v * .6, 300, 2500), t, 1, .4)
    elif k == 'suck': add(fx, F_suck(v), t)
    elif k == 'scratch': add(fx, F_scratch(v), t)
    elif k == 'blub': [add(fx, F_blub(.7), t + j * .13, 1, .2) for j in range(3)]
    elif k == 'glorp': add(fx, F_glorp(v), t)
    elif k == 'ticket': add(fx, F_ticket(v), t, 1, -.2)
    elif k == 'click': add(fx, F_click(v), t)
    elif k == 'beep': add(fx, F_beep(v), t)
    elif k == 'stamp': add(fx, F_stamp(v), t)
    elif k == 'coin': add(fx, F_coin(v, e.get('n', 0)), t, 1, .2)
    elif k == 'boing': add(fx, F_boing(v), t)
    elif k == 'type': add(fx, F_type(e['d'], v), t, 1, -.3)
    elif k == 'slam': add(fx, F_slam(v), t)
    elif k == 'punch': add(fx, F_pop(1.2), t)
    elif k == 'pop': add(fx, F_pop(v), t)
    elif k == 'buzz': add(fx, F_buzz(e['d'], v), t)
    elif k == 'gulp': add(fx, F_gulp(v), t)
    elif k == 'chomp': add(fx, F_chomp(v), t)
    elif k == 'whip': add(fx, F_whip(v), t)
    elif k == 'tick': add(fx, F_tick(v), t)
    elif k == 'sizzleBurn': add(fx, F_sizzle(e['d'], .35), t, 1, -.3)
    elif k == 'blip': add(fx, F_blip(v, e.get('n', 0)), t)
    elif k == 'hover': add(fx, F_hover(e['d'], v), t, 1, .3)
    elif k == 'jitter': add(fx, F_jitter(e['d'], v), t)

# ambience per dunia
amb = np.zeros((N, 2))
for e in EV:
    if e['type'] != 'amb': continue
    t, d, w = e['t'], e['d'], e['w']; n = int(d * SR); tt = np.arange(n) / SR
    fade = np.minimum(1, np.minimum(tt / .05, (d - tt) / .05))
    if w == 'tanggul': x = lp(noise(d), 500) * (.6 + .4 * np.sin(2 * np.pi * .25 * tt)) * .5
    elif w == 'banjir': x = hp(noise(d), 1500) * .25 + lp(noise(d), 300) * .3
    elif w == 'jalan': x = bp(noise(d), 100, 600) * .35
    elif w == 'kota': x = bp(noise(d), 300, 2500) * (.6 + .4 * np.sin(2 * np.pi * 1.3 * tt) * np.sin(2 * np.pi * .4 * tt)) * .3
    elif w == 'teras':
        cr = np.sin(2 * np.pi * 4400 * tt) * (np.sin(2 * np.pi * 28 * tt) > .2) * (np.sin(2 * np.pi * .9 * tt) > 0) * .06
        x = cr + F_sizzle(d, .35)[:n] + np.sin(2 * np.pi * 100 * tt) * .03
    else: continue
    add(amb, x * fade, t, .5, 0)

# ———————————————————— suara (bila sudah direkam) + mix ————————————————————
vo = np.zeros((N, 2)); duck = np.ones(N)
for e in EV:
    if e['type'] != 'vo': continue
    p = os.path.join(HERE, 'voices', e['id'] + '.wav')
    if not os.path.exists(p): continue
    x, sr = sf.read(p); x = x.mean(1) if x.ndim > 1 else x
    if sr != SR: x = np.interp(np.arange(int(len(x) * SR / sr)) * sr / SR, np.arange(len(x)), x)
    add(vo, x, e['t'])
    i0, i1 = int(e['t'] * SR), int(e['t'] * SR) + len(x); duck[max(0, i0 - 2400):i1 + 4800] = .32
duck = np.convolve(duck, np.ones(4800) / 4800, mode='same')

# hening dingin: ambience turun, hanya dengung portal + detak jam + desis pelan
quiet = np.ones(N); i0, i1 = int(SIL[1][0] * SR), int((SIL[1][1] - .2) * SR); quiet[i0:i1] = .3
quiet = np.convolve(quiet, np.ones(2400) / 2400, mode='same')
# suara: kompresi lembut lalu dinaikkan supaya jelas di atas musik
vo = np.tanh(vo * 2.2) / np.tanh(2.2) * 1.15
mix = mus * .55 * duck[:, None] + fx * .9 * (0.6 + 0.4 * duck[:, None]) + amb * .8 * quiet[:, None] + vo
mix = np.tanh(mix * .9) / .9
mix = mix[:int(DUR * SR)]
for name, b in (('music', mus), ('fx', fx + amb), ('mix', mix)):
    sf.write(os.path.join(HERE, 'out', name + '.wav'), (b[:int(DUR * SR)] / max(1e-9, np.max(np.abs(b))) * .95 if name != 'mix' else b).astype(np.float32), SR, subtype='FLOAT')
print('ok', DUR, 's; voices:', int(np.sum(np.abs(vo)) > 0))
