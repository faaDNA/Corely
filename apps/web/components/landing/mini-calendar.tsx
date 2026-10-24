'use client';

import { useState } from 'react';
import { buildMonthGrid } from '@/lib/calendar-grid';

/**
 * Papan bulan: kisi tanggal bergaris tipis sebagai isian ruang kanan judul.
 * Menyorot satu tanggal menerangkan kendali Corely — tanggal itu sudah terisi
 * sendiri oleh tenggat, jadwal, dan batas proyek. Datanya contoh.
 */

type Item = { type: 'tenggat' | 'jadwal' | 'proyek'; title: string; time: string };

const MARKER: Record<Item['type'], string> = {
  tenggat: 'bg-amber-500',
  jadwal: 'bg-blue-500',
  proyek: 'bg-purple-500',
};

const ITEMS: Record<string, Item[]> = {
  '2026-09-30': [{ type: 'jadwal', title: 'Bimbingan awal', time: '10:00' }],
  '2026-10-03': [{ type: 'tenggat', title: 'Susun laporan minggu ke-3', time: '14:00' }],
  '2026-10-04': [{ type: 'jadwal', title: 'Kelas metodologi penelitian', time: '08:00' }],
  '2026-10-06': [{ type: 'tenggat', title: 'Revisi bab 3 skripsi', time: '20:00' }],
  '2026-10-08': [
    { type: 'jadwal', title: 'Seminar kelompok', time: '13:00' },
    { type: 'tenggat', title: 'Kumpulkan daftar pustaka', time: '21:00' },
  ],
  '2026-10-12': [{ type: 'jadwal', title: 'Konsultasi dosen pembimbing', time: '10:00' }],
  '2026-10-20': [{ type: 'tenggat', title: 'Draf bab 4', time: '23:00' }],
  '2026-10-26': [{ type: 'jadwal', title: 'Ujian tengah semester', time: '09:00' }],
  '2026-10-30': [{ type: 'proyek', title: 'Batas Proyek Skripsi', time: '23:59' }],
  '2026-10-31': [{ type: 'tenggat', title: 'Rapikan referensi', time: '17:00' }],
};

const WEEKDAY = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const WEEKDAY_LONG = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const MONTH_LONG = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

/** Kisi Oktober 2026 (Senin lebih dulu). */
const CELLS = buildMonthGrid(2026, 9);

const TODAY_KEY = '2026-10-24';
/** Terbuka pada tanggal yang agendanya sudah terlihat, bukan keadaan kosong hari ini. */
const DEFAULT = CELLS.findIndex((c) => c.key === '2026-10-03');

export function MiniCalendar() {
  const [active, setActive] = useState(DEFAULT);
  const current = CELLS[active];
  const items = ITEMS[current.key] ?? [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold">Oktober 2026</h2>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">Contoh data</span>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1">
        {WEEKDAY.map((d) => (
          <span
            key={d}
            className="pb-1 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400"
          >
            {d}
          </span>
        ))}

        {CELLS.map((cell, i) => {
          const isActive = i === active;
          const crosshair = !isActive && (cell.row === current.row || cell.col === current.col);
          const isToday = cell.key === TODAY_KEY;
          const marks = ITEMS[cell.key] ?? [];

          return (
            <button
              key={cell.key}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              aria-label={`${WEEKDAY_LONG[cell.weekday]}, ${cell.day} ${MONTH_LONG[cell.month]}${marks.length ? `, ${marks.length} agenda` : ''}`}
              className={[
                'flex h-10 flex-col items-center justify-center gap-1 rounded-md transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/40'
                  : crosshair
                    ? 'bg-slate-100 dark:bg-slate-800/60'
                    : '',
                // garis penanda dipisah dari latar agar "hari ini" tetap terbaca
                // walau tanggalnya kebetulan satu baris atau satu kolom dengan sel aktif
                isActive ? 'ring-1 ring-inset ring-blue-600' : isToday ? 'ring-1 ring-inset ring-slate-300 dark:ring-slate-700' : '',
              ].join(' ')}
            >
              <span
                className={[
                  'text-xs tabular-nums',
                  isActive
                    ? 'font-semibold text-blue-700 dark:text-blue-300'
                    : cell.inMonth
                      ? 'text-slate-700 dark:text-slate-300'
                      : 'text-slate-300 dark:text-slate-600',
                  isToday && !isActive ? 'font-semibold' : '',
                ].join(' ')}
              >
                {cell.day}
              </span>
              <span className="flex h-1 items-center gap-0.5">
                {marks.slice(0, 2).map((m, k) => (
                  <span key={k} className={`h-1 w-1 rounded-[1px] ${MARKER[m.type]}`} />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="papan-bulan-hari-ini"
        aria-live="polite"
        className="mt-4 h-[84px] border-t border-slate-200 pt-3 dark:border-slate-800"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
          {WEEKDAY_LONG[current.weekday]}, {current.day} {MONTH_LONG[current.month]}
          {current.key === TODAY_KEY ? ' · hari ini' : ''}
        </p>
        <div className="mt-2 space-y-1.5">
          {items.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tidak ada tenggat maupun jadwal di tanggal ini.
            </p>
          ) : (
            items.map((m, k) => (
              <div key={k} className="flex items-center gap-2.5 text-sm">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-sm ${MARKER[m.type]}`} />
                <span className="truncate text-slate-800 dark:text-slate-200">{m.title}</span>
                <span className="ml-auto shrink-0 text-xs tabular-nums text-slate-500 dark:text-slate-400">
                  {m.time}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-slate-200 pt-3 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
        {(['tenggat', 'jadwal', 'proyek'] as const).map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-sm ${MARKER[t]}`} />
            {t === 'tenggat' ? 'Tenggat tugas' : t === 'jadwal' ? 'Jadwal tugas' : 'Batas proyek'}
          </span>
        ))}
      </div>
    </div>
  );
}
