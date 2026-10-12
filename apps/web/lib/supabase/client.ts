import { createBrowserClient } from '@supabase/ssr';

/** Browser client (Client Components). Env wajib `NEXT_PUBLIC_*` — anon key aman diekspos, keamanan di RLS. */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Supabase env belum diset — isi apps/web/.env.local (lihat .env.example).');
  return createBrowserClient(url, anonKey);
}
