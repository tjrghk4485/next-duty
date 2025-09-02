"use client";

import { useState, useEffect, useMemo, useRef, useCallback} from "react";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { AgGridReact } from 'ag-grid-react'; // AG Grid 컴포넌트 임포트
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from "../lib/axios";
import OptimizeDialog from '../lib/OptimizeDialog';


export default function Home() {
  const [gridApis, setGridApis] = useState([]);
  // const allGridApi = useRef([]);
  // const gridApi = useRef([]);
  const columnApi = useRef([]);
  const [open, setOpen] = useState(false);  
  ModuleRegistry.registerModules([AllCommunityModule]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 테이블에 표시할 행(row) 데이터
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([
    { headerName: "name", field: "name" ,width:80,editable: false},
    { headerName: "nurseId", field: "nurseId" ,width:90,hide: true}
  ]);

  const [sideColumnDefs, setSideColumnDefs] = useState([
      { headerName: "type", field: "type" ,width:80,hide: true ,   headerClass: ['ag-center-header','df-header']},
      { headerName: "nurse_id", field: "nurse_id" ,width:90,hide: true}
  ]);
  const [sideRowData, setSideRowData] = useState([]);

  const [rightRowData, setRightRowData] = useState([]);
  const [rightColumnDefs, setRightColumnDefs] = useState([
    { headerName: "name", field: "name" ,width:80,editable: false,hide: true},
    { headerName: "nurse_id", field: "nurse_id" ,width:90,hide: true}, 
    { headerName: "D", field: "D" ,width:40,editable: false, headerClass: "d-header"},
    { headerName: "E", field: "E" ,width:40,editable: false, headerClass: "e-header"},
    { headerName: "N", field: "N" ,width:40,editable: false, headerClass: "n-header"},
    { headerName: "O", field: "O" ,width:40,editable: false, headerClass: "o-header"}
  ]);

  

  const [underRowData, setUnderRowData] = useState([]);
  const [underColumnDefs, setUnderColumnDefs] = useState([
      { headerName: "type", field: "type" ,width:80, cellStyle: (params) => {
          if (params.value === 'D') {
            return { background: 'rgb(91, 177, 73)'};
          } else if (params.value === 'E') {
            return { background: 'rgb(132, 161, 204)'};
          } else if (params.value === 'N') {
            return { background: 'rgba(233, 127, 215, 1)'};
          } else if (params.value === 'O') {
            return { background: 'rgb(138, 136, 134)'};
          } else {borderRight: "1px solid #ccc"};
          return null;
        }}
      
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
      sideSelectRow();
 
      
    }, [yyyymm]);

  useEffect(() => {
      // 여기에 날짜 헤더 생성 및 columnDefs 업데이트 추가!
  const dateHeaders = generateDateHeaders(); // ← 이 시점엔 month가 업데이트되어 있음
  const beforeDateHeaders = sideDateHeaders();
  setColumnDefs(prevDefs => {
    const baseCols = prevDefs.filter(col => !col.isDynamic);
    return [...baseCols, ...dateHeaders];})
    
    setUnderColumnDefs(prevDefs => {
      const baseCols = prevDefs.filter(col => !col.isDynamic);
      return [...baseCols, ...dateHeaders];})  

      setSideColumnDefs(prevDefs => {
        const baseCols = prevDefs.filter(col => !col.isDynamic);
        return [...baseCols, ...beforeDateHeaders];})  

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
        cellStyle: (params) => {
          if (params.value === 'D') {
            return { background: 'rgb(91, 177, 73)'};
          } else if (params.value === 'E') {
            return { background: 'rgb(132, 161, 204)'};
          } else if (params.value === 'N') {
            return { background: 'rgba(233, 127, 215, 1)'};
          } else if (params.value === 'O') {
            return { background: 'rgb(138, 136, 134)'};
          } else {borderRight: "1px solid #ccc"};
          return null;
        }
      });
    }

    return dateHeaders;
  };

  
  const sideDateHeaders = () => {
    const dateHeaders = [];
    const beforeDay = new Date(year, month-1, 0).getDate();
    //console.log('beforeDay=' + beforeDay);
    for (let day = (beforeDay-3); day <= beforeDay; day++) {
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
        cellStyle: (params) => {
          if (params.value === 'D') {
            return { background: 'rgb(91, 177, 73)'};
          } else if (params.value === 'E') {
            return { background: 'rgb(132, 161, 204)'};
          } else if (params.value === 'N') {
            return { background: 'rgba(233, 127, 215, 1)'};
          } else if (params.value === 'O') {
            return { background: 'rgb(138, 136, 134)'};
          } else {borderRight: "1px solid #ccc"};
          return null;
        }
      });
    }

    return dateHeaders;
  };


  const backMonth = () => {
    setMonth(month - 1);
    
  };

  const addMonth = () =>{
    setMonth(month + 1);
  }

  // 컬럼의 기본 속성을 설정
  const defaultColDef = useMemo(() => {
      return {
          sortable: false, // 정렬 기능 활성화
        filter: false,   // 필터 기능 활성화
        resizable: false, // 컬럼 크기 조절 기능 활성화
          
      };
  }, []);


  // const onGridReady = (params) => {
  //   gridApi.current = params.api;
  //   columnApi.current = params.columnApi;
  //   //gridRef.current[gridIndex].api.sizeColumnsToFit();
  //   //selectRow();
  //   //sideSelectRow();
  //     params.api.sizeColumnsToFit();
  // };

  //  const onGridReady = (params, gridIndex) => {
  //   gridApi.current[gridIndex] = params.api;
  //   columnApi.current[gridIndex] = params.columnApi;
  //   params.api.sizeColumnsToFit();
    
  //   //console.log(`그리드 ${gridIndex} 준비 완료`, params.api);
  // };

  const onGridReady = (params, index) => {
    // 기존 배열을 복사하고 새로운 API 추가
    setGridApis(prevApis => {
      const newApis = [...prevApis];
      newApis[index] = params.api;
      return newApis;
    });
  };

  useEffect(() => {
    // 모든 그리드 API가 준비되었는지 확인
    
       gridApis.forEach(api => api.sizeColumnsToFit());
      // if(gridApis){
      //   gridApis[1].sizeColumnsToFit();
      //  gridApis[3].sizeColumnsToFit();
      // }
      
      selectUnderGrid();
      selectRightGrid();
  }, [gridApis, rowData]);


   // 셀 값이 변경되었을 때 호출되는 이벤트
    const onCellValueChanged = (event) => {
     selectUnderGrid();
     selectRightGrid();
    };
  //================================버튼 함수================================//
  const createDuty = async () => {
    
    if(!confirm(month + '월 일정표를 생성하시겠습니까?')) {
      return;
    }

    try {
      const response =  await axios.post(`${API_BASE_URL}/schedule/create`, {
        workDate: yyyymm
        
    });
      //console.log('서버 응답:', response.data.output_msg);
      alert('서버 응답:' + response.data.output_msg);
      if(response.data.output_msg == '저장되었습니다'){
        selectRow();
        sideSelectRow();
    }
    } catch (error) {
      console.error('서버에 데이터 전송 중 오류:', error);
      alert('서버 에러응답:' + response.data.output_msg);
    }
  }


  const deletAllData = async () => {
    
    if(!confirm('일정을 초기화 하시겠습니까?')) {
      return;
    }

    try {
      const response =  await axios.post(`${API_BASE_URL}/schedule/delete`, {
      workDate: yyyymm
      });
      console.log('서버 응답:', response.data.output_msg);
      alert('서버 응답:' + response.data.output_msg);
      if(response.data.output_msg == '저장되었습니다'){
        selectRow();
        sideSelectRow();
    }
    } catch (error) {
      console.error('서버에 데이터 전송 중 오류:', error);
      alert('서버 에러응답:' + response.data.output_msg);
    }
  }


  const sendDataToServer = async () => {
    // gridApi가 초기화되었을 때만 호출
    if (gridApis[1]) {
        // const selectedData =gridApis[1].getSelectedRows();  // 선택된 데이터 가져오기
        // console.log("selectedData =", selectedData);
        const allData = [];
       gridApis[1].forEachNode((node) => {
            allData.push(node.data); // 각 행의 데이터를 배열에 추가
        });
        
        console.log("전체 데이터:", allData);

        const formattedData = allData.flatMap(item => {
          const  parentId = item.parent_id; //  parentId를  workDate로 사용
          const  nurseId = item.nurse_id; // name을  nurseId로 사용
          const newYyyymm = `${yyyymm.substring(0, 4)}-${yyyymm.substring(4, 6)}`;

          return Object.keys(item)
            .filter(key => !isNaN(key)) // 숫자 키(1~31)만 필터링
            .map(key => ({
               workDate: yyyymm,
               parentId: parentId,
               nurseId: nurseId,
               workType: item[key], // 해당 날짜의  workType
               workDay: parseInt(key, 10), // 1~31을  workDay로 사용
               fullWorkDate: newYyyymm+'-'+ String(parseInt(key, 10)).padStart(2, '0')
            }));
        });

        console.log("수정 후 전체 데이터:",formattedData);

        try {
            const response = await axios.post(`${API_BASE_URL}/schedule`, formattedData);
            console.log('서버 응답:', response.data.output_msg);
            alert('서버 응답:' + response.data.output_msg);
            selectRow();
            //sideSelectRow();
        } catch (error) {
            console.error('서버에 데이터 전송 중 오류:', error);
            alert('서버 에러응답:' + response.data.output_msg);
        }
    } else {
        console.log("gridApi가 초기화되지 않았습니다.");
    }
  };



  const onCellKeyDown = (event) => {
    const selectedCell =gridApis[1].getFocusedCell(); 
    const rowNode =gridApis[1].getDisplayedRowAtIndex(selectedCell.rowIndex);
    //console.log("event.event.code=" + event.event.code);
    if(selectedCell.column.colId != "name"){
      if(event.event.code =='KeyD'){
        rowNode.setDataValue(selectedCell.column.getColId(), 'D');
       gridApis[1].tabToNextCell(event);
        console.log("selectedCell" + selectedCell);
      }
      else if(event.event.code =='KeyE'){
        rowNode.setDataValue(selectedCell.column.getColId(), 'E');
       gridApis[1].tabToNextCell(event);
      }
      else if(event.event.code =='KeyO'){
        rowNode.setDataValue(selectedCell.column.getColId(), 'O');
       gridApis[1].tabToNextCell(event);
      }
      else if(event.event.code =='KeyN'){
        rowNode.setDataValue(selectedCell.column.getColId(), 'N');
       gridApis[1].tabToNextCell(event);
      }
  }else{
   gridApis[1].tabToNextCell(event);
  }

    
  };

  const onBtnExport = useCallback(() => {
     gridApis[1].exportDataAsCsv();
    }, []);

  const handleRun = () => {
      setOpen(false);
      alert('최적화 완료!');
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
        
    })
  .catch(error => alert('Error:', error));
  };

  const sideSelectRow = () => {
    axios.get(`${API_BASE_URL}/schedule`,{
        params: {
           workDate: yyyymm-1
        }
    })
    .then(response => {
        setSideRowData(response.data);
        //console.log("response.data" + response.data);
    })
  .catch(error => alert('Error:', error));
    //console.log("gridApi.current[1]=" +gridApis[1]);
  //const allData =gridApis[1].getRenderedNodes().map(node => node.data);

  };

  const selectUnderGrid = () => {

    const allData = [];
    if (gridApis[1]) {
      gridApis[1].forEachNode((node) => {
          allData.push(node.data); // 각 행의 데이터를 배열에 추가
      });
      
      //console.log("변경시받아오는데이터:", allData);
      // rawData (데이터)를 처리하고 변환된 데이터를 그리드에서 사용할 수 있는 형태로 바꿈
    const processedData = processData(allData);
    const rowDataForGrid = transformedData(processedData);
    
    //console.log("rowDataForGrid" + rowDataForGrid);
    setUnderRowData(rowDataForGrid);
    }
    
  };

  const selectRightGrid = () => {

    const allData = [];
    if (gridApis[1]) {
      gridApis[1].forEachNode((node) => {
          allData.push(node.data); // 각 행의 데이터를 배열에 추가
      });
      

      console.log("전체 데이터:", allData);
      //console.log("변경시받아오는데이터:", allData);
      // rawData (데이터)를 처리하고 변환된 데이터를 그리드에서 사용할 수 있는 형태로 바꿈
    const processedData = rightProcessData(allData);
    //const rowDataForGrid = transformedData(processedData);
    
    console.log("processedData" + processedData);
    setRightRowData(processedData);
    }
    
  };

