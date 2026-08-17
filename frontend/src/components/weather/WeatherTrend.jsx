import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { LineChart, Thermometer, CloudRain, Info } from 'lucide-react';

export const WeatherTrend = ({ weather }) => {
  const [activeTab, setActiveTab] = useState('temp'); // 'temp' | 'prob' | 'rain'
  const hourly = weather.hourlyForecast || [];

  // Slice next 12 hours for a clean trend representation
  const chartData = hourly.slice(0, 12).map(h => ({
    time: h.time.replace(':00', ''),
    temperature: h.temp,
    probability: h.rainProb,
    rainfall: parseFloat(h.rainfall.toFixed(1))
  }));

  const renderActiveChart = () => {
    switch (activeTab) {
      case 'temp':
        return (
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#64748B' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'monospace', fontSize: '10px' }}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Area type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTemp)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'prob':
        return (
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#64748B' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'monospace', fontSize: '10px' }}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Area type="monotone" dataKey="probability" name="Probability (%)" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProb)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'rain':
        return (
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#64748B' }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'monospace', fontSize: '10px' }}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Area type="monotone" dataKey="rainfall" name="Rain (mm)" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRain)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <LineChart className="w-4 h-4 text-orange-500" />
          <span>12-Hour Weather Trends</span>
        </h3>

        {/* Tab Controls */}
        <div className="bg-slate-100/80 p-0.5 rounded-xl flex gap-0.5 self-start sm:self-auto text-[10px] font-bold">
          <button
            onClick={() => setActiveTab('temp')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 uppercase ${
              activeTab === 'temp' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temp</span>
          </button>
          <button
            onClick={() => setActiveTab('prob')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 uppercase ${
              activeTab === 'prob' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Precip %</span>
          </button>
          <button
            onClick={() => setActiveTab('rain')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 uppercase ${
              activeTab === 'rain' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Precip mm</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full bg-slate-50/20 p-2 rounded-2xl border border-slate-100/50">
        {renderActiveChart()}
      </div>

      <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase select-none">
        <Info className="w-3 h-3 text-slate-300" />
        <span>Hover nodes to inspect decimal time telemetry</span>
      </div>
    </div>
  );
};
