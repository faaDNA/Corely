'use server';

import type { Profile } from '@repo/types';
import { createClient } from '@/lib/supabase/server';

type Result = { error?: string; message?: string };

/** Simpan nama + nama panggilan (+ email bila berubah). */
export async function updateProfile(profile: Profile): Promise<Result> {
  if (!profile.name.trim() || !profile.nickname.trim()) {
    return { error: 'Nama dan nama panggilan wajib diisi.' };
  }
  if (!profile.email.includes('@')) return { error: 'Format email tidak valid.' };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Sesi berakhir. Masuk ulang.' };

  const emailChanged = profile.email !== user.email;
  let email = user.email ?? profile.email;
  if (emailChanged) {
    const { data, error } = await supabase.auth.updateUser({ email: profile.email });
    if (error) return { error: 'Ganti email gagal. Cek inbox bila perlu konfirmasi.' };
    email = data.user.email ?? email;
  }

  const { error } = await supabase
    .from('profiles')
    .update({ name: profile.name.trim(), nickname: profile.nickname.trim(), email })
    .eq('id', user.id);
  if (error) return { error: `Gagal simpan profil: ${error.message}` };

  return { message: 'Profil disimpan.' };
}

/** Verifikasi password lama via re-auth, lalu ganti password baru. */
export async function changePassword(current: string, next: string): Promise<Result> {
  if (!current || !next) return { error: 'Lengkapi semua field password.' };
  if (next.length < 6) return { error: 'Password baru minimal 6 karakter.' };
  if (current === next) return { error: 'Password baru harus berbeda dari yang lama.' };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { error: 'Sesi berakhir. Masuk ulang.' };

  const { error: reauthErr } = await supabase.auth.signInWithPassword({ email: user.email, password: current });
  if (reauthErr) return { error: 'Password saat ini salah.' };

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) return { error: `Gagal ubah password: ${error.message}` };

  return { message: 'Password berhasil diubah.' };
}