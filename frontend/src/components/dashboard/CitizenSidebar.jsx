import React from 'react';
import {
  LayoutDashboard,
  Map,
  PlusCircle,
  ClipboardList,
  Receipt,
  Droplets,
  Zap,
  CloudSun,
  ShieldAlert,
  Bell,
  Navigation,
  Bot,
  User,
  Settings,
  LogOut,
  X,
  Building2,
  PhoneCall
} from 'lucide-react';
import { GovIndiaEmblem, KopargaonCouncilLogo } from '../gov/GovLogos';

/**
 * Official NIC Government Smart City Command Center Sidebar Component
 */
export const CitizenSidebar = ({
  activeTab = 'dashboard',
  onSelectTab,
  onOpenEmergencyModal,
  onLogout,
  mobileOpen = false,
  onCloseMobile
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'smart_map', label: 'Smart City Map', icon: Map },
    { id: 'register_complaint', label: 'Register Complaint', icon: PlusCircle },
    { id: 'track_complaint', label: 'Track Complaint', icon: ClipboardList },
    { id: 'property_tax', label: 'Property Tax', icon: Receipt },
    { id: 'water_tax', label: 'Water Tax', icon: Droplets },
    { id: 'water_supply', label: 'Water Supply', icon: Droplets },
    { id: 'electricity', label: 'Electricity', icon: Zap },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'emergency', label: 'Emergency', icon: ShieldAlert, isEmergency: true },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'nearby_services', label: 'Nearby Services', icon: Navigation },
    { id: 'ai_assistant', label: 'AI Assistant', icon: Bot },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (item) => {
    if (item.isEmergency) {
      if (onOpenEmergencyModal) {
        onOpenEmergencyModal();
      } else {
        onSelectTab('emergency');
      }
    } else {
      onSelectTab(item.id);
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[990] lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-[260px] bg-white border-r border-slate-200 shadow-md z-[995] flex flex-col transition-transform duration-300 ease-in-out shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header Card in Sidebar */}
        <div className="p-4 border-b border-slate-200 bg-[#0B2545] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <KopargaonCouncilLogo className="w-8 h-8 shrink-0" />
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-white leading-tight">
                  कोपरगाव नगर परिषद
                </h2>
                <p className="text-[10px] font-medium text-slate-300 leading-tight">
                  Kopargaon Municipal Council
                </p>
                <span className="text-[9px] font-mono text-[#FF9933] font-bold block mt-0.5">
                  Smart City Citizen Portal
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg hover:bg-white/10 lg:hidden text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 py-1 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              GOVERNMENT SERVICES
            </span>
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || 
              (item.id === 'register_complaint' && activeTab === 'complaints') ||
              (item.id === 'track_complaint' && activeTab === 'track') ||
              (item.id === 'property_tax' && activeTab === 'tax') ||
              (item.id === 'emergency' && (activeTab === 'emergency' || activeTab === 'emergency_page'));

            // Emergency item styling: ALWAYS RED!
            if (item.isEmergency) {
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 my-1.5 rounded-xl bg-[#B71C1C] hover:bg-[#991B1B] text-white transition-all text-xs font-bold uppercase tracking-wider shadow-sm border border-red-800"
                >
                  <ShieldAlert className="w-4 h-4 text-white shrink-0 animate-pulse" />
                  <span className="truncate">{item.label} (24x7)</span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-r-xl transition-all text-xs font-semibold text-left border-l-4 ${
                  isActive
                    ? 'border-[#0B2545] bg-[#0B2545]/10 text-[#0B2545] font-bold'
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-[#0B2545]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#0B2545]' : 'text-slate-500'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout Action */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-[#B71C1C] transition-all text-xs font-bold"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-slate-500" />
              <span>Logout Citizen</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">NIC SECURE</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default CitizenSidebar;
