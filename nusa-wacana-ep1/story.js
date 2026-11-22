// story.js — satu sumber kebenaran: baris dialog, shot, wipe, tag, ketukan kunci, cue musik
// 96 bpm: 1 ketukan = 0,625 dtk, 1 bar = 2,5 dtk
export const BPM = 96, BEAT = 60 / BPM;
export const DUR = 83.5;
export const q = t => Math.floor(t * 12 + 1e-6) / 12;          // waktu gambar "on twos"

// Baris: id, siapa, teks subtitle, tts (teks untuk direkam: angka ditulis huruf), t0, durasi perkiraan
// Durasi akan diganti oleh durasi rekaman sungguhan (voices/dur.json) saat suara datang.
export const LINES = [
  ['h1', 'BAMBANG', 'Dik Dimas!', null, 0.15, 0.8],
  ['h2', 'SEKAR', 'Mas Dimas!', null, 0.5, 0.8],
  ['h3', 'DIMAS', 'Aku cuma wali kota!', null, 1.2, 1.25],
  ['h4', 'BATIN', 'Kok bisa begini?', null, 2.75, 0.95],
  ['n1', 'BATIN', 'Tiga tahun lalu, kota ini tenggelam tiap Februari.', null, 4.65, 3.2],
  ['n2', 'BATIN', 'Banjir.', null, 8.9, 0.6],
  ['n3', 'BATIN', 'Sampah.', null, 10.15, 0.6],
  ['n4', 'BATIN', 'Pungli.', null, 11.4, 0.6],
  ['n5', 'BATIN', 'Kata orang, nggak bisa dibenerin.', null, 12.7, 2.0],
  ['n6', 'BATIN', 'Aku dulu cuma ojol yang hobi lapor jalan bolong.', null, 15.3, 3.0],
  ['n7', 'BATIN', 'Laporanku nggak pernah dibalas.', null, 18.65, 2.0],
  ['n8', 'BATIN', 'Jadi aku nyalon sendiri. Modal patungan warga.', null, 21.4, 2.8],
  ['v1', 'WARGA', 'Pak Wali!', null, 24.55, 0.7],
  ['n9', 'BATIN', 'Sekarang umurku 28, dan aku wali kotanya.', 'Sekarang umurku dua puluh delapan, dan aku wali kotanya.', 25.45, 2.7],
  ['n10', 'BATIN', 'Di Nusa Wacana, itu sah.', null, 28.45, 1.5],
  ['i1', 'IBU', 'Makan dulu, Le. Wali kota juga butuh gorengan.', null, 37.3, 2.9],
  ['d1', 'DIMAS', 'Iya, Bu.', null, 40.5, 0.7],
  ['i2', 'IBU', 'Siapa, Le?', null, 43.95, 0.8],
  ['d2', 'DIMAS', '...Calon presiden, Bu.', null, 45.35, 1.5],
  ['b1', 'BAMBANG', 'Dik Dimas! Anak muda kayak kamu itu laku.', null, 48.3, 2.5],
  ['b2', 'BAMBANG', 'Jadi wakil saya, ya? Besok pagi saya tunggu jawabannya.', null, 51.05, 3.1],
  ['i3', 'IBU', 'Gorengan, Pak?', null, 54.95, 0.9],
  ['s1', 'SEKAR', 'Mas Dimas. Jangan jawab Bambang dulu.', null, 58.65, 2.3],
  ['b3', 'BAMBANG', 'Lho, Sekar?!', null, 61.15, 0.8],
  ['s2', 'SEKAR', 'Tawaran saya jauh lebih baik.', null, 62.3, 1.8],
  ['i4', 'IBU', 'Le... tempenya gosong.', 'Le... tempenya gosong.', 66.9, 1.6],
  ['n11', 'BATIN', 'Malam ini aku harus jawab apa?', null, 69.0, 1.9],
];

// Shot: [t0, t1, nama, dunia (untuk ambience)]
export const SHOTS = [
  [0.0, 3.75, 'hook', 'teras'],
  [3.75, 4.375, 'wipeIn', 'none'],
  [4.375, 8.75, 'dam', 'tanggul'],
  [8.75, 10.0, 'flood', 'banjir'],
  [10.0, 11.25, 'trash', 'banjir'],
  [11.25, 12.5, 'pungli', 'banjir'],
  [12.5, 15.0, 'youngCU', 'banjir'],
  [15.0, 21.25, 'pothole', 'jalan'],
  [21.25, 24.375, 'can', 'jalan'],
  [24.375, 32.5, 'city', 'kota'],
  [32.5, 36.875, 'title', 'none'],
  [36.875, 41.875, 'terrace2', 'teras'],
  [41.875, 43.75, 'watch1', 'teras'],
  [43.75, 45.0, 'terrace2b', 'teras'],
  [45.0, 47.5, 'dimasCU', 'teras'],
  [47.5, 54.3, 'bambang', 'teras'],
  [54.3, 56.25, 'tempe', 'teras'],
  [56.25, 58.125, 'watch2', 'teras'],
  [58.125, 61.0, 'sekar', 'teras'],
  [61.0, 62.2, 'whipB', 'teras'],
  [62.2, 64.375, 'whipS', 'teras'],
  [64.375, 68.75, 'standoff', 'teras'],
  [68.75, 72.5, 'meters', 'teras'],
  [72.5, 81.25, 'choices', 'none'],
  [81.25, 83.5, 'egg', 'teras'],
];
export const shotAt = t => SHOTS.find(s => t >= s[0] && t < s[1]) || SHOTS[SHOTS.length - 1];

// Wipe pusaran portal: [pusat waktu, setengah lebar]
export const WIPES = [[4.0, 0.42], [32.5, 0.3], [72.5, 0.32]];

// Tag terminal: [t0, t1, baris1, baris2, latar, warna teks]
export const TAGS = [
  [4.55, 8.6, 'RAWA SUMPEK', 'SEKARANG · KERING', '#0f3a3a', '#7ff0e6'],
  [8.85, 15.0, 'RAWA SUMPEK', '3 TAHUN LALU', '#2e2a1e', '#d8c98a'],
  [28.6, 32.45, 'UU NUSA WACANA PSL 1', 'SYARAT PEJABAT: PUNYA KTP', '#2a1a10', '#ffd36e'],
  [37.0, 41.8, 'RUMAH IBU', 'MALAM · KOMPOR FUSI ON', '#171437', '#ffd36b'],
];

// Ketukan kunci
export const T = {
  freeze: 2.6,            // hook membeku, musik terpotong
  photo: 16.6, sent: 18.3, zero: 19.4,
  coins: [21.6, 22.0, 22.3, 22.55],
  title: [32.5, 36.875],
  buzz1: 41.55, buzz2: 56.0,
  gulp: 46.9,
  open1: 47.5, open2: 58.125,
  chomp: 56.0, take: 55.6,
  silence: [64.375, 66.85],
  gosong: 66.9,
  choiceA: 73.75, choiceB: 74.375, choiceC: 75.0, cta: 76.25, punch: 77.5,
  egg: 81.25,
};

// Cue musik: [t0, t1, nama]
export const CUES = [
  [0.0, 2.6, 'panic'],
  [4.375, 8.75, 'theme'],
  [8.75, 15.0, 'tuba'],
  [15.0, 24.375, 'surf'],
  [24.375, 32.5, 'bright'],
  [32.5, 36.875, 'titleHit'],
  [36.875, 47.5, 'rhodes'],
  [47.5, 56.25, 'march'],
  [58.125, 61.0, 'celesta'],
  [61.0, 64.375, 'tremolo'],
  [68.75, 81.25, 'quiz'],
];
