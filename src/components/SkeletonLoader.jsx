import React from 'react';

export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-800/60 border border-slate-700/40 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-slate-700/80 rounded w-1/3"></div>
        <div className="h-6 bg-slate-700/80 rounded-full w-16"></div>
      </div>
      <div className="h-6 bg-slate-700/60 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-slate-700/40 rounded w-full mb-2"></div>
      <div className="h-4 bg-slate-700/40 rounded w-5/6 mb-6"></div>
      <div className="flex items-center justify-between pt-4 border-t border-slate-700/40">
        <div className="h-4 bg-slate-700/60 rounded w-24"></div>
        <div className="h-8 bg-slate-700/80 rounded-lg w-28"></div>
      </div>
    </div>
  );
};

export const SkeletonTable = ({ rows = 4 }) => {
  return (
    <div className="animate-pulse w-full bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
      <div className="h-12 bg-slate-800/80 border-b border-slate-700/50 w-full mb-2"></div>
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-4 p-4 border-b border-slate-800/60">
          <div className="h-4 bg-slate-700/60 rounded w-24"></div>
          <div className="h-4 bg-slate-700/50 rounded flex-1"></div>
          <div className="h-4 bg-slate-700/60 rounded w-20"></div>
          <div className="h-6 bg-slate-700/80 rounded-full w-24"></div>
        </div>
      ))}
    </div>
  );
};
