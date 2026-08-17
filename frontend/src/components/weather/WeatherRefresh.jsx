import React from 'react';
import { RefreshCw } from 'lucide-react';

export const WeatherRefresh = ({ 
  refreshStatus, 
  loading, 
  onRefresh 
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${loading ? 'bg-orange-400' : 'bg-emerald-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${loading ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
        </span>

        <p className="text-xs font-bold text-slate-500 font-mono">
          {refreshStatus || (loading ? 'Updating live weather data...' : 'Telemetry system online & synced')}
        </p>
      </div>

      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-1.5 px-4 py-2 bg-[#0B2545] text-white hover:bg-[#1E3A5F] active:scale-95 transition-all text-xs font-bold rounded-xl shadow-sm disabled:opacity-50 shrink-0"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        <span>Refresh Weather</span>
      </button>
    </div>
  );
};
