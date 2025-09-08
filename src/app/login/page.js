'use client';

import { Suspense } from 'react';
import LoginPageContent from './LoginPageContent.js'; // 기존 코드가 있는 컴포넌트

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}