import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PROTECTED = ['/dashboard', '/tasks', '/projects', '/notes', '/bookmarks', '/habits', '/calendar', '/analytics', '/settings'];

/** Refresh sesi Supabase via cookie + guard route. */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  let res = NextResponse.next({ request: { headers: req.headers } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Tanpa env (mis. build lokal) — lewati guard, jangan crash.
  if (!url || !anonKey) return res;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: { headers: req.headers } });
        cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  // getUser() wajib memicu refresh token + set cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const guarded = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const authPage = pathname === '/login' || pathname === '/register';

  if ((guarded && !user) || (authPage && user)) {
    const target = req.nextUrl.clone();
    target.pathname = guarded && !user ? '/login' : '/dashboard';
    target.search = '';
    const redirectRes = NextResponse.redirect(target);
    res.cookies.getAll().forEach((c) => redirectRes.cookies.set(c));
    return redirectRes;
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};