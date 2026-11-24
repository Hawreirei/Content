"""Sound for the HAWREIREI house-style demo (Bus KPK): paper foley on the page's events + an original score.
Run:  LIB=<library> $LIB/.venv/bin/python mix.py  (after: node core/render/events.mjs <film> --size 1080x1920 --out out/events.json)

Score: 96 bpm, a north-Indian colour with the instruments the library has: a drone (cellos/violas on D and A, standing in
for a tanpura), harp and strumstick in a Bhairav-like scale (D Eb F# G A Bb C#), flute for the bansuri, darbuka and frame drum
for the hand drums. Every counted square is a kalimba note climbing the scale; the second half of the board turns into a
string tremolo and a timpani roll that speed up, then everything stops when the King falls silent.
"""
import json, os, sys
import numpy as np, soundfile as sf
LIB = os.environ.get('LIB', '/root/lemo-opuscar')
sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, bp, lp, hp, add, compress, limit, click, whoosh, thump, creak, t_, norm, ding, step

HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'out', 'events.json')))
DUR = float(D['dur']); EV = D['ev']; N = int(round(DUR * SR))
rng = np.random.default_rng(43)
fx = np.zeros((N, 2))

# ---------------------------------------------------------------- paper foley (synthesised; adapted from the comic-history demo)
def paper_slap(v=1.0, size=1.0):
    d = 0.45; tt = t_(d)
    crack = hp(rng.standard_normal(len(tt)), 1800) * np.exp(-tt / 0.006)
    body = bp(rng.standard_normal(len(tt)), 500, 4500) * np.exp(-tt / (0.035 * size))
    knock = np.sin(2 * np.pi * 95 * tt * (1 - .4 * tt)) * np.exp(-tt / (0.06 * size))
    return norm(crack * .9 + body * 1.0 + knock * .8 * size) * v

def snip(v=1.0):
    d = 0.09; tt = t_(d)
    a = hp(rng.standard_normal(len(tt)), 3000) * np.exp(-tt / 0.002)
    ring = np.sin(2 * np.pi * 4300 * tt) * np.exp(-tt / 0.012) * .35 + np.sin(2 * np.pi * 6100 * tt) * np.exp(-tt / 0.008) * .2
    shear = bp(rng.standard_normal(len(tt)), 2500, 7000) * np.exp(-((tt - 0.01) / 0.012) ** 2) * .5
    return norm(a + np.roll(a, int(0.018 * SR)) * .6 + ring + shear) * v

def crinkle(d, v=1.0, density=0.004):
    n = int(d * SR); x = (rng.random(n) < density) * rng.standard_normal(n) * 3
    x = bp(x, 1500, 7500) + bp(rng.standard_normal(n), 800, 3000) * .08
    return x * np.sin(np.pi * np.arange(n) / n) ** .6 * v

def slide_whistle(d, f0, f1, v=1.0):
    tt = t_(d); f = f0 * (f1 / f0) ** (tt / d); ph = np.cumsum(f) / SR * 2 * np.pi
    x = np.sin(ph) + .25 * np.sin(2 * ph) + bp(rng.standard_normal(len(tt)), 1500, 5000) * .05
    return x * np.minimum(1, tt / 0.02) * np.minimum(1, (d - tt) / 0.04) * v

def puff(v=1.0):
    d = 0.32; tt = t_(d)
    return norm(bp(rng.standard_normal(len(tt)), 400, 2600) * (tt / 0.03).clip(0, 1) * np.exp(-tt / 0.09)) * v

def joint(v=1.0, pitch=1.0): return lp(click(pitch=pitch, v=1.0), 5000) * v

def page_slide(d, v=1.0):
    n = int(d * SR)
    return lp(bp(rng.standard_normal(n), 300, 3000) * np.sin(np.pi * np.arange(n) / n) ** 2, 4000) * v

def clay_tap(v=1.0):   # a stylus pressed into wet clay: a soft, dull knock and a little squelch
    d = .18; tt = t_(d)
    knock = np.sin(2 * np.pi * 180 * tt * (1 - .5 * tt)) * np.exp(-tt / .02)
    sq = lp(rng.standard_normal(len(tt)), 1200) * np.exp(-tt / .03) * .6
    return norm(knock + sq) * v

def tick(v=1.0):
    d = .05; tt = t_(d)
    return norm(hp(rng.standard_normal(len(tt)), 3000) * np.exp(-tt / .003) + np.sin(2 * np.pi * 2600 * tt) * np.exp(-tt / .006) * .5) * v

def flutter(d, v=1.0):   # a slip of paper falling: crinkle beating at ~9 Hz
    n = int(d * SR); tt = np.arange(n) / SR
    return crinkle(d, 1.0, .01) * (0.5 + 0.5 * np.sin(2 * np.pi * 9 * tt)) * v





