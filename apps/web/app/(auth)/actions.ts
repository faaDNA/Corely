'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE = 'pd_session';

// ponytail: dummy auth — ganti dengan Supabase Auth di sprint auth berikutnya
export async function login(_prev: unknown, formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi.' };
  }
  if (!email.includes('@')) {
    return { error: 'Format email tidak valid.' };
  }

  cookies().set(COOKIE, 'dummy-session', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect('/dashboard');
}

export async function register(_prev: unknown, formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!name || !email || !password) {
    return { error: 'Semua field wajib diisi.' };
  }
  if (!email.includes('@')) {
    return { error: 'Format email tidak valid.' };
  }
  if (password.length < 6) {
    return { error: 'Password minimal 6 karakter.' };
  }

  cookies().set(COOKIE, 'dummy-session', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect('/dashboard');
}

export async function logout() {
  cookies().delete(COOKIE);
  redirect('/login');
}

// ponytail: frontend-only — OAuth Google asli saat backend auth ada
export async function googleLogin() {
  cookies().set(COOKIE, 'dummy-session', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect('/dashboard');
}
