import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CloudSun, 
  Bell, 
  LogOut, 
  Menu,
  ShieldCheck,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../LanguageSelector';
import { GovIndiaEmblem, MaharashtraGovLogo, KopargaonCouncilLogo } from './GovLogos';

/**
 * Official Municipality Administrative Portal Header
 * Sleek, compact, high-density government officer navbar
 */
export const AdminHeader = ({
  officerUser,
  activeTabTitle = 'Executive Overview',
  unreadCount = 0,
  onOpenNotifications,
  onOpenProfile,
  onLogout,
  onToggleMobileMenu,
  activeGovernanceRole = 'officer',
  setActiveGovernanceRole
}) => {
  const { t } = useTranslation();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = currentDateTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const officerName = officerUser?.name || officerUser?.fullName || 'Municipal Officer';
  const officerRole = activeGovernanceRole === 'higher_authority' 
    ? 'Commissioner View' 
    : (officerUser?.role || 'Municipal Officer');

  return (
    <header className="sticky top-0 z-50 bg-[#0B2545] text-white shadow-md border-b-2 border-[#FF9933] shrink-0">
      {/* Sleek Top Sub-Bar */}
      <div className="bg-[#07192E] text-slate-300 text-[10px] py-0.5 px-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[#FF9933] font-bold uppercase tracking-wider text-[9px]">
            <ShieldCheck className="w-3 h-3" /> Administrative Control Engine
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-300">NIC Integrated Municipal Governance</span>
        </div>
        
        <div className="flex items-center gap-2 font-mono text-[9px] text-slate-300">
          <span className="hidden sm:inline">System: <strong className="text-emerald-400">ONLINE 24x7</strong></span>
          {setActiveGovernanceRole && (
            <div className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded text-[9px]">
              <button
                onClick={() => setActiveGovernanceRole('officer')}
                className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase transition-colors ${
                  activeGovernanceRole === 'officer' 
                    ? 'bg-[#FF9933] text-[#0B2545]' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Officer View
              </button>
              <button
                onClick={() => setActiveGovernanceRole('higher_authority')}
                className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase flex items-center gap-0.5 transition-colors ${
                  activeGovernanceRole === 'higher_authority' 
                    ? 'bg-red-600 text-white' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-2.5 h-2.5" /> Commissioner View
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Compact Navbar Container */}
      <div className="w-full px-3 sm:px-5 py-1.5 flex items-center justify-between gap-3">
        
        {/* LEFT: Government Logos & Mobile Menu */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white lg:hidden transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 pr-2 border-r border-white/20" title="Government of India">
              <GovIndiaEmblem className="w-6 h-6" color="#FF9933" />
            </div>

            <div className="flex items-center gap-1 px-1 border-r border-white/20" title="Government of Maharashtra">
              <MaharashtraGovLogo className="w-6 h-6" />
            </div>

            <div className="flex items-center gap-1.5 pl-1" title="Kopargaon Municipal Council">
              <KopargaonCouncilLogo className="w-6.5 h-6.5" />
              <div className="hidden sm:block text-left leading-none">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-white block">
                  KOPARGAON MUNICIPAL COUNCIL
                </span>
                <span className="text-[8px] font-semibold text-[#FF9933] block">
                  ADMINISTRATIVE CONTROL PANEL
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER: Current Active Page Title */}
        <div className="text-center hidden lg:block flex-1 px-2">
          <h1 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white leading-none flex items-center justify-center gap-1.5">
            <span className="text-[#FF9933]">●</span> {activeTabTitle}
          </h1>
          <p className="text-[9px] font-medium text-slate-300 tracking-wide uppercase mt-0.5">
            Smart City Operations & Command Center
          </p>
        </div>

        {/* RIGHT: Clock, Weather, Language, Notifications, Officer Profile, Logout */}
        <div className="flex items-center gap-2 text-xs shrink-0">
          
          {/* Live Date & Time */}
          <div className="hidden xl:flex items-center gap-1.5 bg-[#07192E] px-2.5 py-1 rounded-lg border border-white/15 text-[11px]">
            <Calendar className="w-3 h-3 text-[#FF9933]" />
            <span className="text-slate-300 font-medium">{formattedDate}</span>
            <span className="text-slate-500">|</span>
            <Clock className="w-3 h-3 text-[#FF9933]" />
            <span className="font-mono font-bold text-[#FF9933]">{formattedTime}</span>
          </div>

          {/* Live Weather */}
          <div className="hidden md:flex items-center gap-1 bg-[#07192E] px-2 py-1 rounded-lg border border-white/15 text-slate-200">
            <CloudSun className="w-3.5 h-3.5 text-[#FF9933]" />
            <span className="text-[11px] font-mono font-bold text-white">29°C</span>
          </div>

          {/* Language Selector */}
          <div className="hidden sm:block">
            <LanguageSelector variant="topbar" />
          </div>

          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#B71C1C] text-white font-black text-[8px] rounded-full flex items-center justify-center border border-[#0B2545]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Officer Profile Pill */}
          <div
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-all border border-white/15"
            title="Officer Settings"
          >
            <div className="w-5 h-5 rounded-full bg-[#FF9933] text-[#0B2545] font-black flex items-center justify-center text-[10px] shadow-xs">
              {officerName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-left leading-none">
              <p className="text-[10px] font-bold text-white truncate max-w-[100px]">
                {officerName}
              </p>
              <p className="text-[8px] text-[#FF9933] font-mono">
                {officerRole}
              </p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-300 hidden md:block" />
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-200 transition-colors border border-red-500/30"
            title="Logout Officer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </header>
  );
};

export default AdminHeader;
