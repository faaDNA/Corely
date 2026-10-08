'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { Eye, EyeOff } from 'lucide-react';
import { googleLogin, login } from '../actions';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui';
import { GoogleIcon } from '@/components/google-icon';

const initialState: { error?: string } = {};

export function LoginForm() {
  const [state, formAction] = useFormState(login, initialState);
  const [showPw, setShowPw] = useState(false);

  return (
    <Card className="w-full max-w-md bg-white dark:bg-slate-900/80">
      <CardHeader>
        <CardTitle className="text-xl">Selamat datang kembali</CardTitle>
        <CardDescription>Masuk untuk membuka workspace Anda. (Mode dummy — email & password apa saja valid)</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={googleLogin} className="mb-4">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <GoogleIcon className="h-5 w-5 shrink-0" />
            Lanjutkan dengan Google
          </button>
        </form>

        <div className="mb-4 flex items-center gap-3 text-[11px] text-slate-400">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          atau
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="nama@email.com"
              autoComplete="email"
              defaultValue="daffa@mail.com"
              className="w-full rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                required
                placeholder="••••••••"
                autoComplete="current-password"
                defaultValue="password123"
                className="w-full rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950 px-3 py-2 pr-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Sembunyikan password' : 'Tampilkan password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {state?.error && (
            <p className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs text-red-300">
              {state.error}
            </p>
          )}

          <Button className="w-full" type="submit">Masuk</Button>

          <p className="text-center text-xs text-slate-400">
            Belum punya akun?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Daftar</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
