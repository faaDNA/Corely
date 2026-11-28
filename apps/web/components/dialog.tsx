'use client';

import type { ReactElement } from 'react';
import * as RD from '@radix-ui/react-dialog';

/**
 * Modal bersama (Radix): Esc menutup, fokus terperangkap di dalam & kembali ke pemicu
 * saat ditutup, role="dialog" + aria-modal, klik di luar menutup.
 *
 * `children` = SATU elemen panel (form/div) — dipakai langsung sebagai konten dialog
 * (asChild), jadi markup & gaya panel tiap modal tetap. Panel wajib memuat <DialogTitle>.
 * Saat dibuka, fokus ke input pertama (form) atau tombol pertama (konfirmasi = "Batal").
 */
export function Dialog({
  open,
  onClose,
  withDescription = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** true bila panel memuat <DialogDescription> — Radix menautkannya via aria-describedby. */
  withDescription?: boolean;
  children: ReactElement;
}) {
  return (
    <RD.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <RD.Portal>
        <RD.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 [&>*]:pointer-events-auto">
          <RD.Content
            asChild
            {...(withDescription ? {} : { 'aria-describedby': undefined })}
            onOpenAutoFocus={(e) => {
              const field = (e.currentTarget as HTMLElement).querySelector<HTMLElement>(
                '[data-autofocus], input:not([type=hidden]):not([disabled]), textarea:not([disabled])'
              );
              if (field) {
                e.preventDefault();
                field.focus();
              }
            }}
          >
            {children}
          </RD.Content>
        </div>
      </RD.Portal>
    </RD.Root>
  );
}

export const DialogTitle = RD.Title;
export const DialogDescription = RD.Description;
