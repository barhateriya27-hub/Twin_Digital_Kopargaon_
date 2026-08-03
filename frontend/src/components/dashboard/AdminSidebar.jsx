import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  ClipboardList,
  Map,
  Building2,
  Droplets,
  Trash2,
  TrafficCone,
  FileCheck,
  Coins,
  Megaphone,
  ShieldAlert,
  LineChart,
  Bot,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Official Municipality Admin Sidebar Component
 * Positioned under top AdminHeader with independent vertical scrolling.
 */
export const AdminSidebar = ({
  activeTab,
  activePath,
  onSelectTab,
  onLogout,
  mobileOpen = false,
  onCloseMobile,
  complaintCount = 0,
  escalatedCount = 0
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = activePath || location.pathname;

  const menuItems = [
    { id: 'dashboard', path: '/municipality/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'overview', path: '/municipality/overview', label: 'Municipal Overview', icon: BarChart3 },
    { id: 'complaints', path: '/municipality/complaints', label: 'Complaints', icon: ClipboardList, badge: complaintCount > 0 ? complaintCount : null },
    { id: 'gis', path: '/municipality/gis', label: 'Smart City GIS', icon: Map },
    { id: 'ward_mgmt', path: '/municipality/wards', label: 'Ward Management', icon: Building2 },
    { id: 'water_supply', path: '/municipality/water', label: 'Water Supply', icon: Droplets },
    { id: 'waste_mgmt', path: '/municipality/waste', label: 'Waste Management', icon: Trash2 },
    { id: 'traffic_roads', path: '/municipality/roads', label: 'Traffic & Roads', icon: TrafficCone },
    { id: 'permissions', path: '/municipality/permissions', label: 'Building & Permissions', icon: FileCheck },
    { id: 'revenue_taxes', path: '/municipality/revenue', label: 'Revenue & Taxes', icon: Coins },
    { id: 'notices', path: '/municipality/notices', label: 'Notices', icon: Megaphone },
    { id: 'emergency_alerts', path: '/municipality/emergency', label: 'Emergency & Alerts', icon: ShieldAlert, badge: escalatedCount > 0 ? `${escalatedCount} Escalated` : null },
    { id: 'reports_analytics', path: '/municipality/reports', label: 'Reports & Analytics', icon: LineChart },
    { id: 'ai_assistant', path: '/municipality/ai-assistant', label: 'AI Assistant', icon: Bot },
    { id: 'settings', path: '/municipality/settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (item) => {
    if (item.id === 'ai_assistant') {
      window.dispatchEvent(new CustomEvent('OPEN_GLOBAL_AI_ASSISTANT'));
    }

    if (onSelectTab) {
      onSelectTab(item.id, item.path);
    } else {
      navigate(item.path);
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
        className={`fixed lg:static top-0 lg:top-auto left-0 h-full w-[260px] bg-white border-r border-slate-200 shadow-md lg:shadow-none z-[995] lg:z-10 flex flex-col transition-transform duration-300 ease-in-out shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header in Drawer */}
        <div className="p-3 border-b border-slate-200 bg-[#0B2545] text-white flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-white">ADMINISTRATIVE MODULES</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Navigation Items (INDEPENDENT SCROLL AREA) */}
        <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 py-1 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              ADMINISTRATIVE MODULES
            </span>
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (activeTab && activeTab === item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-xs font-semibold text-left border-l-4 cursor-pointer ${
                  isActive
                    ? 'border-[#0B2545] bg-[#0B2545]/10 text-[#0B2545] font-bold'
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-[#0B2545]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#0B2545]' : 'text-slate-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                    item.id === 'emergency_alerts' 
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-[#0B2545] text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout Action */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 shrink-0">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-[#B71C1C] transition-all text-xs font-bold cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-slate-500" />
              <span>Logout Officer</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">NIC SECURE</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
