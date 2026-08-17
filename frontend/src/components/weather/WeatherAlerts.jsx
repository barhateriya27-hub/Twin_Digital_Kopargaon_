import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const WeatherAlerts = ({ weather }) => {
  const temp = weather.temperature || 30;
  const wind = weather.windSpeed || 12;
  const visibility = parseFloat(weather.visibility) || 10.0;
  const rainProb = weather.rainProbability || 0;
  const rainfall = weather.rainfall || 0;

  const alerts = [];

  if (temp > 40) {
    alerts.push({
      type: 'Extreme Heat Warning',
      desc: `Temperatures have exceeded 40°C (${temp}°C). Outdoor activities should be restricted between 12:00 PM and 4:00 PM.`
    });
  }

  if (rainfall > 5.0 || (rainProb > 85 && weather.conditionText.toLowerCase().includes('rain'))) {
    alerts.push({
      type: 'Heavy Rainfall Warning',
      desc: `Heavy precipitation of ${rainfall > 0 ? `${rainfall} mm/h` : 'expected volume'} detected. Low-lying storm drains may flood.`
    });
  }

  if (wind > 35) {
    alerts.push({
      type: 'High Wind Advisory',
      desc: `Wind speeds have reached ${wind} km/h. Secure scaffolding, loose signs, and watch for falling branches.`
    });
  }

  if (visibility < 1.0) {
    alerts.push({
      type: 'Dense Fog Advisory',
      desc: `Visibility is low at ${visibility} km. Headlights and cautious speed limits are strongly advised on city arterials.`
    });
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">No major weather alerts for Kopargaon</h4>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Conditions are stable and within standard municipal limits.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 border border-red-100 shadow-sm space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-red-50">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
        <h4 className="text-sm font-extrabold text-red-700 uppercase tracking-wide">
          Active Municipal Weather Advisories ({alerts.length})
        </h4>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, idx) => (
          <div key={idx} className="p-3 bg-red-50/50 border border-red-100 rounded-xl space-y-1">
            <h5 className="text-xs font-black text-red-800 uppercase">{alert.type}</h5>
            <p className="text-[11px] font-bold text-red-700 leading-normal">{alert.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
