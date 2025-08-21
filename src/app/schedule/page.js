"use client";

import { useState, useEffect, useMemo} from "react";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { AgGridReact } from 'ag-grid-react'; // AG Grid 컴포넌트 임포트
const mockPosts = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `댓글내용 ${i + 1}`,
  author: `작성자 ${Math.floor(i / 10) + 1}`,
}));

export default function Home() {
  const router = useRouter();
  const postsPerPage = 10; // 한 페이지에 보여줄 게시글 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [currentPosts, setCurrentPosts] = useState([]); // 현재 페이지의 게시글 목록
  const [totalPosts, setTotalPosts] = useState(0); // 총 게시글 수
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query');
  ModuleRegistry.registerModules([AllCommunityModule]);
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
  
  // 테이블에 표시할 행(row) 데이터
    const [rowData] = useState([
        { make: "Ford", model: "Focus", price: 40000 },
        { make: "Toyota", model: "Celica", price: 45000 },
        { make: "BMW", model: "4 Series", price: 50000 },
    ]);

    // 각 컬럼의 속성을 정의하는 배열
    const [columnDefs] = useState(
        Array.from({ length: 30 }, (_, i) => ({
            field: `field${i + 1}`,
            headerName: `${i + 1}`,
        }))
    );

    // 컬럼의 기본 속성을 설정
    const defaultColDef = useMemo(() => {
        return {
            sortable: true, // 정렬 기능 활성화
            filter: false,   // 필터 기능 활성화
            resizable: true, // 컬럼 크기 조절 기능 활성화
            
        };
    }, []);


    const onGridReady = (params) => {
        params.api.sizeColumnsToFit();
    };
  return (
      <>
        <div className="flex flex-wrap items-center justify-center p-4 m-4   rounded-2xl">
         <h1 className="text-xl font-semibold text-gray-900">스케줄표</h1> 
        </div>
        {/* 게시글 목록 */}
        <div className="flex flex-col space-y-4  m-4   rounded-2xl">
          <div className="flex flex-row space-y-4 p-4 gap-4   rounded-2xl">
          <div className="w-[300px]   h-[500px] m-0 rounded-2xl flex-shrink-0 overflow-hidden p-4">
            <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onGridReady = {onGridReady}
                    rowHeight={50}
                />
          </div>
          <div  className="w-full   rounded-xl flex-grow flex-grow overflow-hidden  p-4">
            <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onGridReady = {onGridReady}
                    rowHeight={50}
                />
          </div>
          </div>
        </div>
        
        <div className="flex flex-row space-y-4 p-4 m-4   rounded-2xl gap-4">
          <div className="w-[300px]  flex-shrink-0">
           
          </div>
          <div  className="w-full h-[210px]   rounded-xl flex-grow overflow-hidden  p-4 ">
          <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onGridReady = {onGridReady}
                    rowHeight={50}
                />
          </div>
        </div>
      </>
  );
}
