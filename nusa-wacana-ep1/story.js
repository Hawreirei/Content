// story.js — satu sumber kebenaran. Linimasa film DIHITUNG dari rekaman VO (voices/raw.wav):
// setiap baris punya rentang di rekaman mentah, lalu ditempatkan di film; shot, tag, cue, dan ketukan mengikuti baris.
// 96 bpm: 1 ketukan = 0,625 dtk
export const BPM = 96, BEAT = 60 / BPM;
export const q = t => Math.floor(t * 12 + 1e-6) / 12;          // waktu gambar "on twos"

// [id, label subtitle, subtitle (persis seperti diucapkan), rentang mentah [a,b], bagian bermulut [[a,b,SIAPA],...] (waktu mentah)]
// label = tokoh yang dikutip (warna pill); bagian di luar "mulut" adalah narasi Dimas (tidak menggerakkan mulut siapa pun)
const RAW = [
  ['h1', 'BAMBANG', '"Dik Dimas!" teriak Pak Bambang.', [0.10, 2.32], [[0.10, 1.14, 'BAMBANG']]],
  ['h2', 'SEKAR', '"Mas Dimas!" sahut Bu Sekar.', [2.81, 4.56], [[2.81, 3.51, 'SEKAR']]],
  ['h3', 'DIMAS', '"Aku cuma WALI KOTA!" teriakku.', [5.02, 7.04], [[5.02, 6.45, 'DIMAS']]],
  ['h4', 'BATIN', 'Kok bisa begini?', [7.57, 8.49], []],
  ['n1', 'BATIN', 'Tiga tahun lalu... kota ini tenggelam tiap Februari.', [9.13, 12.33], []],
  ['n2', 'BATIN', 'Banjir.', [12.83, 13.44], []],
  ['n3', 'BATIN', 'Sampah.', [13.77, 14.48], []],
  ['n4', 'BATIN', 'Pungli.', [14.82, 15.32], []],
  ['n5', 'BATIN', 'Kata orang... nggak bisa dibenerin.', [15.72, 17.79], []],
  ['n6', 'BATIN', 'Aku dulu cuma ojol... yang hobi lapor jalan bolong.', [18.21, 21.82], []],
  ['n7', 'BATIN', 'Laporanku nggak pernah dibalas.', [22.30, 24.48], []],
  ['n8', 'BATIN', 'Jadi aku nyalon sendiri... Modal patungan warga.', [24.83, 27.41], []],
  ['v1', 'WARGA', '"Pak Wali!" panggil warga.', [27.80, 29.41], [[27.80, 28.55, 'WARGA']]],
  ['n9', 'BATIN', 'Sekarang umurku 28... dan aku wali kotanya.', [29.79, 33.42], []],
  ['n10', 'BATIN', 'Di Nusa Wacana, itu sah.', [33.79, 35.61], []],
  ['i1', 'IBU', 'Malam itu Ibu bilang, "Makan dulu, Le. Wali kota juga butuh gorengan."', [35.99, 40.43], [[37.53, 40.43, 'IBU']]],
  ['d1', 'DIMAS', '"Iya, Bu," jawabku.', [40.78, 42.09], [[40.78, 41.35, 'DIMAS']]],
  ['i2', 'IBU', '"Siapa, Le?" tanya Ibu, tanpa menoleh.', [42.48, 44.77], [[42.48, 43.03, 'IBU']]],
  ['d2', 'DIMAS', '"...Calon presiden, Bu," bisikku.', [45.12, 47.55], [[45.12, 46.23, 'DIMAS']]],
  ['b1', 'BAMBANG', '"Dik Dimas! Anak muda kayak kamu itu... LAKU," kata Pak Bambang.', [47.87, 53.24], [[47.87, 52.40, 'BAMBANG']]],
  ['b2', 'BAMBANG', '"Jadi wakil saya, ya? Besok pagi saya tunggu jawabannya," katanya lagi.', [53.59, 57.75], [[53.59, 56.82, 'BAMBANG']]],
  ['i3', 'IBU', 'Ibu cuma bilang, "Gorengan, Pak?"', [58.16, 59.86], [[59.00, 59.86, 'IBU']]],
  ['s1', 'SEKAR', '"Mas Dimas. Jangan jawab Bambang dulu," kata Bu Sekar.', [60.26, 63.52], [[60.26, 62.58, 'SEKAR']]],
  ['b3', 'BAMBANG', '"Lho, Sekar?!" kata Pak Bambang, mulutnya penuh tempe.', [63.88, 67.26], [[63.88, 64.75, 'BAMBANG']]],
  ['s2', 'SEKAR', '"Tawaran saya... jauh lebih baik," kata Bu Sekar.', [67.58, 70.71], [[67.58, 69.69, 'SEKAR']]],
  ['i4', 'IBU', 'Lalu Ibu bilang... "Le... tempenya gosong."', [71.59, 74.60], [[73.03, 74.60, 'IBU']]],
  ['n11', 'BATIN', 'Malam ini... aku harus jawab apa?', [74.97, 77.21], []],
];
const R = Object.fromEntries(RAW.map(r => [r[0], r]));
const dur = id => R[id][3][1] - R[id][3][0];

