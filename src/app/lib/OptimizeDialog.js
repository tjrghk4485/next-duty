import React, { useState } from 'react';
import axios from 'axios';

export default function OptimizeDialog({ open, onClose, yyyymm, sel1, sel2 }) {
  const [loading, setLoading] = useState(false);
  const [option, setOption] = useState(3);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const handleRun = async () => {
    setLoading(true);
    try {
        
      // 여기에 실제 API 호출
      const res = await axios.post(`api/schedule/auto`, 
        { option: option,
          workDate: yyyymm 
        });
      alert('최적화 완료!');
      console.log("option" + option);
    } catch (err) {
      alert('에러 발생: ' + err.message);
    } finally {
      setLoading(false);
      onClose();
      sel1();
      sel2();
    }
  };

  const handleChange = (e) => {
    setOption(Number(e.target.value));
  };

  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 className='font-bold text-lg'>파트당 근무자 수 를 입력하세요.</h2>
        <input
        type="number"
        value={option}
        onChange={handleChange}
      />
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
