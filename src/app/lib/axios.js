
import axios from 'axios';

// 쿠키가 자동으로 전송되도록 설정
axios.defaults.withCredentials = true;

// 응답 인터셉터
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      // 세션 만료 → 로그인 페이지로 이동

    // 1. 쿠키 삭제
 const response =  axios.post(`api/auth/logout`, {
        credentials: "include"
    });
      alert("세션이 만료되었습니다.");
      window.location.href = "/login";
      
    }
    return Promise.reject(error);
  }
)
export default axios;