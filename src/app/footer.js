"use client"
import { useRouter } from 'next/navigation';
import axios from "./lib/axios";
export default function Footer() {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const handleLogout = async () => {
  
  try{
    // 1. 쿠키 삭제
 const response =  await axios.post(`api/auth/logout`, {
        credentials: "include"
    });
    alert("로그아웃 되었습니다.");
  // 2. 로그인 페이지로 리디렉션
  router.push('/login');
  } catch (error){
    console.error(error);
    alert("로그아웃 중 오류발생.");
  }
  
};
  return (
    <footer className="bg-cyan-800">
      <ul className="flex items-center justify-between lg:container px-4 py-6 mx-auto text-sm text-white md:px-6">
        <li>
          Created by 석화       
        </li>
        <button className="w-[80px] h-[50px]  text-white rounded-2xl border border-cyan-800 shadow-md hover:bg-sky-900"  onClick={handleLogout}>
          로그아웃
        </button>
       </ul>
    </footer>
  );
}
