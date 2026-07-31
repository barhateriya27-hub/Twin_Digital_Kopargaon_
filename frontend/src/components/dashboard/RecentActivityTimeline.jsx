import React from 'react';
import { 
  PlusCircle, 
  UserCheck, 
  CheckCircle2, 
  RefreshCw, 
  Receipt, 
  CloudSun, 
  Clock,
  ShieldCheck
} from 'lucide-react';

export const RecentActivityTimeline = () => {
  const activities = [
    {
      id: 1,
      title: '✔ Complaint Submitted',
      time: '10 mins ago',
      category: 'Citizen Grievance (CMP1032)',
      icon: PlusCircle,
      iconColor: 'bg-blue-100 text-blue-800',
      description: 'Water Supply Pipeline Leakage complaint (CMP1032) registered for Ward 4 by Swanandi Kathale.'
    },
    {
      id: 2,
      title: '✔ Officer Assigned',
      time: '30 mins ago',
      category: 'Water Supply Dept',
      icon: UserCheck,
      iconColor: 'bg-amber-100 text-amber-800',
      description: 'Er. Suresh Deshmukh assigned to resolve CMP1032 ticket within 72-Hour SLA.'
    },
    {
      id: 3,
      title: '✔ Complaint Closed',
      time: '2 hours ago',
      category: 'Electrical & Public Lighting',
      icon: CheckCircle2,
      iconColor: 'bg-emerald-100 text-[#138808]',
      description: 'Streetlight Malfunction complaint (CMP1023) resolved and verified by citizen Swanandi Kathale.'
    },
    {
      id: 4,
      title: 'Property Tax Payment Successful',
      time: '4 hours ago',
      category: 'E-Revenue Portal',
      icon: Receipt,
      iconColor: 'bg-emerald-100 text-[#138808]',
      description: 'Assessment #PROP-2026-W4 paid online. Official NIC tax receipt generated.'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2545] flex items-center gap-2">
          Recent Activity Timeline
        </h3>
        <span className="text-xs text-slate-500 font-medium">Real-Time Municipal Dispatch Log</span>
      </div>

      <div className="relative pl-6 space-y-5 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {activities.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="relative group">
              {/* Timeline Bullet Node */}
              <div className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white ${item.iconColor}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-[#0B2545]">{item.title}</span>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">{item.time}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-mono font-bold text-[#0B2545] uppercase">{item.category}</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED LOG
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