// —— penempatan baris + shot ——
const L = {};                // id → {t0, t1}
const place = (id, t0) => (L[id] = { t0, t1: t0 + dur(id) }, L[id]);
const SH = [];               // [t0, t1, nama, dunia]
const shot = (a, b, name, w) => { SH.push([a, b, name, w]); return b; };
export const T = {};

// HOOK
place('h1', 0.15); place('h2', L.h1.t1 + .25); place('h3', L.h2.t1 + .25);
T.freeze = L.h3.t1 + .15; place('h4', T.freeze + .15);
let t = shot(0, L.h4.t1 + .35, 'hook', 'teras');
const hookEnd = t;
t = shot(t, t + .625, 'wipeIn', 'none');
// TANGGUL
const damA = t; place('n1', t + .25); t = shot(t, L.n1.t1 + .4, 'dam', 'tanggul');
// BANJIR ×3, framing sama
const floodA = t;
for (const [id, nm] of [['n2', 'flood'], ['n3', 'trash'], ['n4', 'pungli']]) { const a = t; place(id, a + .15); t = shot(a, Math.max(a + 1.15, L[id].t1 + .45), nm, 'banjir'); }
T.stingers = SH.slice(-3).map(s => s[0]);
const youngA = t; place('n5', t + .3); t = shot(t, L.n5.t1 + .4, 'youngCU', 'banjir');
// ASAL-USUL
const potA = t; place('n6', t + .3); T.photo = L.n6.t0 + 1.4; T.phone = L.n6.t1 + .35;
place('n7', T.phone + .55); T.zero = L.n7.t1 - .35; T.sent = T.phone + .75;
t = shot(potA, L.n7.t1 + .6, 'pothole', 'jalan');
const canA = t; place('n8', t + .3); T.coins = [0, .4, .7, .95].map(x => canA + .35 + x); t = shot(t, L.n8.t1 + .5, 'can', 'jalan');
// KOTA
const cityA = t; place('v1', t + .25); place('n9', L.v1.t1 + .35); place('n10', L.n9.t1 + .35);
T.uu = [L.n10.t0 - .1, 0]; T.uu[1] = Math.max(L.n10.t1 + .6, T.uu[0] + 4.1);
t = shot(cityA, T.uu[1] + .05, 'city', 'kota');
// JUDUL
T.title = [t, t + 4.375]; t = shot(t, t + 4.375, 'title', 'none');
// TERAS
const terA = t; place('i1', t + .5); place('d1', L.i1.t1 + .35); T.buzz1 = L.d1.t1 + .25;
t = shot(terA, T.buzz1 + .35, 'terrace2', 'teras');
T.watch1 = t; t = shot(t, t + 1.875, 'watch1', 'teras');
place('i2', t + .3); t = shot(t, L.i2.t1 + .15, 'terrace2b', 'teras');
place('d2', t + .3); T.gulp = L.d2.t1 - .4; t = shot(t, L.d2.t1 + .3, 'dimasCU', 'teras');
T.open1 = t; place('b1', t + .7); place('b2', L.b1.t1 + .35); t = shot(t, L.b2.t1 + .2, 'bambang', 'teras');
const tempeA = t; place('i3', t + .3); T.offer = L.i3.t0 + .8; T.take = L.i3.t1 + .25; T.chomp = T.take + .4; t = shot(t, T.chomp + .5, 'tempe', 'teras');
T.buzz2 = t - .25; T.watch2 = t; t = shot(t, t + 1.875, 'watch2', 'teras');
T.open2 = t; place('s1', t + .6); t = shot(t, L.s1.t1 + .25, 'sekar', 'teras');
place('b3', t + .25); t = shot(t, L.b3.t1 + .2, 'whipB', 'teras');
place('s2', t + .25); t = shot(t, L.s2.t1 + .3, 'whipS', 'teras');
// HENING → "tempenya gosong"
T.silence = [t, t + 2.4]; place('i4', t + 2.4); t = shot(t, L.i4.t1 + .5, 'standoff', 'teras');
// METER, PILIHAN, TELUR PASKAH
const metA = t; place('n11', t + .3); t = shot(t, Math.max(t + 3.75, L.n11.t1 + .9), 'meters', 'teras');
const chA = t; T.choiceA = t + 1.25; T.choiceB = t + 1.875; T.choiceC = t + 2.5; T.cta = t + 3.75;
t = shot(t, t + 8.75, 'choices', 'none');
T.egg = t; t = shot(t, t + 2.25, 'egg', 'teras');
export const DUR = +t.toFixed(3);

