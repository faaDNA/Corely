'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Menandai saat sebuah bagian halaman depan masuk ke layar, sekali saja.
 * Nilai awal selalu false dan `prefers-reduced-motion` membuatnya tetap false —
 * tidak ada elemen yang pernah disembunyikan lebih dulu, jadi tanpa JavaScript
 * atau tanpa animasi halaman tetap terbaca utuh.
 */
export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setInView(true);
        io.disconnect();
      },
      // Picu setelah bagian benar-benar masuk (18% dari tepi bawah), supaya
      // gerakannya terbaca penuh — bukan sudah lewat saat mata menyusul.
      { rootMargin: '0px 0px -18% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, inView };
}
