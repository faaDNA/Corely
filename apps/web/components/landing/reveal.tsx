'use client';

import type { ReactNode } from 'react';
import { useInView } from './use-in-view';

/**
 * Membungkus satu bagian halaman depan: animasi masuknya diputar saat bagian
 * itu digulir masuk ke layar, bukan saat halaman dibuka. Kelas animasi selalu
 * ada sejak HTML awal, tetapi ditahan di frame awal lewat `reveal-paused`
 * (globals.css) sehingga isi tidak pernah tampil penuh lalu berkedip. Tanpa
 * JavaScript `@media (scripting: none)` mematikan animasi dan isi tetap terbaca.
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
  const mark = stagger ? 'stagger' : `anim-${kind}`;
  const paused = inView ? '' : 'reveal-paused';

  return (
    <div
      ref={ref}
      className={[className, mark, paused].filter(Boolean).join(' ')}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
