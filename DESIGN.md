---
name: Corely
description: Ruang kerja presisi untuk produktivitas pribadi sehari-hari.
colors:
  action-blue: "#2563eb"
  action-blue-hover: "#3b82f6"
  action-blue-soft: "#eff6ff"
  action-blue-line: "#bfdbfe"
  action-blue-deep: "#1d4ed8"
  tenggat-amber: "#f59e0b"
  proyek-purple: "#a855f7"
  proyek-purple-ink: "#9333ea"
  done-green: "#10b981"
  done-green-line: "#6ee7b7"
  cool-paper: "#f8fafc"
  surface-white: "#ffffff"
  slate-ink: "#0f172a"
  slate-deep: "#020617"
  slate-muted: "#64748b"
  slate-quiet: "#94a3b8"
  hairline: "#e2e8f0"
  hairline-dark: "#1e293b"
  surface-dark: "#0f172a"
  ground-dark: "#020617"
  danger-red: "#dc2626"
typography:
  display:
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    fontSize: "3.4rem"
    fontWeight: 800
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  headline:
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.12em"
  chip:
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    fontSize: "0.625rem"
    fontWeight: 500
    lineHeight: 1.2
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  "2xl": "16px"
  full: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  "2xl": "32px"
  "3xl": "48px"
components:
  button-primary:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.xl}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.action-blue-hover}"
  button-outline:
    backgroundColor: "{colors.surface-white}"
    textColor: "#334155"
    rounded: "{rounded.xl}"
    padding: "14px 28px"
  button-inline:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  input:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
    height: "36px"
  card:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.xl}"
    padding: "20px"
  chip-action:
    backgroundColor: "{colors.action-blue-soft}"
    textColor: "{colors.action-blue}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  chip-quiet:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.slate-muted}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
---

# Design System: Corely

## Overview

**Creative North Star: "Ruang Kerja Presisi"**

Corely dibaca sebagai meja kerja yang sudah ditata sebelum dipakai: garis rambut yang memisahkan bagian, kolom yang bertakik, angka yang berbaris lurus, dan satu warna aksen yang hanya muncul saat ada sesuatu yang bisa ditekan atau ditandai. Tidak ada hiasan yang tidak mengerjakan apa pun — setiap garis memisahkan, setiap warna menandai keadaan.

Kepadatan sengaja menengah-tinggi: baris rapat, tipografi kecil, ruang putih dipakai untuk memisahkan kelompok, bukan untuk mengisi halaman. Permukaan tidak mengambang; kedalaman datang dari garis 1px dan warna permukaan, sedangkan bayangan hanya dipakai oleh elemen yang benar-benar berada di atas halaman (menu turun, popup, notifikasi).

Sistem ini melayani pembacaan cepat berulang kali sehari: siapa pun harus bisa menemukan "apa yang harus dikerjakan hari ini" dalam hitungan detik, di tema terang maupun gelap, tanpa perlu menyesuaikan apa pun. Rasa komponennya: **tegas tapi tenang**.

**Key Characteristics:**
- Garis rambut 1px sebagai alat pemisah utama, bukan bayangan.
- Satu aksen biru untuk tindakan dan status terpilih; tiap jenis tanggal punya warnanya sendiri dan tidak pernah bertukar.
- Hijau hanya untuk yang sudah selesai.
- Kartu bersudut 12px dengan garis 1px, tanpa tumpukan kartu di dalam kartu.
- Susunan bertabel: label huruf besar berspasi lebar, angka rata kolom.
- Tema terang dan gelap sama-sama utuh; tidak ada yang "sekadar cukup" di salah satunya.
- Bahasa Indonesia awam; tidak ada jargon teknis di antarmuka.

## Colors

Palet dingin dan tenang: kertas putih-kebiruan sebagai ground, tinta slate sebagai teks, satu biru sebagai isyarat tindakan, amber yang khusus menandai tenggat, dan ungu padat khusus untuk batas proyek serta identitas modul Catatan. Setiap warna punya satu pekerjaan; tidak ada warna yang dipakai sebagai pemanis.

