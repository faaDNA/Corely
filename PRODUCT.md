# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Satu orang yang mengelola seluruh aktivitas digital pribadinya: tugas kuliah/kerja, proyek jangka panjang, catatan, bookmark, kebiasaan harian, dan jadwal. Dipakai setiap hari, sering kali pada pagi hari untuk menentukan prioritas, lalu berulang kali sepanjang hari saat mencatat dan menandai selesai. Saat ini hanya pemilik yang memakai, tetapi produk disiapkan agar orang lain bisa mendaftar dan memakainya sendiri.

## Product Purpose

Corely menyatukan seluruh modul produktivitas pribadi ke dalam satu dashboard: tugas, proyek, catatan, bookmark, kebiasaan, dan kalender. Tujuannya menghapus fragmentasi antar-aplikasi dan menghapus pekerjaan administratif yang berulang, sehingga pengguna fokus mengeksekusi pekerjaan alih-alih merawat datanya. Keberhasilan berarti pengguna membuka satu halaman, langsung tahu prioritas hari ini, dan menutup aplikasi tanpa merasa perlu mengecek tempat lain.

## Positioning

Setiap modul lain ikut menghitung ulang secara otomatis dari satu sumber data: status dan progres proyek diturunkan dari tugas, sedangkan kalender menggabungkan tenggat, jadwal, dan batas proyek tanpa entri terpisah. Pengguna tidak pernah menginput satu peristiwa dua kali, dan tidak pernah memperbarui status secara manual. Bukan kanvas bebas yang harus dirakit sendiri, melainkan alur kerja yang sudah terstruktur dan disiplin.

## Operating Context

- Dipakai di browser: desktop dan laptop di rumah/kantor, ponsel saat bergerak.
- Sesi pemakaian berulang dan singkat; pembacaan cepat lebih penting daripada penelusuran mendalam.
- Dipakai dalam dua kondisi cahaya berbeda (terang dan gelap), sehingga tema terang dan gelap sama-sama harus terasa utuh.
- Pengingat tugas berbasis waktu zona WIB (GMT+7) dikirim lewat notifikasi push.

## Capabilities and Constraints

- **Modul berfungsi:** Dashboard, Tugas, Proyek, Catatan (Markdown), Bookmark, Kebiasaan, Kalender, Pencarian Global, Analitik, Notifikasi, Pengaturan, Akun.
- **Status tugas:** `TODO` dan `COMPLETED` saja.
- **Mode tanggal tugas:** tanpa tanggal, tenggat, atau jadwal; waktu opsional dan ditampilkan pada mode tenggat maupun jadwal.
- **Status proyek:** diturunkan dari tugas, bukan kolom tersendiri.
- **Kalender:** agregasi otomatis dari tenggat + jadwal + batas proyek; tidak ada entri manual.
- **Hapus:** soft delete dengan retensi 5 bulan; tugas `TODO` yang dihapus keluar dari statistik, tugas `COMPLETED` tetap dihitung sampai purge.
- **Bahasa:** antarmuka sepenuhnya Bahasa Indonesia.
- **Tumpukan:** Next.js App Router, TypeScript, Tailwind, Supabase.

## Brand Commitments

- **Nama:** Corely.
- **Warna wajib:** keluarga biru sebagai warna identitas (`brand.500 #3b82f6`, `brand.600 #2563eb`). Gradien ungu dilarang di seluruh produk dan tidak boleh kembali.
- **Gaya bahasa:** Bahasa Indonesia yang jelas dan langsung, memakai istilah yang dipahami pengguna awam (tanpa jargon teknis), tanpa basa-basi berlebihan.

## Evidence on Hand

- Aplikasi nyata yang sudah berjalan penuh (15 route) — tangkapan layar interface asli bisa diambil dari aplikasi itu sendiri.
- Tidak ada testimoni, jumlah pengguna, atau metrik publik. Tidak ada satu pun klaim komersial yang boleh dikarang.

## Product Principles

1. **Satu kali input.** Setiap data ditulis sekali; turunannya dihitung, bukan diketik ulang.
2. **Hari ini dalam sekali lihat.** Prioritas terdekat harus terbaca tanpa klik atau filter.
3. **Disiplin di atas kebebasan.** Struktur sudah ditentukan dan sengaja dibatasi agar tidak menjadi proyek perakitan.
4. **Ringan dipakai harian.** Cepat dibuka, konsisten di semua perangkat, nyaman dalam pemakaian berulang.
5. **Data itu milik pengguna.** Pribadi, terisolasi per akun, dan tidak mengarang klaim tentang diri sendiri.

## Accessibility & Inclusion

- Kontras teks memenuhi WCAG AA pada tema terang dan gelap; label sekunder di atas permukaan berwarna diturunkan dari warna permukaan itu, bukan abu-abu generik.
- Struktur semantik (heading berurutan, landmark, label form) dan navigasi keyboard yang terlihat fokus.
