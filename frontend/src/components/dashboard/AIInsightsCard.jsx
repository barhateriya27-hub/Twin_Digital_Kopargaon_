import React from 'react';
import { Sparkles, BrainCircuit, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AIInsightsCard = ({ onActionClick }) => {
  const insights = [
    {
      id: 1,
      title: 'Garbage Surge Detected in Ward 8',
      category: 'Sanitation Analytics',
      description: 'Ward 8 has logged the highest volume of overflow complaints (+28%) over the past 48 hours.',
      recommendation: 'Deploy Sanitation Van #4 & enable IoT bin level sensors for auto-dispatch.',
      tag: 'High Priority',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    {
      id: 2,
      title: 'Monsoon Rainfall Advisory',
      category: 'Weather AI Telemetry',
      description: 'Heavy rainfall forecasted in Ahmednagar district within 6 hours. High runoff expected into Godavari basin.',
      recommendation: 'Pre-clear storm drains along Station Road & alert low-lying ward residents.',
      tag: 'Weather Alert',
      tagColor: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      id: 3,
      title: 'Traffic Congestion near Bus Stand',
      category: 'Smart Mobility',
      description: 'Vehicle density spike detected at MSRTC Central Depot junction during evening peak hours.',
      recommendation: 'Signal timing adjusted +15s. Traffic warden unit dispatched to junction.',
      tag: 'Optimized',
      tagColor: 'bg-emerald-100 text-[#138808] border-emerald-300'
    },
    {
      id: 4,
      title: 'Water Pressure Dip in Ward 5',
      category: 'Hydro Grid Telemetry',
      description: 'Pumping station sensor node #7 reporting 14% pressure drop along Sai Nagar main line.',
      recommendation: 'Activate auxiliary booster pump #2 to maintain 4.2 bar distribution head.',
      tag: 'Action Taken',
      tagColor: 'bg-cyan-100 text-cyan-800 border-cyan-300'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#0B2545] text-[#FF9933]">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2545] flex items-center gap-2">
              AI Digital Twin Telemetry Insights
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#FF9933]/20 text-[#D97706] border border-[#FF9933]/40">
                GEMINI AI ACTIVE
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Automated spatial predictive modeling & municipal recommendation engine
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-[#0B2545]/30 transition-all space-y-2.5 relative group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-extrabold uppercase text-[#0B2545]">
                {item.category}
              </span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${item.tagColor}`}>
                {item.tag}
              </span>
            </div>

            <h4 className="font-extrabold text-xs text-[#0B2545] leading-tight">
              {item.title}
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed">
              {item.description}
            </p>

            <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
              <span className="font-extrabold text-[#138808] flex items-center gap-1 text-[10px] uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" /> Recommended Municipal Action:
              </span>
              <p className="text-[11px] text-slate-700 font-semibold">
                {item.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
