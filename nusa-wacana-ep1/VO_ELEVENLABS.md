# Teks VO untuk ElevenLabs — Nusa Wacana EP 1/30

Tempel **satu blok per generate** dan simpan hasilnya dengan nama id-nya (`h1.mp3`, `b1.mp3`, dan seterusnya).
Model: **Eleven v3**. Tag ekspresi `[...]` ditulis dalam bahasa Inggris karena v3 paling patuh pada tag berbahasa Inggris; kalimatnya tetap bahasa Indonesia.
"Maks" = panjang slot di video. Kalau hasilnya lebih panjang, kirim saja, nanti waktunya saya geser di `story.js`.

## Pengaturan

- **Satu suara untuk semua tokoh:** pakai suara Dimas untuk semuanya. Tag seperti `[deep voice]` dan `[slowly]` membantu membedakan tokoh, tapi tidak bisa mengubah warna suara sepenuhnya.
- **Lebih jelas:** pilih satu suara per tokoh dari Voice Library dengan teks yang sama.
- **Stability:** *Creative* untuk Dimas, Bambang, dan Warga; *Natural* untuk Ibu, Sekar, dan Batin.

## DIMAS (suara utama, 28 th, gampang panik)

**h3** · maks 1,3 dtk
```
[panicked, shouting] Aku cuma WALI KOTA!
```
**d1** · maks 0,9 dtk
```
[mouth full, casual] Iya, Bu.
```
**d2** · maks 1,5 dtk
```
[whispers, shocked] ...Calon presiden, Bu. [gulps]
```

## DIMAS · BATIN (narasi, suara Dimas, tenang, dekat ke mikrofon)

**h4** · maks 0,95 dtk
```
[flatly] Kok bisa begini?
```
**n1** · maks 3,3 dtk
```
[calm, storytelling] Tiga tahun lalu... kota ini tenggelam tiap Februari.
```
**n2** · maks 0,6 dtk
```
[flatly] Banjir.
```
**n3** · maks 0,6 dtk
```
[flatly] Sampah.
```
**n4** · maks 0,6 dtk
```
[flatly] Pungli.
```
**n5** · maks 2,0 dtk
```
[bitterly] Kata orang... nggak bisa dibenerin.
```
**n6** · maks 3,1 dtk
```
[chuckles at himself] Aku dulu cuma ojol... yang hobi lapor jalan bolong.
```
**n7** · maks 2,1 dtk
```
[sighs] Laporanku nggak pernah dibalas.
```
**n8** · maks 2,9 dtk
```
[quietly proud] Jadi aku nyalon sendiri... Modal patungan warga.
```
**n9** · maks 2,9 dtk
```
[warmly] Sekarang umurku dua puluh delapan... dan aku wali kotanya.
```
**n10** · maks 1,6 dtk
```
[dryly] Di Nusa Wacana, itu sah.
```
**n11** · maks 2,0 dtk
```
[uncertain, to the audience] Malam ini... aku harus jawab apa?
```

## IBU (55 th, datar total, pelan, logat Jawa tipis)

**i1** · maks 3,1 dtk
```
[deadpan, slowly] Makan dulu, Le. [sighs] Wali kota juga butuh gorengan.
```
**i2** · maks 1,0 dtk
```
[deadpan, not looking up] Siapa, Le?
```
**i3** · maks 1,0 dtk
```
[deadpan] Gorengan, Pak?
```
**i4** · maks 1,7 dtk
```
[deadpan, slowly] Le... tempenya gosong.
```

## PAK BAMBANG (62 th, berat, menggelegar, merendahkan dengan ramah)

**h1** · maks 0,8 dtk
```
[deep voice, shouting] Dik Dimas!
```
**b1** · maks 2,7 dtk
```
[deep voice, booming, jovial] Dik Dimas! [laughs] Anak muda kayak kamu itu... LAKU.
```
**b2** · maks 3,3 dtk
```
[deep voice, patronizing] Jadi wakil saya, ya? Besok pagi... saya tunggu jawabannya.
```
**b3** · maks 0,9 dtk
```
[deep voice, mouth full, surprised] Lho, Sekar?!
```

## BU SEKAR (54 th, halus, dingin, setiap kata seperti sudah dihitung)

**h2** · maks 0,8 dtk
```
[sharply] Mas Dimas!
```
**s1** · maks 2,4 dtk
```
[soft, cold] Mas Dimas. [pause] Jangan jawab Bambang dulu.
```
**s2** · maks 1,9 dtk
```
[smug, quietly] Tawaran saya... jauh lebih baik.
```

## WARGA

**v1** · maks 0,8 dtk
```
[cheerfully, calling out] Pak Wali!
```

## Versi sekaligus, gaya narasi (dipakai)

Semua dibacakan oleh Dimas sebagai pencerita, dengan keterangan siapa yang bicara ("kata Pak Bambang", "Ibu bilang"). Tempel sekaligus di Eleven v3, lalu kirim satu file hasilnya.

```
[imitating a deep, booming voice] "Dik Dimas!" [normal voice] teriak Pak Bambang.

[imitating a sharp, cold voice] "Mas Dimas!" [normal voice] sahut Bu Sekar.

[panicked, shouting] "Aku cuma WALI KOTA!" [breathless] teriakku.

[flatly] Kok bisa begini?

[calm, storytelling] Tiga tahun lalu... kota ini tenggelam tiap Februari.

[flatly] Banjir.

[flatly] Sampah.

[flatly] Pungli.

[bitterly] Kata orang... nggak bisa dibenerin.

[chuckles at himself] Aku dulu cuma ojol... yang hobi lapor jalan bolong.

[sighs] Laporanku nggak pernah dibalas.

[quietly proud] Jadi aku nyalon sendiri... Modal patungan warga.

[cheerfully] "Pak Wali!" panggil warga.

[warmly] Sekarang umurku dua puluh delapan... dan aku wali kotanya.

[dryly] Di Nusa Wacana, itu sah.

[fondly] Malam itu Ibu bilang, [imitating a slow, flat voice] "Makan dulu, Le. Wali kota juga butuh gorengan."

[mouth full] "Iya, Bu," jawabku.

[deadpan] "Siapa, Le?" tanya Ibu, tanpa menoleh.

[whispers, shocked] "...Calon presiden, Bu," bisikku. [gulps]

[imitating a deep, booming voice] "Dik Dimas! [laughs] Anak muda kayak kamu itu... LAKU," [normal voice] kata Pak Bambang.

[imitating a deep, patronizing voice] "Jadi wakil saya, ya? Besok pagi saya tunggu jawabannya," [normal voice] katanya lagi.

[deadpan] Ibu cuma bilang, "Gorengan, Pak?"

[imitating a soft, cold voice] "Mas Dimas. Jangan jawab Bambang dulu," [normal voice] kata Bu Sekar.

[amused] "Lho, Sekar?!" kata Pak Bambang, mulutnya penuh tempe.

[imitating a smug, quiet voice] "Tawaran saya... jauh lebih baik," [normal voice] kata Bu Sekar.

[long pause] Lalu Ibu bilang... [deadpan] "Le... tempenya gosong."

[uncertain, to the audience] Malam ini... aku harus jawab apa?
```
