import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/** Server client (Server Components, Server Actions, Route Handlers). */
export function createClient() {
  // cookies() duluan → bikin route jadi dynamic, bukan error env saat `next build`.
  const cookieStore = cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Supabase env belum diset — isi apps/web/.env.local (lihat .env.example).');

  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Component tidak bisa set cookie — biarkan middleware yang refresh.
        }
      },
    },
  });
}