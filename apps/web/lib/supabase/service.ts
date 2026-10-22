import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role client (server only, bypass RLS) — untuk cron/endpoint sistem
 * yang tidak punya sesi user. JANGAN dipanggil dari client component.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase service role env belum diset (SUPABASE_SERVICE_ROLE_KEY).');
  return createSupabaseClient(url, key, { auth: { persistSession: false } });
}
