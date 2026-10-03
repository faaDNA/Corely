import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/dashboard', '/tasks', '/projects', '/notes', '/bookmarks', '/habits', '/calendar', '/analytics', '/settings'];

export function middleware(req: NextRequest) {
  const session = req.cookies.get('pd_session')?.value;
  const { pathname } = req.nextUrl;

  if (PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/')) && !session) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (pathname === '/login' && session) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
