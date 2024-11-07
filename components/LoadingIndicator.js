import React from 'react';

export default function LoadingIndicator() {
  return (
    <div className="flex justify-center items-center mb-5">
      <div className="bg-indigo-400 text-white text-center flex items-center justify-center rounded-lg px-5 py-1">
        <svg xmlns="(link unavailable)" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="animate-spin size-[50px]" >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
        </svg>
        <span className="text-xl animate-pulse">Loading...</span>
      </div>
    </div>
  );
}