import Header from "./header";
import Footer from "./footer";
import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Header/>
        {/* 모든 페이지 콘텐츠는 여기에 렌더링됩니다. */}
        <div className="font-sans flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
          <main className="w-[1745px] min-h-screen  rounded-2xl">
          {children}
          </main>
        </div>
        <Footer/>
      </body>
    </html>
  );
}
