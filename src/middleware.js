// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { cookies } = request;
  const hasCookie = cookies.has('token');
  const pathname = request.nextUrl.pathname;
  
  // 로그인 페이지는 제외하고, 그 외의 모든 보호된 경로에 대해 검사
  const protectedPaths = ['/', '/status', '/post']; 
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));



  // 쿠키가 없고 보호된 경로에 접근하려는 경우 로그인 페이지로 리디렉션
  if (!hasCookie && isProtectedPath && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login?expired=true', request.nextUrl.origin));
  }
  
  // 로그인 상태인데 로그인 페이지에 접근하려는 경우 메인으로 리디렉션
  if (hasCookie && pathname === '/login') {
      console.log('hasCookie:' + hasCookie);
      return NextResponse.redirect(new URL('/', request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  // 로그인 관련 경로와 Next.js 내부 파일들을 제외한 모든 경로에 미들웨어 적용
  matcher: [
    '/((?!login|api|_next/static|_next/image|favicon.ico).*)',
  ],
};