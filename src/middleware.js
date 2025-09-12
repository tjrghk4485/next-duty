// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { cookies } = request;
  const hasCookie = cookies.has('token');
  const pathname = request.nextUrl.pathname;

  // "/" 경로를 "/status"로 리다이렉트하는 로직을 미들웨어에 추가합니다.
  if (pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url));
  }
  console.log('pathname' + pathname);
  // 쿠키가 없고 보호된 경로에 접근하려는 경우 로그인 페이지로 리디렉션
  const protectedPaths = ['/status', '/post'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (!hasCookie && isProtectedPath) {
    return NextResponse.redirect(new URL('/login?expired=true', request.url));
  }

  // 로그인 상태인데 로그인 페이지에 접근하려는 경우 메인으로 리디렉션
  if (hasCookie && pathname === '/login') {
    return NextResponse.redirect(new URL('/status', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};