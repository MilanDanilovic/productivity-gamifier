import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Note: localStorage is not available in middleware, so we'll handle auth checks client-side
  // This middleware just handles basic routing
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register');

  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/today') ||
    request.nextUrl.pathname.startsWith('/quests') ||
    request.nextUrl.pathname.startsWith('/rewards') ||
    request.nextUrl.pathname.startsWith('/achievements');

  // For protected pages, we'll check auth client-side
  // Middleware can't access localStorage, so we'll let the page handle redirects
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