for e in EV:
    t, k, pan = e['t'], e['type'], e.get('pan', 0) * 0.7
    if k == 'hop': add(fx, joint(.10, 0.9), t, 1, pan)
    elif k == 'pop': add(fx, joint(.08, 1.4), t, 1, pan)
    elif k == 'swish': add(fx, hp(whoosh(max(.12, e['d']), 1), 500) * .2, t, 1, pan)
    elif k == 'slap': add(fx, paper_slap(.7, 1.3), t, 1, pan)
    elif k == 'slapS': add(fx, paper_slap(.3, .55), t, 1, pan)
    elif k == 'chime': add(fx, ding(.05), t, 1, pan)
    elif k == 'stamp': add(fx, thump(.6, 80), t, 1, 0); add(fx, paper_slap(.6, 1.0), t, 1, 0)
    elif k == 'pageout': add(fx, page_slide(e['d'], .10), t, 1, 0)
    elif k == 'scribble': add(fx, crinkle(e['d'], .35, .02), t, 1, pan)
    elif k == 'engine':   # a little paper bus: a putter of soft knocks speeding up
        n = 18
        for j in range(n): add(fx, lp(click(pitch=.5, v=1.0), 900) * .25, t + e['d'] * (j / n) ** .8, 1, -.2 + .4 * j / n)
    elif k == 'dep': add(fx, joint(.12, 1.1), t, 1, pan)
    elif k == 'tick': add(fx, paper_slap(.12, .35), t, 1, pan)
room = lp(rng.standard_normal(N), 700, 2) * 0.003
fx += np.stack([room, np.roll(room, 1171)], 1)

# ---------------------------------------------------------------- score: light and playful, C major, 112 bpm
B = 60 / 112
sec = {e['name']: e['t'] for e in EV if e['type'] == 'sec'}
score = []
def ev(t, inst, p, d, v, pan=0.0, g=1.0):
    if 0 <= t < DUR: score.append((t, inst, p, d, v, pan, g))
def groove(t0, t1, v=.3, busy=False):
    j = 0
    while t0 + j * B / 2 < t1:
        tt = t0 + j * B / 2
        if j % 2 == 0: ev(tt, 'world_perc', 'egg_shaker_soft', None, v * .6, .2, .4)
        if j % 4 == 0: ev(tt, 'cellos_pizz', [36, 43, 41, 43][(j // 8) % 4], .4, v * 1.3, -.1, .5)
        if j % 8 == 4: ev(tt, 'woodblock', 'a', None, v * .7, .3, .4)
        if busy and j % 2 == 1: ev(tt, 'world_perc', 'claves', None, v * .4, -.3, .35)
        j += 1
MEL = [72, 76, 79, 76, 77, 74, 71, 74]
def tune(t0, t1, inst='marimba', v=.32, base=0):
    j = 0
    while t0 + j * B < t1: ev(t0 + j * B, inst, MEL[j % 8] + base, B * .9, v, .1, .4); j += 1
groove(.2, sec['go'], .28); tune(.4, sec['go'] - .2, 'marimba', .28)
for i, p in enumerate([67, 72, 76]): ev(sec['go'] + i * .12, 'xylophone', p, .4, .35, .2, .4)
groove(sec['run'], sec['meet'], .3, busy=True)
for e in EV:   # each departure: a note on its own instrument (A marimba, B glockenspiel), rising through the hour
    if e['type'] == 'dep':
        m = e['m']; p = 60 + {1: 0, 4: 4, 7: 7, 10: 9, 13: 12, 5: 4, 9: 7}[m]
        ev(e['t'], 'marimba' if e['key'] == 'A' else 'glockenspiel', p + (0 if e['key'] == 'A' else 12), .8, .5, e['pan'], .5)
hit = sec['meet'] + .2
for p in [60, 64, 67, 72]: ev(hit, 'tubular_bells', p, 3.0, .45, 0, .5)
ev(hit, 'timpani', 48, 1.0, .5, 0, .5)
groove(sec['meet'] + 1.0, sec['tree'] - .3, .24); tune(sec['meet'] + 1.0, sec['tree'] - .4, 'kalimba', .3)
groove(sec['tree'], sec['bonus'] - .3, .26, busy=True); tune(sec['tree'] + .2, sec['answer'] - .2, 'marimba', .26, -12)
for i, p in enumerate([72, 76, 79, 84]): ev(sec['answer'] + i * .1, 'glockenspiel', p, 1.2, .35, .3, .45)
groove(sec['bonus'], sec['end'] + .2, .24); tune(sec['bonus'] + .2, sec['cta'], 'violins_pizz', .3); tune(sec['cta'] + .2, sec['end'], 'marimba', .28)
tend = sec['end'] + .4
for ins, p in [('cellos_pizz', 36), ('marimba', 60), ('marimba', 64), ('marimba', 67), ('glockenspiel', 79), ('xylophone', 84)]: ev(tend, ins, p, 2.5, .45, 0, .5)

used = sorted({e[1] for e in score})
S.seed(23)
music = S.render(score, dur=DUR + 2, master=False)[:N]
if len(music) < N: music = np.pad(music, ((0, N - len(music)), (0, 0)))
music = S.room(music, size=0.3, mix=0.12)
tt = np.arange(N) / SR
mr = np.sqrt((music ** 2).mean()); fr = np.sqrt((fx ** 2).mean())
mix = music + fx * (mr / (fr + 1e-9)) * 0.9
mix = np.stack([compress(mix[:, 0], thr=0.3, ratio=2.5, att=0.002), compress(mix[:, 1], thr=0.3, ratio=2.5, att=0.002)], 1)
mix *= np.clip((DUR - tt) / 1.2, 0, 1)[:, None] ** 1.5
pk = np.abs(mix).max(); mix *= 0.5 / pk * 2.0
mix = np.stack([limit(mix[:, 0], ceil=.8), limit(mix[:, 1], ceil=.8)], 1)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR)
cr = S.credits(used)
open(os.path.join(HERE, 'out', 'instruments.txt'), 'w').write('\n'.join(cr) if isinstance(cr, list) else str(cr))
print('mix', mix.shape, 'instruments:', ', '.join(used))
