"use client"
import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();
  const handleLogout = () => {
  

  // 1. 쿠키 삭제
  document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  // 2. 로그인 페이지로 리디렉션
  router.push('/login');
};
  return (
    <footer className="bg-cyan-800">
      <ul className="flex items-center justify-between lg:container px-4 py-6 mx-auto text-sm text-white md:px-6">
        <li>
          Created by{" "}
          <a
            href="https://taylorbryant.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold"
          >
            Taylor Bryant
          </a>
        </li>

        <li className="font-bold" onClick={handleLogout}>
          
            GitHub
          
        </li>
      </ul>
    </footer>
  );
}