// —— ekspor dalam bentuk yang dipakai main.js / audio ——
// LINES: [id, siapa(label), sub, raw[a,b], t0, d, mulut [[relA, relB, SIAPA]]]
export const LINES = RAW.map(([id, who, sub, raw, mouth]) => [id, who, sub, raw, +L[id].t0.toFixed(3), +dur(id).toFixed(3), mouth.map(([a, b, w]) => [+(a - raw[0]).toFixed(3), +(b - raw[0]).toFixed(3), w])]);
export const SHOTS = SH;
export const shotAt = x => SH.find(s => x >= s[0] && x < s[1]) || SH[SH.length - 1];
export const shotNamed = n => SH.find(s => s[2] === n);
export const WIPES = [[hookEnd + .25, 0.42], [T.title[0], 0.3], [chA, 0.32]];
export const TAGS = [
  [damA + .15, floodA - .1, 'RAWA SUMPEK', 'SEKARANG · KERING', '#0f3a3a', '#7ff0e6'],
  [floodA + .1, potA, 'RAWA SUMPEK', '3 TAHUN LALU', '#2e2a1e', '#d8c98a'],
  [T.uu[0], T.uu[1], 'UU NUSA WACANA PSL 1', 'SYARAT PEJABAT: PUNYA KTP', '#2a1a10', '#ffd36e'],
  [terA + .1, T.watch1 - .05, 'RUMAH IBU', 'MALAM · KOMPOR FUSI ON', '#171437', '#ffd36b'],
];
// potongan keras untuk subtitle (dunia berganti)
export const CUTS = [hookEnd, floodA, potA, cityA, T.title[0], T.silence[0], metA, chA];
// hening sungguhan (musik + ekor reverb dipotong)
export const SILENCES = [[T.freeze, hookEnd + .45], [T.silence[0], T.silence[1] + .2], [T.egg, DUR + 1]];
export const CUES = [
  [0.0, T.freeze, 'panic'],
  [damA, floodA, 'theme'],
  [floodA, potA, 'tuba'],
  [potA, cityA, 'surf'],
  [cityA, T.title[0], 'bright'],
  [T.title[0], T.title[1], 'titleHit'],
  [terA, T.open1, 'rhodes'],
  [T.open1, T.watch2, 'march'],
  [T.open2, shotNamed('whipB')[0], 'celesta'],
  [shotNamed('whipB')[0], T.silence[0], 'tremolo'],
  [metA, T.egg, 'quiz'],
];
T.youngA = youngA; T.cityA = cityA; T.terA = terA; T.metA = metA; T.chA = chA; T.hookEnd = hookEnd; T.damA = damA; T.floodA = floodA; T.potA = potA; T.canA = canA; T.tempeA = tempeA;
