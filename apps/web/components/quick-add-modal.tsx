'use client';

import { useMemo, useState } from 'react';
import { X, Plus, CheckSquare, FolderKanban, NotebookPen, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, cn } from '@repo/ui';

interface QuickActionOption {
  label: string;
  icon: React.ReactNode;
}

const OPTIONS: QuickActionOption[] = [
  { label: 'Task', icon: <CheckSquare className="h-4 w-4" /> },
  { label: 'Project', icon: <FolderKanban className="h-4 w-4" /> },
  { label: 'Note', icon: <NotebookPen className="h-4 w-4" /> },
  { label: 'Habit', icon: <Flame className="h-4 w-4" /> },
];

export function QuickAddModal() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(OPTIONS[0].label);
  const ActiveIcon = useMemo(() => OPTIONS.find((o) => o.label === active)!, [active]);

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Quick Add</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-slate-200"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-semibold text-white">Quick Add</h3>
            <p className="mt-1 text-xs text-slate-400">Pilih jenis konten yang ingin ditambahkan (dummy — tanpa backend).</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {OPTIONS.map((o) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => setActive(o.label)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition',
                    active === o.label
                      ? 'border-blue-600 bg-blue-600/10 text-blue-400'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  )}
                >
                  {o.icon}
                  {o.label}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                {ActiveIcon.icon}
                Buat {active} baru
              </div>
              <input
                placeholder={`Judul ${active.toLowerCase()}...`}
                className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                defaultValue=""
              />
              <div className="mt-3 flex justify-end gap-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setOpen(false)}>
                  Batal
                </Button>
                <Button size="sm" type="button" onClick={() => setOpen(false)}>
                  Simpan (dummy)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
