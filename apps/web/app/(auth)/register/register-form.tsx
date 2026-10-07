'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { googleLogin, register } from '../actions';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui';
import { GoogleIcon } from '@/components/google-icon';

const initialState: { error?: string } = {};

export function RegisterForm() {
  const [state, formAction] = useFormState(register, initialState);

  return (
    <Card className="w-full max-w-md bg-white dark:bg-slate-900/80">
      <CardHeader>
        <CardTitle className="text-xl">Buat akun baru</CardTitle>
        <CardDescription>Mulai kelola produktivitas Anda. (Mode dummy — langsung masuk)</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={googleLogin} className="mb-4">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <GoogleIcon className="h-5 w-5 shrink-0" />
            Daftar dengan Google
          </button>
        </form>

        <div className="mb-4 flex items-center gap-3 text-[11px] text-slate-400">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          atau
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-200">Nama</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Nama Anda"
              autoComplete="name"
              className="w-full rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="nama@email.com"
              autoComplete="email"
              className="w-full rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Minimal 6 karakter"
              autoComplete="new-password"
              className="w-full rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs text-red-300">
              {state.error}
            </p>
          )}

          <Button className="w-full" type="submit">Daftar</Button>

          <p className="text-center text-xs text-slate-400">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Masuk</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
