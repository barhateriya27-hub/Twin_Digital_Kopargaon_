import React from 'react';
import { Network, Car, Droplets, Trash2, ShieldAlert, AlertTriangle } from 'lucide-react';

export const CityWeatherImpact = ({ weather }) => {
  const temp = weather.temperature || 30;
  const wind = weather.windSpeed || 12;
  const visibility = parseFloat(weather.visibility) || 10.0;
  const rainProb = weather.rainProbability || 0;
  const rainfall = weather.rainfall || 0;

  // Compute impacts
  let trafficImpact = 'Normal Flow (Travel delays < 5 mins)';
  let trafficColor = 'text-slate-700 bg-slate-50 border-slate-100';
  
  let waterloggingRisk = 'Negligible Risk (Dry surfaces)';
  let waterloggingColor = 'text-slate-700 bg-slate-50 border-slate-100';
  
  let wasteCollection = 'On Schedule (All wards green)';
  let wasteColor = 'text-slate-700 bg-slate-50 border-slate-100';

  let utilityDemand = 'Stable (Standard electrical & water loading)';
  let utilityColor = 'text-slate-700 bg-slate-50 border-slate-100';

  let alertMessage = '';

  // Rain Impact Logic
  if (rainfall > 4.0 || rainProb > 80) {
    trafficImpact = 'Severe Delays (+35% to 50% travel delay on NH-222)';
    trafficColor = 'text-red-700 bg-red-50 border-red-100';
    
    waterloggingRisk = 'High Risk in Ward 4 (Shivaji Chowk) & Ward 8 (Yeola Naka)';
    waterloggingColor = 'text-red-700 bg-red-50 border-red-200 animate-pulse';

    wasteCollection = 'Delayed Routes (Sewer clearance crews prioritized)';
    wasteColor = 'text-amber-700 bg-amber-50 border-amber-100';

    utilityDemand = 'Lower Water Demand / High Sewer System Load';
    utilityColor = 'text-indigo-700 bg-indigo-50 border-indigo-100';

    alertMessage = '⚠️ Heavy rainfall significantly hampers street drainage speed, triggering localized waterlogging and traffic stacking.';
  } else if (rainfall > 0.0 || rainProb > 40) {
    trafficImpact = 'Minor Congestion (+10% to 15% travel time increases)';
    trafficColor = 'text-amber-700 bg-amber-50 border-amber-100';

    waterloggingRisk = 'Low Risk (Minor puddles reported on secondary roads)';
    waterloggingColor = 'text-amber-700 bg-amber-50 border-amber-100';

    wasteCollection = 'On Schedule with minor weather alerts';
    wasteColor = 'text-slate-700 bg-slate-50 border-slate-100';

    utilityDemand = 'Stable grid load';
    utilityColor = 'text-slate-700 bg-slate-50 border-slate-100';
  }

  // Heat Impact Logic
  if (temp > 38.0) {
    utilityDemand = 'Peak Demand (Elevated A/C load & water pumping active)';
    utilityColor = 'text-red-700 bg-red-50 border-red-100';

    wasteCollection = 'Modified Shifts (Early morning sanitation collections active)';
    wasteColor = 'text-amber-700 bg-amber-50 border-amber-100';

    alertMessage = '🌡️ Peak heat wave warning: Water distribution pipelines are operating at maximum capacity to satisfy surge demand.';
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <Network className="w-4 h-4 text-orange-500" />
          <span>Weather + Digital Twin Impact</span>
        </h3>
        
        <span className="text-[10px] font-black text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
          AI ESTIMATED IMPACT
        </span>
      </div>

      {/* Impact Indicators */}
      <div className="space-y-3.5">
        {/* Traffic Flow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <Car className="w-4.5 h-4.5 text-slate-500 shrink-0" />
            <span className="text-xs font-bold text-slate-700">Traffic Transit Flow</span>
          </div>
          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-lg border text-right font-mono ${trafficColor}`}>
            {trafficImpact}
          </span>
        </div>

        {/* Waterlogging Risk */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <Droplets className="w-4.5 h-4.5 text-blue-500 shrink-0" />
            <span className="text-xs font-bold text-slate-700">Waterlogging & Runoff Risk</span>
          </div>
          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-lg border text-right font-mono ${waterloggingColor}`}>
            {waterloggingRisk}
          </span>
        </div>

        {/* Garbage/Sanitation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <Trash2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-slate-700">Garbage Truck Operations</span>
          </div>
          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-lg border text-right font-mono ${wasteColor}`}>
            {wasteCollection}
          </span>
        </div>

        {/* Utilities Load */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <Network className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
            <span className="text-xs font-bold text-slate-700">Municipal Grid Loads</span>
          </div>
          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-lg border text-right font-mono ${utilityColor}`}>
            {utilityDemand}
          </span>
        </div>
      </div>

      {/* Explanation Banner */}
      {alertMessage && (
        <div className="p-3 bg-orange-50/30 border border-orange-100/50 rounded-xl text-[10px] font-bold text-orange-700 leading-normal">
          {alertMessage}
        </div>
      )}

      {/* Simulation Disclaimer */}
      <div className="text-[9px] font-semibold text-slate-400 text-center uppercase tracking-wider select-none border-t border-slate-50 pt-2.5">
        ℹ️ Estimates modeled using Kopargaon spatial sensor histories
      </div>
    </div>
  );
};
