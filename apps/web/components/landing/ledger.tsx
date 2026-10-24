'use client';

import { useState, type ReactNode } from 'react';

// Baris grid di lg: label (baris 1), lalu satu baris per pasangan.
const ROW_START = ['lg:row-start-2', 'lg:row-start-3', 'lg:row-start-4', 'lg:row-start-5'];

const CHIP =
  'rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300';
const CHIP_OFF =
  'rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400';

/** Kolom teks seperti di formulir tambah tugas. */
function Field({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-9 flex-1 items-center truncate rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
      {children}
    </span>
  );
}

function Save({ label }: { label: string }) {
  return (
    <span className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white">{label}</span>
  );
}

/** Satu baris turunan: judul + isi pendek. */
function Derived({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{title}</p>
      <div className="mt-2.5 space-y-2">{children}</div>
    </div>
  );
}

function TaskLine({ done, title, meta }: { done?: boolean; title: string; meta: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={
          done
            ? 'h-4 w-4 shrink-0 rounded-full border-2 border-emerald-500 bg-emerald-500'
            : 'h-4 w-4 shrink-0 rounded-full border-2 border-slate-300 dark:border-slate-600'
        }
      />
      <span className={done ? 'truncate text-sm text-slate-500 line-through' : 'truncate text-sm text-slate-800 dark:text-slate-200'}>
        {title}
      </span>
      <span className="ml-auto shrink-0 text-xs text-slate-500 dark:text-slate-400">{meta}</span>
    </div>
  );
}

function Progress({ label, value, done, total }: { label: string; value: number; done: number; total: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-24 shrink-0 truncate text-sm text-slate-700 dark:text-slate-300">{label}</span>
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <span className="anim-fill block h-full rounded-full bg-blue-600" style={{ width: `${value}%`, animationDelay: '460ms' }} />
      </span>
      <span className="shrink-0 text-xs tabular-nums text-slate-500 dark:text-slate-400">
        {done}/{total}
      </span>
    </div>
  );
}

function DateLine({ tone, text }: { tone: 'amber' | 'blue'; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
      <span className={tone === 'amber' ? 'h-2.5 w-2.5 shrink-0 rounded-sm bg-amber-500' : 'h-2.5 w-2.5 shrink-0 rounded-sm bg-blue-500'} />
      {text}
    </div>
  );
}

const BARS = ['h-2', 'h-4', 'h-3', 'h-6', 'h-5', 'h-3', 'h-7'];

const PAIRS: { input: ReactNode; derived: ReactNode }[] = [
  {
    input: (
      <>
        <Field>Susun laporan minggu ke-3</Field>
        <span className={CHIP}>Tenggat</span>
        <Save label="Simpan" />
      </>
    ),
    derived: (
      <Derived title="Daftar tugas hari ini">
        <TaskLine title="Susun laporan minggu ke-3" meta="Tenggat · 14:00" />
        <TaskLine done title="Review desain landing page" meta="Selesai 08:41" />
        <Progress label="Skripsi" value={65} done={13} total={20} />
      </Derived>
    ),
  },
  {
    input: (
      <>
        <Field>Kelas metodologi penelitian</Field>
        <span className={CHIP}>Jadwal</span>
        <span className={CHIP_OFF}>08:00</span>
        <Save label="Simpan" />
      </>
    ),
    derived: (
      <Derived title="Kalender terisi sendiri">
        <DateLine tone="amber" text="Sabtu, 3 Oktober · 14:00 — Tenggat" />
        <DateLine tone="blue" text="Minggu, 4 Oktober · 08:00 — Jadwal" />
      </Derived>
    ),
  },
  {
    input: (
      <>
        <Field>Minum air 8 gelas</Field>
        <span className={CHIP_OFF}>Kebiasaan</span>
        <Save label="Tandai" />
      </>
    ),
    derived: (
      <Derived title="Konsistensi mingguan">
        <div className="flex items-end gap-1.5" aria-hidden="true">
          {BARS.map((h, i) => (
            <span
              key={i}
              className={`anim-grow w-4 rounded-t bg-blue-600/70 ${h}`}
              style={{ animationDelay: `${420 + i * 45}ms` }}
            />
          ))}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-900 dark:text-slate-100">12 hari</span> beruntun, tanpa dihitung manual.
        </p>
      </Derived>
    ),
  },
  {
    input: (
      <>
        <Field>Bab 4 — rangkaian logika</Field>
        <span className={CHIP_OFF}>Catatan</span>
        <Save label="Simpan" />
      </>
    ),
    derived: (
      <Derived title="Pencarian lintas modul">
        <div className="flex h-8 items-center rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
          bab 4
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">Catatan</span>
          <span className="truncate">Bab 4 — rangkaian logika</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">Tugas</span>
          <span className="truncate">Revisi bab 3 skripsi</span>
        </div>
      </Derived>
    ),
  },
];

/**
 * Bukti utama halaman: baris kiri yang ditulis sekali, baris kanan yang dihitung
 * dari tulisan itu. Menyorot satu pasangan meredupkan yang lain.
 */
export function LandingLedger() {
  const [active, setActive] = useState<number | null>(null);

  // Sorotan hanya bantuan visual untuk tetikus: tanpa kontrol mati, dan tanpa
  // keadaan redup permanen (papan tulis tetap utuh saat keyboard dipakai).
  const dim = (i: number) => (active !== null && active !== i ? 'opacity-50' : 'opacity-100');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <p
        className="anim-left border-b border-slate-200 pb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 lg:col-start-1 lg:row-start-1 lg:border-transparent lg:pr-8 dark:border-slate-800 dark:text-slate-400"
        style={{ animationDelay: '60ms' }}
      >
        Yang Anda tulis sekali
      </p>
      <p
        className="anim-right hidden border-b border-transparent pb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 lg:col-start-2 lg:row-start-1 lg:block lg:border-slate-200 lg:pl-8 dark:text-slate-400 dark:lg:border-slate-800"
        style={{ animationDelay: '100ms' }}
      >
        Yang Corely hitung sendiri
      </p>

      {PAIRS.map((pair, i) => (
        <div key={i} className="contents">
          <div
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            style={{ animationDelay: `${120 + i * 90}ms` }}
            className={`anim-left border-b border-slate-200 py-3.5 lg:col-start-1 lg:pr-8 ${ROW_START[i]} ${dim(i)} transition-opacity dark:border-slate-800`}
          >
            <div className="flex w-full items-center gap-2">{pair.input}</div>
          </div>
          <div
            style={{ animationDelay: `${165 + i * 90}ms` }}
            className={`anim-right border-b border-slate-200 py-3.5 lg:col-start-2 lg:border-l lg:pl-8 ${ROW_START[i]} ${dim(i)} transition-opacity dark:border-slate-800`}
          >
            {pair.derived}
          </div>
        </div>
      ))}
    </div>
  );
}
