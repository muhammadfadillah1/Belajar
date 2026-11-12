# Belajar PLTU

Web belajar PLTU batubara: slide peralatan, siklus utama (diagram interaktif), perbandingan unit 150 MW vs 380 MW, ringkasan SOP umum, dan kuis dengan pembahasan.

## Cara pakai
Tidak perlu install apa-apa. Buka `index.html` langsung di browser, atau aktifkan GitHub Pages (Settings → Pages → branch ini, folder root).

## Struktur
- `index.html` — kerangka halaman
- `assets/data.js` — **semua materi** (peralatan, siklus, data unit, SOP, bank soal). Edit di sini.
- `assets/dcs-data.js` — kamus istilah DCS, peta layar, data ekstraksi/drain/bocoran unit 150 MW, skenario simulator, soal DCS
- `assets/dcs.js` — DCS Lab (simulator gangguan, peta layar, kamus/flashcard) + diagram ekstraksi unit 150 MW
- `assets/app.js` — logika halaman, slide, dan kuis
- `assets/style.css` — tampilan (mendukung mode gelap)

## Menambah materi
- Alat baru: tambah objek di array `PERALATAN`. Soal "fungsi alat" & "tindakan gangguan" otomatis dibuat dari data ini.
- Soal manual: tambah di array `SOAL` (`k` = kategori, `p` = pilihan, `a` = index jawaban benar, `e` = pembahasan).
- Data unit: ganti nilai di `UNIT.baris` sesuai data sheet unit kamu.

## DCS Lab
Simulator latihan berbasis tampilan DCS turbin unit 150 MW (beban ±64 MW). Modelnya disederhanakan untuk latihan reaksi & baca alarm, bukan simulator dinamik pabrik. Setpoint alarm/trip yang dipakai adalah nilai tipikal; ubah di `assets/dcs.js` (fungsi `step`) bila ingin disesuaikan dengan logic unit.

## Disclaimer
Materi bersifat edukasi umum untuk PLTU subkritis. Angka adalah nilai tipikal dan langkah SOP adalah ringkasan, **bukan SOP resmi**. Selalu ikuti SOP/IK, manual OEM, dan instruksi supervisor di unit masing-masing.