### Primary
- **Biru Tindakan** (`#2563eb`): satu-satunya warna tindakan. Tombol utama, tautan aktif, status terpilih pada navigasi, prioritas sedang, dan penanda tanggal bertipe **jadwal**. Hover memakai **Biru Tindakan Terang** (`#3b82f6`).
- **Biru Terpilih** (`#eff6ff`): latar chip dan baris terpilih yang tidak ingin menarik perhatian seperti tombol. Garisnya **Garis Biru Terpilih** (`#bfdbfe`) dan teksnya **Biru Terpilih Tua** (`#1d4ed8`).

### Secondary
- **Amber Tenggat** (`#f59e0b`): penanda tanggal bertipe **tenggat** dan satu-satunya warna untuk keadaan yang perlu perhatian — proyek yang dijeda. Tidak dipakai untuk tindakan.
- **Hijau Selesai** (`#10b981`): hanya untuk keadaan selesai — lingkaran tugas yang ditandai, batang penyelesaian, dan riwayat kebiasaan yang tuntas. Garis pendampingnya **Garis Hijau Jadwal** (`#6ee7b7`).
- **Ungu Batas Proyek** (`#a855f7`, tintanya `#9333ea`): penanda tanggal bertipe **batas proyek** dan satu-satunya warna identitas modul **Catatan** — ikon statistik, ikon ringkasan, dan chip tag. Selalu berupa warna blok atau tint rata; tidak pernah gradien, tidak pernah sebagai tombol.

### Tertiary
- **Merah Bahaya** (`#dc2626` / `#ef4444`): prioritas tinggi, tindakan merusak, dan pesan gagal. Tidak pernah dipakai untuk hiasan.

### Neutral
- **Kertas Dingin** (`#f8fafc`): ground tema terang, dan latar blok kutipan atau catatan.
- **Permukaan Putih** (`#ffffff`): kartu, panel, dan kolom isian pada tema terang.
- **Tinta Slate** (`#0f172a`): teks utama tema terang.
- **Slate Redup** (`#64748b`): teks sekunder, label kolom, keterangan, dan chip kategori.
- **Slate Sunyi** (`#94a3b8`): label jam, angka pendamping, teks yang tidak perlu dibaca dua kali.
- **Garis Rambut** (`#e2e8f0`): semua pemisah pada tema terang.
- **Ground Gelap** (`#020617`) dan **Permukaan Gelap** (`#0f172a`): padanan ground dan kartu pada tema gelap; pemisahnya **Garis Rambut Gelap** (`#1e293b`).

### Named Rules
**The One Blue Rule.** Hanya ada satu biru di seluruh produk (`#2563eb`). Biru kedua hanya boleh berupa tint dari biru yang sama (`#eff6ff`, `#bfdbfe`), bukan hue biru lain.

**The No Purple Gradient Rule.** Gradien ungu dilarang di seluruh produk, dalam bentuk apa pun: gradien biru→ungu pada logo, judul, latar, maupun tombol tidak boleh kembali. Ungu padat (**Ungu Batas Proyek**) hanya dipakai sebagai penanda batas proyek dan identitas modul Catatan, selalu sebagai warna blok atau tint rata.

**The Date Type Rule.** Tiap jenis tanggal memiliki satu warna tetap dan tidak pernah bertukar: tenggat amber, jadwal biru, batas proyek ungu. Menukarnya membuat kalender terbaca salah.

**The Green Means Done Rule.** Hijau tidak pernah dipakai untuk tindakan, tautan, jenis tanggal, atau dekorasi. Kalau bukan "sudah selesai", warnanya bukan hijau.

## Typography

