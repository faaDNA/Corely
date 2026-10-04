import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Corely — Satu Workspace untuk Seluruh Produktivitas Anda',
};

const FEATURES = [
  { icon: '📊', title: 'Dashboard Utama', desc: 'Sapaan personal, tanggal hari ini, ringkasan tugas, proyek aktif, tenggat terdekat, dan aksi cepat.' },
  { icon: '✅', title: 'Manajemen Tugas', desc: 'Status ringkas Todo & Completed, prioritas, tag, dan list view yang bersih. Tugas bisa bertipe Tenggat atau Jadwal hari-H dengan jam.' },
  { icon: '📁', title: 'Pengelolaan Proyek', desc: 'Kelompokkan aktivitas jangka panjang. Progres & status diturunkan otomatis dari tugas — tanpa bolak-balik mengubah status.' },
  { icon: '📝', title: 'Catatan Markdown', desc: 'Simpan pengetahuan pribadi format Markdown dengan kategori, tag, pin, dan arsip.' },
  { icon: '🔖', title: 'Koleksi Bookmark', desc: 'Simpan situs dan sumber daya penting dengan kategori, tag, favorit, dan pencarian.' },
  { icon: '🔥', title: 'Pelacak Kebiasaan', desc: 'Penandaan harian, riwayat kalender, streak aktif, streak terpanjang, dan tingkat penyelesaian.' },
  { icon: '📅', title: 'Kalender Terpadu', desc: 'Tenggat & jadwal tugas serta batas proyek muncul otomatis dalam tampilan bulan, minggu, dan hari — tanpa input dua kali.' },
  { icon: '🔍', title: 'Pencarian Global', desc: 'Cari tugas, proyek, catatan, dan bookmark dari satu kolom dengan hasil dikelompokkan.' },
  { icon: '📈', title: 'Statistik & Analitik', desc: 'Tingkat penyelesaian tugas, progres proyek, dan konsistensi kebiasaan harian/mingguan/bulanan.' },
  { icon: '🔔', title: 'Notifikasi', desc: 'Pengingat tenggat tugas, batas proyek, acara mendatang, dan kebiasaan harian.' },
  { icon: '⚙️', title: 'Profil & Pengaturan', desc: 'Atur profil, tema terang/gelap, format tanggal & jam, serta preferensi tampilan.' },
  { icon: '🔒', title: 'Akun Aman & Pribadi', desc: 'Login dan sesi aman, dengan setiap data hanya dapat diakses oleh pemiliknya.' },
];

