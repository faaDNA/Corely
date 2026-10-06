'use client';

import { useEffect, useState } from 'react';
import { mockUser } from '@/lib/mock-data';

export function Greeting() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const hour = now?.getHours() ?? 12;
  const partOfDay =
    hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 18 ? 'Selamat sore' : 'Selamat malam';

  const dateStr = now
    ? now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {partOfDay}, {mockUser.name}! 👋
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{dateStr}</p>
    </div>
  );
}
