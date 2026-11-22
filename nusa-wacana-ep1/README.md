# Nusa Wacana — EP 1/30 "Dua Telepon, Satu Malam"

Serial satire interaktif untuk Instagram Reels, dalam gaya **Sci-Fi Sitcom Toon**. 1080×1920, 24 fps, 107,6 detik, −14 LUFS. VO: satu suara (Dimas sebagai pencerita), linimasa mengikuti rekaman.
Semua gambar, musik, dan efek suara dibuat dengan kode, tanpa ElevenLabs. Suara dialog menyusul.

| File | Isi |
|---|---|
| `nusa-wacana-ep1.mp4` | film dengan VO (subtitle tertanam) |
| `poster.jpg` | sampul (frame hook) |
| `subtitles_id.srt` | subtitle dalam berkas terpisah |
| `VO_SCRIPT.md` | naskah rekaman suara: id baris, slot waktu, arahan per tokoh |
| `TREATMENT.md` | treatment: struktur, shot list, cue map, desain suara |
| `CREDITS` | sumber aset dan lisensi |
| `story.js` | linimasa: baris, shot, wipe, tag, ketukan, cue musik |
| `chars.js` / `worlds.js` / `main.js` | tokoh, dunia, dan penyutradaraan per shot |
| `audio.py` | skor, foley, ambience, dan mix |
| `build.sh` | bangun ulang semuanya dengan satu perintah |

**Kanon tokoh:** nama lengkap **Dimas Sukma Wardhana**, julukan **"Dimas Ngarep"** (nama di formulir Ep 1 adalah julukannya). Instagram: **@dimasskmwrdhn**.

VO: simpan rekaman utuh sebagai `voices/raw.mp3` lalu ubah ke `voices/raw.wav` (48 kHz mono), lalu jalankan `sh build.sh`. Rentang tiap baris di rekaman ada di `story.js` (RAW).
