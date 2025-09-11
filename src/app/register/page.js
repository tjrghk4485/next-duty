"use client";

import React from "react";
import { useState} from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
const Register = ({valueChk}) => {
    const router = useRouter();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [user_nm, setuser_nm] = useState('');
    const [idError, setIdError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [isIdCheck, setIsIdCheck] = useState(false); // 중복 검사를 했는지 안했는지
    const [isIdAvailable, setIsIdAvailable] = useState(false); // 아이디 사용 가능한지 아닌지
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const onChangeIdHandler = (e) => {
        const idValue = e.target.value;
        setId(idValue);
        idCheckHandler(idValue);
      }

    const onChangeNikNameHandler = (e) => {
        const user_nm = e.target.value;
        setuser_nm(user_nm);
    }
    
      const onChangePasswordHandler = (e) => {
        const { name, value } = e.target;
        if (name === 'password') {
          setPassword(value);
          passwordCheckHandler(value, confirm);
        } else {
          setConfirm(value);
          passwordCheckHandler(password, value);
        }
      }

      const idCheckHandler = async (id) => {
        console.log("id=" + id);
        const idRegex = /^[a-z\d]{5,10}$/;
        if (id === '') {
          setIdError('아이디를 입력해주세요.');
          setIsIdAvailable(false);
          return false;
        } else if (!idRegex.test(id)) {
          setIdError('아이디는 5~10자의 영소문자, 숫자만 입력 가능합니다.');
          setIsIdAvailable(false);
          return false;
        }
        try {
          const responseData = await axios.get(`api/auth/chk`, {params: {
            "id": id
        }});
          console.log(responseData.data);
          if (!responseData.data) {
            setIdError('사용 가능한 아이디입니다.');
            setIsIdCheck(true);
            setIsIdAvailable(true);
            return true;
          } else {
            setIdError('이미 사용중인 아이디입니다.');
            setIsIdAvailable(false);
            return false;
          }
        } catch (error) {
          alert('서버 오류입니다. 관리자에게 문의하세요.');
          console.error(error);
          return false;
        }
      }

        

      const passwordCheckHandler = (password, confirm) => {
        const passwordRegex = /^[a-z\d!@*&-_]{8,16}$/;
        if (password === '') {
          setPasswordError('비밀번호를 입력해주세요.');
          return false;
        } 
          // else if (!passwordRegex.test(password)) {
          // setPasswordError('비밀번호는 8~16자의 영소문자, 숫자, !@*&-_만 입력 가능합니다.');
          // return false;} 
        else if (confirm !== password) {
          setPasswordError('');
          setConfirmError('비밀번호가 일치하지 않습니다.');
          return false;
        } else {
          setPasswordError('');
          setConfirmError('');
          return true;
        }
      }


      const signupHandler = async (e) => {
        e.preventDefault();
        
        const idCheckresult = await idCheckHandler(id);
        if (idCheckresult) setIdError('');
        else return;
        if (!isIdCheck || !isIdAvailable) {
          alert('아이디 중복 검사를 해주세요.');
          return;
        }
    
        const passwordCheckResult = passwordCheckHandler(password, confirm);
        if (passwordCheckResult) { setPasswordError(''); setConfirmError(''); }
        else return;
        
        const requestData = {
            "id": id,
            "password" : password,
            //"user_nm" : user_nm
        };
        console.log("requestData=" + JSON.stringify(requestData));
        try {
          const responseData = await axios.post(`api/auth/register`, {
            "username": id,
            "password" : password,
            //"user_nm" : user_nm
        });
          if (responseData.status === 201) {
            alert('회원가입 완료.')
            router.push('/status');
          } else {
            alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
          }
        } catch (error) {
          alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
          console.error(error);
        }
      }

        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">                
                <form className="flex flex-col  p-8 bg-white items-center  gap-4 rounded shadow-md w-[500px] h-[800px]  text-2xl">                
                  <h1 className = "text-2xl font-bold mb-6 text-center">회원가입</h1>                                                               
                  <label htmlFor='id'>아이디</label>
                  <input
                  className="border"
                  onChange={onChangeIdHandler}
                  type="text"
                  id='id'
                  name='id'
                  value={id}
                  placeholder='아이디 입력'
                  theme='underLine'
                  maxLength={10}
                  />
                  {idError && <small className={isIdAvailable ? 'idAvailable' : ''}>{idError}</small>}
                  {/* <label htmlFor='id'>닉네임</label>
                  <input
                  className="border"
                  onChange={onChangeNikNameHandler}
                  type="text"
                  id='user_nm'
                  name='user_nm'
                  value={user_nm}
                  placeholder='닉네임 입력'
                  theme='underLine'
                  maxLength={10}
                  /> */}
                
                  <label htmlFor='id'>비밀번호</label>
                  <input onChange={onChangePasswordHandler}
                  className="border"
                  type="password"
                  id='password'
                  name='password'
                  value={password}
                  placeholder='비밀번호 입력'
                  theme='underLine'
                  maxLength={16}></input>
                  {passwordError && <small>{passwordError}</small>}
                  <label htmlFor='id'>비밀번호 확인</label>
                  <input onChange={onChangePasswordHandler}
                  type="password"
                  id='confirm'
                  className="border"
                  name='confirm'
                  value={confirm}
                  placeholder='비밀번호 확인'
                  theme='underLine'
                  maxLength={16}></input>
                  {confirmError && <small>{confirmError}</small>}
                  <br/>
                  <button className="w-[200px] bg-blue-500 text-white py-2 rounded hover:bg-blue-600" onClick={signupHandler}>회원가입</button>                          
                </form>
            </div>
        )
}


export default Register;