'use client';

import { useFormState } from 'react-dom';
import { forgotPassword } from '../actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui';
import { FormAlert } from '@/components/form-alert';
import { SubmitButton } from '@/components/submit-button';

const initialState: { error?: string; message?: string } = {};

export function ForgotPasswordForm() {
  const [state, formAction] = useFormState(forgotPassword, initialState);

  return (
    <Card className="w-full max-w-md bg-white dark:bg-slate-900/80">
      <CardHeader>
        <CardTitle className="text-xl">Lupa Password</CardTitle>
        <CardDescription>Masukkan email akun. Kami kirim tautan untuk mengatur ulang password.</CardDescription>
      </CardHeader>
      <CardContent>
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
              className="w-full rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <FormAlert state={state} />

          <SubmitButton className="w-full" type="submit">Kirim Tautan Reset</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}