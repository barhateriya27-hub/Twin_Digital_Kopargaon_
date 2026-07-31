import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CloudSun, 
  Bell, 
  User, 
  LogOut, 
  Menu,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { LanguageSelector } from '../LanguageSelector';
import { GovIndiaEmblem, MaharashtraGovLogo, KopargaonCouncilLogo } from './GovLogos';

export const GovHeader = ({
  citizenUser,
  unreadCount = 0,
  onOpenNotifications,
  onOpenProfile,
  onLogout,
  onToggleMobileMenu
}) => {
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

  const userName = citizenUser?.fullName || citizenUser?.name || 'Citizen User';
  const userWard = citizenUser?.ward || 4;

  return (
    <header className="sticky top-0 z-50 bg-[#0B2545] text-white shadow-lg border-b-4 border-[#FF9933]">
      {/* Top Official Banner Bar */}
      <div className="bg-[#07192E] text-slate-300 text-[11px] py-1 px-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#FF9933] font-bold uppercase tracking-wider text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Government Command Portal
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">National Informatics Centre (NIC) Integrated</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-300">
          <span className="hidden sm:inline">Toll-Free Helpline: <strong className="text-white">1800-233-1042</strong></span>
          <span className="bg-[#138808] text-white font-bold px-2 py-0.5 rounded text-[9px]">SLA 24x7 Active</span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        
        {/* LEFT: Government Logos & Mobile Menu */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white lg:hidden transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* 3 Government Logos */}
          <div className="flex items-center gap-2">
            {/* Government of India Logo */}
            <div className="flex items-center gap-1.5 pr-2 border-r border-white/20" title="Government of India">
              <GovIndiaEmblem className="w-7 h-7 sm:w-8 sm:h-8" color="#FF9933" />
              <div className="hidden xl:block text-left leading-tight">
                <span className="text-[9px] font-black uppercase text-slate-300 tracking-wider block">भारत सरकार</span>
                <span className="text-[8px] font-semibold text-slate-400 uppercase block">Govt. of India</span>
              </div>
            </div>

            {/* Maharashtra Government Logo */}
            <div className="flex items-center gap-1.5 px-1 sm:px-2 border-r border-white/20" title="Government of Maharashtra">
              <MaharashtraGovLogo className="w-7 h-7 sm:w-8 sm:h-8" />
              <div className="hidden xl:block text-left leading-tight">
                <span className="text-[9px] font-black uppercase text-slate-300 tracking-wider block">महाराष्ट्र शासन</span>
                <span className="text-[8px] font-semibold text-slate-400 uppercase block">Govt. of Maharashtra</span>
              </div>
            </div>

            {/* Kopargaon Municipal Council Logo */}
            <div className="flex items-center gap-2 pl-1" title="Kopargaon Municipal Council">
              <KopargaonCouncilLogo className="w-7 h-7 sm:w-8 sm:h-8" />
              <div className="hidden sm:block text-left leading-tight">
                <span className="text-[11px] font-black uppercase tracking-wider text-white block">
                  कोपरगाव नगर परिषद
                </span>
                <span className="text-[9px] font-medium text-[#FF9933] block">
                  Kopargaon Municipal Council
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER: Main Title & Subtitle */}
        <div className="text-center hidden lg:block flex-1 px-4">
          <h1 className="text-base sm:text-lg font-black uppercase tracking-wider text-white leading-tight drop-shadow-sm flex items-center justify-center gap-2">
            <span className="text-[#FF9933]">AI DIGITAL TWIN</span> OF KOPARGAON
          </h1>
          <p className="text-[11px] font-semibold text-slate-300 tracking-wide uppercase">
            Citizen Services & Smart City Command Center
          </p>
        </div>

        {/* RIGHT: Date, Time, Weather, Notifications, Language, Profile, Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3 text-xs shrink-0">
          
          {/* Live Date & Time */}
          <div className="hidden xl:flex items-center gap-2 bg-[#07192E] px-3 py-1.5 rounded-lg border border-white/15 shadow-inner">
            <div className="flex items-center gap-1 text-slate-300 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#FF9933]" />
              <span>{formattedDate}</span>
            </div>
            <span className="text-slate-500">|</span>
            <div className="flex items-center gap-1 font-mono font-bold text-[#FF9933]">
              <Clock className="w-3.5 h-3.5 text-[#FF9933]" />
              <span>{formattedTime}</span>
            </div>
          </div>

          {/* Live Weather Badge */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#07192E] px-2.5 py-1.5 rounded-lg border border-white/15 text-slate-200">
            <CloudSun className="w-4 h-4 text-[#FF9933]" />
            <div className="text-left font-mono leading-none">
              <span className="text-xs font-bold text-white block">29°C</span>
              <span className="text-[9px] text-slate-400 block">Kopargaon</span>
            </div>
          </div>

          {/* Language Selector */}
          <div className="hidden sm:block">
            <LanguageSelector variant="topbar" />
          </div>

          {/* Notification Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B71C1C] text-white font-black text-[9px] rounded-full flex items-center justify-center border-2 border-[#0B2545] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Pill */}
          <div
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-all border border-white/15"
            title="Citizen Profile"
          >
            <div className="w-6 h-6 rounded-full bg-[#FF9933] text-[#0B2545] font-black flex items-center justify-center text-xs shadow-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[11px] font-bold text-white leading-tight truncate max-w-[100px]">
                {userName}
              </p>
              <p className="text-[9px] text-[#FF9933] font-mono leading-tight">
                Ward {userWard} Resident
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-300 hidden md:block" />
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-200 transition-colors border border-red-500/30"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
