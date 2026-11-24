// story.js — EP 2/30 "Tawaran Bu Sekar". Linimasa dihitung dari durasi baris.
// Sebelum VO ada: durasi perkiraan (angka) + bagian mulut dalam pecahan [0..1] dari baris.
// Setelah VO ada: ganti angka dengan rentang mentah [a,b] di voices/raw.wav, dan bagian mulut dengan waktu mentah.
export const BPM = 96, BEAT = 60 / BPM;
export const q = t => Math.floor(t * 12 + 1e-6) / 12;

const RAW = [
  ['e1', 'BATIN', 'Kalian pilih B. Jadi... aku dengar dulu tawaran Bu Sekar.', 3.6, []],
  ['e2', 'BAMBANG', '"Dik Dimas lebih milih dengar dia?!" protes Pak Bambang.', 3.0, [[0, .68, 'BAMBANG']]],
  ['e3', 'BAMBANG', '"Ya sudah. Besok pagi saya telepon lagi," katanya... sambil ngambil tempe satu lagi.', 5.0, [[0, .48, 'BAMBANG']]],
  ['e4', 'IBU', '"Tempenya dibawa, Pak?" tanya Ibu.', 2.0, [[0, .65, 'IBU']]],
  ['e5', 'BATIN', 'Portal Pak Bambang pun tertutup.', 2.2, []],
  ['e6', 'SEKAR', '"Terima kasih, Mas Dimas. Saya langsung saja," kata Bu Sekar.', 3.7, [[0, .78, 'SEKAR']]],
  ['e7', 'SEKAR', '"Jadi wakil saya. Rawa Sumpek dapat anggaran 10 kali lipat. Kereta gantung. Taman di atas tanggul."', 6.2, [[0, 1, 'SEKAR']]],
  ['e8', 'BATIN', '10 kali lipat... aku hampir bilang iya.', 3.0, []],
  ['e9', 'SEKAR', '"Satu syarat kecil," lanjut Bu Sekar. Lalu sebuah drone kecil terbang keluar dari portal.', 5.3, [[0, .3, 'SEKAR']]],
  ['e10', 'SEKAR', '"Mulai besok, Mas cuma boleh bicara pakai naskah dari saya."', 3.7, [[0, 1, 'SEKAR']]],
  ['e11', 'DIMAS', 'Aku coba bilang, "Tapi, Bu..." "BICARA. SESUAI. NASKAH." bunyi drone itu.', 5.0, [[.3, .46, 'DIMAS']]],
  ['e12', 'IBU', '"Le, itu lalat apa?" tanya Ibu... lalu dia memukulnya pakai sutil.', 4.4, [[0, .34, 'IBU']]],
  ['e13', 'SEKAR', '"Pikirkan baik-baik, Mas. Oh ya... soal Bambang, jangan terlalu dipikirkan. Dia nggak akan lama," kata Bu Sekar. Lalu portalnya tertutup.', 8.2, [[0, .74, 'SEKAR']]],
  ['e14', 'IBU', 'Ibu cuma bilang, "Le... itu tadi kayak sales panci."', 3.4, [[.38, 1, 'IBU']]],
  ['e15', 'BATIN', 'Anggaran 10 kali lipat... tapi aku nggak boleh ngomong pakai kata-kataku sendiri. Aku harus gimana?', 6.0, []],
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
place('e3', t + .2); T.grab = at('e3', .62); t = shot(t, L.e3.t1 + .15, 'grab', 'teras');
place('e4', t + .2); t = shot(t, L.e4.t1 + .2, 'ibuAsk', 'teras');
T.close1 = t + .3; place('e5', t + .2); t = shot(t, Math.max(L.e5.t1 + .3, T.close1 + 1.0), 'close1', 'teras');
// TAWARAN SEKAR
const offerA = t; place('e6', t + .3); place('e7', L.e6.t1 + .35);
T.holo = [at('e7', .22), at('e7', .62), at('e7', .8)];
t = shot(t, L.e7.t1 + .3, 'sekarOffer', 'teras');
place('e8', t + .2); t = shot(t, L.e8.t1 + .35, 'dazzled', 'teras');
// SYARAT: drone
const droneA = t; place('e9', t + .2); T.droneOut = at('e9', .5); place('e10', L.e9.t1 + .3); t = shot(t, L.e10.t1 + .2, 'drone', 'teras');
place('e11', t + .2); T.nope = at('e11', .5); t = shot(t, L.e11.t1 + .2, 'nope', 'teras');
place('e12', t + .2); T.swat = at('e12', .82); t = shot(t, L.e12.t1 + .5, 'swat', 'teras');
// ANCAMAN
const threatA = t; place('e13', t + .25); T.whisper = at('e13', .55); T.close2 = at('e13', .86); t = shot(t, L.e13.t1 + .3, 'threat', 'teras');
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
