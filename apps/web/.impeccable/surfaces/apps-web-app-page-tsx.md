---
version: 1
slug: "apps-web-app-page-tsx"
primary_target: "apps/web/app/page.tsx"
related_targets: []
---

# Landing page Corely — kontrak arah

Mode: Persuade (halaman pembuka publik; pengunjung memutuskan dan menekan tombol).

THESIS
Halaman ini berdiri di atas satu gagasan: input sekali, turunannya dihitung. Ia menolak susunan default kategori ini — judul di tengah, subjudul, lalu satu baris kartu ikon-berjudul-teks yang seragam. Gagasan itu bukan dijanjikan lewat teks, melainkan diperlihatkan sebagai dua kolom yang berhadapan.

OWN-WORLD
Ruang kerja biru di atas kertas dingin. Ground `slate-50` (`#f8fafc`), permukaan `#ffffff`, tinta `slate-900` (`#0f172a`), garis rambut `slate-200` (`#e2e8f0`), teks sekunder `slate-500` (`#64748b`). Satu aksen fungsional: biru `#2563eb` untuk tindakan, status aktif, dan penanda tanggal; tint `#eff6ff` untuk permukaan terpilih; hijau `#10b981` hanya untuk yang sudah selesai. Komponen: kartu `rounded-xl` (12px) dengan garis 1px dan bayangan tipis, tombol `rounded-lg`/`rounded-xl`, chip kapsul untuk jenis tanggal. Bahasa bentuknya adalah tabel: garis rambut, kolom bertakik, label kecil huruf besar berspasi lebar, angka yang berbaris. Nol gradien, nol ungu, nol kartu bersarang.

STORY
Pengunjung mengerti dalam satu layar bahwa semua modul lain di aplikasi ini adalah hasil hitungan dari satu daftar, bukan aplikasi terpisah yang harus diisi sendiri. Lalu ia percaya karena melihat barisnya berpasangan — kiri ditulis, kanan muncul — dan ia menekan tombol utama di bawah judul untuk masuk atau mulai.

FIRST VIEWPORT (1440×900)
Bar atas 64px: tanda Corely, nama modul sebagai tautan, tombol Masuk di kanan. Judul 54px di kiri atas (`Tulis sekali. Sisanya biar dihitung.`) dengan satu kalimat penjelas 17px di bawahnya, lalu dua tombol: utama biru `Mulai Sekarang`, sekunder berbingkai. Satu garis rambut memisahkan kepala halaman dari badan halaman. Badan halaman adalah dua kolom setara yang dipisah garis vertikal: kolom kiri berlabel `YANG ANDA TULIS SEKALI` berisi deretan baris input — kolom teks tugas dengan dua chip jenis tanggal dan tombol Simpan, lalu baris catatan, kebiasaan, bookmark dengan label modul di kanan tiap baris; kolom kanan berlabel `YANG CORELLY HITUNG SENDIRI` berisi baris tugas dengan lingkaran status, baris progres proyek dengan bar dan hitungan pecahan, dua baris tanggal berpenanda (Tenggat biru, Jadwal hijau), dan satu deret batang grafik. Setiap baris kanan sejajar dengan baris kirinya sebagai pasangan. Tindakan utama berada di kepala halaman, terlihat tanpa menggulir.

FORM
Posisi 4 dari 7 pada daftar susunan yang saya urutkan menurut kedekatan dengan produk (1 Lembar Hari, 2 Kotak Masuk Turunan, 3 Rel Waktu, 4 Buku Besar Dua Kolom, 5 Peta Modul, 6 Sebaran Bandingan, 7 Baris Bukti). Dipilih lewat undian dari ronde pilihan yang disajikan; pengguna mengunci kartu ini.
seed: 02f6584154921f62

FINISH
unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
