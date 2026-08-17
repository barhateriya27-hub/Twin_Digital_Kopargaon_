import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Sun,
  Moon,
  CloudSun,
  CloudRain,
  Zap,
  CloudFog,
  Wind,
  Droplets,
  Gauge,
  Eye,
  SunMedium,
  Sunrise,
  Sunset,
  MapPin,
  Clock,
  Compass
} from 'lucide-react';

export const CurrentWeather = ({ weather }) => {
  const { t } = useTranslation();

  const renderAnimatedIcon = (iconType) => {
    const sizeClasses = "w-16 h-16 sm:w-20 sm:h-20 text-orange-500 drop-shadow-[0_4px_6px_rgba(249,115,22,0.2)]";
    switch (iconType) {
      case 'sun':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className={sizeClasses}
          >
            <Sun className="w-full h-full text-amber-500" />
          </motion.div>
        );
      case 'moon':
        return (
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 sm:w-20 sm:h-20 text-indigo-400 drop-shadow-[0_4px_6px_rgba(129,140,248,0.2)]"
          >
            <Moon className="w-full h-full" />
          </motion.div>
        );
      case 'cloud-sun':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 text-sky-400">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-1 -right-1 w-10 h-10 text-amber-500"
            >
              <Sun className="w-full h-full" />
            </motion.div>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 text-sky-400"
            >
              <CloudSun className="w-full h-full" />
            </motion.div>
          </div>
        );
      case 'rain':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 text-blue-500">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <CloudRain className="w-full h-full" />
            </motion.div>
          </div>
        );
      case 'thunder':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 text-indigo-500">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap className="w-full h-full text-amber-500" />
            </motion.div>
          </div>
        );
      case 'fog':
        return (
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-16 h-16 sm:w-20 sm:h-20 text-slate-400"
          >
            <CloudFog className="w-full h-full" />
          </motion.div>
        );
      default:
        return <Sun className="w-16 h-16 sm:w-20 sm:h-20 text-amber-500" />;
    }
  };

  const isSimulated = weather.source?.includes('Simulation') || weather.source?.includes('Offline');

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
              <span>Kopargaon, Maharashtra, India</span>
            </h2>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              isSimulated 
                ? 'bg-amber-50 text-amber-600 border-amber-200 animate-pulse' 
                : 'bg-emerald-50 text-emerald-600 border-emerald-200'
            }`}>
              {isSimulated ? 'OFFLINE SIMULATION' : 'LIVE METEOROLOGY'}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Live Weather • Updated {weather.updatedAt}
          </p>
        </div>
        
        <div className="text-xs font-semibold text-slate-500 flex items-center gap-1 font-mono">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Source: {weather.source}</span>
        </div>
      </div>

      {/* Temp Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
        <div className="text-center sm:text-left">
          <div className="flex items-baseline justify-center sm:justify-start gap-2">
            <span className="text-5xl font-extrabold text-slate-800 tracking-tight font-mono">
              {weather.temperature}°C
            </span>
            <span className="text-sm font-medium text-slate-500">
              (Feels like <span className="font-bold font-mono text-orange-500">{weather.feelsLike}°C</span>)
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-700 mt-1.5 flex items-center justify-center sm:justify-start gap-2">
            <span className="px-2.5 py-0.5 rounded-lg text-xs bg-orange-50 text-orange-600 border border-orange-100">
              {weather.conditionText}
            </span>
          </h3>
        </div>

        {/* Animated Weather Condition Icon */}
        <div className="shrink-0">
          {renderAnimatedIcon(weather.conditionIcon)}
        </div>
      </div>

      {/* Grid of Weather Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Humidity */}
        <div className="bg-slate-50/40 border border-slate-100 p-3.5 rounded-2xl flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase mb-1">
            <span>{t('dashboardWidgets.humidity', 'Humidity')}</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-800">
            {weather.humidity}%
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-slate-50/40 border border-slate-100 p-3.5 rounded-2xl flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase mb-1">
            <span>{t('dashboardWidgets.wind', 'Wind')}</span>
            <Wind className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-800">
            {weather.windSpeed} <span className="text-xs font-semibold text-slate-400">km/h</span>
          </div>
        </div>

        {/* Wind Direction */}
        <div className="bg-slate-50/40 border border-slate-100 p-3.5 rounded-2xl flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase mb-1">
            <span>Direction</span>
            <Compass className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-800">
            {weather.windDirection || 'N'}
          </div>
        </div>

        {/* Rain Probability */}
        <div className="bg-slate-50/40 border border-slate-100 p-3.5 rounded-2xl flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase mb-1">
            <span>{t('dashboardWidgets.rainProb', 'Rain Prob.')}</span>
            <CloudRain className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-800">
            {weather.rainProbability}%
          </div>
        </div>

        {/* Pressure */}
        <div className="bg-slate-50/40 border border-slate-100 p-3.5 rounded-2xl flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase mb-1">
            <span>Pressure</span>
            <Gauge className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-800">
            {weather.pressure} <span className="text-xs font-semibold text-slate-400">hPa</span>
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-slate-50/40 border border-slate-100 p-3.5 rounded-2xl flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase mb-1">
            <span>Visibility</span>
            <Eye className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-800">
            {weather.visibility} <span className="text-xs font-semibold text-slate-400">km</span>
          </div>
        </div>

        {/* UV Index */}
        <div className="bg-slate-50/40 border border-slate-100 p-3.5 rounded-2xl flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase mb-1">
            <span>UV Index</span>
            <SunMedium className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-800">
            {weather.uvIndex}
          </div>
        </div>

        {/* Sunrise / Sunset */}
        <div className="bg-slate-50/40 border border-slate-100 p-3.5 rounded-2xl flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase mb-1">
            <span>Sun Hours</span>
            <Sunrise className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-[10px] sm:text-xs font-bold font-mono text-slate-700 space-y-0.5">
            <div className="flex justify-between">🌅 <span>{weather.sunrise}</span></div>
            <div className="flex justify-between">🌇 <span>{weather.sunset}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
