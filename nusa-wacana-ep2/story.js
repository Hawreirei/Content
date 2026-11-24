// story.js — EP 2/30 "Tawaran Bu Sekar". Linimasa dihitung dari durasi baris.
// Sebelum VO ada: durasi perkiraan (angka) + bagian mulut dalam pecahan [0..1] dari baris.
// Setelah VO ada: ganti angka dengan rentang mentah [a,b] di voices/raw.wav, dan bagian mulut dengan waktu mentah.
export const BPM = 96, BEAT = 60 / BPM;
export const q = t => Math.floor(t * 12 + 1e-6) / 12;

const RAW = [
  ['e1', 'BATIN', 'Kalian pilih B. Jadi... aku dengar dulu tawaran Bu Sekar.', [0.07, 3.81], []],
  ['e2', 'BAMBANG', '"Dik Dimas lebih milih dengar dia?!" protes Pak Bambang.', [4.31, 7.33], [[4.31, 6.12, 'BAMBANG']]],
  ['e3', 'BAMBANG', '"Ya sudah. Besok pagi saya telepon lagi," katanya... sambil ngambil tempe satu lagi.', [7.79, 12.68], [[7.79, 9.85, 'BAMBANG']]],
  ['e4', 'IBU', '"Tempenya dibawa, Pak?" tanya Ibu.', [13.16, 14.92], [[13.16, 14.11, 'IBU']]],
  ['e5', 'BATIN', 'Portal Pak Bambang pun tertutup.', [15.50, 18.42], []],
  ['e6', 'SEKAR', '"Terima kasih, Mas Dimas. Saya langsung saja," kata Bu Sekar.', [18.88, 22.23], [[18.88, 21.28, 'SEKAR']]],
  ['e7', 'SEKAR', '"Jadi wakil saya. Rawa Sumpek dapat anggaran 10 kali lipat. Kereta gantung. Taman di atas tanggul."', [22.72, 28.90], [[22.72, 28.90, 'SEKAR']]],
  ['e8', 'BATIN', '10 kali lipat... aku hampir bilang iya.', [29.30, 32.55], []],
  ['e9', 'SEKAR', '"Satu syarat kecil," lanjut Bu Sekar. Lalu sebuah drone kecil terbang keluar dari portal.', [33.00, 38.22], [[33.00, 34.15, 'SEKAR']]],
  ['e10', 'SEKAR', '"Mulai besok, Mas cuma boleh bicara pakai naskah dari saya."', [38.67, 42.03], [[38.67, 42.03, 'SEKAR']]],
  ['e11', 'DIMAS', 'Aku coba bilang, "Tapi, Bu..." "BICARA. SESUAI. NASKAH." bunyi drone itu.', [42.41, 48.01], [[43.62, 44.42, 'DIMAS']]],
  ['e12', 'IBU', '"Le, itu lalat apa?" tanya Ibu... lalu dia memukulnya pakai sutil.', [48.39, 52.46], [[48.39, 49.70, 'IBU']]],
  ['e13', 'SEKAR', '"Pikirkan baik-baik, Mas. Oh ya... soal Bambang, jangan terlalu dipikirkan. Dia nggak akan lama," kata Bu Sekar. Lalu portalnya tertutup.', [52.83, 61.39], [[52.83, 58.71, 'SEKAR']]],
  ['e14', 'IBU', 'Ibu cuma bilang, "Le... itu tadi kayak sales panci."', [63.22, 66.67], [[64.52, 66.67, 'IBU']]],
  ['e15', 'BATIN', 'Anggaran 10 kali lipat... tapi aku nggak boleh ngomong pakai kata-kataku sendiri. Aku harus gimana?', [67.16, 72.67], []],
];
const R = Object.fromEntries(RAW.map(r => [r[0], r]));
const dur = id => Array.isArray(R[id][3]) ? R[id][3][1] - R[id][3][0] : R[id][3];
// bagian mulut → waktu relatif terhadap awal baris
const mouthRel = id => { const [, , , src, m] = R[id], d = dur(id); return Array.isArray(src) ? m.map(([a, b, w]) => [a - src[0], b - src[0], w]) : m.map(([a, b, w]) => [a * d, b * d, w]); };
// titik di dalam baris (pecahan) → waktu film
const at = (id, f) => L[id].t0 + f * dur(id);

