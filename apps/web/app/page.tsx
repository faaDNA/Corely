import Link from 'next/link';
import type { Metadata } from 'next';
import { getProfile } from '@/lib/profile';
import { LandingProfileMenu } from '@/components/landing-profile-menu';
import { LandingLedger } from '@/components/landing/ledger';
import { MiniCalendar } from '@/components/landing/mini-calendar';
import {
  LayoutDashboard,
  ListChecks,
  FolderKanban,
  NotebookPen,
  Bookmark,
  Flame,
  CalendarDays,
  Search,
  BarChart3,
  Bell,
  Settings,
  Lock,
  Zap,
  Smartphone,
  Accessibility,
  ShieldCheck,
  Rocket,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Corely — Tulis sekali, sisanya dihitung sendiri',
  description:
    'Satu daftar untuk tugas, proyek, catatan, bookmark, kebiasaan, dan jadwal. Progres, kalender, dan statistik mengikuti sendiri.',
};

const MODULES = [
  { icon: LayoutDashboard, title: 'Dashboard', desc: 'Ringkasan hari ini: tugas terdekat, proyek aktif, dan aksi cepat.' },
  { icon: ListChecks, title: 'Tugas', desc: 'Daftar bersih dengan prioritas, tag, tenggat, atau jadwal berjam.' },
  { icon: FolderKanban, title: 'Proyek', desc: 'Progres dan statusnya naik sendiri setiap tugas selesai.' },
  { icon: CalendarDays, title: 'Kalender', desc: 'Tenggat, jadwal, dan batas proyek muncul di tanggalnya.' },
  { icon: NotebookPen, title: 'Catatan', desc: 'Catatan pribadi dengan kategori, tag, pin, dan arsip.' },
  { icon: Flame, title: 'Kebiasaan', desc: 'Penandaan harian, riwayat, dan streak yang dihitung sendiri.' },
  { icon: Bookmark, title: 'Bookmark', desc: 'Simpan tautan penting dengan kategori, tag, dan favorit.' },
  { icon: Search, title: 'Pencarian', desc: 'Satu kolom untuk semua modul, hasilnya dikelompokkan.' },
  { icon: BarChart3, title: 'Analitik', desc: 'Tingkat penyelesaian tugas dan konsistensi kebiasaan.' },
  { icon: Bell, title: 'Notifikasi', desc: 'Pengingat H-1 dan satu jam sebelum tenggat, zona WIB.' },
  { icon: Settings, title: 'Pengaturan', desc: 'Profil, tema terang atau gelap, dan format tanggal.' },
  { icon: Lock, title: 'Akun', desc: 'Sesi aman; setiap akun hanya melihat datanya sendiri.' },
];

const BENEFITS = [
  { icon: Zap, title: 'Ringan dipakai harian', desc: 'Halaman terbuka cepat dan konsisten setiap hari.' },
  { icon: Smartphone, title: 'Nyaman di semua layar', desc: 'Desktop, tablet, dan ponsel dengan susunan yang sama.' },
  { icon: Accessibility, title: 'Terbaca jelas', desc: 'Kontras aman di tema terang maupun gelap.' },
  { icon: ShieldCheck, title: 'Pribadi', desc: 'Data tiap akun terisolasi dan tidak dibagikan.' },
];

