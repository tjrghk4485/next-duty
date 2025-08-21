"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
const mockPosts = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `게시글 제목 ${i + 1}`,
  author: `작성자 ${Math.floor(i / 10) + 1}`,
}));

export default function Home() {
  const router = useRouter();
  const postsPerPage = 10; // 한 페이지에 보여줄 게시글 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [currentPosts, setCurrentPosts] = useState([]); // 현재 페이지의 게시글 목록
  const [totalPosts, setTotalPosts] = useState(0); // 총 게시글 수

  // 컴포넌트가 마운트되거나 currentPage가 변경될 때마다 실행
  useEffect(() => {
    // 실제 API 호출 로직 (가상)
    // const fetchPosts = async () => {
    //   const response = await fetch(`/api/posts?page=${currentPage}&limit=${postsPerPage}`);
    //   const data = await response.json();
    //   setCurrentPosts(data.posts);
    //   setTotalPosts(data.total);
    // };
    // fetchPosts();

    // mock data를 사용하여 페이지네이션 구현
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    setCurrentPosts(mockPosts.slice(startIndex, endIndex));
    setTotalPosts(mockPosts.length);
  }, [currentPage]);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  // 페이지 번호 링크를 생성하는 함수
  const renderPaginationLinks = () => {
    const pageLinks = [];
    for (let i = 1; i <= totalPages; i++) {
      pageLinks.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 mx-1 rounded-md transition-colors duration-200 ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageLinks;
  };
  return (
      <>
        <div className="flex flex-wrap items-center justify-between p-4 m-4 bg-blue-400 rounded-2xl">
          <h1>기본게시판</h1>
          <h1>기본게시판</h1>
        </div>
        {/* 게시글 목록 */}
        <div className="space-y-4 p-4 m-4 bg-white rounded-2xl">
          {currentPosts.map((post) => (
              <article key={post.id} className="border-b border-gray-200 py-4 last:border-b-0 cursor-pointer hover:scale-101 transition" 
              onClick={() => {router.push('/post-detail?query=next.js')}}
              >
              <h1 href="/" className="text-xl font-semibold text-gray-900">
                {post.title}
              </h1>
              <p className="mt-1 text-sm text-gray-600 ">작성자: {post.author}</p>
            </article>
          ))}
        </div>

        {/* 페이지네이션 버튼 영역 */}
        <div className="flex justify-center m-8">
          {renderPaginationLinks()}
        </div>
      </>
  );
}
