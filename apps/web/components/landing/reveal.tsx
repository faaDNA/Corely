'use client';

import type { ReactNode } from 'react';
import { useInView } from './use-in-view';

/**
 * Membungkus satu bagian halaman depan: animasi masuknya diputar saat bagian
 * itu digulir masuk ke layar, bukan saat halaman dibuka. Elemen selalu tampil
 * penuh pada HTML awal — kelas animasinya baru dipasang setelah masuk layar,
 * sehingga tanpa JavaScript halaman tidak pernah kosong.
 *
 * Dua cara main: `kind` menggerakkan seluruh bagian (`arrive` untuk blok besar
 * yang butuh durasi lebih panjang), `stagger` mengisi daftar barisnya berurutan
 * (langkah tetap 75ms, `globals.css` `.stagger`).
 */
export function Reveal({
  children,
  className = '',
  kind = 'rise',
  delay,
  stagger = false,
}: {
  children: ReactNode;
  className?: string;
  kind?: 'rise' | 'left' | 'right' | 'arrive';
  delay?: number;
  stagger?: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const mark = !inView ? '' : stagger ? 'stagger' : `anim-${kind}`;

  return (
    <div
      ref={ref}
      className={[className, mark].filter(Boolean).join(' ')}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
