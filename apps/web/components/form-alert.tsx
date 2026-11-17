'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { AuthState } from '@/app/(auth)/actions';

const BOX = 'flex items-start gap-2 rounded-lg border px-3 py-2 text-xs';
const ERROR =
  'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300';
const OK =
  'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300';

/** Alert form: getar diputar ulang tiap percobaan, walau teksnya sama. */
export function FormAlert({ state }: { state?: AuthState }) {
  const [closedAt, setClosedAt] = useState<number>();

  if (closedAt !== undefined && closedAt === state?.at) return null;
  if (!state?.error && !state?.message) return null;

  const isError = !!state.error;
  return (
    <div
      key={state.at}
      role="alert"
      className={`${BOX} ${isError ? ERROR : OK} ${isError ? 'alert-shake' : ''}`}
    >
      <p className="flex-1">{state.error ?? state.message}</p>
      <button
        type="button"
        onClick={() => setClosedAt(state.at)}
        aria-label="Tutup pesan"
        className="-mr-1 rounded p-1 opacity-70 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
