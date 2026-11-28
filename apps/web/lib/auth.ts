import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type AuthUser = { id: string; email?: string; user_metadata?: Record<string, unknown> };

/**
 * User login saat ini, dideduplikasi per-request via React cache().
 *
 * getClaims(), bukan getUser(): dengan JWT signing key asimetrik (Supabase Dashboard >
 * Authentication > JWT Keys) token diverifikasi lokal tanpa round trip ke Auth server.
 * Dengan kunci simetrik (HS256) getClaims otomatis jatuh balik ke getUser() — aman di
 * kedua keadaan. Middleware tetap getUser() untuk refresh token.
 */
export const getUser = cache(async (): Promise<AuthUser | null> => {
  const { data, error } = await createClient().auth.getClaims();
  const claims = data?.claims;
  if (error || !claims?.sub) return null;
  return {
    id: claims.sub,
    email: typeof claims.email === 'string' ? claims.email : undefined,
    user_metadata: (claims.user_metadata as Record<string, unknown> | undefined) ?? undefined,
  };
});

/** Untuk server action: id user atau lempar error sesi (ditangkap try/catch tiap action). */
export async function requireUserId(): Promise<string> {
  const user = await getUser();
  if (!user) throw new Error('Sesi berakhir. Masuk ulang.');
  return user.id;
}
