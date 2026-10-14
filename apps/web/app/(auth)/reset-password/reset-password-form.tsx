'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { Eye, EyeOff } from 'lucide-react';
import { resetPassword } from '../actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui';
import { SubmitButton } from '@/components/submit-button';

const initialState: { error?: string } = {};

export function ResetPasswordForm() {
  const [state, formAction] = useFormState(resetPassword, initialState);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inputCls =
    'w-full rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950 px-3 py-2 pr-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none';
  const toggleCls = 'absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200';

  return (
    <Card className="w-full max-w-md bg-white dark:bg-slate-900/80">
      <CardHeader>
        <CardTitle className="text-xl">Password Baru</CardTitle>
        <CardDescription>Masukkan password baru untuk akun Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-200">Password Baru</label>
            <div className="relative">
              <input id="password" name="password" type={showPw ? 'text' : 'password'} required minLength={6} placeholder="Minimal 6 karakter" autoComplete="new-password" className={inputCls} />
              <button type="button" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? 'Sembunyikan password' : 'Tampilkan password'} className={toggleCls}>
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-200">Konfirmasi Password</label>
            <div className="relative">
              <input id="confirmPassword" name="confirmPassword" type={showConfirm ? 'text' : 'password'} required minLength={6} placeholder="Ulangi password" autoComplete="new-password" className={inputCls} />
              <button type="button" onClick={() => setShowConfirm((v) => !v)} aria-label={showConfirm ? 'Sembunyikan password' : 'Tampilkan password'} className={toggleCls}>
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {state?.error && (
            <p className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs text-red-300">{state.error}</p>
          )}

          <SubmitButton className="w-full" type="submit">Simpan Password</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}