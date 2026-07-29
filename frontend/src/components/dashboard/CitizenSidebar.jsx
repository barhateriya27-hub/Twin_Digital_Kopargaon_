import React from 'react';
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  Receipt,
  HelpCircle,
  PhoneCall,
  LogOut,
  Map,
  Bell,
  CheckCircle,
  Siren,
  Building2,
  ShieldAlert,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Official NIC / Smart Cities Mission India Style Sidebar Component
 */
export const CitizenSidebar = ({
  activeTab = 'dashboard',
  onSelectTab,
  onOpenEmergencyModal,
  onLogout,
  mobileOpen = false,
  onCloseMobile
}) => {
  const { t } = useTranslation();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & GIS Map', icon: LayoutDashboard },
    { id: 'complaints', label: 'Grievances & Complaints', icon: AlertTriangle },
    { id: 'tax', label: 'Property & Water Tax', icon: Receipt },
    { id: 'permissions', label: 'Building & Permits', icon: FileText },
    { id: 'emergency_page', label: 'Emergency Directory', icon: Siren },
    { id: 'announcements', label: 'Public Notices & SLA', icon: Bell },
    { id: 'faq', label: 'Help Desk & FAQ', icon: HelpCircle }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[990] lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-full w-[260px] bg-white border-r border-[#0B1F3A]/15 shadow-sm z-[995] flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Official Government Header */}
        <div className="p-5 border-b border-[#0B1F3A]/10 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* National Emblem SVG */}
              <div className="w-10 h-10 rounded-lg bg-[#0B1F3A]/5 border border-[#0B1F3A]/15 flex items-center justify-center p-1 shrink-0">
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#0B1F3A]">
                  <path d="M12 2L4 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-8-3zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm-5 11c0-2.5 3.33-4 5-4s5 1.5 5 4H7z"/>
                </svg>
              </div>

              <div>
                <h1 className="text-xs font-black uppercase tracking-wider text-[#0B1F3A] leading-tight">
                  कोपरगाव नगर परिषद
                </h1>
                <p className="text-[11px] font-semibold text-slate-600 leading-tight">
                  Kopargaon Municipal Council
                </p>
                <span className="text-[9px] font-mono text-[#FF9933] font-bold block mt-0.5">
                  Govt. of Maharashtra • Smart City
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg hover:bg-slate-100 lg:hidden text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items List with 20px spacing */}
        <nav className="flex-1 py-5 px-3 space-y-5 overflow-y-auto custom-scrollbar">
          <div className="px-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              CITIZEN SERVICES
            </span>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-r-xl transition-all text-xs font-semibold text-left border-l-4 ${
                    isActive
                      ? 'border-[#0B1F3A] bg-[#0B1F3A]/5 text-[#0B1F3A]'
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-[#0B1F3A]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#0B1F3A]' : 'text-slate-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Emergency SOS Call Button (RED ONLY) */}
          <div className="pt-2 px-1">
            <button
              onClick={onOpenEmergencyModal}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#C62828] hover:bg-[#B71C1C] text-white rounded-xl shadow-md transition-all text-xs font-bold uppercase tracking-wider"
            >
              <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
              <span>EMERGENCY SOS 24x7</span>
            </button>
          </div>
        </nav>

        {/* Bottom NIC Officer / Logout Bar */}
        <div className="p-4 border-t border-[#0B1F3A]/10 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#0B1F3A] text-white font-bold flex items-center justify-center text-xs shrink-0">
                KP
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0B1F3A] truncate">Citizen Portal</p>
                <p className="text-[10px] font-medium text-slate-500 truncate">KMC Ward Resident</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-[#C62828] hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CitizenSidebar;