export default async function LandingPage() {
  const profile = await getProfile();
  const loggedIn = !!profile;
  const greet = profile?.nickname || profile?.name;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="glass fixed inset-x-0 top-0 z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
              C
            </div>
            <span className="text-lg font-bold tracking-tight">Corely</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400 md:flex">
            <a href="#cara-kerja" className="transition hover:text-slate-900 dark:hover:text-white">
              Cara kerja
            </a>
            <a href="#modul" className="transition hover:text-slate-900 dark:hover:text-white">
              Modul
            </a>
            <a href="#keunggulan" className="transition hover:text-slate-900 dark:hover:text-white">
              Keunggulan
            </a>
          </nav>
          {loggedIn ? (
            <LandingProfileMenu name={greet ?? ''} email={profile?.email ?? ''} />
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Masuk
            </Link>
          )}
        </div>
      </header>

      <main>
        {/* Pembuka: janji + bukti + tindakan, semuanya di layar pertama. */}
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 md:pb-24 md:pt-36 lg:px-8">
          {/* Dua kolom di layar lebar: janji di kiri, papan bulan di kanan. Isinya dipusatkan tegak
              terhadap tinggi baris, dan garis rambut pemisah memanjang penuh seperti di buku besar. */}
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_368px]">
            <div className="lg:flex lg:flex-col lg:justify-center lg:pr-14">
              <h1 className="anim-rise max-w-xl text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                Tulis sekali.{' '}
                <span className="text-blue-600 dark:text-blue-400">Sisanya biar dihitung.</span>
              </h1>
              <p
                className="anim-rise mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400"
                style={{ animationDelay: '90ms' }}
              >
                Tugas, proyek, catatan, dan jadwal biasanya tersebar di banyak aplikasi. Di Corely semuanya berangkat
                dari satu daftar yang sama — daftar tugas, kalender, progres proyek, dan statistik mengikuti dari situ.
              </p>
              <div className="anim-rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '170ms' }}>
                <Link
                  href={loggedIn ? '/dashboard' : '/login'}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-500 motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950"
                >
                  <Rocket className="h-5 w-5" /> {loggedIn ? 'Buka Dashboard' : 'Mulai Sekarang'}
                </Link>
                <a
                  href="#modul"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:text-white"
                >
                  Lihat modulnya
                </a>
              </div>
            </div>

            <div
              className="anim-right mt-12 border-t border-slate-200 pt-8 lg:mt-0 lg:flex lg:flex-col lg:justify-center lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0 dark:border-slate-800"
              style={{ animationDelay: '250ms' }}
            >
              <MiniCalendar />
            </div>
          </div>

          {/* Bukti: kiri ditulis sekali, kanan hasil hitungannya. */}
          <div id="cara-kerja" className="mt-14 scroll-mt-24 border-t border-slate-200 pt-6 dark:border-slate-800">
            <LandingLedger />
            <p className="anim-rise mt-3 text-xs text-slate-500 dark:text-slate-400" style={{ animationDelay: '520ms' }}>
              Contoh tampilan dengan data contoh.
            </p>
          </div>
        </section>

        {/* Modul: satu daftar bergaris, bukan deretan kartu seragam. */}
        <section id="modul" className="scroll-mt-24 border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900/40 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
              Dua belas modul, satu sumber data.
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              Setiap modul membaca dan menulis ke daftar yang sama, jadi tidak ada data yang perlu dimasukkan dua kali.
            </p>
            <div className="mt-10 grid gap-x-12 sm:grid-cols-2">
              {MODULES.map((m) => (
                <div key={m.title} className="flex gap-3.5 border-b border-slate-200 py-4 dark:border-slate-800">
                  <m.icon className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h3 className="text-sm font-semibold">{m.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Keunggulan: empat pernyataan pendek tanpa bingkai kartu. */}
        <section id="keunggulan" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <h2 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">Dirancang untuk dibuka tiap hari.</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <div key={b.title}>
                <b.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h3 className="mt-3 text-sm font-semibold">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Penutup. */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 dark:border-slate-800 dark:bg-slate-900/40">
            <h2 className="max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">
              Mulai dari satu tugas hari ini.
            </h2>
            <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-400">
              Tulis satu tugas, lalu lihat sendiri daftar, kalender, dan progres proyeknya ikut berubah.
            </p>
            <Link
              href={loggedIn ? '/dashboard' : '/login'}
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
            >
              {loggedIn ? 'Lanjut ke Dashboard' : 'Masuk ke Dashboard'}
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <div>© 2026 Corely</div>
          <div className="flex items-center gap-6">
            <a href="#cara-kerja" className="transition hover:text-slate-900 dark:hover:text-slate-300">
              Cara kerja
            </a>
            <a href="#modul" className="transition hover:text-slate-900 dark:hover:text-slate-300">
              Modul
            </a>
            <a href="#keunggulan" className="transition hover:text-slate-900 dark:hover:text-slate-300">
              Keunggulan
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
