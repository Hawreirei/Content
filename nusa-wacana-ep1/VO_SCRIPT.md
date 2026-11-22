# Naskah Rekaman Suara — Nusa Wacana EP 1/30

Film ini sudah lengkap tanpa suara: subtitle, musik, dan efek suara sudah ada. Setiap baris di bawah sudah punya **slot waktu**, dan mulut tokoh sementara bergerak mengikuti amplop suku kata. Begitu rekaman masuk, mulut akan mengikuti suara asli.

## Cara memasukkan rekaman

1. Rekam **satu file per baris**, potong hening di awal dan akhir, lalu simpan sebagai `voices/<id>.wav` (contoh: `voices/b1.wav`).
2. Usahakan durasinya **tidak melebihi kolom "Maks"**. Kalau lebih panjang, ubah `t0` baris berikutnya di `story.js`.
3. Jalankan `sh build.sh`. Langkah ini membuat `voices/dur.json` dan `voices/lips.json`, merender ulang, memasukkan suara, dan menurunkan musik di bawah dialog.

## Karakter suara

| Tokoh | Arahan |
|---|---|
| **DIMAS** (28) | panik, cepat, nada agak tinggi; suara orang baik yang kewalahan |
| **DIMAS · BATIN** (narasi) | suara Dimas yang sama tapi lebih tenang dan dekat ke mikrofon, seperti bercerita ke penonton |
| **IBU** (55) | datar total (deadpan), pelan, logat Jawa tipis ("Le"); tidak pernah terkesan oleh apa pun |
| **PAK BAMBANG** (62) | berat, menggelegar, merendahkan dengan ramah ("Dik"); tertawa di dalam kalimat |
| **BU SEKAR** (54) | rendah, halus, dingin; setiap kata seperti sudah dihitung ("Mas") |
| **WARGA** | riang, sekilas |

## Baris

| id | Tokoh | Kalimat (dibaca) | Mulai (dtk) | Maks (dtk) | Arahan |
|---|---|---|---|---|---|
| h1 | BAMBANG | Dik Dimas! | 0,15 | 0,8 | teriak, menimpa h2 |
| h2 | SEKAR | Mas Dimas! | 0,50 | 0,8 | teriak tertahan, bertumpuk dengan h1 |
| h3 | DIMAS | Aku cuma wali kota! | 1,20 | 1,3 | jeritan panik |
| h4 | BATIN | Kok bisa begini? | 2,75 | 0,95 | datar, gambar membeku |
| n1 | BATIN | Tiga tahun lalu, kota ini tenggelam tiap Februari. | 4,65 | 3,3 | membuka cerita |
| n2 | BATIN | Banjir. | 8,90 | 0,6 | satu kata, pas di potongan gambar |
| n3 | BATIN | Sampah. | 10,15 | 0,6 | sama |
| n4 | BATIN | Pungli. | 11,40 | 0,6 | sama |
| n5 | BATIN | Kata orang, nggak bisa dibenerin. | 12,70 | 2,0 | pahit |
| n6 | BATIN | Aku dulu cuma ojol yang hobi lapor jalan bolong. | 15,30 | 3,1 | sedikit geli pada diri sendiri |
| n7 | BATIN | Laporanku nggak pernah dibalas. | 18,65 | 2,1 | |
| n8 | BATIN | Jadi aku nyalon sendiri. Modal patungan warga. | 21,40 | 2,9 | bangga yang tertahan |
| v1 | WARGA | Pak Wali! | 24,55 | 0,8 | riang |
| n9 | BATIN | Sekarang umurku dua puluh delapan, dan aku wali kotanya. | 25,45 | 2,9 | |
| n10 | BATIN | Di Nusa Wacana, itu sah. | 28,45 | 1,6 | kering |
| i1 | IBU | Makan dulu, Le. Wali kota juga butuh gorengan. | 37,30 | 3,1 | deadpan |
| d1 | DIMAS | Iya, Bu. | 40,50 | 0,9 | mulut penuh |
| i2 | IBU | Siapa, Le? | 43,95 | 1,0 | tanpa menoleh |
| d2 | DIMAS | ...Calon presiden, Bu. | 45,35 | 1,5 | berbisik kaget, lalu menelan ludah |
| b1 | BAMBANG | Dik Dimas! Anak muda kayak kamu itu laku. | 48,30 | 2,7 | megah |
| b2 | BAMBANG | Jadi wakil saya, ya? Besok pagi saya tunggu jawabannya. | 51,05 | 3,3 | memerintah sambil tersenyum |
| i3 | IBU | Gorengan, Pak? | 54,95 | 1,0 | datar, menyodorkan |
| s1 | SEKAR | Mas Dimas. Jangan jawab Bambang dulu. | 58,65 | 2,4 | dingin |
| b3 | BAMBANG | Lho, Sekar?! | 61,15 | 0,9 | mulut penuh tempe |
| s2 | SEKAR | Tawaran saya jauh lebih baik. | 62,30 | 1,9 | senyum tipis |
| i4 | IBU | Le... tempenya gosong. | 66,90 | 1,7 | memecah hening, tetap datar |
| n11 | BATIN | Malam ini aku harus jawab apa? | 69,00 | 2,0 | langsung ke penonton |

Hening sengaja dari 64,4 sampai 66,9 detik: jangan diisi suara.
