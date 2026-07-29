import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, CloudSun, Clock, Calendar, MapPin, Sparkles } from 'lucide-react';

export const WelcomeWidget = ({ citizenName = '', wardNumber = 4 }) => {
  const { t } = useTranslation();

  const [timeState, setTimeState] = useState({
    timeStr: '',
    dateStr: '',
    greetingKey: 'greetingMorning',
    defaultGreeting: 'Good Morning'
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();

      let greetingKey = 'greetingMorning';
      let defaultGreeting = 'Good Morning';

      if (hour >= 12 && hour < 17) {
        greetingKey = 'greetingAfternoon';
        defaultGreeting = 'Good Afternoon';
      } else if (hour >= 17 && hour < 22) {
        greetingKey = 'greetingEvening';
        defaultGreeting = 'Good Evening';
      } else if (hour >= 22 || hour < 5) {
        greetingKey = 'greetingNight';
        defaultGreeting = 'Good Night';
      }

      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

      setTimeState({ timeStr, dateStr, greetingKey, defaultGreeting });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getGreetingIcon = () => {
    if (timeState.greetingKey === 'greetingMorning') return <Sun className="w-6 h-6 text-amber-400 animate-spin-slow" />;
    if (timeState.greetingKey === 'greetingAfternoon') return <CloudSun className="w-6 h-6 text-amber-500" />;
    return <Moon className="w-6 h-6 text-indigo-300" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#0A2540] via-[#103459] to-[#0A2540] rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-sky-900/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden"
    >
      <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
      <div className="absolute right-1/3 -top-10 w-40 h-40 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />

      {/* Left Greeting & Citizen Info */}
      <div className="space-y-2 z-10">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            {t('dashboardWidgets.welcomeTitle', 'Kopargaon Smart City Citizen Portal')}
          </span>
          <span className="px-3 py-1 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full text-xs font-semibold flex items-center gap-1">
            <MapPin className="w-3 h-3 text-sky-400" /> Ward {wardNumber}
          </span>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shrink-0">
            {getGreetingIcon()}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              {t('dashboardWidgets.welcomeBack', 'Welcome back')}, <span className="text-emerald-400">{citizenName}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {t('dashboardWidgets.exploreSubtitle', 'Explore live city maps, nearby facilities, traffic telemetry, & municipal advisories.')}
            </p>
          </div>
        </div>
      </div>

      {/* Right Digital Clock & Date Card */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 text-right z-10 w-full sm:w-auto justify-between sm:justify-end shadow-inner">
        <div className="text-left sm:text-right">
          <div className="flex items-center sm:justify-end gap-1.5 text-xs text-sky-200 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{timeState.dateStr}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-wider pt-0.5">
            {timeState.timeStr}
          </div>
        </div>

        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center font-bold shrink-0">
          <Clock className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};