const L = {};
const place = (id, t0) => (L[id] = { t0, t1: t0 + dur(id) }, L[id]);
const SH = [];
const shot = (a, b, name, w) => { SH.push([a, b, name, w]); return b; };
export const T = {};

// HOOK: kartu suara dicap B (sudah terlihat di frame 1 = sampul)
place('e1', .5); let t = shot(0, L.e1.t1 + .5, 'hook', 'none');
T.hookEnd = t; t = shot(t, t + .625, 'wipeIn', 'none');
// BAMBANG tersinggung
place('e2', t + .3); t = shot(t, L.e2.t1 + .25, 'bamAngry', 'teras');
place('e3', t + .2); T.grab = at('e3', .76); t = shot(t, L.e3.t1 + .15, 'grab', 'teras');
place('e4', t + .2); t = shot(t, L.e4.t1 + .2, 'ibuAsk', 'teras');
T.close1 = t + .3; place('e5', t + .2); t = shot(t, Math.max(L.e5.t1 + .3, T.close1 + 1.0), 'close1', 'teras');
// TAWARAN SEKAR
const offerA = t; place('e6', t + .3); place('e7', L.e6.t1 + .35);
T.holo = [at('e7', .29), at('e7', .65), at('e7', .82)];
t = shot(t, L.e7.t1 + .3, 'sekarOffer', 'teras');
place('e8', t + .2); t = shot(t, L.e8.t1 + .35, 'dazzled', 'teras');
// SYARAT: drone
const droneA = t; place('e9', t + .2); T.droneOut = at('e9', .63); place('e10', L.e9.t1 + .3); t = shot(t, L.e10.t1 + .2, 'drone', 'teras');
place('e11', t + .2); T.nope = at('e11', .42); t = shot(t, L.e11.t1 + .2, 'nope', 'teras');
place('e12', t + .2); T.swat = at('e12', .76); t = shot(t, L.e12.t1 + .5, 'swat', 'teras');
// ANCAMAN
const threatA = t; place('e13', t + .25); T.whisper = at('e13', .56); T.close2 = at('e13', .94); t = shot(t, L.e13.t1 + .3, 'threat', 'teras');
// HENING → sales panci
T.silence = [t, t + 2.2]; place('e14', t + 2.2); t = shot(t, L.e14.t1 + .5, 'quiet', 'teras');
// METER, PILIHAN, TELUR
const metA = t; place('e15', t + .35); t = shot(t, Math.max(t + 4.6, L.e15.t1 + .8), 'meters', 'teras');
const chA = t; T.choiceA = t + 1.25; T.choiceB = t + 1.875; T.choiceC = t + 2.5; T.cta = t + 3.75; t = shot(t, t + 8.75, 'choices', 'none');
T.egg = t; t = shot(t, t + 2.25, 'egg', 'teras');
export const DUR = +t.toFixed(3);

export const LINES = RAW.map(([id, who, sub, src]) => [id, who, sub, Array.isArray(src) ? src : null, +L[id].t0.toFixed(3), +dur(id).toFixed(3), mouthRel(id).map(([a, b, w]) => [+a.toFixed(3), +b.toFixed(3), w])]);
export const SHOTS = SH;
export const shotAt = x => SH.find(s => x >= s[0] && x < s[1]) || SH[SH.length - 1];
export const shotNamed = n => SH.find(s => s[2] === n);
export const WIPES = [[T.hookEnd + .25, .42], [chA, .32]];
export const TAGS = [[shotNamed('bamAngry')[0] + .1, shotNamed('bamAngry')[1] - .05, 'RUMAH IBU', 'MASIH MALAM YANG SAMA', '#171437', '#ffd36b']];
export const CUTS = [T.hookEnd, offerA, droneA, threatA, T.silence[0], metA, chA];
export const SILENCES = [[T.silence[0], T.silence[1] + .2, 'cold'], [T.egg, DUR + 1, 'egg']];
export const CUES = [
  [0.0, T.hookEnd, 'titleHit'],
  [shotNamed('bamAngry')[0], T.close1, 'march'],
  [offerA, shotNamed('dazzled')[0], 'celesta'],
  [shotNamed('dazzled')[0], droneA, 'theme'],
  [droneA, threatA, 'quiz'],
  [threatA, T.silence[0], 'tremolo'],
  [metA, T.egg, 'bright'],
];
Object.assign(T, { offerA, droneA, threatA, metA, chA });
