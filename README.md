# Hawreirei — Content

Aset dan mesin video matematika 9:16 channel **Hawreirei**.

## `hawreirei-style/` — gaya rumah (terkunci)

| Path | Isi |
|---|---|
| `STYLE.md` | Spesifikasi gaya: dunia kertas berpetak tanpa panel, host stiker, watermark, struktur cerita, audio, alur VO, jebakan |
| `template/` | Film contoh yang bisa langsung dirender (KPK "Ani & Budi ke perpustakaan"): mesin Canvas 2D, stiker host, font, mix |
| `tools/new_film.sh` | Salin template untuk film baru |
| `tools/voice_prep.py` | mp3 narasi → `full.wav` 48 kHz + `env.json` |
| `tools/check_sync.py` | Verifikasi posisi suara di mix (harus +0,300 dtk) |
| `tools/cut_stickers.py` | Potong sheet stiker baru menjadi sprite PNG |
| `refs/` | Sheet stiker sumber |
| `examples/` | Naskah dan subtitle film yang sudah jadi |

Butuh pustaka [Lemo-Opuscar](https://github.com/lemomo-ai/lemo-opuscar) (MIT) di `/root/lemo-opuscar` untuk render, events, readcheck, dan instrumen musik.

```
git clone https://github.com/Hawreirei/Content /home/claude/content
sh /home/claude/content/hawreirei-style/tools/new_film.sh /home/claude/<judul>
```

Lisensi: kode mesin turunan Lemo-Opuscar (MIT); font OFL (lisensi di `template/fonts/`); stiker dan karakter Hawreirei milik kreator, tidak untuk dipakai ulang.