const BENEFITS = [
  { icon: '⚡', title: 'Cepat & Ringan', desc: 'Halaman muat cepat dengan interaksi responsif.' },
  { icon: '📱', title: 'Responsif di Semua Layar', desc: 'Nyaman di desktop, tablet, maupun ponsel.' },
  { icon: '♿', title: 'Aksesibel', desc: 'Kontras jelas, navigasi mudah, dan struktur semantik.' },
  { icon: '🔐', title: 'Privat & Aman', desc: 'Data pribadi Anda tetap terisolasi dan aman.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="glass fixed inset-x-0 top-0 z-50 border-b border-slate-800">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 font-bold text-white shadow-lg shadow-blue-500/20">
              C
            </div>
            <span className="text-lg font-bold tracking-tight">Corely</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
            <a href="#problem" className="transition hover:text-white">Masalah</a>
            <a href="#features" className="transition hover:text-white">Fitur</a>
            <a href="#preview" className="transition hover:text-white">Pratinjau</a>
            <a href="#benefits" className="transition hover:text-white">Keunggulan</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-700">
              Masuk
            </Link>
            <Link href="/register" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500">
              Daftar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
            Aplikasi Produktivitas Pribadi
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Satu Dashboard untuk{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Seluruh Kehidupan Digital Anda
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            Kelola tugas, proyek, catatan, bookmark, kebiasaan harian, dan jadwal — semua dalam satu aplikasi pribadi yang rapi dan terpusat.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login" className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 font-semibold text-white shadow-xl shadow-blue-600/25 transition hover:bg-blue-500 sm:w-auto">
              🚀 Mulai Sekarang
            </Link>
            <a href="#features" className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-8 py-3.5 font-semibold text-slate-300 transition hover:border-slate-700 sm:w-auto">
              Jelajahi Fitur
            </a>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 border-t border-slate-800/80 pt-8 text-left md:grid-cols-4">
            <div><div className="text-2xl font-bold text-white">12 Modul</div><div className="mt-0.5 text-xs text-slate-400">Fitur produktivitas lengkap</div></div>
            <div><div className="text-2xl font-bold text-white">100% Pribadi</div><div className="mt-0.5 text-xs text-slate-400">Data Anda tetap milik Anda</div></div>
            <div><div className="text-2xl font-bold text-white">Dark Mode</div><div className="mt-0.5 text-xs text-slate-400">Tema terang & gelap</div></div>
            <div><div className="text-2xl font-bold text-white">Semua Layar</div><div className="mt-0.5 text-xs text-slate-400">Desktop, tablet, mobile</div></div>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section id="problem" className="border-y border-slate-800 bg-slate-900/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white">Mengapa Corely?</h2>
            <p className="mt-4 text-slate-400">Aktivitas harian kita sering tersebar di banyak aplikasi berbeda, sehingga sulit melihat prioritas dalam satu pandangan.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-red-900/30 bg-red-950/20 p-8">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-xl text-red-400">⚠️</div>
              <h3 className="mb-4 text-xl font-semibold text-white">Masalah: Semuanya Terpencar</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>✕ Tugas ada di satu aplikasi, catatan di aplikasi lain.</li>
                <li>✕ Bookmark tercecer di browser, jadwal di kalender terpisah.</li>
                <li>✕ Progres proyek sulit dipantau tanpa gambaran menyeluruh.</li>
                <li>✕ Waktu habis berpindah-pindah aplikasi hanya untuk cek prioritas.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-blue-900/30 bg-blue-950/20 p-8">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-400">✓</div>
              <h3 className="mb-4 text-xl font-semibold text-white">Solusi: Semua di Satu Tempat</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>✓ Satu dashboard untuk melihat seluruh aktivitas harian Anda.</li>
                <li>✓ Tugas, proyek, catatan, dan jadwal saling terhubung.</li>
                <li>✓ Statistik produktivitas membantu Anda tetap konsisten.</li>
                <li>✓ Ringkas, cepat, dan nyaman digunakan setiap hari.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white">Fitur-Fitur Corely</h2>
            <p className="mt-4 text-slate-400">Aplikasi ini menyediakan modul lengkap untuk mengelola seluruh kebutuhan produktivitas pribadi Anda.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-lg">{f.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview */}
      <section id="preview" className="border-t border-slate-800 bg-slate-900/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white">Tampilan Dashboard</h2>
            <p className="mt-4 text-slate-400">Antarmuka modern dan bersih yang menampilkan ringkasan harian Anda dalam satu layar.</p>
          </div>
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-red-500/80" />
                <span className="inline-block h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="inline-block h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 font-mono text-xs text-slate-500">app.corely.dev/dashboard</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Tersinkronisasi
              </div>
            </div>
            <div className="grid min-h-[320px] md:grid-cols-5">
              <div className="space-y-1 border-r border-slate-800 bg-slate-900/60 p-4 text-sm">
                <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Menu Utama</p>
                {['Dashboard', 'Tugas', 'Proyek', 'Catatan', 'Kebiasaan', 'Kalender'].map((m, i) => (
                  <div key={m} className={`rounded-lg px-3 py-2 ${i === 0 ? 'bg-blue-600/10 font-medium text-blue-400' : 'text-slate-400'}`}>{m}</div>
                ))}
              </div>
              <div className="space-y-4 p-6 md:col-span-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Selamat Datang kembali! 👋</h3>
                  <p className="mt-1 text-xs text-slate-400">Sabtu, 3 Oktober 2026 • 4 tugas aktif hari ini</p>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[['Tugas Tertunda', '8'], ['Proyek Aktif', '3'], ['Streak', '12 Hari'], ['Catatan', '24']].map(([l, v]) => (
                    <div key={l} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                      <div className="text-xs text-slate-400">{l}</div>
                      <div className="mt-1 text-2xl font-bold text-white">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <p className="mb-2 text-sm font-semibold text-white">Proyek Aktif</p>
                  <div className="space-y-2">
                    <div className="h-2 w-[65%] rounded-full bg-blue-500" />
                    <div className="h-2 w-[40%] rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white">Dirancang untuk Penggunaan Sehari-hari</h2>
            <p className="mt-4 text-slate-400">Antarmuka yang bersih dan konsisten membuat aplikasi ini nyaman dipakai kapan saja.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-lg">{b.icon}</div>
                <h3 className="mb-2 font-semibold text-white">{b.title}</h3>
                <p className="text-sm text-slate-400">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-900/40 to-slate-900 p-10 sm:p-16">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Mulai Kelola Produktivitas Anda Hari Ini</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
              Satu tempat untuk tugas, proyek, catatan, dan jadwal Anda. Rapi, terpusat, dan siap digunakan setiap hari.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/login" className="rounded-xl bg-blue-600 px-8 py-3.5 font-semibold text-white shadow-xl shadow-blue-600/30 transition hover:bg-blue-500">
                Masuk ke Dashboard
              </Link>
              <Link href="/register" className="rounded-xl border border-slate-700 bg-slate-900 px-8 py-3.5 font-semibold text-slate-300 transition hover:border-slate-600">
                Buat Akun
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div>© 2026 Corely. Seluruh hak cipta dilindungi.</div>
          <div className="flex items-center gap-6">
            <a href="#features" className="transition hover:text-slate-300">Fitur</a>
            <a href="#preview" className="transition hover:text-slate-300">Tampilan</a>
            <a href="#benefits" className="transition hover:text-slate-300">Keunggulan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}