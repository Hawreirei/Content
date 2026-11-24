# Gaya Hawreirei — spesifikasi terkunci

Gaya rumah untuk semua video matematika 9:16 channel Hawreirei. Berlaku untuk semua topik: soal cerita, konsep, sejarah, dan fun fact. Dasarnya Comic History Cartoon (Lemo-Opuscar), tanpa kotak panel.

Contoh lengkap: `template/` (film "Ani & Budi ke perpustakaan", KPK, 63 detik, VO suara sendiri).

## 1. Prinsip

1. **Satu dunia utuh, bukan panel.** Seluruh film terjadi di satu lembar kertas berpetak besar (grid 60 px, garis tebal tiap 300 px) di atas meja kayu. Perpindahan adegan hanya lewat kamera: geser, push-in, pull-out, whip.
2. **Jumlah "tempat" bebas.** Tambah kartu atau area di lembar sebanyak yang dibutuhkan penjelasan. Tidak ada batas 4 panel.
3. **Host = stiker kreator sendiri** (`sprites/`, `sprites30/`). Selalu hadir, melompat mengikuti kamera, dan pose berganti sesuai makna kalimat.
4. **Aset tanpa ElevenLabs.** Semua visual digambar oleh kode atau diambil dari stiker kreator. Narasi direkam kreator sendiri; Claude menulis naskah bertag lalu menyinkronkan.
5. **Soal cerita harus jelas secara visual.** Konteks harus bisa dipahami dari gambar tanpa narasi. Contoh yang ditolak: dua bus "tiap 15 dan 20 menit" yang berangkat bersamaan (ambigu). Contoh yang diterima: Ani ke perpustakaan tiap 3 hari dan Budi tiap 4 hari, dengan kalender yang berjalan.

## 2. Struktur cerita (45–65 detik)

| Bagian | Isi | Catatan |
|---|---|---|
| Hook | Kartu soal sudah utuh di frame 1, karena frame 1 adalah thumbnail | Label pill + pertanyaan; jawaban belum terlihat |
| Cerita | Dunia memperagakan soalnya (tokoh bergerak, kalender/benda dihitung oleh kode) | Penonton ikut menebak |
| Payoff | Momen jawaban: cap (stamp) + guncangan kamera + lonceng | Satu ide saja |
| Cara/aturan | Kamera pindah ke area cara cepat (mis. daftar kelipatan) | Hubungkan ke cerita |
| Jebakan/insight | Kesalahan umum, ditandai cap merah (mis. "BUKAN 12!") | Jangan melabeli cara yang valid sebagai salah |
| Tantangan | Kartu pill merah **TANTANGAN** + soal baru + "jawab di komentar ↓" | Variasi kecil dari soal utama |
| CTA | Kartu pill biru **KOMENTAR**: "Mau dibahas soal apa lagi? tulis di komentar ↓" | Selalu ada, setelah tantangan |
| Penutup | Pull-back ke seluruh lembar, host melambai | Tanpa teaser video lain |

Aturan pedagogis dan audit 5 pertanyaan di skill /vmath (bagian 2 dan 2b) tetap berlaku.

## 3. Kanvas, zona, dan tipografi

- 1080×1920, 24 fps. Elemen terlihat bergerak "on twos" (`twos(t)`), kamera halus.
- **Kartu hook** di koordinat dunia (540, 560) dengan kamera z = 1 di frame 1; teks hook harus utuh di frame 1.
- **Blok bawah (tata letak tetap di layar):**
  - Caption = narasi persis seperti diucapkan, dengan ejaan tampilan dan angka berupa digit. Kotak krem bergaris tinta, IM Fell 56 px, paling banyak 2 baris seimbang dan lebar 900 px. **Sisi bawah di y 1480** (`CAP_BOTTOM`).
  - **Watermark** "HAWREIREI" tepat di bawah caption: Lilita 40 px, letterSpacing 10, isi tinta + tepi krem, opasitas 40%, di (W/2, **y 1530**) (`WM_Y`). Muncul pelan mulai 5,2 dtk dan ditandai `pass` untuk readcheck.
  - **Di bawah y 1560 tidak ada apa pun yang penting**: area itu ditutupi UI aplikasi (nama akun, deskripsi, judul lagu di TikTok/Shorts/Reels).
