"use client";


import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Suspense } from 'react';
import StatusPageContent from './StatusPageContent';



export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StatusPageContent />
    </Suspense>
  );
}
