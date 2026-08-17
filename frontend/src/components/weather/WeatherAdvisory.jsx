import React from 'react';
import { BrainCircuit, Info } from 'lucide-react';

export const WeatherAdvisory = ({ weather }) => {
  const temp = weather.temperature || 30;
  const wind = weather.windSpeed || 12;
  const visibility = parseFloat(weather.visibility) || 10.0;
  const rainProb = weather.rainProbability || 0;
  const rainfall = weather.rainfall || 0;
  const condition = weather.conditionText || 'Partly Cloudy';

  // Rule-based Advisory Generator (simulates AI advisory response grounded in data)
  let advisoryText = '';
  
  if (rainfall > 3 || (rainProb > 80 && condition.toLowerCase().includes('rain'))) {
    advisoryText = 'Heavy rainfall is likely or occurring today. Keep umbrellas ready and check traffic conditions before traveling. Avoid driving through waterlogged patches near Yeola Naka underpass.';
  } else if (rainProb > 40) {
    advisoryText = 'Scattered showers are projected for today. It is advised to keep an umbrella handy and exercise caution on slick roadways, particularly around Station Road.';
  } else if (temp > 38) {
    advisoryText = 'Extreme heat conditions are active. Ensure adequate hydration, wear loose cotton clothing, and avoid direct exposure to the sun during noon hours.';
  } else if (temp > 33) {
    advisoryText = 'Warm conditions today. Ensure hydration and keep indoor spaces ventilated. Excellent day for dry agricultural activities like grain sorting.';
  } else if (wind > 25) {
    advisoryText = 'Strong wind gusts reported. Secure light objects on rooftops or balconies. Pedestrians should watch for falling branches from mature roadside trees.';
  } else if (visibility < 4.5) {
    advisoryText = 'Haze or mist is reducing visibility. Drivers on bypass roads should slow down and keep low-beam headlights active.';
  } else {
    advisoryText = 'Pleasant weather is expected today in Kopargaon. Perfect conditions for outdoor tasks, local transit, and visiting weekly markets. Maintain standard hydration.';
  }

  return (
    <div className="bg-gradient-to-r from-orange-50/50 to-amber-50/30 rounded-3xl p-5 border border-orange-100 shadow-xs space-y-3">
      <div className="flex items-center gap-2">
        <BrainCircuit className="w-5 h-5 text-orange-500 shrink-0" />
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
          AI Smart Weather Advisory
        </h4>
      </div>

      <p className="text-xs font-bold text-slate-700 leading-relaxed font-sans">
        {advisoryText}
      </p>

      <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase select-none border-t border-orange-100/50 pt-2">
        <Info className="w-3.5 h-3.5" />
        <span>Grounded in live local weather telemetry</span>
      </div>
    </div>
  );
};
