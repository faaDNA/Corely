import { redirect } from 'next/navigation';
import type { Profile } from '@repo/types';
import { createClient } from '@/lib/supabase/server';

type Result = { error?: string; message?: string };

/** Profil user login; null bila sesi tidak valid. */
export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from('profiles').select('name, nickname, email').eq('id', user.id).maybeSingle();

  // Fallback ke metadata auth bila row belum ada (trigger lama belum jalan).
  return {
    name: data?.name ?? (user.user_metadata?.name as string) ?? '',
    nickname: data?.nickname ?? (user.user_metadata?.nickname as string) ?? '',
    email: data?.email ?? user.email ?? '',
  };
}

/** Like getProfile tapi redirect ke /login bila tidak ada sesi. */
export async function requireProfile(): Promise<Profile> {
  const profile = await getProfile();
  if (!profile) redirect('/login');
  return profile;
}
