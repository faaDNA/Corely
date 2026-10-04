'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '@repo/ui';

type ToastKind = 'success' | 'error';
type ToastItem = { id: number; kind: ToastKind; message: string };

export function toast(message: string, kind: ToastKind = 'success') {
  window.dispatchEvent(new CustomEvent('pd-toast', { detail: { message, kind } }));
}

function ToastHostImpl() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    function onToast(e: Event) {
      const { message, kind } = (e as CustomEvent).detail as { message: string; kind: ToastKind };
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, kind, message }]);
      setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3200);
    }
    window.addEventListener('pd-toast', onToast);
    return () => window.removeEventListener('pd-toast', onToast);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto flex max-w-xs items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-xl backdrop-blur',
            t.kind === 'success'
              ? 'border-emerald-500/30 bg-emerald-950/90 text-emerald-200'
              : 'border-red-500/30 bg-red-950/90 text-red-200'
          )}
        >
          {t.kind === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          <span className="flex-1">{t.message}</span>
          <button type="button" onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))} aria-label="Close" className="opacity-60 hover:opacity-100">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function ToastHost() {
  return <ToastHostImpl />;
}