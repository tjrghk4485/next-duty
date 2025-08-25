// app/layout.js
'use client'; // 이 훅을 사용하기 위해 'use client'를 추가해야 합니다.

import { usePathname } from 'next/navigation';
import Header from "./header";
import Footer from "./footer";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // 로그인 페이지인지 확인
  const isLoginPage = pathname === '/login';

  return (
    <html lang="ko">
      <body>
        {!isLoginPage && <Header />}
        <div className="font-sans flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
          <main className="w-[1745px] min-h-screen rounded-2xl">
            {children}
          </main>
        </div>
        {!isLoginPage && <Footer />}
      </body>
    </html>
  );
}