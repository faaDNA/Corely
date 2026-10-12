'use client';

import { useEffect, useState } from 'react';
import type { Profile } from '@repo/types';

export function Greeting({ profile }: { profile: Profile }) {
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

  const who = profile.nickname || profile.name || 'Pengguna';

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {partOfDay}, {who}! 👋
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{dateStr}</p>
    </div>
  );
}