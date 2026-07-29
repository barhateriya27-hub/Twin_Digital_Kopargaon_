import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Map, 
  CloudSun, 
  Car, 
  Building2, 
  Megaphone, 
  Bot, 
  User, 
  Settings, 
  LogOut, 
  PlusCircle, 
  ClipboardList, 
  PhoneCall 
} from 'lucide-react';
import { LanguageSelector } from '../LanguageSelector';
import { ThemeToggle } from '../ThemeToggle';

export const CitizenSidebar = ({ 
  activeTab, 
  setActiveTab, 
  citizenUser, 
  onLogout, 
  userComplaintsCount = 0 
}) => {
  const { t } = useTranslation();

  const navItems = [
    { id: 'overview', label: t('sidebar.dashboard', 'Dashboard'), icon: Home, color: 'text-sky-500' },
    { id: 'map', label: t('sidebar.smartMap', 'Smart City Map'), icon: Map, color: 'text-emerald-500' },
    { id: 'weather', label: t('sidebar.weather', 'Weather'), icon: CloudSun, color: 'text-amber-500' },
    { id: 'traffic', label: t('sidebar.traffic', 'Live Traffic'), icon: Car, color: 'text-rose-500' },
    { id: 'services', label: t('sidebar.services', 'Public Services'), icon: Building2, color: 'text-indigo-500' },
    { id: 'updates', label: t('sidebar.updates', 'City Updates'), icon: Megaphone, color: 'text-amber-600' },
    { id: 'ai_assistant', label: t('sidebar.aiAssistant', 'AI Assistant'), icon: Bot, color: 'text-purple-500', badge: 'AI' },
    { id: 'report', label: t('sidebar.report', 'Report Complaint'), icon: PlusCircle, color: 'text-orange-500' },
    { id: 'track', label: t('sidebar.track', 'Track Tickets'), icon: ClipboardList, color: 'text-cyan-500', count: userComplaintsCount },
    { id: 'profile', label: t('sidebar.profile', 'Profile'), icon: User, color: 'text-slate-500' },
    { id: 'settings', label: t('sidebar.settings', 'Settings'), icon: Settings, color: 'text-slate-400' }
  ];

  return (
    <aside className="w-[260px] h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 select-none z-20 overflow-y-auto">
      
      {/* Top Section: Logo & Branding */}
      <div>
        {/* Tricolor Ribbon */}
        <div className="h-1 w-full flex shrink-0">
          <div className="h-full w-1/3 bg-[#FF9933]"></div>
          <div className="h-full w-1/3 bg-white dark:bg-slate-800"></div>
          <div className="h-full w-1/3 bg-[#138808]"></div>
        </div>

        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A2540] flex items-center justify-center text-emerald-400 font-extrabold border border-sky-900 shadow-md shrink-0">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 tracking-tight leading-tight uppercase">
                {t('sidebar.title', 'AI Digital Twin of Kopargaon')}
              </h1>
              <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                {t('sidebar.subtitle', 'Citizen Portal')}
              </span>
            </div>
          </div>

          {/* Controls: Language Selector & Theme Toggle */}
          <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
            <LanguageSelector variant="topbar" />
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation Links List */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative group ${
                  isActive
                    ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border-r-4 border-sky-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600 dark:text-sky-400' : item.color}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && item.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Action: Emergency Services Page Button */}
          <div className="pt-2">
            <Link
              to="/citizen/emergency"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all"
            >
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-white" />
                <span>{t('sidebar.emergency', 'Emergency Services')}</span>
              </div>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">24/7</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Bottom Section: Logged-In User Profile Card */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#0A2540] text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
              {(citizenUser?.fullName || citizenUser?.name) ? (citizenUser.fullName || citizenUser.name).charAt(0).toUpperCase() : 'C'}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 truncate leading-tight">
                {citizenUser?.fullName || citizenUser?.name || 'Citizen'}
              </h4>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                {citizenUser?.email || citizenUser?.aadhaar || t('sidebar.residentTag', 'Ward Resident')}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
            title={t('sidebar.logout', 'Logout')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
};
