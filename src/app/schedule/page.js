"use client";

import { useState, useEffect, useMemo, useRef} from "react";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { AgGridReact } from 'ag-grid-react'; // AG Grid 컴포넌트 임포트
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from "../lib/axios";


export default function Home() {
  const gridApi = useRef([]);
  const columnApi = useRef([]);
  
  ModuleRegistry.registerModules([AllCommunityModule]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 테이블에 표시할 행(row) 데이터
  const [rowData, setRowData] = useState([]);

   const [columnDefs, setColumnDefs] = useState([
    { headerName: "name", field: "name" ,width:80,editable: false},
    { headerName: "nurse_id", field: "nurse_id" ,width:90,hide: true}
  ]);

  // 날짜 계산
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1); // 실제 달 (1~12)
  const [year, setYear] = useState(now.getFullYear());
  const [lastDay, setLastDay] = useState(0);
  const [yyyymm, setYyyymm] = useState('');

  useEffect(() => {
      
      const newLastDay = new Date(year, month, 0).getDate();
      const monthStr = String(month).padStart(2, '0');
      const newYyyymm = `${year}${monthStr}`;
  
      setLastDay(newLastDay);
      setYyyymm(newYyyymm);
 
      
    }, [month]);

  useEffect(() => {
      selectRow();
      // sideSelectRow();
 
      
    }, [yyyymm]);

  useEffect(() => {
      // 여기에 날짜 헤더 생성 및 columnDefs 업데이트 추가!
  const dateHeaders = generateDateHeaders(); // ← 이 시점엔 month가 업데이트되어 있음
  //const beforeDateHeaders = sideDateHeaders();
  setColumnDefs(prevDefs => {
    const baseCols = prevDefs.filter(col => !col.isDynamic);
    return [...baseCols, ...dateHeaders];})
    
    // setUnderColumnDefs(prevDefs => {
    //   const baseCols = prevDefs.filter(col => !col.isDynamic);
    //   return [...baseCols, ...dateHeaders];})  

    //   setSideColumnDefs(prevDefs => {
    //     const baseCols = prevDefs.filter(col => !col.isDynamic);
    //     return [...baseCols, ...beforeDateHeaders];})  

    }, [lastDay]
  
  );

const generateDateHeaders = () => {
  const dateHeaders = [];

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month - 1, day); // JS는 month가 0부터 시작
    const dayOfWeek = date.getDay(); // 0: 일요일, 6: 토요일

    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const headerClass = isWeekend ? 'weekend-header' : 'df-header';

    dateHeaders.push({
      headerName: day.toString(),
      field: `${day}`,
      editable: false,
      width: 45,
      headerClass, // 요일 기준 동적 설정
      isDynamic: true,
      suppressMovable: true,       // 헤더 위치 이동 막기
      // cellStyle: (params) => {
      //   if (params.value === 'D') {
      //     return { color: 'rgb(91, 177, 73)' ,borderRight: "1px solid #ccc"};
      //   } else if (params.value === 'E') {
      //     return { color: 'rgb(132, 161, 204)',borderRight: "1px solid #ccc" };
      //   } else if (params.value === 'N') {
      //     return { color: 'rgb(149, 64, 199)',borderRight: "1px solid #ccc" };
      //   } else if (params.value === 'O') {
      //     return { color: 'rgb(138, 136, 134)',borderRight: "1px solid #ccc" };
      //   } else {borderRight: "1px solid #ccc"};
      //   return null;
      // }
    });
  }

  return dateHeaders;
};


  // 컬럼의 기본 속성을 설정
  const defaultColDef = useMemo(() => {
      return {
          sortable: false, // 정렬 기능 활성화
        filter: false,   // 필터 기능 활성화
        resizable: false, // 컬럼 크기 조절 기능 활성화
          
      };
  }, []);


  const onGridReady = (params) => {
    gridApi.current = params.api;
    columnApi.current = params.columnApi;
    //gridRef.current[gridIndex].api.sizeColumnsToFit();
    //selectRow();
    //sideSelectRow();
      params.api.sizeColumnsToFit();
  };


  //조회
  const selectRow = () => {
    axios.get(`${API_BASE_URL}/schedule`,{
        params: {
          workDate: String(yyyymm)
        }
    })
    .then(response => {
        setRowData(response.data);
        console.log("조회yyyymm" + yyyymm);
        if(!gridApi.current){
          gridApi.current.sizeColumnsToFit();
        }
        
    })
  .catch(error => alert('Error:', error));
  };


  return (
      <>
        <div className="flex flex-wrap items-center justify-center p-4 m-4   rounded-2xl">
         <h1 className="text-xl font-semibold text-gray-900">스케줄표</h1> 
        </div>
        {/* 게시글 목록 */}
        <div className="w-[2100px] flex flex-col space-y-4  m-4   rounded-2xl">
          <div className="flex flex-row space-y-4 p-4 gap-4   rounded-2xl">
          <div className="w-[300px]  m-0 rounded-2xl flex-shrink-0 overflow-hidden p-4">
            <AgGridReact
                    className="ag-theme-alpine"
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onGridReady = {onGridReady}
                    rowHeight={50}
                    domLayout="autoHeight"
                />
          </div>
          <div  className="w-full rounded-xl flex-grow flex-grow overflow-hidden  p-4">
            <AgGridReact
                    className="ag-theme-alpine"
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onGridReady = {onGridReady}
                    rowHeight={50}
                    domLayout="autoHeight"
                />
          </div>
          <div  className="w-[200px] rounded-xl flex-grow flex-grow overflow-hidden  p-4">
            <AgGridReact
                    className="ag-theme-alpine"
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onGridReady = {onGridReady}
                    rowHeight={50}
                    domLayout="autoHeight"
                />
          </div>
          </div>
        </div>
        
        <div className="w-[2100px] flex flex-row space-y-4 p-4 m-4   rounded-2xl gap-4">
          <div className="w-[300px]  flex-shrink-0 flex flex-col">
           <div className="h-[160px] bg-white w-[50px] p-4 flex-shrink-0 rounded-xl mt-auto ml-auto flex flex-col items-center justify-center gap-4 shadow-lg my-5">
            <p className="font-bold text-lg h-[40px] text-green-600">D</p>
            <p className="font-bold text-lg h-[40px] text-blue-600">E</p>
            <p className="font-bold text-lg h-[40px] text-violet-600">N</p>
        </div>
          </div>
          <div  className="w-full h-[210px]   rounded-xl flex-grow overflow-hidden  p-4 ">
          <AgGridReact
                    className="ag-theme-alpine"
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onGridReady = {onGridReady}
                    rowHeight={50}
                />
          </div>
          <div  className="w-[200px] rounded-xl flex-grow flex-grow overflow-hidden  p-4"></div>
        </div>
      </>
  );
}
