'use client';

import { startTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, RotateCw } from 'lucide-react';

/**
 * Fetch gagal (Supabase/jaringan) dilempar dari lib/mappers → tampil di sini,
 * bukan sebagai daftar kosong yang membuat pengguna mengira datanya hilang.
 */
export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  // reset() saja hanya merender ulang client; refresh() mengambil ulang data server component.
  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
      <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" aria-hidden="true" />
      <div>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Data gagal dimuat</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Datamu aman, hanya koneksinya yang bermasalah. Periksa internet lalu coba lagi.
        </p>
      </div>
      <button
        type="button"
        onClick={retry}
        className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white transition hover:bg-blue-500"
      >
        <RotateCw className="h-4 w-4" aria-hidden="true" />
        Coba lagi
      </button>
    </div>
  );
}
