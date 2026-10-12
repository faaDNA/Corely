'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const DUMMY = 'pd_session';

/** Bentuk balik semua action auth untuk useFormState. */
type AuthState = { error?: string; message?: string };

/** Origin request saat ini — untuk redirectTo OAuth / link reset. */
async function getOrigin() {
  const h = headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? (host.includes('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

/** Pesan Supabase → bahasa Indonesia. */
function idError(msg?: string) {
  const m = (msg ?? '').toLowerCase();
  if (m.includes('invalid login credentials')) return 'Email atau password salah.';
  if (m.includes('already registered')) return 'Email sudah terdaftar. Silakan masuk.';
  if (m.includes('at least 6') || m.includes('password')) return 'Password minimal 6 karakter.';
  if (m.includes('email not confirmed')) return 'Email belum dikonfirmasi. Cek inbox.';
  if (m.includes('rate limit')) return 'Terlalu banyak percobaan. Coba lagi nanti.';
  return msg ?? 'Terjadi kesalahan. Coba lagi.';
}

function clearDummy() {
  try {
    cookies().delete(DUMMY);
  } catch {
    // Server Component tidak bisa hapus cookie — abaikan.
  }
}

export async function login(_prev: unknown, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) return { error: 'Email dan password wajib diisi.' };
  if (!email.includes('@')) return { error: 'Format email tidak valid.' };

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: idError(error.message) };

  redirect('/dashboard');
}

export async function register(_prev: unknown, formData: FormData): Promise<AuthState> {
  const name = String(formData.get('name') ?? '').trim();
  const nickname = String(formData.get('nickname') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  if (!name || !nickname || !email || !password || !confirmPassword) {
    return { error: 'Semua field wajib diisi.' };
  }
  if (password !== confirmPassword) return { error: 'Konfirmasi password tidak cocok.' };
  if (!email.includes('@')) return { error: 'Format email tidak valid.' };
  if (password.length < 6) return { error: 'Password minimal 6 karakter.' };

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // ponytail: Supabase Dashboard > Auth > Email confirmation WAJIB on saat dev agar sesi dibuat langsung.
    options: { data: { name, nickname } },
  });
  if (error) return { error: idError(error.message) };

  // Konfirmasi email aktif → belum ada sesi, ke halaman login dengan info.
  if (!data.session) return { message: 'Pendaftaran berhasil. Cek email untuk konfirmasi akun.' };

  redirect('/dashboard');
}

export async function logout() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (url) await createClient().auth.signOut();
  clearDummy();
  redirect('/login');
}

/** ponytail: OAuth Google — butuh provider di Supabase + redirect URI. */
export async function googleLogin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (url) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${await getOrigin()}/auth/callback` },
    });
    if (error) redirect('/login');
    if (data.url) redirect(data.url);
    return;
  }
  // Mode dummy tanpa env.
  cookies().set(DUMMY, 'dummy-session', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect('/dashboard');
}

/** Kirim email reset password — dipakai via useFormState. */
export async function forgotPassword(_prev: unknown, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  if (!email || !email.includes('@')) return { error: 'Format email tidak valid.' };
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await getOrigin()}/auth/callback?next=/reset-password`,
  });
  // Jangan bocorkan apakah email terdaftar.
  if (error && error.message.toLowerCase().includes('rate limit')) {
    return { error: 'Terlalu banyak permintaan. Coba lagi nanti.' };
  }
  return { message: 'Jika email terdaftar, tautan reset dikirim ke inbox.' };
}

/** Set password baru dari sesi recovery (link email). */
export async function resetPassword(_prev: unknown, formData: FormData): Promise<AuthState> {
  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirmPassword') ?? '');
  if (password.length < 6) return { error: 'Password minimal 6 karakter.' };
  if (password !== confirm) return { error: 'Konfirmasi password tidak cocok.' };

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: idError(error.message) };
  redirect('/login');
}