**Display Font:** system UI stack (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`) — sengaja memakai huruf sistem agar halaman terasa seperti aplikasi yang dibuka tiap hari, bukan halaman promosi.

**Body Font:** sama dengan display; perbedaan hierarki dibuat lewat ukuran dan bobot, bukan lewat keluarga huruf.

**Label/Mono Font:** mono sistem hanya untuk kode, isi Markdown di modul Catatan, dan angka metrik yang perlu rata kolom (`tabular-nums`).

**Character:** tenang dan rapi. Tidak ada huruf berkarakter dekoratif; bobot 800 hanya untuk judul pembuka, sisanya 600 dan 400. Tracking judul ditarik rapat (-0.025em, kelas `tracking-tight`) agar judul besar terasa padat, sedangkan label huruf besar justru direnggangkan (+0.12em) agar terbaca sebagai penanda kolom.

### Hierarchy
- **Display** (800, 3.4rem / `lg:text-[3.4rem]`, 1.06, -0.025em): hanya judul pembuka halaman depan; maksimum satu per halaman.
- **Headline** (700, 1.875rem / `text-3xl`, 1.2, -0.025em): judul bagian.
- **Title** (600, 1.125rem / `text-lg`, 1.35): judul kartu, judul modal, nama modul.
- **Body** (400, 0.875rem / `text-sm` sampai 1rem, 1.6): isi dan deskripsi; panjang baris dijaga di bawah 75 karakter.
- **Label** (700, 0.6875rem / 11px, 0.12em, HURUF BESAR): label kolom "Yang Anda tulis sekali", keterangan jenis tanggal, penanda bagian.
- **Chip / Mikro** (500–600, 0.625rem / `text-[10px]`): label di dalam lencana prioritas, jenis tanggal, tag, dan baris metadata. Satu-satunya ukuran di bawah 11px, dan hanya untuk lencana pendek.

### Named Rules
**The Label Whisper Rule.** Label huruf besar dipakai maksimum satu baris per kelompok dan tidak pernah muncul di atas judul judul sebagai pemanis; kalau bisa dihapus tanpa kehilangan arti, hapus.

## Layout

Kontainer halaman depan: `max-w-6xl` (1152px) di tengah, padding mendatar 16px (ponsel), 24px (`sm`), 32px (`lg`). Halaman aplikasi memakai sidebar tetap 240px di `lg`, dan berubah menjadi laci pada layar kecil.

Irama vertikal dari skala 4px: antar baris rapat 8–12px, antar kelompok 24–32px, antar bagian 64–80px. Aturan tetapnya: **lebih banyak ruang di atas judul bagian daripada di bawahnya**, dan satu bagian selalu dibuka oleh judul, bukan oleh label kecil.

Titik henti mengikuti bawaan Tailwind: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px. Halaman depan dibuat satu kolom di bawah `lg`, dua kolom berhadapan pada `lg` ke atas. Daftar panjang (mis. dua belas modul) memakai dua kolom dengan garis rambut bawah pada setiap baris.

### Named Rules
**The Two-Column Truth Rule.** Kalau sesuatu dijelaskan sebagai "masuk sekali, keluar banyak", tampilkan sebagai dua kolom berhadapan yang sejajar barisnya. Jangan dipecah menjadi deretan kartu.

**The Hero Pair Rule.** Layar pertama dibelah dua pada `lg` ke atas: janji dan tindakan di kolom kiri, satu artefak produk yang bisa disentuh di kolom kanan, dipisah garis rambut 1px yang memanjang penuh sepanjang baris. Isi kedua kolom dipusatkan tegak (`justify-center`) terhadap tinggi baris, sehingga blok janji sejajar dengan pusat artefak — bukan menempel di atas. Di bawah `lg` keduanya bertumpuk dengan garis rambut mendatar. Setiap ruang kosong di layar pertama diisi artefak produk, bukan hiasan.

## Elevation & Depth

Sistem ini **datar dengan garis**: kedalaman utama datang dari garis rambut 1px (`#e2e8f0` / gelap `#1e293b`) dan perbedaan warna permukaan, bukan dari bayangan. Bayangan hanya dipakai oleh elemen yang memang mengambang di atas halaman dan boleh menutupinya.

### Shadow Vocabulary
- **Tipis mengambang** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`): menu turun, popup kecil, chip yang menempel pada baris.
- **Sedang mengambang** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): modal, panel samping, notifikasi.

### Named Rules
**The Floating-Only Rule.** Permukaan yang diam di dalam alur halaman tidak punya bayangan — hanya garis 1px. Kalau sebuah permukaan punya garis sekaligus bayangan lebar, bayangannya dihapus.

**The No Halo Rule.** Tidak ada bayangan berwarna dengan offset nol (cahaya biru di bawah tombol). Bayangan selalu punya arah dan blur.

## Shapes

Bahasa bentuknya persegi membulat kecil dan konsisten: kotak isian dan tombol sebaris memakai 8px (`rounded-lg`), kartu dan tombol besar 12px (`rounded-xl`), panel lebar 16px (`rounded-2xl`), dan hanya chip serta label jenis tanggal yang berbentuk kapsul penuh (`rounded-full`). Label kecil di dalam baris memakai 6px (`rounded-md`).

Sudut 12px adalah bentuk default produk; naik ke 16px hanya untuk panel selebar halaman. Tidak ada sudut 24px kecuali pada kerangka preview perangkat.

Pemisah berbentuk garis lurus 1px, tidak pernah lebih tebal dari 1px dalam warna. Penanda tanggal memakai kotak kecil 10px, status tugas memakai lingkaran 16–18px dengan garis 2px, dan batang progres adalah kapsul 6–8px. Bentuk tidak pernah dipakai sebagai hiasan: setiap bentuk adalah status.

### Named Rules
**The Hairline Rule.** Tidak ada garis berwarna lebih tebal dari 1px pada kartu, baris, atau pemberitahuan. Kalau sesuatu perlu ditekankan, pakai warna latar atau bobot huruf.

## Components

Rasa keseluruhannya **tegas tapi tenang**: bentuk jelas, kontras aman, tanpa gerakan atau bayangan yang menarik perhatian ke dirinya sendiri.

### Buttons
- **Shape:** 8px (`rounded-lg`) untuk tombol di dalam antarmuka, 12px (`rounded-xl`) untuk tombol utama halaman depan.
- **Primary:** latar Biru Tindakan (`#2563eb`), teks putih, padding 14px 28px (halaman depan) atau 8px 16px (dalam antarmuka); teks 600.
- **Hover / Focus:** hover menaikkan kecerahan ke `#3b82f6`; fokus memakai `focus-visible:ring-2` warna Biru Tindakan dengan offset 2px.
- **Secondary (outline):** latar Permukaan Putih, garis 1px `#cbd5e1`, teks Tinta Slate; di tema gelap latar Permukaan Gelap dengan garis `#334155`.
- **Ghost:** tanpa garis dan tanpa latar; hanya warna teks berubah saat hover.
- **Danger:** Merah Bahaya (`#dc2626`), hanya untuk tindakan merusak yang selalu dikonfirmasi.

### Chips
- **Style:** kapsul penuh, padding 4px 10px, teks 11px 600. Varian aktif: latar Biru Terpilih (`#eff6ff`), garis `#bfdbfe`, teks `#1d4ed8`. Varian tenang: latar transparan, garis Garis Rambut, teks Slate Redup.
- **State:** chip jenis tanggal adalah pilihan tunggal (tenggat atau jadwal), bukan saklar; yang aktif memakai warna, yang diam tetap tenang.

### Cards / Containers
- **Corner Style:** 12px (`rounded-xl`).
- **Background:** Permukaan Putih pada tema terang, Permukaan Gelap (`#0f172a`) atau `#0f172a/40` pada tema gelap.
- **Border:** garis rambut 1px selalu ada.
- **Shadow Strategy:** tidak ada, lihat bagian Elevation & Depth.
- **Internal Padding:** 20px (`p-5`); 32px untuk panel yang memuat judul bagian.
- **Batang progres** memakai Biru Tindakan (`#2563eb`). Beberapa tampilan lama masih memakai Biru Tindakan Terang (`#3b82f6`) untuk batang progres; samakan ke `#2563eb` saat berkas itu disentuh.
- **Tidak boleh** bersarang: kartu di dalam kartu dilarang; kelompok di dalam kartu diwakili garis rambut.

### Inputs / Fields
- **Style:** 8px (`rounded-lg`), garis 1px Garis Rambut, latar putih, tinggi 36px, teks 14px, padding 8px 12px.
- **Focus:** garis berubah ke Biru Tindakan; tidak ada bayangan cahaya. Kursor teks selalu Biru Tindakan (`caret-color`).
- **Placeholder:** dipatok global di `globals.css` ke Slate Redup (`#64748b`) pada tema terang dan Slate Sunyi (`#94a3b8`) pada tema gelap agar selalu lolos kontras 4.5:1; utilitas `placeholder:text-slate-*` per berkas sengaja ditimpa.
- **Error / Disabled:** teks bantuan Merah Bahaya di bawah kolom; disabled memakai opasitas 50% dan kursor dilarang.

### Navigation
- **Gaya:** sidebar 240px dengan baris 36px, ikon 16px, radius 8px; baris aktif memakai latar Biru Terpilih dengan teks biru. Bar atas halaman depan memakai `.glass` (putih 82% + blur 12px, gelap `rgba(15,23,42,0.72)`) dengan garis bawah 1px — dipakai karena isi halaman lewat di bawahnya, bukan sebagai hiasan.
- **Mobile:** sidebar menjadi laci; tinggi baris dinaikkan ke 44px untuk sasaran sentuh.

### Motion
Gerakan dipakai satu kali saja, sebagai bukti mekanisme, lalu berhenti. Satu momen yang ditata — bukan efek yang ditempel di setiap bagian.

- **Pemicu.** Layar pertama (judul, tombol, papan bulan) bergerak saat halaman dibuka. Setiap bagian di bawahnya baru bergerak **saat bagian itu digulir masuk ke layar** — `IntersectionObserver` dengan `rootMargin` 18% dari tepi bawah, dipicu sekali lalu dilepas. Bagian yang sudah lewat tidak mengulang.
- **Kurva:** `cubic-bezier(0.16, 0.84, 0.44, 1)` (ease-out eksponensial) untuk semua animasi masuk, tanpa gerakan memantul.
- **Urutan buku besar.** Momen tanda tangan: baris kiri masuk dari kiri, pasangannya di kanan menyusul dari kanan, berjenjang 90ms per pasangan; batang progres terisi (skala mendatar) dan batang kebiasaan tumbuh dari bawah (skala tegak). Durasi 560–760ms, selesai dalam ±1 detik.
- **Nada per bagian, tidak dua kali sama.** Modul: judul naik sekali (560ms), lalu dua belas barisnya terisi berurutan (kelas `.stagger`, durasi 560ms, langkah tetap 75ms — baris terakhir mulai pada 825ms). Keunggulan: seluruh blok datang dari kanan sekali dengan durasi lebih panjang, `.anim-arrive` 720ms, supaya blok lebar terasa mengendap, bukan meloncat. Penutup tidak bergerak sama sekali.
- **Isi animasi:** `animation-fill-mode: backwards` supaya keadaan akhir dikembalikan ke kelas (keadaan redup saat hover tetap bekerja), dan elemen tetap terlihat penuh bila animasi dimatikan.
- **Tanpa kelas sembunyi.** Elemen selalu tampil penuh pada HTML awal; kelas gerak baru dipasang **setelah** elemen masuk layar, lewat `components/landing/use-in-view.ts` dan pembungkus `Reveal`. Tanpa JavaScript (atau saat `prefers-reduced-motion`) halaman tidak pernah kehilangan isinya — yang hilang gerakannya, bukan kontennya.
- **Reduced motion.** `@media (prefers-reduced-motion: reduce)` mematikan seluruh animasi dan `useInView` berhenti mengamati sejak awal; gerakan hover memakai varian `motion-safe:`. Tanpa gerakan, halaman tetap terbaca utuh.

### Papan Bulan (MiniCalendar)
Kisi tanggal di kolom kanan layar pertama — artefak yang bisa disentuh, bukan hiasan.

- **Bingkai:** satu kartu garis 1px, sudut 12px, tanpa bayangan; kepala berisi label bulan dan keterangan "Contoh data".
- **Kisi:** tujuh kolom Senin–Minggu, sel 40px bersudut 6px, jarak 4px, angka bertabular. Tanggal di luar bulan ini diredupkan tetapi tetap dapat disorot.
- **Penanda:** kotak 4px, maksimum dua per sel - amber tenggat, biru jadwal, ungu batas proyek. Legenda tiga jenis tanggal di bawah kisi memakai warna dan kata yang sama dengan halaman Kalender aplikasi.
- **Sorotan silang:** menyorot sebuah tanggal mewarnai seluruh baris dan kolomnya (`slate-100` / gelap `slate-800/60`), sedangkan sel yang disorot memakai Biru Terpilih dengan garis 1px biru. Efeknya berguna, bukan sekadar gerak: papan terbaca seperti tabel.
- **Pita keterangan:** tinggi tetap **84px** berisi tanggal terpilih (label huruf besar berspasi lebar) dan paling banyak dua agenda; keadaan kosong menuliskan kalimatnya sendiri (dua baris). Tinggi dipatok ke kasus terpanjang, bukan `min-height`: tinggi papan tidak boleh berubah sama sekali saat sorotan berpindah, sebab kolom kiri yang dipusatkan tegak akan ikut bergeser. Ini aturan wajib untuk setiap panel yang isinya berubah-ubah di layar pertama.
- **Hari ini:** angka lebih tebal dan label "· hari ini" di pita keterangan.
- **Keadaan:** hover dan fokus keyboard memberi hasil yang sama — setiap tanggal adalah tombol dengan `aria-label` lengkap dan ring fokus 2px; pita keterangan memakai `aria-live="polite"`.

### Signature: Baris Buku Besar (LandingLedger)
Komponen tanda tangan halaman depan: dua kolom berhadapan yang barisnya sejajar, kiri "Yang Anda tulis sekali" (kotak isian, chip jenis tanggal, tombol simpan) dan kanan "Yang Corely hitung sendiri" (daftar tugas, progres proyek, penanda kalender, batang kebiasaan, hasil pencarian). Menyorot baris kiri meredupkan pasangan lain ke opasitas 50% dan mengangkat pasangan itu; ini hiasan tetikus saja — barisnya contoh statis, bukan kontrol, jadi keyboard tidak pernah melihat keadaan redup dan tidak ada tombol mati. Semua datanya contoh dan diberi keterangan "Contoh tampilan dengan data contoh."

## Do's and Don'ts

### Do:
- **Do** pakai garis rambut 1px (`#e2e8f0` / gelap `#1e293b`) sebagai pemisah utama, termasuk pada setiap baris daftar panjang.
- **Do** pakai Biru Tindakan (`#2563eb`) hanya untuk tindakan, tautan aktif, status terpilih, dan penanda tanggal bertipe jadwal.
- **Do** pakai Amber Tenggat (`#f59e0b`) hanya untuk penanda tenggat dan keadaan proyek yang dijeda.
- **Do** pakai Ungu Batas Proyek (`#a855f7`, tint `#9333ea`) untuk penanda batas proyek, chip tag, dan ikon modul Catatan; Slate Redup (`#64748b`) tetap untuk chip kategori.
- **Do** pakai Hijau Selesai (`#10b981`) hanya untuk keadaan yang benar-benar selesai.
- **Do** jaga setiap kolom isian pada 8px (`rounded-lg`) dan setiap kartu pada 12px (`rounded-xl`).
- **Do** tulis teks sekunder dengan Slate Redup (`#64748b`) pada tema terang dan `#94a3b8` pada tema gelap; keduanya lolos kontras 4.5:1.
- **Do** tulis semua teks antarmuka dengan istilah awam berbahasa Indonesia.
- **Do** batasi judul display (3.4rem / 800) satu kali per halaman.
- **Do** beri setiap keadaan interaktif `focus-visible` ring 2px warna biru.
- **Do** pakai animasi hanya untuk menjelaskan mekanisme (baris menyusun, progres terisi), sekali jalan, dan hormati `prefers-reduced-motion`.
- **Do** pastikan setiap sorotan tetikus punya padanan keyboard dan tidak pernah menjadi satu-satunya pembawa arti; penanda tanggal selalu berpasangan dengan warna dan kata di legenda.

### Don't:
- **Don't** pakai gradien ungu dalam bentuk apa pun — logo, judul, latar, maupun tombol — dan jangan pakai ungu padat di luar batas proyek serta modul Catatan (`The No Purple Gradient Rule`).
- **Don't** menukar warna antar jenis tanggal, dan jangan memakai hijau untuk jadwal atau tenggat.
- **Don't** pakai gradien sebagai latar bagian, tombol, atau teks; warna blok rata (`The No Purple Gradient Rule`).
- **Don't** memakai bayangan pada permukaan yang diam di dalam alur halaman, dan jangan memberi garis sekaligus bayangan lebar pada satu elemen.
- **Don't** menumpuk kartu di dalam kartu.
- **Don't** memakai garis berwarna lebih tebal dari 1px di tepi kartu, baris daftar, atau pemberitahuan.
- **Don't** memakai kotak kartu berukuran sama berisi ikon, judul, dan satu baris teks sebagai susunan utama sebuah bagian; pakai baris bergaris atau dua kolom sejajar.
- **Don't** memakai angka besar dengan label kecil sebagai pembuka halaman.
- **Don't** menaruh label kecil huruf besar di atas judul sebagai pemanis.
- **Don't** memakai mono atau emoji sebagai hiasan; mono hanya untuk kode, emoji tidak dipakai di antarmuka.
- **Don't** memberi animasi masuk yang sama di setiap bagian, dan jangan memakai gerakan berlebihan, memantul, atau berulang.
- **Don't** menampilkan klaim, angka pengguna, atau testimoni yang tidak ada.
