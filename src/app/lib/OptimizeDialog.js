import React, { useState } from 'react';
import axios from 'axios';

export default function OptimizeDialog({ open, onClose, yyyymm, sel1, sel2 }) {
  const [loading, setLoading] = useState(false);
  const [optionD, setOptionD] = useState(3);
  const [optionE, setOptionE] = useState(3);
  const [optionN, setOptionN] = useState(3);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const handleRun = async () => {
    setLoading(true);
    try {
        
      // 여기에 실제 API 호출
      const res = await axios.post(`api/schedule/auto`, 
        { optionD: optionD,
          optionE: optionE,
          optionN: optionN,
          workDate: yyyymm 
        });
      alert('최적화 완료!');
    } catch (err) {
      alert('에러 발생: ' + err.message);
    } finally {
      setLoading(false);
      onClose();
      sel1();
      sel2();
    }
  };

  const handleChangeD = (e) => {
    setOptionD(Number(e.target.value));
  };

  const handleChangeE = (e) => {
    setOptionE(Number(e.target.value));
  };

  const handleChangeN = (e) => {
    setOptionN(Number(e.target.value));
  };

  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div className='flex flex-col gap-2' style={modalStyle}>
        <h2 className='font-bold text-lg'>파트당 근무자 수 를 입력하세요.</h2>
        <br/>
        <div className='flex gap-2'>
          <p className='text-green-500 text-lg'>D</p>
          <input
          className='border border-gray-300 rounded-3xl text-center'
          type="number"
          value={optionD}
          onChange={handleChangeD}
          />
        </div>
        <div className='flex gap-2'>
          <p className='text-blue-500 text-lg'>E</p>
          <input
          className='border border-gray-300 rounded-3xl text-center'
          type="number"
          value={optionE}
          onChange={handleChangeE}
          />
        </div>
        <div className='flex gap-2'>
          <p className='text-pink-500 text-lg'>D</p>
          <input
          className='border border-gray-300 rounded-3xl text-center'
          type="number"
          value={optionN}
          onChange={handleChangeN}
          />
        </div>
        <br/>
        {/* 로딩 중이면 스피너, 아니면 실행 버튼 */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div className="spinner" />
            <p>처리 중입니다...</p>
          </div>
        ) : (
          <div className='flex gap-1'>
            <button className="w-[60px] h-[30px]
          bg-sky-700 text-white rounded-2xl
          border border-cyan-800 shadow-md hover:bg-sky-900" onClick={handleRun}>실행</button>
            <button className="w-[60px] h-[30px]
          bg-sky-700 text-white rounded-2xl
          border border-cyan-800 shadow-md hover:bg-sky-900" onClick={onClose} >닫기</button>
          </div>
        )}
      </div>
    </div>
  );
}

// CSS 스타일은 그대로
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 1000
};

const modalStyle = {
  background: 'white',
  padding: '2rem',
  borderRadius: '10px',
  minWidth: '400px',
};
