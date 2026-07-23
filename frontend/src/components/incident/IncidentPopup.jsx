import React from 'react';

export const IncidentPopup = ({ incident }) => {
  if (!incident) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 sm:right-auto max-w-xs bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-lg text-xs z-20 pointer-events-none">
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono font-bold text-slate-500 text-[10px]">{incident.id}</span>
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
          incident.priority === 'Critical' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
          incident.priority === 'High' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
          'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
        }`}>
          {incident.priority}
        </span>
      </div>
      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-1 line-clamp-1">{incident.title}</h4>
      <div className="flex justify-between items-center text-[11px] text-slate-500">
        <span>{incident.locationName || `Ward ${incident.ward}`}</span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">{incident.status}</span>
      </div>
    </div>
  );
};
