"use client"
// pages/login.js
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams  } from 'next/navigation';
import Image from 'next/image';
import axios from '../lib/axios';
import Head from 'next/head';
import Link from "next/link";
import domainIcon from '../../assets/domain.svg'
export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const searchParams = useSearchParams();
  const alertShown = useRef(false); // alert가 이미 떴는지 확인하는 변수
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    // 이미 알림이 표시되었으면 함수를 종료
    if (alertShown.current) {
      return;
    }

    if (searchParams.get('expired') === 'true') {
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      alertShown.current = true; // 알림이 표시되었음을 기록
    }
  }, [searchParams]);



  const handleLogin = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    setError(''); // 이전 에러 메시지 초기화
    setIsLoading(true); // 요청 시작 시 로딩 상태를 true로 설정합니다.

    try {
      // 스프링 시큐리티 백엔드 API 주소로 로그인 요청을 보냅니다.
      const response = await axios.post(`api/auth/login`, {
        username,
        password,
      });
      setIsLoading(false);
      // 백엔드에서 받은 JWT 토큰을 localStorage에 저장합니다.
      //localStorage.setItem('token', response.data.token);
      
      // 로그인 성공 후 메인 페이지로 이동
      router.push('/status');
    } catch (err) {
      setIsLoading(false);
      // 로그인 실패 시 에러 메시지 표시
      setError('로그인 실패! 아이디와 비밀번호를 확인해주세요.');
    }
  };

  return (
    <>
      <Head>
        <title>로그인</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Image src={domainIcon} alt="도메인 이미지" width={300} height={200} />
        <form onSubmit={handleLogin} className="flex flex-col items-center justify-center p-8 bg-white rounded shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700">아이디</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-[200px] bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
          <Link href="/register" className="block text-black p-2">
            회원가입
          </Link>        
        </form>
        <br/>
        <a className='text-lg hover:text-xl transition' href={`/듀티로봇 매뉴얼.pdf`} target="_blank">
        매뉴얼 열기
        </a>
      </div>
    </>
  );
}

LoginPage.getLayout = function getLayout(page) {
  return page;
};