- **Konten cerita di y 160–1380 layar.** Atur kamera (f y) supaya tokoh, kartu, dan rumus selesai di atas kotak caption. Kalau ada yang tertutup, geser kamera, jangan geser blok bawah.
- **Kartu hook = caption pembuka.** Selama kartu hook memenuhi layar (sebelum pull-back pertama), kotak caption tidak ditampilkan karena narasinya sudah tertulis di kartu. Kartu hook harus di y 240–1680 agar utuh di grid profil TikTok (potongan 3:4).
- **Zona aman:** konten penting di x 60–940. Jangan ada apa pun yang penting di kanan (x > 900) pada y 900–1500 (tombol TikTok).
- **Huruf cetak di kartu:** Lilita One.
  - Angka kuning `#F2B632` bertepi tinta.
  - Bagian pertanyaan merah `#C8463A`.
  - Nama tokoh berwarna sesuai tokoh: `#E2A93B` (A), `#4F86B5` (B), `#5E9A5A` (C).
- **Pill label:** tinta untuk label topik, merah untuk TANTANGAN, biru `#2D5F8A` untuk KOMENTAR.
- **Rumus:** pakai `mathtext.js` (`R{}` akar, `C{}`, `^{}` pangkat) dan font Old Standard TT untuk angka matematika.
- **Palet dasar** (`config.js`): kertas `#F1E9D6`, tinta `#2B2219`, merah `#C8463A`, kuningan `#D9B158`, caption `#F5E9C4`, meja `#7B6A57`.

## 4. Host (stiker)

- Ukuran: `BODY_H = 380` (tinggi tubuh di dunia). Skala per sheet: `SHEET_BODY = { a: 361, b: 510 }`. Kaki host berada di y + 195.
- Animasi:
  - pop (pantulan) setiap ganti pose;
  - napas `1 + .012·sin(3.1t)`;
  - terangkat sedikit saat suara berbunyi (`+.03 · env`, dari `vo/el/env.json`);
  - bayangan lembut.
- Saat berjalan, pakai `walkA`/`walkB` bergantian 4× per detik, tanpa pop.
- Peta pose (`POSE` di film.js):

| Nama | Sprite | Kapan dipakai |
|---|---|---|
| neutral | a0 | diam |
| palms | a1 | mengajukan pertanyaan hook |
| cheer | a2 | payoff, jawaban ketemu |
| cheeks | a3 | kaget/takjub |
| armsup | a4 | "ayo kita cari!" |
| present | a5 | memperkenalkan kartu (CTA) |
| think | b1 | berpikir, membaca soal |
| idea | b2 | aturan/konsep kunci |
| pointyou | b3 | "hati-hati!", "giliranmu" |
| confused | b4 | bingung |
| wrong | b5 | miskonsepsi, "BUKAN …!" |
| thumbs | b6 | benar |
| write | b7 | menulis langkah |
| wave | b14 | penutup |
| walkA / walkB | b15 / b16 | mengikuti perjalanan kamera |
| shrug | b17 | "kok bisa?" |
| clap | b18 | merayakan |
| pointer | b21 | menunjuk aturan dengan tongkat |
| crossed | b24 | menantang |

  Sprite lain di `sprites30/`: 8 bicara, 9 kedip, 10 menunjuk kiri, 11 tertawa, 13 memegang kertas, 19 kaca pembesar, 20 gulungan, 22 ponsel, 25–30 kepala close-up. Pose 12 dan 23 sedikit off-model; hindari.
- **Stiker baru:**
  1. Buat sheet di latar polos satu warna dengan jarak lebar antarstiker.
  2. Jalankan `python3 tools/cut_stickers.py SHEET.png template/sprites30 --prefix p` (keluarannya diperbesar 2× dan diberi unsharp).
  3. Periksa `_index.jpg`: kotak merah berarti pose terpotong di tepi gambar.
  4. Sheet dengan latar berhias (awan dan sebagainya) tidak bisa dipotong otomatis.

## 5. Tokoh pendukung

- Anak SD (`chars.js` → `buildKid('ani'|'bud')`) adalah wayang kode berseragam merah-putih, dengan label nama berwarna di atas kepala. Tokoh ketiga cukup memakai warna C.
- Rencana: sheet stiker anak dengan gaya yang sama seperti host, supaya gaya gambarnya seragam.

## 6. Audio

