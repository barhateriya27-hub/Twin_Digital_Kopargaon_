import React from 'react';
import { AlertTriangle, ShieldCheck, Thermometer, CloudRain, Wind, Eye } from 'lucide-react';

export const WeatherRisk = ({ weather }) => {
  const temp = weather.temperature || 30;
  const wind = weather.windSpeed || 12;
  const visibility = parseFloat(weather.visibility) || 10.0;
  const rainProb = weather.rainProbability || 0;
  const rainfall = weather.rainfall || 0;

  // Calculate Risks
  // 1. Rain Risk
  let rainRisk = 'Low';
  let rainColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (rainfall > 4 || rainProb > 75) {
    rainRisk = 'High';
    rainColor = 'bg-red-50 text-red-700 border-red-200';
  } else if (rainfall > 0 || rainProb > 40) {
    rainRisk = 'Moderate';
    rainColor = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  // 2. Heat Risk
  let heatRisk = 'Low';
  let heatColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (temp > 38) {
    heatRisk = 'High';
    heatColor = 'bg-red-50 text-red-700 border-red-200';
  } else if (temp > 32) {
    heatRisk = 'Moderate';
    heatColor = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  // 3. Wind Risk
  let windRisk = 'Low';
  let windColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (wind > 30) {
    windRisk = 'High';
    windColor = 'bg-red-50 text-red-700 border-red-200';
  } else if (wind > 15) {
    windRisk = 'Moderate';
    windColor = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  // 4. Visibility Risk
  let visRisk = 'Low';
  let visColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (visibility < 2.0) {
    visRisk = 'High';
    visColor = 'bg-red-50 text-red-700 border-red-200';
  } else if (visibility < 6.0) {
    visRisk = 'Moderate';
    visColor = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  // Overall Risk
  let overallRisk = 'Low';
  let overallBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let overallIcon = <ShieldCheck className="w-5 h-5 text-emerald-600" />;

  if (rainRisk === 'High' || heatRisk === 'High' || windRisk === 'High' || visRisk === 'High') {
    overallRisk = 'High';
    overallBadge = 'bg-red-50 text-red-700 border-red-200';
    overallIcon = <AlertTriangle className="w-5 h-5 text-red-600" />;
  } else if (rainRisk === 'Moderate' || heatRisk === 'Moderate' || windRisk === 'Moderate' || visRisk === 'Moderate') {
    overallRisk = 'Moderate';
    overallBadge = 'bg-amber-50 text-amber-700 border-amber-200';
    overallIcon = <AlertTriangle className="w-5 h-5 text-amber-600" />;
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          <span>Weather Risk Assessment</span>
        </h3>
        
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${overallBadge}`}>
          {overallIcon}
          <span>Overall Risk: {overallRisk}</span>
        </div>
      </div>

      {/* Grid of Risk Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        {/* Rain Risk */}
        <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-sky-500" />
            <span className="text-xs font-bold text-slate-600">Rain Risk</span>
          </div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${rainColor}`}>
            {rainRisk}
          </span>
        </div>

        {/* Heat Risk */}
        <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold text-slate-600">Heat Risk</span>
          </div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${heatColor}`}>
            {heatRisk}
          </span>
        </div>

        {/* Wind Risk */}
        <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-600">Wind Risk</span>
          </div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${windColor}`}>
            {windRisk}
          </span>
        </div>

        {/* Visibility Risk */}
        <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-600">Visibility Risk</span>
          </div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${visColor}`}>
            {visRisk}
          </span>
        </div>
      </div>

      {/* Simulation Notice Disclaimer */}
      <div className="text-[9px] font-semibold text-slate-400 text-center uppercase tracking-wider select-none border-t border-slate-50 pt-2.5">
        ⚠️ AI ESTIMATED RISK • NOT AN OFFICIAL METEOROLOGICAL WARNING
      </div>
    </div>
  );
};
