"use client";

import { useState, useEffect, useMemo, useRef} from "react";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { AgGridReact } from 'ag-grid-react'; // AG Grid 컴포넌트 임포트
import axios from "../lib/axios";

export default function Home() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const searchParams = useSearchParams();
  const [rowData, setRowData] = useState([]); // useState로 수정 
  const gridApi = useRef(null);
  const columnApi = useRef(null);
  const keyMap = {
        "삭제": "delete",
        "상태": "status",
        "사용자": "parent_id",
        "간호사번호": "nurse_id",
        "이름": "nurse_nm",
        "리더여부": "part_leader_yn",
        "근무시작일": "start_date",
        "선호근무": "keep_type",
        "사용여부": "use_yn",
      };
  const columns = [
        { headerName: "삭제", width:50, field: "delete",editable: true, cellStyle: { borderRight: "1px solid #ccc"},headerClass: "ag-center-header"},
        { headerName: "상태", width:80, field: "status", editable: false, hide: true, cellStyle: { borderRight: "1px solid #ccc"},headerClass: "ag-center-header"},
        { headerName: "사용자", width:80, field: "parent_id", editable: true , hide: true, cellStyle: { borderRight: "1px solid #ccc"},headerClass: "ag-center-header"},
        { headerName: "간호사번호", width:80, field: "nurse_id", editable: true , hide: true, cellStyle: { borderRight: "1px solid #ccc"},headerClass: "ag-center-header"},
        { headerName: "이름", width:80, field: "nurse_nm", editable: true , cellStyle: { borderRight: "1px solid #ccc"},headerClass: "ag-center-header"},
        { headerName: "근무시작일", width:80, field: "start_date", editable: true , cellStyle: { borderRight: "1px solid #ccc"},headerClass: "ag-center-header"},
        { headerName: "리더여부", width:80, field: "part_leader_yn", editable: true , cellStyle: { borderRight: "1px solid #ccc"},headerClass: "ag-center-header"},
        { headerName: "선호근무", width:80, field: "keep_type",  editable: true, cellStyle: { borderRight: "1px solid #ccc"},headerClass: "ag-center-header",
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
              values: ['D', 'E', 'N','X'],
            }},
        { headerName: "사용여부", width:80, field: "use_yn", editable: true , cellStyle: { borderRight: "1px solid #ccc"},headerClass: "ag-center-header"}
    ];
  ModuleRegistry.registerModules([AllCommunityModule]);
  // 컴포넌트가 마운트되거나 currentPage가 변경될 때마다 실행
  useEffect(() => {
    
    axios.get(`${API_BASE_URL}/nurse/sel`)
      .then(response => {
        const modifiedData = response.data.map(item => ({
        ...item,
        delete: false
      }));
        setRowData(modifiedData);
      })
    .catch(error => alert('Error:', error));
  
   
    setTimeout(() => {
      gridApi.current.sizeColumnsToFit();
    }, 100);
  }, [currentPage]);
  const onGridReady = (params) => {
    gridApi.current = params.api;
    columnApi.current = params.columnApi;
    params.api.sizeColumnsToFit();
    };

  
 

  // 컬럼의 기본 속성을 설정
  const defaultColDef = useMemo(() => {
      return {
          sortable: true, // 정렬 기능 활성화
          filter: false,   // 필터 기능 활성화
          resizable: true, // 컬럼 크기 조절 기능 활성화
          
      };
  }, []);
  //=======================함수================================//
  const addRow = () => {
      getRowData();
      const newItem = {   delete: false,
                          status: 'I',
                          parent_id: localStorage.getItem('userId'),
                          keep_type: 'X',
                          part_leader_yn: false,
                          use_yn: true 
                      };
      setRowData([...rowData, newItem]);
  };

  const selectRow = () => {
    axios.get(`${API_BASE_URL}/nurse/sel`,{
      params: {
        parent_id: localStorage.getItem('userId')
      }
      })
      .then(response => {
        const modifiedData = response.data.map(item => ({
        ...item,
        delete: false
      }));
        setRowData(modifiedData);
      })
    .catch(error => alert('Error:', error));
  
    const allData = gridApi.current.getRenderedNodes().map(node => node.data);
    console.log("테이블데이터 =", allData);
    setTimeout(() => {
      gridApi.current.sizeColumnsToFit();
    }, 100);
  };


  const getRowData = () => {
    const rowData = [];
    gridApi.current.forEachNode((node) => {
      rowData.push(node.data);
    });
    console.log("rowData=" + JSON.stringify(rowData[0])); // 로우 데이터를 콘솔에 출력
    };
  

  const sendDataToServer = async () => {
    let nullChk = 0;
    if(!confirm('저장하시겠습니까?')) {
        return;
    }
    gridApi.current.setFocusedCell(1, 'delete');
    // gridApi가 초기화되었을 때만 호출
    if (gridApi.current) {
        // const selectedData = gridApi.current.getSelectedRows();  // 선택된 데이터 가져오기
        // console.log("selectedData =", selectedData);
        const allData = [];
        gridApi.current.forEachNode((node) => {
            if (node.data.status){
                if (!node.data.start_date && !node.data.nurse_nm) {
                    alert((parseInt(node.id)  + 1) + "번째 줄에 빈칸이 존재합니다.");
                    nullChk = 1;
                    return;
                }
                node.data.parent_id = localStorage.getItem('userId'),
                allData.push(node.data); // 각 행의 데이터를 배열에 추가
            }
            
        });
        if (nullChk == 1) return;
        console.log("전체 데이터:", allData);
        try {
            const response = await axios.post(`${API_BASE_URL}/nurse/mod`, allData);
            console.log('서버 응답:', response.data.output_msg);
            alert('서버 응답:' + response.data.output_msg);
            selectRow();   
            
            } catch (error) {
                console.log('서버에 데이터 전송 중 오류:', error.response);
                if (error.response && error.response.data && error.response.data.message) {
                    // 서버가 예외 메시지를 JSON으로 내려준 경우
                    alert('서버 에러응답: ' + error.response.data.message);
                } else {
                    // 서버가 응답을 아예 안 했거나 알 수 없는 오류
                    alert('서버 요청 중 알 수 없는 오류가 발생했습니다.');
                }
            }
    } else {
        console.log("gridApi가 초기화되지 않았습니다.");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      setExcelData(jsonData);
      const convertedData = jsonData.map(convertKeys);
      console.log('엑셀 파싱 결과:', jsonData);
      console.log('기존로우데이터:', rowData);
      console.log('convertedData:', convertedData);
      
      setRowData([...rowData, ...convertedData]); // AG Grid에 적용
    };

    reader.readAsArrayBuffer(file);
    
  };

  const convertKeys = (row) => {
    const newRow = {};
    for (const [k, v] of Object.entries(row)) {
      newRow[keyMap[k] || k] = v;
    }
    return newRow;
  };

    //=======================그리드이벤트================================//
  const onCellValueChanged = (event) => {
    const { oldValue, newValue, data, colDef, rowIndex } = event;
    console.log(`컬럼: ${colDef.field}, 변경 전 값: ${oldValue}, 변경 후 값: ${newValue}, data.id: ${data.delete}`);

    // 전체 rowData를 한 번에 갱신 (기존 rowData와 변경된 값만 반영)
    setRowData((prevRowData) => {
      return prevRowData.map((row,index) => {
        if (rowIndex === index && row.nurse_id === data.nurse_id) {
          // delete 선택 시 상태 변경
          if (colDef.field === "delete"&& data.status !== 'I') {
              return { ...row, "delete": newValue, "status": newValue ? "D" : "U"};
          } 
          // delete가 아니고 status가 "I"가 아닌 경우
          else if (colDef.field !== "status" && data.status !== 'I') {
              return { ...row, [colDef.field]: newValue, "status": "U" };
          }
        }
        return row; // 나머지 행은 그대로
      });
    });

    setTimeout(() => {
      gridApi.current.sizeColumnsToFit();
    }, 10);
  };

  

  return (
      <>
        <div className="flex flex-wrap items-center justify-center p-4 m-4   rounded-2xl">
         <h1 className="text-xl font-semibold text-gray-900">사용자정보</h1> 
        </div>
        {/* 게시글 목록 */}
        <div className="flex flex-row items-center justify-center space-y-4  m-4 px-16  rounded-2xl">
          <div className="flex flex-row w-[800px] min-h-screen space-y-4   gap-4   rounded-2xl ">
        
          <div  className="  rounded-xl flex-grow flex-grow overflow-hidden  p-4">
            <AgGridReact
                    rowData={rowData}
                    columnDefs={columns}
                    defaultColDef={defaultColDef}
                    onGridReady = {onGridReady}
                    rowHeight={50}
                />
          </div>
          </div>
          <div className="flex flex-row w-[800px] min-h-screen space-y-4  gap-4   rounded-2xl ">
            <div className="flex flex-col gap-2 w-[100px] min-h-screen py-2">
            <button className="w-[80px] h-[50px] bg-sky-700 text-white rounded-2xl border border-cyan-800 shadow-md hover:bg-sky-900" onClick={sendDataToServer}>
                저장
            </button>
            <button className="w-[80px] h-[50px] bg-sky-700 text-white rounded-2xl border border-cyan-800 shadow-md hover:bg-sky-900" onClick={sendDataToServer}>
                행추가
            </button>
            <a href={`${API_BASE_URL}/sample/nurseUpload.xlsx`} download>
              <button  className="w-[80px] h-[50px] bg-sky-700 text-white rounded-2xl border border-cyan-800 shadow-md hover:bg-sky-900" >샘플  엑셀 다운로드</button>
            </a>
            <div className="relative inline-block ">
      {/* 실제 파일 입력 필드 (투명하게 숨김) */}
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        style={{ zIndex: 1 }} // 버튼 위에 위치하도록 z-index 설정
      />
      {/* 사용자가 보게 될 버튼 */}
      <button
        className="
          w-[80px] h-[50px]
          bg-sky-700 text-white rounded-2xl
          border border-cyan-800 shadow-md hover:bg-sky-900
          "
        onClick={(e) => e.preventDefault()} // 폼 제출 방지
      >
        엑셀업로드
      </button>
    </div>
            </div>
          </div>
        </div>
      </>
  );
}
