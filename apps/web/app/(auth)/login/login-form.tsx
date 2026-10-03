'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { login } from '../actions';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui';

const initialState: { error?: string } = {};

export function LoginForm() {
  const [state, formAction] = useFormState(login, initialState);

  return (
    <Card className="w-full max-w-md bg-slate-900/80">
      <CardHeader>
        <CardTitle className="text-xl">Selamat datang kembali</CardTitle>
        <CardDescription>Masuk untuk membuka workspace Anda. (Mode dummy — email & password apa saja valid)</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-200">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="nama@email.com"
              autoComplete="email"
              defaultValue="daffa@mail.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-200">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              autoComplete="current-password"
              defaultValue="password123"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs text-red-300">
              {state.error}
            </p>
          )}

          <Button className="w-full" type="submit">Masuk</Button>

          <p className="text-center text-xs text-slate-400">
            Belum punya akun?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300">Daftar</Link>
            {' · '}
            <Link href="/" className="text-slate-500 hover:text-slate-300">Kembali ke beranda</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
