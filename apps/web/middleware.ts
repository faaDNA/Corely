import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PROTECTED = ['/dashboard', '/tasks', '/projects', '/notes', '/bookmarks', '/habits', '/calendar', '/analytics', '/settings'];

/** Refresh sesi Supabase via cookie — guard dummy `pd_session` lama dibuang. Tanpa env, fallback guard lama agar dev mock tetap jalan. */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const { pathname } = req.nextUrl;

  if (!url || !anonKey) {
    // Env belum diset → mode dummy lama (supaya UI mock tetap bisa dibuka).
    const session = req.cookies.get('pd_session')?.value;
    if (PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/')) && !session) {
      const redir = req.nextUrl.clone();
      redir.pathname = '/login';
      return NextResponse.redirect(redir);
    }
    if ((pathname === '/login' || pathname === '/register') && session) {
      const redir = req.nextUrl.clone();
      redir.pathname = '/dashboard';
      return NextResponse.redirect(redir);
    }
    return res;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/')) && !user) {
    const redir = req.nextUrl.clone();
    redir.pathname = '/login';
    return NextResponse.redirect(redir);
  }

  if ((pathname === '/login' || pathname === '/register') && user) {
    const redir = req.nextUrl.clone();
    redir.pathname = '/dashboard';
    return NextResponse.redirect(redir);
  }

  return res;
}
