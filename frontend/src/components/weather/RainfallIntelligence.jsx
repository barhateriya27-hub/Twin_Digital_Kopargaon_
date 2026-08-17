import React from 'react';
import { CloudRain, Compass, Clock, Droplets, Info } from 'lucide-react';

export const RainfallIntelligence = ({ weather }) => {
  const hourly = weather.hourlyForecast || [];
  
  // Compute Rainfall Intelligence parameters
  const currentRainProb = weather.rainProbability || 0;
  const currentRainfall = weather.rainfall || 0;

  // 1. Next Expected Rain hour
  const nextRainHour = hourly.find(h => h.rainProb >= 35 && !h.isCurrent);
  
  // 2. Count duration of rain in hours (consecutive hours with prob >= 35%)
  let rainDuration = 0;
  let maxConsecutive = 0;
  for (let i = 0; i < hourly.length; i++) {
    if (hourly[i].rainProb >= 35) {
      rainDuration++;
      if (rainDuration > maxConsecutive) {
        maxConsecutive = rainDuration;
      }
    } else {
      rainDuration = 0;
    }
  }

  // 3. Determine Rainfall Intensity
  let intensity = 'None';
  let intensityColor = 'text-slate-500 bg-slate-50 border-slate-100';
  const expectedRainAmt = hourly.reduce((sum, h) => sum + h.rainfall, 0);

  if (currentRainfall > 0) {
    if (currentRainfall < 1.0) {
      intensity = 'Light Drizzle';
      intensityColor = 'text-blue-600 bg-blue-50 border-blue-100 animate-pulse';
    } else if (currentRainfall <= 4.0) {
      intensity = 'Moderate Rainfall';
      intensityColor = 'text-indigo-600 bg-indigo-50 border-indigo-100 animate-pulse';
    } else {
      intensity = 'Heavy Downpour';
      intensityColor = 'text-red-600 bg-red-50 border-red-200 animate-bounce';
    }
  } else if (expectedRainAmt > 0) {
    const maxHourRain = Math.max(...hourly.map(h => h.rainfall));
    if (maxHourRain < 1.0) {
      intensity = 'Scattered Showers Expected';
      intensityColor = 'text-sky-600 bg-sky-50 border-sky-100';
    } else if (maxHourRain <= 4.0) {
      intensity = 'Moderate Showers Expected';
      intensityColor = 'text-indigo-600 bg-indigo-50 border-indigo-100';
    } else {
      intensity = 'Heavy Downpours Expected';
      intensityColor = 'text-orange-600 bg-orange-50 border-orange-200';
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
      <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-50 pb-2.5">
        <CloudRain className="w-4 h-4 text-orange-500" />
        <span>Rainfall Intelligence</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left Side: Status display */}
        <div className="flex flex-col justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100/70 text-orange-600 flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Current Rain State</div>
              <div className="text-sm font-black text-slate-800 font-mono mt-0.5">
                {currentRainfall > 0 ? `${currentRainfall.toFixed(1)} mm/hr` : 'No precipitation'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Intensity:</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${intensityColor}`}>
              {intensity}
            </span>
          </div>
        </div>

        {/* Right Side: Timing display */}
        <div className="flex flex-col justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
          {/* Next Rain window */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Next Rain Window</div>
              <div className="text-xs font-bold text-slate-700 mt-0.5">
                {nextRainHour ? (
                  <span>Expected around <span className="text-blue-600 font-extrabold">{nextRainHour.time}</span></span>
                ) : (
                  <span className="text-emerald-600">No rain expected today</span>
                )}
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Estimated Rain Duration:</span>
            <span className="text-xs font-mono font-extrabold text-slate-700">
              {maxConsecutive > 0 ? `${maxConsecutive} hr${maxConsecutive > 1 ? 's' : ''}` : '0 hrs'}
            </span>
          </div>
        </div>
      </div>

      {/* Advisory tooltip */}
      <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-2 text-[10px] font-semibold text-slate-600 leading-normal">
        <Info className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
        <p>
          Expected cumulative rainfall for the next 24 hours is{' '}
          <strong className="font-extrabold font-mono text-slate-700">{expectedRainAmt.toFixed(1)} mm</strong>.{' '}
          {expectedRainAmt > 10 
            ? 'Drainage systems are operating at peak efficiency. Low-lying areas should monitor runoff.' 
            : 'Precipitation is within normal limits. Soil absorption remains optimal.'}
        </p>
      </div>
    </div>
  );
};
