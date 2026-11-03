'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '@repo/ui';

/**
 * Dropdown filter/pengaturan. Pengganti <select> native: popup native
 * digambar OS di luar halaman sehingga tak bisa distyling (tanggal, kecil,
 * tak konsisten dengan dark mode).
 * ponytail: label tiap opsi disuplai call site — upgrade ke translasi
 * dari markup `<select>` bila sumber label jadi terpusat.
 */
export function Select({
  value,
  onValueChange,
  placeholder,
  options,
  ariaLabel,
  id,
  className,
}: {
  value: string;
  onValueChange: (v: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  ariaLabel?: string;
  id?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <DropdownMenu.Root modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          id={id}
          aria-label={ariaLabel}
          className={cn(
            'inline-flex items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 data-[state=open]:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600',
            className,
          )}
        >
          <span
            className={cn(
              'truncate',
              !selected && 'text-slate-500 dark:text-slate-400',
            )}
          >
            {selected?.label ?? placeholder ?? 'Pilih'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform data-[state=open]:rotate-180 dark:text-slate-400" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={6}
          collisionPadding={8}
          className="z-50 max-h-64 min-w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          <DropdownMenu.RadioGroup
            value={value}
            onValueChange={(v) => {
              onValueChange(v);
              setOpen(false);
            }}
          >
            {options.map((o) => (
              <DropdownMenu.RadioItem
                key={o.value}
                value={o.value}
                className="flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-slate-700 outline-none transition data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 data-[state=checked]:font-medium dark:text-slate-300 dark:data-[highlighted]:bg-blue-500/10 dark:data-[highlighted]:text-blue-300"
              >
                {/* lebar tetap supaya label tak melompat saat pindah item */}
                <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-blue-600 dark:text-blue-400">
                  <DropdownMenu.ItemIndicator>
                    <Check className="h-3.5 w-3.5" />
                  </DropdownMenu.ItemIndicator>
                </span>
                {o.label}
              </DropdownMenu.RadioItem>
            ))}
            {options.length === 0 && (
              <DropdownMenu.Label className="select-none px-2.5 py-2 text-xs text-slate-500 dark:text-slate-400">
                Tidak ada pilihan
              </DropdownMenu.Label>
            )}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}