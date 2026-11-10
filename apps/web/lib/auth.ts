import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

/** User login saat ini, dideduplikasi per-request via React cache(). */
export const getUser = cache(async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
