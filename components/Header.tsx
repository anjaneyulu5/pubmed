
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 9.879L6.343 6.343m11.314 7.071l-3.536-3.535" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.343 17.657l3.536-3.535m7.071-7.071l3.536 3.535" />
        </svg>
        <h1 className="text-2xl font-bold text-slate-800 ml-3">PubMed Insight Extractor</h1>
      </div>
    </header>
  );
};
