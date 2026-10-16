import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Syarat Layanan — Corely',
  description: 'Syarat layanan aplikasi Corely.',
};

const SECTIONS: { h: string; body: string[] }[] = [
  {
    h: '1. Layanan',
    body: [
      'Corely adalah aplikasi produktivitas pribadi: pengelolaan tugas, proyek, catatan, bookmark, kebiasaan, kalender, analitik, dan pengingat notifikasi browser.',
      'Layanan disediakan apa adanya ("as-is") dan dapat berubah tanpa pemberitahuan.',
    ],
  },
  {
    h: '2. Akun',
    body: [
      'Anda bertanggung jawab menjaga kerahasiaan kredensial akun. Satu akun untuk penggunaan pribadi.',
      'Gunakan email aktif — dibutuhkan untuk pemulihan akun bila lupa password.',
    ],
  },
  {
    h: '3. Penggunaan yang Dilarang',
    body: [
      'Dilarang menyalahgunakan layanan: mengakses data pengguna lain, mengganggu infrastruktur, atau memakai aplikasi untuk aktivitas melanggar hukum.',
      'Pelanggaran dapat berujung penangguhan atau penghapusan akun.',
    ],
  },
  {
    h: '4. Data Anda',
    body: [
      'Seluruh konten yang Anda buat adalah milik Anda. Penghapusan item mengikuti kebijakan retensi aplikasi; akun yang dihapus ikut menghapus seluruh datanya.',
    ],
  },
  {
    h: '5. Batasan Tanggung Jawab',
    body: [
      'Sejauh diizinkan hukum, kami tidak bertanggung jawab atas kehilangan data atau kerugian akibat penggunaan layanan, termasuk kegagalan layanan pihak ketiga (hosting, autentikasi, push notification).',
    ],
  },
  {
    h: '6. Kontak',
    body: ['Pertanyaan soal syarat ini: kirim email ke daffa.n.a184@gmail.com.'],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link href="/" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
          ← Kembali ke Beranda
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Syarat Layanan</h1>
        <p className="mt-2 text-sm text-slate-500">Terakhir diperbarui: Oktober 2026</p>
        <div className="mt-8 space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.h}>
              <h2 className="text-lg font-semibold">{s.h}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