- Skor orisinal C mayor 112 bpm: shaker, cellos_pizz, woodblock, melodi marimba, glockenspiel. Tubular bells menandai payoff.
- Foley sintesis: hop, pop, swish, slap, chime, stamp, scribble, tick.
- Mix:
  - musik turun 4 dB di bawah suara, ditambah −6 dB di pita bicara;
  - suara ±10 dB di atas musik;
  - master −14 LUFS lewat `mux.sh`.

## 7. Alur narasi suara sendiri

1. Claude menulis **naskah bertag** untuk ElevenLabs (tag ekspresi seperti `[curious]`, `[excited]`, `[warmly]`).
   - Angka ditulis dengan huruf.
   - Aksen dipakai bila perlu, mis. "ka-pé-ka" (é seperti pada "pelan").
   - Satu baris per kalimat, sama dengan `vo/el/lines.txt`.
   - Kalimat harus persis menggambarkan apa yang terlihat di layar; tidak ada baris yang tidak divisualkan.
2. Kreator merekam di ElevenLabs dan mengirim mp3.
3. `$LIB/.venv/bin/python tools/voice_prep.py narasi.mp3 FILM` menghasilkan `full.wav` **48 kHz** dan `env.json`.
4. Jalankan `cd FILM && $LIB/.venv/bin/python vo/el/align.py`. Hasilnya `align.json`: segmen per baris dan jeda di dalam baris.
5. Isi `T`, `DAYK`/keyframe, dan `SAY` (caption dengan indeks pemisah segmen) dari waktu segmen + `VO_OFF = 0.3`. Visual mendarat tepat saat kata diucapkan.
6. Render, mix, lalu `tools/check_sync.py FILM`: ketiga jendela harus bergeser +0,300.

## 8. Render dan cek

```
LIB=/root/lemo-opuscar; F=/home/claude/<film>; export PATH=<ffmpeg ≥7>:$PATH
cd $LIB
node core/render/events.mjs $F --size 1080x1920 --out $F/out/events.json
.venv/bin/python $F/mix.py
node core/render/readcheck.mjs $F --step 0.2 --size 1080x1920
node core/render/video.mjs $F --size 1080x1920 --fps 24 --workers 2 --out $F/out/video.mp4   # nohup … & lalu poll
sh core/render/mux.sh $F/out/video.mp4 $F/out/mix.wav $F/<judul>.mp4 24 1
$F/review.sh 0.5 8 22 40 58      # contact sheet → review/sheet.jpg
```

## 8b. Cek tepi layar

`tools/edges.mjs` (salin ke `$LIB/core/render/`) mendaftar teks yang terpotong tepi kiri/kanan saat kamera diam. Film perlu `window.__ALLTXT` dan `window.__MOVING` (lihat `films/kali-45`). Wajib kosong sebelum render final.

## 9. Jebakan yang sudah ditemukan

- **Suara mendahului gambar** disebabkan wav 44,1 kHz yang dicampur ke mix 48 kHz. Selalu lewat `voice_prep.py`. Memindahkan keyframe visual tidak menyelesaikan masalah ini.
- Watermark di tengah layar (H/4) menimpa teks kartu. Karena itu watermark dipindah ke footer, tepat di bawah caption.
- Caption yang sisi bawahnya di y 1640 masuk area UI aplikasi; batasnya y 1480.
- `rich()` memberi tepi tinta pada setiap potongan berwarna. Kalimat panjang berwarna jadi gemuk, jadi warna hanya untuk angka, nama, dan frasa pendek; sisanya `C.ink`.
- Butir/benda kecil di hook tak terbaca di thumbnail. Zoom kamera hook ≥ 1,9 atau benda diperbesar.
- Balon atau label yang muncul terlalu dekat dengan perpindahan kamera gagal readcheck. Majukan 0,3–0,6 dtk.
- Teks yang berganti cepat (angka berjalan) diberi `pass` di readcheck.
- Kamera di kartu 1000 px pakai z 0,85, host di x layar ±95 (k 0,72): host tidak terpotong dan tidak menutup teks kartu.
- `rich()` harus memaksa `textAlign = 'left'`; kalau tidak, teks ikut rata tengah dari pemanggilan sebelumnya dan bergeser.
- Baris kartu yang bertetangga diberi jarak ≥ 1.450 px supaya tidak mengintip di atas/bawah layar.
- Sheet stiker yang posenya terpotong di tepi gambar (close-up) tidak bisa dipakai. Minta sheet ulang dengan margin.
