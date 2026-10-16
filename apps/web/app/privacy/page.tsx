import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi — Corely',
  description: 'Kebijakan privasi aplikasi Corely.',
};

const SECTIONS: { h: string; body: string[] }[] = [
  {
    h: '1. Data yang Kami Kumpulkan',
    body: [
      'Saat mendaftar atau masuk (email/password atau Google OAuth), kami menyimpan nama, nama panggilan, dan alamat email Anda.',
      'Seluruh data yang Anda buat di aplikasi (tugas, proyek, catatan, bookmark, kebiasaan) tersimpan di database dan hanya dapat diakses oleh akun Anda sendiri (kebijakan akses baris per pengguna).',
    ],
  },
  {
    h: '2. Penggunaan Data',
    body: [
      'Data dipakai semata-mata untuk menjalankan fitur aplikasi: menampilkan dashboard, pengingat tenggat via notifikasi browser, dan statistik pribadi.',
      'Kami tidak menjual, menyewakan, atau membagikan data pribadi Anda ke pihak ketiga untuk iklan.',
    ],
  },
  {
    h: '3. Layanan Pihak Ketiga',
    body: [
      'Autentikasi dan penyimpanan data memakai Supabase. Login Google memakai OAuth Google — kami hanya menerima profil dasar (nama, email) yang Anda setujui di layar izin Google.',
      'Notifikasi browser memakai Web Push standar; token langganan perangkat tersimpan di akun Anda dan bisa dihapus kapan saja lewat tombol notifikasi.',
    ],
  },
  {
    h: '4. Penyimpanan & Keamanan',
    body: [
      'Data tersimpan di infrastruktur Supabase dengan akses terisolasi per pengguna. Hapus item memakai soft-delete; data terhapus permanen mengikuti kebijakan retensi aplikasi.',
    ],
  },
  {
    h: '5. Hak Anda',
    body: [
      'Anda dapat mengubah profil dan password di halaman Pengaturan, mematikan notifikasi per perangkat, dan meminta penghapusan akun beserta seluruh datanya dengan menghubungi kami.',
    ],
  },
  {
    h: '6. Kontak',
    body: ['Pertanyaan soal kebijakan ini: kirim email ke daffa.n.a184@gmail.com.'],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link href="/" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
          ← Kembali ke Beranda
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Kebijakan Privasi</h1>
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
