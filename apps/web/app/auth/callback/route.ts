import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/** Tukar kode OAuth/confirm jadi sesi cookie, lalu ke tujuan. */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  let res = NextResponse.next({ request: { headers: req.headers } });

  if (code) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && anonKey) {
      const supabase = createServerClient(url, anonKey, {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
          },
        },
      });
      await supabase.auth.exchangeCodeForSession(code);
    }
  }

  const dest = `${origin}${next.startsWith('/') ? next : '/dashboard'}`;
  const redirectRes = NextResponse.redirect(dest);
  res.cookies.getAll().forEach((c) => redirectRes.cookies.set(c));
  return redirectRes;
}