//========================기타함수===================//
    const processData = (rawData) => {
      // 결과를 저장할 객체
      const result = {};
    
      // 각 날짜 (1일 ~ 31일)에 대한 근무 유형 카운트를 처리
      const days = Array.from({ length: 31 }, (_, i) => i + 1);  // 1~31일
    
      days.forEach((day) => {
        result[day] = {
          D: 0,  // D의 개수
          E: 0,  // E의 개수
          N: 0,  // N의 개수
          O: 0,  // O의 개수
        };
      });
    
      // rawData에서 각 간호사의 근무 데이터를 순회하며 카운트
      rawData.forEach((nurse) => {
        // 각 날짜 (1일 ~ 31일)에 대해 값을 확인
        days.forEach((day) => {
          const workType = nurse[day]; // 해당 날짜에 해당하는 근무 유형 (D, E, N, O)
          if (workType) {
            // 해당 날짜에 해당하는 근무 유형 카운트 증가
            result[day][workType]++;
          }
        });
      });
    
      return result;
    };

    // 변환된 데이터를 기반으로 그리드에 표시할 데이터 형태로 변환
    const transformedData = (processedData) => {
      const workTypes = ['D', 'E', 'N', 'O'];
      const rows = workTypes.map((type) => {
        const row = { type };  // 근무유형 (D, E, N, O)
        for (let day = 1; day <= lastDay; day++) {
          row[day] = processedData[day][type];  // 해당 날짜에 대한 근무 유형 카운트
        }
        return row;
      });
    
      return rows;
    };

    const rightProcessData = (rawData) => {
      // 결과를 저장할 배열
  const processedData = [];

  // 각 간호사의 근무 데이터를 순회하며 카운트
  // rawData 배열의 각 요소는 간호사 한 명의 데이터입니다.
  rawData.forEach((nurse) => {
    // 한 명의 간호사에 대한 최종 결과를 담을 객체
    const nurseSummary = {
      name: nurse.name,
      nurse_id: nurse.nurse_id,
      D: 0,
      E: 0,
      N: 0,
      O: 0,
    };

    // 각 날짜(1일~31일)에 대해 근무 유형 카운트
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    days.forEach((day) => {
      const workType = nurse[String(day)]; // 날짜를 문자열 키로 접근
      if (workType) {
        nurseSummary[workType]++;
      }
    });

    // 완성된 간호사 요약 객체를 배열에 추가
    processedData.push(nurseSummary);
  });

  return processedData;
    };

  return (
      <>
        <div className="flex flex-wrap items-center justify-center p-4 m-4  gap-4 rounded-2xl">
         <button className="w-[80px] h-[50px]
          bg-sky-700 text-white rounded-2xl
          border border-cyan-800 shadow-md hover:bg-sky-900" onClick={backMonth}>{month-1}월</button>
            <h1 className="text-2xl font-bold">{month}월 듀티표</h1>
            <button className="w-[80px] h-[50px]
          bg-sky-700 text-white rounded-2xl
          border border-cyan-800 shadow-md hover:bg-sky-900" onClick={addMonth}>{month+1}월</button> 
        </div>
        <div className="relative left-[390px] w-[1500px] flex justify-end  rounded-md gap-1">
          <button  className="w-[80px] h-[50px]
          bg-sky-700 text-white rounded-2xl
          border border-cyan-800 shadow-md hover:bg-sky-900" onClick={createDuty} >
                생성
          </button>
          <button  className="w-[80px] h-[50px]
          bg-sky-700 text-white rounded-2xl
          border border-cyan-800 shadow-md hover:bg-sky-900" onClick={deletAllData} >
            초기화
          </button>
          <button  className="w-[80px] h-[50px]
          bg-sky-700 text-white rounded-2xl
          border border-cyan-800 shadow-md hover:bg-sky-900" onClick={sendDataToServer} >
            저장
          </button>
          <button  className="w-[80px] h-[50px]
          bg-sky-700 text-white rounded-2xl
          border border-cyan-800 shadow-md hover:bg-sky-900"onClick={() => setOpen(true)} >
            최적화
          </button>
          <button  className="w-[80px] h-[50px]
          bg-sky-700 text-white rounded-2xl
          border border-cyan-800 shadow-md hover:bg-sky-900"onClick={onBtnExport} >
          표 다운
          </button>
          <OptimizeDialog open={open} onClose={() => setOpen(false)} onRun={handleRun} yyyymm ={yyyymm} sel1 = {selectRow} sel2 = {sideSelectRow}/>
        </div>
        {/* 게시글 목록 */}
        <div className="w-[2100px] flex flex-col space-y-4  m-4   rounded-2xl">
          <div className="flex flex-row space-y-4  gap-4   rounded-2xl">
          <div className="w-[300px]  m-0 rounded-2xl flex-shrink-0 overflow-hidden p-4">
            <AgGridReact
                    className="ag-theme-alpine"
                    rowData={sideRowData}
                    columnDefs={sideColumnDefs}
                    defaultColDef={defaultColDef}
                    onGridReady = {(params) => onGridReady(params, 0)}
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
                    onGridReady = {(params) => onGridReady(params, 1)}
                    onCellValueChanged = {onCellValueChanged}
                    rowHeight={50}
                    onCellKeyDown={onCellKeyDown} // 키 이벤트 처리
                    domLayout="autoHeight"
                />
          </div>
          <div  className="w-[260px] rounded-xl  flex-grow flex-grow overflow-hidden  p-4">
            <AgGridReact
                    className="ag-theme-alpine"
                    rowData={rightRowData}
                    columnDefs={rightColumnDefs}
                    defaultColDef={defaultColDef}
                    onGridReady = {(params) => onGridReady(params, 2)}
                    rowHeight={50}
                    domLayout="autoHeight"
                />
          </div>
          </div>
        </div>
        
        <div className="w-[2100px] flex flex-row space-y-4 p-4    rounded-2xl gap-4">
          <div className="w-[300px]  flex-shrink-0 flex flex-col">
           {/* <div className="h-[160px] bg-white w-[50px] p-4 flex-shrink-0 rounded-xl mt-auto ml-auto flex flex-col items-center justify-center gap-4 shadow-lg my-5">
            <p className="font-bold text-lg h-[40px] text-green-600">D</p>
            <p className="font-bold text-lg h-[40px] text-blue-600">E</p>
            <p className="font-bold text-lg h-[40px] text-violet-600">N</p>
        </div> */}
          </div>
          <div  className="w-full h-[260px]   rounded-xl flex-grow overflow-hidden  p-4 ">
          <AgGridReact
                    className="ag-theme-alpine"
                    rowData={underRowData}
                    columnDefs={underColumnDefs}
                    defaultColDef={defaultColDef}
                    onGridReady = {(params) => onGridReady(params, 3)}
                    rowHeight={50}
                />
          </div>
          <div  className="w-[210px] rounded-xl flex-grow flex-grow overflow-hidden  p-4"></div>
        </div>
      </>
  );
}
