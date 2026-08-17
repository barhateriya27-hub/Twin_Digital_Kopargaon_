import React from 'react';
import {
  Sun,
  CloudSun,
  CloudRain,
  Zap,
  CloudFog,
  Calendar
} from 'lucide-react';

export const WeeklyForecast = ({ forecastData }) => {
  if (!forecastData || forecastData.length === 0) return null;

  const renderMiniIcon = (iconType) => {
    switch (iconType) {
      case 'sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'cloud-sun':
        return <CloudSun className="w-5 h-5 text-sky-400" />;
      case 'rain':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'thunder':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'fog':
        return <CloudFog className="w-5 h-5 text-slate-400" />;
      default:
        return <Sun className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
      <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-50 pb-2.5">
        <Calendar className="w-4 h-4 text-orange-500" />
        <span>7-Day Spatial Forecast</span>
      </h3>

      {/* Grid view for Tablet/Desktop and Scrollable view for Mobile */}
      <div className="flex sm:grid sm:grid-cols-7 gap-3 overflow-x-auto pb-3 sm:pb-0 custom-scrollbar snap-x shrink-0">
        {forecastData.map((day, idx) => (
          <div
            key={idx}
            className="snap-center bg-slate-50/40 hover:bg-slate-50 border border-slate-100/80 rounded-2xl p-3 text-center transition-all duration-300 flex flex-col justify-between items-center min-w-[100px] sm:min-w-0 min-h-[140px] shrink-0"
          >
            <span className="text-xs font-bold text-slate-700 block">{day.day}</span>
            <span className="text-[9px] text-slate-400 block font-mono -mt-0.5 mb-1">
              {day.date.substring(5)}
            </span>

            <div className="my-2 flex items-center justify-center">
              {renderMiniIcon(day.conditionIcon)}
            </div>

            <div className="text-[11px] text-slate-500 font-bold block max-w-full truncate px-1" title={day.condition}>
              {day.condition}
            </div>

            <div className="text-xs font-bold font-mono text-slate-800 flex items-center gap-1 justify-center mt-1">
              <span className="text-orange-500 font-black">{day.tempMax}°</span>
              <span className="text-slate-300">/</span>
              <span className="text-blue-500 font-black">{day.tempMin}°</span>
            </div>

            {day.rainProb > 0 ? (
              <div className="text-[9px] font-bold text-blue-500 mt-1">
                {day.rainProb}% <span className="text-slate-400 font-mono">({day.rainfall.toFixed(1)}mm)</span>
              </div>
            ) : (
              <span className="text-[9px] text-slate-400 mt-1">Dry</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
