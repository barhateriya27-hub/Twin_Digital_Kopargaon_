import React from 'react';
import { 
  PlusCircle, 
  ClipboardList, 
  Hospital, 
  Shield, 
  PhoneCall, 
  Receipt, 
  Droplets, 
  Map,
  ChevronRight
} from 'lucide-react';

export const QuickActionsGrid = ({ onSelectTab, onOpenEmergency }) => {
  const actions = [
    { id: 'complaints', title: 'Register Complaint', subtitle: 'File 72-Hour SLA Ticket', icon: PlusCircle, bg: 'bg-[#0B2545]', hover: 'hover:bg-[#07192E]', text: 'text-white' },
    { id: 'track', title: 'Track Complaint', subtitle: 'Live Grievance Status', icon: ClipboardList, bg: 'bg-white', hover: 'hover:bg-slate-50', text: 'text-[#0B2545]', border: 'border-slate-300' },
    { id: 'hospital', title: 'Nearest Hospital', subtitle: 'Civil & Emergency Trauma', icon: Hospital, bg: 'bg-emerald-800', hover: 'hover:bg-emerald-900', text: 'text-white' },
    { id: 'police', title: 'Nearest Police', subtitle: 'Station HQ Helpline 100', icon: Shield, bg: 'bg-[#0B2545]', hover: 'hover:bg-[#07192E]', text: 'text-white' },
    { id: 'emergency_sos', title: 'Emergency Call', subtitle: '24x7 Disaster Helpline', icon: PhoneCall, bg: 'bg-[#B71C1C]', hover: 'hover:bg-[#991B1B]', text: 'text-white', isEmergency: true },
    { id: 'tax', title: 'Property Tax', subtitle: 'Assessment & E-Receipts', icon: Receipt, bg: 'bg-white', hover: 'hover:bg-slate-50', text: 'text-[#0B2545]', border: 'border-slate-300' },
    { id: 'water_tax', title: 'Water Bill', subtitle: 'Monthly Connection Tax', icon: Droplets, bg: 'bg-[#0077B6]', hover: 'hover:bg-[#005F92]', text: 'text-white' },
    { id: 'smart_map', title: 'Smart City Map', subtitle: 'GIS Twin Explorer', icon: Map, bg: 'bg-[#0B2545]', hover: 'hover:bg-[#07192E]', text: 'text-white' },
  ];

  const handleActionClick = (action) => {
    if (action.isEmergency) {
      if (onOpenEmergency) onOpenEmergency();
    } else if (action.id === 'hospital' || action.id === 'police') {
      if (onSelectTab) onSelectTab('emergency_page');
    } else {
      if (onSelectTab) onSelectTab(action.id);
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2545] flex items-center gap-2">
          Government Citizen Quick Actions
        </h3>
        <span className="text-xs text-slate-500 font-medium">NIC Direct Dispatch Shortcuts</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.title}
              onClick={() => handleActionClick(action)}
              className={`p-3.5 rounded-xl text-left transition-all shadow-xs flex flex-col justify-between h-28 group border ${action.border || 'border-transparent'} ${action.bg} ${action.hover}`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`p-2 rounded-lg ${action.text === 'text-white' ? 'bg-white/15' : 'bg-[#0B2545]/10'}`}>
                  <Icon className={`w-5 h-5 ${action.text}`} />
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${action.text}`} />
              </div>

              <div>
                <h4 className={`text-xs font-extrabold tracking-tight ${action.text}`}>
                  {action.title}
                </h4>
                <p className={`text-[10px] mt-0.5 font-medium ${action.text === 'text-white' ? 'text-slate-200' : 'text-slate-500'}`}>
                  {action.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
