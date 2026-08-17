import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudRain,
  Zap,
  CloudFog,
  Clock
} from 'lucide-react';

export const HourlyForecast = ({ hourlyData }) => {
  if (!hourlyData || hourlyData.length === 0) return null;

  const renderMiniIcon = (iconType) => {
    switch (iconType) {
      case 'sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'moon':
        return <Moon className="w-5 h-5 text-indigo-400" />;
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
        <Clock className="w-4 h-4 text-orange-500" />
        <span>Hourly Forecast (Next 24h)</span>
      </h3>

      <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar snap-x scroll-smooth">
        {hourlyData.map((item, idx) => (
          <div
            key={idx}
            className={`snap-center flex-col items-center justify-between text-center p-3 rounded-2xl border transition-all duration-300 min-w-[85px] flex flex-col justify-between shrink-0 ${
              item.isCurrent
                ? 'bg-orange-50/50 border-orange-200 shadow-xs'
                : 'bg-slate-50/30 border-slate-100 hover:bg-slate-50 hover:border-slate-200'
            }`}
          >
            <span className={`text-[10px] font-bold block ${item.isCurrent ? 'text-orange-600 font-extrabold' : 'text-slate-500'}`}>
              {item.isCurrent ? 'Now' : item.time.replace(':00', '')}
            </span>

            <div className="my-2.5 flex items-center justify-center">
              {renderMiniIcon(item.conditionIcon)}
            </div>

            <div className="text-xs font-bold text-slate-800 font-mono">
              {item.temp}°C
            </div>

            <div className="mt-2 text-[9px] font-semibold flex flex-col items-center">
              {item.rainProb > 0 ? (
                <>
                  <span className="text-blue-500 font-bold">{item.rainProb}%</span>
                  <span className="text-slate-400 font-mono scale-90">{item.rainfall.toFixed(1)}mm</span>
                </>
              ) : (
                <span className="text-slate-400">Dry</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
